/**
 * Notifications Center Component
 * Full-page view of all HR notifications with All / Unread tabs
 */

const NotificationsCenterComponent = {
    template: `
        <div class="notifications-center-page">
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
                                <div v-for="n in allNotifications" :key="n.id" class="notification-center-item" :class="{ unread: !n.read }">
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
                                <div v-for="n in unreadNotifications" :key="n.id" class="notification-center-item">
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
        </div>
    `,

    emits: ['navigate'],

    setup() {
        const { ref, computed } = Vue;

        const activeTab = ref('all');

        const allNotifications = ref([
            { id: 1, title: 'Leave Request Approved', requestId: 'RDD-001', description: 'Your leave request for March 15-20 has been officially approved.', time: '2 mins ago', icon: 'pi-check', iconClass: 'icon-success', read: false },
            { id: 2, title: 'New Shift Schedule', requestId: 'RDD-002', description: 'Your schedule for March 10-18 is now available for review.', time: '1 hour ago', icon: 'pi-clock', iconClass: 'icon-info', read: false },
            { id: 3, title: 'Performance Appraisal Assigned', requestId: 'RDD-003', description: 'Your Appraisal is Assigned.', time: '3 hours ago', icon: 'pi-file', iconClass: 'icon-warning', read: false },
            { id: 4, title: 'Leave Request Submitted', requestId: 'RDD-004', description: 'Your request for emergency leave has been successfully submitted.', time: '5 hours ago', icon: 'pi-plus', iconClass: 'icon-info', read: false },
            { id: 5, title: 'Training Path Assigned', requestId: 'RDD-005', description: "You have been assigned to 'Advanced Leadership Path'.", time: '1 day ago', icon: 'pi-book', iconClass: 'icon-purple', read: false },
            { id: 6, title: 'New Company Document', requestId: null, description: "A new document 'Remote Work Policy 2028' has been added to the portal.", time: '1 day ago', icon: 'pi-file', iconClass: 'icon-secondary', read: true },
            { id: 7, title: 'Happy Birthday!', requestId: null, description: 'The DirectHR team wishes you a wonderful birthday and a great year ahead!', time: '2 days ago', icon: 'pi-gift', iconClass: 'icon-warning', read: true },
            { id: 8, title: 'Promotion Approved', requestId: 'RDD-006', description: 'Your promotion to Lead Software Engineer has been approved.', time: '3 days ago', icon: 'pi-check', iconClass: 'icon-success', read: true },
            { id: 9, title: 'Disciplinary Action / Warnings', requestId: 'RDD-007', description: 'Your Disciplinary Action / Warnings has been officially approved.', time: '4 days ago', icon: 'pi-exclamation-triangle', iconClass: 'icon-danger', read: true },
            { id: 10, title: 'Performance Appraisal Assigned', requestId: 'RDD-008', description: 'Your Appraisal is ready for self-evaluation.', time: '5 days ago', icon: 'pi-file', iconClass: 'icon-warning', read: true }
        ]);

        const unreadCount = computed(() => allNotifications.value.filter(n => !n.read).length);
        const unreadNotifications = computed(() => allNotifications.value.filter(n => !n.read));

        const markAllAsRead = () => {
            allNotifications.value.forEach(n => { n.read = true; });
        };

        return {
            activeTab,
            allNotifications,
            unreadCount,
            unreadNotifications,
            markAllAsRead
        };
    }
};
