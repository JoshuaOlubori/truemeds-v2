import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { clerkClient } from "@clerk/nextjs/server"
import { env } from '@/data/env/server'
import { createUser } from '@/app/server/db/userActions'



const ADMIN_EMAIL = env.ADMIN_EMAIL
export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req)
    const eventType = evt.type

    console.log('Received webhook event:', eventType)
    console.log('\nReceived webhook event data:', evt.data)

    if (eventType === 'user.created') {
      const { id: userId, email_addresses } = evt.data
      const primaryEmail = email_addresses?.[0]?.email_address

      // if (!primaryEmail) {
      //   console.error('No email address found for user')
      //   return new Response('No email address found', { status: 400 })
      // }

      // Set user's role in Clerk metadata
      const client = await clerkClient()
      await client.users.updateUser(userId, {
        publicMetadata: {
          role: primaryEmail === ADMIN_EMAIL ? 'super_admin' : 'user'
        }
      })

      await createUser({
        clerkUserId: evt.data.id,
        email: primaryEmail,
        name: evt.data.first_name,
        role: primaryEmail === ADMIN_EMAIL ? 'super_admin' : 'user',

      })

      return new Response('User metadata updated and user saved to db', { status: 201 })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response('Error processing webhook', { status: 400 })
  }
}