import type { Request, Response } from 'express';

export const health = async (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
};