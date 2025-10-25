import { supabase } from '@/utils/supabase';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;
  try {
    //リクエストヘッダーからtokenを取得
    const token = request.headers.get('Authorization') ?? '';

    //tokenを送り、ユーザー情報をオブジェクトで返却;
    const { error } = await supabase.auth.getUser(token);

    // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
    if (error)
      return NextResponse.json({ status: error.message }, { status: 400 });

    // PostをDBから取得
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  //リクエストヘッダーからtokenを取得
  const token = request.headers.get('Authorization') ?? '';

  //tokenを送り、ユーザー情報をオブジェクトで返却;
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  const { id } = params;

  const { title, content, thumbnailImageKey, categories } =
    await request.json();

  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    });

    //一旦、対象のidを持つ中間テーブルのレコード全削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    //中間テーブルに再度レコード作成
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      });
    }

    return NextResponse.json({ status: 'OK', post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  //リクエストヘッダーからtokenを取得
  const token = request.headers.get('Authorization') ?? '';

  //tokenを送り、ユーザー情報をオブジェクトで返却;
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  const { id } = params;

  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
