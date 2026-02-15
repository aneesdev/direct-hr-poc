/**
 * HR Bulk Settings Component
 * Contains Ramadan Mode and CEO Gifts settings with Logs tracker
 */

const HrBulkSettingsComponent = {
    template: `
        <div class="hr-bulk-settings-page">
            <!-- Tabs -->
            <p-tabs :value="activeTab">
                <p-tablist>
                    <p-tab value="settings" @click="activeTab = 'settings'">
                        <i class="pi pi-cog"></i> Settings
                    </p-tab>
                    <p-tab value="logs" @click="activeTab = 'logs'">
                        <i class="pi pi-history"></i> Logs
                    </p-tab>
                </p-tablist>

                <p-tabpanels>
                    <!-- Settings Tab -->
                    <p-tabpanel value="settings">
                        <!-- Settings Cards Grid -->
                        <div class="bulk-settings-grid" v-if="!activeSettingForm">
                            <!-- Ramadan Mode Card -->
                            <div class="bulk-setting-card" @click="openSettingForm('ramadan')">
                                <div class="setting-icon ramadan">
                                    <i class="pi pi-moon"></i>
                                </div>
                                <div class="setting-name">Ramadan Mode Activation</div>
                                <div class="setting-description">
                                    Automatically adjust working hours and shift schedules for the holy month of Ramadan across the organization.
                                </div>
                            </div>

                            <!-- CEO Gifts Card -->
                            <div class="bulk-setting-card" @click="openSettingForm('gifts')">
                                <div class="setting-icon gifts">
                                    <i class="pi pi-gift"></i>
                                </div>
                                <div class="setting-name">CEO Gifts Annual Box</div>
                                <div class="setting-description">
                                    Manage procurement, eligibility, and distribution logistics for the annual CEO gift boxes.
                                </div>
                            </div>
                        </div>

                        <!-- Ramadan Mode Form -->
                        <div v-if="activeSettingForm === 'ramadan'" class="setting-form-page">
                            <div class="form-header">
                                <p-button icon="pi pi-arrow-left" text @click="activeSettingForm = null"></p-button>
                                <div class="form-header-content">
                                    <div class="form-header-icon ramadan">
                                        <i class="pi pi-moon"></i>
                                    </div>
                                    <div>
                                        <h2>Ramadan Mode Activation</h2>
                                        <p>Configure organizational working hours for Ramadan.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="form-content-layout">
                                <div class="form-main">
                                    <!-- Status Card -->
                                    <div class="status-card">
                                        <div class="status-info">
                                            <div class="status-icon">
                                                <i class="pi pi-moon"></i>
                                            </div>
                                            <div>
                                                <div class="status-title">Ramadan Schedule Status</div>
                                                <div class="status-subtitle">{{ ramadanForm.active ? 'Currently Active' : 'Currently Inactive' }}</div>
                                            </div>
                                        </div>
                                        <p-toggleswitch v-model="ramadanForm.active"></p-toggleswitch>
                                    </div>

                                    <!-- Configuration Settings -->
                                    <div class="config-card">
                                        <div class="config-header">
                                            <i class="pi pi-clock"></i>
                                            <span>Configuration Settings</span>
                                        </div>

                                        <div class="date-grid">
                                            <div class="form-group">
                                                <label class="form-label">Start Date</label>
                                                <p-datepicker v-model="ramadanForm.startDate" dateFormat="dd/mm/yy" 
                                                             placeholder="Select start date" showIcon iconDisplay="input"
                                                             class="date-input-full">
                                                </p-datepicker>
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">End Date</label>
                                                <p-datepicker v-model="ramadanForm.endDate" dateFormat="dd/mm/yy" 
                                                             placeholder="Select end date" showIcon iconDisplay="input"
                                                             class="date-input-full">
                                                </p-datepicker>
                                            </div>
                                        </div>

                                        <div class="form-group" style="margin-top: 1rem;">
                                            <label class="form-label">Applies To</label>
                                            <p-multiselect v-model="ramadanForm.appliesTo" :options="departmentOptions" 
                                                          optionLabel="name" optionValue="id"
                                                          placeholder="Select departments/locations" 
                                                          style="width: 100%;" display="chip">
                                            </p-multiselect>
                                            <small class="form-hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.</small>
                                        </div>

                                        <div class="form-group" style="margin-top: 1rem;">
                                            <label class="form-label">Cutoff Time</label>
                                            <p-select v-model="ramadanForm.cutoffTime" :options="cutoffTimeOptions" 
                                                      placeholder="Select Time" style="width: 100%;">
                                            </p-select>
                                        </div>

                                    </div>

                                    <!-- Ramadan Attendance Logic Info Box -->
                                    <div class="attendance-logic-card">
                                        <div class="logic-header">
                                            <i class="pi pi-info-circle"></i>
                                            <span>Ramadan Attendance Logic</span>
                                        </div>
                                        <ul class="logic-list">
                                            <li>In Ramadan, the attendance result will be either <strong>Present</strong> or <strong>Absent</strong> only.</li>
                                            <li>Attendance is activated by at least <strong>one punch</strong> during the day with a default departure time.</li>
                                            <li>Total working hours are not calculated. If there is a punch, the status is <strong>Present</strong>.</li>
                                            <li>There are <strong>no penalties</strong> for absence. A day without a punch is marked as "No Punch Day (Ramadan Mode)".</li>
                                        </ul>
                                    </div>

                                    <div class="form-actions">
                                        <p-button label="Save Configuration" icon="pi pi-save" @click="saveRamadanConfig"></p-button>
                                    </div>
                                </div>

                                <div class="form-sidebar">
                                    <!-- Quick Summary -->
                                    <div class="summary-card">
                                        <div class="summary-header">
                                            <i class="pi pi-info-circle"></i>
                                            <span>Quick Summary</span>
                                        </div>
                                        <p class="summary-text">
                                            This mode simplifies the attendance tracking system to accommodate the flexible working hours during the holy month.
                                        </p>
                                    </div>

                                    <!-- Target Audience -->
                                    <div class="audience-card">
                                        <div class="audience-header">Target Audience</div>
                                        <div class="audience-item">
                                            <span class="audience-label">Locations</span>
                                            <span class="audience-value">Multi-Select</span>
                                        </div>
                                        <div class="audience-item">
                                            <span class="audience-label">Shift Type</span>
                                            <span class="audience-value">Open Shift</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CEO Gifts Form -->
                        <div v-if="activeSettingForm === 'gifts'" class="setting-form-page">
                            <div class="form-header">
                                <p-button icon="pi pi-arrow-left" text @click="activeSettingForm = null"></p-button>
                                <div class="form-header-content">
                                    <div class="form-header-icon gifts">
                                        <i class="pi pi-gift"></i>
                                    </div>
                                    <div>
                                        <h2>CEO Gifts Annual Box</h2>
                                        <p>Manage annual paid vacation gifts for employees.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="form-content-centered">
                                <!-- Gift Configuration -->
                                <div class="config-card">
                                    <div class="config-header">
                                        <i class="pi pi-box"></i>
                                        <span>Gift Configuration</span>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">Select Vacation Gift Value</label>
                                        <div class="gift-options">
                                            <div v-for="option in giftOptions" :key="option.value" 
                                                 class="gift-option" 
                                                 :class="{ selected: giftsForm.giftValue === option.value }"
                                                 @click="giftsForm.giftValue = option.value">
                                                <p-radiobutton v-model="giftsForm.giftValue" :value="option.value" :inputId="'gift-' + option.value"></p-radiobutton>
                                                <label :for="'gift-' + option.value">{{ option.label }}</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group" style="margin-top: 1.5rem;">
                                        <label class="form-label">Eligibility Criteria</label>
                                        <p-select v-model="giftsForm.eligibility" :options="eligibilityOptions" 
                                                  optionLabel="name" optionValue="id"
                                                  placeholder="Select eligibility criteria" style="width: 100%;">
                                        </p-select>
                                    </div>

                                    <div class="form-group" style="margin-top: 1.5rem;">
                                        <label class="form-label">Message from CEO</label>
                                        <p-textarea v-model="giftsForm.ceoMessage" rows="4" 
                                                   placeholder="Enter the personalized message to be included in the announcement..."
                                                   style="width: 100%;">
                                        </p-textarea>
                                    </div>
                                </div>

                                <div class="form-actions-centered">
                                    <p-button label="Save Draft" icon="pi pi-save" outlined @click="saveDraft"></p-button>
                                    <p-button label="Launch Campaign" icon="pi pi-send" severity="help" @click="launchCampaign"></p-button>
                                </div>
                            </div>
                        </div>
                    </p-tabpanel>

                    <!-- Logs Tab -->
                    <p-tabpanel value="logs">
                        <div class="logs-header">
                            <div>
                                <h3>Bulk Action Tracker</h3>
                                <p>Monitor organization-wide HR campaigns and settings.</p>
                            </div>
                            <div class="logs-actions">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search"></i>
                                    <p-inputtext v-model="logsSearch" placeholder="Search bulk actions..." style="width: 280px;"></p-inputtext>
                                </span>
                                <p-button icon="pi pi-filter" outlined></p-button>
                                <p-button icon="pi pi-download" outlined></p-button>
                            </div>
                        </div>

                        <div class="card">
                            <p-datatable :value="filteredLogs" stripedRows paginator :rows="10"
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                        :rowsPerPageOptions="[10, 25, 50]"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results">
                                <p-column header="Type of Request" sortable field="type">
                                    <template #body="slotProps">
                                        <div class="log-type-cell">
                                            <div class="log-type-icon" :class="slotProps.data.typeClass">
                                                <i :class="'pi ' + slotProps.data.icon"></i>
                                            </div>
                                            <div class="log-type-info">
                                                <div class="log-type-name">{{ slotProps.data.type }}</div>
                                                <div class="log-type-id">#{{ slotProps.data.trackingId }}</div>
                                            </div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="HR User" sortable field="hrUserName">
                                    <template #body="slotProps">
                                        <div class="hr-user-cell">
                                            <div class="hr-user-name">{{ slotProps.data.hrUserName }}</div>
                                            <div class="hr-user-role">{{ slotProps.data.hrUserRole }}</div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Date of Action" sortable field="dateOfAction">
                                    <template #body="slotProps">
                                        <div class="date-cell">
                                            <i class="pi pi-calendar"></i>
                                            <span>{{ formatDate(slotProps.data.dateOfAction) }}</span>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Employees Affected" sortable field="employeesAffected">
                                    <template #body="slotProps">
                                        <span class="employees-count">{{ slotProps.data.employeesAffected.toLocaleString() }}</span>
                                    </template>
                                </p-column>
                                <p-column header="Status" sortable field="status">
                                    <template #body="slotProps">
                                        <span class="log-status-badge" :class="getLogStatusClass(slotProps.data.status)">
                                            {{ slotProps.data.status }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column header="Summary" style="width: 80px; text-align: center;">
                                    <template #body="slotProps">
                                        <button class="view-btn" @click="viewLogDetails(slotProps.data)" v-tooltip="'View Details'">
                                            <i class="pi pi-eye"></i>
                                        </button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </div>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>

            <!-- Log Details Dialog -->
            <p-dialog v-model:visible="showLogDialog" :header="'Bulk Action Details'" :modal="true" :style="{ width: '600px' }">
                <div v-if="selectedLog" class="log-details-content">
                    <div class="log-details-header">
                        <div class="log-details-icon" :class="selectedLog.typeClass">
                            <i :class="'pi ' + selectedLog.icon"></i>
                        </div>
                        <div>
                            <div class="log-details-type">{{ selectedLog.type }}</div>
                            <div class="log-details-id">#{{ selectedLog.trackingId }}</div>
                        </div>
                        <span class="log-status-badge large" :class="getLogStatusClass(selectedLog.status)">
                            {{ selectedLog.status }}
                        </span>
                    </div>

                    <div class="log-details-grid">
                        <div class="log-detail-item">
                            <span class="detail-label">HR User</span>
                            <span class="detail-value">{{ selectedLog.hrUserName }}</span>
                        </div>
                        <div class="log-detail-item">
                            <span class="detail-label">Role</span>
                            <span class="detail-value">{{ selectedLog.hrUserRole }}</span>
                        </div>
                        <div class="log-detail-item">
                            <span class="detail-label">Date of Action</span>
                            <span class="detail-value">{{ formatDate(selectedLog.dateOfAction) }}</span>
                        </div>
                        <div class="log-detail-item">
                            <span class="detail-label">Employees Affected</span>
                            <span class="detail-value">{{ selectedLog.employeesAffected.toLocaleString() }}</span>
                        </div>
                    </div>

                    <div v-if="selectedLog.details" class="log-details-section">
                        <div class="details-section-title">Configuration Details</div>
                        <div class="details-list">
                            <div v-for="(value, key) in selectedLog.details" :key="key" class="details-item">
                                <span class="details-key">{{ formatDetailKey(key) }}</span>
                                <span class="details-value">{{ value }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Close" @click="showLogDialog = false"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        const activeTab = ref('settings');
        const activeSettingForm = ref(null);
        const logsSearch = ref('');
        const showLogDialog = ref(false);
        const selectedLog = ref(null);

        // Ramadan Form
        const ramadanForm = ref({
            active: false,
            startDate: null,
            endDate: null,
            appliesTo: [],
            cutoffTime: null
        });

        // Gifts Form
        const giftsForm = ref({
            giftValue: null,
            eligibility: null,
            ceoMessage: ''
        });

        // Options
        const departmentOptions = ref([
            { id: 'all', name: 'All Departments' },
            { id: 'cairo', name: 'Work Location Cairo' },
            { id: 'saudi', name: 'Work Location Saudi Arabia' },
            { id: 'buraydah', name: 'Work Office Buraydah' }
        ]);

        const cutoffTimeOptions = ref([
            '05:00 AM',
            '06:00 AM',
            '07:00 AM',
            '08:00 AM'
        ]);

        const giftOptions = ref([
            { value: 1, label: 'One day paid vacation gift' },
            { value: 2, label: '2 days paid vacation gift' },
            { value: 3, label: '3 days paid vacation gift' },
            { value: 4, label: '4 days paid vacation gift' },
            { value: 5, label: '5 days paid vacation gift' }
        ]);

        const eligibilityOptions = ref([
            { id: 'active_probation_completed', name: 'All Active Employees (Probation Completed)' },
            { id: 'all_including_probation', name: 'All Employees (Including Probation)' },
            { id: 'management_executives', name: 'Management & Executives Only' },
            { id: 'tenure_1_year', name: 'Tenure > 1 Year' }
        ]);

        // Logs Data
        const bulkActionLogs = ref([
            {
                id: 1,
                trackingId: 'BLK-2024-001',
                type: 'Ramadan Mode Activation',
                icon: 'pi-moon',
                typeClass: 'ramadan',
                hrUserName: 'Amal Al-Sayed',
                hrUserRole: 'HR Manager',
                dateOfAction: '2024-03-01',
                employeesAffected: 1250,
                status: 'Active',
                details: {
                    startDate: '2024-03-10',
                    endDate: '2024-04-09',
                    cutoffTime: '06:00 AM',
                    locations: 'All Departments'
                }
            },
            {
                id: 2,
                trackingId: 'BLK-2024-002',
                type: 'CEO Gifts Annual Box',
                icon: 'pi-gift',
                typeClass: 'gifts',
                hrUserName: 'Fahad Al-Otaibi',
                hrUserRole: 'HR Director',
                dateOfAction: '2024-02-20',
                employeesAffected: 850,
                status: 'Completed',
                details: {
                    giftValue: '3 days paid vacation',
                    eligibility: 'All Active Employees (Probation Completed)',
                    message: 'Thank you for your dedication...'
                }
            },
            {
                id: 3,
                trackingId: 'BLK-2025-003',
                type: 'Ramadan Mode Preparation',
                icon: 'pi-moon',
                typeClass: 'ramadan',
                hrUserName: 'John Smith',
                hrUserRole: 'HR Coordinator',
                dateOfAction: '2025-02-15',
                employeesAffected: 1300,
                status: 'Scheduled',
                details: {
                    startDate: '2025-02-28',
                    endDate: '2025-03-29',
                    cutoffTime: '05:00 AM',
                    locations: 'Saudi Arabia, Cairo'
                }
            }
        ]);

        // Computed
        const filteredLogs = computed(() => {
            if (!logsSearch.value) return bulkActionLogs.value;
            const query = logsSearch.value.toLowerCase();
            return bulkActionLogs.value.filter(log => 
                log.type.toLowerCase().includes(query) ||
                log.trackingId.toLowerCase().includes(query) ||
                log.hrUserName.toLowerCase().includes(query)
            );
        });

        // Methods
        const openSettingForm = (type) => {
            activeSettingForm.value = type;
        };

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        };

        const getLogStatusClass = (status) => {
            const classes = {
                'Active': 'active',
                'Completed': 'completed',
                'Scheduled': 'scheduled',
                'Draft': 'draft'
            };
            return classes[status] || 'draft';
        };

        const formatDetailKey = (key) => {
            return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        };

        const saveRamadanConfig = () => {
            alert('Ramadan Mode configuration saved successfully!');
            activeSettingForm.value = null;
        };

        const saveDraft = () => {
            alert('Draft saved successfully!');
        };

        const launchCampaign = () => {
            if (!giftsForm.value.giftValue) {
                alert('Please select a vacation gift value.');
                return;
            }
            if (!giftsForm.value.eligibility) {
                alert('Please select eligibility criteria.');
                return;
            }
            alert('Campaign launched successfully!');
            activeSettingForm.value = null;
        };

        const viewLogDetails = (log) => {
            selectedLog.value = log;
            showLogDialog.value = true;
        };

        return {
            activeTab,
            activeSettingForm,
            logsSearch,
            showLogDialog,
            selectedLog,
            ramadanForm,
            giftsForm,
            departmentOptions,
            cutoffTimeOptions,
            giftOptions,
            eligibilityOptions,
            bulkActionLogs,
            filteredLogs,
            openSettingForm,
            formatDate,
            getLogStatusClass,
            formatDetailKey,
            saveRamadanConfig,
            saveDraft,
            launchCampaign,
            viewLogDetails
        };
    }
};
