/**
 * HR Request View Component
 * Shows details of an HR request with approve/reject actions
 */

const HrRequestViewComponent = {
    props: {
        request: {
            type: Object,
            required: true
        }
    },

    template: `
        <div class="hr-request-view-page">
            <!-- Page Header -->
            <div class="view-header">
                <p-button icon="pi pi-arrow-left" text @click="$emit('back')"></p-button>
                <div class="view-header-content">
                    <div class="view-title-icon" :style="getIconStyle(request)">
                        <i :class="'pi ' + request.icon"></i>
                    </div>
                    <div class="view-title-info">
                        <h2>{{ request.type }}</h2>
                        <p>#{{ request.trackingId }} • Submitted on {{ formatDate(request.dateOfAction) }}</p>
                    </div>
                </div>
                <div class="view-header-status">
                    <span class="status-badge large" :class="getStatusClass(request.status)">
                        {{ request.status }}
                    </span>
                </div>
            </div>

            <!-- Main Content -->
            <div class="view-content">
                <!-- Left Column - Request Details -->
                <div class="view-details">
                    <!-- Employee Info Card -->
                    <div class="detail-card">
                        <div class="detail-card-header">
                            <i class="pi pi-user"></i>
                            <span>Employee Information</span>
                        </div>
                        <div class="employee-info-row">
                            <img :src="request.employeeAvatar" :alt="request.employeeName" class="employee-avatar-lg">
                            <div class="employee-details-full">
                                <div class="employee-name-lg">{{ request.employeeName }}</div>
                                <div class="employee-meta">
                                    <span><i class="pi pi-id-card"></i> {{ request.employeeId }}</span>
                                    <span><i class="pi pi-building"></i> {{ request.employeeDepartment }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- HR User Info Card -->
                    <div class="detail-card">
                        <div class="detail-card-header">
                            <i class="pi pi-user-edit"></i>
                            <span>Submitted By</span>
                        </div>
                        <div class="submitted-by-row">
                            <div class="hr-avatar">
                                {{ getInitials(request.hrUserName) }}
                            </div>
                            <div class="hr-details">
                                <div class="hr-name">{{ request.hrUserName }}</div>
                                <div class="hr-role">{{ request.hrUserRole }}</div>
                            </div>
                            <div class="submission-date">
                                <i class="pi pi-calendar"></i>
                                {{ formatDate(request.dateOfAction) }}
                            </div>
                        </div>
                    </div>

                    <!-- Requested Changes Card -->
                    <div class="detail-card changes-card">
                        <div class="detail-card-header">
                            <i class="pi pi-pencil"></i>
                            <span>Requested Changes</span>
                        </div>
                        
                        <div v-for="(changes, groupName) in groupedChanges" :key="groupName" class="changes-group">
                            <div class="changes-group-title">{{ groupName }}</div>
                            <div class="changes-list">
                                <div v-for="change in changes" :key="change.field" class="change-item">
                                    <div class="change-field">{{ change.field }}</div>
                                    <div class="change-values">
                                        <div class="change-old">
                                            <span class="change-label">Current</span>
                                            <span class="change-value">{{ change.oldValue }}</span>
                                        </div>
                                        <div class="change-arrow">
                                            <i class="pi pi-arrow-right"></i>
                                        </div>
                                        <div class="change-new">
                                            <span class="change-label">New</span>
                                            <span class="change-value highlight">{{ change.newValue }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Actions Panel -->
                <div class="view-actions-panel">
                    <div class="actions-card">
                        <div class="actions-card-header">
                            <i class="pi pi-check-square"></i>
                            <span>Actions</span>
                        </div>

                        <div v-if="request.status === 'Pending' || request.status === 'Processing'" class="actions-content">
                            <p class="actions-hint">Review the requested changes and take action.</p>
                            
                            <div class="action-buttons">
                                <p-button label="Approve Request" icon="pi pi-check" 
                                          severity="success" 
                                          @click="approveRequest"
                                          style="width: 100%;"></p-button>
                                <p-button label="Reject Request" icon="pi pi-times" 
                                          severity="danger" 
                                          outlined
                                          @click="showRejectDialog = true"
                                          style="width: 100%;"></p-button>
                            </div>

                            <div class="action-note">
                                <i class="pi pi-info-circle"></i>
                                <span>Changes will be applied immediately upon approval.</span>
                            </div>
                        </div>

                        <div v-else class="actions-completed">
                            <div class="completed-icon" :class="request.status === 'Approved' ? 'approved' : 'rejected'">
                                <i :class="request.status === 'Approved' ? 'pi pi-check' : 'pi pi-times'"></i>
                            </div>
                            <div class="completed-text">
                                This request has been <strong>{{ request.status.toLowerCase() }}</strong>.
                            </div>
                            <div class="completed-date">
                                {{ formatDate(request.dateOfAction) }}
                            </div>
                        </div>
                    </div>

                    <!-- Timeline Card -->
                    <div class="timeline-card">
                        <div class="timeline-card-header">
                            <i class="pi pi-history"></i>
                            <span>Activity Timeline</span>
                        </div>
                        <div class="timeline-list">
                            <div class="timeline-item">
                                <div class="timeline-dot submitted"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">Request Submitted</div>
                                    <div class="timeline-meta">{{ request.hrUserName }} • {{ formatDate(request.dateOfAction) }}</div>
                                </div>
                            </div>
                            <div v-if="request.status !== 'Pending'" class="timeline-item">
                                <div class="timeline-dot" :class="request.status === 'Approved' ? 'approved' : request.status === 'Rejected' ? 'rejected' : 'processing'"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">{{ getTimelineStatusText(request.status) }}</div>
                                    <div class="timeline-meta">HR Manager • {{ formatDate(request.dateOfAction) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reject Dialog -->
            <p-dialog v-model:visible="showRejectDialog" header="Reject Request" :modal="true" :style="{ width: '450px' }">
                <div class="reject-dialog-content">
                    <p>Are you sure you want to reject this request?</p>
                    <div class="form-group">
                        <label class="form-label">Reason for Rejection</label>
                        <p-textarea v-model="rejectReason" rows="3" placeholder="Enter reason..." style="width: 100%;"></p-textarea>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" text @click="showRejectDialog = false"></p-button>
                    <p-button label="Reject" severity="danger" @click="rejectRequest"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup(props, { emit }) {
        const { ref, computed } = Vue;

        const showRejectDialog = ref(false);
        const rejectReason = ref('');

        // Group changes by their group field
        const groupedChanges = computed(() => {
            const groups = {};
            if (props.request && props.request.changes) {
                props.request.changes.forEach(change => {
                    const group = change.group || 'General';
                    if (!groups[group]) {
                        groups[group] = [];
                    }
                    groups[group].push(change);
                });
            }
            return groups;
        });

        const getIconStyle = (request) => {
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

        const getInitials = (name) => {
            return name.split(' ').map(n => n[0]).join('').toUpperCase();
        };

        const getTimelineStatusText = (status) => {
            const texts = {
                'Approved': 'Request Approved',
                'Processing': 'Under Review',
                'Rejected': 'Request Rejected'
            };
            return texts[status] || status;
        };

        const approveRequest = () => {
            if (confirm('Are you sure you want to approve this request?')) {
                alert('Request approved successfully!');
                emit('back');
            }
        };

        const rejectRequest = () => {
            if (!rejectReason.value.trim()) {
                alert('Please provide a reason for rejection.');
                return;
            }
            alert('Request rejected.');
            showRejectDialog.value = false;
            emit('back');
        };

        return {
            showRejectDialog,
            rejectReason,
            groupedChanges,
            getIconStyle,
            getStatusClass,
            formatDate,
            getInitials,
            getTimelineStatusText,
            approveRequest,
            rejectRequest
        };
    }
};
