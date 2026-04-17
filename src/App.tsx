import React from 'react';
import { 
  FormInput, 
  Workflow, 
  Database, 
  ShieldCheck, 
  ChevronRight, 
  Activity, 
  Layers, 
  MousePointer2,
  FileSearch,
  Users,
  LayoutGrid,
  Menu,
  X,
  Plus,
  Trash2,
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
  Filter,
  ArrowUpDown,
  FileSpreadsheet,
  Download,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';

type ViewType = 'landing' | 'dashboard' | 'editor' | 'projects' | 'workflow' | 'insights' | 'integrations' | 'team';

interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select
}

interface WorkflowNode {
  id: string;
  type: 'start' | 'approval' | 'notification' | 'condition' | 'cc' | 'end';
  label: string;
  description?: string;
  config?: {
    assigneeType?: 'user' | 'role' | 'dept' | 'initiator';
    assigneeValue?: string;
    approvalType?: 'OR' | 'AND'; // 或签 / 会签
    timeout?: number; // hours
    autoProcess?: 'approve' | 'transfer';
    actions?: string[]; // ['approve', 'reject', 'transfer', 'add_signer']
    expression?: string; // for condition
    template?: string;
    defaultBranch?: string; // id of target node
  };
  targets: string[]; // ids of next nodes
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
  status: 'Published' | 'Draft' | 'Archived';
  responses: number;
}

interface SavedForm {
  id: string;
  projectId: string;
  name: string;
  status: 'Published' | 'Draft' | 'Archived';
  createdAt: string;
  designer: string;
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
  { id: '1', name: '入职架构', updatedAt: '2小时前', status: 'Draft', responses: 0 },
  { id: '2', name: 'Q3 客户反馈', updatedAt: '1天前', status: 'Published', responses: 1240 },
  { id: '3', name: '企业潜在客户', updatedAt: '3天前', status: 'Published', responses: 852 },
  { id: '4', name: 'Alpha 候选名单', updatedAt: '5天前', status: 'Archived', responses: 3200 },
];

const mockSavedForms: SavedForm[] = [
  { id: 'f1', projectId: '1', name: '员工基本信息', status: 'Draft', createdAt: '2026-04-10', designer: '陈' },
  { id: 'f2', projectId: '1', name: '技术评估', status: 'Draft', createdAt: '2026-04-12', designer: '陈' },
  { id: 'f3', projectId: '2', name: '产品满意度', status: 'Published', createdAt: '2026-03-20', designer: '莎拉' },
  { id: 'f4', projectId: '2', name: 'UI 反馈调查', status: 'Published', createdAt: '2026-03-25', designer: '管理员' },
  { id: 'f5', projectId: '3', name: '客户联系表单', status: 'Published', createdAt: '2026-04-01', designer: '李' },
  { id: 'f6', projectId: '4', name: '候选名单 v1', status: 'Archived', createdAt: '2025-12-15', designer: '陈' },
];

