import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaBell, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { io } from 'socket.io-client';
import './NotificationBell.css'; 

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const playNotificationSound = () => {
        const audio = new Audio('/Notification.mp3');
        audio.play().catch(error => {
            console.error("Failed to play notification sound:", error);
        });
    };


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://car-rental-system-web-application.onrender.com/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotifications(res.data);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        };

        fetchNotifications();
        const socket = io('https://car-rental-system-web-application.onrender.com');
        const token = localStorage.getItem('token');
        if (token) {
            socket.emit('authenticate', token);
        }

        socket.on('new_notification', (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            playNotificationSound();
        });

        return () => {
            socket.off('new_notification');
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            markAllAsRead();
        }
    }, [isOpen]);


    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };
    const markAllAsRead = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        try {
            await Promise.all(
                unreadIds.map(id => axios.patch(`https://car-rental-system-web-application.onrender.com/api/notifications/${id}/read`, {}, config))
            );
        } catch (err) {
            console.error("Failed to mark notifications as read on the server:", err);
        }
    };
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://car-rental-system-web-application.onrender.com/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    return (
        <div className="notification-bell">
            <button onClick={toggleDropdown} className="bell-button">
                <FaBell />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            <div className={`notification-dropdown dropdown-menu bg-light border-2 ${isOpen ? 'show' : ''}`}>
                <div className="dropdown-header">
                    <h5>Notifications</h5>
                </div>
                <ul className="notification-list list-unstyled">
                    {notifications.length > 0 ? (
                        notifications.map(n => (
                            <li key={n._id} className={`p-2 border-bottom ${!n.read ? 'unread' : ''}`}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="mb-1">{n.message}</p>
                                        <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
                                    </div>
                                    <Button variant="outline-danger" size="sm" onClick={(e) => handleDelete(n._id, e)}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="empty-message p-2 text-center">You have no notifications.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NotificationBell;
