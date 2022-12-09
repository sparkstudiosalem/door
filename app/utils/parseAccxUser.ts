import { components } from "../generated/schema/openapi";
import createLogger from "./createLogger";

const log = createLogger(__filename);

export default function parseAccxUser(
  accxUserString: string
): components["schemas"]["User"] | undefined {
  const userParts = accxUserString.split(/\s+/);

  if (userParts.length < 3) {
    log.error(
      `Unrecognized ACCX user format ${JSON.stringify(
        accxUserString
      )}; overall format`
    );
    return undefined;
  }

  const [id, userMask, tag] = userParts;
  if (!id || !userMask || !tag) {
    log.error(
      `Unrecognized ACCX user format ${JSON.stringify(
        accxUserString
      )}; missing id, userMask, or tag`
    );

    return undefined;
  }

  if (id.includes(":")) {
    log.info(`Ignoring id including colon ${id}`);
    return undefined;
  }

  return {
    id,
    userMask: parseInt(userMask, 10),
    tag,
  };
}
