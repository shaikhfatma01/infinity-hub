import { Request, Response } from 'express';
import { visualSearchService } from '../services/visualSearchService.js';

export class VisualSearchController {
  public async searchByPreset(req: Request, res: Response) {
    const query = (req.query.query as string) || (req.body?.query as string) || 'handbag';
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
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file (JPEG, PNG, or WebP).',
      });
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported file type: ${req.file.mimetype}. Allowed: JPEG, PNG, WebP.`,
      });
    }

    // Validate size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (req.file.size > maxSizeBytes) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds maximum limit of 5 MB.',
      });
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
