import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native';

const DeleteRow = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={{ alignItems: 'flex-end', padding: 16 }}>
      <TouchableOpacity onPress={onPress}>
        <Text style={{ color: 'red' }}>DELETE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteRow;
