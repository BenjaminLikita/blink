import { useAuth } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useEffect, useState } from 'react'
import { unstable_cache as cache } from 'next/cache'

const useGetCalls = () => {
  const client = useStreamVideoClient()

  const getCachedCalls = cache(
    async () => {
      if(!client) return
      const { calls } = await client.queryCalls({ 
        filter_conditions: {
          $or: [
            { created_by_user_id: userId },
            { members: { $in: [userId] } }
          ]
        }
      })
      return calls
      
    },
    ["calls-list"],
    { 
      revalidate: 60,
      tags: ["calls-list"]
    }
  )

  
  const [isLoading, setLoading] = useState(false)
  const [calls, setCalls] = useState<Call[]>([])

  const { userId } = useAuth()
  
  useEffect(() => {

    const getCalls = async () => {
      setLoading(true)
      const calls = await getCachedCalls()
      setCalls(calls || [])
      setLoading(false)
    }
    getCalls()
    
  }, [getCachedCalls])

  if(!client) return { calls: [], isLoading }

  return { calls, isLoading }
}

export default useGetCalls