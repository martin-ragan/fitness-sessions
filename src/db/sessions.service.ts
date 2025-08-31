import { eq } from 'drizzle-orm';
import { db } from './db';
import { InsertSession, sessions } from './schema';

export const insertSession = async (session: InsertSession) => {
    console.log('session', session)
    const [insertedSession] = await db.insert(sessions).values(session).returning();
    return insertedSession;
}


export const getSession = async (id: string) => {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));

    return session;
}
