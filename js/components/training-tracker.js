/**
 * Training Tracker Component
 * Monitor training progress, filter by hierarchy, manage cycles
 */

const TrainingTrackerComponent = {
    template: `
        <div class="training-tracker-page">
            <!-- Page Header -->
            <div class="page-header-row">
                <div>
                    <h1>Training Tracker</h1>
                    <p>Monitor progress, filter by organization hierarchy, and manage cycles.</p>
                </div>
                <p-button label="Export to Excel" icon="pi pi-file-excel" outlined @click="exportToExcel"></p-button>
            </div>

            <!-- Stats Cards -->
            <div class="tracker-stats-grid">
                <div class="tracker-stat-card">
                    <div class="stat-value">{{ stats.assigned }}</div>
                    <div class="stat-label">ASSIGNED</div>
                </div>
                <div class="tracker-stat-card">
                    <div class="stat-value">{{ stats.inProgress }}</div>
                    <div class="stat-label">IN PROGRESS</div>
                </div>
                <div class="tracker-stat-card">
                    <div class="stat-value green">{{ stats.completed }}</div>
                    <div class="stat-label">COMPLETED</div>
                </div>
                <div class="tracker-stat-card">
                    <div class="stat-value red">{{ stats.failed }}</div>
                    <div class="stat-label">FAILED</div>
                </div>
                <div class="tracker-stat-card highlight">
                    <div class="stat-value">{{ stats.hoursAchieved }}</div>
                    <div class="stat-label">HOURS ACHIEVED</div>
                </div>
            </div>

            <!-- Search & Filters -->
            <div class="card">
                <div class="tracker-search-row">
                    <div class="search-box large">
                        <i class="pi pi-search"></i>
                        <input type="text" v-model="searchQuery" placeholder="Search by Employee or Path...">
                    </div>
                </div>
                <div class="tracker-filters-row">
                    <p-select v-model="filters.path" :options="pathOptions" optionLabel="label" optionValue="value"
                              placeholder="All Paths" showClear style="width: 180px;"></p-select>
                    <p-select v-model="filters.cycle" :options="cycleOptions" optionLabel="label" optionValue="value"
                              placeholder="All Cycles" showClear style="width: 150px;"></p-select>
                    <p-select v-model="filters.department" :options="departmentOptions" optionLabel="label" optionValue="value"
                              placeholder="All Departments" showClear style="width: 180px;"></p-select>
                    <p-select v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value"
                              placeholder="All Status" showClear style="width: 150px;"></p-select>
                </div>
            </div>

            <!-- Tracker Table -->
            <div class="card">
                <p-datatable :value="filteredTrainings" stripedRows paginator :rows="10" 
                             :rowsPerPageOptions="[5, 10, 20]"
                             tableStyle="min-width: 60rem">
                    <p-column header="EMPLOYEE INFORMATION">
                        <template #body="slotProps">
                            <div class="employee-cell">
                                <div class="employee-avatar" :style="{ background: getAvatarColor(slotProps.data.employee.name) }">
                                    {{ getInitial(slotProps.data.employee.name) }}
                                </div>
                                <div class="employee-details">
                                    <span class="employee-name">{{ slotProps.data.employee.name }}</span>
                                    <span class="employee-id">{{ slotProps.data.employee.empId }}</span>
                                    <span class="employee-path-info">{{ slotProps.data.employee.department }}</span>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column field="path" header="TRAINING PATH">
                        <template #body="slotProps">
                            <span class="path-name">{{ slotProps.data.path }}</span>
                        </template>
                    </p-column>
                    <p-column header="TOTAL HOURS" style="width: 100px;">
                        <template #body="slotProps">
                            <span class="hours-badge">{{ slotProps.data.totalHours }} HRS</span>
                        </template>
                    </p-column>
                    <p-column header="BATCH DETAILS" style="width: 140px;">
                        <template #body="slotProps">
                            <div class="batch-cell">
                                <span class="batch-cycle">Cycle {{ slotProps.data.cycle }}</span>
                                <span class="batch-period">{{ slotProps.data.period }}</span>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="STATUS" style="width: 130px;">
                        <template #body="slotProps">
                            <p-tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)"></p-tag>
                        </template>
                    </p-column>
                    <p-column header="PROGRESS SCORE" style="width: 130px;">
                        <template #body="slotProps">
                            <div class="progress-cell">
                                <span class="progress-value">{{ slotProps.data.progress }}%</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" :style="{ width: slotProps.data.progress + '%', background: getProgressColor(slotProps.data.progress) }"></div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="MANAGE" style="width: 100px;">
                        <template #body="slotProps">
                            <div class="manage-buttons">
                                <button class="action-icon-btn" @click="viewHistory(slotProps.data)" v-tooltip.top="'View History'">
                                    <i class="pi pi-eye"></i>
                                </button>
                                <button class="action-icon-btn" @click="openLifecycleMenu($event, slotProps.data)" v-tooltip.top="'Update Status'">
                                    <i class="pi pi-ellipsis-v"></i>
                                </button>
                            </div>
                        </template>
                    </p-column>
                </p-datatable>
            </div>

            <!-- Activity Logs Dialog -->
            <p-dialog v-model:visible="showLogsDialog" header="Activity Logs" :modal="true" :style="{ width: '550px' }">
                <div class="logs-header" v-if="selectedTraining">
                    <div class="logs-employee">
                        <span class="logs-name">{{ selectedTraining.employee.name }}</span>
                        <p-tag :value="'CYCLE ' + selectedTraining.cycle" severity="info" size="small"></p-tag>
                    </div>
                    <div class="logs-path">{{ selectedTraining.path }}</div>
                    <div class="logs-assigned">ASSIGNED BY: <strong>SYSTEM ADMINISTRATOR</strong></div>
                </div>
                <div class="logs-timeline">
                    <div class="log-item" v-for="log in activityLogs" :key="log.id">
                        <div class="log-icon" :class="log.type"></div>
                        <div class="log-content">
                            <div class="log-title">{{ log.title }}</div>
                            <div class="log-description">{{ log.description }}</div>
                            <div class="log-meta">MODIFIED BY: <strong>{{ log.modifiedBy }}</strong></div>
                        </div>
                        <div class="log-date">{{ log.date }}</div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Close History" @click="showLogsDialog = false" style="width: 100%;"></p-button>
                </template>
            </p-dialog>

            <!-- Lifecycle Menu (PrimeVue Popup Menu) -->
            <p-menu ref="lifecycleMenu" :model="lifecycleMenuItems" :popup="true" class="lifecycle-popup-menu">
                <template #start>
                    <div class="lifecycle-menu-header">UPDATE LIFECYCLE</div>
                </template>
                <template #item="{ item, props }">
                    <a v-ripple class="lifecycle-menu-item" :class="[item.styleClass, { active: item.isActive }]" v-bind="props.action">
                        <span>{{ item.label }}</span>
                        <span class="status-percent">{{ item.progress }}%</span>
                    </a>
                </template>
            </p-menu>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        const searchQuery = ref('');
        const showLogsDialog = ref(false);
        const lifecycleMenu = ref(null);
        const selectedTraining = ref(null);

        const filters = ref({
            path: null,
            cycle: null,
            department: null,
            status: null
        });

        const stats = ref({
            assigned: 524,
            inProgress: 511,
            completed: 6,
            failed: 7,
            hoursAchieved: 103
        });

        const trainings = ref([
            { id: 1, employee: { name: 'Employee 1', empId: 'EMP-1000', department: 'ENGINEERING > FRONTEND > REACT UNIT' }, path: 'Cybersecurity Essentials', totalHours: 10, cycle: 1, period: 'JANUARY 2024 — JUNE 2024', status: 'Failed', progress: 0 },
            { id: 2, employee: { name: 'Employee 2', empId: 'EMP-1001', department: 'SALES > INSIDE SALES > INSIDE ACCOUNTS' }, path: 'Leadership & Management', totalHours: 40, cycle: 2, period: 'JANUARY 2024 — JUNE 2024', status: 'Assigned', progress: 10 },
            { id: 3, employee: { name: 'Employee 3', empId: 'EMP-1002', department: 'MARKETING > PAID MEDIA > SEM UNIT' }, path: 'Python for Data Analysis', totalHours: 60, cycle: 3, period: 'JANUARY 2024 — JUNE 2024', status: 'In Progress', progress: 50 },
            { id: 4, employee: { name: 'Employee 4', empId: 'EMP-1003', department: 'HUMAN RESOURCES > RECRUITMENT > EXEC SEARCH' }, path: 'Workplace Safety & Health', totalHours: 5, cycle: 4, period: 'JANUARY 2024 — JUNE 2024', status: 'Completed', progress: 100 }
        ]);

        const activityLogs = ref([
            { id: 1, type: 'assigned', title: 'TRAINING ASSIGNED', description: 'Initial assignment to cycle 1.', modifiedBy: 'SYSTEM ADMINISTRATOR', date: '2/22/2026, 12:16:59 PM' }
        ]);

        const pathOptions = ref([
            { label: 'Cybersecurity Essentials', value: 'Cybersecurity Essentials' },
            { label: 'Leadership & Management', value: 'Leadership & Management' },
            { label: 'Python for Data Analysis', value: 'Python for Data Analysis' },
            { label: 'Workplace Safety & Health', value: 'Workplace Safety & Health' }
        ]);

        const cycleOptions = ref([
            { label: 'Cycle 1', value: 1 }, { label: 'Cycle 2', value: 2 },
            { label: 'Cycle 3', value: 3 }, { label: 'Cycle 4', value: 4 }
        ]);

        const departmentOptions = ref([
            { label: 'Engineering', value: 'ENGINEERING' },
            { label: 'Sales', value: 'SALES' },
            { label: 'Marketing', value: 'MARKETING' },
            { label: 'Human Resources', value: 'HUMAN RESOURCES' }
        ]);

        const statusOptions = ref([
            { label: 'Assigned', value: 'Assigned' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Failed', value: 'Failed' }
        ]);

        const filteredTrainings = computed(() => {
            let result = trainings.value;
            if (searchQuery.value) {
                const q = searchQuery.value.toLowerCase();
                result = result.filter(t => 
                    t.employee.name.toLowerCase().includes(q) || 
                    t.path.toLowerCase().includes(q) ||
                    t.employee.empId.toLowerCase().includes(q)
                );
            }
            if (filters.value.path) result = result.filter(t => t.path === filters.value.path);
            if (filters.value.cycle) result = result.filter(t => t.cycle === filters.value.cycle);
            if (filters.value.department) result = result.filter(t => t.employee.department.includes(filters.value.department));
            if (filters.value.status) result = result.filter(t => t.status === filters.value.status);
            return result;
        });

        const getAvatarColor = (name) => {
            const colors = ['#f97316', '#3b82f6', '#22c55e', '#8b5cf6', '#ef4444', '#06b6d4'];
            const index = name.charCodeAt(0) % colors.length;
            return colors[index];
        };

        const getInitial = (name) => name.charAt(0).toUpperCase();

        const getStatusSeverity = (status) => {
            const map = { 'Assigned': 'warn', 'In Progress': 'info', 'Completed': 'success', 'Failed': 'danger' };
            return map[status] || 'secondary';
        };

        const getProgressColor = (progress) => {
            if (progress >= 100) return '#22c55e';
            if (progress >= 50) return '#3b82f6';
            if (progress > 0) return '#f97316';
            return '#ef4444';
        };

        const viewHistory = (training) => {
            selectedTraining.value = training;
            showLogsDialog.value = true;
        };

        const updateStatus = (status, progress) => {
            if (selectedTraining.value) {
                const index = trainings.value.findIndex(t => t.id === selectedTraining.value.id);
                if (index !== -1) {
                    trainings.value[index].status = status;
                    trainings.value[index].progress = progress;
                    selectedTraining.value = trainings.value[index];
                }
            }
        };

        const lifecycleMenuItems = computed(() => {
            const currentStatus = selectedTraining.value?.status;
            const currentProgress = selectedTraining.value?.progress;
            return [
                {
                    label: 'Set as Assigned',
                    styleClass: '',
                    isActive: currentStatus === 'Assigned',
                    progress: currentStatus === 'Assigned' ? currentProgress : 10,
                    command: () => updateStatus('Assigned', 10)
                },
                {
                    label: 'Set as In Progress',
                    styleClass: 'progress',
                    isActive: currentStatus === 'In Progress',
                    progress: currentStatus === 'In Progress' ? currentProgress : 50,
                    command: () => updateStatus('In Progress', 50)
                },
                {
                    label: 'Mark as Completed',
                    styleClass: 'success',
                    isActive: currentStatus === 'Completed',
                    progress: currentStatus === 'Completed' ? currentProgress : 100,
                    command: () => updateStatus('Completed', 100)
                },
                {
                    label: 'Mark as Failed',
                    styleClass: 'danger',
                    isActive: currentStatus === 'Failed',
                    progress: currentStatus === 'Failed' ? currentProgress : 0,
                    command: () => updateStatus('Failed', 0)
                }
            ];
        });

        const openLifecycleMenu = (event, training) => {
            selectedTraining.value = training;
            lifecycleMenu.value.toggle(event);
        };

        const exportToExcel = () => {
            alert('Exporting to Excel...');
        };

        return {
            searchQuery,
            showLogsDialog,
            lifecycleMenu,
            lifecycleMenuItems,
            selectedTraining,
            filters,
            stats,
            trainings,
            activityLogs,
            pathOptions,
            cycleOptions,
            departmentOptions,
            statusOptions,
            filteredTrainings,
            getAvatarColor,
            getInitial,
            getStatusSeverity,
            getProgressColor,
            viewHistory,
            openLifecycleMenu,
            updateStatus,
            exportToExcel
        };
    }
};

window.TrainingTrackerComponent = TrainingTrackerComponent;
