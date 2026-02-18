import React from 'react';
import { Text } from 'react-native';

const GratitudeInputTitle = ({ title }: { title: string }) => {
  return (
    <Text
      style={{
        marginTop: 32,
        fontSize: 20,
        fontStyle: 'italic',
        textAlign: 'center',
      }}
    >
      {title}
    </Text>
  );
};

export default GratitudeInputTitle;
