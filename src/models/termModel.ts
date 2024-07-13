import { Category } from "./categoryModel";
import { Language } from "./languageModel";
import { Theme } from "./themeModel";

export interface Term {
  _id: string;
  term: string;
  translation: string;
  definition: string;
  grammaticalCategory: Category;
  theme: Theme;
  language: Language;
  status: string;
  isApproved: boolean;
  comments?: Array<{ author: string; text: string; createdAt: Date }>;
  upvotedBy: string[];
  downvotedBy: string[];
  userVote?: "upvote" | "downvote" | null;
}
