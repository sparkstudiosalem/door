import { components } from "../../generated/schema/openapi";
import parseAccxUser from "../parseAccxUser";
import { runSession } from "./runSession";

type User = components["schemas"]["User"];

const MAX_USERS = 200;

export default async function getDeviceUsers() {
  let users: readonly User[] | undefined;

  return runSession({
    command: "a",
    onData: (onComplete: (users: readonly User[]) => void, data: string) => {
      const nextUser = parseAccxUser(data);

      if (nextUser) {
        users = users ? [...users, nextUser] : [nextUser];
      }

      if (users?.length === MAX_USERS) {
        onComplete(users);
      }
    },
  });
}
