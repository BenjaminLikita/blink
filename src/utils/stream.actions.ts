'use server'

import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

export const tokenProvider = async () => {
  if(!apiKey) throw new Error('API key is required')
  if(!apiSecret) throw new Error('API secret is required')
    
  const client = new StreamClient(apiKey, apiSecret)
  const exp = Math.round(new Date().getTime() / 1000) + 3600
  const issued = Math.round(new Date().getTime() / 1000) - 60

  const token = client.generateUserToken({ user_id: 'my_userId', exp, iat: issued })
  return token
}