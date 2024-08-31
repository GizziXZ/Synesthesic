import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
        const response = await fetch('http://localhost:80/notifications', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        });
        const data = await response.json() || [];
        data.forEach(notification => {
            if (notification.notificationType === 'follow') {
                notification.message = `${notification.notificationCauser} followed you`;
            } else if (notification.notificationType === 'like') { // TODO - add a link to the post on like and comment notifs
                notification.message = `${notification.notificationCauser} liked your post`;
            } else if (notification.notificationType === 'comment') {
                notification.message = `${notification.notificationCauser} commented on your post`;
            }
        });
        setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };
    fetchNotifications();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
    <FontAwesomeIcon onClick={toggleDropdown} icon={faBell} />
      {isOpen && (
        <div className="dropdown__menu">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="dropdown__item">
                {notification.message}
              </div>
            ))
          ) : (
            <div className="dropdown__item">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;