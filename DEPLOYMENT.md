# Deployment Guide: Frontend and Backend on Different Servers

This guide explains how to configure the application when running the frontend and backend on different servers.

## Potential Issues

When running frontend and backend on different servers, you may encounter:

1. **CORS (Cross-Origin Resource Sharing) errors** - Browser blocks requests from different origins
2. **API URL configuration** - Frontend needs to know where the backend is located
3. **File upload issues** - May need additional CORS configuration

## Configuration Steps

### Backend Configuration

1. **Update CORS settings** in `server/server.js`:
   - The current configuration allows all origins (`*`)
   - For production, you can restrict to specific frontend URL by setting `FRONTEND_URL` environment variable

2. **Set environment variables** (create `server/.env`):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   FRONTEND_URL=https://your-frontend-domain.com  # Optional: restrict CORS to specific origin
   ```

3. **Start the backend server**:
   ```bash
   cd server
   npm install
   npm start
   ```

### Frontend Configuration

1. **Create `.env` file** in `vite-project/` directory:
   ```env
   VITE_API_URL=https://your-backend-server.com:5000
   ```
   Or if using a different port:
   ```env
   VITE_API_URL=http://api.yourdomain.com
   ```

2. **Build the frontend**:
   ```bash
   cd vite-project
   npm install
   npm run build
   ```

3. **Deploy the built files**:
   - The `dist/` folder contains the production build
   - Deploy this folder to your frontend server (Netlify, Vercel, AWS S3, etc.)

## Example Configurations

### Development (Local)
- Frontend: `http://localhost:5173` (Vite default)
- Backend: `http://localhost:5000`
- `.env` in `vite-project/`: `VITE_API_URL=http://localhost:5000`

### Production (Different Servers)
- Frontend: `https://promptmasters.com`
- Backend: `https://api.promptmasters.com`
- `.env` in `vite-project/`: `VITE_API_URL=https://api.promptmasters.com`
- `server/.env`: `FRONTEND_URL=https://promptmasters.com` (optional, for CORS restriction)

## Files That Need Changes

### Backend (`server/`)
- ✅ **Already configured**: `server/server.js` has CORS enabled
- ⚙️ **Optional**: Set `FRONTEND_URL` in `server/.env` to restrict CORS to specific origin

### Frontend (`vite-project/`)
- ✅ **Already configured**: Uses `VITE_API_URL` environment variable
- ⚙️ **Required**: Create `.env` file with `VITE_API_URL` pointing to your backend server

## Testing Cross-Origin Setup

1. Start backend on one server/port
2. Start frontend on another server/port
3. Check browser console for CORS errors
4. If errors occur, verify:
   - Backend CORS is enabled
   - Frontend `.env` has correct `VITE_API_URL`
   - Backend server is accessible from frontend server

## Troubleshooting

### CORS Error: "Access-Control-Allow-Origin"
- **Solution**: Ensure `cors()` middleware is enabled in `server/server.js`
- Check that backend is running and accessible

### API Calls Failing
- **Solution**: Verify `VITE_API_URL` in frontend `.env` matches your backend URL
- Check network tab in browser DevTools to see the actual request URL

### File Uploads Not Working
- **Solution**: Current CORS configuration supports file uploads
- Ensure backend server allows file uploads (multer is configured)

## Notes

- The frontend uses a centralized API configuration in `src/config/api.js`
- All API calls automatically use the `VITE_API_URL` environment variable
- CORS is configured to allow credentials if needed in the future
- For production, consider restricting CORS to specific origins for security

