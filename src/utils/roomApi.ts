/**
 * Room Cloud Persistence API layer.
 * Routes through the persistent multi-engine cloud database in cloudDb.ts.
 */
import {
  saveRoomToDatabase,
  fetchRoomFromDatabase,
  subscribeSyncStatus,
  CloudSyncStatus
} from './cloudDb';

export interface RoomRecord {
  code: string;
  encryptedPayload: string;
  updatedAt: string;
}

/**
 * Saves encrypted room data to the cloud database.
 */
export async function saveRoomToCloud(roomCode: string, encryptedPayload: string): Promise<boolean> {
  return await saveRoomToDatabase(roomCode, encryptedPayload);
}

/**
 * Fetches encrypted room data from the cloud database.
 */
export async function fetchRoomFromCloud(roomCode: string): Promise<string | null> {
  return await fetchRoomFromDatabase(roomCode);
}

export { subscribeSyncStatus };
export type { CloudSyncStatus };
