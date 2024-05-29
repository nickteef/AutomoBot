let startTime;
let targetUrl = "https://register.svamz.com/siteadmin/home.php?page=vehicle&mode=insert&wizard=1";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.active && tab.url.includes(targetUrl)) {
    startTime = new Date(); // Save the start time as a Date object
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'targetButtonClick') {
    const endTime = new Date(); // Save the end time as a Date object
    const duration = (Math.round(((endTime - startTime) / 1000) * 100) / 100).toFixed(2); // Calculate the duration in seconds with two decimal places

    // Format the start time, end time, and duration as strings
    const startTimeStr = startTime.toLocaleString();
    const endTimeStr = endTime.toLocaleString();
    const durationStr = `${duration} seconds`;

    // Create a log object
    const log = {
      startTime: startTimeStr,
      endTime: endTimeStr,
      duration: durationStr
    };

    // Save the log object to localStorage
    const logs = JSON.parse(localStorage.getItem('timeLogs')) || [];
    logs.push(log);
    localStorage.setItem('timeLogs', JSON.stringify(logs));
    console.log(log);
  }
});

  
