# Deployment Guide

DataMart is fully optimized for Vercel deployment.

## 1. Push to GitHub
Create a private repository on GitHub and push your local code there.

## 2. Import into Vercel
- Go to Vercel and select "Add New..." -> "Project"
- Import your GitHub repository
- Leave the framework preset as "Next.js"

## 3. Configure Environment Variables
In the Vercel deployment settings, add all the variables from your `.env` file.
**Important:** Ensure your `NEXTAUTH_URL` is set to your actual Vercel production domain.

## 4. Deploy
Click "Deploy" and wait for the build to complete.
Once finished, your marketplace is live!
