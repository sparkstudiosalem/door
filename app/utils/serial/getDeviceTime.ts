import parseAccxDate from "../parseAccxDate";
import { DATE_SHOW } from "./constants";
import { runSession } from "./serial";

export default async function getDeviceTime() {
  return runSession({
    command: DATE_SHOW,
    onEvent: ({
      data: accxDate,
      onComplete,
    }: {
      data: string;
      onComplete: (date: Date) => void;
    }) => {
      onComplete(parseAccxDate(accxDate));
    },
  });
}
