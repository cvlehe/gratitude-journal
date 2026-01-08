import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import GratitudeNumberedInputSection from "./GratitudeNumberedInputSection";
import GratitudeInputSection from "./GratitudeInputSection";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEntries } from "../hooks/useEntries.hook";
import { JournalEntry, Quote } from "../types/types";
import { useFormik } from "formik";
import { SubmitButton } from "./SubmitButton";
import useQuotes from "../hooks/useQuotes.hook";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const MainScreen = ({
  entry,
  submitPressed,
}: {
  entry?: JournalEntry;
  submitPressed: (values: JournalEntry) => void;
}) => {
  const [quote, setQuote] = useState<Quote | undefined>(
    entry?.quote ?? undefined
  );

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
        quote: quote ?? { text: "", author: "" },
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

  const { fetchQuote } = useQuotes();

  useEffect(() => {
    if (!quote) {
      fetchQuote().then((result) => {
        setQuote(result);
      });
    }
  }, [quote]);

  return (
    <>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: "stretch",
            paddingBottom: 48,
            paddingHorizontal: 32,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontStyle: "italic",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              "{quote?.text}"
            </Text>
          </View>
          <Text
            style={{
              marginTop: 8,
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            - {quote?.author}
          </Text>

          <GratitudeNumberedInputSection
            title="I am grateful for..."
            entries={formik.values.grateful}
            onChange={(field) => formik.handleChange(field)}
            fieldName="grateful"
            onBlur={(field) => formik.handleBlur(field)}
          />
          <GratitudeNumberedInputSection
            title="What would make today great?"
            entries={formik.values.hopes}
            onChange={(field) => formik.handleChange(field)}
            fieldName="hopes"
            onBlur={(field) => formik.handleBlur(field)}
          />
          <GratitudeInputSection
            title="What is your affirmation for today?"
            entry={formik.values.affirmation}
            onChange={(field) => formik.handleChange(field)}
            fieldName="affirmation"
            onBlur={(field) => formik.handleBlur(field)}
          />
          <GratitudeNumberedInputSection
            title="Highlights of the Day"
            entries={formik.values.highlights}
            onChange={(field) => formik.handleChange(field)}
            fieldName="highlights"
            onBlur={(field) => formik.handleBlur(field)}
          />
          <GratitudeInputSection
            title="What did you learn today?"
            entry={formik.values.lessonLearned}
            onChange={(field) => formik.handleChange(field)}
            fieldName="lessonLearned"
            onBlur={(field) => formik.handleBlur(field)}
          />
        </View>
      </KeyboardAwareScrollView>
      <SubmitButton onSubmit={formik.handleSubmit} />
    </>
  );
};
