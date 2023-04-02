import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';

const CLIENT_ID_KEY = 'client_id';
const THIRTY_DAYS_IN_MILLISECONDS = 2592000000;
const GA_TRACKING_ID = 'UA-XXXXXXXXX-X';

function checkForClientId(setClientId) {
  const localStorageClientId = localStorage.getItem(CLIENT_ID_KEY);

  if (!localStorageClientId) {
    const gaCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('_ga='));
    if (gaCookie) {
      const clientId = gaCookie.split('.').slice(-2).join('.');
      localStorage.setItem(CLIENT_ID_KEY, clientId);
      setGoogleAnalyticsCookie(clientId);
      setClientId(clientId);
      ReactGA.initialize(GA_TRACKING_ID, { gaOptions: { clientId } });
    }
  } else {
    console.log('localStorageClientId', localStorageClientId)
    setGoogleAnalyticsCookie(localStorageClientId);
    setClientId(localStorageClientId);
    ReactGA.initialize(GA_TRACKING_ID, { gaOptions: { clientId: localStorageClientId } });
  }

  const expirationDate = new Date(Date.now() + THIRTY_DAYS_IN_MILLISECONDS).toUTCString();
  localStorage.setItem('client_id_expiration', expirationDate);
}

function setGoogleAnalyticsCookie(clientId) {
  document.cookie = '_ga=' + clientId + '; max-age=63072000; path=/; domain=.example.com;';
}

function App() {
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    checkForClientId(setClientId);

    return () => {
      ReactGA.pageview(window.location.pathname + window.location.search);
    };
  }, [clientId]);

  return (
    <div>
      {clientId && <p>Client ID: {clientId}</p>}
    </div>
  );
}

export default App;