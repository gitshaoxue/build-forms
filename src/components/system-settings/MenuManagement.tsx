import React, { useState, useMemo } from 'react';
import {
  Menu as MenuIcon,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  XCircle,
  Folder,
  FolderOpen,
  FileCode,
  MousePointerClick,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Layers,
  Settings,
  ShieldCheck,
  Building2,
  Users,
  LayoutGrid,
  FileSpreadsheet,
  GitBranch,
  BarChart3,
  Database,
  Truck,
  Package,
  Activity,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Filter,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { MenuItem } from './types';

export interface MenuManagementProps {
  showNotification?: (text: string) => void;
}

// Icon dictionary for icon selector
const AVAILABLE_ICONS = [
  { name: 'Menu', component: MenuIcon, label: '菜单' },
  { name: 'LayoutGrid', component: LayoutGrid, label: '网格' },
  { name: 'Folder', component: Folder, label: '文件夹' },
  { name: 'FileCode', component: FileCode, label: '页面' },
  { name: 'MousePointerClick', component: MousePointerClick, label: '按钮' },
  { name: 'Building2', component: Building2, label: '组织' },
  { name: 'Users', component: Users, label: '用户' },
  { name: 'ShieldCheck', component: ShieldCheck, label: '角色' },
  { name: 'FileSpreadsheet', component: FileSpreadsheet, label: '表单' },
  { name: 'GitBranch', component: GitBranch, label: '流程' },
  { name: 'BarChart3', component: BarChart3, label: '图表' },
  { name: 'Database', component: Database, label: '设置' },
  { name: 'Truck', component: Truck, label: '物流' },
  { name: 'Package', component: Package, label: '库存' },
  { name: 'Activity', component: Activity, label: '仪表盘' },
  { name: 'Globe', component: Globe, label: '网络' },
  { name: 'Lock', component: Lock, label: '权限' },
  { name: 'Layers', component: Layers, label: '图层' },
];

export const getIconComponent = (iconName?: string) => {
  const found = AVAILABLE_ICONS.find(i => i.name.toLowerCase() === (iconName || '').toLowerCase());
  return found ? found.component : FileCode;
};

// Preset initial menu data
export const INITIAL_MENUS: MenuItem[] = [
  // 1. 仪表盘
  {
    id: 'menu-dashboard',
    name: '仪表盘',
    code: 'sys_dashboard',
    parentId: null,
    parentName: '顶级目录',
    type: 'menu',
    icon: 'Activity',
    path: '/dashboard',
    component: 'views/dashboard/index',
    permission: 'dashboard:view',
    sortOrder: 1,
    status: 'Active',
    appSystem: '系统管理',
    visible: true,
    createdAt: '2026-03-01 09:00',
    remarks: '系统运行与数据统计概览大盘'
  },
  // 2. 表单中心 (目录)
  {
    id: 'menu-form-center',
    name: '表单中心',
    code: 'cat_forms',
    parentId: null,
    parentName: '顶级目录',
    type: 'catalog',
    icon: 'FileSpreadsheet',
    path: '/forms',
    sortOrder: 2,
    status: 'Active',
    appSystem: '表单中心',
    visible: true,
    createdAt: '2026-03-01 09:10',
    remarks: '表单、流程与业务数据配置中心'
  },
  {
    id: 'menu-form-manage',
    name: '表单管理',
    code: 'menu_forms_project',
    parentId: 'menu-form-center',
    parentName: '表单中心',
    type: 'menu',
    icon: 'FileSpreadsheet',
    path: '/forms/projects',
    component: 'views/forms/ProjectList',
    permission: 'form:manage:list',
    sortOrder: 1,
    status: 'Active',
    appSystem: '表单中心',
    visible: true,
    createdAt: '2026-03-01 09:15',
    remarks: '业务表单创建、设计与发布'
  },
  {
    id: 'btn-form-add',
    name: '新增表单',
    code: 'btn_form_add',
    parentId: 'menu-form-manage',
    parentName: '表单管理',
    type: 'button',
    permission: 'form:manage:add',
    sortOrder: 1,
    status: 'Active',
    appSystem: '表单中心',
    visible: false,
    createdAt: '2026-03-01 09:16',
    remarks: '创建普通表单/流程表单'
  },
  {
    id: 'btn-form-edit',
    name: '设计表单',
    code: 'btn_form_edit',
    parentId: 'menu-form-manage',
    parentName: '表单管理',
    type: 'button',
    permission: 'form:manage:edit',
    sortOrder: 2,
    status: 'Active',
    appSystem: '表单中心',
    visible: false,
    createdAt: '2026-03-01 09:17',
    remarks: '进入拖拽设计画布'
  },
  {
    id: 'btn-form-del',
    name: '删除表单',
    code: 'btn_form_delete',
    parentId: 'menu-form-manage',
    parentName: '表单管理',
    type: 'button',
    permission: 'form:manage:delete',
    sortOrder: 3,
    status: 'Active',
    appSystem: '表单中心',
    visible: false,
    createdAt: '2026-03-01 09:18',
    remarks: '删除表单配置'
  },
  {
    id: 'menu-process-manage',
    name: '流程管理',
    code: 'menu_process',
    parentId: 'menu-form-center',
    parentName: '表单中心',
    type: 'menu',
    icon: 'GitBranch',
    path: '/forms/process',
    component: 'views/process/ProcessList',
    permission: 'form:process:list',
    sortOrder: 2,
    status: 'Active',
    appSystem: '表单中心',
    visible: true,
    createdAt: '2026-03-01 09:20',
    remarks: '审批流与业务流程配置'
  },
  {
    id: 'menu-data-manage',
    name: '数据管理',
    code: 'menu_data',
    parentId: 'menu-form-center',
    parentName: '表单中心',
    type: 'menu',
    icon: 'Database',
    path: '/forms/data',
    component: 'views/data/DataList',
    permission: 'form:data:list',
    sortOrder: 3,
    status: 'Active',
    appSystem: '表单中心',
    visible: true,
    createdAt: '2026-03-01 09:25',
    remarks: '各表单提交明细与数据维护'
  },
  {
    id: 'menu-insights',
    name: '数据洞察',
    code: 'menu_insights',
    parentId: 'menu-form-center',
    parentName: '表单中心',
    type: 'menu',
    icon: 'BarChart3',
    path: '/forms/insights',
    component: 'views/insights/Dashboard',
    permission: 'form:insights:view',
    sortOrder: 4,
    status: 'Active',
    appSystem: '表单中心',
    visible: true,
    createdAt: '2026-03-01 09:30',
    remarks: '统计分析与可视化图表'
  },

  // 3. 景田送水业务 (目录)
  {
    id: 'menu-water-biz',
    name: '景田送水',
    code: 'cat_water',
    parentId: null,
    parentName: '顶级目录',
    type: 'catalog',
    icon: 'Truck',
    path: '/biz/water',
    sortOrder: 3,
    status: 'Active',
    appSystem: '景田送水',
    visible: true,
    createdAt: '2026-03-02 10:00',
    remarks: '送水核心业务模块'
  },
  {
    id: 'menu-driver',
    name: '司机管理',
    code: 'menu_driver',
    parentId: 'menu-water-biz',
    parentName: '景田送水',
    type: 'menu',
    icon: 'Users',
    path: '/biz/water/driver',
    component: 'views/water/DriverList',
    permission: 'water:driver:list',
    sortOrder: 1,
    status: 'Active',
    appSystem: '景田送水',
    visible: true,
    createdAt: '2026-03-02 10:05',
    remarks: '配送司机信息与排班管理'
  },
  {
    id: 'menu-vehicle',
    name: '车辆管理',
    code: 'menu_vehicle',
    parentId: 'menu-water-biz',
    parentName: '景田送水',
    type: 'menu',
    icon: 'Truck',
    path: '/biz/water/vehicle',
    component: 'views/water/VehicleList',
    permission: 'water:vehicle:list',
    sortOrder: 2,
    status: 'Active',
    appSystem: '景田送水',
    visible: true,
    createdAt: '2026-03-02 10:10',
    remarks: '物流配送货车台账'
  },
  {
    id: 'menu-log-order',
    name: '物流订单',
    code: 'menu_log_order',
    parentId: 'menu-water-biz',
    parentName: '景田送水',
    type: 'menu',
    icon: 'Package',
    path: '/biz/water/log-order',
    component: 'views/water/OrderList',
    permission: 'water:order:list',
    sortOrder: 3,
    status: 'Active',
    appSystem: '景田送水',
    visible: true,
    createdAt: '2026-03-02 10:15',
    remarks: '物流配送销售订单流转'
  },
  {
    id: 'menu-water-order',
    name: '桶水订单配送',
    code: 'menu_water_order',
    parentId: 'menu-water-biz',
    parentName: '景田送水',
    type: 'menu',
    icon: 'Package',
    path: '/biz/water/delivery',
    component: 'views/water/DeliveryList',
    permission: 'water:delivery:list',
    sortOrder: 4,
    status: 'Active',
    appSystem: '景田送水',
    visible: true,
    createdAt: '2026-03-02 10:20',
    remarks: '五加仑桶装水终端配送'
  },
  {
    id: 'menu-dealer-stock',
    name: '经销商水站库存',
    code: 'menu_dealer_stock',
    parentId: 'menu-water-biz',
    parentName: '景田送水',
    type: 'menu',
    icon: 'Database',
    path: '/biz/water/dealer-stock',
    component: 'views/water/StockList',
    permission: 'water:stock:list',
    sortOrder: 5,
    status: 'Active',
    appSystem: '景田送水',
    visible: true,
    createdAt: '2026-03-02 10:25',
    remarks: '各区域经销商水站实物库存盘点'
  },

  // 4. 供应链管理 (目录)
  {
    id: 'menu-supply-chain',
    name: '供应链中台',
    code: 'cat_supply',
    parentId: null,
    parentName: '顶级目录',
    type: 'catalog',
    icon: 'Layers',
    path: '/supply',
    sortOrder: 4,
    status: 'Active',
    appSystem: '供应链',
    visible: true,
    createdAt: '2026-03-03 11:00',
    remarks: '生产计划与跨仓调拨管理'
  },
  {
    id: 'menu-bottle-apply',
    name: '瓶装水调拨单',
    code: 'menu_bottle_apply',
    parentId: 'menu-supply-chain',
    parentName: '供应链中台',
    type: 'menu',
    icon: 'FileSpreadsheet',
    path: '/supply/bottle-apply',
    component: 'views/supply/BottleApply',
    permission: 'supply:bottle:list',
    sortOrder: 1,
    status: 'Active',
    appSystem: '供应链',
    visible: true,
    createdAt: '2026-03-03 11:10',
    remarks: '全国工厂调拨至区域总仓申请'
  },
  {
    id: 'menu-factory-sched',
    name: '工厂排产计划',
    code: 'menu_factory_sched',
    parentId: 'menu-supply-chain',
    parentName: '供应链中台',
    type: 'menu',
    icon: 'Activity',
    path: '/supply/factory-sched',
    component: 'views/supply/FactorySchedule',
    permission: 'supply:schedule:list',
    sortOrder: 2,
    status: 'Active',
    appSystem: '供应链',
    visible: true,
    createdAt: '2026-03-03 11:15',
    remarks: '智能制造工厂产线日/周计划'
  },

  // 5. 系统设置 (目录)
  {
    id: 'menu-system',
    name: '系统设置',
    code: 'cat_system',
    parentId: null,
    parentName: '顶级目录',
    type: 'catalog',
    icon: 'Settings',
    path: '/system',
    sortOrder: 5,
    status: 'Active',
    appSystem: '系统设置',
    visible: true,
    createdAt: '2026-03-01 08:30',
    remarks: '系统管理核心控制台'
  },
  {
    id: 'menu-org',
    name: '组织管理',
    code: 'menu_org',
    parentId: 'menu-system',
    parentName: '系统设置',
    type: 'menu',
    icon: 'Building2',
    path: '/system/org',
    component: 'views/system/OrgManagement',
    permission: 'system:org:list',
    sortOrder: 1,
    status: 'Active',
    appSystem: '系统设置',
    visible: true,
    createdAt: '2026-03-01 08:35',
    remarks: '公司架构、部门与分支机构'
  },
  {
    id: 'menu-users',
    name: '用户管理',
    code: 'menu_users',
    parentId: 'menu-system',
    parentName: '系统设置',
    type: 'menu',
    icon: 'Users',
    path: '/system/users',
    component: 'views/system/UserManagement',
    permission: 'system:user:list',
    sortOrder: 2,
    status: 'Active',
    appSystem: '系统设置',
    visible: true,
    createdAt: '2026-03-01 08:40',
    remarks: '系统员工账号与人员信息维护'
  },
  {
    id: 'btn-user-query',
    name: '用户查询',
    code: 'btn_user_query',
    parentId: 'menu-users',
    parentName: '用户管理',
    type: 'button',
    permission: 'system:user:query',
    sortOrder: 1,
    status: 'Active',
    appSystem: '系统设置',
    visible: false,
    createdAt: '2026-03-01 08:41',
    remarks: '查询用户列表'
  },
  {
    id: 'btn-user-add',
    name: '用户新增',
    code: 'btn_user_add',
    parentId: 'menu-users',
    parentName: '用户管理',
    type: 'button',
    permission: 'system:user:add',
    sortOrder: 2,
    status: 'Active',
    appSystem: '系统设置',
    visible: false,
    createdAt: '2026-03-01 08:42',
    remarks: '添加新用户'
  },
  {
    id: 'btn-user-edit',
    name: '用户修改',
    code: 'btn_user_edit',
    parentId: 'menu-users',
    parentName: '用户管理',
    type: 'button',
    permission: 'system:user:edit',
    sortOrder: 3,
    status: 'Active',
    appSystem: '系统设置',
    visible: false,
    createdAt: '2026-03-01 08:43',
    remarks: '修改用户信息'
  },
  {
    id: 'btn-user-delete',
    name: '用户删除',
    code: 'btn_user_delete',
    parentId: 'menu-users',
    parentName: '用户管理',
    type: 'button',
    permission: 'system:user:delete',
    sortOrder: 4,
    status: 'Active',
    appSystem: '系统设置',
    visible: false,
    createdAt: '2026-03-01 08:44',
    remarks: '删除用户账号'
  },
  {
    id: 'menu-roles',
    name: '角色管理',
    code: 'menu_roles',
    parentId: 'menu-system',
    parentName: '系统设置',
    type: 'menu',
    icon: 'ShieldCheck',
    path: '/system/roles',
    component: 'views/system/RoleManagement',
    permission: 'system:role:list',
    sortOrder: 3,
    status: 'Active',
    appSystem: '系统设置',
    visible: true,
    createdAt: '2026-03-01 08:45',
    remarks: '角色分组与菜单/数据权限配置'
  },
  {
    id: 'btn-role-config',
    name: '权限配置',
    code: 'btn_role_config',
    parentId: 'menu-roles',
    parentName: '角色管理',
    type: 'button',
    permission: 'system:role:config',
    sortOrder: 1,
    status: 'Active',
    appSystem: '系统设置',
    visible: false,
    createdAt: '2026-03-01 08:46',
    remarks: '配置菜单权限与数据权限'
  },
  {
    id: 'menu-menus',
    name: '菜单管理',
    code: 'menu_menus',
    parentId: 'menu-system',
    parentName: '系统设置',
    type: 'menu',
    icon: 'Menu',
    path: '/system/menus',
    component: 'views/system/MenuManagement',
    permission: 'system:menu:list',
    sortOrder: 4,
    status: 'Active',
    appSystem: '系统设置',
    visible: true,
    createdAt: '2026-03-01 08:50',
    remarks: '系统功能菜单、目录及操作权限定义'
  },
  {
    id: 'btn-menu-add',
    name: '菜单新增',
    code: 'btn_menu_add',
    parentId: 'menu-menus',
    parentName: '菜单管理',
    type: 'button',
    permission: 'system:menu:add',
    sortOrder: 1,
    status: 'Active',
    appSystem: '系统设置',
    visible: false,
    createdAt: '2026-03-01 08:51',
    remarks: '创建新菜单/按钮'
  },
  {
    id: 'btn-menu-edit',
    name: '菜单修改',
    code: 'btn_menu_edit',
    parentId: 'menu-menus',
    parentName: '菜单管理',
    type: 'button',
    permission: 'system:menu:edit',
    sortOrder: 2,
    status: 'Active',
    appSystem: '系统设置',
    visible: false,
    createdAt: '2026-03-01 08:52',
    remarks: '编辑修改菜单属性'
  },
  {
    id: 'btn-menu-delete',
    name: '菜单删除',
    code: 'btn_menu_delete',
    parentId: 'menu-menus',
    parentName: '菜单管理',
    type: 'button',
    permission: 'system:menu:delete',
    sortOrder: 3,
    status: 'Active',
    appSystem: '系统设置',
    visible: false,
    createdAt: '2026-03-01 08:53',
    remarks: '删除菜单及子项'
  }
];

export const MenuManagement: React.FC<MenuManagementProps> = ({ showNotification }) => {
  // State
  const [menus, setMenus] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('arch_system_menus');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MENUS;
      }
    }
    return INITIAL_MENUS;
  });

  // Persist to local storage
  const updateMenusAndPersist = (newMenus: MenuItem[]) => {
    setMenus(newMenus);
    try {
      localStorage.setItem('arch_system_menus', JSON.stringify(newMenus));
    } catch (e) {
      // ignore
    }
  };

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'catalog' | 'menu' | 'button'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Disabled'>('all');
  const [filterSystem, setFilterSystem] = useState<string>('all');

  // Expanded nodes set
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Default expand catalogs
    return new Set(['menu-form-center', 'menu-form-manage', 'menu-water-biz', 'menu-supply-chain', 'menu-system', 'menu-users', 'menu-roles', 'menu-menus']);
  });

  // Selected row IDs for batch actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal State: Create / Edit
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formParentId, setFormParentId] = useState<string>('root');
  const [formType, setFormType] = useState<'catalog' | 'menu' | 'button'>('menu');
  const [formIcon, setFormIcon] = useState('FileCode');
  const [formPath, setFormPath] = useState('');
  const [formComponent, setFormComponent] = useState('');
  const [formPermission, setFormPermission] = useState('');
  const [formSortOrder, setFormSortOrder] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<'Active' | 'Disabled'>('Active');
  const [formSystem, setFormSystem] = useState('系统设置');
  const [formVisible, setFormVisible] = useState(true);
  const [formRemarks, setFormRemarks] = useState('');

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);

  // Toggle expand
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand / Collapse all
  const handleToggleExpandAll = () => {
    if (expandedIds.size > 0) {
      setExpandedIds(new Set());
    } else {
      const allParentIds = new Set(menus.map(m => m.id));
      setExpandedIds(allParentIds);
    }
  };

  // Open Create Modal
  const handleOpenCreate = (presetParentId?: string) => {
    setModalMode('create');
    setEditingItem(null);
    setFormName('');
    setFormCode(`menu_${Date.now().toString().slice(-4)}`);
    setFormParentId(presetParentId || 'root');
    setFormType(presetParentId ? 'menu' : 'catalog');
    setFormIcon('FileCode');
    setFormPath('');
    setFormComponent('');
    setFormPermission('');
    setFormSortOrder(menus.length + 1);
    setFormStatus('Active');
    
    // Auto-detect system if parent selected
    if (presetParentId && presetParentId !== 'root') {
      const p = menus.find(m => m.id === presetParentId);
      if (p?.appSystem) {
        setFormSystem(p.appSystem);
      }
    } else {
      setFormSystem('系统设置');
    }

    setFormVisible(true);
    setFormRemarks('');
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MenuItem) => {
    setModalMode('edit');
    setEditingItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormParentId(item.parentId || 'root');
    setFormType(item.type);
    setFormIcon(item.icon || 'FileCode');
    setFormPath(item.path || '');
    setFormComponent(item.component || '');
    setFormPermission(item.permission || '');
    setFormSortOrder(item.sortOrder);
    setFormStatus(item.status);
    setFormSystem(item.appSystem || '系统设置');
    setFormVisible(item.visible ?? true);
    setFormRemarks(item.remarks || '');
  };

  // Save Modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification?.('请输入菜单名称');
      return;
    }

    const actualParentId = formParentId === 'root' ? null : formParentId;
    const parentItem = actualParentId ? menus.find(m => m.id === actualParentId) : null;
    const parentName = parentItem ? parentItem.name : '顶级目录';

    if (modalMode === 'create') {
      const newMenu: MenuItem = {
        id: `menu-${Date.now()}`,
        name: formName.trim(),
        code: formCode.trim() || `menu_${Date.now().toString().slice(-4)}`,
        parentId: actualParentId,
        parentName,
        type: formType,
        icon: formType !== 'button' ? formIcon : undefined,
        path: formPath.trim() || undefined,
        component: formComponent.trim() || undefined,
        permission: formPermission.trim() || undefined,
        sortOrder: Number(formSortOrder) || 1,
        status: formStatus,
        appSystem: formSystem,
        visible: formType !== 'button' ? formVisible : false,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        remarks: formRemarks.trim() || undefined
      };

      const updated = [...menus, newMenu];
      updateMenusAndPersist(updated);
      
      // Auto expand parent
      if (actualParentId) {
        setExpandedIds(prev => new Set([...prev, actualParentId]));
      }

      showNotification?.(`已成功添加菜单「${newMenu.name}」`);
    } else if (modalMode === 'edit' && editingItem) {
      // Prevent setting parent to itself
      if (actualParentId === editingItem.id) {
        showNotification?.('上级菜单不能选择自身');
        return;
      }

      const updated = menus.map(m => {
        if (m.id === editingItem.id) {
          return {
            ...m,
            name: formName.trim(),
            code: formCode.trim(),
            parentId: actualParentId,
            parentName,
            type: formType,
            icon: formType !== 'button' ? formIcon : undefined,
            path: formPath.trim() || undefined,
            component: formComponent.trim() || undefined,
            permission: formPermission.trim() || undefined,
            sortOrder: Number(formSortOrder) || 1,
            status: formStatus,
            appSystem: formSystem,
            visible: formType !== 'button' ? formVisible : false,
            remarks: formRemarks.trim() || undefined
          };
        }
        return m;
      });

      updateMenusAndPersist(updated);
      showNotification?.(`已保存菜单「${formName.trim()}」的修改`);
    }

    setModalMode(null);
  };

  // Quick Toggle Status
  const handleToggleStatus = (item: MenuItem) => {
    const nextStatus = item.status === 'Active' ? 'Disabled' : 'Active';
    const updated = menus.map(m => m.id === item.id ? { ...m, status: nextStatus } : m);
    updateMenusAndPersist(updated);
    showNotification?.(`已${nextStatus === 'Active' ? '启用' : '停用'}菜单「${item.name}」`);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    // Collect target ID and all its descendant IDs
    const toDeleteIds = new Set<string>();
    const findChildrenRecursive = (pid: string) => {
      toDeleteIds.add(pid);
      menus.filter(m => m.parentId === pid).forEach(child => findChildrenRecursive(child.id));
    };
    findChildrenRecursive(deleteTarget.id);

    const updated = menus.filter(m => !toDeleteIds.has(m.id));
    updateMenusAndPersist(updated);
    
    // Clear selection if deleted
    setSelectedIds(prev => {
      const next = new Set(prev);
      toDeleteIds.forEach(id => next.delete(id));
      return next;
    });

    showNotification?.(`已删除菜单「${deleteTarget.name}」${toDeleteIds.size > 1 ? `及其 ${toDeleteIds.size - 1} 个子项` : ''}`);
    setDeleteTarget(null);
  };

  // Batch Delete
  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    const toDeleteIds = new Set<string>();
    selectedIds.forEach(id => {
      const findChildrenRecursive = (pid: string) => {
        toDeleteIds.add(pid);
        menus.filter(m => m.parentId === pid).forEach(child => findChildrenRecursive(child.id));
      };
      findChildrenRecursive(id);
    });

    const updated = menus.filter(m => !toDeleteIds.has(m.id));
    updateMenusAndPersist(updated);
    showNotification?.(`已批量删除选中的 ${toDeleteIds.size} 项菜单/权限`);
    setSelectedIds(new Set());
    setBatchDeleteConfirm(false);
  };

  // Batch Status Change
  const handleBatchStatus = (status: 'Active' | 'Disabled') => {
    if (selectedIds.size === 0) return;
    const updated = menus.map(m => selectedIds.has(m.id) ? { ...m, status } : m);
    updateMenusAndPersist(updated);
    showNotification?.(`已批量${status === 'Active' ? '启用' : '停用'}选中的 ${selectedIds.size} 项菜单`);
  };

  // Reset to default
  const handleResetDefault = () => {
    updateMenusAndPersist(INITIAL_MENUS);
    setExpandedIds(new Set(['menu-form-center', 'menu-form-manage', 'menu-water-biz', 'menu-supply-chain', 'menu-system', 'menu-users', 'menu-roles', 'menu-menus']));
    setSelectedIds(new Set());
    showNotification?.('已重置恢复系统默认菜单配置');
  };

  // Build tree & flattened list with depth and child info
  interface FlattenedMenuItem extends MenuItem {
    depth: number;
    hasChildren: boolean;
    childCount: number;
  }

  const flattenedDisplayList = useMemo(() => {
    // 1. Filter raw list if search or filters active
    const isFiltered = searchTerm.trim() || filterType !== 'all' || filterStatus !== 'all' || filterSystem !== 'all';

    // Build hierarchy map
    const childrenMap: Record<string, MenuItem[]> = {};
    const rootItems: MenuItem[] = [];

    menus.forEach(item => {
      if (!item.parentId) {
        rootItems.push(item);
      } else {
        if (!childrenMap[item.parentId]) {
          childrenMap[item.parentId] = [];
        }
        childrenMap[item.parentId].push(item);
      }
    });

    // Sort items by sortOrder
    const sortFn = (a: MenuItem, b: MenuItem) => a.sortOrder - b.sortOrder;
    rootItems.sort(sortFn);
    Object.values(childrenMap).forEach(list => list.sort(sortFn));

    const result: FlattenedMenuItem[] = [];

    const traverse = (node: MenuItem, depth: number) => {
      const children = childrenMap[node.id] || [];
      const hasChildren = children.length > 0;

      // Filter condition match check
      let matches = true;
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const mName = node.name.toLowerCase().includes(q);
        const mCode = node.code.toLowerCase().includes(q);
        const mPath = (node.path || '').toLowerCase().includes(q);
        const mPerm = (node.permission || '').toLowerCase().includes(q);
        if (!mName && !mCode && !mPath && !mPerm) matches = false;
      }
      if (filterType !== 'all' && node.type !== filterType) {
        matches = false;
      }
      if (filterStatus !== 'all' && node.status !== filterStatus) {
        matches = false;
      }
      if (filterSystem !== 'all' && node.appSystem !== filterSystem) {
        matches = false;
      }

      // If filtering, we show all matching items flatly, OR if not filtering we respect expand/collapse
      if (isFiltered) {
        if (matches) {
          result.push({ ...node, depth, hasChildren, childCount: children.length });
        }
        children.forEach(c => traverse(c, depth + 1));
      } else {
        result.push({ ...node, depth, hasChildren, childCount: children.length });
        if (expandedIds.has(node.id)) {
          children.forEach(c => traverse(c, depth + 1));
        }
      }
    };

    rootItems.forEach(root => traverse(root, 0));
    return result;
  }, [menus, expandedIds, searchTerm, filterType, filterStatus, filterSystem]);

  // Systems list for filter
  const allSystems = useMemo(() => {
    const set = new Set<string>();
    menus.forEach(m => {
      if (m.appSystem) set.add(m.appSystem);
    });
    return Array.from(set);
  }, [menus]);

  // Statistics
  const stats = useMemo(() => {
    const total = menus.length;
    const catalogs = menus.filter(m => m.type === 'catalog').length;
    const menusCount = menus.filter(m => m.type === 'menu').length;
    const buttons = menus.filter(m => m.type === 'button').length;
    const active = menus.filter(m => m.status === 'Active').length;
    return { total, catalogs, menusCount, buttons, active };
  }, [menus]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* 1. Header with Stats & Actions */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <MenuIcon className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">菜单管理</h2>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                共 {stats.total} 项
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              配置系统各端导航菜单、路由路径、页面组件及细粒度按钮权限标识（增、删、改、查）
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleExpandAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {expandedIds.size > 0 ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>全部折叠</span>
                </>
              ) : (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>全部展开</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetDefault}
              title="重置为默认菜单配置"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenCreate('root')}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新增菜单</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <Folder className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-[10px] text-slate-500 font-medium">目录分类</div>
              <div className="text-xs font-bold text-slate-800">{stats.catalogs} 个</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <FileCode className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="text-[10px] text-slate-500 font-medium">功能菜单</div>
              <div className="text-xs font-bold text-slate-800">{stats.menusCount} 个</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <MousePointerClick className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-[10px] text-slate-500 font-medium">按钮权限</div>
              <div className="text-xs font-bold text-slate-800">{stats.buttons} 项</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[10px] text-slate-500 font-medium">启用状态</div>
              <div className="text-xs font-bold text-slate-800">{stats.active} 启用 / {stats.total - stats.active} 停用</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Query Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[320px]">
          {/* Keyword Search */}
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索菜单名称、编码、路由或权限..."
              className="w-full pl-9 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-xs">
            {[
              { id: 'all', label: '全部类型' },
              { id: 'catalog', label: '目录' },
              { id: 'menu', label: '菜单' },
              { id: 'button', label: '按钮' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-white text-primary shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* System/App Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">所属模块:</span>
            <select
              value={filterSystem}
              onChange={(e) => setFilterSystem(e.target.value)}
              className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-slate-700 cursor-pointer"
            >
              <option value="all">全部模块体系</option>
              {allSystems.map(sys => (
                <option key={sys} value={sys}>{sys}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">状态:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-slate-700 cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="Active">启用</option>
              <option value="Disabled">停用</option>
            </select>
          </div>

          {(searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterSystem !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
                setFilterSystem('all');
              }}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>清空筛选</span>
            </button>
          )}
        </div>

        {/* Batch Actions when items selected */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200 px-3 py-1 rounded-lg">
            <span className="text-xs text-blue-700 font-medium">已选择 {selectedIds.size} 项</span>
            <div className="h-3 w-px bg-blue-200" />
            <button
              type="button"
              onClick={() => handleBatchStatus('Active')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              批量启用
            </button>
            <button
              type="button"
              onClick={() => handleBatchStatus('Disabled')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
            >
              批量停用
            </button>
            <button
              type="button"
              onClick={() => setBatchDeleteConfirm(true)}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              批量删除
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
            >
              取消
            </button>
          </div>
        )}
      </div>

      {/* 3. Tree Table Body */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={flattenedDisplayList.length > 0 && flattenedDisplayList.every(item => selectedIds.has(item.id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(flattenedDisplayList.map(item => item.id)));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                    className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 min-w-[240px]">菜单名称</th>
                <th className="py-3 px-4 w-16 text-center">图标</th>
                <th className="py-3 px-4 w-20 text-center">类型</th>
                <th className="py-3 px-4 min-w-[140px]">路由地址</th>
                <th className="py-3 px-4 min-w-[160px]">组件路径</th>
                <th className="py-3 px-4 min-w-[150px]">权限标识</th>
                <th className="py-3 px-4 w-28">所属体系</th>
                <th className="py-3 px-4 w-16 text-center">排序</th>
                <th className="py-3 px-4 w-20 text-center">状态</th>
                <th className="py-3 px-4 min-w-[160px] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {flattenedDisplayList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <MenuIcon className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <span className="text-xs">未找到符合条件的菜单项</span>
                    </div>
                  </td>
                </tr>
              ) : (
                flattenedDisplayList.map((item) => {
                  const IconComp = getIconComponent(item.icon);
                  const isChecked = selectedIds.has(item.id);
                  const isExpanded = expandedIds.has(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isChecked ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const next = new Set(selectedIds);
                            if (e.target.checked) {
                              next.add(item.id);
                            } else {
                              next.delete(item.id);
                            }
                            setSelectedIds(next);
                          }}
                          className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>

                      {/* Menu Name with Tree Indentation */}
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        <div
                          className="flex items-center gap-1.5"
                          style={{ paddingLeft: `${item.depth * 20}px` }}
                        >
                          {item.hasChildren ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(item.id)}
                              className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                          ) : (
                            <span className="w-4 h-4 inline-block" />
                          )}

                          {item.type === 'catalog' && (
                            <Folder className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          )}
                          {item.type === 'menu' && (
                            <FileCode className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                          {item.type === 'button' && (
                            <MousePointerClick className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}

                          <span className="truncate" title={item.name}>{item.name}</span>

                          {item.childCount > 0 && !isExpanded && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded-full font-mono">
                              +{item.childCount}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Icon */}
                      <td className="py-2.5 px-4 text-center">
                        {item.type !== 'button' ? (
                          <div className="w-6 h-6 mx-auto rounded bg-slate-100 flex items-center justify-center text-slate-600">
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Type Badge */}
                      <td className="py-2.5 px-4 text-center">
                        {item.type === 'catalog' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            目录
                          </span>
                        )}
                        {item.type === 'menu' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            菜单
                          </span>
                        )}
                        {item.type === 'button' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            按钮
                          </span>
                        )}
                      </td>

                      {/* Route Path */}
                      <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px]">
                        {item.path ? (
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 border border-slate-200/60">
                            {item.path}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Component */}
                      <td className="py-2.5 px-4 text-slate-500 text-[11px] font-mono truncate max-w-[180px]">
                        {item.component || <span className="text-slate-300">-</span>}
                      </td>

                      {/* Permission Tag */}
                      <td className="py-2.5 px-4 font-mono text-[11px]">
                        {item.permission ? (
                          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200/80">
                            {item.permission}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* System/Module */}
                      <td className="py-2.5 px-4 text-slate-600">
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-700 border border-slate-200">
                          {item.appSystem || '系统'}
                        </span>
                      </td>

                      {/* Sort Order */}
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600 font-semibold">
                        {item.sortOrder}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            item.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                          title="点击快速切换状态"
                        >
                          {item.status === 'Active' ? '启用' : '停用'}
                        </button>
                      </td>

                      {/* Row Actions */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.type !== 'button' && (
                            <button
                              type="button"
                              onClick={() => handleOpenCreate(item.id)}
                              className="text-primary hover:text-primary/80 font-medium text-xs flex items-center gap-0.5 cursor-pointer"
                              title="在此菜单下新增子项"
                            >
                              <Plus className="w-3 h-3" />
                              <span>子项</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="text-slate-600 hover:text-slate-900 font-medium text-xs flex items-center gap-0.5 cursor-pointer"
                            title="修改菜单"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>修改</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="text-rose-600 hover:text-rose-800 font-medium text-xs flex items-center gap-0.5 cursor-pointer"
                            title="删除菜单"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>删除</span>
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
      </div>

      {/* 4. Create / Edit Menu Modal Dialog */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {modalMode === 'create' ? <Plus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {modalMode === 'create' ? '新增菜单' : '修改菜单'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Row 1: 上级菜单 & 菜单类型 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    上级菜单 <span className="text-slate-400 font-normal">（选 root 为顶级根节点）</span>
                  </label>
                  <select
                    value={formParentId}
                    onChange={(e) => setFormParentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-700"
                  >
                    <option value="root">● 作为顶级根目录 (Root)</option>
                    {menus
                      .filter(m => m.type !== 'button')
                      .filter(m => modalMode !== 'edit' || m.id !== editingItem?.id)
                      .map(m => (
                        <option key={m.id} value={m.id}>
                          {m.type === 'catalog' ? '📁 目录: ' : '📄 菜单: '}{m.name} ({m.code})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">菜单类型</label>
                  <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    {[
                      { id: 'catalog', label: '目录 (M)' },
                      { id: 'menu', label: '菜单 (C)' },
                      { id: 'button', label: '按钮 (F)' },
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormType(t.id as any)}
                        className={`flex-1 py-1 rounded text-xs font-medium transition-all ${
                          formType === t.id
                            ? 'bg-white text-primary font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: 菜单名称 & 菜单编码 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    菜单名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="如: 订单配送管理"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">菜单编码 (唯一标识)</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="如: menu_order_delivery"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Row 3: 路由地址 & 组件路径 (非按钮时可见) */}
              {formType !== 'button' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">路由地址 (Route Path)</label>
                    <input
                      type="text"
                      value={formPath}
                      onChange={(e) => setFormPath(e.target.value)}
                      placeholder="如: /biz/order/delivery"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">组件路径 (Component)</label>
                    <input
                      type="text"
                      value={formComponent}
                      onChange={(e) => setFormComponent(e.target.value)}
                      placeholder="如: views/biz/DeliveryList"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Row 4: 权限标识 & 所属体系 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    权限字符 (Permission String)
                  </label>
                  <input
                    type="text"
                    value={formPermission}
                    onChange={(e) => setFormPermission(e.target.value)}
                    placeholder="如: biz:order:list, biz:order:add"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">所属模块体系</label>
                  <input
                    type="text"
                    value={formSystem}
                    onChange={(e) => setFormSystem(e.target.value)}
                    placeholder="如: 系统设置、景田送水、供应链"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-800"
                  />
                </div>
              </div>

              {/* Row 5: 图标选择 (非按钮时可见) */}
              {formType !== 'button' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    菜单图标 <span className="text-slate-400 font-normal">（当前选择: {formIcon}）</span>
                  </label>
                  <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
                    {AVAILABLE_ICONS.map(ic => {
                      const Comp = ic.component;
                      const isSelected = formIcon === ic.name;
                      return (
                        <button
                          key={ic.name}
                          type="button"
                          onClick={() => setFormIcon(ic.name)}
                          className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-white shadow-xs font-bold'
                              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                          }`}
                        >
                          <Comp className="w-4 h-4" />
                          <span className="text-[9px]">{ic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Row 6: 排序 & 状态 & 显示 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">显示排序</label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">菜单状态</label>
                  <div className="flex items-center gap-2 mt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formStatus === 'Active'}
                        onChange={() => setFormStatus('Active')}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-slate-700">启用</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer ml-3">
                      <input
                        type="radio"
                        name="status"
                        checked={formStatus === 'Disabled'}
                        onChange={() => setFormStatus('Disabled')}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-slate-700">停用</span>
                    </label>
                  </div>
                </div>

                {formType !== 'button' && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">导航显示</label>
                    <div className="flex items-center gap-2 mt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="visible"
                          checked={formVisible === true}
                          onChange={() => setFormVisible(true)}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-slate-700">显示</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer ml-3">
                        <input
                          type="radio"
                          name="visible"
                          checked={formVisible === false}
                          onChange={() => setFormVisible(false)}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-slate-700">隐藏</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 7: 备注说明 */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">备注说明</label>
                <textarea
                  rows={2}
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="填写关于该菜单的业务描述..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-slate-800"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  保存菜单
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Single Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">确认删除菜单？</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              您正在删除菜单「<span className="font-bold text-slate-800">{deleteTarget.name}</span>」。
              {menus.some(m => m.parentId === deleteTarget.id) && (
                <span className="block mt-1.5 p-2 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 font-semibold">
                  ⚠️ 警告：该菜单下包含子菜单或按钮，删除后将同时删除其所有子项！
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Batch Delete Confirm Modal */}
      {batchDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">批量删除确认</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              确定要删除选中的 <span className="font-bold text-rose-600">{selectedIds.size}</span> 项菜单吗？
              若所选菜单包含子节点，相关子项亦将被一并删除，该操作无法撤销。
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBatchDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleBatchDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                确认批量删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
