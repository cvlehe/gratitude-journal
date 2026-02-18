import React from 'react';
import { View } from 'react-native';

export const Section = ({
  children,
  backgroundColor,
}: {
  children: React.ReactNode;
  backgroundColor?: string;
}) => {
  return (
    <View
      style={{
        alignItems: 'stretch',
        paddingHorizontal: 32,
        paddingBottom: 32,
        backgroundColor,
      }}
    >
      {children}
    </View>
  );
};
