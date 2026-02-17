import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SubmitButton = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onSubmit}
      style={{
        backgroundColor: '#007BAA',
        padding: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        margin: 32,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Save</Text>
    </TouchableOpacity>
  );
};
