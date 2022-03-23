from django.db import models
from django.db.models import Q

from . import utils
from .participant import Participant


class Conversation(utils.CustomModel):
    users = models.ManyToManyField(Participant)
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)
