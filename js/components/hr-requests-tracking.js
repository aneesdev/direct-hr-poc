/**
 * HR Requests Tracking Component
 * Lists all HR requests with status tracking
 */

const HrRequestsTrackingComponent = {
    template: `
        <div class="hr-requests-tracking-page">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="pi pi-list"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ hrRequests.length }}</div>
                        <div class="stat-label">Total Requests</div>
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
                    <div class="stat-icon green">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ approvedCount }}</div>
                        <div class="stat-label">Approved</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">
                        <i class="pi pi-times-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ rejectedCount }}</div>
                        <div class="stat-label">Rejected</div>
                    </div>
                </div>
            </div>

            <!-- Requests Table -->
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">
                            <i class="pi pi-list-check"></i>
                            HR Requests
                        </div>
                        <div class="card-subtitle">Track and manage all HR change requests</div>
                    </div>
                    <div class="header-actions">
                        <p-select v-model="statusFilter" :options="statusOptions" placeholder="All Statuses" showClear style="width: 180px;"></p-select>
                    </div>
                </div>

                <p-datatable :value="filteredRequests" stripedRows paginator :rows="10" 
                             :rowsPerPageOptions="[10, 25, 50]"
                             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown">
                    <p-column header="Type of Request" sortable field="type">
                        <template #body="slotProps">
                            <div class="request-type-cell">
                                <div class="request-type-icon" :style="getTypeIconStyle(slotProps.data)">
                                    <i :class="'pi ' + slotProps.data.icon"></i>
                                </div>
                                <div class="request-type-info">
                                    <div class="request-type-name">{{ slotProps.data.type }}</div>
                                    <div class="request-type-id">#{{ slotProps.data.trackingId }}</div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Employee Details" sortable field="employeeName">
                        <template #body="slotProps">
                            <div class="employee-cell">
                                <img :src="slotProps.data.employeeAvatar" :alt="slotProps.data.employeeName" class="employee-avatar-sm">
                                <div class="employee-info">
                                    <div class="employee-name">{{ slotProps.data.employeeName }}</div>
                                    <div class="employee-details">{{ slotProps.data.employeeId }} • {{ slotProps.data.employeeDepartment }}</div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="HR User" sortable field="hrUserName">
                        <template #body="slotProps">
                            <div class="hr-user-cell">
                                <div class="hr-user-name">{{ slotProps.data.hrUserName }}</div>
                                <div class="hr-user-role">{{ slotProps.data.hrUserRole }}</div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Date of Action" sortable field="dateOfAction">
                        <template #body="slotProps">
                            <div class="date-cell">
                                <i class="pi pi-calendar"></i>
                                <span>{{ formatDate(slotProps.data.dateOfAction) }}</span>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Status" sortable field="status">
                        <template #body="slotProps">
                            <span class="status-badge" :class="getStatusClass(slotProps.data.status)">
                                {{ slotProps.data.status }}
                            </span>
                        </template>
                    </p-column>
                    <p-column header="Summary" style="width: 80px; text-align: center;">
                        <template #body="slotProps">
                            <button class="view-btn" @click="viewRequest(slotProps.data)" v-tooltip="'View Details'">
                                <i class="pi pi-eye"></i>
                            </button>
                        </template>
                    </p-column>
                </p-datatable>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { ref, computed } = Vue;

        const statusFilter = ref(null);

        const statusOptions = ref([
            'Pending',
            'Approved',
            'Processing',
            'Rejected'
        ]);

        // Sample HR Requests data
        const hrRequests = ref([
            {
                id: 1,
                trackingId: 'TRK-2024-001',
                type: 'Employee Promotion',
                icon: 'pi-arrow-up-right',
                color: '#f97316',
                employeeName: 'Sarah Johnson',
                employeeId: '1001',
                employeeDepartment: 'Engineering',
                employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'Amal Al-Sayed',
                hrUserRole: 'HR Manager',
                dateOfAction: '2024-03-15',
                status: 'Pending',
                changes: [
                    { group: 'Position', field: 'Main Grade', oldValue: 'Professional', newValue: 'Supervisor' },
                    { group: 'Position', field: 'Sub Grade', oldValue: 'Senior Officer', newValue: 'Lead' },
                    { group: 'Position', field: 'Job Title', oldValue: 'Software Engineer', newValue: 'Lead Engineer' },
                    { group: 'Compensation', field: 'Basic Salary', oldValue: '8,500', newValue: '12,000' },
                    { group: 'Compensation', field: 'Accommodation Allowance', oldValue: '2,125', newValue: '3,000' },
                    { group: 'Compensation', field: 'Transportation Allowance', oldValue: '850', newValue: '1,200' }
                ]
            },
            {
                id: 2,
                trackingId: 'TRK-2024-002',
                type: 'Employee Transfer',
                icon: 'pi-arrow-right-arrow-left',
                color: '#6366f1',
                employeeName: 'Michael Chen',
                employeeId: '1002',
                employeeDepartment: 'Finance',
                employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'John Smith',
                hrUserRole: 'HR Coordinator',
                dateOfAction: '2024-03-14',
                status: 'Approved',
                changes: [
                    { group: 'Organization', field: 'Department', oldValue: 'Finance', newValue: 'Operations' },
                    { group: 'Organization', field: 'Cost Center', oldValue: 'CC-002', newValue: 'CC-004' }
                ]
            },
            {
                id: 3,
                trackingId: 'TRK-2024-003',
                type: 'Salary Adjustment',
                icon: 'pi-money-bill',
                color: '#10b981',
                employeeName: 'Robert Fox',
                employeeId: '1005',
                employeeDepartment: 'Sales',
                employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'Amal Al-Sayed',
                hrUserRole: 'HR Manager',
                dateOfAction: '2024-03-12',
                status: 'Processing',
                changes: [
                    { group: 'Compensation', field: 'Basic Salary', oldValue: '7,000', newValue: '8,500' },
                    { group: 'Compensation', field: 'Transportation Allowance', oldValue: '700', newValue: '850' }
                ]
            },
            {
                id: 4,
                trackingId: 'TRK-2024-004',
                type: 'Disciplinary Action',
                icon: 'pi-exclamation-triangle',
                color: '#eab308',
                employeeName: 'James Wilson',
                employeeId: '1004',
                employeeDepartment: 'Operations',
                employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'Fahad Al-Otaibi',
                hrUserRole: 'HR Director',
                dateOfAction: '2024-03-10',
                status: 'Rejected',
                changes: [
                    { group: 'Action Details', field: 'Action Type', oldValue: '-', newValue: 'Written Warning' },
                    { group: 'Action Details', field: 'Reason', oldValue: '-', newValue: 'Policy violation' }
                ]
            },
            {
                id: 5,
                trackingId: 'TRK-2024-005',
                type: 'Attendance Adjustment',
                icon: 'pi-clock',
                color: '#ec4899',
                employeeName: 'Amira Khalid',
                employeeId: '1003',
                employeeDepartment: 'Marketing',
                employeeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'John Smith',
                hrUserRole: 'HR Coordinator',
                dateOfAction: '2024-03-09',
                status: 'Approved',
                changes: [
                    { group: 'Adjustment Details', field: 'Adjustment Type', oldValue: '-', newValue: 'Punch Correction' },
                    { group: 'Adjustment Details', field: 'Date', oldValue: '-', newValue: '2024-03-08' }
                ]
            },
            {
                id: 6,
                trackingId: 'TRK-2024-006',
                type: 'Change Contract Type',
                icon: 'pi-file-edit',
                color: '#f59e0b',
                employeeName: 'Lisa Anderson',
                employeeId: '1006',
                employeeDepartment: 'HR',
                employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'Amal Al-Sayed',
                hrUserRole: 'HR Manager',
                dateOfAction: '2024-03-08',
                status: 'Pending',
                changes: [
                    { group: 'Contract Details', field: 'Contract Type', oldValue: 'Full-Time', newValue: 'Part-Time' },
                    { group: 'Contract Details', field: 'Annual Leave', oldValue: '21 Days', newValue: '14 Days' }
                ]
            }
        ]);

        // Computed
        const pendingCount = computed(() => hrRequests.value.filter(r => r.status === 'Pending').length);
        const approvedCount = computed(() => hrRequests.value.filter(r => r.status === 'Approved').length);
        const rejectedCount = computed(() => hrRequests.value.filter(r => r.status === 'Rejected').length);

        const filteredRequests = computed(() => {
            if (!statusFilter.value) return hrRequests.value;
            return hrRequests.value.filter(r => r.status === statusFilter.value);
        });

        // Methods
        const getTypeIconStyle = (request) => {
            return {
                background: request.color + '15',
                color: request.color
            };
        };

        const getStatusClass = (status) => {
            const classes = {
                'Pending': 'pending',
                'Approved': 'approved',
                'Processing': 'processing',
                'Rejected': 'rejected'
            };
            return classes[status] || 'pending';
        };

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        };

        const viewRequest = (request) => {
            emit('view-request', request);
        };

        return {
            statusFilter,
            statusOptions,
            hrRequests,
            pendingCount,
            approvedCount,
            rejectedCount,
            filteredRequests,
            getTypeIconStyle,
            getStatusClass,
            formatDate,
            viewRequest
        };
    }
};
