import React, { useState, useEffect } from 'react';

function TimeKeeper({ onTimeUpdate }) {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [duration, setDuration] = useState(null);

    useEffect(() => {
        const targetUrl = "https://register.svamz.com/siteadmin/home.php?page=vehicle&mode=insert&wizard=1";

        const handleTabUpdate = (tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url.includes(targetUrl)) {
                const start = Date.now();
                setStartTime(start);
            }
        };

        chrome.tabs.onUpdated.addListener(handleTabUpdate);

        return () => {
            chrome.tabs.onUpdated.removeListener(handleTabUpdate);
        };
    }, []);

    const handleStopTime = () => {
        const end = Date.now();
        setEndTime(end);
        const duration = (end - startTime) / 1000; // duration in seconds
        setDuration(duration);
        onTimeUpdate({ startTime, endTime: end, duration });
    };

    useEffect(() => {
        const handleButtonClick = () => {
            handleStopTime();
        };

        document.addEventListener('targetButtonClick', handleButtonClick);

        return () => {
            document.removeEventListener('targetButtonClick', handleButtonClick);
        };
    }, [startTime]);

    return null; // This component doesn't render anything
}

export default TimeKeeper;
