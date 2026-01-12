import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MainScreen } from "./MainScreen";
import { useEntries } from "../hooks/useEntries.hook";
import { JournalEntry } from "../types/types";
import DateRow from "./DateRow";
import Toast from "react-native-toast-message";
import DeleteRow from "./DeleteRow";
import Menu from "./Menu";

export default function App() {
  const {
    goBack,
    goForward,
    currentEntry,
    loading,
    saveEntry,
    deleteEntry,
    importEntries,
    exportEntries,
  } = useEntries();

  const onItemPress = useCallback(
    (id: "import" | "export" | "delete") => {
      switch (id) {
        case "import":
          // Use a document picker to import a JSON file and update the entries.
          importEntries();
          break;
        case "export":
          exportEntries();
          break;
        case "delete":
          deleteEntry();
          break;
      }
    },
    [deleteEntry]
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Menu onItemPress={onItemPress} />
      <MainScreen entry={currentEntry} submitPressed={saveEntry} />
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
