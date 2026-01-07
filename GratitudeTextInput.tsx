import React from "react";
import { Text, TextInput, View } from "react-native";

const GratitudeTextInput = ({
  position,
  entry,
}: {
  position?: number;
  entry?: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        marginTop: 16,
        flex: 1,
        flexGrow: 1,
      }}
    >
      {position && <Text>{position}.</Text>}
      <TextInput
        style={{
          maxWidth: 500,
          flex: 1,
          paddingStart: 8,
          borderBottomWidth: 1,
          borderColor: "#000",
          color: "#000",
        }}
        value={entry ?? ""}
        // onChangeText={setEntry}
      />
    </View>
  );
};

export default GratitudeTextInput;
