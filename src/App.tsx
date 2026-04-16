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
  Mail
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

interface Project {
  id: string;
  name: string;
  updatedAt: string;
  status: 'Published' | 'Draft' | 'Archived';
  responses: number;
}

const mockProjects: Project[] = [
  { id: '1', name: 'Onboarding Schema', updatedAt: '2h ago', status: 'Draft', responses: 0 },
  { id: '2', name: 'Customer Feedback Q3', updatedAt: '1d ago', status: 'Published', responses: 1240 },
  { id: '3', name: 'Enterprise Lead Gen', updatedAt: '3d ago', status: 'Published', responses: 852 },
  { id: '4', name: 'Waitlist Alpha', updatedAt: '5d ago', status: 'Archived', responses: 3200 },
];

const ArchitectApp: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [view, setView] = React.useState<ViewType>('landing');
  const [formFields, setFormFields] = React.useState<FormField[]>([
    { id: '1', type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true },
    { id: '2', type: 'date', label: 'Date of Birth', required: false },
  ]);
  const [selectedFieldId, setSelectedFieldId] = React.useState<string | null>(null);
  const [isPreview, setIsPreview] = React.useState(false);
  const [isSchemaVisible, setIsSchemaVisible] = React.useState(false);
  const [notifications, setNotifications] = React.useState<{id: number, text: string}[]>([]);

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
        <span className="font-bold text-xl tracking-tighter">Architect</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-4">
        {[
          { label: 'Overview', icon: LayoutGrid, view: 'dashboard' },
          { label: 'Form Projects', icon: FormInput, view: 'projects' },
          { label: 'Team Workflow', icon: Workflow, view: 'workflow' },
          { label: 'Data Insights', icon: Activity, view: 'insights' },
          { label: 'Integrations', icon: Database, view: 'integrations' },
          { label: 'Team Members', icon: Users, view: 'team' },
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
          <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Usage Credits</div>
          <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden mb-2">
            <div className="h-full bg-primary w-3/4"></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold">
            <span>1.2k / 1.5k</span>
            <span className="text-primary cursor-pointer hover:underline">UPGRADE</span>
          </div>
        </div>
        <button 
          onClick={() => setView('landing')}
          className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all font-medium text-sm"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Site
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
        <button onClick={() => showNotification('No new notifications')} className="p-2 hover:bg-surface rounded-full text-on-surface-variant relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
        <div className="relative group">
          <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input 
            type="text" 
            placeholder="Search console..."
            className="bg-surface pl-10 pr-4 py-2 rounded-full text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
          />
        </div>
        <div className="w-px h-6 bg-outline-variant"></div>
        <img 
          src="https://picsum.photos/seed/profile/100/100" 
          className="w-8 h-8 rounded-full ring-2 ring-primary/10 cursor-pointer hover:ring-primary/30 transition-all border border-outline-variant" 
          alt="Profile"
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
      label: `New ${type} field`,
      required: false,
      placeholder: type === 'text' ? 'Enter text...' : undefined,
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined,
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

  const selectedField = formFields.find(f => f.id === selectedFieldId);

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
            <span className="font-bold text-lg tracking-tight">JSON Definition</span>
          </div>
          <button onClick={() => setIsSchemaVisible(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-1 bg-on-surface text-surface-container-low font-mono text-xs leading-relaxed">
          <pre>{JSON.stringify({
            formTitle: "Onboarding Schema",
            version: "2.0.4-draft",
            fields: formFields
          }, null, 2)}</pre>
        </div>
        <div className="p-6 border-t border-outline-variant bg-surface flex justify-end gap-3">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(formFields));
              showNotification('Schema copied to clipboard');
            }}
            className="px-6 py-2 border border-outline-variant rounded-xl text-xs font-bold hover:bg-white transition-all"
          >
            Copy JSON
          </button>
          <button 
            onClick={() => setIsSchemaVisible(false)}
            className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Sub-Views Components
  const ProjectsView = () => (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tighter">Form Projects</h2>
          <p className="text-sm text-on-surface-variant font-medium">Manage your active schemas and deployment pipelines</p>
        </div>
        <button 
          onClick={() => setView('editor')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Project
        </button>
      </div>

      <div className="sleek-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Project Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Responses</th>
              <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Last Updated</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {mockProjects.map((project) => (
              <tr key={project.id} className="hover:bg-surface/50 transition-colors group">
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
                    {project.status}
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
    </div>
  );

  const WorkflowView = () => (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tighter">Automations</h2>
          <p className="text-sm text-on-surface-variant font-medium">Define logic triggers and third-party webhooks</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all">
          <Workflow className="w-4 h-4" /> Design Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: 'Slack Notification', trigger: 'On form submission', status: 'Active', icon: Globe },
          { title: 'Email Auto-responder', trigger: 'On user validation', status: 'Paused', icon: Mail }, // Note: Mail is not imported, let's use Database
          { title: 'CRM Sync', trigger: 'On field change', status: 'Active', icon: Database },
        ].map((flow, i) => (
          <div key={i} className="sleek-card p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-primary border border-outline-variant">
              <flow.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-bold">{flow.title}</h4>
                <span className={`text-[10px] font-bold ${flow.status === 'Active' ? 'text-green-600' : 'text-outline'}`}>{flow.status}</span>
              </div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mt-1">Trigger: {flow.trigger}</p>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-surface rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors">Configure</button>
                <button className="px-4 py-2 border border-outline-variant rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-surface transition-colors">Logs</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const InsightsView = () => (
    <div className="p-8 space-y-8 max-w-7xl">
       <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tighter">Data Engine</h2>
          <p className="text-sm text-on-surface-variant font-medium">Real-time telemetrics and submission analytics</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-on-surface text-white rounded-xl font-bold text-sm transition-all hover:opacity-90">
          <Share2 className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { l: 'Mean Completion Time', v: '2.4m', t: '-12%' },
          { l: 'Drop-off Rate', v: '18.4%', t: '+2.1%' },
          { l: 'Peak Load Time', v: '44ms', t: '-4ms' },
          { l: 'Unique Handshakes', v: '4.2k', t: '+800' },
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
         <h4 className="font-bold text-xl">Advanced Visualization Engine</h4>
         <p className="text-sm text-on-surface-variant max-w-md">Customize your reporting dashboard with heatmaps, funnel charts, and geo-location metrics in our Pro plan.</p>
         <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20">Expand Insights</button>
      </div>
    </div>
  );

  const IntegrationsView = () => (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tighter">Integrations</h2>
        <p className="text-sm text-on-surface-variant font-medium">Connect Architect to your existing tech stack</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Slack', desc: 'Instant alerts in your channels', connected: true },
          { name: 'Zapier', desc: 'Connect to 5,000+ other apps', connected: false },
          { name: 'Google Sheets', desc: 'Export responses automatically', connected: true },
          { name: 'Salesforce', desc: 'Sync leads to your CRM', connected: false },
          { name: 'Segment', desc: 'Stream events to your data platform', connected: false },
          { name: 'Webhooks', desc: 'Custom HTTP event triggers', connected: true },
        ].map((app) => (
          <div key={app.name} className="sleek-card p-6 flex flex-col gap-4 group hover:border-primary transition-all">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-on-surface-variant border border-outline-variant font-bold text-lg">
                {app.name[0]}
              </div>
              {app.connected ? (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">Connected</span>
              ) : (
                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Connect</button>
              )}
            </div>
            <div>
              <h5 className="font-bold tracking-tight">{app.name}</h5>
              <p className="text-xs text-on-surface-variant mt-1">{app.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TeamView = () => (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tighter">Team Members</h2>
          <p className="text-sm text-on-surface-variant font-medium">Manage access controls and collaborative permissions</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg">
          <Users className="w-4 h-4" /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'You (Architect)', role: 'Admin', email: 'stack.zsx@gmail.com', img: 'profile' },
          { name: 'Sarah Chen', role: 'Editor', email: 'sarah@architect.io', img: 'user1' },
          { name: 'Michael Beck', role: 'Viewer', email: 'm.beck@architect.io', img: 'user2' },
        ].map(user => (
          <div key={user.email} className="sleek-card p-6 flex flex-col gap-4">
             <div className="flex items-center gap-4">
               <img src={`https://picsum.photos/seed/${user.img}/100/100`} className="w-12 h-12 rounded-full border border-outline-variant" referrerPolicy="no-referrer" />
               <div>
                  <h6 className="font-bold text-sm">{user.name}</h6>
                  <p className="text-[10px] text-outline font-bold tracking-widest uppercase">{user.role}</p>
               </div>
             </div>
             <div className="p-3 bg-surface rounded-xl flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface-variant break-all">{user.email}</span>
                <Settings className="w-3 h-3 text-outline cursor-pointer hover:text-black transition-colors" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'editor') {
    return (
      <div className="flex h-screen bg-surface overflow-hidden text-on-surface">
        {/* Editor Sidebar - Components */}
        <aside className="w-72 bg-white border-r border-outline-variant flex flex-col shrink-0 text-on-surface select-none">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <button 
              onClick={() => setView('dashboard')}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold tracking-tight">Form Designer</span>
            <div className="w-9"></div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-4">Basic Fields</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'text', icon: Type, label: 'Text' },
                  { type: 'textarea', icon: LayoutGrid, label: 'Area' },
                  { type: 'number', icon: Activity, label: 'Number' },
                  { type: 'date', icon: Calendar, label: 'Date' },
                  { type: 'select', icon: Menu, label: 'Select' },
                  { type: 'checkbox', icon: CheckSquare, label: 'Check' },
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

            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold tracking-tight">AI Assist Available</span>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed font-medium">
                Describe your form goals to generate fields instantly with Gemini integration.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 flex flex-col min-w-0 bg-surface">
          <header className="h-16 sleek-glass px-8 flex items-center justify-between border-b border-outline-variant">
            <div className="flex items-center gap-4">
              <h2 className="font-bold tracking-tight">Onboarding Schema</h2>
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">Draft</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-surface-container-high rounded-lg p-1 mr-4 border border-outline-variant">
                <button 
                  onClick={() => setIsPreview(false)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${!isPreview ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <Code className="w-3 h-3" /> Designer
                </button>
                <button 
                  onClick={() => setIsPreview(true)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${isPreview ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
                <Save className="w-3 h-3" /> Publish
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-12 canvas-grid">
            <div className="max-w-2xl mx-auto">
              {!isPreview ? (
                <div className="space-y-4 pb-20">
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
                          {field.placeholder || "No placeholder"} • {field.required ? "Required" : "Optional"}
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                  <button 
                    onClick={() => addField('text')}
                    className="w-full border-2 border-dashed border-outline-variant rounded-2xl py-12 flex flex-col items-center gap-2 text-outline hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group lg:scale-100 active:scale-95"
                  >
                    <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-bold">Append New Field</span>
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="sleek-card p-12 shadow-2xl bg-white border-2 border-outline-variant"
                >
                  <h2 className="text-3xl font-extrabold tracking-tighter mb-8">Onboarding Schema</h2>
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
                    <button className="w-full bg-primary text-white py-4 rounded-xl text-sm font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all">
                      Submit Response
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 bg-white border-l border-outline-variant flex flex-col shrink-0 text-on-surface select-none">
          <div className="p-6 border-b border-outline-variant flex items-center gap-2">
            <Settings className="w-4 h-4 text-outline" />
            <span className="font-bold tracking-tight">Properties</span>
          </div>

          {selectedField ? (
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Field Label</label>
                <input 
                  type="text" 
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>

              {selectedField.placeholder !== undefined && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Placeholder</label>
                  <input 
                    type="text" 
                    value={selectedField.placeholder}
                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant">
                <span className="text-xs font-bold transition-all">Required Field</span>
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
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Options</label>
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
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/30">
              <div className="w-16 h-16 bg-white border border-outline-variant rounded-full flex items-center justify-center mb-4 shadow-sm">
                <MousePointer2 className="w-6 h-6 text-outline" />
              </div>
              <p className="text-sm text-on-surface-variant font-bold tracking-tight">
                Select a component to configure properties
              </p>
              <p className="text-[10px] text-outline font-medium mt-1">
                Click any field on the central canvas
              </p>
            </div>
          )}

          <div className="p-6 border-t border-outline-variant bg-surface-container-low/50">
             <button 
               onClick={() => setIsSchemaVisible(true)}
               className="w-full bg-on-surface text-white py-3 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
             >
               <Code className="w-3 h-3" /> View JSON Schema
             </button>
          </div>
        </aside>

        <AnimatePresence>
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

  if (view === 'projects') return <ConsoleLayout viewToken="projects" title="Projects" subtitle="Total 4 forms, 2 deployed"><ProjectsView /></ConsoleLayout>;
  if (view === 'workflow') return <ConsoleLayout viewToken="workflow" title="Infrastructure Workflow" subtitle="Orchestrate form data logic"><WorkflowView /></ConsoleLayout>;
  if (view === 'insights') return <ConsoleLayout viewToken="insights" title="Data Insights" subtitle="Deep telemetry analysis"><InsightsView /></ConsoleLayout>;
  if (view === 'integrations') return <ConsoleLayout viewToken="integrations" title="Cloud Integrations" subtitle="Third-party service connectivity"><IntegrationsView /></ConsoleLayout>;
  if (view === 'team') return <ConsoleLayout viewToken="team" title="Workspace Team" subtitle="Manage collaborative access"><TeamView /></ConsoleLayout>;

  if (view === 'dashboard') {
    return (
      <ConsoleLayout 
        viewToken="dashboard" 
        title="Welcome back, Architect" 
        subtitle="System status is operational • 4 active builds"
      >
        <div className="p-8 space-y-8 max-w-7xl">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Active Respondants', value: '12,540', trend: '↑ 12.5%', color: 'text-primary' },
              { label: 'Total Deployments', value: '452', trend: '↑ 8.2%', color: 'text-secondary' },
              { label: 'API Handshakes', value: '89.4k', trend: '↑ 24.1%', color: 'text-green-500' },
            ].map((stat) => (
              <div key={stat.label} className="sleek-card p-6 flex flex-col gap-2 group transition-transform hover:-translate-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tighter">{stat.value}</span>
                  <span className={`text-[10px] font-bold ${stat.color}`}>{stat.trend}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant flex items-center justify-between">
                  <span className="text-[10px] font-medium text-outline">Last 30 days</span>
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
                <h3 className="font-bold">Form Submission Velocity</h3>
                <div className="flex bg-surface rounded-lg p-1 gap-1 border border-outline-variant">
                  {['1H', '1D', '1W', '1M'].map((t) => (
                    <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${t === '1W' ? 'bg-white shadow-sm text-primary shadow-lg shadow-primary/5' : 'text-outline hover:text-on-surface'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-64 flex items-end gap-2 px-4 pt-8">
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
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
            </div>

            {/* Activity List */}
            <div className="sleek-card p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Live Deployments</h3>
                <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div className="space-y-6">
                {[
                  { user: 'Chen', action: 'merged onboarding_schema_v2', time: '2h ago', status: 'SUCCESS' },
                  { user: 'Sarah', action: 'added 3 validation triggers', time: '4h ago', status: 'PENDING' },
                  { user: 'Heidi', action: 'exported API telemetry', time: '6h ago', status: 'SUCCESS' },
                  { user: 'System', action: 'auto-scaling applied: node_04', time: '12h ago', status: 'ACTIVE' },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer hover:bg-surface/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                    <div className="relative">
                      <img 
                        src={`https://picsum.photos/seed/user${i}/100/100`} 
                        className="w-8 h-8 rounded-full border border-outline-variant group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                        referrerPolicy="no-referrer"
                        alt="Avatar"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${activity.status === 'SUCCESS' ? 'bg-green-500' : 'bg-primary'}`}></div>
                    </div>
                    <div className="flex-1">
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
                onClick={() => showNotification('Audit logs initialized')}
                className="mt-2 w-full py-3 rounded-xl border border-outline-variant text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                View Full Audit Log
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-20">
            {[
              { title: 'New Form', desc: 'Start with blank canvas', icon: FormInput, action: () => setView('editor') },
              { title: 'Templates', desc: 'Browse enterprise library', icon: LayoutGrid, action: () => setView('editor') },
              { title: 'Import', desc: 'Upload legacy JSON/CSV', icon: Database, action: () => showNotification('Integrate external data source') },
              { title: 'Webhooks', desc: 'Manage event triggers', icon: Workflow, action: () => setView('workflow') },
            ].map((action) => (
              <button 
                key={action.title} 
                onClick={action.action}
                className="sleek-card p-5 hover:border-primary border-2 border-transparent transition-all text-left flex flex-col gap-1 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity">
                  <action.icon className="w-12 h-12 rotate-12" />
                </div>
                <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/5 transition-colors">
                  <action.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-sm font-bold tracking-tight">{action.title}</div>
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
              <span className="font-bold text-xl tracking-tighter">Architect</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
              <a href="#" className="hover:text-primary transition-colors">Resources</a>
              <a href="#" className="hover:text-primary transition-colors">Enterprise</a>
              <a href="#" className="hover:text-primary transition-colors">Pricing</a>
              <button 
                onClick={() => setView('dashboard')}
                className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/20"
              >
                Go to Console
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
              <a href="#" className="text-lg font-medium">Resources</a>
              <a href="#" className="text-lg font-medium">Enterprise</a>
              <a href="#" className="text-lg font-medium">Pricing</a>
              <button 
                onClick={() => setView('dashboard')}
                className="w-full bg-primary text-white p-3 rounded-md"
              >
                Go to Console
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
                New: Workflow Automation Engine
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.05] tracking-tighter mb-8">
                Build forms that <br />
                <span className="text-secondary">power infrastructure.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-on-surface-variant mb-10 leading-relaxed">
                Architect is the enterprise-grade form builder for complex workflows, 
                high-volume data capture, and deep infrastructure integration.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => setView('dashboard')}
                  className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
                >
                  Start Building Free
                </button>
                <button className="bg-white text-on-surface border border-outline-variant px-8 py-4 rounded-xl text-lg font-bold hover:bg-surface-container-low transition-all">
                  Request a Demo
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
                  Launch Live Preview <ChevronRight className="w-4 h-4" />
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
                    <div className="font-bold">Schema Validation</div>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium">
                    Real-time JSON schema generation with automated type verification across your stack.
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
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Architectural Foundation</h2>
              <p className="text-on-surface-variant text-lg">Engineered for teams that demand precision and reliability.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="sleek-card p-8 group cursor-default">
                <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Enterprise Security</h3>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed font-medium">
                  SOC2 Type II compliant with end-to-end encryption and fine-grained access controls.
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
                <h3 className="text-xl font-bold mb-3 tracking-tight">Infinite Integration</h3>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed font-medium">
                  Connect to SQL, NoSQL, and internal REST/GraphQL APIs with zero custom code required.
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
                <h3 className="text-xl font-bold mb-3 tracking-tight">Logic at Scale</h3>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed font-medium">
                  Dynamic conditional logic that performs instantly even with thousands of fields.
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
                    CASE STUDY: TELCO GLOBAL
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight tracking-tight">
                    Reduced onboarding friction by 74% across 12 countries.
                  </h2>
                  <p className="text-on-surface-variant text-lg mb-10 font-medium">
                    "Architect allowed us to unify our global onboarding process while maintaining 
                    strict local regulatory compliance via dynamic data routing."
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
                      <div className="text-sm text-on-surface-variant font-medium">Chief Strategy Officer</div>
                    </div>
                  </div>
                </div>
                <div className="relative px-4">
                  <div className="bg-surface p-8 rounded-2xl border border-outline-variant transform -rotate-1 shadow-inner">
                    <div className="space-y-4">
                      {['User Validation', 'API Response', 'Logic Trigger', 'Security Handshake'].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 bg-white rounded-lg border border-outline-variant shadow-sm">
                          <span className="text-sm font-semibold">{item}</span>
                          <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold">READY</span>
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
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Build your first form in minutes.</h2>
            <p className="text-on-surface-variant text-lg mb-10 font-medium">No commitment, no credit card required.</p>
            <button className="bg-primary text-white flex items-center gap-2 px-10 py-5 rounded-xl text-xl font-bold mx-auto hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1">
              Get Started for Free <ChevronRight className="w-5 h-5" />
            </button>
            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-12 text-sm text-on-surface-variant">
              <div className="space-y-4">
                <div className="font-bold text-on-surface uppercase tracking-widest text-xs">Product</div>
                <a href="#" className="block hover:text-primary">Features</a>
                <a href="#" className="block hover:text-primary">Integrations</a>
                <a href="#" className="block hover:text-primary">Enterprise</a>
              </div>
              <div className="space-y-4">
                <div className="font-bold text-on-surface uppercase tracking-widest text-xs">Platform</div>
                <a href="#" className="block hover:text-primary">Documentation</a>
                <a href="#" className="block hover:text-primary">API Reference</a>
                <a href="#" className="block hover:text-primary">Status</a>
              </div>
              <div className="space-y-4">
                <div className="font-bold text-on-surface uppercase tracking-widest text-xs">Company</div>
                <a href="#" className="block hover:text-primary">About Us</a>
                <a href="#" className="block hover:text-primary">Careers</a>
                <a href="#" className="block hover:text-primary">Contact</a>
              </div>
              <div className="space-y-4">
                <div className="font-bold text-on-surface uppercase tracking-widest text-xs">Social</div>
                <a href="#" className="block hover:text-primary">Twitter</a>
                <a href="#" className="block hover:text-primary">LinkedIn</a>
                <a href="#" className="block hover:text-primary">GitHub</a>
              </div>
            </div>
            <div className="mt-20 pt-10 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-outline font-medium">
              <div>© 2024 Architectural Software Inc. All rights reserved.</div>
              <div className="flex gap-8">
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArchitectApp;
