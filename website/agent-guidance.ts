/** Short, copyable implementation contracts; ordinary usage notes stay human-readable. */
export const agentGuidance:Record<string,readonly string[]>={
 'patterns/motion':[
  '从 @lanshang-labs/ui 使用共享控件和 MotionIcon；不要在页面复制时长、缓动或图标关键帧。',
  '持续选择仅保留一层选中底片；鼠标悬停和键盘焦点不能改变当前选中项。',
  '保留语义、禁用、Tab/Enter/Space 行为；同时检查浅暗主题和 prefers-reduced-motion。',
 ],
 'components/control-group':[
  '从 @lanshang-labs/ui 导入 InputGroup、ButtonGroup 和 RowActionButton；默认使用中号，只有明确的高密度场景才指定 small。',
  'control 和 actions 保持各自可聚焦及禁用状态；切换按钮使用 aria-pressed，普通动作不要声明持久选中。',
  '不要给整个组合加蓝色聚焦外框或叠加第二层选中背景；检查键盘操作、浅暗主题和减少动态效果。',
 ],
};
