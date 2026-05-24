export interface AccessLog {
  logID: string;
  accessType: 'view' | 'share';
  contentType: string;
  eventTime: Date;
  browserDevice: string;
}
