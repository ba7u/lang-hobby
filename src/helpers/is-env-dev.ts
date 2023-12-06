/**
 * returns true if process environment local or dev
 */
export const isEnvDev = () => process.env.RUN_ENV === 'local' || process.env.RUN_ENV === 'dev';
