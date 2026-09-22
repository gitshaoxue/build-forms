import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  X, 
  Menu as MenuIcon, 
  FileText, 
  Sliders, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  CheckSquare, 
  Square, 
  Tag, 
  Building2, 
  MapPin, 
  Factory, 
  Store, 
  Users, 
  Columns3, 
  AlertTriangle, 
  Layers, 
  Sparkles,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { 
  RoleDefinition, 
  FormPermission, 
  OperationPermissions, 
  FieldColumnAccess, 
  TeamMember 
} from './types';

interface RoleManagementProps {
  roles: RoleDefinition[];
  setRoles: React.Dispatch<React.SetStateAction<RoleDefinition[]>>;
  savedForms: Array<{ id: string; name: string; category?: string }>;
  formFieldsMap: Record<string, Array<{ id: string; label: string; type: string }>>;
  teamMembers: TeamMember[];
  onUpdateMember: (member: TeamMember) => void;
  showNotification?: (text: string) => void;
}

// Available system menu items
const SYSTEM_MENUS = [
  { key: 'dashboard', label: '仪表盘 (总览与统计)', desc: '业务数据宏观看板与核心指标' },
  { key: 'projects', label: '应用管理 (轻应用工作台)', desc: '表单应用目录与分类结构' },
  { key: 'designer', label: '表单设计器 (画布编辑器)', desc: '拖拽设计新表单与控件配置' },
  { key: 'dataManagement', label: '数据管理中心 (台账)', desc: '业务数据查询、批量处理与导出' },
  { key: 'insights', label: '数据洞察 (智能分析)', desc: '多维交叉透视报表与趋势图表' },
  { key: 'workflow', label: '工作流审批中心', desc: '业务审批流发起、流转与处理' },
  { key: 'settings', label: '系统设置 (组织/用户/角色)', desc: '平台安全、架构与全局配置' },
];

