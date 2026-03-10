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
                        <button class="notifications-center-link link-mark-read" @click="markAllAsRead" v-if="unreadCount > 0">Mark all as read</button>
                        <a href="#" class="notifications-center-link link-back" @click.prevent="$emit('navigate', 'home')">Back to Dashboard</a>
                    </div>
                </div>

                <div class="notifications-center-card">
                    <p-tabs :value="activeTab">
                        <p-tablist>
                            <p-tab value="all" @click="activeTab = 'all'">All Notifications ({{ allNotifications.length }})</p-tab>
                            <p-tab value="unread" @click="activeTab = 'unread'">Unread ({{ unreadCount }})</p-tab>
                        </p-tablist>
                        <p-tabpanels>
                            <p-tabpanel value="all">
                                <div class="notifications-center-list">
                                    <div v-for="n in allNotifications" :key="n.id" class="notification-center-item clickable" :class="{ unread: !n.read }" @click="openDetail(n)">
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
                                </div>
                            </p-tabpanel>
                            <p-tabpanel value="unread">
                                <div class="notifications-center-list">
                                    <div v-for="n in unreadNotifications" :key="n.id" class="notification-center-item clickable unread" @click="openDetail(n)">
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
                                    <div v-if="unreadNotifications.length === 0" class="notifications-center-empty">No unread notifications.</div>
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
        const selectedNotification = ref(null);

        const userName = (StaticData && StaticData.homeData && StaticData.homeData.currentUser && StaticData.homeData.currentUser.name) ? StaticData.homeData.currentUser.name : 'Team Member';
        const currentYear = new Date().getFullYear();

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
            1: { subject: 'Leave Request Approved - DirectHR Notification', body: 'Your leave request for March 15th to March 20th, 2026 has been officially approved. You can view the details in your HR portal.', ctaLabel: 'View in DirectHR', ctaPage: 'my-requests', requestId: 'RDD-001' },
            2: { subject: 'New Shift Schedule - DirectHR Notification', body: 'Your shift schedule for March 10th to March 18th, 2026 is now available. Please review your assigned shifts and confirm in the portal.', ctaLabel: 'View Schedule', ctaPage: 'attendance', requestId: 'RDD-002' },
            3: { subject: 'Performance Appraisal Assigned - DirectHR Notification', body: 'A performance appraisal cycle has been assigned to you. Please complete the self-evaluation and submit by the deadline indicated in the portal.', ctaLabel: 'Open Appraisal', ctaPage: 'appraisal-tracking', requestId: 'RDD-003' },
            4: { subject: 'Leave Request Submitted - DirectHR Notification', body: 'Your request for emergency leave has been successfully submitted and is pending manager approval. You can track its status in My Requests.', ctaLabel: 'View My Requests', ctaPage: 'my-requests', requestId: 'RDD-004' },
            5: { subject: 'Training Path Assigned - DirectHR Notification', body: "You have been assigned to the 'Advanced Leadership Path' training program. Access your modules and due dates in the Training section.", ctaLabel: 'Go to Training', ctaPage: 'training-tracker', requestId: 'RDD-005' },
            6: { subject: 'New Company Document - DirectHR Notification', body: "A new document 'Remote Work Policy 2028' has been added to the company portal. Please review it at your earliest convenience.", ctaLabel: 'View Documents', ctaPage: 'company-documents', requestId: null },
            7: { subject: 'Happy Birthday! - DirectHR', body: 'The DirectHR team wishes you a wonderful birthday and a great year ahead! Thank you for being part of our team.', ctaLabel: null, ctaPage: null, requestId: null },
            8: { subject: 'Promotion Approved - DirectHR Notification', body: 'Your promotion to Lead Software Engineer has been approved. HR will contact you with the updated offer and effective date. Congratulations!', ctaLabel: 'View My Profile', ctaPage: 'my-profile', requestId: 'RDD-006' },
            9: { subject: 'Disciplinary Action / Warnings - DirectHR Notification', body: 'A disciplinary action or warning has been recorded. Please review the details and acknowledge in the HR portal. Contact HR if you have questions.', ctaLabel: 'View Details', ctaPage: 'my-profile', requestId: 'RDD-007' },
            10: { subject: 'Performance Appraisal Ready - DirectHR Notification', body: 'Your appraisal is ready for self-evaluation. Please complete your self-assessment and submit before the deadline.', ctaLabel: 'Start Self-Evaluation', ctaPage: 'appraisal-tracking', requestId: 'RDD-008' }
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
            selectedNotification,
            allNotifications,
            unreadCount,
            unreadNotifications,
            detailContent,
            userName,
            currentYear,
            markAllAsRead: () => allNotifications.value.forEach(n => { n.read = true; }),
            openDetail,
            onDetailCta
        };
    }
};
