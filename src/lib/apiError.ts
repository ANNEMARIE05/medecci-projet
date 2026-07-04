import { NextResponse } from 'next/server';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
    return NextResponse.json({ message: 'Cette valeur existe déjà (contrainte d\'unicité).' }, { status: 409 });
  }
  if (error instanceof Error && error.name === 'ValidationError') {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  console.error(error);
  return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
}
