import React, { useCallback, useEffect, useState } from 'react';
import GratitudeNumberedInputSection from './GratitudeNumberedInputSection';
import GratitudeInputSection from './GratitudeInputSection';
import { JournalEntry, Quote } from '../types/types';
import { useFormik } from 'formik';
import { SubmitButton } from './SubmitButton';
import useQuotes from '../hooks/useQuotes.hook';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import QuoteRow from './QuoteRow';
import { Section } from './Section';

export const MainScreen = ({
  entry,
  submitPressed,
}: {
  entry?: JournalEntry;
  submitPressed: (values: JournalEntry) => void;
}) => {
  const [quote, setQuote] = useState<Quote | undefined>(entry?.quote ?? undefined);

  const formik = useFormik({
    initialValues: {
      grateful: entry?.grateful ?? [],
      hopes: entry?.hopes ?? [],
      affirmation: entry?.affirmation ?? '',
      highlights: entry?.highlights ?? [],
      lessonLearned: '',
    },
    onSubmit: (values) => {
      onSubmitCallback(values);
    },
  });

  const onSubmitCallback = useCallback(
    (values: typeof formik.initialValues) => {
      submitPressed({
        ...values,
        date: entry?.date ?? new Date(),
        quote: quote ?? { text: '', author: '' },
      });
    },
    [entry?.date, formik, quote, submitPressed]
  );

  useEffect(() => {
    formik.setValues({
      grateful: entry?.grateful ?? [],
      hopes: entry?.hopes ?? [],
      affirmation: entry?.affirmation ?? '',
      highlights: entry?.highlights ?? [],
      lessonLearned: entry?.lessonLearned ?? '',
    });
  }, [entry]);

  const { fetchQuote } = useQuotes();

  useEffect(() => {
    if (!quote) {
      fetchQuote().then((result) => {
        setQuote(result);
      });
    }
  }, [fetchQuote, quote]);

  return (
    <>
      <KeyboardAwareScrollView enableOnAndroid extraHeight={150} style={{ flex: 1 }}>
        <Section>
          {quote && <QuoteRow quote={quote} />}
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
        </Section>
        <Section backgroundColor="#E0E1DA">
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
          <SubmitButton onSubmit={formik.handleSubmit} />
        </Section>
      </KeyboardAwareScrollView>
    </>
  );
};
