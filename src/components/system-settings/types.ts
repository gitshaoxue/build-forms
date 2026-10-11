export interface OrgNode {
  id: string;
  name: string;
  code?: string;
  parentId?: string | null;
  leader?: string;
  leaderId?: string;
  phone?: string;
  email?: string;
  status: 'Active' | 'Disabled';
  sortOrder: number;
  type: 'company' | 'dept' | 'region' | 'factory' | 'store' | 'team' | 'supplier' | 'dealer' | string;
  isLegalEntity?: boolean; // 对应企业主体
  startDate?: string;      // 启用日期
  remarks?: string;        // 备注
  description?: string;
  children?: OrgNode[];
}

export interface TeamMember {
  id: string;
  accountId?: string;      // 账号ID (如: 330142)
  accountName?: string;    // 账号名称 (如: 王晓红_供应商账号)
  personName?: string;     // 人员
  workNo: string;
  name: string;
  role: string;
  roleId: string;
  deptId: string;
  deptName?: string;       // 所属组织全称
  email: string;
  phone: string;
  status: 'Active' | 'Disabled';
  createdAt: string;
  relatedParty?: string;   // 关联方 (如: 外部组织/供应商外..., 供应链阳江基地...)
  channel?: string;        // 渠道 (Web端、微信小程序、供应链App...)
  dataScope?: string;      // 数据权限 (全部、关联方、本人、本部门及下属部门、负责组织)
  parentUser?: string;     // 关联所属上级
  remarks?: string;        // 备注
  // 业务标签（用于数据权限行权限管控）
  chargeDepts: string[];   // 负责组织
  salesRegions: string[];  // 负责销售区域（如：华东大区、华南大区、华北大区、西南大区）
  factories: string[];     // 负责工厂（如：华东一号智能制造基地、华南精密电子工厂）
  stores: string[];        // 负责门店（如：上海旗舰店、广州天河店、深圳南山店）
}

export interface FormPermission {
  view: boolean;   // 允许访问查看
  fill: boolean;   // 允许填报提交
  manage: boolean; // 允许表单配置管理
}

export interface OperationPermissions {
  create: boolean;       // 新增
  edit: boolean;         // 修改
  delete: boolean;       // 删除
  enable: boolean;       // 启用
  disable: boolean;      // 禁用
  export: boolean;       // 导出
  batchDelete: boolean;  // 批量删除
  importData: boolean;   // 导入数据
}

export interface TagRowSecurityConfig {
  enabled: boolean;
  matchMode: 'any' | 'all';     // 满足任一标签 / 必须匹配全部标签
  byChargeDepts: boolean;       // 按【负责组织】管控
  bySalesRegions: boolean;      // 按【负责销售区域】管控
  byFactories: boolean;         // 按【负责工厂】管控
  byStores: boolean;            // 按【负责门店】管控
}

export type FieldColumnAccess = 'editable' | 'readonly' | 'masked' | 'hidden';

export interface RoleDefinition {
  id: string;
  name: string;
  code: string;
  desc: string;
  isSystem: boolean;
  userCount?: number;
  parentRoleId?: string;       // 上级角色ID
  parentRoleName?: string;     // 上级角色名称 (如: "--", "H角色8", "默认初始角色")
  appSystem?: string;          // 应用体系 (如: "供应商", "景田", "经销商", "中台", "集团")
  status?: 'Active' | 'Disabled'; // 状态: 启用 / 停用
  creator?: string;            // 创建人 (如: "超级管理员", "YF-中台管理")
  createdAt?: string;          // 创建时间
  // 3.1 功能权限
  menus: Record<string, boolean>;                       // 菜单权限
  forms: Record<string, FormPermission>;                // 表单权限
  operations: OperationPermissions;                     // 操作权限（新增、修改、删除、启用、禁用等）
  // 3.2 数据权限 (截图1.6: 菜单数据权限 本人 / 关联方 / 全部)
  menuDataScope?: Record<string, 'self' | 'related' | 'all'>; // 菜单数据权限
  orgScope: 'self' | 'self_sub' | 'dept' | 'dept_sub' | 'all'; // 所属组织行权限
  tagControl: TagRowSecurityConfig;                             // 标签行权限管控
  fieldPermissions: Record<string, Record<string, FieldColumnAccess>>; // 列权限：formId -> fieldId -> access
}

