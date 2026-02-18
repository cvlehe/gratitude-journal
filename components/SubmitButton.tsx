import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export const SubmitButton = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        onPress={onSubmit}
        style={{
          backgroundColor: '#007BAA',
          padding: 16,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 32,
          maxWidth: 500,
          width: '100%',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};
