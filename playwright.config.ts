import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/test",
  /* テスト実行の最大時間 */
  timeout: 30 * 1000,
  /* テスト実行間の待機時間 */
  expect: {
    timeout: 5000,
  },
  /* 実行レポートの生成 */
  reporter: "html",
  /* テスト実行の並列化の設定 */
  fullyParallel: true,
  /* 再試行の設定 */
  retries: process.env.CI ? 2 : 0,
  /* 個別のテストケースの独立性 */
  workers: process.env.CI ? 1 : undefined,
  /* テスト実行前後の処理 */
  use: {
    /* テスト実行時のトレース収集 */
    trace: "on-first-retry",
  },
  /* テスト環境の設定 */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  /* Webサーバーの自動起動 */
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
