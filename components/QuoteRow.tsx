import React from 'react';
import { Text } from 'react-native';
import { Quote } from '../types/types';

const QuoteRow = ({ quote }: { quote: Quote }) => {
  return (
    <>
      <Text
        style={{
          fontSize: 20,
          fontStyle: 'italic',
          textAlign: 'center',
          marginTop: 32,
        }}
      >
        {`"${quote.text}"`}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        - {quote?.author}
      </Text>
    </>
  );
};

export default QuoteRow;
