import { components } from "../generated/schema/openapi";

export default function parseAccxUser(
  accxUserString: string
): components["schemas"]["User"] | undefined {
  const userParts = accxUserString.split(/\s+/);

  if (userParts.length !== 4) {
    // throw new Error(
    //   `Unrecognized ACCX user format ${JSON.stringify(
    //     accxUserString
    //   )}; overall format`
    // );
    return undefined;
  }

  const [id, userMask, tag] = userParts;
  if (!id || !userMask || !tag) {
    // throw new Error(
    //   `Unrecognized ACCX user format ${JSON.stringify(
    //     accxUserString
    //   )}; missing id, userMask, or tag`
    // );
    return undefined;
  }

  return {
    id,
    userMask: parseInt(userMask, 10),
    tag,
  };
}
