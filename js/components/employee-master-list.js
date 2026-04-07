/**
 * Employee Master List Component
 * Read-only employee list with Finance and Attendance tabs
 */

const EmployeeMasterListComponent = {
    template: `
        <div class="employee-master-list-page">
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
                        <div class="stat-value">{{ onboardingCount }}</div>
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
            </div>

            <!-- Tabs -->
            <div class="settings-tabs">
                <p-tabs :value="activeTab">
                    <p-tablist>
                        <p-tab value="finance" @click="activeTab = 'finance'">Finance</p-tab>
                        <p-tab value="attendance" @click="activeTab = 'attendance'">Attendance</p-tab>
                    </p-tablist>

                    <p-tabpanels>
                        <!-- Finance Tab -->
                        <p-tabpanel value="finance">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-wallet"></i>
                                        Finance Master List
                                    </div>
                                    <div class="card-subtitle">Employee financial information and leave balances</div>
                                </div>
                                <p-button label="Export" icon="pi pi-download" outlined></p-button>
                            </div>

                            <!-- Filters -->
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                <span class="p-input-icon-left" style="flex: 1;">
                                    <i class="pi pi-search"></i>
                                    <p-inputtext v-model="searchQuery" placeholder="Search employees..." style="width: 100%;"></p-inputtext>
                                </span>
                                <p-select v-model="filterStatus" :options="statusOptions" placeholder="All Status" showClear style="width: 150px;"></p-select>
                                <p-select v-model="filterEntity" :options="entityOptions" placeholder="All Entities" showClear style="width: 150px;"></p-select>
                                <p-select v-model="filterDepartment" :options="departmentOptions" placeholder="All Departments" showClear style="width: 180px;"></p-select>
                            </div>

                            <!-- Finance Table -->
                            <p-datatable :value="filteredEmployees" striped-rows paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]"
                                         scrollable scroll-height="500px" class="master-list-table">
                                <p-column header="Employee" frozen style="min-width: 220px;">
                                    <template #body="slotProps">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <img :src="slotProps.data.avatar" :alt="slotProps.data.firstName" style="width: 36px; height: 36px; border-radius: 50%;">
                                            <div>
                                                <div style="font-weight: 600; font-size: 0.9rem;">{{ slotProps.data.firstName }} {{ slotProps.data.familyName }}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-color-secondary);">{{ slotProps.data.employeeNumber }}</div>
                                            </div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Status" style="min-width: 110px;">
                                    <template #body="slotProps">
                                        <span class="status-tag" :class="getStatusClass(slotProps.data.status)">
                                            {{ slotProps.data.status }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column field="entity" header="Entity" style="min-width: 100px;"></p-column>
                                <p-column field="department" header="Department" style="min-width: 130px;"></p-column>
                                <p-column field="section" header="Section" style="min-width: 150px;"></p-column>
                                <p-column header="Unit" style="min-width: 100px;">
                                    <template #body="slotProps">
                                        {{ slotProps.data.unit || '-' }}
                                    </template>
                                </p-column>
                                <p-column header="Gross Salary" style="min-width: 120px; text-align: right;">
                                    <template #body="slotProps">
                                        <span style="font-weight: 600;">{{ formatCurrency(slotProps.data.grossSalary) }}</span>
                                    </template>
                                </p-column>
                                <p-column header="Basic Salary" style="min-width: 120px; text-align: right;">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.basicSalary) }}
                                    </template>
                                </p-column>
                                <p-column header="House Allow." style="min-width: 120px; text-align: right;">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.houseAllowance) }}
                                    </template>
                                </p-column>
                                <p-column header="Transport Allow." style="min-width: 120px; text-align: right;">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.transportAllowance) }}
                                    </template>
                                </p-column>
                                <p-column header="Other Allow." style="min-width: 120px; text-align: right;">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.otherAllowance) }}
                                    </template>
                                </p-column>
                                <p-column header="Annual Leave" style="min-width: 110px; text-align: center;">
                                    <template #body="slotProps">
                                        <span class="balance-badge">{{ slotProps.data.annualLeaveBalance }} days</span>
                                    </template>
                                </p-column>
                                <p-column header="Compound Leave" style="min-width: 130px; text-align: center;">
                                    <template #body="slotProps">
                                        <span class="balance-badge secondary">{{ slotProps.data.compoundLeaveBalance }} days</span>
                                    </template>
                                </p-column>
                                <p-column header="Seniority" style="min-width: 120px;">
                                    <template #body="slotProps">
                                        <div>
                                            <div style="font-size: 0.85rem;">{{ slotProps.data.dateOfHiring }}</div>
                                            <div style="font-size: 0.7rem; color: var(--text-color-secondary);">{{ calculateSeniority(slotProps.data.dateOfHiring) }}</div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column field="countryOfWork" header="Country" style="min-width: 130px;"></p-column>
                            </p-datatable>
                        </p-tabpanel>

                        <!-- Attendance Tab -->
                        <p-tabpanel value="attendance">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-clock"></i>
                                        Attendance Master List
                                    </div>
                                    <div class="card-subtitle">Employee attendance and scheduling information</div>
                                </div>
                                <p-button label="Export" icon="pi pi-download" outlined></p-button>
                            </div>

                            <!-- Filters -->
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                <span class="p-input-icon-left" style="flex: 1;">
                                    <i class="pi pi-search"></i>
                                    <p-inputtext v-model="searchQuery" placeholder="Search employees..." style="width: 100%;"></p-inputtext>
                                </span>
                                <p-select v-model="filterStatus" :options="statusOptions" placeholder="All Status" showClear style="width: 150px;"></p-select>
                                <p-select v-model="filterEntity" :options="entityOptions" placeholder="All Entities" showClear style="width: 150px;"></p-select>
                                <p-select v-model="filterDepartment" :options="departmentOptions" placeholder="All Departments" showClear style="width: 180px;"></p-select>
                            </div>

                            <!-- Attendance Table -->
                            <p-datatable :value="filteredEmployees" striped-rows paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]">
                                <p-column header="Employee" style="min-width: 220px;">
                                    <template #body="slotProps">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <img :src="slotProps.data.avatar" :alt="slotProps.data.firstName" style="width: 36px; height: 36px; border-radius: 50%;">
                                            <div>
                                                <div style="font-weight: 600; font-size: 0.9rem;">{{ slotProps.data.firstName }} {{ slotProps.data.familyName }}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-color-secondary);">{{ slotProps.data.employeeNumber }}</div>
                                            </div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Status" style="min-width: 110px;">
                                    <template #body="slotProps">
                                        <span class="status-tag" :class="getStatusClass(slotProps.data.status)">
                                            {{ slotProps.data.status }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column field="entity" header="Entity" style="min-width: 100px;"></p-column>
                                <p-column field="department" header="Department" style="min-width: 130px;"></p-column>
                                <p-column field="section" header="Section" style="min-width: 150px;"></p-column>
                                <p-column header="Unit" style="min-width: 100px;">
                                    <template #body="slotProps">
                                        {{ slotProps.data.unit || '-' }}
                                    </template>
                                </p-column>
                                <p-column field="countryOfWork" header="Country" style="min-width: 130px;"></p-column>
                                <p-column header="Seniority" style="min-width: 120px;">
                                    <template #body="slotProps">
                                        <div>
                                            <div style="font-size: 0.85rem;">{{ slotProps.data.dateOfHiring }}</div>
                                            <div style="font-size: 0.7rem; color: var(--text-color-secondary);">{{ calculateSeniority(slotProps.data.dateOfHiring) }}</div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Schedule Type" style="min-width: 130px;">
                                    <template #body="slotProps">
                                        <p-tag :value="slotProps.data.scheduleType || 'Fixed'" 
                                               :severity="slotProps.data.scheduleType === 'Variable' ? 'warn' : 'info'"></p-tag>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>
        </div>
    `,
    setup() {
        const { ref, computed } = Vue;

        const activeTab = ref('finance');
        const searchQuery = ref('');
        const filterStatus = ref(null);
        const filterEntity = ref(null);
        const filterDepartment = ref(null);

        // Add finance and attendance data to employees
        const employees = ref(StaticData.employees.map(emp => ({
            ...emp,
            unit: emp.unit || null,
            grossSalary: emp.grossSalary || Math.floor(Math.random() * 15000) + 8000,
            basicSalary: emp.basicSalary || Math.floor(Math.random() * 8000) + 5000,
            houseAllowance: emp.houseAllowance || Math.floor(Math.random() * 3000) + 1000,
            transportAllowance: emp.transportAllowance || Math.floor(Math.random() * 1500) + 500,
            otherAllowance: emp.otherAllowance || Math.floor(Math.random() * 1000) + 200,
            annualLeaveBalance: emp.annualLeaveBalance || Math.floor(Math.random() * 25) + 5,
            compoundLeaveBalance: emp.compoundLeaveBalance || Math.floor(Math.random() * 10),
            scheduleType: emp.scheduleType || (Math.random() > 0.7 ? 'Variable' : 'Fixed')
        })));

        // Options
        const statusOptions = ref(['Draft', 'Onboarding', 'Active', 'Non-active']);
        const entityOptions = computed(() => [...new Set(employees.value.map(e => e.entity))]);
        const departmentOptions = computed(() => [...new Set(employees.value.map(e => e.department))]);

        // Computed counts
        const totalEmployeeCount = computed(() => employees.value.length);
        const draftCount = computed(() => employees.value.filter(e => e.status === 'Draft').length);
        const onboardingCount = computed(() => employees.value.filter(e => e.status === 'Onboarding').length);
        const activeCount = computed(() => employees.value.filter(e => e.status === 'Active').length);
        const nonActiveCount = computed(() => employees.value.filter(e => e.status === 'Non-active').length);

        // Filtered employees
        const filteredEmployees = computed(() => {
            let result = employees.value;

            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(e =>
                    e.firstName.toLowerCase().includes(query) ||
                    e.familyName.toLowerCase().includes(query) ||
                    e.employeeNumber.toLowerCase().includes(query)
                );
            }

            if (filterStatus.value) {
                result = result.filter(e => e.status === filterStatus.value);
            }

            if (filterEntity.value) {
                result = result.filter(e => e.entity === filterEntity.value);
            }

            if (filterDepartment.value) {
                result = result.filter(e => e.department === filterDepartment.value);
            }

            return result;
        });

        // Status class helper
        const getStatusClass = (status) => {
            const statusMap = {
                'Draft': 'draft',
                'Onboarding': 'onboarding',
                'Active': 'active',
                'Non-active': 'non-active'
            };
            return statusMap[status] || '';
        };

        // Format currency
        const formatCurrency = (value) => {
            if (!value) return '-';
            return new Intl.NumberFormat('en-SA', {
                style: 'currency',
                currency: 'SAR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        };

        // Calculate seniority from hire date
        const calculateSeniority = (dateStr) => {
            if (!dateStr) return '-';
            const parts = dateStr.split('/');
            if (parts.length !== 3) return '-';
            const hireDate = new Date(parts[2], parts[1] - 1, parts[0]);
            const now = new Date();
            const years = Math.floor((now - hireDate) / (365.25 * 24 * 60 * 60 * 1000));
            const months = Math.floor(((now - hireDate) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
            if (years > 0) {
                return `${years}y ${months}m`;
            }
            return `${months}m`;
        };

        return {
            activeTab,
            searchQuery,
            filterStatus,
            filterEntity,
            filterDepartment,
            employees,
            statusOptions,
            entityOptions,
            departmentOptions,
            totalEmployeeCount,
            draftCount,
            onboardingCount,
            activeCount,
            nonActiveCount,
            filteredEmployees,
            getStatusClass,
            formatCurrency,
            calculateSeniority
        };
    }
};
