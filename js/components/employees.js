/**
 * Employees Component
 * Handles employee listing and management
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
                        <div class="stat-value">{{ employees.length }}</div>
                        <div class="stat-label">Total Employees</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ activeEmployees }}</div>
                        <div class="stat-label">Active</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="pi pi-clock"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ onLeaveEmployees }}</div>
                        <div class="stat-label">On Leave</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="pi pi-file-edit"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ draftsCount }}</div>
                        <div class="stat-label">Drafts</div>
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

                <!-- Search and Filters -->
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <span class="p-input-icon-left" style="flex: 1;">
                        <i class="pi pi-search"></i>
                        <p-inputtext v-model="searchQuery" placeholder="Search employees..." style="width: 100%;"></p-inputtext>
                    </span>
                    <p-select v-model="filterDepartment" :options="departmentOptions" placeholder="All Departments" showClear style="width: 200px;"></p-select>
                    <p-select v-model="filterStatus" :options="statusOptions" placeholder="All Status" showClear style="width: 150px;"></p-select>
                </div>

                <!-- Employee Table -->
                <p-datatable :value="filteredEmployees" striped-rows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
                    <p-column selectionMode="multiple" style="width: 3rem"></p-column>
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
                    <p-column field="email" header="Email" sortable></p-column>
                    <p-column field="department" header="Department" sortable></p-column>
                    <p-column field="jobTitle" header="Job Title" sortable></p-column>
                    <p-column field="contractType" header="Contract" sortable>
                        <template #body="slotProps">
                            <p-tag :value="slotProps.data.contractType" :severity="getContractSeverity(slotProps.data.contractType)"></p-tag>
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
                                <button class="action-btn" title="View"><i class="pi pi-eye"></i></button>
                                <button class="action-btn edit" title="Edit"><i class="pi pi-pencil"></i></button>
                                <button class="action-btn delete" title="Delete"><i class="pi pi-trash"></i></button>
                            </div>
                        </template>
                    </p-column>
                </p-datatable>
            </div>
        </div>
    `,

    emits: ['add-employee'],

    setup() {
        const { ref, computed } = Vue;

        // Data
        const employees = ref([...StaticData.employees]);
        const searchQuery = ref('');
        const filterDepartment = ref(null);
        const filterStatus = ref(null);

        // Options
        const departmentOptions = computed(() => StaticData.departments.map(d => d.nameEn));
        const statusOptions = ref(['Active', 'On Leave', 'Inactive', 'Terminated']);

        // Computed
        const activeEmployees = computed(() => employees.value.filter(e => e.status === 'Active').length);
        const onLeaveEmployees = computed(() => employees.value.filter(e => e.status === 'On Leave').length);
        const draftsCount = computed(() => StaticData.employeeDrafts.length);

        const filteredEmployees = computed(() => {
            let result = employees.value;

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

            if (filterStatus.value) {
                result = result.filter(e => e.status === filterStatus.value);
            }

            return result;
        });

        // Methods
        const getStatusClass = (status) => {
            const classes = {
                'Active': 'active',
                'On Leave': 'warning',
                'Inactive': 'inactive',
                'Terminated': 'inactive'
            };
            return classes[status] || '';
        };

        const getContractSeverity = (type) => {
            const severities = {
                'Full-time': 'success',
                'Part-time': 'info',
                'Full-time Remote': 'success',
                'Part-time Remote': 'info',
                'Intern': 'warn'
            };
            return severities[type] || 'secondary';
        };

        return {
            employees,
            searchQuery,
            filterDepartment,
            filterStatus,
            departmentOptions,
            statusOptions,
            activeEmployees,
            onLeaveEmployees,
            draftsCount,
            filteredEmployees,
            getStatusClass,
            getContractSeverity
        };
    }
};

// Make it available globally
window.EmployeesComponent = EmployeesComponent;

