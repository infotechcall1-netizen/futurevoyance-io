import { redirect } from "next/navigation";

// Redirect permanent vers /mon-espace
export default function MonOraclePage() {
  redirect("/mon-espace");
}
