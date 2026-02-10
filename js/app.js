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
        'appraisal-analytics': AppraisalAnalyticsComponent
    },

    setup() {
        // Current page state
        const currentPage = ref('company-settings');

        // Page title computed
        const pageTitle = computed(() => {
            return StaticData.pageTitles[currentPage.value] || 'Dashboard';
        });

        // Navigation method
        const navigateTo = (page) => {
            currentPage.value = page;
        };

        return {
            currentPage,
            pageTitle,
            navigateTo
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
    'p-multiselect': PrimeVue.MultiSelect
};

// Register all PrimeVue components
Object.entries(primeVueComponents).forEach(([name, component]) => {
    app.component(name, component);
});

// Mount the application
app.mount('#app');

