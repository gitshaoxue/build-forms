import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  CheckCircle2,
  XCircle,
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
  ChevronRight,
  ChevronDown,
  Search,
  Settings,
  Calendar,
  Smartphone,
  Globe,
  SlidersHorizontal,
  ArrowLeft
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

// Preset Role Tree matching 1.5 screenshot
interface RoleTreeCategory {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

const DEFAULT_ROLE_TREE: RoleTreeCategory[] = [
  { id: 'rt-default', name: '默认初始角色' },
  { 
    id: 'rt-jyx', 
    name: '景云销',
    children: [
      { id: 'rt-jyx-1', name: '外部提案方' },
      { id: 'rt-jyx-2', name: '外部报价方 (停用)' },
      { id: 'rt-jyx-3', name: '2' }
    ]
  },
  { 
    id: 'rt-hm1', 
    name: 'hm一级角色',
    children: [
      { id: 'rt-hm1-a', name: '角色A' }
    ]
  },
  { id: 'rt-equity', name: '权益系统' },
  { id: 'rt-role-ab', name: '角色AB' },
  { 
    id: 'rt-hua', 
    name: '华角色全部权限',
    children: [
      { id: 'rt-hua-fe', name: '前端测试' }
    ]
  },
  { id: 'rt-equity-all', name: '权益全部' },
  { 
    id: 'rt-lvl1-aaa', 
    name: '一级角色AAA',
    children: [
      { id: 'rt-lvl1-base', name: '基础资料角色' },
      { id: 'rt-lvl1-hm3', name: 'hm测试用3全部' },
      { id: 'rt-lvl1-sub', name: '以及角色' }
    ]
  },
  { id: 'rt-mid-identity', name: '中台身份' },
  { id: 'rt-supplier-identity', name: '供应商身份' },
  { id: 'rt-dealer-identity', name: '经销商身份' },
  { id: 'rt-mid-identity2', name: '中台身份2' },
  { id: 'rt-logistics-identity', name: '物流服务商身份' },
  { id: 'rt-brand-identity', name: '景田品牌管理身份' },
  { id: 'rt-supply-test', name: '供应链测试角色' },
  { id: 'rt-zycs', name: 'ZYCS' },
  { id: 'rt-admin-platform', name: '平台管理员' },
  { id: 'rt-test-time', name: '测试时' },
];

// Modules list matching screenshot 1.6
const PERM_WEB_MODULES = [
  '景田送水',
  '企业知识库',
  '基础资料',
  '品牌管理',
  '供应链-订单管理',
  '供应链-订单管理-瓶水',
  '供应链-工厂管理',
  '审批中心',
  '景云销',
  '2号人事部',
  '自定义表单',
  'OA协同系统',
  '采购申请',
  '寻源管理',
  '协同办公',
  'BI 报表',
  '系统设置',
  '超级管理员'
];

// Base data scope options: 本人 | 本人及下属 | 本组织 | 本组织及子组织 | 全部
export type BaseScope = 'self' | 'self_and_sub' | 'dept' | 'dept_and_sub' | 'all';

export const BASE_SCOPE_LABELS: Record<BaseScope, string> = {
  self: '本人',
  self_and_sub: '本人及下属',
  dept: '本组织',
  dept_and_sub: '本组织及子组织',
  all: '全部'
};

// Menu items under the active module for Data Permissions (Screenshot 1.6)
interface MenuDataItem {
  id: string;
  name: string;
  module: string;
  defaultScope: BaseScope;
}

const DEFAULT_MENU_DATA_ITEMS: MenuDataItem[] = [
  { id: 'm-driver', name: '司机管理', module: '景田送水', defaultScope: 'dept' },
  { id: 'm-vehicle', name: '车辆管理', module: '景田送水', defaultScope: 'dept' },
  { id: 'm-log-order', name: '物流订单', module: '景田送水', defaultScope: 'dept' },
  { id: 'm-log-task', name: '物流任务单', module: '景田送水', defaultScope: 'dept' },
  { id: 'm-pallet-apply', name: '回托申请', module: '景田送水', defaultScope: 'dept' },
  { id: 'm-pallet-task', name: '回托物流任务单', module: '景田送水', defaultScope: 'dept' },
  { id: 'm-water-order', name: '桶水订单配送', module: '景田送水', defaultScope: 'dept' },
  { id: 'm-dealer-stock', name: '经销商水站库存', module: '景田送水', defaultScope: 'all' },
  { id: 'm-bottle-apply', name: '瓶装水调拨单', module: '供应链-订单管理-瓶水', defaultScope: 'dept' },
  { id: 'm-factory-sched', name: '工厂排产计划', module: '供应链-工厂管理', defaultScope: 'all' },
];

export type FieldPermMode = 'hidden' | 'readonly' | 'edit';

interface FieldPermItem {
  id: string;
  name: string;
  code: string;
  defaultPerm: FieldPermMode;
}

const DEFAULT_FIELD_PERM_ITEMS: FieldPermItem[] = [
  { id: 'f_customer_name', name: '客户姓名/企业名称', code: 'customer_name', defaultPerm: 'edit' },
  { id: 'f_contact_phone', name: '客户联系电话', code: 'contact_phone', defaultPerm: 'readonly' },
  { id: 'f_unit_price', name: '订单结算单价', code: 'unit_price', defaultPerm: 'hidden' },
  { id: 'f_delivery_addr', name: '物流收货地址', code: 'delivery_address', defaultPerm: 'edit' },
  { id: 'f_id_card', name: '客户身份证号', code: 'id_card_no', defaultPerm: 'hidden' },
  { id: 'f_bank_account', name: '银行对公账户', code: 'bank_account', defaultPerm: 'readonly' },
  { id: 'f_contract_amount', name: '签约合同总金额', code: 'contract_amount', defaultPerm: 'hidden' },
  { id: 'f_discount_rate', name: '批价折扣比率', code: 'discount_rate', defaultPerm: 'readonly' },
];

const DEFAULT_BUTTON_PERMS = [
  '数据新增',
  '数据编辑',
  '数据删除',
  '数据批量删除',
  '数据导出',
  '数据导入',
  '启用停用',
  '重置密码'
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
  // Tree state
  const [treeSearch, setTreeSearch] = useState('');
  const [selectedTreeCategory, setSelectedTreeCategory] = useState<string>('all');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['rt-jyx', 'rt-lvl1-aaa', 'rt-hua']));

  // Multi-Filter Inputs (matching 1.5)
  const [filterRoleName, setFilterRoleName] = useState('');
  const [filterParentRole, setFilterParentRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Table selection & pagination
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // View Mode: 'list' (Image 1.5) or 'config' (Image 1.6 角色管理-数据权限.png)
  const [viewMode, setViewMode] = useState<'list' | 'config'>('list');
  const [configMode, setConfigMode] = useState<'create' | 'edit'>('edit');
  const [activeConfigRoleId, setActiveConfigRoleId] = useState<string>(roles[0]?.id || 'r_supplier');

  // Role Form state for 基本信息
  const [roleFormName, setRoleFormName] = useState('');
  const [roleFormCode, setRoleFormCode] = useState('');
  const [roleFormParent, setRoleFormParent] = useState('--');
  const [roleFormDesc, setRoleFormDesc] = useState('');

  // Permission Config State (Image 1.6)
  const [permTopTab, setPermTopTab] = useState<'baseInfo' | 'webPerm' | 'appPerm'>('webPerm');
  const [activeModule, setActiveModule] = useState<string>('景田送水');
  const [activePermSubTab, setActivePermSubTab] = useState<'field' | 'button' | 'data'>('data');
  const [menuSearch, setMenuSearch] = useState('');
  const [batchActionOpen, setBatchActionOpen] = useState(false);

  // In-memory data scope config per role: roleId -> (menuId -> BaseScope)
  const [menuScopeMap, setMenuScopeMap] = useState<Record<string, Record<string, BaseScope>>>({
    r_supplier: {
      'm-driver': 'dept',
      'm-vehicle': 'dept',
      'm-log-order': 'dept',
      'm-log-task': 'dept',
      'm-pallet-apply': 'dept',
      'm-pallet-task': 'dept',
    }
  });

  // Field permissions state (互斥：隐藏 / 只读 / 编辑)
  const [fieldPerms, setFieldPerms] = useState<Record<string, FieldPermMode>>({
    f_customer_name: 'edit',
    f_contact_phone: 'readonly',
    f_unit_price: 'hidden',
    f_delivery_addr: 'edit',
    f_id_card: 'hidden',
    f_bank_account: 'readonly',
    f_contract_amount: 'hidden',
    f_discount_rate: 'readonly',
  });

  // Button permissions state (包含最前面“全部”)
  const [buttonPerms, setButtonPerms] = useState<Record<string, boolean>>({
    '数据新增': true,
    '数据编辑': true,
    '数据删除': false,
    '数据批量删除': false,
    '数据导出': true,
    '数据导入': false,
    '启用停用': true,
    '重置密码': true,
  });

  // Enriched sample roles matching 1.5 screenshot
  const allRoles = useMemo(() => {
    const presetRoleList: RoleDefinition[] = [
      {
        id: 'r_supplier',
        name: '王晓红_供应商角色',
        code: 'ROLE_SUPPLIER_WXH',
        desc: '供应商外部协作角色，管控所属阳江及配送数据权限',
        isSystem: false,
        parentRoleId: '--',
        parentRoleName: '--',
        appSystem: '供应商',
        status: 'Active',
        creator: '超级管理员',
        createdAt: '2026-03-12',
        menus: { dashboard: true, projects: true, workflow: true },
        forms: {},
        operations: { create: true, edit: true, delete: false, enable: true, disable: false, export: true, batchDelete: false, importData: false },
        orgScope: 'dept_sub',
        tagControl: { enabled: true, matchMode: 'any', byChargeDepts: true, bySalesRegions: false, byFactories: false, byStores: false },
        fieldPermissions: {}
      },
      {
        id: 'r_driver',
        name: '王晓红_叉车司机',
        code: 'ROLE_FORKLIFT_WXH',
        desc: '厂区智能叉车装卸与调度终端填报权限',
        isSystem: false,
        parentRoleId: '--',
        parentRoleName: '--',
        appSystem: '景田',
        status: 'Active',
        creator: '超级管理员',
        createdAt: '2026-03-15',
        menus: { dashboard: true, workflow: true },
        forms: {},
        operations: { create: true, edit: false, delete: false, enable: false, disable: false, export: false, batchDelete: false, importData: false },
        orgScope: 'self',
        tagControl: { enabled: false, matchMode: 'any', byChargeDepts: false, bySalesRegions: false, byFactories: true, byStores: false },
        fieldPermissions: {}
      },
      {
        id: 'r_security',
        name: '王晓红_保安',
        code: 'ROLE_SECURITY_WXH',
        desc: '大门放行与扫码核销岗',
        isSystem: false,
        parentRoleId: '--',
        parentRoleName: '--',
        appSystem: '景田',
        status: 'Active',
        creator: '超级管理员',
        createdAt: '2026-03-18',
        menus: { dashboard: true },
        forms: {},
        operations: { create: true, edit: false, delete: false, enable: false, disable: false, export: false, batchDelete: false, importData: false },
        orgScope: 'self',
        tagControl: { enabled: false, matchMode: 'any', byChargeDepts: false, bySalesRegions: false, byFactories: false, byStores: false },
        fieldPermissions: {}
      },
      {
        id: 'r_test_xk',
        name: 'Test-xk-测试角色',
        code: 'ROLE_TEST_XK',
        desc: '自动化测试沙盒角色',
        isSystem: false,
        parentRoleId: '--',
        parentRoleName: '--',
        appSystem: '经销商',
        status: 'Active',
        creator: '超级管理员',
        createdAt: '2026-04-01',
        menus: { dashboard: true, projects: true },
        forms: {},
        operations: { create: true, edit: true, delete: true, enable: true, disable: true, export: true, batchDelete: true, importData: true },
        orgScope: 'dept',
        tagControl: { enabled: false, matchMode: 'any', byChargeDepts: false, bySalesRegions: false, byFactories: false, byStores: false },
        fieldPermissions: {}
      },
      {
        id: 'r_dealer',
        name: '王晓红_经销商角色',
        code: 'ROLE_DEALER_WXH',
        desc: '水站与分销商日常订货及销售管理',
        isSystem: false,
        parentRoleId: '--',
        parentRoleName: '--',
        appSystem: '经销商',
        status: 'Active',
        creator: '超级管理员',
        createdAt: '2026-04-05',
        menus: { dashboard: true, projects: true },
        forms: {},
        operations: { create: true, edit: true, delete: false, enable: true, disable: false, export: true, batchDelete: false, importData: false },
        orgScope: 'dept_sub',
        tagControl: { enabled: true, matchMode: 'any', byChargeDepts: true, bySalesRegions: true, byFactories: false, byStores: true },
        fieldPermissions: {}
      },
      {
        id: 'r_h11',
        name: 'H角色11',
        code: 'ROLE_H11',
        desc: '二级业务承运管理角色',
        isSystem: false,
        parentRoleId: 'r_h8',
        parentRoleName: 'H角色8',
        appSystem: '景田',
        status: 'Disabled',
        creator: '超级管理员',
        createdAt: '2026-04-10',
        menus: { dashboard: true },
        forms: {},
        operations: { create: false, edit: false, delete: false, enable: false, disable: false, export: false, batchDelete: false, importData: false },
        orgScope: 'self',
        tagControl: { enabled: false, matchMode: 'any', byChargeDepts: false, bySalesRegions: false, byFactories: false, byStores: false },
        fieldPermissions: {}
      },
      {
        id: 'r_orange',
        name: '没声明的橘色',
        code: 'ROLE_ORANGE',
        desc: '临时测试预设组',
        isSystem: false,
        parentRoleId: '--',
        parentRoleName: '--',
        appSystem: '景田',
        status: 'Active',
        creator: '超级管理员',
        createdAt: '2026-04-12',
        menus: { dashboard: true },
        forms: {},
        operations: { create: true, edit: false, delete: false, enable: true, disable: false, export: false, batchDelete: false, importData: false },
        orgScope: 'self',
        tagControl: { enabled: false, matchMode: 'any', byChargeDepts: false, bySalesRegions: false, byFactories: false, byStores: false },
        fieldPermissions: {}
      },
      {
        id: 'r_yf_worker',
        name: 'YF-桶水工厂员工',
        code: 'ROLE_YF_FACTORY',
        desc: '阳江桶水灌装产线日常巡检与品质填报',
        isSystem: false,
        parentRoleId: 'r_yf_chain',
        parentRoleName: 'yf-中台供应链测试...',
        appSystem: '景田',
        status: 'Active',
        creator: 'YF-中台管理',
        createdAt: '2026-04-15',
        menus: { dashboard: true, workflow: true },
        forms: {},
        operations: { create: true, edit: true, delete: false, enable: true, disable: false, export: false, batchDelete: false, importData: false },
        orgScope: 'dept',
        tagControl: { enabled: true, matchMode: 'any', byChargeDepts: false, bySalesRegions: false, byFactories: true, byStores: false },
        fieldPermissions: {}
      },
      {
        id: 'r_rc',
        name: '饶翠的角色',
        code: 'ROLE_RAOCUI',
        desc: '基础资料与商品主数据审核员',
        isSystem: false,
        parentRoleId: 'r_init',
        parentRoleName: '默认初始角色',
        appSystem: '景田',
        status: 'Active',
        creator: '超级管理员',
        createdAt: '2026-04-18',
        menus: { dashboard: true, projects: true, dataManagement: true },
        forms: {},
        operations: { create: true, edit: true, delete: false, enable: true, disable: false, export: true, batchDelete: false, importData: true },
        orgScope: 'dept_sub',
        tagControl: { enabled: false, matchMode: 'any', byChargeDepts: false, bySalesRegions: false, byFactories: false, byStores: false },
        fieldPermissions: {}
      },
      {
        id: 'r_sourcing',
        name: '寻源管理员-bb-p',
        code: 'ROLE_SOURCING',
        desc: '大宗原辅料招标与寻源竞价管理',
        isSystem: false,
        parentRoleId: '--',
        parentRoleName: '--',
        appSystem: '景田',
        status: 'Active',
        creator: '超级管理员',
        createdAt: '2026-04-20',
        menus: { dashboard: true, projects: true },
        forms: {},
        operations: { create: true, edit: true, delete: false, enable: true, disable: false, export: true, batchDelete: false, importData: false },
        orgScope: 'all',
        tagControl: { enabled: false, matchMode: 'any', byChargeDepts: false, bySalesRegions: false, byFactories: false, byStores: false },
        fieldPermissions: {}
      }
    ];

    // Merge roles passed from parent state
    const merged = [...presetRoleList];
    roles.forEach(existing => {
      if (!merged.some(m => m.id === existing.id || m.name === existing.name)) {
        merged.push({
          ...existing,
          parentRoleName: existing.parentRoleName || '--',
          appSystem: existing.appSystem || '集团',
          status: existing.status || 'Active',
          creator: existing.creator || '超级管理员',
        });
      }
    });
    return merged;
  }, [roles]);

  // Filtered rows for data table
  const filteredRoles = useMemo(() => {
    return allRoles.filter(r => {
      if (selectedTreeCategory !== 'all') {
        if (!r.name.includes(selectedTreeCategory) && !(r.appSystem || '').includes(selectedTreeCategory)) {
          // allow partial
        }
      }
      if (filterRoleName.trim()) {
        const val = filterRoleName.trim().toLowerCase();
        if (!r.name.toLowerCase().includes(val) && !r.code.toLowerCase().includes(val)) return false;
      }
      if (filterParentRole !== 'all') {
        if ((r.parentRoleName || '--') !== filterParentRole) return false;
      }
      if (filterStatus !== 'all') {
        if ((r.status || 'Active') !== filterStatus) return false;
      }
      return true;
    });
  }, [allRoles, selectedTreeCategory, filterRoleName, filterParentRole, filterStatus]);

  // Paginated rows
  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRoles.slice(start, start + pageSize);
  }, [filteredRoles, currentPage, pageSize]);

  // Current active role for configuration
  const currentConfigRole = useMemo(() => {
    return allRoles.find(r => r.id === activeConfigRoleId) || allRoles[0];
  }, [allRoles, activeConfigRoleId]);

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

  // Selection toggle
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedRoles.length && paginatedRoles.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedRoles.map(r => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Batch actions on table
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      showNotification?.('请先勾选需要删除的角色');
      return;
    }
    setRoles(prev => prev.filter(r => !selectedIds.includes(r.id)));
    showNotification?.(`已删除选中的 ${selectedIds.length} 个角色`);
    setSelectedIds([]);
  };

  const handleBatchStatus = (st: 'Active' | 'Disabled') => {
    if (selectedIds.length === 0) {
      showNotification?.('请先勾选角色');
      return;
    }
    setRoles(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: st } : r));
    showNotification?.(`已批量${st === 'Active' ? '启用' : '停用'}选中的角色`);
    setSelectedIds([]);
  };

  // Open Create Role View (same 3-tab interaction as edit)
  const handleOpenCreate = () => {
    setConfigMode('create');
    setRoleFormName('');
    setRoleFormCode(`ROLE_${Date.now().toString().slice(-4)}`);
    setRoleFormParent('--');
    setRoleFormDesc('');
    setPermTopTab('baseInfo');
    setActiveModule('景田送水');
    setActivePermSubTab('data');
    setViewMode('config');
  };

  // Open Edit / Detail Role View
  const handleOpenEdit = (role: RoleDefinition) => {
    setConfigMode('edit');
    setActiveConfigRoleId(role.id);
    setRoleFormName(role.name);
    setRoleFormCode(role.code || `ROLE_${Date.now().toString().slice(-4)}`);
    setRoleFormParent(role.parentRoleName || '--');
    setRoleFormDesc(role.desc || '');
    setPermTopTab('baseInfo');
    setActiveModule('景田送水');
    setActivePermSubTab('data');
    setViewMode('config');
  };

  // Data scope change for a menu row in 基础权限
  const handleScopeChange = (menuId: string, scope: BaseScope) => {
    setMenuScopeMap(prev => ({
      ...prev,
      [activeConfigRoleId]: {
        ...(prev[activeConfigRoleId] || {}),
        [menuId]: scope
      }
    }));
  };

  // Batch scope change for all menus in current module
  const handleBatchSetScope = (scope: BaseScope) => {
    const updatedForRole = { ...(menuScopeMap[activeConfigRoleId] || {}) };
    DEFAULT_MENU_DATA_ITEMS.forEach(item => {
      updatedForRole[item.id] = scope;
    });
    setMenuScopeMap(prev => ({
      ...prev,
      [activeConfigRoleId]: updatedForRole
    }));
    setBatchActionOpen(false);
    showNotification?.(`已批量将当前模块菜单基础权限设为「${BASE_SCOPE_LABELS[scope]}」`);
  };

  // Button permissions helper
  const isAllButtonsChecked = useMemo(() => {
    return DEFAULT_BUTTON_PERMS.every(b => !!buttonPerms[b]);
  }, [buttonPerms]);

  const handleToggleAllButtons = () => {
    const nextVal = !isAllButtonsChecked;
    const updated: Record<string, boolean> = {};
    DEFAULT_BUTTON_PERMS.forEach(b => {
      updated[b] = nextVal;
    });
    setButtonPerms(updated);
  };

  const handleToggleButton = (btnName: string) => {
    setButtonPerms(prev => ({
      ...prev,
      [btnName]: !prev[btnName]
    }));
  };

  // Save Config View (handles both create and edit)
  const handleSaveConfig = () => {
    if (!roleFormName.trim()) {
      showNotification?.('请输入角色名称');
      setPermTopTab('baseInfo');
      return;
    }

    if (configMode === 'create') {
      const newRole: RoleDefinition = {
        id: `role_${Date.now()}`,
        name: roleFormName.trim(),
        code: roleFormCode.trim() || `ROLE_${Date.now().toString().slice(-4)}`,
        desc: roleFormDesc.trim() || '自定义角色体系',
        isSystem: false,
        parentRoleId: roleFormParent,
        parentRoleName: roleFormParent,
        appSystem: '景田',
        status: 'Active',
        creator: '当前用户',
        createdAt: new Date().toISOString().split('T')[0],
        menus: { dashboard: true, projects: true },
        forms: {},
        operations: { create: true, edit: true, delete: false, enable: true, disable: false, export: true, batchDelete: false, importData: false },
        orgScope: 'dept_sub',
        tagControl: { enabled: false, matchMode: 'any', byChargeDepts: false, bySalesRegions: false, byFactories: false, byStores: false },
        fieldPermissions: {}
      };

      setRoles(prev => [newRole, ...prev]);
      showNotification?.(`成功新增角色「${newRole.name}」`);
    } else {
      setRoles(prev => prev.map(r => r.id === activeConfigRoleId ? {
        ...r,
        name: roleFormName.trim(),
        code: roleFormCode.trim() || r.code,
        parentRoleName: roleFormParent,
        desc: roleFormDesc.trim()
      } : r));
      showNotification?.(`已成功保存角色「${roleFormName.trim()}」的配置方案`);
    }

    setViewMode('list');
  };

  // Filter menu items in current module (Image 1.6)
  const currentModuleMenus = useMemo(() => {
    return DEFAULT_MENU_DATA_ITEMS.filter(m => {
      if (activeModule && m.module !== activeModule && activeModule === '景田送水') {
        return m.module === '景田送水';
      }
      if (menuSearch.trim() && !m.name.includes(menuSearch.trim())) return false;
      return true;
    });
  }, [activeModule, menuSearch]);

  // ================= VIEW 2: 角色管理 - 权限配置视图 (Image 1.6) =================
  if (viewMode === 'config') {
    return (
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs">
        {/* Top Header Tabs (Matching 1.6 screenshot) */}
        <div className="px-6 pt-3 pb-0 border-b border-slate-200 flex items-center justify-between bg-white select-none">
          <div className="flex items-center gap-6">
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 pb-3 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              返回角色列表
            </button>

            <div className="flex items-center gap-8">
              <button 
                type="button"
                onClick={() => setPermTopTab('baseInfo')}
                className={`pb-3 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
                  permTopTab === 'baseInfo' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                基本信息
              </button>

              <button 
                type="button"
                onClick={() => setPermTopTab('webPerm')}
                className={`pb-3 font-semibold text-xs border-b-2 transition-all flex items-center gap-1 cursor-pointer ${
                  permTopTab === 'webPerm' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-red-500">*</span>
                WEB权限配置
              </button>

              <button 
                type="button"
                onClick={() => setPermTopTab('appPerm')}
                className={`pb-3 font-semibold text-xs border-b-2 transition-all flex items-center gap-1 cursor-pointer ${
                  permTopTab === 'appPerm' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-red-500">*</span>
                App权限配置
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-3 text-slate-500">
            {configMode === 'create' ? (
              <>
                <span>当前操作：</span>
                <span className="font-bold text-primary px-2.5 py-0.5 bg-primary/10 rounded-full text-xs">新增角色</span>
              </>
            ) : (
              <>
                <span>当前角色：</span>
                <span className="font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded text-xs">{roleFormName || currentConfigRole.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Tab 1: 基本信息 */}
        {permTopTab === 'baseInfo' && (
          <div className="flex-1 overflow-auto p-8 max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                角色名称 <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={roleFormName} 
                onChange={(e) => setRoleFormName(e.target.value)}
                placeholder="请输入角色名称 (如：王晓红_调度员)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">角色编码</label>
              <input 
                type="text" 
                value={roleFormCode} 
                onChange={(e) => setRoleFormCode(e.target.value)}
                placeholder="如：ROLE_DISPATCHER"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs font-mono focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">上级角色</label>
              <select 
                value={roleFormParent} 
                onChange={(e) => setRoleFormParent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:outline-none focus:border-primary"
              >
                <option value="--">-- (无上级角色)</option>
                <option value="默认初始角色">默认初始角色</option>
                <option value="H角色8">H角色8</option>
                <option value="yf-中台供应链测试...">yf-中台供应链测试...</option>
                {allRoles
                  .filter(r => r.name !== roleFormName)
                  .map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))
                }
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">角色描述</label>
              <textarea 
                rows={3} 
                value={roleFormDesc} 
                onChange={(e) => setRoleFormDesc(e.target.value)}
                placeholder="请输入该角色业务职责描述"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs resize-none focus:outline-none focus:border-primary" 
              />
            </div>
          </div>
        )}

        {/* Tab 2: * WEB权限配置 (Exactly matching 1.6 screenshot) */}
        {permTopTab === 'webPerm' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left module list (Screenshot 1.6) */}
            <div className="w-56 bg-slate-50/70 border-r border-slate-200 flex flex-col shrink-0 p-3 overflow-y-auto space-y-0.5">
              {PERM_WEB_MODULES.map(modName => {
                const isActive = activeModule === modName;
                return (
                  <button
                    key={modName}
                    type="button"
                    onClick={() => setActiveModule(modName)}
                    className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50 text-primary font-bold' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {modName}
                  </button>
                );
              })}
            </div>

            {/* Right Sub-Tabs & Permissions */}
            <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
              {/* Sub-tabs: 字段权限 / 按钮权限 / 数据权限 */}
              <div className="px-6 pt-3 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-6">
                  <button 
                    type="button"
                    onClick={() => setActivePermSubTab('field')}
                    className={`pb-2.5 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
                      activePermSubTab === 'field' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    字段权限
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActivePermSubTab('button')}
                    className={`pb-2.5 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
                      activePermSubTab === 'button' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    按钮权限
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActivePermSubTab('data')}
                    className={`pb-2.5 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
                      activePermSubTab === 'data' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    数据权限
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: 字段权限 (保留字段名称/字段标识，移除列权限规则，添加隐藏/只读/编辑三列互斥) */}
              {activePermSubTab === 'field' && (
                <div className="flex-1 overflow-auto p-6 space-y-4">
                  <div className="bg-blue-50/60 p-3 rounded-lg text-slate-600 text-xs flex items-center justify-between">
                    <span>配置当前模块表单中各个敏感字段（如手机号、金额、身份证等）的列级权限。</span>
                    <span className="text-slate-400 text-[11px]">隐藏、只读、编辑三项互斥</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold select-none">
                        <tr>
                          <th className="px-5 py-3 min-w-[160px]">字段名称</th>
                          <th className="px-5 py-3 min-w-[140px]">字段标识</th>
                          <th className="px-5 py-3 w-28 text-center">隐藏</th>
                          <th className="px-5 py-3 w-28 text-center">只读</th>
                          <th className="px-5 py-3 w-28 text-center">编辑</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {DEFAULT_FIELD_PERM_ITEMS.map(field => {
                          const currentPerm = fieldPerms[field.id] || field.defaultPerm;
                          return (
                            <tr key={field.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-5 py-3 font-medium text-slate-900">
                                {field.name}
                              </td>
                              <td className="px-5 py-3 text-slate-500 font-mono text-xs">
                                {field.code}
                              </td>
                              <td className="px-5 py-3 text-center">
                                <label className="inline-flex items-center justify-center cursor-pointer p-1">
                                  <input 
                                    type="radio"
                                    name={`field_perm_${field.id}`}
                                    checked={currentPerm === 'hidden'}
                                    onChange={() => setFieldPerms(prev => ({ ...prev, [field.id]: 'hidden' }))}
                                    className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                                  />
                                </label>
                              </td>
                              <td className="px-5 py-3 text-center">
                                <label className="inline-flex items-center justify-center cursor-pointer p-1">
                                  <input 
                                    type="radio"
                                    name={`field_perm_${field.id}`}
                                    checked={currentPerm === 'readonly'}
                                    onChange={() => setFieldPerms(prev => ({ ...prev, [field.id]: 'readonly' }))}
                                    className="w-4 h-4 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                  />
                                </label>
                              </td>
                              <td className="px-5 py-3 text-center">
                                <label className="inline-flex items-center justify-center cursor-pointer p-1">
                                  <input 
                                    type="radio"
                                    name={`field_perm_${field.id}`}
                                    checked={currentPerm === 'edit'}
                                    onChange={() => setFieldPerms(prev => ({ ...prev, [field.id]: 'edit' }))}
                                    className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                                  />
                                </label>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: 按钮权限 (最前面添加“全部”选项) */}
              {activePermSubTab === 'button' && (
                <div className="flex-1 overflow-auto p-6 space-y-4">
                  <div className="bg-slate-50 p-3 rounded-lg text-slate-600 text-xs">
                    配置当前角色在系统各个业务界面的操作按钮权限，可一键全选或单独配置。
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* 最前面添加一个“全部”选项 */}
                    <div 
                      onClick={handleToggleAllButtons}
                      className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isAllButtonsChecked ? 'border-primary bg-primary/5 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-900 text-xs">全部</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">一键授予所有按钮权限</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isAllButtonsChecked} 
                        onChange={handleToggleAllButtons}
                        className="w-4 h-4 text-primary rounded cursor-pointer" 
                      />
                    </div>

                    {DEFAULT_BUTTON_PERMS.map(btnName => {
                      const isChecked = !!buttonPerms[btnName];
                      return (
                        <div 
                          key={btnName} 
                          onClick={() => handleToggleButton(btnName)}
                          className={`p-3.5 border rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${
                            isChecked ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50/50'
                          }`}
                        >
                          <span className="font-medium text-slate-700 text-xs">{btnName}</span>
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => handleToggleButton(btnName)}
                            className="w-4 h-4 text-primary rounded cursor-pointer" 
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: 数据权限 (表头: 菜单、基础权限、自定义权限; 权限项: 本人、本人及下属、本组织、本组织及子组织、全部) */}
              {activePermSubTab === 'data' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Search and Batch Actions Bar */}
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="relative w-72">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        placeholder="搜索菜单"
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setBatchActionOpen(!batchActionOpen)}
                        className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs text-slate-700 flex items-center gap-1.5 font-medium cursor-pointer"
                      >
                        批量操作
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {batchActionOpen && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs">
                          <button 
                            type="button"
                            onClick={() => handleBatchSetScope('self')}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                          >
                            批量设为「本人」
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleBatchSetScope('self_and_sub')}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                          >
                            批量设为「本人及下属」
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleBatchSetScope('dept')}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                          >
                            批量设为「本组织」
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleBatchSetScope('dept_and_sub')}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                          >
                            批量设为「本组织及子组织」
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleBatchSetScope('all')}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                          >
                            批量设为「全部」
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Data Permissions Table (菜单 / 基础权限 / 自定义权限) */}
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-semibold select-none">
                        <tr>
                          <th className="px-6 py-3 min-w-[160px]">菜单</th>
                          <th className="px-6 py-3 min-w-[500px]">基础权限</th>
                          <th className="px-6 py-3 min-w-[140px]">自定义权限</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {currentModuleMenus.map(m => {
                          const currentScope = (menuScopeMap[activeConfigRoleId] || {})[m.id] || m.defaultScope;

                          return (
                            <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-3.5 font-medium text-slate-900">
                                {m.name}
                              </td>
                              <td className="px-6 py-3.5">
                                <div className="flex items-center gap-5 flex-wrap">
                                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input 
                                      type="radio"
                                      name={`scope_${m.id}`}
                                      checked={currentScope === 'self'}
                                      onChange={() => handleScopeChange(m.id, 'self')}
                                      className="w-3.5 h-3.5 text-primary focus:ring-primary"
                                    />
                                    <span>本人</span>
                                  </label>
                                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input 
                                      type="radio"
                                      name={`scope_${m.id}`}
                                      checked={currentScope === 'self_and_sub'}
                                      onChange={() => handleScopeChange(m.id, 'self_and_sub')}
                                      className="w-3.5 h-3.5 text-primary focus:ring-primary"
                                    />
                                    <span>本人及下属</span>
                                  </label>
                                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input 
                                      type="radio"
                                      name={`scope_${m.id}`}
                                      checked={currentScope === 'dept'}
                                      onChange={() => handleScopeChange(m.id, 'dept')}
                                      className="w-3.5 h-3.5 text-primary focus:ring-primary"
                                    />
                                    <span>本组织</span>
                                  </label>
                                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input 
                                      type="radio"
                                      name={`scope_${m.id}`}
                                      checked={currentScope === 'dept_and_sub'}
                                      onChange={() => handleScopeChange(m.id, 'dept_and_sub')}
                                      className="w-3.5 h-3.5 text-primary focus:ring-primary"
                                    />
                                    <span>本组织及子组织</span>
                                  </label>
                                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input 
                                      type="radio"
                                      name={`scope_${m.id}`}
                                      checked={currentScope === 'all'}
                                      onChange={() => handleScopeChange(m.id, 'all')}
                                      className="w-3.5 h-3.5 text-primary focus:ring-primary"
                                    />
                                    <span>全部</span>
                                  </label>
                                </div>
                              </td>
                              <td className="px-6 py-3.5">
                                <button 
                                  type="button"
                                  onClick={() => showNotification?.(`已打开「${m.name}」扩展行级规则配置`)}
                                  className="text-primary hover:underline cursor-pointer"
                                >
                                  自定义过滤规则
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: * App权限配置 */}
        {permTopTab === 'appPerm' && (
          <div className="flex-1 overflow-auto p-8 max-w-2xl space-y-4">
            <h4 className="font-bold text-slate-800 text-sm">移动端专属行为权限</h4>
            <div className="space-y-3">
              {[
                { name: '移动端扫码核销', desc: '允许在移动端 App / 微信小程序调用摄像头扫码验货' },
                { name: '移动端离线数据缓存', desc: '允许在弱网环境下将表单暂存至本地客户端设备' },
                { name: '移动端即时位置上报', desc: '提交送水或叉车调度任务时自动记录地理经纬度' }
              ].map(item => (
                <div key={item.name} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-slate-900">{item.name}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Footer Buttons (Matching 1.6 screenshot) */}
        <div className="px-8 py-3.5 border-t border-slate-200 flex items-center justify-end gap-3 bg-white">
          <button 
            type="button"
            onClick={() => setViewMode('list')}
            className="px-5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            取消
          </button>
          <button 
            type="button"
            onClick={handleSaveConfig}
            className="px-6 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            确定
          </button>
        </div>
      </div>
    );
  }

  // ================= VIEW 1: 角色管理 - 列表视图 (Matching Image 1.5) =================
  return (
    <div className="flex-1 flex h-full bg-slate-50/50 overflow-hidden text-xs">
      {/* ================= Left Tree Panel (Matching 1.5) ================= */}
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
            onClick={() => setSelectedTreeCategory('all')}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg cursor-pointer text-xs transition-colors mb-1 ${
              selectedTreeCategory === 'all' 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>全部系统角色</span>
          </div>

          {DEFAULT_ROLE_TREE.map(cat => {
            const hasChildren = cat.children && cat.children.length > 0;
            const isExpanded = expandedNodes.has(cat.id);
            const isSelected = selectedTreeCategory === cat.name;

            if (treeSearch.trim() && !cat.name.toLowerCase().includes(treeSearch.trim().toLowerCase())) {
              const matchChild = (cat.children || []).some(c => c.name.toLowerCase().includes(treeSearch.trim().toLowerCase()));
              if (!matchChild) return null;
            }

            return (
              <div key={cat.id} className="select-none text-xs">
                <div 
                  onClick={() => setSelectedTreeCategory(cat.name)}
                  className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {hasChildren ? (
                    <span 
                      onClick={(e) => toggleTreeExpand(cat.id, e)}
                      className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                  ) : (
                    <span className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{cat.name}</span>
                </div>

                {hasChildren && isExpanded && (
                  <div className="space-y-0.5 pl-4">
                    {cat.children!.map(child => (
                      <div 
                        key={child.id}
                        onClick={() => setSelectedTreeCategory(child.name)}
                        className={`py-1 px-2.5 rounded cursor-pointer transition-colors truncate ${
                          selectedTreeCategory === child.name ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        {child.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= Right Content Panel ================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Top Multi-Filter Search Area (2 rows matching screenshot 1.5) */}
        <div className="p-4 border-b border-outline-variant/60 bg-white space-y-3">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <input 
                type="text"
                value={filterRoleName}
                onChange={(e) => setFilterRoleName(e.target.value)}
                placeholder="请输入角色名称"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
              />
            </div>
            <div>
              <select 
                value={filterParentRole}
                onChange={(e) => setFilterParentRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs bg-white text-slate-700"
              >
                <option value="all">请选择上级角色</option>
                <option value="--">-- (无上级角色)</option>
                <option value="H角色8">H角色8</option>
                <option value="yf-中台供应链测试...">yf-中台供应链测试...</option>
                <option value="默认初始角色">默认初始角色</option>
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
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs items-center">
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5 bg-white">
              <input 
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                placeholder="开始日期"
                className="text-xs text-slate-600 focus:outline-none w-1/2 bg-transparent"
              />
              <span className="text-slate-400">至</span>
              <input 
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                placeholder="结束日期"
                className="text-xs text-slate-600 focus:outline-none w-1/2 bg-transparent"
              />
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
                  setFilterRoleName('');
                  setFilterParentRole('all');
                  setFilterStatus('all');
                  setFilterStartDate('');
                  setFilterEndDate('');
                  setSelectedTreeCategory('all');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-medium rounded-lg text-xs transition-colors"
              >
                重置
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Row (matching 1.5) */}
        <div className="px-6 py-3 border-b border-outline-variant/60 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <button 
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
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

        {/* Data Table (matching columns and status in 1.5) */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-semibold select-none">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input 
                    type="checkbox"
                    checked={selectedIds.length === paginatedRoles.length && paginatedRoles.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 min-w-[180px]">角色名称</th>
                <th className="px-4 py-3 min-w-[140px]">上级角色</th>
                <th className="px-4 py-3 min-w-[90px]">状态</th>
                <th className="px-4 py-3 min-w-[120px]">创建人</th>
                <th className="px-4 py-3 min-w-[140px] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedRoles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    未找到匹配的角色数据
                  </td>
                </tr>
              ) : (
                paginatedRoles.map(row => {
                  const isChecked = selectedIds.includes(row.id);
                  const isAct = (row.status || 'Active') === 'Active';

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
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {row.name}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {row.parentRoleName || '--'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${isAct ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className={isAct ? 'text-slate-700' : 'text-red-600'}>
                            {isAct ? '启用' : '停用'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {row.creator || '超级管理员'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3 font-medium">
                          <button 
                            type="button"
                            onClick={() => handleOpenEdit(row)}
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
                              if (confirm(`确定删除角色「${row.name}」吗？`)) {
                                setRoles(prev => prev.filter(r => r.id !== row.id));
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

        {/* Pagination Footer (matching 1.5) */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white select-none">
          <div>
            共 <span className="font-semibold text-slate-700">932</span> 条
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
              onClick={() => setCurrentPage(47)}
              className="w-8 h-7 rounded border border-slate-200 hover:bg-slate-50"
            >
              47
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
    </div>
  );
};
