from django.contrib.auth.middleware import get_user
from django.db.models import Max, Q
from django.db.models.query import Prefetch
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message
from online_users import online_users
from rest_framework.views import APIView
from rest_framework.request import Request


class Conversations(APIView):
    """get all conversations for a user, include latest message text for preview, and all messages
    include other user model so we have info on username/profile pic (don't include current user info)
    TODO: for scalability, implement lazy loading"""

    def get(self, request: Request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)
            user_id = user.id

            conversations = (
                Conversation.objects.filter(Q(user1=user_id) | Q(user2=user_id))
                .prefetch_related(
                    Prefetch(
                        "messages", queryset=Message.objects.order_by("createdAt")
                    )
                )
                .all()
            )

            conversations_response = []

            for convo in conversations:
                convo_dict = {
                    "id": convo.id,
                    "messages": [
                        message.to_dict(["id", "text", "senderId", "createdAt"])
                        for message in convo.messages.all()
                    ],
                }

                # set properties for notification count and latest message preview
                convo_dict["latestMessageText"] = convo_dict["messages"][-1]["text"]
                
                if convo.user1 and convo.user1.id == user_id:
                    convo_dict["notificationCount"] = sum((convo.user1LastMessageRead is None 
                                                                or convo.user1LastMessageRead.id < message["id"])
                                                            and message["senderId"] != user_id
                                                                    for message in convo_dict["messages"])
                elif convo.user2 and convo.user2.id == user_id:
                    convo_dict["notificationCount"] = sum((convo.user2LastMessageRead is None 
                                                                or convo.user2LastMessageRead.id < message["id"])
                                                            and message["senderId"] != user_id
                                                                    for message in convo_dict["messages"])

                # set a property "otherUser" so that frontend will have easier access
                user_fields = ["id", "username", "photoUrl"]
                if convo.user1 and convo.user1.id != user_id:
                    convo_dict["otherUser"] = convo.user1.to_dict(user_fields)
                    convo_dict["otherUser"]["lastMessageReadId"] = convo.user1LastMessageRead.id if convo.user1LastMessageRead else None
                elif convo.user2 and convo.user2.id != user_id:
                    convo_dict["otherUser"] = convo.user2.to_dict(user_fields)
                    convo_dict["otherUser"]["lastMessageReadId"] = convo.user2LastMessageRead.id if convo.user2LastMessageRead else None

                # set property for online status of the other user
                if convo_dict["otherUser"]["id"] in online_users:
                    convo_dict["otherUser"]["online"] = True
                else:
                    convo_dict["otherUser"]["online"] = False

                conversations_response.append(convo_dict)
            conversations_response.sort(
                key=lambda convo: convo["messages"][-1]["createdAt"],
                reverse=True,
            )
            return JsonResponse(
                conversations_response,
                safe=False,
            )
        except Exception as e:
            return HttpResponse(status=500)

    def patch(self, request: Request):
        try:
            user = get_user(request)
            if user.is_anonymous:
                return HttpResponse(status=401)
            user_id = user.id
            body = request.data
            conversation_id = body.get("conversationId")
            message_id = body.get("messageId")
            
            conversation = Conversation.objects.filter(id=conversation_id).first()
            message = Message.objects.filter(id=message_id).first()
            
            if conversation.user1.id == user_id:
                conversation.user1LastMessageRead = message
            elif conversation.user2.id == user_id:
                conversation.user2LastMessageRead = message
            conversation.save()
            
            return HttpResponse(status=204)
        except Exception as e:
            return HttpResponse(status=500)

