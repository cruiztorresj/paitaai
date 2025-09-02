from typing import List
from pydantic import BaseModel, Field

class Song(BaseModel):
    """Information about a song."""
    name: str = Field(description="song's name.")
    singer: str = Field(description="person's author")

class Songs(BaseModel):
    """Information to extract."""
    recommendations: List[Song] = Field(description="List of songs")