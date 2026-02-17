import React from 'react';
import { View, Text } from 'react-native';
import { JournalEntry } from '../types/types';
import dayjs from 'dayjs';
import NavigationButton from './NavigationButton';

const DateRow = ({
  goBack,
  goForward,
  currentEntry,
}: {
  goBack: () => void;
  goForward: () => void;
  currentEntry?: JournalEntry;
}) => {
  return (
    <View
      style={{
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingBottom: 48,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
    >
      <NavigationButton onPress={goBack} type="back" />
      <View style={{ width: 300, justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: 20,
            fontStyle: 'italic',
            textAlign: 'center',
            borderBottomColor: '#000',
            borderBottomWidth: 1,
          }}
        >
          {`${dayjs(currentEntry?.date ?? new Date()).format('dddd - MMMM D, YYYY')}`}
        </Text>
      </View>
      <NavigationButton onPress={goForward} type="forward" />
    </View>
  );
};

export default DateRow;
