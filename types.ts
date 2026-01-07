// const data = [
//     {
//       date: dayjs().format("dddd - MMMM D, YYYY"), // Date type
//       quote: "Some inspirational quote",
//       quoteAuthor: "Author Name",
//       grateful: ["Item 1", "Item 2", "Item 3"],
//       hopes: ["Item 1", "Item 2", "Item 3"],
//       affirmation: "Some affirmation",
//       highlights: ["Item 1", "Item 2", "Item 3"],
//       lessonLearned: "Some learning",
//     },
//   ];

export type JournalData = JournalEntry[];

export type JournalEntry = {
  date: Date;
  quote: {
    text: string;
    author: string;
  };
  grateful: string[];
  hopes: string[];
  affirmation: string;
  highlights: string[];
  lessonLearned: string;
};
