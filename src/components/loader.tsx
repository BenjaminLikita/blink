import React from 'react'
import { ClipLoader } from 'react-spinners'

type ILoader = {
  color?: string
  size?: number
}
const Loader = (props: ILoader) => {
  return (
    <ClipLoader {...props} />
  )
}

export default Loader