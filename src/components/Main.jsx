import React, { useState, useEffect, useRef, useContext } from 'react';
import * as es from './elasticsearch.js';
import Feedback from './Feedback.jsx';
import LanguageContext from './LanguageContext.jsx';
import translations from './translations.js';
import './styles/Main.css';


function Main() {
    const { language } = useContext(LanguageContext);
    // State for storing variable values FIX LATER TO useState
    let vehicleDataGlobal = {};
    const [vin, setVin] = useState('');
    let selectedBrand = '';
    let selectedModel = '';
    let selectedYear = '';
    
    const [initialModelSelectorHTML, setInitialModelSelectorHTML] = useState('');
    const [initialYearSelectorHTML, setInitialYearSelectorHTML] = useState('');

    const modelSelectorRef = useRef(null);
    const yearSelectorRef = useRef(null);

    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        // Initialize the innerHTML of the selectors once the component has mounted
        if (modelSelectorRef.current && yearSelectorRef.current) {
            setInitialModelSelectorHTML(modelSelectorRef.current.innerHTML);
            setInitialYearSelectorHTML(yearSelectorRef.current.innerHTML);
        }
    }, []);

    // Event handler for VIN input change
    const handleVinChange = (event) => {
        setVin(event.target.value);
    };

    // Event handler for VIN search button click
    const handleVinSearch = () => {
        if (validateVIN(vin)) {
            es.searchVIN(vin)
              .then(displayResults)
              .catch(displayError);
        } else {
            displayError(translations[language].invalidVIN);
        }
    };

    const handleSearchByClick = () => {
        document.getElementById('brandModelYearSelectors').style.display = 'block';
        brandSelector.disabled = false;
        es.populateBrandSelector();
    }

    const handleBrandChange = (event) => {
        selectedBrand = event.target.value;
        selectedModel = '';
        selectedYear = '';
        document.getElementById('modelSelector').innerHTML = initialModelSelectorHTML;
        document.getElementById('yearSelector').innerHTML = initialYearSelectorHTML;
        modelSelector.disabled = false;
        yearSelector.disabled = true;
        es.populateModelSelector(selectedBrand);
    }

    const handleModelChange = (event) => {
        selectedModel = event.target.value;
        selectedYear = '';
        document.getElementById('yearSelector').innerHTML = initialYearSelectorHTML;
        yearSelector.disabled = false;
        es.populateYearSelector(selectedBrand, selectedModel);
    }

    const handleYearChange = (event) => {
        selectedYear = event.target.value;
        es.searchByBrandModelYear(selectedBrand, selectedModel, selectedYear)
            .then(displayResults)
            .catch(displayError);
    }

    const handleAutofill = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const codeToInject = `document.dispatchEvent(new CustomEvent('AutomoBotAutofill', { detail: ${JSON.stringify(vehicleDataGlobal)} })); `;
            chrome.tabs.executeScript(tabs[0].id, { code: codeToInject }, () => {
                setShowFeedback(true);
            });
        });
    };

    const handleSubmitFeedback = (feedback) => {
        console.log('Feedback submitted:', feedback);
        setShowFeedback(false);
    };

    const validateVIN = (vin) => {
        // Simple validation: VIN can be max. 17 characters long.
        // Adjust the validation logic according to your specific requirements.
        return true;
    }

    const displayResults = (data) => {
        vehicleDataGlobal = data;
        resultsArea.style.display = 'block';
        errorArea.style.display = 'none';
      
        // Clear previous results
        resultsArea.innerHTML = `<h2>${translations[language].vehicleInformation}</h2>`;

      
        // Display all vehicle data
        Object.keys(vehicleDataGlobal).forEach(key => {
          const p = document.createElement('p');
          p.textContent = `${key}: ${vehicleDataGlobal[key]}`;
          resultsArea.appendChild(p);
        });
    }

    const displayError = (message) => {
        errorArea.textContent = message;
        resultsArea.style.display = 'none';
        errorArea.style.display = 'block';
    }

    return (
        <div className="container">
            <img src="./images/icon.png" alt="AutomoBot Logo" id="logo-icon" />
            
            <div id="inputArea">
                <input type="text" id="vinInput" placeholder={translations[language].enterVIN} value={vin} onChange={handleVinChange} />
                <button id="searchButton" onClick={handleVinSearch}>
                {translations[language].decodeVIN}
                </button>
            </div>

            <button id="searchByBrandModelYear" className="text-button" onClick={handleSearchByClick}>{translations[language].searchByBMY}</button>

            <div id="brandModelYearSelectors" style={{ display: 'none' }}>
            <select id="brandSelector" disabled onChange={handleBrandChange}>
                <option value="">{translations[language].selectBrand}</option>
            </select>
            <select id="modelSelector" ref={modelSelectorRef} disabled onChange={handleModelChange}>
                <option value="">{translations[language].selectModel}</option>
            </select>
            <select id="yearSelector" ref={yearSelectorRef} disabled onChange={handleYearChange}>
                <option value="">{translations[language].selectYear}</option>
            </select>
            </div>

            <div id="resultsArea" style={{ display: 'none' }}>
                <h2>{translations[language].vehicleInformation}</h2>
            </div>
            <div id="errorArea" style={{ display: 'none', color: 'red' }}>
            </div>

            <button id="useAutofill" onClick={handleAutofill}>{translations[language].autofillThePage}</button>

            {showFeedback && <Feedback onSubmit={handleSubmitFeedback} />}
        </div>
    );
}

export default Main;
