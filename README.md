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
   NAME                           VALUE
   CLERK_JWT_ISSUER_DOMAIN        https://flowing-pangolin-4.clerk.accounts.dev
   CLERK_JWT_KEY                  
   CLERK_SECRET_KEY               Secret Key from clerk API keys section
   CLIENT_ORIGIN                  https://main.dlriba99c1q5m.amplifyapp.com
   GITHUB_TOKEN                   Personal github token
   OPENAI_API_KEY                 Personal OpenAI API key
   VITE_CLERK_PUBLISHABLE_KEY     Publishable Key from clerk API keys section

2. Clone the repository:
   ```bash
   git clone https://github.com/SWE-Group6/phase2.git

3. Navigate into the project directory:
   ```bash
   cd phase2
4. Install the necessary dependencies:
   ```bash
   npm install
5. Run NPM project and follow steps to construct new Convex project
   ```bash
   npm run dev
6. Run Tests
   ```bash
   npm run test
7. Run Production 
   ```bash
   npm run build
8. View production build locally
   ```bash
   npm run preview

