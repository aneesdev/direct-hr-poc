/**
 * Employees Component
 * Handles employee listing and management
 * Updated: Added step filters, progress bars, and SLA tracking
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
                        <div class="stat-value">{{ completedCount }}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="pi pi-clock"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ pendingCount }}</div>
                        <div class="stat-label">Pending</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="pi pi-exclamation-triangle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ overdueCount }}</div>
                        <div class="stat-label">Overdue SLA</div>
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
                    <div class="step-filter-tab" :class="{ active: stepFilter === null }" @click="stepFilter = null">
                        All
                        <span class="step-filter-count">{{ employees.length }}</span>
                    </div>
                    <div v-for="step in 6" :key="step" 
                         class="step-filter-tab" 
                         :class="{ active: stepFilter === step }"
                         @click="stepFilter = step">
                        Step {{ step }}
                        <span class="step-filter-count">{{ getStepCount(step) }}</span>
                    </div>
                    <div class="step-filter-tab" :class="{ active: slaFilter === 'overdue' }" @click="toggleSlaFilter('overdue')">
                        <i class="pi pi-exclamation-triangle" style="color: #ef4444;"></i>
                        Overdue
                        <span class="step-filter-count">{{ overdueCount }}</span>
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
                                         :class="slotProps.data.slaStatus"
                                         :style="{ width: slotProps.data.progress + '%' }"></div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="SLA" sortable style="width: 100px;">
                        <template #body="slotProps">
                            <span class="sla-tag" :class="slotProps.data.slaStatus">
                                {{ formatSlaStatus(slotProps.data.slaStatus) }}
                            </span>
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
        const filterEntity = ref(null);
        const filterStatus = ref(null);
        const stepFilter = ref(null);
        const slaFilter = ref(null);

        // Options
        const departmentOptions = computed(() => StaticData.departments.map(d => d.name));
        const entityOptions = computed(() => StaticData.entities.map(e => e.name));
        const statusOptions = ref(['Active', 'On Leave', 'Inactive', 'Terminated']);

        // Computed counts
        const completedCount = computed(() => employees.value.filter(e => e.slaStatus === 'completed').length);
        const pendingCount = computed(() => employees.value.filter(e => e.slaStatus === 'pending').length);
        const overdueCount = computed(() => employees.value.filter(e => e.slaStatus === 'overdue').length);

        // Get count per step
        const getStepCount = (step) => {
            return employees.value.filter(e => e.completedSteps === step).length;
        };

        // Toggle SLA filter
        const toggleSlaFilter = (status) => {
            if (slaFilter.value === status) {
                slaFilter.value = null;
            } else {
                slaFilter.value = status;
                stepFilter.value = null;
            }
        };

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

            if (filterEntity.value) {
                result = result.filter(e => e.entity === filterEntity.value);
            }

            if (filterStatus.value) {
                result = result.filter(e => e.status === filterStatus.value);
            }

            if (stepFilter.value !== null) {
                result = result.filter(e => e.completedSteps === stepFilter.value);
            }

            if (slaFilter.value) {
                result = result.filter(e => e.slaStatus === slaFilter.value);
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

        const formatSlaStatus = (status) => {
            const labels = {
                'completed': 'Done',
                'pending': 'Pending',
                'overdue': 'Overdue'
            };
            return labels[status] || status;
        };

        return {
            employees,
            searchQuery,
            filterDepartment,
            filterEntity,
            filterStatus,
            stepFilter,
            slaFilter,
            departmentOptions,
            entityOptions,
            statusOptions,
            completedCount,
            pendingCount,
            overdueCount,
            getStepCount,
            toggleSlaFilter,
            filteredEmployees,
            getStatusClass,
            formatSlaStatus
        };
    }
};

window.EmployeesComponent = EmployeesComponent;
