from pydantic import BaseModel
from typing import List

class PollCreate(BaseModel):
    title: str
    options: List[str]

class Vote(BaseModel):
    poll_id: int
    option_index: int

class Like(BaseModel):
    poll_id: int

class Comment(BaseModel):
    poll_id: int
    text: str

class CommentLike(BaseModel):
    comment_id: int

class Poll(BaseModel):
    id: int
    title: str
    options: List[str]
    votes: List[int]
    likes: int
