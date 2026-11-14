import { useCallback, useState } from 'react';
import { Quote } from '../types/types';
import { Platform } from 'react-native';

const useQuotes = () => {
  const fetchQuote = useCallback(async (): Promise<Quote> => {
    const url = 'https://zenquotes.io/api/today';
    const response = await fetch(
      Platform.OS === 'web' ? `https://api.allorigins.win/get?url=${url}` : url
    );
    const data = await response.json();
    if (!Array.isArray(data) || typeof data[0]?.q !== 'string' || !data[0].q) {
      throw new Error('Quote unavailable');
    }

    return { text: data[0].q, author: typeof data[0].a === 'string' ? data[0].a : '' };
  }, []);

  return { fetchQuote };
};

export default useQuotes;
