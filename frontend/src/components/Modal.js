import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ title, children, onClose }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button onClick={onClose} className={styles.closeButton}>X</button>
                </div>
                <div className={styles.modalContent}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;