export const RoleManagement: React.FC<RoleManagementProps> = ({
  roles,
  setRoles,
  savedForms,
  formFieldsMap,
  teamMembers,
  onUpdateMember,
  showNotification,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'designer');
  const [activeTab, setActiveTab] = useState<'features' | 'dataRow' | 'dataColumn' | 'members'>('features');
  const [selectedFormForColumn, setSelectedFormForColumn] = useState<string>(savedForms[0]?.id || 'f1');
  const [isSaving, setIsSaving] = useState(false);

  // Modal for New Custom Role
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleCode, setNewRoleCode] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // Modal for Assigning Members to Role
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Currently selected role
  const selectedRole = useMemo(() => {
    return roles.find(r => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  // Members currently belonging to the selected role
  const roleMembers = useMemo(() => {
    if (!selectedRole) return [];
    return teamMembers.filter(m => m.roleId === selectedRole.id || m.role === selectedRole.name);
  }, [teamMembers, selectedRole]);

  // Save current role configuration
  const handleSaveRoleConfig = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showNotification?.(`角色「${selectedRole.name}」的功能权限与数据权限策略包保存生效！`);
    }, 600);
  };

  // Update Feature Permissions: Menu toggle
  const handleToggleMenu = (menuKey: string, checked: boolean) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        return {
          ...r,
          menus: { ...r.menus, [menuKey]: checked }
        };
      }
      return r;
    }));
  };

  // Update Feature Permissions: Form permissions (view, fill, manage)
  const handleFormPermissionChange = (formId: string, permKey: keyof FormPermission, val: boolean) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        const currentFormPerm = r.forms[formId] || { view: true, fill: true, manage: false };
        return {
          ...r,
          forms: {
            ...r.forms,
            [formId]: {
              ...currentFormPerm,
              [permKey]: val
            }
          }
        };
      }
      return r;
    }));
  };

  // Quick batch form permission helper
  const handleBatchFormPermission = (permKey: keyof FormPermission, val: boolean) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        const updatedForms: Record<string, FormPermission> = { ...r.forms };
        savedForms.forEach(f => {
          updatedForms[f.id] = {
            ...(updatedForms[f.id] || { view: true, fill: true, manage: false }),
            [permKey]: val
          };
        });
        return { ...r, forms: updatedForms };
      }
      return r;
    }));
    showNotification?.(`已将当前角色所有表单的【${permKey === 'view' ? '查看' : permKey === 'fill' ? '填报' : '管理'}】权限统一设为 ${val ? '开启' : '关闭'}`);
  };

  // Update Feature Permissions: Operation permissions (create, edit, delete, enable, disable, etc.)
  const handleOperationChange = (opKey: keyof OperationPermissions, val: boolean) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        return {
          ...r,
          operations: {
            ...r.operations,
            [opKey]: val
          }
        };
      }
      return r;
    }));
  };

  // Update Data Permissions: Org Row Scope
  const handleOrgScopeChange = (scope: RoleDefinition['orgScope']) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        return { ...r, orgScope: scope };
      }
      return r;
    }));
  };

  // Update Data Permissions: Tag Row Controls (chargeDepts, salesRegions, factories, stores)
  const handleTagControlChange = (key: keyof RoleDefinition['tagControl'], val: any) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        return {
          ...r,
          tagControl: {
            ...r.tagControl,
            [key]: val
          }
        };
      }
      return r;
    }));
  };

  // Update Column Field Permissions for a specific form & field
  const handleFieldColumnAccessChange = (formId: string, fieldId: string, access: FieldColumnAccess) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        const formFields = r.fieldPermissions[formId] || {};
        return {
          ...r,
          fieldPermissions: {
            ...r.fieldPermissions,
            [formId]: {
              ...formFields,
              [fieldId]: access
            }
          }
        };
      }
      return r;
    }));
  };

  // Batch Field Column Permissions
  const handleBatchFieldAccess = (formId: string, access: FieldColumnAccess) => {
    const fields = formFieldsMap[formId] || [];
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        const updatedFields: Record<string, FieldColumnAccess> = {};
        fields.forEach(f => {
          updatedFields[f.id] = access;
        });
        return {
          ...r,
          fieldPermissions: {
            ...r.fieldPermissions,
            [formId]: updatedFields
          }
        };
      }
      return r;
    }));
    showNotification?.(`已将表单所有字段的列权限设为：${access === 'editable' ? '可编辑' : access === 'readonly' ? '只读' : access === 'masked' ? '脱敏' : '隐藏'}`);
  };

  // Add New Custom Role
  const handleCreateNewRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      showNotification?.('请输入角色名称');
      return;
    }
    const newId = `role-${Date.now()}`;
    const newRole: RoleDefinition = {
      id: newId,
      name: newRoleName.trim(),
      code: newRoleCode.trim().toUpperCase() || `ROLE_${Date.now().toString().slice(-4)}`,
      desc: newRoleDesc.trim() || '自主定制的系统业务角色',
      isSystem: false,
      userCount: 0,
      menus: {
        dashboard: true,
        projects: true,
        designer: false,
        dataManagement: true,
        insights: false,
        workflow: true,
        settings: false
      },
      forms: {},
      operations: {
        create: true,
        edit: true,
        delete: false,
        enable: false,
        disable: false,
        export: true,
        batchDelete: false,
        importData: false
      },
      orgScope: 'dept',
      tagControl: {
        enabled: true,
        matchMode: 'any',
        byChargeDepts: true,
        bySalesRegions: true,
        byFactories: false,
        byStores: false
      },
      fieldPermissions: {}
    };

    setRoles(prev => [...prev, newRole]);
    setSelectedRoleId(newId);
    setIsNewRoleModalOpen(false);
    setNewRoleName('');
    setNewRoleCode('');
    setNewRoleDesc('');
    showNotification?.(`已成功创建独立业务角色：${newRole.name}`);
  };

  // Delete Custom Role
  const handleDeleteRole = (id: string, name: string) => {
    if (confirm(`确定要删除角色「${name}」吗？已分配该角色的成员将自动转为普通权限。`)) {
      setRoles(prev => prev.filter(r => r.id !== id));
      if (selectedRoleId === id) {
        setSelectedRoleId(roles[0]?.id || '');
      }
      showNotification?.(`角色「${name}」已删除`);
    }
  };

  // Toggle user membership in this role
  const handleToggleMemberRole = (member: TeamMember) => {
    const isCurrentlyInRole = member.roleId === selectedRole.id || member.role === selectedRole.name;
    const nextRoleId = isCurrentlyInRole ? roles.find(r => r.id !== selectedRole.id)?.id || 'filler' : selectedRole.id;
    const nextRoleName = isCurrentlyInRole ? '普通员工' : selectedRole.name;

    onUpdateMember({
      ...member,
      roleId: nextRoleId,
      role: nextRoleName
    });
  };

  // Current Form Fields for Column Security
  const currentFormFields = useMemo(() => {
    return formFieldsMap[selectedFormForColumn] || [
      { id: 'f_1', label: '姓名/主体名称', type: 'text' },
      { id: 'f_2', label: '申请人电话', type: 'text' },
      { id: 'f_3', label: '报销/订单金额 (元)', type: 'number' },
      { id: 'f_4', label: '归属部门', type: 'select' },
      { id: 'f_5', label: '业务详细说明与审批批注', type: 'textarea' },
    ];
  }, [formFieldsMap, selectedFormForColumn]);

  return (
    <div className="flex-1 flex h-full bg-white overflow-hidden">
      {/* Left Role List Navigation */}
      <div className="w-88 border-r border-outline-variant/60 flex flex-col bg-surface-container-lowest/30 overflow-hidden shrink-0">
        <div className="p-6 border-b border-outline-variant/60 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black tracking-tight text-on-surface">角色管理中心</h3>
            </div>
            <button
              onClick={() => setIsNewRoleModalOpen(true)}
              className="p-1.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all shadow-sm flex items-center gap-1 text-xs font-bold"
              title="新建自定义角色"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建角色</span>
            </button>
          </div>
          <p className="text-[11px] text-outline">维护独立角色池，并细化分配菜单、表单、操作及行列数据权限</p>
        </div>

        {/* Roles List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5">
          {roles.map(role => {
            const isSelected = selectedRoleId === role.id;
            const count = teamMembers.filter(m => m.roleId === role.id || m.role === role.name).length;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 relative group ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-sm shadow-primary/10'
                    : 'bg-white border-outline-variant/60 hover:bg-surface-container-low hover:border-outline-variant'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-primary' : 'bg-outline-variant'}`} />
                    <span className="font-black text-xs text-on-surface">{role.name}</span>
                    {role.isSystem && (
                      <span className="text-[9px] font-bold bg-surface border px-1.5 py-0.2 rounded text-outline">
                        内置
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {count} 人
                  </span>
                </div>

                <p className="text-[11px] text-outline font-medium line-clamp-2 leading-relaxed">
                  {role.desc}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-outline/80 pt-1 border-t border-outline-variant/30">
                  <span>{role.code}</span>
                  {!role.isSystem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role.id, role.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 font-bold transition-opacity"
                    >
                      删除
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Permission Configuration Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Workspace Top Header */}
        <div className="px-8 py-5 border-b border-outline-variant/60 flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black tracking-tight text-on-surface">{selectedRole.name}</h2>
              <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase">
                {selectedRole.code}
              </span>
              <span className="text-xs text-outline font-bold">
                当前成员: {roleMembers.length} 人
              </span>
            </div>
            <p className="text-xs text-on-surface-variant max-w-2xl">{selectedRole.desc}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-outline-variant hover:border-primary text-on-surface hover:text-primary rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span>分配角色成员 ({roleMembers.length})</span>
            </button>

            <button
              onClick={handleSaveRoleConfig}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>保存当前权限配置</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 border-b border-outline-variant/60 bg-white flex items-center gap-8">
          {[
            { id: 'features', label: '3.1 功能权限 (菜单/表单/操作)', icon: Sliders },
            { id: 'dataRow', label: '3.2 数据权限：行权限管控 (组织/标签)', icon: Tag },
            { id: 'dataColumn', label: '3.2 数据权限：列权限管控 (按字段)', icon: Columns3 },
            { id: 'members', label: '角色归属成员名单', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-surface-container-lowest/20">
          {/* ================= 3.1 功能权限配置 ================= */}
          {activeTab === 'features' && (
            <div className="space-y-8 max-w-5xl">
              {/* 1. Menu Permissions */}
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <MenuIcon className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-black text-on-surface">菜单级访问权限</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        SYSTEM_MENUS.forEach(m => handleToggleMenu(m.key, true));
                        showNotification?.('已全选所有菜单权限');
                      }}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      全选
                    </button>
                    <span className="text-outline">|</span>
                    <button
                      onClick={() => {
                        SYSTEM_MENUS.forEach(m => handleToggleMenu(m.key, false));
                        showNotification?.('已清空所有菜单权限');
                      }}
                      className="text-xs text-outline font-bold hover:underline"
                    >
                      全不选
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SYSTEM_MENUS.map(m => {
                    const isChecked = !!selectedRole.menus[m.key];
                    return (
                      <label
                        key={m.key}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-primary/5 border-primary/40'
                            : 'bg-surface border-outline-variant/40 hover:bg-surface-container-low'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleToggleMenu(m.key, e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded text-primary accent-primary cursor-pointer"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-on-surface">{m.label}</p>
                          <p className="text-[10px] text-outline mt-0.5 leading-tight">{m.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Form Permissions */}
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <div>
                      <h4 className="text-sm font-black text-on-surface">表单级功能权限</h4>
                      <p className="text-[11px] text-outline">控制角色成员对各个业务自定义表单的查看、填报与配置权限</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold text-outline">
                    <span>快捷全开：</span>
                    <button onClick={() => handleBatchFormPermission('view', true)} className="text-primary hover:underline">
                      全部可查
                    </button>
                    <button onClick={() => handleBatchFormPermission('fill', true)} className="text-primary hover:underline">
                      全部可填
                    </button>
                    <button onClick={() => handleBatchFormPermission('manage', true)} className="text-primary hover:underline">
                      全部可管
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-outline-variant/30">
                  {savedForms.map(form => {
                    const formPerm = selectedRole.forms[form.id] || { view: true, fill: true, manage: false };

                    return (
                      <div key={form.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {form.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-on-surface">{form.name}</p>
                            <p className="text-[10px] text-outline font-mono">ID: {form.id} | 分类: {form.category || '通用业务'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formPerm.view}
                              onChange={(e) => handleFormPermissionChange(form.id, 'view', e.target.checked)}
                              className="w-4 h-4 rounded text-primary accent-primary"
                            />
                            <span>允许访问查看</span>
                          </label>

                          <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formPerm.fill}
                              onChange={(e) => handleFormPermissionChange(form.id, 'fill', e.target.checked)}
                              className="w-4 h-4 rounded text-primary accent-primary"
                            />
                            <span>允许填报提交</span>
                          </label>

                          <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formPerm.manage}
                              onChange={(e) => handleFormPermissionChange(form.id, 'manage', e.target.checked)}
                              className="w-4 h-4 rounded text-primary accent-primary"
                            />
                            <span>允许设计管理</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Operation Permissions (新增、修改、删除、启用、禁用等) */}
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    <div>
                      <h4 className="text-sm font-black text-on-surface">
                        微观操作权限管控 (包含新增、修改、删除、启用、禁用等)
                      </h4>
                      <p className="text-[11px] text-outline">精确授予该角色各类数据项与功能按钮的操作特权</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {[
                    { key: 'create', label: '新增 (Create)', desc: '允许填报录入新数据、新建表单与流程', highlight: 'border-green-300' },
                    { key: 'edit', label: '修改 (Edit)', desc: '允许编辑更新已有数据记录及属性', highlight: 'border-blue-300' },
                    { key: 'delete', label: '删除 (Delete)', desc: '允许删除单条数据记录或草稿', highlight: 'border-red-300' },
                    { key: 'enable', label: '启用 (Enable)', desc: '允许激活启用表单、用户、规则', highlight: 'border-emerald-300' },
                    { key: 'disable', label: '禁用 (Disable)', desc: '允许下线停用表单、封存账号', highlight: 'border-amber-300' },
                    { key: 'export', label: '导出数据 (Export)', desc: '允许批量导出全量 Excel 报表', highlight: 'border-purple-300' },
                    { key: 'batchDelete', label: '批量删除 (Batch Delete)', desc: '高危权限：允许批量勾选物理清理', highlight: 'border-rose-400' },
                    { key: 'importData', label: '数据导入 (Import)', desc: '允许从本地 Excel 批量导入台账', highlight: 'border-indigo-300' },
                  ].map(op => {
                    const isChecked = !!selectedRole.operations[op.key as keyof OperationPermissions];
                    return (
                      <div
                        key={op.key}
                        onClick={() => handleOperationChange(op.key as keyof OperationPermissions, !isChecked)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isChecked
                            ? 'bg-primary/5 border-primary shadow-sm'
                            : 'bg-surface border-outline-variant/50 hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-on-surface">{op.label}</span>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-primary text-white border-primary' : 'bg-white border-outline-variant'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-[10px] text-outline font-medium leading-relaxed">{op.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= 3.2 数据权限：行权限管控 (所属组织 + 标签管控) ================= */}
          {activeTab === 'dataRow' && (
            <div className="space-y-8 max-w-5xl">
              {/* Part 1: 所属组织行权限管控 */}
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Building2 className="w-4 h-4 text-primary" />
                  <div>
                    <h4 className="text-sm font-black text-on-surface">所属组织数据行权限</h4>
                    <p className="text-[11px] text-outline">根据当前用户的所属主部门层级，过滤底单与报表数据</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      key: 'self',
                      title: '本人数据',
                      sql: 'WHERE author_id = @current_user.id',
                      desc: '只能查看并操作由该用户本人提交、填报或唯一指派给该用户的表单数据记录。'
                    },
                    {
                      key: 'self_sub',
                      title: '本人及直属下属数据',
                      sql: 'WHERE author_id IN (@current_user.id, ...@direct_subordinates)',
                      desc: '向上兼容：允许透视当前用户及其所有在汇报关系树中下属员工提交的数据。'
                    },
                    {
                      key: 'dept',
                      title: '本组织数据',
                      sql: 'WHERE dept_id = @current_user.dept_id',
                      desc: '数据范围锁定在当前用户所在的主行政部门底单，部门间实现严格的数据隔离。'
                    },
                    {
                      key: 'dept_sub',
                      title: '本组织及下属组织数据',
                      sql: 'WHERE dept_id IN (@current_user.dept_id, ...@child_dept_ids)',
                      desc: '递归穿透当前部门及其下属的所有分支子部门，适合各部门负责人。'
                    },
                    {
                      key: 'all',
                      title: '全公司全部组织数据',
                      sql: 'WHERE 1=1 (跨组织无限制透查)',
                      desc: '放开所有组织范围限制，跨部门全局数据通查，适合集团高管与系统管理员。'
                    },
                  ].map(item => {
                    const isSelected = selectedRole.orgScope === item.key;
                    return (
                      <div
                        key={item.key}
                        onClick={() => handleOrgScopeChange(item.key as any)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-primary/5 border-primary shadow-sm'
                            : 'bg-surface border-outline-variant/50 hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="orgScope"
                              checked={isSelected}
                              onChange={() => handleOrgScopeChange(item.key as any)}
                              className="text-primary accent-primary"
                            />
                            <span className="text-xs font-black text-on-surface">{item.title}</span>
                          </div>
                          <p className="text-[11px] text-outline pl-6">{item.desc}</p>
                        </div>

                        <div className="shrink-0 font-mono text-[10px] bg-white border border-outline-variant/60 px-3 py-1.5 rounded-xl text-outline">
                          {item.sql}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Part 2: 标签行权限管控 (负责组织、负责销售区域、负责工厂、负责门店) */}
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="text-sm font-black text-on-surface">
                        标签多维行权限管控 (负责组织、销售区域、工厂、门店)
                      </h4>
                      <p className="text-[11px] text-outline">
                        按用户的多维业务标签，对表单数据行实现交叉权限过滤
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-on-surface">总开关：</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRole.tagControl.enabled}
                        onChange={(e) => handleTagControlChange('enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                {selectedRole.tagControl.enabled && (
                  <div className="space-y-6">
                    {/* Match mode */}
                    <div className="flex items-center gap-6 p-3.5 bg-surface rounded-2xl border border-outline-variant/40 text-xs">
                      <span className="font-black text-on-surface">多标签匹配规则：</span>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-on-surface">
                        <input
                          type="radio"
                          name="matchMode"
                          value="any"
                          checked={selectedRole.tagControl.matchMode === 'any'}
                          onChange={() => handleTagControlChange('matchMode', 'any')}
                          className="text-primary accent-primary"
                        />
                        <span>满足任一启用标签即允许 (OR 逻辑)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-on-surface">
                        <input
                          type="radio"
                          name="matchMode"
                          value="all"
                          checked={selectedRole.tagControl.matchMode === 'all'}
                          onChange={() => handleTagControlChange('matchMode', 'all')}
                          className="text-primary accent-primary"
                        />
                        <span>必须同时满足所有启用的标签 (AND 逻辑)</span>
                      </label>
                    </div>

                    {/* 4 Tag Dimensions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. 负责组织管控 */}
                      <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        selectedRole.tagControl.byChargeDepts
                          ? 'bg-blue-50/50 border-blue-200'
                          : 'bg-surface border-outline-variant/50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-black text-on-surface">按【负责组织】管控</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedRole.tagControl.byChargeDepts}
                            onChange={(e) => handleTagControlChange('byChargeDepts', e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                          />
                        </div>
                        <p className="text-[11px] text-outline leading-relaxed">
                          当前角色用户只能查看和操作其被授权负责的部门列表内的数据记录（例如分管 3 个异地子公司）。
                        </p>
                        <code className="text-[10px] font-mono bg-white p-1.5 rounded-lg border border-outline-variant/40 text-blue-800">
                          SQL: data.dept_id IN (@user.chargeDepts)
                        </code>
                      </div>

                      {/* 2. 负责销售区域管控 */}
                      <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        selectedRole.tagControl.bySalesRegions
                          ? 'bg-purple-50/50 border-purple-200'
                          : 'bg-surface border-outline-variant/50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-black text-on-surface">按【负责销售区域】管控</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedRole.tagControl.bySalesRegions}
                            onChange={(e) => handleTagControlChange('bySalesRegions', e.target.checked)}
                            className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                          />
                        </div>
                        <p className="text-[11px] text-outline leading-relaxed">
                          只能查看匹配其「负责销售区域」标签（如华东大区、华南大区）的客户登记、拜访与商机数据。
                        </p>
                        <code className="text-[10px] font-mono bg-white p-1.5 rounded-lg border border-outline-variant/40 text-purple-800">
                          SQL: data.sales_region IN (@user.salesRegions)
                        </code>
                      </div>

                      {/* 3. 负责工厂管控 */}
                      <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        selectedRole.tagControl.byFactories
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-surface border-outline-variant/50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Factory className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-black text-on-surface">按【负责工厂】管控</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedRole.tagControl.byFactories}
                            onChange={(e) => handleTagControlChange('byFactories', e.target.checked)}
                            className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
                          />
                        </div>
                        <p className="text-[11px] text-outline leading-relaxed">
                          只能查看与其「负责工厂」标签（如华东一号智造基地、华北装备基地）匹配的生产与运维单据。
                        </p>
                        <code className="text-[10px] font-mono bg-white p-1.5 rounded-lg border border-outline-variant/40 text-amber-800">
                          SQL: data.factory_name IN (@user.factories)
                        </code>
                      </div>

                      {/* 4. 负责门店管控 */}
                      <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        selectedRole.tagControl.byStores
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-surface border-outline-variant/50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-black text-on-surface">按【负责门店】管控</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedRole.tagControl.byStores}
                            onChange={(e) => handleTagControlChange('byStores', e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                          />
                        </div>
                        <p className="text-[11px] text-outline leading-relaxed">
                          只能查看与其「负责门店」标签（如上海南京路旗舰店、广州天河直营店）匹配的巡店与销售台账。
                        </p>
                        <code className="text-[10px] font-mono bg-white p-1.5 rounded-lg border border-outline-variant/40 text-emerald-800">
                          SQL: data.store_name IN (@user.stores)
                        </code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 3.2 数据权限：列权限管控 (按字段细分可编辑/只读/脱敏/隐藏) ================= */}
          {activeTab === 'dataColumn' && (
            <div className="space-y-6 max-w-5xl">
              {/* Form Selector and Batch Actions */}
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-on-surface flex items-center gap-2">
                      <Columns3 className="w-4 h-4 text-primary" />
                      按表单字段配置列级权限 (Column-Level Security)
                    </h4>
                    <p className="text-[11px] text-outline">
                      对选定表单中的每个具体字段，精细化配置其为【可编辑】、【只读】、【脱敏】或【隐藏】
                    </p>
                  </div>

                  {/* Form Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-outline">选择目标表单：</span>
                    <select
                      value={selectedFormForColumn}
                      onChange={(e) => setSelectedFormForColumn(e.target.value)}
                      className="px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-bold focus:outline-none focus:border-primary text-on-surface cursor-pointer"
                    >
                      {savedForms.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Batch Tools */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-outline font-bold">快捷批量设定：</span>
                  <button
                    onClick={() => handleBatchFieldAccess(selectedFormForColumn, 'editable')}
                    className="px-3 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-bold"
                  >
                    全部设为可编辑
                  </button>
                  <button
                    onClick={() => handleBatchFieldAccess(selectedFormForColumn, 'readonly')}
                    className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold"
                  >
                    全部设为只读
                  </button>
                  <button
                    onClick={() => handleBatchFieldAccess(selectedFormForColumn, 'masked')}
                    className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold"
                  >
                    全部脱敏掩码
                  </button>
                  <button
                    onClick={() => handleBatchFieldAccess(selectedFormForColumn, 'hidden')}
                    className="px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold"
                  >
                    全部隐藏屏蔽
                  </button>
                </div>
              </div>

              {/* Field Permission Grid */}
              <div className="bg-white rounded-3xl border border-outline-variant/80 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/60 bg-surface-container-lowest text-outline text-[11px] font-black uppercase tracking-wider">
                      <th className="py-3.5 px-6">字段名称与标识</th>
                      <th className="py-3.5 px-4">控件类型</th>
                      <th className="py-3.5 px-4 text-center">可编辑 (读写)</th>
                      <th className="py-3.5 px-4 text-center">只读 (禁改)</th>
                      <th className="py-3.5 px-4 text-center">脱敏 (掩码保护)</th>
                      <th className="py-3.5 px-4 text-center">隐藏 (不可见)</th>
                      <th className="py-3.5 px-6">成员视角模拟预览</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {currentFormFields.map(field => {
                      const access = selectedRole.fieldPermissions[selectedFormForColumn]?.[field.id] || 'editable';

                      return (
                        <tr key={field.id} className="hover:bg-surface transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold text-on-surface text-xs">{field.label}</p>
                            <p className="text-[10px] text-outline font-mono mt-0.5">field_id: {field.id}</p>
                          </td>

                          <td className="py-4 px-4">
                            <span className="text-[10px] font-mono bg-surface border px-2 py-0.5 rounded text-outline">
                              {field.type}
                            </span>
                          </td>

                          {/* Editable radio */}
                          <td className="py-4 px-4 text-center">
                            <input
                              type="radio"
                              name={`col_perm_${field.id}`}
                              checked={access === 'editable'}
                              onChange={() => handleFieldColumnAccessChange(selectedFormForColumn, field.id, 'editable')}
                              className="w-4 h-4 text-green-600 accent-green-600 cursor-pointer"
                            />
                          </td>

                          {/* Readonly radio */}
                          <td className="py-4 px-4 text-center">
                            <input
                              type="radio"
                              name={`col_perm_${field.id}`}
                              checked={access === 'readonly'}
                              onChange={() => handleFieldColumnAccessChange(selectedFormForColumn, field.id, 'readonly')}
                              className="w-4 h-4 text-blue-600 accent-blue-600 cursor-pointer"
                            />
                          </td>

                          {/* Masked radio */}
                          <td className="py-4 px-4 text-center">
                            <input
                              type="radio"
                              name={`col_perm_${field.id}`}
                              checked={access === 'masked'}
                              onChange={() => handleFieldColumnAccessChange(selectedFormForColumn, field.id, 'masked')}
                              className="w-4 h-4 text-purple-600 accent-purple-600 cursor-pointer"
                            />
                          </td>

                          {/* Hidden radio */}
                          <td className="py-4 px-4 text-center">
                            <input
                              type="radio"
                              name={`col_perm_${field.id}`}
                              checked={access === 'hidden'}
                              onChange={() => handleFieldColumnAccessChange(selectedFormForColumn, field.id, 'hidden')}
                              className="w-4 h-4 text-red-600 accent-red-600 cursor-pointer"
                            />
                          </td>

                          {/* Preview Badge */}
                          <td className="py-4 px-6">
                            {access === 'editable' && (
                              <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg flex items-center gap-1 w-fit">
                                <Check className="w-3 h-3" /> 可正常输入与编辑
                              </span>
                            )}
                            {access === 'readonly' && (
                              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1 w-fit">
                                <Lock className="w-3 h-3" /> 置灰显示并禁止修改
                              </span>
                            )}
                            {access === 'masked' && (
                              <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg flex items-center gap-1 w-fit">
                                <span>138****0000</span>
                                <span className="text-[9px] font-sans text-purple-500">(掩码脱敏)</span>
                              </span>
                            )}
                            {access === 'hidden' && (
                              <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg flex items-center gap-1 w-fit">
                                <EyeOff className="w-3 h-3" /> 界面完全屏蔽此列
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 角色归属成员名单 ================= */}
          {activeTab === 'members' && (
            <div className="bg-white rounded-3xl border border-outline-variant/80 p-6 space-y-4 shadow-sm max-w-5xl">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-on-surface">当前角色成员名单 ({roleMembers.length} 人)</h4>
                  <p className="text-[11px] text-outline">这些成员将继承上述功能权限配置及行列数据安全规则</p>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  + 分配/增减成员
                </button>
              </div>

              {roleMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {roleMembers.map(member => (
                    <div key={member.id} className="p-3.5 rounded-2xl border border-outline-variant/50 bg-surface flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {member.name.slice(0, 1)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-on-surface truncate">{member.name}</p>
                          <p className="text-[10px] text-outline font-mono truncate">{member.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleMemberRole(member)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-700 shrink-0"
                      >
                        移除
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-outline font-medium">
                  当前角色下暂未分配任何员工，点击右上角「分配成员」进行指派
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Custom Role Modal */}
      {isNewRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-outline-variant animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-on-surface mb-1">新建业务权限角色</h3>
            <p className="text-xs text-outline mb-4">创建后可自主配置菜单、表单、操作及行列数据权限</p>

            <form onSubmit={handleCreateNewRole} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">角色名称 *</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="例如：销售区域总监"
                  className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">角色代码标识</label>
                <input
                  type="text"
                  value={newRoleCode}
                  onChange={(e) => setNewRoleCode(e.target.value)}
                  placeholder="ROLE_SALES_DIR"
                  className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">角色职责说明</label>
                <textarea
                  rows={3}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="请输入该角色的业务定位与管控权限范畴..."
                  className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20"
                >
                  确认创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Members Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-outline-variant max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-on-surface mb-1">为「{selectedRole.name}」分配成员</h3>
            <p className="text-xs text-outline mb-4">勾选用户后，该用户将继承当前角色的所有功能与数据权限</p>

            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-outline-variant/30 pr-1">
              {teamMembers.map(member => {
                const isInRole = member.roleId === selectedRole.id || member.role === selectedRole.name;

                return (
                  <div key={member.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isInRole}
                        onChange={() => handleToggleMemberRole(member)}
                        className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-black text-on-surface">{member.name}</p>
                        <p className="text-[10px] text-outline font-mono">{member.email} | {member.workNo || member.id}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border text-on-surface-variant">
                      当前角色: {member.role}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAssignModalOpen(false);
                  showNotification?.(`已完成角色「${selectedRole.name}」的成员更新！`);
                }}
                className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
