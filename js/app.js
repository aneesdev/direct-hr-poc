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
        'my-profile': MyProfileComponent,
        'employee-directory': EmployeeDirectoryComponent,
        'company-news': CompanyNewsComponent,
        'hr-request-center': HrRequestCenterComponent,
        'hr-request-form': HrRequestFormComponent,
        'hr-requests-settings': HrRequestsSettingsComponent,
        'hr-requests-tracking': HrRequestsTrackingComponent,
        'hr-request-view': HrRequestViewComponent,
        'hr-bulk-settings': HrBulkSettingsComponent,
        'company-documents': CompanyDocumentsComponent,
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
        // Current page state
        const currentPage = ref('home');
        const showUserMenu = ref(false);
        const selectedHrRequest = ref(null);
        const selectedHrRequestView = ref(null);

        // Page title computed
        const pageTitle = computed(() => {
            return StaticData.pageTitles[currentPage.value] || 'Dashboard';
        });

        // Navigation method
        const navigateTo = (page) => {
            currentPage.value = page;
            showUserMenu.value = false;
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

        return {
            currentPage,
            pageTitle,
            navigateTo,
            showUserMenu,
            selectedHrRequest,
            openHrRequest,
            selectedHrRequestView,
            viewHrRequest
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
    'p-menu': PrimeVue.Menu
};

// Register all PrimeVue components
Object.entries(primeVueComponents).forEach(([name, component]) => {
    app.component(name, component);
});

// Register PrimeVue directives
app.directive('tooltip', PrimeVue.Tooltip);

// Mount the application
app.mount('#app');

