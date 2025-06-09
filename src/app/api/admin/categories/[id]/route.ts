import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    // カテゴリー一覧をDBから取得
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    // レスポンス
    return NextResponse.json(
      {
        status: 'OK',
        category,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
