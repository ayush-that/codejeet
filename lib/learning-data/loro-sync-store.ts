const DATABASE_NAME = "codejeet-loro-sync-state";
const DATABASE_VERSION = 1;
const STORE_NAME = "loroState";

export type LoroSyncStoreRecord = {
  accountId: string;
  revision: bigint;
  snapshot: Uint8Array;
  updatedAt: number;
};

type RawLoroSyncStoreRecord = {
  accountId: string;
  revision: string;
  snapshot: number[];
  updatedAt: number;
};

function request<T>(requestObject: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    requestObject.onsuccess = () => resolve(requestObject.result);
    requestObject.onerror = () =>
      reject(requestObject.error ?? new Error("IndexedDB request failed"));
  });
}

const requestIdb = (): IDBFactory | undefined =>
  typeof indexedDB === "undefined" ? undefined : indexedDB;

function toRecord(raw: RawLoroSyncStoreRecord): LoroSyncStoreRecord {
  return {
    accountId: raw.accountId,
    revision: BigInt(raw.revision),
    snapshot: Uint8Array.from(raw.snapshot),
    updatedAt: raw.updatedAt,
  };
}

function fromRecord(record: LoroSyncStoreRecord): RawLoroSyncStoreRecord {
  return {
    accountId: record.accountId,
    revision: record.revision.toString(),
    snapshot: Array.from(record.snapshot),
    updatedAt: record.updatedAt,
  };
}

let opened: Promise<IDBDatabase> | null = null;

async function open(): Promise<IDBDatabase> {
  if (opened) return opened;
  opened = new Promise((resolve, reject) => {
    const idb = requestIdb();
    if (!idb) {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }
    const request = idb.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "accountId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open Loro sync store"));
    request.onblocked = () => reject(new Error("Loro sync store open is blocked"));
  });
  try {
    return await opened;
  } catch (error) {
    opened = null;
    throw error;
  }
}

export async function readLoroSyncStore(accountId: string): Promise<LoroSyncStoreRecord | null> {
  if (!accountId) return null;
  const db = await open();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(accountId);
      request.onsuccess = () => {
        const value = request.result as RawLoroSyncStoreRecord | undefined;
        if (!value) {
          resolve(null);
          return;
        }
        if (!Number.isSafeInteger(value.updatedAt)) {
          resolve(null);
          return;
        }
        try {
          resolve(toRecord(value));
        } catch {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error ?? new Error("Loro sync store read failed"));
    } catch (error) {
      reject(error);
    }
  });
}

export async function writeLoroSyncStore(record: LoroSyncStoreRecord): Promise<void> {
  const db = await open();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await request(tx.objectStore(STORE_NAME).put(fromRecord(record)));
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new Error("Loro sync store write transaction aborted"));
    tx.onerror = () => reject(tx.error ?? new Error("Loro sync store write failed"));
  });
}
