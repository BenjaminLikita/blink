
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { api } from '@/trpc/server'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const wh = new Webhook(SIGNING_SECRET)

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const payload = await req.json() as Payload
  const body = JSON.stringify(payload)

  let _evt: WebhookEvent

  try {
    _evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  const { email_addresses, first_name, last_name, profile_image_url, id } = payload.data
  await api.user.create({
    email: email_addresses[0]!.email_address,
    firstName: first_name,
    lastName: last_name,
    profileImage: profile_image_url,
    id
  })

  return new Response('User created', { status: 200 })
}

interface Payload {
  data: {
    email_addresses: {
      email_address: string
    }[]
    first_name: string
    last_name: string
    profile_image_url?: string
    id: string
  }
}