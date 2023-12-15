import { Badge, Box, Button, List, ListItem, ListItemText, Popover, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../state/store'
import { FOR, FOR_SUPER_LIKE, SUPER_LIKE_BASE, minPriceSuperlike } from '../../../constants'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { formatDate } from '../../../utils/time'
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { extractSigValue, getPaymentInfo, isTimestampWithinRange } from '../../../pages/VideoContent/VideoContent'
import { useNavigate } from 'react-router-dom'
import localForage from "localforage";
import moment from 'moment'

const generalLocal = localForage.createInstance({
    name: "q-tube-general",
  });
function extractIdValue(metadescription) {
    // Function to extract the substring within double asterisks
    function extractSubstring(str) {
        const match = str.match(/\*\*(.*?)\*\*/);
        return match ? match[1] : null;
    }
  
    // Function to extract the 'sig' value
    function extractSig(str) {
        const regex = /id:(.*?)(;|$)/;
        const match = str.match(regex);
        return match ? match[1] : null;
    }
  
    // Extracting the relevant substring
    const relevantSubstring = extractSubstring(metadescription);
  
    if (relevantSubstring) {
        // Extracting the 'sig' value
        return extractSig(relevantSubstring);
    } else {
        return null;
    }
  }

export const Notifications = () => {
    const dispatch = useDispatch()
    const [anchorElNotification, setAnchorElNotification] = useState<HTMLButtonElement | null>(null)
    const [notifications, setNotifications] = useState<any[]>([])
    const [notificationTimestamp, setNotificationTimestamp] = useState<null | number>(null)

    
    const username = useSelector((state: RootState) => state.auth?.user?.name);
    const usernameAddress = useSelector((state: RootState) => state.auth?.user?.address);
    const navigate = useNavigate();

    const interval = useRef<any>(null)

    const getInitialTimestamp = async ()=> {
        const timestamp: undefined | number = await generalLocal.getItem("notification-timestamp");
        if(timestamp){
            setNotificationTimestamp(timestamp)
        }
    }

    useEffect(()=> {
        getInitialTimestamp()
    }, [])
    

    const openNotificationPopover = (event: any) => {
        const target = event.currentTarget as unknown as HTMLButtonElement | null
        setAnchorElNotification(target)
      }
      const closeNotificationPopover = () => {
        setAnchorElNotification(null)
      }
      const fullNotifications = useMemo(() => {
        return [...notifications].sort(
          (a, b) => b.created - a.created
        )
      }, [notifications])
      const notificationBadgeLength = useMemo(()=> {
        if(!notificationTimestamp) return fullNotifications.length
        return fullNotifications?.filter((item)=> item.created > notificationTimestamp).length
    }, [fullNotifications, notificationTimestamp])

      const checkNotifications = useCallback(async (username: string) => {
        try {
        //   let notificationComments: Item[] =
        //     (await notification.getItem('comments')) || []
        //   notificationComments = notificationComments
        //     .filter((nc) => nc.postId && nc.postName && nc.lastSeen)
        //     .sort((a, b) => b.lastSeen - a.lastSeen)

        const timestamp = await generalLocal.getItem("notification-timestamp");
        
        const after = timestamp || moment().subtract(5, 'days').valueOf();

        const url = `/arbitrary/resources/search?mode=ALL&service=BLOG_COMMENT&identifier=${SUPER_LIKE_BASE}&limit=20&includemetadata=true&reverse=true&excludeblocked=true&offset=0&description=${FOR}:${username}_${FOR_SUPER_LIKE}&after=${after}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const responseDataSearch = await response.json();
          let notifys = []
          for (const comment of responseDataSearch) {
            if (comment.identifier && comment.name && comment?.metadata?.description) {
              
      
                try {
                  const result = extractSigValue(comment?.metadata?.description)
              if(!result) continue
                 const res = await getPaymentInfo(result);
                 if(+res?.amount >= minPriceSuperlike && res.recipient === usernameAddress && isTimestampWithinRange(res?.timestamp, comment.created)){
                  
                    let urlReference = null
                    try {
                        let idForUrl = extractIdValue(comment?.metadata?.description)
                        const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&identifier=${idForUrl}&limit=1&includemetadata=false&reverse=false&excludeblocked=true&offset=0&name=${username}`;
                        const response2 = await fetch(url, {
                            method: "GET",
                            headers: {
                              "Content-Type": "application/json",
                            },
                          });
                          const responseSearch = await response2.json();
                          if(responseSearch.length > 0){
                            urlReference = responseSearch[0]
                          }

                    } catch (error) {
                        
                    }
                //   const url = `/arbitrary/BLOG_COMMENT/${comment.name}/${comment.identifier}`;
                //   const response = await fetch(url, {
                //     method: "GET",
                //     headers: {
                //       "Content-Type": "application/json",
                //     },
                //   });
                //   if(!response.ok) continue
                //   const responseData2 = await response.text();

                  notifys = [...notifys, {
                     ...comment,
                     amount: res.amount,
                     urlReference: urlReference || null
                   }];
   
                 }
   
                } catch (error) {
                 
                }
   
               
  
         
            }
          }
          setNotifications((prev) => {
            const allNotifications = [...notifys, ...prev];
            const uniqueNotifications = Array.from(new Map(allNotifications.map(notif => [notif.identifier, notif])).values());
            return uniqueNotifications.slice(0, 20);
        });
        
        } catch (error) {
          console.log({ error })
        }
      }, [])

      const checkNotificationsFunc = useCallback(
        (username: string) => {
          let isCalling = false
          interval.current = setInterval(async () => {
            if (isCalling) return
            isCalling = true
            const res = await checkNotifications(username)
            isCalling = false
          }, 60000)
          checkNotifications(username)
        },
        [checkNotifications])

        useEffect(() => {
            if (!username) return
            checkNotificationsFunc(username)
        
          
        
            return () => {
              if (interval?.current) {
                clearInterval(interval.current)
              }
            }
          }, [checkNotificationsFunc, username])

          const openPopover = Boolean(anchorElNotification)
  return (
    <Box
    sx={{
      display: 'flex',
      alignItems: 'center'
    }}
  >

    <Badge
      badgeContent={notificationBadgeLength}
      color="primary"
      sx={{
        margin: '0px 12px'
      }}
    >
      <Button
        onClick={(e) => {
          openNotificationPopover(e)
          generalLocal.setItem("notification-timestamp", Date.now());
          setNotificationTimestamp(Date.now)
        }}
        sx={{
          margin: '0px',
          padding: '0px',
          height: 'auto',
          width: 'auto',
          minWidth: 'unset'
        }}
      >
        <NotificationsIcon color="action" />
      </Button>
    </Badge>
    <Popover
      id={'simple-popover-notification'}
      open={openPopover}
      anchorEl={anchorElNotification}
      onClose={closeNotificationPopover}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <Box>
        <List
          sx={{
            maxHeight: '300px',
            overflow: 'auto'
          }}
        >
            {fullNotifications.length === 0 && (
                <ListItem
               
              >
                <ListItemText
                  primary="No new notifications">

                  </ListItemText>
                  </ListItem>
            )}
          {fullNotifications.map((notification: any, index: number) => (
            <ListItem
              key={index}
              divider
              sx={{
                cursor: notification?.urlReference ? 'pointer' : 'default'
              }}
              onClick={async () => {
                if(notification?.urlReference){
                    navigate(`/video/${notification?.urlReference?.name}/${notification?.urlReference?.identifier}`);
                }
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Typography
                      component="span"
                      variant="body1"
                      color="textPrimary"
                    >
                        Super Like
                      
                    </Typography>
                    <ThumbUpIcon
          style={{
            color: "gold",
           
        
          }}
        />
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '16px'
                      }}
                      color="textSecondary"
                    >
                      {formatDate(notification.created)}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '16px'
                      }}
                      color="textSecondary"
                    >
                      {` from ${notification.name}`}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Popover>
  </Box>
  )
}
