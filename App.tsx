import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import dayjs from "dayjs";
import GratitudeInputSection from "./GratitudeInputSection";
import GratitudeNumberedInputSection from "./GratitudeNumberedInputSection";
import { MainScreen } from "./MainScreen";
import { SubmitButton } from "./SubmitButton";
import { useEntries } from "./useEntries.hook";
import { JournalEntry } from "./types";

export default function App() {
  const { goBack, goForward, currentEntry, loading } = useEntries();
  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const submitPressed = (values: JournalEntry) => {
    console.log(values);
  };
  return (
    <View style={{ flex: 1 }}>
      <MainScreen entry={currentEntry} submitPressed={submitPressed} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Button title="Back" onPress={goBack} />
        <Button title="Forward" onPress={goForward} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6E9",
    padding: 32,
  },
});
