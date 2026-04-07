/**
 * Notifications Center Component
 * Full-page view of all HR notifications with All / Unread tabs and detail view on click
 */

const NotificationsCenterComponent = {
    template: `
        <div class="notifications-center-page">
            <template v-if="!selectedNotification">
                <div class="notifications-center-header">
                    <div class="notifications-center-heading">
                        <h1 class="notifications-center-title">Notifications Center</h1>
                        <p class="notifications-center-subtitle">Manage and track all your HR alerts and updates.</p>
                    </div>
                    <div class="notifications-center-actions">
                        <button class="notifications-center-link link-mark-read" @click="markAllAsRead" v-if="currentUnreadCount > 0">Mark all as read</button>
                        <a href="#" class="notifications-center-link link-back" @click.prevent="$emit('navigate', 'home')">Back to Dashboard</a>
                    </div>
                </div>

                <!-- Top Level Tabs: My Notifications / Team Notifications -->
                <div class="notifications-top-tabs">
                    <button class="top-tab" :class="{ active: topTab === 'my' }" @click="topTab = 'my'">
                        <i class="pi pi-user"></i> My Notifications
                    </button>
                    <button class="top-tab" :class="{ active: topTab === 'team' }" @click="topTab = 'team'">
                        <i class="pi pi-users"></i> Team Notifications
                    </button>
                </div>

                <div class="notifications-center-card">
                    <p-tabs :value="activeTab">
                        <p-tablist>
                            <p-tab value="all" @click="activeTab = 'all'">All Notifications ({{ currentNotifications.length }})</p-tab>
                            <p-tab value="unread" @click="activeTab = 'unread'">Unread ({{ currentUnreadCount }})</p-tab>
                        </p-tablist>
                        <p-tabpanels>
                            <p-tabpanel value="all">
                                <div class="notifications-center-list">
                                    <div v-for="n in currentNotifications" :key="n.id" class="notification-center-item clickable" :class="{ unread: !n.read }" @click="openDetail(n)">
                                        <div class="notification-item-icon" :class="n.iconClass">
                                            <i :class="'pi ' + n.icon"></i>
                                        </div>
                                        <div class="notification-item-content">
                                            <div class="notification-item-title">{{ n.title }}</div>
                                            <div class="notification-item-id" v-if="n.requestId">{{ n.requestId }}</div>
                                            <div class="notification-item-desc">{{ n.description }}</div>
                                        </div>
                                        <div class="notification-item-time">{{ n.time }}</div>
                                    </div>
                                    <div v-if="currentNotifications.length === 0" class="notifications-center-empty">No notifications.</div>
                                </div>
                            </p-tabpanel>
                            <p-tabpanel value="unread">
                                <div class="notifications-center-list">
                                    <div v-for="n in currentUnreadNotifications" :key="n.id" class="notification-center-item clickable unread" @click="openDetail(n)">
                                        <div class="notification-item-icon" :class="n.iconClass">
                                            <i :class="'pi ' + n.icon"></i>
                                        </div>
                                        <div class="notification-item-content">
                                            <div class="notification-item-title">{{ n.title }}</div>
                                            <div class="notification-item-id" v-if="n.requestId">{{ n.requestId }}</div>
                                            <div class="notification-item-desc">{{ n.description }}</div>
                                        </div>
                                        <div class="notification-item-time">{{ n.time }}</div>
                                    </div>
                                    <div v-if="currentUnreadNotifications.length === 0" class="notifications-center-empty">No unread notifications.</div>
                                </div>
                            </p-tabpanel>
                        </p-tabpanels>
                    </p-tabs>
                </div>
            </template>

            <!-- Notification detail view -->
            <div v-else class="notification-detail-card">
                <div class="notification-detail-header">
                    <div class="notification-detail-brand">
                        <span class="notification-detail-logo">D</span>
                        <span class="notification-detail-brand-name">DirectHR</span>
                    </div>
                    <a href="#" class="notification-detail-back" @click.prevent="selectedNotification = null">
                        <i class="pi pi-arrow-left"></i> Back to Notifications
                    </a>
                </div>
                <div class="notification-detail-body">
                    <div class="notification-detail-subject-row">
                        <div class="notification-detail-subject-wrap">
                            <div class="notification-detail-label">Subject</div>
                            <div class="notification-detail-subject">{{ detailContent.subject }}</div>
                        </div>
                        <div class="notification-detail-id-wrap" v-if="detailContent.requestId">
                            <div class="notification-detail-label">Request ID</div>
                            <div class="notification-detail-id">{{ detailContent.requestId }}</div>
                        </div>
                    </div>
                    <p class="notification-detail-greeting">Dear {{ userName }},</p>
                    <p class="notification-detail-text">{{ detailContent.body }}</p>
                    <p-button v-if="detailContent.ctaLabel" :label="detailContent.ctaLabel" icon="pi pi-external-link" iconPos="right" class="notification-detail-cta" @click="onDetailCta"></p-button>
                    <p class="notification-detail-closing">Best regards,<br><strong>The DirectHR Team</strong></p>
                </div>
                <div class="notification-detail-footer">
                    <div>© {{ currentYear }} Direct Travel. All rights reserved.</div>
                    <div>You received this notification as part of your employment with Direct.</div>
                </div>
            </div>
        </div>
    `,

    props: {
        openNotificationId: { type: Number, default: null }
    },

    emits: ['navigate', 'clear-open-notification'],

    setup(props, { emit }) {
        const { ref, computed, watch } = Vue;

        const activeTab = ref('all');
        const topTab = ref('my');
        const selectedNotification = ref(null);

        const userName = (StaticData && StaticData.homeData && StaticData.homeData.currentUser && StaticData.homeData.currentUser.name) ? StaticData.homeData.currentUser.name : 'Team Member';
        const currentYear = new Date().getFullYear();

        // My Notifications (existing)
        const allNotifications = ref([
            { id: 1, title: 'Leave Request Approved', requestId: 'REQ-001', description: 'Your leave request for March 15-20 has been officially approved.', time: '2 mins ago', icon: 'pi-check', iconClass: 'icon-success', read: false },
            { id: 2, title: 'New Shift Schedule', requestId: 'REQ-002', description: 'Your schedule for March 10-16 is now available for review.', time: '1 hour ago', icon: 'pi-clock', iconClass: 'icon-info', read: false },
            { id: 3, title: 'Performance Appraisal Assigned', requestId: 'RDD-003', description: 'Your Appraisal is Assigned.', time: '3 hours ago', icon: 'pi-file', iconClass: 'icon-warning', read: true },
            { id: 4, title: 'Leave Request Submitted', requestId: 'REQ-004', description: 'Your request for emergency leave has been successfully submitted.', time: '5 hours ago', icon: 'pi-plus', iconClass: 'icon-info', read: false },
            { id: 5, title: 'Training Path Assigned', requestId: 'RDD-005', description: "You have been assigned to 'Advanced Leadership Path'.", time: '1 day ago', icon: 'pi-book', iconClass: 'icon-purple', read: true },
            { id: 6, title: 'New Company Document', requestId: null, description: "A new document 'Remote Work Policy 2026' has been added to the portal.", time: '1 day ago', icon: 'pi-file', iconClass: 'icon-secondary', read: false },
            { id: 7, title: 'Happy Birthday!', requestId: null, description: 'The DirectHR team wishes you a wonderful birthday and a great year ahead!', time: '2 days ago', icon: 'pi-gift', iconClass: 'icon-warning', read: true },
            { id: 8, title: 'Promotion Approved', requestId: 'REQ-006', description: 'Your promotion to Lead Software Engineer has been approved.', time: '3 days ago', icon: 'pi-check', iconClass: 'icon-success', read: false },
            { id: 9, title: 'Disciplinary Action / Warnings', requestId: 'RDD-007', description: 'Your Disciplinary Action / Warnings has been officially approved.', time: '4 days ago', icon: 'pi-exclamation-triangle', iconClass: 'icon-danger', read: true },
            { id: 10, title: 'Performance Appraisal Assigned', requestId: 'REQ-008', description: 'Your Appraisal is ready for self-evaluation.', time: '5 days ago', icon: 'pi-file', iconClass: 'icon-warning', read: false }
        ]);

        // Team Notifications (HR Help Desk events for team members)
        const teamNotifications = ref([
            { id: 101, title: 'Employee Promoted', requestId: 'HD-101', description: 'Ahmed Hassan has been promoted from Software Engineer to Senior Software Engineer.', time: '1 hour ago', icon: 'pi-arrow-up-right', iconClass: 'icon-success', read: false, employee: 'Ahmed Hassan' },
            { id: 102, title: 'Employee Transferred', requestId: 'HD-102', description: 'Sara Al-Mutairi has been transferred from Marketing to Sales department.', time: '3 hours ago', icon: 'pi-arrow-right-arrow-left', iconClass: 'icon-info', read: false, employee: 'Sara Al-Mutairi' },
            { id: 103, title: 'Schedule Configuration Changed', requestId: 'HD-103', description: "Khalid Al-Fahad's work schedule has been updated to Remote Schedule.", time: '5 hours ago', icon: 'pi-calendar', iconClass: 'icon-purple', read: true, employee: 'Khalid Al-Fahad' },
            { id: 104, title: 'Salary Adjustment Approved', requestId: 'HD-104', description: "Noura Al-Subaie's salary adjustment request has been approved.", time: '1 day ago', icon: 'pi-money-bill', iconClass: 'icon-success', read: false, employee: 'Noura Al-Subaie' },
            { id: 105, title: 'Job Title Changed', requestId: 'HD-105', description: 'Mohammed Al-Rashid job title changed from Developer to Lead Developer.', time: '1 day ago', icon: 'pi-user-edit', iconClass: 'icon-info', read: true, employee: 'Mohammed Al-Rashid' },
            { id: 106, title: 'Contract Type Updated', requestId: 'HD-106', description: "Fatima Ibrahim's contract has been changed from Part-Time to Full-Time.", time: '2 days ago', icon: 'pi-file-edit', iconClass: 'icon-warning', read: false, employee: 'Fatima Ibrahim' },
            { id: 107, title: 'Employee Warning Issued', requestId: 'HD-107', description: 'A written warning has been issued to Yusuf Ahmed for attendance policy violation.', time: '3 days ago', icon: 'pi-exclamation-triangle', iconClass: 'icon-danger', read: true, employee: 'Yusuf Ahmed' },
            { id: 108, title: 'Cost Center Changed', requestId: 'HD-108', description: "Omar Al-Zahrani's cost center has been changed to IT Operations.", time: '4 days ago', icon: 'pi-building', iconClass: 'icon-secondary', read: false, employee: 'Omar Al-Zahrani' }
        ]);

        // Computed properties for current tab
        const currentNotifications = computed(() => {
            return topTab.value === 'my' ? allNotifications.value : teamNotifications.value;
        });

        const currentUnreadNotifications = computed(() => {
            return currentNotifications.value.filter(n => !n.read);
        });

        const currentUnreadCount = computed(() => {
            return currentUnreadNotifications.value.length;
        });

        watch(() => props.openNotificationId, (id) => {
            if (id == null) return;
            const n = allNotifications.value.find(not => not.id === id);
            if (n) {
                selectedNotification.value = n;
                n.read = true;
            }
            emit('clear-open-notification');
        }, { immediate: true });

        const notificationDetailConfig = {
            // My Notifications
            1: { subject: 'Leave Request Approved - DirectHR Notification', body: 'Your leave request for March 15th to March 20th, 2026 has been officially approved. You can view the details in your HR portal.', ctaLabel: 'View in DirectHR', ctaPage: 'my-requests', requestId: 'RDD-001' },
            2: { subject: 'New Shift Schedule - DirectHR Notification', body: 'Your shift schedule for March 10th to March 18th, 2026 is now available. Please review your assigned shifts and confirm in the portal.', ctaLabel: 'View Schedule', ctaPage: 'attendance', requestId: 'RDD-002' },
            3: { subject: 'Performance Appraisal Assigned - DirectHR Notification', body: 'Your Appraisal is Assigned. You can view the details in your HR portal.', ctaLabel: 'Open Appraisal', ctaPage: 'appraisal-tracking', requestId: 'RDD-003' },
            4: { subject: 'Leave Request Submitted - DirectHR Notification', body: 'Your request for Emergency Leave has been successfully submitted. You can view the details in your HR portal.', ctaLabel: 'View My Requests', ctaPage: 'my-requests', requestId: 'RDD-004' },
            5: { subject: 'Training Path Assigned - DirectHR Notification', body: "You have been assigned to the Advanced Leadership Path. You can view the details in your HR portal.", ctaLabel: 'Go to Training', ctaPage: 'training-tracker', requestId: 'RDD-005' },
            6: { subject: 'New Company Document - DirectHR Notification', body: "A new document, Remote Work Policy 2026, has been added to the Company Documents section in HR home page for your review.", ctaLabel: 'View Documents', ctaPage: 'company-documents', requestId: null },
            7: { subject: 'Happy Birthday! - DirectHR', body: 'Happy Birthday! 🎂 The entire DirectHR team wishes you a fantastic day filled with joy and success.', ctaLabel: null, ctaPage: null, requestId: null },
            8: { subject: 'Promotion Approved - DirectHR Notification', body: 'Your promotion to Lead Software Engineer has been officially approved. You can view the details in your HR portal.', ctaLabel: 'View My Profile', ctaPage: 'my-profile', requestId: 'RDD-006' },
            9: { subject: 'Disciplinary Action / Warnings - DirectHR Notification', body: 'Your official warning has been officially approved. You can view the details in your HR portal..', ctaLabel: 'View Details', ctaPage: 'my-profile', requestId: 'RDD-007' },
            10: { subject: 'Performance Appraisal Assigned - DirectHR Notification', body: 'Your Performance Appraisal is is ready for self-evaluation. Please complete your self-evaluation.', ctaLabel: 'Start Self-Evaluation', ctaPage: 'appraisal-tracking', requestId: 'RDD-008' },
            // Team Notifications
            101: { subject: 'Employee Promoted - Team Notification', body: 'Ahmed Hassan from your team has been promoted from Software Engineer to Senior Software Engineer. This change is effective immediately.', ctaLabel: 'View HR Tracking', ctaPage: 'hr-requests-tracking', requestId: 'HD-101' },
            102: { subject: 'Employee Transferred - Team Notification', body: 'Sara Al-Mutairi has been transferred from Marketing to Sales department. Please ensure a smooth transition for the team member.', ctaLabel: 'View HR Tracking', ctaPage: 'hr-requests-tracking', requestId: 'HD-102' },
            103: { subject: 'Schedule Configuration Changed - Team Notification', body: "Khalid Al-Fahad's work schedule has been updated to Remote Schedule. The new schedule is effective from next week.", ctaLabel: 'View Schedules', ctaPage: 'shift-attendance', requestId: 'HD-103' },
            104: { subject: 'Salary Adjustment Approved - Team Notification', body: "Noura Al-Subaie's salary adjustment request has been approved by HR. The changes will reflect in the next payroll cycle.", ctaLabel: 'View HR Tracking', ctaPage: 'hr-requests-tracking', requestId: 'HD-104' },
            105: { subject: 'Job Title Changed - Team Notification', body: 'Mohammed Al-Rashid job title has been changed from Developer to Lead Developer. Please update any relevant documentation.', ctaLabel: 'View HR Tracking', ctaPage: 'hr-requests-tracking', requestId: 'HD-105' },
            106: { subject: 'Contract Type Updated - Team Notification', body: "Fatima Ibrahim's contract has been changed from Part-Time to Full-Time effective immediately. Benefits will be updated accordingly.", ctaLabel: 'View HR Tracking', ctaPage: 'hr-requests-tracking', requestId: 'HD-106' },
            107: { subject: 'Employee Warning Issued - Team Notification', body: 'A written warning has been issued to Yusuf Ahmed for attendance policy violation. Please follow up with HR if needed.', ctaLabel: 'View HR Tracking', ctaPage: 'hr-requests-tracking', requestId: 'HD-107' },
            108: { subject: 'Cost Center Changed - Team Notification', body: "Omar Al-Zahrani's cost center has been changed to IT Operations. This change affects budget allocation for your department.", ctaLabel: 'View HR Tracking', ctaPage: 'hr-requests-tracking', requestId: 'HD-108' }
        };

        const detailContent = computed(() => {
            if (!selectedNotification.value) return { subject: '', body: '', ctaLabel: null, ctaPage: null, requestId: null };
            const config = notificationDetailConfig[selectedNotification.value.id];
            if (!config) {
                return {
                    subject: selectedNotification.value.title + ' - DirectHR Notification',
                    body: selectedNotification.value.description,
                    ctaLabel: 'View in DirectHR',
                    ctaPage: 'home',
                    requestId: selectedNotification.value.requestId || null
                };
            }
            return config;
        });

        const unreadCount = computed(() => allNotifications.value.filter(n => !n.read).length);
        const unreadNotifications = computed(() => allNotifications.value.filter(n => !n.read));
        const teamUnreadCount = computed(() => teamNotifications.value.filter(n => !n.read).length);

        const markAllAsRead = () => {
            if (topTab.value === 'my') {
                allNotifications.value.forEach(n => { n.read = true; });
            } else {
                teamNotifications.value.forEach(n => { n.read = true; });
            }
        };

        const openDetail = (n) => {
            selectedNotification.value = n;
            n.read = true;
        };

        const onDetailCta = () => {
            const cfg = detailContent.value;
            if (cfg.ctaPage) {
                selectedNotification.value = null;
                emit('navigate', cfg.ctaPage);
            }
        };

        return {
            activeTab,
            topTab,
            selectedNotification,
            allNotifications,
            teamNotifications,
            currentNotifications,
            currentUnreadNotifications,
            currentUnreadCount,
            unreadCount,
            unreadNotifications,
            teamUnreadCount,
            detailContent,
            userName,
            currentYear,
            markAllAsRead,
            openDetail,
            onDetailCta
        };
    }
};
