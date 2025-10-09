# Google Maps API Setup Guide

## Current Issue
The Google Maps API is showing an "ApiNotActivatedMapError" which means the Maps JavaScript API is not enabled for your Google Cloud project.

## 🚨 QUICK FIX (Most Common Solution)

1. **Go to Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Select your project** (or create one)
3. **Go to "APIs & Services" > "Library"**
4. **Search for "Maps JavaScript API"**
5. **Click "Enable"** (this is the most important step!)
6. **Wait 1-2 minutes** for the API to activate
7. **Refresh your application** - the error should be gone!

## Solution Options

### Option 1: Enable Billing (Recommended for Production)

1. **Go to Google Cloud Console**:
   - Visit [console.cloud.google.com](https://console.cloud.google.com)

2. **Select Your Project**:
   - Make sure you're in the correct project (or create a new one)

3. **Enable Billing**:
   - Go to "Billing" in the left menu
   - Click "Link a billing account" or "Enable billing"
   - Add a payment method (credit card)

4. **Enable Required APIs** (CRITICAL STEP):
   - Go to "APIs & Services" > "Library"
   - Search for and enable:
     - **"Maps JavaScript API"** (REQUIRED - this is what's causing your error)
     - "Maps Static API" (if needed)
     - "Geocoding API" (if needed)
   - **Make sure to click "Enable" for each API**

5. **Restrict API Key** (Security Best Practice):
   - Go to "APIs & Services" > "Credentials"
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain(s):
     - `localhost:3000/*` (for development)
     - `your-domain.com/*` (for production)
   - Under "API restrictions", select "Restrict key"
   - Choose the APIs you enabled above

### Option 2: Use a Different API Key

If you have another Google Cloud project with billing enabled, you can:

1. **Create a new API key** in that project
2. **Update your .env file**:
   ```bash
   GOOGLE_MAPS_API_KEY=your_new_api_key_here
   ```

### Option 3: Development Mode (Limited Usage)

For development/testing only, you can:

1. **Use the current key** but expect limited functionality
2. **The map will show a watermark** indicating billing is required
3. **Some features may not work** properly

## Cost Information

- **Google Maps API pricing** starts at $7 per 1,000 requests
- **Free tier** includes $200 credit per month (about 28,000 requests)
- **For development**, costs are typically very low

## Update Your Application

After getting a working API key:

1. **Update .env file**:
   ```bash
   GOOGLE_MAPS_API_KEY=your_working_api_key
   ```

2. **Restart your server**:
   ```bash
   npm run dev
   ```

3. **For Vercel deployment**, add the environment variable in your Vercel dashboard

## Testing

Once you have a working API key, test the application:

1. **Start the server**: `npm run dev`
2. **Visit**: `http://localhost:3000`
3. **Check browser console** for any remaining errors
4. **Verify map loads** without billing errors

## Security Notes

- **Never commit API keys** to version control
- **Always restrict API keys** to specific domains
- **Monitor usage** in Google Cloud Console
- **Set up billing alerts** to avoid unexpected charges
