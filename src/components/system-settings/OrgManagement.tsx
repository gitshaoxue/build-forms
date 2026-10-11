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
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Copy,
  Settings,
  RotateCcw,
  Check,
  Eye,
  SlidersHorizontal,
  Briefcase,
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

// Flatten tree for table and selectors
interface FlatOrgNode extends OrgNode {
  level: number;
  fullPath: string;
  parentName: string;
}

const flattenOrgTree = (nodes: OrgNode[], level = 0, parentName = ''): FlatOrgNode[] => {
  let result: FlatOrgNode[] = [];
  for (const node of nodes) {
    const currentPath = parentName ? `${parentName} / ${node.name}` : node.name;
    result.push({ 
      ...node, 
      level, 
      fullPath: currentPath,
      parentName: parentName || '--'
    });
    if (node.children && node.children.length > 0) {
      result = result.concat(flattenOrgTree(node.children, level + 1, node.name));
    }
  }
  return result;
};

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

export const OrgManagement: React.FC<OrgManagementProps> = ({
  orgData,
  teamMembers,
  onAddDept,
  onUpdateDept,
  onDeleteDept,
  showNotification,
}) => {
  // Tree state
  const [treeSearch, setTreeSearch] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('all');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set(['d1', 'd-head', 'd-mkt', 'd-fac']));

  // Filter criteria in right panel
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Table selection & pagination
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal Dialog: 新增 / 编辑组织 (matching 1.2 组织管理-新增.png)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);

  // Form Fields (1.2)
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState('dept');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formIsLegalEntity, setFormIsLegalEntity] = useState(false);
  const [formStartDate, setFormStartDate] = useState('2026-10-10');
  const [formSortOrder, setFormSortOrder] = useState<number>(0);
  const [formRemarks, setFormRemarks] = useState('');

  // Detail Modal
  const [detailOrg, setDetailOrg] = useState<FlatOrgNode | null>(null);

  // Flattened organizations
  const flattenedOrgs = useMemo(() => flattenOrgTree(orgData), [orgData]);

  // Toggle tree node expansion
  const toggleNodeExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtered rows for data table
  const filteredRows = useMemo(() => {
    return flattenedOrgs.filter(item => {
      // Tree filter
      if (selectedOrgId !== 'all') {
        if (item.id !== selectedOrgId && item.parentId !== selectedOrgId) {
          // Check if item is descendant of selectedOrgId
          const isDescendant = (node: OrgNode, targetId: string): boolean => {
            if (node.id === targetId) return true;
            return (node.children || []).some(c => isDescendant(c, targetId));
          };
          const targetNode = findNodeById(orgData, selectedOrgId);
          if (!targetNode || !isDescendant(targetNode, item.id)) {
            return false;
          }
        }
      }
      // Name filter
      if (filterName.trim() && !item.name.toLowerCase().includes(filterName.trim().toLowerCase()) && !(item.code || '').toLowerCase().includes(filterName.trim().toLowerCase())) {
        return false;
      }
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) {
        return false;
      }
      // Status filter
      if (filterStatus !== 'all') {
        const isAct = item.status === 'Active';
        if (filterStatus === 'Active' && !isAct) return false;
        if (filterStatus === 'Disabled' && isAct) return false;
      }
      return true;
    });
  }, [flattenedOrgs, selectedOrgId, filterName, filterType, filterStatus, orgData]);

  // Paginated rows
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Open Create Modal
  const handleOpenCreate = (parentId?: string) => {
    setModalMode('create');
    setEditingOrgId(null);
    setFormName('');
    setFormCode(`ORG_${Date.now().toString().slice(-4)}`);
    setFormType('dept');
    setFormParentId(parentId || (selectedOrgId !== 'all' ? selectedOrgId : (flattenedOrgs[0]?.id || '')));
    setFormIsLegalEntity(false);
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormSortOrder(0);
    setFormRemarks('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (org: FlatOrgNode) => {
    setModalMode('edit');
    setEditingOrgId(org.id);
    setFormName(org.name);
    setFormCode(org.code || `ORG_${org.id}`);
    setFormType(org.type || 'dept');
    setFormParentId(org.parentId || '');
    setFormIsLegalEntity(!!org.isLegalEntity);
    setFormStartDate(org.startDate || '2026-10-10');
    setFormSortOrder(org.sortOrder || 0);
    setFormRemarks(org.remarks || org.description || '');
    setIsModalOpen(true);
  };

  // Submit Modal
  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification?.('请输入组织名称');
      return;
    }

    const payload: Partial<OrgNode> = {
      code: formCode.trim() || undefined,
      type: formType,
      isLegalEntity: formIsLegalEntity,
      startDate: formStartDate,
      sortOrder: Number(formSortOrder) || 0,
      remarks: formRemarks.trim() || undefined,
      description: formRemarks.trim() || undefined,
      status: 'Active'
    };

    if (modalMode === 'create') {
      onAddDept(formParentId || null, formName.trim(), payload);
      showNotification?.(`成功新增组织「${formName.trim()}」`);
    } else if (editingOrgId) {
      onUpdateDept(editingOrgId, formName.trim(), { ...payload, parentId: formParentId || null });
      showNotification?.(`已更新组织「${formName.trim()}」`);
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
    if (selectedIds.length === paginatedRows.length && paginatedRows.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedRows.map(r => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Batch actions
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showNotification?.('请先勾选需要删除的组织');
      return;
    }
    selectedIds.forEach(id => onDeleteDept(id));
    showNotification?.(`已批量删除选中的 ${selectedIds.length} 个组织`);
    setSelectedIds([]);
  };

  const handleBatchStatus = (targetStatus: 'Active' | 'Disabled') => {
    if (selectedIds.length === 0) {
      showNotification?.('请先勾选组织');
      return;
    }
    selectedIds.forEach(id => {
      onUpdateDept(id, '', { status: targetStatus });
    });
    showNotification?.(`已批量${targetStatus === 'Active' ? '启用' : '停用'}选中的组织`);
    setSelectedIds([]);
  };

  // Organization type label helper
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'company': return { label: '公司主体', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'dept': return { label: '职能部门', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'region': return { label: '销售大区', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'factory': return { label: '生产基地', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'store': return { label: '自营门店', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'supplier': return { label: '外部供应商', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'dealer': return { label: '经销商体系', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      default: return { label: '业务组织', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: OrgNode, level = 0) => {
    const isExpanded = expandedNodeIds.has(node.id);
    const isSelected = selectedOrgId === node.id;
    const hasChildren = node.children && node.children.length > 0;

    // Filter tree search
    if (treeSearch.trim() && !node.name.toLowerCase().includes(treeSearch.trim().toLowerCase())) {
      // If none of children match either, skip
      const matchChildren = (n: OrgNode): boolean => {
        if (n.name.toLowerCase().includes(treeSearch.trim().toLowerCase())) return true;
        return (n.children || []).some(matchChildren);
      };
      if (!matchChildren(node)) return null;
    }

    return (
      <div key={node.id} className="select-none text-xs">
        <div 
          onClick={() => setSelectedOrgId(node.id)}
          className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors group ${
            isSelected 
              ? 'bg-primary/10 text-primary font-bold' 
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          style={{ paddingLeft: `${Math.max(8, level * 16 + 6)}px` }}
        >
          <div className="flex items-center gap-1.5 truncate">
            {hasChildren ? (
              <span 
                onClick={(e) => toggleNodeExpand(node.id, e)}
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
            <Building2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
            <span className="truncate">{node.name}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); handleOpenCreate(node.id); }}
              title="添加子组织"
              className="p-1 hover:bg-white rounded text-slate-500 hover:text-primary"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex h-full bg-slate-50/50 overflow-hidden">
      {/* ================= Left Organization Tree Panel ================= */}
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
            onClick={() => setSelectedOrgId('all')}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg cursor-pointer text-xs transition-colors mb-1 ${
              selectedOrgId === 'all' 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>全部组织架构 ({flattenedOrgs.length})</span>
          </div>

          {orgData.map(node => renderTreeNode(node, 0))}
        </div>
      </div>

      {/* ================= Right Content Area ================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Top Search Filters (matching screenshot layout) */}
        <div className="p-4 border-b border-outline-variant/60 bg-white space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <input 
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="请输入组织名称"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
              />
            </div>
            <div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs bg-white text-slate-700"
              >
                <option value="all">请选择组织类型</option>
                <option value="company">公司主体</option>
                <option value="dept">职能部门</option>
                <option value="region">销售大区</option>
                <option value="factory">生产基地</option>
                <option value="store">自营门店</option>
                <option value="supplier">外部供应商</option>
                <option value="dealer">经销商体系</option>
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
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                搜索
              </button>
              <button 
                type="button"
                onClick={() => {
                  setFilterName('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setSelectedOrgId('all');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-medium rounded-lg text-xs transition-colors"
              >
                重置
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="px-6 py-3 border-b border-outline-variant/60 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <button 
              type="button"
              onClick={() => handleOpenCreate()}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              新增组织
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

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-semibold select-none">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input 
                    type="checkbox"
                    checked={selectedIds.length === paginatedRows.length && paginatedRows.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 min-w-[120px]">组织编码</th>
                <th className="px-4 py-3 min-w-[160px]">组织名称</th>
                <th className="px-4 py-3 min-w-[100px]">组织类型</th>
                <th className="px-4 py-3 min-w-[140px]">上级组织</th>
                <th className="px-4 py-3 min-w-[100px]">启用日期</th>
                <th className="px-4 py-3 min-w-[60px]">排序</th>
                <th className="px-4 py-3 min-w-[90px]">状态</th>
                <th className="px-4 py-3 min-w-[130px] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    未找到匹配的组织数据
                  </td>
                </tr>
              ) : (
                paginatedRows.map(row => {
                  const isChecked = selectedIds.includes(row.id);
                  const isAct = row.status === 'Active';
                  const typeBadge = getTypeLabel(row.type || 'dept');
                  const codeDisplay = row.code || `ORG_${row.id}`;

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
                      <td className="px-4 py-3 font-mono text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button"
                            onClick={() => handleCopy(codeDisplay, '组织编码')}
                            title="复制组织编码"
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <span>{codeDisplay}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {row.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${typeBadge.color}`}>
                          {typeBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-[150px]">
                        {row.parentName}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {row.startDate || '2026-10-10'}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {row.sortOrder ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${isAct ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className={isAct ? 'text-slate-700' : 'text-red-600'}>
                            {isAct ? '启用' : '停用'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3 font-medium">
                          <button 
                            type="button"
                            onClick={() => setDetailOrg(row)}
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
                              if (confirm(`确定删除组织「${row.name}」吗？`)) {
                                onDeleteDept(row.id);
                                showNotification?.(`已删除「${row.name}」`);
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

        {/* Pagination Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white select-none">
          <div>
            共 <span className="font-semibold text-slate-700">{filteredRows.length}</span> 条
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              &lt;
            </button>
            {[1, 2, 3].map(page => (
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
          </div>
        </div>
      </div>

      {/* ================= Modal: 新增 / 编辑组织 (Image 1.2 组织管理-新增.png) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {modalMode === 'create' ? '新增组织' : '编辑组织'}
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
              {/* 组织名称 * */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  组织名称 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    maxLength={100}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="请输入"
                    className="w-full px-3.5 py-2 pr-14 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary placeholder:text-slate-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 select-none">
                    {formName.length} / 100
                  </span>
                </div>
              </div>

              {/* 组织编号 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  组织编号
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    maxLength={20}
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="请输入"
                    className="w-full px-3.5 py-2 pr-14 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary placeholder:text-slate-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 select-none">
                    {formCode.length} / 20
                  </span>
                </div>
              </div>

              {/* 组织类型 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  组织类型
                </label>
                <select 
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-700"
                >
                  <option value="dept">职能部门</option>
                  <option value="company">公司主体</option>
                  <option value="region">销售大区</option>
                  <option value="factory">生产基地</option>
                  <option value="store">自营门店</option>
                  <option value="supplier">外部组织/供应商</option>
                  <option value="dealer">经销商体系</option>
                </select>
              </div>

              {/* 上级组织 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  上级组织
                </label>
                <select 
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary bg-white text-slate-700"
                >
                  <option value="">请选择 (无上级/顶级组织)</option>
                  {flattenedOrgs
                    .filter(org => org.id !== editingOrgId)
                    .map(org => (
                      <option key={org.id} value={org.id}>
                        {org.fullPath}
                      </option>
                    ))
                  }
                </select>
              </div>

              {/* 启用日期 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  启用日期
                </label>
                <div className="relative">
                  <input 
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary text-slate-700"
                  />
                </div>
              </div>

              {/* 排序 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  排序
                </label>
                <input 
                  type="number"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary text-slate-700"
                />
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
                  placeholder="请输入备注信息"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Modal Footer (Buttons) */}
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

      {/* ================= Detail Modal ================= */}
      {detailOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{detailOrg.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{detailOrg.code || `ORG_${detailOrg.id}`}</p>
                </div>
              </div>
              <button 
                onClick={() => setDetailOrg(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">完整层级路径</span>
                <span className="text-slate-700 font-medium text-right">{detailOrg.fullPath}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">上级组织</span>
                <span className="text-slate-700 font-medium">{detailOrg.parentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">组织类型</span>
                <span className="text-slate-700 font-medium">{getTypeLabel(detailOrg.type).label}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">启用日期</span>
                <span className="text-slate-700 font-medium">{detailOrg.startDate || '2026-10-10'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">状态</span>
                <span className={detailOrg.status === 'Active' ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                  {detailOrg.status === 'Active' ? '启用' : '停用'}
                </span>
              </div>
              {detailOrg.remarks && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">备注</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg text-slate-600">{detailOrg.remarks}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setDetailOrg(null)}
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
