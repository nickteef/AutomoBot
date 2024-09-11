// src/components/TermsConditionsModal.jsx
import React from 'react';
import Modal from '../Modal.jsx';

const TermsConditionsModal = ({ show, onClose }) => {
    return (
        <Modal show={show} onClose={onClose}>
            <h2>Terms and Conditions</h2>
            <p>
                Terms and Conditions: By using the AutomoBot application, you agree to our terms of service. You are responsible for ensuring that the information provided is accurate and up-to-date.
                The application should be used in accordance with the laws and regulations applicable in your jurisdiction.
            </p>
        </Modal>
    );
};

export default TermsConditionsModal;
