import React, { useState } from 'react';
import { Building2, Users, ShieldCheck, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { OrgNode, TeamMember, RoleDefinition } from './types';
import { OrgManagement } from './OrgManagement';
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';

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
  initialTab?: 'org' | 'users' | 'roles';
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
  initialTab = 'roles',
  showNotification
}) => {
  const [activeTab, setActiveTab] = useState<'org' | 'users' | 'roles'>(initialTab);

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-container-lowest overflow-hidden">
      {/* Top Main Navigation Bar for System Settings */}
      <div className="px-8 pt-4 pb-0 bg-white border-b border-outline-variant/60 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 pb-3">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-black text-on-surface">系统设置与权限中枢</h1>
              <p className="text-[10px] text-outline font-medium">独立组织、用户与细粒度权限控制系统</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'org', label: '1. 组织管理 (自建架构/表单CRUD)', icon: Building2, count: orgData.length },
              { id: 'users', label: '2. 用户管理 (自建体系/多维标签)', icon: Users, count: teamMembers.length },
              { id: 'roles', label: '3. 角色管理 (功能与数据权限)', icon: ShieldCheck, count: roles.length },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3.5 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-primary text-primary font-black'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-primary/10 text-primary' : 'bg-surface text-outline'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 pb-3">
          <span className="text-[11px] font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            独立自建权限引擎运行中
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
      </div>
    </div>
  );
};
