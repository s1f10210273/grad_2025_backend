import type { Session } from "@jcs224/hono-sessions";
import { writeFile } from "fs/promises";
import type { Context } from "hono";
import { extname, join } from "path";
import { v4 as uuidv4 } from "uuid";
import type { ItemsInsert } from "../db/item.js";
import type { SessionDataTypes } from "../index.js";
import { storeCheckAuth } from "../middlewares/storeCheckAuth.js";
import { addItem, getAllItems } from "../models/itemModel.js";

type ItemContext = Context<{
  Variables: {
    session: Session<SessionDataTypes>;
  };
}>;

export async function storeAddItem(c: ItemContext) {
  const authResponse = await storeCheckAuth(c);
  if (authResponse) {
    return authResponse;
  }
  
  try {
    const session = await c.get("session");
    const storeId = session.get("uuid");

    if (!storeId) {
      console.log("No store ID found in session");
      return c.json({ message: "Unauthorized" }, 401);
    }

    const body = await c.req.parseBody();
    const name: string = body.name as string;
    const price: string = body.price as string;
    const file: File = body.file as File;

    if (!file || !(file instanceof File)) {
      console.log("Invalid file:", file);
      return c.json({ message: "File is required" }, 400);
    }

    const fileExt = extname(file.name);
    const fileName = `${uuidv4()}${fileExt}`;
    // uploadsフォルダへの相対パスを使用
    const filePath = join("uploads", "img", fileName);
    console.log("Generated file path:", filePath);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ファイルを保存
    await writeFile(filePath, buffer);

    const item: ItemsInsert = {
      name: name,
      price: Number(price),
      store_id: storeId,
      // 画像のパスを生成
      // 開発環境でポートが変わることが多いため、パスのみ指定
      // 使用時はconfig.urlを前につける
      img_url: `/uploads/img/${fileName}`,
    };

    await addItem(item);

    return c.json({
      message: "Item added successfully",
    }, 201);

  } catch (error) {
    console.error("Error in storeAddItem:", error);
    return c.json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
}

export async function getAllItem(c: Context) {
  try {
    const result = await getAllItems();
    return c.json(result, 200);
  } catch (error) {
    console.error("Error in getAllItem:", error);
    return c.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}