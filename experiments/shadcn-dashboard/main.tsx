import {createRoot} from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/noto-sans-sc';
import './template.generated.css';
import './lab.css';
import {ShadcnWorkbench} from './src/lab-runtime';
createRoot(document.getElementById('root')!).render(<ShadcnWorkbench/>);
