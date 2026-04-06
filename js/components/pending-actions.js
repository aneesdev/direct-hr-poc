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

            <!-- Action Detail Modal -->
            <p-dialog v-model:visible="showDetailModal" :header="selectedAction?.type" :modal="true" :style="{ width: '650px' }">
                <div class="action-detail-content" v-if="selectedAction">
                    <div class="detail-employee-card">
                        <img :src="selectedAction.employee.avatar" :alt="selectedAction.employee.name" class="detail-avatar">
                        <div class="detail-employee-info">
                            <div class="detail-employee-name">{{ selectedAction.employee.name }}</div>
                            <div class="detail-employee-meta">{{ selectedAction.employee.id }} • {{ selectedAction.employee.department }}</div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <div class="detail-label">Request ID</div>
                        <div class="detail-value">{{ selectedAction.requestId }}</div>
                    </div>

                    <div class="detail-section">
                        <div class="detail-label">Description</div>
                        <div class="detail-value">{{ selectedAction.description }}</div>
                    </div>

                    <div class="detail-grid">
                        <div class="detail-section">
                            <div class="detail-label">Submitted</div>
                            <div class="detail-value">{{ selectedAction.submittedDate }}</div>
                        </div>
                        <div class="detail-section">
                            <div class="detail-label">Category</div>
                            <div class="detail-value">{{ selectedAction.categoryLabel }}</div>
                        </div>
                    </div>

                    <div class="detail-section" v-if="selectedAction.details">
                        <div class="detail-label">Additional Details</div>
                        <div class="detail-box">
                            <div v-for="(value, key) in selectedAction.details" :key="key" class="detail-row">
                                <span class="detail-key">{{ key }}:</span>
                                <span class="detail-val">{{ value }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <div class="detail-label">Comments (Optional)</div>
                        <p-textarea v-model="actionComment" rows="3" placeholder="Add a comment for the employee..." style="width: 100%;"></p-textarea>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Reject" icon="pi pi-times" severity="danger" outlined @click="rejectAction"></p-button>
                    <p-button label="Approve" icon="pi pi-check" @click="approveAction"></p-button>
                </template>
            </p-dialog>

            <!-- Bulk Approve Dialog -->
            <p-dialog v-model:visible="showBulkApproveDialog" header="Bulk Approve" :modal="true" :style="{ width: '450px' }">
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
        const { ref, computed } = Vue;

        const activeCategory = ref('all');
        const showDetailModal = ref(false);
        const showBulkApproveDialog = ref(false);
        const selectedAction = ref(null);
        const actionComment = ref('');

        // Pending Leave/Order Requests
        const pendingRequests = ref([
            {
                id: 1, category: 'requests', categoryLabel: 'Leave Request', type: 'Annual Leave Request', requestId: 'REQ-2026-001', icon: 'pi-calendar',
                employee: { id: 'EMP-012', name: 'Ahmed Al-Hassan', department: 'Engineering', avatar: 'https://i.pravatar.cc/40?img=12' },
                description: 'Requesting 5 days annual leave from March 15-20, 2026 for family vacation.',
                submittedDate: 'Feb 18, 2026', priority: 'Normal',
                details: { 'Leave Type': 'Annual Leave', 'Duration': '5 Days', 'Start Date': 'March 15, 2026', 'End Date': 'March 20, 2026', 'Balance After': '15 Days' }
            },
            {
                id: 2, category: 'requests', categoryLabel: 'Leave Request', type: 'Sick Leave Request', requestId: 'REQ-2026-002', icon: 'pi-heart',
                employee: { id: 'EMP-008', name: 'Sara Al-Mutairi', department: 'Marketing', avatar: 'https://i.pravatar.cc/40?img=5' },
                description: 'Sick leave request for 2 days due to medical appointment and recovery.',
                submittedDate: 'Feb 20, 2026', priority: 'Urgent',
                details: { 'Leave Type': 'Sick Leave', 'Duration': '2 Days', 'Start Date': 'Feb 22, 2026', 'End Date': 'Feb 23, 2026', 'Medical Certificate': 'Attached' }
            },
            {
                id: 3, category: 'requests', categoryLabel: 'Leave Request', type: 'Work From Home', requestId: 'REQ-2026-003', icon: 'pi-home',
                employee: { id: 'EMP-015', name: 'Khalid Al-Fahad', department: 'Finance', avatar: 'https://i.pravatar.cc/40?img=15' },
                description: 'Request to work from home on Feb 25 for home maintenance appointment.',
                submittedDate: 'Feb 19, 2026', priority: 'Low',
                details: { 'Request Type': 'Work From Home', 'Date': 'Feb 25, 2026', 'Reason': 'Home maintenance' }
            }
        ]);

        // Pending HR Help Desk Requests
        const pendingHelpDesk = ref([
            {
                id: 4, category: 'helpdesk', categoryLabel: 'HR Help Desk', type: 'Salary Certificate Request', requestId: 'HD-2026-045', icon: 'pi-file',
                employee: { id: 'EMP-022', name: 'Noura Al-Qahtani', department: 'Operations', avatar: 'https://i.pravatar.cc/40?img=22' },
                description: 'Request for salary certificate for bank loan application.',
                submittedDate: 'Feb 17, 2026', priority: 'Normal',
                details: { 'Certificate Type': 'Salary Certificate', 'Purpose': 'Bank Loan', 'Language': 'English', 'Copies': '2' }
            },
            {
                id: 5, category: 'helpdesk', categoryLabel: 'HR Help Desk', type: 'Employee Transfer', requestId: 'HD-2026-046', icon: 'pi-arrow-right-arrow-left',
                employee: { id: 'EMP-019', name: 'Fahad Al-Otaibi', department: 'Sales', avatar: 'https://i.pravatar.cc/40?img=19' },
                description: 'Request to transfer to Jeddah branch effective April 2026.',
                submittedDate: 'Feb 15, 2026', priority: 'Urgent',
                details: { 'Transfer Type': 'Branch Transfer', 'Current Branch': 'Riyadh HQ', 'Target Branch': 'Jeddah Branch', 'Effective Date': 'April 1, 2026' }
            }
        ]);

        // Pending Appraisals
        const pendingAppraisals = ref([
            {
                id: 6, category: 'appraisals', categoryLabel: 'Performance Appraisal', type: 'Self-Evaluation Review', requestId: 'APR-2026-101', icon: 'pi-star',
                employee: { id: 'EMP-007', name: 'Mohammed Al-Rashid', department: 'Engineering', avatar: 'https://i.pravatar.cc/40?img=7' },
                description: 'Employee has completed self-evaluation. Pending your review and scoring.',
                submittedDate: 'Feb 10, 2026', priority: 'Normal',
                details: { 'Appraisal Cycle': 'Q1 2026', 'Self Score': '88%', 'KPIs Completed': '12/15', 'Status': 'Awaiting Manager Review' }
            },
            {
                id: 7, category: 'appraisals', categoryLabel: 'Performance Appraisal', type: 'Committee Evaluation', requestId: 'APR-2026-102', icon: 'pi-users',
                employee: { id: 'EMP-011', name: 'Reem Al-Dossari', department: 'HR', avatar: 'https://i.pravatar.cc/40?img=11' },
                description: 'Committee evaluation pending. You are assigned as one of the reviewers.',
                submittedDate: 'Feb 12, 2026', priority: 'Urgent',
                details: { 'Appraisal Cycle': 'Q1 2026', 'Self Score': '92%', 'Manager Score': '90%', 'Committee Members': '3', 'Your Role': 'Committee Reviewer' }
            },
            {
                id: 8, category: 'appraisals', categoryLabel: 'Performance Appraisal', type: 'Goal Setting Approval', requestId: 'APR-2026-103', icon: 'pi-flag',
                employee: { id: 'EMP-025', name: 'Layla Al-Ghamdi', department: 'Product', avatar: 'https://i.pravatar.cc/40?img=25' },
                description: 'Employee submitted Q2 goals for approval.',
                submittedDate: 'Feb 18, 2026', priority: 'Normal',
                details: { 'Period': 'Q2 2026', 'Goals Submitted': '5', 'KPIs Defined': '8', 'Alignment': 'Department Objectives' }
            }
        ]);

        // Pending Training Acknowledgments
        const pendingTraining = ref([
            {
                id: 9, category: 'training', categoryLabel: 'Training', type: 'Training Completion Review', requestId: 'TRN-2026-055', icon: 'pi-book',
                employee: { id: 'EMP-014', name: 'Omar Al-Zahrani', department: 'IT', avatar: 'https://i.pravatar.cc/40?img=14' },
                description: 'Employee completed "Cybersecurity Essentials" training. Verify completion.',
                submittedDate: 'Feb 16, 2026', priority: 'Low',
                details: { 'Training Path': 'Cybersecurity Essentials', 'Hours Completed': '10/10', 'Score': '95%', 'Certificate': 'Generated' }
            },
            {
                id: 10, category: 'training', categoryLabel: 'Training', type: 'Training Extension Request', requestId: 'TRN-2026-056', icon: 'pi-clock',
                employee: { id: 'EMP-018', name: 'Huda Al-Subaie', department: 'Legal', avatar: 'https://i.pravatar.cc/40?img=18' },
                description: 'Request for 2-week extension on "Leadership & Management" training deadline.',
                submittedDate: 'Feb 19, 2026', priority: 'Normal',
                details: { 'Training Path': 'Leadership & Management', 'Current Progress': '65%', 'Original Deadline': 'Feb 28, 2026', 'Requested Deadline': 'March 14, 2026', 'Reason': 'Project commitments' }
            }
        ]);

        // Computed
        const totalPendingCount = computed(() => {
            return pendingRequests.value.length + pendingHelpDesk.value.length + pendingAppraisals.value.length + pendingTraining.value.length;
        });

        const filteredActions = computed(() => {
            if (activeCategory.value === 'all') {
                return [...pendingRequests.value, ...pendingHelpDesk.value, ...pendingAppraisals.value, ...pendingTraining.value];
            }
            if (activeCategory.value === 'requests') return pendingRequests.value;
            if (activeCategory.value === 'helpdesk') return pendingHelpDesk.value;
            if (activeCategory.value === 'appraisals') return pendingAppraisals.value;
            if (activeCategory.value === 'training') return pendingTraining.value;
            return [];
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
        const openActionDetail = (action) => {
            selectedAction.value = action;
            actionComment.value = '';
            showDetailModal.value = true;
        };

        const getPrioritySeverity = (priority) => {
            if (priority === 'Urgent') return 'danger';
            if (priority === 'Normal') return 'info';
            return 'secondary';
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
                showDetailModal.value = false;
                selectedAction.value = null;
            }
        };

        const rejectAction = () => {
            if (selectedAction.value) {
                removeAction(selectedAction.value);
                showDetailModal.value = false;
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
            showDetailModal,
            showBulkApproveDialog,
            selectedAction,
            actionComment,
            pendingRequests,
            pendingHelpDesk,
            pendingAppraisals,
            pendingTraining,
            totalPendingCount,
            filteredActions,
            getCategoryTitle,
            openActionDetail,
            getPrioritySeverity,
            approveAction,
            rejectAction,
            quickApprove,
            quickReject,
            bulkApprove
        };
    }
};

window.PendingActionsComponent = PendingActionsComponent;
