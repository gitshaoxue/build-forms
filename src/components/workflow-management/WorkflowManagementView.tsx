import React, { useState } from 'react';
import {
  Workflow,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Code,
  ShieldCheck,
  Zap,
  Sliders,
  Trash2,
  Edit,
  Eye,
  Play,
  RotateCcw,
  ArrowRight,
  Database,
  Building2,
  Send,
  FileText,
  KeyRound,
  X,
  Shuffle,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThirdPartyFormIntegration, IntegrationLogItem, FieldMapping, SystemType } from './types';
import { initialThirdPartyIntegrations, initialIntegrationLogs } from './mockData';

interface WorkflowManagementViewProps {
  savedForms?: Array<{ id: string; name: string; type: string }>;
  projects?: Array<{ id: string; name: string }>;
  showNotification: (text: string) => void;
  setView?: (view: any) => void;
}

export const WorkflowManagementView: React.FC<WorkflowManagementViewProps> = ({
  savedForms = [],
  showNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'integrations' | 'logs' | 'gateway' | 'sandbox'>('integrations');
  const [integrations, setIntegrations] = useState<ThirdPartyFormIntegration[]>(initialThirdPartyIntegrations);
  const [logs, setLogs] = useState<IntegrationLogItem[]>(initialIntegrationLogs);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystemType, setSelectedSystemType] = useState<string>('ALL');
  const [logFilterStatus, setLogFilterStatus] = useState<string>('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<ThirdPartyFormIntegration | null>(null);
  const [viewingMappingInteg, setViewingMappingInteg] = useState<ThirdPartyFormIntegration | null>(null);
  const [viewingCredentialsInteg, setViewingCredentialsInteg] = useState<ThirdPartyFormIntegration | null>(null);
  const [viewingLogItem, setViewingLogItem] = useState<IntegrationLogItem | null>(null);
  
  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New Integration Form State
  const [newInteg, setNewInteg] = useState<Partial<ThirdPartyFormIntegration>>({
    name: '',
    code: '',
    systemType: 'ERP',
    systemName: '',
    protocol: 'webhook',
    targetFormId: savedForms[0]?.id || 'f1',
    targetFormName: savedForms[0]?.name || '采购付款审批单',
    targetWorkflowName: '通用审批流',
    description: '',
    callbackConfig: {
      onApprovedUrl: 'https://thirdparty.internal/api/form/approved',
      onRejectedUrl: 'https://thirdparty.internal/api/form/rejected',
      callbackAuthType: 'bearer',
      callbackToken: 'sec_bearer_token_' + Math.random().toString(36).substring(7),
      retryCount: 3,
      timeoutSec: 10,
    },
    fieldMappings: [
      { id: 'm-init-1', sourceField: 'external_order_id', sourceLabel: '外部业务单号', sourceType: 'string', targetFieldId: 'f_sn', targetFieldLabel: '单据编号', isRequired: true, transformRule: 'direct' },
      { id: 'm-init-2', sourceField: 'amount_yuan', sourceLabel: '申报金额', sourceType: 'number', targetFieldId: 'f_amt', targetFieldLabel: '涉及金额', isRequired: true, transformRule: 'direct' },
      { id: 'm-init-3', sourceField: 'applicant_user', sourceLabel: '申请人账号', sourceType: 'string', targetFieldId: 'f_user', targetFieldLabel: '申请人', isRequired: true, transformRule: 'direct' },
    ]
  });

  // Sandbox State
  const [sandboxSelectedIntegId, setSandboxSelectedIntegId] = useState<string>(initialThirdPartyIntegrations[0]?.id || '');
  const [sandboxPayload, setSandboxPayload] = useState<string>(
    JSON.stringify(
      {
        po_number: 'PO4500098999',
        vendor_name: '微盟数字科技股份有限公司',
        net_price_cent: 2880000,
        purchasing_group: 'MKT-GLOBAL',
        creator_mail: 'zhang.director@company.com',
        document_date: '2026-09-24',
        remarks: '秋季全渠道营销云平台年度订阅采购特批'
      },
      null,
      2
    )
  );
  const [sandboxTesting, setSandboxTesting] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);

  // Stats
  const activeCount = integrations.filter(i => i.status === 'active').length;
  const totalCallsCount = integrations.reduce((acc, cur) => acc + cur.stats.totalCalls, 0);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showNotification(`已成功复制到剪贴板: ${text.length > 24 ? text.slice(0, 24) + '...' : text}`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleToggleStatus = (id: string) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'active' ? 'disabled' : 'active';
        showNotification(`${item.name} 状态已变更为: ${nextStatus === 'active' ? '运行中' : '已暂停'}`);
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleDeleteIntegration = (id: string) => {
    setIntegrations(prev => prev.filter(i => i.id !== id));
    showNotification('已成功删除该第三方表单接入通道！');
  };

  const handleCreateOrUpdateIntegration = () => {
    if (!newInteg.name?.trim()) {
      showNotification('请输入第三方应用接入名称！');
      return;
    }

    if (editingIntegration) {
      setIntegrations(prev => prev.map(item => {
        if (item.id === editingIntegration.id) {
          return {
            ...item,
            ...newInteg,
            updatedAt: '刚刚',
          } as ThirdPartyFormIntegration;
        }
        return item;
      }));
      showNotification(`已更新第三方接入: ${newInteg.name}`);
    } else {
      const createdItem: ThirdPartyFormIntegration = {
        id: 'integ-' + Date.now(),
        name: newInteg.name || '新建第三方接入',
        code: (newInteg.code || 'INTEG_' + Date.now().toString(36)).toUpperCase(),
        systemType: newInteg.systemType || 'ERP',
        systemName: newInteg.systemName || '第三方系统',
        systemIconBg: 'bg-blue-600',
        protocol: newInteg.protocol || 'webhook',
        endpoint: `https://api.formcraft.internal/v1/thirdparty/${(newInteg.code || 'form').toLowerCase()}/webhook`,
        appKey: 'fc_app_' + Math.random().toString(36).substring(2, 10),
        appSecret: 'sec_' + Math.random().toString(36).substring(2, 18),
        status: 'active',
        targetFormId: newInteg.targetFormId || 'f1',
        targetFormName: newInteg.targetFormName || '采购付款审批单',
        targetWorkflowName: newInteg.targetWorkflowName || '通用审批流',
        fieldMappings: newInteg.fieldMappings || [],
        callbackConfig: newInteg.callbackConfig || {
          onApprovedUrl: '',
          onRejectedUrl: '',
          callbackAuthType: 'bearer',
          callbackToken: '',
          retryCount: 3,
          timeoutSec: 10,
        },
        stats: {
          totalCalls: 0,
          successCalls: 0,
          failedCalls: 0,
          lastTriggerTime: '刚刚创建',
          avgDurationMs: 0,
        },
        createdAt: '2026-09-24',
        updatedAt: '刚刚',
        description: newInteg.description || '由管理员新建的第三方应用接入通道。',
      };
      setIntegrations(prev => [createdItem, ...prev]);
      showNotification(`成功接入第三方应用表单: ${createdItem.name}！已自动签发接入 AppKey 与 Webhook 地址。`);
    }

    setIsCreateModalOpen(false);
    setEditingIntegration(null);
  };

  const handleRunSandbox = () => {
    setSandboxTesting(true);
    setSandboxResult(null);

    const currentInteg = integrations.find(i => i.id === sandboxSelectedIntegId) || integrations[0];

    setTimeout(() => {
      try {
        const parsed = JSON.parse(sandboxPayload);
        const mappedFields: Record<string, any> = {};
        
        currentInteg.fieldMappings.forEach(mapping => {
          const val = parsed[mapping.sourceField];
          if (val !== undefined) {
            mappedFields[mapping.targetFieldLabel] = mapping.transformRule === 'cent_to_yuan' 
              ? `¥ ${(val / 100).toLocaleString()}` 
              : val;
          }
        });

        const newLog: IntegrationLogItem = {
          id: 'log-sandbox-' + Date.now(),
          integrationId: currentInteg.id,
          integrationName: currentInteg.name,
          systemType: currentInteg.systemType,
          externalSn: parsed.po_number || parsed.external_order_id || parsed.opportunity_id || 'MOCK-' + Math.floor(Math.random() * 90000 + 10000),
          applicant: parsed.creator_mail || parsed.applicant_user || '联调测试员',
          applicantDept: parsed.purchasing_group || '技术联调沙箱',
          targetFormName: currentInteg.targetFormName,
          receivedTime: '刚刚',
          status: 'processing',
          callbackStatus: 'pending',
          payloadRaw: parsed,
          resultMessage: '沙箱模拟推送验签通过，成功生成待办流程实例并进入审批队列！',
          durationMs: Math.floor(Math.random() * 150 + 120),
        };

        setLogs(prev => [newLog, ...prev]);
        setSandboxResult({
          success: true,
          httpStatus: 200,
          code: 'SUCCESS',
          message: '第三方表单报文解析成功，已自动实例化工作流并触发首节点！',
          instanceSn: newLog.externalSn,
          matchedFieldsCount: Object.keys(mappedFields).length,
          totalMappings: currentInteg.fieldMappings.length,
          mappedData: mappedFields,
          workflowTrigger: {
            workflowName: currentInteg.targetWorkflowName,
            targetForm: currentInteg.targetFormName,
            status: '审批中 (待部门主管审批)',
            nextAssignee: '当前用户 (管理员)'
          }
        });
        showNotification('联调测试成功！已成功模拟触发第三方表单流转并记录日志。');
      } catch (err) {
        setSandboxResult({
          success: false,
          httpStatus: 400,
          code: 'INVALID_JSON_PAYLOAD',
          message: 'JSON 报文解析错误，请检查输入的测试报文格式是否规范。',
        });
        showNotification('模拟推送失败：JSON 报文格式不合法');
      }
      setSandboxTesting(false);
    }, 800);
  };

  // Filtered lists
  const filteredIntegrations = integrations.filter(item => {
    if (selectedSystemType !== 'ALL' && item.systemType !== selectedSystemType) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.systemName.toLowerCase().includes(q) ||
      item.targetFormName.toLowerCase().includes(q)
    );
  });

  const filteredLogs = logs.filter(item => {
    if (logFilterStatus !== 'ALL' && item.status !== logFilterStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.externalSn.toLowerCase().includes(q) ||
      item.applicant.toLowerCase().includes(q) ||
      item.integrationName.toLowerCase().includes(q) ||
      item.targetFormName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* 顶部标题与第三方表单接入核心指引 Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-8 md:p-10 shadow-2xl border border-white/10">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 -mb-20 w-64 h-64 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              第三方应用表单接入中台 · OpenAPI / Webhook 驱动
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              流程管理与外部应用表单接入
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              面向 ERP (SAP/用友/金蝶)、CRM、HRM、飞书人事及自研业务系统。通过标准化 Webhook 回调或 OpenAPI 将第三方应用的表单数据无缝接入本平台，驱动多级审批流转，终审结果自动回调写回业务底表。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('sandbox')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              联调沙箱测试
            </button>
            <button
              onClick={() => {
                setEditingIntegration(null);
                setNewInteg({
                  name: '',
                  code: 'INTEG_' + Date.now().toString(36).toUpperCase(),
                  systemType: 'ERP',
                  systemName: 'SAP S/4HANA',
                  protocol: 'webhook',
                  targetFormId: savedForms[0]?.id || 'f1',
                  targetFormName: savedForms[0]?.name || '采购付款审批单',
                  targetWorkflowName: '通用审批流',
                  description: '',
                  callbackConfig: {
                    onApprovedUrl: 'https://thirdparty.internal/api/approved',
                    onRejectedUrl: 'https://thirdparty.internal/api/rejected',
                    callbackAuthType: 'bearer',
                    callbackToken: 'token_' + Math.random().toString(36).substring(7),
                    retryCount: 3,
                    timeoutSec: 10,
                  },
                  fieldMappings: [
                    { id: 'm-new-1', sourceField: 'external_id', sourceLabel: '外部单号', sourceType: 'string', targetFieldId: 'f_sn', targetFieldLabel: '单据编号', isRequired: true, transformRule: 'direct' },
                    { id: 'm-new-2', sourceField: 'amount', sourceLabel: '申报金额', sourceType: 'number', targetFieldId: 'f_amt', targetFieldLabel: '付款金额', isRequired: true, transformRule: 'direct' },
                  ]
                });
                setIsCreateModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-extrabold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              接入第三方表单
            </button>
          </div>
        </div>

        {/* 核心指标统计卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-white">
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block">已接入第三方通道</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black">{integrations.length}</span>
              <span className="text-xs text-emerald-400 font-bold">{activeCount} 个运行中</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block">本月流转触发总量</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black font-mono">{totalCallsCount.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-normal">次</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block">外部表单流转成功率</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-emerald-400">99.8%</span>
              <span className="text-xs text-slate-400 font-normal">高可用</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block">审批结果回写耗时</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-blue-400 font-mono">230ms</span>
              <span className="text-xs text-slate-400 font-normal">平均</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 导航 */}
      <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'integrations'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <Workflow className="w-4 h-4" />
            接入通道管理 ({integrations.length})
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <Clock className="w-4 h-4" />
            流转记录与回写审计
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface">
              {logs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gateway')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'gateway'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            开放网关与凭证规范
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'sandbox'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <Play className="w-4 h-4 text-emerald-500" />
            在线联调沙箱
          </button>
        </div>

        {/* 快捷帮助 */}
        <span className="text-xs text-outline font-medium hidden md:inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          第三方系统通过 Webhook / OpenAPI 自动生成表单流转
        </span>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: 接入通道管理 (Integrations List) */}
      {/* ============================================================ */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {/* 筛选与搜索 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {[
                { label: '全部系统', value: 'ALL' },
                { label: 'ERP 业务系统', value: 'ERP' },
                { label: 'CRM 客户关系', value: 'CRM' },
                { label: 'HRM 人事系统', value: 'HRM' },
                { label: '自研中台微服务', value: 'CUSTOM' },
              ].map(btn => (
                <button
                  key={btn.value}
                  onClick={() => setSelectedSystemType(btn.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedSystemType === btn.value
                      ? 'bg-on-surface text-surface shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索接入名称、系统、表单..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* 接入通道卡片网格 */}
          {filteredIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map(integ => (
                <div
                  key={integ.id}
                  className="bg-surface rounded-3xl p-6 border border-outline-variant/80 hover:border-primary/60 transition-all hover:shadow-xl flex flex-col justify-between space-y-5 group relative"
                >
                  <div className="space-y-4">
                    {/* 卡片头部 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl ${integ.systemIconBg} text-white flex items-center justify-center font-bold text-sm shadow-md`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-on-surface">{integ.systemName}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                              {integ.systemType}
                            </span>
                          </div>
                          <p className="text-[11px] text-outline font-mono mt-0.5">{integ.code}</p>
                        </div>
                      </div>

                      {/* 运行状态开关 */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(integ.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all flex items-center gap-1.5 ${
                          integ.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : integ.status === 'testing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                        title="点击切换启用状态"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${integ.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {integ.status === 'active' ? '正常流转中' : integ.status === 'testing' ? '联调测试中' : '已暂停'}
                      </button>
                    </div>

                    {/* 接入名称与描述 */}
                    <div>
                      <h3 className="text-sm font-extrabold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                        {integ.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant font-medium mt-1.5 line-clamp-2 leading-relaxed">
                        {integ.description}
                      </p>
                    </div>

                    {/* 关联的本系统表单与流转流 */}
                    <div className="p-3 bg-surface-container-low/60 rounded-2xl border border-outline-variant/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-outline text-[11px] font-medium">绑定的表单：</span>
                        <span className="font-bold text-on-surface flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          {integ.targetFormName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-outline text-[11px] font-medium">触发流程：</span>
                        <span className="font-semibold text-on-surface text-[11px]">
                          {integ.targetWorkflowName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-outline text-[11px] font-medium">接入方式：</span>
                        <span className="font-mono text-[11px] font-bold text-indigo-700 uppercase">
                          {integ.protocol === 'webhook' ? 'Webhook 实时订阅' : 'RESTful OpenAPI'}
                        </span>
                      </div>
                    </div>

                    {/* 映射字段与调用统计 */}
                    <div className="flex items-center justify-between text-[11px] px-1">
                      <button
                        onClick={() => setViewingMappingInteg(integ)}
                        className="text-primary hover:underline font-bold flex items-center gap-1"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        已配置 {integ.fieldMappings.length} 项字段映射 →
                      </button>
                      <span className="text-outline font-medium">
                        累计调用: <strong className="text-on-surface font-mono">{integ.stats.totalCalls}</strong>
                      </span>
                    </div>
                  </div>

                  {/* 底部操作工具栏 */}
                  <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingCredentialsInteg(integ)}
                        className="px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-bold transition-all flex items-center gap-1"
                        title="查看接入凭证及端点"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        接入凭证
                      </button>
                      <button
                        onClick={() => {
                          setSandboxSelectedIntegId(integ.id);
                          setActiveTab('sandbox');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-all flex items-center gap-1 border border-emerald-200"
                        title="进入联调沙箱测试"
                      >
                        <Play className="w-3 h-3" />
                        联调
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingIntegration(integ);
                          setNewInteg({ ...integ });
                          setIsCreateModalOpen(true);
                        }}
                        className="p-1.5 text-outline hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                        title="编辑配置"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteIntegration(integ.id)}
                        className="p-1.5 text-outline hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="删除通道"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-container-low/30 rounded-3xl border-2 border-dashed border-outline-variant p-8 space-y-3">
              <Workflow className="w-12 h-12 text-outline/40 mx-auto" />
              <h3 className="text-sm font-bold text-on-surface">未匹配到第三方应用表单接入</h3>
              <p className="text-xs text-outline">您可以更换搜索关键词或点击右上角「接入第三方表单」立即新增</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: 流转明细与回写审计 (Execution Logs) */}
      {/* ============================================================ */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">状态过滤：</span>
              {['ALL', 'processing', 'approved', 'rejected'].map(st => (
                <button
                  key={st}
                  onClick={() => setLogFilterStatus(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    logFilterStatus === st
                      ? 'bg-on-surface text-surface'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {st === 'ALL' ? '全部明细' : st === 'processing' ? '审批流转中' : st === 'approved' ? '已终审通过' : '已被驳回'}
                </button>
              ))}
            </div>

            <div className="text-xs text-outline font-medium">
              共记录 <strong className="text-on-surface font-mono">{filteredLogs.length}</strong> 条第三方表单事件上报
            </div>
          </div>

          <div className="bg-surface rounded-3xl border border-outline-variant/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low/80 text-outline border-b border-outline-variant/60 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">外部单号 / 来源系统</th>
                    <th className="py-3.5 px-4">对应表单与流程</th>
                    <th className="py-3.5 px-4">发起人 / 部门</th>
                    <th className="py-3.5 px-4">接收时间</th>
                    <th className="py-3.5 px-4">审批状态</th>
                    <th className="py-3.5 px-4">结果回写状态</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-on-surface">{log.externalSn}</div>
                        <div className="text-[11px] text-outline mt-0.5 flex items-center gap-1">
                          <span className="font-bold text-primary">{log.systemType}</span>
                          <span>·</span>
                          <span className="truncate max-w-[180px]">{log.integrationName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-on-surface">{log.targetFormName}</div>
                        <div className="text-[11px] text-outline mt-0.5">多级会签审批</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-on-surface">{log.applicant}</div>
                        <div className="text-[11px] text-outline">{log.applicantDept}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-outline text-[11px]">
                        {log.receivedTime}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          log.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'processing'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.status === 'approved' ? '审批通过' : log.status === 'processing' ? '审批流转中' : '已驳回'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${log.callbackStatus === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="font-semibold text-[11px] text-on-surface">
                            {log.callbackStatus === 'success' ? '已成功回写' : '待处理回调'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setViewingLogItem(log)}
                          className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors"
                        >
                          查看报文
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: 开放网关与凭证规范 (Gateway & OpenAPI Specs) */}
      {/* ============================================================ */}
      {activeTab === 'gateway' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* API Endpoint Card */}
              <div className="bg-surface rounded-3xl p-6 border border-outline-variant/80 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-extrabold text-on-surface">标准第三方表单接入 API 规范</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                    POST /v1/thirdparty/form/submit
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  任何第三方系统只需发起标准的 HTTP POST 请求，并在请求头中携带签发的 <code className="font-mono bg-surface-container px-1 py-0.5 rounded text-primary">X-App-Key</code> 和由密钥生成的 <code className="font-mono bg-surface-container px-1 py-0.5 rounded text-primary">X-Signature</code>，即可直接将业务表单推送进工作流中心。
                </p>

                <div className="bg-slate-900 rounded-2xl p-4 text-slate-200 font-mono text-xs space-y-2 overflow-x-auto relative">
                  <button
                    onClick={() => handleCopy(`curl -X POST https://api.formcraft.internal/v1/thirdparty/form/submit \\\n  -H "Content-Type: application/json" \\\n  -H "X-App-Key: fc_app_sap_987a6c52" \\\n  -H "X-Timestamp: 1727142000" \\\n  -H "X-Signature: c8b9281a0b..." \\\n  -d '{\n    "po_number": "PO4500098124",\n    "vendor_name": "创艺会展服务有限公司",\n    "net_price_cent": 1860000\n  }'`, 'curl')}
                    className="absolute right-3 top-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1"
                  >
                    {copiedKey === 'curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    复制 cURL
                  </button>
                  <pre className="text-[11px] leading-relaxed">
{`curl -X POST https://api.formcraft.internal/v1/thirdparty/form/submit \\
  -H "Content-Type: application/json" \\
  -H "X-App-Key: fc_app_sap_987a6c52" \\
  -H "X-Timestamp: 1727142000" \\
  -H "X-Signature: 7b89d4128f90c34e81a329e47265a109..." \\
  -d '{
    "po_number": "PO4500098124",
    "vendor_name": "创艺会展服务有限公司",
    "net_price_cent": 1860000,
    "creator_mail": "xiao.manager@company.com"
  }'`}
                  </pre>
                </div>
              </div>

              {/* 签名算法规范 */}
              <div className="bg-surface rounded-3xl p-6 border border-outline-variant/80 space-y-4 shadow-sm">
                <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  接口鉴权与签名防篡改机制 (HMAC-SHA256)
                </h3>
                <ol className="list-decimal list-inside text-xs text-on-surface-variant space-y-2 leading-relaxed">
                  <li>拼接待签名字符串：<code className="font-mono bg-surface-container px-1 py-0.5 rounded text-primary">sign_str = app_key + timestamp + raw_json_body</code>。</li>
                  <li>使用分配给该接入通道的 <code className="font-mono bg-surface-container px-1 py-0.5 rounded text-primary">AppSecret</code> 作为 HMAC 密钥进行哈希计算。</li>
                  <li>将摘要转化为十六进制全小写字符串，填入请求头 <code className="font-mono bg-surface-container px-1 py-0.5 rounded text-primary">X-Signature</code>。</li>
                  <li>服务端在收到报文后将在 300 秒有效时间窗口内核验签名，防止重放攻击。</li>
                </ol>
              </div>
            </div>

            {/* Global API Gateway Settings */}
            <div className="space-y-6">
              <div className="bg-surface rounded-3xl p-6 border border-outline-variant/80 space-y-4 shadow-sm">
                <h3 className="text-sm font-extrabold text-on-surface">网关全局配置</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-outline text-[11px] font-bold block mb-1">第三方来源 IP 白名单</label>
                    <input
                      type="text"
                      defaultValue="10.0.0.0/8, 172.16.0.0/12, 192.168.1.1"
                      className="w-full text-xs font-mono p-2.5 rounded-xl border border-outline-variant bg-surface-container-low"
                    />
                    <span className="text-[10px] text-outline mt-1 block">留空则允许公网合规验签访问</span>
                  </div>
                  <div>
                    <label className="text-outline text-[11px] font-bold block mb-1">接口调用限频策略</label>
                    <select className="w-full text-xs p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-medium">
                      <option>标准企业版: 1,000 QPS / 通道</option>
                      <option>大客户专线: 5,000 QPS / 通道</option>
                      <option>无限制 (内网专有部署)</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => showNotification('已保存网关安全与白名单配置！')}
                      className="w-full py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20"
                    >
                      保存安全配置
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-2">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                  第三方应用专属 SDK 支持
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  除标准 REST Webhook 外，平台现已提供 Python、Java (Spring Boot Starter)、Node.js 及 Go 语言的封装 SDK，支持一行代码接入业务表单并监听流转结果。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: 在线联调沙箱 (Sandbox Test) */}
      {/* ============================================================ */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl p-6 md:p-8 border border-outline-variant/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
              <div>
                <h3 className="text-base font-extrabold text-on-surface flex items-center gap-2">
                  <Play className="w-5 h-5 text-emerald-600" />
                  第三方表单推送联调沙箱
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">
                  选择已配置的第三方接入通道，模拟外部业务系统发起表单推送请求，验证字段映射、审批流触发与回调。
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-on-surface">选择测试通道:</label>
                <select
                  value={sandboxSelectedIntegId}
                  onChange={(e) => setSandboxSelectedIntegId(e.target.value)}
                  className="text-xs font-bold p-2.5 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none"
                >
                  {integrations.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.systemName})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left: Input Payload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-on-surface">模拟外部系统上报的 JSON 报文:</span>
                  <button
                    onClick={() => {
                      setSandboxPayload(
                        JSON.stringify(
                          {
                            po_number: 'PO45000' + Math.floor(Math.random() * 90000 + 10000),
                            vendor_name: '阿里云计算有限公司',
                            net_price_cent: 4500000,
                            purchasing_group: 'IT-CLOUD',
                            creator_mail: 'devops.admin@company.com',
                            document_date: '2026-09-24',
                            remarks: '核心容灾可用区算力扩容申请'
                          },
                          null,
                          2
                        )
                      );
                      showNotification('已随机生成示例业务单据报文');
                    }}
                    className="text-primary text-[11px] font-bold hover:underline"
                  >
                    随机生成业务报文
                  </button>
                </div>

                <textarea
                  value={sandboxPayload}
                  onChange={(e) => setSandboxPayload(e.target.value)}
                  rows={14}
                  className="w-full text-xs font-mono p-4 rounded-2xl border border-outline-variant bg-slate-900 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                />

                <button
                  disabled={sandboxTesting}
                  onClick={handleRunSandbox}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98"
                >
                  {sandboxTesting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      模拟发送报文与验签流转中...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      立即发送模拟推送 (Trigger Webhook)
                    </>
                  )}
                </button>
              </div>

              {/* Right: Live Result */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-on-surface">处理响应与表单流程触发结果:</span>

                {sandboxResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl border text-xs space-y-4 ${
                      sandboxResult.success
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <div>
                          <span className="font-extrabold text-emerald-900">HTTP {sandboxResult.httpStatus} OK</span>
                          <p className="text-[11px] text-emerald-700">{sandboxResult.message}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-200/60 text-emerald-900 font-bold rounded-md">
                        {sandboxResult.code}
                      </span>
                    </div>

                    {sandboxResult.matchedFieldsCount !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] text-emerald-800 font-bold">
                          <span>字段映射匹配率:</span>
                          <span>{sandboxResult.matchedFieldsCount} / {sandboxResult.totalMappings} 成功映射</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1.5 font-mono text-[11px]">
                          {Object.entries(sandboxResult.mappedData).map(([k, v]: [string, any]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-slate-500">{k}:</span>
                              <span className="font-bold text-slate-800">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sandboxResult.workflowTrigger && (
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1.5 text-[11px]">
                        <span className="font-bold text-slate-800 block">⚡ 工作流引擎联动详情：</span>
                        <div className="flex justify-between">
                          <span className="text-slate-500">实例化表单：</span>
                          <span className="font-bold text-primary">{sandboxResult.workflowTrigger.targetForm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">触发审批流：</span>
                          <span className="font-semibold text-slate-800">{sandboxResult.workflowTrigger.workflowName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">流转状态：</span>
                          <span className="font-bold text-amber-600">{sandboxResult.workflowTrigger.status}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="h-72 rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-8 text-center text-outline space-y-2 bg-surface-container-low/20">
                    <Zap className="w-10 h-10 text-outline/30" />
                    <p className="text-xs font-bold">等待执行联调测试</p>
                    <p className="text-[11px]">点击左侧“立即发送模拟推送”按钮即可实时捕获响应及流程触发状况</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 弹窗 1: 新建 / 编辑第三方应用表单接入 */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-surface rounded-3xl shadow-2xl border border-outline-variant/80 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/60 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface">
                      {editingIntegration ? '编辑第三方应用表单接入' : '新建第三方应用表单接入'}
                    </h3>
                    <p className="text-[11px] text-outline">配置来源系统、目标审批表单与字段映射规则</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 text-outline hover:text-on-surface rounded-xl hover:bg-surface-container transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                {/* 1. 基本信息 */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-on-surface">1. 接入基本信息</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-outline text-[11px] font-bold block mb-1">接入通道名称 *</label>
                      <input
                        type="text"
                        value={newInteg.name || ''}
                        onChange={(e) => setNewInteg({ ...newInteg, name: e.target.value })}
                        placeholder="例：SAP S/4HANA 采购订单审批"
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-outline text-[11px] font-bold block mb-1">接入唯一编码 (Code) *</label>
                      <input
                        type="text"
                        value={newInteg.code || ''}
                        onChange={(e) => setNewInteg({ ...newInteg, code: e.target.value.toUpperCase() })}
                        placeholder="例：SAP_PO_APPROVAL"
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-outline text-[11px] font-bold block mb-1">第三方系统类型</label>
                      <select
                        value={newInteg.systemType || 'ERP'}
                        onChange={(e) => setNewInteg({ ...newInteg, systemType: e.target.value as SystemType })}
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-medium"
                      >
                        <option value="ERP">ERP 业务系统 (SAP / 用友 / 金蝶)</option>
                        <option value="CRM">CRM 客户管理 (Salesforce / 纷享销客)</option>
                        <option value="HRM">HRM 人事系统 (北森 / 飞书人事)</option>
                        <option value="CUSTOM">自研业务中台微服务</option>
                        <option value="OA">OA 办公自动化</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-outline text-[11px] font-bold block mb-1">第三方系统名称</label>
                      <input
                        type="text"
                        value={newInteg.systemName || ''}
                        onChange={(e) => setNewInteg({ ...newInteg, systemName: e.target.value })}
                        placeholder="例：SAP S/4HANA Cloud"
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. 绑定目标表单与流程 */}
                <div className="space-y-3 pt-3 border-t border-outline-variant/60">
                  <h4 className="text-xs font-extrabold text-on-surface">2. 绑定的审批表单与工作流</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-outline text-[11px] font-bold block mb-1">目标关联表单</label>
                      <select
                        value={newInteg.targetFormId || ''}
                        onChange={(e) => {
                          const form = savedForms.find(f => f.id === e.target.value);
                          setNewInteg({
                            ...newInteg,
                            targetFormId: e.target.value,
                            targetFormName: form?.name || '选中表单',
                          });
                        }}
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-bold"
                      >
                        {savedForms.length > 0 ? (
                          savedForms.map(f => (
                            <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                          ))
                        ) : (
                          <>
                            <option value="f2">采购付款审批单 (workflow)</option>
                            <option value="f1">特批商务折扣申请 (workflow)</option>
                            <option value="f3">异常考勤申报表 (workflow)</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-outline text-[11px] font-bold block mb-1">触发审批流名称</label>
                      <input
                        type="text"
                        value={newInteg.targetWorkflowName || '多级审批流'}
                        onChange={(e) => setNewInteg({ ...newInteg, targetWorkflowName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. 结果回调配置 */}
                <div className="space-y-3 pt-3 border-t border-outline-variant/60">
                  <h4 className="text-xs font-extrabold text-on-surface">3. 审批结果回写配置 (Callback)</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-outline text-[11px] font-bold block mb-1">终审通过回调 URL</label>
                      <input
                        type="text"
                        value={newInteg.callbackConfig?.onApprovedUrl || ''}
                        onChange={(e) => setNewInteg({
                          ...newInteg,
                          callbackConfig: {
                            ...newInteg.callbackConfig!,
                            onApprovedUrl: e.target.value,
                          }
                        })}
                        placeholder="https://thirdparty.internal/api/po/release-approve"
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-outline text-[11px] font-bold block mb-1">审批驳回回调 URL</label>
                      <input
                        type="text"
                        value={newInteg.callbackConfig?.onRejectedUrl || ''}
                        onChange={(e) => setNewInteg({
                          ...newInteg,
                          callbackConfig: {
                            ...newInteg.callbackConfig!,
                            onRejectedUrl: e.target.value,
                          }
                        })}
                        placeholder="https://thirdparty.internal/api/po/release-reject"
                        className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-outline-variant/60 flex items-center justify-end gap-3 bg-surface-container-low/60 shrink-0">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface rounded-xl hover:bg-surface-container transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateOrUpdateIntegration}
                  className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/20"
                >
                  {editingIntegration ? '保存修改' : '确认创建并签发凭证'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 弹窗 2: 字段映射详情查看与配置 (Field Mapping Modal) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {viewingMappingInteg && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl shadow-2xl border border-outline-variant/80 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/60">
                <div className="flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface">
                      字段动态映射规则 · {viewingMappingInteg.name}
                    </h3>
                    <p className="text-[11px] text-outline">
                      绑定第三方 JSON 报文属性至《{viewingMappingInteg.targetFormName}》表单字段
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingMappingInteg(null)}
                  className="p-1.5 text-outline hover:text-on-surface rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] text-outline border-b border-outline-variant/60 uppercase font-bold">
                    <tr>
                      <th className="py-2 px-3">第三方报文 Key</th>
                      <th className="py-2 px-3">说明</th>
                      <th className="py-2 px-3">映射方式</th>
                      <th className="py-2 px-3">目标表单字段</th>
                      <th className="py-2 px-3">必填</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 font-medium">
                    {viewingMappingInteg.fieldMappings.map(m => (
                      <tr key={m.id} className="hover:bg-surface-container-low/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{m.sourceField}</td>
                        <td className="py-2.5 px-3 text-on-surface">{m.sourceLabel}</td>
                        <td className="py-2.5 px-3 text-[11px] text-outline">
                          {m.transformRule === 'cent_to_yuan' ? '分转元(/100)' : m.transformRule === 'timestamp_to_date' ? '时间戳转换' : '直接透传'}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-on-surface">{m.targetFieldLabel}</td>
                        <td className="py-2.5 px-3">
                          {m.isRequired ? <span className="text-rose-500 font-bold">是</span> : <span className="text-slate-400">否</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-outline-variant/60 flex justify-between items-center bg-surface-container-low/60">
                <button
                  onClick={() => {
                    showNotification('已添加一条新映射规则');
                  }}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加映射项
                </button>
                <button
                  onClick={() => setViewingMappingInteg(null)}
                  className="px-5 py-2 text-xs font-bold text-white bg-primary rounded-xl"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 弹窗 3: 查看接入凭证 (Credentials Modal) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {viewingCredentialsInteg && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl shadow-2xl border border-outline-variant/80 w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/60">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-extrabold text-on-surface">第三方接入凭证及端点</h3>
                </div>
                <button
                  onClick={() => setViewingCredentialsInteg(null)}
                  className="p-1.5 text-outline hover:text-on-surface rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="text-outline text-[11px] font-bold block mb-1">Webhook / API 接入地址</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={viewingCredentialsInteg.endpoint}
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-mono text-[11px]"
                    />
                    <button
                      onClick={() => handleCopy(viewingCredentialsInteg.endpoint, 'endpoint')}
                      className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-outline text-[11px] font-bold block mb-1">AppKey (客户端标识)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={viewingCredentialsInteg.appKey}
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-mono text-[11px]"
                    />
                    <button
                      onClick={() => handleCopy(viewingCredentialsInteg.appKey, 'appKey')}
                      className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-outline text-[11px] font-bold block mb-1">AppSecret (HMAC 验签密钥)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value={viewingCredentialsInteg.appSecret}
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low font-mono text-[11px]"
                    />
                    <button
                      onClick={() => handleCopy(viewingCredentialsInteg.appSecret, 'appSecret')}
                      className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-rose-500 mt-1 block">密钥高度保密，请勿在客户端公开泄露。</span>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-outline-variant/60 flex justify-end bg-surface-container-low/60">
                <button
                  onClick={() => setViewingCredentialsInteg(null)}
                  className="px-5 py-2 text-xs font-bold text-white bg-primary rounded-xl"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 弹窗 4: 查看原始报文及日志 (Log Detail Modal) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {viewingLogItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl shadow-2xl border border-outline-variant/80 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/60">
                <div>
                  <h3 className="text-sm font-extrabold text-on-surface">第三方表单事件报文明细</h3>
                  <p className="text-[11px] text-outline font-mono">{viewingLogItem.externalSn}</p>
                </div>
                <button
                  onClick={() => setViewingLogItem(null)}
                  className="p-1.5 text-outline hover:text-on-surface rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="p-3 bg-surface-container-low rounded-xl space-y-1">
                  <div className="flex justify-between">
                    <span className="text-outline">接入来源：</span>
                    <span className="font-bold text-on-surface">{viewingLogItem.integrationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">触发耗时：</span>
                    <span className="font-mono text-emerald-600 font-bold">{viewingLogItem.durationMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">流转结果：</span>
                    <span className="font-bold text-on-surface">{viewingLogItem.resultMessage}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface text-[11px]">上报原始 JSON Payload:</span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(viewingLogItem.payloadRaw, null, 2), 'rawPayload')}
                      className="text-primary hover:underline text-[11px] font-bold"
                    >
                      复制 JSON
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
                    {JSON.stringify(viewingLogItem.payloadRaw, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-outline-variant/60 flex justify-end bg-surface-container-low/60">
                <button
                  onClick={() => setViewingLogItem(null)}
                  className="px-5 py-2 text-xs font-bold text-white bg-primary rounded-xl"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
