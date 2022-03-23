from django.db import models

from . import utils
from .user import User


class Participant(utils.CustomModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column="userId", related_name="+"
    )
    lastReadMessageId = models.IntegerField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)