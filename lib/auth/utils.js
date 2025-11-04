import api from "../api";
import Cookies from "js-cookie";

// Depricated
export async function login(email, password) {
  await api.get(
    `${process.env.NEXT_PUBLIC_API_SANCTUM_URL}/sanctum/csrf-cookie`
  );
  const res = await api.post("/login", { email, password });
  const token = res.data.data.token;
  // store token in cookie (1 day expiry)
  Cookies.set("token", token, { expires: 5 });
  return res.data.data;
}

// Depricated
export async function logout() {
  try {
    const res = await api.post("/logout");
    Cookies.remove("token");
    return res.data;
  } catch (err) {
    Cookies.remove("token");
    throw err;
  }
}

export async function getUser() {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch (err) {
    Cookies.remove("token");
    location.pathname = "/login";
    throw err;
  }
}

export async function MeWithToken(token) {
  const res = await api.get("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
