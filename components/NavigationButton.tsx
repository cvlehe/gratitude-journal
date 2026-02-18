import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const NavigationButton = ({ onPress, type }: { onPress: () => void; type: 'back' | 'forward' }) => {
  return (
    <TouchableOpacity
      style={{
        marginHorizontal: 8,
      }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 40 }}>{type === 'forward' ? '\u2192' : '\u2190'}</Text>
    </TouchableOpacity>
  );
};

export default NavigationButton;
