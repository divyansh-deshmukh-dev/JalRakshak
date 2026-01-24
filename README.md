# JalRakshak - Water Quality Monitoring System

A comprehensive water quality monitoring system for Indore city that uses AI-powered image analysis to assess water contamination levels and provide real-time monitoring capabilities.

## 🌊 Features

- **AI-Powered Water Analysis**: Uses Google Gemini AI to analyze water quality from images
- **Real-Time Monitoring**: Live sensor data tracking and visualization
- **Citizen Reporting**: Allow citizens to report water quality issues with photo uploads
- **Admin Dashboard**: Comprehensive dashboard for water quality management
- **Heatmap Visualization**: Geographic visualization of water quality data
- **Alert System**: Automated alerts for dangerous contamination levels
- **Multi-Ward Support**: Ward-wise water quality tracking for Indore

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 with TypeScript
- **UI Components**: Radix UI + Tailwind CSS
- **Maps**: React Leaflet for geographic visualization
- **Charts**: Recharts for data visualization
- **State Management**: React Context API

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.11
- **AI Integration**: Google Gemini AI for image analysis
- **Database**: Firebase Firestore
- **Image Processing**: PIL (Pillow)
- **File Storage**: Local storage with static file serving

## 🚀 Live Demo

- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend API**: `https://your-backend-name.onrender.com`

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Firebase project with Firestore enabled
- Google Gemini API key

## 🛠️ Local Development Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd JalRakshak/JalRakshak
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Add your credentials to .env:
# GEMINI_API_KEY=your_gemini_api_key
# FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Run backend
python main.py
```

### 3. Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your backend URL to .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run frontend
npm run dev
```

### 4. Access Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

## 🔐 Admin Login Credentials

### Admin Access
- **Email**: `admin@indore.gov.in`
- **Password**: `password`

> **Note**: Use these credentials to access the admin dashboard and manage water quality monitoring system.

## 🌐 Deployment on Render

### Backend Deployment
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT_JSON`

### Frontend Deployment
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Environment**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables:
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com`

## 📁 Project Structure

```
JalRakshak/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (public)/          # Public citizen pages
│   │   ├── admin/             # Admin dashboard pages
│   │   └── contexts/          # React contexts
│   ├── components/            # React components
│   │   ├── admin/            # Admin-specific components
│   │   ├── public/           # Public-facing components
│   │   ├── shared/           # Shared components
│   │   └── ui/               # UI component library
│   ├── data/                 # Mock data and constants
│   ├── lib/                  # Utility functions and API calls
│   └── ai/                   # AI integration (local development)
├── main.py                   # FastAPI backend entry point
├── database.py               # Firebase database operations
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
├── Dockerfile               # Docker configuration
└── render.yaml              # Render deployment config
```

## 🔧 API Endpoints

### Core Endpoints
- `GET /` - Health check
- `POST /process-citizen-report` - Submit citizen water quality report
- `POST /process-sample` - Process water sample with sensor data
- `GET /reports` - Get all water quality reports
- `GET /get-incidents` - Get incident data for map visualization
- `GET /heatmap-data` - Get heatmap data
- `GET /get-alerts` - Get recent alerts

## 🎯 Key Features Explained

### AI Water Quality Analysis
- Compares uploaded water images against reference clean water image
- Estimates pH and turbidity levels from visual analysis
- Provides contamination assessment and safety recommendations
- Supports multiple Gemini AI models with fallback options

### Real-Time Monitoring
- Simulated sensor data with realistic variations
- Auto-refresh every 5 seconds
- Status indicators (Safe/Moderate/Unsafe)
- Historical data tracking

### Geographic Visualization
- Interactive maps using Leaflet
- Heatmap overlay for contamination levels
- Ward-wise data segregation
- Incident markers with detailed information

### Alert System
- Automated alerts for dangerous contamination
- Severity-based classification
- Real-time notifications
- Alert acknowledgment system

## 🔐 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧪 Testing

### Backend Testing
```bash
# Test API endpoints
curl http://localhost:8000/
curl http://localhost:8000/reports
```

### Frontend Testing
```bash
# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs` endpoint
- Review the troubleshooting section in deployment logs

## 🔄 Version History

- **v2.0** - Full-stack deployment with AI integration
- **v1.0** - Initial release with basic monitoring features

---

**Built with ❤️ for cleaner water in Indore**