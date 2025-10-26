from pydantic import BaseModel
from typing import List, Optional

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

class SearchQuery(BaseModel):
    query: str

class FilterQuery(BaseModel):
    view: Optional[str] = "All Polls"
    time_period: Optional[str] = "All Time"
    sort_by: Optional[str] = "Newest First"
