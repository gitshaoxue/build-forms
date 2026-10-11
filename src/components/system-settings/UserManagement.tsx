import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Table, 
  Building2, 
  ShieldCheck, 
  Tag, 
  Layers, 
  Phone, 
  Mail, 
  MapPin, 
  Factory, 
  Store, 
  RefreshCw,
  UserCheck,
  UserX,
  Filter,
  Copy,
  Settings,
  Lock,
  ChevronDown,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { OrgNode, TeamMember, RoleDefinition } from './types';

interface UserManagementProps {
  teamMembers: TeamMember[];
  orgData: OrgNode[];
  roles: RoleDefinition[];
  onAddMember: (member: Omit<TeamMember, 'id' | 'createdAt'>) => void;
  onUpdateMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  showNotification?: (text: string) => void;
}

// Preset Organization Tree for User Management matching screenshot 1.3
interface OrgTreeItem {
  id: string;
  name: string;
  children?: OrgTreeItem[];
}

const DEFAULT_USER_MGMT_ORG_TREE: OrgTreeItem[] = [
  { id: 'uorg-szdr', name: '深圳笃人组织' },
  { id: 'uorg-cjm-all', name: 'cjm全国总公司' },
  { id: 'uorg-cjm', name: 'cjm组织' },
  { 
    id: 'uorg-default', 
    name: '默认组织',
    children: [
      { id: 'uorg-9527', name: '9527组织' }
    ]
  },
  { id: 'uorg-nj', name: '南京市' },
  { id: 'uorg-jl', name: '吉林省' },
  { 
    id: 'uorg-sx', 
    name: '山西省',
    children: [
      { id: 'uorg-hlj', name: '黑龙江省' },
      { id: 'uorg-hb', name: '河北省' }
    ]
  },
  { id: 'uorg-hn', name: '湖南省' },
  { id: 'uorg-jt', name: '景田集团' },
  { id: 'uorg-gx', name: '广西省' },
  { id: 'uorg-gd', name: '广东省' },
  { id: 'uorg-test-dept', name: '测试部门' },
  { id: 'uorg-hr-admin', name: '人事行政部' },
  { id: 'uorg-abc', name: 'ABC' },
  { id: 'uorg-cs111', name: 'ceshi111' },
  { id: 'uorg-cs666', name: '测试666' },
  { id: 'uorg-api1', name: 'api-name-1' },
  { id: 'uorg-lvl1', name: '一级组织AAA' },
  { id: 'uorg-test-a', name: '测试A' },
  { 
    id: 'uorg-a1', 
    name: '组织A1',
    children: [
      { id: 'uorg-xk1', name: 'Test-xk-测试组织-1' }
    ]
  },
  { id: 'uorg-chiur', name: 'Chiur' },
  { id: 'uorg-wh', name: 'WH-测试组织' },
];

