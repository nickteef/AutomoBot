import {checkIfVinExists, updateVehicleData, insertVehicleData} from './components/elasticsearch.js';

// The URL of the website we want to keep the time of
const targetUrl = "https://register.svamz.com/siteadmin/home.php?page=vehicle&mode=insert&wizard=1";

// Function to handle saving (updating or inserting new) vehicle data back to Elasticsearch
const handleSave = (data) => {
    data.DR_score = 3;
    if (data.VIN) {
        checkIfVinExists(data.VIN)
            .then(exists => {
                if (exists) {
                    updateVehicleData(data)
                        .then(response => {
                            console.log('Data updated successfully', response);
                        })
                        .catch(error => {
                            console.error('Error updating data', error);
                        });
                } else {
                    insertVehicleData(data)
                        .then(response => {
                            console.log('Data inserted successfully', response);
                        })
                        .catch(error => {
                            console.error('Error inserting data', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error checking VIN existence', error);
            });
    } else {
        console.error('VIN is not found');
    }
};

// When the targetUrl page is completely loaded, set the startTime
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active && tab.url.includes(targetUrl)) {
        chrome.storage.local.set({ startTime: new Date().toISOString() }, () => {
            // console.log('Start time set');
        });
    }
});

// Listener for 'targetButtonClick', target button being the save form button on targetUrl page
chrome.runtime.onMessage.addListener((request, sendResponse, tab) => {
    if (request.message === 'targetButtonClick') {
        if (tab.active && tab.url.includes(targetUrl)) {
            chrome.storage.local.get('startTime', (data) => {
                if (data.startTime) {
                    const startTime = new Date(data.startTime);
                    const endTime = new Date();
                    const duration = ((endTime - startTime) / 1000).toFixed(2); // Calculate the duration in seconds with two decimal places
    
                    const timeKeeperData = {
                        startTime: startTime.toLocaleString("en-GB"),
                        endTime: endTime.toLocaleString("en-GB"),
                        duration: `${duration} seconds`
                    };
    
                    // Save the timeData to Chrome storage
                    chrome.storage.local.set({ timeKeeperData }, () => {
                        console.log('Time data saved:', timeKeeperData);
                    });
    
                    sendResponse({ status: 'Time data saved' });
                } else {
                    console.error('startTime is undefined');
                    sendResponse({ status: 'Error: startTime is undefined' });
                }
            });
            return true; // Required to indicate you will send a response asynchronously
        }
        // No matter the page we on, we save back to ES
        const vehicleData = request.data;
        handleSave(vehicleData);  
    }
});


// Initialize to-be stored variables on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    vin: '',
    selectedBrand: null,
    selectedModel: null,
    selectedYear: null,
    resultsDisplayed: false,
    vehicleDataGlobal: {},
    timeData: null,
    showFeedback: false,
    timeKeeperData: null
  });
});



  
