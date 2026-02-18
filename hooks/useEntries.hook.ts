import { useCallback, useEffect, useState } from 'react';
import { JournalData, JournalEntry } from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';
import { exportEntriesToStorage, importEntriesFromStorage } from '../helpers/entry-storage.helper';
import isToday from 'dayjs/plugin/isToday'; // ES 2015
dayjs.extend(isToday);

export const useEntries = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [data, setData] = useState<JournalData>([]);

  const goBack = useCallback(() => {
    if (currentPage === 0) {
      return;
    }
    setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const goForward = useCallback(() => {
    if (currentPage === data.length || dayjs(currentEntry?.date).isToday()) {
      return;
    }
    setCurrentPage(currentPage + 1);
  }, [currentPage]);

  const fetchData = useCallback(async () => {
    const result = await AsyncStorage.getItem('journalData');
    if (result) {
      const parsedResult: JournalData = JSON.parse(result);
      setData(parsedResult);
      if (parsedResult.length > 0) {
        const lastEntry = parsedResult[parsedResult.length - 1];
        if (dayjs(lastEntry.date).isToday()) {
          setCurrentPage(parsedResult.length - 1);
        }else {
          setCurrentPage(parsedResult.length);
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const saveEntry = useCallback(
    async (entry: JournalEntry) => {
      if (currentPage >= data.length) {
        const newData = [...data, entry];
        setData(newData);
        await AsyncStorage.setItem('journalData', JSON.stringify(newData));
      } else {
        const newData = [...data];
        newData[currentPage] = entry;
        setData(newData);
        await AsyncStorage.setItem('journalData', JSON.stringify(newData));
      }
      Toast.show({
        type: 'success',
        text1: 'Entry saved',
      });
    },
    [currentPage, data]
  );

  const deleteEntry = useCallback(async () => {
    const newData = [...data];
    newData.splice(currentPage, 1);
    setData(newData);
    await AsyncStorage.setItem('journalData', JSON.stringify(newData));
  }, [currentPage, data]);

  useEffect(() => {
    if (currentPage >= data.length) {
      setCurrentEntry(undefined);
    } else {
      setCurrentEntry(data[currentPage]);
    }
  }, [currentPage, data]);

  const importEntries = useCallback(async () => {
    const result = await importEntriesFromStorage();
    if (result) {
      setData(result);
      Toast.show({
        type: 'success',
        text1: 'Entries imported',
      });
    }
  }, []);

  const exportEntries = useCallback(async () => {
    await exportEntriesToStorage(data);
    Toast.show({
      type: 'success',
      text1: 'Entries exported',
    });
  }, [data]);

  return {
    loading,
    currentEntry,
    goBack,
    goForward,
    saveEntry,
    deleteEntry,
    importEntries,
    exportEntries,
  };
};
