import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const DropdownMenu = () => {
  const [isClosed, setIsClosed] = useState(false);
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
            } else if (notification.notificationType === 'like') {
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
    setIsClosed(!isClosed);
    if (!isClosed) { // technically the !isClosed is the opposite of what it's supposed to be but whatever i cba anymore
        setNotifications([]);
    } else {
        const readNotifications = async () => {
            try {
                await fetch('http://localhost:80/notifications', {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                });
            } catch (error) {
                console.error('Error clearing notifications:', error);
            }
        };
        readNotifications();
    }
  };

  return (
    <div className="dropdown">
    <FontAwesomeIcon onClick={toggleDropdown} icon={faBell} />
    {notifications.length > 0 && <div className="red-dot" onClick={toggleDropdown}></div>}
      {isClosed && (
        <div className="dropdown__menu">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
                <div key={notification.id} className="dropdown__item">
                {notification.link ? (
                    <a href={notification.link} target="_blank" style={{color: 'black'}}>{notification.message}</a>
                ) : (
                    <a style={{color: 'black'}}>{notification.message}</a>
                )}
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