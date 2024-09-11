import React, { useState } from 'react';
import Modal from '../Modal.jsx';

const LanguageModal = ({ show, onClose }) => {
    const [language, setLanguage] = useState('en'); // Nastavi začetni jezik na angleščino

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div style={styles.container}>
                <h2 style={styles.header}>Language Settings</h2>
                <form style={styles.form}>
                    <label style={styles.label}>Select Language:</label>
                    <select 
                        value={language} 
                        onChange={handleLanguageChange} 
                        style={styles.select}
                    >
                        <option value="en">English</option>
                        <option value="sl">Slovenian</option>
                        {/* Dodaj druge jezike, če so potrebni */}
                    </select>
                </form>
                <button 
                    onClick={() => alert(`Selected language: ${language}`)} 
                    style={styles.button}
                >
                    Save Changes
                </button>
            </div>
        </Modal>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginBottom: '20px',
    },
    label: {
        fontSize: '18px',
        marginBottom: '10px',
        color: '#555',
    },
    select: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%',
        maxWidth: '300px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    }
};

export default LanguageModal;
