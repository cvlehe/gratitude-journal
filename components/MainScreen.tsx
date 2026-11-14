import React, { useCallback, useEffect, useRef, useState } from 'react';
import GratitudeNumberedInputSection from './GratitudeNumberedInputSection';
import GratitudeInputSection from './GratitudeInputSection';
import { JournalEntry, Quote } from '../types/types';
import { useFormik } from 'formik';
import { SubmitButton } from './SubmitButton';
import useQuotes from '../hooks/useQuotes.hook';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import QuoteRow from './QuoteRow';
import { Section } from './Section';
import Toast from 'react-native-toast-message';

type JournalFormValues = Omit<JournalEntry, 'date' | 'quote'>;

export const MainScreen = ({
  entry,
  submitPressed,
}: {
  entry?: JournalEntry;
  submitPressed: (values: JournalEntry) => void | Promise<void>;
}) => {
  const [todayQuote, setTodayQuote] = useState<Quote | undefined>();
  const quoteRequest = useRef<Promise<Quote> | null>(null);
  const { fetchQuote } = useQuotes();

  const loadTodayQuote = useCallback((): Promise<Quote> => {
    if (todayQuote) return Promise.resolve(todayQuote);
    if (!quoteRequest.current) {
      quoteRequest.current = fetchQuote()
        .then((result) => {
          setTodayQuote(result);
          return result;
        })
        .catch((error) => {
          quoteRequest.current = null;
          throw error;
        });
    }
    return quoteRequest.current;
  }, [fetchQuote, todayQuote]);

  const quote = entry ? entry.quote : todayQuote;

  const onSubmitCallback = useCallback(
    async (values: JournalFormValues) => {
      let quoteToSave = entry?.quote;
      if (!entry) {
        try {
          quoteToSave = await loadTodayQuote();
        } catch {
          Toast.show({ type: 'error', text1: "Could not load today's quote. Try again." });
          return;
        }
      }

      await submitPressed({
        ...values,
        date: entry?.date ?? new Date(),
        quote: quoteToSave ?? { text: '', author: '' },
      });
    },
    [entry, loadTodayQuote, submitPressed]
  );

  const formik = useFormik<JournalFormValues>({
    initialValues: {
      grateful: entry?.grateful ?? [],
      hopes: entry?.hopes ?? [],
      affirmation: entry?.affirmation ?? '',
      highlights: entry?.highlights ?? [],
      lessonLearned: '',
    },
    onSubmit: onSubmitCallback,
  });
  const { setValues } = formik;

  useEffect(() => {
    setValues({
      grateful: entry?.grateful ?? [],
      hopes: entry?.hopes ?? [],
      affirmation: entry?.affirmation ?? '',
      highlights: entry?.highlights ?? [],
      lessonLearned: entry?.lessonLearned ?? '',
    });
  }, [entry, setValues]);

  useEffect(() => {
    if (!entry && !todayQuote) {
      loadTodayQuote().catch(() => {
        Toast.show({ type: 'error', text1: "Could not load today's quote. Try again." });
      });
    }
  }, [entry, loadTodayQuote, todayQuote]);

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
