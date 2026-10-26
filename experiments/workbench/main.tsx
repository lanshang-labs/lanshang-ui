import React from 'react';
import {createRoot} from 'react-dom/client';
import 'antd/dist/reset.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/noto-sans-sc';
import {Workbench} from './workbench';
import './workbench.css';
createRoot(document.getElementById('root')!).render(<Workbench/>);
