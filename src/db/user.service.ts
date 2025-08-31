import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const createUser = async (email: string, passwordHash: string) => {
  console.log("Inserting user", {
    email,
    passwordHash
  })
  const [user] = await db
    .insert(users)
    .values({
      email,
      password: passwordHash,
    })
    .returning()

  return user
}

export const getUserByEmail = async (userEmail: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, userEmail));

  return user;
}