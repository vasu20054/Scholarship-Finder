import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ScholarshipCard from '../components/ScholarshipCard';

const ScholarshipList = ({ searchTerm = '' }) => {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    // Memoized function to fetch user profile
    const fetchUserProfile = useCallback(async () => {
        const userInfoString = localStorage.getItem('userInfo');
        let userInfo = null;
        if (userInfoString) {
            try {
                userInfo = JSON.parse(userInfoString);
            } catch (e) {
                console.error('Error parsing userInfo from localStorage:', e);
                localStorage.removeItem('userInfo');
                setIsLoggedIn(false);
                setUserProfile(null);
                return;
            }
        }

        if (userInfo && userInfo.token) {
            setIsLoggedIn(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
            try {
                const profileResponse = await axios.get('/api/users/profile');
                setUserProfile(profileResponse.data);
            } catch (profileError) {
                console.error('Error fetching user profile:', profileError);
                localStorage.removeItem('userInfo');
                setIsLoggedIn(false);
                setUserProfile(null);
                delete axios.defaults.headers.common['Authorization'];
            }
        } else {
            setIsLoggedIn(false);
            setUserProfile(null);
            delete axios.defaults.headers.common['Authorization'];
        }
    }, []);

    // Memoized function to fetch scholarships
    const fetchScholarships = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let apiUrl = '/api/scholarships';

            if (isLoggedIn && userProfile) {
                apiUrl = '/api/scholarships/eligible';
            } else if (searchTerm) {
                apiUrl = `/api/scholarships?search=${encodeURIComponent(searchTerm)}`;
            }

            const response = await axios.get(apiUrl);
            setScholarships(response.data);
        } catch (err) {
            console.error('Error fetching scholarships:', err);
            if (err.response && err.response.status === 401 && isLoggedIn) {
                setError('You need to be logged in to view personalized scholarships.');
                localStorage.removeItem('userInfo');
                setIsLoggedIn(false);
                setUserProfile(null);
                delete axios.defaults.headers.common['Authorization'];
            } else {
                setError('Failed to load scholarships. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }, [searchTerm, isLoggedIn, userProfile]);

    useEffect(() => {
        fetchUserProfile();

        const handleStorageChange = () => {
            fetchUserProfile();
        };

        window.addEventListener('localStorageUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('localStorageUpdated', handleStorageChange);
        };
    }, [fetchUserProfile]);

    useEffect(() => {
        if (isLoggedIn !== null && ((isLoggedIn === true && userProfile !== null) || isLoggedIn === false || searchTerm)) {
            fetchScholarships();
        }
    }, [fetchScholarships, isLoggedIn, userProfile, searchTerm]);

    if (loading) {
        return (
            <div className="scholarship-list-container">
                <p>Loading scholarships...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="scholarship-list-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (scholarships.length === 0) {
        return (
            <div className="scholarship-list-container">
                <p>No scholarships found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="scholarship-list-container">
            <h2 className="list-heading">
                {isLoggedIn && userProfile ? "Eligible Scholarships" : "Available Scholarships"}
            </h2>
            <div className="scholarships-grid">
                {scholarships.map((scholarship) => (
                    <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
                ))}
            </div>
        </div>
    );
};

export default ScholarshipList;