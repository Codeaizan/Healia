# Perfect Vision - Clinic Management System

A comprehensive clinic management system designed to streamline patient management, appointments, billing, and inventory control.

## Features

### 1. User Authentication
- Role-based access control (Admin and Reception)
- Secure login system
- User profile management

### 2. Patient Management
- Add and manage patient records
- Comprehensive patient history
- Search patients by name or phone number
- View detailed patient information

### 3. Appointment System
- Schedule and manage appointments
- Calendar view for appointments
- Track patient visits

### 4. Medicine Inventory
- Manage medicine stock
- Track medicine expiry dates
- Low stock alerts
- Medicine purchase history

### 5. Billing System
- Generate bills for consultations and medicines
- PDF generation for bills
- Track payments and revenue
- Print bills with clinic details

### 6. Settings & Administration
- System preferences management
- Dark mode toggle
- Database management
- Print patient records

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd perfect-vision
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Default Login Credentials

Guest:
- Username: guest
- Password: 1234

## Application Walkthrough

1. **Login Page**
   - Enter your credentials
   - System will redirect to dashboard based on role

2. **Dashboard**
   - Overview of daily appointments
   - Quick access to key features
   - System notifications and alerts

3. **Patients Section**
   - Add new patients
   - Search existing patients
   - View patient history
   - Schedule appointments

4. **Medicine Inventory**
   - Add/Update medicine stock
   - View medicine details
   - Track expiry dates
   - Monitor low stock items

5. **Billing**
   - Generate new bills
   - Add medicines to bills
   - Print bills
   - View billing history

6. **Settings**
   - Toggle dark mode
   - Manage system preferences
   - Database management
   - Print reports

## Technical Stack

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vite
- IndexedDB (Dexie.js)

## Support

For support, please contact Faizanur Rahman.

---
Developed by Faizanur Rahman