import { Category } from "./categoryModel";
import { Language } from "./languageModel";
import { Theme } from "./themeModel";
import { User } from "./userModel";

export interface Term {
  _id: string;
  term: string;
  translation: string;
  definition: string;
  grammaticalCategory: Category;
  theme: Theme;
  author: User;
  language: Language;
  status: string;
  isApproved: boolean;
  bookmarkedBy: string[];
  comments?: Array<{ author: User; text: string; createdAt: Date }>;
  upvotedBy: string[];
  downvotedBy: string[];
  userVote?: "upvote" | "downvote" | null;
}
