import React from "react";
import { Text, TextInput } from "react-native";
import { View } from "react-native";
import GratitudeTextInput from "./GratitudeTextInput";

const GratitudeInputSection = ({
  title,
  entry,
}: {
  title: string;
  entry?: string;
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
      <GratitudeTextInput entry={entry} />
    </View>
  );
};

export default GratitudeInputSection;
