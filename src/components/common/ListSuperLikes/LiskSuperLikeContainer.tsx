import { Box,  Typography } from '@mui/material'
import React from 'react'
import ListSuperLikes from './ListSuperLikes'
import { useSelector } from 'react-redux'
import { RootState } from '../../../state/store'

export const LiskSuperLikeContainer = () => {
const superlikelist = useSelector((state: RootState) => state.global.superlikelistAll);

  return (
   <Box>
        <Typography sx={{
            fontSize: '18px',
            color: 'gold'
        }}>Recent Super likes</Typography>
    <ListSuperLikes superlikes={superlikelist} />
   </Box>
  )
}
