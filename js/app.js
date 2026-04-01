/**
 * Direct HR - Main Application
 * Vue 3 + PrimeVue v4 CDN Application
 */

const { createApp, ref, computed } = Vue;

// Create the Vue application
const app = createApp({
    components: {
        'company-settings': CompanySettingsComponent,
        'placeholder-page': PlaceholderPageComponent,
        'employees-list': EmployeesComponent,
        'add-employee': AddEmployeeComponent,
        'shift-attendance': ShiftAttendanceComponent,
        'payroll-module': PayrollComponent,
        'orders-settings': OrdersSettingsComponent,
        'new-request': NewRequestComponent,
        'my-requests': MyRequestsComponent,
        'new-appraisal': NewAppraisalComponent,
        'appraisal-tracking': AppraisalTrackingComponent,
        'appraisal-results': AppraisalResultsComponent,
        'home': HomeComponent,
        'notifications-center': NotificationsCenterComponent,
        'my-profile': MyProfileComponent,
        'employee-directory': EmployeeDirectoryComponent,
        'company-news': CompanyNewsComponent,
        'hr-request-center': HrRequestCenterComponent,
        'hr-request-form': HrRequestFormComponent,
        'hr-requests-settings': HrRequestsSettingsComponent,
        'hr-requests-tracking': HrRequestsTrackingComponent,
        'hr-request-view': HrRequestViewComponent,
        'hr-bulk-settings': HrBulkSettingsComponent,
        'role-permissions': RolePermissionsComponent,
        'company-documents': CompanyDocumentsComponent,
        'employee-documents': EmployeeDocumentsComponent,
        'stats-module': StatsComponent,
        'attendance-static-insights': AttendanceStaticInsights,
        'attendance-dynamic-insights': AttendanceDynamicInsights,
        'payroll-static-insights': PayrollStaticInsights,
        'payroll-dynamic-insights': PayrollDynamicInsights,
        'requests-static-insights': RequestsStaticInsights,
        'requests-dynamic-insights': RequestsDynamicInsights,
        'demography-static-insights': DemographyStaticInsights,
        'demography-dynamic-insights': DemographyDynamicInsights,
        'hrdesk-static-insights': HrdeskStaticInsights,
        'hrdesk-dynamic-insights': HrdeskDynamicInsights,
        'directory-static-insights': DirectoryStaticInsights,
        'directory-dynamic-insights': DirectoryDynamicInsights,
        'settings-static-insights': SettingsStaticInsights,
        'appraisals-insights': AppraisalsInsights,
        'training-insights': TrainingInsightsComponent,
        'training-paths': TrainingPathsComponent,
        'training-assign': TrainingAssignComponent,
        'training-tracker': TrainingTrackerComponent
    },

    setup() {
        const { onMounted, onUnmounted } = Vue;
        
        // Current page state
        const currentPage = ref('home');
        const showUserMenu = ref(false);
        const showNotificationPanel = ref(false);
        const openNotificationId = ref(null);
        const selectedHrRequest = ref(null);
        const selectedHrRequestView = ref(null);

        // Check-in/out widget state
        const isCheckedIn = ref(false);
        const dayEnded = ref(false);
        const currentTime = ref('');
        const currentDate = ref('');
        const lastCheckAction = ref('');
        let clockInterval = null;

        const updateClock = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
            currentTime.value = `${displayHours}:${minutes}:${seconds} ${ampm}`;
            
            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            currentDate.value = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
        };

        const formatTimeForAction = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes}:${seconds} ${ampm}`;
        };

        const checkIn = () => {
            isCheckedIn.value = true;
            lastCheckAction.value = `IN: ${formatTimeForAction()}`;
        };

        const checkOut = () => {
            isCheckedIn.value = false;
            dayEnded.value = true;
            lastCheckAction.value = `OUT: ${formatTimeForAction()}`;
        };

        onMounted(() => {
            updateClock();
            clockInterval = setInterval(updateClock, 1000);
        });

        onUnmounted(() => {
            if (clockInterval) clearInterval(clockInterval);
        });

        const notifications = [
            { id: 1, title: 'Leave Request Approved', requestId: 'REQ-001', description: 'Your leave request for March 15-20 has been officially approved.', time: '2 mins ago', icon: 'pi-check', iconClass: 'icon-success' },
            { id: 2, title: 'New Shift Schedule', requestId: 'REQ-002', description: 'Your schedule for March 10-16 is now available for review.', time: '1 hour ago', icon: 'pi-clock', iconClass: 'icon-info' },
            { id: 3, title: 'Performance Appraisal Assigned', requestId: 'REQ-003', description: 'Your Appraisal is Assigned.', time: '3 hours ago', icon: 'pi-file', iconClass: 'icon-warning' },
            { id: 4, title: 'Leave Request Submitted', requestId: 'REQ-004', description: 'Your leave request has been submitted for approval.', time: '5 hours ago', icon: 'pi-plus', iconClass: 'icon-info' }
        ];
        const notificationNewCount = 6;

        // Page title computed
        const pageTitle = computed(() => {
            return StaticData.pageTitles[currentPage.value] || 'Dashboard';
        });

        // Navigation method
        const navigateTo = (page) => {
            currentPage.value = page;
            showUserMenu.value = false;
            showNotificationPanel.value = false;
        };

        // Open HR Request form
        const openHrRequest = (request) => {
            selectedHrRequest.value = request;
            currentPage.value = 'hr-request-form';
        };

        // View HR Request details
        const viewHrRequest = (request) => {
            selectedHrRequestView.value = request;
            currentPage.value = 'hr-request-view';
        };

        const openNotificationAndGo = (notificationId) => {
            openNotificationId.value = notificationId;
            showNotificationPanel.value = false;
            currentPage.value = 'notifications-center';
            showUserMenu.value = false;
        };

        return {
            currentPage,
            pageTitle,
            navigateTo,
            showUserMenu,
            showNotificationPanel,
            openNotificationId,
            openNotificationAndGo,
            notifications,
            notificationNewCount,
            selectedHrRequest,
            openHrRequest,
            selectedHrRequestView,
            viewHrRequest,
            isCheckedIn,
            dayEnded,
            currentTime,
            currentDate,
            lastCheckAction,
            checkIn,
            checkOut
        };
    }
});

// Configure PrimeVue with Aura theme
app.use(PrimeVue.Config, {
    theme: {
        preset: PrimeUIX.Themes.Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark-mode',
            cssLayer: false
        }
    }
});

// Register PrimeVue components (v4 component names)
const primeVueComponents = {
    'p-button': PrimeVue.Button,
    'p-datatable': PrimeVue.DataTable,
    'p-column': PrimeVue.Column,
    'p-tabs': PrimeVue.Tabs,
    'p-tablist': PrimeVue.TabList,
    'p-tab': PrimeVue.Tab,
    'p-tabpanels': PrimeVue.TabPanels,
    'p-tabpanel': PrimeVue.TabPanel,
    'p-dialog': PrimeVue.Dialog,
    'p-drawer': PrimeVue.Drawer,
    'p-inputtext': PrimeVue.InputText,
    'p-select': PrimeVue.Select,
    'p-datepicker': PrimeVue.DatePicker,
    'p-toggleswitch': PrimeVue.ToggleSwitch,
    'p-tag': PrimeVue.Tag,
    'p-checkbox': PrimeVue.Checkbox,
    'p-radiobutton': PrimeVue.RadioButton,
    'p-inputnumber': PrimeVue.InputNumber,
    'p-textarea': PrimeVue.Textarea,
    'p-fileupload': PrimeVue.FileUpload,
    'p-multiselect': PrimeVue.MultiSelect,
    'p-autocomplete': PrimeVue.AutoComplete,
    'p-menu': PrimeVue.Menu,
    'p-timeline': PrimeVue.Timeline
};

// Register all PrimeVue components
Object.entries(primeVueComponents).forEach(([name, component]) => {
    app.component(name, component);
});

// Register PrimeVue directives
app.directive('tooltip', PrimeVue.Tooltip);

// Mount the application
app.mount('#app');

