/**
 * My Requests Component
 * Shows list of all requests and detail view with approval/rejection
 */

const MyRequestsComponent = {
    template: `
        <div class="my-requests-page">
            <!-- List View -->
            <div v-if="!selectedRequest">
                <!-- Stats Cards -->
                <div class="stats-grid" style="grid-template-columns: repeat(6, 1fr);">
                    <div class="stat-card clickable" :class="{ 'stat-active': statusFilter === null }" @click="setStatusFilter(null)">
                        <div class="stat-icon blue">
                            <i class="pi pi-list"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ requests.length }}</div>
                            <div class="stat-label">Total Requests</div>
                        </div>
                    </div>
                    <div class="stat-card clickable" :class="{ 'stat-active': statusFilter === 'pending' }" @click="setStatusFilter('pending')">
                        <div class="stat-icon orange">
                            <i class="pi pi-clock"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ pendingCount }}</div>
                            <div class="stat-label">Pending</div>
                        </div>
                    </div>
                    <div class="stat-card clickable" :class="{ 'stat-active': statusFilter === 'in_review' }" @click="setStatusFilter('in_review')">
                        <div class="stat-icon purple">
                            <i class="pi pi-eye"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ inReviewCount }}</div>
                            <div class="stat-label">In Review</div>
                        </div>
                    </div>
                    <div class="stat-card clickable" :class="{ 'stat-active': statusFilter === 'approved' }" @click="setStatusFilter('approved')">
                        <div class="stat-icon green">
                            <i class="pi pi-check-circle"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ approvedCount }}</div>
                            <div class="stat-label">Approved</div>
                        </div>
                    </div>
                    <div class="stat-card clickable" :class="{ 'stat-active': statusFilter === 'rejected' }" @click="setStatusFilter('rejected')">
                        <div class="stat-icon red">
                            <i class="pi pi-times-circle"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ rejectedCount }}</div>
                            <div class="stat-label">Rejected</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="pi pi-stopwatch"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ averageSla }}</div>
                            <div class="stat-label">Avg SLA (Days)</div>
                        </div>
                    </div>
                </div>

                <!-- Requests Table -->
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">
                                <i class="pi pi-inbox"></i>
                                All Requests
                            </div>
                            <div class="card-subtitle">View and manage all submitted requests</div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <p-button label="New Request" icon="pi pi-plus" @click="$emit('new-request')"></p-button>
                        </div>
                    </div>

                    <!-- Top Filters (compact, same style as Employee Directory) -->
                    <div class="card compact-filters-grid" style="margin-bottom: 1rem; padding: 1rem 1.25rem;">
                        <div class="filter-row">
                            <p-select v-model="filters.countryOfWork" :options="countryOptions" optionLabel="name" optionValue="id"
                                      placeholder="Country of Work" showClear style="width: 140px;"></p-select>
                            <p-select v-model="filters.department" :options="departmentOptions" optionLabel="name" optionValue="id"
                                      placeholder="Department" showClear style="width: 130px;" @change="onDepartmentChange"></p-select>
                            <p-select v-model="filters.section" :options="filteredSections" optionLabel="name" optionValue="id"
                                      placeholder="Section" showClear style="width: 120px;" :disabled="!filters.department" @change="onSectionChange"></p-select>
                            <p-select v-model="filters.unit" :options="filteredUnits" optionLabel="name" optionValue="id"
                                      placeholder="Unit" showClear style="width: 110px;" :disabled="!filters.section" @change="onUnitChange"></p-select>
                            <p-select v-model="filters.team" :options="filteredTeams" optionLabel="name" optionValue="id"
                                      placeholder="Team" showClear style="width: 110px;" :disabled="!filters.unit"></p-select>
                            <p-select v-model="filters.entity" :options="entityOptions" optionLabel="name" optionValue="id"
                                      placeholder="Entity" showClear style="width: 120px;"></p-select>
                            <p-select v-model="filters.office" :options="officeOptions" optionLabel="name" optionValue="id"
                                      placeholder="Office" showClear style="width: 120px;"></p-select>
                            <div class="requests-datepicker-wrap">
                                <p-datepicker v-model="filters.dateRange" selectionMode="range" dateFormat="dd/mm/yy" placeholder="Submitted Date" showIcon iconDisplay="input"></p-datepicker>
                            </div>
                        </div>
                        <div class="filter-row filter-actions-row">
                            <p-button label="Apply" icon="pi pi-check" @click="applyFilters" size="small"></p-button>
                            <p-button label="Reset" icon="pi pi-refresh" outlined @click="resetFilters" size="small" v-if="hasActiveFilters"></p-button>
                        </div>
                    </div>

                    <!-- Role Filter Tabs -->
                    <div class="request-filters">
                        <div class="filter-tabs">
                            <button class="filter-tab" :class="{ active: roleFilter === null }" @click="setRoleFilter(null)">
                                All <span class="filter-count">{{ requests.length }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: roleFilter === 'line_manager' }" @click="setRoleFilter('line_manager')">
                                Line Manager <span class="filter-count">{{ lineManagerCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: roleFilter === 'hr_admin' }" @click="setRoleFilter('hr_admin')">
                                HR Admin <span class="filter-count">{{ hrAdminCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: roleFilter === 'hr_manager' }" @click="setRoleFilter('hr_manager')">
                                HR Manager <span class="filter-count">{{ hrManagerCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: roleFilter === 'hr_evp' }" @click="setRoleFilter('hr_evp')">
                                HR EVP <span class="filter-count">{{ hrEvpCount }}</span>
                            </button>
                        </div>
                    </div>

                    <p-datatable :value="filteredRequests" striped-rows paginator :rows="10" 
                                 :rowsPerPageOptions="[5, 10, 20]"
                                 @row-click="viewRequest($event.data)">
                        <p-column header="Request" sortable>
                            <template #body="slotProps">
                                <div class="request-cell">
                                    <div class="request-type-badge" :style="{ background: getCategoryColor(slotProps.data.categoryId) + '15', color: getCategoryColor(slotProps.data.categoryId) }">
                                        <i :class="'pi ' + getCategoryIcon(slotProps.data.categoryId)"></i>
                                    </div>
                                    <div>
                                        <div class="request-type-name">{{ slotProps.data.typeName }}</div>
                                        <div class="request-id">{{ slotProps.data.id }}</div>
                                    </div>
                                </div>
                            </template>
                        </p-column>
                        <p-column header="Employee" sortable>
                            <template #body="slotProps">
                                <div class="employee-cell">
                                    <img :src="slotProps.data.employeeAvatar" :alt="slotProps.data.employeeName" class="employee-avatar-sm">
                                    <div>
                                        <div class="employee-name-sm">{{ slotProps.data.employeeName }}</div>
                                        <div class="employee-dept">{{ slotProps.data.department }}</div>
                                    </div>
                                </div>
                            </template>
                        </p-column>
                        <p-column header="Submitted" sortable>
                            <template #body="slotProps">
                                <div class="date-cell" v-tooltip.top="formatDate(slotProps.data.submittedAt)">
                                    <div>{{ formatTimeAgo(slotProps.data.submittedAt) }}</div>
                                </div>
                            </template>
                        </p-column>
                        <p-column header="Current Step">
                            <template #body="slotProps">
                                <div v-if="slotProps.data.currentApprover" class="current-step-cell">
                                    <span class="current-approver">
                                        <i class="pi pi-user"></i>
                                        {{ slotProps.data.currentApprover }}
                                    </span>
                                    <div class="approver-name-small">{{ slotProps.data.currentApproverName || 'Pending Assignment' }}</div>
                                </div>
                                <span v-else class="completed-text">Completed</span>
                            </template>
                        </p-column>
                        <p-column header="SLA" style="width: 90px">
                            <template #body="slotProps">
                                <span class="sla-badge" :class="getSlaClass(slotProps.data)">
                                    {{ calculateSla(slotProps.data) }}
                                </span>
                            </template>
                        </p-column>
                        <p-column header="Status" sortable>
                            <template #body="slotProps">
                                <span class="request-status-badge" :class="slotProps.data.status">
                                    <i :class="'pi ' + getStatusIcon(slotProps.data.status)"></i>
                                    {{ getStatusLabel(slotProps.data.status) }}
                                </span>
                            </template>
                        </p-column>
                        <p-column header="" style="width: 60px">
                            <template #body>
                                <i class="pi pi-chevron-right" style="color: var(--text-color-secondary);"></i>
                            </template>
                        </p-column>
                    </p-datatable>
                </div>
            </div>

            <!-- Detail View -->
            <div v-else class="request-detail-view">
                <button class="back-button" @click="selectedRequest = null">
                    <i class="pi pi-arrow-left"></i>
                    <span>Back to Requests</span>
                </button>

                <div class="detail-grid">
                    <!-- Main Content -->
                    <div class="detail-main">
                        <!-- Header Card -->
                        <div class="detail-header-card">
                            <div class="detail-header-content">
                                <div class="detail-type-icon" :style="{ background: getCategoryColor(selectedRequest.categoryId) + '15', color: getCategoryColor(selectedRequest.categoryId) }">
                                    <i :class="'pi ' + getCategoryIcon(selectedRequest.categoryId)"></i>
                                </div>
                                <div class="detail-header-info">
                                    <div class="detail-title-row">
                                        <h1>{{ selectedRequest.typeName }}</h1>
                                        <span class="request-status-badge large" :class="selectedRequest.status">
                                            <i :class="'pi ' + getStatusIcon(selectedRequest.status)"></i>
                                            {{ getStatusLabel(selectedRequest.status) }}
                                        </span>
                                    </div>
                                    <div class="detail-meta">
                                        <span><i class="pi pi-hashtag"></i> {{ selectedRequest.id }}</span>
                                        <span><i class="pi pi-calendar"></i> Submitted on {{ formatDate(selectedRequest.submittedAt) }}</span>
                                        <span><i class="pi pi-stopwatch"></i> SLA: {{ calculateSla(selectedRequest) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Requester Info -->
                        <div class="detail-section-card">
                            <div class="section-header">
                                <i class="pi pi-user"></i>
                                <span>Requester</span>
                            </div>
                            <div class="requester-info">
                                <img :src="selectedRequest.employeeAvatar" :alt="selectedRequest.employeeName" class="requester-avatar">
                                <div>
                                    <div class="requester-name">{{ selectedRequest.employeeName }}</div>
                                    <div class="requester-dept">{{ selectedRequest.department }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Submitted Parameters -->
                        <div class="detail-section-card">
                            <div class="section-header">
                                <i class="pi pi-file-edit"></i>
                                <span>Request Details</span>
                            </div>
                            <div class="parameters-grid">
                                <div v-for="(value, key) in selectedRequest.formData" :key="key" class="parameter-item">
                                    <div class="parameter-label">{{ key }}</div>
                                    <div class="parameter-value" v-if="typeof value === 'object' && value.from">
                                        {{ formatDate(value.from) }} — {{ formatDate(value.to) }}
                                    </div>
                                    <div class="parameter-value" v-else>{{ value }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Approval Actions (for approvers) -->
                        <div v-if="canTakeAction" class="detail-section-card action-card">
                            <div class="section-header">
                                <i class="pi pi-check-square"></i>
                                <span>Take Action</span>
                            </div>
                            <div class="action-form">
                                <div class="form-group">
                                    <label class="form-label">Add Comment (Optional)</label>
                                    <p-textarea v-model="actionComment" rows="3" placeholder="Add a note or reason for your decision..." style="width: 100%;"></p-textarea>
                                </div>
                                <div class="action-buttons">
                                    <p-button label="Reject" icon="pi pi-times" severity="danger" outlined @click="rejectRequest"></p-button>
                                    <p-button label="Approve" icon="pi pi-check" @click="approveRequest"></p-button>
                                </div>
                            </div>
                        </div>

                        <!-- Add Comment (for anyone) -->
                        <div v-if="!canTakeAction" class="detail-section-card">
                            <div class="section-header">
                                <i class="pi pi-comment"></i>
                                <span>Add Comment</span>
                            </div>
                            <div class="comment-form">
                                <p-textarea v-model="newComment" rows="2" placeholder="Write a comment..." style="width: 100%;"></p-textarea>
                                <p-button label="Post Comment" icon="pi pi-send" size="small" @click="addComment" :disabled="!newComment"></p-button>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="detail-sidebar">
                        <!-- Approval Flow -->
                        <div class="sidebar-card">
                            <div class="sidebar-header">
                                <i class="pi pi-sitemap"></i>
                                <span>Approval Flow</span>
                            </div>
                            <div class="approval-timeline">
                                <div v-for="(step, index) in selectedRequest.approvalFlow" :key="index" 
                                     class="timeline-step" :class="step.status">
                                    <div class="timeline-indicator">
                                        <div class="timeline-dot">
                                            <i v-if="step.status === 'approved'" class="pi pi-check"></i>
                                            <i v-else-if="step.status === 'rejected'" class="pi pi-times"></i>
                                            <i v-else-if="step.status === 'pending'" class="pi pi-clock"></i>
                                            <i v-else class="pi pi-minus"></i>
                                        </div>
                                        <div v-if="index < selectedRequest.approvalFlow.length - 1" class="timeline-line"></div>
                                    </div>
                                    <div class="timeline-content">
                                        <div class="timeline-role">{{ step.role }}</div>
                                        <div class="timeline-assignee">{{ step.assignee }}</div>
                                        <div v-if="step.actionAt" class="timeline-time">{{ formatDateTime(step.actionAt) }}</div>
                                        <div v-else-if="step.status === 'pending'" class="timeline-waiting">Awaiting action</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Log -->
                        <div class="sidebar-card">
                            <div class="sidebar-header">
                                <i class="pi pi-history"></i>
                                <span>Activity Log</span>
                            </div>
                            <div class="activity-log">
                                <div v-for="(log, index) in selectedRequest.actionLog" :key="index" class="log-entry">
                                    <div class="log-dot" :class="getLogDotClass(log.action)"></div>
                                    <div class="log-content">
                                        <div class="log-action">
                                            <strong>{{ log.action }}</strong>
                                            <span class="log-time">{{ formatTime(log.timestamp) }}</span>
                                        </div>
                                        <div class="log-user">{{ log.user }}</div>
                                        <div v-if="log.comment" class="log-comment">
                                            <i class="pi pi-comment"></i>
                                            "{{ log.comment }}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    emits: ['new-request'],

    setup(props, { emit }) {
        const { ref, computed, reactive } = Vue;

        // State
        const requests = ref([...StaticData.submittedRequests]);
        const selectedRequest = ref(null);
        const statusFilter = ref(null);
        const roleFilter = ref(null);
        const actionComment = ref('');
        const newComment = ref('');
        const viewType = ref('all');

        // Categories data for icons/colors
        const categories = ref([...StaticData.requestCategories]);
        const statuses = ref([...StaticData.requestStatuses]);

        // Filter data
        const countryOptions = ref([...StaticData.countriesOfWork]);
        const departmentOptions = ref([...StaticData.departments]);
        const sectionOptions = ref([...StaticData.sections]);
        const unitOptions = ref([...StaticData.units]);
        const teamOptions = ref([...StaticData.teams]);
        const entityOptions = ref([...StaticData.entities]);
        const officeOptions = ref([
            { id: 1, name: 'HQ - Main Office' },
            { id: 2, name: 'Branch - Riyadh' },
            { id: 3, name: 'Branch - Dubai' }
        ]);

        // View Type Options
        const viewTypeOptions = ref([
            { id: 'all', name: 'All Requests' },
            { id: 'line_manager', name: 'Line Manager View' },
            { id: 'hr_admin', name: 'HR Administrator View' },
            { id: 'hr_manager', name: 'HR Manager View' },
            { id: 'hr_evp', name: 'HR EVP View' }
        ]);

        // Filters (UI state - what user selects)
        const filters = reactive({
            countryOfWork: null,
            department: null,
            section: null,
            unit: null,
            team: null,
            entity: null,
            office: null,
            dateRange: null
        });

        // Applied filters (actual filtering state - only changes on Apply click)
        const appliedFilters = reactive({
            countryOfWork: null,
            department: null,
            section: null,
            unit: null,
            team: null,
            entity: null,
            office: null,
            dateRange: null
        });

        // Dependent filters
        const filteredSections = computed(() => {
            if (!filters.department) return [];
            return sectionOptions.value.filter(s => s.departmentId === filters.department);
        });

        const filteredUnits = computed(() => {
            if (!filters.section) return [];
            return unitOptions.value.filter(u => u.sectionId === filters.section);
        });

        const filteredTeams = computed(() => {
            if (!filters.unit) return [];
            return teamOptions.value.filter(t => t.unitId === filters.unit);
        });

        const hasActiveFilters = computed(() => {
            const hasForm = filters.countryOfWork || filters.department || filters.section ||
                filters.unit || filters.team || filters.entity || filters.office ||
                (filters.dateRange && filters.dateRange.length > 0);
            const hasApplied = appliedFilters.countryOfWork || appliedFilters.department || appliedFilters.section ||
                appliedFilters.unit || appliedFilters.team || appliedFilters.entity || appliedFilters.office ||
                (appliedFilters.dateRange && appliedFilters.dateRange.length > 0);
            return hasForm || hasApplied;
        });

        // Filter change handlers
        const onDepartmentChange = () => {
            filters.section = null;
            filters.unit = null;
            filters.team = null;
        };

        const onSectionChange = () => {
            filters.unit = null;
            filters.team = null;
        };

        const onUnitChange = () => {
            filters.team = null;
        };

        const applyFilters = () => {
            appliedFilters.countryOfWork = filters.countryOfWork;
            appliedFilters.department = filters.department;
            appliedFilters.section = filters.section;
            appliedFilters.unit = filters.unit;
            appliedFilters.team = filters.team;
            appliedFilters.entity = filters.entity;
            appliedFilters.office = filters.office;
            appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null;
        };

        const resetFilters = () => {
            // Reset UI filters
            filters.countryOfWork = null;
            filters.department = null;
            filters.section = null;
            filters.unit = null;
            filters.team = null;
            filters.entity = null;
            filters.office = null;
            filters.dateRange = null;
            // Reset applied filters
            appliedFilters.countryOfWork = null;
            appliedFilters.department = null;
            appliedFilters.section = null;
            appliedFilters.unit = null;
            appliedFilters.team = null;
            appliedFilters.entity = null;
            appliedFilters.office = null;
            appliedFilters.dateRange = null;
        };

        // Computed counts - Status based
        const pendingCount = computed(() => requests.value.filter(r => r.status === 'pending').length);
        const approvedCount = computed(() => requests.value.filter(r => r.status === 'approved').length);
        const rejectedCount = computed(() => requests.value.filter(r => r.status === 'rejected').length);
        const inReviewCount = computed(() => requests.value.filter(r => r.status === 'in_review').length);

        // Computed counts - Role based (by current step)
        const lineManagerCount = computed(() => requests.value.filter(r => {
            const pendingStep = r.approvalFlow?.find(s => s.status === 'pending');
            return pendingStep?.role?.includes('Line Manager');
        }).length);

        const hrAdminCount = computed(() => requests.value.filter(r => {
            const pendingStep = r.approvalFlow?.find(s => s.status === 'pending');
            return pendingStep?.role === 'HR Administrator';
        }).length);

        const hrManagerCount = computed(() => requests.value.filter(r => {
            const pendingStep = r.approvalFlow?.find(s => s.status === 'pending');
            return pendingStep?.role === 'HR Manager';
        }).length);

        const hrEvpCount = computed(() => requests.value.filter(r => {
            const pendingStep = r.approvalFlow?.find(s => s.status === 'pending');
            return pendingStep?.role === 'HR EVP';
        }).length);

        // Average SLA calculation
        const averageSla = computed(() => {
            const completedRequests = requests.value.filter(r => r.status === 'approved' || r.status === 'rejected');
            if (completedRequests.length === 0) return '0';
            
            const totalDays = completedRequests.reduce((sum, r) => {
                const submitted = new Date(r.submittedAt);
                const completed = r.completedAt ? new Date(r.completedAt) : new Date();
                const days = Math.ceil((completed - submitted) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0);
            
            return (totalDays / completedRequests.length).toFixed(1);
        });

        const filteredRequests = computed(() => {
            let result = requests.value;
            
            // Status filter (from stat cards)
            if (statusFilter.value) {
                result = result.filter(r => r.status === statusFilter.value);
            }

            // Role filter (from tabs)
            if (roleFilter.value) {
                result = result.filter(r => {
                    const pendingStep = r.approvalFlow?.find(s => s.status === 'pending');
                    if (!pendingStep) return false;
                    
                    switch (roleFilter.value) {
                        case 'line_manager':
                            return pendingStep.role?.includes('Line Manager');
                        case 'hr_admin':
                            return pendingStep.role === 'HR Administrator';
                        case 'hr_manager':
                            return pendingStep.role === 'HR Manager';
                        case 'hr_evp':
                            return pendingStep.role === 'HR EVP';
                        default:
                            return true;
                    }
                });
            }

            // Date range filter (uses appliedFilters)
            if (appliedFilters.dateRange && appliedFilters.dateRange.length > 0) {
                if (appliedFilters.dateRange[0]) {
                    const fromDate = new Date(appliedFilters.dateRange[0]);
                    fromDate.setHours(0, 0, 0, 0);
                    result = result.filter(r => new Date(r.submittedAt) >= fromDate);
                }
                if (appliedFilters.dateRange[1]) {
                    const toDate = new Date(appliedFilters.dateRange[1]);
                    toDate.setHours(23, 59, 59, 999);
                    result = result.filter(r => new Date(r.submittedAt) <= toDate);
                }
            }

            return result;
        });

        // Mock: current user can take action on pending requests
        const canTakeAction = computed(() => {
            if (!selectedRequest.value) return false;
            const pendingStep = selectedRequest.value.approvalFlow.find(s => s.status === 'pending');
            return pendingStep !== undefined;
        });

        // Helper functions
        const getCategoryColor = (id) => categories.value.find(c => c.id === id)?.color || '#64748b';
        const getCategoryIcon = (id) => categories.value.find(c => c.id === id)?.icon || 'pi-folder';
        const getStatusLabel = (status) => statuses.value.find(s => s.id === status)?.name || status;
        const getStatusIcon = (status) => statuses.value.find(s => s.id === status)?.icon || 'pi-circle';

        const setStatusFilter = (status) => {
            statusFilter.value = status;
        };

        const setRoleFilter = (role) => {
            roleFilter.value = role;
        };

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        const formatDateTime = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
        };

        const formatTime = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        };

        const formatTimeAgo = (dateStr) => {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now - date;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            
            if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            return 'Just now';
        };

        const calculateSla = (request) => {
            const submitted = new Date(request.submittedAt);
            let endDate;
            
            if (request.status === 'approved' || request.status === 'rejected') {
                endDate = request.completedAt ? new Date(request.completedAt) : new Date();
            } else {
                endDate = new Date();
            }
            
            const days = Math.ceil((endDate - submitted) / (1000 * 60 * 60 * 24));
            return `${days}d`;
        };

        const getSlaClass = (request) => {
            const submitted = new Date(request.submittedAt);
            const now = new Date();
            const days = Math.ceil((now - submitted) / (1000 * 60 * 60 * 24));
            
            if (request.status === 'approved' || request.status === 'rejected') {
                return 'completed';
            }
            if (days <= 2) return 'good';
            if (days <= 5) return 'warning';
            return 'critical';
        };

        const getLogDotClass = (action) => {
            if (action === 'Approved') return 'approved';
            if (action === 'Rejected') return 'rejected';
            return 'default';
        };

        // Actions
        const viewRequest = (request) => {
            selectedRequest.value = request;
        };

        const approveRequest = () => {
            const pendingStep = selectedRequest.value.approvalFlow.find(s => s.status === 'pending');
            if (pendingStep) {
                pendingStep.status = 'approved';
                pendingStep.actionAt = new Date().toISOString();
                
                // Add to action log
                selectedRequest.value.actionLog.push({
                    action: 'Approved',
                    user: 'Current User',
                    timestamp: new Date().toISOString(),
                    comment: actionComment.value || null
                });

                // Check if there's a next step
                const nextPending = selectedRequest.value.approvalFlow.find(s => s.status === 'waiting');
                if (nextPending) {
                    nextPending.status = 'pending';
                    selectedRequest.value.status = 'in_review';
                    selectedRequest.value.currentApprover = nextPending.role;
                    selectedRequest.value.currentApproverName = nextPending.assignee;
                } else {
                    selectedRequest.value.status = 'approved';
                    selectedRequest.value.currentApprover = null;
                    selectedRequest.value.currentApproverName = null;
                    selectedRequest.value.completedAt = new Date().toISOString();
                }

                actionComment.value = '';
            }
        };

        const rejectRequest = () => {
            const pendingStep = selectedRequest.value.approvalFlow.find(s => s.status === 'pending');
            if (pendingStep) {
                pendingStep.status = 'rejected';
                pendingStep.actionAt = new Date().toISOString();
                
                // Add to action log
                selectedRequest.value.actionLog.push({
                    action: 'Rejected',
                    user: 'Current User',
                    timestamp: new Date().toISOString(),
                    comment: actionComment.value || null
                });

                selectedRequest.value.status = 'rejected';
                selectedRequest.value.currentApprover = null;
                selectedRequest.value.currentApproverName = null;
                selectedRequest.value.completedAt = new Date().toISOString();
                actionComment.value = '';
            }
        };

        const addComment = () => {
            if (!newComment.value.trim()) return;
            
            selectedRequest.value.actionLog.push({
                action: 'Commented',
                user: 'Current User',
                timestamp: new Date().toISOString(),
                comment: newComment.value
            });
            newComment.value = '';
        };

        return {
            // State
            requests,
            selectedRequest,
            statusFilter,
            roleFilter,
            actionComment,
            newComment,
            viewType,
            filters,
            // Filter options
            countryOptions,
            departmentOptions,
            filteredSections,
            filteredUnits,
            filteredTeams,
            entityOptions,
            officeOptions,
            viewTypeOptions,
            hasActiveFilters,
            // Computed - Status counts
            pendingCount,
            approvedCount,
            rejectedCount,
            inReviewCount,
            averageSla,
            // Computed - Role counts
            lineManagerCount,
            hrAdminCount,
            hrManagerCount,
            hrEvpCount,
            // Computed
            filteredRequests,
            canTakeAction,
            // Helpers
            getCategoryColor,
            getCategoryIcon,
            getStatusLabel,
            getStatusIcon,
            setStatusFilter,
            setRoleFilter,
            formatDate,
            formatDateTime,
            formatTime,
            formatTimeAgo,
            calculateSla,
            getSlaClass,
            getLogDotClass,
            // Filter handlers
            onDepartmentChange,
            onSectionChange,
            onUnitChange,
            applyFilters,
            resetFilters,
            // Actions
            viewRequest,
            approveRequest,
            rejectRequest,
            addComment
        };
    }
};

window.MyRequestsComponent = MyRequestsComponent;
