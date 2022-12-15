import { User } from "./serial/constants";

export function isUser(user: User | undefined): user is User {
  return !!user;
}
