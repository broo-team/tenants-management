import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [owner, setOwner] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuth = async () => {
        setAuthLoading(true);
        const storedOwner = localStorage.getItem('owner');
        const token = localStorage.getItem('ERPUSER_Token');

        if (storedOwner && token) {
            try {
                const parsedOwner = JSON.parse(storedOwner); // Parse storedOwner
                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const res = await axios.get(`http://localhost:5000/api/buildings/validate-token`, { headers }); // Use a dedicated validation endpoint
                setOwner(res.data.owner);
                setAuthLoading(false);
            } catch (error) {
                console.error("Token validation failed:", error); // Log the error
                localStorage.removeItem('owner');
                localStorage.removeItem('ERPUSER_Token');
                setOwner(null);
                setAuthLoading(false);
                if (location.pathname !== '/') {
                    navigate('/');
                }
            }
        } else {
            setOwner(null);
            setAuthLoading(false);
            if (location.pathname !== '/') {
                navigate('/');
            }
        }
    };

    useEffect(() => {
        checkAuth();
    }, [location, navigate]);

    const login = (ownerData) => {
        setOwner(ownerData);
        localStorage.setItem('owner', JSON.stringify(ownerData));
    };

    const logout = () => {
        setOwner(null);
        localStorage.removeItem('owner');
        localStorage.removeItem('ERPUSER_Token');
        navigate('/');
    };

    const value = {
        owner,
        login,
        logout,
        authLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);