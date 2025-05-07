import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db.js";
import { cartsTable } from "../db/cart.js";

// カートが存在するか確認
export const hasValidCart = async (userId: string) => {
  const [cart] = await db
    .select()
    .from(cartsTable)
    .where(
      and(
        eq(cartsTable.user_id, userId),
        isNull(cartsTable.ordered_at),
        isNull(cartsTable.deleted_at)
      )
    )
    .limit(1);
  return cart !== undefined;
};

// カートの作成
export const createCart = async (tx: Parameters<Parameters<typeof db.transaction>[0]>[0], userId: string) => {
  const cartData = {
    user_id: userId,
  };

  const result = await tx.insert(cartsTable).values(cartData);
  return result[0].insertId;
};

// 現在のアクティブなカートを取得
export const getCurrentCart = async (userId: string) => {
  const [cart] = await db
    .select()
    .from(cartsTable)
    .where(
      and(
        eq(cartsTable.user_id, userId),
        isNull(cartsTable.ordered_at),
        isNull(cartsTable.deleted_at)
      )
    )
    .limit(1);

  return cart;
};
