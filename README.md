# Plivo Service Status Dashboard

A real-time service status monitoring and incident management platform built with Django REST API and React TypeScript frontend.

## 🚀 Features

- **Multi-tenant Architecture**: Organization-based service management
- **Real-time Updates**: WebSocket integration for live status updates
- **Incident Management**: Create, update, and track service incidents
- **Timeline Tracking**: Complete audit trail of all service and incident changes
- **Role-based Access Control**: Admin and Team Member roles with different permissions
- **Team Invitations**: Secure invite system for team members
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠 Tech Stack

### Backend
- **Django 5.2.3**: Python web framework
- **Django REST Framework**: API development
- **Django Simple JWT**: JWT authentication with cookie-based tokens
- **SQLite**: Database (can be easily switched to PostgreSQL/MySQL)
- **WebSockets**: Real-time communication using `websockets` library
- **CORS**: Cross-origin resource sharing support

### Frontend
- **React 19.1.0**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Redux Toolkit**: State management
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **Lucide React**: Icon library
- **Axios**: HTTP client

## 📁 Project Structure

```
assessments/
├── plivo-backend/          # Django REST API
│   ├── mysite/            # Django project settings
│   ├── users/             # User management & authentication
│   ├── services/          # Service & incident management
│   ├── timeline/          # Event tracking system
│   ├── utils/             # Utility functions
│   ├── ws_server.py       # WebSocket server
│   └── start_servers.sh   # Server startup script
└── plivo-frontend/        # React TypeScript app
    ├── src/
    │   ├── _constants/    # TypeScript interfaces & constants
    │   ├── _contexts/     # React contexts
    │   ├── _helpers/      # Utility functions
    │   ├── _redux/        # Redux store & actions
    │   ├── components/    # Reusable UI components
    │   ├── hooks/         # Custom React hooks
    │   ├── pages/         # Page components
    │   └── config/        # Configuration files
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd plivo-backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers websockets
   ```

4. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Start the websocket server**
   ```bash
   chmod +x start_servers.sh
   ./start_servers.sh
   ```

   This will start:
   - Django server on `http://localhost:8000`
   - WebSocket server on `ws://localhost:8765`
   - Internal TCP listener on `localhost:9000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd plivo-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 🔐 Authentication & User Management

### User Roles
- **Admin**: Can manage organization, services, and team members
- **Team Member**: Can view and manage services/incidents (with access granted by admin)

### Authentication Flow
1. **Sign Up**: Users can register as admin (creates organization) or team member (requires invite)
2. **Login**: JWT token stored in HTTP-only cookies
3. **Access Control**: Role-based permissions for different features

### Team Invitation System
- Admins can generate invite links for team members
- Invite links contain encrypted tokens with user information
- Team members sign up using the invite link URL

## 📊 Application Flows

### 1. Organization Setup Flow
```
Admin Sign Up → Create Organization → Invite Team Members → Team Members Join
```

### 2. Service Management Flow
```
Create Service → Set Status → Monitor → Update Status → Track Timeline
```

### 3. Incident Management Flow
```
Service Issue → Create Incident → Update Status → Resolve → Timeline Log
```

### 4. Real-time Updates Flow
```
User Action → Backend Signal → WebSocket Broadcast → Frontend Update → UI Refresh
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/auth/signup/` - User registration
- `POST /api/users/auth/login/` - User login
- `POST /api/users/auth/logout/` - User logout
- `GET /api/users/auth/profile/` - Get user profile

### Organizations
- `GET /api/users/organizations/` - List user organizations
- `GET /api/users/organizations/{id}/` - Get organization details

### Services
- `GET /api/services/` - List services
- `POST /api/services/` - Create service
- `GET /api/services/{id}/` - Get service details
- `PUT /api/services/{id}/` - Update service
- `DELETE /api/services/{id}/` - Delete service

### Incidents
- `GET /api/services/{service_id}/incidents/` - List incidents
- `POST /api/services/{service_id}/incidents/` - Create incident
- `PUT /api/services/{service_id}/incidents/{id}/` - Update incident
- `DELETE /api/services/{service_id}/incidents/{id}/` - Delete incident

### Timeline
- `GET /api/timeline/service/{service_id}/` - Get service timeline
- `GET /api/timeline/organization/{org_id}/` - Get organization timeline

## 🔄 Real-time Features

### WebSocket Integration
- **Room-based messaging**: Each service has its own WebSocket room
- **Automatic updates**: UI updates instantly when data changes
- **Event types**: Service creation/update/deletion, incident management
- **Timeline sync**: Real-time timeline updates across all connected clients

### Signal System
- Django signals trigger WebSocket broadcasts
- Automatic timeline logging for all actions
- Real-time UI updates without page refresh

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Adaptive navigation

### Component Library
- Reusable UI components with Radix UI
- Consistent design system
- Accessible components
- Dark mode ready (can be easily implemented)

### State Management
- Redux for global state
- React Context for auth state
- Optimistic updates
- Error handling and loading states

## 🔧 Development

### Code Structure
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Modular architecture**: Separated concerns

### Testing
- Backend: Django test framework
- Frontend: React Testing Library (can be added)
- API testing: Django REST framework test utilities

### Environment Configuration
- Development settings in Django
- Environment variables for sensitive data
- CORS configuration for local development

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG = False` in settings
2. Configure production database (PostgreSQL recommended)
3. Set up static file serving
4. Configure CORS for production domain
5. Use production WSGI server (Gunicorn)

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve static files from web server
3. Configure API base URL for production
4. Set up HTTPS for secure cookie transmission

## 🔒 Security Features

- JWT tokens in HTTP-only cookies
- CORS protection
- Input validation and sanitization
- Role-based access control
- Secure invite token system
- SQL injection protection (Django ORM)

## 📈 Scalability Considerations

- **Database**: Can easily switch to PostgreSQL/MySQL
- **Caching**: Redis can be added for session/timeline caching
- **Load Balancing**: Multiple Django instances behind load balancer
- **WebSocket Scaling**: Redis pub/sub for WebSocket scaling
- **CDN**: Static assets can be served via CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is for assessment purposes. Please refer to the original requirements for usage terms.

---

**Note**: This is a full-stack application demonstrating modern web development practices with real-time features, proper authentication, and scalable architecture. 