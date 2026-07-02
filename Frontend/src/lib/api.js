const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function postAI(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error(`Server error (${response.status}). Please try again.`);
  }

  if (!response.ok) {
    const detail = data?.detail;
    const message =
      detail?.message ||
      (typeof detail === "string" ? detail : null) ||
      (detail ? JSON.stringify(detail) : null) ||
      "AI request failed";

    throw new Error(message);
  }

  return data;
}
