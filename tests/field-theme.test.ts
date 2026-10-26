import {expect,it} from 'vitest';
import {designTheme} from '../src/theme';
import {controlSizes,foundations,palettes,themeVariables} from '../src/tokens';
it('scales compact controls without changing their silhouette',()=>{
 expect(Object.values(controlSizes).map(size=>size.height)).toEqual([26,32,38]);
 expect(Object.values(controlSizes).map(size=>size.radius)).toEqual([8,10,12]);
 expect(controlSizes.small.radius).toBeLessThan(controlSizes.middle.radius);
 expect(controlSizes.small.icon).toBeLessThan(controlSizes.middle.icon);
 expect(Object.values(controlSizes).map(size=>size.fontSize)).toEqual([12,13,14]);
});
it.each(['light','dark'] as const)('keeps input families aligned with compound geometry and status semantics (%s)',mode=>{
 const theme=designTheme(mode),components=theme.components!;
 for(const key of ['Input','InputNumber','Select','DatePicker'] as const){
  const field=components[key]!;
  expect(field.borderRadius).toBe(controlSizes.middle.radius);
  expect(field.borderRadiusSM).toBe(controlSizes.small.radius);
  expect(field.controlHeightSM).toBe(controlSizes.small.height);
  expect(field.controlHeight).toBe(components.Button!.controlHeight);
  expect(field.activeBorderColor).toBe(palettes[mode].accent);
 }
 expect(theme.token!.controlHeightSM).toBe(foundations.controlHeight);
 expect(theme.token!.borderRadius).toBe(controlSizes.middle.radius);
 expect(components.Skeleton!.blockRadius).toBe(controlSizes.middle.radius);
 expect(foundations.inputGroupRadius).toBe(controlSizes.middle.radius);
 expect(foundations.inputGroupHeight).toBe(controlSizes.middle.height);
 expect(components.Input!.activeBg).toBe(components.Input!.colorBgContainer);
 expect(components.InputNumber!.activeBg).toBe(components.InputNumber!.colorBgContainer);
 expect(theme.token!.colorError).toBe(palettes[mode]['error-text']);
 expect(theme.token!.colorInfo).toBe(palettes[mode]['link-text']);
 expect(theme.token!.colorLink).toBe(palettes[mode]['link-text']);
 expect(theme.token!.colorPrimary).toBe(palettes[mode].accent);
 expect(components.Menu!.itemBorderRadius).toBe(controlSizes.middle.radius);
 expect(components.Dropdown!.borderRadiusLG).toBe(controlSizes.middle.popupRadius);
 expect(components.Pagination!.borderRadius).toBe(controlSizes.middle.radius);
 expect(components.Pagination!.itemSize).toBe(controlSizes.middle.height);
 expect(components.Pagination!.itemSizeSM).toBe(controlSizes.small.height);
 expect(components.Tag!.borderRadiusSM).toBe(controlSizes.small.radius);
 expect(components.Switch!.trackHeight).toBe(controlSizes.middle.switchHeight);
 expect(components.Switch!.trackHeightSM).toBe(controlSizes.small.switchHeight);
 expect(components.Switch!.trackMinWidth).toBe(controlSizes.middle.switchWidth);
 expect(components.Switch!.trackMinWidthSM).toBe(controlSizes.small.switchWidth);
});
it.each(['light','dark'] as const)('publishes the same three control sizes to theme and CSS (%s)',mode=>{
 const fields=designTheme(mode).components!;
 for(const key of ['Input','InputNumber','Select','DatePicker','Button'] as const){
  expect(fields[key]!.controlHeightSM).toBe(controlSizes.small.height);
  expect(fields[key]!.controlHeight).toBe(controlSizes.middle.height);
  expect(fields[key]!.controlHeightLG).toBe(controlSizes.large.height);
 }
 const vars=themeVariables(mode);
 for(const [size,values] of Object.entries(controlSizes)){
  expect(vars[`--ls-control-${size}-height`]).toBe(`${values.height}px`);
  expect(vars[`--ls-control-${size}-radius`]).toBe(`${values.radius}px`);
  expect(vars[`--ls-control-${size}-switch-width`]).toBe(`${values.switchWidth}px`);
  expect(vars[`--ls-control-${size}-switch-height`]).toBe(`${values.switchHeight}px`);
  expect(vars[`--ls-control-${size}-switch-handle`]).toBe(`${values.switchHandle}px`);
 }
});

it.each(['light','dark'] as const)('shares compact checkbox geometry and distinct item states (%s)',mode=>{
 const components=designTheme(mode).components!,vars=themeVariables(mode),p=palettes[mode];
 expect(components.Checkbox!.controlInteractiveSize).toBe(16);
 expect(components.Checkbox!.borderRadiusSM).toBe(5);
 expect(components.Checkbox!.colorPrimary).toBe(p.text);
 expect(vars['--ls-checkbox-size']).toBe(`${foundations.checkboxSize}px`);
 expect(vars['--ls-checkbox-radius']).toBe(`${foundations.checkboxRadius}px`);
 expect(components.Menu!.itemSelectedBg).toBe(p['item-selected']);
 expect(components.Menu!.itemHoverBg).toBe(p['item-hover']);
 expect(components.Select!.optionSelectedBg).toBe('transparent');
 expect(p['item-selected']).not.toBe(p['item-hover']);
 expect(vars['--ls-item-selected-shadow']==='none').toBe(mode==='dark');
});

it.each(['light','dark'] as const)('keeps field boundaries and persistent selection coherent without changing focus semantics (%s)',mode=>{
 const components=designTheme(mode).components!,p=palettes[mode];
 for(const key of ['Input','Select','InputNumber','DatePicker'] as const){
  expect(components[key]!.colorBorder).toBe(p['line-strong']);
  expect(components[key]!.activeBorderColor).toBe(p.accent);
 }
 const selected=mode==='light'?p.surface:p.selected;
 expect(components.Segmented!.itemSelectedBg).toBe(selected);
 expect(components.Radio!.buttonSolidCheckedBg).toBe(selected);
 expect(components.Radio!.buttonSolidCheckedHoverBg).toBe(selected);
 expect(components.Radio!.buttonSolidCheckedActiveBg).toBe(selected);
});
