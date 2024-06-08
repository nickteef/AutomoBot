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
    const [showSelectors, setShowSelectors] = useState(false);
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
    const [feedbackData, setFeedbackData] = useState(null);
    const [timeData, setTimeData] = useState(null);
    const [lastSavedAnalyticsData, setLastSavedAnalyticsData] = useState(null);

    // Load the saved state when the component mounts
    useEffect(() => {
        chrome.storage.local.get(['vin', 'selectedBrand', 'selectedModel', 'selectedYear', 'resultsDisplayed', 'vehicleDataGlobal', 'timeData', 'showFeedback'], (result) => {
            if (result.vin) setVin(result.vin);
            if (result.selectedBrand) setSelectedBrand(result.selectedBrand);
            if (result.selectedModel) setSelectedModel(result.selectedModel);
            if (result.selectedYear) setSelectedYear(result.selectedYear);
            if (result.resultsDisplayed) setResultsDisplayed(result.resultsDisplayed);
            if (result.vehicleDataGlobal) setVehicleDataGlobal(result.vehicleDataGlobal);
            if (result.showFeedback) setShowFeedback(result.showFeedback);
            if (result.feedbackData) setFeedbackData(result.feedbackData);
            if (result.timeData) setTimeData(result.timeData);
            // Call displayResults with restored vehicleDataGlobal if results were displayed
            if (result.resultsDisplayed && result.vehicleDataGlobal) {
                displayResults(result.vehicleDataGlobal);
            }
        });
    }, []);
    
    // Save state data to Chrome storage whenever state changes
    useEffect(() => {
        chrome.storage.local.set({
            vin,
            selectedBrand,
            selectedModel,
            selectedYear,
            resultsDisplayed,
            vehicleDataGlobal,
            timeData,
            showFeedback,
            feedbackData
        });
    }, [vin, selectedBrand, selectedModel, selectedYear, resultsDisplayed, vehicleDataGlobal, timeData, showFeedback, feedbackData]);

    useEffect(() => {
        es.populateBrandSelector().then(brands => {
            const options = brands.map(brand => ({ value: brand, label: brand }));
            setBrands(options);
        });
    }, []);

    useEffect(() => {
        if (selectedBrand) {
            es.populateModelSelector(selectedBrand.value).then(models => {
                const options = models.map(model => ({ value: model, label: model }));
                setModels(options);
            });
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (selectedModel) {
            es.populateYearSelector(selectedBrand.value, selectedModel.value).then(years => {
                const options = years.map(year => ({ value: year, label: year }));
                setYears(options);
            });
        }
    }, [selectedModel]);

    useEffect(() => {
        if (showFeedback && feedbackRef.current) {
            feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showFeedback]);

    const storeTimeFeedData = (timeData, feedbackData) => {
        const analyticsData = { ...timeData, ...feedbackData };
        setLastSavedAnalyticsData(analyticsData);
        es.storeAnalyticsData(analyticsData);
        resetState(true);
    };

    // A debounce function to handle rapid consecutive calls
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };    

    useEffect(() => {
        const handleStorageChange = debounce((changes, areaName) => {
            if (areaName === 'local' && changes.timeKeeperData) {
                const newTimeData = changes.timeKeeperData.newValue;
                setTimeData(newTimeData);

                if (feedbackData && newTimeData) {
                    // Compare only rating and feedback
                    if (feedbackData.rating !== lastSavedAnalyticsData?.rating ||
                        feedbackData.feedback !== lastSavedAnalyticsData?.feedback) {

                        storeTimeFeedData(newTimeData, feedbackData);
                    }
                }
            }
        }, 100); // Adjust the delay as needed

        // Add the listener for storage changes
        chrome.storage.onChanged.addListener(handleStorageChange);

        // Cleanup the listener on component unmount
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [feedbackData, lastSavedAnalyticsData]);
    

    const handleVinChange = (event) => {
        setVin(event.target.value.toUpperCase());
    };

    const validateVIN = (vin) => {
        return vin.length <= 17;
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
        setShowSelectors(true);
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

    const displayResults = (data) => {
        setVehicleDataGlobal(data);
        const resultsArea = document.getElementById('resultsArea');
        const errorArea = document.getElementById('errorArea');
        errorArea.style.display = 'none';

        // Clear previous results
        resultsArea.innerHTML = `<h2>${translations[language].vehicleInformation}</h2>`;

        // Display all vehicle data with field name above the value
        Object.keys(data).forEach(key => {
            if (key != "DR_score" && data[key]) { 
                const container = document.createElement('div');

                const keyElement = document.createElement('strong');
                keyElement.textContent = translations[language][key];

                const valueElement = document.createElement('p');
                valueElement.textContent = data[key];

                container.appendChild(keyElement);
                container.appendChild(valueElement);
                resultsArea.appendChild(container);
            }
        });


        setResultsDisplayed(true);
    };

    const displayError = (message) => {
        const errorArea = document.getElementById('errorArea');
        errorArea.textContent = message;
        setResultsDisplayed(false);
        errorArea.style.display = 'block';
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
        setFeedbackData(feedback);
        es.storeFeedbackData(feedback);
        if (timeData) storeTimeFeedData(timeData, feedback);  
        resetState(false);
    };

    const resetState = (oldFeedback) => {
        setVin('');
        setVehicleDataGlobal({});
        setSelectedBrand(null);
        setSelectedModel(null);
        setSelectedYear(null);
        setBrands([]);
        setModels([]);
        setYears([]);
        setResultsDisplayed(false);
        setLoading(false);
        setShowFeedback(false);
        setTimeData(null);
        // We do not reset feedbackData, because it might be needed later, maybe we need to reset it under a condition
        if (oldFeedback) setFeedbackData(null);
        // Also have to reset timeKeeperData
        chrome.storage.local.set({ timeKeeperData: null }, () => {});
    };

    return (
        <div className={`container ${loading ? 'blurred' : ''}`}>
            <img src="./images/icon.png" alt="AutomoBot Logo" id="logo-icon" />
            <div id="inputArea">
                <input type="text" id="vinInput" placeholder={translations[language].enterVIN} value={vin} onChange={handleVinChange} onKeyDown={(e) => {if (e.key === 'Enter') {handleVinSearch();}}}/>
                <button id="searchButton" disabled={!vin} onClick={handleVinSearch}>
                    {translations[language].decodeVIN}
                </button>
            </div>
            <button id="searchByBrandModelYear" className="text-button" onClick={handleSearchByClick} hidden={showSelectors}>
                {translations[language].searchByBMY}
            </button>
            <div id="brandModelYearSelectors" hidden={!showSelectors}>
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
            <div id="resultsArea" hidden={!resultsDisplayed}>
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
