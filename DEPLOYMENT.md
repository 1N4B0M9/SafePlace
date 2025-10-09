# SafePlace - Vercel Deployment Guide

This application has been configured for deployment to Vercel with environment variables for sensitive data.

## Environment Variables

The following environment variables need to be set in your Vercel project:

### Required Environment Variables:
- `MONGODB_URI` - Your MongoDB connection string
- `MONGODB_DATABASE` - Database name (default: UserData)
- `MONGODB_COLLECTION` - Collection name (default: UserDataCollection)
- `GOOGLE_MAPS_API_KEY` - Your Google Maps API key

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   After deployment, go to your Vercel dashboard and add the environment variables:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add each variable with the appropriate values

### Option 2: Deploy via GitHub

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Set Environment Variables**:
   - In the Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add the required environment variables

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create .env file** (copy from .env.example):
   ```bash
   cp .env.example .env
   ```

3. **Update .env with your values**:
   - Replace the placeholder values with your actual credentials

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Project Structure

- `index.js` - Main server file (Vercel-compatible)
- `vercel.json` - Vercel configuration
- `public/` - Static files (HTML, CSS, images)
- `.env` - Environment variables (local development)
- `.gitignore` - Excludes sensitive files from git

## API Endpoints

- `GET /api/reports` - Fetch all reports
- `POST /api/report` - Submit a new report
- `GET /` - Home page with map
- `GET /reports.html` - Reports directory
- `GET /reporting.html` - Report submission form

## Notes

- The application maintains backward compatibility with legacy routes (`/reports`, `/report`)
- All sensitive data is now stored in environment variables
- The app works both locally and on Vercel with the same codebase
- MongoDB connection is optimized for serverless environments
