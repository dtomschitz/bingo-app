import type { Header } from "../deps.ts";

export const expirationTimer: number = 604800000; //One week

export const payload = {
  exp: Date.now() + expirationTimer,
};

export const header: Header = {
  alg: "HS256",
  typ: "JWT",
};
