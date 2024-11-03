Here's a properly formatted version of your README:

# README

## How to Start

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/SWE-Group6/phase1.git
   ```

2. **Copy the `.env` file from `.env.sample`:**

   ```bash
   cp .env.sample .env
   ```

   - Add your `GITHUB_TOKEN` and `OPENAI_API_KEY` in the `.env` file.

3. **Install Packages:**

   ```bash
   ./run install
   ```

4. **Run Test Scripts:**

   ```bash
   ./run test
   ```

5. **Run a Text File Containing Node Packages:**

   ```bash
   ./run <TXT_FILE_URL>
   ```

## How to Run the Express REST API Server

1. **Start the Express Server:**

   ```bash
   npm run start
   ```

2. **Simulate a Call to the API:**

   In another terminal, use `curl` to simulate an API call:

   ```bash
   curl "http://localhost:3000/api/metrics?url=https://github.com/cloudinary/cloudinary_npm"
   ```

## How to Run the Syntax Checker

1. **Clone the Syntax Checker Repository:**

   ```bash
   git clone https://github.com/PurdueDualityLab/ECE461-Part-1-CLI-Checker.git
   ```

2. **Update the `constants.py` File:**

   Add the necessary constants in the `constants.py` file.

3. **Run the Syntax Checker:**

   ```bash
   python checker.py
   ```