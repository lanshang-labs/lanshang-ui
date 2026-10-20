import React from 'react';
import {createRoot} from 'react-dom/client';
import {ThemeSwitch} from '@lanshang-labs/ui';
import {AppUIProvider} from './components/lanshang/provider';
import {ProjectListBlock,DetailBlock,SidebarBlock} from './components/lanshang/blocks';
import './index.css';
const project={id:'demo',name:'新项目',owner:'示例成员',status:'active' as const,category:'基础平台',description:'来自调用方的数据',notifications:true,progress:0};
createRoot(document.getElementById('root')!).render(<AppUIProvider><main><header><h1>新项目接入验证</h1><ThemeSwitch/></header><p>通过 shadcn CLI 从指定 Registry 安装。仅使用示例数据。</p><ProjectListBlock rows={[project]}/><DetailBlock record={project} activities={[]}/><SidebarBlock/></main></AppUIProvider>);
