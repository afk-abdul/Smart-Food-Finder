import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const ViewNotifications = () =>
{
    const [notifications, setNotifications] = useState([]);

    useEffect(() =>
    {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () =>
    {
        try
        {
            const response = await axiosInstance.get("/notifications/");
            setNotifications(response.data);
        } catch (error)
        {
            console.error("Error fetching notifications:", error);
        }
    };

    const toggleReadStatus = async (notification) =>
    {
        if (!notification)
        {
            try
            {
                const updatedNotification = { ...notification, is_read: !notification.is_read };

                // Send update request
                await axiosInstance.post(`/notifications/${notification.id}/mark-read/`, updatedNotification);

                // Update UI instantly
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? updatedNotification : n))
                );
            } catch (error)
            {
                console.error("Error updating notification status:", error);
            }
        }
    };

    return (
        <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                </div>

                {notifications.length === 0 ? (
                    <p>No notifications found.</p>
                ) : (
                    <ul>
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                onClick={() => toggleReadStatus(notification)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: notification.is_read ? "#fff" : "#f8d7da",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    marginBottom: "5px",
                                }}
                            >
                                <strong>Review:</strong> {notification.review.content} <br />
                                <strong>Rating:</strong> {notification.review.rating} <br />
                                <strong>Status:</strong> {notification.is_read ? "✅ Read" : "❌ Unread"}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default ViewNotifications;
