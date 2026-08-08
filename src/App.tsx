import React from 'react';
import { 
  FormInput, 
  Home,
  Workflow, 
  Database, 
  ShieldCheck, 
  ChevronRight, 
  Activity, 
  Layers, 
  MousePointer2,
  FileSearch,
  Network,
  Users,
  LayoutGrid,
  Menu,
  X,
  Plus,
  Trash2,
  Play,
  StopCircle,
  Settings,
  Eye,
  Code,
  Type,
  CheckSquare,
  CircleDot,
  Calendar,
  Save,
  ChevronLeft,
  Bell,
  Globe,
  Command,
  Share2,
  ExternalLink,
  MoreVertical,
  Briefcase,
  ChevronDown,
  Mail,
  Clock,
  CheckCircle2,
  RefreshCw,
  FileDown,
  Search,
  ArrowLeft,
  Users2,
  BarChart3,
  Filter,
  ArrowUpDown,
  FileSpreadsheet,
  Download,
  EyeOff,
  Link,
  QrCode,
  Copy,
  Info,
  Building2,
  UserCog,
  UserPlus,
  UserCheck,
  UserMinus,
  History,
  GitBranch,
  GitCompare,
  RotateCcw,
  ArrowRight,
  ListFilter,
  Link2,
  TableProperties,
  Clock3,
  Edit,
  Shield,
  Zap,
  Check,
  Layout,
  Sliders,
  Printer,
  Monitor,
  Smartphone,
  Hash,
  ListChecks,
  ToggleLeft,
  FileText,
  Upload,
  FileUp,
  Table,
  PenTool,
  MapPin,
  Barcode,
  Columns,
  Square,
  Box,
  Image as LucideImage,
  BookOpen,
  Backpack,
  MessageSquare,
  Send,
  MessageCircle,
  FileBox,
  Compass,
  CreditCard,
  Gamepad,
  Heart,
  Music,
  ShoppingBag,
  Ticket,
  Trophy,
  Video,
  Wallet,
  Mic,
  Headphones,
  Gamepad2,
  Layers2,
  Radio,
  Star,
  Repeat,
  LogOut,
  Lock,
  Plane,
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';

type ViewType = 'landing' | 'dashboard' | 'editor' | 'projects' | 'dataManagement' | 'workflow' | 'insights' | 'integrations' | 'team' | 'appCenter';

interface FormField {
  id: string;
  type: 
    | 'text' | 'textarea' | 'number' | 'date' | 'time' | 'datetimeRange' 
    | 'select' | 'multiSelect' | 'radio' | 'checkbox' | 'switch' 
    | 'descriptionText' | 'upload' | 'download'
    | 'orgSelect' | 'userSelect' | 'roleSelect'
    | 'cascade' | 'relateQuery' | 'subform' | 'tableGrid' | 'signature' | 'location' | 'barcode' | 'qrcode' | 'progress' | 'richtext'
    | 'creator' | 'createdAt' | 'modifier' | 'modifiedAt'
    | 'grid' | 'tabs' | 'card' | 'group';
  label: string;
  placeholder?: string;
  required: boolean;
  readOnly: boolean;
  visible: boolean;
  hidden?: boolean;
  options?: string[]; // for select, radio, checkbox
  width?: '1/1' | '1/2' | '1/3' | '1/4';
  code?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  defaultValue?: any;
  rules?: string;
  description?: string;
  terminals?: ('pc' | 'mobile')[];
  sortOrder?: number;
  componentType?: string;
  formula?: string;
}

interface WorkflowBranchRule {
  id: string;
  name: string;
  fieldId: string;
  fieldLabel?: string;
  operator: '等于' | '不等于' | '大于' | '小于' | '大于等于' | '小于等于' | '包含' | '不包含' | '不为空';
  value: string;
  targetNodeId?: string;
}

interface WorkflowNode {
  id: string;
  type: 'start' | 'approval' | 'notification' | 'condition' | 'cc' | 'end';
  label: string;
  description?: string;
  config?: {
    assigneeType?: 'user' | 'role' | 'dept' | 'initiator' | 'manager';
    assigneeValue?: string;
    approvalType?: 'OR' | 'AND' | 'SEQUENTIAL'; // 或签 / 会签 / 依次审批
    commentRequirement?: 'required' | 'optional'; // 审批意见: 必填 / 非必填
    timeout?: number;
    actions?: string[]; // ['approve', 'reject', 'transfer', 'return']
    fieldPermissions?: Record<string, 'editable' | 'readonly' | 'hidden'>;
    buttons?: string[];
    advanced?: {
      autoApproveIfInitiator?: boolean;
      emptyAssigneeAction?: 'transfer_user' | 'terminate_error' | 'auto_pass' | 'pause_admin' | 'pause' | 'skip' | 'transfer_member' | 'transfer_admin';
      emptyAssigneeTarget?: string;
      timeoutAction?: string;
    };
    branches?: WorkflowBranchRule[]; // 路由条件分支
    expression?: string; // for condition
    template?: string;
    defaultBranch?: string; // id of target node
  };
  targets: string[]; // ids of next nodes
}

interface WorkflowVersion {
  id: string;
  formId: string;
  version: string;
  versionNum: number;
  title: string;
  description: string;
  createdAt: string;
  creator: string;
  status: 'active' | 'archived' | 'draft';
  nodes: WorkflowNode[];
}

interface TriggerRule {
  id: string;
  fieldId: string;
  fieldLabel: string;
  operator: '等于' | '不等于' | '大于' | '小于' | '大于等于' | '小于等于' | '包含' | '不包含' | '不为空';
  value: string;
}

interface WorkflowGlobalConfig {
  triggerRules: TriggerRule[];
  triggerMatchMode: 'ALL' | 'ANY';
  allowTransfer: boolean;
  terminateOnFailure: boolean;
  enableTimeoutNotice: boolean;
  timeoutNoticeChannels: ('station' | 'email' | 'sms')[];
  autoApprovalMode: 'none' | 'initiator_all' | 'adjacent_same' | 'approved_before';
  recallMode: 'none' | 'initiator_only' | 'all_nodes';
  silentRecall: boolean;
  enableTimeoutSettings: boolean;
  timeoutHours: number;
  timeoutChannels: ('station' | 'email' | 'sms')[];
}

interface WorkflowInstance {
  id: string;
  projectId: string;
  initiator: string;
  startTime: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  currentStep: string;
  history: { step: string, actor: string, action: string, time: string }[];
}

interface Project {
  id: string;
  name: string;
  updatedAt: string;
  lastAccessedAt: number;
  status: 'Published' | 'Draft' | 'Archived';
  responses: number;
  createdBy?: string;
  createdAt?: string;
  category?: '行政' | '人事' | '财务' | '市场' | '工厂' | '问卷调查' | '绩效' | '协同办公' | '其他';
  description?: string;
  icon?: string;
}

type FormType = 'normal' | 'workflow' | 'report' | 'dashboard';

interface SavedForm {
  id: string;
  projectId: string;
  name: string;
  status: 'Published' | 'Draft' | 'Archived';
  createdAt: string;
  designer: string;
  type: FormType;
}

interface Submission {
  id: string;
  submitter: string;
  submitTime: string;
  status: '处理中' | '已通过' | '已驳回' | '草稿';
  data: Record<string, any>;
  approvalHistory: { step: string, actor: string, action: string, time: string }[];
}

const mockProjects: Project[] = [
  { id: '1', name: '入职架构', updatedAt: '2小时前', lastAccessedAt: Date.now() - 1000 * 60 * 60 * 2, status: 'Draft', responses: 0, createdBy: '张经理', createdAt: '2026-05-15', category: '人事', icon: 'Users', description: '新员工入职流程全套审批与数字化组织架构录入。' },
  { id: '2', name: 'Q3 客户反馈', updatedAt: '1天前', lastAccessedAt: Date.now() - 1000 * 60 * 60 * 24, status: 'Published', responses: 1240, createdBy: '李专员', createdAt: '2026-05-10', category: '问卷调查', icon: 'MessageSquare', description: '面向全网核心用户的季度产品满意度调研和产品缺陷回流分析。' },
  { id: '3', name: '企业潜在客户', updatedAt: '3天前', lastAccessedAt: Date.now() - 1000 * 60 * 60 * 24 * 3, status: 'Published', responses: 852, createdBy: '肖主管', createdAt: '2026-05-08', category: '市场', icon: 'BarChart3', description: '用于多渠道线索搜集、客户建档及销售一站式跟进管理系统。' },
  { id: '4', name: 'Alpha 候选名单', updatedAt: '5天前', lastAccessedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, status: 'Archived', responses: 3200, createdBy: '张经理', createdAt: '2026-04-20', category: '人事', icon: 'Briefcase', description: '年度核心管理干部晋升遴选及候选人综合素质评测。' },
];

const mockSavedForms: SavedForm[] = [
  { id: 'f1', projectId: '1', name: '员工基本信息', status: 'Draft', createdAt: '2026-04-10', designer: '陈', type: 'normal' },
  { id: 'f2', projectId: '1', name: '技术评估', status: 'Draft', createdAt: '2026-04-12', designer: '陈', type: 'workflow' },
  { id: 'f3', projectId: '2', name: '产品满意度', status: 'Published', createdAt: '2026-03-20', designer: '莎拉', type: 'normal' },
  { id: 'f4', projectId: '2', name: 'UI 反馈调查', status: 'Published', createdAt: '2026-03-25', designer: '管理员', type: 'report' },
  { id: 'f5', projectId: '3', name: '客户联系表单', status: 'Published', createdAt: '2026-04-01', designer: '李', type: 'normal' },
  { id: 'f6', projectId: '4', name: '候选名单 v1', status: 'Archived', createdAt: '2025-12-15', designer: '陈', type: 'dashboard' },
];

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  type?: 'danger' | 'primary';
}

interface ProjectsViewProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  projectDetailsId: string | null;
  savedForms: SavedForm[];
  isProjectModalOpen: boolean;
  projectToEdit: Project | null;
  newProjectName: string;
  tempProjectName: string;
  editingProjectTitle: boolean;
  setProjectDetailsId: (id: string | null) => void;
  setIsProjectModalOpen: (open: boolean) => void;
  setProjectToEdit: (p: Project | null) => void;
  setNewProjectName: (name: string) => void;
  setTempProjectName: (name: string) => void;
  setEditingProjectTitle: (editing: boolean) => void;
  createOrUpdateProject: (name?: any, category?: string, description?: string, icon?: string) => void;
  deleteProject: (id: string, name: string) => void;
  deleteForm: (id: string, name: string) => void;
  updateProjectName: (id: string, name: string) => void;
  setSelectedProjectId: (id: string) => void;
  openEditor: (id: string | null, type?: FormType) => void;
  confirmModal: ConfirmModalState;
  setConfirmModal: React.Dispatch<React.SetStateAction<ConfirmModalState>>;
  showNotification: (text: string) => void;
  setView: (v: ViewType) => void;
  formFieldsMap?: Record<string, FormField[]>;
  setFormFieldsMap?: React.Dispatch<React.SetStateAction<Record<string, FormField[]>>>;
}

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showNotification: (text: string) => void;
}

interface ConsoleLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  viewToken: ViewType;
  notifications: Array<{ id: number; text: string }>;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  showNotification: (text: string) => void;
  hideHeader?: boolean;
}

interface WorkflowViewProps {
  workflowStatus: string;
  setWorkflowStatus: (status: string) => void;
  workflowInstances: any[];
  setView: (view: ViewType) => void;
}

interface InsightsViewProps {
  showNotification: (text: string) => void;
  workflowStatus: string;
  setWorkflowStatus: (status: string) => void;
  workflowInstances: any[];
  setView: (view: ViewType) => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  deptId: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
}

interface OrgNode {
  id: string;
  name: string;
  children?: OrgNode[];
}

interface TeamViewProps {
  teamMembers: TeamMember[];
  orgData: OrgNode[];
  onAddMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  onAddDept: (parentId: string | null, name: string) => void;
  onUpdateDept: (id: string, name: string) => void;
  onDeleteDept: (id: string) => void;
  showNotification?: (text: string) => void;
}

interface IntegrationsViewProps {
  showNotification: (text: string) => void;
}

interface JsonSchemaModalProps {
  setIsSchemaVisible: (visible: boolean) => void;
  formFields: FormField[];
  showNotification: (text: string) => void;
}

interface AppCenterItem {
  id: string;
  name: string;
  icon: any;
  color: string;
  isBot?: boolean;
  category: string;
}

const APP_CENTER_DATA: AppCenterItem[] = [
  { id: '1', name: '假勤', icon: Calendar, color: 'bg-orange-500', category: '最近使用' },
  { id: '2', name: '审批', icon: ShieldCheck, color: 'bg-orange-600', category: '最近使用' },
  { id: '3', name: '周报', icon: Calendar, color: 'bg-teal-500', category: '最近使用' },
  { id: '4', name: '人事', icon: Zap, color: 'bg-blue-400', category: '最近使用' },
  { id: '5', name: '工单', icon: FormInput, color: 'bg-blue-600', category: '最近使用' },
  { id: '6', name: '物品领用', icon: Briefcase, color: 'bg-orange-400', category: '最近使用' },
  { id: '7', name: '招聘需求', icon: Users, color: 'bg-blue-500', category: '最近使用' },

  { id: '8', name: '帅虾', icon: Users, color: 'bg-green-500', isBot: true, category: '最近使用' },
  { id: '9', name: 'aily 开发后台', icon: Activity, color: 'bg-blue-500', category: '最近使用' },
  { id: '10', name: 'MCP文档授权', icon: Box, color: 'bg-blue-600', isBot: true, category: '项目管理' },
  { id: '11', name: '工作配方', icon: PenTool, color: 'bg-blue-500', category: '项目管理' },
  { id: '12', name: '智能顾问', icon: UserCog, color: 'bg-teal-500', isBot: true, category: '项目管理' },
  { id: '13', name: '行', icon: Smartphone, color: 'bg-blue-500', category: '最近使用' },
  { id: '14', name: 'aPaaS', icon: Layers, color: 'bg-blue-400', category: '最近使用' },
  { id: '15', name: '豆包', icon: MessageCircle, color: 'bg-blue-500', category: '敏捷研发' },

  { id: '16', name: '业务小程序', icon: Smartphone, color: 'bg-purple-500', category: '敏捷研发' },
  { id: '17', name: '捷径', icon: Zap, color: 'bg-teal-400', category: '敏捷研发' },
  { id: '18', name: 'TodoNow', icon: CheckSquare, color: 'bg-red-500', category: '待办工具' },
  { id: '19', name: '多维表格', icon: Layout, color: 'bg-purple-400', category: '问卷调研' },
  { id: '20', name: '审批', icon: ShieldCheck, color: 'bg-orange-500', category: '最近使用' },
  { id: '21', name: '工单', icon: FormInput, color: 'bg-blue-500', category: '客户服务' },
  { id: '22', name: '假勤', icon: Calendar, color: 'bg-orange-500', category: '最近使用' },
  { id: '23', name: '问卷', icon: QrCode, color: 'bg-blue-500', category: '客户管理' },
  
  { id: '24', name: '提醒', icon: Bell, color: 'bg-blue-400', category: '综合人事' },
  { id: '25', name: '汇报', icon: Mail, color: 'bg-blue-500', category: '企业文化' },
  { id: '26', name: '机器人助手', icon: MessageSquare, color: 'bg-green-500', category: '培培训学习' },
  { id: '27', name: '帮助中心', icon: Info, color: 'bg-green-600', category: '财务工具' },
  { id: '28', name: '公告', icon: Radio, color: 'bg-orange-500', category: '法务工具' },
  { id: '29', name: '签到', icon: MapPin, color: 'bg-teal-500', isBot: true, category: '电子合同' },
  { id: '30', name: '日报', icon: FileText, color: 'bg-orange-400', category: '综合行政' },
  { id: '31', name: '周报', icon: Calendar, color: 'bg-teal-500', category: '综合OA' },

  { id: '32', name: '月报', icon: Calendar, color: 'bg-blue-500', category: '最近使用' },
  { id: '33', name: '订阅号', icon: Star, color: 'bg-blue-600', category: '最近使用' },
  { id: '34', name: '服务台', icon: Headphones, color: 'bg-blue-500', category: '最近使用' },
  { id: '35', name: '人事', icon: Zap, color: 'bg-blue-400', category: '最近使用' },
  { id: '36', name: '直播', icon: Play, color: 'bg-blue-500', category: '最近使用' },
  { id: '37', name: '合同', icon: FileBox, color: 'bg-blue-500', category: '最近使用' },
  { id: '38', name: '妙记', icon: Mic, color: 'bg-purple-500', category: '最近使用' },
  { id: '39', name: '词典', icon: BookOpen, color: 'bg-blue-600', category: '最近使用' },

  { id: '40', name: '智能门禁', icon: Lock, color: 'bg-blue-500', category: '最近使用' },
  { id: '41', name: '项目', icon: Link, color: 'bg-blue-600', category: '最近使用' },
  { id: '42', name: 'People', icon: Users, color: 'bg-blue-400', category: '最近使用' },
  { id: '43', name: '物品领用', icon: Briefcase, color: 'bg-orange-500', category: '最近使用' },
  { id: '44', name: '用章用印申请', icon: Shield, color: 'bg-blue-500', category: '最近使用' },
  { id: '45', name: '招聘需求', icon: Users, color: 'bg-blue-500', category: '最近使用' },
  { id: '46', name: '出差申请', icon: Plane, color: 'bg-green-500', category: '最近使用' },
  { id: '47', name: '付款申请', icon: CreditCard, color: 'bg-blue-400', category: '最近使用' },
];

const AppCenterView = () => {
  const [activeCategory, setActiveCategory] = React.useState('最近使用');
  const categories = ['最近使用', '项目管理', '敏捷研发', '待办工具', '问卷调研', '客户服务', '客户管理', '综合人事', '企业文化', '培培训学习', '财务工具', '法务工具', '电子合同', '综合行政', '零/低代码', '电子办公', '综合OA'];

  const featuredApps = APP_CENTER_DATA.slice(0, 7);
  const filteredApps = APP_CENTER_DATA;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full p-8 md:p-10 space-y-10">
        {/* Featured Top Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8 gap-4">
          {featuredApps.map(app => (
            <div key={app.id} className="sleek-card p-4 group transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-4">
              <div className={`${app.color} w-10 min-w-[40px] h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110`}>
                <app.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-on-surface truncate">{app.name}</span>
            </div>
          ))}
          <div className="bg-surface rounded-2xl p-4 border border-outline-variant border-dashed flex items-center gap-4 cursor-pointer hover:bg-surface-container-low group">
             <div className="w-10 min-w-[40px] h-10 rounded-xl bg-surface-container-variant/10 flex items-center justify-center text-outline group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Plus className="w-5 h-5" />
             </div>
             <span className="text-sm font-bold text-outline">添加常用</span>
          </div>
        </div>

        {/* All Apps Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-on-surface">全部应用</h2>
            <div className="flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-0">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`pb-4 px-1 text-sm font-medium transition-all relative shrink-0 ${
                        activeCategory === cat ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {cat}
                      {activeCategory === cat && (
                        <motion.div layoutId="appcenter-tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
                      )}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-5">
             {filteredApps.map(app => (
               <div key={app.id} className="sleek-card p-5 group transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-5">
                     <div className={`${app.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5 transition-transform group-hover:rotate-3`}>
                        <app.icon className="w-7 h-7" />
                     </div>
                     {app.isBot && (
                       <span className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter">机器人</span>
                     )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">{app.name}</h4>
                    {app.isBot && <p className="text-[10px] text-on-surface-variant font-medium">智能助手</p>}
                  </div>
               </div>
             ))}
             
             {/* Fetch more app placeholder */}
             <div className="bg-surface rounded-[24px] p-5 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 text-outline hover:text-primary hover:border-primary/30 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Plus className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">获取应用</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shared UI Components
const Sidebar = ({ currentView, setView }: SidebarProps) => (
  <aside className="w-64 bg-white border-r border-outline-variant flex flex-col shrink-0">
    <div className="p-8 flex items-center gap-2 mb-4">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <LayoutGrid className="text-white w-5 h-5" />
      </div>
      <span className="font-bold text-xl tracking-tighter">自定义表单</span>
    </div>
    
    <nav className="flex-1 space-y-1 px-4">
      {[
        { label: '仪表盘', icon: Activity, view: 'dashboard' },
        { label: '应用管理', icon: FormInput, view: 'projects' },
        { label: '数据管理', icon: FileSpreadsheet, view: 'dataManagement' },
        { label: '数据洞察', icon: BarChart3, view: 'insights' },
        { label: '系统设置', icon: Database, view: 'integrations' },
      ].map((item) => (
        <div 
          key={item.label}
          onClick={() => setView(item.view as ViewType)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm ${
            currentView === item.view 
              ? 'bg-primary/5 text-primary' 
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </div>
      ))}
    </nav>

    <div className="p-4 border-t border-outline-variant">
      <div className="bg-surface-container-low rounded-2xl p-4">
        <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">额度消耗</div>
        <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden mb-2">
          <div className="h-full bg-primary w-3/4"></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold">
          <span>1.2k / 1.5k</span>
          <span className="text-primary cursor-pointer hover:underline">去升级</span>
        </div>
      </div>
      <button 
        onClick={() => setView('landing')}
        className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all font-medium text-sm"
      >
        <label className="w-4 h-4 rotate-180 flex items-center justify-center">
          <ChevronRight className="w-4 h-4" />
        </label>
        返回主页
      </button>
    </div>
  </aside>
);

const DashboardHeader = ({ title, subtitle, showNotification }: DashboardHeaderProps) => (
  <header className="h-20 sleek-glass sticky top-0 z-10 flex items-center shrink-0">
    <div className="w-full px-8 md:px-10 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">{title}</h1>
        {subtitle && <p className="text-xs text-on-surface-variant font-medium">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => showNotification('没有新通知')} className="p-2 hover:bg-surface rounded-full text-on-surface-variant relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
        <div className="relative group">
          <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input 
            type="text" 
            placeholder="搜索控制台..."
            className="bg-surface pl-10 pr-4 py-2 rounded-full text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
          />
        </div>
        <div className="w-px h-6 bg-outline-variant"></div>
        <img 
          src="https://picsum.photos/seed/profile/100/100" 
          className="w-8 h-8 rounded-full ring-2 ring-primary/10 cursor-pointer hover:ring-primary/30 transition-all border border-outline-variant" 
          alt="头像"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  </header>
);

const WorkspaceHeader = ({ title, subtitle, showNotification, setView }: { title: string, subtitle?: string, showNotification: (msg: string) => void, setView: (view: ViewType) => void }) => (
  <header className="h-20 bg-white sticky top-0 z-10 flex items-center shrink-0 border-b border-outline-variant/60 shadow-sm">
    <div className="w-full px-8 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div 
          onClick={() => setView('landing')} 
          className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-all group"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <LayoutGrid className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tighter">自定义表单</span>
        </div>
        <div className="w-px h-6 bg-outline-variant"></div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-on-surface flex items-center gap-2">
            {title}
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">工作台模式</span>
          </h1>
          {subtitle && <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Highly visible Back to Home action button */}
        <button 
          onClick={() => setView('landing')}
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary rounded-xl text-xs font-bold transition-all shadow-sm bg-white hover:bg-primary/5 active:scale-95 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>返回主页</span>
        </button>
        <div className="w-px h-6 bg-outline-variant"></div>
        <button onClick={() => showNotification('没有新通知')} className="p-2 hover:bg-surface rounded-full text-on-surface-variant relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
        <img 
          src="https://picsum.photos/seed/profile/100/100" 
          className="w-8 h-8 rounded-full ring-2 ring-primary/10 cursor-pointer hover:ring-primary/30 transition-all border border-outline-variant" 
          alt="头像"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  </header>
);

const WorkspaceLayout = ({ children, title, subtitle, viewToken, notifications, currentView, setView, showNotification }: ConsoleLayoutProps) => (
  <div className="flex flex-col h-screen bg-surface overflow-hidden text-on-surface select-none">
    <WorkspaceHeader title={title} subtitle={subtitle} showNotification={showNotification} setView={setView} />
    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-surface-container-lowest">
      <AnimatePresence mode="wait">
        <motion.div
          key={viewToken}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      <div className="fixed bottom-8 right-8 space-y-2 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-on-surface text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm pointer-events-auto border border-outline-variant/10"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              {n.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  </div>
);

const ConsoleLayout = ({ children, title, subtitle, viewToken, notifications, currentView, setView, showNotification, hideHeader }: ConsoleLayoutProps) => (
  <div className="flex h-screen bg-surface overflow-hidden text-on-surface select-none">
    <Sidebar currentView={currentView} setView={setView} />
    <main className={`flex-1 flex flex-col min-w-0 relative ${hideHeader ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      {!hideHeader && <DashboardHeader title={title} subtitle={subtitle} showNotification={showNotification} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewToken}
          className={hideHeader ? "h-full w-full flex flex-col overflow-hidden" : ""}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      <div className="fixed bottom-8 right-8 space-y-2 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-on-surface text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm pointer-events-auto border border-outline-variant/10"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              {n.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  </div>
);

const JsonSchemaModal = ({ setIsSchemaVisible, formFields, showNotification }: JsonSchemaModalProps) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/40 backdrop-blur-md"
    onClick={() => setIsSchemaVisible(false)}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-outline-variant"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg tracking-tight">JSON 定义</span>
        </div>
        <button onClick={() => setIsSchemaVisible(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 overflow-y-auto flex-1 bg-on-surface text-surface-container-low font-mono text-xs leading-relaxed">
        <pre>{JSON.stringify({
          formTitle: "架构定义",
          version: "2.0.4-草稿",
          fields: formFields
        }, null, 2)}</pre>
      </div>
      <div className="p-6 border-t border-outline-variant bg-surface flex justify-end gap-3">
        <button 
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(formFields));
            showNotification('架构已复制到剪贴板');
          }}
          className="px-6 py-2 border border-outline-variant rounded-xl text-xs font-bold hover:bg-white transition-all"
        >
          复制 JSON
        </button>
        <button 
          onClick={() => setIsSchemaVisible(false)}
          className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold transition-all"
        >
          关闭
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const GlobalSettingsModal = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab,
  config,
  setConfig,
  formFields,
  showNotification
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  activeTab: 'workflow' | 'permissions'; 
  setActiveTab: (tab: 'workflow' | 'permissions') => void;
  config: WorkflowGlobalConfig;
  setConfig: React.Dispatch<React.SetStateAction<WorkflowGlobalConfig>>;
  formFields: FormField[];
  showNotification: (msg: string) => void;
}) => {
  if (!isOpen) return null;

  // Form field options for trigger rules
  const fieldOptions = formFields.length > 0 
    ? formFields.map(f => ({ id: f.id, label: f.label }))
    : [
        { id: 'f-1', label: '报销总金额' },
        { id: 'f-2', label: '申请部门' },
        { id: 'f-3', label: '紧急程度' },
        { id: 'f-4', label: '请假天数' },
      ];

  const handleAddRule = () => {
    const defaultField = fieldOptions[0];
    const newRule: TriggerRule = {
      id: 'tr-' + Date.now(),
      fieldId: defaultField.id,
      fieldLabel: defaultField.label,
      operator: '大于',
      value: '1000'
    };
    setConfig(prev => ({
      ...prev,
      triggerRules: [...prev.triggerRules, newRule]
    }));
  };

  const handleUpdateRule = (id: string, updates: Partial<TriggerRule>) => {
    setConfig(prev => ({
      ...prev,
      triggerRules: prev.triggerRules.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const handleRemoveRule = (id: string) => {
    setConfig(prev => ({
      ...prev,
      triggerRules: prev.triggerRules.filter(r => r.id !== id)
    }));
  };

  const handleToggleNoticeChannel = (channel: 'station' | 'email' | 'sms') => {
    setConfig(prev => {
      const exists = prev.timeoutNoticeChannels.includes(channel);
      return {
        ...prev,
        timeoutNoticeChannels: exists 
          ? prev.timeoutNoticeChannels.filter(c => c !== channel)
          : [...prev.timeoutNoticeChannels, channel]
      };
    });
  };

  const handleToggleTimeoutChannel = (channel: 'station' | 'email' | 'sms') => {
    setConfig(prev => {
      const exists = prev.timeoutChannels.includes(channel);
      return {
        ...prev,
        timeoutChannels: exists 
          ? prev.timeoutChannels.filter(c => c !== channel)
          : [...prev.timeoutChannels, channel]
      };
    });
  };

  const handleSave = () => {
    showNotification('审批流全局配置已保存成功！');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        <header className="px-8 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">审批流全局配置</h2>
              <p className="text-[11px] text-on-surface-variant font-medium">定制触发规则、审批策略、自动审批、撤回控制及超时预警</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
            <X className="w-5 h-5 text-outline" />
          </button>
        </header>

        <div className="p-2 bg-surface-container-low flex border-b border-outline-variant">
           <button 
             onClick={() => setActiveTab('workflow')}
             className={`flex-1 py-2.5 text-xs font-bold transition-all rounded-lg flex items-center justify-center gap-2 ${activeTab === 'workflow' ? 'bg-primary text-white shadow-md' : 'text-outline hover:text-on-surface'}`}
           >
             <Workflow className="w-4 h-4" />
             <span>审批流全局规则</span>
           </button>
           <button 
             onClick={() => setActiveTab('permissions')}
             className={`flex-1 py-2.5 text-xs font-bold transition-all rounded-lg flex items-center justify-center gap-2 ${activeTab === 'permissions' ? 'bg-primary text-white shadow-md' : 'text-outline hover:text-on-surface'}`}
           >
             <Shield className="w-4 h-4" />
             <span>节点查看态字段权限</span>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {activeTab === 'workflow' ? (
            <div className="space-y-8">
              {/* 1. 触发规则 */}
              <section className="bg-surface/50 border border-outline-variant/80 rounded-2xl p-6 space-y-4 shadow-sm hover:border-primary/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-2">
                        触发规则
                        <span className="text-[10px] font-normal text-outline">（按表单字段动态触发）</span>
                      </h3>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">支持按照表单里的字段，动态配置流程触发的规则</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-surface border border-outline-variant p-1 rounded-xl shrink-0">
                    <button 
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, triggerMatchMode: 'ALL' }))}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${config.triggerMatchMode === 'ALL' ? 'bg-primary text-white shadow-sm' : 'text-outline hover:text-on-surface'}`}
                    >
                      满足所有条件 (AND)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, triggerMatchMode: 'ANY' }))}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${config.triggerMatchMode === 'ANY' ? 'bg-primary text-white shadow-sm' : 'text-outline hover:text-on-surface'}`}
                    >
                      满足任意条件 (OR)
                    </button>
                  </div>
                </div>

                {config.triggerRules.length === 0 ? (
                  <div className="p-6 border border-dashed border-outline-variant rounded-xl text-center bg-white/60 space-y-2">
                    <Sliders className="w-8 h-8 text-outline mx-auto opacity-50" />
                    <p className="text-xs font-bold text-on-surface-variant">暂未配置触发规则</p>
                    <p className="text-[10px] text-outline font-medium">表单提交后将默认直接触发流程</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {config.triggerRules.map((rule, idx) => (
                      <div key={rule.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-white border border-outline-variant rounded-xl shadow-xs">
                        <div className="text-[10px] font-bold text-outline w-6 shrink-0">#{idx + 1}</div>
                        
                        {/* Field Selector */}
                        <div className="flex-1 min-w-[140px]">
                          <select 
                            value={rule.fieldId}
                            onChange={(e) => {
                              const sel = fieldOptions.find(f => f.id === e.target.value);
                              handleUpdateRule(rule.id, { fieldId: e.target.value, fieldLabel: sel ? sel.label : e.target.value });
                            }}
                            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                          >
                            {fieldOptions.map(f => (
                              <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Operator Selector */}
                        <div className="w-32">
                          <select 
                            value={rule.operator}
                            onChange={(e) => handleUpdateRule(rule.id, { operator: e.target.value as any })}
                            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                          >
                            {['等于', '不等于', '大于', '小于', '大于等于', '小于等于', '包含', '不包含', '不为空'].map(op => (
                              <option key={op} value={op}>{op}</option>
                            ))}
                          </select>
                        </div>

                        {/* Value Input */}
                        <div className="flex-1 min-w-[120px]">
                          <input 
                            disabled={rule.operator === '不为空'}
                            value={rule.value}
                            onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                            placeholder={rule.operator === '不为空' ? '无需比较值' : '触发比较值'}
                            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-surface-container-low disabled:text-outline"
                          />
                        </div>

                        {/* Delete Action */}
                        <button 
                          type="button"
                          onClick={() => handleRemoveRule(rule.id)}
                          className="p-2 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-all shrink-0"
                          title="删除规则"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  type="button"
                  onClick={handleAddRule}
                  className="flex items-center gap-1.5 text-primary text-xs font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>添加触发规则</span>
                </button>
              </section>

              {/* 2. 审批策略 */}
              <section className="bg-surface/50 border border-outline-variant/80 rounded-2xl p-6 space-y-4 shadow-sm hover:border-primary/30 transition-all">
                <div className="flex items-center gap-2.5 border-b border-outline-variant pb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface">审批策略</h3>
                    <p className="text-[11px] text-on-surface-variant font-medium">配置审批过程中的转批、失败处理及超时提醒</p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-1">
                  {/* (1) 流程审批过程中允许审批人转批 */}
                  <label className="flex items-start gap-3.5 p-3.5 bg-white border border-outline-variant rounded-xl cursor-pointer hover:border-primary/40 transition-all">
                    <input 
                      type="checkbox" 
                      checked={config.allowTransfer}
                      onChange={(e) => setConfig(prev => ({ ...prev, allowTransfer: e.target.checked }))}
                      className="w-4 h-4 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary" 
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-on-surface">(1) 流程审批过程中允许审批人转批</span>
                      <p className="text-[11px] text-on-surface-variant font-medium">开启后，审批节点责任人可将当前审批单手动转交给其他人代办签署</p>
                    </div>
                  </label>

                  {/* (2) 运行失败时终止后续操作 */}
                  <label className="flex items-start gap-3.5 p-3.5 bg-white border border-outline-variant rounded-xl cursor-pointer hover:border-primary/40 transition-all">
                    <input 
                      type="checkbox" 
                      checked={config.terminateOnFailure}
                      onChange={(e) => setConfig(prev => ({ ...prev, terminateOnFailure: e.target.checked }))}
                      className="w-4 h-4 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary" 
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-on-surface">(2) 运行失败时终止后续操作</span>
                      <p className="text-[11px] text-on-surface-variant font-medium">当自动化关联脚本或后端服务运行出现异常时，终止后续节点推进</p>
                    </div>
                  </label>

                  {/* (3) 审批超时提醒 */}
                  <div className="p-3.5 bg-white border border-outline-variant rounded-xl space-y-3">
                    <label className="flex items-start gap-3.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.enableTimeoutNotice}
                        onChange={(e) => setConfig(prev => ({ ...prev, enableTimeoutNotice: e.target.checked }))}
                        className="w-4 h-4 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary" 
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-on-surface">(3) 审批超时提醒</span>
                        <p className="text-[11px] text-on-surface-variant font-medium">到达超时时间后向审批人推送催办通知</p>
                      </div>
                    </label>

                    {config.enableTimeoutNotice && (
                      <div className="pl-8 pt-2.5 border-t border-dashed border-outline-variant flex flex-wrap items-center gap-6">
                        <span className="text-[11px] font-bold text-outline">选择通知管道：</span>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                          <input 
                            type="checkbox" 
                            checked={config.timeoutNoticeChannels.includes('station')}
                            onChange={() => handleToggleNoticeChannel('station')}
                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                          />
                          <span>站内信</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                          <input 
                            type="checkbox" 
                            checked={config.timeoutNoticeChannels.includes('email')}
                            onChange={() => handleToggleNoticeChannel('email')}
                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                          />
                          <span>发邮件</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                          <input 
                            type="checkbox" 
                            checked={config.timeoutNoticeChannels.includes('sms')}
                            onChange={() => handleToggleNoticeChannel('sms')}
                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                          />
                          <span>发短信</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* 3. 自动审批 */}
              <section className="bg-surface/50 border border-outline-variant/80 rounded-2xl p-6 space-y-4 shadow-sm hover:border-primary/30 transition-all">
                <div className="flex items-center gap-2.5 border-b border-outline-variant pb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface">自动审批</h3>
                    <p className="text-[11px] text-on-surface-variant font-medium">配置符合特定规则时的免人工无缝自动签署机制</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-1">
                  {[
                    { id: 'none', label: '(1) 不允许自动审批', desc: '所有节点的审批必须由对应的责任人员手动签署确认' },
                    { id: 'initiator_all', label: '(2) 所有节点的审批人与发起人为同一个人时自动审批', desc: '若后续所有审批节点的处理人均是单据提交人本人，自动跳过免审通过' },
                    { id: 'adjacent_same', label: '(3) 相邻节点的审批人相同时自动审批', desc: '当连续相邻节点的审批人完全相同时，后一节点无需二次点击自动签署' },
                    { id: 'approved_before', label: '(4) 已执行过审批的审批人自动审批', desc: '同一审批人在该流程的前置节点已做过同意决定，后续节点再次遇到时自动签署' },
                  ].map((item) => (
                    <label 
                      key={item.id} 
                      className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        config.autoApprovalMode === item.id 
                          ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20' 
                          : 'bg-white border-outline-variant hover:border-outline'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="autoApprovalMode"
                        checked={config.autoApprovalMode === item.id}
                        onChange={() => setConfig(prev => ({ ...prev, autoApprovalMode: item.id as any }))}
                        className="w-4 h-4 mt-0.5 text-primary focus:ring-primary shrink-0"
                      />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-on-surface">{item.label}</div>
                        <div className="text-[11px] text-on-surface-variant font-medium">{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* 4. 审批撤回 */}
              <section className="bg-surface/50 border border-outline-variant/80 rounded-2xl p-6 space-y-4 shadow-sm hover:border-primary/30 transition-all">
                <div className="flex items-center gap-2.5 border-b border-outline-variant pb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface">审批撤回</h3>
                    <p className="text-[11px] text-on-surface-variant font-medium">配置流程流转中单据撤回规则与无痕记录策略</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    { id: 'none', label: '(1) 不允许撤回审批', desc: '单据提交后即进入冻结处理状态，禁止撤回' },
                    { id: 'initiator_only', label: '(2) 仅允许发起节点撤回审批', desc: '仅允许发起人在首节点尚未被处理前主动撤回' },
                    { id: 'all_nodes', label: '(3) 所有节点可撤回', desc: '任意已审节点在后序节点尚未处理前均允许向后撤回' },
                  ].map((item) => (
                    <label 
                      key={item.id} 
                      className={`flex flex-col p-3.5 rounded-xl border transition-all cursor-pointer ${
                        config.recallMode === item.id 
                          ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20' 
                          : 'bg-white border-outline-variant hover:border-outline'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <input 
                          type="radio" 
                          name="recallMode"
                          checked={config.recallMode === item.id}
                          onChange={() => setConfig(prev => ({ ...prev, recallMode: item.id as any }))}
                          className="w-4 h-4 text-primary focus:ring-primary shrink-0"
                        />
                        <span className="text-xs font-bold text-on-surface leading-tight">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-medium pl-6 leading-relaxed">{item.desc}</span>
                    </label>
                  ))}
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-3 p-3 bg-white border border-outline-variant rounded-xl cursor-pointer hover:border-primary/30 transition-all">
                    <input 
                      type="checkbox" 
                      checked={config.silentRecall}
                      onChange={(e) => setConfig(prev => ({ ...prev, silentRecall: e.target.checked }))}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-xs font-bold text-on-surface-variant">开启无痕撤回 (撤回记录不在公开审批历史中展示)</span>
                  </label>
                </div>
              </section>

              {/* 5. 超时设置 */}
              <section className="bg-surface/50 border border-outline-variant/80 rounded-2xl p-6 space-y-4 shadow-sm hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-xs">
                      5
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-on-surface">超时设置</h3>
                      <p className="text-[11px] text-on-surface-variant font-medium">以小时为单位设置超时时限，并配置超时提醒通道</p>
                    </div>
                  </div>

                  {/* Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.enableTimeoutSettings}
                      onChange={(e) => setConfig(prev => ({ ...prev, enableTimeoutSettings: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {config.enableTimeoutSettings ? (
                  <div className="space-y-4 pt-1">
                    {/* (1) 超时时间（小时） */}
                    <div className="p-4 bg-white border border-outline-variant rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>(1) 开启则以小时为单位，设置超时时间：</span>
                        </label>
                        <span className="text-[11px] font-mono font-extrabold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                          {config.timeoutHours}h ({Math.round((config.timeoutHours / 24) * 10) / 10} 天)
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            min="1"
                            max="720"
                            value={config.timeoutHours}
                            onChange={(e) => setConfig(prev => ({ ...prev, timeoutHours: Math.max(1, parseInt(e.target.value) || 1) }))}
                            className="w-28 bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                          <span className="text-xs font-bold text-outline">h</span>
                        </div>

                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            { h: 6, label: '6h' },
                            { h: 12, label: '12h' },
                            { h: 24, label: '24h (1天)' },
                            { h: 48, label: '48h (2天)' },
                            { h: 72, label: '72h (3天)' },
                          ].map(preset => (
                            <button
                              key={preset.h}
                              type="button"
                              onClick={() => setConfig(prev => ({ ...prev, timeoutHours: preset.h }))}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                config.timeoutHours === preset.h 
                                  ? 'bg-primary text-white shadow-xs' 
                                  : 'bg-surface hover:bg-surface-container border border-outline-variant text-outline'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* (2) 选择超时提醒方式 */}
                    <div className="p-4 bg-white border border-outline-variant rounded-xl space-y-3">
                      <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-500" />
                        <span>(2) 选择超时提醒方式：</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 pl-1">
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-on-surface">
                          <input 
                            type="checkbox" 
                            checked={config.timeoutChannels.includes('station')}
                            onChange={() => handleToggleTimeoutChannel('station')}
                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                          />
                          <span>站内信提醒</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-on-surface">
                          <input 
                            type="checkbox" 
                            checked={config.timeoutChannels.includes('sms')}
                            onChange={() => handleToggleTimeoutChannel('sms')}
                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                          />
                          <span>短信提醒</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-on-surface">
                          <input 
                            type="checkbox" 
                            checked={config.timeoutChannels.includes('email')}
                            onChange={() => handleToggleTimeoutChannel('email')}
                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                          />
                          <span>邮件提醒</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-outline-variant rounded-xl text-center bg-white/40">
                    <p className="text-xs font-bold text-outline">超时处理设置已关闭</p>
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <h3 className="text-sm font-bold text-on-surface">查看态字段权限</h3>
                     <Info className="w-3.5 h-3.5 text-outline" />
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                     非当前节点人员查看审批页面时的字段权限 <br/>
                     如需针对不同成员配置不同的字段权限，请到“权限设置”中配置 <span className="text-primary cursor-pointer hover:underline">去设置</span>
                  </div>
                  <div className="flex justify-end">
                     <button className="text-[10px] text-primary font-bold">同步表单组件状态</button>
                  </div>
               </div>

               <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm bg-white">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-surface text-[10px] uppercase font-bold text-outline border-b border-outline-variant">
                          <th className="px-6 py-4">组件名称</th>
                          <th className="px-6 py-4 text-center">可编辑</th>
                          <th className="px-6 py-4 text-center">只读</th>
                          <th className="px-6 py-4 text-center">隐藏</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-[11px] font-bold">
                       {(formFields.length > 0 ? formFields.map(f => ({ name: f.label, type: f.type })) : [
                          { name: '全选', type: 'checkbox' },
                          { name: '申请人', type: 'radio', value: 'read' },
                          { name: '申请部门', type: 'radio', value: 'read' },
                          { name: '申请日期', type: 'radio', value: 'read' },
                          { name: '领用明细', type: 'radio', value: 'read' },
                          { name: '附件', type: 'radio', value: 'read' },
                       ]).map((row, i) => (
                          <tr key={i} className="hover:bg-surface/50 transition-colors">
                             <td className="px-6 py-4 text-on-surface font-extrabold">{row.name}</td>
                             <td className="px-6 py-4 text-center">
                                <input type="radio" name={`perm-${i}`} className="w-4 h-4 border-outline-variant mx-auto text-primary" />
                             </td>
                             <td className="px-6 py-4 text-center">
                                <input type="radio" name={`perm-${i}`} defaultChecked className="w-4 h-4 border-outline-variant mx-auto text-primary" />
                             </td>
                             <td className="px-6 py-4 text-center">
                                <input type="radio" name={`perm-${i}`} className="w-4 h-4 border-outline-variant mx-auto text-primary" />
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}
        </div>

        <footer className="p-6 border-t border-outline-variant bg-surface flex justify-between items-center shrink-0">
          <button 
            type="button"
            onClick={() => {
              setConfig({
                triggerRules: [
                  { id: 'tr-1', fieldId: 'amount', fieldLabel: '报销总金额', operator: '大于', value: '1000' }
                ],
                triggerMatchMode: 'ALL',
                allowTransfer: true,
                terminateOnFailure: true,
                enableTimeoutNotice: true,
                timeoutNoticeChannels: ['station', 'email'],
                autoApprovalMode: 'adjacent_same',
                recallMode: 'initiator_only',
                silentRecall: false,
                enableTimeoutSettings: true,
                timeoutHours: 24,
                timeoutChannels: ['station', 'email', 'sms'],
              });
              showNotification('已恢复审批流默认全局配置');
            }}
            className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-bold text-outline hover:text-on-surface hover:bg-surface-container-low transition-all cursor-pointer"
          >
            恢复默认
          </button>

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose} 
              className="px-6 py-2.5 border border-outline-variant rounded-xl text-xs font-bold hover:bg-surface-container-low transition-all cursor-pointer"
            >
              取消
            </button>
            <button 
              type="button"
              onClick={handleSave} 
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer"
            >
              保存设置
            </button>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

const ConfirmDialog = ({ confirmModal, setConfirmModal }: { confirmModal: ConfirmModalState, setConfirmModal: React.Dispatch<React.SetStateAction<ConfirmModalState>> }) => (
  <AnimatePresence>
    {confirmModal.isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm"
        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-outline-variant p-8 space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-on-surface">{confirmModal.title}</h3>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              {confirmModal.message}
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="px-6 py-2 border border-outline-variant rounded-xl text-xs font-bold hover:bg-surface-container-low transition-all text-on-surface"
            >
              取消
            </button>
            <button 
              onClick={confirmModal.onConfirm}
              className={`px-6 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg hover:shadow-xl ${
                confirmModal.type === 'danger' ? 'bg-error' : 'bg-primary'
              }`}
            >
              {confirmModal.confirmText || '确认'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const iconMap: Record<string, React.ComponentType<any>> = {
  Briefcase,
  Users,
  Zap,
  Building2,
  CreditCard,
  BarChart3,
  CheckSquare,
  Globe,
  Compass,
  FileText,
  Layout,
  MessageSquare,
  Heart,
  ShoppingBag,
  Users2,
  Database,
  Workflow,
  FormInput
};

const selectableIcons = [
  { key: 'Briefcase', label: '主要业务', desc: '用于通用业务场景及核心功能归口' },
  { key: 'Users', label: '人事管理', desc: '用于考勤、招聘及入离转调事项' },
  { key: 'Zap', label: '效率工具', desc: '用于自动化、快捷审批及捷径流' },
  { key: 'Building2', label: '企业行政', desc: '用于资产领用、用车印章等行政辅助' },
  { key: 'CreditCard', label: '财务报销', desc: '用于发票对账、项目预算、借款审批' },
  { key: 'BarChart3', label: '数据大屏', desc: '用于多维度图表、指标分析及监控' },
  { key: 'CheckSquare', label: '任务协作', desc: '用于敏捷待办、项目看板及进度追踪' },
  { key: 'Globe', label: '外部平台', desc: '用于跨组织协同、公开网址及门户' },
  { key: 'Compass', label: '新手指南', desc: '用于问卷调研、日常签到等应用' },
  { key: 'FileText', label: '知识文档', desc: '用于汇报材料、规范要求及文章发布' },
  { key: 'Layout', label: '通用布局', desc: '用于看板展示、模块卡片导航' },
  { key: 'MessageSquare', label: '反馈渠道', desc: '用于提诉求、意见箱、用户答疑' },
  { key: 'Heart', label: '员工关怀', desc: '用于福利、团建、投票及文化建设' },
  { key: 'ShoppingBag', label: '供应链采购', desc: '用于采购、仓储、领料及入库流程' },
  { key: 'Users2', label: '外部协同', desc: '用于客户管理、伙伴比价及供应商库' },
  { key: 'Database', label: '业务台账', desc: '用于结构化数据及底层记录表格' },
  { key: 'Workflow', label: '审批工作流', desc: '用于多级主管并行或串行会签' },
  { key: 'FormInput', label: '数据收集', desc: '用于标准属性采集、表单填报' }
];

const ProjectsView = ({
  projects,
  setProjects,
  projectDetailsId,
  savedForms,
  isProjectModalOpen,
  projectToEdit,
  newProjectName,
  tempProjectName,
  editingProjectTitle,
  setProjectDetailsId,
  setIsProjectModalOpen,
  setProjectToEdit,
  setNewProjectName,
  setTempProjectName,
  setEditingProjectTitle,
  createOrUpdateProject,
  deleteProject,
  deleteForm,
  updateProjectName,
  setSelectedProjectId,
  openEditor,
  showNotification,
  setView,
  formFieldsMap = {},
  setFormFieldsMap
}: ProjectsViewProps) => {
  const [activeTab, setActiveTab] = React.useState<'recent' | 'mine' | 'all'>('recent');
  const [showNewFormDropdown, setShowNewFormDropdown] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'normal' | 'workflow' | 'report' | 'dashboard'>('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'Published' | 'Draft'>('all');

  // App Details Page layout states
  const [activeFormId, setActiveFormId] = React.useState<string | null>(null);
  const [isUnpublishedExpanded, setIsUnpublishedExpanded] = React.useState(true);
  const [isPublishedExpanded, setIsPublishedExpanded] = React.useState(true);
  const [formSearchQuery, setFormSearchQuery] = React.useState('');
  const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'mobile'>('desktop');

  // Search states for project listings
  const [projectSearchQuery, setProjectSearchQuery] = React.useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = React.useState<string>('all');
  const [newProjectCategory, setNewProjectCategory] = React.useState<string>('其他');
  const [showTemplatesPage, setShowTemplatesPage] = React.useState(false);

  // Local state for Create / Edit Modal Fields details
  const [modalName, setModalName] = React.useState('');
  const [modalCategory, setModalCategory] = React.useState('其他');
  const [modalDesc, setModalDesc] = React.useState('');
  const [modalIcon, setModalIcon] = React.useState('Briefcase');
  const [isIconSelectorOpen, setIsIconSelectorOpen] = React.useState(false);

  React.useEffect(() => {
    if (isProjectModalOpen) {
      if (projectToEdit) {
        setModalName(projectToEdit.name || '');
        setModalCategory(projectToEdit.category || '其他');
        setModalDesc(projectToEdit.description || '');
        setModalIcon(projectToEdit.icon || 'Briefcase');
      } else {
        setModalName('');
        setModalCategory('其他');
        setModalDesc('');
        setModalIcon('Briefcase');
      }
    }
  }, [isProjectModalOpen, projectToEdit]);

  React.useEffect(() => {
    if (projectDetailsId) {
      const pForms = savedForms.filter(f => f.projectId === projectDetailsId);
      if (pForms.length > 0) {
        if (!activeFormId || !pForms.some(f => f.id === activeFormId)) {
          setActiveFormId(pForms[0].id);
        }
      } else {
        setActiveFormId(null);
      }
    } else {
      setActiveFormId(null);
    }
  }, [projectDetailsId, savedForms]);
  
  const selectedProject = projects.find(p => p.id === projectDetailsId);
  const rawProjectForms = savedForms.filter(f => f.projectId === projectDetailsId);

  const stats = {
    total: rawProjectForms.length,
    normal: rawProjectForms.filter(f => f.type === 'normal').length,
    workflow: rawProjectForms.filter(f => f.type === 'workflow').length,
    report: rawProjectForms.filter(f => f.type === 'report').length,
    dashboard: rawProjectForms.filter(f => f.type === 'dashboard').length,
  };

  const projectForms = rawProjectForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || form.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const templates = [
    { id: 't1', title: '全能 HR 数字化套件', category: '人事', desc: '包含招聘、转正、绩效及员工全生命周期管理', color: 'bg-gradient-to-br from-indigo-500 to-blue-600' },
    { id: 't2', title: '行政后勤管理审批系统', category: '行政', desc: '用车审批、接待申请、印章申请等行政日常事务流', color: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
    { id: 't3', title: '全渠道订单与财务协同系统', category: '财务', desc: '打通线上线下订单流转，自动生成财务对账流', color: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
    { id: 't4', title: '全渠道数据洞察大屏', category: '协同办公', desc: '任务分办、进度追踪、自动催办与效能统计报告', color: 'bg-gradient-to-br from-violet-500 to-purple-600' },
    { id: 't5', title: '智慧工厂生产设备巡检系统', category: '工厂', desc: '标准化巡检路径、移动设备拍照、异动上报闭环', color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
    { id: 't6', title: '大型市场营销策划流', category: '市场', desc: '资源申请、比价、现场执行、物料盘点一站式管理', color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
    { id: 't7', title: '全员意见反馈与问卷调查', category: '问卷调查', desc: '五围立体评分，极速分发问卷并聚合多重视角大屏数据', color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
    { id: 't8', title: '组织全员季度绩效评测系统', category: '绩效', desc: '自评、环评、主管面谈、打分核算全场景数字化对齐', color: 'bg-gradient-to-br from-rose-500 to-red-600' },
  ];

  // Filtering projects listing:
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(projectSearchQuery.toLowerCase());
    const matchesCategory = projectCategoryFilter === 'all' || project.category === projectCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const displayedProjects = activeTab === 'recent' 
    ? [...filteredProjects].sort((a,b) => b.lastAccessedAt - a.lastAccessedAt).slice(0, 3) 
    : filteredProjects;

  if (showTemplatesPage) {
    return (
      <div className="w-full p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-6">
          <div className="space-y-1">
            <button 
              onClick={() => setShowTemplatesPage(false)}
              className="group flex items-center gap-2 text-xs font-bold text-outline hover:text-primary transition-all mb-2"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回应用管理
            </button>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">系统默认模板中心</h2>
            <p className="text-sm text-outline font-medium">挑选适合您业务场景的开箱即用行业级应用模版</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
           {templates.map((tpl, idx) => (
            <motion.div 
              key={tpl.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group overflow-hidden border border-outline-variant hover:border-primary/40 transition-all flex flex-col h-full bg-white rounded-3xl shadow-sm hover:shadow-xl"
            >
               <div className={`h-36 ${tpl.color} relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 opacity-15 flex flex-wrap gap-4 p-4">
                     {Array.from({ length: 48 }).map((_, i) => (
                       <LayoutGrid key={i} className="w-8 h-8 rotate-12 text-white" />
                     ))}
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10 z-10">
                     <LayoutGrid className="w-7 h-7 animate-pulse text-white" />
                  </div>
               </div>
               <div className="p-6 flex-1 flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-full border border-primary/25">{tpl.category}</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors text-on-surface">{tpl.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed flex-1 font-medium">{tpl.desc}</p>
                  <button 
                    onClick={() => {
                      const newProjId = `p-tpl-${Date.now()}`;
                      const tplIcons: Record<string, string> = {
                        t1: 'Users',
                        t2: 'Building2',
                        t3: 'CreditCard',
                        t4: 'BarChart3',
                        t5: 'Database',
                        t6: 'Zap',
                        t7: 'MessageSquare',
                        t8: 'Heart',
                      };
                      const newTplProject: Project = {
                        id: newProjId,
                        name: tpl.title,
                        updatedAt: '刚刚',
                        lastAccessedAt: Date.now(),
                        status: 'Published',
                        responses: 0,
                        createdBy: '系统预置',
                        createdAt: new Date().toISOString().split('T')[0],
                        category: tpl.category as any,
                        description: tpl.desc,
                        icon: tplIcons[tpl.id] || 'Briefcase'
                      };
                      setProjects(prev => [newTplProject, ...prev]);
                      showNotification(`模版 “${tpl.title}” 快速部署成功！`);
                      setShowTemplatesPage(false);
                      setActiveTab('all');
                    }}
                    className="w-full py-3 bg-on-surface hover:bg-primary text-white bg-on-surface rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md hover:shadow-lg hover:text-white"
                  >
                    <Plus className="w-4 h-4 text-white" /> 快速部署
                  </button>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return !projectDetailsId ? (
    <div className="w-full p-8 md:p-10 space-y-8">
          {/* Top Bar Actions: Template Center Left to Create Project */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mb-4">
            <button 
              onClick={() => {
                setShowTemplatesPage(true);
              }}
              className="px-6 py-4 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2.5"
            >
              <LayoutGrid className="w-5 h-5 text-primary" /> 模板中心
            </button>

            <button 
              onClick={() => {
                setProjectToEdit(null);
                setNewProjectName('');
                setNewProjectCategory('其他');
                setIsProjectModalOpen(true);
              }}
              className="px-8 py-4 bg-on-surface text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:shadow-2xl hover:shadow-on-surface/20 flex items-center justify-center gap-3 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 创建新应用
            </button>
          </div>

          {/* Type Filter and Search Query Container */}
          <div className="space-y-4">
            {/* Tabs Selector: "模板中心" Tab removed, replaced by "全部" (All) */}
            <div className="flex items-center gap-4 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/60 w-fit">
              {[
                { id: 'recent', label: '最近访问', icon: Clock },
                { id: 'mine', label: '我的应用', icon: Briefcase },
                { id: 'all', label: '全部', icon: Compass },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
                    activeTab === tab.id ? 'bg-white text-primary shadow-sm border border-outline-variant' : 'text-outline hover:text-on-surface hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter Conditions Area */}
            <div className="bg-white border border-outline-variant rounded-[2.5rem] p-4 flex flex-col lg:flex-row items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="relative flex-1 group w-full lg:w-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input 
                    type="text" 
                    placeholder="按应用名称搜索应用..."
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-surface rounded-2xl text-xs font-bold border-none focus:ring-2 focus:ring-primary/10 transition-all outline-none text-on-surface"
                  />
               </div>
               <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
                  {['all', '行政', '人事', '财务', '市场', '工厂', '问卷调查', '绩效', '协同办公', '其他'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProjectCategoryFilter(cat)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        projectCategoryFilter === cat ? 'bg-primary text-white shadow-lg' : 'bg-surface text-outline hover:text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      {cat === 'all' ? '全部类型' : cat}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Cards List Display Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans">
            {displayedProjects.map((project, idx) => {
              const IconComponent = iconMap[project.icon || ''] || Briefcase;
              return (
                <motion.div 
                  key={project.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white border border-outline-variant hover:border-primary/40 rounded-[2.5rem] p-8 flex flex-col gap-6 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer"
                  onClick={() => setProjectDetailsId(project.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-surface-container-low rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-outline-variant/60">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToEdit(project);
                          setNewProjectName(project.name);
                          setNewProjectCategory(project.category || '其他');
                          setIsProjectModalOpen(true);
                        }}
                        className="p-3 bg-white border border-outline-variant hover:border-primary hover:text-primary rounded-xl transition-all shadow-sm"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id, project.name);
                        }}
                        className="p-3 bg-white border border-outline-variant hover:border-error hover:text-error rounded-xl transition-all shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-2xl tracking-tighter group-hover:text-primary transition-colors mb-2 text-on-surface line-clamp-1">{project.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-full border border-primary/20 inline-block">
                        {project.category || '其他'}
                      </span>
                    </div>

                    {project.description ? (
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-4 line-clamp-2 min-h-[2rem]">
                        {project.description}
                      </p>
                    ) : (
                      <p className="text-xs text-outline/60 leading-relaxed mb-4 italic min-h-[2rem]">
                        暂无应用描述
                      </p>
                    )}

                    {/* Replaced submission rate text. Cards render creators, creation timestamp and dynamic status indicator pill badges */}
                    {activeTab === 'recent' ? (
                      <div className="grid grid-cols-1 gap-2.5 border-t border-dashed border-outline-variant pt-4 mt-2">
                        <div className="flex items-center justify-between text-xs font-medium text-on-surface">
                          <span className="text-outline">创建人：</span>
                          <span className="font-bold text-on-surface">{project.createdBy || '系统管理员'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium text-on-surface">
                          <span className="text-outline">创建时间：</span>
                          <span className="font-bold text-on-surface">{project.createdAt || '2026-05-01'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium pt-1 text-on-surface">
                          <span className="text-outline">应用状态：</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            project.status === 'Published' ? 'bg-green-50 text-green-600 border border-green-200' :
                            project.status === 'Draft' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                            'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            {project.status === 'Published' ? '已发布' : project.status === 'Draft' ? '草稿' : '已归档'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2.5 border-t border-dashed border-outline-variant pt-4 mt-2">
                        <div className="flex items-center justify-between text-xs font-medium text-on-surface">
                          <span className="text-outline">创建时间：</span>
                          <span className="font-bold text-on-surface">{project.createdAt || '2026-05-01'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium pt-1 text-on-surface">
                          <span className="text-outline">应用状态：</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            project.status === 'Published' ? 'bg-green-50 text-green-600 border border-green-200' :
                            project.status === 'Draft' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                            'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            {project.status === 'Published' ? '已发布' : project.status === 'Draft' ? '草稿' : '已归档'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-6 border-t border-outline-variant flex items-center justify-between group/footer">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-outline-variant uppercase tracking-widest mb-0.5">最后访问</span>
                       <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">{project.updatedAt}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface-container group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center">
                       <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {displayedProjects.length === 0 && (
              <div className="col-span-full py-32 flex flex-col items-center justify-center border-4 border-dashed border-outline-variant/40 rounded-[3rem] opacity-70 space-y-6 bg-surface/20">
                 <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border border-outline-variant">
                    <Briefcase className="w-12 h-12 text-outline-variant" />
                 </div>
                 <div className="text-center">
                    <p className="text-2xl font-black tracking-tight text-on-surface mb-2">没有找到匹配的应用</p>
                    <p className="text-sm text-outline-variant font-medium uppercase tracking-[0.2em]">请重新调整搜索词或重置筛选类别</p>
                 </div>
                 <button 
                  onClick={() => {
                    setProjectSearchQuery('');
                    setProjectCategoryFilter('all');
                  }}
                  className="px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-all text-white"
                 >
                   重置搜索
                 </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {isProjectModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-outline-variant p-8 space-y-6 max-h-[90vh] flex flex-col"
                >
                  <div className="space-y-2 shrink-0">
                    <h3 className="text-xl font-bold tracking-tight text-on-surface">{projectToEdit ? '编辑应用' : '创建新应用'}</h3>
                    <p className="text-sm text-on-surface-variant font-medium">为您的应用资产定义一个清晰的容器和分类</p>
                  </div>

                  <div className="space-y-4 font-sans overflow-y-auto no-scrollbar py-2 flex-1 pr-1">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest block">应用名称 <span className="text-error font-extrabold">*</span></label>
                      <input 
                        autoFocus
                        type="text" 
                        value={modalName}
                        onChange={(e) => setModalName(e.target.value)}
                        placeholder="例如：2024 年度调研"
                        className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-on-surface"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest block">应用图标 (点击更改)</label>
                      <div className="flex items-center gap-4">
                        <button 
                          type="button"
                          onClick={() => setIsIconSelectorOpen(true)}
                          className="w-14 h-14 bg-surface border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl flex items-center justify-center text-primary hover:bg-primary/5 transition-all shadow-sm shrink-0"
                          title="选择应用图标"
                        >
                          {(() => {
                            const SelectedIcon = iconMap[modalIcon] || Briefcase;
                            return <SelectedIcon className="w-6 h-6" />;
                          })()}
                        </button>
                        <div className="flex-1 text-left">
                          <span className="text-xs font-bold block text-on-surface">
                            {selectableIcons.find(i => i.key === modalIcon)?.label || '主要业务'}
                          </span>
                          <span className="text-[10px] text-outline font-medium leading-tight block line-clamp-2">
                            {selectableIcons.find(i => i.key === modalIcon)?.desc || '用于通用业务场景及核心功能归口'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest block">应用说明描述</label>
                      <textarea 
                        value={modalDesc}
                        onChange={(e) => setModalDesc(e.target.value)}
                        placeholder="请输入描述，如：此应用用于收集用户满意度反馈以及优化系统故障统计..."
                        rows={3}
                        className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-on-surface resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest block">应用类型</label>
                      <select 
                        value={modalCategory}
                        onChange={(e) => setModalCategory(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-on-surface outline-none cursor-pointer"
                      >
                        {['行政', '人事', '财务', '市场', '工厂', '问卷调查', '绩效', '协同办公', '其他'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30 shrink-0">
                    <button 
                      onClick={() => setIsProjectModalOpen(false)}
                      className="px-6 py-2 border border-outline-variant rounded-xl text-xs font-bold hover:bg-surface-container-low transition-all text-on-surface"
                    >
                      取消
                    </button>
                    <button 
                      onClick={() => createOrUpdateProject(modalName, modalCategory, modalDesc, modalIcon)}
                      disabled={!modalName.trim()}
                      className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-xl transition-all disabled:opacity-50 hover:text-white"
                    >
                      {projectToEdit ? '保存更改' : '确认创建'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {isIconSelectorOpen && (
              <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 10 }}
                  className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-outline-variant p-8 space-y-6 max-h-[85vh] flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 shrink-0">
                    <div>
                      <h4 className="text-lg font-black tracking-tight text-on-surface">选择应用图标</h4>
                      <p className="text-xs text-outline font-medium mt-1">挑选一个能代表您当前业务方向的专属图标</p>
                    </div>
                    <button 
                      onClick={() => setIsIconSelectorOpen(false)}
                      className="w-8 h-8 bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface rounded-full flex items-center justify-center transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar py-2 flex-1 pr-1">
                    {selectableIcons.map((item) => {
                      const IconComp = iconMap[item.key] || Briefcase;
                      const isSelected = modalIcon === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            setModalIcon(item.key);
                            setIsIconSelectorOpen(false);
                          }}
                          className={`p-3 rounded-2xl flex items-start gap-3 text-left transition-all border ${
                            isSelected 
                              ? 'bg-primary/5 border-primary shadow-sm text-primary' 
                              : 'bg-white border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-primary text-white' : 'bg-surface-container text-primary'
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5">
                            <span className={`text-xs font-black block leading-none ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{item.label}</span>
                            <span className="text-[10px] text-outline font-medium leading-tight block line-clamp-2">{item.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-outline-variant/30 flex justify-end shrink-0">
                    <button 
                      onClick={() => setIsIconSelectorOpen(false)}
                      className="px-6 py-2 bg-on-surface hover:bg-on-surface-variant text-white rounded-xl text-xs font-bold transition-all hover:text-white"
                    >
                      关闭
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
  ) : (
    <div className="flex-1 h-full w-full flex flex-col overflow-hidden bg-slate-100 animate-in fade-in duration-300">
          {/* Top Bar / Tab Header */}
          <div className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setProjectDetailsId(null)}
                className="group flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                id="back-to-projects-btn"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                应用管理
              </button>
              
              <div className="h-4 w-px bg-slate-200" />
              
              {/* Browser/IDE-like active form tab */}
              {(() => {
                const activeForm = rawProjectForms.find(f => f.id === activeFormId) || rawProjectForms[0] || null;
                return activeForm ? (
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 border-t-2 border-blue-500 rounded-t-lg text-xs font-bold text-blue-600 shadow-sm relative pr-8">
                    <span className="truncate max-w-[120px]">{activeForm.name}</span>
                    <button 
                      onClick={() => setActiveFormId(null)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 rotate-45" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 rounded-t-lg text-xs font-bold text-slate-400">
                    暂无选中表单
                  </div>
                );
              })()}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-green-500 flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                运行中
              </span>
            </div>
          </div>

          {/* Dual-Pane Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-72 bg-white border-r border-slate-200/80 flex flex-col h-full shrink-0 shadow-sm">
              <div className="p-4 border-b border-slate-100 space-y-3">
                {/* Search Bar & Filter */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={formSearchQuery}
                      onChange={(e) => setFormSearchQuery(e.target.value)}
                      placeholder="搜索表单"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 font-medium"
                      id="form-sidebar-search"
                    />
                  </div>
                  <button 
                    onClick={() => setFormSearchQuery('')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-xl transition-all"
                    title="重置搜索"
                  >
                    <ListFilter className="w-4 h-4" />
                  </button>
                </div>

                {/* + 新增表单 Button */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNewFormDropdown(!showNewFormDropdown)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
                    id="add-new-form-btn"
                  >
                    <Plus className="w-4 h-4" /> 新增表单
                  </button>

                  <AnimatePresence>
                    {showNewFormDropdown && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowNewFormDropdown(false)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 5 }}
                          className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-30 space-y-0.5"
                        >
                          {[
                            { type: 'normal', label: '普通表单', icon: FormInput, desc: '标准数据收集', color: 'text-blue-500' },
                            { type: 'workflow', label: '流程表单', icon: Workflow, desc: '节点审批流程', color: 'text-purple-500' },
                            { type: 'report', label: '统计报表', icon: FileSpreadsheet, desc: '数据透视与报表', color: 'text-green-500' },
                          ].map((item) => (
                            <button
                              key={item.type}
                              onClick={() => {
                                setShowNewFormDropdown(false);
                                setSelectedProjectId(projectDetailsId);
                                openEditor(null, item.type as FormType);
                              }}
                              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all text-left"
                            >
                              <div className={`p-1.5 rounded-lg bg-slate-50 ${item.color}`}>
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-800 leading-none mb-0.5">{item.label}</div>
                                <div className="text-[10px] text-slate-400 leading-none">{item.desc}</div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Collapsible Form Lists */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {(() => {
                  const filteredProjectForms = rawProjectForms.filter(f =>
                    f.name.toLowerCase().includes(formSearchQuery.toLowerCase())
                  );
                  const unpublished = filteredProjectForms.filter(f => f.status !== 'Published');
                  const published = filteredProjectForms.filter(f => f.status === 'Published');
                  const activeForm = filteredProjectForms.find(f => f.id === activeFormId) || filteredProjectForms[0] || null;

                  const typeIcons = {
                    normal: FormInput,
                    workflow: Workflow,
                    report: FileSpreadsheet,
                    dashboard: LayoutGrid
                  };

                  return (
                    <>
                      {/* Section 1: 未发布 (Unpublished) */}
                      <div className="space-y-1">
                        <button 
                          onClick={() => setIsUnpublishedExpanded(!isUnpublishedExpanded)}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <span>未发布</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isUnpublishedExpanded ? '' : '-rotate-90'}`} />
                        </button>
                        
                        {isUnpublishedExpanded && (
                          <div className="space-y-0.5">
                            {unpublished.map(form => {
                              const FormIcon = typeIcons[form.type as keyof typeof typeIcons] || FormInput;
                              const isSelected = activeForm && form.id === activeForm.id;
                              return (
                                <div 
                                  key={form.id}
                                  onClick={() => setActiveFormId(form.id)}
                                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'bg-blue-50/80 text-blue-600 font-semibold border-l-2 border-blue-600' 
                                      : 'text-slate-600 hover:bg-slate-50 font-medium border-l-2 border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FormIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                    <span className="text-xs truncate max-w-[150px]">{form.name}</span>
                                  </div>
                                  
                                  {/* Trash Icon for deletion */}
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteForm(form.id, form.name);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded transition-all"
                                    title="删除表单"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                            {unpublished.length === 0 && (
                              <div className="text-[10px] text-slate-400 italic px-2.5 py-2">暂无未发布表单</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Section 2: 已发布 (Published) */}
                      <div className="space-y-1">
                        <button 
                          onClick={() => setIsPublishedExpanded(!isPublishedExpanded)}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <span>已发布</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPublishedExpanded ? '' : '-rotate-90'}`} />
                        </button>
                        
                        {isPublishedExpanded && (
                          <div className="space-y-0.5">
                            {published.map(form => {
                              const FormIcon = typeIcons[form.type as keyof typeof typeIcons] || FormInput;
                              const isSelected = activeForm && form.id === activeForm.id;
                              return (
                                <div 
                                  key={form.id}
                                  onClick={() => setActiveFormId(form.id)}
                                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'bg-blue-50/80 text-blue-600 font-semibold border-l-2 border-blue-600' 
                                      : 'text-slate-600 hover:bg-slate-50 font-medium border-l-2 border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FormIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                    <span className="text-xs truncate max-w-[150px]">{form.name}</span>
                                  </div>
                                  
                                  {/* Trash Icon for deletion */}
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteForm(form.id, form.name);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded transition-all"
                                    title="删除表单"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                            {published.length === 0 && (
                              <div className="text-[10px] text-slate-400 italic px-2.5 py-2">暂无已发布表单</div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Right Main Content Area (Form Preview) */}
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              {/* Controls Toolbar (Top) */}
              <div className="h-12 border-b border-slate-200/50 bg-[#F8FAFC]/60 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
                {/* Desktop/Mobile Switcher Controls */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 p-0.5 rounded-lg shadow-sm">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-md transition-all ${
                      previewDevice === 'desktop' 
                        ? 'bg-slate-100 text-slate-800 font-bold' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="电脑预览"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-md transition-all ${
                      previewDevice === 'mobile' 
                        ? 'bg-slate-100 text-slate-800 font-bold' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="手机预览"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit Form Button */}
                {(() => {
                  const activeForm = rawProjectForms.find(f => f.id === activeFormId) || rawProjectForms[0] || null;
                  return (
                    <button
                      onClick={() => activeForm && openEditor(activeForm.id)}
                      disabled={!activeForm}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/5"
                      id="edit-active-form-btn"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      编辑
                    </button>
                  );
                })()}
              </div>

              {/* Preview Body Canvas */}
              <div className="flex-1 overflow-y-auto p-8 flex items-start justify-center bg-slate-50/50">
                {(() => {
                  const activeForm = rawProjectForms.find(f => f.id === activeFormId) || rawProjectForms[0] || null;
                  
                  if (!activeForm) {
                    return (
                      <div className="my-auto text-center max-w-sm p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-500 border border-blue-100">
                          <FormInput className="w-8 h-8" />
                        </div>
                        <h4 className="text-base font-bold text-slate-800">暂无表单资产</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">该项目当前没有创建任何表单。您可以点击左侧 sidebar 的 “新增表单” 按钮进行创建。</p>
                      </div>
                    );
                  }

                  // Retrieve fields or use high-fidelity default fallback that mimics user's image exactly!
                  const fields = (activeForm && formFieldsMap[activeForm.id]) ? formFieldsMap[activeForm.id] : [
                    { id: '1', type: 'text', label: '单行文本', placeholder: '请输入', required: false, width: '1/1' },
                    { id: '2', type: 'text', label: '单行文本', placeholder: '请输入', required: false, width: '1/2' },
                    { id: '3', type: 'text', label: '单行文本', placeholder: '请输入', required: false, width: '1/2' },
                    { id: '4', type: 'text', label: '单行文本', placeholder: '请输入', required: false, width: '1/2' },
                    { id: '5', type: 'text', label: '单行文本', placeholder: '请输入', required: false, width: '1/2' }
                  ];

                  return (
                    <motion.div 
                      key={activeForm.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={
                        previewDevice === 'mobile'
                          ? "w-[335px] min-h-[550px] max-h-[640px] bg-white rounded-[2rem] shadow-2xl border-8 border-slate-800 flex flex-col overflow-y-auto p-5 relative select-none"
                          : "max-w-2xl w-full bg-white rounded-2xl shadow-md border border-slate-200/80 flex flex-col p-8 md:p-10 select-none"
                      }
                    >
                      {/* Form Title inside the preview */}
                      <h3 className="text-base md:text-lg font-bold text-slate-800 text-center mb-6 md:mb-8 tracking-wide">
                        {activeForm.name}
                      </h3>

                      {/* Render inputs dynamically inside a standard grid layout */}
                      <div className="grid grid-cols-2 gap-4">
                        {fields.map(field => {
                          const isFullWidth = field.width === '1/1' || !field.width;
                          const gridSpan = isFullWidth ? 'col-span-2' : 'col-span-2 md:col-span-1';

                          return (
                            <div key={field.id} className={gridSpan}>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-0.5">*</span>}
                              </label>
                              <div className="relative">
                                {field.type === 'textarea' ? (
                                  <textarea
                                    disabled
                                    rows={2}
                                    placeholder={field.placeholder || '请输入'}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium placeholder-slate-400 cursor-not-allowed select-none outline-none"
                                  />
                                ) : field.type === 'select' ? (
                                  <div className="relative">
                                    <select
                                      disabled
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-400 cursor-not-allowed select-none appearance-none outline-none"
                                    >
                                      <option>{field.placeholder || '请选择'}</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                  </div>
                                ) : (
                                  <input
                                    type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                    disabled
                                    placeholder={field.placeholder || '请输入'}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium placeholder-slate-400 cursor-not-allowed select-none outline-none"
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Submit Button at the bottom of the form card */}
                      <div className="mt-8 md:mt-10 flex justify-center w-full">
                        <button 
                          disabled
                          className="w-full max-w-xs py-2.5 px-6 bg-blue-600 disabled:opacity-100 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center cursor-not-allowed"
                        >
                          提交
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
  );
};

const WorkflowView = ({ workflowStatus, setWorkflowStatus, workflowInstances, setView }: WorkflowViewProps) => (
  <div className="w-full p-8 md:p-10 space-y-8 pb-32">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tighter">已发布的流程</h2>
        <p className="text-sm text-on-surface-variant font-medium">监控活跃的流程实例和运行遥测数据</p>
      </div>
      <div className="flex bg-surface-container rounded-xl p-1.5 border border-outline-variant shadow-sm text-on-surface">
         <button 
           onClick={() => setWorkflowStatus('active')}
           className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${workflowStatus === 'active' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-outline hover:text-on-surface'}`}
         >活跃中</button>
         <button 
           onClick={() => setWorkflowStatus('inactive')}
           className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${workflowStatus === 'inactive' ? 'bg-on-surface text-white shadow-lg' : 'text-outline hover:text-on-surface'}`}
         >已暂停</button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
         <div className="sleek-card overflow-hidden border-2 border-outline-variant shadow-sm text-on-surface">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low/50 flex justify-between items-center">
               <h3 className="font-bold text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> 活跃实例</h3>
               <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded tracking-widest uppercase">实时</span>
            </div>
            <div className="divide-y divide-outline-variant">
               {workflowInstances.map(inst => (
                 <div key={inst.id} className="p-6 flex items-center gap-6 hover:bg-surface transition-colors group cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${inst.status === 'Completed' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                      {inst.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm tracking-tight">请求 #{inst.id}</span>
                          <span className="text-[10px] font-bold text-outline">• {inst.initiator}</span>
                       </div>
                       <div className="text-[10px] font-medium text-on-surface-variant">步骤: <span className="font-bold text-primary">{inst.currentStep}</span> • 发起于 {inst.startTime}</div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="px-3 py-1.5 bg-on-surface text-white rounded-lg text-[10px] font-bold hover:bg-on-surface shadow transition-all opacity-0 group-hover:opacity-100 uppercase tracking-widest">催办</button>
                       <ChevronRight className="w-4 h-4 text-outline" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="space-y-6 text-on-surface">
         <div className="sleek-card p-6 bg-primary text-white space-y-4 shadow-2xl shadow-primary/30">
            <div className="flex justify-between items-start">
               <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Workflow className="w-6 h-6" />
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">流程效率</div>
                  <div className="text-2xl font-extrabold">94.2%</div>
               </div>
            </div>
            <div>
               <h4 className="font-extrabold tracking-tight text-white uppercase text-xs">引擎运行正常</h4>
               <p className="text-[11px] opacity-80 mt-1 font-medium leading-relaxed">系统正在自动扩缩以处理支付峰值。平均延迟：240ms</p>
            </div>
            <button 
               onClick={() => setView('editor')}
               className="w-full py-3 bg-white text-primary rounded-xl text-xs font-bold hover:bg-surface-container transition-all shadow-lg"
            >优化设计器</button>
         </div>

         <div className="sleek-card p-6 space-y-4 shadow-sm border border-outline-variant">
            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest">快捷操作</h4>
            <div className="space-y-2">
               {[
                 { label: '导出审计日志', icon: FileDown },
                 { label: '刷新缓存', icon: Trash2 },
                 { label: '重建索引', icon: RefreshCw },
               ].map(action => (
                 <button key={action.label} className="w-full flex items-center justify-between p-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group font-bold text-xs text-on-surface">
                    <div className="flex items-center gap-3">
                       <action.icon className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                       <span>{action.label}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                 </button>
               ))}
            </div>
         </div>
      </div>
    </div>
  </div>
);

const InsightsView = ({ showNotification, workflowStatus, setWorkflowStatus, workflowInstances, setView }: InsightsViewProps) => (
  <div className="w-full p-8 md:p-10 space-y-8 pb-32">


    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { l: '平均完成时间', v: '2.4m', t: '-12%' },
        { l: '流程流失率', v: '18.4%', t: '+2.1%' },
        { l: 'API 延迟', v: '44ms', t: '-4ms' },
        { l: '总流程实例', v: '4.2k', t: '+800' },
      ].map(item => (
        <div key={item.l} className="sleek-card p-6 text-on-surface bg-white">
          <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">{item.l}</div>
          <div className="text-2xl font-extrabold">{item.v}</div>
          <span className="text-[10px] font-bold text-green-600">{item.t}</span>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      <div className="xl:col-span-2 2xl:col-span-3 space-y-6">
         <div className="sleek-card overflow-hidden border border-outline-variant shadow-sm text-on-surface bg-white">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low/50 flex justify-between items-center">
               <h3 className="font-bold text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> 活跃流程实例</h3>
               <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded tracking-widest uppercase">实时同步</span>
            </div>
            <div className="divide-y divide-outline-variant">
               {workflowInstances.map(inst => (
                 <div key={inst.id} className="p-6 flex items-center gap-6 hover:bg-surface transition-colors group cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${inst.status === 'Completed' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                      {inst.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm tracking-tight">实例 #{inst.id}</span>
                          <span className="text-[10px] font-bold text-outline">• 发起人: {inst.initiator}</span>
                       </div>
                       <div className="text-[10px] font-medium text-on-surface-variant">当前环节: <span className="font-bold text-primary">{inst.currentStep}</span> • {inst.startTime}</div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="px-3 py-1.5 bg-on-surface text-white rounded-lg text-[10px] font-bold hover:opacity-90 shadow transition-all uppercase tracking-widest">详情</button>
                       <ChevronRight className="w-4 h-4 text-outline" />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="sleek-card p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 text-on-surface bg-surface/30">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Activity className="w-8 h-8 text-primary opacity-20" />
            </div>
            <h4 className="font-bold text-xl">高级可视化引擎</h4>
            <p className="text-sm text-on-surface-variant max-w-md">在专业版计划中，通过热力图、漏斗图和地理位置指标自定义您的报告仪表板。</p>
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20">解锁企业版洞察</button>
         </div>
      </div>

      <div className="space-y-6">
         <div className="sleek-card p-6 bg-primary text-white space-y-4 shadow-2xl shadow-primary/30">
            <div className="flex justify-between items-start">
               <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Workflow className="w-6 h-6" />
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">系统负载</div>
                  <div className="text-2xl font-extrabold">94.2%</div>
               </div>
            </div>
            <div>
               <h4 className="font-extrabold tracking-tight text-white uppercase text-xs">流程引擎状态正常</h4>
               <p className="text-[11px] opacity-80 mt-1 font-medium leading-relaxed">系统正在自动扩缩以处理提交峰值。平均执行延迟：240ms</p>
            </div>
            <button 
               onClick={() => setView('projects')}
               className="w-full py-3 bg-white text-primary rounded-xl text-xs font-bold hover:bg-surface-container transition-all shadow-lg"
            >调整应用配置</button>
         </div>

         <div className="sleek-card p-6 space-y-4 shadow-sm border border-outline-variant bg-white">
            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest">流程维护工具</h4>
            <div className="space-y-2">
               {[
                 { label: '导出全量审计日志', icon: FileDown },
                 { label: '重置实时索引', icon: RefreshCw },
                 { label: '清除引擎缓存', icon: Trash2 },
               ].map(action => (
                 <button key={action.label} className="w-full flex items-center justify-between p-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group font-bold text-xs text-on-surface">
                    <div className="flex items-center gap-3">
                       <action.icon className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                       <span>{action.label}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                 </button>
               ))}
            </div>
         </div>
      </div>
    </div>
  </div>
);

const IntegrationsView = ({ showNotification, setView }: IntegrationsViewProps & { setView: (v: ViewType) => void }) => (
  <div className="w-full p-8 md:p-10 space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {[
        { name: '组织管理', desc: '维护公司组织架构和部门信息', icon: Building2, type: 'internal', target: 'team' },
        { name: '用户管理', desc: '新增、编辑和管理平台用户信息', icon: UserCog, type: 'internal', target: 'team' },
        { name: '角色管理', desc: '定义角色权限和功能访问控制', icon: ShieldCheck, type: 'internal', target: 'team' },
        { name: 'Slack', desc: '在您的频道中接收即时提醒', icon: Mail, connected: true },
        { name: 'Zapier', desc: '连接 5,000+ 其它应用程序', icon: Zap, connected: false },
        { name: 'Google Sheets', desc: '自动导出回复数据', icon: FileSpreadsheet, connected: true },
        { name: 'Salesforce', desc: '将潜在客户同步至您的 CRM', icon: Briefcase, connected: false },
        { name: 'Webhooks', desc: '自定义 HTTP 事件触发器', icon: Globe, connected: true },
      ].map((app) => (
        <div 
          key={app.name} 
          onClick={() => {
            if (app.type === 'internal') {
              setView(app.target as ViewType);
            }
          }}
          className={`sleek-card p-6 flex flex-col gap-4 group hover:border-primary transition-all text-on-surface ${app.type === 'internal' ? 'cursor-pointer hover:shadow-xl' : ''}`}
        >
          <div className="flex justify-between items-start">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold text-lg ${app.type === 'internal' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface text-on-surface-variant border border-outline-variant'}`}>
              <app.icon className="w-5 h-5" />
            </div>
            {app.type === 'internal' ? (
              <span className="bg-primary/5 text-primary text-[8px] font-black px-2 py-0.5 rounded tracking-widest uppercase">系统组件</span>
            ) : app.connected ? (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">已连接</span>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); showNotification(`正在连接 ${app.name}...`); }}
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
              >连接</button>
            )}
          </div>
          <div>
            <h5 className="font-bold tracking-tight">{app.name}</h5>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">{app.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ==================== 数据管理视图 (Data Management View) ====================

const initialDataManagementRecords: Record<string, any[]> = {
  'f1': [
    { id: 'r1_1', name: '陈小明', dept: '技术研发部', date: '2026-05-20', role: '高级前端工程师', phone: '13800138000', status: '已通过' },
    { id: 'r1_2', name: '林华', dept: '市场运营部', date: '2026-05-22', role: '策划经理', phone: '13922334455', status: '审批中' },
    { id: 'r1_3', name: '赵静', dept: '人力资源部', date: '2026-05-25', role: '招聘专员', phone: '18688889999', status: '已拒绝' },
    { id: 'r1_4', name: '李瑞', dept: '产品设计部', date: '2026-05-26', role: 'UI设计师', phone: '15011223344', status: '已通过' },
    { id: 'r1_5', name: '王强', dept: '技术研发部', date: '2026-05-26', role: 'Java开发工程师', phone: '13677889900', status: '审批中' },
  ],
  'f2': [
    { id: 'r2_1', evaluator: '王总工', candidate: '张海涛', score: 92, rank: '精英工程师', comment: '技术根基极其扎实，在分布式与基础机制上有独到理解，完美通过面试。', date: '2026-05-21', status: '推荐录用' },
    { id: 'r2_2', evaluator: '李架构师', candidate: '崔大明', score: 78, rank: '高级工程师', comment: '业务理解良好，底层并发掌握一般，建议定岗T6，做后续观察。', date: '2026-05-23', status: '推荐录用' },
    { id: 'r2_3', evaluator: '高经理', candidate: '杨柳青', score: 58, rank: '初级工程师', comment: '项目经验略显薄弱，基本语法掌握不牢固，不符合招聘标准。', date: '2026-05-24', status: '不予录用' },
  ],
  'f3': [
    { id: 'r3_1', nickname: 'TechExplorer', frequency: '每天使用', score: 5, feedback: '全新版本的流程设计器十分流畅，功能比以前丰富太多，期待早日上线！', time: '2026-05-26 14:22', source: 'Web端' },
    { id: 'r3_2', nickname: '设计师豆豆', frequency: '每周几次', score: 4, feedback: '表单支持丰富的微调，宽度自适应非常棒，编辑体验满分。', time: '2026-05-25 09:12', source: '移动端' },
    { id: 'r3_3', nickname: '架构老张', frequency: '每天使用', score: 5, feedback: '开放式表单对我们管理异构数据很有帮助，已经做为日常业务的支柱了。', time: '2026-05-24 18:45', source: 'Web端' },
    { id: 'r3_4', nickname: '测试小林', frequency: '每周几次', score: 3, feedback: '希望在移动端下的交互能够进一步多一点滑动或者手势操作的灵动效果。', time: '2026-05-24 10:05', source: 'iOS客户端' },
  ],
  'f4': [
    { id: 'r4_1', reporter: '莉莉', satisfy: '极佳', suggestion: '希望多增加一些暗色卡片的主题配置，可以保护视力，也显得很高档。', time: '2026-05-26 15:30' },
    { id: 'r4_2', reporter: '赵本生', satisfy: '良好', suggestion: '表单填报页在小屏手机上的自适应希望进一步强化，尤其是复杂表格。', time: '2026-05-25 11:20' },
    { id: 'r4_3', reporter: '胡先森', satisfy: '卓越', suggestion: '完美的界面和过渡动画，使用起来很舒心，非常赞！', time: '2026-05-23 08:44' },
  ],
  'f5': [
    { id: 'r5_1', company: '腾讯科技（深圳）有限公司', contact: '马先生', product: '企业旗舰白金版', budget: '10万-50万', record: '电话邀约，计划5月27日下午现场进行产品技术交流及POC演示', status: '高度意向' },
    { id: 'r5_2', company: '北京字节跳动网络服务', contact: '张女士', product: '标准智能表单系统', budget: '1万-5万', record: '已发详细报价单，正在确认采购审批流程，反馈积极', status: '商务跟进中' },
    { id: 'r5_3', company: '未来独角兽数字科技有限公司', contact: '孙总', product: '流程引擎专有部署', budget: '50万以上', record: '客户内部财务审核完毕，正进行合同内容合规核对', status: '签约中' },
    { id: 'r5_4', company: '极客先锋创新中心', contact: '梁经理', product: '标准智能表单系统', budget: '1万以下', record: '免费版用户咨询，已推荐官网自主升级渠道', status: '低意向' },
  ],
  'f6': [
    { id: 'r6_1', name: '常春藤候选1号', score: '优秀 (95)', recommend: '是', creator: 'HR-陈', date: '2025-12-15' },
    { id: 'r6_2', name: '技术总监晋升2号', score: '极佳 (98)', recommend: '是', creator: 'HR-王', date: '2025-12-14' },
  ]
};

const dataRecordsMeta: Record<string, { label: string; key: string; type?: 'text' | 'number' | 'status' }[]> = {
  'f1': [
    { label: '员工姓名', key: 'name', type: 'text' },
    { label: '部门', key: 'dept', type: 'text' },
    { label: '入职日期', key: 'date', type: 'text' },
    { label: '岗位', key: 'role', type: 'text' },
    { label: '联系电话', key: 'phone', type: 'text' },
    { label: '审批状态', key: 'status', type: 'status' },
  ],
  'f2': [
    { label: '评估人', key: 'evaluator', type: 'text' },
    { label: '候选人', key: 'candidate', type: 'text' },
    { label: '评估打分', key: 'score', type: 'number' },
    { label: '推荐职级', key: 'rank', type: 'text' },
    { label: '评语', key: 'comment', type: 'text' },
    { label: '评估日期', key: 'date', type: 'text' },
    { label: '审批状态', key: 'status', type: 'status' },
  ],
  'f3': [
    { label: '用户昵称', key: 'nickname', type: 'text' },
    { label: '使用频次', key: 'frequency', type: 'text' },
    { label: '功能评分', key: 'score', type: 'number' },
    { label: '建议反馈', key: 'feedback', type: 'text' },
    { label: '提交时间', key: 'time', type: 'text' },
    { label: '操作端', key: 'source', type: 'text' },
  ],
  'f4': [
    { label: '反馈人', key: 'reporter', type: 'text' },
    { label: '视觉满意度', key: 'satisfy', type: 'text' },
    { label: '优化意见', key: 'suggestion', type: 'text' },
    { label: '提交时间', key: 'time', type: 'text' },
  ],
  'f5': [
    { label: '企业名称', key: 'company', type: 'text' },
    { label: '联系人', key: 'contact', type: 'text' },
    { label: '意向产品', key: 'product', type: 'text' },
    { label: '预算范围', key: 'budget', type: 'text' },
    { label: '跟进记录', key: 'record', type: 'text' },
    { label: '跟进状态', key: 'status', type: 'status' },
  ],
  'f6': [
    { label: '候选姓名', key: 'name', type: 'text' },
    { label: '综合打分', key: 'score', type: 'text' },
    { label: '推荐晋升', key: 'recommend', type: 'text' },
    { label: '创建人', key: 'creator', type: 'text' },
    { label: '创建日期', key: 'date', type: 'text' },
  ],
};

const renderRecordStatusBadge = (status: string) => {
  const isApproved = ['已通过', '推荐录用', '已建档', '高度意向', '是', '卓越', '极佳'].includes(status);
  const isPending = ['审批中', '商务跟进中', '签约中', '良好'].includes(status);
  const isRejected = ['已拒绝', '不予录用', '低意向'].includes(status);

  if (isApproved) {
    return (
      <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-green-100 text-green-700 tracking-wider">
        {status}
      </span>
    );
  }
  if (isPending) {
    return (
      <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-yellow-100 text-yellow-700 tracking-wider">
        {status}
      </span>
    );
  }
  if (isRejected) {
    return (
      <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-red-100 text-red-700 tracking-wider">
        {status}
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-gray-100 text-gray-700 tracking-wider">
      {status}
    </span>
  );
};

const getProjectIcon = (iconName: string) => {
  const map: Record<string, any> = {
    'Users': Users,
    'MessageSquare': MessageSquare,
    'BarChart3': BarChart3,
    'Briefcase': Briefcase,
    'FormInput': FormInput,
    'Layers': Layers,
  };
  return map[iconName] || FormInput;
};

interface DataManagementViewProps {
  projects: Project[];
  savedForms: SavedForm[];
  showNotification: (text: string) => void;
}

const DataManagementView = ({ projects, savedForms, showNotification }: DataManagementViewProps) => {
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>(projects[1]?.id || projects[0]?.id || '');
  const [selectedFormId, setSelectedFormId] = React.useState<string>('');
  
  // High fidelity persistent record state supporting manual addition + deletions
  const [records, setRecords] = React.useState<Record<string, any[]>>(initialDataManagementRecords);
  
  // Search query
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  // Left sidebar project search query
  const [projectSearch, setProjectSearch] = React.useState<string>('');
  
  // Status filter state
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  
  // View detail states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any | null>(null);
  
  // Add new state
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = React.useState<boolean>(false);
  const [newRecordFields, setNewRecordFields] = React.useState<Record<string, string>>({});

  // Auto-select first matching form when selectedProjectId changes
  React.useEffect(() => {
    const matchingForms = savedForms.filter(f => f.projectId === selectedProjectId);
    if (matchingForms.length > 0) {
      setSelectedFormId(matchingForms[0].id);
    } else {
      setSelectedFormId('');
    }
    // Reset filters
    setSearchQuery('');
    setStatusFilter('all');
  }, [selectedProjectId, savedForms]);

  // Total records sum computed across all sheets
  const grandTotalSumbissions = React.useMemo(() => {
    return (Object.values(records) as any[][]).reduce((sum, list) => sum + (list ? list.length : 0), 0);
  }, [records]);

  // Current active form details & matching columns
  const activeForm = React.useMemo(() => {
    return savedForms.find(f => f.id === selectedFormId);
  }, [selectedFormId, savedForms]);

  const activeColumns = React.useMemo(() => {
    return dataRecordsMeta[selectedFormId] || [];
  }, [selectedFormId]);

  const activeFormRecords = React.useMemo(() => {
    return records[selectedFormId] || [];
  }, [selectedFormId, records]);

  // Get unique statuses in active form records for dropdown filter
  const uniqueStatuses = React.useMemo(() => {
    const statuses = new Set<string>();
    activeFormRecords.forEach(r => {
      if (r.status) statuses.add(r.status);
    });
    return Array.from(statuses);
  }, [activeFormRecords]);

  // Computed display grid filtered with query & status options
  const filteredRecords = React.useMemo(() => {
    let result = [...activeFormRecords];
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => {
        return Object.values(r).some(val => 
          val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        );
      });
    }
    return result;
  }, [activeFormRecords, statusFilter, searchQuery]);

  // Sidebar search filter projects
  const filteredProjects = React.useMemo(() => {
    if (projectSearch.trim() === '') return projects;
    const q = projectSearch.toLowerCase().trim();
    return projects.filter(p => p.name.toLowerCase().includes(q));
  }, [projects, projectSearch]);

  // Handle deletion of rows
  const handleDeleteRow = (rowId: string) => {
    if (confirm('确认删除这一条填报数据记录？该操作不可逆。')) {
      const updatedList = activeFormRecords.filter(r => r.id !== rowId);
      setRecords(prev => ({
        ...prev,
        [selectedFormId]: updatedList
      }));
      showNotification('记录已成功删除');
    }
  };

  // Export mock success
  const handleExportData = () => {
    showNotification(`已打包导出 ${filteredRecords.length} 条数据至 Excel 报表中`);
  };

  // Open modal to submit new dynamic test row
  const handleOpenAddModal = () => {
    if (activeColumns.length === 0) return;
    const initialFields: Record<string, string> = {};
    activeColumns.forEach(c => {
      // Set defaults
      if (c.key === 'status') {
         initialFields[c.key] = '已通过';
      } else if (c.key === 'date') {
         initialFields[c.key] = new Date().toISOString().split('T')[0];
      } else if (c.key === 'time') {
         const now = new Date();
         initialFields[c.key] = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      } else {
         initialFields[c.key] = '';
      }
    });
    setNewRecordFields(initialFields);
    setIsNewRecordModalOpen(true);
  };

  // Save new record
  const handleSaveNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `new_r_${Date.now()}`;
    const entry = { id: newId, ...newRecordFields };
    
    // Add to records state
    setRecords(prev => {
      const currentList = prev[selectedFormId] || [];
      return {
        ...prev,
        [selectedFormId]: [entry, ...currentList]
      };
    });

    setIsNewRecordModalOpen(false);
    showNotification('新增表单填报数据成功！已同步至数据中心。');
  };

  return (
    <div className="w-full p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="sleek-card p-6 bg-white border border-outline-variant/60 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-outline">已接入应用数</span>
            <h4 className="text-2xl font-black tracking-tight mt-1">{projects.length}</h4>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">多业务场景全面覆盖</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Layout className="w-5 h-5" />
          </div>
        </div>

        <div className="sleek-card p-6 bg-white border border-outline-variant/60 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-outline">表单工作底表</span>
            <h4 className="text-2xl font-black tracking-tight mt-1">{savedForms.length} <span className="text-xs text-outline font-bold">个</span></h4>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">流转、普通及问卷表单</p>
          </div>
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-505">
            <FileText className="w-5 h-5 animate-pulse text-indigo-500" />
          </div>
        </div>

        <div className="sleek-card p-6 bg-white border border-outline-variant/60 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-outline">累计填报数据量</span>
            <h4 className="text-2xl font-black tracking-tight mt-1">{grandTotalSumbissions} <span className="text-xs text-outline font-bold">条</span></h4>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">全企业业务报送汇聚</p>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>

        <div className="sleek-card p-6 bg-primary text-white flex items-center justify-between shadow-2xl shadow-primary/20">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-white/70">当前选定表单数据</span>
            <h4 className="text-2xl font-black tracking-tight mt-1">{filteredRecords.length} <span className="text-xs text-white/75 font-semibold">条</span></h4>
            <p className="text-[10px] text-white/80 font-medium mt-0.5">包含筛选/检索状态记录</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main interactive split pane */}
      <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[600px]">
        
        {/* Left pane - selection checklist (Apps & Forms list) */}
        <div className="w-full lg:w-80 bg-white border border-outline-variant/60 rounded-3xl p-5 shrink-0 shadow-sm space-y-6">
          
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-on-surface">应用与表单目录</h3>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">选择对应应用调取关联的表单列表</p>
          </div>

          {/* Quick filter app search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/60" />
            <input 
              type="text" 
              placeholder="搜索应用..." 
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-outline-variant hover:border-outline/50 focus:border-primary/50 text-xs font-bold rounded-xl transition-all"
            />
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredProjects.map((p) => {
              const IconComp = getProjectIcon(p.icon);
              const isSelected = p.id === selectedProjectId;
              const matchingForms = savedForms.filter(f => f.projectId === p.id);

              return (
                <div key={p.id} className="space-y-2">
                  {/* Project card */}
                  <div 
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected 
                        ? 'bg-primary/5 border-primary shadow-sm' 
                        : 'border-outline-variant/60 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant border border-outline-variant'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-extrabold truncate text-on-surface">{p.name}</h4>
                      <p className="text-[9px] text-outline font-semibold mt-0.5">{matchingForms.length} 个表单</p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-primary rotate-90' : 'text-outline/40'
                    }`} />
                  </div>

                  {/* Interlinked form children nested list (only shown if parent is selected) */}
                  {isSelected && (
                    <div className="pl-4 space-y-1 border-l-2 border-primary/20 ml-7 py-1 animate-in fade-in slide-in-from-left-2 duration-200">
                      {matchingForms.length === 0 ? (
                        <p className="text-[10px] text-outline font-semibold py-1">暂无相关表单</p>
                      ) : (
                        matchingForms.map((f) => {
                          const isActiveForm = f.id === selectedFormId;
                          
                          // Label helper for form categories
                          const formTypeLabel = f.type === 'workflow' ? '流程' : f.type === 'report' ? '报表' : f.type === 'dashboard' ? '看板' : '普通';
                          const themeBadge = f.type === 'workflow' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';

                          return (
                            <button
                              key={f.id}
                              onClick={() => setSelectedFormId(f.id)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between ${
                                isActiveForm 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                              }`}
                            >
                              <span className="truncate flex-1 pr-2">{f.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-black shrink-0 ${themeBadge}`}>
                                {formTypeLabel}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="text-center py-8 text-outline text-xs">
                没有找到匹配的应用
              </div>
            )}
          </div>
        </div>

        {/* Right pane - Dynamic Tabular Spreadsheet dashboard */}
        <div className="flex-1 w-full bg-white border border-outline-variant/60 rounded-3xl shadow-sm p-6 space-y-6">
          
          {/* Active sheet identifier and top action headers */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black tracking-widest uppercase">已发布底表</span>
                {activeForm?.designer && <span className="text-[10px] text-outline font-semibold">创建者: {activeForm.designer}</span>}
              </div>
              <h2 className="text-base font-black tracking-tight text-on-surface mt-1.5 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />
                {activeForm ? activeForm.name : '数据管理中台'}
              </h2>
              <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                {activeForm ? `表单ID: ${activeForm.id} • 获取已报送填报的最新流程明细` : '请在左侧点击展开应用，选择对应的已发布表单进行数据审计'}
              </p>
            </div>

            {activeForm && (
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-opacity-90 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer animate-in fade-in zoom-in-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加数据</span>
                </button>
                <button 
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-surface border border-outline-variant hover:border-outline text-on-surface rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-outline" />
                  <span>导出报表</span>
                </button>
              </div>
            )}
          </div>

          {activeForm ? (
            <div className="space-y-4">
              
              {/* Internal filters toolbar */}
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Search query */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/65" />
                  <input 
                    type="text" 
                    placeholder="在当前底表中检索关键字..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-surface hover:bg-surface-container-low border border-outline-variant hover:border-outline/50 focus:border-primary/50 text-xs font-bold rounded-xl transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-outline hover:text-on-surface font-extrabold"
                    >清空</button>
                  )}
                </div>

                {/* Status Dropdown filter (only if record meta includes status) */}
                {uniqueStatuses.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-outline font-extrabold whitespace-nowrap hidden sm:inline">状态筛选:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-surface border border-outline-variant text-xs font-bold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-primary/50"
                    >
                      <option value="all">显示全部 ({activeFormRecords.length})</option>
                      {uniqueStatuses.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    showNotification('数据视图已重置刷新');
                  }}
                  className="p-2 border border-outline-variant hover:border-outline rounded-xl hover:bg-surface active:scale-95 transition-all text-on-surface-variant flex items-center justify-center cursor-pointer"
                  title="重置刷新"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Responsive Elegant Data Table section */}
              <div className="border border-outline-variant/60 rounded-2xl overflow-hidden shadow-inner bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-surface-container-low/60 border-b border-outline-variant">
                        <th className="p-4 text-[10px] font-black text-outline uppercase tracking-wider pl-6 w-16">
                          ID
                        </th>
                        
                        {/* Dynamic custom columns */}
                        {activeColumns.map((col) => (
                          <th key={col.key} className="p-4 text-[10px] font-black text-outline uppercase tracking-wider">
                            {col.label}
                          </th>
                        ))}

                        <th className="p-4 text-[10px] font-black text-outline uppercase tracking-wider text-right pr-6 w-28">
                          管理操作
                        </th>
                      </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-outline-variant/60">
                      {filteredRecords.map((row, index) => (
                        <tr key={row.id} className="hover:bg-primary/5 transition-colors text-xs font-bold text-on-surface group">
                          <td className="p-4 pl-6 text-outline font-mono">
                            {row.id.startsWith('new_r') ? 'TBD' : `#${index + 1}`}
                          </td>

                          {/* Dynamic dynamic custom row value maps */}
                          {activeColumns.map((col) => {
                            const value = row[col.key];

                            return (
                              <td key={col.key} className="p-4 max-w-xs truncate">
                                {col.type === 'status' ? (
                                  renderRecordStatusBadge(value || '')
                                ) : col.key === 'comment' || col.key === 'record' || col.key === 'suggestion' ? (
                                  <span className="text-on-surface-variant font-medium block max-w-xs truncate" title={value}>
                                    {value || '-'}
                                  </span>
                                ) : (
                                  <span>{value === undefined || value === null ? '-' : value}</span>
                                )}
                              </td>
                            );
                          })}

                          {/* Interactive management operations */}
                          <td className="p-4 text-right pr-6 space-x-1 whitespace-nowrap">
                            <button 
                              onClick={() => {
                                setSelectedRecord(row);
                                setIsDetailsModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-surface-container-low hover:bg-primary/10 text-on-surface-variant hover:text-primary rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 active:scale-95"
                            >
                              <Eye className="w-3 h-3" />
                              <span>详情</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteRow(row.id)}
                              className="px-2.5 py-1 bg-surface-container-low hover:bg-red-50 text-on-surface-variant hover:text-red-600 rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 active:scale-95"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>删除</span>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredRecords.length === 0 && (
                        <tr>
                          <td colSpan={activeColumns.length + 2} className="p-16 text-center text-outline font-bold">
                            <div className="flex flex-col items-center gap-2 justify-center">
                              <FileSearch className="w-10 h-10 text-outline/40" />
                              <span className="text-xs">未找到任何符合筛选条件的填报数据</span>
                              <button 
                                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }} 
                                className="text-[10px] text-primary hover:underline font-bold mt-1"
                              >
                                重置过滤器
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Simulated table footer context */}
                <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant flex items-center justify-between text-[10px] text-outline font-extrabold">
                  <span>总计 {filteredRecords.length} / {activeFormRecords.length} 项记录</span>
                  <span className="text-primary font-bold">● 已连接分布式企业数据链中心 · 数据安全审计保障中</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-outline-variant rounded-3xl bg-surface/30">
              <Database className="w-16 h-16 text-outline/35 mb-4 animate-bounce" />
              <h3 className="text-sm font-black text-on-surface">请在左侧选择对应数据表单</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mt-1 mb-6 font-medium">数据管理专为企业管理及报送审计人员提供。可集中查看、检索和导出各业务场景下由页面或流程收集的数据成果指标。</p>
              
              <div className="flex gap-4">
                {projects.slice(1, 3).map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-outline-variant hover:border-primary rounded-xl text-xs font-bold text-on-surface-variant hover:text-primary transition-all shadow-sm"
                  >
                    <span>快捷选择: {p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Row detail sliding panel dialog overlay */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-end pl-10 select-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col border-l border-outline-variant"
            >
              <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-primary text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      底表元数据
                    </span>
                    <span className="text-[10px] font-mono font-bold text-outline">
                      ID: {selectedRecord.id}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-on-surface mt-1.5">
                    表单提交结果明细详情
                  </h3>
                </div>
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-1 px-2.5 text-xs text-outline font-extrabold bg-white border border-outline-variant rounded-lg hover:bg-surface transition-all cursor-pointer"
                >
                  关闭
                </button>
              </div>

              {/* Panel detail Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                
                <div className="space-y-4">
                  <h4 className="text-[10px] border-b border-outline-variant text-outline font-extrabold pb-1 tracking-wider uppercase">
                    提交字段键值映射表
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeColumns.map(col => {
                      const value = selectedRecord[col.key];
                      const isComment = col.key === 'comment' || col.key === 'record' || col.key === 'suggestion';
                      return (
                        <div key={col.key} className={`p-4 rounded-2xl border border-outline-variant/60 bg-surface/30 space-y-1 ${isComment ? 'col-span-1 md:col-span-2' : ''}`}>
                          <span className="text-[10px] text-outline font-bold block">{col.label}</span>
                          <div className="text-xs font-black text-on-surface">
                            {col.type === 'status' ? (
                              renderRecordStatusBadge(value || '')
                            ) : (
                              <p className="whitespace-pre-line leading-relaxed">{value === undefined || value === null ? '-' : value}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit trail */}
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl space-y-2">
                  <h5 className="text-[11px] font-extrabold text-yellow-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    安全及真实性审计证书
                  </h5>
                  <p className="text-[10px] text-yellow-700/80 leading-relaxed font-bold">
                    该条业务填报日志已由平台实时审计模块登记，记录IP, 时间戳, 安全信誉值及用户角色加密快照，满足分布式防篡改核定基准。
                  </p>
                </div>

              </div>

              <div className="p-6 border-t border-outline-variant/60 flex gap-3 bg-surface-container-low/60 justify-end">
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant hover:border-outline text-on-surface rounded-xl text-xs font-bold bg-white transition-all shadow-sm cursor-pointer"
                >
                  确认返回
                </button>
                <button 
                  onClick={() => {
                    handleDeleteRow(selectedRecord.id);
                    setIsDetailsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-opacity-95 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  删除此条记录
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New record wizard popup form Modal */}
      <AnimatePresence>
        {isNewRecordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewRecordModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <div>
                  <h3 className="text-sm font-black text-on-surface">
                    人工填报新数据到 [{activeForm?.name}]
                  </h3>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                    表单属性字段录入。完成后将即时汇聚并追加至表格底部。
                  </p>
                </div>
                <button 
                  onClick={() => setIsNewRecordModalOpen(false)}
                  className="p-1 px-2.5 text-xs text-outline font-extrabold bg-white border border-outline-variant rounded-lg hover:bg-surface transition-all cursor-pointer"
                >
                  取消
                </button>
              </div>

              <form onSubmit={handleSaveNewRecord} className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeColumns.map(col => {
                  const isComment = col.key === 'comment' || col.key === 'record' || col.key === 'suggestion';
                  
                  return (
                    <div key={col.key} className="space-y-1">
                      <label className="text-[10px] text-outline font-bold">
                        {col.label} {col.key === 'status' ? '' : '(选填)'}
                      </label>
                      
                      {col.key === 'status' ? (
                        <select
                          value={newRecordFields[col.key] || ''}
                          onChange={(e) => {
                            setNewRecordFields(prev => ({ ...prev, [col.key]: e.target.value }));
                          }}
                          className="w-full text-xs font-bold p-3 bg-surface border border-outline-variant hover:border-outline rounded-xl focus:border-primary focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="已通过">已通过</option>
                          <option value="审批中">审批中</option>
                          <option value="已拒绝">已拒绝</option>
                          <option value="推荐录用">推荐录用</option>
                          <option value="不予录用">不予录用</option>
                          <option value="高度意向">高度意向</option>
                          <option value="商务跟进中">商务跟进中</option>
                          <option value="签约中">签约中</option>
                        </select>
                      ) : isComment ? (
                        <textarea
                          rows={3}
                          placeholder={`请输入${col.label}...`}
                          value={newRecordFields[col.key] || ''}
                          onChange={(e) => {
                            setNewRecordFields(prev => ({ ...prev, [col.key]: e.target.value }));
                          }}
                          className="w-full text-xs font-bold p-3 bg-surface border border-outline-variant hover:border-outline rounded-xl focus:border-primary focus:outline-none transition-all resize-none"
                        />
                      ) : (
                        <input
                          type={col.type === 'number' ? 'number' : 'text'}
                          placeholder={`请输入${col.label}...`}
                          value={newRecordFields[col.key] || ''}
                          onChange={(e) => {
                            setNewRecordFields(prev => ({ ...prev, [col.key]: e.target.value }));
                          }}
                          className="w-full text-xs font-bold p-3 bg-surface border border-outline-variant hover:border-outline rounded-xl focus:border-primary focus:outline-none transition-all"
                        />
                      )}
                    </div>
                  );
                })}

                <button type="submit" className="hidden" id="submit-hidden-btn" />
              </form>

              <div className="p-6 border-t border-outline-variant/60 flex justify-end gap-3 bg-surface-container-low/60">
                <button
                  type="button"
                  onClick={() => setIsNewRecordModalOpen(false)}
                  className="px-4 py-2 bg-white border border-outline-variant text-on-surface rounded-xl text-xs font-bold transition-all hover:bg-surface active:scale-95 shadow-sm cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                     const btn = document.getElementById('submit-hidden-btn');
                     btn?.click();
                  }}
                  className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs transition-all hover:bg-opacity-95 active:scale-95 shadow-md shadow-primary/10 cursor-pointer"
                >
                  增加填报
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TeamView = ({ 
  teamMembers, 
  orgData, 
  onAddMember, 
  onUpdateMember, 
  onDeleteMember,
  onAddDept,
  onUpdateDept,
  onDeleteDept,
  showNotification
}: TeamViewProps) => {
  const [activeTab, setActiveTab] = React.useState<'org' | 'users' | 'roles'>('roles');
  const [selectedDeptId, setSelectedDeptId] = React.useState<string | null>(orgData[0]?.id || null);

  // Filter states for read-only user queries
  const [filterName, setFilterName] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('All');
  const [filterStatus, setFilterStatus] = React.useState('All');

  // External system sync simulation state
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncTime, setLastSyncTime] = React.useState('2026-06-18 10:00:24');

  // Trigger sync simulation
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setLastSyncTime(timeStr);
      if (showNotification) {
        showNotification('企业身份主数据拉取成功：已更新 45 个组织单元，同步 382 个成员映射！');
      }
    }, 1200);
  };

  // Preset default roles as requested
  const [roles, setRoles] = React.useState<any[]>([
    {
      id: 'designer',
      name: '表单设计人',
      code: 'FORM_DESIGNER',
      desc: '专职于业务表单、工作流引擎、发布策略的全生命周期配置管理。',
      count: 8,
      color: 'border-primary',
      menus: {
        dashboard: true,
        designer: true,
        dataCenter: true,
        insights: true,
        workflow: true,
        settings: false,
      },
      pages: {
        formFill: true,
        formDesign: true,
        workflowDesign: true,
        publishPage: true,
      },
      operations: {
        createForm: true,
        deleteForm: true,
        exportData: true,
        batchDelete: false,
        editSystemSettings: false,
      },
      dataScope: 'dept', // 本组织
    },
    {
      id: 'filler',
      name: '表单填写人',
      code: 'FORM_FILLER',
      desc: '标准的终端业务填报/移动端协作岗位，可自主填报并检索其本人提交的历史记录。',
      count: 124,
      color: 'bg-green-500 border-green-500',
      menus: {
        dashboard: true,
        designer: false,
        dataCenter: false,
        insights: false,
        workflow: false,
        settings: false,
      },
      pages: {
        formFill: true,
        formDesign: false,
        workflowDesign: false,
        publishPage: false,
      },
      operations: {
        createForm: false,
        deleteForm: false,
        exportData: false,
        batchDelete: false,
        editSystemSettings: false,
      },
      dataScope: 'self', // 本人
    },
    {
      id: 'admin',
      name: '管理人员',
      code: 'ADMINISTRATIVE',
      desc: '全局管理员，拥有全局底单统配数据审核、系统架构重设及最终特权。',
      count: 2,
      color: 'border-secondary',
      menus: {
        dashboard: true,
        designer: true,
        dataCenter: true,
        insights: true,
        workflow: true,
        settings: true,
      },
      pages: {
        formFill: true,
        formDesign: true,
        workflowDesign: true,
        publishPage: true,
      },
      operations: {
        createForm: true,
        deleteForm: true,
        exportData: true,
        batchDelete: true,
        editSystemSettings: true,
      },
      dataScope: 'all', // 全部
    },
  ]);

  const [selectedRoleId, setSelectedRoleId] = React.useState<string>('designer');
  const [isSavingPolicy, setIsSavingPolicy] = React.useState(false);

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleUpdatePolicy = (field: 'menus' | 'pages' | 'operations', subKey: string, val: boolean) => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        return {
          ...r,
          [field]: {
            ...r[field],
            [subKey]: val
          }
        };
      }
      return r;
    }));
  };

  const handleUpdateDataScope = (scope: 'self' | 'self_sub' | 'dept' | 'dept_charge' | 'all') => {
    setRoles(prev => prev.map(r => {
      if (r.id === selectedRoleId) {
        return {
          ...r,
          dataScope: scope
        };
      }
      return r;
    }));
  };

  const handleSavePolicies = () => {
    setIsSavingPolicy(true);
    setTimeout(() => {
      setIsSavingPolicy(false);
      if (showNotification) {
        showNotification(`角色的核心功能及数据过滤策略包保存成功，已向 AD 域下发对应角色定义！`);
      }
    }, 800);
  };

  const getDeptNameById = (id: string, nodes: OrgNode[]): string => {
    for (const node of nodes) {
      if (node.id === id) return node.name;
      if (node.children) {
        const found = getDeptNameById(id, node.children);
        if (found !== '未知部门') return found;
      }
    }
    return '未知部门';
  };

  const filteredMembers = teamMembers.filter(m => {
    const matchesDept = !selectedDeptId || m.deptId === selectedDeptId;
    const matchesName = m.name.toLowerCase().includes(filterName.toLowerCase()) || m.id.includes(filterName);
    const matchesRole = filterRole === 'All' || m.role === filterRole;
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    return matchesDept && matchesName && matchesRole && matchesStatus;
  });

  const ReadOnlyOrgTreeItem = ({ node, level = 0 }: { node: OrgNode; level?: number; key?: any }) => {
    const [isExpanded, setIsExpanded] = React.useState(level < 2);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div className="select-none relative">
        {level > 0 && (
          <div 
            className="absolute left-0 top-0 w-px bg-outline-variant/30 h-full" 
            style={{ left: `${(level - 1) * 16 + 10}px` }}
          />
        )}
        <div 
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-primary/5 transition-all text-on-surface-variant ${selectedDeptId === node.id ? 'bg-primary/5 text-primary border border-primary/10' : ''}`}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={() => setSelectedDeptId(node.id)}
        >
          {level > 0 && (
            <div className="absolute -left-4 top-1/2 w-4 h-px bg-outline-variant/30" />
          )}
          <div 
            className="w-4 h-4 flex items-center justify-center transition-transform z-10 text-outline/40"
            onClick={(e) => {
              if (hasChildren) {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }
            }}
          >
            {hasChildren ? (
              <ChevronRight className={`w-3 h-3 transform transition-transform ${isExpanded ? 'rotate-90 text-primary' : ''}`} />
            ) : (
              <div className="w-1 h-1 rounded-full bg-outline-variant" />
            )}
          </div>
          
          <div className="flex-1 flex items-center gap-2 overflow-hidden">
            <Building2 className={`w-3.5 h-3.5 shrink-0 ${selectedDeptId === node.id ? 'text-primary' : 'opacity-40 text-on-surface-variant'}`} />
            <span className={`text-xs font-black tracking-tight ${selectedDeptId === node.id ? 'text-primary' : 'text-on-surface'}`}>{node.name}</span>
          </div>

          <span className="text-[9px] font-black tracking-widest text-outline/50 scale-90">🔒</span>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5">
            {node.children!.map(child => (
              <ReadOnlyOrgTreeItem key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white select-none">
      {/* Side Tabs Navigation */}
      <div className="w-20 border-r border-outline-variant bg-surface-container-lowest flex flex-col items-center py-8 gap-6 shrink-0 shadow-[1px_0_0_rgba(0,0,0,0.02)]">
         {[
           { id: 'roles', icon: ShieldCheck, label: '角色' },
           { id: 'org', icon: Network, label: '组织' },
           { id: 'users', icon: Users, label: '用户' },
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex flex-col items-center gap-1 group relative transition-all ${activeTab === tab.id ? 'text-primary' : 'text-outline hover:text-on-surface'}`}
           >
             <div className={`p-3 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'bg-primary/10 shadow-xl shadow-primary/10 border border-primary/20 scale-110' : 'hover:bg-surface border border-transparent'}`}>
                <tab.icon className="w-5 h-5" />
             </div>
             <span className="text-[9px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
             {activeTab === tab.id && <motion.div layoutId="activeTabIndicator" className="absolute -left-[2.5rem] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full" />}
           </button>
         ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 一、 组织管理 - 外部托管架构只读透视与外部跳转 */}
        {activeTab === 'org' && (
          <div className="flex-1 flex bg-surface-container-lowest">
            {/* Left sidebar for Org tree */}
            <div className="w-80 bg-white border-r border-outline-variant flex flex-col p-8 space-y-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 overflow-y-auto">
               <div className="space-y-1">
                  <h3 className="font-black tracking-tight text-lg flex items-center gap-2">
                    <Network className="w-5 h-5 text-primary" />
                    组织架构透视
                  </h3>
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Departmental Schema</p>
               </div>

               {/* External status box */}
               <div className="bg-surface px-4 py-3 rounded-2xl border border-outline-variant/65 space-y-1">
                 <div className="flex items-center gap-1.5 text-[10px] font-black text-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>外部HRM已连接</span>
                 </div>
                 <p className="text-[9px] text-outline leading-tight font-medium">
                   数据流：只读同步，禁止本地篡改
                 </p>
               </div>

               <div className="flex-1 space-y-1 custom-scrollbar">
                  {orgData.map(node => (
                    <ReadOnlyOrgTreeItem key={node.id} node={node} />
                  ))}
               </div>
            </div>

            {/* Read-Only Portal on Right */}
            <div className="flex-1 p-12 flex flex-col bg-white overflow-y-auto custom-scrollbar">
               <div className="w-full space-y-10">
                 {/* Top Guard Portal Block */}
                 <div className="relative overflow-hidden p-10 bg-primary/5 rounded-[3rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="absolute right-0 top-0 translate-x-12 -translate-y-10 opacity-5 pointer-events-none">
                     <Lock className="w-64 h-64" />
                   </div>
                   <div className="space-y-4 max-w-xl">
                     <div className="flex items-center gap-2">
                       <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                         外部系统托管
                       </span>
                       <span className="text-outline font-bold text-xs flex items-center gap-1">
                         <Info className="w-3.5 h-3.5 text-on-surface-variant/50" /> 本地为只读视图
                       </span>
                     </div>
                     <h2 className="text-3xl font-black tracking-tight text-on-surface">组织数据存储在外部系统</h2>
                     <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                       本系统的组织架构单元和层级关联均存储和维护在第三方系统（如：企业微信、网关 LDAP、或企业专属 HRM 统筹系统）。系统在此仅作为权限管控的数据过滤器基础层，无权修改基础属性。
                     </p>
                   </div>
                   <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                     <a 
                       href="https://hrm.company.internal/staff/organization"
                       onClick={(e) => { e.preventDefault(); if (showNotification) showNotification("演示模式：已为您模拟发出跳转 HRM 系统的 SSO 验证票据..."); }}
                       className="px-8 py-4 bg-on-surface hover:bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl hover:-translate-y-1"
                     >
                       <span>前往企业 HRM 系统进行维护</span>
                       <ExternalLink className="w-4 h-4" />
                     </a>
                     <a 
                       href="https://idaas.company.internal/organizations"
                       onClick={(e) => { e.preventDefault(); if (showNotification) showNotification("演示模式：已启动跳转 IDaaS 验证流，单点登录成功。"); }}
                       className="px-8 py-4 bg-white border border-outline-variant hover:border-primary text-on-surface hover:text-primary rounded-2xl text-xs text-center font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm"
                     >
                       <span>前往 IDaaS 统一身份中心</span>
                       <ExternalLink className="w-4 h-4" />
                     </a>
                   </div>
                 </div>

                 {/* Sync monitor widgets */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                   <div className="bg-surface p-6 rounded-3xl border border-outline-variant/60 flex flex-col gap-1.5 shadow-sm">
                     <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest leading-none">同步引擎</span>
                     <span className="text-base font-black text-on-surface">ActiveDirectory (AD)</span>
                     <span className="text-[9px] text-outline mt-1 block">单向定时集成链路</span>
                   </div>
                   <div className="bg-surface p-6 rounded-3xl border border-outline-variant/60 flex flex-col gap-1.5 shadow-sm">
                     <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest leading-none">最近映射时间</span>
                     <span className="text-base font-black text-on-surface font-mono">{lastSyncTime}</span>
                     <span className="text-[9px] text-outline mt-1 block">集成周期: 3 分钟/次</span>
                   </div>
                   <div className="bg-surface p-6 rounded-3xl border border-outline-variant/60 flex flex-col gap-1.5 shadow-sm">
                     <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest leading-none">手动增量同步</span>
                     <button
                       onClick={handleTriggerSync}
                       disabled={isSyncing}
                       className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-xl text-xs font-bold transition-all w-fit shadow-md shadow-primary/10 mt-1"
                     >
                       <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                       <span>{isSyncing ? '正在同步验证...' : '立即拉取最新'}</span>
                     </button>
                   </div>
                 </div>

                 {/* Department details view */}
                 <div className="space-y-4 pt-4 border-t border-outline-variant">
                   <div className="flex justify-between items-center">
                     <div className="space-y-0.5">
                       <h4 className="text-sm font-black text-on-surface">
                         已选中部门关联情况 : {selectedDeptId ? getDeptNameById(selectedDeptId, orgData) : '未选中'}
                       </h4>
                       <p className="text-[11px] text-outline font-medium">下方为该部门在自定义表单中的归属配置透视图</p>
                     </div>
                     <span className="bg-surface border border-outline-variant px-3 py-1 rounded-xl text-[10px] text-outline font-bold">同步深度: 全级透查</span>
                   </div>

                   <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">上级分支代码</span>
                       <code className="text-xs font-mono font-bold text-on-surface bg-surface px-2.5 py-1 rounded-lg border">
                         AD-NODE-{selectedDeptId || 'N/A'}-MAPPED
                       </code>
                     </div>
                     <div className="space-y-2">
                       <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">部门分管负责人</span>
                       <span className="text-xs text-on-surface font-bold flex items-center gap-1.5">
                         <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black">M</div>
                         <span>李默（人事主键代号：UID-9903）</span>
                       </span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* 二、 用户管理 - 外部身份池及系统角色直接分配 */}
        {activeTab === 'users' && (
          <div className="flex-1 flex flex-col bg-white overflow-hidden animate-in fade-in duration-500">
             <div className="p-12 border-b border-outline-variant space-y-8 bg-surface-container-lowest/30">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div className="space-y-1.5">
                   <div className="flex items-center gap-2">
                     <h2 className="text-5xl font-black tracking-tighter text-on-surface">用户管理</h2>
                     <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                       外部身份映射 (只读)
                     </span>
                   </div>
                   <p className="text-xs text-on-surface-variant font-medium">用户信息和在职状态托管在企业主系统中。系统检测并对已接入成员完成底表权限的精细分类。</p>
                 </div>
                 
                 <div className="flex gap-3">
                   <button
                     onClick={handleTriggerSync}
                     disabled={isSyncing}
                     className="flex items-center gap-2 px-6 py-4 border border-outline-variant hover:border-primary rounded-2xl text-xs font-black uppercase tracking-wider bg-white transition-all shadow-sm"
                   >
                     <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                     <span>{isSyncing ? '正在同步数据...' : '手动执行身份同步'}</span>
                   </button>
                   <a 
                     href="https://idaas.company.internal/staff/accounts" 
                     onClick={(e) => { e.preventDefault(); if (showNotification) showNotification("演示模式：已为您生成企业专属的单点鉴权跳链。"); }}
                     className="flex items-center gap-2 px-6 py-4 bg-on-surface hover:bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl hover:-translate-y-1"
                   >
                     <span>维护全局用户账号</span>
                     <ExternalLink className="w-4 h-4" />
                   </a>
                 </div>
               </div>

               {/* Quick stats and filters */}
               <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-2">
                 <div className="col-span-1 md:col-span-2 relative group">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                   <input 
                     type="text" 
                     placeholder="搜索姓名、邮箱、工号以定位成员..."
                     value={filterName}
                     onChange={(e) => setFilterName(e.target.value)}
                     className="w-full bg-surface border-2 border-transparent focus:border-primary focus:bg-white rounded-[1.5rem] pl-14 pr-6 py-4.5 text-xs focus:outline-none transition-all font-black placeholder:text-outline/40 shadow-inner"
                   />
                 </div>
                 <div className="relative group">
                   <select 
                     value={filterRole}
                     onChange={(e) => setFilterRole(e.target.value)}
                     className="w-full bg-white border-2 border-outline-variant/30 hover:border-primary rounded-[1.5rem] px-6 py-4.5 text-xs focus:outline-none font-black appearance-none cursor-pointer transition-all shadow-sm"
                   >
                     <option value="All">所有系统角色</option>
                     <option value="Admin">管理员</option>
                     <option value="Editor">编辑者</option>
                     <option value="Viewer">查看者</option>
                     <option value="Manager">经理</option>
                   </select>
                   <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none group-hover:text-primary transition-colors" />
                 </div>
                 <div className="relative group">
                   <select 
                     value={filterStatus}
                     onChange={(e) => setFilterStatus(e.target.value)}
                     className="w-full bg-white border-2 border-outline-variant/30 hover:border-primary rounded-[1.5rem] px-6 py-4.5 text-xs focus:outline-none font-black appearance-none cursor-pointer transition-all shadow-sm"
                   >
                     <option value="All">同步就绪状态</option>
                     <option value="Active">活跃就绪 (Active)</option>
                     <option value="Inactive">待激活 (Off-grid)</option>
                   </select>
                   <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none group-hover:text-primary transition-colors" />
                 </div>
                 <button 
                   onClick={() => { setFilterName(''); setFilterRole('All'); setFilterStatus('All'); }}
                   className="aspect-square flex items-center justify-center text-outline hover:text-white hover:bg-primary transition-all rounded-[1.2rem] border-2 border-outline-variant/30 shadow-sm"
                 >
                   <RefreshCw className="w-5 h-5" />
                 </button>
               </div>
             </div>

             {/* Directory Table */}
             <div className="flex-1 overflow-auto custom-scrollbar p-12">
                <table className="w-full text-left border-separate border-spacing-y-4">
                   <thead>
                      <tr className="text-[10px] font-black text-outline uppercase tracking-[0.25em] opacity-60">
                         <th className="px-8 py-4">ADM 身份代号</th>
                         <th className="px-8 py-4">实体账户</th>
                         <th className="px-8 py-4">所属组织架构</th>
                         <th className="px-8 py-4">系统授权</th>
                         <th className="px-8 py-4">数据源通道</th>
                         <th className="px-8 py-4 text-right">角色分配</th>
                      </tr>
                   </thead>
                   <tbody>
                      {filteredMembers.map((user) => (
                        <tr key={user.id} className="group transition-all">
                           <td className="px-8 py-6 text-[10px] font-black text-outline-variant font-mono bg-surface-container-lowest border-y border-l border-outline-variant/30 rounded-l-[1.5rem] group-hover:bg-primary/5 transition-all">
                             SYS-{user.id.padStart(4, '0')}
                           </td>
                           <td className="px-8 py-6 bg-surface-container-lowest border-y border-outline-variant/30 group-hover:bg-primary/5 transition-all">
                              <div className="flex items-center gap-5">
                                  <div className="relative shrink-0">
                                    <div className="absolute -inset-1.5 bg-primary/10 rounded-[1.2rem] opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                                    <img 
                                      src={`https://picsum.photos/seed/user-${user.id}/100/100`} 
                                      className="w-12 h-12 rounded-[1.1rem] border-2 border-white shadow-xl relative z-10 group-hover:rotate-6 transition-all" 
                                      referrerPolicy="no-referrer"
                                      alt="Avatar"
                                    />
                                    {user.status === 'Active' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-20 shadow-lg" />}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="font-black text-sm text-on-surface tracking-tight group-hover:text-primary transition-colors">{user.name}</span>
                                     <span className="text-[10px] font-bold text-outline-variant uppercase font-mono tracking-tight">{user.email}</span>
                                  </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 bg-surface-container-lowest border-y border-outline-variant/30 group-hover:bg-primary/5 transition-all">
                              <div className="flex items-center gap-2.5 px-4 py-2 bg-on-surface/5 rounded-2xl border border-on-surface/5 w-fit shadow-inner">
                                 <Building2 className="w-3.5 h-3.5 text-on-surface/40" />
                                 <span className="text-[10px] font-black tracking-tight text-on-surface/70">{getDeptNameById(user.deptId, orgData)}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 bg-surface-container-lowest border-y border-outline-variant/30 group-hover:bg-primary/5 transition-all">
                              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border-2 tracking-[0.05em] uppercase shadow-sm ${
                                 user.role === 'Admin' ? 'bg-primary/5 text-primary border-primary/20' : 
                                 user.role === 'Manager' ? 'bg-secondary/5 text-secondary border-secondary/20' : 
                                 'bg-on-surface/5 text-on-surface-variant border-outline-variant/40'
                              }`}>
                                {user.role === 'Admin' ? '超级管理员' : user.role === 'Manager' ? '业务经理' : user.role === 'Editor' ? '内容编辑' : '普通访客'}
                              </span>
                           </td>
                           <td className="px-8 py-6 bg-surface-container-lowest border-y border-outline-variant/30 group-hover:bg-primary/5 transition-all">
                              <span className="text-[9px] font-black bg-outline-variant/15 text-outline px-3 py-1 rounded-full uppercase tracking-wider">
                                🔒 LDAP Mapped
                              </span>
                           </td>
                           <td className="px-8 py-6 bg-surface-container-lowest border-y border-r border-outline-variant/30 group-hover:bg-primary/5 rounded-r-[1.5rem] transition-all text-right">
                              <select
                                value={user.role}
                                onChange={(e) => {
                                  onUpdateMember({
                                    ...user,
                                    role: e.target.value
                                  });
                                }}
                                className="bg-white border text-[11px] font-black px-3 py-1.5 rounded-xl border-outline-variant focus:outline-none focus:border-primary shrink-0 cursor-pointer text-on-surface"
                              >
                                <option value="Admin">管理员</option>
                                <option value="Editor">开发设计</option>
                                <option value="Manager">经理</option>
                                <option value="Viewer">查看客</option>
                              </select>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* 三、 角色管理 - 支持 默认预设角色功能 与 菜单、页面、操作和数据全生命周期管控 */}
        {activeTab === 'roles' && (
          <div className="flex-1 flex bg-surface-container-lowest/40 animate-in fade-in duration-500 overflow-hidden">
             {/* Left Panel: Role List */}
             <div className="w-96 bg-white border-r border-outline-variant flex flex-col overflow-y-auto z-10 select-none">
                <div className="p-8 border-b border-outline-variant space-y-2">
                   <h2 className="text-3xl font-black tracking-tight text-on-surface flex items-center gap-2">
                     <ShieldCheck className="w-7 h-7 text-primary" />
                     角色配置中心
                   </h2>
                   <p className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">RBAC Governance Panel</p>
                </div>

                <div className="p-6 space-y-4 flex-1">
                   {roles.map((role) => (
                     <button
                       key={role.id}
                       onClick={() => setSelectedRoleId(role.id)}
                       className={`w-full p-6 text-left border rounded-[2rem] transition-all flex flex-col gap-4 relative group overflow-hidden ${
                         selectedRoleId === role.id 
                           ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5' 
                           : 'bg-white border-outline-variant hover:bg-surface-container-low'
                       }`}
                     >
                       <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                          <ShieldCheck className="w-16 h-16" />
                       </div>
                       
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <span className={`w-2.5 h-2.5 rounded-full ${
                             role.id === 'designer' ? 'bg-primary' : 
                             role.id === 'filler' ? 'bg-green-500' : 'bg-secondary'
                           }`} />
                           <span className="text-[10px] font-black bg-on-surface/5 text-on-surface-variant px-2 py-0.5 rounded uppercase tracking-widest leading-none">
                             {role.code}
                           </span>
                         </div>
                         <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full">
                           {role.count} 成员
                         </span>
                       </div>

                       <div>
                         <h4 className="font-extrabold text-lg text-on-surface tracking-tight">{role.name}</h4>
                         <p className="text-[11px] text-outline font-medium mt-1 leading-normal opacity-90 line-clamp-2">
                           {role.desc}
                         </p>
                       </div>
                     </button>
                   ))}

                   {/* Custom non-editable role notice */}
                   <div className="rounded-[2.5rem] border-2 border-dashed border-outline-variant/50 p-8 flex flex-col items-center justify-center text-center gap-3 bg-surface/5">
                     <Lock className="w-6 h-6 text-outline-variant" />
                     <p className="text-[10px] font-bold text-outline leading-tight">
                       企业主系统托管模式下，无法新增角色类别，以确保多系统间身份标识一致。
                     </p>
                   </div>
                </div>
             </div>

             {/* Right Panel: Feature & Data Scope control workspace */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-white flex flex-col">
                <div className="flex-1 space-y-10 w-full mx-auto">
                   
                   {/* Role profile header details */}
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline-variant pb-8 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-3xl font-black text-on-surface tracking-tight">{selectedRole.name}</h3>
                          <span className="bg-primary/10 font-bold font-mono text-[10px] text-primary px-3 py-1 rounded-full uppercase tracking-widest">
                            {selectedRole.code}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium max-w-xl leading-relaxed">
                          {selectedRole.desc}
                        </p>
                      </div>

                      <button
                        onClick={handleSavePolicies}
                        disabled={isSavingPolicy}
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 hover:shadow-primary/20 active:scale-95 shrink-0"
                      >
                        {isSavingPolicy ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>保存权限配置</span>
                      </button>
                   </div>

                   {/* (A) 功能权限 - 菜单/页面/操作权限管控 */}
                   <div className="space-y-8">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-primary rounded-full" />
                        <h4 className="text-base font-black text-on-surface">功能权限管控 (功能清单核验)</h4>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       
                       {/* 1. 菜单权限管控 */}
                       <div className="sleek-card p-6 border border-outline-variant/80 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 text-xs font-black text-on-surface border-b pb-3">
                            <Menu className="w-4 h-4 text-primary" />
                            <span>菜单级访问控制</span>
                          </div>
                          <div className="space-y-3">
                            {[
                              { key: 'dashboard', label: '📊 仪表盘菜单' },
                              { key: 'designer', label: '🛠️ 表单设计器' },
                              { key: 'dataCenter', label: '🗄️ 数据管理中心' },
                              { key: 'insights', label: '📈 智能数据洞察' },
                              { key: 'workflow', label: '🕸️ 工作流审批' },
                              { key: 'settings', label: '⚙️ 系统设置' }
                            ].map((item) => (
                              <label key={item.key} className="flex items-center justify-between p-2 hover:bg-surface rounded-xl cursor-pointer transition-colors">
                                <span className="text-xs font-bold text-on-surface-variant">{item.label}</span>
                                <input
                                  type="checkbox"
                                  checked={selectedRole.menus[item.key]}
                                  onChange={(e) => handleUpdatePolicy('menus', item.key, e.target.checked)}
                                  className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary/20"
                                />
                              </label>
                            ))}
                          </div>
                       </div>

                       {/* 2. 页面控制权限管控 */}
                       <div className="sleek-card p-6 border border-outline-variant/80 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 text-xs font-black text-on-surface border-b pb-3">
                            <Eye className="w-4 h-4 text-primary" />
                            <span>页面级渲染页面控制</span>
                          </div>
                          <div className="space-y-3">
                            {[
                              { key: 'formFill', label: '📝 表单数据填写页面' },
                              { key: 'formDesign', label: '📐 自定义表单设计画布' },
                              { key: 'workflowDesign', label: '🔗 审批逻辑设计面板' },
                              { key: 'publishPage', label: '📦 外部工作台发布管理' }
                            ].map((item) => (
                              <label key={item.key} className="flex items-center justify-between p-2 hover:bg-surface rounded-xl cursor-pointer transition-colors">
                                <span className="text-xs font-bold text-on-surface-variant">{item.label}</span>
                                <input
                                  type="checkbox"
                                  checked={selectedRole.pages[item.key]}
                                  onChange={(e) => handleUpdatePolicy('pages', item.key, e.target.checked)}
                                  className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary/20"
                                />
                              </label>
                            ))}
                          </div>
                       </div>

                       {/* 3. 微观操作权限管控 */}
                       <div className="sleek-card p-6 border border-outline-variant/80 rounded-3xl space-y-4">
                          <div className="flex items-center gap-2 text-xs font-black text-on-surface border-b pb-3">
                            <Sliders className="w-4 h-4 text-primary" />
                            <span>操作级指令细控</span>
                          </div>
                          <div className="space-y-3">
                            {[
                              { key: 'createForm', label: '➕ 新建底单及应用' },
                              { key: 'deleteForm', label: '🚨 物理删除表结构' },
                              { key: 'exportData', label: '📤 导出全量 Excel 视图' },
                              { key: 'batchDelete', label: '☣️ 批量物理覆盖删除' },
                              { key: 'editSystemSettings', label: '🔓 修改全局安全配置' }
                            ].map((item) => (
                              <label key={item.key} className="flex items-center justify-between p-2 hover:bg-surface rounded-xl cursor-pointer transition-colors">
                                <span className="text-xs font-bold text-on-surface-variant">{item.label}</span>
                                <input
                                  type="checkbox"
                                  checked={selectedRole.operations[item.key]}
                                  onChange={(e) => handleUpdatePolicy('operations', item.key, e.target.checked)}
                                  className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary/20"
                                />
                              </label>
                            ))}
                          </div>
                       </div>

                     </div>
                   </div>

                   {/* (B) 数据权限 - 按照获取到的组织关系控制本人、本人及下属、本组织、本组织及负责组织、全部 */}
                   <div className="space-y-6 pt-6 border-t border-outline-variant">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-5 bg-primary rounded-full" />
                          <h4 className="text-base font-black text-on-surface">底表数据可见度控制（根据组织树鉴权）</h4>
                       </div>
                       <span className="bg-primary/5 text-primary text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                         HRM 层级智能过滤
                       </span>
                     </div>
                     <p className="text-xs text-outline font-medium">
                       控制当前角色下的成员，在访问数据管理后台和查看报表底单时，系统应当使用何种关系匹配来过滤该用户的可见范围。
                     </p>

                     <div className="grid grid-cols-1 gap-4 pt-2">
                       {[
                         { 
                           key: 'self', 
                           title: '本人', 
                           expr: 'SQL: author_id = @current_user_id', 
                           desc: '仅对当前用户本人提交填报的数据，或指派本人作为唯一审批流程的记录开放查阅可见性。' 
                         },
                         { 
                           key: 'self_sub', 
                           title: '本人及下属', 
                           expr: 'SQL: author_id IN (@current_user_id, ...@direct_subordinate_ids)', 
                           desc: '通过企业内嵌汇报树（HRM Org-Trace），向上兼容、透视其下方全量有任免汇报关系的普通下级员工的数据。' 
                         },
                         { 
                           key: 'dept', 
                           title: '本组织', 
                           expr: 'SQL: author_dept_id = @current_user_dept_id', 
                           desc: '范围锁定在当前用户所在的主属行政部门底单，屏蔽上级父部门及旁系平行部门的信息，数据在部门间硬隔離。' 
                         },
                         { 
                           key: 'dept_charge', 
                           title: '本组织及负责组织', 
                           expr: 'SQL: author_dept_id IN (@current_user_dept_id, ...@managed_dept_ids)', 
                           desc: '除所属主行政部门外，允许横向读取其在身份中心担任“部门长/虚线负责人”的全部附属职能团队的汇总数据。' 
                         },
                         { 
                           key: 'all', 
                           title: '全部', 
                           expr: 'SQL: 1=1 (跨组织无损通查)', 
                           desc: '放开所有组织、汇报网络和微观限制，允许对该全局表单数据库进行无死角的归档、大屏看板与分析透视。' 
                         }
                       ].map((scope) => (
                         <button
                           key={scope.key}
                           type="button"
                           onClick={() => handleUpdateDataScope(scope.key as any)}
                           className={`p-6 rounded-3xl border text-left transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group ${
                             selectedRole.dataScope === scope.key
                               ? 'bg-primary/5 border-primary shadow-md'
                               : 'bg-surface hover:bg-surface-container-low border-outline-variant'
                           }`}
                         >
                           <div className="space-y-1.5 flex-1">
                             <div className="flex items-center gap-3">
                               <span className="font-mono text-xs text-primary font-black">[@{scope.title}]</span>
                               <span className="text-sm font-black text-on-surface">{scope.title}数据可见性</span>
                             </div>
                             <p className="text-xs text-on-surface-variant font-medium opacity-80 leading-relaxed max-w-2xl">
                               {scope.desc}
                             </p>
                           </div>

                           <div className="shrink-0 flex flex-col items-end gap-2 text-right">
                             <div className="flex items-center gap-2">
                               <code className="text-[10px] font-mono text-outline bg-white px-2 py-1 rounded-md border border-outline-variant/60">
                                 {scope.expr}
                               </code>
                               <input
                                 type="radio"
                                 checked={selectedRole.dataScope === scope.key}
                                 onChange={() => handleUpdateDataScope(scope.key as any)}
                                 className="w-4 h-4 text-primary accent-primary cursor-pointer"
                               />
                             </div>
                             <span className="text-[9px] font-black tracking-widest text-[rgb(var(--primary))] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                               {selectedRole.dataScope === scope.key ? 'ACTIVE POLICY' : 'CLICK TO TOGGLE'}
                             </span>
                           </div>
                         </button>
                       ))}
                     </div>
                   </div>

                </div>
             </div>
          </div>
        )}
      </div>

    </div>
  );
};

const ArchitectApp: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [view, setView] = React.useState<ViewType>('landing');
  const [selectedFieldId, setSelectedFieldId] = React.useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = React.useState<string | null>(null);
  const [currentFormType, setCurrentFormType] = React.useState<FormType>('normal');
  
  // Storage for each form's fields and nodes
  const [formFieldsMap, setFormFieldsMap] = React.useState<Record<string, FormField[]>>({
    'f1': [
      { id: '1', type: 'text', label: '员工全名', placeholder: '请输入姓名', required: true, width: '1/1' },
      { id: '2', type: 'date', label: '入职日期', required: true, width: '1/2' },
      { id: '3', type: 'select', label: '所在部门', options: ['研发部', '市场部', '人力资源'], required: true, width: '1/2' },
    ],
    'f2': [
      { id: '1', type: 'text', label: '评估标题', required: true, width: '1/1' },
      { id: '2', type: 'textarea', label: '性能描述', required: true, width: '1/1' },
    ],
    'f3': [
      { id: '1', type: 'number', label: '打分', required: true, width: '1/2' },
      { id: '2', type: 'textarea', label: '改进建议', required: false, width: '1/1' },
    ]
  });
  
  const [workflowNodesMap, setWorkflowNodesMap] = React.useState<Record<string, WorkflowNode[]>>({
    'f1': [
      { id: 'node-1', type: 'start', label: 'HR发起', description: '新员工入职触发', targets: ['node-2'] },
      { id: 'node-2', type: 'approval', label: '部门经理审批', targets: ['node-4'], config: { assigneeType: 'role', assigneeValue: '部门经理' } },
      { id: 'node-4', type: 'end', label: '入职完成', targets: [] },
    ],
    'f2': [
      { id: 'node-1', type: 'start', label: '评估提交', targets: ['node-2'] },
      { id: 'node-2', type: 'approval', label: '交叉评估', targets: ['node-3'], config: { assigneeType: 'user', assigneeValue: '技术专家' } },
      { id: 'node-3', type: 'end', label: '归档', targets: [] },
    ]
  });

  const [workflowVersionsMap, setWorkflowVersionsMap] = React.useState<Record<string, WorkflowVersion[]>>({
    'f1': [
      {
        id: 'ver-f1-1',
        formId: 'f1',
        version: 'v1.0.0',
        versionNum: 1.0,
        title: '初始入职单审流程',
        description: '发布基础入职流转节点',
        createdAt: '2026-08-01 10:00:00',
        creator: '系统管理员',
        status: 'archived',
        nodes: [
          { id: 'node-1', type: 'start', label: 'HR发起', description: '新员工入职触发', targets: ['node-2'] },
          { id: 'node-2', type: 'approval', label: '部门经理审批', targets: ['node-4'], config: { assigneeType: 'role', assigneeValue: '部门经理', approvalType: 'OR' } },
          { id: 'node-4', type: 'end', label: '入职完成', targets: [] },
        ]
      },
      {
        id: 'ver-f1-2',
        formId: 'f1',
        version: 'v1.1.0',
        versionNum: 1.1,
        title: '引入多级审批与会签',
        description: '优化部门经理审批方式为会签模式',
        createdAt: '2026-08-05 14:30:00',
        creator: '李明 (HRD)',
        status: 'active',
        nodes: [
          { id: 'node-1', type: 'start', label: 'HR发起', description: '新员工入职触发', targets: ['node-2'] },
          { id: 'node-2', type: 'approval', label: '部门经理审批', targets: ['node-4'], config: { assigneeType: 'role', assigneeValue: '部门经理', approvalType: 'AND' } },
          { id: 'node-4', type: 'end', label: '入职完成', targets: [] },
        ]
      }
    ],
    'f2': [
      {
        id: 'ver-f2-1',
        formId: 'f2',
        version: 'v1.0.0',
        versionNum: 1.0,
        title: '专家交叉评估规范',
        description: '技术评估标准化流转模版',
        createdAt: '2026-08-03 09:15:00',
        creator: '张伟 (架构师)',
        status: 'active',
        nodes: [
          { id: 'node-1', type: 'start', label: '评估提交', targets: ['node-2'] },
          { id: 'node-2', type: 'approval', label: '交叉评估', targets: ['node-3'], config: { assigneeType: 'user', assigneeValue: '技术专家' } },
          { id: 'node-3', type: 'end', label: '归档', targets: [] },
        ]
      }
    ]
  });

  // Modal visibility states for Version Control
  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = React.useState(false);
  const [isVersionHistoryModalOpen, setIsVersionHistoryModalOpen] = React.useState(false);
  const [isVersionDiffModalOpen, setIsVersionDiffModalOpen] = React.useState(false);

  // New version form state
  const [newVersionTitle, setNewVersionTitle] = React.useState('');
  const [newVersionDesc, setNewVersionDesc] = React.useState('');
  const [newVersionType, setNewVersionType] = React.useState<'minor' | 'major'>('minor');

  // Preview / Diff state
  const [previewVersionDetail, setPreviewVersionDetail] = React.useState<WorkflowVersion | null>(null);
  const [diffVersionIdA, setDiffVersionIdA] = React.useState<string>('');
  const [diffVersionIdB, setDiffVersionIdB] = React.useState<string>('');

  const [formFields, setFormFields] = React.useState<FormField[]>([]);
  const [workflowNodes, setWorkflowNodes] = React.useState<WorkflowNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [showInsertNodeMenu, setShowInsertNodeMenu] = React.useState<string | null>(null);
  const [editorTab, setEditorTab] = React.useState<'design' | 'page' | 'workflow' | 'publish' | 'simulate' | 'data' | 'preview'>('design');
  
  // Page Configuration state variables 
  const [configTab, setConfigTab] = React.useState<'basic' | 'notification' | 'print' | 'button_config' | 'event_config'>('basic');
  const [pageTitleType, setPageTitleType] = React.useState<'default' | 'custom'>('default');
  const [customPageTitle, setCustomPageTitle] = React.useState('');
  const [timeControlEnabled, setTimeControlEnabled] = React.useState(false);
  const [timeControlStart, setTimeControlStart] = React.useState('2026-05-25');
  const [timeControlEnd, setTimeControlEnd] = React.useState('2026-06-25');
  const [timeControlDailyStart, setTimeControlDailyStart] = React.useState('09:00');
  const [timeControlDailyEnd, setTimeControlDailyEnd] = React.useState('18:00');
  const [submitAction, setSubmitAction] = React.useState<'message' | 'redirect' | 'email' | 'sms'>('message');
  const [submitActionMessage, setSubmitActionMessage] = React.useState('提交成功，感谢您的填写！');
  const [submitActionRedirectUrl, setSubmitActionRedirectUrl] = React.useState('https://www.example.com/thanks');
  const [submitActionEmail, setSubmitActionEmail] = React.useState('admin@company.com');
  const [submitActionSms, setSubmitActionSms] = React.useState('13800000000');
  const [formLimits, setFormLimits] = React.useState<string[]>(['device_limit']);
  const [fillingControls, setFillingControls] = React.useState<string[]>(['allow_repeat']);
  
  // Notification templates
  const [notificationTemplates, setNotificationTemplates] = React.useState([
    { id: 'station', name: '站内消息模板', enabled: true, title: '您收到一个新的表单填报任务', content: '您被指派填写《${formName}》表单。请在截止时间前，点击下方链接进行填报协作。\n\n链接：${formLink}' },
    { id: 'sms', name: '短信消息模板', enabled: false, title: '短信通知消息', content: '【企业协作平台】提醒：您好，您有一个待提交表单《${formName}》需要处理，为不影响结算审批，请点此链接填报：${formLink}' },
    { id: 'email', name: '邮件通知模板', enabled: true, title: '【重要】关于《${formName}》的协作填报通知', content: '尊敬的同事：\n\n系统已为您生成了表单《${formName}》的协作任务。\n您可以点击以下链接直接打开，填报相应的数据，系统将自动汇总反馈。\n\n感谢您的理解与支持！\n填报链接：${formLink}' }
  ]);
  const [editingNotificationTemplateId, setEditingNotificationTemplateId] = React.useState<string | null>(null);
  const [tempNotifyTitle, setTempNotifyTitle] = React.useState('');
  const [tempNotifyContent, setTempNotifyContent] = React.useState('');

  // Print templates
  const [printTemplates, setPrintTemplates] = React.useState([
    { id: '1', name: '标准 A4 发起审批凭证', size: 'A4', orientation: 'vertical', isEnabled: true, content: '展示全表单信息，附带完整的流程签字以及流程记录，适配 A4 竖向尺寸。' },
    { id: '2', name: '横置宽表数据存根联', size: 'A4', orientation: 'horizontal', isEnabled: true, content: '适配行数多、列数复杂的表格展示，以 landscape 横向纸张规格进行排布打印。' },
    { id: '3', name: '便携式 80mm 工单标签纸', size: '80mm 卷纸', orientation: 'vertical', isEnabled: false, content: '极其紧凑的尺寸规格，仅抽取重要物料核心指标、数量和系统单据校验条形码。' }
  ]);
  
  // Custom button configurations
  const [listButtons, setListButtons] = React.useState([
    { id: 'add', label: '新增数据', defaultLabel: '新增数据', isEnabled: true, style: 'primary', roles: 'all' },
    { id: 'export', label: '导出 Excel', defaultLabel: '导出 Excel', isEnabled: true, style: 'outline', roles: 'admin' },
    { id: 'import', label: '匹配导入', defaultLabel: '匹配导入', isEnabled: false, style: 'outline', roles: 'admin' },
    { id: 'batch_delete', label: '批量删除', defaultLabel: '批量删除', isEnabled: true, style: 'danger', roles: 'admin' },
    { id: 'edit', label: '编辑', defaultLabel: '编辑', isEnabled: true, style: 'text', roles: 'all' },
    { id: 'view', label: '查看详情', defaultLabel: '查看详情', isEnabled: true, style: 'text', roles: 'all' },
  ]);

  const [formButtons, setFormButtons] = React.useState([
    { id: 'submit', label: '提交数据', defaultLabel: '提交数据', isEnabled: true, style: 'primary', showConfirm: false },
    { id: 'draft', label: '暂存草稿', defaultLabel: '暂存草稿', isEnabled: true, style: 'outline', showConfirm: false },
    { id: 'reset', label: '重置表单', defaultLabel: '重置表单', isEnabled: true, style: 'outline', showConfirm: true },
    { id: 'back', label: '取消并返回', defaultLabel: '取消并返回', isEnabled: true, style: 'text', showConfirm: false },
  ]);

  // Action/Event configuration rules
  const [eventRules, setEventRules] = React.useState([
    { id: 'evt-1', triggerType: 'onLoad', name: '表单初始化加载', isEnabled: true, actionType: 'js', script: '// 比如：进入页面时预填当前登录人及当前日期\nformData.applicant = currentUser.name;\nformData.applyDate = new Date().toISOString().split("T")[0];', desc: '在组件进入首屏渲染和数据准备准备完毕后，自动执行特定的规则。' },
    { id: 'evt-2', triggerType: 'onFieldChange', name: '当字段“报销总金额”发生变更', isEnabled: true, actionType: 'alert', script: '// 比如：监控数值大小并做出即时安全警醒\nif (fieldValue > 5000) {\n  showNotification("⚠️ 温馨提示：大额报销（>5000元）将增加财务专属审计步骤。");\n}', desc: '当特定字段输入框的内容、下拉选择、或开关状态发生改变时执行该校验。' },
    { id: 'evt-3', triggerType: 'onBeforeSubmit', name: '提交前格式强行核对', isEnabled: false, actionType: 'validation', script: '// 比如：强行检查手机号码合法性以及邮箱不为空\nif (!/^1[3-9]\\d{9}$/.test(formData.phone)) {\n  return "错误：请输入正确的11位中国大陆手机号码";\n}', desc: '在数据正式发送及上传给服务器之前，执行本项规则。若抛出脚本错误将阻断提交。' },
    { id: 'evt-4', triggerType: 'onAfterSubmit', name: '成功提交回调 Webhook 网络通知', isEnabled: true, actionType: 'webhook', script: '// 比如：异步触发远程ERP系统的微服务接收\nfetch("https://api.erp.company.com/v1/workforce", {\n  method: "POST",\n  body: JSON.stringify(formData)\n});', desc: '当表单校验通过、并成功上报服务器得到200状态码后异步执行，不影响前端响应。' }
  ]);

  // Add/Edit events custom inputs helper state
  const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);
  const [eventModalMode, setEventModalMode] = React.useState<'create' | 'edit'>('create');
  const [eventToEditId, setEventToEditId] = React.useState<string | null>(null);
  const [tempEventTrigger, setTempEventTrigger] = React.useState('onLoad');
  const [tempEventName, setTempEventName] = React.useState('');
  const [tempEventAction, setTempEventAction] = React.useState('js');
  const [tempEventScript, setTempEventScript] = React.useState('');
  const [tempEventDesc, setTempEventDesc] = React.useState('');

  const [isPrintModalOpen, setIsPrintModalOpen] = React.useState(false);
  const [printModalMode, setPrintModalMode] = React.useState<'create' | 'edit'>('create');
  const [printToEditId, setPrintToEditId] = React.useState<string | null>(null);
  const [printName, setPrintName] = React.useState('');
  const [printSize, setPrintSize] = React.useState('A4');
  const [printOrientation, setPrintOrientation] = React.useState('vertical');
  const [printContent, setPrintContent] = React.useState('');
  
  // Template settings modal
  const [isTemplateDesignerOpen, setIsTemplateDesignerOpen] = React.useState(false);
  const [activePrintSettingId, setActivePrintSettingId] = React.useState<string | null>(null);
  const [ptFontSize, setPtFontSize] = React.useState('12px');
  const [ptShowLogo, setPtShowLogo] = React.useState(true);
  const [ptShowWatermark, setPtShowWatermark] = React.useState(false);
  const [ptCustomFooter, setPtCustomFooter] = React.useState('由企业表单低代码系统生成，打印件等同有同等印章效力。');
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = React.useState(false);
  const [globalSettingsTab, setGlobalSettingsTab] = React.useState<'workflow' | 'permissions'>('workflow');
  const [workflowGlobalConfig, setWorkflowGlobalConfig] = React.useState<WorkflowGlobalConfig>({
    triggerRules: [
      { id: 'tr-1', fieldId: 'amount', fieldLabel: '报销总金额', operator: '大于', value: '1000' }
    ],
    triggerMatchMode: 'ALL',
    allowTransfer: true,
    terminateOnFailure: true,
    enableTimeoutNotice: true,
    timeoutNoticeChannels: ['station', 'email'],
    autoApprovalMode: 'adjacent_same',
    recallMode: 'initiator_only',
    silentRecall: false,
    enableTimeoutSettings: true,
    timeoutHours: 24,
    timeoutChannels: ['station', 'email', 'sms'],
  });
  const [publishMode, setPublishMode] = React.useState<'internal' | 'public'>('public');
  const [publishLinks, setPublishLinks] = React.useState({
    page: 'http://f.architect.com/p/default_123',
    form: 'http://f.architect.com/f/default_456'
  });
  const [customLinks, setCustomLinks] = React.useState({
    page: '',
    form: ''
  });
  const [internalAccess, setInternalAccess] = React.useState({
    page: { orgs: [] as string[], roles: [] as string[], users: [] as string[] },
    form: { orgs: [] as string[], roles: [] as string[], users: [] as string[] },
    data: { scope: 'myself' as 'myself' | 'dept' | 'dept_sub' | 'all' | 'subordinates' | 'managed_org', mode: 'belonging' as 'belonging' | 'responsible' | 'custom' }
  });
  const [pageMatchMode, setPageMatchMode] = React.useState<'all' | 'any'>('all');
  const [formMatchMode, setFormMatchMode] = React.useState<'all' | 'any'>('all');
  const [publishDataPagePosition, setPublishDataPagePosition] = React.useState<'sub' | 'parallel'>('sub');
  const [publishFormPagePosition, setPublishFormPagePosition] = React.useState<'sub' | 'parallel'>('sub');
  const [propertyTab, setPropertyTab] = React.useState<'props' | 'style'>('props');
  const [workflowStatus, setWorkflowStatus] = React.useState<'active' | 'inactive'>('active');
  const [workflowInstances, setWorkflowInstances] = React.useState<WorkflowInstance[]>([
    { id: 'wf-1', projectId: '1', initiator: '陈', startTime: '1小时前', status: 'Pending', currentStep: '经理审批', history: [] },
    { id: 'wf-2', projectId: '1', initiator: '莎拉', startTime: '5小时前', status: 'Completed', currentStep: '结束', history: [{ step: '开始', actor: '莎拉', action: '提交', time: '5小时前' }] },
  ]);
  const [simulationData, setSimulationData] = React.useState<Record<string, any>>({ amount: 6000 });
  const [isSchemaVisible, setIsSchemaVisible] = React.useState(false);

  const [previewDevice, setPreviewDevice] = React.useState<'pc' | 'app'>('pc');
  const [submissions, setSubmissions] = React.useState<Submission[]>([
    {
      id: 'SUB-20240320-01',
      submitter: '张三',
      submitTime: '2024-03-20 14:30:25',
      status: '已通过',
      data: {
        fullname: '张三',
        phone: '13812345678',
        idcard: '110101199001011234',
        amount: 8500,
        dept: '研发部'
      },
      approvalHistory: [
        { step: '部门经理审核', actor: '李四', action: '通过', time: '2024-03-20 15:00:00' },
        { step: 'CFO终审', actor: '王五', action: '通过', time: '2024-03-20 16:30:00' }
      ]
    },
    {
      id: 'SUB-20240320-02',
      submitter: '李小龙',
      submitTime: '2024-03-20 11:15:10',
      status: '处理中',
      data: {
        fullname: '李小龙',
        phone: '13988889999',
        idcard: '440106198808088888',
        amount: 3200,
        dept: '市场部'
      },
      approvalHistory: [
        { step: '部门经理审核', actor: '赵六', action: '处理中', time: '2024-03-20 12:00:00' }
      ]
    },
    {
      id: 'SUB-20240319-03',
      submitter: '王美丽',
      submitTime: '2024-03-19 09:45:00',
      status: '已驳回',
      data: {
        fullname: '王美丽',
        phone: '13566667777',
        idcard: '310115199512127777',
        amount: 12000,
        dept: '行政部'
      },
      approvalHistory: [
        { step: '部门经理审核', actor: '孙二娘', action: '驳回', time: '2024-03-19 10:30:00' }
      ]
    },
    {
      id: 'SUB-20240318-04',
      submitter: '陈二牛',
      submitTime: '2024-03-18 16:20:00',
      status: '已通过',
      data: {
        fullname: '陈二牛',
        phone: '13122223333',
        idcard: '220102198505053333',
        amount: 450,
        dept: '后勤部'
      },
      approvalHistory: [
        { step: '部门经理审核', actor: '刘大头', action: '通过', time: '2024-03-18 17:00:00' }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('All');
  const [selectedSubmissions, setSelectedSubmissions] = React.useState<string[]>([]);
  const [isDataMasked, setIsDataMasked] = React.useState(true);
  const [viewingSubmission, setViewingSubmission] = React.useState<Submission | null>(null);

  const handleExport = () => {
    // Collect all unique keys from data objects for dynamic columns
    const dynamicKeys = Array.from(new Set(submissions.flatMap(s => Object.keys(s.data))));
    const headers = ['提交 ID', '提交人', '提交时间', '状态', ...dynamicKeys];
    
    const csvRows = submissions.map(s => {
      const row = [
        s.id,
        s.submitter,
        s.submitTime,
        s.status,
        ...dynamicKeys.map((key: string) => s.data[key] || '')
      ];
      return row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `表单数据导出_${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('数据导出成功');
  };

  const maskData = (val: any, label: string) => {
    if (!isDataMasked || !val) return val;
    const str = String(val);
    const l = label.toLowerCase();
    if (l.includes('手机') || l.includes('phone')) return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    if (l.includes('身') || l.includes('idcard')) return str.replace(/^(.{6})(.*)(.{4})$/, (_, p1, p2, p3) => p1 + '*'.repeat(p2.length) + p3);
    if (l.includes('名') || l.includes('name')) return str.length > 1 ? '*' + str.substring(1) : '*';
    return str;
  };
  const [notifications, setNotifications] = React.useState<{id: number, text: string}[]>([]);
  
  // Organization and Team State
  const [orgData, setOrgData] = React.useState<OrgNode[]>([
    {
      id: 'd1',
      name: 'seakoi',
      children: [
        { id: 'd2', name: '总经办' },
        { 
          id: 'd3', 
          name: '工程部', 
          children: [
            { id: 'd3-1', name: '后端开发组' },
            { id: 'd3-2', name: '前端开发组' },
            { id: 'd3-3', name: '测试组' },
          ] 
        },
        { id: 'd4', name: '产品部' },
        { id: 'd5', name: '市场部' },
        { id: 'd6', name: '人力资源部' },
        { id: 'd7', name: '财务部' },
      ]
    }
  ]);

  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([
    { id: '1', name: '小鲤', role: 'Admin', deptId: 'd3', email: 'xiaoli@architect.com', status: 'Active', createdAt: '2024-01-10' },
    { id: '2', name: '陈莎拉', role: 'Editor', deptId: 'd4', email: 'sarah@architect.com', status: 'Active', createdAt: '2024-01-15' },
    { id: '3', name: '米高·贝克', role: 'Viewer', deptId: 'd3', email: 'michael@architect.com', status: 'Active', createdAt: '2024-02-01' },
    { id: '4', name: '财务主管', role: 'Manager', deptId: 'd7', email: 'finance@architect.com', status: 'Active', createdAt: '2024-02-10' },
    { id: '5', name: 'HR 管理员', role: 'Admin', deptId: 'd6', email: 'hr@architect.com', status: 'Active', createdAt: '2024-02-15' },
  ]);

  const onAddMember = (m: Omit<TeamMember, 'id' | 'createdAt' | 'status'>) => {
    const newMember: TeamMember = { 
      ...m, 
      id: `u-${Date.now()}`, 
      status: 'Pending', 
      createdAt: new Date().toISOString().split('T')[0] 
    };
    setTeamMembers(prev => [...prev, newMember]);
    showNotification(`已添加成员：${m.name}`);
  };

  const onUpdateMember = (m: TeamMember) => {
    setTeamMembers(prev => prev.map(member => member.id === m.id ? m : member));
    showNotification(`已更新成员信息：${m.name}`);
  };

  const onDeleteMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    showNotification('已移除成员');
  };

  const onAddDept = (parentId: string | null, name: string) => {
    const newDept: OrgNode = { id: `d-${Date.now()}`, name };
    const updateTree = (nodes: OrgNode[]): OrgNode[] => {
      if (!parentId) return [...nodes, newDept];
      return nodes.map(node => {
        if (node.id === parentId) {
          return { ...node, children: [...(node.children || []), newDept] };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };
    setOrgData(prev => updateTree(prev));
    showNotification(`已添加部门：${name}`);
  };

  const onUpdateDept = (id: string, name: string) => {
    const updateTree = (nodes: OrgNode[]): OrgNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, name };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };
    setOrgData(prev => updateTree(prev));
    showNotification(`已更新部门名称：${name}`);
  };

  const onDeleteDept = (id: string) => {
    const removeFromTree = (nodes: OrgNode[]): OrgNode[] => {
      return nodes.filter(node => node.id !== id).map(node => {
        if (node.children) {
          return { ...node, children: removeFromTree(node.children) };
        }
        return node;
      });
    };
    setOrgData(prev => removeFromTree(prev));
    showNotification('已删除部门');
  };
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>(mockProjects[1].id);
  const [projectDetailsId, setProjectDetailsId] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState<Project[]>(mockProjects);
  const [savedForms, setSavedForms] = React.useState<SavedForm[]>(mockSavedForms);
  const [editingProjectTitle, setEditingProjectTitle] = React.useState(false);
  const [tempProjectName, setTempProjectName] = React.useState('');
  
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState('');
  const [projectToEdit, setProjectToEdit] = React.useState<Project | null>(null);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = React.useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [editingFormName, setEditingFormName] = React.useState(false);
  const [tempFormName, setTempFormName] = React.useState('');

  const updateProjectName = (id: string, newName: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    setEditingProjectTitle(false);
    showNotification('应用名称已更新');
  };

  const deleteProject = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: '删除应用',
      message: `确定要删除应用“${name}”吗？这将删除该应用下的所有表单和数据，此操作不可撤销。`,
      confirmText: '确认删除',
      type: 'danger',
      onConfirm: () => {
        setProjects(prev => prev.filter(p => p.id !== id));
        setSavedForms(prev => prev.filter(f => f.projectId !== id));
        showNotification(`应用“${name}”已删除`);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const deleteForm = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: '删除表单',
      message: `确定要删除表单“${name}”吗？此操作不可撤销。`,
      confirmText: '确认删除',
      type: 'danger',
      onConfirm: () => {
        setSavedForms(prev => prev.filter(f => f.id !== id));
        showNotification(`表单“${name}”已删除`);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const createOrUpdateProject = (nameVal?: any, catVal?: string, descVal?: string, iconVal?: string) => {
    const finalName = (nameVal && typeof nameVal === 'string') ? nameVal : newProjectName;
    const finalCat = (catVal && typeof catVal === 'string') ? catVal : '其他';
    const finalDesc = descVal || '';
    const finalIcon = iconVal || 'Briefcase';
    if (!finalName.trim()) return;
    
    if (projectToEdit) {
      setProjects(prev => prev.map(p => p.id === projectToEdit.id ? { ...p, name: finalName, category: finalCat as any, description: finalDesc, icon: finalIcon } : p));
      showNotification(`应用“${finalName}”更新成功`);
    } else {
      const newProject: Project = {
        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: finalName,
        updatedAt: '刚刚',
        lastAccessedAt: Date.now(),
        status: 'Draft',
        responses: 0,
        createdBy: '系统管理员',
        createdAt: new Date().toISOString().split('T')[0],
        category: finalCat as any,
        description: finalDesc,
        icon: finalIcon
      };
      setProjects(prev => [newProject, ...prev]);
      showNotification(`应用“${finalName}”创建成功`);
    }
    
    setIsProjectModalOpen(false);
    setNewProjectName('');
    setProjectToEdit(null);
  };

  // Permissions State
  const [selectedRole, setSelectedRole] = React.useState<string>('编辑');
  const roles = ['管理员', '编辑', '查看者', '经理', '部门成员'];
  
  const [funcPerms, setFuncPerms] = React.useState<Record<string, string[]>>({
    '管理员': ['manage', 'design', 'fill', 'view', 'export', 'delete', 'config'],
    '编辑': ['design', 'fill', 'view', 'export'],
    '查看者': ['view'],
    '经理': ['view', 'export'],
  });

  const [dataPerms, setDataPerms] = React.useState<Record<string, { type: 'all' | 'dept' | 'self' | 'custom', customRule?: string }>>({
    '管理员': { type: 'all' },
    '编辑': { type: 'dept' },
    '查看者': { type: 'self' },
    '经理': { type: 'dept' },
  });

  const functionalOptions = [
    { id: 'manage', label: '表单管理', desc: '创建、编辑、删除表单' },
    { id: 'design', label: '表单设计', desc: '设计表单结构' },
    { id: 'fill', label: '表单填写', desc: '填写表单' },
    { id: 'view', label: '数据查看', desc: '查看表单数据' },
    { id: 'export', label: '数据导出', desc: '导出表单数据' },
    { id: 'delete', label: '数据删除', desc: '删除表单数据' },
    { id: 'config', label: '权限配置', desc: '配置表单权限' },
  ];

  const dataScopeOptions = [
    { id: 'all', label: '全部数据', desc: '可查看所有数据' },
    { id: 'dept', label: '本部门数据', desc: '仅可查看本部门及下级部门数据' },
    { id: 'self', label: '本人数据', desc: '仅可查看自己提交的数据' },
    { id: 'custom', label: '自定义', desc: '按自定义规则配置' },
  ];

  const allRoles = ['Admin', 'Editor', 'Viewer', 'Manager'];
  const allDepts = Array.from(new Set(teamMembers.map(m => m.deptId)));

  const showNotification = (text: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const openEditor = (formId: string | null, type: FormType = 'normal') => {
    setSelectedFormId(formId);
    setEditingFormName(false);
    
    if (formId) {
      const form = savedForms.find(f => f.id === formId);
      setTempFormName(form?.name || '');
      setCurrentFormType(form?.type || 'normal');
    } else {
      const typeLabel = type === 'normal' ? '普通表单' : type === 'workflow' ? '流程表单' : type === 'report' ? '报表' : '仪表盘';
      setTempFormName(`新建${typeLabel}`);
      setCurrentFormType(type);
    }

    // Load from map or use default if not found
    const fields = (formId && formFieldsMap[formId]) ? [...formFieldsMap[formId]] : [
      { id: '1', type: 'text', label: '全名', placeholder: '请输入您的姓名', required: true, width: '1/1' },
      { id: '2', type: 'date', label: '出生日期', required: false, width: '1/1' },
    ];
    const nodes = (formId && workflowNodesMap[formId]) ? [...workflowNodesMap[formId]] : [
      { id: 'node-1', type: 'start', label: '流程开始', description: '表单提交自动触发', targets: ['node-2'] },
      { id: 'node-2', type: 'end', label: '流程结束', targets: [] },
    ];
    
    setFormFields(fields);
    setWorkflowNodes(nodes);
    setView('editor');
    setEditorTab('design');
    setSelectedFieldId(null);
    setSelectedNodeId(null);
  };

  const saveCurrentForm = () => {
    let currentId = selectedFormId;
    const finalFormName = tempFormName || '新建表单';
    
    if (!currentId) {
      // Create new form record
      const newId = `f-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newForm: SavedForm = {
        id: newId,
        projectId: selectedProjectId,
        name: finalFormName,
        status: 'Draft',
        createdAt: new Date().toISOString().split('T')[0],
        designer: '您',
        type: currentFormType
      };
      setSavedForms(prev => [newForm, ...prev]);
      currentId = newId;
      setSelectedFormId(newId);
    } else {
      // Update existing form name if changed
      setSavedForms(prev => prev.map(f => f.id === currentId ? { ...f, name: finalFormName } : f));
    }

    setFormFieldsMap(prev => ({ ...prev, [currentId!]: formFields }));
    setWorkflowNodesMap(prev => ({ ...prev, [currentId!]: workflowNodes }));
    
    const project = projects.find(p => p.id === selectedProjectId);
    showNotification(`保存成功！表单“${finalFormName}”已保存到应用：${project?.name}`);
  };
  // Editor Actions
  const addField = (type: FormField['type'], customLabel?: string) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: customLabel || `新建字段`,
      required: false,
      readOnly: false,
      visible: true,
      placeholder: ['text', 'textarea', 'number', 'select', 'multiSelect', 'date', 'time', 'datetimeRange', 'cascade', 'relateQuery'].includes(type) ? '请输入...' : undefined,
      options: ['select', 'multiSelect', 'radio', 'checkbox'].includes(type) ? ['选项 1', '选项 2'] : undefined,
      width: '1/1',
      code: `field_${Math.random().toString(36).substr(2, 5)}`,
      terminals: ['pc', 'mobile'],
      sortOrder: formFields.length + 1,
      componentType: type,
    };
    setFormFields([...formFields, newField]);
    setSelectedFieldId(newField.id);
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addWorkflowNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: `node-${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `新建 ${type} 环节`,
      description: '在属性面板中配置此环节',
      targets: [],
      config: type === 'approval' ? { 
        assigneeType: 'initiator', 
        approvalType: 'OR', 
        timeout: 24,
        actions: ['approve', 'reject', 'transfer'] 
      } : (type === 'condition' ? { expression: 'true' } : {})
    };
    
    // Auto-connect if there's a selected node
    if (selectedNodeId) {
      setWorkflowNodes(nodes => nodes.map(n => n.id === selectedNodeId ? { ...n, targets: [...n.targets, newNode.id] } : n));
    }

    setWorkflowNodes(nodes => [...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const insertWorkflowNode = (prevId: string, type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: `node-${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `新插 ${type} 环节`,
      description: '在属性面板中配置此环节',
      targets: [],
      config: type === 'approval' ? { 
        assigneeType: 'initiator', 
        approvalType: 'OR', 
        timeout: 24,
        actions: ['approve', 'reject', 'transfer'] 
      } : (type === 'condition' ? { expression: 'true' } : {})
    };

    setWorkflowNodes(nodes => {
      const prevIndex = nodes.findIndex(n => n.id === prevId);
      if (prevIndex === -1) return [...nodes, newNode];

      const prevNode = nodes[prevIndex];
      const originalTargets = [...prevNode.targets];
      newNode.targets = originalTargets;

      const newNodes = [...nodes];
      // Update the previous node's target to point to the new node
      newNodes[prevIndex] = { ...prevNode, targets: [newNode.id] };
      // Insert the new node immediately after the previous node in the array
      newNodes.splice(prevIndex + 1, 0, newNode);
      
      return newNodes;
    });

    setSelectedNodeId(newNode.id);
  };

  const updateWorkflowNode = (id: string, updates: Partial<WorkflowNode>) => {
    setWorkflowNodes(workflowNodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const removeWorkflowNode = (id: string) => {
    setWorkflowNodes(workflowNodes.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const selectedField = formFields.find(f => f.id === selectedFieldId);
  const selectedNode = workflowNodes.find(n => n.id === selectedNodeId);

  if (view === 'editor') {
    return (
      <div className="flex flex-col h-screen bg-surface overflow-hidden text-on-surface">
        {/* Top Toolbar */}
        <header className="h-16 sleek-glass px-8 grid grid-cols-3 items-center border-b border-outline-variant shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('dashboard')}
              className="p-2 hover:bg-surface rounded-lg transition-colors mr-2 border border-outline-variant"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="relative group flex items-center">
                {editingFormName ? (
                  <div className="flex items-center gap-2">
                    <input 
                      autoFocus
                      type="text" 
                      value={tempFormName}
                      onChange={(e) => setTempFormName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingFormName(false);
                        if (e.key === 'Escape') {
                          if (selectedFormId) setTempFormName(savedForms.find(f => f.id === selectedFormId)?.name || '');
                          setEditingFormName(false);
                        }
                      }}
                      className="font-bold tracking-tight bg-white border-b border-primary focus:outline-none"
                    />
                    <button onClick={() => setEditingFormName(false)} className="text-primary"><Save className="w-3 h-3"/></button>
                  </div>
                ) : (
                  <h2 
                    className="font-bold tracking-tight cursor-pointer hover:text-primary transition-colors flex items-center gap-2 group"
                    onClick={() => setEditingFormName(true)}
                  >
                    {tempFormName || '新建表单'}
                    <Settings className="w-3 h-3 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                )}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${
                selectedFormId && savedForms.find(f => f.id === selectedFormId)?.status === 'Published' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
              }`}>
                {selectedFormId ? (savedForms.find(f => f.id === selectedFormId)?.status === 'Published' ? '已发布' : '草稿') : '新表单'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="flex bg-surface-container-high rounded-lg p-1 border border-outline-variant">
              {[
                { id: 'design', label: '设计', icon: Code },
                { id: 'workflow', label: '流程', icon: Workflow },
                { id: 'page', label: '配置', icon: Sliders },
                { id: 'simulate', label: '仿真', icon: Activity },
                { id: 'publish', label: '发布', icon: Globe },
                { id: 'data', label: '数据', icon: Database },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setEditorTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${editorTab === tab.id ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <tab.icon className="w-3 h-3" /> {tab.label}
                </button>
              ))}
            </div>
          </div>

            <div className="flex justify-end items-center gap-3">
            <button 
              onClick={() => setEditorTab('preview')}
              className={`flex items-center justify-center w-10 h-10 rounded-xl font-extrabold transition-all active:scale-95 group border ${editorTab === 'preview' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
              title="预览表单"
            >
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <button 
              onClick={saveCurrentForm} 
              className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-xl font-extrabold hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 group"
              title="保存更改"
            >
              <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Editor Sidebar - Components / Nodes */}
          {(editorTab !== 'page' && editorTab !== 'preview' && editorTab !== 'publish') && (
            <aside className="w-72 bg-white border-r border-outline-variant flex flex-col shrink-0 text-on-surface select-none">
            <div className="p-6 border-b border-outline-variant flex items-center">
              <span className="font-bold tracking-tight text-sm">
                {editorTab === 'workflow' ? '流程组件' : editorTab === 'page' ? '页面配置' : editorTab === 'publish' ? '发布渠道' : editorTab === 'simulate' ? '仿真洞察' : editorTab === 'data' ? '数据中心' : editorTab === 'preview' ? '预览模式' : '组件库'}
              </span>
            </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {editorTab === 'data' ? (
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                   <div className="flex items-center gap-2 mb-3">
                     <FileSearch className="w-4 h-4 text-primary" />
                     <span className="text-xs font-bold text-primary">数据摘要</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-outline uppercase">总数据量</span>
                        <span className="text-on-surface">{submissions.length} 条</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-outline uppercase">今日新增</span>
                        <span className="text-on-surface">2 条</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-outline uppercase">处理中</span>
                        <span className="text-on-surface">{submissions.filter(s => s.status === '处理中').length} 条</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest">视图配置</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-primary bg-primary/5 transition-all text-xs font-bold">
                      <span>默认视图</span>
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-outline-variant hover:border-outline transition-all text-xs font-bold text-on-surface-variant">
                      <span>待我审批</span>
                      <span className="px-1.5 py-0.5 bg-error text-white text-[8px] rounded-full">12</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-outline-variant">
                   <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest">导出队列</h3>
                     <RefreshCw className="w-3 h-3 text-outline cursor-pointer hover:rotate-180 transition-all duration-500" />
                   </div>
                   <div className="p-3 bg-surface rounded-xl border border-outline-variant border-dashed">
                      <p className="text-[10px] text-outline font-medium text-center">暂无进行中的导出任务</p>
                   </div>
                </div>
              </div>
            ) : editorTab === 'workflow' ? (
              <div>
                <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-4">流程组件</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { type: 'start', icon: Play, label: '开始节点', desc: '流程执行的起点' },
                    { type: 'approval', icon: ShieldCheck, label: '审批环节', desc: '需要人工进行审批' },
                    { type: 'notification', icon: Mail, label: '邮件提醒', desc: '发送系统自动邮件' },
                    { type: 'condition', icon: Workflow, label: '条件分支', desc: '基于数据逻辑分流' },
                    { type: 'cc', icon: Share2, label: '抄送环节', desc: '将副本发送给特定人员' },
                    { type: 'end', icon: StopCircle, label: '结束节点', desc: '流程执行的终点' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => addWorkflowNode(item.type as WorkflowNode['type'])}
                      className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group text-left"
                    >
                      <div className="p-3 bg-surface rounded-lg group-hover:bg-primary/10">
                        <item.icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-tight">{item.label}</div>
                        <div className="text-[10px] text-on-surface-variant font-medium">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : editorTab === 'publish' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest">发布模式</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'public', label: '公开发布', icon: Globe, desc: '任何人通过链接访问' },
                    { id: 'internal', label: '内部发布', icon: ShieldCheck, desc: '仅指定组织人员访问' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setPublishMode(mode.id as any)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${publishMode === mode.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant hover:border-outline'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${publishMode === mode.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                        <mode.icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className={`text-xs font-bold ${publishMode === mode.id ? 'text-primary' : ''}`}>{mode.label}</div>
                        <div className="text-[10px] text-on-surface-variant font-medium">{mode.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant mt-6">
                   <div className="flex items-center gap-2 mb-2">
                     <Info className="w-4 h-4 text-primary" />
                     <span className="text-[10px] font-bold">发布说明</span>
                   </div>
                   <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                     更改发布模式可能导致现有访问链接失效，请谨慎操作。
                   </p>
                </div>
              </div>
            ) : editorTab === 'simulate' ? (
              <div className="space-y-6">
                <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant">
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                         <Activity className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-mono">仿真测试环境</span>
                   </div>
                   <div className="space-y-4">
                      <div className="p-3 bg-white rounded-lg border border-outline-variant">
                         <div className="text-[10px] font-bold text-outline uppercase mb-1">当前场景</div>
                         <div className="text-xs font-bold">标准支付流程</div>
                      </div>
                      <div className="flex gap-2">
                         <div className="flex-1 p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="text-[10px] font-bold text-green-700 uppercase mb-1">通过率</div>
                            <div className="text-sm font-bold text-green-700">94.2%</div>
                         </div>
                         <div className="flex-1 p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="text-[10px] font-bold text-amber-700 uppercase mb-1">执行瓶颈</div>
                            <div className="text-sm font-bold text-amber-700">CFO 审签</div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest">模拟器设置</h3>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-outline-variant bg-surface">
                         <span className="text-[10px] font-bold uppercase">实时追踪</span>
                         <div className="w-8 h-4 bg-primary rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                         </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border border-outline-variant bg-surface opacity-50">
                         <span className="text-[10px] font-bold uppercase">并行实例</span>
                         <div className="w-8 h-4 bg-outline-variant rounded-full relative">
                            <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ) : editorTab === 'preview' ? (
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary">预览模式</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                    当前正在查看表单的实际运行效果。你可以填写表单并点击提交，验证业务流程。
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest">测试检查库</h3>
                  <div className="space-y-2">
                    {[
                      '验证字段必填属性是否生效',
                      '检查下拉列表数据是否正确',
                      '确保流程节点跳转符合逻辑',
                      '确认表单样式在各种屏幕下的表现'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-outline-variant flex items-center justify-center bg-white cursor-pointer group">
                          <Check className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[11px] font-bold text-on-surface-variant">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {[
                  {
                    category: '基础字段',
                    items: [
                      { type: 'text' as const, label: '单行文本', icon: Type },
                      { type: 'textarea' as const, label: '多行文本', icon: FileText },
                      { type: 'number' as const, label: '数值输入', icon: Hash },
                      { type: 'radio' as const, label: '单选按钮', icon: CircleDot },
                      { type: 'checkbox' as const, label: '多选框', icon: CheckSquare },
                      { type: 'switch' as const, label: '开关', icon: ToggleLeft },
                    ]
                  },
                  {
                    category: '高级字段',
                    items: [
                      { type: 'select' as const, label: '下拉单选', icon: ListChecks },
                      { type: 'multiSelect' as const, label: '下拉多选', icon: ListChecks },
                      { type: 'date' as const, label: '日期选择', icon: Calendar },
                      { type: 'time' as const, label: '时间选择', icon: Clock },
                      { type: 'upload' as const, label: '附件上传', icon: Upload },
                      { type: 'signature' as const, label: '手写签名', icon: PenTool },
                      { type: 'location' as const, label: '地理定位', icon: MapPin },
                    ]
                  },
                  {
                    category: '关联 & 布局',
                    items: [
                      { type: 'userSelect' as const, label: '人员选择', icon: Users },
                      { type: 'orgSelect' as const, label: '部门选择', icon: Building2 },
                      { type: 'barcode' as const, label: '条形码', icon: Barcode },
                      { type: 'qrcode' as const, label: '二维码', icon: QrCode },
                      { type: 'subform' as const, label: '子表单', icon: Table },
                    ]
                  }
                ].map((cat, catIdx) => (
                  <div key={catIdx} className="space-y-2">
                    <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">{cat.category}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {cat.items.map((item) => (
                        <button
                          key={item.type}
                          onClick={() => addField(item.type, item.label)}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 hover:text-primary transition-all group text-center gap-1.5 active:scale-95 bg-white/50"
                        >
                          <item.icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                          <span className="text-[10px] font-bold text-on-surface group-hover:text-primary transition-colors">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      {editorTab === 'page' && (() => {
                const limits = [
                  { key: 'device_limit', label: '填报设备限制', desc: '限制同一设备仅限提交1次' },
                  { key: 'ip_limit', label: 'IP地址限制', desc: '限制同一 IP 仅限提交1次' }
                ];
                const controls = [
                  { key: 'allow_repeat', label: '允许重复填报', desc: '允许同一用户或端重复多次提交表单数据' },
                  { key: 'allow_view', label: '填报后允许查看', desc: '用户在提交成功后允许在前端查看已填报的数据条目' },
                  { key: 'anonymous', label: '匿名提交', desc: '提交数据不记录填报人账号及任何关联企业身份信息' }
                ];
                return (
                  <>
                    {/* Page Internal Sidebar */}
                    <div className="w-64 bg-white border-r border-outline-variant flex flex-col shrink-0 pt-4">
                      {[
                        { id: 'basic', label: '基础配置', icon: Settings, desc: '页面标题、时间控制、限制控制' },
                        { id: 'notification', label: '消息通知', icon: Bell, desc: '站内信、短信、邮件通知模板' },
                        { id: 'print', label: '打印设置', icon: Printer, desc: '管理、查看和编辑打印模板' },
                        { id: 'button_config', label: '按钮配置', icon: Sliders, desc: '自定义及配置列表与表单填报页按钮选项' },
                        { id: 'event_config', label: '事件配置', icon: Zap, desc: '支持动作触发个性化逻辑与脚本扩展' },
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => setConfigTab(item.id as any)}
                          className={`flex flex-col gap-1 items-start text-left px-6 py-4 transition-all border-l-4 ${configTab === item.id ? 'bg-primary/5 text-primary border-primary font-black' : 'text-on-surface-variant hover:bg-surface border-transparent font-bold'}`}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className={`w-4 h-4 ${configTab === item.id ? 'text-primary' : 'text-outline'}`} />
                            <span className="text-xs">{item.label}</span>
                          </div>
                          <span className="text-[10px] text-outline font-medium pl-6 leading-tight">{item.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Settings Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-surface-container-lowest">
                      {configTab === 'basic' && (
                        <div className="bg-white rounded-3xl border border-outline-variant p-8 space-y-8 shadow-sm w-full">
                          <div>
                            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                              <Settings className="w-5 h-5 text-primary" />
                              基础配置
                            </h2>
                            <p className="text-xs text-outline font-medium mt-1">定制该表单的页面展示标题、填报时间窗口，以及严格的控制策略。</p>
                          </div>

                          {/* 1. Page Title */}
                          <div className="space-y-4 pt-4 border-t border-dashed border-outline-variant">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-on-surface">1. 页面标题</span>
                                <span className="text-[10px] text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded font-bold">标题控制</span>
                              </div>
                              <Info className="w-4 h-4 text-outline" />
                            </div>
                            <div className="flex gap-6">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input 
                                  type="radio" 
                                  name="titleType" 
                                  checked={pageTitleType === 'default'} 
                                  onChange={() => setPageTitleType('default')}
                                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant cursor-pointer"
                                />
                                <span className="text-xs font-bold text-on-surface">默认标题 (固定为当前表单名称)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input 
                                  type="radio" 
                                  name="titleType" 
                                  checked={pageTitleType === 'custom'} 
                                  onChange={() => setPageTitleType('custom')}
                                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant cursor-pointer"
                                />
                                <span className="text-xs font-bold text-on-surface">自定义标题</span>
                              </label>
                            </div>

                            {pageTitleType === 'default' ? (
                              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant text-xs font-bold text-outline select-none flex items-center justify-between">
                                <span>{tempFormName || '新建表单'}</span>
                                <span className="text-[10px] bg-outline-variant px-2 py-0.5 rounded font-black max-w-xs truncate text-on-surface-variant">固定表单名</span>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <input 
                                  type="text"
                                  placeholder="请输入自定义页面渲染标题，例如：第3季度差旅费用填报系统"
                                  value={customPageTitle}
                                  onChange={(e) => setCustomPageTitle(e.target.value)}
                                  className="w-full max-w-xl bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-on-surface"
                                />
                                <p className="text-[10px] text-outline">用户在移动端或电脑端打开表单填报页时，将以此处自定义的文字作为顶栏大标题显示。</p>
                              </div>
                            )}
                          </div>

                          {/* 2. Time Control */}
                          <div className="space-y-4 pt-6 border-t border-dashed border-outline-variant">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-on-surface">2. 时间控制</span>
                                <button 
                                  type="button"
                                  onClick={() => setTimeControlEnabled(!timeControlEnabled)}
                                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${timeControlEnabled ? 'bg-primary' : 'bg-outline-variant'}`}
                                >
                                  <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 transform ${timeControlEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                              </div>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${timeControlEnabled ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                {timeControlEnabled ? '已开启填报时间段限制' : '未开启限制'}
                              </span>
                            </div>

                            {timeControlEnabled && (
                              <div className="p-6 bg-surface border border-outline-variant rounded-2xl grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-3 duration-300 text-xs font-bold text-on-surface">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-outline tracking-wider block">开始时间</label>
                                  <input 
                                    type="date" 
                                    value={timeControlStart}
                                    onChange={(e) => setTimeControlStart(e.target.value)}
                                    className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-outline tracking-wider block">结束时间</label>
                                  <input 
                                    type="date" 
                                    value={timeControlEnd}
                                    onChange={(e) => setTimeControlEnd(e.target.value)}
                                    className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <label className="text-[10px] font-black uppercase text-outline tracking-wider block">每日填报时间段</label>
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="time" 
                                      value={timeControlDailyStart}
                                      onChange={(e) => setTimeControlDailyStart(e.target.value)}
                                      className="w-32 bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs text-center cursor-pointer"
                                    />
                                    <span className="text-outline font-bold">至</span>
                                    <input 
                                      type="time" 
                                      value={timeControlDailyEnd}
                                      onChange={(e) => setTimeControlDailyEnd(e.target.value)}
                                      className="w-32 bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs text-center cursor-pointer"
                                    />
                                    <span className="text-[10px] text-outline font-medium pl-2">在这个日常时间窗外，表单将禁止提交并展示到期说明。</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 3. Post Submission Show */}
                          <div className="space-y-4 pt-6 border-t border-dashed border-outline-variant">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-on-surface">3. 提交后显示</span>
                              <span className="text-[10px] text-outline font-bold">跳转及反馈方式</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 max-w-md">
                              {[
                                { key: 'message', label: '显示感谢信息' },
                                { key: 'redirect', label: '跳转到指定页面' }
                              ].map((opt) => (
                                <button
                                  key={opt.key}
                                  type="button"
                                  onClick={() => setSubmitAction(opt.key as any)}
                                  className={`p-3 rounded-xl border text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 ${
                                    submitAction === opt.key 
                                      ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                                      : 'bg-white border-outline-variant hover:bg-surface text-on-surface-variant'
                                  }`}
                                >
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>

                            <div className="bg-surface border border-outline-variant p-4 rounded-xl space-y-3">
                              {submitAction === 'message' && (
                                <div className="space-y-1.5 animate-in fade-in duration-200">
                                  <label className="text-[10px] font-bold text-outline">感谢信息内容</label>
                                  <textarea
                                    value={submitActionMessage}
                                    onChange={(e) => setSubmitActionMessage(e.target.value)}
                                    rows={2}
                                    className="w-full bg-white border border-outline-variant rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20 font-medium"
                                  />
                                </div>
                              )}
                              {submitAction === 'redirect' && (
                                <div className="space-y-1.5 animate-in fade-in duration-200">
                                  <label className="text-[10px] font-bold text-outline">指定跳转页面 URL 链接</label>
                                  <input
                                    type="text"
                                    value={submitActionRedirectUrl}
                                    onChange={(e) => setSubmitActionRedirectUrl(e.target.value)}
                                    className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 font-medium"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 4. Filling Limits */}
                          <div className="space-y-4 pt-6 border-t border-dashed border-outline-variant">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-black text-on-surface">4. 填报次数限制</span>
                              <span className="text-[10px] text-outline font-medium">采用多级安全限制手段，防止重复或刷单等风险。</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold text-on-surface">
                              {limits.map((limit) => {
                                const isChecked = formLimits.includes(limit.key);
                                return (
                                  <label
                                    key={limit.key}
                                    className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer select-none transition-all ${
                                      isChecked ? 'bg-primary/5 border-primary shadow-sm' : 'bg-surface border-outline-variant hover:bg-surface-container-low'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {
                                        if (isChecked) {
                                          setFormLimits(formLimits.filter(k => k !== limit.key));
                                        } else {
                                          setFormLimits([...formLimits, limit.key]);
                                        }
                                      }}
                                      className="w-4 h-4 text-primary rounded border-outline-variant cursor-pointer mt-0.5"
                                    />
                                    <div className="flex flex-col gap-1">
                                      <span className="font-extrabold">{limit.label}</span>
                                      <span className="text-[10px] text-outline font-medium">{limit.desc}</span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* 5. Filling Controls */}
                          <div className="space-y-4 pt-6 border-t border-dashed border-outline-variant">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-black text-on-surface">5. 填报控制</span>
                              <span className="text-[10px] text-outline font-medium">针对特定协作场景，个性化控制重复提交和匿名身份。</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-bold text-on-surface">
                              {controls.map((control) => {
                                const isChecked = fillingControls.includes(control.key);
                                return (
                                  <label
                                    key={control.key}
                                    className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer select-none transition-all ${
                                      isChecked ? 'bg-primary/5 border-primary shadow-sm' : 'bg-surface border-outline-variant hover:bg-surface-container-low'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {
                                        if (isChecked) {
                                          setFillingControls(fillingControls.filter(k => k !== control.key));
                                        } else {
                                          setFillingControls([...fillingControls, control.key]);
                                        }
                                      }}
                                      className="w-4 h-4 text-primary rounded border-outline-variant cursor-pointer mt-0.5"
                                    />
                                    <div className="flex flex-col gap-1">
                                      <span className="font-extrabold">{control.label}</span>
                                      <span className="text-[10px] text-outline font-medium">{control.desc}</span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {configTab === 'notification' && (
                        <div className="bg-white rounded-3xl border border-outline-variant p-8 space-y-8 shadow-sm w-full">
                          <div>
                            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                              <Bell className="w-5 h-5 text-primary" />
                              消息通知
                            </h2>
                            <p className="text-xs text-outline font-medium mt-1">设置及启用多种形式的消息推送模板，系统在表单流转审批或填报协作时向相关角色派发提醒。</p>
                          </div>

                          <div className="space-y-4">
                            {notificationTemplates.map((tpl) => (
                              <div 
                                key={tpl.id}
                                className={`border rounded-2xl p-6 transition-all ${
                                  tpl.enabled ? 'bg-white border-outline-variant shadow-sm' : 'bg-surface border-outline-variant/50 opacity-75'
                                }`}
                              >
                                <div className="flex items-center justify-between pb-4 border-b border-dashed border-outline-variant/60">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                      tpl.id === 'station' ? 'bg-blue-50 text-blue-600' :
                                      tpl.id === 'sms' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                                    }`}>
                                      {tpl.id === 'station' ? <MessageSquare className="w-5 h-5" /> :
                                       tpl.id === 'sms' ? <Smartphone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                                    </div>
                                    <div>
                                      <h3 className="text-xs font-black text-on-surface">{tpl.name}</h3>
                                      <p className="text-[10px] text-outline font-medium">推送触发：事件响应或人工催办时派发</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          setNotificationTemplates(prev => prev.map(t => t.id === tpl.id ? { ...t, enabled: !t.enabled } : t));
                                          showNotification(`已切换“${tpl.name}”的推送状态`);
                                        }}
                                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${tpl.enabled ? 'bg-primary' : 'bg-outline-variant'}`}
                                      >
                                        <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 transform ${tpl.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                      </button>
                                      <span className="text-xs font-bold">{tpl.enabled ? '已启用自动推送' : '未开启'}</span>
                                    </label>
                                    
                                    <button
                                      onClick={() => {
                                        setEditingNotificationTemplateId(tpl.id);
                                        setTempNotifyTitle(tpl.title);
                                        setTempNotifyContent(tpl.content);
                                      }}
                                      className="px-3.5 py-1.5 border border-outline-variant text-[11px] font-black hover:border-primary hover:text-primary rounded-lg transition-all"
                                    >
                                      编辑模版
                                    </button>
                                  </div>
                                </div>

                                <div className="pt-4 grid grid-cols-1 gap-2 text-xs">
                                  <div className="flex gap-2 font-bold text-on-surface">
                                    <span className="text-outline shrink-0">通知主题：</span>
                                    <span>{tpl.title}</span>
                                  </div>
                                  <div className="flex gap-2 font-medium text-on-surface-variant leading-relaxed font-mono">
                                    <span className="text-outline shrink-0 font-bold">范本体现：</span>
                                    <span className="bg-surface p-3 rounded-lg border border-outline-variant/60 w-full whitespace-pre-wrap text-[10px] text-on-surface-variant">
                                      {tpl.content}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {configTab === 'print' && (
                        <div className="bg-white rounded-3xl border border-outline-variant p-8 space-y-8 shadow-sm w-full">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                                <Printer className="w-5 h-5 text-primary" />
                                打印设置
                              </h2>
                              <p className="text-xs text-outline font-medium mt-1">管理和查看预置打印格式，系统流程流转完成后可快捷、按规格渲染纸张视图以备实物归档或PDF导出。</p>
                            </div>

                            <button
                              onClick={() => {
                                setPrintModalMode('create');
                                setPrintToEditId(null);
                                setPrintName('表单基本业务单据存根');
                                setPrintSize('A4');
                                setPrintOrientation('vertical');
                                setPrintContent('此模板打印将全量展示该业务申请的全部非隐藏组件字段信息，以及多节点完整的流转审批历史日志与签字痕迹。');
                                setIsPrintModalOpen(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              新增打印模板
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {printTemplates.map((pt) => (
                              <div 
                                key={pt.id}
                                className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all bg-white relative overflow-hidden group ${
                                  pt.isEnabled ? 'border-outline-variant hover:border-primary/40 shadow-sm' : 'border-outline-variant/40 bg-surface/40 opacity-70'
                                }`}
                              >
                                <div className="space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                        pt.isEnabled ? 'bg-primary/10 text-primary' : 'bg-outline-variant text-outline'
                                      }`}>
                                        <Printer className="w-4 h-4" />
                                      </div>
                                      <h3 className="text-xs font-extrabold text-on-surface line-clamp-1">{pt.name}</h3>
                                    </div>

                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                                      pt.isEnabled ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                                    }`}>
                                      {pt.isEnabled ? '已启用' : '已停用'}
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                    {pt.content || '暂无打印模板说明。'}
                                  </p>

                                  <div className="flex items-center gap-4 text-[10px] font-bold text-outline">
                                    <span>打印尺寸：<span className="text-on-surface">{pt.size}</span></span>
                                    <span>方向：<span className="text-on-surface">{pt.orientation === 'vertical' ? '纵向' : '横向'}</span></span>
                                  </div>
                                </div>

                                <div className="pt-4 border-t border-dotted border-outline-variant flex items-center justify-between bg-white z-10">
                                  {/* Enable / Disable templates */}
                                  <button
                                    onClick={() => {
                                      setPrintTemplates(prev => prev.map(p => p.id === pt.id ? { ...p, isEnabled: !p.isEnabled } : p));
                                      showNotification(`“${pt.name}”已切换状态`);
                                    }}
                                    className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                                      pt.isEnabled ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                                    }`}
                                  >
                                    {pt.isEnabled ? '停用' : '启用'}
                                  </button>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setPrintModalMode('edit');
                                        setPrintToEditId(pt.id);
                                        setPrintName(pt.name);
                                        setPrintSize(pt.size);
                                        setPrintOrientation(pt.orientation);
                                        setPrintContent(pt.content);
                                        setIsPrintModalOpen(true);
                                      }}
                                      className="p-1.5 hover:bg-surface border border-outline-variant hover:border-primary hover:text-primary rounded text-xs font-bold transition-all"
                                      title="编辑属性"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setActivePrintSettingId(pt.id);
                                        setIsTemplateDesignerOpen(true);
                                      }}
                                      className="px-2 py-1 bg-surface-container-high hover:bg-primary hover:text-white text-[10px] font-bold rounded-lg transition-all"
                                    >
                                      模板设置
                                    </button>
                                    <button
                                      onClick={() => {
                                        setPrintTemplates(prev => prev.filter(p => p.id !== pt.id));
                                        showNotification('已成功删除模板！');
                                      }}
                                      className="p-1.5 hover:bg-red-50 border border-outline-variant hover:border-red-400 hover:text-red-500 rounded text-xs transition-all"
                                      title="删除模板"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {printTemplates.length === 0 && (
                              <div className="col-span-2 py-16 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-2xl bg-surface/40">
                                <Printer className="w-8 h-8 text-outline mb-2" />
                                <span className="text-xs font-medium text-outline">暂无打印模板，点击上方按钮新增其一</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {configTab === 'button_config' && (
                        <div className="bg-white rounded-3xl border border-outline-variant p-8 space-y-8 shadow-sm w-full animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-lg font-black tracking-tight flex items-center gap-2 animate-pulse">
                                <Sliders className="w-5 h-5 text-primary" />
                                按钮配置
                              </h2>
                              <p className="text-xs text-outline font-medium mt-1">自定义及配置表单对应的后台数据列表展示页，以及前端填报页面的按钮样式、展示标签和确认逻辑。</p>
                            </div>
                            <button
                              onClick={() => {
                                showNotification('按钮配置保存成功，已同步更新前端组件绑定');
                              }}
                              className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
                            >
                              保存配置
                            </button>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Left: Table List buttons */}
                            <div className="border border-outline-variant rounded-2xl p-6 space-y-6 bg-surface-container-low/10">
                              <div className="space-y-1">
                                <h3 className="text-sm font-extrabold text-on-surface">1. 数据管理列表页按钮</h3>
                                <p className="text-[11px] text-outline">自定义当前表单对应的后台数据提取页中的管理按钮，支持快捷的新增、导出或批量剔除操作。</p>
                              </div>

                              <div className="space-y-4">
                                {listButtons.map((btn, index) => (
                                  <div key={btn.id} className="p-4 bg-white border border-outline-variant rounded-2xl space-y-3 shadow-xs hover:shadow-sm transition-all">
                                    <div className="flex items-center justify-between">
                                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          checked={btn.isEnabled}
                                          onChange={(e) => {
                                            const updated = [...listButtons];
                                            updated[index].isEnabled = e.target.checked;
                                            setListButtons(updated);
                                          }}
                                          className="w-4 h-4 text-primary rounded border-outline-variant cursor-pointer accent-primary"
                                        />
                                        <span className="text-xs font-black text-on-surface">{btn.defaultLabel}</span>
                                      </label>
                                      <span className="text-[9px] text-outline font-mono font-bold leading-none uppercase">{btn.id}</span>
                                    </div>

                                    {btn.isEnabled && (
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-black tracking-wider text-outline uppercase block">按钮文案</label>
                                          <input
                                            type="text"
                                            value={btn.label}
                                            onChange={(e) => {
                                              const updated = [...listButtons];
                                              updated[index].label = e.target.value;
                                              setListButtons(updated);
                                            }}
                                            className="w-full bg-surface border border-outline-variant rounded-lg px-2 py-1 text-xs font-bold text-on-surface focus:ring-1 focus:ring-primary/20 focus:outline-none"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-black tracking-wider text-outline uppercase block">呈现样式</label>
                                          <select
                                            value={btn.style}
                                            onChange={(e) => {
                                              const updated = [...listButtons];
                                              updated[index].style = e.target.value;
                                              setListButtons(updated);
                                            }}
                                            className="w-full bg-surface border border-outline-variant rounded-lg px-2 py-1 text-xs font-bold text-on-surface cursor-pointer focus:outline-none"
                                          >
                                            <option value="primary">主按钮 (实色)</option>
                                            <option value="outline">次按钮 (线框)</option>
                                            <option value="danger">危险按钮 (红色)</option>
                                            <option value="text">链接按钮 (无框)</option>
                                          </select>
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-black tracking-wider text-outline uppercase block">适用范围</label>
                                          <select
                                            value={btn.roles}
                                            onChange={(e) => {
                                              const updated = [...listButtons];
                                              updated[index].roles = e.target.value;
                                              setListButtons(updated);
                                            }}
                                            className="w-full bg-surface border border-outline-variant rounded-lg px-2 py-1 text-xs font-bold text-on-surface cursor-pointer focus:outline-none"
                                          >
                                            <option value="all">全体成员可见</option>
                                            <option value="admin">仅管理员可见</option>
                                            <option value="creator">仅填报创建人可见</option>
                                          </select>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Desktop List preview */}
                              <div className="bg-surface p-4 rounded-xl border border-outline-variant space-y-3 font-sans">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-outline uppercase tracking-wider">列表页工具栏可视化预览</span>
                                  <div className="flex gap-1.5 flex-wrap">
                                    {listButtons.filter(b => b.isEnabled && ['add', 'export', 'import', 'batch_delete'].includes(b.id)).map(b => (
                                      <span key={b.id} className={`px-2.5 py-0.5 text-[9px] rounded font-black border transition-all ${
                                        b.style === 'primary' ? 'bg-primary text-white border-primary' :
                                        b.style === 'danger' ? 'bg-error text-white border-error' :
                                        b.style === 'outline' ? 'bg-white border-outline-variant text-on-surface-variant' : 'text-primary bg-primary/5 border-transparent'
                                      }`}>
                                        {b.label}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <table className="w-full text-[9px] border-collapse bg-white rounded-lg overflow-hidden border border-outline-variant/60">
                                  <thead>
                                    <tr className="border-b border-outline-variant text-outline bg-surface-container-lowest/80 text-left font-black">
                                      <th className="p-2">单据编号</th>
                                      <th className="p-2 font-bold">主题</th>
                                      <th className="p-2">填报人</th>
                                      <th className="p-2 text-right">操作</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-b border-outline-variant/50 text-on-surface-variant font-bold">
                                      <td className="p-2 font-mono">REQ-2026-003</td>
                                      <td className="p-2 truncate font-black text-on-surface">5月差旅费用报销申请</td>
                                      <td className="p-2">张三 (技术专家)</td>
                                      <td className="p-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          {listButtons.filter(b => b.isEnabled && ['edit', 'view'].includes(b.id)).map(b => (
                                            <span key={b.id} className={`text-[9px] font-black cursor-pointer hover:underline ${
                                              b.style === 'danger' ? 'text-error' : b.style === 'primary' ? 'text-primary' : 'text-on-surface-variant'
                                            }`}>
                                              {b.label}
                                            </span>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Right: Submission/Filling page buttons */}
                            <div className="border border-outline-variant rounded-2xl p-6 space-y-6 bg-surface-container-low/10">
                              <div className="space-y-1">
                                <h3 className="text-sm font-extrabold text-on-surface">2. 填报页面操控按钮</h3>
                                <p className="text-[11px] text-outline">自定义当前表单填写页中的底部操作按钮，如重置、暂存或提交时是否进行防误触等规则设立。</p>
                              </div>

                              <div className="space-y-4">
                                {formButtons.map((btn, index) => (
                                  <div key={btn.id} className="p-4 bg-white border border-outline-variant rounded-2xl space-y-3 shadow-xs hover:shadow-sm transition-all">
                                    <div className="flex items-center justify-between">
                                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          checked={btn.isEnabled}
                                          onChange={(e) => {
                                            const updated = [...formButtons];
                                            updated[index].isEnabled = e.target.checked;
                                            setFormButtons(updated);
                                          }}
                                          className="w-4 h-4 text-primary rounded border-outline-variant cursor-pointer accent-primary"
                                        />
                                        <span className="text-xs font-black text-on-surface">{btn.defaultLabel}</span>
                                      </label>
                                      <span className="text-[9px] text-outline font-mono font-bold leading-none uppercase">{btn.id}</span>
                                    </div>

                                    {btn.isEnabled && (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-black tracking-wider text-outline uppercase block">按钮文案</label>
                                          <input
                                            type="text"
                                            value={btn.label}
                                            onChange={(e) => {
                                              const updated = [...formButtons];
                                              updated[index].label = e.target.value;
                                              setFormButtons(updated);
                                            }}
                                            className="w-full bg-surface border border-outline-variant rounded-lg px-2 py-1 text-xs font-bold text-on-surface focus:ring-1 focus:ring-primary/20 focus:outline-none"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-black tracking-wider text-outline uppercase block">呈现样式</label>
                                          <select
                                            value={btn.style}
                                            onChange={(e) => {
                                              const updated = [...formButtons];
                                              updated[index].style = e.target.value;
                                              setFormButtons(updated);
                                            }}
                                            className="w-full bg-surface border border-outline-variant rounded-lg px-2 py-1 text-xs font-bold text-on-surface cursor-pointer focus:outline-none"
                                          >
                                            <option value="primary">重要主按钮</option>
                                            <option value="outline">次重要线框按钮</option>
                                            <option value="text">链接弱化按钮</option>
                                          </select>
                                        </div>
                                        <div className="col-span-2 flex items-center justify-between p-2 bg-surface rounded-lg border border-outline-variant/60">
                                          <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-on-surface-variant">二阶段确认校验</span>
                                            <span className="text-[9px] text-outline leading-tight">用户点击该按钮前，弹出二次确认模态对话框，防误触。</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = [...formButtons];
                                              updated[index].showConfirm = !btn.showConfirm;
                                              setFormButtons(updated);
                                            }}
                                            className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${btn.showConfirm ? 'bg-primary' : 'bg-outline-variant'}`}
                                          >
                                            <span className={`w-3 h-3 rounded-full bg-white shadow transition-transform duration-300 transform ${btn.showConfirm ? 'translate-x-4' : 'translate-x-0'}`} />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Form footer preview */}
                              <div className="bg-surface p-4 rounded-xl border border-outline-variant space-y-3 text-xs">
                                <span className="text-[10px] font-black text-outline uppercase tracking-wider block">填写页面底部工具栏可视化预览</span>
                                <div className="flex items-center justify-end gap-x-2 p-3 bg-white border border-outline-variant rounded-xl shadow-xs">
                                  {formButtons.filter(b => b.isEnabled).map(b => (
                                    <button key={b.id} type="button" className={`px-4 py-1.5 text-[10px] font-black rounded-lg border transition-all ${
                                      b.style === 'primary' ? 'bg-primary text-white border-primary shadow-xs' :
                                      b.style === 'outline' ? 'bg-white border-outline-variant text-on-surface-variant hover:bg-surface' :
                                      'text-outline hover:text-primary px-2 border-transparent'
                                    }`}>
                                      {b.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {configTab === 'event_config' && (
                        <div className="bg-white rounded-3xl border border-outline-variant p-8 space-y-8 shadow-sm w-full animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-lg font-black tracking-tight flex items-center gap-2 animate-pulse">
                                <Zap className="w-5 h-5 text-primary" />
                                事件配置
                              </h2>
                              <p className="text-xs text-outline font-medium mt-1">定置表单组件生命周期的各阶段事件中，所调用的扩展业务处理器或 JS/正则表达式校验拦截及 Webhook 异步网络钩子通知。</p>
                            </div>
                            <button
                              onClick={() => {
                                setEventModalMode('create');
                                setTempEventName('');
                                setTempEventTrigger('onLoad');
                                setTempEventAction('js');
                                setTempEventScript('// 在此处编写自定义脚本。\n// 例如：\nconsole.log("事件触发: " + eventName);\nshowNotification("动作完成！");');
                                setTempEventDesc('');
                                setIsEventModalOpen(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              新建事件规则
                            </button>
                          </div>

                          {/* Stats rail */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface p-4 rounded-2xl border border-outline-variant">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">事件沙箱引擎</span>
                              <span className="text-xs font-black text-on-surface">V8 Secure JS Sandbox</span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">运行平均延迟</span>
                              <span className="text-xs font-black text-green-600 font-mono">1.8 ms</span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">钩子数据格式</span>
                              <span className="text-xs font-black text-on-surface font-mono">JSON Payloads</span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">已映射事件</span>
                              <span className="text-xs font-black text-primary font-mono">{eventRules.length} 个动态处理器</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {eventRules.map((rule) => (
                              <div key={rule.id} className={`border rounded-2xl p-6 transition-all bg-white relative overflow-hidden flex flex-col justify-between gap-4 border-outline-variant shadow-xs ${rule.isEnabled ? '' : 'opacity-70 bg-surface/50'}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-dashed border-outline-variant">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                      rule.triggerType === 'onLoad' ? 'bg-blue-50 text-blue-600' :
                                      rule.triggerType === 'onFieldChange' ? 'bg-amber-50 text-amber-600' :
                                      rule.triggerType === 'onBeforeSubmit' ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-600'
                                    }`}>
                                      <Zap className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <h3 className="text-xs font-extrabold text-on-surface">{rule.name}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${
                                          rule.triggerType === 'onLoad' ? 'bg-blue-100 text-blue-800' :
                                          rule.triggerType === 'onFieldChange' ? 'bg-amber-100 text-amber-800' :
                                          rule.triggerType === 'onBeforeSubmit' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                          {rule.triggerType === 'onLoad' ? '初始化加载加载' :
                                           rule.triggerType === 'onFieldChange' ? '字段变动触发' :
                                           rule.triggerType === 'onBeforeSubmit' ? '提交数据前校验' : '上报成功后回调'}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-outline font-medium">{rule.desc}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 shrink-0">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEventRules(prev => prev.map(r => r.id === rule.id ? { ...r, isEnabled: !r.isEnabled } : r));
                                          showNotification(`已${!rule.isEnabled ? '启用' : '禁用'}事件“${rule.name}”`);
                                        }}
                                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${rule.isEnabled ? 'bg-primary' : 'bg-outline-variant'}`}
                                      >
                                        <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 transform ${rule.isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                      </button>
                                      <span className="text-xs font-black">{rule.isEnabled ? '已启动' : '未开启'}</span>
                                    </label>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
                                  <div className="md:col-span-2 space-y-1">
                                    <div className="text-[10px] font-bold text-outline">注入脚本/事件载荷细节:</div>
                                    <pre className="bg-surface border border-outline-variant rounded-xl p-4 font-mono text-[10px] text-on-surface-variant overflow-x-auto max-h-36 whitespace-pre-wrap leading-relaxed">
                                      {rule.script}
                                    </pre>
                                  </div>
                                  <div className="flex flex-col justify-between p-4 bg-outline-variant/10 rounded-xl border border-outline-variant/40">
                                    <div className="space-y-2">
                                      <div className="text-[10px] font-bold text-outline">联动执行类型</div>
                                      <div className="text-xs font-extrabold text-on-surface select-none">
                                        {rule.actionType === 'js' && '🧪 自定义 JavaScript 沙箱脚本'}
                                        {rule.actionType === 'alert' && '📢 控制台实时安全消息警醒'}
                                        {rule.actionType === 'validation' && '🔒 阻断式格式规范校验'}
                                        {rule.actionType === 'webhook' && '🌐 远程 Cloud Webhook 接口推送'}
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4">
                                      <button
                                        onClick={() => {
                                          setEventModalMode('edit');
                                          setEventToEditId(rule.id);
                                          setTempEventName(rule.name);
                                          setTempEventTrigger(rule.triggerType);
                                          setTempEventAction(rule.actionType);
                                          setTempEventScript(rule.script);
                                          setTempEventDesc(rule.desc);
                                          setIsEventModalOpen(true);
                                        }}
                                        className="p-1.5 px-3 text-[10px] font-black border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all bg-white shadow-xs"
                                      >
                                        配置细节
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEventRules(prev => prev.filter(r => r.id !== rule.id));
                                          showNotification('已成功删除该事件处理器规则！');
                                        }}
                                        className="p-1 px-2 text-outline hover:text-error hover:bg-error/5 rounded-lg border border-transparent transition-all"
                                        title="删除"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {eventRules.length === 0 && (
                              <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-2xl bg-surface/40">
                                <Zap className="w-8 h-8 text-outline mb-2 animate-pulse" />
                                <span className="text-xs font-bold text-outline">目前表单没有配置任何扩展事件钩子，请点击右上角新建其一。</span>
                              </div>
                            )}
                          </div>

                          {/* Event Rules Create/Edit Modal */}
                          {isEventModalOpen && (
                            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
                              <div className="bg-white rounded-3xl border border-outline-variant w-full max-w-xl shadow-2xl p-6 space-y-6 animate-in zoom-in duration-200">
                                <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                                  <h3 className="font-extrabold text-on-surface flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-primary animate-bounce" />
                                    {eventModalMode === 'create' ? '新建事件规则扩展' : '编辑事件规则细节'}
                                  </h3>
                                  <button
                                    onClick={() => setIsEventModalOpen(false)}
                                    className="p-1.5 text-outline hover:text-on-surface-variant hover:bg-surface rounded-lg transition-all"
                                  >
                                    ✕
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-outline uppercase tracking-wider block">规则名称 (Rule Name)</label>
                                    <input
                                      type="text"
                                      placeholder="请输入可辨识的规则名称，例：智能匹配与汇率自动填充"
                                      value={tempEventName}
                                      onChange={(e) => setTempEventName(e.target.value)}
                                      className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-1 focus:ring-primary/20 focus:outline-none"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-black text-outline uppercase tracking-wider block">触发时机 (Trigger Timing)</label>
                                      <select
                                        value={tempEventTrigger}
                                        onChange={(e) => setTempEventTrigger(e.target.value)}
                                        className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer focus:outline-none"
                                      >
                                        <option value="onLoad">表单进入加载完 (onLoad)</option>
                                        <option value="onFieldChange">组件字段内容更动 (onFieldChange)</option>
                                        <option value="onBeforeSubmit">数据发送向服务器前 (onBeforeSubmit)</option>
                                        <option value="onAfterSubmit">提交成功并保存后 (onAfterSubmit)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-black text-outline uppercase tracking-wider block">响应机制 (Action Type)</label>
                                      <select
                                        value={tempEventAction}
                                        onChange={(e) => setTempEventAction(e.target.value)}
                                        className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer focus:outline-none"
                                      >
                                        <option value="js">🧪 自定义 JavaScript 沙箱代码</option>
                                        <option value="alert">📢 即时安全警告提示气泡</option>
                                        <option value="validation">🔒 阻断式格式合法性核对</option>
                                        <option value="webhook">🌐 派发 Webhook 远程推送联动</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-outline uppercase tracking-wider block">事件功能简介</label>
                                    <input
                                      type="text"
                                      placeholder="简述该规则在业务协作场景里发挥的作用，例：主要监控限额拦截"
                                      value={tempEventDesc}
                                      onChange={(e) => setTempEventDesc(e.target.value)}
                                      className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-xs font-medium text-on-surface focus:ring-1 focus:ring-primary/20 focus:outline-none"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-outline uppercase tracking-wider block">注入脚本/事件属性细节 (Code sandbox)</label>
                                    <textarea
                                      rows={5}
                                      placeholder={
                                        tempEventAction === 'js' ? '// 编写代码控制：\nif (formData.name === "") {\n  showNotification("错误：姓名不可为空");\n}' :
                                        tempEventAction === 'alert' ? '触发消息警告文字...' :
                                        tempEventAction === 'validation' ? '填写正则表达式格式校验内容...' : '派发 Webhook 远程目标 IP:'
                                      }
                                      value={tempEventScript}
                                      onChange={(e) => setTempEventScript(e.target.value)}
                                      className="w-full bg-surface border border-outline-variant rounded-xl p-3 font-mono text-[10px] focus:ring-1 focus:ring-primary/20 focus:outline-none text-on-surface-variant leading-relaxed"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant bg-white">
                                  <button
                                    onClick={() => setIsEventModalOpen(false)}
                                    className="px-4 py-2 border border-outline-variant rounded-xl hover:bg-surface text-xs font-black transition-all"
                                  >
                                    取消
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!tempEventName.trim()) {
                                        showNotification('请先填写规则名称');
                                        return;
                                      }
                                      if (eventModalMode === 'create') {
                                        const newRule = {
                                          id: 'evt-' + Date.now(),
                                          name: tempEventName,
                                          triggerType: tempEventTrigger,
                                          actionType: tempEventAction,
                                          script: tempEventScript || '// 编写处理器以扩展规则功能',
                                          desc: tempEventDesc || '自定义表单校验逻辑',
                                          isEnabled: true,
                                        };
                                        setEventRules([...eventRules, newRule]);
                                        showNotification(`已成功新增事件“${tempEventName}”！`);
                                      } else {
                                        setEventRules(prev => prev.map(r => r.id === eventToEditId ? {
                                          ...r,
                                          name: tempEventName,
                                          triggerType: tempEventTrigger,
                                          actionType: tempEventAction,
                                          script: tempEventScript,
                                          desc: tempEventDesc || r.desc
                                        } : r));
                                        showNotification(`已成功保存事件“${tempEventName}”更改！`);
                                      }
                                      setIsEventModalOpen(false);
                                    }}
                                    className="px-5 py-2 bg-primary text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
                                  >
                                    确定
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

              {editorTab !== 'page' && (
                <main className="flex-1 overflow-y-auto p-12 bg-surface-container-lowest/30 custom-scrollbar relative">
                  {editorTab === 'design' && (
                    <div className="max-w-4xl mx-auto space-y-4 pb-20">
                  <Reorder.Group axis="y" values={formFields} onReorder={setFormFields} className="flex flex-wrap gap-4">
                    {formFields.map((field) => (
                      <Reorder.Item 
                        key={field.id} 
                        value={field}
                        style={{
                          width: field.width === '1/2' ? 'calc((100% - 1rem) / 2)' : 
                                 field.width === '1/3' ? 'calc((100% - 2rem) / 3)' :
                                 field.width === '1/4' ? 'calc((100% - 3rem) / 4)' : '100%'
                        }}
                        className={`sleek-card p-6 cursor-grab active:cursor-grabbing border-2 transition-all shrink-0 ${selectedFieldId === field.id ? 'border-primary ring-4 ring-primary/5' : 'border-outline-variant hover:border-outline'}`}
                        onClick={() => setSelectedFieldId(field.id)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-surface rounded-lg">
                              <MousePointer2 className="w-3 h-3 text-on-surface-variant" />
                            </div>
                            <span className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none">{field.type}</span>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                            className="p-1.5 text-outline hover:text-error hover:bg-error/5 rounded-md transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="font-bold mb-1 truncate">{field.label}</div>
                        <div className="text-[10px] text-on-surface-variant font-medium truncate">
                          {field.placeholder || "无占位符"} • {field.required ? "必填" : "非必填"} • {field.width || "1/1"}
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                  <button 
                    onClick={() => addField('text')}
                    className="w-full border-2 border-dashed border-outline-variant rounded-2xl py-12 flex flex-col items-center gap-2 text-outline hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group active:scale-95"
                  >
                    <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-bold">添加新项</span>
                  </button>
                </div>
              )}

              {editorTab === 'workflow' && (
                <div className="space-y-8 pb-32">
                  {/* Workflow Top Control Header */}
                  <div className="flex flex-col gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-outline-variant/80 shadow-sm mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xs font-extrabold tracking-tight">流程设计画布</h3>
                          {(() => {
                            const versions = (selectedFormId && workflowVersionsMap[selectedFormId]) ? workflowVersionsMap[selectedFormId] : [];
                            const activeVer = versions.find(v => v.status === 'active') || versions[versions.length - 1];
                            return (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] bg-primary/10 text-primary font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-primary/20">
                                  <GitBranch className="w-3 h-3" />
                                  {activeVer ? activeVer.version : 'v1.0.0'}
                                </span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                  {activeVer?.status === 'active' ? '当前运行' : '草稿版本'}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                        <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                          <span className="font-bold text-on-surface">全局策略:</span> 动态触发({workflowGlobalConfig.triggerRules.length}条) • 
                          {workflowGlobalConfig.allowTransfer ? ' 允许转批' : ' 禁止转批'} • 
                          超时({workflowGlobalConfig.enableTimeoutSettings ? `${workflowGlobalConfig.timeoutHours}h` : '关'})
                        </p>
                      </div>

                      {/* Action buttons for Version Management */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            const versions = (selectedFormId && workflowVersionsMap[selectedFormId]) ? workflowVersionsMap[selectedFormId] : [];
                            const lastVer = versions.length > 0 ? versions[versions.length - 1] : null;
                            const nextNum = lastVer ? parseFloat((lastVer.versionNum + 0.1).toFixed(1)) : 1.1;
                            setNewVersionTitle(`流程改进版 v${nextNum.toFixed(1)}.0`);
                            setNewVersionDesc('基于当前编辑状态创建新版本');
                            setIsNewVersionModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white hover:bg-primary-hover rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>新增版本</span>
                        </button>

                        <button
                          onClick={() => setIsVersionHistoryModalOpen(true)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-surface text-on-surface border border-outline-variant hover:border-primary hover:text-primary rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5 text-primary" />
                          <span>查看历史 ({((selectedFormId && workflowVersionsMap[selectedFormId]) || []).length})</span>
                        </button>

                        <button
                          onClick={() => {
                            const versions = (selectedFormId && workflowVersionsMap[selectedFormId]) || [];
                            if (versions.length >= 2) {
                              setDiffVersionIdA(versions[0].id);
                              setDiffVersionIdB(versions[versions.length - 1].id);
                            } else if (versions.length === 1) {
                              setDiffVersionIdA(versions[0].id);
                              setDiffVersionIdB('current');
                            }
                            setIsVersionDiffModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-surface text-on-surface border border-outline-variant hover:border-indigo-600 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
                          <span>版本对比</span>
                        </button>

                        <button
                          onClick={() => {
                            setGlobalSettingsTab('workflow');
                            setIsGlobalSettingsOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-surface-container text-on-surface border border-outline-variant hover:bg-outline-variant/20 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-outline" />
                          <span>全局策略</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    {workflowNodes.map((node, index) => {
                      const isBranching = node.type === 'condition';
                      return (
                        <React.Fragment key={node.id}>
                          <motion.div 
                            layoutId={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`w-full max-w-sm sleek-card p-6 border-2 transition-all cursor-pointer group relative ${selectedNodeId === node.id ? 'border-primary ring-4 ring-primary/5 shadow-xl' : 'border-outline-variant hover:border-outline'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${
                                node.type === 'start' ? 'bg-green-100 text-green-700' :
                                node.type === 'approval' ? 'bg-amber-100 text-amber-700' :
                                node.type === 'notification' ? 'bg-blue-100 text-blue-700' :
                                node.type === 'condition' ? 'bg-indigo-100 text-indigo-700' :
                                node.type === 'cc' ? 'bg-surface-container text-on-surface-variant' :
                                node.type === 'end' ? 'bg-on-surface text-white' : 'bg-surface text-on-surface'
                              }`}>
                                {node.type === 'start' && <CircleDot className="w-5 h-5" />}
                                {node.type === 'approval' && <ShieldCheck className="w-5 h-5" />}
                                {node.type === 'notification' && <Mail className="w-5 h-5" />}
                                {node.type === 'condition' && <Workflow className="w-5 h-5" />}
                                {node.type === 'cc' && <Share2 className="w-5 h-5" />}
                                {node.type === 'end' && <Save className="w-5 h-5" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-extrabold text-sm tracking-tight">{node.label}</h4>
                                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{node.description}</p>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeWorkflowNode(node.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-error/5 hover:text-error rounded transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            
                            {node.type === 'approval' && (
                              <div className="mt-4 pt-4 border-t border-dashed border-outline-variant space-y-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 overflow-hidden">
                                    <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span className="text-[11px] font-extrabold text-primary truncate">
                                      {node.config?.assigneeType === 'user' && `固定人员: ${node.config?.assigneeValue || '未指定'}`}
                                      {node.config?.assigneeType === 'role' && `角色: ${node.config?.assigneeValue || '未指定'}`}
                                      {node.config?.assigneeType === 'dept' && `部门负责人: ${node.config?.assigneeValue || '未指定'}`}
                                      {node.config?.assigneeType === 'initiator' && '发起人复核数据'}
                                      {node.config?.assigneeType === 'manager' && `直属主管: ${node.config?.assigneeValue || '直属一级主管'}`}
                                      {!node.config?.assigneeType && '未配置审批人'}
                                    </span>
                                  </div>
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                                    node.config?.approvalType === 'AND' ? 'bg-indigo-100 text-indigo-700' :
                                    node.config?.approvalType === 'SEQUENTIAL' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {node.config?.approvalType === 'AND' ? '会签 (全员)' :
                                     node.config?.approvalType === 'SEQUENTIAL' ? '依次审批 (按级)' : '或签 (一人同意)'}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                  <div className="flex gap-1">
                                    {(node.config?.actions || ['approve', 'reject', 'transfer', 'return']).map(act => (
                                      <span key={act} className="text-[9px] font-bold bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded border border-outline-variant/60">
                                        {act === 'approve' ? '通过' : act === 'reject' ? '拒绝' : act === 'transfer' ? '转交' : act === 'return' ? '退回' : act}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${node.config?.commentRequirement === 'optional' ? 'bg-surface text-outline border border-outline-variant' : 'bg-primary/10 text-primary'}`}>
                                    意见:{node.config?.commentRequirement === 'optional' ? '选填' : '必填'}
                                  </span>

                                  <span className="text-[9px] font-bold bg-surface text-outline px-1.5 py-0.5 rounded border border-outline-variant">
                                    为空:{
                                      node.config?.advanced?.emptyAssigneeAction === 'terminate_error' ? '终止报错' :
                                      node.config?.advanced?.emptyAssigneeAction === 'auto_pass' ? '自动通过' :
                                      node.config?.advanced?.emptyAssigneeAction === 'pause_admin' ? '挂起管理员' : '转指定人'
                                    }
                                  </span>
                                </div>
                              </div>
                            )}

                            {isBranching && (
                              <div className="mt-4 pt-4 border-t border-dashed border-outline-variant space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold text-outline uppercase tracking-widest">
                                  <span>路由条件分支</span>
                                  <span className="text-[9px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                    {(node.config?.branches?.length || 2)} 条条件分支
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {(node.config?.branches || [
                                    { id: 'b1', name: '分支 1', fieldId: 'amount', operator: '大于', value: '1000' },
                                    { id: 'b2', name: '默认分支', fieldId: '', operator: '其他', value: '默认路径' }
                                  ]).map((branch, bIdx) => (
                                    <div key={branch.id || bIdx} className="flex items-center justify-between text-[10px] font-mono bg-surface p-1.5 rounded-lg border border-outline-variant">
                                      <span className="font-bold text-on-surface">{branch.name || `分支 ${bIdx + 1}`}:</span>
                                      <span className="text-primary truncate max-w-[180px]">
                                        {branch.fieldId ? `${branch.fieldId} ${branch.operator} ${branch.value}` : '其他默认条件'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                          
                          {index < workflowNodes.length - 1 && !isBranching && (
                            <div className="h-12 w-0.5 bg-outline-variant relative my-2 group/connector">
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all z-20">
                                  <div className="relative">
                                    <button 
                                      onClick={() => setShowInsertNodeMenu(showInsertNodeMenu === node.id ? null : node.id)}
                                      className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all ${showInsertNodeMenu === node.id ? 'bg-error text-white rotate-45' : 'bg-primary text-white opacity-0 group-hover/connector:opacity-100'}`}
                                    >
                                       <Plus className="w-4 h-4" />
                                    </button>

                                    <AnimatePresence>
                                      {showInsertNodeMenu === node.id && (
                                        <motion.div 
                                          initial={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
                                          animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                                          exit={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
                                          className="absolute top-8 left-1/2 bg-white rounded-xl shadow-2xl border border-outline-variant p-1.5 z-30 flex gap-1 min-w-[200px]"
                                        >
                                           {[
                                             { type: 'approval' as const, icon: ShieldCheck, label: '审批' },
                                             { type: 'notification' as const, icon: Mail, label: '通知' },
                                             { type: 'cc' as const, icon: Share2, label: '抄送' },
                                             { type: 'condition' as const, icon: Workflow, label: '条件' },
                                           ].map((item) => (
                                             <button
                                               key={item.type}
                                               onClick={() => {
                                                 insertWorkflowNode(node.id, item.type);
                                                 setShowInsertNodeMenu(null);
                                               }}
                                               className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-primary/5 transition-all group/item"
                                             >
                                               <div className="p-1.5 bg-surface rounded-md group-hover/item:bg-primary/10 transition-colors">
                                                 <item.icon className="w-3.5 h-3.5 text-outline group-hover/item:text-primary" />
                                               </div>
                                               <span className="text-[9px] font-bold whitespace-nowrap">{item.label}</span>
                                             </button>
                                           ))}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                               </div>
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-r-2 border-b-2 border-outline-variant rotate-45"></div>
                            </div>
                          )}

                          {isBranching && (
                            <div className="h-16 w-full flex justify-center relative my-4">
                               <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px border-l-2 border-dashed border-outline-variant"></div>
                               <div className="flex gap-40 relative z-10 pt-8">
                                  <div className="flex flex-col items-center gap-2">
                                     <div className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">正确路径</div>
                                  </div>
                                  <div className="flex flex-col items-center gap-2">
                                     <div className="text-[10px] font-bold text-outline bg-surface px-2 py-0.5 rounded border border-outline-variant">错误路径</div>
                                  </div>
                               </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="flex justify-center pt-8">
                     <button 
                       onClick={() => addWorkflowNode('approval')}
                       className="px-6 py-4 bg-white border-2 border-dashed border-outline-variant rounded-2xl text-[10px] font-bold uppercase tracking-widest text-outline hover:border-primary hover:text-primary transition-all flex items-center gap-2 group shadow-sm hover:shadow-lg"
                     >
                       <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
                       编排新区块
                     </button>
                  </div>
                </div>
              )}

              {editorTab === 'simulate' && (
                <motion.div 
                  key="simulate-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-5xl mx-auto pb-32 space-y-8"
                >
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Data Input */}
                      <div className="lg:col-span-1 border border-outline-variant bg-white rounded-3xl p-8 shadow-sm space-y-6">
                         <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                            <h3 className="font-bold flex items-center gap-2"><Database className="w-4 h-4 text-primary" /> 表单模拟数据</h3>
                            <button 
                              onClick={() => {
                                showNotification('模拟数据已重置');
                                setSimulationData({ amount: 6000 });
                              }}
                              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
                            >重置</button>
                         </div>
                         <div className="flex flex-wrap gap-x-4 gap-y-4">
                            {formFields && formFields.filter(f => ['text', 'number', 'select'].includes(f.type)).length > 0 ? (
                              formFields.filter(f => ['text', 'number', 'select'].includes(f.type)).map(field => (
                                <div 
                                  key={field.id} 
                                  className="space-y-2"
                                  style={{
                                    width: field.width === '1/2' ? 'calc((100% - 1rem) / 2)' : 
                                           field.width === '1/3' ? 'calc((100% - 2rem) / 3)' :
                                           field.width === '1/4' ? 'calc((100% - 3rem) / 4)' : '100%'
                                  }}
                                >
                                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none mb-1 block">{field.label}</label>
                                  <input 
                                    type={field.type === 'number' ? 'number' : 'text'}
                                    value={simulationData[field.label?.toLowerCase()] ?? ''}
                                    onChange={(e) => setSimulationData({...simulationData, [field.label?.toLowerCase()]: e.target.value})}
                                    className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    placeholder={`输入 ${field.label}...`}
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="p-4 bg-surface text-center rounded-xl border border-dashed border-outline-variant w-full">
                                <p className="text-[10px] font-bold text-outline">无可用模拟字段</p>
                              </div>
                            )}
                         </div>
                         <button 
                           onClick={() => showNotification('仿真负载已校验')}
                           className="w-full py-4 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-xl hover:shadow-primary/20 transition-all"
                         >校验载荷</button>
                      </div>

                      {/* Right: Flow Output */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="border border-outline-variant bg-surface-container-low/30 rounded-3xl p-8 border-2 border-dashed relative overflow-hidden min-h-[500px]">
                           <div className="flex items-center justify-between mb-8 relative z-10">
                              <h3 className="font-bold bg-white px-4 py-1.5 rounded-full border border-outline-variant shadow-sm text-xs">Runtime Trace (实时追踪)</h3>
                              <div className="flex items-center gap-2">
                                 <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
                                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest">正在模拟...</span>
                              </div>
                           </div>
                           
                           <div className="space-y-4 relative z-10">
                              {[
                                 { time: 'T+0s', event: '发起人触发 "支付申请"', ok: true },
                                 { time: 'T+1s', event: '经理审批: 待处理 (部门经理)', ok: true },
                                 { time: 'T+2s', event: `条件阈值: ${Number(simulationData.amount || 0) > 5000 ? '符合' : '不符合'} (路径: ${Number(simulationData.amount || 0) > 5000 ? '企业审核' : '自动放行'})`, ok: true },
                                 { time: 'T+3s', event: Number(simulationData.amount || 0) > 5000 ? 'CFO 最终签核: 必需' : '处理完成', ok: true },
                                 { time: 'T+4s', event: '审计日志写入: 成功', ok: true },
                              ].map((trace, i) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.15 + 0.3 }}
                                  className="flex gap-4 p-4 rounded-2xl bg-white border border-outline-variant shadow-sm group hover:border-primary transition-all"
                                >
                                   <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center font-mono text-[10px] font-bold text-outline shrink-0">{trace.time}</div>
                                   <div className="flex flex-col justify-center min-w-0">
                                      <span className="text-xs font-extrabold text-on-surface truncate">{trace.event}</span>
                                      <span className="text-[10px] text-outline font-medium tracking-tight">操作成功</span>
                                   </div>
                                   <div className="ml-auto flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                                </motion.div>
                              ))}
                           </div>

                           <motion.div 
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 1.2 }}
                             className="mt-8 p-6 bg-primary text-white rounded-3xl shadow-2xl shadow-primary/30 relative z-10"
                           >
                              <div className="text-[10px] font-bold opacity-80 uppercase mb-1 tracking-widest">最终模拟结果</div>
                              <div className="font-extrabold text-xl tracking-tight">
                                流程将导向：{Number(simulationData.amount || 0) > 5000 ? '企业人工核验策略' : '自动流水释放流程'}
                              </div>
                              <div className="mt-4 flex gap-4 text-[10px] font-bold opacity-70">
                                <span>延迟: 4.2ms</span>
                                <span>内存: 12.4MB</span>
                                <span>状态: 已校验</span>
                              </div>
                           </motion.div>

                           {/* Blueprint subtle background */}
                           <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                              <LayoutGrid className="w-full h-full" />
                           </div>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {editorTab === 'publish' && (
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="w-full space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <header className="mb-4">
                    <h2 className="text-2xl font-extrabold tracking-tight">发布设置：{publishMode === 'public' ? '公开发布' : '内部发布'}</h2>
                    <p className="text-sm text-on-surface-variant font-medium">配置表单的访问方式、生成的链接以及访问权限</p>
                  </header>

                  {/* Mode Selector Option Component to guarantee single selection explicitly */}
                  <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-primary" />
                        选择发布模式（公开发布与内部发布二选一）
                      </h3>
                      <p className="text-[10px] text-on-surface-variant font-medium">公开发布和内部发布两种方式只能选择其中的一种开启生效</p>
                    </div>
                    <div className="flex bg-surface rounded-2xl p-1 border border-outline-variant shrink-0 select-none">
                      <button
                        type="button"
                        onClick={() => setPublishMode('public')}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${publishMode === 'public' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>公开发布</span>
                        {publishMode === 'public' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPublishMode('internal')}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${publishMode === 'internal' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>内部发布</span>
                        {publishMode === 'internal' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </button>
                    </div>
                  </div>

                  {publishMode === 'public' ? (
                    <div className="space-y-6">
                      <section className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm space-y-8">
                        <div>
                          <h3 className="font-bold flex items-center gap-2 text-lg mb-4 cursor-default">
                             <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                               <LayoutGrid className="w-4 h-4 text-primary" />
                             </div>
                             数据管理页访问链接
                          </h3>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest">默认链接</label>
                              <div className="flex gap-2">
                                <input readOnly value={publishLinks.page} className="flex-1 bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold font-mono outline-none" />
                                <div className="flex gap-2">
                                  <button onClick={() => { navigator.clipboard.writeText(publishLinks.page); showNotification('链接已复制'); }} className="p-3 bg-surface hover:bg-surface-container rounded-xl transition-all border border-outline-variant" title="复制"><Copy className="w-4 h-4" /></button>
                                  <button onClick={() => showNotification('正在下载二维码...')} className="p-3 bg-surface hover:bg-surface-container rounded-xl transition-all border border-outline-variant" title="二维码"><QrCode className="w-4 h-4" /></button>
                                  <a href={publishLinks.page} target="_blank" rel="noreferrer" className="p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-all border border-primary/20" title="预览"><ExternalLink className="w-4 h-4" /></a>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest">自定义链接</label>
                              <div className="flex gap-2">
                                <div className="flex items-center gap-2 bg-surface border border-outline-variant rounded-xl px-4 py-3 flex-1">
                                  <span className="text-xs text-outline font-mono">architect.com/p/</span>
                                  <input 
                                    placeholder="输入自定义路径" 
                                    value={customLinks.page}
                                    onChange={(e) => setCustomLinks({...customLinks, page: e.target.value})}
                                    className="bg-transparent text-xs font-bold font-mono outline-none flex-1" 
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button className="p-3 bg-surface hover:bg-surface-container rounded-xl transition-all border border-outline-variant" title="复制"><Copy className="w-4 h-4" /></button>
                                  <button className="p-3 bg-surface hover:bg-surface-container rounded-xl transition-all border border-outline-variant" title="二维码"><QrCode className="w-4 h-4" /></button>
                                  <button className="p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-all border border-primary/20" title="预览"><ExternalLink className="w-4 h-4" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm space-y-8">
                        <div>
                          <h3 className="font-bold flex items-center gap-2 text-lg mb-4 cursor-default">
                             <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                               <FormInput className="w-4 h-4 text-primary" />
                             </div>
                             表单填写链接
                          </h3>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest">默认链接</label>
                              <div className="flex gap-2">
                                <input readOnly value={publishLinks.form} className="flex-1 bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold font-mono outline-none" />
                                <div className="flex gap-2">
                                  <button onClick={() => { navigator.clipboard.writeText(publishLinks.form); showNotification('链接已复制'); }} className="p-3 bg-surface hover:bg-surface-container rounded-xl transition-all border border-outline-variant" title="复制"><Copy className="w-4 h-4" /></button>
                                  <button onClick={() => showNotification('正在下载二维码...')} className="p-3 bg-surface hover:bg-surface-container rounded-xl transition-all border border-outline-variant" title="二维码"><QrCode className="w-4 h-4" /></button>
                                  <a href={publishLinks.form} target="_blank" rel="noreferrer" className="p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-all border border-primary/20" title="预览"><ExternalLink className="w-4 h-4" /></a>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest">自定义链接</label>
                              <div className="flex gap-2">
                                <div className="flex items-center gap-2 bg-surface border border-outline-variant rounded-xl px-4 py-3 flex-1">
                                  <span className="text-xs text-outline font-mono">architect.com/f/</span>
                                  <input 
                                    placeholder="输入自定义路径" 
                                    value={customLinks.form}
                                    onChange={(e) => setCustomLinks({...customLinks, form: e.target.value})}
                                    className="bg-transparent text-xs font-bold font-mono outline-none flex-1" 
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button className="p-3 bg-surface hover:bg-surface-container rounded-xl transition-all border border-outline-variant" title="复制"><Copy className="w-4 h-4" /></button>
                                  <button className="p-3 bg-surface hover:bg-surface-container rounded-xl transition-all border border-outline-variant" title="二维码"><QrCode className="w-4 h-4" /></button>
                                  <button className="p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-all border border-primary/20" title="预览"><ExternalLink className="w-4 h-4" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="flex justify-end p-4">
                         <button onClick={() => showNotification('访问限制已生效')} className="px-12 py-4 bg-primary text-white rounded-2xl font-extrabold shadow-xl shadow-primary/20 hover:scale-105 transition-all">确认并发布</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* 发布到工作台 card */}
                      <section className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm space-y-6">
                         <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                            <h3 className="font-black text-base flex items-center gap-2.5 cursor-default text-on-surface">
                              <Briefcase className="w-5 h-5 text-primary" />
                              发布到工作台
                            </h3>
                            <span className="text-[10px] font-black bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                              工作台导航集成
                            </span>
                         </div>
                         <p className="text-xs text-outline font-medium">
                           配置将此表单的成员填报端、以及管理员数据查询端直接整合进工作台左侧或顶部系统业务菜单中，功能终端用户一键触达。
                         </p>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                           {/* (1) 数据管理页面发布位置 */}
                           <div className="space-y-4">
                             <div className="flex items-center gap-2">
                               <div className="w-1.5 h-4 bg-primary rounded-full" />
                               <span className="text-sm font-black text-on-surface">数据管理页面发布位置</span>
                             </div>
                             <p className="text-[11px] text-outline leading-relaxed">
                               控制“数据管理（后台明细查看）”页面在工作台显示时的组织架构隶属关系。
                             </p>

                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                               {/* Option 1: As Sub-item */}
                               <button
                                 type="button"
                                 onClick={() => setPublishDataPagePosition('sub')}
                                 className={`flex flex-col items-start p-4 border rounded-2xl text-left transition-all ${
                                   publishDataPagePosition === 'sub'
                                     ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5'
                                     : 'border-outline-variant bg-white hover:bg-surface-container-low'
                                 }`}
                               >
                                 <div className="flex items-center justify-between w-full mb-3">
                                   <span className="text-xs font-black text-on-surface">作为当前应用下级</span>
                                   <input
                                     type="radio"
                                     checked={publishDataPagePosition === 'sub'}
                                     onChange={() => setPublishDataPagePosition('sub')}
                                     className="w-3.5 h-3.5 text-primary cursor-pointer accent-primary"
                                   />
                                 </div>
                                 <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 space-y-1.5 font-mono text-[9px] text-outline">
                                   <div className="flex items-center gap-1 font-bold">
                                      <Briefcase className="w-3 h-3 text-primary" />
                                      <span>[应用] 当前系统集</span>
                                   </div>
                                   <div className="pl-3.5 border-l border-outline-variant flex items-center gap-1 font-black text-on-surface">
                                      <Database className="w-3 h-3 text-secondary" />
                                      <span>数据管理明细</span>
                                   </div>
                                 </div>
                               </button>

                               {/* Option 2: Parallel */}
                               <button
                                 type="button"
                                 onClick={() => setPublishDataPagePosition('parallel')}
                                 className={`flex flex-col items-start p-4 border rounded-2xl text-left transition-all ${
                                   publishDataPagePosition === 'parallel'
                                     ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5'
                                     : 'border-outline-variant bg-white hover:bg-surface-container-low'
                                 }`}
                               >
                                 <div className="flex items-center justify-between w-full mb-3">
                                   <span className="text-xs font-black text-on-surface">与当前应用平级</span>
                                   <input
                                     type="radio"
                                     checked={publishDataPagePosition === 'parallel'}
                                     onChange={() => setPublishDataPagePosition('parallel')}
                                     className="w-3.5 h-3.5 text-primary cursor-pointer accent-primary"
                                   />
                                 </div>
                                 <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 space-y-1.5 font-mono text-[9px] text-outline">
                                   <div className="flex items-center gap-1 font-bold">
                                      <Briefcase className="w-3 h-3 text-outline" />
                                      <span>[应用] 当前系统集</span>
                                   </div>
                                   <div className="flex items-center gap-1 font-black text-on-surface mt-1">
                                      <Database className="w-3 h-3 text-secondary" />
                                      <span>[导航项] 数据管理明细</span>
                                   </div>
                                 </div>
                               </button>
                             </div>
                           </div>

                           {/* (2) 表单填写页面发布位置 */}
                           <div className="space-y-4">
                             <div className="flex items-center gap-2">
                               <div className="w-1.5 h-4 bg-primary rounded-full" />
                               <span className="text-sm font-black text-on-surface">表单填写页面发布位置</span>
                             </div>
                             <p className="text-[11px] text-outline leading-relaxed">
                               控制“表单数据填写页”在工作台显示时的组织架构隶属关系。
                             </p>

                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                               {/* Option 1: As Sub-item */}
                               <button
                                 type="button"
                                 onClick={() => setPublishFormPagePosition('sub')}
                                 className={`flex flex-col items-start p-4 border rounded-2xl text-left transition-all ${
                                   publishFormPagePosition === 'sub'
                                     ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5'
                                     : 'border-outline-variant bg-white hover:bg-surface-container-low'
                                 }`}
                               >
                                 <div className="flex items-center justify-between w-full mb-3">
                                   <span className="text-xs font-black text-on-surface">作为当前应用下级</span>
                                   <input
                                     type="radio"
                                     checked={publishFormPagePosition === 'sub'}
                                     onChange={() => setPublishFormPagePosition('sub')}
                                     className="w-3.5 h-3.5 text-primary cursor-pointer accent-primary"
                                   />
                                 </div>
                                 <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 space-y-1.5 font-mono text-[9px] text-outline">
                                   <div className="flex items-center gap-1 font-bold">
                                      <Briefcase className="w-3 h-3 text-primary" />
                                      <span>[应用] 当前系统集</span>
                                   </div>
                                   <div className="pl-3.5 border-l border-outline-variant flex items-center gap-1 font-black text-on-surface">
                                      <FormInput className="w-3 h-3 text-secondary" />
                                      <span>表单填报中心</span>
                                   </div>
                                 </div>
                               </button>

                               {/* Option 2: Parallel */}
                               <button
                                 type="button"
                                 onClick={() => setPublishFormPagePosition('parallel')}
                                 className={`flex flex-col items-start p-4 border rounded-2xl text-left transition-all ${
                                   publishFormPagePosition === 'parallel'
                                     ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5'
                                     : 'border-outline-variant bg-white hover:bg-surface-container-low'
                                 }`}
                               >
                                 <div className="flex items-center justify-between w-full mb-3">
                                   <span className="text-xs font-black text-on-surface">与当前应用平级</span>
                                   <input
                                     type="radio"
                                     checked={publishFormPagePosition === 'parallel'}
                                     onChange={() => setPublishFormPagePosition('parallel')}
                                     className="w-3.5 h-3.5 text-primary cursor-pointer accent-primary"
                                   />
                                 </div>
                                 <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2.5 space-y-1.5 font-mono text-[9px] text-outline">
                                   <div className="flex items-center gap-1 font-bold">
                                      <Briefcase className="w-3 h-3 text-outline" />
                                      <span>[应用] 当前系统集</span>
                                   </div>
                                   <div className="flex items-center gap-1 font-black text-on-surface mt-1">
                                      <FormInput className="w-3 h-3 text-secondary" />
                                      <span>[导航项] 表单填报中心</span>
                                   </div>
                                 </div>
                               </button>
                             </div>
                           </div>
                         </div>
                      </section>

                      <section className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm space-y-6">
                         <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                            <h3 className="font-bold flex items-center gap-2 cursor-default"><Building2 className="w-5 h-5 text-primary" /> 数据管理页面权限</h3>
                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">清空所选</button>
                         </div>

                         <div className="flex flex-col gap-6">
                           {/* 规则组合逻辑 */}
                           <div className="border border-outline-variant rounded-2xl p-6 bg-surface-container-low/20 space-y-6">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
                               <div className="space-y-1">
                                 <h4 className="text-xs font-extrabold text-on-surface flex items-center gap-1.5 cursor-default">
                                   规则组合逻辑
                                 </h4>
                                 <p className="text-[10px] text-outline">组合逻辑仅适用于“组织范围”和“指定角色”</p>
                               </div>

                               <div className="flex bg-white px-3 py-2 rounded-xl border border-outline-variant flex-wrap items-center gap-3">
                                 <span className="text-[10px] font-extrabold text-on-surface-variant">条件逻辑:</span>
                                 <div className="flex gap-4">
                                   <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                     <input 
                                       type="radio" 
                                       name="pageMatchMode" 
                                       checked={pageMatchMode === 'all'} 
                                       onChange={() => setPageMatchMode('all')}
                                       className="w-3.5 h-3.5 text-primary focus:ring-primary border-outline-variant cursor-pointer accent-primary"
                                     />
                                     <span className="text-[11px] font-extrabold text-on-surface">所有条件必须同时满足</span>
                                     <span className="text-[9px] text-outline px-1.5 py-0.5 bg-outline-variant/20 rounded font-mono font-bold">AND</span>
                                   </label>
                                   <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                     <input 
                                       type="radio" 
                                       name="pageMatchMode" 
                                       checked={pageMatchMode === 'any'} 
                                       onChange={() => setPageMatchMode('any')}
                                       className="w-3.5 h-3.5 text-primary focus:ring-primary border-outline-variant cursor-pointer accent-primary"
                                     />
                                     <span className="text-[11px] font-extrabold text-on-surface">任意满足其中一个条件</span>
                                     <span className="text-[9px] text-outline px-1.5 py-0.5 bg-outline-variant/20 rounded font-mono font-bold">OR</span>
                                   </label>
                                 </div>
                               </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                   <label className="text-[10px] font-bold text-outline border-b border-outline-variant block pb-1">组织范围</label>
                                   <div className="flex items-center gap-2 p-3 bg-white border border-outline-variant rounded-xl text-xs font-bold cursor-pointer hover:border-primary transition-all">
                                      <Building2 className="w-4 h-4 text-outline" /> <span>选择部门 / 组织</span>
                                   </div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-bold text-outline border-b border-outline-variant block pb-1">指定角色</label>
                                   <div className="flex items-center gap-2 p-3 bg-white border border-outline-variant rounded-xl text-xs font-bold cursor-pointer hover:border-primary transition-all">
                                      <UserCog className="w-4 h-4 text-outline" /> <span>选择权限角色</span>
                                   </div>
                                </div>
                             </div>
                           </div>

                           {/* 具体人员 追加项 */}
                           <div className="border border-outline-variant bg-surface-container-low/20 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                             <div className="space-y-1">
                               <div className="flex items-center justify-between gap-2">
                                 <h4 className="text-xs font-extrabold text-on-surface">具体人员</h4>
                                 <span className="text-[9px] font-extrabold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">追加项</span>
                               </div>
                               <p className="text-[10px] text-outline leading-tight">作为特准追加项，不受组织和角色的规则组合逻辑限制，可直接赋予选定的人员访问权限。</p>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-bold text-outline border-b border-outline-variant block pb-1">直接指定具体人</label>
                                <div className="flex items-center gap-2 p-3 bg-white border border-outline-variant rounded-xl text-xs font-bold cursor-pointer hover:border-primary transition-all">
                                   <Users className="w-4 h-4 text-outline" /> <span>选择具体用户</span>
                                </div>
                             </div>
                           </div>
                         </div>
                      </section>

                      <section className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm space-y-6">
                         <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                            <h3 className="font-bold flex items-center gap-2 cursor-default"><FormInput className="w-5 h-5 text-primary" /> 表单填写页面权限</h3>
                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">清空所选</button>
                         </div>

                         <div className="flex flex-col gap-6">
                           {/* 规则组合逻辑 */}
                           <div className="border border-outline-variant rounded-2xl p-6 bg-surface-container-low/20 space-y-6">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
                               <div className="space-y-1">
                                 <h4 className="text-xs font-extrabold text-on-surface flex items-center gap-1.5 cursor-default">
                                   规则组合逻辑
                                 </h4>
                                 <p className="text-[10px] text-outline">组合逻辑仅适用于“组织范围”和“指定角色”</p>
                               </div>

                               <div className="flex bg-white px-3 py-2 rounded-xl border border-outline-variant flex-wrap items-center gap-3">
                                 <span className="text-[10px] font-extrabold text-on-surface-variant">条件逻辑:</span>
                                 <div className="flex gap-4">
                                   <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                     <input 
                                       type="radio" 
                                       name="formMatchMode" 
                                       checked={formMatchMode === 'all'} 
                                       onChange={() => setFormMatchMode('all')}
                                       className="w-3.5 h-3.5 text-primary focus:ring-primary border-outline-variant cursor-pointer accent-primary"
                                     />
                                     <span className="text-[11px] font-extrabold text-on-surface">所有条件必须同时满足</span>
                                     <span className="text-[9px] text-outline px-1.5 py-0.5 bg-outline-variant/20 rounded font-mono font-bold">AND</span>
                                   </label>
                                   <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                     <input 
                                       type="radio" 
                                       name="formMatchMode" 
                                       checked={formMatchMode === 'any'} 
                                       onChange={() => setFormMatchMode('any')}
                                       className="w-3.5 h-3.5 text-primary focus:ring-primary border-outline-variant cursor-pointer accent-primary"
                                     />
                                     <span className="text-[11px] font-extrabold text-on-surface">任意满足其中一个条件</span>
                                     <span className="text-[9px] text-outline px-1.5 py-0.5 bg-outline-variant/20 rounded font-mono font-bold">OR</span>
                                   </label>
                                 </div>
                               </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                   <label className="text-[10px] font-bold text-outline border-b border-outline-variant block pb-1">组织范围</label>
                                   <div className="flex items-center gap-2 p-3 bg-white border border-outline-variant rounded-xl text-xs font-bold cursor-pointer hover:border-primary transition-all">
                                      <Building2 className="w-4 h-4 text-outline" /> <span>选择部门 / 组织</span>
                                   </div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-bold text-outline border-b border-outline-variant block pb-1">指定角色</label>
                                   <div className="flex items-center gap-2 p-3 bg-white border border-outline-variant rounded-xl text-xs font-bold cursor-pointer hover:border-primary transition-all">
                                      <UserCog className="w-4 h-4 text-outline" /> <span>选择权限角色</span>
                                   </div>
                                </div>
                             </div>
                           </div>

                           {/* 具体人员 追加项 */}
                           <div className="border border-outline-variant bg-surface-container-low/20 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                             <div className="space-y-1">
                               <div className="flex items-center justify-between gap-2">
                                 <h4 className="text-xs font-extrabold text-on-surface">具体人员</h4>
                                 <span className="text-[9px] font-extrabold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">追加项</span>
                               </div>
                               <p className="text-[10px] text-outline leading-tight">作为特准追加项，不受组织和角色的规则组合逻辑限制，可直接赋予选定的人员访问权限。</p>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-bold text-outline border-b border-outline-variant block pb-1">直接指定具体人</label>
                                <div className="flex items-center gap-2 p-3 bg-white border border-outline-variant rounded-xl text-xs font-bold cursor-pointer hover:border-primary transition-all">
                                   <Users className="w-4 h-4 text-outline" /> <span>选择具体用户</span>
                                </div>
                             </div>
                           </div>
                         </div>
                      </section>

                      <div className="flex justify-end p-4">
                         <button onClick={() => showNotification('访问限制已生效')} className="px-12 py-4 bg-primary text-white rounded-2xl font-extrabold shadow-xl shadow-primary/20 hover:scale-105 transition-all">确认并发布</button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              {editorTab === 'data' && (
                <div className="max-w-7xl mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <h2 className="text-2xl font-extrabold tracking-tight">数据管理</h2>
                        <p className="text-sm text-on-surface-variant font-medium">查看并管理表单提交的所有实例记录</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 p-1 bg-surface-container rounded-xl border border-outline-variant">
                             <button 
                               onClick={() => setIsDataMasked(true)}
                               className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${isDataMasked ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                             >
                               <ShieldCheck className="w-3 h-3" /> 脱敏模式
                             </button>
                             <button 
                               onClick={() => setIsDataMasked(false)}
                               className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${!isDataMasked ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                             >
                               <Eye className="w-3 h-3" /> 原始模式
                             </button>
                         </div>
                         <button 
                           onClick={handleExport}
                           className="px-4 py-1.5 bg-primary text-white rounded-lg text-[10px] font-bold shadow-sm hover:bg-primary-hover transition-all flex items-center gap-1.5 cursor-pointer"
                         >
                           <Download className="w-3 h-3" /> 导出 Excel
                         </button>
                      </div>
                   </div>

                   {/* Toolbar */}
                   <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-outline-variant shadow-sm">
                      <div className="flex flex-1 items-center gap-4 w-full sm:w-auto">
                         <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                            <input 
                               type="text"
                               placeholder="搜索提交人或关键词..."
                               value={searchQuery}
                               onChange={(e) => setSearchQuery(e.target.value)}
                               className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                         </div>
                         <div className="flex items-center gap-2">
                             <Filter className="w-4 h-4 text-outline" />
                             <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer border border-outline-variant px-3 py-2 rounded-xl"
                             >
                                <option value="All">所有状态</option>
                                <option value="已通过">已通过</option>
                                <option value="处理中">处理中</option>
                                <option value="已驳回">已驳回</option>
                                <option value="草稿">草稿</option>
                             </select>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         {selectedSubmissions.length > 0 ? (
                           <>
                             <span className="text-xs font-bold text-primary">已选择 {selectedSubmissions.length} 项</span>
                             <button 
                                onClick={() => {
                                  if (confirm('确认批量删除选中的记录吗？此操作不可逆。')) {
                                    setSubmissions(prev => prev.filter(s => !selectedSubmissions.includes(s.id)));
                                    setSelectedSubmissions([]);
                                    showNotification('批量删除成功');
                                  }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error rounded-xl font-bold text-xs hover:bg-error/20 transition-all border border-error/20"
                             >
                                <Trash2 className="w-4 h-4" /> 批量删除
                             </button>
                           </>
                         ) : (
                           <div className="text-xs text-outline font-medium">选择多项可进行批量操作</div>
                         )}
                      </div>
                   </div>

                   {/* Table */}
                   <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-surface border-b border-outline-variant">
                               <th className="p-4 px-6 w-12">
                                  <input 
                                     type="checkbox" 
                                     className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                                     checked={selectedSubmissions.length === submissions.length && submissions.length > 0}
                                     onChange={(e) => {
                                        if (e.target.checked) setSelectedSubmissions(submissions.map(s => s.id));
                                        else setSelectedSubmissions([]);
                                     }}
                                  />
                               </th>
                               <th className="p-4 text-[10px] font-bold text-outline uppercase tracking-widest leading-none">提交 ID</th>
                               <th className="p-4 text-[10px] font-bold text-outline uppercase tracking-widest leading-none">提交人</th>
                               <th className="p-4 text-[10px] font-bold text-outline uppercase tracking-widest leading-none">
                                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                                    提交时间 <ArrowUpDown className="w-3 h-3" />
                                  </div>
                               </th>
                               <th className="p-4 text-[10px] font-bold text-outline uppercase tracking-widest leading-none">关键详情</th>
                               <th className="p-4 text-[10px] font-bold text-outline uppercase tracking-widest leading-none text-center">状态</th>
                               <th className="p-4 text-[10px] font-bold text-outline uppercase tracking-widest leading-none text-right">操作</th>
                            </tr>
                         </thead>
                         <tbody>
                            {submissions
                              .filter(s => 
                                (filterStatus === 'All' || s.status === filterStatus) &&
                                (s.submitter.includes(searchQuery) || s.id.includes(searchQuery))
                              )
                              .sort((a, b) => new Date(b.submitTime).getTime() - new Date(a.submitTime).getTime())
                              .map((sub, idx) => (
                               <tr key={sub.id} className="border-b border-outline-variant hover:bg-surface/50 transition-colors group">
                                  <td className="p-4 px-6">
                                     <input 
                                        type="checkbox" 
                                        className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                                        checked={selectedSubmissions.includes(sub.id)}
                                        onChange={(e) => {
                                           if (e.target.checked) setSelectedSubmissions([...selectedSubmissions, sub.id]);
                                           else setSelectedSubmissions(selectedSubmissions.filter(id => id !== sub.id));
                                        }}
                                     />
                                  </td>
                                  <td className="p-4">
                                     <span className="text-xs font-mono font-bold text-on-surface">{sub.id}</span>
                                  </td>
                                  <td className="p-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                          {sub.submitter.charAt(0)}
                                        </div>
                                        <span className="text-xs font-bold text-on-surface">{maskData(sub.submitter, 'name')}</span>
                                     </div>
                                  </td>
                                  <td className="p-4">
                                     <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" /> {sub.submitTime}
                                     </span>
                                  </td>
                                  <td className="p-4">
                                     <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold">金额: ¥{sub.data.amount?.toLocaleString()}</span>
                                        <span className="text-[10px] text-outline font-bold uppercase tracking-tighter">部门: {sub.data.dept}</span>
                                     </div>
                                  </td>
                                  <td className="p-4 text-center">
                                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                        sub.status === '已通过' ? 'bg-green-100 text-green-700' :
                                        sub.status === '已驳回' ? 'bg-red-100 text-red-700' :
                                        sub.status === '处理中' ? 'bg-blue-100 text-blue-700' :
                                        'bg-surface-container text-on-surface-variant'
                                     }`}>
                                        {sub.status}
                                     </span>
                                  </td>
                                  <td className="p-4 text-right">
                                     <div className="flex items-center justify-end gap-2">
                                        <button 
                                          onClick={() => setViewingSubmission(sub)}
                                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
                                          title="查看详情"
                                        >
                                           <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                          className="p-2 hover:bg-error/10 text-error rounded-lg transition-all"
                                          title="删除"
                                          onClick={() => {
                                            if (confirm('确认删除此条记录吗？')) {
                                              setSubmissions(prev => prev.filter(s => s.id !== sub.id));
                                              showNotification('记录已删除');
                                            }
                                          }}
                                        >
                                           <Trash2 className="w-4 h-4" />
                                        </button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                      {submissions.length === 0 && (
                         <div className="p-20 text-center">
                            <Database className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-outline">暂无提交数据</h4>
                            <p className="text-sm text-outline-variant">当前表单尚未产生任何实例记录</p>
                         </div>
                      )}
                      
                      <div className="p-4 px-6 bg-surface border-t border-outline-variant flex items-center justify-between">
                         <div className="text-[10px] font-bold text-outline uppercase">显示 1 到 {submissions.length} 条，共 {submissions.length} 条记录</div>
                         <div className="flex gap-2">
                            <button className="p-2 rounded-lg border border-outline-variant bg-white disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                            <button className="px-3 py-1 rounded-lg border border-primary bg-primary/5 text-xs font-bold text-primary">1</button>
                            <button className="p-2 rounded-lg border border-outline-variant bg-white disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {editorTab === 'preview' && (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full mb-6 flex justify-end">
                    <div className="bg-white border border-outline-variant p-1 rounded-2xl flex items-center shadow-md">
                      <button 
                        onClick={() => setPreviewDevice('pc')}
                        className={`p-3 rounded-xl transition-all ${
                          previewDevice === 'pc' ? 'bg-primary text-white shadow-lg' : 'text-outline hover:text-on-surface hover:bg-surface'
                        }`}
                        title="PC 预览"
                      >
                        <Monitor className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setPreviewDevice('app')}
                        className={`p-3 rounded-xl transition-all ${
                          previewDevice === 'app' ? 'bg-primary text-white shadow-lg' : 'text-outline hover:text-on-surface hover:bg-surface'
                        }`}
                        title="App 预览"
                      >
                        <Smartphone className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className={`transition-all duration-500 overflow-hidden ${previewDevice === 'pc' ? 'w-full' : 'w-[375px] h-[667px] ring-8 ring-on-surface rounded-[3rem] shadow-2xl relative'}`}>
                    {previewDevice === 'app' && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-on-surface rounded-b-2xl z-20"></div>
                    )}
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`sleek-card min-h-full bg-white border-2 border-outline-variant shadow-2xl overflow-y-auto ${previewDevice === 'app' ? 'p-6 pt-12 custom-scrollbar' : 'p-12'}`}
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h2 className={`${previewDevice === 'app' ? 'text-xl' : 'text-3xl'} font-extrabold tracking-tighter`}>
                            {selectedFormId ? savedForms.find(f => f.id === selectedFormId)?.name : '预览表单'}
                          </h2>
                          <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-1 opacity-60">设计遥测预览模式</p>
                        </div>
                        <div className={`p-2 bg-green-50 rounded-xl flex items-center gap-1.5 border border-green-100 ${previewDevice === 'app' ? 'hidden' : ''}`}>
                          <Activity className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-[9px] font-black tracking-[0.1em] text-green-600 uppercase">SYNCHRONIZED</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-6">
                        {formFields.map((field) => (
                          <div 
                            key={field.id} 
                            className="space-y-2 shrink-0 transition-all duration-300"
                            style={{
                              width: previewDevice === 'app' ? '100%' : (
                                     field.width === '1/2' ? 'calc((100% - 1rem) / 2)' : 
                                     field.width === '1/3' ? 'calc((100% - 2rem) / 3)' :
                                     field.width === '1/4' ? 'calc((100% - 3rem) / 4)' : '100%'
                              )
                            }}
                          >
                            <label className="text-[11px] font-black text-on-surface/80 uppercase tracking-wider block select-none">
                              {field.label} {field.required && <span className="text-error ml-0.5">*</span>}
                            </label>
                            {field.type === 'textarea' ? (
                              <textarea 
                                placeholder={field.placeholder} 
                                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px]"
                              />
                            ) : field.type === 'select' ? (
                              <div className="relative">
                                <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                                  {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                              </div>
                            ) : (
                              <input 
                                type={field.type} 
                                placeholder={field.placeholder} 
                                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                              />
                            )}
                          </div>
                        ))}
                        <div className="w-full p-6 bg-surface-container-high rounded-2xl border border-outline-variant mt-4">
                           <div className="flex items-center gap-2 mb-3">
                             <Workflow className="w-4 h-4 text-primary" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-primary">流程逻辑编排</span>
                           </div>
                           <div className="text-[10px] font-bold text-on-surface-variant flex flex-wrap gap-2">
                              {workflowNodes.map((n, i) => (
                                <span key={n.id} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-outline-variant/60">
                                  {n.label} {i < workflowNodes.length - 1 && <ChevronRight className="w-3 h-3 opacity-30" />}
                                </span>
                              ))}
                           </div>
                        </div>
                        <button className="w-full bg-on-surface text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:translate-y-[-2px] transition-all active:scale-[0.98]">
                          发起工作流申请
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </main>
          )}

        {/* Right Sidebar - Properties */}
        {(editorTab !== 'publish' && editorTab !== 'data' && editorTab !== 'simulate' && editorTab !== 'page' && editorTab !== 'preview') && (
          <aside className="w-80 bg-white border-l border-outline-variant flex flex-col shrink-0 text-on-surface select-none">
            <div className="p-6 border-b border-outline-variant flex items-center gap-2">
              <Settings className="w-4 h-4 text-outline" />
              <span className="font-bold tracking-tight text-sm">
                {editorTab === 'workflow' ? '节点配置' : '字段属性'}
              </span>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {(editorTab === 'workflow' && selectedNode) ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200 pb-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest block leading-none">核心配置</label>
                      <input 
                        type="text" 
                        placeholder="节点标题"
                        value={selectedNode.label}
                        onChange={(e) => updateWorkflowNode(selectedNode.id, { label: e.target.value })}
                        className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                      />
                      <textarea 
                        placeholder="操作描述..."
                        value={selectedNode.description}
                        onChange={(e) => updateWorkflowNode(selectedNode.id, { description: e.target.value })}
                        className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium min-h-[100px]"
                      />
                  </div>

                  {selectedNode.type === 'approval' && (
                    <div className="space-y-6 pt-6 border-t border-outline-variant animate-in zoom-in-95 duration-200">
                      {/* 1. 审批人设置 */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <Users className="w-4 h-4 text-primary" />
                           <label className="text-xs font-bold">审批人设置</label>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold text-outline uppercase tracking-widest">审批人</label>
                           <select 
                             value={selectedNode.config?.assigneeType || 'user'}
                             onChange={(e) => {
                               const newType = e.target.value as any;
                               updateWorkflowNode(selectedNode.id, { 
                                 config: { 
                                   ...selectedNode.config, 
                                   assigneeType: newType, 
                                   assigneeValue: '',
                                   approvalType: newType !== 'user' ? (selectedNode.config?.approvalType || 'OR') : undefined
                                 } 
                               });
                             }}
                             className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                           >
                             <option value="user">固定人员</option>
                             <option value="role">角色</option>
                             <option value="dept">部门负责人</option>
                           </select>
                        </div>

                        {/* 目标选择器 */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-outline uppercase tracking-widest">
                            {selectedNode.config?.assigneeType === 'user' ? '选择人员' : selectedNode.config?.assigneeType === 'role' ? '选择角色' : '选择部门'}
                          </label>
                          <select 
                            value={selectedNode.config?.assigneeValue || ''}
                            onChange={(e) => updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, assigneeValue: e.target.value } })}
                            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                          >
                            <option value="">请选择目标...</option>
                            {selectedNode.config?.assigneeType === 'user' && teamMembers.map(m => (
                              <option key={m.id} value={m.name}>{m.name}</option>
                            ))}
                            {selectedNode.config?.assigneeType === 'role' && allRoles.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                            {selectedNode.config?.assigneeType === 'dept' && allDepts.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        {/* 当审批人的选项值不是固定人员 (user) 时，显示另外一个配置 “审批方式” */}
                        {selectedNode.config?.assigneeType !== 'user' && (
                          <div className="space-y-2 pt-2 border-t border-dashed border-outline-variant/60">
                             <label className="text-[10px] font-bold text-outline uppercase tracking-widest block">审批方式</label>
                             <select
                               value={selectedNode.config?.approvalType || 'OR'}
                               onChange={(e) => updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, approvalType: e.target.value as any } })}
                               className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                             >
                               <option value="OR">或签（一名审批人同意即可）</option>
                               <option value="AND">会签（需所有审批人同意）</option>
                               <option value="SEQUENTIAL">依次审批（按所属上级逐级审批）</option>
                             </select>
                          </div>
                        )}
                      </div>

                      {/* 2. 审批动作设置 */}
                      <div className="space-y-4 pt-6 border-t border-outline-variant">
                        <div className="flex items-center gap-2 mb-2">
                           <MousePointer2 className="w-4 h-4 text-primary" />
                           <label className="text-xs font-bold">审批动作设置</label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           {[
                              { id: 'agree', label: '同意' },
                              { id: 'reject', label: '拒绝' },
                              { id: 'save', label: '保存' },
                              { id: 'transfer', label: '转交' },
                              { id: 'add_signer', label: '加签' },
                              { id: 'return', label: '退回' },
                              { id: 'retract', label: '收回' },
                           ].map(btn => (
                             <button
                                key={btn.id}
                                onClick={() => {
                                   const current = selectedNode.config?.buttons || ['agree', 'reject'];
                                   const next = current.includes(btn.id) ? current.filter(b => b !== btn.id) : [...current, btn.id];
                                   updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, buttons: next } });
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-[10px] font-bold transition-all ${selectedNode.config?.buttons?.includes(btn.id) || (!selectedNode.config?.buttons && ['agree', 'reject'].includes(btn.id)) ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-surface border-outline-variant text-outline'}`}
                             >
                                <span>{btn.label}</span>
                                {(selectedNode.config?.buttons?.includes(btn.id) || (!selectedNode.config?.buttons && ['agree', 'reject'].includes(btn.id))) && <Check className="w-3 h-3" />}
                             </button>
                           ))}
                        </div>
                      </div>

                      {/* 3. 字段权限设置 */}
                      <div className="space-y-4 pt-6 border-t border-outline-variant">
                        <div className="flex items-center gap-2 mb-2">
                           <ShieldCheck className="w-4 h-4 text-primary" />
                           <label className="text-xs font-bold">字段权限设置</label>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {formFields.map(field => {
                              const currentVal = selectedNode.config?.fieldPermissions?.[field.id] || 'editable';
                              return (
                                <div key={field.id} className="p-3 bg-surface border border-outline-variant rounded-xl space-y-2">
                                   <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-bold truncate max-w-[120px]">{field.label}</span>
                                      <div className="flex gap-1 p-0.5 bg-surface-container rounded-lg border border-outline-variant">
                                         {[
                                            { id: 'editable', label: '编辑' },
                                            { id: 'readonly', label: '只读' },
                                            { id: 'hidden', label: '隐藏' },
                                         ].map(perm => (
                                            <button
                                               key={perm.id}
                                               onClick={() => {
                                                  const next = { ...(selectedNode.config?.fieldPermissions || {}), [field.id]: perm.id as any };
                                                  updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, fieldPermissions: next } });
                                               }}
                                               className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition-all ${currentVal === perm.id ? 'bg-white shadow-sm text-primary' : 'text-outline hover:text-on-surface'}`}
                                            >
                                               {perm.label}
                                            </button>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                              );
                           })}
                        </div>
                      </div>

                      {/* 4. 高级设置 */}
                      <div className="space-y-4 pt-6 border-t border-outline-variant">
                        <div className="flex items-center gap-2 mb-2">
                           <Zap className="w-4 h-4 text-primary" />
                           <label className="text-xs font-bold">高级设置</label>
                        </div>
                        <div className="space-y-3">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest">审批人为空时</label>
                              <select 
                                 value={selectedNode.config?.advanced?.emptyAssigneeAction || 'pause'}
                                 onChange={(e) => updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, advanced: { ...selectedNode.config?.advanced, emptyAssigneeAction: e.target.value as any } } })}
                                 className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                              >
                                 <option value="pause">流程暂停</option>
                                 <option value="skip">自动跳过</option>
                                 <option value="transfer_member">转交给指定成员</option>
                                 <option value="transfer_admin">转交给管理员</option>
                              </select>
                           </div>

                           <div className="space-y-3">
                              <div className="flex justify-between items-center text-[10px] font-bold text-outline uppercase tracking-widest">审批超时设置</div>
                              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-[10px] font-bold text-primary flex items-center gap-2">
                                 <Info className="w-3.5 h-3.5" /> 超时后触发自定义规则校验
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedNode.type === 'condition' && (
                  <div className="space-y-6 pt-6 border-t border-outline-variant animate-in slide-in-from-bottom-2">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">评估表达式</label>
                        <div className="relative group">
                           <div className="absolute top-3 left-3 w-4 h-4 text-primary opacity-20"><Activity className="w-full h-full" /></div>
                           <textarea 
                              placeholder="例如：amount > 5000"
                              value={selectedNode.config?.expression || ''}
                              onChange={(e) => updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, expression: e.target.value } })}
                              className="w-full bg-on-surface text-green-400 font-mono text-[11px] p-4 pl-10 rounded-2xl min-h-[120px] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border border-outline-variant shadow-inner leading-relaxed"
                           />
                        </div>
                        <p className="text-[10px] text-outline font-medium">使用 JavaScript 语法进行数据对比。</p>
                     </div>
                  </div>
                )}
              </div>
            ) : (editorTab === 'design' && selectedField) ? (
              <div key={selectedField.id} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                {/* Property Tabs */}
                <div className="flex bg-surface-container rounded-xl p-1 border border-outline-variant">
                   <button 
                     onClick={() => setPropertyTab('props')}
                     className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${propertyTab === 'props' ? 'bg-white shadow text-primary font-extrabold' : 'text-outline hover:text-on-surface uppercase'}`}
                   >属性</button>
                   <button 
                     onClick={() => setPropertyTab('style')}
                     className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${propertyTab === 'style' ? 'bg-white shadow text-primary font-extrabold' : 'text-outline hover:text-on-surface uppercase'}`}
                   >样式</button>
                </div>

                <AnimatePresence mode="wait">
                  {propertyTab === 'props' ? (
                    <motion.div 
                      key="props"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6 pb-10"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">字段标题</label>
                        <input 
                          type="text" 
                          value={selectedField.label}
                          onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                          className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-outline uppercase tracking-widest">字段标识</label>
                          <input 
                            type="text" 
                            value={selectedField.code || ''}
                            onChange={(e) => updateField(selectedField.id, { code: e.target.value })}
                            placeholder="例如：customer_name"
                            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-outline uppercase tracking-widest">组件类型</label>
                          <input 
                            readOnly
                            type="text" 
                            value={selectedField.type}
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold text-outline"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-outline uppercase tracking-widest">字段 ID</label>
                          <input 
                            readOnly
                            type="text" 
                            value={selectedField.id}
                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-[10px] font-mono text-outline"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-outline uppercase tracking-widest">排序序号</label>
                          <input 
                            type="number" 
                            value={selectedField.sortOrder || ''}
                            onChange={(e) => updateField(selectedField.id, { sortOrder: parseInt(e.target.value) })}
                            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold"
                          />
                        </div>
                      </div>

                      {selectedField.placeholder !== undefined && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-outline uppercase tracking-widest">占位提示</label>
                          <input 
                            type="text" 
                            value={selectedField.placeholder}
                            onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">默认值</label>
                        <input 
                          type="text" 
                          value={selectedField.defaultValue || ''}
                          onChange={(e) => updateField(selectedField.id, { defaultValue: e.target.value })}
                          className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">表单设置</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant group hover:bg-white transition-all">
                            <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">是否必填</span>
                            <button 
                              onClick={() => updateField(selectedField.id, { required: !selectedField.required })}
                              className={`w-10 h-6 rounded-full relative transition-all ${selectedField.required ? 'bg-primary' : 'bg-outline-variant'}`}
                            >
                              <motion.div 
                                animate={{ left: selectedField.required ? '1.25rem' : '0.25rem' }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                              />
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant group hover:bg-white transition-all">
                            <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">是否只读</span>
                            <button 
                              onClick={() => updateField(selectedField.id, { readOnly: !selectedField.readOnly })}
                              className={`w-10 h-6 rounded-full relative transition-all ${selectedField.readOnly ? 'bg-primary' : 'bg-outline-variant'}`}
                            >
                              <motion.div 
                                animate={{ left: selectedField.readOnly ? '1.25rem' : '0.25rem' }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                              />
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant group hover:bg-white transition-all">
                            <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">是否隐藏</span>
                            <button 
                              onClick={() => updateField(selectedField.id, { hidden: !selectedField.hidden })}
                              className={`w-10 h-6 rounded-full relative transition-all ${selectedField.hidden ? 'bg-primary' : 'bg-outline-variant'}`}
                            >
                              <motion.div 
                                animate={{ left: selectedField.hidden ? '1.25rem' : '0.25rem' }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">帮助说明</label>
                        <textarea 
                          value={selectedField.description || ''}
                          onChange={(e) => updateField(selectedField.id, { description: e.target.value })}
                          placeholder="显示在组件下方的提示信息"
                          className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">校验规则 (Regex)</label>
                        <input 
                          type="text" 
                          value={selectedField.rules || ''}
                          onChange={(e) => updateField(selectedField.id, { rules: e.target.value })}
                          placeholder="例如：/^[a-z]+$/"
                          className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">显示终端</label>
                        <div className="flex gap-4">
                          {[
                            { id: 'pc', label: 'PC 端', icon: Monitor },
                            { id: 'mobile', label: '移动端', icon: Smartphone },
                          ].map(t => (
                            <button
                              key={t.id}
                              onClick={() => {
                                const current = selectedField.terminals || ['pc', 'mobile'];
                                const next = current.includes(t.id as any) ? current.filter(x => x !== t.id) : [...current, t.id as any];
                                updateField(selectedField.id, { terminals: next });
                              }}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-[10px] font-bold transition-all ${selectedField.terminals?.includes(t.id as any) ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-surface border-outline-variant text-outline'}`}
                            >
                              <t.icon className="w-3.5 h-3.5" />
                              <span>{t.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {['select', 'multiSelect', 'radio', 'checkbox'].includes(selectedField.type) && (
                        <div className="space-y-4 pt-4 border-t border-outline-variant">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">选项列表</label>
                            <button 
                              onClick={() => {
                                const newOpts = [...(selectedField.options || []), `选项 ${(selectedField.options?.length || 0) + 1}`];
                                updateField(selectedField.id, { options: newOpts });
                              }}
                              className="p-1 hover:bg-surface rounded-md text-primary"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {selectedField.options?.map((opt, idx) => (
                              <div key={idx} className="flex gap-2">
                                <input 
                                  value={opt}
                                  onChange={(e) => {
                                    const newOpts = [...(selectedField.options || [])];
                                    newOpts[idx] = e.target.value;
                                    updateField(selectedField.id, { options: newOpts });
                                  }}
                                  className="flex-1 bg-surface border border-outline-variant rounded-xl px-4 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                                <button 
                                  onClick={() => {
                                    const newOpts = (selectedField.options || []).filter((_, i) => i !== idx);
                                    updateField(selectedField.id, { options: newOpts });
                                  }}
                                  className="p-2 text-outline hover:text-error transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 pt-6 border-t border-outline-variant">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">计算公式</label>
                        <textarea 
                          value={selectedField.formula || ''}
                          onChange={(e) => updateField(selectedField.id, { formula: e.target.value })}
                          placeholder="例如：field_total = field_price * field_qty"
                          className="w-full bg-on-surface text-green-400 border border-outline-variant rounded-xl px-4 py-3 text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="style"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">布局宽度</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['1/1', '1/2', '1/3', '1/4'] as const).map((w) => (
                            <button
                              key={w}
                              onClick={() => updateField(selectedField.id, { width: w })}
                              className={`py-3 rounded-xl border text-[10px] font-extrabold transition-all ${selectedField.width === w ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/5' : 'border-outline-variant bg-surface hover:border-outline'}`}
                            >
                              {w} 宽度
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-outline font-medium leading-relaxed bg-surface p-3 rounded-xl border border-outline-variant border-dashed">
                          调整字段在画布中的占据比例。支持响应式布局自动适配。
                        </p>
                      </div>

                      <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant border-dashed">
                         <div className="text-[10px] font-bold text-on-surface-variant flex items-center gap-2 mb-2">
                            <Layers className="w-3 h-3" /> 高级样式库 (即将上线)
                         </div>
                         <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                            <div className="h-full bg-primary/20 w-1/3 animate-pulse"></div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/30 h-full">
                <div className="w-16 h-16 bg-white border border-outline-variant rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <MousePointer2 className="w-6 h-6 text-outline" />
                </div>
                <p className="text-sm text-on-surface-variant font-bold tracking-tight">
                  选择工具已激活
                </p>
                <p className="text-[10px] text-outline font-medium mt-1">
                  选择一个字段或工作流步骤进行配置。
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-outline-variant bg-surface-container-low/50 shrink-0">
             <button 
               onClick={() => setIsSchemaVisible(true)}
               className="w-full bg-on-surface text-white py-3 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
             >
               <Code className="w-3 h-3" /> 导出设计
             </button>
          </div>
        </aside>
      )}
    </div>

      <AnimatePresence>
        {viewingSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end bg-on-surface/40 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
            >
              <header className="p-6 border-b border-outline-variant flex items-center justify-between bg-white">
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setViewingSubmission(null)}
                      className="p-2 hover:bg-surface rounded-xl transition-all"
                    >
                      <X className="w-5 h-5 text-on-surface" />
                    </button>
                    <div>
                       <h3 className="text-lg font-bold tracking-tight">实例详情</h3>
                       <p className="text-[10px] font-mono font-bold text-outline uppercase">{viewingSubmission.id}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-bold hover:bg-surface-container transition-all">
                      打印归档
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all">
                      修订记录
                    </button>
                 </div>
              </header>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                 <section className="space-y-4">
                    <div className="text-[10px] font-bold text-outline uppercase tracking-widest border-b border-outline-variant pb-2">基本资料</div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <div className="text-[10px] font-bold text-on-surface-variant uppercase">提交人</div>
                          <div className="text-sm font-bold">{maskData(viewingSubmission.submitter, 'name')}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] font-bold text-on-surface-variant uppercase">提交时间</div>
                          <div className="text-sm font-bold">{viewingSubmission.submitTime}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] font-bold text-on-surface-variant uppercase">当前状态</div>
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                             viewingSubmission.status === '已通过' ? 'bg-green-100 text-green-700' :
                             viewingSubmission.status === '已驳回' ? 'bg-red-100 text-red-700' :
                             viewingSubmission.status === '处理中' ? 'bg-blue-100 text-blue-700' :
                             'bg-surface-container text-on-surface-variant'
                          }`}>
                             {viewingSubmission.status}
                          </span>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <div className="text-[10px] font-bold text-outline uppercase tracking-widest">业务字段快照</div>
                      <div className={`flex items-center gap-2 px-2 py-0.5 rounded ${isDataMasked ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline'}`}>
                        {isDataMasked ? <ShieldCheck className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span className="text-[8px] font-extrabold uppercase">{isDataMasked ? '已脱敏' : '明文展示'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 bg-surface/30 p-8 rounded-3xl border border-outline-variant">
                       {Object.entries(viewingSubmission.data).map(([key, val]) => (
                         <div key={key} className="space-y-1.5 p-3 rounded-xl hover:bg-white transition-all">
                            <div className="text-[10px] font-bold text-outline uppercase tracking-tighter">{key}</div>
                            <div className="text-xs font-extrabold text-on-surface">{maskData(val, key)}</div>
                         </div>
                       ))}
                    </div>
                 </section>

                 <section className="space-y-4">
                    <div className="text-[10px] font-bold text-outline uppercase tracking-widest border-b border-outline-variant pb-2">流转日志</div>
                    <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-outline-variant">
                       {viewingSubmission.approvalHistory.map((step, i) => (
                         <div key={i} className="flex gap-6 relative">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-white ${
                              step.action === '通过' ? 'bg-green-500' : 
                              step.action === '驳回' ? 'bg-error' : 
                              'bg-primary ring-4 ring-primary/10'
                            }`}>
                               {step.action === '通过' ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : 
                                step.action === '驳回' ? <X className="w-3.5 h-3.5 text-white" /> : 
                                <Clock className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start mb-1">
                                  <h5 className="text-xs font-extrabold tracking-tight">{step.step}</h5>
                                  <span className="text-[9px] font-bold text-outline tabular-nums">{step.time}</span>
                               </div>
                               <p className="text-[10px] font-medium text-on-surface-variant mb-3">
                                 操作人: <span className="text-on-surface font-bold">{step.actor}</span> • 结论: 
                                 <span className={`ml-1 font-extrabold ${step.action === '通过' ? 'text-green-600' : step.action === '驳回' ? 'text-error' : 'text-primary'}`}>
                                   {step.action}
                                 </span>
                               </p>
                               <div className="p-4 bg-surface rounded-2xl border border-outline-variant text-[10px] font-medium text-on-surface-variant italic leading-relaxed border-l-4 border-l-primary/20">
                                 "{step.action === '通过' ? '经核实，各项业务指标均符合本阶段审批要求，予以流转至下一环节。' : step.action === '驳回' ? '提交的信息不符合规范，请核对后再试。' : '流程自动执行中，系统正在执行校验逻辑...'}"
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
              </div>
              
              <footer className="p-6 border-t border-outline-variant bg-surface flex justify-end gap-3">
                 <button 
                   onClick={() => setViewingSubmission(null)}
                   className="px-8 py-3 bg-on-surface text-white rounded-xl text-xs font-bold hover:shadow-2xl transition-all active:scale-95"
                  >
                    完成关闭
                  </button>
               </footer>
            </motion.div>
          </div>
        )}
        {isSchemaVisible && <JsonSchemaModal setIsSchemaVisible={setIsSchemaVisible} formFields={formFields} showNotification={showNotification} />}
        <GlobalSettingsModal 
          isOpen={isGlobalSettingsOpen} 
          onClose={() => setIsGlobalSettingsOpen(false)} 
          activeTab={globalSettingsTab}
          setActiveTab={setGlobalSettingsTab}
          config={workflowGlobalConfig}
          setConfig={setWorkflowGlobalConfig}
          formFields={formFields}
          showNotification={showNotification}
        />

        {/* 1. 新增版本 Modal */}
        {isNewVersionModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsNewVersionModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-outline-variant space-y-6"
            >
              <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <GitBranch className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-on-surface">新增流程版本</h3>
                    <p className="text-xs text-on-surface-variant">基于当前编辑的审批流节点，生成自增版本记录</p>
                  </div>
                </div>
                <button onClick={() => setIsNewVersionModalOpen(false)} className="p-2 hover:bg-surface-container rounded-xl text-outline">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-container/60 p-4 rounded-2xl border border-outline-variant flex items-center justify-between">
                  <span className="text-xs font-bold text-outline">预计生成版本号:</span>
                  {(() => {
                    const list = (selectedFormId && workflowVersionsMap[selectedFormId]) || [];
                    const lastVer = list.length > 0 ? list[list.length - 1] : null;
                    const lastNum = lastVer ? lastVer.versionNum : 1.0;
                    const nextNum = newVersionType === 'major' ? Math.floor(lastNum) + 1.0 : parseFloat((lastNum + 0.1).toFixed(1));
                    return (
                      <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        v{nextNum.toFixed(1)}.0
                      </span>
                    );
                  })()}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface">版本类型</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewVersionType('minor')}
                      className={`p-3 rounded-2xl border text-left transition-all ${newVersionType === 'minor' ? 'bg-primary/5 border-primary text-primary shadow-sm font-bold' : 'bg-surface border-outline-variant text-outline'}`}
                    >
                      <div className="text-xs font-bold">次要升级 (+0.1)</div>
                      <div className="text-[10px] opacity-70 mt-0.5">微调规则、节点文案或审批人</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVersionType('major')}
                      className={`p-3 rounded-2xl border text-left transition-all ${newVersionType === 'major' ? 'bg-primary/5 border-primary text-primary shadow-sm font-bold' : 'bg-surface border-outline-variant text-outline'}`}
                    >
                      <div className="text-xs font-black">重大版本 (+1.0)</div>
                      <div className="text-[10px] opacity-70 mt-0.5">重构整个流程流转链路</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface">版本主题名称</label>
                  <input 
                    type="text" 
                    placeholder="例如：优化多级会签与撤回策略"
                    value={newVersionTitle}
                    onChange={(e) => setNewVersionTitle(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface">版本更新说明 (Changelog)</label>
                  <textarea 
                    placeholder="详细描述本次流程修改的内容与背景..."
                    value={newVersionDesc}
                    onChange={(e) => setNewVersionDesc(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[90px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
                <button
                  onClick={() => setIsNewVersionModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold hover:bg-surface-container transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (!selectedFormId) return;
                    const list = workflowVersionsMap[selectedFormId] || [];
                    const lastVer = list.length > 0 ? list[list.length - 1] : null;
                    const lastNum = lastVer ? lastVer.versionNum : 1.0;
                    const nextNum = newVersionType === 'major' ? Math.floor(lastNum) + 1.0 : parseFloat((lastNum + 0.1).toFixed(1));
                    const newVerStr = `v${nextNum.toFixed(1)}.0`;

                    const newVerObj: WorkflowVersion = {
                      id: `ver-${selectedFormId}-${Date.now()}`,
                      formId: selectedFormId,
                      version: newVerStr,
                      versionNum: nextNum,
                      title: newVersionTitle.trim() || `流程改进版 ${newVerStr}`,
                      description: newVersionDesc.trim() || '更新审批流节点与规则策略',
                      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
                      creator: '当前管理员',
                      status: 'active',
                      nodes: JSON.parse(JSON.stringify(workflowNodes))
                    };

                    const updatedList = list.map(v => ({ ...v, status: 'archived' as const }));
                    updatedList.push(newVerObj);

                    setWorkflowVersionsMap(prev => ({ ...prev, [selectedFormId]: updatedList }));
                    setIsNewVersionModalOpen(false);
                    setNewVersionTitle('');
                    setNewVersionDesc('');
                    showNotification(`已发布新流程版本 ${newVerStr}！`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-md transition-all active:scale-95"
                >
                  保存并生成新版本
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 2. 查看历史 Modal */}
        {isVersionHistoryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setIsVersionHistoryModalOpen(false); setPreviewVersionDetail(null); }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-outline-variant"
            >
              <div className="flex items-center justify-between border-b border-outline-variant pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-on-surface">审批流版本历史</h3>
                    <p className="text-xs text-on-surface-variant">查看历次发布的版本记录、细节以及执行版本回滚</p>
                  </div>
                </div>
                <button onClick={() => { setIsVersionHistoryModalOpen(false); setPreviewVersionDetail(null); }} className="p-2 hover:bg-surface-container rounded-xl text-outline">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
                {(() => {
                  const versions = (selectedFormId && workflowVersionsMap[selectedFormId]) || [];
                  if (versions.length === 0) {
                    return (
                      <div className="text-center py-12 text-outline text-xs">
                        暂无版本历史记录
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {[...versions].reverse().map((ver) => {
                        const isSelectedForPreview = previewVersionDetail?.id === ver.id;
                        return (
                          <div 
                            key={ver.id}
                            className={`p-5 rounded-2xl border transition-all ${ver.status === 'active' ? 'bg-primary/5 border-primary/40 shadow-sm' : 'bg-surface border-outline-variant hover:border-outline'}`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-black bg-white text-primary border border-primary/20 px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                  <GitBranch className="w-3.5 h-3.5" />
                                  {ver.version}
                                </span>
                                <h4 className="text-sm font-extrabold text-on-surface">{ver.title}</h4>
                                {ver.status === 'active' && (
                                  <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                                    运行中 (Active)
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setPreviewVersionDetail(isSelectedForPreview ? null : ver)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${isSelectedForPreview ? 'bg-primary text-white border-primary' : 'bg-white border-outline-variant text-on-surface hover:border-primary'}`}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{isSelectedForPreview ? '收起详情' : '查看详情'}</span>
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm(`确定要将审批流回滚到 ${ver.version}（${ver.title}）吗？这将会以此版本的节点配置作为基准生成一个新的版本。`)) {
                                      const restoredNodes = JSON.parse(JSON.stringify(ver.nodes));
                                      setWorkflowNodes(restoredNodes);
                                      if (selectedFormId) {
                                        setWorkflowNodesMap(prev => ({ ...prev, [selectedFormId]: restoredNodes }));
                                      }

                                      const lastNum = versions.length > 0 ? versions[versions.length - 1].versionNum : 1.0;
                                      const nextNum = parseFloat((lastNum + 0.1).toFixed(1));
                                      const newVerStr = `v${nextNum.toFixed(1)}.0`;

                                      const rollbackVerObj: WorkflowVersion = {
                                        id: `ver-${selectedFormId}-${Date.now()}`,
                                        formId: selectedFormId || 'f1',
                                        version: newVerStr,
                                        versionNum: nextNum,
                                        title: `回滚自 ${ver.version}`,
                                        description: `基于历史版本 ${ver.version} (${ver.title}) 恢复执行的回滚操作`,
                                        createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
                                        creator: '当前管理员',
                                        status: 'active',
                                        nodes: restoredNodes
                                      };

                                      const updatedList = versions.map(v => ({ ...v, status: 'archived' as const }));
                                      updatedList.push(rollbackVerObj);

                                      if (selectedFormId) {
                                        setWorkflowVersionsMap(prev => ({ ...prev, [selectedFormId]: updatedList }));
                                      }
                                      showNotification(`已成功回滚至 ${ver.version} 并发布新版本 ${newVerStr}！`);
                                      setIsVersionHistoryModalOpen(false);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-surface text-on-surface hover:bg-amber-50 hover:text-amber-700 border border-outline-variant rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>回滚此版本</span>
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-on-surface-variant font-medium mb-3">
                              {ver.description}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-outline pt-3 border-t border-outline-variant/60">
                              <span>创建时间: {ver.createdAt} • 操作人: {ver.creator}</span>
                              <span className="font-bold text-on-surface">包含 {ver.nodes.length} 个流转节点</span>
                            </div>

                            {isSelectedForPreview && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 pt-4 border-t border-dashed border-outline-variant space-y-3 bg-white/60 p-4 rounded-xl"
                              >
                                <h5 className="text-xs font-bold text-primary flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>节点流转明细 (Version Snapshot)</span>
                                </h5>
                                <div className="space-y-2">
                                  {ver.nodes.map((n, idx) => (
                                    <div key={n.id} className="flex items-center justify-between bg-surface p-2.5 rounded-lg border border-outline-variant/60 text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center">
                                          {idx + 1}
                                        </span>
                                        <span className="font-bold">{n.label}</span>
                                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-surface-container font-mono text-outline">
                                          {n.type}
                                        </span>
                                      </div>

                                      {n.type === 'approval' && (
                                        <div className="text-[10px] text-outline font-medium flex items-center gap-2">
                                          <span>
                                            审批人: {
                                              n.config?.assigneeType === 'user' ? `固定人员 (${n.config?.assigneeValue || '未选'})` :
                                              n.config?.assigneeType === 'role' ? `角色 (${n.config?.assigneeValue || '未选'})` :
                                              n.config?.assigneeType === 'dept' ? `部门负责人 (${n.config?.assigneeValue || '未选'})` : '未配置'
                                            }
                                          </span>
                                          {n.config?.assigneeType !== 'user' && (
                                            <span className="bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">
                                              {n.config?.approvalType === 'AND' ? '会签' : n.config?.approvalType === 'SEQUENTIAL' ? '依次审批' : '或签'}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-end pt-4 border-t border-outline-variant shrink-0">
                <button
                  onClick={() => { setIsVersionHistoryModalOpen(false); setPreviewVersionDetail(null); }}
                  className="px-6 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-outline-variant/30 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 3. 版本对比 Modal */}
        {isVersionDiffModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsVersionDiffModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-outline-variant"
            >
              <div className="flex items-center justify-between border-b border-outline-variant pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
                    <GitCompare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-on-surface">流程版本差异对比 (Diff)</h3>
                    <p className="text-xs text-on-surface-variant">选择两个版本的审批流，可视化直观对比节点与属性增删改动</p>
                  </div>
                </div>
                <button onClick={() => setIsVersionDiffModalOpen(false)} className="p-2 hover:bg-surface-container rounded-xl text-outline">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-outline-variant/60 shrink-0">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-outline">基准版本 A</label>
                  <select 
                    value={diffVersionIdA}
                    onChange={(e) => setDiffVersionIdA(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {((selectedFormId && workflowVersionsMap[selectedFormId]) || []).map(v => (
                      <option key={v.id} value={v.id}>{v.version} - {v.title} ({v.createdAt})</option>
                    ))}
                    <option value="current">当前工作区草稿</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-outline">对比目标版本 B</label>
                  <select 
                    value={diffVersionIdB}
                    onChange={(e) => setDiffVersionIdB(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="current">当前工作区草稿</option>
                    {((selectedFormId && workflowVersionsMap[selectedFormId]) || []).map(v => (
                      <option key={v.id} value={v.id}>{v.version} - {v.title} ({v.createdAt})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1">
                {(() => {
                  const versions = (selectedFormId && workflowVersionsMap[selectedFormId]) || [];
                  
                  const getVerNodes = (id: string) => {
                    if (id === 'current') return { label: '当前工作区草稿', nodes: workflowNodes };
                    const found = versions.find(v => v.id === id);
                    return found ? { label: `${found.version} (${found.title})`, nodes: found.nodes } : { label: '未知', nodes: [] };
                  };

                  const verAData = getVerNodes(diffVersionIdA);
                  const verBData = getVerNodes(diffVersionIdB);

                  const nodesA = verAData.nodes || [];
                  const nodesB = verBData.nodes || [];

                  const mapA = new Map<string, WorkflowNode>(nodesA.map(n => [n.id, n]));
                  const mapB = new Map<string, WorkflowNode>(nodesB.map(n => [n.id, n]));

                  const added: WorkflowNode[] = [];
                  const removed: WorkflowNode[] = [];
                  const modified: { nodeA: WorkflowNode; nodeB: WorkflowNode; diffs: string[] }[] = [];
                  const unchanged: WorkflowNode[] = [];

                  mapB.forEach((nodeB, id) => {
                    if (!mapA.has(id)) {
                      added.push(nodeB);
                    } else {
                      const nodeA = mapA.get(id)!;
                      const diffs: string[] = [];
                      if (nodeA.label !== nodeB.label) diffs.push(`节点名称: "${nodeA.label}" ➔ "${nodeB.label}"`);
                      if (nodeA.type !== nodeB.type) diffs.push(`节点类型: "${nodeA.type}" ➔ "${nodeB.type}"`);
                      if (nodeA.config?.assigneeType !== nodeB.config?.assigneeType) {
                        const typeMap: Record<string, string> = { user: '固定人员', role: '角色', dept: '部门负责人' };
                        diffs.push(`审批人: "${typeMap[nodeA.config?.assigneeType || ''] || '未指定'}" ➔ "${typeMap[nodeB.config?.assigneeType || ''] || '未指定'}"`);
                      }
                      if (nodeA.config?.assigneeValue !== nodeB.config?.assigneeValue) {
                        diffs.push(`目标对象: "${nodeA.config?.assigneeValue || '未选'}" ➔ "${nodeB.config?.assigneeValue || '未选'}"`);
                      }
                      if (nodeA.config?.approvalType !== nodeB.config?.approvalType) {
                        const appMap: Record<string, string> = { OR: '或签', AND: '会签', SEQUENTIAL: '依次审批' };
                        diffs.push(`审批方式: "${appMap[nodeA.config?.approvalType || ''] || '默认'}" ➔ "${appMap[nodeB.config?.approvalType || ''] || '默认'}"`);
                      }

                      if (diffs.length > 0) {
                        modified.push({ nodeA, nodeB, diffs });
                      } else {
                        unchanged.push(nodeB);
                      }
                    }
                  });

                  mapA.forEach((nodeA, id) => {
                    if (!mapB.has(id)) {
                      removed.push(nodeA);
                    }
                  });

                  const totalChanges = added.length + removed.length + modified.length;

                  return (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-container rounded-2xl border border-outline-variant">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-on-surface">对比结果摘要:</span>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            +{added.length} 新增节点
                          </span>
                          <span className="text-xs font-black text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                            -{removed.length} 删除节点
                          </span>
                          <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                            ~{modified.length} 变动节点
                          </span>
                        </div>
                        <span className="text-xs text-outline font-medium">
                          {totalChanges === 0 ? '两个版本配置完全一致' : `共检测到 ${totalChanges} 处结构或配置差异`}
                        </span>
                      </div>

                      {totalChanges === 0 ? (
                        <div className="text-center py-12 bg-surface/50 rounded-2xl border border-dashed border-outline-variant text-outline text-xs">
                          ✅ 选中版本的审批流节点与属性配置一致，无差异变动。
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {added.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5">
                                <Plus className="w-4 h-4" />
                                <span>新增节点 (Added in B)</span>
                              </h4>
                              <div className="space-y-2">
                                {added.map(n => (
                                  <div key={n.id} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-emerald-900">{n.label}</span>
                                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded uppercase font-mono">
                                        {n.type}
                                      </span>
                                    </div>
                                    <span className="text-emerald-700 font-medium text-[11px]">
                                      {n.description || '新新增的流程流转节点'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {removed.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-extrabold text-rose-700 flex items-center gap-1.5">
                                <Trash2 className="w-4 h-4" />
                                <span>删除节点 (Removed from A)</span>
                              </h4>
                              <div className="space-y-2">
                                {removed.map(n => (
                                  <div key={n.id} className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-rose-900 line-through">{n.label}</span>
                                      <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded uppercase font-mono">
                                        {n.type}
                                      </span>
                                    </div>
                                    <span className="text-rose-700 font-medium text-[11px]">
                                      已在此版本中移除
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {modified.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                                <GitCompare className="w-4 h-4" />
                                <span>属性修改节点 (Modified Configurations)</span>
                              </h4>
                              <div className="space-y-3">
                                {modified.map(({ nodeB, diffs }) => (
                                  <div key={nodeB.id} className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-extrabold text-amber-950">{nodeB.label}</span>
                                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase font-mono">
                                        ID: {nodeB.id}
                                      </span>
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                      {diffs.map((d, idx) => (
                                        <div key={idx} className="text-xs bg-white/80 p-2 rounded-lg border border-amber-200/80 font-medium text-amber-900 flex items-center gap-2">
                                          <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                          <span>{d}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {unchanged.length > 0 && (
                            <div className="pt-2 text-[11px] text-outline font-medium">
                              包含 {unchanged.length} 个保持一致未修改的节点 ({unchanged.map(u => u.label).join(', ')})
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-end pt-4 border-t border-outline-variant shrink-0">
                <button
                  onClick={() => setIsVersionDiffModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-outline-variant/30 transition-colors"
                >
                  关闭对比
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    );
  }

  if (view === 'appCenter') {
    return (
      <WorkspaceLayout 
        viewToken="appCenter" 
        title="工作台" 
        subtitle="浏览并启动您已发布的日常工作应用"
        currentView={view} 
        setView={setView} 
        showNotification={showNotification} 
        notifications={notifications}
      >
        <AppCenterView />
      </WorkspaceLayout>
    );
  }

  if (view === 'projects') {
    const selectedProject = projects.find(p => p.id === projectDetailsId);
    return (
      <ConsoleLayout 
        viewToken="projects" 
        title={selectedProject ? selectedProject.name : "应用管理"} 
        subtitle={selectedProject ? `ID: ${selectedProject.id.slice(0, 8)}` : ""}
        notifications={notifications}
        currentView={view}
        setView={setView}
        showNotification={showNotification}
        hideHeader={!!projectDetailsId}
      >
      <ProjectsView 
        projects={projects}
        setProjects={setProjects}
        projectDetailsId={projectDetailsId}
        savedForms={savedForms}
        isProjectModalOpen={isProjectModalOpen}
        projectToEdit={projectToEdit}
        newProjectName={newProjectName}
        tempProjectName={tempProjectName}
        editingProjectTitle={editingProjectTitle}
        setProjectDetailsId={setProjectDetailsId}
        setIsProjectModalOpen={setIsProjectModalOpen}
        setProjectToEdit={setProjectToEdit}
        setNewProjectName={setNewProjectName}
        setTempProjectName={setTempProjectName}
        setEditingProjectTitle={setEditingProjectTitle}
        createOrUpdateProject={createOrUpdateProject}
        setConfirmModal={setConfirmModal}
        deleteProject={deleteProject}
        deleteForm={deleteForm}
        updateProjectName={updateProjectName}
        setSelectedProjectId={setSelectedProjectId}
        openEditor={openEditor}
        confirmModal={confirmModal}
        showNotification={showNotification}
        setView={setView}
        formFieldsMap={formFieldsMap}
        setFormFieldsMap={setFormFieldsMap}
      />
      <ConfirmDialog confirmModal={confirmModal} setConfirmModal={setConfirmModal} />
    </ConsoleLayout>
    );
  }
  if (view === 'dataManagement') {
    return (
      <ConsoleLayout 
        viewToken="dataManagement" 
        title="数据管理" 
        subtitle="集中检索、管理和填报所有应用与表单底表数据" 
        currentView={view} 
        setView={setView} 
        showNotification={showNotification} 
        notifications={notifications}
      >
        <DataManagementView 
          projects={projects} 
          savedForms={savedForms} 
          showNotification={showNotification} 
        />
      </ConsoleLayout>
    );
  }
  if (view === 'insights') {
    return (
      <ConsoleLayout viewToken="insights" title="数据洞察" subtitle="" currentView={view} setView={setView} showNotification={showNotification} notifications={notifications}>
        <InsightsView showNotification={showNotification} workflowStatus={workflowStatus} setWorkflowStatus={setWorkflowStatus} workflowInstances={workflowInstances} setView={setView} />
      </ConsoleLayout>
    );
  }
  if (view === 'integrations') {
    return (
      <ConsoleLayout viewToken="integrations" title="系统设置" subtitle="" currentView={view} setView={setView} showNotification={showNotification} notifications={notifications}>
        <IntegrationsView showNotification={showNotification} setView={setView} />
      </ConsoleLayout>
    );
  }
  if (view === 'team') return (
    <ConsoleLayout 
      viewToken="team" 
      title="组织人员" 
      subtitle="" 
      currentView={view} 
      setView={setView} 
      showNotification={showNotification} 
      notifications={notifications}
    >
      <TeamView 
        teamMembers={teamMembers} 
        orgData={orgData}
        onAddMember={onAddMember}
        onUpdateMember={onUpdateMember}
        onDeleteMember={onDeleteMember}
        onAddDept={onAddDept}
        onUpdateDept={onUpdateDept}
        onDeleteDept={onDeleteDept}
        showNotification={showNotification}
      />
    </ConsoleLayout>
  );

  if (view === 'dashboard') {
    const appsCount = projects.length;
    const normalFormsCount = savedForms.filter(f => f.type === 'normal').length;
    const workflowFormsCount = savedForms.filter(f => f.type === 'workflow').length;
    const reportsFormsCount = savedForms.filter(f => f.type === 'report').length;

    return (
      <ConsoleLayout 
        viewToken="dashboard" 
        title="仪表盘" 
        subtitle=""
        currentView={view}
        setView={setView}
        showNotification={showNotification}
        notifications={notifications}
      >
        <div className="w-full p-8 md:p-10 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: '应用数', value: appsCount, trend: '↑', color: 'text-primary' },
              { label: '普通表单数', value: normalFormsCount, trend: '↑', color: 'text-secondary' },
              { label: '流程表单数', value: workflowFormsCount, trend: '↑', color: 'text-green-500' },
              { label: '报表数', value: reportsFormsCount, trend: '↑', color: 'text-amber-500' },
            ].map((stat) => (
              <div key={stat.label} className="sleek-card p-6 flex flex-col gap-2 group transition-transform hover:-translate-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tighter">{stat.value}</span>
                  <span className={`text-[10px] font-bold ${stat.color}`}>{stat.trend}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant flex items-center justify-between">
                  <span className="text-[10px] font-medium text-outline">实时统计</span>
                  <Activity className={`w-4 h-4 ${stat.color} opacity-20`} />
                </div>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] 2xl:grid-cols-[1fr_420px] gap-8">
            {/* Main Chart Card */}
            <div className="sleek-card p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">表单提交速率</h3>
                <div className="flex bg-surface rounded-lg p-1 gap-1 border border-outline-variant">
                  {['1H', '1D', '1W', '1M'].map((t) => (
                    <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${t === '1W' ? 'bg-white shadow-sm text-primary shadow-lg shadow-primary/5' : 'text-outline hover:text-on-surface'}`}>
                      {t === '1H' ? '1小时' : t === '1D' ? '1天' : t === '1W' ? '1周' : '1月'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-64 flex items-end gap-2 px-4 pt-8 text-on-surface">
                {[40, 60, 45, 80, 55, 70, 90, 65, 85, 50, 75, 95].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className={`flex-1 rounded-t-lg transition-all ${h > 80 ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'}`}
                  >
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-between px-2 text-[10px] font-bold text-outline uppercase tracking-widest">
                <span>周一</span>
                <span>周二</span>
                <span>周三</span>
                <span>周四</span>
                <span>周五</span>
                <span>周六</span>
                <span>周日</span>
              </div>
            </div>

            {/* Activity List */}
            <div className="sleek-card p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-on-surface">实时动态</h3>
                <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div className="space-y-6">
                {[
                  { user: '陈', action: '合并了 入职架构_v2', time: '2小时前', status: '成功' },
                  { user: '莎拉', action: '新增了 3 个校验位', time: '4小时前', status: '待处理' },
                  { user: 'Heidi', action: '导出了 遥测审计数据', time: '6小时前', status: '成功' },
                  { user: '系统', action: '应用自动扩缩: node_04', time: '12小时前', status: '运行中' },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer hover:bg-surface/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                    <div className="relative">
                      <img 
                        src={`https://picsum.photos/seed/user${i}/100/100`} 
                        className="w-8 h-8 rounded-full border border-outline-variant group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                        referrerPolicy="no-referrer"
                        alt="头像"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${activity.status === '成功' ? 'bg-green-500' : 'bg-primary'}`}></div>
                    </div>
                    <div className="flex-1 text-on-surface">
                      <p className="text-xs">
                        <span className="font-bold tracking-tight">{activity.user}</span>
                        <span className="text-on-surface-variant ml-1 font-medium">{activity.action}</span>
                      </p>
                      <span className="text-[10px] text-outline font-bold uppercase tracking-wider">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => showNotification('审计日志已初始化')}
                className="mt-2 w-full py-3 rounded-xl border border-outline-variant text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low transition-all"
              >
                查看完整审计日志
              </button>
            </div>
          </div>
        </div>
      </ConsoleLayout>
    );
  }

  return (
    <div className="min-h-screen selection:bg-primary-container selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 sleek-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutGrid className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tighter">自定义表单</span>
            </div>
            
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-on-surface-variant">
              <a href="#" className="hover:text-primary transition-colors">资源中心</a>
              <a href="#" className="hover:text-primary transition-colors">企业方案</a>
              <a href="#" className="hover:text-primary transition-colors">价格</a>
              <button 
                onClick={() => setView('appCenter')}
                className="bg-white text-on-surface border border-outline-variant px-5 py-2 rounded-lg font-semibold hover:bg-surface-container-low transition-all active:scale-95 shadow-sm"
              >
                进入工作台
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/20 animate-in fade-in zoom-in-95 duration-300"
              >
                进入控制台
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute w-full bg-white border-b border-outline-variant z-40 p-4 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <a href="#" className="text-lg font-medium">资源中心</a>
              <a href="#" className="text-lg font-medium">企业方案</a>
              <a href="#" className="text-lg font-medium">价格</a>
              <button 
                onClick={() => setView('appCenter')}
                className="w-full bg-white text-on-surface border border-outline-variant p-3 rounded-md font-semibold"
              >
                进入工作台
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className="w-full bg-primary text-white p-3 rounded-md font-semibold"
              >
                进入控制台
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 sleek-gradient-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-primary border border-outline-variant text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                上新：工作流自动化引擎
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.05] tracking-tighter mb-8">
                构建支撑 <br />
                <span className="text-secondary">基础设施的表单。</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-on-surface-variant mb-10 leading-relaxed">
                自定义表单是面向复杂工作流、海量数据采集和深度基础设施集成的企业级表单构建器。
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => setView('appCenter')}
                  className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
                >
                  免费开始构建
                </button>
                <button className="bg-white text-on-surface border border-outline-variant px-8 py-4 rounded-xl text-lg font-bold hover:bg-surface-container-low transition-all">
                  预约演示
                </button>
              </div>
            </motion.div>

            {/* Immersive Preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 relative mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-outline-variant aspect-[16/9] cursor-pointer group"
              onClick={() => setView('appCenter')}
            >
              <img 
                src="https://picsum.photos/seed/architect-editor/1600/900" 
                alt="Architect editor interface preview" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/95 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2">
                  启动实时预览 <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              
              {/* UI Overlay Accents */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-white/95 backdrop-blur shadow-sm p-2 rounded-lg border border-outline-variant">
                  <MousePointer2 className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-white/95 backdrop-blur shadow-sm p-2 rounded-lg border border-outline-variant">
                  <Workflow className="w-4 h-4 text-primary" />
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="sleek-glass p-6 rounded-2xl shadow-2xl max-w-sm text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FormInput className="w-5 h-5 text-primary" />
                    </div>
                    <div className="font-bold">架构校验</div>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium">
                    基于实时 JSON Schema 生成，可在整个技术栈中实现自动化的类型验证。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 bg-white border-y border-outline-variant">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">架构基石</h2>
              <p className="text-on-surface-variant text-lg">专为追求精准和可靠性的团队打造。</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="sleek-card p-8 group cursor-default">
                <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">企业级安全</h3>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed font-medium">
                  符合 SOC2 Type II 标准，提供端到端加密和细粒度的访问控制。
                </p>
                <div className="rounded-xl overflow-hidden h-32 border border-outline-variant">
                  <img 
                    src="https://picsum.photos/seed/security/800/400" 
                    alt="Security detail" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="sleek-card p-8 group cursor-default">
                <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">无限集成能力</h3>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed font-medium">
                  无需编写自定义代码，即可连接到 SQL、NoSQL 以及内部 REST/GraphQL API。
                </p>
                <div className="rounded-xl overflow-hidden h-32 border border-outline-variant">
                  <img 
                    src="https://picsum.photos/seed/database/800/400" 
                    alt="Database integration" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="sleek-card p-8 group cursor-default">
                <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">大规模逻辑处理</h3>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed font-medium">
                  即便拥有数千个字段，动态条件逻辑也能瞬间响应。
                </p>
                <div className="rounded-xl overflow-hidden h-32 border border-outline-variant">
                  <img 
                    src="https://picsum.photos/seed/speed/800/400" 
                    alt="Performance graph" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="py-24 bg-surface pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sleek-card p-12 md:p-16 relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold mb-6">
                    <Layers className="w-5 h-5" />
                    案例研究：TELCO GLOBAL
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight tracking-tight">
                    在 12 个国家/地区减少了 74% 的入职摩擦。
                  </h2>
                  <p className="text-on-surface-variant text-lg mb-10 font-medium">
                    "自定义表单让我们可以统一全球入职流程，同时通过动态数据路由维持严格的当地法规合规性。"
                  </p>
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://picsum.photos/seed/user1/100/100" 
                      className="w-12 h-12 rounded-full border-2 border-primary" 
                      referrerPolicy="no-referrer"
                      alt="Avatar"
                    />
                    <div>
                      <div className="font-bold">Heidi Vance</div>
                      <div className="text-sm text-on-surface-variant font-medium">首席战略官</div>
                    </div>
                  </div>
                </div>
                <div className="relative px-4">
                  <div className="bg-surface p-8 rounded-2xl border border-outline-variant transform -rotate-1 shadow-inner">
                    <div className="space-y-4">
                      {['用户验证', 'API 响应', '逻辑触发', '安全握手'].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 bg-white rounded-lg border border-outline-variant shadow-sm">
                          <span className="text-sm font-semibold">{item}</span>
                          <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold">已就绪</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="py-24 sleek-gradient-bg border-t border-outline-variant">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight">在几分钟内构建您的第一个表单。</h2>
            <p className="text-on-surface-variant text-lg mb-10 font-medium">无需承诺，无需填写信用卡信息。</p>
            <button className="bg-primary text-white flex items-center gap-2 px-10 py-5 rounded-xl text-xl font-bold mx-auto hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1">
              免费开始使用 <ChevronRight className="w-5 h-5" />
            </button>
            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-12 text-sm text-on-surface-variant">
              <div className="space-y-4">
                <div className="font-bold text-on-surface uppercase tracking-widest text-xs">产品</div>
                <a href="#" className="block hover:text-primary">功能</a>
                <a href="#" className="block hover:text-primary">集成</a>
                <a href="#" className="block hover:text-primary">企业版</a>
              </div>
              <div className="space-y-4">
                <div className="font-bold text-on-surface uppercase tracking-widest text-xs">平台</div>
                <a href="#" className="block hover:text-primary">文档</a>
                <a href="#" className="block hover:text-primary">API 参考</a>
                <a href="#" className="block hover:text-primary">服务状态</a>
              </div>
              <div className="space-y-4">
                <div className="font-bold text-on-surface uppercase tracking-widest text-xs">公司</div>
                <a href="#" className="block hover:text-primary">关于我们</a>
                <a href="#" className="block hover:text-primary">招贤纳士</a>
                <a href="#" className="block hover:text-primary">联系我们</a>
              </div>
              <div className="space-y-4">
                <div className="font-bold text-on-surface uppercase tracking-widest text-xs">社交媒体</div>
                <a href="#" className="block hover:text-primary">Twitter</a>
                <a href="#" className="block hover:text-primary">LinkedIn</a>
                <a href="#" className="block hover:text-primary">GitHub</a>
              </div>
            </div>
            <div className="mt-20 pt-10 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-outline font-medium">
              <div>© 2024 seakoi。保留所有权利。</div>
              <div className="flex gap-8">
                <a href="#" className="hover:text-primary transition-colors">隐私政策</a>
                <a href="#" className="hover:text-primary transition-colors">服务条款</a>
                <a href="#" className="hover:text-primary transition-colors">Cookie 设置</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArchitectApp;
