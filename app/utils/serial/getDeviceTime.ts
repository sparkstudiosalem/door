import parseAccxDate from "../parseAccxDate";
import { runSession } from "./runSession";

export default async function getDeviceTime() {
  return runSession({
    command: "d",
    onData: (onComplete: (date: Date) => void, accxDate: string) => {
      onComplete(parseAccxDate(accxDate));
    },
  });
}
