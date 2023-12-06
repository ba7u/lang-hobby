/**
 * returns true if the given option is set on process as argument
 * @param option key
 */
export const getProcessOption = (option: string) => process.argv.includes(`--${option}`);
