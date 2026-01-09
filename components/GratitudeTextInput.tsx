import React from "react";
import { Text, TextInput, View } from "react-native";

const GratitudeTextInput = ({
  position,
  entry,
  onChange,
  name,
  onBlur,
}: {
  position?: number;
  entry?: string;
  onChange: (field: string) => (text: string) => void;
  onBlur: (field: string) => (text: string) => void;
  name: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        flex: 1,
        flexGrow: 1,
      }}
    >
      {position && <Text>{position}.</Text>}
      <TextInput
        textAlignVertical="bottom"
        multiline
        numberOfLines={2}
        onChangeText={onChange(name)}
        onBlur={() => onBlur(name)}
        style={{
          maxWidth: 500,
          flex: 1,
          paddingStart: 8,
          borderBottomWidth: 1,
          borderColor: "#000",
          color: "#000",
        }}
        value={entry ?? ""}
      />
    </View>
  );
};

export default GratitudeTextInput;
