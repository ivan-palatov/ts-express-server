import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
  res.render("auth", { text: "List of users" });
};

export const create = (req: Request, res: Response) => {
  res.render("auth", { text: "Make user here" });
};

export const store = (req: Request, res: Response) => {
  res.render("auth", { text: "Your user is being created" });
};

export const show = (req: Request, res: Response) => {
  res.render("auth", { text: `User ${req.params.id} is being shown.` });
};

export const edit = (req: Request, res: Response) => {
  res.render("auth", { text: `Edit page for ${req.params.id} user.` });
};

export const update = (req: Request, res: Response) => {
  res.render("auth", { text: `User ${req.params.id} is being updated.` });
};

export const destroy = (req: Request, res: Response) => {
  res.render("auth", { text: `You deleted ${req.params.id} user.` });
};
