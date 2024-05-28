import React, { useState, useEffect, useRef, useContext } from 'react';
import Select from 'react-select';
import * as es from './elasticsearch.js';
import Feedback from './Feedback.jsx';
import LanguageContext from './LanguageContext.jsx';
import translations from './translations.js';
import './styles/Main.css';

function Main() {
    const { language } = useContext(LanguageContext);

    // State for storing variable values
    const [vin, setVin] = useState('');
    const [vehicleDataGlobal, setVehicleDataGlobal] = useState({});
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [years, setYears] = useState([]);
    const [resultsDisplayed, setResultsDisplayed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const feedbackRef = useRef(null);

    useEffect(() => {
        es.populateBrandSelector().then(brands => {
            const options = brands.map(brand => ({ value: brand, label: brand }));
            setBrands(options);
        });
    }, []);

    useEffect(() => {
        es.populateModelSelector().then(models => {
            const options = models.map(model => ({ value: model, label: model }));
            setModels(options);
        });
    }, []);

    useEffect(() => {
        es.populateYearSelector().then(years => {
            const options = years.map(year => ({ value: year, label: year }));
            setYears(options);
        });
    }, []);

    useEffect(() => {
        if (showFeedback && feedbackRef.current) {
            feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showFeedback]);

    const handleVinChange = (event) => {
        setVin(event.target.value.toUpperCase());
    };

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
        document.getElementById('searchByBrandModelYear').style.display = 'none';
    };    

    const handleBrandChange = (selectedOption) => {
        setSelectedBrand(selectedOption);
        setSelectedModel(null);
        setSelectedYear(null);
        setModels([]);
        setYears([]);
        es.populateModelSelector(selectedOption.value).then(models => {
            const options = models.map(model => ({ value: model, label: model }));
            setModels(options);
        });
    };

    const handleModelChange = (selectedOption) => {
        setSelectedModel(selectedOption);
        setSelectedYear(null);
        setYears([]);
        es.populateYearSelector(selectedBrand.value, selectedOption.value).then(years => {
            const options = years.map(year => ({ value: year, label: year }));
            setYears(options);
        });
    };

    const handleYearChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        es.searchByBrandModelYear(selectedBrand.value, selectedModel.value, selectedOption.value)
            .then(displayResults)
            .catch(displayError);
    };

    const handleAutofill = () => {
        setLoading(true);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const codeToInject = `document.dispatchEvent(new CustomEvent('AutomoBotAutofill', { detail: ${JSON.stringify(vehicleDataGlobal)} })); `;
            chrome.tabs.executeScript(tabs[0].id, { code: codeToInject }, () => {
                setTimeout(() => setLoading(false), 4000); // Hide loading screen after 4 seconds
                setShowFeedback(true);
            });
        });
    };

    const handleSubmitFeedback = (feedback) => {
        console.log('Feedback submitted:', feedback);
        setShowFeedback(false);
    };

    const validateVIN = (vin) => {
        return vin.length <= 17;
    };

    const displayResults = (data) => {
        setVehicleDataGlobal(data);
        const resultsArea = document.getElementById('resultsArea');
        const errorArea = document.getElementById('errorArea');
        resultsArea.style.display = 'block';
        errorArea.style.display = 'none';

        // Clear previous results
        resultsArea.innerHTML = `<h2>${translations[language].vehicleInformation}</h2>`;

        // Display all vehicle data
        Object.keys(data).forEach(key => {
            const p = document.createElement('p');
            p.textContent = `${key}: ${data[key]}`;
            resultsArea.appendChild(p);
        });

        setResultsDisplayed(true);
    };

    const displayError = (message) => {
        const errorArea = document.getElementById('errorArea');
        const resultsArea = document.getElementById('resultsArea');
        errorArea.textContent = message;
        resultsArea.style.display = 'none';
        errorArea.style.display = 'block';
    };

    return (
        <div className={`container ${loading ? 'blurred' : ''}`}>
            <img src="./images/icon.png" alt="AutomoBot Logo" id="logo-icon" />
            <div id="inputArea">
                <input type="text" id="vinInput" placeholder={translations[language].enterVIN} value={vin} onChange={handleVinChange} />
                <button id="searchButton" disabled={!vin} onClick={handleVinSearch}>
                    {translations[language].decodeVIN}
                </button>
            </div>
            <button id="searchByBrandModelYear" className="text-button" onClick={handleSearchByClick}>
                {translations[language].searchByBMY}
            </button>
            <div id="brandModelYearSelectors" style={{ display: 'none' }}>
                <Select
                    id="brandSelector"
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    options={brands}
                    isDisabled={brands.length === 0}
                    placeholder={translations[language].selectBrand}
                />
                <Select
                    id="modelSelector"
                    value={selectedModel}
                    onChange={handleModelChange}
                    options={models}
                    isDisabled={!selectedBrand}
                    placeholder={translations[language].selectModel}
                />
                <Select
                    id="yearSelector"
                    value={selectedYear}
                    onChange={handleYearChange}
                    options={years}
                    isDisabled={!selectedModel}
                    placeholder={translations[language].selectYear}
                />
            </div>
            <div id="resultsArea" style={{ display: 'none' }}>
                <h2>{translations[language].vehicleInformation}</h2>
            </div>
            <div id="errorArea" style={{ display: 'none', color: 'red' }}>
            </div>
            <button id="useAutofill" disabled={!resultsDisplayed} onClick={handleAutofill}>
                {translations[language].autofillThePage}
            </button>
            {loading && (
                <div className="loading-screen">
                    <div className="loading-animation"></div>
                    <div className="loading-text">Autofilling...</div>
                </div>
            )}
            {showFeedback && <Feedback onSubmit={handleSubmitFeedback} ref={feedbackRef}/>}
        </div>
    );
}

export default Main;
