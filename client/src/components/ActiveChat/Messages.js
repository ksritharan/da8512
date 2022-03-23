import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');
        const showAvatar = message.id === otherUser.lastSeenMessageId;

        return message.senderId === userId ? (
          <SenderBubble 
            key={message.id} 
            text={message.text} 
            time={time}
            otherUser={otherUser}
            showAvatar={showAvatar} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
