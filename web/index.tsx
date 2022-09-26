import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.scss';

const root = document.querySelector('#root') as HTMLDivElement;
createRoot(root).render(<App />);
