import React from 'react'
import { CardContentContainerComment } from '../common/Comments/Comments-styles'
import { CrowdfundSubTitle, CrowdfundSubTitleRow } from '../UploadVideo/Upload-styles'
import { Box, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const Playlists = ({playlistData, currentVideoIdentifier}) => {
    const theme = useTheme();
    const navigate = useNavigate()


  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
      
        maxWidth: '400px',
        width: '100%'
    }}>
      <CrowdfundSubTitleRow >
        <CrowdfundSubTitle>Playlist</CrowdfundSubTitle>
      </CrowdfundSubTitleRow>
      <CardContentContainerComment sx={{
          marginTop: '25px',
          height: '450px',
          overflow: 'auto'
      }}>
        {playlistData?.videos?.map((vid, index)=> {
            const isCurrentVidPlayling = vid?.identifier === currentVideoIdentifier;
            
       
           
            return (
                <Box key={vid?.identifier} sx={{
                    display: 'flex',
                    gap: '10px',
                    width: '100%',
                    background: isCurrentVidPlayling && theme.palette.primary.main,
                    alignItems: 'center',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: isCurrentVidPlayling ? 'default' : 'pointer',
                    userSelect: 'none'
                }}
                onClick={()=> {
                    if(isCurrentVidPlayling) return

                    navigate(`/video/${vid.name}/${vid.identifier}`)
                }}
                >
                    <Typography sx={{
                        fontSize: '14px'
                    }}>{index + 1}</Typography>
                    <Typography sx={{
                        fontSize: '18px',
                        wordBreak: 'break-word'
                    }}>{vid?.metadata?.title}</Typography>
                    
                    </Box>
            )
        })}
    </CardContentContainerComment>
    </Box>
   
  )
}
