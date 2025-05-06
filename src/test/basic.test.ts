import { test, expect } from "@playwright/test";

test.describe("APIテスト", () => {
	test("ルートエンドポイントが正常に応答する", async ({ request }) => {
		const response = await request.get("/");
		expect(response.status()).toBe(200);
	});

	test("テストエンドポイントが正常に応答する", async ({ request }) => {
		const response = await request.get("/test");
		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body).toHaveProperty("message");
	});
});
