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

const Chat = ({ conversation, setActiveChat, readConvo }) => {
  const classes = useStyles();
  const { otherUser } = conversation;

  const sendReadConvo = async (conversation) => {
    const reqBody = {
      conversationId: conversation.id,
      messageId: conversation.messages[conversation.messages.length - 1].id,
    };
    await readConvo(reqBody);
  };

  const handleClick = async (conversation) => {
    if (conversation.notificationCount > 0 && conversation.messages.length > 0)
    {
      conversation.notificationCount = 0;
      await sendReadConvo(conversation);
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
