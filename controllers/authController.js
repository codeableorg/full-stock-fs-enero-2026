import * as authService from "../services/authService.js";

export async function renderSignup(req, res) {
  res.render("signup");
}

export async function handleSignup(req, res) {
  const { email, password, confirmPassword } = req.body;

  await authService.signup(email, password, confirmPassword);
  res.redirect("/");
}
