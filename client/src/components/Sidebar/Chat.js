import React from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
}));

const Chat = ({ conversation, setActiveChat, readConvo, user }) => {
  const classes = useStyles();
  const { otherUser } = conversation;

  const sendReadConvo = async (conversation) => {
    try {
      const reqBody = {
        conversationId: conversation.id,
        senderId: user.id
      };
      await readConvo(reqBody);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = async (conversation) => {
    if (conversation.notificationCount > 0) {
      await sendReadConvo(conversation);
      conversation.notificationCount = 0;
    }
    await setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  );
};

export default Chat;
