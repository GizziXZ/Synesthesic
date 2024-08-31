import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // temporary samples
  const notifications = [
    { id: 1, message: 'New comment on your post' },
    { id: 2, message: 'You have a new follower' },
    { id: 3, message: 'Your post has been liked' },
  ];

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