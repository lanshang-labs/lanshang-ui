/** Shared interaction timing. Request lifecycles remain owned by consumers. */
export const motion = {
 duration: {state:150, enter:180, exit:120, chevron:200, selection:280, search:420, refresh:550, loading:1600, progressCycle:1400, iconSpin:1000},
 easing: {standard:'cubic-bezier(.2,.8,.2,1)', selection:'cubic-bezier(.22,1.12,.36,1)', feedback:'cubic-bezier(.22,.7,.3,1)'},
} as const;
export const motionVariables:Record<string,string> = {
 ...Object.fromEntries(Object.entries(motion.duration).map(([name,value])=>[`--ls-motion-${name}`,`${value}ms`])),
 ...Object.fromEntries(Object.entries(motion.easing).map(([name,value])=>[`--ls-ease-${name}`,value])),
};
