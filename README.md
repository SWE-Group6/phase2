# NPM Replica

This project is an NPM replica that allows you to manage and interact with NPM packages stored in a database. It provides functionalities like uploading, updating, rating, and finding the memory cost of packages. Additionally, other actions are also supported.

## Features
- Upload NPM packages to the database
- Update existing package details
- Rate packages based on user feedback
- Find the memory cost of packages
- Additional actions (more details coming soon)

## Backend
The backend is built using **Convex**, which handles the server-side logic and data storage.

## Setup

To get the project running locally:
1. [Create Convex Account](https://www.convex.dev)

2. Setup clerk cccount, follow steps 1 to 3 in the [Clerk onboarding guide](https://docsconvex.dev/auth/clerk#get-started)

3. Setup environmental variables in convex dashboard (see [docs] (https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances))
CLERK_JWT_ISSUER_DOMAIN https://flowing-pangolin-4.clerk.accounts.dev CLERK_JWT_KEY
CLERK_SECRET_KEY <Secret Key from Clerk API keys section> CLIENT_ORIGIN https://main.dlriba99c1q5m.amplifyapp.com GITHUB_TOKEN <Personal GitHub token> OPENAI_API_KEY <Personal OpenAI API key> VITE_CLERK_PUBLISHABLE_KEY <Publishable Key from Clerk API keys section>

4. Clone the repository and move to repo:
   ```bash
   git clone https://github.com/SWE-Group6/phase2.git
   cd phase2

5. Install the necessary dependencies:
   ```bash
   npm install
6. Run NPM project and follow steps to construct new Convex project
   ```bash
   npm run dev
7. Run Tests
   ```bash
   npm run test
8. Run Production and view locally
   ```bash
   npm run build
   npm run preview


