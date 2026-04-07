/**
 * Pending Actions Component
 * Dashboard for Line Managers showing all items requiring their action
 */

const PendingActionsComponent = {
    template: `
        <div class="pending-actions-page">
            <!-- Stats Summary -->
            <div class="pending-stats-grid">
                <div class="pending-stat-card" :class="{ active: activeCategory === 'all' }" @click="activeCategory = 'all'">
                    <div class="pending-stat-icon all">
                        <i class="pi pi-inbox"></i>
                    </div>
                    <div class="pending-stat-info">
                        <div class="pending-stat-value">{{ totalPendingCount }}</div>
                        <div class="pending-stat-label">Total Pending</div>
                    </div>
                </div>
                <div class="pending-stat-card" :class="{ active: activeCategory === 'requests' }" @click="activeCategory = 'requests'">
                    <div class="pending-stat-icon requests">
                        <i class="pi pi-send"></i>
                    </div>
                    <div class="pending-stat-info">
                        <div class="pending-stat-value">{{ pendingRequests.length }}</div>
                        <div class="pending-stat-label">Leave Requests</div>
                    </div>
                </div>
                <div class="pending-stat-card" :class="{ active: activeCategory === 'helpdesk' }" @click="activeCategory = 'helpdesk'">
                    <div class="pending-stat-icon helpdesk">
                        <i class="pi pi-ticket"></i>
                    </div>
                    <div class="pending-stat-info">
                        <div class="pending-stat-value">{{ pendingHelpDesk.length }}</div>
                        <div class="pending-stat-label">HR Help Desk</div>
                    </div>
                </div>
                <div class="pending-stat-card" :class="{ active: activeCategory === 'appraisals' }" @click="activeCategory = 'appraisals'">
                    <div class="pending-stat-icon appraisals">
                        <i class="pi pi-star"></i>
                    </div>
                    <div class="pending-stat-info">
                        <div class="pending-stat-value">{{ pendingAppraisals.length }}</div>
                        <div class="pending-stat-label">Appraisals</div>
                    </div>
                </div>
                <div class="pending-stat-card" :class="{ active: activeCategory === 'training' }" @click="activeCategory = 'training'">
                    <div class="pending-stat-icon training">
                        <i class="pi pi-book"></i>
                    </div>
                    <div class="pending-stat-info">
                        <div class="pending-stat-value">{{ pendingTraining.length }}</div>
                        <div class="pending-stat-label">Training</div>
                    </div>
                </div>
            </div>

            <!-- Filters Section -->
            <div class="card compact-filters-grid" style="margin-bottom: 1.5rem; padding: 1rem 1.25rem;">
                <div class="filter-row">
                    <p-select v-model="filters.countryOfWork" :options="countryOptions" optionLabel="name" optionValue="id"
                              placeholder="Country of Work" showClear style="width: 160px;"></p-select>
                </div>
                <div class="filter-actions-row">
                    <p-button label="Apply" icon="pi pi-check" @click="applyFilters" size="small"></p-button>
                    <p-button label="Reset" icon="pi pi-refresh" outlined @click="resetFilters" size="small" v-if="hasActiveFilters"></p-button>
                </div>
            </div>

            <!-- Actions List -->
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">
                            <i class="pi pi-list-check"></i>
                            {{ getCategoryTitle }}
                        </div>
                        <div class="card-subtitle">Items requiring your review and action</div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <p-button label="Approve All" icon="pi pi-check" size="small" :disabled="filteredActions.length === 0" @click="showBulkApproveDialog = true"></p-button>
                    </div>
                </div>

                <div class="pending-actions-list" v-if="filteredActions.length > 0">
                    <div v-for="action in filteredActions" :key="action.id" class="pending-action-item" @click="openActionDetail(action)">
                        <div class="action-icon" :class="action.category">
                            <i :class="'pi ' + action.icon"></i>
                        </div>
                        <div class="action-content">
                            <div class="action-header">
                                <span class="action-type">{{ action.type }}</span>
                                <span class="action-id">{{ action.requestId }}</span>
                            </div>
                            <div class="action-employee">
                                <img :src="action.employee.avatar" :alt="action.employee.name" class="action-avatar">
                                <div class="action-employee-info">
                                    <span class="action-employee-name">{{ action.employee.name }}</span>
                                    <span class="action-employee-dept">{{ action.employee.department }}</span>
                                </div>
                            </div>
                            <div class="action-description">{{ action.description }}</div>
                            <div class="action-meta">
                                <span class="action-date"><i class="pi pi-calendar"></i> {{ action.submittedDate }}</span>
                            </div>
                        </div>
                        <div class="action-quick-btns">
                            <button class="quick-btn approve" @click.stop="quickApprove(action)" v-tooltip.top="'Approve'">
                                <i class="pi pi-check"></i>
                            </button>
                            <button class="quick-btn reject" @click.stop="quickReject(action)" v-tooltip.top="'Reject'">
                                <i class="pi pi-times"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="pending-empty-state" v-else>
                    <i class="pi pi-check-circle"></i>
                    <h3>All Caught Up!</h3>
                    <p>No pending actions in this category.</p>
                </div>
            </div>

            <!-- Leave Request Modal (like my-requests.js) -->
            <p-dialog v-model:visible="showRequestModal" :header="selectedAction?.type" :modal="true" :style="{ width: '950px' }" :maximizable="false" :draggable="false">
                <div v-if="selectedAction && selectedAction.category === 'requests'" class="request-detail-modal">
                    <div class="detail-grid">
                        <div class="detail-main">
                            <div class="detail-header-card">
                                <div class="detail-header-content">
                                    <div class="detail-type-icon" :style="{ background: '#3b82f615', color: '#3b82f6' }">
                                        <i :class="'pi ' + selectedAction.icon"></i>
                                    </div>
                                    <div class="detail-header-info">
                                        <div class="detail-title-row">
                                            <h1>{{ selectedAction.type }}</h1>
                                            <span class="request-status-badge large pending">
                                                <i class="pi pi-clock"></i> Pending
                                            </span>
                                        </div>
                                        <div class="detail-meta">
                                            <span><i class="pi pi-hashtag"></i> {{ selectedAction.requestId }}</span>
                                            <span><i class="pi pi-calendar"></i> Submitted on {{ selectedAction.submittedDate }}</span>
                                            <span><i class="pi pi-stopwatch"></i> SLA: 77d</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section-card">
                                <div class="section-header"><i class="pi pi-user"></i><span>Requester</span></div>
                                <div class="requester-info">
                                    <img :src="selectedAction.employee.avatar" :alt="selectedAction.employee.name" class="requester-avatar">
                                    <div>
                                        <div class="requester-name">{{ selectedAction.employee.name }}</div>
                                        <div class="requester-dept">{{ selectedAction.employee.department }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section-card">
                                <div class="section-header"><i class="pi pi-file-edit"></i><span>Request Details</span></div>
                                <div class="parameters-grid">
                                    <div v-for="(value, key) in selectedAction.details" :key="key" class="parameter-item">
                                        <div class="parameter-label">{{ key }}</div>
                                        <div class="parameter-value">{{ value }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section-card action-card">
                                <div class="section-header"><i class="pi pi-check-square"></i><span>Take Action</span></div>
                                <div class="action-form">
                                    <div class="form-group">
                                        <label class="form-label">Add Comment (Optional)</label>
                                        <p-textarea v-model="actionComment" rows="3" placeholder="Add a note or reason for your decision..." style="width: 100%;"></p-textarea>
                                    </div>
                                    <div class="action-buttons">
                                        <p-button label="Reject" icon="pi pi-times" severity="danger" outlined @click="rejectAction"></p-button>
                                        <p-button label="Approve" icon="pi pi-check" @click="approveAction"></p-button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="detail-sidebar">
                            <div class="sidebar-card">
                                <div class="sidebar-header"><i class="pi pi-sitemap"></i><span>Approval Flow</span></div>
                                <div class="approval-timeline">
                                    <div class="timeline-step pending">
                                        <div class="timeline-indicator">
                                            <div class="timeline-dot"><i class="pi pi-clock"></i></div>
                                            <div class="timeline-line"></div>
                                        </div>
                                        <div class="timeline-content">
                                            <div class="timeline-role">1 Line Manager</div>
                                            <div class="timeline-assignee">Fahad Al-Rashid</div>
                                            <div class="timeline-waiting">Awaiting action</div>
                                        </div>
                                    </div>
                                    <div class="timeline-step waiting">
                                        <div class="timeline-indicator">
                                            <div class="timeline-dot"><i class="pi pi-minus"></i></div>
                                        </div>
                                        <div class="timeline-content">
                                            <div class="timeline-role">HR Administrator</div>
                                            <div class="timeline-assignee">Sara Omar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="sidebar-card">
                                <div class="sidebar-header"><i class="pi pi-history"></i><span>Activity Log</span></div>
                                <div class="activity-log">
                                    <div class="log-entry">
                                        <div class="log-dot submitted"></div>
                                        <div class="log-content">
                                            <div class="log-action"><strong>Submitted</strong><span class="log-time">09:00</span></div>
                                            <div class="log-user">{{ selectedAction.employee.name }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </p-dialog>

            <!-- HR Help Desk Modal (like hr-request-view.js) -->
            <p-dialog v-model:visible="showHelpDeskModal" :header="selectedAction?.type" :modal="true" :style="{ width: '1100px' }" :maximizable="false" :draggable="false">
                <div v-if="selectedAction && selectedAction.category === 'helpdesk'" class="hr-request-view-modal">
                    <div class="view-content">
                        <div class="view-details">
                            <div class="detail-card">
                                <div class="detail-card-header"><i class="pi pi-user"></i><span>Employee Information</span></div>
                                <div class="employee-info-row">
                                    <img :src="selectedAction.employee.avatar" :alt="selectedAction.employee.name" class="employee-avatar-lg">
                                    <div class="employee-details-full">
                                        <div class="employee-name-lg">{{ selectedAction.employee.name }}</div>
                                        <div class="employee-meta">
                                            <span><i class="pi pi-id-card"></i> {{ selectedAction.employee.id }}</span>
                                            <span><i class="pi pi-building"></i> {{ selectedAction.employee.department }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-card">
                                <div class="detail-card-header"><i class="pi pi-user-edit"></i><span>Submitted By</span></div>
                                <div class="submitted-by-row">
                                    <div class="hr-avatar">AA</div>
                                    <div class="hr-details">
                                        <div class="hr-name">Ahmed Al-Sayed</div>
                                        <div class="hr-role">HR Manager</div>
                                    </div>
                                    <div class="submission-date"><i class="pi pi-calendar"></i> {{ selectedAction.submittedDate }}</div>
                                </div>
                            </div>

                            <div class="detail-card changes-card">
                                <div class="detail-card-header"><i class="pi pi-pencil"></i><span>Requested Changes</span></div>
                                <div class="changes-group">
                                    <div class="changes-group-title">{{ selectedAction.type }}</div>
                                    <div class="changes-list">
                                        <div v-for="(value, key) in selectedAction.details" :key="key" class="change-item">
                                            <div class="change-field">{{ key }}</div>
                                            <div class="change-values">
                                                <div class="change-old">
                                                    <span class="change-label">Current</span>
                                                    <span class="change-value">-</span>
                                                </div>
                                                <div class="change-arrow"><i class="pi pi-arrow-right"></i></div>
                                                <div class="change-new">
                                                    <span class="change-label">New</span>
                                                    <span class="change-value highlight">{{ value }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="view-actions-panel">
                            <div class="actions-card">
                                <div class="actions-card-header"><i class="pi pi-check-square"></i><span>Actions</span></div>
                                <div class="actions-content">
                                    <p class="actions-hint">Review the requested changes and take action.</p>
                                    <div class="action-buttons">
                                        <p-button label="Approve Request" icon="pi pi-check" severity="success" @click="approveAction" style="width: 100%;"></p-button>
                                        <p-button label="Reject Request" icon="pi pi-times" severity="danger" outlined @click="rejectAction" style="width: 100%;"></p-button>
                                    </div>
                                    <div class="action-note"><i class="pi pi-info-circle"></i><span>Changes will be applied immediately upon approval.</span></div>
                                </div>
                            </div>

                            <div class="timeline-card">
                                <div class="timeline-card-header"><i class="pi pi-history"></i><span>Activity Timeline</span></div>
                                <div class="timeline-list">
                                    <div class="timeline-item">
                                        <div class="timeline-dot submitted"></div>
                                        <div class="timeline-content">
                                            <div class="timeline-title">Request Submitted</div>
                                            <div class="timeline-meta">Ahmed Al-Sayed • {{ selectedAction.submittedDate }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </p-dialog>

            <!-- Appraisal Modal (like appraisal-tracking.js) -->
            <p-dialog v-model:visible="showAppraisalModal" :header="selectedAction?.type" :modal="true" :style="{ width: '1050px' }" :maximizable="false" :draggable="false">
                <div v-if="selectedAction && selectedAction.category === 'appraisals'" class="appraisal-modal-content">
                    <!-- Header -->
                    <div class="self-eval-header">
                        <div class="header-left">
                            <img :src="selectedAction.employee.avatar" class="detail-avatar">
                            <div class="header-info">
                                <div class="employee-name">{{ selectedAction.employee.name }}</div>
                                <div class="employee-meta-line">{{ selectedAction.employee.id }} | Professional</div>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="score-display">
                                <span class="score-value">{{ selectedAction.details['Self Score'] || '80' }}%</span>
                            </div>
                            <span class="phase-badge">{{ selectedAction.details['Status'] || 'AWAITING REVIEW' }}</span>
                        </div>
                    </div>

                    <!-- Two Column Layout -->
                    <div class="appraisal-two-col">
                        <div class="appraisal-left-col">
                            <div class="eval-card">
                                <div class="eval-card-header">
                                    <i class="pi pi-user"></i>
                                    <span>Employee Submission</span>
                                    <span class="score-badge">{{ selectedAction.details['Self Score'] || '84' }}%</span>
                                </div>
                                <div class="eval-breakdown">
                                    <div class="breakdown-row">
                                        <span>CORPORATE OBJ.</span>
                                        <span class="breakdown-score">4% <small>/ 5%</small></span>
                                    </div>
                                    <div class="breakdown-row">
                                        <span>PERSONAL KPIS</span>
                                        <span class="breakdown-score">52% <small>/ 60%</small></span>
                                    </div>
                                    <div class="breakdown-row">
                                        <span>COMPETENCY</span>
                                        <span class="breakdown-score">28% <small>/ 35%</small></span>
                                    </div>
                                </div>
                                <div class="self-justification">
                                    <div class="justification-label">SELF JUSTIFICATION</div>
                                    <p>"{{ selectedAction.description }}"</p>
                                </div>
                            </div>

                            <div class="upload-card">
                                <div class="upload-icon"><i class="pi pi-comments"></i></div>
                                <div class="upload-title">Manager Assessment Doc</div>
                                <div class="upload-area">
                                    <span class="upload-text">UPLOAD APPRAISAL SUMMARY</span>
                                    <span class="upload-hint">PDF / XLSX only</span>
                                </div>
                            </div>
                        </div>

                        <div class="appraisal-right-col">
                            <div class="manager-assessment-card">
                                <div class="assessment-header">
                                    <span class="step-number">02</span>
                                    <span>Managerial Assessment</span>
                                </div>
                                <div class="score-inputs">
                                    <div class="score-input-group">
                                        <label>CORPORATE OBJ.<br><small>Max: 5%</small></label>
                                        <div class="score-input-box">
                                            <span class="score-val">4</span> / 5
                                        </div>
                                    </div>
                                    <div class="score-input-group highlight">
                                        <label>PERSONAL KPIS<br><small>Max: 60%</small></label>
                                        <div class="score-input-box">
                                            <span class="score-val">48</span> / 60
                                        </div>
                                    </div>
                                    <div class="score-input-group">
                                        <label>COMPETENCY<br><small>Max: 35%</small></label>
                                        <div class="score-input-box">
                                            <span class="score-val">28</span> / 35
                                        </div>
                                    </div>
                                </div>

                                <div class="final-rating-box">
                                    <div class="rating-icon"><i class="pi pi-chart-bar"></i></div>
                                    <div class="rating-info">
                                        <div class="rating-label">FINAL MANAGER RATING</div>
                                        <div class="rating-sublabel">Calculated Score out of 100%</div>
                                    </div>
                                    <div class="rating-score">80%</div>
                                </div>

                                <div class="feedback-section">
                                    <label>MANAGERIAL FEEDBACK & DEVELOPMENTAL GOALS</label>
                                    <p-textarea v-model="managerFeedback" rows="3" placeholder="Provide constructive feedback based on the scores above..." style="width: 100%;"></p-textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="next-action-note">
                        <i class="pi pi-info-circle"></i>
                        <div>
                            <strong>Next Action: Supervisor Review</strong>
                            <p>Your ratings will be submitted for committee verification.</p>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" icon="pi pi-times" severity="danger" outlined @click="showAppraisalModal = false"></p-button>
                    <p-button label="Final Approval" icon="pi pi-check" @click="approveAction"></p-button>
                </template>
            </p-dialog>

            <!-- Training Modal -->
            <p-dialog v-model:visible="showTrainingModal" :header="selectedAction?.type" :modal="true" :style="{ width: '750px' }" :maximizable="false" :draggable="false">
                <div v-if="selectedAction && selectedAction.category === 'training'" class="training-modal-content">
                    <div class="training-header">
                        <img :src="selectedAction.employee.avatar" class="training-avatar">
                        <div class="training-info">
                            <div class="training-employee-name">{{ selectedAction.employee.name }}</div>
                            <div class="training-employee-meta">{{ selectedAction.employee.id }} • {{ selectedAction.employee.department }}</div>
                        </div>
                        <div class="training-status-badge" :class="getTrainingStatusClass(selectedAction.details['Current Status'])">
                            {{ selectedAction.details['Current Status'] }}
                        </div>
                    </div>

                    <div class="training-details-grid">
                        <div class="training-detail-item">
                            <div class="training-detail-label">Training Path</div>
                            <div class="training-detail-value">{{ selectedAction.details['Training Path'] }}</div>
                        </div>
                        <div class="training-detail-item">
                            <div class="training-detail-label">Total Hours</div>
                            <div class="training-detail-value hours-badge">{{ selectedAction.details['Total Hours'] }}</div>
                        </div>
                        <div class="training-detail-item">
                            <div class="training-detail-label">Batch Details</div>
                            <div class="training-detail-value">{{ selectedAction.details['Batch Details'] }}</div>
                        </div>
                        <div class="training-detail-item">
                            <div class="training-detail-label">Progress Score</div>
                            <div class="training-detail-value">{{ selectedAction.details['Progress Score'] }}</div>
                        </div>
                    </div>

                    <div class="training-description-card">
                        <div class="description-header"><i class="pi pi-info-circle"></i> Request Details</div>
                        <p>{{ selectedAction.description }}</p>
                    </div>

                    <div class="training-status-update">
                        <label>Update Status</label>
                        <div class="status-options">
                            <div class="status-option" :class="{ active: selectedTrainingStatus === 'Assigned' }" @click="selectedTrainingStatus = 'Assigned'">
                                <i class="pi pi-circle"></i> Assigned
                            </div>
                            <div class="status-option progress" :class="{ active: selectedTrainingStatus === 'In Progress' }" @click="selectedTrainingStatus = 'In Progress'">
                                <i class="pi pi-spinner"></i> In Progress
                            </div>
                            <div class="status-option success" :class="{ active: selectedTrainingStatus === 'Completed' }" @click="selectedTrainingStatus = 'Completed'">
                                <i class="pi pi-check-circle"></i> Completed
                            </div>
                            <div class="status-option danger" :class="{ active: selectedTrainingStatus === 'Failed' }" @click="selectedTrainingStatus = 'Failed'">
                                <i class="pi pi-times-circle"></i> Failed
                            </div>
                        </div>
                    </div>

                    <div class="training-action-section">
                        <label>Comments (Optional)</label>
                        <p-textarea v-model="actionComment" rows="3" placeholder="Add a note for the employee..." style="width: 100%;"></p-textarea>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" icon="pi pi-times" severity="danger" outlined @click="showTrainingModal = false"></p-button>
                    <p-button label="Update Status" icon="pi pi-check" @click="approveAction"></p-button>
                </template>
            </p-dialog>

            <!-- Bulk Approve Dialog -->
            <p-dialog v-model:visible="showBulkApproveDialog" header="Bulk Approve" :modal="true" :style="{ width: '450px' }" :maximizable="false" :draggable="false">
                <div class="bulk-approve-content">
                    <i class="pi pi-exclamation-triangle" style="font-size: 2.5rem; color: var(--primary-color);"></i>
                    <p>You are about to approve <strong>{{ filteredActions.length }}</strong> pending {{ activeCategory === 'all' ? 'actions' : activeCategory }}.</p>
                    <p style="color: var(--text-color-secondary); font-size: 0.9rem;">This action cannot be undone. Are you sure you want to continue?</p>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="secondary" @click="showBulkApproveDialog = false"></p-button>
                    <p-button label="Approve All" icon="pi pi-check" @click="bulkApprove"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed, reactive } = Vue;

        const activeCategory = ref('all');
        const showRequestModal = ref(false);
        const showHelpDeskModal = ref(false);
        const showAppraisalModal = ref(false);
        const showTrainingModal = ref(false);
        const showBulkApproveDialog = ref(false);
        const selectedAction = ref(null);
        const actionComment = ref('');
        const managerFeedback = ref('');
        
        // Filter state
        const countryOptions = ref([...StaticData.countriesOfWork]);
        const filters = reactive({
            countryOfWork: null
        });
        const appliedFilters = reactive({
            countryOfWork: null
        });
        
        const hasActiveFilters = computed(() => {
            return filters.countryOfWork || appliedFilters.countryOfWork;
        });
        
        const applyFilters = () => {
            appliedFilters.countryOfWork = filters.countryOfWork;
        };
        
        const resetFilters = () => {
            filters.countryOfWork = null;
            appliedFilters.countryOfWork = null;
        };

        // Pending Leave/Order Requests
        const pendingRequests = ref([
            {
                id: 1, category: 'requests', categoryLabel: 'Leave Request', type: 'Annual Leave', requestId: 'REQ-001', icon: 'pi-calendar',
                employee: { id: 'EMP-012', name: 'Ahmed Hassan', department: 'Engineering', avatar: 'https://i.pravatar.cc/40?img=12' },
                description: 'Requesting 5 days annual leave from March 15-20, 2026 for family vacation.',
                submittedDate: '20 Jan 2026',
                countryOfWork: 2,
                details: { 'Leave Period': '01 Feb 2026 — 05 Feb 2026', 'Duration': '5 working days' }
            },
            {
                id: 2, category: 'requests', categoryLabel: 'Leave Request', type: 'Sick Leave', requestId: 'REQ-002', icon: 'pi-heart',
                employee: { id: 'EMP-008', name: 'Sara Al-Mutairi', department: 'Marketing', avatar: 'https://i.pravatar.cc/40?img=5' },
                description: 'Sick leave request for 2 days due to medical appointment and recovery.',
                submittedDate: '22 Jan 2026',
                countryOfWork: 1,
                details: { 'Leave Period': '23 Jan 2026 — 24 Jan 2026', 'Duration': '2 working days', 'Medical Certificate': 'Attached' }
            },
            {
                id: 3, category: 'requests', categoryLabel: 'Leave Request', type: 'Work From Home', requestId: 'REQ-003', icon: 'pi-home',
                employee: { id: 'EMP-015', name: 'Khalid Al-Fahad', department: 'Finance', avatar: 'https://i.pravatar.cc/40?img=15' },
                description: 'Request to work from home on Feb 25 for home maintenance appointment.',
                submittedDate: '19 Feb 2026',
                countryOfWork: 2,
                details: { 'Date': 'Feb 25, 2026', 'Reason': 'Home maintenance' }
            }
        ]);

        // Pending HR Help Desk Requests
        const pendingHelpDesk = ref([
            {
                id: 4, category: 'helpdesk', categoryLabel: 'HR Help Desk', type: 'Employee Promotion', requestId: 'HD-045', icon: 'pi-arrow-up-right',
                employee: { id: 'EMP-022', name: 'Sarah Johnson', department: 'Engineering', avatar: 'https://i.pravatar.cc/40?img=22' },
                description: 'Promotion request from Software Engineer to Lead Engineer with salary adjustment.',
                submittedDate: '06 Feb 2026',
                countryOfWork: 2,
                details: { 'Main Grade': 'Professional → Supervisor', 'Sub Grade': 'Senior Officers → Lead', 'Job Title': 'Software Engineer → Lead Engineer', 'Basic Salary': '8,633 → 12,000', 'Accommodation Allowance': '2,125 → 3,000', 'Transportation Allowance': '680 → 1,000' }
            },
            {
                id: 5, category: 'helpdesk', categoryLabel: 'HR Help Desk', type: 'Employee Transfer', requestId: 'HD-046', icon: 'pi-arrow-right-arrow-left',
                employee: { id: 'EMP-019', name: 'Fahad Al-Otaibi', department: 'Sales', avatar: 'https://i.pravatar.cc/40?img=19' },
                description: 'Request to transfer to Jeddah branch effective April 2026.',
                submittedDate: '15 Feb 2026',
                countryOfWork: 3,
                details: { 'Transfer Type': 'Branch Transfer', 'Current Branch': 'Riyadh HQ', 'Target Branch': 'Jeddah Branch', 'Effective Date': 'April 1, 2026' }
            }
        ]);

        // Pending Appraisals
        const pendingAppraisals = ref([
            {
                id: 6, category: 'appraisals', categoryLabel: 'Performance Appraisal', type: 'Managerial Review', requestId: 'APR-101', icon: 'pi-star',
                employee: { id: 'EMP-003', name: 'Fatima Ibrahim', department: 'Engineering', avatar: 'https://i.pravatar.cc/40?img=7' },
                description: 'Upgraded HQ server infrastructure. 60% complete.',
                submittedDate: '10 Feb 2026',
                countryOfWork: 1,
                details: { 'Appraisal Cycle': 'April 2025 - April 2026', 'Self Score': '84%', 'Status': 'COMMITTEE PHASE' }
            },
            {
                id: 7, category: 'appraisals', categoryLabel: 'Performance Appraisal', type: 'Self-Appraisal', requestId: 'APR-102', icon: 'pi-user',
                employee: { id: 'EMP-003', name: 'Mohammed Al-Rashid', department: 'Finance', avatar: 'https://i.pravatar.cc/40?img=11' },
                description: 'Completed all quarterly targets ahead of schedule. Led the payroll automation project.',
                submittedDate: '12 Feb 2026',
                countryOfWork: 2,
                details: { 'Appraisal Cycle': 'Q1 2026', 'Self Score': '74%', 'Status': 'EMPLOYEE PHASE' }
            },
            {
                id: 8, category: 'appraisals', categoryLabel: 'Performance Appraisal', type: 'Batch Assignment', requestId: 'APR-103', icon: 'pi-users',
                employee: { id: 'EMP-005', name: 'Yusuf Ahmed', department: 'Operations', avatar: 'https://i.pravatar.cc/40?img=25' },
                description: 'View appraisal package configuration and committee assignment details.',
                submittedDate: '18 Feb 2026',
                countryOfWork: 2,
                details: { 'Evaluation Cycle': 'April 2025 - April 2026', 'Grade Focus': 'Professional Level', 'KPIs': 'Ops_KPIs_FY25.xlsx', 'Status': 'ASSIGNED' }
            }
        ]);

        // Pending Training
        const pendingTraining = ref([
            {
                id: 9, category: 'training', categoryLabel: 'Training', type: 'Training Status Update', requestId: 'TRN-1000', icon: 'pi-book',
                employee: { id: 'EMP-1000', name: 'Employee 1', department: 'Engineering > Frontend > React Unit', avatar: 'https://i.pravatar.cc/40?img=14' },
                description: 'Employee is currently assigned to Cybersecurity Essentials training. Review and update status as needed.',
                submittedDate: 'Jan 2024',
                countryOfWork: 2,
                details: { 'Training Path': 'Cybersecurity Essentials', 'Total Hours': '10 HRS', 'Batch Details': 'Cycle 1 (January 2024 — June 2024)', 'Current Status': 'Assigned', 'Progress Score': '0%' }
            },
            {
                id: 10, category: 'training', categoryLabel: 'Training', type: 'Training Status Update', requestId: 'TRN-1001', icon: 'pi-book',
                employee: { id: 'EMP-1001', name: 'Employee 2', department: 'Sales > Inside Sales > Inside Accounts', avatar: 'https://i.pravatar.cc/40?img=18' },
                description: 'Employee is progressing through Leadership & Management training. Current progress at 10%.',
                submittedDate: 'Jan 2024',
                countryOfWork: 1,
                details: { 'Training Path': 'Leadership & Management', 'Total Hours': '40 HRS', 'Batch Details': 'Cycle 2 (January 2024 — June 2024)', 'Current Status': 'In Progress', 'Progress Score': '10%' }
            }
        ]);
        
        const selectedTrainingStatus = ref('');

        // Computed
        const totalPendingCount = computed(() => {
            return pendingRequests.value.length + pendingHelpDesk.value.length + pendingAppraisals.value.length + pendingTraining.value.length;
        });

        const filteredActions = computed(() => {
            let result = [];
            if (activeCategory.value === 'all') {
                result = [...pendingRequests.value, ...pendingHelpDesk.value, ...pendingAppraisals.value, ...pendingTraining.value];
            } else if (activeCategory.value === 'requests') {
                result = pendingRequests.value;
            } else if (activeCategory.value === 'helpdesk') {
                result = pendingHelpDesk.value;
            } else if (activeCategory.value === 'appraisals') {
                result = pendingAppraisals.value;
            } else if (activeCategory.value === 'training') {
                result = pendingTraining.value;
            }
            
            // Apply country filter
            if (appliedFilters.countryOfWork) {
                result = result.filter(item => item.countryOfWork === appliedFilters.countryOfWork);
            }
            
            return result;
        });

        const getCategoryTitle = computed(() => {
            const titles = {
                'all': 'All Pending Actions',
                'requests': 'Pending Leave Requests',
                'helpdesk': 'Pending HR Help Desk',
                'appraisals': 'Pending Appraisals',
                'training': 'Pending Training'
            };
            return titles[activeCategory.value] || 'Pending Actions';
        });

        // Methods
        const getTrainingStatusClass = (status) => {
            if (status === 'Completed') return 'completed';
            if (status === 'In Progress') return 'in-progress';
            if (status === 'Assigned') return 'assigned';
            if (status === 'Failed') return 'failed';
            return '';
        };

        const openActionDetail = (action) => {
            selectedAction.value = action;
            actionComment.value = '';
            managerFeedback.value = '';
            
            if (action.category === 'requests') {
                showRequestModal.value = true;
            } else if (action.category === 'helpdesk') {
                showHelpDeskModal.value = true;
            } else if (action.category === 'appraisals') {
                showAppraisalModal.value = true;
            } else if (action.category === 'training') {
                selectedTrainingStatus.value = action.details['Current Status'] || 'Assigned';
                showTrainingModal.value = true;
            }
        };

        const closeAllModals = () => {
            showRequestModal.value = false;
            showHelpDeskModal.value = false;
            showAppraisalModal.value = false;
            showTrainingModal.value = false;
        };

        const removeAction = (action) => {
            if (action.category === 'requests') {
                pendingRequests.value = pendingRequests.value.filter(a => a.id !== action.id);
            } else if (action.category === 'helpdesk') {
                pendingHelpDesk.value = pendingHelpDesk.value.filter(a => a.id !== action.id);
            } else if (action.category === 'appraisals') {
                pendingAppraisals.value = pendingAppraisals.value.filter(a => a.id !== action.id);
            } else if (action.category === 'training') {
                pendingTraining.value = pendingTraining.value.filter(a => a.id !== action.id);
            }
        };

        const approveAction = () => {
            if (selectedAction.value) {
                removeAction(selectedAction.value);
                closeAllModals();
                selectedAction.value = null;
            }
        };

        const rejectAction = () => {
            if (selectedAction.value) {
                removeAction(selectedAction.value);
                closeAllModals();
                selectedAction.value = null;
            }
        };

        const quickApprove = (action) => {
            removeAction(action);
        };

        const quickReject = (action) => {
            removeAction(action);
        };

        const bulkApprove = () => {
            if (activeCategory.value === 'all') {
                pendingRequests.value = [];
                pendingHelpDesk.value = [];
                pendingAppraisals.value = [];
                pendingTraining.value = [];
            } else if (activeCategory.value === 'requests') {
                pendingRequests.value = [];
            } else if (activeCategory.value === 'helpdesk') {
                pendingHelpDesk.value = [];
            } else if (activeCategory.value === 'appraisals') {
                pendingAppraisals.value = [];
            } else if (activeCategory.value === 'training') {
                pendingTraining.value = [];
            }
            showBulkApproveDialog.value = false;
        };

        return {
            activeCategory,
            showRequestModal,
            showHelpDeskModal,
            showAppraisalModal,
            showTrainingModal,
            showBulkApproveDialog,
            selectedAction,
            actionComment,
            managerFeedback,
            selectedTrainingStatus,
            pendingRequests,
            pendingHelpDesk,
            pendingAppraisals,
            pendingTraining,
            totalPendingCount,
            filteredActions,
            getCategoryTitle,
            openActionDetail,
            getTrainingStatusClass,
            approveAction,
            rejectAction,
            quickApprove,
            quickReject,
            bulkApprove,
            // Filter-related
            filters,
            countryOptions,
            hasActiveFilters,
            applyFilters,
            resetFilters
        };
    }
};

window.PendingActionsComponent = PendingActionsComponent;