const ArchitectApp: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [view, setView] = React.useState<ViewType>('landing');
  const [formFields, setFormFields] = React.useState<FormField[]>([
    { id: '1', type: 'text', label: '全名', placeholder: '请输入您的姓名', required: true },
    { id: '2', type: 'date', label: '出生日期', required: false },
  ]);
  const [selectedFieldId, setSelectedFieldId] = React.useState<string | null>(null);
  const [editorTab, setEditorTab] = React.useState<'design' | 'workflow' | 'permissions' | 'simulate' | 'data' | 'preview'>('design');
  const [workflowNodes, setWorkflowNodes] = React.useState<WorkflowNode[]>([
    { id: 'node-1', type: 'start', label: '支付发起', description: '表单提交时触发', targets: ['node-2'] },
    { 
      id: 'node-2', 
      type: 'approval', 
      label: '经理审批', 
      description: '部门主管审核', 
      targets: ['node-5'],
      config: { assigneeType: 'role', assigneeValue: '部门经理', approvalType: 'OR', actions: ['approve', 'reject', 'transfer'] } 
    },
    { 
      id: 'node-5', 
      type: 'condition', 
      label: '金额阈值', 
      description: '基于支付总额的逻辑分支', 
      targets: ['node-3', 'node-4'],
      config: { expression: 'amount > 5000', defaultBranch: 'node-4' }
    },
    { 
      id: 'node-3', 
      type: 'approval', 
      label: 'CFO 最终签核', 
      description: '高频值请求所需', 
      targets: ['node-4'],
      config: { assigneeType: 'role', assigneeValue: 'CFO', approvalType: 'AND' } 
    },
    { id: 'node-4', type: 'end', label: '处理完成', description: '数据同步至 ERP', targets: [] },
  ]);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [workflowStatus, setWorkflowStatus] = React.useState<'active' | 'inactive'>('active');
  const [workflowInstances, setWorkflowInstances] = React.useState<WorkflowInstance[]>([
    { id: 'wf-1', projectId: '1', initiator: '陈', startTime: '1小时前', status: 'Pending', currentStep: '经理审批', history: [] },
    { id: 'wf-2', projectId: '1', initiator: '莎拉', startTime: '5小时前', status: 'Completed', currentStep: '结束', history: [{ step: '开始', actor: '莎拉', action: '提交', time: '5小时前' }] },
  ]);
  const [simulationData, setSimulationData] = React.useState<Record<string, any>>({ amount: 6000 });
  const [isSchemaVisible, setIsSchemaVisible] = React.useState(false);

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
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>(mockProjects[1].id);
  const [projectDetailsId, setProjectDetailsId] = React.useState<string | null>(null);

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

  const teamMembers = [
    { id: '1', name: '您 (架构师)', role: 'Admin', dept: '工程部' },
    { id: '2', name: '陈莎拉', role: 'Editor', dept: '产品部' },
    { id: '3', name: '米高·贝克', role: 'Viewer', dept: '设计部' },
    { id: '4', name: '财务主管', role: 'Manager', dept: '财务部' },
    { id: '5', name: 'HR 管理员', role: 'Admin', dept: '人力资源部' },
  ];

  const allRoles = Array.from(new Set(teamMembers.map(m => m.role)));
  const allDepts = Array.from(new Set(teamMembers.map(m => m.dept)));

  const showNotification = (text: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const Sidebar = ({ currentView }: { currentView: ViewType }) => (
    <aside className="w-64 bg-white border-r border-outline-variant flex flex-col shrink-0">
      <div className="p-8 flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <LayoutGrid className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tighter">架构师 Architect</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-4">
        {[
          { label: '控制台概览', icon: LayoutGrid, view: 'dashboard' },
          { label: '表单项目', icon: FormInput, view: 'projects' },
          { label: '团队流转', icon: Workflow, view: 'workflow' },
          { label: '数据洞察', icon: Activity, view: 'insights' },
          { label: '集成中心', icon: Database, view: 'integrations' },
          { label: '团队成员', icon: Users, view: 'team' },
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
          <ChevronRight className="w-4 h-4 rotate-180" />
          返回主页
        </button>
      </div>
    </aside>
  );

  const DashboardHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <header className="h-20 sleek-glass px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
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
    </header>
  );

  // Editor Actions
  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `新建 ${type} 字段`,
      required: false,
      placeholder: type === 'text' ? '请输入内容...' : undefined,
      options: type === 'select' ? ['选项 1', '选项 2'] : undefined,
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

  const updateWorkflowNode = (id: string, updates: Partial<WorkflowNode>) => {
    setWorkflowNodes(workflowNodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const removeWorkflowNode = (id: string) => {
    setWorkflowNodes(workflowNodes.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const selectedField = formFields.find(f => f.id === selectedFieldId);
  const selectedNode = workflowNodes.find(n => n.id === selectedNodeId);

  const JsonSchemaModal = () => (
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
            formTitle: "入职架构",
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

  // Sub-Views Components
  const ProjectsView = () => {
    const selectedProject = mockProjects.find(p => p.id === projectDetailsId);
    const relatedForms = mockSavedForms.filter(f => f.projectId === projectDetailsId);

    return (
      <div className="p-8 space-y-8 max-w-7xl animate-in fade-in duration-500">
        {!projectDetailsId ? (
          <>
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">表单项目</h2>
                <p className="text-sm text-on-surface-variant font-medium">管理您的活跃架构和部署流水线</p>
              </div>
              <button 
                onClick={() => setView('editor')}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" /> 创建新项目
              </button>
            </div>

            <div className="sleek-card overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">项目名称</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">状态</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">回复数</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">最后更新</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {mockProjects.map((project) => (
                    <tr 
                      key={project.id} 
                      className="hover:bg-surface/50 transition-colors group cursor-pointer"
                      onClick={() => setProjectDetailsId(project.id)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <FormInput className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-sm tracking-tight">{project.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                          project.status === 'Published' ? 'bg-green-100 text-green-700' : 
                          project.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-surface-container-high text-outline'
                        }`}>
                          {project.status === 'Published' ? '已发布' : project.status === 'Draft' ? '草稿' : '已归档'}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs font-bold">{project.responses.toLocaleString()}</td>
                      <td className="px-6 py-5 text-xs text-on-surface-variant font-medium">{project.updatedAt}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 hover:bg-surface rounded-lg transition-colors text-outline hover:text-on-surface">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-end">
              <div>
                <button 
                  onClick={() => setProjectDetailsId(null)}
                  className="flex items-center gap-2 text-outline hover:text-primary transition-colors mb-4 group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">返回项目列表</span>
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                     <FormInput className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tighter">{selectedProject?.name}</h2>
                    <p className="text-sm text-on-surface-variant font-medium">与此项目关联的表单列表</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setView('editor')}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" /> 向项目添加表单
              </button>
            </div>

            <div className="sleek-card overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">表单名称</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">状态</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">创建时间</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">设计者</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {relatedForms.map((form) => (
                    <tr key={form.id} className="hover:bg-surface/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
                            <Code className="w-4 h-4 text-outline group-hover:text-primary" />
                          </div>
                          <span className="font-bold text-sm tracking-tight">{form.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                          form.status === 'Published' ? 'bg-green-100 text-green-700' : 
                          form.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-surface-container-high text-outline'
                        }`}>
                          {form.status === 'Published' ? '已发布' : form.status === 'Draft' ? '草稿' : '已归档'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-on-surface-variant font-medium font-mono">{form.createdAt}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-outline border border-outline-variant">
                              {form.designer.charAt(0)}
                           </div>
                           <span className="text-xs font-bold">{form.designer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button 
                             onClick={() => setView('editor')}
                             className="px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-[10px] font-bold hover:border-primary hover:text-primary transition-all uppercase tracking-widest"
                           >编辑</button>
                           <button className="p-1.5 hover:bg-surface rounded-lg transition-colors text-outline">
                             <MoreVertical className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {relatedForms.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <div className="p-4 bg-surface rounded-full text-outline/30">
                              <FileSearch className="w-8 h-8" />
                           </div>
                           <p className="text-sm font-bold text-outline">未找到该项目的表单</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  };

  const WorkflowView = () => (
    <div className="p-8 space-y-8 max-w-7xl pb-32">
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
           <div className="sleek-card overflow-hidden border-2 border-outline-variant shadow-sm">
              <div className="p-6 border-b border-outline-variant bg-surface-container-low/50 flex justify-between items-center text-on-surface">
                 <h3 className="font-bold text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> 活跃实例</h3>
                 <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded tracking-widest uppercase">实时</span>
              </div>
              <div className="divide-y divide-outline-variant">
                 {workflowInstances.map(inst => (
                   <div key={inst.id} className="p-6 flex items-center gap-6 hover:bg-surface transition-colors group cursor-pointer text-on-surface">
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
                         <button className="px-3 py-1.5 bg-on-surface text-white rounded-lg text-[10px] font-bold hover:secondary transition-all opacity-0 group-hover:opacity-100 font-bold uppercase tracking-widest">催办</button>
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

  const InsightsView = () => (
    <div className="p-8 space-y-8 max-w-7xl">
       <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tighter">数据引擎</h2>
          <p className="text-sm text-on-surface-variant font-medium">实时遥测和提交分析数据</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-on-surface text-white rounded-xl font-bold text-sm transition-all hover:opacity-90">
          <Share2 className="w-4 h-4" /> 导出报告
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { l: '平均完成时间', v: '2.4m', t: '-12%' },
          { l: '流失率', v: '18.4%', t: '+2.1%' },
          { l: '峰值加载时间', v: '44ms', t: '-4ms' },
          { l: '唯一握手次数', v: '4.2k', t: '+800' },
        ].map(item => (
          <div key={item.l} className="sleek-card p-6">
            <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">{item.l}</div>
            <div className="text-2xl font-extrabold">{item.v}</div>
            <span className="text-[10px] font-bold text-green-600">{item.t}</span>
          </div>
        ))}
      </div>

      <div className="sleek-card p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2">
         <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center">
            <Activity className="w-8 h-8 text-primary opacity-20" />
         </div>
         <h4 className="font-bold text-xl">高级可视化引擎</h4>
         <p className="text-sm text-on-surface-variant max-w-md">在专业版计划中，通过热力图、漏斗图和地理位置指标自定义您的报告仪表板。</p>
         <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20">查看更多洞察</button>
      </div>
    </div>
  );

  const IntegrationsView = () => (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tighter">集成中心</h2>
        <p className="text-sm text-on-surface-variant font-medium">将 Architect 连接到您现有的技术栈</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Slack', desc: '在您的频道中接收即时提醒', connected: true },
          { name: 'Zapier', desc: '连接 5,000+ 其它应用程序', connected: false },
          { name: 'Google Sheets', desc: '自动导出回复数据', connected: true },
          { name: 'Salesforce', desc: '将潜在客户同步至您的 CRM', connected: false },
          { name: 'Segment', desc: '将事件流式传输到您的数据平台', connected: false },
          { name: 'Webhooks', desc: '自定义 HTTP 事件触发器', connected: true },
        ].map((app) => (
          <div key={app.name} className="sleek-card p-6 flex flex-col gap-4 group hover:border-primary transition-all text-on-surface">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-on-surface-variant border border-outline-variant font-bold text-lg">
                {app.name[0]}
              </div>
              {app.connected ? (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">已连接</span>
              ) : (
                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">连接</button>
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

  const TeamView = () => (
    <div className="p-8 space-y-8 max-w-7xl pb-32">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tighter">团队成员</h2>
          <p className="text-sm text-on-surface-variant font-medium">管理访问控制、协作权限和部门架构</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg">
          <Users className="w-4 h-4" /> 邀请成员
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((user, idx) => (
          <div key={user.id} className="sleek-card p-6 flex flex-col gap-4 border-2 border-outline-variant hover:border-primary transition-all group">
             <div className="flex items-center gap-4">
               <img src={`https://picsum.photos/seed/user-${idx}/100/100`} className="w-12 h-12 rounded-2xl border border-outline-variant" referrerPolicy="no-referrer" alt="头像" />
               <div>
                  <h6 className="font-bold text-sm">{user.name}</h6>
                  <p className="text-[10px] text-outline font-bold tracking-widest uppercase">{user.role === 'Admin' ? '管理员' : user.role === 'Editor' ? '编辑' : user.role === 'Viewer' ? '查看者' : '经理'} • {user.dept}</p>
               </div>
             </div>
             <div className="p-3 bg-surface rounded-xl flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface-variant break-all">
                  {user.name.toLowerCase().replace(/ /g, '.')}@architect.com
                </span>
                <Settings className="w-3 h-3 text-outline cursor-pointer hover:text-black transition-colors" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );

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
              <h2 className="font-bold tracking-tight">支付申请 V2</h2>
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">活跃中</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="flex bg-surface-container-high rounded-lg p-1 border border-outline-variant">
              {[
                { id: 'design', label: '设计', icon: Code },
                { id: 'workflow', label: '流程', icon: Workflow },
                { id: 'permissions', label: '权限', icon: ShieldCheck },
                { id: 'simulate', label: '仿真', icon: Activity },
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
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-xl border border-outline-variant shadow-sm transition-all hover:border-primary group mr-3">
               <Briefcase className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-outline uppercase tracking-tighter leading-none">表单上下文</span>
                  <select 
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="bg-transparent text-xs font-extrabold focus:outline-none cursor-pointer pr-4 appearance-none hover:text-primary transition-colors h-4 leading-none"
                  >
                    {mockProjects.map(p => (
                      <option key={p.id} value={p.id} className="text-on-surface">{p.name}</option>
                    ))}
                  </select>
               </div>
               <ChevronDown className="w-3 h-3 text-outline group-hover:text-primary transition-colors ml-[-4px]" />
            </div>

            <button 
              onClick={() => setEditorTab('preview')}
              className={`flex items-center justify-center w-10 h-10 rounded-xl font-extrabold transition-all active:scale-95 group border ${editorTab === 'preview' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
              title="预览表单"
            >
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <button 
              onClick={() => {
                const project = mockProjects.find(p => p.id === selectedProjectId);
                showNotification(`表单已成功保存到项目：${project?.name}`);
              }} 
              className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-xl font-extrabold hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 group"
              title="保存更改"
            >
              <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Editor Sidebar - Components / Nodes */}
          <aside className="w-72 bg-white border-r border-outline-variant flex flex-col shrink-0 text-on-surface select-none">
            <div className="p-6 border-b border-outline-variant flex items-center">
              <span className="font-bold tracking-tight text-sm">
                {editorTab === 'workflow' ? '流程组件' : editorTab === 'permissions' ? '权限角色' : editorTab === 'simulate' ? '仿真洞察' : editorTab === 'data' ? '数据中心' : editorTab === 'preview' ? '预览模式' : '字段库'}
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
                    { type: 'approval', icon: ShieldCheck, label: '审批环节', desc: '需要人工进行审批' },
                    { type: 'notification', icon: Mail, label: '邮件提醒', desc: '发送系统自动邮件' },
                    { type: 'condition', icon: Workflow, label: '条件分支', desc: '基于数据逻辑分流' },
                    { type: 'cc', icon: Share2, label: '抄送环节', desc: '将副本发送给特定人员' },
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
            ) : editorTab === 'permissions' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest">选择角色</h3>
                  <button className="p-1 hover:bg-surface rounded-md">
                    <Plus className="w-3 h-3 text-primary" />
                  </button>
                </div>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedRole === role ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant hover:border-outline'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedRole === role ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                          <Users className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-bold ${selectedRole === role ? 'text-primary' : ''}`}>{role}</span>
                      </div>
                      {selectedRole === role && <ChevronRight className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant mt-6">
                   <div className="flex items-center gap-2 mb-2">
                     <ShieldCheck className="w-4 h-4 text-primary" />
                     <span className="text-[10px] font-bold">权限概念</span>
                   </div>
                   <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                     角色权限的更改将立即影响当前所有流程中分配到该角色的用户。
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
                      <div key={idx} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-4">基础字段</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'text', icon: Type, label: '文本' },
                    { type: 'textarea', icon: LayoutGrid, label: '多行' },
                    { type: 'number', icon: Activity, label: '数字' },
                    { type: 'date', icon: Calendar, label: '日期' },
                    { type: 'select', icon: Menu, label: '下拉' },
                    { type: 'checkbox', icon: CheckSquare, label: '选择' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => addField(item.type as FormField['type'])}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <item.icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold tracking-tight">AI 智能优化</span>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed font-medium">
                我们的 AI 可以自动建议验证规则和最佳执行路径。
              </p>
            </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-12 canvas-grid relative bg-surface">
          <div className="max-w-4xl mx-auto">
              {editorTab === 'design' && (
                <div className="max-w-2xl mx-auto space-y-4 pb-20">
                  <Reorder.Group axis="y" values={formFields} onReorder={setFormFields} className="space-y-4">
                    {formFields.map((field) => (
                      <Reorder.Item 
                        key={field.id} 
                        value={field}
                        className={`sleek-card p-6 cursor-grab active:cursor-grabbing border-2 transition-all ${selectedFieldId === field.id ? 'border-primary ring-4 ring-primary/5' : 'border-outline-variant hover:border-outline'}`}
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
                        <div className="font-bold mb-1">{field.label}</div>
                        <div className="text-xs text-on-surface-variant font-medium">
                          {field.placeholder || "无占位符"} • {field.required ? "必填" : "非必填"}
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
                              <div className="mt-4 pt-4 border-t border-dashed border-outline-variant flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Users className="w-3 h-3 text-primary" />
                                  <span className="text-[10px] font-extrabold text-primary">{node.config?.assigneeValue || node.config?.assigneeType}</span>
                                </div>
                                <span className="text-[10px] font-bold bg-outline-variant/10 px-2 py-0.5 rounded uppercase tracking-widest">{node.config?.approvalType === 'AND' ? '会签' : '或签'}</span>
                              </div>
                            )}

                            {isBranching && (
                              <div className="mt-4 pt-4 border-t border-dashed border-outline-variant space-y-2">
                                <div className="text-[10px] font-bold text-outline uppercase tracking-widest">分支逻辑</div>
                                <div className="flex gap-2">
                                  <span className="text-[10px] font-mono bg-on-surface text-white px-2 py-1 rounded">IF {node.config?.expression}</span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                          
                          {index < workflowNodes.length - 1 && !isBranching && (
                            <div className="h-12 w-0.5 bg-outline-variant relative my-2">
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
                         <div className="space-y-4">
                            {formFields && formFields.filter(f => ['text', 'number', 'select'].includes(f.type)).length > 0 ? (
                              formFields.filter(f => ['text', 'number', 'select'].includes(f.type)).map(field => (
                                <div key={field.id} className="space-y-2">
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
                              <div className="p-4 bg-surface text-center rounded-xl border border-dashed border-outline-variant">
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

              {editorTab === 'permissions' && (
                <div className="max-w-4xl mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <header className="mb-8">
                    <h2 className="text-2xl font-extrabold tracking-tight">权限配置：{selectedRole}</h2>
                    <p className="text-sm text-on-surface-variant font-medium">配置该角色对表单的操作权限及数据访问范围</p>
                  </header>

                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Settings className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold tracking-tight">一、角色权限配置</h3>
                    </div>
                    
                    <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                        <div>
                          <h4 className="font-bold text-sm">功能权限项</h4>
                          <p className="text-[10px] text-on-surface-variant font-medium">最小权限原则：默认无权限，需显式授权</p>
                        </div>
                        <button 
                          onClick={() => {
                            const allIds = functionalOptions.map(o => o.id);
                            setFuncPerms(prev => ({ ...prev, [selectedRole]: allIds }));
                          }}
                          className="text-[10px] font-bold text-primary hover:underline transition-all"
                        >
                          全部授权
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {functionalOptions.map((opt) => {
                          const isChecked = funcPerms[selectedRole]?.includes(opt.id);
                          return (
                            <div 
                              key={opt.id}
                              onClick={() => {
                                const current = funcPerms[selectedRole] || [];
                                const next = current.includes(opt.id) 
                                  ? current.filter(id => id !== opt.id)
                                  : [...current, opt.id];
                                setFuncPerms(prev => ({ ...prev, [selectedRole]: next }));
                              }}
                              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isChecked ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-outline bg-surface/30'}`}
                            >
                              <div className="flex gap-4">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-primary border-primary' : 'border-outline-variant bg-white'}`}>
                                  {isChecked && <Plus className="w-3 h-3 text-white rotate-45" style={{ transform: 'rotate(0deg)' }} />}
                                </div>
                                <div>
                                  <div className={`text-xs font-bold ${isChecked ? 'text-primary' : 'text-on-surface'}`}>{opt.label}</div>
                                  <div className="text-[10px] text-on-surface-variant font-medium">{opt.desc}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Database className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold tracking-tight">二、数据权限配置</h3>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm space-y-8">
                       <div className="space-y-4">
                         <div className="text-[10px] font-bold text-outline uppercase tracking-widest border-b border-outline-variant pb-2">数据权限类型</div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {dataScopeOptions.map(opt => (
                              <div 
                                key={opt.id}
                                onClick={() => setDataPerms(prev => ({ ...prev, [selectedRole]: { ...prev[selectedRole], type: opt.id as any } }))}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${dataPerms[selectedRole]?.type === opt.id ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-outline bg-surface/30'}`}
                              >
                                <div>
                                  <div className={`text-xs font-bold ${dataPerms[selectedRole]?.type === opt.id ? 'text-primary' : 'text-on-surface'}`}>{opt.label}</div>
                                  <div className="text-[10px] text-on-surface-variant font-medium">{opt.desc}</div>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dataPerms[selectedRole]?.type === opt.id ? 'border-primary' : 'border-outline-variant'}`}>
                                  {dataPerms[selectedRole]?.type === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                              </div>
                            ))}
                         </div>
                       </div>

                       {dataPerms[selectedRole]?.type === 'custom' && (
                         <div className="space-y-4 pt-6 border-t border-outline-variant animate-in fade-in slide-in-from-top-4 duration-300">
                           <div className="text-[10px] font-bold text-outline uppercase tracking-widest">自定义权限规则</div>
                           <div className="p-4 bg-surface rounded-xl border border-outline-variant space-y-4">
                              <div className="flex gap-4">
                                 <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">组织架构</label>
                                    <select className="w-full bg-white border border-outline-variant rounded-lg p-3 text-xs font-medium">
                                       <option>选择部门 / 分支</option>
                                       <option>HR Department</option>
                                       <option>Finance Center</option>
                                       <option>Engineering Team</option>
                                    </select>
                                 </div>
                                 <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">数据字段</label>
                                    <select className="w-full bg-white border border-outline-variant rounded-lg p-3 text-xs font-medium">
                                       <option>选择过滤字段</option>
                                       {formFields.map(f => <option key={f.id}>{f.label}</option>)}
                                    </select>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-on-surface-variant uppercase">逻辑表达式 (JS Syntax)</label>
                                 <input 
                                   type="text" 
                                   placeholder="例如：data.amount > 1000 && data.deptId == user.deptId"
                                   value={dataPerms[selectedRole]?.customRule || ''}
                                   onChange={(e) => setDataPerms(prev => ({ ...prev, [selectedRole]: { ...prev[selectedRole], customRule: e.target.value } }))}
                                   className="w-full bg-white border border-outline-variant rounded-lg p-3 text-xs font-mono"
                                 />
                                 <p className="text-[10px] text-outline font-medium">使用 JavaScript 表达式定义更复杂的行级数据权限过滤逻辑。</p>
                              </div>
                           </div>
                         </div>
                       )}

                       <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant">
                          <button 
                            onClick={() => showNotification('配置已重置')}
                            className="px-6 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface transition-all border border-outline-variant"
                          >
                            重置
                          </button>
                          <button 
                            onClick={() => showNotification(`“${selectedRole}”的权限已保存成功`)}
                            className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" /> 保存当前角色配置
                          </button>
                       </div>
                    </div>
                  </section>
                </div>
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
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-xs transition-all hover:shadow-lg shadow-primary/20"
                         >
                            <Download className="w-4 h-4" /> 导出数据
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
                <div className="max-w-2xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="sleek-card p-12 shadow-2xl bg-white border-2 border-outline-variant"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-3xl font-extrabold tracking-tighter">支付申请</h2>
                        <p className="text-sm text-on-surface-variant font-medium">正在起草第四季度财务审查 v2</p>
                      </div>
                      <div className="p-3 bg-surface rounded-2xl flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">实时系统</span>
                      </div>
                    </div>
                    <div className="space-y-8">
                      {formFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="text-sm font-bold block select-none">
                            {field.label} {field.required && <span className="text-error">*</span>}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea 
                              placeholder={field.placeholder} 
                              className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px]"
                            />
                          ) : field.type === 'select' ? (
                            <div className="relative">
                              <select className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                                {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                              </select>
                              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline rotate-90 pointer-events-none" />
                            </div>
                          ) : (
                            <input 
                              type={field.type} 
                              placeholder={field.placeholder} 
                              className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          )}
                        </div>
                      ))}
                      <div className="p-6 bg-surface-container-high rounded-2xl border border-outline-variant">
                         <div className="flex items-center gap-2 mb-3">
                           <Workflow className="w-4 h-4 text-primary" />
                           <span className="text-xs font-bold">Process Logic Applied</span>
                         </div>
                         <div className="text-[10px] font-medium text-on-surface-variant flex gap-2">
                            {workflowNodes.map((n, i) => (
                              <span key={n.id} className="flex items-center gap-1">
                                {n.label} {i < workflowNodes.length - 1 && <ChevronRight className="w-3 h-3 opacity-30" />}
                              </span>
                            ))}
                         </div>
                      </div>
                      <button className="w-full bg-primary text-white py-4 rounded-xl text-sm font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all">
                        发起工作流申请
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 bg-white border-l border-outline-variant flex flex-col shrink-0 text-on-surface select-none">
          <div className="p-6 border-b border-outline-variant flex items-center gap-2">
            <Settings className="w-4 h-4 text-outline" />
            <span className="font-bold tracking-tight text-sm">
              {selectedNode ? '步骤配置' : '字段属性'}
            </span>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {(editorTab === 'workflow' && selectedNode) ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200 pb-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest block leading-none">核心配置</label>
                    <input 
                      type="text" 
                      placeholder="步骤标题"
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
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-outline uppercase tracking-widest">审批人定向</label>
                       <select 
                         value={selectedNode.config?.assigneeType || 'user'}
                         onChange={(e) => updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, assigneeType: e.target.value as any, assigneeValue: '' } })}
                         className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                       >
                         <option value="user">特定用户</option>
                         <option value="role">角色基础</option>
                         <option value="dept">部门主管</option>
                         <option value="initiator">本人（发起人）</option>
                       </select>
                    </div>

                    {selectedNode.config?.assigneeType !== 'initiator' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest">受让人选择</label>
                        <select 
                          value={selectedNode.config?.assigneeValue || ''}
                          onChange={(e) => updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, assigneeValue: e.target.value } })}
                          className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                          <option value="">选择目标...</option>
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
                    )}

                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-outline uppercase tracking-widest">并行逻辑</label>
                       <div className="flex bg-surface-container rounded-2xl p-1.5 border border-outline-variant">
                          <button 
                             onClick={() => updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, approvalType: 'OR' } })}
                             className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${selectedNode.config?.approvalType === 'OR' ? 'bg-white shadow text-primary font-extrabold' : 'text-outline'}`}
                          >或签 (OR)</button>
                          <button 
                             onClick={() => updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, approvalType: 'AND' } })}
                             className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${selectedNode.config?.approvalType === 'AND' ? 'bg-white shadow text-primary font-extrabold' : 'text-outline'}`}
                          >会签 (AND)</button>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-outline uppercase tracking-widest">签核超时</label>
                          <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">{selectedNode.config?.timeout || 24} 小时</span>
                       </div>
                       <input 
                          type="range" min="1" max="168"
                          value={selectedNode.config?.timeout || 24}
                          onChange={(e) => updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, timeout: parseInt(e.target.value) } })}
                          className="w-full accent-primary h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer"
                       />
                       <div className="flex justify-between text-[8px] font-bold text-outline uppercase px-1">
                          <span>1小时</span>
                          <span>7天</span>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-outline uppercase tracking-widest">授权操作</label>
                       <div className="flex flex-wrap gap-2 text-on-surface">
                          {['approve', 'reject', 'transfer', 'add_signer'].map(action => (
                            <button
                               key={action}
                               onClick={() => {
                                  const current = selectedNode.config?.actions || [];
                                  const next = current.includes(action) ? current.filter(a => a !== action) : [...current, action];
                                  updateWorkflowNode(selectedNode.id, { config: { ...selectedNode.config, actions: next } });
                               }}
                               className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all ${selectedNode.config?.actions?.includes(action) ? 'bg-on-surface text-white border-on-surface' : 'bg-surface border-outline-variant text-outline'}`}
                            >
                               {action.replace('_', ' ')}
                            </button>
                          ))}
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
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">字段名称</label>
                  <input 
                    type="text" 
                    value={selectedField.label}
                    onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  />
                </div>

                {selectedField.placeholder !== undefined && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">占位提示</label>
                    <input 
                      type="text" 
                      value={selectedField.placeholder}
                      onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant">
                  <span className="text-xs font-bold transition-all">必填字段</span>
                  <button 
                    onClick={() => updateField(selectedField.id, { required: !selectedField.required })}
                    className={`w-10 h-6 rounded-full relative transition-all ${selectedField.required ? 'bg-primary' : 'bg-outline-variant'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedField.required ? 'left-5' : 'left-1'}`}></div>
                  </button>
                </div>

                {selectedField.type === 'select' && (
                  <div className="space-y-4 pt-4 border-t border-outline-variant">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest">选项列表</label>
                      <button 
                        onClick={() => {
                          const newOpts = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                          updateField(selectedField.id, { options: newOpts });
                        }}
                        className="p-1 hover:bg-surface rounded-md"
                      >
                        <Plus className="w-3 h-3 text-primary" />
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
                            className="flex-1 bg-surface border border-outline-variant rounded-lg px-3 py-2 text-xs font-medium"
                          />
                          <button 
                            onClick={() => {
                              const newOpts = (selectedField.options || []).filter((_, i) => i !== idx);
                              updateField(selectedField.id, { options: newOpts });
                            }}
                            className="p-2 text-outline hover:text-error transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
               <Code className="w-3 h-3" /> 导出流水线逻辑
             </button>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {isSchemaVisible && <JsonSchemaModal />}
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
        {isSchemaVisible && <JsonSchemaModal />}
      </AnimatePresence>
    </div>
    );
  }

  // Modular Console Layout
  const ConsoleLayout = ({ children, title, subtitle, viewToken }: { children: React.ReactNode, title: string, subtitle?: string, viewToken: ViewType }) => (
    <div className="flex h-screen bg-surface overflow-hidden text-on-surface select-none">
      <Sidebar currentView={viewToken} />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <DashboardHeader title={title} subtitle={subtitle} />
        <AnimatePresence mode="wait">
          <motion.div
            key={viewToken}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        
        {/* Simple Notification Toast */}
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

  if (view === 'projects') return <ConsoleLayout viewToken="projects" title="项目列表" subtitle="总计 4 个表单，2 个已部署"><ProjectsView /></ConsoleLayout>;
  if (view === 'workflow') return <ConsoleLayout viewToken="workflow" title="基础设施流转" subtitle="编排表单数据逻辑"><WorkflowView /></ConsoleLayout>;
  if (view === 'insights') return <ConsoleLayout viewToken="insights" title="数据洞察" subtitle="深度遥测分析"><InsightsView /></ConsoleLayout>;
  if (view === 'integrations') return <ConsoleLayout viewToken="integrations" title="云端集成" subtitle="第三方服务连接能力"><IntegrationsView /></ConsoleLayout>;
  if (view === 'team') return <ConsoleLayout viewToken="team" title="工作区团队" subtitle="管理协作权限"><TeamView /></ConsoleLayout>;

  if (view === 'dashboard') {
    return (
      <ConsoleLayout 
        viewToken="dashboard" 
        title="欢迎回来，架构师" 
        subtitle="系统运行正常 • 4 个活跃构建"
      >
        <div className="p-8 space-y-8 max-w-7xl">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: '活跃回复者', value: '12,540', trend: '↑ 12.5%', color: 'text-primary' },
              { label: '总部署数', value: '452', trend: '↑ 8.2%', color: 'text-secondary' },
              { label: 'API 握手次数', value: '89.4k', trend: '↑ 24.1%', color: 'text-green-500' },
            ].map((stat) => (
              <div key={stat.label} className="sleek-card p-6 flex flex-col gap-2 group transition-transform hover:-translate-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tighter">{stat.value}</span>
                  <span className={`text-[10px] font-bold ${stat.color}`}>{stat.trend}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant flex items-center justify-between">
                  <span className="text-[10px] font-medium text-outline">最近 30 天</span>
                  <Activity className={`w-4 h-4 ${stat.color} opacity-20`} />
                </div>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
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
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-20">
            {[
              { title: '新表单', desc: '从空白画布开始', icon: FormInput, action: () => setView('editor') },
              { title: '模板中心', desc: '浏览企业级模板库', icon: LayoutGrid, action: () => setView('editor') },
              { title: '导入数据', desc: '上传旧版 JSON/CSV', icon: Database, action: () => showNotification('集成外部数据源') },
              { title: '网络钩子', desc: '管理事件触发器', icon: Workflow, action: () => setView('workflow') },
            ].map((action) => (
              <button 
                key={action.title} 
                onClick={action.action}
                className="sleek-card p-5 hover:border-primary border-2 border-transparent transition-all text-left flex flex-col gap-1 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity text-on-surface">
                  <action.icon className="w-12 h-12 rotate-12" />
                </div>
                <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/5 transition-colors">
                  <action.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-sm font-bold tracking-tight text-on-surface">{action.title}</div>
                <div className="text-[10px] text-on-surface-variant font-medium">{action.desc}</div>
              </button>
            ))}
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
              <span className="font-bold text-xl tracking-tighter">架构师</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
              <a href="#" className="hover:text-primary transition-colors">资源中心</a>
              <a href="#" className="hover:text-primary transition-colors">企业方案</a>
              <a href="#" className="hover:text-primary transition-colors">价格</a>
              <button 
                onClick={() => setView('dashboard')}
                className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/20"
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
                onClick={() => setView('dashboard')}
                className="w-full bg-primary text-white p-3 rounded-md"
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
                架构师是面向复杂工作流、海量数据采集和深度基础设施集成的企业级表单构建器。
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => setView('dashboard')}
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
              onClick={() => setView('dashboard')}
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
                    "架构师让我们可以统一全球入职流程，同时通过动态数据路由维持严格的当地法规合规性。"
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
              <div>© 2024 架构师软件有限公司。保留所有权利。</div>
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
