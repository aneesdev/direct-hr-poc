/**
 * Roles & Permissions Component
 * Handles Roles CRUD and Permission Assignment Matrix
 */

const RolePermissionsComponent = {
    template: `
        <div class="role-permissions-page">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="pi pi-users"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ roles.length }}</div>
                        <div class="stat-label">Total Roles</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ activeRolesCount }}</div>
                        <div class="stat-label">Active Roles</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="pi pi-lock"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ permissionGroups.reduce((acc, g) => acc + g.permissions.length, 0) }}</div>
                        <div class="stat-label">Total Permissions</div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="settings-tabs">
                <p-tabs :value="activeTab">
                    <p-tablist>
                        <p-tab value="roles" @click="activeTab = 'roles'">Roles</p-tab>
                        <p-tab value="assign" @click="activeTab = 'assign'">Assign</p-tab>
                    </p-tablist>

                    <p-tabpanels>
                        <!-- Roles Tab -->
                        <p-tabpanel value="roles">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-users"></i>
                                        Roles Management
                                    </div>
                                    <div class="card-subtitle">Manage user roles and their descriptions</div>
                                </div>
                                <p-button label="Add Role" icon="pi pi-plus" @click="openRoleDialog()"></p-button>
                            </div>

                            <p-datatable :value="roles" striped-rows paginator :rows="10">
                                <p-column header="Role" sortable>
                                    <template #body="slotProps">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <div class="role-icon" :style="{ background: slotProps.data.color + '20', color: slotProps.data.color }">
                                                <i class="pi pi-user"></i>
                                            </div>
                                            <div>
                                                <div style="font-weight: 600;">{{ slotProps.data.name }}</div>
                                                <div style="font-size: 0.8rem; color: var(--text-color-secondary);">{{ slotProps.data.description }}</div>
                                            </div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Permissions">
                                    <template #body="slotProps">
                                        <p-tag :value="getRolePermissionCount(slotProps.data.id) + ' assigned'" severity="secondary"></p-tag>
                                    </template>
                                </p-column>
                                <p-column header="Status">
                                    <template #body="slotProps">
                                        <p-tag :value="slotProps.data.active ? 'Active' : 'Inactive'" 
                                               :severity="slotProps.data.active ? 'success' : 'danger'"></p-tag>
                                    </template>
                                </p-column>
                                <p-column header="Actions" style="width: 100px;">
                                    <template #body="slotProps">
                                        <p-button icon="pi pi-pencil" text rounded @click="editRole(slotProps.data)"></p-button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>

                        <!-- Assign Tab -->
                        <p-tabpanel value="assign">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-th-large"></i>
                                        Permission Assignment
                                    </div>
                                    <div class="card-subtitle">Assign permissions to roles</div>
                                </div>
                                <p-button label="Save Changes" icon="pi pi-save" @click="savePermissions" :disabled="!hasChanges"></p-button>
                            </div>

                            <p-datatable :value="flatPermissions" row-group-mode="subheader" group-rows-by="groupName" 
                                         class="permissions-table">
                                <p-column field="name" header="Permissions" class="sticky-col" style="min-width: 280px;">
                                    <template #body="slotProps">
                                        <div class="permission-info">
                                            <div class="permission-name">{{ slotProps.data.name }}</div>
                                            <div class="permission-desc">{{ slotProps.data.description }}</div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column v-for="role in activeRoles" :key="'col-' + role.id" :field="'role_' + role.id" style="width: 110px; min-width: 110px;">
                                    <template #header>
                                        <div class="role-header">
                                            <div class="role-dot" :style="{ background: role.color }"></div>
                                            <span>{{ role.name }}</span>
                                        </div>
                                    </template>
                                    <template #body="slotProps">
                                        <p-button 
                                            :icon="hasPermission(role.id, slotProps.data.id) ? 'pi pi-check' : 'pi pi-times'"
                                            :outlined="!hasPermission(role.id, slotProps.data.id)"
                                            rounded
                                            size="small"
                                            @click="togglePermission(role.id, slotProps.data.id)">
                                        </p-button>
                                    </template>
                                </p-column>
                                <template #groupheader="slotProps">
                                    <div class="permission-group-header">
                                        {{ slotProps.data.groupName }}
                                    </div>
                                </template>
                            </p-datatable>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>

            <!-- Role Dialog -->
            <p-dialog v-model:visible="roleDialogVisible" :header="isEditingRole ? 'Edit Role' : 'Add Role'" modal :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label>Role Name *</label>
                        <p-inputtext v-model="roleForm.name" placeholder="Enter role name" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <p-textarea v-model="roleForm.description" placeholder="Enter role description" rows="3" style="width: 100%;"></p-textarea>
                    </div>
                    <div class="form-group">
                        <label>Color</label>
                        <div class="color-options">
                            <button v-for="color in roleColors" :key="color" 
                                    class="color-option" 
                                    :class="{ 'selected': roleForm.color === color }"
                                    :style="{ background: color }"
                                    @click="roleForm.color = color">
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="roleForm.active"></p-toggleswitch>
                            <span>{{ roleForm.active ? 'Active' : 'Inactive' }}</span>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="secondary" @click="roleDialogVisible = false"></p-button>
                    <p-button :label="isEditingRole ? 'Update' : 'Create'" @click="saveRole"></p-button>
                </template>
            </p-dialog>
        </div>
    `,
    setup() {
        const { ref, computed } = Vue;

        const activeTab = ref('roles');

        const roleColors = [
            '#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899',
            '#14b8a6', '#f59e0b', '#ef4444', '#6366f1', '#06b6d4'
        ];

        const roles = ref([
            { id: 1, name: 'Employee', description: 'Standard employee access', color: '#6366f1', active: true },
            { id: 2, name: 'Payroll Specialist', description: 'Access to payroll management', color: '#f97316', active: true },
            { id: 3, name: 'HR Trainer', description: 'Training and development access', color: '#22c55e', active: true },
            { id: 4, name: 'HR Administrator', description: 'HR administrative functions', color: '#3b82f6', active: true },
            { id: 5, name: 'HR Manager', description: 'Full HR management access', color: '#8b5cf6', active: true },
            { id: 6, name: 'Line Manager', description: 'Team and direct reports management', color: '#14b8a6', active: true },
            { id: 7, name: 'Executive', description: 'Executive level access', color: '#ec4899', active: true },
            { id: 8, name: 'HR EVP', description: 'HR Executive Vice President', color: '#f59e0b', active: true },
            { id: 9, name: 'CEO', description: 'Chief Executive Officer - Full access', color: '#ef4444', active: true }
        ]);

        const permissionGroups = ref([
            {
                id: 'main',
                name: 'MAIN',
                permissions: [
                    { id: 'home', name: 'Home', description: 'Access to dashboard home' },
                    { id: 'employee_directory', name: 'Employee Directory', description: 'View company employee list' },
                    { id: 'my_profile', name: 'My Profile', description: 'Access to personal profile' },
                    { id: 'stats', name: 'Stats', description: 'View high-level statistics' },
                    { id: 'payroll', name: 'Payroll', description: 'Access to payroll management' }
                ]
            },
            {
                id: 'shift_attendance',
                name: 'SHIFT ATTENDANCE',
                permissions: [
                    { id: 'shift_scheduling', name: 'Shift Scheduling', description: 'Manage employee shift schedules' },
                    { id: 'weekly_shift_summary', name: 'Weekly Shift Summary', description: 'View weekly summary of shifts' },
                    { id: 'attendance', name: 'Attendance', description: 'Manage or view attendance records' }
                ]
            },
            {
                id: 'requests',
                name: 'REQUESTS',
                permissions: [
                    { id: 'new_request', name: 'New Request', description: 'Create a new request' },
                    { id: 'requests_tracker', name: 'Requests Tracker', description: 'Track status of requests' }
                ]
            },
            {
                id: 'hr_help_desk',
                name: 'HR HELP DESK',
                permissions: [
                    { id: 'new_hd_request', name: 'New HD Request', description: 'Submit a new help desk ticket' },
                    { id: 'request_hd_tracker', name: 'Request HD Tracker', description: 'Track help desk tickets' }
                ]
            },
            {
                id: 'training',
                name: 'TRAINING',
                permissions: [
                    { id: 'training_paths', name: 'Paths', description: 'View career development paths' },
                    { id: 'training_assign', name: 'Assign', description: 'Assign paths to employees' },
                    { id: 'training_tracking', name: 'Tracking', description: 'Track career path progress' }
                ]
            },
            {
                id: 'appraisals',
                name: 'APPRAISALS',
                permissions: [
                    { id: 'new_appraisal_cycle', name: 'New Appraisal Cycle', description: 'Start a new performance review cycle' },
                    { id: 'appraisals_tracking', name: 'Appraisals Tracking', description: 'Monitor appraisal progress' },
                    { id: 'appraisals_results', name: 'Appraisals Results', description: 'View final appraisal scores' }
                ]
            },
            {
                id: 'hr_management',
                name: 'HR MANAGEMENT',
                permissions: [
                    { id: 'employees', name: 'Employees', description: 'Manage employee records' },
                    { id: 'company_news', name: 'Company News', description: 'Manage company announcements' },
                    { id: 'directory_documents', name: 'Directory Documents', description: 'Manage shared directory documents' },
                    { id: 'orders_requests_settings', name: 'Orders Requests Settings', description: 'Configure order request workflows' },
                    { id: 'help_desk_requests_settings', name: 'Help Desk Requests Settings', description: 'Configure help desk workflows' },
                    { id: 'employee_documents', name: 'Employee Documents', description: 'Manage individual employee documents' }
                ]
            },
            {
                id: 'settings',
                name: 'SETTINGS',
                permissions: [
                    { id: 'main_company_settings', name: 'Main Company Settings', description: 'Global company configuration' },
                    { id: 'hr_help_desk_settings', name: 'HR Help Desk Settings', description: 'Global help desk configuration' }
                ]
            },
            {
                id: 'others',
                name: 'OTHERS',
                permissions: [
                    { id: 'splits_in_profile', name: 'Splits in Profile Page', description: 'View split details in employee profiles' },
                    { id: 'view_more_details_profile', name: 'View More Details in Profile Page', description: 'View extended employee details in profiles' },
                    { id: 'payroll_in_stats', name: 'Payroll in Stats', description: 'View payroll metrics in statistics' },
                    { id: 'general_filter_crud', name: 'General Filter CRUD', description: 'Manage general filters' },
                    { id: 'line_manager_crud', name: 'Line Manager CRUD', description: 'Manage line manager assignments' }
                ]
            }
        ]);

        // Permission assignments: { roleId: [permissionId, permissionId, ...] }
        const rolePermissions = ref({
            1: ['home', 'employee_directory', 'my_profile', 'new_request', 'requests_tracker', 'new_hd_request', 'request_hd_tracker', 'training_paths', 'training_tracking'],
            2: ['home', 'employee_directory', 'my_profile', 'stats', 'payroll', 'new_request', 'requests_tracker', 'new_hd_request', 'request_hd_tracker', 'payroll_in_stats'],
            3: ['home', 'employee_directory', 'my_profile', 'stats', 'new_request', 'requests_tracker', 'new_hd_request', 'request_hd_tracker', 'training_paths', 'training_assign', 'training_tracking'],
            4: ['home', 'employee_directory', 'my_profile', 'stats', 'payroll', 'shift_scheduling', 'weekly_shift_summary', 'attendance', 'new_request', 'requests_tracker', 'new_hd_request', 'request_hd_tracker', 'training_paths', 'training_assign', 'training_tracking', 'new_appraisal_cycle', 'appraisals_tracking', 'appraisals_results', 'employees', 'company_news', 'directory_documents', 'orders_requests_settings', 'help_desk_requests_settings', 'employee_documents', 'splits_in_profile', 'general_filter_crud'],
            5: ['home', 'employee_directory', 'my_profile', 'stats', 'payroll', 'shift_scheduling', 'weekly_shift_summary', 'attendance', 'new_request', 'requests_tracker', 'new_hd_request', 'request_hd_tracker', 'training_paths', 'training_assign', 'training_tracking', 'new_appraisal_cycle', 'appraisals_tracking', 'appraisals_results', 'employees', 'company_news', 'directory_documents', 'orders_requests_settings', 'help_desk_requests_settings', 'employee_documents', 'main_company_settings', 'hr_help_desk_settings', 'splits_in_profile', 'payroll_in_stats', 'general_filter_crud', 'line_manager_crud'],
            6: ['home', 'employee_directory', 'my_profile', 'stats', 'shift_scheduling', 'weekly_shift_summary', 'attendance', 'new_request', 'requests_tracker', 'new_hd_request', 'request_hd_tracker', 'training_paths', 'training_assign', 'training_tracking', 'appraisals_tracking', 'appraisals_results', 'line_manager_crud'],
            7: ['home', 'employee_directory', 'my_profile', 'stats', 'payroll', 'shift_scheduling', 'weekly_shift_summary', 'attendance', 'new_request', 'requests_tracker', 'new_hd_request', 'request_hd_tracker', 'appraisals_results', 'payroll_in_stats'],
            8: ['home', 'employee_directory', 'my_profile', 'stats', 'payroll', 'shift_scheduling', 'weekly_shift_summary', 'attendance', 'new_request', 'requests_tracker', 'new_hd_request', 'request_hd_tracker', 'training_paths', 'training_assign', 'training_tracking', 'new_appraisal_cycle', 'appraisals_tracking', 'appraisals_results', 'employees', 'company_news', 'directory_documents', 'orders_requests_settings', 'help_desk_requests_settings', 'employee_documents', 'main_company_settings', 'hr_help_desk_settings', 'splits_in_profile', 'payroll_in_stats', 'general_filter_crud', 'line_manager_crud'],
            9: ['home', 'employee_directory', 'my_profile', 'stats', 'payroll', 'shift_scheduling', 'weekly_shift_summary', 'attendance', 'new_request', 'requests_tracker', 'new_hd_request', 'request_hd_tracker', 'training_paths', 'training_assign', 'training_tracking', 'new_appraisal_cycle', 'appraisals_tracking', 'appraisals_results', 'employees', 'company_news', 'directory_documents', 'orders_requests_settings', 'help_desk_requests_settings', 'employee_documents', 'main_company_settings', 'hr_help_desk_settings', 'splits_in_profile', 'payroll_in_stats', 'general_filter_crud', 'line_manager_crud']
        });

        const originalPermissions = ref(JSON.parse(JSON.stringify(rolePermissions.value)));

        const activeRolesCount = computed(() => roles.value.filter(r => r.active).length);
        const activeRoles = computed(() => roles.value.filter(r => r.active));

        const flatPermissions = computed(() => {
            const result = [];
            permissionGroups.value.forEach(group => {
                group.permissions.forEach(perm => {
                    result.push({
                        ...perm,
                        groupName: group.name
                    });
                });
            });
            return result;
        });

        const hasChanges = computed(() => {
            return JSON.stringify(rolePermissions.value) !== JSON.stringify(originalPermissions.value);
        });

        const getRolePermissionCount = (roleId) => {
            return rolePermissions.value[roleId]?.length || 0;
        };

        const hasPermission = (roleId, permId) => {
            return rolePermissions.value[roleId]?.includes(permId) || false;
        };

        const togglePermission = (roleId, permId) => {
            if (!rolePermissions.value[roleId]) {
                rolePermissions.value[roleId] = [];
            }
            const idx = rolePermissions.value[roleId].indexOf(permId);
            if (idx > -1) {
                rolePermissions.value[roleId].splice(idx, 1);
            } else {
                rolePermissions.value[roleId].push(permId);
            }
        };

        const savePermissions = () => {
            originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value));
            alert('Permissions saved successfully!');
        };

        // Role Dialog
        const roleDialogVisible = ref(false);
        const isEditingRole = ref(false);
        const editingRoleId = ref(null);
        const roleForm = ref({
            name: '',
            description: '',
            color: '#6366f1',
            active: true
        });

        const openRoleDialog = () => {
            isEditingRole.value = false;
            editingRoleId.value = null;
            roleForm.value = {
                name: '',
                description: '',
                color: '#6366f1',
                active: true
            };
            roleDialogVisible.value = true;
        };

        const editRole = (role) => {
            isEditingRole.value = true;
            editingRoleId.value = role.id;
            roleForm.value = { ...role };
            roleDialogVisible.value = true;
        };

        const saveRole = () => {
            if (!roleForm.value.name.trim()) {
                alert('Role name is required');
                return;
            }

            if (isEditingRole.value) {
                const idx = roles.value.findIndex(r => r.id === editingRoleId.value);
                if (idx > -1) {
                    roles.value[idx] = { ...roleForm.value, id: editingRoleId.value };
                }
            } else {
                const newId = Math.max(...roles.value.map(r => r.id)) + 1;
                roles.value.push({ ...roleForm.value, id: newId });
                rolePermissions.value[newId] = [];
            }

            roleDialogVisible.value = false;
        };

        return {
            activeTab,
            roles,
            roleColors,
            permissionGroups,
            flatPermissions,
            rolePermissions,
            activeRolesCount,
            activeRoles,
            hasChanges,
            getRolePermissionCount,
            hasPermission,
            togglePermission,
            savePermissions,
            roleDialogVisible,
            isEditingRole,
            roleForm,
            openRoleDialog,
            editRole,
            saveRole
        };
    }
};
