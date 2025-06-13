// src/hooks/useData.js
import { get, getDatabase, orderByKey, query, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { getCollectionFromDB, saveCollectionToDB } from '../utils/db';
export default function useData(address) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(false);

      try {
        const localData = await getCollectionFromDB(address);
        if (localData && localData.length > 0) {
          setData(localData);
          setLoading(false);
        }

        const db = getDatabase();
        const dataRef = ref(db, address);
        const dataQuery = query(dataRef, orderByKey());
        const snapshot = await get(dataQuery);

        if (snapshot.exists()) {
          const remoteData = Object.values(snapshot.val());
          setData(remoteData);
          await saveCollectionToDB(address, remoteData);
        } else if (!localData) {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        if (data.length === 0) setError(true);
      } finally {
        if (loading) setLoading(false);
      }
    }

    fetchData();
  }, [address]);

  return { loading, error, data };
}