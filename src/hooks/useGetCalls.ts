import { useAuth } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useEffect, useState } from 'react'

const useGetCalls = () => {

  const client = useStreamVideoClient()
  const [isLoading, setLoading] = useState(false)
  const [calls, setCalls] = useState<Call[]>([])

  const { userId } = useAuth()
  
  useEffect(() => {
    const getCalls = async () => {
      setLoading(true)
      if(!client) return
      const { calls } = await client.queryCalls({ 
        filter_conditions: {
          $or: [
            { created_by_user_id: userId },
            { members: { $in: [userId] } }
          ]
        }
      })
      setCalls(calls)
      setLoading(false)
    }
    getCalls()
  }, [client, userId])

  if(!client) return { calls: [], isLoading }

  return { calls, isLoading }
}

export default useGetCalls