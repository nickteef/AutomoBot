// src/components/PrivacyPolicyModal.jsx
import React from 'react';
import Modal from '../Modal.jsx';

const PrivacyPolicyModal = ({ show, onClose }) => {
    return (
        <Modal show={show} onClose={onClose}>
            <h2>Privacy Policy</h2>
            <p>
                Privacy Policy: Your data will be processed in accordance with the privacy laws and regulations. We will not share your information with third parties without your consent.
                The data collected will be used solely for the purpose of enhancing the functionality of the AutomoBot application.
            </p>
        </Modal>
    );
};

export default PrivacyPolicyModal;
