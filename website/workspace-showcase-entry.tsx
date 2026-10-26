import {createRoot} from 'react-dom/client';
import {LanshangProvider,zhCNLocale} from '../dist/index.js';
import '../dist/styles.css';
import {siteThemeStorageKey} from './site-config';
import {WorkspaceShowcase} from './workspace-showcase';
createRoot(document.getElementById('root')!).render(<LanshangProvider storageKey={siteThemeStorageKey} defaultMode="light" locale={zhCNLocale}><WorkspaceShowcase/></LanshangProvider>);
