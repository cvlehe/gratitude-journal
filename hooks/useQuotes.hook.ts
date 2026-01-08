import { useState } from "react";
import { Quote } from "../types/types";
import { Platform } from "react-native";

const useQuotes = () => {
  const fetchQuote = async (): Promise<Quote> => {
    const url = "https://zenquotes.io/api/today";
    const response = await fetch(
      Platform.OS === "web" ? `https://api.allorigins.win/get?url=${url}` : url
    );
    const data = await response.json();
    if (!data || data?.length < 1) {
      return { text: "Error fetching quote", author: "" };
    }

    const contents = JSON.parse(data.contents);
    return { text: contents[0].q, author: contents[0].a };
  };

  return { fetchQuote };
};

export default useQuotes;
