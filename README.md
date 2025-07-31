# Test Analyzer

Detect flaky tests across any framework by running your test command multiple times and analyzing the results.

## Usage

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the analyzer**
   ```bash
   npx tsc
   node dist/main.js --command "npm test" --repeat 10
   ```
   - `--command` – shell command to execute for each run
   - `--repeat`  – number of times to run the command (default: `10`)

   The command output is parsed for lines matching `✓ Test Name` or `✕ Test Name` and a `results.json` file is produced.

3. **View the report**
   - Navigate to the `ui` folder and install its dependencies: `npm install`
   - Run the development server: `npm run dev`
   - Open the provided URL to see the dashboard

## Flake Score

`flakeScore` is the percentage of runs where a test failed. A test is considered **flaky** if it fails at least once.

Example summary output:
```
🧪 Flaky Tests (3):
 - "Login fails with 500" — 4/10 failed (flakeScore: 40%)
 - "Search results persist" — 2/10 failed (flakeScore: 20%)
```
