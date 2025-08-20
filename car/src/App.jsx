import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import HomePage from './components/home/HomePage';
import BrowseCars from './components/browse/BrowseCars';
import CarDetails from './components/details/CarDetails';
import BookingSystem from './components/booking/BookingSystem';
import MyBookings from './components/MyBookings/MyBookings';
import BookingReceipt from './components/MyBookings/BookingReceipt';
import ContactUsPage from './components/contact/ContactUsPage';
import About from './components/about/About';
import Policy from './components/Policy/Policy';
import UserAuth from './components/auth/UserAuth';
import Footer from './components/shared/Footer';
import { CarProvider } from './context/CarContext';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminRoute from './components/routing/AdminRout';
import Fouro4 from './components/fouro4/Fouro4';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import EmployeeRoute from './components/routing/EmployeeRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CarProvider>
          
          <ToastContainer
            position="top-right"
            autoClose={8000} 
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowseCars />} />
                <Route path="/cars/:id" element={<CarDetails />} />
                <Route path="/book/:id" element={<BookingSystem />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/booking-receipt/:bookingId" element={<BookingReceipt />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/about" element={<About />} />
                <Route path="policy" element={<Policy/>}/>
                <Route path="/auth" element={<UserAuth />} />
                 <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                   <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                  <Route
                  path="/employee-dashboard"
                  element={
                    <EmployeeRoute>
                      <EmployeeDashboard />
                    </EmployeeRoute>
                  }
                />
              <Route path="*" element={<Fouro4/>}/>  
              </Routes>
            </main>
            <Footer />
          </div>
        </CarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
