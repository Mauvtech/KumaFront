import { Term } from "./termModel";

export interface User {
  _id: string;
  username: string;
  token: string;
  role: string;
  isBanned?: boolean;
  bookmarkedTerms?: Term[];
}