export const UserManagement: React.FC<UserManagementProps> = ({
  teamMembers,
  orgData,
  roles,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  showNotification
}) => {
  // Tree state
  const [treeSearch, setTreeSearch] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('all');
  const [selectedOrgName, setSelectedOrgName] = useState<string>('全部组织');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['uorg-default', 'uorg-sx', 'uorg-a1']));

  // Multi-Filter Inputs (matching 1.3 screenshot)
  const [filterAccountName, setFilterAccountName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterRelatedParty, setFilterRelatedParty] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');

  // Table selection & pagination
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal: 新增 / 编辑用户 (matching 1.4 用户管理-新增.png)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form Fields (1.4)
  const [formName, setFormName] = useState('');
  const [formDeptName, setFormDeptName] = useState('');
  const [formPersonName, setFormPersonName] = useState('');
  const [formRoleName, setFormRoleName] = useState('');
  const [formDataScope, setFormDataScope] = useState('关联方');
  const [formChargeDept, setFormChargeDept] = useState('');
  const [formParentUser, setFormParentUser] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Disabled'>('Active');
  const [formRemarks, setFormRemarks] = useState('');
  const [formPhone, setFormPhone] = useState('');

  // Quick Add Person Modal
  const [isQuickPersonModalOpen, setIsQuickPersonModalOpen] = useState(false);
  const [quickPersonName, setQuickPersonName] = useState('');

  // Detail Modal
  const [detailUser, setDetailUser] = useState<TeamMember | null>(null);

  // Toggle tree expand
  const toggleTreeExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Flattened initial members with fallback IDs and account names
  const allMembers = useMemo(() => {
    return teamMembers.map((m, idx) => ({
      ...m,
      accountId: m.accountId || (330142 - idx).toString(),
      accountName: m.accountName || m.name,
      personName: m.personName || m.name,
      deptName: m.deptName || '外部组织/供应商外包服务部',
      relatedParty: m.relatedParty || (idx % 2 === 0 ? '外部供应商' : '供应链阳江基地'),
      channel: m.channel || 'Web端',
      dataScope: m.dataScope || '关联方',
      phone: m.phone || `1527474786${idx}`,
    }));
  }, [teamMembers]);

  // Filtered rows for data table
  const filteredMembers = useMemo(() => {
    return allMembers.filter(m => {
      if (selectedOrgId !== 'all' && selectedOrgName !== '全部组织') {
        const matchesOrg = (m.deptName || '').includes(selectedOrgName) || (m.deptId || '') === selectedOrgId;
        if (!matchesOrg && !selectedOrgName.includes('组织')) {
          // allow partial match
        }
      }
      if (filterAccountName.trim()) {
        const val = filterAccountName.trim().toLowerCase();
        const acc = (m.accountName || '').toLowerCase();
        const nm = (m.name || '').toLowerCase();
        const id = (m.accountId || '').toLowerCase();
        if (!acc.includes(val) && !nm.includes(val) && !id.includes(val)) return false;
      }
      if (filterPhone.trim()) {
        if (!m.phone.includes(filterPhone.trim())) return false;
      }
      if (filterDept !== 'all') {
        if (!(m.deptName || '').includes(filterDept) && m.deptId !== filterDept) return false;
      }
      if (filterRole !== 'all') {
        if (m.role !== filterRole && m.roleId !== filterRole) return false;
      }
      if (filterStatus !== 'all') {
        if (m.status !== filterStatus) return false;
      }
      return true;
    });
  }, [allMembers, selectedOrgId, selectedOrgName, filterAccountName, filterPhone, filterDept, filterRole, filterStatus]);

  // Paginated rows
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingUserId(null);
    setFormName('');
    setFormDeptName(selectedOrgName !== '全部组织' ? selectedOrgName : '外部组织/供应商外包服务部');
    setFormPersonName('');
    setFormRoleName(roles[0]?.name || '默认初始角色');
    setFormDataScope('关联方');
    setFormChargeDept('');
    setFormParentUser('');
    setFormStatus('Active');
    setFormRemarks('');
    setFormPhone('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (m: TeamMember) => {
    setModalMode('edit');
    setEditingUserId(m.id);
    setFormName(m.accountName || m.name);
    setFormDeptName(m.deptName || '外部组织/供应商外包服务部');
    setFormPersonName(m.personName || m.name);
    setFormRoleName(m.role);
    setFormDataScope(m.dataScope || '关联方');
    setFormChargeDept(m.chargeDepts?.[0] || '');
    setFormParentUser(m.parentUser || '');
    setFormStatus(m.status);
    setFormRemarks(m.remarks || '');
    setFormPhone(m.phone || '');
    setIsModalOpen(true);
  };

  // Submit Modal
  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification?.('请输入用户名称');
      return;
    }
    if (!formPhone.trim()) {
      showNotification?.('请输入手机号');
      return;
    }

    const payload: Partial<TeamMember> = {
      accountName: formName.trim(),
      name: formPersonName.trim() || formName.trim(),
      personName: formPersonName.trim() || formName.trim(),
      deptName: formDeptName,
      role: formRoleName,
      dataScope: formDataScope,
      chargeDepts: formChargeDept ? [formChargeDept] : [],
      parentUser: formParentUser.trim() || undefined,
      status: formStatus,
      remarks: formRemarks.trim() || undefined,
      phone: formPhone.trim(),
    };

    if (modalMode === 'create') {
      onAddMember({
        workNo: `EMP-${Date.now().toString().slice(-4)}`,
        name: formPersonName.trim() || formName.trim(),
        role: formRoleName,
        roleId: roles.find(r => r.name === formRoleName)?.id || 'filler',
        deptId: 'd3',
        email: `${formName.trim()}@company.com`,
        phone: formPhone.trim() || '15274747861',
        status: formStatus,
        chargeDepts: formChargeDept ? [formChargeDept] : [],
        salesRegions: [],
        factories: [],
        stores: [],
        ...payload
      });
      showNotification?.(`成功新增用户「${formName.trim()}」`);
    } else if (editingUserId) {
      const existing = teamMembers.find(m => m.id === editingUserId);
      if (existing) {
        onUpdateMember({
          ...existing,
          ...payload
        });
        showNotification?.(`已更新用户「${formName.trim()}」`);
      }
    }

    setIsModalOpen(false);
  };

  // Copy helper
  const handleCopy = (text: string, label = '内容') => {
    navigator.clipboard.writeText(text);
    showNotification?.(`已复制${label}: ${text}`);
  };

  // Selection toggle
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedMembers.length && paginatedMembers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedMembers.map(r => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Batch actions
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showNotification?.('请先勾选需要删除的用户');
      return;
    }
    selectedIds.forEach(id => onDeleteMember(id));
    showNotification?.(`已批量删除选中的 ${selectedIds.length} 位用户`);
    setSelectedIds([]);
  };

  const handleBatchStatus = (targetStatus: 'Active' | 'Disabled') => {
    if (selectedIds.length === 0) {
      showNotification?.('请先勾选用户');
      return;
    }
    selectedIds.forEach(id => {
      const m = teamMembers.find(item => item.id === id);
      if (m) onUpdateMember({ ...m, status: targetStatus });
    });
    showNotification?.(`已批量${targetStatus === 'Active' ? '启用' : '停用'}选中的用户`);
    setSelectedIds([]);
  };

  const handleResetPassword = () => {
    if (selectedIds.length === 0) {
      showNotification?.('请先勾选需要重置密码的用户账号');
      return;
    }
    showNotification?.(`已成功为选中的 ${selectedIds.length} 个账号重置随机密码并下发通知`);
  };

  // Render tree item
  const renderOrgTreeItem = (item: OrgTreeItem, level = 0) => {
    const isExpanded = expandedNodes.has(item.id);
    const isSelected = selectedOrgId === item.id;
    const hasChildren = item.children && item.children.length > 0;

    if (treeSearch.trim() && !item.name.toLowerCase().includes(treeSearch.trim().toLowerCase())) {
      const hasMatchInChild = (item.children || []).some(c => c.name.toLowerCase().includes(treeSearch.trim().toLowerCase()));
      if (!hasMatchInChild) return null;
    }

    return (
      <div key={item.id} className="select-none text-xs">
        <div 
          onClick={() => {
            setSelectedOrgId(item.id);
            setSelectedOrgName(item.name);
          }}
          className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-primary/10 text-primary font-bold' 
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          style={{ paddingLeft: `${Math.max(8, level * 16 + 6)}px` }}
        >
          {hasChildren ? (
            <span 
              onClick={(e) => toggleTreeExpand(item.id, e)}
              className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
          ) : (
            <span className="w-4 h-4 shrink-0" />
          )}
          <span className="truncate">{item.name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {item.children!.map(child => renderOrgTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex h-full bg-slate-50/50 overflow-hidden">
      {/* ================= Left Organization Tree (Matching 1.3) ================= */}
      <div className="w-64 bg-white border-r border-outline-variant flex flex-col shrink-0">
        <div className="p-3 border-b border-outline-variant/60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={treeSearch}
              onChange={(e) => setTreeSearch(e.target.value)}
              placeholder="搜索"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <div 
            onClick={() => {
              setSelectedOrgId('all');
              setSelectedOrgName('全部组织');
            }}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg cursor-pointer text-xs transition-colors mb-1 ${
              selectedOrgId === 'all' 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>全部成员组织</span>
          </div>

          {DEFAULT_USER_MGMT_ORG_TREE.map(item => renderOrgTreeItem(item, 0))}
        </div>
      </div>

      {/* ================= Right Content Area ================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Top Multi-Filter Search Area (matching screenshot 1.3 optimized) */}
        <div className="p-4 border-b border-outline-variant/60 bg-white space-y-3">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <input 
                type="text"
                value={filterAccountName}
                onChange={(e) => setFilterAccountName(e.target.value)}
                placeholder="请输入名称"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
              />
            </div>
            <div>
              <input 
                type="text"
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
                placeholder="请输入手机号"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
              />
            </div>
            <div>
              <select 
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs bg-white text-slate-700"
              >
                <option value="all">请选择所属组织</option>
                <option value="外部组织">外部组织/供应商外包服务部</option>
                <option value="供应链使用组织">供应链使用组织/阳江基地</option>
                <option value="供应链经销商">供应链经销商/华东配送</option>
                <option value="默认组织">默认组织/树状_1/景田</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs items-center">
            <div>
              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs bg-white text-slate-700"
              >
                <option value="all">请选择角色</option>
                {roles.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs bg-white text-slate-700"
              >
                <option value="all">请选择状态</option>
                <option value="Active">启用</option>
                <option value="Disabled">停用</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setCurrentPage(1)}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                搜索
              </button>
              <button 
                type="button"
                onClick={() => {
                  setFilterAccountName('');
                  setFilterPhone('');
                  setFilterDept('all');
                  setFilterRole('all');
                  setFilterStatus('all');
                  setSelectedOrgId('all');
                  setSelectedOrgName('全部组织');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs transition-colors"
              >
                重置
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Row (matching 1.3) */}
        <div className="px-6 py-3 border-b border-outline-variant/60 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <button 
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>
            <button 
              type="button"
              onClick={handleBatchDelete}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              删除
            </button>
            <button 
              type="button"
              onClick={() => handleBatchStatus('Active')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              启用
            </button>
            <button 
              type="button"
              onClick={() => handleBatchStatus('Disabled')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              停用
            </button>
            <button 
              type="button"
              onClick={handleResetPassword}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              重置密码
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              title="表格列配置" 
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table (matching columns in 1.3) */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-semibold select-none">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input 
                    type="checkbox"
                    checked={selectedIds.length === paginatedMembers.length && paginatedMembers.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 min-w-[120px]">账号ID</th>
                <th className="px-4 py-3 min-w-[180px]">用户名称</th>
                <th className="px-4 py-3 min-w-[130px]">手机号</th>
                <th className="px-4 py-3 min-w-[200px]">所属组织</th>
                <th className="px-4 py-3 min-w-[130px] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    未找到匹配的用户数据
                  </td>
                </tr>
              ) : (
                paginatedMembers.map(row => {
                  const isChecked = selectedIds.includes(row.id);

                  return (
                    <tr 
                      key={row.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isChecked ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(row.id)}
                          className="rounded border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button"
                            onClick={() => handleCopy(row.accountId || row.id, '账号ID')}
                            title="复制账号ID"
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <span>{row.accountId || row.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {row.accountName || row.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono">
                        {row.phone}
                      </td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-[220px]" title={row.deptName}>
                        {row.deptName || '外部组织/供应商外包服务部'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3 font-medium">
                          <button 
                            type="button"
                            onClick={() => setDetailUser(row)}
                            className="text-primary hover:underline cursor-pointer"
                          >
                            详情
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleOpenEdit(row)}
                            className="text-primary hover:underline cursor-pointer"
                          >
                            编辑
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              if (confirm(`确定删除用户「${row.accountName || row.name}」吗？`)) {
                                onDeleteMember(row.id);
                                showNotification?.(`已删除「${row.accountName || row.name}」`);
                              }
                            }}
                            className="text-primary hover:underline cursor-pointer"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (matching 1.3) */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white select-none">
          <div>
            共 <span className="font-semibold text-slate-700">155868</span> 条
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              &lt;
            </button>
            {[1, 2, 3, 4, 5].map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded border font-medium ${
                  currentPage === page 
                    ? 'bg-primary text-white border-primary' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-slate-400">...</span>
            <button 
              onClick={() => setCurrentPage(7794)}
              className="w-8 h-7 rounded border border-slate-200 hover:bg-slate-50"
            >
              7794
            </button>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50"
            >
              &gt;
            </button>
            <select 
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 border border-slate-200 rounded text-xs bg-white text-slate-700"
            >
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
              <option value={50}>50 条/页</option>
            </select>
            <div className="flex items-center gap-1 ml-2 text-slate-400">
              跳至 <input type="text" className="w-10 px-1 py-0.5 border border-slate-200 text-center rounded text-xs" /> 页
            </div>
          </div>
        </div>
      </div>

      {/* ================= Modal: 新增用户 / 编辑用户 (Image 1.4 用户管理-新增.png) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {modalMode === 'create' ? '新增用户' : '编辑用户'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitModal} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* 名称 * */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  名称 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    maxLength={50}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="请输入名称"
                    className="w-full px-3.5 py-2 pr-14 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary placeholder:text-slate-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 select-none">
                    {formName.length} / 50
                  </span>
                </div>
              </div>

              {/* 手机号 * */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  手机号 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary placeholder:text-slate-400 text-slate-700 font-mono"
                />
              </div>

              {/* 所属组织 * */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  所属组织 <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formDeptName}
                  onChange={(e) => setFormDeptName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-700"
                >
                  <option value="">请选择所属组织</option>
                  <option value="外部组织/供应商外包服务部">外部组织/供应商外包服务部</option>
                  <option value="供应链使用组织/阳江生产基地">供应链使用组织/阳江生产基地</option>
                  <option value="供应链经销商/华东核心仓配中心">供应链经销商/华东核心仓配中心</option>
                  <option value="景田集团/总部/总经办">景田集团/总部/总经办</option>
                  <option value="默认组织/树状_1/景田">默认组织/树状_1/景田</option>
                  <option value="人事行政部">人事行政部</option>
                </select>
              </div>

              {/* 角色 * */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  角色 <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formRoleName}
                  onChange={(e) => setFormRoleName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-700"
                >
                  <option value="">请选择角色</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                  <option value="王晓红_供应商角色">王晓红_供应商角色</option>
                  <option value="王晓红_叉车司机">王晓红_叉车司机</option>
                  <option value="王晓红_保安">王晓红_保安</option>
                  <option value="经销商业务代表">经销商业务代表</option>
                </select>
              </div>

              {/* 关联所属上级 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  关联所属上级
                </label>
                <input 
                  type="text"
                  value={formParentUser}
                  onChange={(e) => setFormParentUser(e.target.value)}
                  placeholder="请选择所属上级"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* 状态 * (Radio Group) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  状态 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="radio"
                      name="userStatus"
                      checked={formStatus === 'Active'}
                      onChange={() => setFormStatus('Active')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-slate-700 font-medium">启用</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="radio"
                      name="userStatus"
                      checked={formStatus === 'Disabled'}
                      onChange={() => setFormStatus('Disabled')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-slate-700 font-medium">停用</span>
                  </label>
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  备注
                </label>
                <textarea 
                  rows={2}
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="请输入备注"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  确定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= Quick Add Person Modal ================= */}
      {isQuickPersonModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-900 mb-3">快捷登记人员</h4>
            <input 
              type="text"
              autoFocus
              value={quickPersonName}
              onChange={(e) => setQuickPersonName(e.target.value)}
              placeholder="请输入人员姓名 (如：李德林)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs mb-4 focus:outline-none focus:border-primary"
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setIsQuickPersonModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (quickPersonName.trim()) {
                    setFormPersonName(quickPersonName.trim());
                    showNotification?.(`已选定人员「${quickPersonName.trim()}」`);
                    setIsQuickPersonModalOpen(false);
                  }
                }}
                className="px-4 py-1.5 text-xs bg-primary text-white font-medium rounded-lg"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Detail Modal ================= */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{detailUser.accountName || detailUser.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">账号ID: {detailUser.accountId || detailUser.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setDetailUser(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">所属组织</span>
                <span className="text-slate-700 font-medium text-right">{detailUser.deptName || '外部组织/供应商外包服务部'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">分配角色</span>
                <span className="text-slate-700 font-medium">{detailUser.role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">手机号码</span>
                <span className="text-slate-700 font-mono">{detailUser.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">账号状态</span>
                <span className={detailUser.status === 'Active' ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                  {detailUser.status === 'Active' ? '启用' : '停用'}
                </span>
              </div>
              {detailUser.remarks && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">备注</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg text-slate-600">{detailUser.remarks}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setDetailUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
