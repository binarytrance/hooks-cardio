import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';

//to now be able to receive our context from everywhere in the app
ReactDOM.render(<AuthContextProvider><App /></AuthContextProvider>, document.getElementById('root'));
