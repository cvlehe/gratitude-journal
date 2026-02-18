import { useCallback, useState } from 'react';
import { Quote } from '../types/types';
import { Platform } from 'react-native';

const useQuotes = () => {
  const fetchQuote = useCallback(async (): Promise<Quote> => {
    return Promise.resolve({ text: 'Test quote1', author: 'Test author1' });
    // const url = 'https://zenquotes.io/api/today';
    // const response = await fetch(
    //   Platform.OS === 'web' ? `https://api.allorigins.win/get?url=${url}` : url
    // );
    // const data = await response.json();
    // if (!data || data?.length < 1) {
    //   return { text: 'Error fetching quote', author: '' };
    // }

    // return Promise.resolve({ text: data[0].q, author: data[0].a });
  }, []);

  return { fetchQuote };
};

export default useQuotes;
