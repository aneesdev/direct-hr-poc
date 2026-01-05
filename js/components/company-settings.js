/**
 * Company Settings Component
 * Handles all company configuration settings
 */

const CompanySettingsComponent = {
    template: `
        <div class="company-settings-page">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="pi pi-globe"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ countries.length }}</div>
                        <div class="stat-label">Countries</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="pi pi-building"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ departments.length }}</div>
                        <div class="stat-label">Departments</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="pi pi-map-marker"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ offices.length }}</div>
                        <div class="stat-label">Offices</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="pi pi-calendar"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ holidays.length }}</div>
                        <div class="stat-label">Holidays</div>
                    </div>
                </div>
            </div>
            
            <!-- Settings Tabs -->
            <div class="settings-tabs">
                <p-tabs :value="activeTab">
                    <p-tablist>
                        <p-tab value="countries">Countries</p-tab>
                        <p-tab value="holidays">Public Holidays</p-tab>
                        <p-tab value="organization">Organization</p-tab>
                        <p-tab value="offices">Offices</p-tab>
                        <p-tab value="biometric">Biometric Devices</p-tab>
                        <p-tab value="workweeks">Work Weeks</p-tab>
                        <p-tab value="attendance">Attendance Settings</p-tab>
                    </p-tablist>
                    
                    <p-tabpanels>
                        <!-- Countries Tab -->
                        <p-tabpanel value="countries">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-globe"></i>
                                        Country Management
                                    </div>
                                    <div class="card-subtitle">Manage countries with bilingual names and logos</div>
                                </div>
                                <p-button label="Add Country" icon="pi pi-plus" @click="showCountryDialog = true"></p-button>
                            </div>
                            
                            <p-datatable :value="countries" striped-rows>
                                <p-column field="nameEn" header="Name (English)"></p-column>
                                <p-column field="nameAr" header="Name (Arabic)"></p-column>
                                <p-column field="timezone" header="Timezone"></p-column>
                                <p-column header="Logo">
                                    <template #body="slotProps">
                                        <img :src="slotProps.data.logo" :alt="slotProps.data.nameEn"
                                            style="width: 32px; height: 20px; object-fit: cover; border-radius: 4px;">
                                    </template>
                                </p-column>
                                <p-column header="Status">
                                    <template #body="slotProps">
                                        <span class="status-tag" :class="slotProps.data.active ? 'active' : 'inactive'">
                                            {{ slotProps.data.active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column header="Actions" style="width: 100px">
                                    <template #body>
                                        <button class="action-btn edit"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete"><i class="pi pi-trash"></i></button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                        
                        <!-- Holidays Tab -->
                        <p-tabpanel value="holidays">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-calendar"></i>
                                        Public Holiday Calendar
                                    </div>
                                    <div class="card-subtitle">Manage country-specific public holidays</div>
                                </div>
                                <p-button label="Add Holiday" icon="pi pi-plus" @click="showHolidayDialog = true"></p-button>
                            </div>
                            
                            <p-datatable :value="holidays" striped-rows>
                                <p-column field="country" header="Country"></p-column>
                                <p-column field="name" header="Holiday Name"></p-column>
                                <p-column field="date" header="Date"></p-column>
                                <p-column field="year" header="Year"></p-column>
                                <p-column header="Actions" style="width: 100px">
                                    <template #body>
                                        <button class="action-btn edit"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete"><i class="pi pi-trash"></i></button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                        
                        <!-- Organization Tab -->
                        <p-tabpanel value="organization">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-sitemap"></i>
                                        Organization Structure
                                    </div>
                                    <div class="card-subtitle">Department → Sections → Units → Teams</div>
                                </div>
                                <p-button label="Add Department" icon="pi pi-plus"></p-button>
                            </div>
                            
                            <p-datatable :value="departments" striped-rows>
                                <p-column field="nameEn" header="Name (English)"></p-column>
                                <p-column field="nameAr" header="Name (Arabic)"></p-column>
                                <p-column field="type" header="Type">
                                    <template #body="slotProps">
                                        <p-tag :value="slotProps.data.type" :severity="getTypeSeverity(slotProps.data.type)"></p-tag>
                                    </template>
                                </p-column>
                                <p-column field="parent" header="Parent"></p-column>
                                <p-column field="head" header="Head"></p-column>
                                <p-column header="Actions" style="width: 100px">
                                    <template #body>
                                        <button class="action-btn edit"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete"><i class="pi pi-trash"></i></button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                        
                        <!-- Offices Tab -->
                        <p-tabpanel value="offices">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-map-marker"></i>
                                        Office Locations
                                    </div>
                                    <div class="card-subtitle">Manage office locations with geofencing</div>
                                </div>
                                <p-button label="Add Office" icon="pi pi-plus"></p-button>
                            </div>
                            
                            <p-datatable :value="offices" striped-rows>
                                <p-column field="name" header="Name"></p-column>
                                <p-column field="location" header="Location"></p-column>
                                <p-column field="coordinates" header="Coordinates"></p-column>
                                <p-column field="radius" header="Radius (m)"></p-column>
                                <p-column header="Status">
                                    <template #body="slotProps">
                                        <span class="status-tag" :class="slotProps.data.active ? 'active' : 'inactive'">
                                            {{ slotProps.data.active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column header="Actions" style="width: 100px">
                                    <template #body>
                                        <button class="action-btn edit"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete"><i class="pi pi-trash"></i></button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                        
                        <!-- Biometric Devices Tab -->
                        <p-tabpanel value="biometric">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-id-card"></i>
                                        Biometric Devices
                                    </div>
                                    <div class="card-subtitle">Manage biometric attendance devices</div>
                                </div>
                                <p-button label="Add Device" icon="pi pi-plus"></p-button>
                            </div>
                            
                            <p-datatable :value="biometricDevices" striped-rows>
                                <p-column field="name" header="Device Name"></p-column>
                                <p-column field="model" header="Model"></p-column>
                                <p-column field="serialNumber" header="Serial Number"></p-column>
                                <p-column field="office" header="Office"></p-column>
                                <p-column field="createdAt" header="Created At"></p-column>
                                <p-column header="Actions" style="width: 100px">
                                    <template #body>
                                        <button class="action-btn edit"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete"><i class="pi pi-trash"></i></button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                        
                        <!-- Work Weeks Tab -->
                        <p-tabpanel value="workweeks">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-calendar-plus"></i>
                                        Work Week Configuration
                                    </div>
                                    <div class="card-subtitle">Define working days for the organization</div>
                                </div>
                                <p-button label="Save Changes" icon="pi pi-check"></p-button>
                            </div>
                            
                            <div class="form-grid">
                                <div v-for="day in workWeekDays" :key="day.name" class="card" style="padding: 1rem;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 1rem;">
                                            <p-toggleswitch v-model="day.isWorking"></p-toggleswitch>
                                            <span style="font-weight: 600;">{{ day.name }}</span>
                                        </div>
                                        <span v-if="day.isWorking" class="status-tag active">Working Day</span>
                                        <span v-else class="status-tag inactive">Off Day</span>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>
                        
                        <!-- Attendance Settings Tab -->
                        <p-tabpanel value="attendance">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-cog"></i>
                                        General Attendance Criteria
                                    </div>
                                    <div class="card-subtitle">Configure attendance rules and policies</div>
                                </div>
                                <p-button label="Save Settings" icon="pi pi-check"></p-button>
                            </div>
                            
                            <div class="card" style="margin-bottom: 1rem;">
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 0.5rem 0;">
                                    <p-toggleswitch v-model="attendanceSettings.allowMultipleOffices"></p-toggleswitch>
                                    <div>
                                        <div style="font-weight: 600; margin-bottom: 0.25rem;">Allow check-in/out from multiple offices</div>
                                        <div style="font-size: 0.85rem; color: var(--text-color-secondary);">
                                            Applicable to non-shift employees only. They can check-in/out from offices mapped to their work profiles.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 0.5rem 0;">
                                    <p-toggleswitch v-model="attendanceSettings.autoMarkAbsent"></p-toggleswitch>
                                    <div>
                                        <div style="font-weight: 600; margin-bottom: 0.25rem;">Auto-mark employees as absent on missed check-in</div>
                                        <div style="font-size: 0.85rem; color: var(--text-color-secondary);">
                                            System auto-marks employees as absent for the past day if they don't check-in during scheduled hours.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>
            
            <!-- Add Country Dialog -->
            <p-dialog v-model:visible="showCountryDialog" header="Add New Country" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Name (English) <span class="required">*</span></label>
                        <p-inputtext v-model="newCountry.nameEn" placeholder="Enter country name in English"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Name (Arabic) <span class="required">*</span></label>
                        <p-inputtext v-model="newCountry.nameAr" placeholder="أدخل اسم الدولة بالعربية" dir="rtl"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Timezone <span class="required">*</span></label>
                        <p-select v-model="newCountry.timezone" :options="timezones" placeholder="Select timezone" style="width: 100%;"></p-select>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" icon="pi pi-times" text @click="showCountryDialog = false"></p-button>
                    <p-button label="Save" icon="pi pi-check" @click="addCountry"></p-button>
                </template>
            </p-dialog>
            
            <!-- Add Holiday Dialog -->
            <p-dialog v-model:visible="showHolidayDialog" header="Add Public Holiday" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Country <span class="required">*</span></label>
                        <p-select v-model="newHoliday.country" :options="countryOptions" placeholder="Select country" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Holiday Name <span class="required">*</span></label>
                        <p-inputtext v-model="newHoliday.name" placeholder="Enter holiday name"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date <span class="required">*</span></label>
                        <p-datepicker v-model="newHoliday.date" dateFormat="dd/mm/yy" style="width: 100%;"></p-datepicker>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" icon="pi pi-times" text @click="showHolidayDialog = false"></p-button>
                    <p-button label="Save" icon="pi pi-check" @click="addHoliday"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        // Active tab state
        const activeTab = ref('countries');

        // Dialog states
        const showCountryDialog = ref(false);
        const showHolidayDialog = ref(false);

        // Data from static data
        const countries = ref([...StaticData.countries]);
        const timezones = ref([...StaticData.timezones]);
        const holidays = ref([...StaticData.holidays]);
        const departments = ref([...StaticData.departments]);
        const offices = ref([...StaticData.offices]);
        const biometricDevices = ref([...StaticData.biometricDevices]);
        const workWeekDays = ref([...StaticData.workWeekDays]);
        const attendanceSettings = ref({ ...StaticData.attendanceSettings });

        // Country options for dropdown
        const countryOptions = computed(() => countries.value.map(c => c.nameEn));

        // New country form
        const newCountry = ref({
            nameEn: '',
            nameAr: '',
            timezone: null
        });

        // New holiday form
        const newHoliday = ref({
            country: null,
            name: '',
            date: null
        });

        // Methods
        const getTypeSeverity = (type) => {
            const severities = {
                'Department': 'info',
                'Section': 'success',
                'Unit': 'warn',
                'Team': 'secondary'
            };
            return severities[type];
        };

        const addCountry = () => {
            if (newCountry.value.nameEn && newCountry.value.nameAr) {
                countries.value.push({
                    id: countries.value.length + 1,
                    nameEn: newCountry.value.nameEn,
                    nameAr: newCountry.value.nameAr,
                    timezone: newCountry.value.timezone,
                    logo: 'https://via.placeholder.com/40x24',
                    active: true
                });
                newCountry.value = { nameEn: '', nameAr: '', timezone: null };
                showCountryDialog.value = false;
            }
        };

        const addHoliday = () => {
            if (newHoliday.value.country && newHoliday.value.name && newHoliday.value.date) {
                const date = newHoliday.value.date;
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                holidays.value.push({
                    id: holidays.value.length + 1,
                    country: newHoliday.value.country,
                    name: newHoliday.value.name,
                    date: formattedDate,
                    year: date.getFullYear()
                });
                newHoliday.value = { country: null, name: '', date: null };
                showHolidayDialog.value = false;
            }
        };

        return {
            activeTab,
            showCountryDialog,
            showHolidayDialog,
            countries,
            timezones,
            holidays,
            departments,
            offices,
            biometricDevices,
            workWeekDays,
            attendanceSettings,
            countryOptions,
            newCountry,
            newHoliday,
            getTypeSeverity,
            addCountry,
            addHoliday
        };
    }
};

// Make it available globally
window.CompanySettingsComponent = CompanySettingsComponent;

