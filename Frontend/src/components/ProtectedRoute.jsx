import { postAI } from "@/lib/api";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return null;
}