// src/utils/db.js
import { openDB } from 'idb';

const DB_NAME = 'iGrowDB';
const DB_VERSION = 2;
const COURSE_STORE = 'courses';
const PROGRESS_STORE = 'userProgress';
const COLLECTION_STORE = 'collections';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains(COURSE_STORE)) {
      db.createObjectStore(COURSE_STORE, { keyPath: 'topicID' });
    }
    if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
      const store = db.createObjectStore(PROGRESS_STORE, {
        keyPath: 'submissionId',
        autoIncrement: true,
      });
      store.createIndex('synced', 'synced', { unique: false });
    }

    if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(COLLECTION_STORE)) {
            db.createObjectStore(COLLECTION_STORE, { keyPath: 'address' });
        }
    }
  },
});


export const getCourseFromDB = async (id) => {
  const db = await dbPromise;
  return db.get(COURSE_STORE, id);
};

export const saveCourseToDB = async (course) => {
  const db = await dbPromise;
  return db.put(COURSE_STORE, course);
};

export const saveProgressToDB = async (progressData) => {
    const db = await dbPromise;
    return db.add(PROGRESS_STORE, { ...progressData, synced: 0 });
};

export const getPendingProgressFromDB = async () => {
    const db = await dbPromise;
    return db.getAllFromIndex(PROGRESS_STORE, 'synced', 0);
};

export const markProgressAsSynced = async (submissionId) => {
    const db = await dbPromise;
    const tx = db.transaction(PROGRESS_STORE, 'readwrite');
    const store = tx.objectStore(PROGRESS_STORE);
    const progress = await store.get(submissionId);
    if (progress) {
        progress.synced = 1;
        await store.put(progress);
    }
    await tx.done;
};

export const getCollectionFromDB = async (address) => {
    const db = await dbPromise;
    const result = await db.get(COLLECTION_STORE, address);
    return result ? result.data : null; // Trả về mảng data
};

export const saveCollectionToDB = async (address, data) => {
    const db = await dbPromise;
    return db.put(COLLECTION_STORE, { address, data });
};