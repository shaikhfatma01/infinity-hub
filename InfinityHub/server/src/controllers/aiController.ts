import { Request, Response } from 'express';
import { aiService } from '../services/aiService.js';

export class AiController {
  public async chat(req: Request, res: Response) {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A valid message string is required.',
      });
    }

    const aiResult = await aiService.handleShoppingQuery(message.trim(), conversationHistory);
    res.json({
      success: true,
      data: aiResult,
    });
  }
}

export const aiController = new AiController();
