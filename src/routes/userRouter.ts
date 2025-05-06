import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Session } from "@jcs224/hono-sessions";
import type { SessionDataTypes } from "../index.js";
import { userApiSchema } from "../schemas/user.js";

export const userRouter = new OpenAPIHono<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>();

userRouter.get("/", (c) => c.text("user dir"));

const registerUserRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: userApiSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            userId: z.number(),
          }),
        },
      },
      description: "ユーザーが正常に登録されました",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
            details: z.array(z.any()).optional(),
          }),
        },
      },
      description: "入力データの検証に失敗しました",
    },
    409: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: "メールアドレスが既に使用されています",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: "サーバーエラーが発生しました",
    },
  },
  tags: ["user"],
  summary: "userの新規登録",
  description: "ユーザー情報を受け取り、新規アカウントを作成します",
});

// ユーザー登録ルートを実装
userRouter.openapi(registerUserRoute, async (c) => {
  try {
    // リクエストボディを取得
    const body = await c.req.json();

    // スキーマによるバリデーション
    const validationResult = userApiSchema.safeParse(body);

    if (!validationResult.success) {
      return c.json(
        {
          error: "入力データの検証に失敗しました",
          details: validationResult.error.errors,
        },
        400
      );
    }

    const userData = validationResult.data;

    // メールアドレスの重複チェック (実際のDBチェックはここに実装)
    // 例: const existingUser = await db.query.user.findFirst({ where: eq(user.email, userData.email) });
    const emailExists = false; // ダミーの例

    if (emailExists) {
      return c.json(
        {
          error: "このメールアドレスは既に使用されています",
        },
        409
      );
    }

    // パスワードのハッシュ化（実際の実装ではbcryptなどを使用）
    // const hashedPassword = await bcrypt.hash(userData.password, 10);

    // ユーザーをデータベースに保存（実際のDB操作はここに実装）
    // 例: const result = await db.insert(user).values({...userData, password: hashedPassword});
    const userId = 123; // ダミーのユーザーID

    // セッションにユーザー情報を保存
    const session = await c.get("session");
    await session.set("uuid", userId.toString());
    await session.set("role", "user");

    // 成功レスポンス
    return c.json(
      {
        message: "ユーザーが正常に登録されました",
        userId: userId,
      },
      201
    );
  } catch (error) {
    console.error("ユーザー登録エラー:", error);
    return c.json(
      {
        error: "ユーザー登録中にエラーが発生しました",
      },
      500
    );
  }
});
