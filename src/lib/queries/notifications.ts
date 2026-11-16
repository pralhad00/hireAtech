import "server-only";
import { query } from "../db";

/** Create an in-app notification for a user (spec §9.5). */
export async function createNotification(
  userId: string,
  message: string,
): Promise<void> {
  await query(
    `INSERT INTO notifications (user_id, message)
     VALUES ($1, $2)`,
    [userId, message],
  );
}
