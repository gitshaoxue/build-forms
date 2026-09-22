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
  Filter
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

// Available options for business tags
export const AVAILABLE_SALES_REGIONS = ['华东大区', '华南大区', '华北大区', '西南大区', '华中大区', '西北大区'];
export const AVAILABLE_FACTORIES = [
  '华东一号智能制造基地',
  '华南精密电子生产工厂',
  '华北自动化装备工厂',
  '西南零部件加工中心'
];
export const AVAILABLE_STORES = [
  '上海南京路旗舰店',
  '广州天河直营店',
  '深圳南山万象城店',
  '北京三里屯概念店',
  '成都春熙路店',
  '杭州湖滨步行街店'
];

// Helper to flatten tree for select
const flattenOrgTree = (nodes: OrgNode[], parentName = ''): Array<{ id: string; name: string; fullPath: string }> => {
  let result: Array<{ id: string; name: string; fullPath: string }> = [];
  for (const node of nodes) {
    const fullPath = parentName ? `${parentName} / ${node.name}` : node.name;
    result.push({ id: node.id, name: node.name, fullPath });
    if (node.children && node.children.length > 0) {
      result = result.concat(flattenOrgTree(node.children, fullPath));
    }
  }
  return result;
};

export const UserManagement: React.FC<UserManagementProps> = ({
  teamMembers,
  orgData,
  roles,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  showNotification
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTagFilter, setSelectedTagFilter] = useState<'All' | 'region' | 'factory' | 'store'>('All');

  // Modal State for Quick Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form Fields State (shared between Modal and Custom Form View)
  const [formName, setFormName] = useState('');
  const [formWorkNo, setFormWorkNo] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDeptId, setFormDeptId] = useState('');
  const [formRoleId, setFormRoleId] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Disabled'>('Active');
  const [formChargeDepts, setFormChargeDepts] = useState<string[]>([]);
  const [formSalesRegions, setFormSalesRegions] = useState<string[]>([]);
  const [formFactories, setFormFactories] = useState<string[]>([]);
  const [formStores, setFormStores] = useState<string[]>([]);

  // Flattened department options
  const flatDepts = useMemo(() => flattenOrgTree(orgData), [orgData]);

  // Find department name by id
  const getDeptName = (deptId: string): string => {
    const found = flatDepts.find(d => d.id === deptId);
    return found ? found.name : '未分配部门';
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchKeyword = 
        !searchKeyword || 
        member.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        member.workNo.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        member.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        member.phone.includes(searchKeyword);
      
      const matchDept = filterDept === 'All' || member.deptId === filterDept;
      const matchRole = filterRole === 'All' || member.role === filterRole || member.roleId === filterRole;
      const matchStatus = filterStatus === 'All' || member.status === filterStatus;
      
      let matchTag = true;
      if (selectedTagFilter === 'region') {
        matchTag = member.salesRegions && member.salesRegions.length > 0;
      } else if (selectedTagFilter === 'factory') {
        matchTag = member.factories && member.factories.length > 0;
      } else if (selectedTagFilter === 'store') {
        matchTag = member.stores && member.stores.length > 0;
      }

      return matchKeyword && matchDept && matchRole && matchStatus && matchTag;
    });
  }, [teamMembers, searchKeyword, filterDept, filterRole, filterStatus, selectedTagFilter]);

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingUserId(null);
    setFormName('');
    setFormWorkNo(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormEmail('');
    setFormPhone('138' + Math.floor(10000000 + Math.random() * 90000000));
    setFormDeptId(flatDepts[0]?.id || 'd1');
    setFormRoleId(roles[0]?.id || 'designer');
    setFormStatus('Active');
    setFormChargeDepts([]);
    setFormSalesRegions([]);
    setFormFactories([]);
    setFormStores([]);
    setIsModalOpen(true);
  };

  // Open Edit Dialog / Load into Form
  const handleOpenEdit = (member: TeamMember) => {
    setEditingUserId(member.id);
    setFormName(member.name);
    setFormWorkNo(member.workNo || `EMP-${member.id}`);
    setFormEmail(member.email);
    setFormPhone(member.phone || '13800000000');
    setFormDeptId(member.deptId);
    setFormRoleId(member.roleId || roles.find(r => r.name === member.role)?.id || roles[0]?.id || 'designer');
    setFormStatus(member.status || 'Active');
    setFormChargeDepts(member.chargeDepts || []);
    setFormSalesRegions(member.salesRegions || []);
    setFormFactories(member.factories || []);
    setFormStores(member.stores || []);
    if (viewMode === 'list') {
      setIsModalOpen(true);
    } else {
      showNotification?.(`已在自定义表单中载入用户「${member.name}」档案`);
    }
  };

  // Submit Handler (for both Modal and Custom Form mode)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification?.('请输入员工姓名');
      return;
    }
    if (!formEmail.trim()) {
      showNotification?.('请输入工作邮箱');
      return;
    }

    const selectedRoleObj = roles.find(r => r.id === formRoleId) || roles[0];
    const roleName = selectedRoleObj ? selectedRoleObj.name : '普通员工';

    if (editingUserId) {
      // Update existing member
      const existing = teamMembers.find(m => m.id === editingUserId);
      if (!existing) return;
      onUpdateMember({
        ...existing,
        name: formName.trim(),
        workNo: formWorkNo.trim() || existing.workNo,
        email: formEmail.trim(),
        phone: formPhone.trim(),
        deptId: formDeptId,
        role: roleName,
        roleId: formRoleId,
        status: formStatus,
        chargeDepts: formChargeDepts,
        salesRegions: formSalesRegions,
        factories: formFactories,
        stores: formStores
      });
      showNotification?.(`已更新用户「${formName.trim()}」的档案与标签配置！`);
    } else {
      // Add new member
      onAddMember({
        name: formName.trim(),
        workNo: formWorkNo.trim() || `EMP-${Date.now().toString().slice(-4)}`,
        email: formEmail.trim(),
        phone: formPhone.trim() || '13800138000',
        deptId: formDeptId || flatDepts[0]?.id || 'd1',
        role: roleName,
        roleId: formRoleId || roles[0]?.id || 'designer',
        status: formStatus,
        chargeDepts: formChargeDepts,
        salesRegions: formSalesRegions,
        factories: formFactories,
        stores: formStores
      });
      showNotification?.(`已成功录入新用户「${formName.trim()}」并分配标签！`);
    }

    setIsModalOpen(false);
    if (viewMode === 'form') {
      // Reset form if in form mode
      setEditingUserId(null);
      setFormName('');
      setFormEmail('');
      setFormChargeDepts([]);
      setFormSalesRegions([]);
      setFormFactories([]);
      setFormStores([]);
    }
  };

  // Toggle user active / disabled status
  const handleToggleUserStatus = (member: TeamMember) => {
    const nextStatus = member.status === 'Disabled' ? 'Active' : 'Disabled';
    onUpdateMember({
      ...member,
      status: nextStatus
    });
    showNotification?.(`用户「${member.name}」已${nextStatus === 'Active' ? '恢复启用' : '禁用停用'}`);
  };

  // Delete user
  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`确定要删除用户「${name}」的账号体系档案吗？`)) {
      onDeleteMember(id);
      if (editingUserId === id) {
        setEditingUserId(null);
      }
      showNotification?.(`用户「${name}」已删除`);
    }
  };

  // Toggle multi-select tags helper
  const toggleArrayItem = (arr: string[], item: string): string[] => {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Top Header */}
      <div className="px-8 py-5 border-b border-outline-variant/60 flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-on-surface flex items-center gap-2">
              用户管理
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                独立用户体系
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant">维护平台员工实体、部门归属、系统角色，以及负责大区/工厂/门店多维标签体系</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="bg-surface-container-low p-1 rounded-xl flex items-center border border-outline-variant/40">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>用户台账列表</span>
            </button>
            <button
              onClick={() => {
                setViewMode('form');
                if (!editingUserId && teamMembers[0]) handleOpenEdit(teamMembers[0]);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'form'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>自定义表单 CRUD 模式</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-primary/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建用户</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* ================= 模式一：标准用户列表与过滤 ================= */
        <div className="flex-1 flex flex-col overflow-hidden p-8 space-y-6">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索姓名、工号、手机或邮箱..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <div>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary cursor-pointer text-on-surface"
              >
                <option value="All">全部所属组织</option>
                {flatDepts.map(d => (
                  <option key={d.id} value={d.id}>{d.fullPath}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary cursor-pointer text-on-surface"
              >
                <option value="All">全部系统角色</option>
                {roles.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary cursor-pointer text-on-surface"
              >
                <option value="All">所有状态</option>
                <option value="Active">正常启用 (Active)</option>
                <option value="Disabled">禁用停用 (Disabled)</option>
              </select>
            </div>
          </div>

          {/* Quick Tag Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-outline-variant/30 text-xs">
            <span className="text-outline font-bold flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-primary" />
              标签筛选：
            </span>
            {[
              { id: 'All', label: '全部用户' },
              { id: 'region', label: '含【负责销售区域】标签' },
              { id: 'factory', label: '含【负责工厂】标签' },
              { id: 'store', label: '含【负责门店】标签' },
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => setSelectedTagFilter(chip.id as any)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  selectedTagFilter === chip.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface hover:bg-surface-container-low text-on-surface-variant border border-outline-variant/40'
                }`}
              >
                {chip.label}
              </button>
            ))}
            <span className="text-outline text-[11px] ml-auto">共找到 {filteredMembers.length} 名用户</span>
          </div>

          {/* Table */}
          <div className="flex-1 bg-white border border-outline-variant/80 rounded-3xl overflow-hidden flex flex-col shadow-sm">
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/60 bg-surface-container-lowest text-outline text-[11px] font-black uppercase tracking-wider">
                    <th className="py-3.5 px-6">员工姓名 / 工号</th>
                    <th className="py-3.5 px-4">联系方式</th>
                    <th className="py-3.5 px-4">所属组织</th>
                    <th className="py-3.5 px-4">分配角色</th>
                    <th className="py-3.5 px-4">业务标签 (用于数据行权限管控)</th>
                    <th className="py-3.5 px-4">状态</th>
                    <th className="py-3.5 px-6 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {filteredMembers.map(user => (
                    <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center text-sm shrink-0 border border-primary/20">
                            {user.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="font-black text-on-surface text-sm">{user.name}</p>
                            <p className="text-[10px] text-outline font-mono mt-0.5">工号: {user.workNo || user.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <p className="text-on-surface font-mono flex items-center gap-1.5 text-[11px]">
                            <Phone className="w-3 h-3 text-outline" />
                            {user.phone || '13800000000'}
                          </p>
                          <p className="text-outline font-mono flex items-center gap-1.5 text-[10px]">
                            <Mail className="w-3 h-3 text-outline" />
                            {user.email}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-on-surface font-bold text-xs">
                          <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{getDeptName(user.deptId)}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-[11px] font-black px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {user.role}
                        </span>
                      </td>

                      {/* Business Tags for Row Security Control */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {user.chargeDepts && user.chargeDepts.length > 0 && (
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Building2 className="w-2.5 h-2.5" />
                              管辖{user.chargeDepts.length}组织
                            </span>
                          )}
                          {user.salesRegions && user.salesRegions.map(reg => (
                            <span key={reg} className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              {reg}
                            </span>
                          ))}
                          {user.factories && user.factories.map(fac => (
                            <span key={fac} className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Factory className="w-2.5 h-2.5" />
                              {fac.replace('智能制造基地', '').replace('生产工厂', '')}
                            </span>
                          ))}
                          {user.stores && user.stores.map(st => (
                            <span key={st} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Store className="w-2.5 h-2.5" />
                              {st}
                            </span>
                          ))}
                          {(!user.chargeDepts?.length && !user.salesRegions?.length && !user.factories?.length && !user.stores?.length) && (
                            <span className="text-[10px] text-outline italic">常规组织归属</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          user.status === 'Disabled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {user.status === 'Disabled' ? '已停用' : '启用中'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              user.status === 'Disabled'
                                ? 'text-green-600 border-green-200 hover:bg-green-50'
                                : 'text-orange-600 border-orange-200 hover:bg-orange-50'
                            }`}
                            title={user.status === 'Disabled' ? '启用用户' : '禁用用户'}
                          >
                            {user.status === 'Disabled' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                            title="编辑档案与标签"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            title="删除用户"
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
      ) : (
        /* ================= 模式二：在自定义表单中做用户的增删改查 ================= */
        <div className="flex-1 flex overflow-hidden p-8 gap-8 bg-surface-container-lowest/30">
          {/* Custom Form Container */}
          <div className="w-full max-w-xl bg-white border border-outline-variant/80 rounded-3xl p-8 flex flex-col shadow-sm overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-on-surface">
                    {editingUserId ? `自定义表单修改：${formName}` : '自定义表单新增用户档案'}
                  </h3>
                  <p className="text-[11px] text-outline">在表单设计器标准表单框架内录入用户与多维标签</p>
                </div>
              </div>

              {editingUserId && (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="text-xs text-primary hover:underline font-bold"
                >
                  切换为新建模式
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5 flex-1">
              {/* Basic Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface flex items-center gap-1">
                    员工姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="如：张明远"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface">工号标识</label>
                  <input
                    type="text"
                    value={formWorkNo}
                    onChange={(e) => setFormWorkNo(e.target.value)}
                    placeholder="EMP-1001"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface flex items-center gap-1">
                    工作邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface">联系手机号</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="13800000000"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              {/* Department & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface flex items-center gap-1">
                    所属组织架构 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formDeptId}
                    onChange={(e) => setFormDeptId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all cursor-pointer"
                  >
                    {flatDepts.map(d => (
                      <option key={d.id} value={d.id}>{d.fullPath}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface flex items-center gap-1">
                    系统权限角色 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formRoleId}
                    onChange={(e) => setFormRoleId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all cursor-pointer"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Radio */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-on-surface">账号状态</label>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                    <input
                      type="radio"
                      name="userFormStatus"
                      value="Active"
                      checked={formStatus === 'Active'}
                      onChange={() => setFormStatus('Active')}
                      className="text-primary accent-primary"
                    />
                    <span>正常启用 (Active)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                    <input
                      type="radio"
                      name="userFormStatus"
                      value="Disabled"
                      checked={formStatus === 'Disabled'}
                      onChange={() => setFormStatus('Disabled')}
                      className="text-primary accent-primary"
                    />
                    <span>停用封存 (Disabled)</span>
                  </label>
                </div>
              </div>

              {/* Business Tags for Row Security Control (Requirement 3.2) */}
              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 space-y-3.5">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black text-on-surface">业务管控标签配置 (用于角色数据行权限)</span>
                </div>

                {/* 1. 负责销售区域 */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-outline">负责销售区域标签：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_SALES_REGIONS.map(reg => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => setFormSalesRegions(toggleArrayItem(formSalesRegions, reg))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          formSalesRegions.includes(reg)
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-white text-outline border border-outline-variant/50 hover:border-purple-300'
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 负责工厂 */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-outline">负责工厂标签：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_FACTORIES.map(fac => (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => setFormFactories(toggleArrayItem(formFactories, fac))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          formFactories.includes(fac)
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-white text-outline border border-outline-variant/50 hover:border-amber-300'
                        }`}
                      >
                        {fac}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. 负责门店 */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-outline">负责门店标签：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_STORES.map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormStores(toggleArrayItem(formStores, st))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          formStores.includes(st)
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white text-outline border border-outline-variant/50 hover:border-emerald-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingUserId ? '保存表单修改并更新用户' : '提交表单新增独立用户'}</span>
                </button>
                {editingUserId && (
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="px-5 py-3 border border-outline-variant rounded-xl text-xs font-bold text-outline hover:text-on-surface transition-colors"
                  >
                    重置
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Quick Users Data View */}
          <div className="flex-1 bg-white border border-outline-variant/80 rounded-3xl p-6 flex flex-col shadow-sm overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-on-surface flex items-center gap-2">
                  <Table className="w-4 h-4 text-primary" />
                  用户档案表单数据台账
                </h4>
                <p className="text-[11px] text-outline">点击任一用户行可载入左侧自定义表单进行修改</p>
              </div>
              <span className="text-xs font-bold text-outline">共 {teamMembers.length} 人</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-outline text-[11px] font-bold">
                    <th className="py-3 px-3">姓名/工号</th>
                    <th className="py-3 px-3">所属部门</th>
                    <th className="py-3 px-3">角色</th>
                    <th className="py-3 px-3">业务标签</th>
                    <th className="py-3 px-3">状态</th>
                    <th className="py-3 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {teamMembers.map(m => (
                    <tr 
                      key={m.id} 
                      onClick={() => handleOpenEdit(m)}
                      className={`hover:bg-primary/5 cursor-pointer transition-colors ${
                        editingUserId === m.id ? 'bg-primary/10 font-bold' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className="font-bold text-on-surface">{m.name}</span>
                        <span className="text-[10px] text-outline ml-2 font-mono">{m.workNo || m.id}</span>
                      </td>
                      <td className="py-3 px-3 text-on-surface-variant">{getDeptName(m.deptId)}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-outline font-medium">
                          {(m.salesRegions?.length || 0) + (m.factories?.length || 0) + (m.stores?.length || 0)} 个标签
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          m.status === 'Disabled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {m.status === 'Disabled' ? '停用' : '启用'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="text-primary hover:underline text-xs font-bold"
                          >
                            表单编辑
                          </button>
                          <button
                            onClick={() => handleDeleteUser(m.id, m.name)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold"
                          >
                            删除
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

      {/* Quick Add / Edit Modal (for list view) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-on-surface mb-1">
              {editingUserId ? '编辑用户信息与标签' : '新建独立用户档案'}
            </h3>
            <p className="text-xs text-outline mb-4">录入用户信息并配置其负责的大区、工厂、门店等行权限管控标签</p>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">员工姓名 *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">工号</label>
                  <input
                    type="text"
                    value={formWorkNo}
                    onChange={(e) => setFormWorkNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">工作邮箱 *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">联系手机</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">所属主组织 *</label>
                  <select
                    value={formDeptId}
                    onChange={(e) => setFormDeptId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none"
                  >
                    {flatDepts.map(d => (
                      <option key={d.id} value={d.id}>{d.fullPath}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">系统权限角色 *</label>
                  <select
                    value={formRoleId}
                    onChange={(e) => setFormRoleId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tag Controls */}
              <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 space-y-3">
                <span className="text-xs font-black text-on-surface block">负责大区/工厂/门店标签 (用于行数据管控)：</span>
                
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-outline">负责销售大区：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_SALES_REGIONS.map(reg => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => setFormSalesRegions(toggleArrayItem(formSalesRegions, reg))}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                          formSalesRegions.includes(reg) ? 'bg-purple-600 text-white' : 'bg-white border text-outline'
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-outline">负责工厂基地：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_FACTORIES.map(fac => (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => setFormFactories(toggleArrayItem(formFactories, fac))}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                          formFactories.includes(fac) ? 'bg-amber-600 text-white' : 'bg-white border text-outline'
                        }`}
                      >
                        {fac}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-outline">负责门店：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_STORES.map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormStores(toggleArrayItem(formStores, st))}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                          formStores.includes(st) ? 'bg-emerald-600 text-white' : 'bg-white border text-outline'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20"
                >
                  {editingUserId ? '保存变更' : '创建用户'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
