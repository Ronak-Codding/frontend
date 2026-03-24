export function useAuth() {
  const token = localStorage.getItem("usertoken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return { isLoggedIn: !!token, user, logout };
}