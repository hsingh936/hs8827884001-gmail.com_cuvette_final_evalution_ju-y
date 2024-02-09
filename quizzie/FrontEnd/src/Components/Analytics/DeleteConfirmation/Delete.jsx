import React from 'react'
import styles from './Delete.module.css'

const Delete = ({ onCancel, onConfirm }) => {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Are you confirm you want to delete?</p>
            <div className={styles.buttonContainer}>
            <button className={styles.confirm} onClick={onConfirm}>Confirm Delete</button>
            <button className={styles.cancle} onClick={onCancel}>Cancel</button>    
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Delete;
