import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 100;

function parsePositiveInteger(value: unknown, fallback: number): number | undefined {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

export class AdminController {
  public async listUsers(req: Request, res: Response) {
    const page = parsePositiveInteger(req.query.page, 1);
    const pageSize = parsePositiveInteger(req.query.pageSize, DEFAULT_PAGE_SIZE);
    const rawSearch = req.query.search;
    const search = typeof rawSearch === 'string' ? rawSearch.trim() : '';

    if (
      !page ||
      !pageSize ||
      pageSize > MAX_PAGE_SIZE ||
      (rawSearch !== undefined && typeof rawSearch !== 'string') ||
      search.length > MAX_SEARCH_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        error: `Invalid pagination or search parameters. Page size must be between 1 and ${MAX_PAGE_SIZE}, and search must be at most ${MAX_SEARCH_LENGTH} characters.`,
      });
    }

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }
}

export const adminController = new AdminController();
