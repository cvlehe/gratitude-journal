import React from "react";
import { Text } from "react-native";
import { View } from "react-native";
import GratitudeTextInput from "./GratitudeTextInput";

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
      <Text
        style={{
          marginTop: 64,
          fontSize: 20,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
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
