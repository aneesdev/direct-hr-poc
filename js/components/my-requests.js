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
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="pi pi-list"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ requests.length }}</div>
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
                        <div class="stat-icon purple">
                            <i class="pi pi-eye"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ inReviewCount }}</div>
                            <div class="stat-label">In Review</div>
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

                    <!-- Filters -->
                    <div class="request-filters">
                        <div class="filter-tabs">
                            <button class="filter-tab" :class="{ active: statusFilter === null }" @click="statusFilter = null">
                                All <span class="filter-count">{{ requests.length }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: statusFilter === 'pending' }" @click="statusFilter = 'pending'">
                                Pending <span class="filter-count">{{ pendingCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: statusFilter === 'in_review' }" @click="statusFilter = 'in_review'">
                                In Review <span class="filter-count">{{ inReviewCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: statusFilter === 'approved' }" @click="statusFilter = 'approved'">
                                Approved <span class="filter-count">{{ approvedCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: statusFilter === 'rejected' }" @click="statusFilter = 'rejected'">
                                Rejected <span class="filter-count">{{ rejectedCount }}</span>
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
                                <div class="date-cell">
                                    <div>{{ formatDate(slotProps.data.submittedAt) }}</div>
                                    <div class="time-ago">{{ formatTimeAgo(slotProps.data.submittedAt) }}</div>
                                </div>
                            </template>
                        </p-column>
                        <p-column header="Current Step">
                            <template #body="slotProps">
                                <span v-if="slotProps.data.currentApprover" class="current-approver">
                                    <i class="pi pi-user"></i>
                                    {{ slotProps.data.currentApprover }}
                                </span>
                                <span v-else class="completed-text">Completed</span>
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
        const { ref, computed } = Vue;

        // State
        const requests = ref([...StaticData.submittedRequests]);
        const selectedRequest = ref(null);
        const statusFilter = ref(null);
        const actionComment = ref('');
        const newComment = ref('');

        // Categories data for icons/colors
        const categories = ref([...StaticData.requestCategories]);
        const statuses = ref([...StaticData.requestStatuses]);

        // Computed counts
        const pendingCount = computed(() => requests.value.filter(r => r.status === 'pending').length);
        const approvedCount = computed(() => requests.value.filter(r => r.status === 'approved').length);
        const rejectedCount = computed(() => requests.value.filter(r => r.status === 'rejected').length);
        const inReviewCount = computed(() => requests.value.filter(r => r.status === 'in_review').length);

        const filteredRequests = computed(() => {
            if (!statusFilter.value) return requests.value;
            return requests.value.filter(r => r.status === statusFilter.value);
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
                } else {
                    selectedRequest.value.status = 'approved';
                    selectedRequest.value.currentApprover = null;
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
            actionComment,
            newComment,
            // Computed
            pendingCount,
            approvedCount,
            rejectedCount,
            inReviewCount,
            filteredRequests,
            canTakeAction,
            // Helpers
            getCategoryColor,
            getCategoryIcon,
            getStatusLabel,
            getStatusIcon,
            formatDate,
            formatDateTime,
            formatTime,
            formatTimeAgo,
            getLogDotClass,
            // Actions
            viewRequest,
            approveRequest,
            rejectRequest,
            addComment
        };
    }
};

window.MyRequestsComponent = MyRequestsComponent;
