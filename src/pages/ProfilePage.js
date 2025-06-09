// frontend/src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError('');

            const userInfoString = localStorage.getItem('userInfo');
            let userInfo = null;
            if (userInfoString) {
                try {
                    userInfo = JSON.parse(userInfoString);
                } catch (e) {
                    console.error('Error parsing userInfo from localStorage:', e);
                    localStorage.removeItem('userInfo');
                    setError('Authentication data is corrupted. Please log in again.');
                    setLoading(false);
                    navigate('/login');
                    return;
                }
            }

            if (!userInfo || !userInfo.token) {
                setError('You are not logged in. Please log in to view your profile.');
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                // IMPORTANT: Ensure this URL matches your backend API
                // If your backend is on http://localhost:5000, and your frontend
                // is on http://localhost:3000, ensure you have a proxy setup
                // in your frontend's package.json (e.g., "proxy": "http://localhost:5000")
                // or use the full URL: 'http://localhost:5000/api/users/profile'
                const response = await axios.get('/api/users/profile', config);
                setUserData(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err);

                if (err.response && err.response.status === 401) {
                    setError('Session expired or not authorized. Please log in again.');
                    localStorage.removeItem('userInfo');
                    navigate('/login');
                } else {
                    setError('Failed to fetch user profile. Please try again later. (Check backend)');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);


    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingSpinner}></div>
                <p>Loading user profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ ...styles.container, color: styles.errorColor }}>
                <p>{error}</p>
                <button onClick={() => navigate('/login')} style={styles.button}>
                    Go to Login
                </button>
            </div>
        );
    }

    if (!userData) {
        return (
            <div style={styles.container}>
                <p>No user data available. Please ensure you are logged in.</p>
                <button onClick={() => navigate('/login')} style={styles.button}>
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="profile-container" style={styles.profileContainer}>
            <h2 style={styles.heading}>Your Profile Information</h2>

            <div style={styles.gridContainer}>
                <div style={styles.field}>
                    <strong style={styles.fieldStrong}>First Name:</strong> <span>{userData.firstName}</span>
                </div>
                <div style={styles.field}>
                    <strong style={styles.fieldStrong}>Last Name:</strong> <span>{userData.lastName}</span>
                </div>
                <div style={styles.field}>
                    <strong style={styles.fieldStrong}>Username:</strong> <span>{userData.username}</span>
                </div>
                <div style={styles.field}>
                    <strong style={styles.fieldStrong}>Email:</strong> <span>{userData.email}</span>
                </div>
                <div style={styles.field}>
                    <strong style={styles.fieldStrong}>University:</strong> <span>{userData.university || 'N/A'}</span>
                </div>
                <div style={styles.field}>
                    <strong style={styles.fieldStrong}>CGPI:</strong> <span>{userData.cgpi || 'N/A'}</span>
                </div>
                <div style={styles.field}>
                    <strong style={styles.fieldStrong}>Degree:</strong> <span>{userData.degree || 'N/A'}</span>
                </div>
                <div style={styles.field}>
                    <strong style={styles.fieldStrong}>Specialization:</strong> <span>{userData.specialization || 'N/A'}</span>
                </div>
            </div>

            <div style={styles.footer}>
                <p>Manage your profile settings here.</p>
                {/* Add an edit profile button here if you implement that functionality */}
                {/* <button style={styles.button}>Edit Profile</button> */}
            </div>
        </div>
    );
};

// Enhanced inline styles for the profile page with the new color palette
const styles = {
    // Colors for easy reference
    primaryDarkPurple: '#5D2F81', // A rich, deep plum/violet
    lightCoolGrey: '#F0F3F9',    // Very light, cool grey
    accentCoral: '#FF6B6B',      // Soft, inviting coral/salmon
    mainText: '#333333',         // Standard dark grey for readability
    subtleText: '#888888',       // Medium grey for subtle text
    pureWhite: '#FFFFFF',        // Pure white
    errorColor: '#E74C3C',       // Standard red for errors

    container: {
        textAlign: 'center',
        marginTop: '150px',
        padding: '20px',
        fontFamily: 'Montserrat, sans-serif',
        color: '#333333', // Main text color
    },
    profileContainer: {
        padding: '40px',
        maxWidth: '800px',
        margin: '150px auto',
        background: '#FFFFFF', // Pure white background
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)', // Soft shadow
        fontFamily: 'Montserrat, sans-serif',
        color: '#333333',
        border: '1px solid #E0F2F7', // Border using light cool grey
    },
    heading: {
        textAlign: 'center',
        marginBottom: '40px',
        color: '#5D2F81', // Deep purple for heading
        fontSize: '2.5em',
        fontWeight: '700',
        position: 'relative',
        paddingBottom: '15px',
        // Note: ::after pseudo-element for underline still not supported with inline styles.
        // You'd need a CSS module or a global CSS file for this.
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
        marginBottom: '30px',
    },
    field: {
        padding: '18px 25px',
        border: '1px solid #E0F2F7', // Light cool grey border
        borderRadius: '8px',
        backgroundColor: '#F7F9FC', // A slightly off-white, very light background for fields
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '1.1em',
    },
    fieldStrong: {
        color: '#555555', // Slightly darker grey for labels
        fontWeight: '600',
    },
    fieldSpan: {
        color: '#333333',
        textAlign: 'right',
    },
    footer: {
        textAlign: 'center',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #E0F2F7', // Subtle top border using light cool grey
        color: '#888888', // Subtle text for footer
        fontSize: '0.95em',
    },
    button: {
        backgroundColor: '#FF6B6B', // Coral accent for buttons
        color: 'white',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        marginTop: '20px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    // Hover effect for button (still best with CSS modules/global CSS)
    // 'button:hover': { backgroundColor: '#FF4A4A', transform: 'translateY(-2px)' },

    loadingSpinner: {
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #5D2F81', // Deep purple spinner
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '20px auto',
    },
    // Keyframes for spin animation (requires global CSS or CSS-in-JS library)
};

export default ProfilePage;