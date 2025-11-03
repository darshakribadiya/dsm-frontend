import api from "./api";
import Cookies from "js-cookie";

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

export async function logout() {
  try {
    const res = await api.post("/logout");
    Cookies.remove("token");
    return res.data;
  } catch (err) {
    // if 401, still clear cookie
    Cookies.remove("token");
    throw err;
  }
}

export async function getUser(token) {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch (err) {
    Cookies.remove("token");
    location.pathname = "/login";
    throw err;
    return null;
  }
}
