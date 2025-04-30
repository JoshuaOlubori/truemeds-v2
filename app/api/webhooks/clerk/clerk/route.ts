import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { createUser, updateUser } from "@/server/db/user"
import { eq } from "drizzle-orm"
import { UsersTable } from "@/drizzle/schema"
import type { NextRequest } from "next/server"

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req as NextRequest)
    const eventType = evt.type

    switch (eventType) {
      case "user.created": {
        const { email_addresses } = evt.data
        const email = email_addresses[0]?.email_address

        await createUser({
          clerkUserId: evt.data.id,
          email: email,
        })
        break
      }

      case "user.updated": {
        const { email_addresses } = evt.data
        const email = email_addresses[0]?.email_address

        await updateUser(eq(UsersTable.clerkUserId, evt.data.id), {
          clerkUserId: evt.data.id,
          email: email,
        })
        break
      }

      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    console.log("Webhook processed for user:", evt.data.id)
    return new Response("Webhook received", { status: 200 })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", { status: 400 })
  }
}
