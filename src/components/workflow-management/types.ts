export type SystemType = 'ERP' | 'CRM' | 'HRM' | 'FINANCE' | 'CUSTOM' | 'OA';

export type IntegrationProtocol = 'webhook' | 'rest_api' | 'sdk_openapi' | 'database_poll';

export interface FieldMapping {
  id: string;
  sourceField: string;      // 第三方字段 Key (如 order_no)
  sourceLabel: string;      // 第三方字段说明 (如 采购订单号)
  sourceType: 'string' | 'number' | 'date' | 'boolean' | 'array';
  targetFieldId: string;    // 本系统表单字段 ID
  targetFieldLabel: string; // 本系统表单字段 Label
  isRequired: boolean;
  transformRule?: 'direct' | 'cent_to_yuan' | 'timestamp_to_date' | 'uppercase' | 'json_extract';
  defaultValue?: string;
}

export interface CallbackConfig {
  onApprovedUrl: string;
  onRejectedUrl: string;
  callbackAuthType: 'bearer' | 'basic' | 'custom_header';
  callbackToken: string;
  retryCount: number;
  timeoutSec: number;
}

export interface ThirdPartyFormIntegration {
  id: string;
  name: string;
  code: string;
  systemType: SystemType;
  systemName: string;
  systemIconBg: string;
  protocol: IntegrationProtocol;
  endpoint: string;
  appKey: string;
  appSecret: string;
  status: 'active' | 'testing' | 'disabled';
  targetFormId: string;
  targetFormName: string;
  targetWorkflowName: string;
  fieldMappings: FieldMapping[];
  callbackConfig: CallbackConfig;
  stats: {
    totalCalls: number;
    successCalls: number;
    failedCalls: number;
    lastTriggerTime: string;
    avgDurationMs: number;
  };
  createdAt: string;
  updatedAt: string;
  description: string;
}

export interface IntegrationLogItem {
  id: string;
  integrationId: string;
  integrationName: string;
  systemType: SystemType;
  externalSn: string;
  applicant: string;
  applicantDept: string;
  targetFormName: string;
  receivedTime: string;
  status: 'processing' | 'approved' | 'rejected' | 'failed';
  callbackStatus: 'success' | 'pending' | 'failed' | 'retrying';
  payloadRaw: Record<string, any>;
  resultMessage: string;
  durationMs: number;
}
