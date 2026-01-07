import dayjs from "dayjs";
import React, { useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import GratitudeNumberedInputSection from "./GratitudeNumberedInputSection";
import GratitudeInputSection from "./GratitudeInputSection";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEntries } from "./useEntries.hook";
import { JournalEntry } from "./types";
import { useFormik } from "formik";
import { SubmitButton } from "./SubmitButton";

export const MainScreen = ({
  entry,
  submitPressed,
}: {
  entry?: JournalEntry;
  submitPressed: (values: JournalEntry) => void;
}) => {
  const formik = useFormik({
    initialValues: {
      grateful: entry?.grateful ?? [],
      hopes: entry?.hopes ?? [],
      affirmation: entry?.affirmation ?? "",
      highlights: entry?.highlights ?? [],
      lessonLearned: "",
    },
    onSubmit: (values) => {
      submitPressed({
        ...values,
        date: entry?.date ?? new Date(),
        quote: entry?.quote ?? { text: "", author: "" },
      });
    },
  });
  useEffect(() => {
    formik.setValues({
      grateful: entry?.grateful ?? [],
      hopes: entry?.hopes ?? [],
      affirmation: entry?.affirmation ?? "",
      highlights: entry?.highlights ?? [],
      lessonLearned: entry?.lessonLearned ?? "",
    });
  }, [entry]);
  console.log("cv=render:", formik.values.grateful);
  return (
    <>
      <ScrollView style={{ flex: 1, marginBottom: 16 }}>
        <View style={{ flex: 1, alignItems: "stretch" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                fontStyle: "italic",
                textAlign: "center",
                marginTop: 24,
                borderBottomColor: "#000",
                borderBottomWidth: 1,
                width: 300,
              }}
            >
              {`${dayjs(entry?.date).format("dddd - MMMM D, YYYY")}`}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontStyle: "italic",
              textAlign: "center",
              marginTop: 24,
            }}
          >
            "{entry?.quote.text}"
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            - {entry?.quote.author}
          </Text>

          <GratitudeNumberedInputSection
            title="I am grateful for..."
            entries={formik.values.grateful}
          />
          <GratitudeNumberedInputSection
            title="What would make today great?"
            entries={formik.values.hopes}
          />
          <GratitudeInputSection
            title="What is your affirmation for today?"
            entry={formik.values.affirmation}
          />
          <GratitudeNumberedInputSection
            title="Highlights of the Day"
            entries={formik.values.highlights}
          />
          <GratitudeInputSection
            title="What did you learn today?"
            entry={formik.values.lessonLearned}
          />
        </View>
      </ScrollView>
      <SubmitButton onSubmit={formik.handleSubmit} />
    </>
  );
};
