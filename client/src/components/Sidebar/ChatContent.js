import React from "react";
import { Badge, Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: -0.17,
  },
  notification: {
    marginTop: 20,
  },
}));

const ChatContent = ({ conversation }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  return (
    <Box className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Typography className={classes.username}>
            {otherUser.username}
          </Typography>
          <Typography 
            className={conversation.notificationCount > 0 ? 
                classes.unreadText 
                : classes.previewText}>
            {latestMessageText}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Badge className={classes.notification} 
            badgeContent={conversation.notificationCount} color="primary" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatContent;
