import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

//PrismaClientのインスタンスを作成し、include, select, where, orderBy, skip, takeなどのクエリが使用できるようになる。
const prisma = new PrismaClient();

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (request: NextRequest) => {
  try {
    //Postの一覧をDBから取得
    //schema.prismaファイルで定義したモデルは小文字はじまりのプロパティで表される(ex.Postはprisma.post)
    const posts = await prisma.post.findMany({
      include: {
        //カテゴリーも含めて取得
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      // 作成日時の降順で取得
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
