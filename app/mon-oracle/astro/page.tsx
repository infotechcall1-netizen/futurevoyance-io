import { redirect } from "next/navigation";

// Redirect permanent vers /mon-espace/astrologie
export default function AstroPage() {
  redirect("/mon-espace/astrologie");
}
