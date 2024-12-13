## Setup

To get the project running locally:
1. [Create Convex Account](https://www.convex.dev)

2. Setup clerk cccount, follow steps 1 to 3 in the [Clerk onboarding guide](https://docsconvex.dev/auth/clerk#get-started)

3. Setup environmental variables in convex dashboard (see [docs] (https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances))
CLERK_JWT_ISSUER_DOMAIN https://flowing-pangolin-4.clerk.accounts.dev
CLERK_JWT_KEY
CLERK_SECRET_KEY <Secret Key from Clerk API keys section>
CLIENT_ORIGIN https://main.dlriba99c1q5m.amplifyapp.com
GITHUB_TOKEN <Personal GitHub token>
OPENAI_API_KEY <Personal OpenAI API key>
VITE_CLERK_PUBLISHABLE_KEY <Publishable Key from Clerk API keys section>

5. Clone the repository and move to repo:
   ```bash
   git clone https://github.com/SWE-Group6/phase2.git
   cd phase2

6. Install the necessary dependencies:
   ```bash
   npm install
7. Run NPM project and follow steps to construct new Convex project
   ```bash
   npm run dev
8. Run Tests
   ```bash
   npm run test
9. Run Production and view locally
   ```bash
   npm run build
   npm run preview


