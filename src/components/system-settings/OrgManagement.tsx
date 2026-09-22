import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Table, 
  TreePine, 
  UserCheck, 
  Sparkles,
  Phone,
  Mail,
  FolderTree,
  AlertCircle
} from 'lucide-react';
import { OrgNode, TeamMember } from './types';

interface OrgManagementProps {
  orgData: OrgNode[];
  teamMembers: TeamMember[];
  onAddDept: (parentId: string | null, name: string, extra?: Partial<OrgNode>) => void;
  onUpdateDept: (id: string, name: string, extra?: Partial<OrgNode>) => void;
  onDeleteDept: (id: string) => void;
  showNotification?: (text: string) => void;
}

// Helper to flatten tree for selects and table
const flattenOrgTree = (nodes: OrgNode[], level = 0, parentName = ''): Array<OrgNode & { level: number; fullPath: string }> => {
  let result: Array<OrgNode & { level: number; fullPath: string }> = [];
  for (const node of nodes) {
    const currentPath = parentName ? `${parentName} / ${node.name}` : node.name;
    result.push({ ...node, level, fullPath: currentPath });
    if (node.children && node.children.length > 0) {
      result = result.concat(flattenOrgTree(node.children, level + 1, currentPath));
    }
  }
  return result;
};

// Helper to find node by id
const findNodeById = (nodes: OrgNode[], id: string): OrgNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Helper to count total sub-departments
const countSubNodes = (node: OrgNode): number => {
  if (!node.children || node.children.length === 0) return 0;
  return node.children.reduce((acc, curr) => acc + 1 + countSubNodes(curr), 0);
};

