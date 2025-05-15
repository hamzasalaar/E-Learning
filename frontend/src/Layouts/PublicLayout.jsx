import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Import the public Header
import Footer from '../components/Footer';

export default function PublicLayouts() {
    const user = useSelector((state) => state.Auth.user); // Get the logged-in user from Redux
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin'); // Redirect admin to AdminDashboard
            } else if (user.role === 'teacher') {
                navigate('/teacher/dashboard'); // Redirect teacher to TeacherDashboard
            }
        }
    }, [user, navigate]);

    return (
        <>
            <Header /> {/* Add the Header for public routes */}
            <main>
                <Outlet /> {/* Render child routes */}
            </main>
            <Footer /> {/* Add the Footer for public routes */}
            
        </>
    );
}