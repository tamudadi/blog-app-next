import { supabase } from '@/utils/supabase';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  //リクエストヘッダーからtokenを取得
  const token = request.headers.get('Authorization') ?? '';

  //tokenを送り、ユーザー情報をオブジェクトで返却;
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  try {
    // カテゴリー一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        // 作成日時の降順で取得
        createdAt: 'desc',
      },
    });
    // レスポンス
    return NextResponse.json(
      {
        status: 'OK',
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const POST = async (request: NextRequest, context: any) => {
  //リクエストヘッダーからtokenを取得
  const token = request.headers.get('Authorization') ?? '';

  //tokenを送り、ユーザー情報をオブジェクトで返却;
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  try {
    const body = await request.json();

    const { name } = body;

    const data = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json({
      status: 'OK',
      message: 'カテゴリーを作成しました',
      id: data.id,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
