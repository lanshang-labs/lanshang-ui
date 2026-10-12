// Resolve the actual site origin and Pages subpath; never hard-code localhost in production docs.
export const registryBase = new URL(import.meta.env.BASE_URL, window.location.href).href;
export const registryCommand = (item='lanshang-blocks') => `npx shadcn@4.21.4 add ${registryBase}r/${item}.json`;
