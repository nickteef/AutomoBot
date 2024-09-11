// src/components/AboutUsModal.jsx
import React from 'react';
import Modal from '../Modal.jsx';

const AboutUsModal = ({ show, onClose }) => {
    return (
        <Modal show={show} onClose={onClose}>
            <h2>About Us</h2>
            <p>
                This application, AutomoBot, is developed as part of a diploma project at the Faculty of Computer Science, University of Ljubljana.
                The goal of the application is to automate the process of finding and entering data about vintage vehicles.
                It uses various tools and technologies, including React for the front end and Elasticsearch for efficient data searching.
            </p>
        </Modal>
    );
};

export default AboutUsModal;
