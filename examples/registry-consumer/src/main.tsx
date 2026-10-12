import React from 'react';
import {createRoot} from 'react-dom/client';
import {ThemeSwitch} from '@lanshang-labs/ui';
import {AppUIProvider} from './components/lanshang/provider';
import {ProjectListBlock,DetailBlock,SidebarBlock} from './components/lanshang/blocks';
import './index.css';
createRoot(document.getElementById('root')!).render(<AppUIProvider><main><header><h1>新项目接入验证</h1><ThemeSwitch/></header><p>通过 shadcn CLI 从本地 Registry 安装。仅使用示例数据。</p><ProjectListBlock/><DetailBlock/><SidebarBlock/></main></AppUIProvider>);
