import React, { useState, useEffect, useRef } from 'react';
import * as es from './elasticsearch.js';
import './styles/Main.css';

function Main() {
    const [vin, setVin] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [vehicleDataGlobal, setVehicleDataGlobal] = useState({});
    const [initialModelSelectorHTML, setInitialModelSelectorHTML] = useState('');
    const [initialYearSelectorHTML, setInitialYearSelectorHTML] = useState('');

    const modelSelectorRef = useRef(null);
    const yearSelectorRef = useRef(null);

    useEffect(() => {
        if (modelSelectorRef.current && yearSelectorRef.current) {
            setInitialModelSelectorHTML(modelSelectorRef.current.innerHTML);
            setInitialYearSelectorHTML(yearSelectorRef.current.innerHTML);
        }
    }, []);

    useEffect(() => {
        if (selectedBrand) {
            modelSelectorRef.current.disabled = false;
            yearSelectorRef.current.disabled = true;
            resetSelectors(modelSelectorRef, initialModelSelectorHTML);
            resetSelectors(yearSelectorRef, initialYearSelectorHTML);
            es.populateModelSelector(selectedBrand);
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (selectedModel) {
            yearSelectorRef.current.disabled = false;
            resetSelectors(yearSelectorRef, initialYearSelectorHTML);
            es.populateYearSelector(selectedBrand, selectedModel);
        }
    }, [selectedModel]);

    const resetSelectors = (selectorRef, initialHTML) => {
        selectorRef.current.innerHTML = initialHTML;
    };

    const handleVinChange = (event) => {
        setVin(event.target.value);
    };

    const handleVinSearch = () => {
        if (validateVIN(vin)) {
            es.searchVIN(vin)
                .then(displayResults)
                .catch(displayError);
        } else {
            displayError("Invalid VIN format. Please enter a valid VIN.");
        }
    };

    const handleSearchByClick = () => {
        document.getElementById('brandModelYearSelectors').style.display = 'block';
        document.getElementById('brandSelector').disabled = false;
        es.populateBrandSelector();
    };

    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.value);
        setSelectedModel('');
        setSelectedYear('');
    };

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
        setSelectedYear('');
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        es.searchByBrandModelYear(selectedBrand, selectedModel, selectedYear)
            .then(displayResults)
            .catch(displayError);
    };

    const handleAutofill = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const codeToInject = `document.dispatchEvent(new CustomEvent('AutomoBotAutofill', { detail: ${JSON.stringify(vehicleDataGlobal)} })); `;
            chrome.tabs.executeScript(tabs[0].id, { code: codeToInject });
        });
    };

    const validateVIN = (vin) => {
        // Simple validation: VIN can be max. 17 characters long.
        // Adjust the validation logic according to your specific requirements.
        return true;
    };

    const displayResults = (data) => {
        setVehicleDataGlobal(data);
        const resultsArea = document.getElementById('resultsArea');
        const errorArea = document.getElementById('errorArea');

        if (resultsArea && errorArea) {
            resultsArea.style.display = 'block';
            errorArea.style.display = 'none';

            resultsArea.innerHTML = '<h2>Vehicle Information:</h2>';
            Object.keys(data).forEach(key => {
                const p = document.createElement('p');
                p.textContent = `${key}: ${data[key]}`;
                resultsArea.appendChild(p);
            });
        }
    };

    const displayError = (message) => {
        const errorArea = document.getElementById('errorArea');
        const resultsArea = document.getElementById('resultsArea');

        if (errorArea && resultsArea) {
            errorArea.textContent = message;
            resultsArea.style.display = 'none';
            errorArea.style.display = 'block';
        }
    };

    return (
        <div className="container">
            <h1>AutomoBot</h1>
            <div id="inputArea">
                <input type="text" id="vinInput" placeholder="Enter VIN" value={vin} onChange={handleVinChange} />
                <button id="searchButton" onClick={handleVinSearch}>
                    Decode VIN
                </button>
            </div>
            <button id="searchByBrandModelYear" className="text-button" onClick={handleSearchByClick}>Search by brand, model, year</button>

            <div id="brandModelYearSelectors" style={{ display: 'none' }}>
                <select id="brandSelector" disabled onChange={handleBrandChange}>
                    <option value="">Select Brand</option>
                </select>
                <select id="modelSelector" ref={modelSelectorRef} disabled onChange={handleModelChange}>
                    <option value="">Select Model</option>
                </select>
                <select id="yearSelector" ref={yearSelectorRef} disabled onChange={handleYearChange}>
                    <option value="">Select Year</option>
                </select>
            </div>

            <div id="resultsArea" style={{ display: 'none' }}>
                <h2>Results:</h2>
            </div>
            <div id="errorArea" style={{ display: 'none', color: 'red' }}>
            </div>

            <button id="useAutofill" onClick={handleAutofill}>Autofill the page</button>
        </div>
    );
}

export default Main;
