import React from 'react';
import { View } from 'react-native';
import GratitudeTextInput from './GratitudeTextInput';
import GratitudeInputTitle from './GratitudeInputTitle';

const GratitudeNumberedInputSection = ({
  title,
  entries,
  onChange,
  fieldName,
  onBlur,
}: {
  title: string;
  entries?: string[];
  onChange: (field: string) => (text: string) => void;
  onBlur: (field: string) => (text: string) => void;
  fieldName: string;
}) => {
  return (
    <View>
      <GratitudeInputTitle title={title} />

      <GratitudeTextInput
        position={1}
        entry={entries?.[0]}
        onChange={onChange}
        name={`${fieldName}[0]`}
        onBlur={onBlur}
      />
      <GratitudeTextInput
        position={2}
        entry={entries?.[1]}
        onChange={onChange}
        name={`${fieldName}[1]`}
        onBlur={onBlur}
      />

      <GratitudeTextInput
        position={3}
        entry={entries?.[2]}
        onChange={onChange}
        name={`${fieldName}[2]`}
        onBlur={onBlur}
      />
    </View>
  );
};

export default GratitudeNumberedInputSection;
