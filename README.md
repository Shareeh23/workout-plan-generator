# Workout Plan Generator

A comprehensive workout and nutrition planning application that helps users generate personalized workout plans and track their nutrition.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)
- MongoDB (local or Atlas connection)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd workout-plan-generator
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the `backend` directory with the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=3000
     ```

4. **Running the Application**
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend development server (from frontend directory in a new terminal)
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Project Structure
- `/backend` - Contains all server-side code
- `/frontend` - Contains all client-side React code
- `.gitignore` - Specifies intentionally untracked files to ignore

## Available Scripts
- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production

## Troubleshooting
- If you encounter module not found errors, try deleting `node_modules` and `package-lock.json` and run `npm install` again
- Ensure MongoDB is running if using a local instance
- Check console logs for specific error messages
