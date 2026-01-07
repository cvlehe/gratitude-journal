import React from "react";
import { Text } from "react-native";
import { View } from "react-native";
import GratitudeTextInput from "./GratitudeTextInput";

const GratitudeNumberedInputSection = ({
  title,
  entries,
}: {
  title: string;
  entries?: string[];
}) => {
  return (
    <View>
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

      <GratitudeTextInput position={1} entry={entries?.[0]} />
      <GratitudeTextInput position={2} entry={entries?.[1]} />

      <GratitudeTextInput position={3} entry={entries?.[2]} />
    </View>
  );
};

export default GratitudeNumberedInputSection;
