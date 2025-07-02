# 🚀 Party Budget Bliss - API Integration Guide

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Budget Management](#budget-management)
4. [Activity Management](#activity-management)
5. [Accommodation Management](#accommodation-management)
6. [Menu Management](#menu-management)
7. [Product Management](#product-management)
8. [Transport Management](#transport-management)
9. [Task Management](#task-management)
10. [Notification Management](#notification-management)
11. [Analytics](#analytics)

---

## 🔐 Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u1",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "sales"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 👥 User Management

### Get Users
```http
GET /api/users?page=1&limit=10&role=admin
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "u1",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Update User
```http
PUT /api/users/u1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "sales"
}
```

---

## 💰 Budget Management

### Get Budgets
```http
GET /api/budgets?page=1&limit=10&status=pending&clientName=John
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "b1",
        "name": "John's Bachelor Party",
        "clientName": "John",
        "eventType": "Bachelor Party",
        "eventDate": "2024-07-15",
        "guestCount": 12,
        "status": "pending",
        "totalAmount": 3200,
        "mealsAmount": 1000,
        "activitiesAmount": 1000,
        "transportAmount": 200,
        "accommodationAmount": 1000,
        "createdAt": "2024-05-01T00:00:00Z",
        "updatedAt": "2024-05-01T00:00:00Z",
        "selectedMenus": [],
        "selectedAccommodations": [],
        "templateId": "t1"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Create Budget
```http
POST /api/budgets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Event",
  "clientName": "Client Name",
  "eventType": "Bachelor Party",
  "eventDate": "2024-08-15",
  "guestCount": 10,
  "totalAmount": 2500,
  "mealsAmount": 800,
  "activitiesAmount": 800,
  "transportAmount": 100,
  "accommodationAmount": 800,
  "templateId": "t1"
}
```

### Update Budget Status
```http
PATCH /api/budgets/b1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "reserva"
}
```

---

## 🎯 Activity Management

### Get Activities
```http
GET /api/activities?page=1&limit=10&category=adventure&isActive=true
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "1",
        "name": "Go-Karting Championship",
        "description": "High-speed go-kart racing with professional timing",
        "basePrice": 85,
        "duration": 2,
        "maxCapacity": 20,
        "category": "adventure",
        "transportRequired": true,
        "transportCost": 25,
        "location": "SpeedZone Racing",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Create Activity
```http
POST /api/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Activity",
  "description": "Activity description",
  "basePrice": 100,
  "duration": 3,
  "maxCapacity": 15,
  "category": "outdoor",
  "transportRequired": false,
  "location": "Activity Location",
  "isActive": true
}
```

---

## 🏨 Accommodation Management

### Get Accommodations
```http
GET /api/accommodations?page=1&limit=10&roomType=suite&isActive=true
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "a1",
        "name": "Grand Hotel",
        "description": "Luxury hotel in the city center",
        "roomType": "suite",
        "pricePerNight": 250,
        "maxOccupancy": 4,
        "amenities": ["WiFi", "Breakfast", "Pool"],
        "location": "City Center",
        "rating": 5,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Create Accommodation
```http
POST /api/accommodations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Hotel",
  "description": "Hotel description",
  "roomType": "double",
  "pricePerNight": 150,
  "maxOccupancy": 2,
  "amenities": ["WiFi", "Breakfast"],
  "location": "Downtown",
  "rating": 4,
  "isActive": true
}
```

---

## 🍽️ Menu Management

### Get Menus
```http
GET /api/menus?page=1&limit=10&type=dinner&isActive=true
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "m1",
        "name": "Premium Dinner",
        "description": "Gourmet dinner menu",
        "type": "dinner",
        "pricePerPerson": 45,
        "minPeople": 10,
        "maxPeople": 50,
        "restaurant": "Fine Dining",
        "items": [
          {
            "id": "i1",
            "name": "Beef Steak",
            "quantity": 1,
            "unit": "piece",
            "pricePerUnit": 25,
            "notes": "Medium rare"
          }
        ],
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Create Menu
```http
POST /api/menus
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Menu",
  "description": "Menu description",
  "type": "lunch",
  "pricePerPerson": 30,
  "minPeople": 5,
  "maxPeople": 30,
  "restaurant": "Restaurant Name",
  "items": [
    {
      "name": "Main Course",
      "quantity": 1,
      "unit": "piece",
      "pricePerUnit": 20,
      "notes": "Optional notes"
    }
  ],
  "isActive": true
}
```

---

## 📦 Product Management

### Get Products
```http
GET /api/products?page=1&limit=10&category=meat&isActive=true
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "p1",
        "name": "Beef Ribs",
        "description": "Premium beef ribs for asado",
        "category": "meat",
        "unit": "kg",
        "estimatedPrice": 25.00,
        "supplier": "Carnes Premium",
        "notes": "Order 24h in advance",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "category": "meat",
  "unit": "kg",
  "estimatedPrice": 20.00,
  "supplier": "Supplier Name",
  "notes": "Optional notes",
  "isActive": true
}
```

---

## 🚗 Transport Management

### Get Transports
```http
GET /api/transports?page=1&limit=10&vehicleType=bus&isActive=true
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "t1",
        "name": "Minivan Ejecutiva",
        "description": "Minivan de lujo para grupos pequeños",
        "vehicleType": "minivan",
        "capacity": 8,
        "pricePerHour": 45,
        "pricePerKm": 2.5,
        "includesDriver": true,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Create Transport
```http
POST /api/transports
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Transport",
  "description": "Transport description",
  "vehicleType": "car",
  "capacity": 4,
  "pricePerHour": 30,
  "pricePerKm": 1.5,
  "includesDriver": true,
  "isActive": true
}
```

---

## ✅ Task Management

### Get Tasks
```http
GET /api/tasks?page=1&limit=10&status=todo&type=cooking&assignedToRole=cook
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "task1",
        "title": "Prepare Dinner Menu",
        "description": "Prepare ingredients for dinner service",
        "type": "cooking",
        "status": "todo",
        "priority": "high",
        "assignedTo": "cook1",
        "assignedToRole": "cook",
        "dueDate": "2024-07-15T18:00:00Z",
        "estimatedDuration": 2,
        "createdAt": "2024-07-14T00:00:00Z",
        "updatedAt": "2024-07-14T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "type": "logistics",
  "priority": "medium",
  "assignedTo": "user1",
  "assignedToRole": "logistics",
  "dueDate": "2024-07-15T18:00:00Z",
  "estimatedDuration": 1
}
```

### Update Task Status
```http
PATCH /api/tasks/task1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress"
}
```

---

## 🔔 Notification Management

### Get Notifications
```http
GET /api/notifications?page=1&limit=10&read=false&role=admin
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "text": "New budget approved",
        "time": "2024-07-14T10:30:00Z",
        "read": false,
        "role": "admin",
        "type": "success",
        "createdAt": "2024-07-14T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Mark as Read
```http
PATCH /api/notifications/1/read
Authorization: Bearer <token>
```

---

## 📊 Analytics

### Dashboard Stats
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBudgets": 25,
    "activeBudgets": 8,
    "completedBudgets": 12,
    "reservaBudgets": 5,
    "totalRevenue": 75000,
    "pendingTasks": 15,
    "completedTasks": 45,
    "overdueTasks": 3,
    "upcomingEvents": [
      {
        "id": "b1",
        "clientName": "John",
        "eventType": "Bachelor Party",
        "eventDate": "2024-07-15",
        "guestCount": 12,
        "totalAmount": 3200
      }
    ],
    "urgentTasks": [
      {
        "id": "task1",
        "title": "Urgent Task",
        "dueDate": "2024-07-14T18:00:00Z",
        "type": "cooking"
      }
    ]
  }
}
```

### Budget Stats
```http
GET /api/analytics/budgets?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBudgets": 25,
    "totalRevenue": 75000,
    "averageBudget": 3000,
    "budgetsByStatus": {
      "pending": 8,
      "reserva": 5,
      "completed": 12
    },
    "revenueByMonth": [
      {
        "month": "2024-01",
        "revenue": 12000,
        "budgetCount": 4
      }
    ]
  }
}
```

---

## 🔧 Implementation Steps

### 1. Environment Setup
Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

### 2. Update Store Integration
Replace mock data with API calls in your store:

```typescript
// Example: Update store to use API
import { apiServices } from '../services/api';

// In your store actions
const loadBudgets = async () => {
  try {
    const response = await apiServices.budgets.getBudgets();
    set({ budgets: response.data.data });
  } catch (error) {
    console.error('Error loading budgets:', error);
  }
};
```

### 3. Error Handling
Implement proper error handling:

```typescript
// Global error handler
const handleApiError = (error: ApiError) => {
  if (error.status === 401) {
    // Handle unauthorized
    navigate('/login');
  } else if (error.status === 403) {
    // Handle forbidden
    showToast('Access denied', 'error');
  } else {
    // Handle other errors
    showToast(error.message, 'error');
  }
};
```

### 4. Loading States
Add loading states to your components:

```typescript
const [isLoading, setIsLoading] = useState(false);

const loadData = async () => {
  setIsLoading(true);
  try {
    const response = await apiServices.budgets.getBudgets();
    setBudgets(response.data.data);
  } catch (error) {
    handleApiError(error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📝 Data Types Summary

### Required Fields for Each Entity:

**User:**
- `id`, `name`, `email`, `role`, `createdAt`, `updatedAt`

**Budget:**
- `id`, `name`, `clientName`, `eventType`, `eventDate`, `guestCount`, `status`, `totalAmount`, `createdAt`, `updatedAt`

**Activity:**
- `id`, `name`, `description`, `basePrice`, `duration`, `maxCapacity`, `category`, `transportRequired`, `location`, `isActive`

**Accommodation:**
- `id`, `name`, `description`, `roomType`, `pricePerNight`, `maxOccupancy`, `amenities`, `location`, `rating`, `isActive`

**Menu:**
- `id`, `name`, `description`, `type`, `pricePerPerson`, `minPeople`, `maxPeople`, `restaurant`, `items`, `isActive`

**Product:**
- `id`, `name`, `description`, `category`, `unit`, `estimatedPrice`, `supplier`, `isActive`

**Transport:**
- `id`, `name`, `description`, `vehicleType`, `capacity`, `pricePerHour`, `includesDriver`, `isActive`

**Task:**
- `id`, `title`, `description`, `type`, `status`, `priority`, `assignedTo`, `assignedToRole`, `dueDate`, `estimatedDuration`

**Notification:**
- `id`, `text`, `time`, `read`, `role`, `type`

---

## 🚀 Best Practices

1. **Use the provided API service layer** for all backend communication
2. **Implement proper error handling** for all API calls
3. **Add loading states** to improve user experience
4. **Use pagination** for large data sets
5. **Implement caching** for frequently accessed data
6. **Add retry logic** for failed requests
7. **Use proper authentication** with JWT tokens
8. **Validate data** on both client and server side

This documentation provides everything you need to integrate your RESTful backend with the Party Budget Bliss application! 🎉 