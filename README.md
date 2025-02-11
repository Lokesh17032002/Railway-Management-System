# Railway-Management-System

This project is a backend API for a railway management system. In this, the users can search for trains, check seat availability, book tickets, and view booking details. Admins can manage train data such as Adding trains, updating seats etc.
---

## **Features**
1. User and Admin registration, login, and logout.
2. Train management (add/update trains, check availability).
3. Seat booking with race condition handling.
4. Role-based access control with JWT and API keys.
5. Protected admin APIs for secure operations.

---

## **Routes**
1. For Users
    - **Register**: 'https://localhost:5000/api/user/register'
    - **Login**: 'https://localhost:5000/api/user/login'
    - **Logout**: 'https://localhost:5000/api/user/logout'

2. For Admin
    - **Register**: 'https://localhost:5000/api/admin/register'
    - **Login**: 'https://localhost:5000/api/admin/login'
    - **Logout**: 'https://localhost:5000/api/admin/logout'

3. To add, update, search trains and seats
    - **Add**: 'https://localhost:5000/api/train/add'
    - **Update**: 'https://localhost:5000/api/train/update/:trainId'
    - **Search Train**: 'https://localhost:5000/api/train/search'
    - **Seat Avaibility**: 'https://localhost:5000/api/train/availability/:trainId'

3. For Booking
    - **Book Seat**: 'https://localhost:5000/api/booking/book'
    - **Update**: 'https://localhost:5000/api/booking/details/:bookingId'

---

## **Tech Stack**
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT and Bcrypt
- **Validation**: Express-validator

## Create a .env file in the root directory with the following variables:

- DB_USER=your_db_user
- DB_PASSWORD=your_db_password
- DB_HOST=localhost
- DB_PORT=5432
- DB_NAME=railway_management
- ADMIN_API_KEY=your_admin_api_key
- JWT_SECRET=your_jwt_secret
- PORT=5000

---

## **Setup Instructions**

### Prerequisites
1. **PostgreSQL**: Ensure PostgreSQL is installed and running.
2. **Node.js**: Make sure Node.js is installed.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/railway-management-api.git
   cd railway-management-api
