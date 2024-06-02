let startTime;
let targetUrl = "https://register.svamz.com/siteadmin/home.php?page=vehicle&mode=insert&wizard=1";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active && tab.url.includes(targetUrl)) {
        startTime = new Date(); // Save the start time as a Date object
        // console.log('Start time set:', startTime);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'targetButtonClick') {
        if (startTime) {
            const endTime = new Date(); // Save the end time as a Date object
            const duration = ((endTime - startTime) / 1000).toFixed(2); // Calculate the duration in seconds with two decimal places

            const timeKeeperData = {
                startTime: startTime.toLocaleString(),
                endTime: endTime.toLocaleString(),
                duration: `${duration} seconds`
            };

            // Save the timeData to Chrome storage
            chrome.storage.local.set({ timeKeeperData }, () => {
                // console.log('Time data saved:', timeKeeperData);
            });

            sendResponse({ status: 'Time data saved' });
        } else {
            console.error('startTime is undefined');
            sendResponse({ status: 'Error: startTime is undefined' });
        }
    }
});

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
    timeKeeperData: null // Initialize timeKeeperData to null on install
  });
});



  
