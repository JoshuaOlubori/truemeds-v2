import { db } from "@/drizzle/db"
import { UsersTable } from "@/drizzle/schema"
import type { SQL } from "drizzle-orm"

export async function createUser(data: typeof UsersTable.$inferInsert) {
  const [newUser] = await db
    .insert(UsersTable)
    .values(data)
    .onConflictDoNothing({
      target: UsersTable.clerkUserId,
    })
    .returning({
      id: UsersTable.id,
      userId: UsersTable.clerkUserId,
    })

  // if (newSubscription != null) {
  //   revalidateDbCache({
  //     tag: CACHE_TAGS.subscription,
  //     id: newSubscription.id,
  //     userId: newSubscription.userId,
  //   })
  // }
  return newUser
}

// update user
export async function updateUser(where: SQL, data: Partial<typeof UsersTable.$inferInsert>) {
  // const [updatedUser] =
  await db.update(UsersTable).set(data).where(where).returning({
    id: UsersTable.id,
    userId: UsersTable.clerkUserId,
  })

  // if (updatedSubscription != null) {
  //   revalidateDbCache({
  //     tag: CACHE_TAGS.subscription,
  //     userId: updatedSubscription.userId,
  //     id: updatedSubscription.id,
  //   })
  // }
}
