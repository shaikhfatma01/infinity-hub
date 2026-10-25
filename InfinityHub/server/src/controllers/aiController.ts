import { Request, Response } from 'express';
import { aiService } from '../services/aiService.js';
import { badRequest } from '../utils/httpError.js';

export class AiController {
  public async chat(req: Request, res: Response) {
    const { message } = req.body ?? {};
    // `history` is the canonical field; `conversationHistory` is accepted as an alias.
    const history = req.body?.history ?? req.body?.conversationHistory;

    if (!message || typeof message !== 'string' || !message.trim()) {
      throw badRequest('A valid message string is required.');
    }
    if (message.length > 2000) {
      throw badRequest('Message is too long (max 2000 characters).');
    }

    const aiResult = await aiService.handleShoppingQuery(message.trim(), history);
    res.json({
      success: true,
      data: aiResult,
    });
  }
}

export const aiController = new AiController();
