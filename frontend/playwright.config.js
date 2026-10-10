// Tests de bout en bout : parcours catalogue → fiche → simulateur, sur l'API et le site construits pour la
// production. La base est créée à partir des seules données versionnées (le classeur db.xlsx ne l'est pas).
import os from 'node:os';
import path from 'node:path';

import { defineConfig, devices } from '@playwright/test';

const python = process.env.PYTHON ?? 'venv/bin/python';
const db = path.join(os.tmpdir(), 'aquarius-e2e.db');
const load = ['fish_data.py', 'plants.py', 'invertebrates.py'].map((script) => `${python} ${script}`).join(' && ');

export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.e2e.js',
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://127.0.0.1:3055', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: `rm -f ${db} && ${load} && ${python} -m flask --app app run --port 5055`,
      cwd: '../backend',
      env: { AQUARIUS_DSN: `sqlite:///${db}` },
      url: 'http://127.0.0.1:5055/poissons',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npx next build && npx next start -p 3055',
      env: { BACKEND_URL: 'http://127.0.0.1:5055', NEXT_TELEMETRY_DISABLED: '1' },
      url: 'http://127.0.0.1:3055',
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    },
  ],
});
