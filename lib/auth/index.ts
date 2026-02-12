import { getServerSession } from "next-auth";
import { getAuthOptions } from "./options";

export function getServerAuthSession() {
  return getServerSession(getAuthOptions());
}