export const OrgManagement: React.FC<OrgManagementProps> = ({
  orgData,
  teamMembers,
  onAddDept,
  onUpdateDept,
  onDeleteDept,
  showNotification,
}) => {
  const [viewMode, setViewMode] = useState<'tree' | 'form'>('tree');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>(orgData[0]?.id || 'd1');

  // Modal / Form state for Tree View
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);

  // Form fields state for Custom Form CRUD mode
  const [formOrgId, setFormOrgId] = useState<string | null>(null); // null means adding new
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formType, setFormType] = useState<OrgNode['type']>('dept');
  const [formLeader, setFormLeader] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Disabled'>('Active');
  const [formDesc, setFormDesc] = useState('');

  // Flattened list of departments
  const flattenedOrgs = useMemo(() => flattenOrgTree(orgData), [orgData]);
  const selectedNode = useMemo(() => findNodeById(orgData, selectedOrgId) || orgData[0] || null, [orgData, selectedOrgId]);
  
  // Members belonging to the selected department
  const deptMembers = useMemo(() => {
    if (!selectedNode) return [];
    return teamMembers.filter(m => m.deptId === selectedNode.id);
  }, [teamMembers, selectedNode]);

  // Handle Quick Add Modal Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification?.('请输入组织名称');
      return;
    }
    const code = formCode.trim() || `ORG-${Math.floor(1000 + Math.random() * 9000)}`;
    onAddDept(targetParentId, formName.trim(), {
      code,
      leader: formLeader.trim() || '未指定',
      phone: formPhone.trim() || '-',
      email: formEmail.trim() || '-',
      status: formStatus,
      type: formType,
      sortOrder: 1,
      description: formDesc.trim() || '自主搭建的独立组织单元'
    });
    setIsAddModalOpen(false);
    resetForm();
    showNotification?.(`已成功新建组织单元：${formName.trim()}`);
  };

  // Handle Edit Modal Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode || !formName.trim()) return;
    onUpdateDept(selectedNode.id, formName.trim(), {
      code: formCode.trim() || selectedNode.code,
      leader: formLeader.trim() || selectedNode.leader,
      phone: formPhone.trim() || selectedNode.phone,
      email: formEmail.trim() || selectedNode.email,
      status: formStatus,
      type: formType,
      description: formDesc.trim() || selectedNode.description
    });
    setIsEditModalOpen(false);
    showNotification?.(`已更新组织信息：${formName.trim()}`);
  };

  // Custom Form Mode: Reset Form to Add Mode
  const resetForm = () => {
    setFormOrgId(null);
    setFormName('');
    setFormCode(`ORG-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormParentId(flattenedOrgs[0]?.id || '');
    setFormType('dept');
    setFormLeader('');
    setFormPhone('');
    setFormEmail('');
    setFormStatus('Active');
    setFormDesc('');
  };

  // Custom Form Mode: Load record into Form for editing
  const loadIntoForm = (node: OrgNode) => {
    setFormOrgId(node.id);
    setFormName(node.name);
    setFormCode(node.code || `ORG-${node.id}`);
    setFormParentId(node.parentId || '');
    setFormType(node.type || 'dept');
    setFormLeader(node.leader || '');
    setFormPhone(node.phone || '');
    setFormEmail(node.email || '');
    setFormStatus(node.status || 'Active');
    setFormDesc(node.description || '');
    showNotification?.(`已在自定义表单中载入组织「${node.name}」的数据`);
  };

  // Custom Form Mode: Submit (Add or Edit)
  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification?.('表单校验失败：组织名称不能为空');
      return;
    }

    if (formOrgId) {
      // Edit mode
      onUpdateDept(formOrgId, formName.trim(), {
        code: formCode.trim(),
        parentId: formParentId || null,
        type: formType,
        leader: formLeader.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        status: formStatus,
        description: formDesc.trim()
      });
      showNotification?.(`自定义表单提交成功：组织「${formName.trim()}」已更新！`);
    } else {
      // Add mode
      onAddDept(formParentId || null, formName.trim(), {
        code: formCode.trim() || `ORG-${Date.now().toString().slice(-4)}`,
        parentId: formParentId || null,
        type: formType,
        leader: formLeader.trim() || '负责人待指定',
        phone: formPhone.trim(),
        email: formEmail.trim(),
        status: formStatus,
        sortOrder: 1,
        description: formDesc.trim() || '通过自定义表单录入'
      });
      showNotification?.(`自定义表单填报成功：已新增组织「${formName.trim()}」！`);
      resetForm();
    }
  };

  // Delete node with safety confirmation
  const handleDeleteNode = (id: string, name: string) => {
    const memberCount = teamMembers.filter(m => m.deptId === id).length;
    if (memberCount > 0) {
      if (!confirm(`该组织下仍有 ${memberCount} 名归属员工，确认删除该组织吗？`)) {
        return;
      }
    } else {
      if (!confirm(`确定要删除组织「${name}」吗？`)) {
        return;
      }
    }
    onDeleteDept(id);
    if (selectedOrgId === id) {
      setSelectedOrgId(orgData[0]?.id || '');
    }
    if (formOrgId === id) {
      resetForm();
    }
    showNotification?.(`组织「${name}」已删除`);
  };

  // Toggle node status
  const handleToggleStatus = (node: OrgNode) => {
    const newStatus = node.status === 'Disabled' ? 'Active' : 'Disabled';
    onUpdateDept(node.id, node.name, { status: newStatus });
    showNotification?.(`组织「${node.name}」已${newStatus === 'Active' ? '启用' : '停用'}`);
  };

  // Tree item recursive component
  const TreeItem: React.FC<{ node: OrgNode; level?: number }> = ({ node, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(level < 2);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedOrgId === node.id;
    const isMatched = searchKeyword ? node.name.toLowerCase().includes(searchKeyword.toLowerCase()) : true;

    return (
      <div className={`select-none relative ${!isMatched && searchKeyword ? 'opacity-40' : ''}`}>
        <div 
          onClick={() => setSelectedOrgId(node.id)}
          className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
            isSelected 
              ? 'bg-primary/10 text-primary font-bold shadow-sm border border-primary/20' 
              : 'hover:bg-surface-container-low text-on-surface'
          }`}
          style={{ paddingLeft: `${Math.max(12, level * 16 + 12)}px` }}
        >
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            {hasChildren ? (
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="w-4 h-4 flex items-center justify-center text-outline hover:text-primary transition-transform"
              >
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90 text-primary' : ''}`} />
              </button>
            ) : (
              <span className="w-4 h-4 flex items-center justify-center text-outline/30 text-[10px]">•</span>
            )}

            <Building2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary' : 'text-outline group-hover:text-primary'}`} />
            
            <span className="text-xs truncate tracking-tight">{node.name}</span>
            {node.status === 'Disabled' && (
              <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.2 rounded font-medium">停用</span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              title="添加子组织"
              onClick={(e) => {
                e.stopPropagation();
                setTargetParentId(node.id);
                setFormParentId(node.id);
                setFormName('');
                setFormCode(`ORG-${Date.now().toString().slice(-4)}`);
                setIsAddModalOpen(true);
              }}
              className="p-1 hover:bg-primary/20 text-outline hover:text-primary rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5">
            {node.children!.map(child => (
              <TreeItem key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Top Action Bar */}
      <div className="px-8 py-5 border-b border-outline-variant/60 flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-on-surface flex items-center gap-2">
                组织架构管理
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  独立自建体系
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">支持层级架构维护，并在自定义表单中实现组织的增删改查全生命周期管控</p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Tree View vs Custom Form CRUD */}
        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low p-1 rounded-xl flex items-center border border-outline-variant/40">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'tree'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>架构树视图</span>
            </button>
            <button
              onClick={() => {
                setViewMode('form');
                if (!formOrgId && selectedNode) loadIntoForm(selectedNode);
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

          {viewMode === 'tree' && (
            <button
              onClick={() => {
                setTargetParentId(null);
                setFormParentId('');
                setFormName('');
                setFormCode(`ORG-${Date.now().toString().slice(-4)}`);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-primary/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增根组织</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'tree' ? (
        /* ================= 模式一：组织架构树视图 ================= */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Tree Navigator */}
          <div className="w-80 border-r border-outline-variant/60 flex flex-col bg-surface-container-lowest/30 p-5 space-y-4 shrink-0 overflow-y-auto custom-scrollbar">
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索部门或分支名称..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-outline-variant/60 rounded-xl focus:outline-none focus:border-primary transition-all placeholder:text-outline/50 font-medium"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-outline uppercase tracking-wider px-1">
              <span>组织节点 ({flattenedOrgs.length})</span>
              <button 
                onClick={() => setSelectedOrgId(orgData[0]?.id || '')}
                className="text-primary hover:underline"
              >
                重置选中
              </button>
            </div>

            <div className="space-y-1 flex-1 overflow-y-auto">
              {orgData.map(node => (
                <TreeItem key={node.id} node={node} />
              ))}
            </div>
          </div>

          {/* Right Selected Department Details */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white flex flex-col space-y-8">
            {selectedNode ? (
              <div className="space-y-8 max-w-5xl">
                {/* Org Header Card */}
                <div className="p-6 rounded-3xl border border-outline-variant/80 bg-surface-container-lowest flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-black tracking-tight text-on-surface">{selectedNode.name}</h3>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            selectedNode.status === 'Disabled' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {selectedNode.status === 'Disabled' ? '已停用' : '启用中'}
                          </span>
                        </div>
                        <p className="text-xs text-outline font-mono mt-0.5">ID: {selectedNode.id} | 编码: {selectedNode.code || `DEPT-${selectedNode.id}`}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => handleToggleStatus(selectedNode)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        selectedNode.status === 'Disabled'
                          ? 'border-green-300 text-green-700 hover:bg-green-50'
                          : 'border-orange-300 text-orange-700 hover:bg-orange-50'
                      }`}
                    >
                      {selectedNode.status === 'Disabled' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{selectedNode.status === 'Disabled' ? '启用组织' : '停用组织'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setFormName(selectedNode.name);
                        setFormCode(selectedNode.code || `ORG-${selectedNode.id}`);
                        setFormLeader(selectedNode.leader || '');
                        setFormPhone(selectedNode.phone || '');
                        setFormEmail(selectedNode.email || '');
                        setFormStatus(selectedNode.status || 'Active');
                        setFormType(selectedNode.type || 'dept');
                        setFormDesc(selectedNode.description || '');
                        setIsEditModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-white border border-outline-variant hover:border-primary text-on-surface hover:text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>编辑信息</span>
                    </button>

                    <button
                      onClick={() => {
                        setTargetParentId(selectedNode.id);
                        setFormParentId(selectedNode.id);
                        setFormName('');
                        setFormCode(`ORG-${Date.now().toString().slice(-4)}`);
                        setIsAddModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>添加子部门</span>
                    </button>

                    <button
                      onClick={() => handleDeleteNode(selectedNode.id, selectedNode.name)}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>删除</span>
                    </button>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/50 space-y-1">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">分管负责人</span>
                    <p className="text-sm font-black text-on-surface flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-primary" />
                      {selectedNode.leader || '未指派'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/50 space-y-1">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">联系电话</span>
                    <p className="text-sm font-black text-on-surface flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-outline" />
                      {selectedNode.phone || '020-8888-0000'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/50 space-y-1">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">组织分类</span>
                    <p className="text-sm font-black text-on-surface">
                      {selectedNode.type === 'company' ? '总公司/集团' :
                       selectedNode.type === 'region' ? '销售大区' :
                       selectedNode.type === 'factory' ? '制造工厂基地' :
                       selectedNode.type === 'store' ? '实体直营门店' : '业务职能部门'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/50 space-y-1">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">下辖子部门</span>
                    <p className="text-sm font-black text-on-surface">
                      {countSubNodes(selectedNode)} 个直接/间接单元
                    </p>
                  </div>
                </div>

                {/* Sub-departments & Members Tabs/Sections */}
                <div className="space-y-6">
                  {/* Department Members List */}
                  <div className="border border-outline-variant/80 rounded-3xl p-6 bg-white space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-primary rounded-full" />
                        <h4 className="text-sm font-black text-on-surface">
                          本部门在职成员 ({deptMembers.length} 人)
                        </h4>
                      </div>
                      <span className="text-xs text-outline font-medium">支持在「用户管理」中调整所属组织</span>
                    </div>

                    {deptMembers.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {deptMembers.map(member => (
                          <div key={member.id} className="p-3 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest/40 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                                {member.name.slice(0, 1)}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-black text-on-surface truncate">{member.name}</p>
                                <p className="text-[10px] text-outline font-mono truncate">{member.email}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border text-on-surface-variant shrink-0">
                              {member.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-xs text-outline font-medium">
                        当前组织下暂无分配人员
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-outline gap-3">
                <Building2 className="w-12 h-12 stroke-[1.5] opacity-40" />
                <p className="text-sm font-medium">请从左侧选择一个组织节点进行查看或管理</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= 模式二：在自定义表单中做组织的增删改查 ================= */
        <div className="flex-1 flex overflow-hidden p-8 gap-8 bg-surface-container-lowest/30">
          {/* Left: Custom Form for Org CRUD */}
          <div className="w-full max-w-xl bg-white border border-outline-variant/80 rounded-3xl p-8 flex flex-col shadow-sm overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-on-surface">
                    {formOrgId ? `表单修改：${formName}` : '表单新增组织记录'}
                  </h3>
                  <p className="text-[11px] text-outline">基于自定义表单组件填报组织实体属性</p>
                </div>
              </div>

              {formOrgId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-primary hover:underline font-bold"
                >
                  切换为新建模式
                </button>
              )}
            </div>

            <form onSubmit={handleCustomFormSubmit} className="space-y-4 flex-1">
              {/* Field 1: Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-on-surface flex items-center gap-1">
                  组织机构名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="例如：华东创新技术研发中心"
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* Field 2: Code & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface">组织代码标识</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="ORG-2026-X"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface">组织类型属性</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="dept">职能行政部门</option>
                    <option value="company">分支子公司</option>
                    <option value="region">销售与营销大区</option>
                    <option value="factory">生产制造工厂</option>
                    <option value="store">线下零售门店</option>
                    <option value="team">专项敏捷小组</option>
                  </select>
                </div>
              </div>

              {/* Field 3: Parent Organization */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-on-surface">上级挂载归属组织</label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">(作为顶级根组织)</option>
                  {flattenedOrgs
                    .filter(org => org.id !== formOrgId)
                    .map(org => (
                      <option key={org.id} value={org.id}>
                        {org.fullPath}
                      </option>
                    ))}
                </select>
              </div>

              {/* Field 4: Leader & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface">分管负责人</label>
                  <input
                    type="text"
                    value={formLeader}
                    onChange={(e) => setFormLeader(e.target.value)}
                    placeholder="输入负责人姓名"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface">联系电话</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="020-88880000"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Field 5: Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-on-surface">组织运行状态</label>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                    <input
                      type="radio"
                      name="formStatus"
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
                      name="formStatus"
                      value="Disabled"
                      checked={formStatus === 'Disabled'}
                      onChange={() => setFormStatus('Disabled')}
                      className="text-primary accent-primary"
                    />
                    <span>停用封存 (Disabled)</span>
                  </label>
                </div>
              </div>

              {/* Field 6: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-on-surface">组织职能与业务定位说明</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="请输入该组织的核心业务定位、审批职责范围等..."
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{formOrgId ? '提交保存组织变更' : '提交新增组织数据'}</span>
                </button>
                {formOrgId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-3 border border-outline-variant rounded-xl text-xs font-bold text-outline hover:text-on-surface transition-colors"
                  >
                    取消编辑
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Organizations Data Table View */}
          <div className="flex-1 bg-white border border-outline-variant/80 rounded-3xl p-6 flex flex-col shadow-sm overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-on-surface flex items-center gap-2">
                  <Table className="w-4 h-4 text-primary" />
                  组织数据台账 (支持表单联动查询与编辑)
                </h4>
                <p className="text-[11px] text-outline">点击任一条目即可将其载入左侧自定义表单进行修改或查看</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-outline font-bold">共 {flattenedOrgs.length} 条记录</span>
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-outline text-[11px] font-bold">
                    <th className="py-3 px-3">组织全称</th>
                    <th className="py-3 px-3">代码</th>
                    <th className="py-3 px-3">类型</th>
                    <th className="py-3 px-3">负责人</th>
                    <th className="py-3 px-3">状态</th>
                    <th className="py-3 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {flattenedOrgs.map(org => (
                    <tr 
                      key={org.id} 
                      onClick={() => loadIntoForm(org)}
                      className={`hover:bg-primary/5 cursor-pointer transition-colors ${
                        formOrgId === org.id ? 'bg-primary/10 font-bold' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-bold text-on-surface">{org.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-outline">{org.code || org.id}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold bg-surface border px-2 py-0.5 rounded-md text-on-surface-variant">
                          {org.type === 'company' ? '总公司' :
                           org.type === 'region' ? '销售大区' :
                           org.type === 'factory' ? '工厂基地' :
                           org.type === 'store' ? '线下门店' : '职能部门'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-on-surface">{org.leader || '未指定'}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          org.status === 'Disabled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {org.status === 'Disabled' ? '停用' : '启用'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => loadIntoForm(org)}
                            className="text-primary hover:underline text-xs font-bold"
                          >
                            表单编辑
                          </button>
                          <button
                            onClick={() => handleDeleteNode(org.id, org.name)}
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

      {/* Add Dept Modal for Tree View */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-outline-variant animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-on-surface mb-1">
              {targetParentId ? '新建子组织 / 部门' : '新建根组织'}
            </h3>
            <p className="text-xs text-outline mb-4">创建后将即时同步至系统组织树并可在自定义表单中引用</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">组织名称 *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="例如：华南精密装备事业部"
                  className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">组织代码</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="ORG-CODE"
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">分类</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none"
                  >
                    <option value="dept">职能部门</option>
                    <option value="company">分公司</option>
                    <option value="region">销售大区</option>
                    <option value="factory">生产工厂</option>
                    <option value="store">直营门店</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">分管负责人</label>
                <input
                  type="text"
                  value={formLeader}
                  onChange={(e) => setFormLeader(e.target.value)}
                  placeholder="负责人姓名"
                  className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20"
                >
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dept Modal for Tree View */}
      {isEditModalOpen && selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-outline-variant animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-on-surface mb-1">编辑组织属性</h3>
            <p className="text-xs text-outline mb-4">修改该组织单元的核心元数据与业务属性</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">组织名称 *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">组织代码</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">组织类别</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none"
                  >
                    <option value="dept">职能部门</option>
                    <option value="company">分公司</option>
                    <option value="region">销售大区</option>
                    <option value="factory">生产工厂</option>
                    <option value="store">直营门店</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">分管负责人</label>
                  <input
                    type="text"
                    value={formLeader}
                    onChange={(e) => setFormLeader(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">联系电话</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
