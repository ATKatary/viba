import * as React from 'react';

import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import './assets/css/vars/index.css';
import './assets/css/vars/icons.css';
import './assets/css/vars/fonts.css';
import './assets/css/vars/colors.css';

// import 'font-awesome/css/font-awesome.min.css';

import * as utils from './utils';
import * as types from './types';
import { Loading } from './support/loading';
import { AuthProvider } from './context/auth';
import { Notification } from './support/notification';

import Sign from './pages/sign';
import User from './pages/user';

import { apolloClient } from './api/client';
import { ApolloProvider } from '@apollo/client';
import { registerSw } from './workers/register';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

export const LoadingContext = React.createContext<types.loadingContextType | null>(null);
export const NotificationContext = React.createContext<types.notificationContextType | null>(null);

function App({...props}) {
  const [loading, setLoading] = utils.useCustomState<types.loadingType>({});
  
  const [notification, setNotification] = utils.useCustomState<types.notificationType>({});

  return (
    <LoadingContext.Provider value={{loading: loading, setLoading: setLoading}}>
      <NotificationContext.Provider value={{notification: notification, setNotification: setNotification}}>
          <BrowserRouter>
            <Routes>
              {/*** Add defualt url handle ***/}
              <Route path={utils.getDevOrDepUrl("viba") || "/"} element={<Sign />} />
              <Route path={utils.getDevOrDepUrl("user") || "/"} element={<User />} />
            </Routes>
          </BrowserRouter>
        <Loading loading={loading} />
        <Notification notification={notification} setNotification={setNotification} duration={6000}/>
      </NotificationContext.Provider>
    </LoadingContext.Provider>
  )
}

root.render(
  <ApolloProvider client={apolloClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
