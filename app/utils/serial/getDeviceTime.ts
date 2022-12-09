import parseAccxDate from "../parseAccxDate";
import { SHOW_DATE } from "./constants";
import { runSession } from "./runSession";

export default async function getDeviceTime() {
  return runSession({
    command: SHOW_DATE,
    onData: (onComplete: (date: Date) => void, accxDate: string) => {
      onComplete(parseAccxDate(accxDate));
    },
  });
}
