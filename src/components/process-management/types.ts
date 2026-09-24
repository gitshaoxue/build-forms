export type ThirdPartySystemName = 
  | 'SAP S/4HANA ERP' 
  | '用友 YonSuite' 
  | '纷享销客 CRM' 
  | '飞书人事 (Feishu)' 
  | '自研电商业务中台' 
  | '北森 Beisen HRM';

export interface ProcessThirdPartyField {
  id: string;
  sourceKey: string;          // 第三方报文字段 Key (如: po_number, net_price_cent)
  sourceLabel: string;        // 第三方业务名称 (如: 采购订单号, 采购净额)
  sourceSystem: ThirdPartySystemName;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'json';
  targetVariable: string;     // 流程全局变量 (如: flow.order_sn)
  targetComponent: string;    // 对应的表单显示控件 (如: 单行文本, 金额大写, 日期时间)
  isRequired: boolean;
  transformRule: 'none' | 'cent_to_yuan' | 'yuan_to_cent' | 'date_format' | 'uppercase' | 'dept_mapping';
  nodePermissions: {
    startNode: 'read' | 'edit';
    deptManagerNode: 'read' | 'edit' | 'hide';
    financeAuditNode: 'read' | 'edit' | 'hide';
    finalLeaderNode: 'read' | 'edit' | 'hide';
  };
  sampleValue?: string;
  description?: string;
}

export interface ProcessConfigModel {
  id: string;
  name: string;
  code: string;
  systemName: ThirdPartySystemName;
  formName: string;
  workflowTemplateId: string;
  status: 'active' | 'draft' | 'archived';
  fields: ProcessThirdPartyField[];
  updatedAt: string;
  version: string;
  callbackUrl?: string;
  description: string;
}

export interface ProcessNodeDef {
  id: string;
  name: string;
  type: 'start' | 'approver' | 'condition' | 'cc' | 'callback' | 'end';
  assigneeType?: 'supervisor' | 'role' | 'external_field' | 'specific_user';
  assigneeName?: string;
  approvalMode?: 'and' | 'or' | 'sequential'; // 会签 | 或签 | 依次
  conditionExpr?: string;
  timeoutHours?: number;
  autoRemind?: boolean;
  actionUrl?: string;
}

export interface ProcessTemplate {
  id: string;
  name: string;
  code: string;
  category: '采购财务' | '营销特批' | '行政人事' | '风控合规' | '自研中台';
  description: string;
  boundSystem: ThirdPartySystemName;
  triggerType: 'webhook_api' | 'form_submit' | 'scheduled' | 'manual';
  version: string;
  status: 'active' | 'draft';
  instanceCount: number;
  avgDuration: string;
  nodes: ProcessNodeDef[];
  updatedAt: string;
}

export interface ProcessApprovalLog {
  nodeName: string;
  operator: string;
  role: string;
  action: 'submit' | 'approve' | 'reject' | 'transfer' | 'pending';
  comment: string;
  timestamp: string;
}

export interface ProcessInstance {
  id: string;
  instanceSn: string;        // 本系统流程实例ID (PROC-xxxx)
  externalSn: string;        // 对接三方单据单号 (如 SAP-PO-450098)
  processName: string;
  templateCode: string;
  sourceSystem: ThirdPartySystemName;
  initiator: string;
  initiatorDept: string;
  startTime: string;
  duration: string;
  status: 'running' | 'approved' | 'rejected' | 'terminated' | 'suspended';
  currentNodeName: string;
  currentAssignees: string[];
  priority: 'high' | 'normal' | 'urgent';
  businessData: Record<string, any>;
  approvalLogs: ProcessApprovalLog[];
  callbackStatus: 'success' | 'pending' | 'failed' | 'retrying';
}

export interface ProcessAlert {
  id: string;
  level: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  sourceSystem: ThirdPartySystemName;
  time: string;
  resolved: boolean;
  relatedInstanceSn?: string;
}
