import { NextRequest, NextResponse } from 'next/server';
import { getSessionOrThrow } from '../../../lib/permissions';
import { handleApiError, ApiError } from '../../../lib/apiError';
import cloudinary from '../../../lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    await getSessionOrThrow();

    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      throw new ApiError('Aucun fichier reçu.', 400);
    }
    if (!file.type.startsWith('image/')) {
      throw new ApiError('Seules les images sont acceptées.', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'medecci',
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    return handleApiError(error);
  }
}
