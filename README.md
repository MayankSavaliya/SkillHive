# 🎓 SkillHive - Modern Learning Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary">
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io">
</div>

<br>

<div align="center">
  <h3>🚀 A comprehensive e-learning platform built with modern web technologies</h3>
  <p>Create, sell, and learn with our feature-rich learning management system</p>
</div>

---

## ✨ Key Features

### 🎯 For Students
- **🔍 Smart Course Discovery**: Browse courses with advanced search, filtering, and categorization
- **📚 Progress Tracking**: Real-time learning progress with completion statistics
- **🎥 HD Video Learning**: High-quality video streaming with progress tracking and playback control
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **🌙 Dark Mode**: Eye-friendly learning with automatic theme switching
- **� Personal Dashboard**: Comprehensive learning analytics and achievement tracking
- **🏆 Course Completion**: Certificate-worthy completion tracking and milestones
- **🔔 Real-time Notifications**: Instant updates on course progress and announcements

### 👨‍🏫 For Instructors
- **📖 Intuitive Course Builder**: Rich course creation with drag-and-drop lecture management
- **🎬 Video Management**: Seamless video upload and streaming via Cloudinary
- **💰 Revenue Analytics**: Detailed earning reports and student engagement metrics
- **📊 Performance Dashboard**: Track course performance, student progress, and feedback
- **✏️ Content Management**: Easy editing of courses, lectures, and descriptions
- **🔄 Publishing Control**: Smart publish/unpublish with validation system
- **💬 Student Communication**: Direct messaging and notification system
- **📈 Growth Insights**: Analytics for course optimization and student acquisition

### 🏛️ Admin Panel
- **� User Management**: Comprehensive user control with role-based permissions
- **📚 Course Moderation**: Review, approve, and manage all platform courses
- **📊 Platform Analytics**: Revenue tracking, enrollment statistics, and growth metrics
- **⚙️ System Settings**: Platform configuration and feature management
- **�️ Security Controls**: User verification and content moderation tools
- **📧 Communication Hub**: Bulk notifications and system announcements

### 💳 E-commerce & Payments
- **🛒 Secure Checkout**: Stripe-powered payment processing with multiple payment methods
- **💰 Flexible Pricing**: Support for free and premium courses with dynamic pricing
- **📄 Purchase History**: Complete transaction tracking and receipt management
- **🔐 Access Control**: Automatic enrollment and course access management
- **🎫 Subscription Management**: Course bundles and subscription-based learning

## 🏗️ Technology Stack

### Frontend
- **⚛️ React 18** - Modern UI library with hooks and concurrent features
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **🧩 Shadcn/ui** - Beautiful, accessible component library built on Radix UI
- **🔄 Redux Toolkit** - Predictable state management with RTK Query for data fetching
- **🛣️ React Router v6** - Declarative routing with nested routes and data loading
- **📝 React Quill** - Rich text editor for course content creation
- **🎥 React Player** - Universal video player component with multiple format support
- **⚡ Vite** - Lightning-fast build tool and development server
- **🎯 Lucide React** - Beautiful, customizable icons
- **🎬 Framer Motion** - Smooth animations and micro-interactions
- **🔥 Firebase Auth** - Secure authentication with social login support
- **📡 Socket.io Client** - Real-time bidirectional communication
- **📊 Recharts** - Composable charting library for analytics dashboards

### Backend
- **🟢 Node.js** - JavaScript runtime for scalable network applications
- **🚀 Express.js** - Fast, unopinionated web application framework
- **🍃 MongoDB** - NoSQL database with Mongoose ODM for elegant modeling
- **� Firebase Admin** - Server-side Firebase integration for authentication
- **☁️ Cloudinary** - Cloud-based media management and optimization
- **💳 Stripe** - Complete payment processing with webhooks
- **📁 Multer** - Middleware for handling multipart/form-data
- **📡 Socket.io** - Real-time engine for instant communication
- **📧 Nodemailer** - Email sending capability for notifications
- **� CORS** - Cross-origin resource sharing configuration
- **🔒 Security** - JWT tokens, input validation, and rate limiting

### Development & Deployment
- **� Vercel** - Serverless deployment platform
- **🔧 ESLint** - Code linting and formatting
- **🎨 PostCSS** - CSS post-processing with Autoprefixer
- **🔄 Git** - Version control and collaboration

## �🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Firebase Project** (for authentication)
- **Stripe Account** (for payment processing)
- **Cloudinary Account** (for media storage)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/skillhive.git
cd skillhive
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
# Database
MONGO_URI=mongodb://localhost:27017/skillhive
# or use MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillhive

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
WEBHOOK_ENDPOINT_SECRET=whsec_your_webhook_secret

# Server Configuration
PORT=8080
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd ../client
npm install
```

Create `.env` file in client directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-your_measurement_id

# API Configuration
VITE_SERVER_URL=http://localhost:8080
```

Start the frontend:
```bash
npm run dev
```

### 4️⃣ Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

## 🎨 Design System

### Modern UI/UX Features
- **🎨 Glass-morphism Effects** - Beautiful frosted glass components
- **🌈 Gradient Backgrounds** - Eye-catching color transitions
- **✨ Smooth Animations** - Framer Motion powered micro-interactions
- **📱 Mobile-First Design** - Responsive across all screen sizes
- **🌙 Dark Mode Support** - Complete theme switching with system preference detection
- **♿ Accessibility** - WCAG 2.1 compliant with keyboard navigation
- **🎯 Interactive Elements** - Hover effects, loading states, and feedback
- **📊 Data Visualization** - Beautiful charts and progress indicators

### Component Library
- **🔘 Buttons** - Multiple variants with loading and disabled states
- **📋 Tables** - Sortable, filterable data tables with pagination
- **🎭 Modals** - Accessible dialog components with focus management
- **📊 Progress Bars** - Animated progress indicators with customizable styles
- **🏷️ Badges** - Status indicators and category tags
- **🔍 Search** - Advanced search with filters and autocomplete
- **📱 Navigation** - Responsive navigation with mobile-friendly menus

## � Security Features

- **� Firebase Authentication** - Secure user authentication with social login support
- **🛡️ JWT Tokens** - Stateless authentication with automatic token refresh
- **� Route Protection** - Role-based access control for different user types
- **🔒 CORS Configuration** - Secure cross-origin request handling
- **💳 PCI Compliance** - Stripe integration for secure payment processing
- **🛡️ Input Validation** - Server-side validation and sanitization
- **� Environment Variables** - Secure configuration management

## 📚 API Documentation

### Authentication Endpoints
- `POST /user/auth/firebase` - Firebase authentication
- `POST /user/auth/firebase/signup` - User registration
- `POST /user/auth/firebase/logout` - User logout
- `GET /user/profile` - Get user profile
- `PUT /user/profile/update` - Update user profile

### Course Management
- `GET /course/published-courses` - Get all published courses
- `GET /course/search` - Search courses with filters
- `POST /course` - Create new course (Instructor)
- `PUT /course/:id` - Update course (Instructor)
- `GET /course/:id` - Get course details

### Payment & Enrollment
- `POST /purchase/checkout/create-checkout-session` - Create Stripe session
- `GET /purchase/course/:id/detail-with-status` - Get course with purchase status
- `GET /purchase` - Get user's purchased courses

### Progress Tracking
- `GET /progress/:courseId` - Get course progress
- `POST /progress/:courseId/lecture/:lectureId/view` - Mark lecture as viewed
- `POST /progress/:courseId/complete` - Mark course as completed

## 🎯 Core Features Deep Dive

### Real-time Communication
- **� Socket.io Integration** - Instant notifications and updates
- **🔔 Push Notifications** - Course updates and system announcements
- **💬 Live Chat** - Direct communication between instructors and students
- **📊 Live Analytics** - Real-time enrollment and progress tracking

### Content Management
- **📝 Rich Text Editor** - WYSIWYG editor for course descriptions
- **� Video Processing** - Automatic video optimization and streaming
- **📱 Responsive Media** - Adaptive video quality based on device and connection
- **🔄 Version Control** - Track changes to course content

### Analytics & Reporting
- **📊 Student Analytics** - Learning progress and engagement metrics
- **� Revenue Tracking** - Detailed financial reports for instructors
- **📈 Growth Metrics** - Platform-wide analytics for administrators
- **🎯 Performance Insights** - Course optimization recommendations

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Vercel Serverless)
1. Configure `vercel.json` for serverless functions
2. Set environment variables for production
3. Update CORS settings for production domain

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Configure network access and security
3. Update connection string in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 Environment Variables

### Required Frontend Variables
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_SERVER_URL=
```

### Required Backend Variables
```env
MONGO_URI=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
WEBHOOK_ENDPOINT_SECRET=
```

---

<div align="center">
  <p>Built with ❤️ by the SkillHive Team</p>
  <p>© 2024 SkillHive. All rights reserved.</p>
</div>
