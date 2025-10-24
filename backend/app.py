# app.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt  # PyJWT
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import sessionmaker, Session, relationship, declarative_base
from contextlib import contextmanager

# -------------------------
# Configuration
# -------------------------
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# -------------------------
# Database setup
# -------------------------
SQLALCHEMY_DATABASE_URL = "sqlite:///./voting_system.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -------------------------
# Models
# -------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    votes = relationship("Vote", back_populates="voter")


class Election(Base):
    __tablename__ = "elections"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidates = relationship("Candidate", back_populates="election", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="election", cascade="all, delete-orphan")


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    election = relationship("Election", back_populates="candidates")
    votes = relationship("Vote", back_populates="candidate", cascade="all, delete-orphan")


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    voted_at = Column(DateTime, default=datetime.utcnow)

    voter = relationship("User", back_populates="votes")
    election = relationship("Election", back_populates="votes")
    candidate = relationship("Candidate", back_populates="votes")

    __table_args__ = (UniqueConstraint('user_id', 'election_id', name='_user_election_uc'),)


# Create tables
Base.metadata.create_all(bind=engine)

# -------------------------
# Pydantic schemas
# -------------------------
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    is_admin: bool


class ElectionCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    is_active: Optional[bool] = False


class ElectionResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True


class CandidateCreate(BaseModel):
    election_id: int
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None


class CandidateResponse(BaseModel):
    id: int
    election_id: int
    name: str
    description: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True


class VoteCreate(BaseModel):
    election_id: int
    candidate_id: int


class VoteResult(BaseModel):
    candidate_id: int
    candidate_name: str
    vote_count: int


class ElectionResults(BaseModel):
    election_id: int
    election_title: str
    total_votes: int
    results: List[VoteResult]

# -------------------------
# FastAPI app
# -------------------------
app = FastAPI(title="Voting System API", version="1.0.0")
security = HTTPBearer()

# -------------------------
# CORS Middleware (fixes 405 on OPTIONS)
# -------------------------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add your frontend origin(s) here
    # "https://your-production-domain.com",
    "*",  # Use with caution in production; restrict origins in prod
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # ensures OPTIONS and all methods allowed
    allow_headers=["*"],   # allows custom headers like Authorization
)

# -------------------------
# Database dependency
# -------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# Helper functions
# -------------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = decode_token(token)
    user_sub = payload.get("sub")
    if user_sub is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    try:
        user_id = int(user_sub)
    except (TypeError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


# -------------------------
# API Endpoints
# -------------------------
@app.post("/api/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if username exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")

    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        is_admin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.id)}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_admin": new_user.is_admin
    }


@app.post("/api/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # Validate input
    if not login_data.username and not login_data.email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or email required")

    # Find user
    if login_data.username:
        user = db.query(User).filter(User.username == login_data.username).first()
    else:
        user = db.query(User).filter(User.email == login_data.email).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_admin": user.is_admin
    }


@app.post("/api/admin/election", response_model=ElectionResponse, status_code=status.HTTP_201_CREATED)
def create_election(election_data: ElectionCreate, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    new_election = Election(
        title=election_data.title,
        description=election_data.description,
        is_active=bool(election_data.is_active)
    )
    db.add(new_election)
    db.commit()
    db.refresh(new_election)

    return new_election


@app.post("/api/admin/candidate", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
def add_candidate(candidate_data: CandidateCreate, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    # Check if election exists
    election = db.query(Election).filter(Election.id == candidate_data.election_id).first()
    if not election:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Election not found")

    new_candidate = Candidate(
        election_id=candidate_data.election_id,
        name=candidate_data.name,
        description=candidate_data.description
    )
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    return new_candidate


@app.post("/api/admin/start/{election_id}", response_model=ElectionResponse)
def start_election(election_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Election not found")

    # Check if election has candidates
    candidates_count = db.query(Candidate).filter(Candidate.election_id == election_id).count()
    if candidates_count == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot start election without candidates")

    election.is_active = True
    db.commit()
    db.refresh(election)

    return election


@app.get("/api/admin/results/{election_id}", response_model=ElectionResults)
def get_election_results(election_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Election not found")

    # Get all candidates for this election
    candidates = db.query(Candidate).filter(Candidate.election_id == election_id).all()

    results = []
    total_votes = 0

    for candidate in candidates:
        vote_count = db.query(Vote).filter(
            Vote.election_id == election_id,
            Vote.candidate_id == candidate.id
        ).count()

        results.append(VoteResult(
            candidate_id=candidate.id,
            candidate_name=candidate.name,
            vote_count=vote_count
        ))
        total_votes += vote_count

    return ElectionResults(
        election_id=election.id,
        election_title=election.title,
        total_votes=total_votes,
        results=results
    )


@app.post("/api/vote", status_code=status.HTTP_201_CREATED)
def cast_vote(vote_data: VoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if user is admin
    if current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins cannot vote")

    # Check if election exists and is active
    election = db.query(Election).filter(Election.id == vote_data.election_id).first()
    if not election:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Election not found")
    if not election.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Election is not active")

    # Check if candidate exists and belongs to the election
    candidate = db.query(Candidate).filter(
        Candidate.id == vote_data.candidate_id,
        Candidate.election_id == vote_data.election_id
    ).first()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found in this election")

    # Check if user has already voted in this election
    existing_vote = db.query(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.election_id == vote_data.election_id
    ).first()
    if existing_vote:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already voted in this election")

    # Create new vote
    new_vote = Vote(
        user_id=current_user.id,
        election_id=vote_data.election_id,
        candidate_id=vote_data.candidate_id
    )
    db.add(new_vote)
    db.commit()
    db.refresh(new_vote)

    return {"message": "Vote cast successfully"}


@app.get("/api/elections", response_model=List[ElectionResponse])
def list_active_elections(db: Session = Depends(get_db)):
    elections = db.query(Election).filter(Election.is_active == True).all()
    return elections


@app.get("/api/elections/{election_id}/candidates", response_model=List[CandidateResponse])
def list_candidates(election_id: int, db: Session = Depends(get_db)):
    # Check if election exists
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Election not found")

    candidates = db.query(Candidate).filter(Candidate.election_id == election_id).all()
    return candidates


# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Voting System API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
