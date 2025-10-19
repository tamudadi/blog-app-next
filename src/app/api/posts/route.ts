import { supabase } from '@/utils/supabase';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

//PrismaClientのインスタンスを作成し、include, select, where, orderBy, skip, takeなどのクエリが使用できるようになる。
const prisma = new PrismaClient();

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (request: NextRequest) => {
  //リクエストヘッダーからtokenを取得
  const token = request.headers.get('Authorization') ?? '';

  //tokenを送り、ユーザー情報をオブジェクトで返却;
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

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
