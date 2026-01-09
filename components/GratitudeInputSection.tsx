import React from "react";
import { Text } from "react-native";
import { View } from "react-native";
import GratitudeTextInput from "./GratitudeTextInput";
import GratitudeInputTitle from "./GratitudeInputTitle";

const GratitudeInputSection = ({
  title,
  entry,
  onChange,
  fieldName,
  onBlur,
}: {
  title: string;
  entry?: string;
  onChange: (field: string) => (text: string) => void;
  onBlur: (field: string) => (text: string) => void;
  fieldName: string;
}) => {
  return (
    <View
      style={{
        marginTop: 16,
      }}
    >
      <GratitudeInputTitle title={title} />
      <GratitudeTextInput
        entry={entry}
        onChange={onChange}
        name={fieldName}
        onBlur={onBlur}
      />
    </View>
  );
};

export default GratitudeInputSection;
