import { Request, Response } from 'express';
import { visualSearchService } from '../services/visualSearchService.js';
import { badRequest } from '../utils/httpError.js';

export class VisualSearchController {
  public async searchByPreset(req: Request, res: Response) {
    // `query` is canonical; `preset` is accepted as an alias.
    const raw = req.query.query ?? req.query.preset ?? req.body?.query ?? req.body?.preset ?? 'handbag';
    const query = typeof raw === 'string' && raw.trim() ? raw.trim().slice(0, 200) : 'handbag';
    const results = await visualSearchService.searchByPresetOrKeyword(query);

    res.json({
      success: true,
      data: results,
      query,
      method: 'Visual Descriptor Preset Match (Demo Engine)',
    });
  }

  public async searchByUpload(req: Request, res: Response) {
    if (!req.file) {
      throw badRequest('Please upload an image file (JPEG, PNG, or WebP).');
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw badRequest(`Unsupported file type: ${req.file.mimetype}. Allowed: JPEG, PNG, WebP.`);
    }

    const result = await visualSearchService.searchByUploadedFile(req.file);
    res.json({
      success: true,
      data: result.results,
      filename: result.filename,
      fileSizeKb: result.fileSizeKb,
      method: result.detectionMethod,
    });
  }
}

export const visualSearchController = new VisualSearchController();
