export interface VisitQuota {
  quotaID: string;
  period: string;
  target: number;
  actual: number;
  progress: number;
  status: 'Met' | 'Unmet';
  lastUpdated: string;
}
