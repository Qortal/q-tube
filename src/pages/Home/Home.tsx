import React from 'react'
import { VideoList } from './VideoList'

import { useSelector } from 'react-redux'
import { RootState } from '../../state/store'

export const Home = () => {

  return (
    <>
    <VideoList />
    </>
   
  )
}
