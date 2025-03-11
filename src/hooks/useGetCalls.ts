import { useAuth } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useEffect, useState } from 'react'

const useGetCalls = () => {

  const client = useStreamVideoClient()
  const [isLoading, setLoading] = useState(false)
  const [calls, setCalls] = useState<Call[]>([])

  if(!client) return { isLoading }
  const { userId } = useAuth()

  useEffect(() => {
    const getCalls = async () => {
      setLoading(true)
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
  }, [])

  return { calls, isLoading }
}

export default useGetCalls