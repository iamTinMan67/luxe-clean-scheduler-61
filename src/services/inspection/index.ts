
// Export all inspection service functions from a single entry point
export { submitPreInspectionReport } from './submitReport';
export { getInspectionReports, getLatestInspectionReport } from './fetchReports';
export type { InspectionReport } from './types';
