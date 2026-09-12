export const assetUrl = (path: string): string => /^https:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
