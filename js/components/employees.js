/**
 * Employees Component
 * Handles employee listing and management
 * Statuses: Draft (steps 1-4), Onboarding (steps 5-6), Active (step 7), Non-active (terminated)
 */

const EmployeesComponent = {
    template: `
        <div class="employees-page">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="pi pi-users"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ totalEmployeeCount }}</div>
                        <div class="stat-label">Total Employees</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="pi pi-file-edit"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ draftCount }}</div>
                        <div class="stat-label">Draft</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon cyan">
                        <i class="pi pi-sync"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ onboardingStatusCount }}</div>
                        <div class="stat-label">Onboarding</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ activeCount }}</div>
                        <div class="stat-label">Active</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon gray">
                        <i class="pi pi-ban"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ nonActiveCount }}</div>
                        <div class="stat-label">Non-active</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="pi pi-chart-line"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ averageSla }} days</div>
                        <div class="stat-label">Average SLA</div>
                    </div>
                </div>
            </div>

            <!-- Employee List Card -->
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">
                            <i class="pi pi-users"></i>
                            Employee Directory
                        </div>
                        <div class="card-subtitle">Manage all employees in your organization</div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <p-button label="Export" icon="pi pi-download" outlined></p-button>
                        <p-button label="Add Employee" icon="pi pi-plus" @click="$emit('add-employee')"></p-button>
                    </div>
                </div>

                <!-- Step Filters -->
                <div class="step-filter-tabs">
                    <div class="step-filter-tab" :class="{ active: stepFilter === null && statusFilter === null }" @click="clearFilters">
                        All
                        <span class="step-filter-count">{{ activeEmployeeCount }}</span>
                    </div>
                    <div v-for="step in 7" :key="step" 
                         class="step-filter-tab" 
                         :class="{ active: stepFilter === step }"
                         @click="setStepFilter(step)">
                        Step {{ step }}
                        <span class="step-filter-count">{{ getStepCount(step) }}</span>
                    </div>
                    <div class="step-filter-tab" :class="{ active: statusFilter === 'Non-active' }" @click="setStatusFilter('Non-active')">
                        <i class="pi pi-ban" style="color: #94a3b8;"></i>
                        Non-active
                        <span class="step-filter-count">{{ nonActiveCount }}</span>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <span class="p-input-icon-left" style="flex: 1;">
                        <i class="pi pi-search"></i>
                        <p-inputtext v-model="searchQuery" placeholder="Search employees..." style="width: 100%;"></p-inputtext>
                    </span>
                    <p-select v-model="filterDepartment" :options="departmentOptions" placeholder="All Departments" showClear style="width: 200px;"></p-select>
                    <p-select v-model="filterEntity" :options="entityOptions" placeholder="All Entities" showClear style="width: 150px;"></p-select>
                    <p-select v-model="filterStatus" :options="statusOptions" placeholder="All Status" showClear style="width: 150px;"></p-select>
                </div>

                <!-- Employee Table -->
                <p-datatable :value="filteredEmployees" striped-rows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
                    <p-column header="Employee" sortable>
                        <template #body="slotProps">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <img :src="slotProps.data.avatar" :alt="slotProps.data.firstName" style="width: 40px; height: 40px; border-radius: 50%;">
                                <div>
                                    <div style="font-weight: 600;">{{ slotProps.data.firstName }} {{ slotProps.data.familyName }}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-color-secondary);">{{ slotProps.data.employeeNumber }}</div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column field="entity" header="Entity" sortable></p-column>
                    <p-column field="department" header="Department" sortable></p-column>
                    <p-column field="jobTitle" header="Job Title" sortable></p-column>
                    <p-column header="Progress" style="width: 180px;">
                        <template #body="slotProps">
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                    <span style="font-size: 0.75rem; color: var(--text-color-secondary);">
                                        Step {{ slotProps.data.completedSteps }}/{{ slotProps.data.totalSteps }}
                                    </span>
                                    <span style="font-size: 0.75rem; font-weight: 600;">{{ slotProps.data.progress }}%</span>
                                </div>
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" 
                                         :class="getProgressClass(slotProps.data)"
                                         :style="{ width: slotProps.data.progress + '%' }"></div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="SLA" sortable style="width: 100px;">
                        <template #body="slotProps">
                            <span v-if="slotProps.data.slaDays" class="sla-days-badge">
                                {{ slotProps.data.slaDays }}d
                            </span>
                            <span v-else class="sla-na">N/A</span>
                        </template>
                    </p-column>
                    <p-column header="Status" sortable>
                        <template #body="slotProps">
                            <span class="status-tag" :class="getStatusClass(slotProps.data.status)">
                                {{ slotProps.data.status }}
                            </span>
                        </template>
                    </p-column>
                    <p-column header="Actions" style="width: 120px">
                        <template #body="slotProps">
                            <div style="display: flex; gap: 0.25rem;">
                                <!-- Draft: Edit, Terminate -->
                                <template v-if="slotProps.data.status === 'Draft'">
                                    <button class="action-btn edit" title="Edit" @click="$emit('add-employee', slotProps.data)"><i class="pi pi-pencil"></i></button>
                                    <button class="action-btn delete" title="Terminate" @click="openTerminateDialog(slotProps.data)"><i class="pi pi-trash"></i></button>
                                </template>
                                <!-- Onboarding: Edit, View, Terminate -->
                                <template v-else-if="slotProps.data.status === 'Onboarding'">
                                    <button class="action-btn edit" title="Edit" @click="$emit('add-employee', slotProps.data)"><i class="pi pi-pencil"></i></button>
                                    <button class="action-btn" title="View Profile"><i class="pi pi-eye"></i></button>
                                    <button class="action-btn delete" title="Terminate" @click="openTerminateDialog(slotProps.data)"><i class="pi pi-trash"></i></button>
                                </template>
                                <!-- Active: View, Assign Roles, Terminate -->
                                <template v-else-if="slotProps.data.status === 'Active'">
                                    <button class="action-btn" title="View Profile"><i class="pi pi-eye"></i></button>
                                    <button class="action-btn" title="Assign Roles & Permissions" @click="openAssignDialog(slotProps.data)" style="color: var(--primary-color);"><i class="pi pi-key"></i></button>
                                    <button class="action-btn delete" title="Terminate" @click="openTerminateDialog(slotProps.data)"><i class="pi pi-trash"></i></button>
                                </template>
                                <!-- Non-active: View only -->
                                <template v-else>
                                    <button class="action-btn" title="View Profile"><i class="pi pi-eye"></i></button>
                                </template>
                            </div>
                        </template>
                    </p-column>
                </p-datatable>
            </div>

            <!-- Assign Roles & Permissions Dialog -->
            <p-dialog v-model:visible="showAssignDialog" header="Assign Roles & Permissions" :modal="true" :style="{ width: '550px' }">
                <div class="assign-dialog-content" v-if="selectedEmployeeForRoles">
                    <div class="terminate-employee-info" style="margin-bottom: 1.5rem;">
                        <img :src="selectedEmployeeForRoles.avatar" :alt="selectedEmployeeForRoles.firstName">
                        <div>
                            <strong>{{ selectedEmployeeForRoles.firstName }} {{ selectedEmployeeForRoles.familyName }}</strong>
                            <span>{{ selectedEmployeeForRoles.employeeNumber }} • {{ selectedEmployeeForRoles.jobTitle }}</span>
                        </div>
                    </div>

                    <div class="form-field" style="margin-bottom: 1.25rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Roles</label>
                        <p-multiselect v-model="selectedRoles" :options="rolesOptions" optionLabel="name" optionValue="id"
                                       placeholder="Select roles" style="width: 100%;" display="chip"></p-multiselect>
                    </div>

                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showAssignDialog = false"></p-button>
                    <p-button label="Assign" icon="pi pi-check" @click="assignRolesAndPermissions"></p-button>
                </template>
            </p-dialog>

            <!-- Termination Dialog -->
            <p-dialog v-model:visible="showTerminateDialog" header="Employee Termination" :modal="true" :style="{ width: '500px' }">
                <div class="terminate-dialog-content" v-if="employeeToTerminate">
                    <div class="terminate-employee-info">
                        <img :src="employeeToTerminate.avatar" :alt="employeeToTerminate.firstName">
                        <div>
                            <strong>{{ employeeToTerminate.firstName }} {{ employeeToTerminate.familyName }}</strong>
                            <span>{{ employeeToTerminate.employeeNumber }} • {{ employeeToTerminate.jobTitle }}</span>
                        </div>
                    </div>

                    <div class="form-field">
                        <label>Termination Reason <span class="required">*</span></label>
                        <p-select v-model="terminationForm.reason" :options="terminationReasons" 
                                  placeholder="Select reason" style="width: 100%;"></p-select>
                    </div>

                    <div class="terminate-checklist">
                        <label>Exit Checklist</label>
                        <div class="checklist-item">
                            <p-checkbox v-model="terminationForm.checklist.assetsReturned" :binary="true"></p-checkbox>
                            <span>Company assets returned (laptop, ID card, keys)</span>
                        </div>
                        <div class="checklist-item">
                            <p-checkbox v-model="terminationForm.checklist.accessRevoked" :binary="true"></p-checkbox>
                            <span>System access and credentials revoked</span>
                        </div>
                        <div class="checklist-item">
                            <p-checkbox v-model="terminationForm.checklist.finalSettlement" :binary="true"></p-checkbox>
                            <span>Final settlement processed</span>
                        </div>
                    </div>

                    <div class="terminate-warning">
                        <i class="pi pi-exclamation-triangle"></i>
                        <span>This action will mark the employee as Non-active and cannot be undone.</span>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showTerminateDialog = false"></p-button>
                    <p-button label="Confirm Termination" severity="danger" 
                              :disabled="!canTerminate" @click="confirmTermination"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    emits: ['add-employee'],

    setup() {
        const { ref, computed } = Vue;

        // Data
        const employees = ref([...StaticData.employees]);
        const searchQuery = ref('');
        const filterDepartment = ref(null);
        const filterEntity = ref(null);
        const filterStatus = ref(null);
        const stepFilter = ref(null);
        const statusFilter = ref(null);

        // Termination
        const showTerminateDialog = ref(false);
        const employeeToTerminate = ref(null);
        const terminationReasons = ref(['Resignation', 'Layoff', 'End of Contract']);
        const terminationForm = ref({
            reason: null,
            checklist: {
                assetsReturned: false,
                accessRevoked: false,
                finalSettlement: false
            }
        });

        // Assign Roles & Permissions
        const showAssignDialog = ref(false);
        const selectedEmployeeForRoles = ref(null);
        const selectedRoles = ref([]);
        const selectedPermissions = ref([]);
        
        // Roles options from role-permissions.js
        const rolesOptions = ref([
            { id: 1, name: 'Employee' },
            { id: 2, name: 'Payroll Specialist' },
            { id: 3, name: 'HR Trainer' },
            { id: 4, name: 'HR Administrator' },
            { id: 5, name: 'HR Manager' },
            { id: 6, name: 'Line Manager' },
            { id: 7, name: 'Executive' },
            { id: 8, name: 'HR EVP' },
            { id: 9, name: 'CEO' }
        ]);
        
        // Permissions options flattened from permission groups
        const permissionsOptions = ref([
            { id: 'home', name: 'Home' },
            { id: 'employee_directory', name: 'Employee Directory' },
            { id: 'my_profile', name: 'My Profile' },
            { id: 'stats', name: 'Stats' },
            { id: 'payroll', name: 'Payroll' },
            { id: 'shift_scheduling', name: 'Shift Scheduling' },
            { id: 'weekly_shift_summary', name: 'Weekly Shift Summary' },
            { id: 'attendance', name: 'Attendance' },
            { id: 'new_request', name: 'New Request' },
            { id: 'requests_tracker', name: 'Requests Tracker' },
            { id: 'new_hd_request', name: 'New Help Desk Request' },
            { id: 'request_hd_tracker', name: 'Help Desk Tracker' },
            { id: 'training_paths', name: 'Training Paths' },
            { id: 'training_assign', name: 'Assign Training' },
            { id: 'training_tracking', name: 'Training Tracking' },
            { id: 'new_appraisal_cycle', name: 'New Appraisal Cycle' },
            { id: 'appraisals_tracking', name: 'Appraisals Tracking' },
            { id: 'appraisals_results', name: 'Appraisals Results' },
            { id: 'employees', name: 'Employees' },
            { id: 'company_news', name: 'Company News' },
            { id: 'directory_documents', name: 'Directory Documents' },
            { id: 'orders_requests_settings', name: 'Orders Requests Settings' },
            { id: 'help_desk_requests_settings', name: 'Help Desk Requests Settings' },
            { id: 'employee_documents', name: 'Employee Documents' },
            { id: 'main_company_settings', name: 'Main Company Settings' },
            { id: 'hr_help_desk_settings', name: 'HR Help Desk Settings' },
            { id: 'splits_in_profile', name: 'Splits in Profile Page' },
            { id: 'view_more_details_profile', name: 'View More Details in Profile Page' },
            { id: 'payroll_in_stats', name: 'Payroll in Stats' },
            { id: 'general_filter_crud', name: 'General Filter CRUD' },
            { id: 'line_manager_crud', name: 'Line Manager CRUD' },
            { id: 'stats_attendance', name: 'Stats: Attendance' },
            { id: 'stats_payroll', name: 'Stats: Payroll' },
            { id: 'stats_requests', name: 'Stats: Requests' },
            { id: 'stats_demography', name: 'Stats: Demography' },
            { id: 'stats_hrdesk', name: 'Stats: HR Desk' },
            { id: 'stats_directory', name: 'Stats: Directory and Onboarding' },
            { id: 'stats_settings', name: 'Stats: Settings' },
            { id: 'stats_appraisal', name: 'Stats: Appraisal' },
            { id: 'stats_training', name: 'Stats: Training' }
        ]);

        // Options
        const departmentOptions = computed(() => StaticData.departments.map(d => d.name));
        const entityOptions = computed(() => StaticData.entities.map(e => e.name));
        const statusOptions = ref(['Draft', 'Onboarding', 'Active', 'Non-active']);

        // Computed counts
        const totalEmployeeCount = computed(() => employees.value.filter(e => e.status !== 'Non-active').length);
        const draftCount = computed(() => employees.value.filter(e => e.status === 'Draft').length);
        const onboardingStatusCount = computed(() => employees.value.filter(e => e.status === 'Onboarding').length);
        const activeCount = computed(() => employees.value.filter(e => e.status === 'Active').length);
        const nonActiveCount = computed(() => employees.value.filter(e => e.status === 'Non-active').length);
        const onboardingCount = computed(() => employees.value.filter(e => e.status === 'Draft' || e.status === 'Onboarding').length);

        // Average SLA calculation
        const averageSla = computed(() => {
            const completedEmployees = employees.value.filter(e => e.slaDays !== null && e.slaDays > 0);
            if (completedEmployees.length === 0) return 0;
            const totalDays = completedEmployees.reduce((sum, e) => sum + e.slaDays, 0);
            return Math.round(totalDays / completedEmployees.length);
        });

        // Get count per step (excluding Non-active)
        const getStepCount = (step) => {
            return employees.value.filter(e => e.completedSteps === step && e.status !== 'Non-active').length;
        };

        // Clear all filters
        const clearFilters = () => {
            stepFilter.value = null;
            statusFilter.value = null;
        };

        // Set step filter
        const setStepFilter = (step) => {
            stepFilter.value = step;
            statusFilter.value = null;
        };

        // Set status filter
        const setStatusFilter = (status) => {
            statusFilter.value = status;
            stepFilter.value = null;
        };

        const filteredEmployees = computed(() => {
            let result = employees.value;

            // By default, exclude Non-active unless specifically filtered
            if (statusFilter.value !== 'Non-active' && !filterStatus.value) {
                result = result.filter(e => e.status !== 'Non-active');
            }

            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(e =>
                    e.firstName.toLowerCase().includes(query) ||
                    e.familyName.toLowerCase().includes(query) ||
                    e.email.toLowerCase().includes(query) ||
                    e.employeeNumber.toLowerCase().includes(query)
                );
            }

            if (filterDepartment.value) {
                result = result.filter(e => e.department === filterDepartment.value);
            }

            if (filterEntity.value) {
                result = result.filter(e => e.entity === filterEntity.value);
            }

            if (filterStatus.value) {
                result = result.filter(e => e.status === filterStatus.value);
            }

            if (statusFilter.value) {
                result = employees.value.filter(e => e.status === statusFilter.value);
            }

            if (stepFilter.value !== null) {
                result = result.filter(e => e.completedSteps === stepFilter.value);
            }

            return result;
        });

        // Methods
        const getStatusClass = (status) => {
            const classes = {
                'Draft': 'draft',
                'Onboarding': 'onboarding',
                'Active': 'active',
                'Non-active': 'inactive'
            };
            return classes[status] || '';
        };

        const getProgressClass = (employee) => {
            if (employee.status === 'Active') return 'completed';
            if (employee.status === 'Non-active') return 'inactive';
            if (employee.slaStatus === 'overdue') return 'overdue';
            return 'pending';
        };

        // Termination methods
        const openTerminateDialog = (employee) => {
            employeeToTerminate.value = employee;
            terminationForm.value = {
                reason: null,
                checklist: {
                    assetsReturned: false,
                    accessRevoked: false,
                    finalSettlement: false
                }
            };
            showTerminateDialog.value = true;
        };

        const canTerminate = computed(() => {
            const form = terminationForm.value;
            return form.reason && 
                   form.checklist.assetsReturned && 
                   form.checklist.accessRevoked && 
                   form.checklist.finalSettlement;
        });

        const confirmTermination = () => {
            if (employeeToTerminate.value && canTerminate.value) {
                const index = employees.value.findIndex(e => e.id === employeeToTerminate.value.id);
                if (index !== -1) {
                    employees.value[index].status = 'Non-active';
                    employees.value[index].terminationReason = terminationForm.value.reason;
                }
                showTerminateDialog.value = false;
                employeeToTerminate.value = null;
            }
        };

        // Assign Roles & Permissions methods
        const openAssignDialog = (employee) => {
            selectedEmployeeForRoles.value = employee;
            selectedRoles.value = employee.assignedRoles || [];
            selectedPermissions.value = employee.directPermissions || [];
            showAssignDialog.value = true;
        };

        const assignRolesAndPermissions = () => {
            if (selectedEmployeeForRoles.value) {
                const index = employees.value.findIndex(e => e.id === selectedEmployeeForRoles.value.id);
                if (index !== -1) {
                    employees.value[index].assignedRoles = [...selectedRoles.value];
                    employees.value[index].directPermissions = [...selectedPermissions.value];
                }
                showAssignDialog.value = false;
                selectedEmployeeForRoles.value = null;
                selectedRoles.value = [];
                selectedPermissions.value = [];
            }
        };

        return {
            employees,
            searchQuery,
            filterDepartment,
            filterEntity,
            filterStatus,
            stepFilter,
            statusFilter,
            departmentOptions,
            entityOptions,
            statusOptions,
            totalEmployeeCount,
            draftCount,
            onboardingStatusCount,
            activeCount,
            nonActiveCount,
            onboardingCount,
            averageSla,
            getStepCount,
            clearFilters,
            setStepFilter,
            setStatusFilter,
            filteredEmployees,
            getStatusClass,
            getProgressClass,
            showTerminateDialog,
            employeeToTerminate,
            terminationReasons,
            terminationForm,
            openTerminateDialog,
            canTerminate,
            confirmTermination,
            showAssignDialog,
            selectedEmployeeForRoles,
            selectedRoles,
            selectedPermissions,
            rolesOptions,
            permissionsOptions,
            openAssignDialog,
            assignRolesAndPermissions
        };
    }
};

window.EmployeesComponent = EmployeesComponent;
