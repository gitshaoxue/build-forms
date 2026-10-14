import React, { useState } from 'react';
import { Building2, Users, ShieldCheck, ChevronLeft, SlidersHorizontal, CheckCircle2, X, Menu as MenuIcon } from 'lucide-react';
import { OrgNode, TeamMember, RoleDefinition } from './types';
import { OrgManagement } from './OrgManagement';
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';
import { MenuManagement } from './MenuManagement';

export interface SystemSettingsViewProps {
  teamMembers: TeamMember[];
  orgData: OrgNode[];
  roles: RoleDefinition[];
  setRoles: React.Dispatch<React.SetStateAction<RoleDefinition[]>>;
  onAddMember: (member: Omit<TeamMember, 'id' | 'createdAt'>) => void;
  onUpdateMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  onAddDept: (parentId: string | null, name: string, extra?: Partial<OrgNode>) => void;
  onUpdateDept: (id: string, name: string, extra?: Partial<OrgNode>) => void;
  onDeleteDept: (id: string) => void;
  savedForms: Array<{ id: string; name: string; category?: string }>;
  formFieldsMap: Record<string, Array<{ id: string; label: string; type: string }>>;
  initialTab?: 'org' | 'users' | 'roles' | 'menus';
  onTabChange?: (tab: 'org' | 'users' | 'roles' | 'menus') => void;
  showNotification?: (text: string) => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  teamMembers,
  orgData,
  roles,
  setRoles,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onAddDept,
  onUpdateDept,
  onDeleteDept,
  savedForms,
  formFieldsMap,
  initialTab = 'org',
  onTabChange,
  showNotification
}) => {
  const [activeTab, setActiveTab] = useState<'org' | 'users' | 'roles' | 'menus'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* Top Header Bar with Breadcrumb Tab Tag (Matching 1.3 / 1.5 screenshots: < [系统设置 ×]) */}
      <div className="px-6 py-2.5 bg-white border-b border-outline-variant/60 flex items-center justify-between shrink-0 shadow-xs select-none">
        <div className="flex items-center gap-4">
          {/* Breadcrumb Tag: < 系统设置 x */}
          <div className="flex items-center gap-2">
            <button 
              type="button"
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-primary text-xs font-semibold rounded-md">
              <span>系统设置</span>
              <X className="w-3 h-3 hover:text-blue-900 cursor-pointer" />
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Sub-menu Tabs (组织管理 -> 用户管理 -> 角色管理 -> 菜单管理) */}
          <div className="flex items-center gap-1">
            {[
              { id: 'org', label: '组织管理', icon: Building2, count: orgData.length },
              { id: 'users', label: '用户管理', icon: Users, count: teamMembers.length },
              { id: 'roles', label: '角色管理', icon: ShieldCheck, count: roles.length },
              { id: 'menus', label: '菜单管理', icon: MenuIcon, count: 28 },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    onTabChange?.(tab.id as any);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            组织与权限中心已就绪
          </span>
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'org' && (
          <OrgManagement
            orgData={orgData}
            teamMembers={teamMembers}
            onAddDept={onAddDept}
            onUpdateDept={onUpdateDept}
            onDeleteDept={onDeleteDept}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'users' && (
          <UserManagement
            teamMembers={teamMembers}
            orgData={orgData}
            roles={roles}
            onAddMember={onAddMember}
            onUpdateMember={onUpdateMember}
            onDeleteMember={onDeleteMember}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'roles' && (
          <RoleManagement
            roles={roles}
            setRoles={setRoles}
            savedForms={savedForms}
            formFieldsMap={formFieldsMap}
            teamMembers={teamMembers}
            onUpdateMember={onUpdateMember}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'menus' && (
          <MenuManagement
            showNotification={showNotification}
          />
        )}
      </div>
    </div>
  );
};
