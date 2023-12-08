import React, {  useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {  useSelector } from 'react-redux'
import { RootState } from '../../state/store'
import {
  Avatar,
  Box,
  Button,
  Typography,
  useTheme
} from '@mui/material'
import { useFetchVideos } from '../../hooks/useFetchVideos'
import LazyLoad from '../../components/common/LazyLoad'
import { BottomParent, NameContainer, VideoCard, VideoCardName, VideoCardTitle, VideoContainer, VideoUploadDate } from './VideoList-styles'
import ResponsiveImage from '../../components/ResponsiveImage'
import { formatDate, formatTimestampSeconds } from '../../utils/time'
import { ChannelCard, ChannelTitle } from './Home-styles'

interface VideoListProps {
  mode?: string
}
export const Channels = ({ mode }: VideoListProps) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const publishNames = useSelector((state: RootState)=> state.global.publishNames)
  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  )
  



  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '50vh'
    }}>
    <VideoContainer>
   {publishNames && publishNames?.slice(0, 10).map((name)=> {
     let avatarUrl = ''
     if(userAvatarHash[name]){
       avatarUrl = userAvatarHash[name]
     }
    return (
      <Box
      sx={{
        display: 'flex',
        flex: 0,
        alignItems: 'center',
        width: 'auto',
        position: 'relative',
        ' @media (max-width: 450px)': {
          width: '100%'
        }
      }}
      key={name}
    >
      <ChannelCard
                  onClick={() => {
                    navigate(`/channel/${name}`)
                  }}
                 >
                    <ChannelTitle>{name}</ChannelTitle>
                  <ResponsiveImage src={avatarUrl} width={50} height={50}/>
                 </ChannelCard>
    </Box>
    )
   })}
    </VideoContainer>
    </Box>
  )
}


