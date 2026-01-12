import * as DocumentPicker from "expo-document-picker";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { JournalEntry } from "../types/types";
import * as FileSystem from "expo-file-system";
import dayjs from "dayjs";

export const importEntriesFromStorage = async (): Promise<
  JournalEntry[] | undefined
> => {
  try {
    let file = await FileSystem.File.pickFileAsync();

    if (Array.isArray(file)) {
      file = file[0];
    }
    console.log("cv-fileUri:", file);
    const fileContents = await file.textSync();
    console.log("cv-fileContents:", fileContents);

    const importedEntries = JSON.parse(fileContents);
    console.log("cv-importedEntries:", importedEntries);

    return importedEntries;
  } catch (error) {
    console.log("cv-importEntriesFromStorage error:", error);
    Toast.show({ type: "error", text1: "Failed to import JSON." });
    return undefined;
  }
};

export const exportEntriesToStorage = async (
  entries: JournalEntry[]
): Promise<void> => {
  try {
    const json = JSON.stringify(entries, null, 2);
    const directory = await FileSystem.Directory.pickDirectoryAsync();
    const file = await directory.createFile(
      `gratitude-backup-${dayjs().format("YYYY-MM-DD-HH-mm-ss")}`,
      "application/json"
    );

    file.write(json);
    Toast.show({ type: "success", text1: "Entries exported" });
  } catch (error) {
    console.log("exportEntriesToStorage error:", error);
    Toast.show({ type: "error", text1: "Failed to export JSON." });
  }
};
