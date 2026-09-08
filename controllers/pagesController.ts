import type { Request, Response } from "express";

export function renderHome(req: Request, res: Response) {
  res.render("index");
}

export function renderAbout(req: Request, res: Response) {
  res.render("about");
}

export function renderTerms(req: Request, res: Response) {
  res.render("terms");
}

export function renderPrivacy(req: Request, res: Response) {
  res.render("privacy");
}
