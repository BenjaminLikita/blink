import React from 'react'
import Meeting from './meeting-page'

const MeetingPage = ({ params }:{ params: Promise<{ id: string }> }) => {
  return (
    <Meeting params={params} />
  )
}

export default MeetingPage