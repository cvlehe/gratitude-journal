import { useState } from "react";
import { Quote } from "./types";

const useQuotes = () => {
  const fetchQuote = async (): Promise<Quote> => {
    const response = await fetch(
      "https://api.allorigins.win/get?url=https://zenquotes.io/api/today"
    );
    const data = await response.json();
    console.log("cv-data:", data);
    if (!data || data?.length < 1) {
      return { text: "Error fetching quote", author: "" };
    }

    const contents = JSON.parse(data.contents);
    console.log("cv-contents:", contents);
    return { text: contents[0].q, author: contents[0].a };
  };

  return { fetchQuote };
};

export default useQuotes;
