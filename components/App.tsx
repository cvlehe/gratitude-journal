import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MainScreen } from "./MainScreen";
import { useEntries } from "../hooks/useEntries.hook";
import { JournalEntry } from "../types/types";
import DateRow from "./DateRow";
import Toast from "react-native-toast-message";
import DeleteRow from "./DeleteRow";

export default function App() {
  const { goBack, goForward, currentEntry, loading, saveEntry, deleteEntry } =
    useEntries();
  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const submitPressed = (entry: JournalEntry) => {
    console.log(entry);
    saveEntry(entry);
  };

  return (
    <View style={styles.container}>
      {currentEntry && <DeleteRow onPress={deleteEntry} />}
      <MainScreen entry={currentEntry} submitPressed={submitPressed} />
      <DateRow
        goBack={goBack}
        goForward={goForward}
        currentEntry={currentEntry}
      />
      <StatusBar style="auto" />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3E6",
    paddingTop: 48,
  },
});
