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
  const { goBack, goForward, currentEntry, loading, saveEntry } = useEntries();
  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const submitPressed = (entry: JournalEntry) => {
    console.log(entry);
    saveEntry(entry);
  };

  return (
    <View style={{ flex: 1, paddingVertical: 48 }}>
      <MainScreen entry={currentEntry} submitPressed={submitPressed} />
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            marginHorizontal: 8,
          }}
          onPress={goBack}
        >
          <Text style={{ fontSize: 40, width: 50, height: 50 }}>
            {"\u2190"}
          </Text>
        </TouchableOpacity>
        <View style={{ width: 300 }}>
          <Text
            style={{
              fontSize: 20,
              fontStyle: "italic",
              textAlign: "center",
              marginTop: 24,
              borderBottomColor: "#000",
              borderBottomWidth: 1,
            }}
          >
            {`${dayjs(currentEntry?.date ?? new Date()).format(
              "dddd - MMMM D, YYYY"
            )}`}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            marginHorizontal: 8,
          }}
          onPress={goForward}
        >
          <Text style={{ fontSize: 40, width: 50, height: 50 }}>
            {"\u2192"}
          </Text>
        </TouchableOpacity>
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
