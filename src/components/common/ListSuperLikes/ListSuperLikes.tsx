import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { useNavigate } from "react-router-dom";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
const truncateMessage = (message) => {
  return message.length > 40 ? message.slice(0, 40) + "..." : message;
};

export default function ListSuperLikes({ superlikes }) {
  const hashMapSuperlikes = useSelector(
    (state: RootState) => state.video.hashMapSuperlikes
  );

  const navigate = useNavigate();
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {superlikes?.map((superlike, index) => {
        //  let hasHash = false
        let message = "";
        let url = "";
        let forName = ""
        //  let hash = {}
        if (hashMapSuperlikes[superlike?.identifier]) {
          
          message = hashMapSuperlikes[superlike?.identifier]?.comment || "";
          if (
            hashMapSuperlikes[superlike?.identifier]?.notificationInformation
          ) {
            
            const info =
              hashMapSuperlikes[superlike?.identifier]?.notificationInformation;
              forName = info?.name
            url = `/video/${info?.name}/${info?.identifier}`;
          }

          //  hasHash = true
          //  hash = hashMapSuperlikes[superlike?.identifier]
        }
        let amount = null;
        if (!isNaN(parseFloat(superlike?.amount))) {
          amount = parseFloat(superlike?.amount).toFixed(2);
        }
        return (
          <>
            <ListItem
              key={superlike?.identifier}
              alignItems="flex-start"
              sx={{
                cursor: url ? "pointer" : "default",
                minHeight: '130px'
              }}
              onClick={async () => {
                if (url) {
                  navigate(url);
                }
              }}
            >
              <Box sx={{
                    width: '100%'
              }}>
              <ListItem
              sx={{
                padding: '0px',
              }}
              alignItems="flex-start"
             
            >
              
              <ListItemAvatar>
                <Avatar
                  alt="Remy Sharp"
                  src={`/arbitrary/THUMBNAIL/${superlike?.name}/qortal_avatar`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "16px",
                    }}
                  >
                    <ThumbUpIcon
                      style={{
                        color: "gold",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "18px",
                      }}
                    >
                      {amount ? amount : ""} QORT
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{
                    fontSize: '15px'
                  }}>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {superlike?.name}
                    </Typography>
                    
                    {` - ${truncateMessage(message)}`}
                  </Box>
                }
              />
              </ListItem>
              {forName && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '17px',
                  gap: '10px',
                  justifyContent: 'flex-end'
                }}>
                  <EmojiEventsIcon />
                  {forName}
                </Box>
              )}
              
            </Box>
            </ListItem>
            <Box
              sx={{
                width: "100%",
              }}
            >
              {superlikes.length === index + 1 ? null : <Divider />}
            </Box>
          </>
        );
      })}
    </List>
  );
}
