import React from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/noto-sans-sc';
import {LanshangProvider,zhCNLocale} from '../dist/index.js';
import '../dist/styles.css';
import {StyleStudy} from './style-study';
import {siteThemeStorageKey} from './site-config';
createRoot(document.getElementById('root')!).render(<LanshangProvider storageKey={siteThemeStorageKey} defaultMode="dark" locale={zhCNLocale}><StyleStudy/></LanshangProvider>);
