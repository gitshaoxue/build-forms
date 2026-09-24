import React, { useState } from 'react';
import {
  GitBranch,
  Settings,
  Layers,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shuffle,
  ShieldCheck,
  Building2,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  Play,
  Pause,
  ArrowRight,
  ChevronRight,
  Filter,
  Check,
  X,
  Zap,
  Sliders,
  FileText,
  UserCheck,
  Send,
  AlertTriangle,
  Flame,
  ExternalLink,
  Copy,
  Sparkles,
  Info,
  Calendar,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ProcessConfigModel,
  ProcessThirdPartyField,
  ProcessTemplate,
  ProcessInstance,
  ProcessAlert,
  ThirdPartySystemName,
  ProcessNodeDef
} from './types';
import {
  initialProcessConfigs,
  initialProcessTemplates,
  initialProcessInstances,
  initialProcessAlerts,
  monitorOverviewMetrics
} from './mockData';

interface ProcessManagementViewProps {
  showNotification: (text: string) => void;
  setView?: (view: any) => void;
}

export const ProcessManagementView: React.FC<ProcessManagementViewProps> = ({
  showNotification,
}) => {
  // Tabs: 流程配置 | 流程模板 | 流程实例 | 流程监控
  const [activeTab, setActiveTab] = useState<'config' | 'template' | 'instance' | 'monitor'>('config');

  // ==========================================
  // STATE: 1. 流程配置 (配置对接三方系统的表单字段)
  // ==========================================
  const [configs, setConfigs] = useState<ProcessConfigModel[]>(initialProcessConfigs);
  const [selectedConfigId, setSelectedConfigId] = useState<string>(initialProcessConfigs[0]?.id || '');
  const [configSearchQuery, setConfigSearchQuery] = useState('');
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<ProcessThirdPartyField | null>(null);

  // Field Form State
  const [fieldFormData, setFieldFormData] = useState<Partial<ProcessThirdPartyField>>({
    sourceKey: '',
    sourceLabel: '',
    sourceSystem: 'SAP S/4HANA ERP',
    dataType: 'string',
    targetVariable: '',
    targetComponent: '单行文本',
    isRequired: true,
    transformRule: 'none',
    sampleValue: '',
    description: '',
    nodePermissions: {
      startNode: 'edit',
      deptManagerNode: 'read',
      financeAuditNode: 'read',
      finalLeaderNode: 'read',
    },
  });

  // ==========================================
  // STATE: 2. 流程模板
  // ==========================================
  const [templates, setTemplates] = useState<ProcessTemplate[]>(initialProcessTemplates);
  const [templateCategory, setTemplateCategory] = useState<string>('ALL');
  const [templateSearch, setTemplateSearch] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<ProcessTemplate | null>(null);

  // ==========================================
  // STATE: 3. 流程实例
  // ==========================================
  const [instances, setInstances] = useState<ProcessInstance[]>(initialProcessInstances);
  const [instanceStatusFilter, setInstanceStatusFilter] = useState<string>('ALL');
  const [instanceSearch, setInstanceSearch] = useState('');
  const [selectedInstance, setSelectedInstance] = useState<ProcessInstance | null>(null);
  const [remindSuccessId, setRemindSuccessId] = useState<string | null>(null);

  // ==========================================
  // STATE: 4. 流程监控
  // ==========================================
  const [alerts, setAlerts] = useState<ProcessAlert[]>(initialProcessAlerts);

  // Current selected process config model
  const activeConfig = configs.find(c => c.id === selectedConfigId) || configs[0];

  // Handlers for 流程配置
  const handleSaveField = () => {
    if (!fieldFormData.sourceKey?.trim() || !fieldFormData.sourceLabel?.trim()) {
      showNotification('请填写第三方报文字段 Key 和业务名称！');
      return;
    }

    if (!activeConfig) return;

    if (editingField) {
      // Update existing field
      setConfigs(prev => prev.map(c => {
        if (c.id === activeConfig.id) {
          return {
            ...c,
            updatedAt: '刚刚',
            fields: c.fields.map(f => f.id === editingField.id ? { ...f, ...fieldFormData } as ProcessThirdPartyField : f),
          };
        }
        return c;
      }));
      showNotification(`已更新第三方字段【${fieldFormData.sourceLabel}】的映射与权限！`);
    } else {
      // Add new field
      const newField: ProcessThirdPartyField = {
        id: 'f-' + Date.now(),
        sourceKey: fieldFormData.sourceKey || 'custom_field',
        sourceLabel: fieldFormData.sourceLabel || '自定义业务字段',
        sourceSystem: activeConfig.systemName,
        dataType: fieldFormData.dataType || 'string',
        targetVariable: fieldFormData.targetVariable || `flow.${fieldFormData.sourceKey}`,
        targetComponent: fieldFormData.targetComponent || '单行文本',
        isRequired: !!fieldFormData.isRequired,
        transformRule: fieldFormData.transformRule || 'none',
        sampleValue: fieldFormData.sampleValue || '',
        description: fieldFormData.description || '自定义三方表单映射字段',
        nodePermissions: fieldFormData.nodePermissions || {
          startNode: 'edit',
          deptManagerNode: 'read',
          financeAuditNode: 'read',
          finalLeaderNode: 'read',
        },
      };

      setConfigs(prev => prev.map(c => {
        if (c.id === activeConfig.id) {
          return {
            ...c,
            updatedAt: '刚刚',
            fields: [...c.fields, newField],
          };
        }
        return c;
      }));
      showNotification(`成功为【${activeConfig.name}】添加三方对接字段【${newField.sourceLabel}】！`);
    }

    setIsFieldModalOpen(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!activeConfig) return;
    setConfigs(prev => prev.map(c => {
      if (c.id === activeConfig.id) {
        return {
          ...c,
          updatedAt: '刚刚',
          fields: c.fields.filter(f => f.id !== fieldId),
        };
      }
      return c;
    }));
    showNotification('已移除该第三方对接表单字段！');
  };

  // Handlers for 流程实例
  const handleRemind = (inst: ProcessInstance) => {
    setRemindSuccessId(inst.id);
    showNotification(`已向实例【${inst.instanceSn}】当前审批节点处理人发送加急催办通知！`);
    setTimeout(() => setRemindSuccessId(null), 3000);
  };

  const handleToggleSuspend = (instId: string) => {
    setInstances(prev => prev.map(i => {
      if (i.id === instId) {
        const nextStatus = i.status === 'suspended' ? 'running' : 'suspended';
        showNotification(`实例 ${i.instanceSn} 状态已变更为: ${nextStatus === 'running' ? '恢复运行' : '已挂起'}`);
        return { ...i, status: nextStatus };
      }
      return i;
    }));
  };

  const handleRetryCallback = (instId: string) => {
    setInstances(prev => prev.map(i => {
      if (i.id === instId) {
        return { ...i, callbackStatus: 'success' };
      }
      return i;
    }));
    showNotification('已重新触发第三方接口回调，外部系统状态同步成功 (HTTP 200 OK)！');
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    showNotification('预警告警已标记为已处理。');
  };

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* 顶部主视觉横幅 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-8 md:p-10 shadow-2xl border border-white/10">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 -mb-20 w-64 h-64 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              企业级业务流程管理中台 (BPM Engine)
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              流程管理
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              面向对接的第三方系统（SAP ERP、用友、CRM、飞书人事、自研中台）提供全生命周期的业务表单字段配置、审批流模板库、实时流转实例跟踪及健康度运维监控。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('monitor')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              健康监控大屏
            </button>
            <button
              onClick={() => {
                setActiveTab('config');
                setEditingField(null);
                setFieldFormData({
                  sourceKey: '',
                  sourceLabel: '',
                  sourceSystem: activeConfig?.systemName || 'SAP S/4HANA ERP',
                  dataType: 'string',
                  targetVariable: '',
                  targetComponent: '单行文本',
                  isRequired: true,
                  transformRule: 'none',
                  sampleValue: '',
                  description: '',
                  nodePermissions: {
                    startNode: 'edit',
                    deptManagerNode: 'read',
                    financeAuditNode: 'read',
                    finalLeaderNode: 'read',
                  },
                });
                setIsFieldModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-extrabold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              配置对接三方表单字段
            </button>
          </div>
        </div>

        {/* 顶部指标 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-white">
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block">对接三方字段总数</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black font-mono">
                {configs.reduce((acc, cur) => acc + cur.fields.length, 0)}
              </span>
              <span className="text-xs text-blue-300 font-medium">个高可用映射</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block">流程模板预置</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black font-mono">{templates.length}</span>
              <span className="text-xs text-slate-300 font-normal">套生产模板</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block">当前在办实例</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {instances.filter(i => i.status === 'running').length}
              </span>
              <span className="text-xs text-slate-300 font-normal">笔审批流转中</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block">SLA 达标合规率</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-blue-400">98.6%</span>
              <span className="text-xs text-emerald-400 font-bold">优秀</span>
            </div>
          </div>
        </div>
      </div>

      {/* 四大功能 TAB 切换栏: 流程配置 | 流程模板 | 流程实例 | 流程监控 */}
      <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'config'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <Settings className="w-4 h-4" />
            流程配置 (对接三方表单字段)
          </button>

          <button
            onClick={() => setActiveTab('template')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'template'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <Layers className="w-4 h-4" />
            流程模板 ({templates.length})
          </button>

          <button
            onClick={() => setActiveTab('instance')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'instance'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <Clock className="w-4 h-4" />
            流程实例
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface">
              {instances.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('monitor')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'monitor'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-500" />
            流程监控
            {alerts.filter(a => !a.resolved).length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold animate-pulse">
                {alerts.filter(a => !a.resolved).length}
              </span>
            )}
          </button>
        </div>

        <span className="text-xs text-outline font-medium hidden md:inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          全链支持字段级鉴权、条件分支分流与审批结果写回
        </span>
      </div>

      {/* ============================================================ */}
      {/* 1. 流程配置 (配置对接的三方系统的表单字段) */}
      {/* ============================================================ */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* 顶部三方系统选择器与操作按钮 */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-surface p-5 rounded-3xl border border-outline-variant/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">选择对接的第三方业务系统与表单：</label>
                <div className="flex items-center gap-2 mt-1">
                  <select
                    value={selectedConfigId}
                    onChange={(e) => setSelectedConfigId(e.target.value)}
                    className="text-xs font-extrabold bg-surface-container-low border border-outline-variant/80 rounded-xl px-3 py-1.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {configs.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.systemName} - {c.formName} ({c.code})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    版本: {activeConfig?.version}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => {
                  setEditingField(null);
                  setFieldFormData({
                    sourceKey: '',
                    sourceLabel: '',
                    sourceSystem: activeConfig?.systemName || 'SAP S/4HANA ERP',
                    dataType: 'string',
                    targetVariable: '',
                    targetComponent: '单行文本',
                    isRequired: true,
                    transformRule: 'none',
                    sampleValue: '',
                    description: '',
                    nodePermissions: {
                      startNode: 'edit',
                      deptManagerNode: 'read',
                      financeAuditNode: 'read',
                      finalLeaderNode: 'read',
                    },
                  });
                  setIsFieldModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                新增三方字段映射
              </button>
              <button
                onClick={() => showNotification(`已保存【${activeConfig?.name}】的全部字段配置及节点权限，即刻生效！`)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                发布并生效配置
              </button>
            </div>
          </div>

          {/* 概要说明卡片 */}
          <div className="bg-surface-container-low/40 rounded-2xl p-4 border border-outline-variant/60 flex items-start gap-3">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">当前配置说明：</span>
              {activeConfig?.description}
              <span className="ml-2 text-outline">
                (关联模板: <span className="font-bold text-primary font-mono">{activeConfig?.workflowTemplateId}</span>，回写接口: <code className="bg-surface-container px-1 py-0.5 rounded text-[10px] font-mono">{activeConfig?.callbackUrl}</code>)
              </span>
            </div>
          </div>

          {/* 第三方字段映射与节点权限表格 */}
          <div className="bg-surface rounded-3xl border border-outline-variant/80 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-outline-variant/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-extrabold text-on-surface">
                  第三方报文字段 → 流程变量与节点权限配置 ({activeConfig?.fields.length || 0} 个字段)
                </h3>
              </div>
              <span className="text-[11px] text-outline font-medium">
                权限说明: [可编辑] 允许该节点审批人修正；[只读] 仅可查看数据；[隐藏] 对该节点审批人保密脱敏
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low/80 text-outline border-b border-outline-variant/60 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">三方原始字段 (Key / 说明)</th>
                    <th className="py-3 px-4">数据类型</th>
                    <th className="py-3 px-4">流程全局变量</th>
                    <th className="py-3 px-4">渲染表单控件</th>
                    <th className="py-3 px-4">转换与清洗规则</th>
                    <th className="py-3 px-4 text-center bg-slate-50/50">发起节点</th>
                    <th className="py-3 px-4 text-center bg-blue-50/40">主管审批</th>
                    <th className="py-3 px-4 text-center bg-indigo-50/40">财务/风控核准</th>
                    <th className="py-3 px-4 text-center bg-purple-50/40">分管终审</th>
                    <th className="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {activeConfig?.fields.map((field) => (
                    <tr key={field.id} className="hover:bg-surface-container-low/40 transition-colors">
                      {/* 三方原始字段 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-on-surface">
                          <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px] border border-indigo-100">
                            {field.sourceKey}
                          </span>
                          {field.isRequired && (
                            <span className="text-rose-500 font-black text-[11px]" title="必填字段">*</span>
                          )}
                        </div>
                        <div className="text-[11px] text-outline mt-0.5">{field.sourceLabel}</div>
                        {field.sampleValue && (
                          <div className="text-[10px] font-mono text-outline/80 mt-0.5 truncate max-w-[160px]">
                            例: {field.sampleValue}
                          </div>
                        )}
                      </td>

                      {/* 数据类型 */}
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-surface-container text-on-surface">
                          {field.dataType}
                        </span>
                      </td>

                      {/* 流程变量 */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-primary font-bold">
                        {field.targetVariable}
                      </td>

                      {/* 渲染表单控件 */}
                      <td className="py-3.5 px-4 font-semibold text-on-surface">
                        {field.targetComponent}
                      </td>

                      {/* 转换规则 */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          field.transformRule === 'none'
                            ? 'bg-slate-100 text-slate-600'
                            : field.transformRule === 'cent_to_yuan'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {field.transformRule === 'none' ? '原样透传' : field.transformRule === 'cent_to_yuan' ? '分自动转元 (/100)' : field.transformRule === 'dept_mapping' ? '组织架构映射' : '格式化'}
                        </span>
                      </td>

                      {/* 节点权限: 发起节点 */}
                      <td className="py-3.5 px-4 text-center bg-slate-50/50">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          field.nodePermissions.startNode === 'edit' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {field.nodePermissions.startNode === 'edit' ? '可编辑' : '只读'}
                        </span>
                      </td>

                      {/* 节点权限: 主管审批 */}
                      <td className="py-3.5 px-4 text-center bg-blue-50/40">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          field.nodePermissions.deptManagerNode === 'read' ? 'bg-blue-100 text-blue-800' : field.nodePermissions.deptManagerNode === 'edit' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {field.nodePermissions.deptManagerNode === 'read' ? '只读' : field.nodePermissions.deptManagerNode === 'edit' ? '可编辑' : '隐藏'}
                        </span>
                      </td>

                      {/* 节点权限: 财务/风控核准 */}
                      <td className="py-3.5 px-4 text-center bg-indigo-50/40">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          field.nodePermissions.financeAuditNode === 'edit' ? 'bg-emerald-100 text-emerald-800 font-black' : field.nodePermissions.financeAuditNode === 'read' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {field.nodePermissions.financeAuditNode === 'edit' ? '可复核修正' : field.nodePermissions.financeAuditNode === 'read' ? '只读' : '隐藏'}
                        </span>
                      </td>

                      {/* 节点权限: 分管终审 */}
                      <td className="py-3.5 px-4 text-center bg-purple-50/40">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          field.nodePermissions.finalLeaderNode === 'read' ? 'bg-blue-100 text-blue-800' : field.nodePermissions.finalLeaderNode === 'edit' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {field.nodePermissions.finalLeaderNode === 'read' ? '只读' : field.nodePermissions.finalLeaderNode === 'edit' ? '可编辑' : '隐藏'}
                        </span>
                      </td>

                      {/* 操作 */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingField(field);
                              setFieldFormData({ ...field });
                              setIsFieldModalOpen(true);
                            }}
                            className="p-1.5 text-outline hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                            title="编辑字段与权限"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteField(field.id)}
                            className="p-1.5 text-outline hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="删除字段"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
      {/* 2. 流程模板 (Process Templates) */}
      {/* ============================================================ */}
      {activeTab === 'template' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {[
                { label: '全部模板', value: 'ALL' },
                { label: '采购财务', value: '采购财务' },
                { label: '营销特批', value: '营销特批' },
                { label: '行政人事', value: '行政人事' },
                { label: '自研中台', value: '自研中台' },
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setTemplateCategory(tab.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    templateCategory === tab.value
                      ? 'bg-on-surface text-surface shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="搜索流程模板名称或编码..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates
              .filter(t => templateCategory === 'ALL' || t.category === templateCategory)
              .filter(t => !templateSearch || t.name.includes(templateSearch) || t.code.includes(templateSearch))
              .map(tmpl => (
                <div
                  key={tmpl.id}
                  className="bg-surface rounded-3xl p-6 border border-outline-variant/80 hover:border-primary/60 transition-all hover:shadow-xl flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {tmpl.category}
                          </span>
                          <span className="text-[11px] font-mono text-outline font-bold">
                            {tmpl.version}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-on-surface group-hover:text-primary transition-colors mt-1.5">
                          {tmpl.name}
                        </h3>
                        <p className="text-[11px] font-mono text-outline">{tmpl.code}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        生产模板已激活
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                      {tmpl.description}
                    </p>

                    <div className="p-3 bg-surface-container-low/60 rounded-2xl border border-outline-variant/40 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-outline text-[11px]">对接目标系统：</span>
                        <span className="font-bold text-on-surface">{tmpl.boundSystem}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-outline text-[11px]">触发机制：</span>
                        <span className="font-mono text-[11px] text-indigo-700 font-bold">OpenAPI / Webhook 自动触发</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-outline text-[11px]">平均审批周期：</span>
                        <span className="font-mono font-bold text-emerald-700">{tmpl.avgDuration}</span>
                      </div>
                    </div>

                    {/* 可视化节点流预览 */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-outline">流程流转拓扑与节点链：</div>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        {tmpl.nodes.map((node, nIdx) => (
                          <React.Fragment key={node.id}>
                            <div className={`px-2 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 ${
                              node.type === 'start'
                                ? 'bg-emerald-100 text-emerald-800'
                                : node.type === 'condition'
                                ? 'bg-amber-100 text-amber-800'
                                : node.type === 'callback'
                                ? 'bg-purple-100 text-purple-800'
                                : node.type === 'end'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {node.type === 'condition' && <Shuffle className="w-2.5 h-2.5" />}
                              {node.type === 'callback' && <ExternalLink className="w-2.5 h-2.5" />}
                              <span>{node.name}</span>
                            </div>
                            {nIdx < tmpl.nodes.length - 1 && (
                              <ChevronRight className="w-3 h-3 text-outline/60 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between">
                    <span className="text-xs text-outline font-medium">
                      累计产生 <strong className="text-on-surface font-mono">{tmpl.instanceCount}</strong> 个流转实例
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewTemplate(tmpl)}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        详情预览
                      </button>
                      <button
                        onClick={() => showNotification(`已基于【${tmpl.name}】克隆新版本，可进入流程设计器编排节点。`)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold transition-all shadow-xs"
                      >
                        引用此模板
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. 流程实例 (Process Instances) */}
      {/* ============================================================ */}
      {activeTab === 'instance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">流转状态：</span>
              {['ALL', 'running', 'approved', 'rejected', 'suspended'].map(st => (
                <button
                  key={st}
                  onClick={() => setInstanceStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    instanceStatusFilter === st
                      ? 'bg-on-surface text-surface'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {st === 'ALL' ? '全部实例' : st === 'running' ? '流转中' : st === 'approved' ? '已办结' : st === 'rejected' ? '已驳回' : '已挂起'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={instanceSearch}
                onChange={(e) => setInstanceSearch(e.target.value)}
                placeholder="搜索流程实例编号、三方单号或申请人..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="bg-surface rounded-3xl border border-outline-variant/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low/80 text-outline border-b border-outline-variant/60 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">流程流水号 / 对接单号</th>
                    <th className="py-3.5 px-4">所属业务流程与模板</th>
                    <th className="py-3.5 px-4">发起人 / 部门</th>
                    <th className="py-3.5 px-4">发起时间 / 耗时</th>
                    <th className="py-3.5 px-4">当前审批节点与待办人</th>
                    <th className="py-3.5 px-4">状态</th>
                    <th className="py-3.5 px-4 text-right">操作与干预</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {instances
                    .filter(i => instanceStatusFilter === 'ALL' || i.status === instanceStatusFilter)
                    .filter(i => !instanceSearch || i.instanceSn.includes(instanceSearch) || i.externalSn.includes(instanceSearch) || i.initiator.includes(instanceSearch))
                    .map((inst) => (
                      <tr key={inst.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-on-surface flex items-center gap-1.5">
                            {inst.instanceSn}
                            {inst.priority === 'urgent' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">紧急</span>
                            )}
                          </div>
                          <div className="text-[11px] text-outline font-mono mt-0.5 flex items-center gap-1">
                            <span className="font-bold text-primary">{inst.sourceSystem.split(' ')[0]}</span>
                            <span>·</span>
                            <span>{inst.externalSn}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-on-surface line-clamp-1">{inst.processName}</div>
                          <div className="text-[11px] font-mono text-outline mt-0.5">{inst.templateCode}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-semibold text-on-surface">{inst.initiator}</div>
                          <div className="text-[11px] text-outline">{inst.initiatorDept}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-mono text-on-surface text-[11px]">{inst.startTime}</div>
                          <div className="text-[10px] text-outline font-medium mt-0.5">历时: {inst.duration}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-semibold text-indigo-900 line-clamp-1">{inst.currentNodeName}</div>
                          <div className="text-[11px] text-outline mt-0.5">
                            {inst.currentAssignees.join(', ')}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            inst.status === 'running'
                              ? 'bg-blue-100 text-blue-800 animate-pulse'
                              : inst.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inst.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inst.status === 'running' ? '流转中' : inst.status === 'approved' ? '已同意办结' : inst.status === 'rejected' ? '已驳回' : '已挂起'}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {inst.status === 'running' && (
                              <button
                                onClick={() => handleRemind(inst)}
                                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                  remindSuccessId === inst.id
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                                title="向节点当前审批人推送加急催办"
                              >
                                <Flame className="w-3 h-3 text-amber-600" />
                                {remindSuccessId === inst.id ? '已催办' : '催办'}
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedInstance(inst)}
                              className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors"
                            >
                              轨迹详情
                            </button>
                          </div>
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
      {/* 4. 流程监控 (Process Monitoring) */}
      {/* ============================================================ */}
      {activeTab === 'monitor' && (
        <div className="space-y-6">
          {/* 四大监控指标 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface p-5 rounded-3xl border border-outline-variant/80 shadow-xs space-y-2">
              <span className="text-xs text-outline font-bold">全系统运行中流程实例</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-blue-600">{monitorOverviewMetrics.activeInstances}</span>
                <span className="text-xs text-outline font-medium">笔</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 各三方对接通道调度顺畅
              </p>
            </div>

            <div className="bg-surface p-5 rounded-3xl border border-outline-variant/80 shadow-xs space-y-2">
              <span className="text-xs text-outline font-bold">今日累计办结通过数</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-emerald-600">{monitorOverviewMetrics.todayCompleted}</span>
                <span className="text-xs text-outline font-medium">笔</span>
              </div>
              <p className="text-[11px] text-outline font-medium">相比昨日同段 +18.4%</p>
            </div>

            <div className="bg-surface p-5 rounded-3xl border border-outline-variant/80 shadow-xs space-y-2">
              <span className="text-xs text-outline font-bold">端到端平均审批耗时</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-on-surface">{monitorOverviewMetrics.avgApprovalHours}</span>
                <span className="text-xs text-emerald-600 font-bold">大幅提速</span>
              </div>
              <p className="text-[11px] text-outline font-medium">SLA 达标合规率 {monitorOverviewMetrics.slaComplianceRate}</p>
            </div>

            <div className="bg-surface p-5 rounded-3xl border border-outline-variant/80 shadow-xs space-y-2">
              <span className="text-xs text-outline font-bold">第三方结果回调成功率</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-indigo-600">{monitorOverviewMetrics.callbackSuccessRate}</span>
                <span className="text-xs text-indigo-700 font-bold">高可用</span>
              </div>
              <p className="text-[11px] text-outline font-medium">支持毫秒级指数退避重试</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 流程节点耗时与瓶颈分析 */}
            <div className="bg-surface rounded-3xl p-6 border border-outline-variant/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-extrabold text-on-surface">审批流转卡点与瓶颈节点排行</h3>
                </div>
                <span className="text-[11px] text-outline">停留时长预警</span>
              </div>

              <div className="space-y-3">
                {monitorOverviewMetrics.slowestNodes.map((node, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-on-surface flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {node.nodeName}
                      </span>
                      <span className="font-mono font-bold text-amber-700">
                        平均停留 {node.avgHours} 小时
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-outline">
                      <span>所属流程: {node.processName}</span>
                      <span>当前积压待办: <strong className="text-rose-600 font-bold">{node.pendingCount}</strong> 件</span>
                    </div>

                    <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (node.avgHours / 5) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 近 7 天流程吞吐量趋势 */}
            <div className="bg-surface rounded-3xl p-6 border border-outline-variant/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-extrabold text-on-surface">近 7 天第三方表单接入与流转吞吐</h3>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    触发产生
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    审批办结
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-outline-variant/60 pb-2">
                {monitorOverviewMetrics.trend7Days.map((item, idx) => {
                  const maxVal = 160;
                  const trigHeight = (item.triggered / maxVal) * 100;
                  const compHeight = (item.completed / maxVal) * 100;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div
                          className="w-3.5 bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600"
                          style={{ height: `${trigHeight}%` }}
                          title={`触发: ${item.triggered}`}
                        />
                        <div
                          className="w-3.5 bg-emerald-500 rounded-t-lg transition-all group-hover:bg-emerald-600"
                          style={{ height: `${compHeight}%` }}
                          title={`办结: ${item.completed}`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-outline">{item.date}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-outline pt-1">
                <span>周环比增长: <strong className="text-on-surface font-mono">+26.5%</strong></span>
                <span>日均接入处理能力: <strong className="text-on-surface font-mono">150+</strong> 件/天</span>
              </div>
            </div>
          </div>

          {/* 实时异常与告警预警 */}
          <div className="bg-surface rounded-3xl p-6 border border-outline-variant/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-extrabold text-on-surface">异常预警与超时监控告警</h3>
              </div>
              <span className="text-xs text-outline font-medium">
                未解决告警: <strong className="text-rose-600 font-bold">{alerts.filter(a => !a.resolved).length}</strong> 条
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                    al.resolved
                      ? 'bg-surface-container-low/40 border-outline-variant/40 opacity-70'
                      : al.level === 'warning'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-rose-50/70 border-rose-200'
                  }`}
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        al.level === 'warning' ? 'bg-amber-200 text-amber-900' : 'bg-rose-200 text-rose-900'
                      }`}>
                        {al.level === 'warning' ? '超时预警' : '错误告警'}
                      </span>
                      <span className="font-extrabold text-on-surface">{al.title}</span>
                      <span className="text-[10px] text-outline font-mono">{al.time}</span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">
                      {al.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {al.resolved ? (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 已确认
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolveAlert(al.id)}
                        className="px-3 py-1.5 rounded-xl bg-on-surface text-surface text-xs font-bold hover:bg-primary transition-colors"
                      >
                        确认告警
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 弹窗 1: 新增 / 编辑第三方对接字段 (Field Modal) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isFieldModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-outline-variant shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Shuffle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-on-surface">
                      {editingField ? '编辑第三方对接表单字段' : '配置新增第三方对接表单字段'}
                    </h3>
                    <p className="text-xs text-outline">
                      系统: {activeConfig?.systemName} · 表单: {activeConfig?.formName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFieldModalOpen(false)}
                  className="text-outline hover:text-on-surface p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* 字段基本标识 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-outline font-bold block mb-1">
                      第三方报文字段 Key <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fieldFormData.sourceKey || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldFormData(prev => ({
                          ...prev,
                          sourceKey: val,
                          targetVariable: prev.targetVariable || `flow.${val}`
                        }));
                      }}
                      placeholder="如: po_number / net_price_cent"
                      className="w-full font-mono p-2.5 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-outline font-bold block mb-1">
                      业务中文名称 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fieldFormData.sourceLabel || ''}
                      onChange={(e) => setFieldFormData({ ...fieldFormData, sourceLabel: e.target.value })}
                      placeholder="如: 采购订单号 / 订单净额(元)"
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* 类型与控件 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-outline font-bold block mb-1">数据类型</label>
                    <select
                      value={fieldFormData.dataType || 'string'}
                      onChange={(e) => setFieldFormData({ ...fieldFormData, dataType: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none"
                    >
                      <option value="string">String 字符串</option>
                      <option value="number">Number 数值/金额</option>
                      <option value="date">Date 日期时间</option>
                      <option value="boolean">Boolean 布尔值</option>
                      <option value="json">JSON 结构对象</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-outline font-bold block mb-1">渲染表单组件</label>
                    <select
                      value={fieldFormData.targetComponent || '单行文本'}
                      onChange={(e) => setFieldFormData({ ...fieldFormData, targetComponent: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none"
                    >
                      <option value="单行文本">单行文本</option>
                      <option value="金额大写及数字框">金额大写及数字框</option>
                      <option value="日期选择器">日期选择器</option>
                      <option value="部门选择器">部门选择器</option>
                      <option value="人员工号">人员工号</option>
                      <option value="下拉选择">下拉字典</option>
                      <option value="多行文本">多行文本</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-outline font-bold block mb-1">数据清洗/转换规则</label>
                    <select
                      value={fieldFormData.transformRule || 'none'}
                      onChange={(e) => setFieldFormData({ ...fieldFormData, transformRule: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none"
                    >
                      <option value="none">无转换 (原样透传)</option>
                      <option value="cent_to_yuan">分转元 (除以 100)</option>
                      <option value="dept_mapping">组织编码映射部门</option>
                      <option value="date_format">时间戳转日期 (YYYY-MM-DD)</option>
                      <option value="uppercase">英文大写转换</option>
                    </select>
                  </div>
                </div>

                {/* 流程全局变量 */}
                <div>
                  <label className="text-outline font-bold block mb-1">
                    流程全局变量名称 (用于节点条件路由判断)
                  </label>
                  <input
                    type="text"
                    value={fieldFormData.targetVariable || ''}
                    onChange={(e) => setFieldFormData({ ...fieldFormData, targetVariable: e.target.value })}
                    placeholder="如: flow.total_amount_yuan"
                    className="w-full font-mono p-2.5 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none text-primary font-bold"
                  />
                </div>

                {/* 节点查看与编辑权限 */}
                <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/60 space-y-3">
                  <span className="font-extrabold text-on-surface block">
                    配置该字段在各流程节点的读写权限：
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-outline text-[11px] block mb-1 font-bold">发起节点</label>
                      <select
                        value={fieldFormData.nodePermissions?.startNode || 'edit'}
                        onChange={(e) => setFieldFormData({
                          ...fieldFormData,
                          nodePermissions: {
                            ...fieldFormData.nodePermissions!,
                            startNode: e.target.value as any,
                          }
                        })}
                        className="w-full p-2 rounded-lg border border-outline-variant bg-surface"
                      >
                        <option value="edit">可编辑填报</option>
                        <option value="read">只读展示</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-outline text-[11px] block mb-1 font-bold">主管审批</label>
                      <select
                        value={fieldFormData.nodePermissions?.deptManagerNode || 'read'}
                        onChange={(e) => setFieldFormData({
                          ...fieldFormData,
                          nodePermissions: {
                            ...fieldFormData.nodePermissions!,
                            deptManagerNode: e.target.value as any,
                          }
                        })}
                        className="w-full p-2 rounded-lg border border-outline-variant bg-surface"
                      >
                        <option value="read">只读</option>
                        <option value="edit">可编辑修正</option>
                        <option value="hide">隐藏脱敏</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-outline text-[11px] block mb-1 font-bold">财务/风控核准</label>
                      <select
                        value={fieldFormData.nodePermissions?.financeAuditNode || 'read'}
                        onChange={(e) => setFieldFormData({
                          ...fieldFormData,
                          nodePermissions: {
                            ...fieldFormData.nodePermissions!,
                            financeAuditNode: e.target.value as any,
                          }
                        })}
                        className="w-full p-2 rounded-lg border border-outline-variant bg-surface"
                      >
                        <option value="read">只读</option>
                        <option value="edit">可复核修正</option>
                        <option value="hide">隐藏脱敏</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-outline text-[11px] block mb-1 font-bold">分管终审</label>
                      <select
                        value={fieldFormData.nodePermissions?.finalLeaderNode || 'read'}
                        onChange={(e) => setFieldFormData({
                          ...fieldFormData,
                          nodePermissions: {
                            ...fieldFormData.nodePermissions!,
                            finalLeaderNode: e.target.value as any,
                          }
                        })}
                        className="w-full p-2 rounded-lg border border-outline-variant bg-surface"
                      >
                        <option value="read">只读</option>
                        <option value="edit">可编辑修正</option>
                        <option value="hide">隐藏脱敏</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 字段示例与描述 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-outline font-bold block mb-1">示例数据值</label>
                    <input
                      type="text"
                      value={fieldFormData.sampleValue || ''}
                      onChange={(e) => setFieldFormData({ ...fieldFormData, sampleValue: e.target.value })}
                      placeholder="如: PO4500098124 / 1860000"
                      className="w-full font-mono p-2.5 rounded-xl border border-outline-variant bg-surface-container-low"
                    />
                  </div>
                  <div>
                    <label className="text-outline font-bold block mb-1">业务说明备注</label>
                    <input
                      type="text"
                      value={fieldFormData.description || ''}
                      onChange={(e) => setFieldFormData({ ...fieldFormData, description: e.target.value })}
                      placeholder="说明该字段业务用途"
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsFieldModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveField}
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold transition-all shadow-md shadow-primary/20"
                >
                  保存字段配置
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 弹窗 2: 流程实例轨迹详情抽屉 / Modal */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedInstance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl p-6 md:p-8 max-w-3xl w-full border border-outline-variant shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary text-base">
                      {selectedInstance.instanceSn}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedInstance.status === 'running'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedInstance.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedInstance.status === 'running' ? '流转中' : selectedInstance.status === 'approved' ? '已同意办结' : '已驳回'}
                    </span>
                  </div>
                  <p className="text-xs text-outline mt-0.5">
                    {selectedInstance.processName} · 来源: {selectedInstance.sourceSystem} ({selectedInstance.externalSn})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInstance(null)}
                  className="text-outline hover:text-on-surface p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 三方业务表单快照数据 */}
              <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/60 space-y-3">
                <span className="font-extrabold text-xs text-on-surface block">
                  第三方系统报文表单字段快照 (已完成映射解析)：
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {Object.entries(selectedInstance.businessData).map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-xl bg-surface border border-outline-variant/40">
                      <span className="text-[10px] text-outline block">{k}</span>
                      <span className="font-bold text-on-surface mt-0.5 block truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 审批流转轨迹与日志时间轴 */}
              <div className="space-y-4">
                <span className="font-extrabold text-xs text-on-surface block">
                  流转轨迹与审批人签名意见记录：
                </span>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/60">
                  {selectedInstance.approvalLogs.map((log, lIdx) => (
                    <div key={lIdx} className="relative space-y-1 text-xs">
                      <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-surface ${
                        log.action === 'approve'
                          ? 'bg-emerald-500'
                          : log.action === 'reject'
                          ? 'bg-rose-500'
                          : log.action === 'submit'
                          ? 'bg-blue-500'
                          : 'bg-amber-400 animate-pulse'
                      }`} />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{log.nodeName}</span>
                          <span className="text-[11px] text-outline font-medium">({log.operator} · {log.role})</span>
                        </div>
                        <span className="text-[10px] font-mono text-outline">{log.timestamp}</span>
                      </div>

                      <div className={`p-3 rounded-xl ${
                        log.action === 'approve'
                          ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-900'
                          : log.action === 'reject'
                          ? 'bg-rose-50/70 border border-rose-200 text-rose-900'
                          : 'bg-surface-container-low text-on-surface-variant'
                      }`}>
                        {log.comment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 底部干预工具栏 */}
              <div className="pt-3 border-t border-outline-variant/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-outline font-medium">第三方回写状态:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedInstance.callbackStatus === 'success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedInstance.callbackStatus === 'success' ? '已成功回写 (HTTP 200)' : '待回写 / 重试中'}
                  </span>
                  <button
                    onClick={() => handleRetryCallback(selectedInstance.id)}
                    className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> 重新回调写回
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSuspend(selectedInstance.id)}
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface"
                  >
                    {selectedInstance.status === 'suspended' ? '恢复流转' : '挂起实例'}
                  </button>
                  <button
                    onClick={() => {
                      showNotification(`已对实例 ${selectedInstance.instanceSn} 执行管理人员强制作废。`);
                      setInstances(prev => prev.map(i => i.id === selectedInstance.id ? { ...i, status: 'terminated' } : i));
                      setSelectedInstance(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200"
                  >
                    终止作废
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 弹窗 3: 流程模板拓扑与节点详情预览 (Template Preview Modal) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl p-6 md:p-8 max-w-3xl w-full border border-outline-variant shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
                <div>
                  <h3 className="text-base font-extrabold text-on-surface">
                    {previewTemplate.name}
                  </h3>
                  <p className="text-xs text-outline font-mono mt-0.5">
                    {previewTemplate.code} · 版本: {previewTemplate.version}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-outline hover:text-on-surface p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-on-surface-variant leading-relaxed">
                  {previewTemplate.description}
                </p>

                <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/60 space-y-3">
                  <span className="font-extrabold text-on-surface block">
                    节点拓扑明细与流转策略：
                  </span>

                  <div className="space-y-3">
                    {previewTemplate.nodes.map((node, nIdx) => (
                      <div key={node.id} className="p-3 rounded-xl bg-surface border border-outline-variant/40 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-mono text-xs flex items-center justify-center font-bold">
                            {nIdx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-on-surface block">{node.name}</span>
                            <span className="text-[11px] text-outline">
                              类型: {node.type === 'start' ? '流程发起点' : node.type === 'approver' ? '审批人节点' : node.type === 'condition' ? '条件分支路由' : node.type === 'callback' ? '系统回调写回' : '办结'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right text-[11px]">
                          {node.assigneeName && (
                            <span className="font-semibold text-indigo-700 block">{node.assigneeName}</span>
                          )}
                          {node.conditionExpr && (
                            <span className="font-mono text-amber-700 font-bold block">{node.conditionExpr}</span>
                          )}
                          {node.timeoutHours && (
                            <span className="text-outline">超时限制: {node.timeoutHours}h</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-bold"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    showNotification(`已进入【${previewTemplate.name}】设计器，可自定义修改节点条件。`);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs"
                >
                  编辑此流程模板
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
