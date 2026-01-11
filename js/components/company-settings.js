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
                        <i class="pi pi-sitemap"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ sections.length }}</div>
                        <div class="stat-label">Sections</div>
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
                        <p-tab value="costcenters">Cost Centers</p-tab>
                        <p-tab value="documents">Documents</p-tab>
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
                            </div>
                            
                            <!-- Nested Organization Tabs -->
                            <p-tabs :value="orgTab">
                                <p-tablist>
                                    <p-tab value="departments">Department</p-tab>
                                    <p-tab value="sections">Sections</p-tab>
                                    <p-tab value="units">Units</p-tab>
                                    <p-tab value="teams">Team</p-tab>
                                </p-tablist>
                                
                                <p-tabpanels>
                                    <!-- Departments Sub-Tab -->
                                    <p-tabpanel value="departments">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div>
                                                <div class="card-subtitle">Manage organization departments</div>
                                            </div>
                                            <p-button label="Add Department" icon="pi pi-plus" size="small"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="departments" striped-rows>
                                            <p-column field="nameEn" header="Name (English)"></p-column>
                                            <p-column field="nameAr" header="Name (Arabic)"></p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body>
                                                    <button class="action-btn edit"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete"><i class="pi pi-trash"></i></button>
                                                </template>
                                            </p-column>
                                        </p-datatable>
                                    </p-tabpanel>
                                    
                                    <!-- Sections Sub-Tab -->
                                    <p-tabpanel value="sections">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div>
                                                <div class="card-subtitle">Sections belong to Departments</div>
                                            </div>
                                            <p-button label="Add Section" icon="pi pi-plus" size="small"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="sections" striped-rows>
                                            <p-column field="nameEn" header="Name (English)"></p-column>
                                            <p-column field="nameAr" header="Name (Arabic)"></p-column>
                                            <p-column field="sequence" header="Sequence (Department -- Section)"></p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body>
                                                    <button class="action-btn edit"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete"><i class="pi pi-trash"></i></button>
                                                </template>
                                            </p-column>
                                        </p-datatable>
                                    </p-tabpanel>
                                    
                                    <!-- Units Sub-Tab -->
                                    <p-tabpanel value="units">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div>
                                                <div class="card-subtitle">Units belong to Sections</div>
                                            </div>
                                            <p-button label="Add Unit" icon="pi pi-plus" size="small"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="units" striped-rows>
                                            <p-column field="nameEn" header="Name (English)"></p-column>
                                            <p-column field="nameAr" header="Name (Arabic)"></p-column>
                                            <p-column field="sequence" header="Sequence (Dept -- Section -- Unit)"></p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body>
                                                    <button class="action-btn edit"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete"><i class="pi pi-trash"></i></button>
                                                </template>
                                            </p-column>
                                        </p-datatable>
                                    </p-tabpanel>
                                    
                                    <!-- Teams Sub-Tab -->
                                    <p-tabpanel value="teams">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div>
                                                <div class="card-subtitle">Teams belong to Units</div>
                                            </div>
                                            <p-button label="Add Team" icon="pi pi-plus" size="small"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="teams" striped-rows>
                                            <p-column field="nameEn" header="Name (English)"></p-column>
                                            <p-column field="nameAr" header="Name (Arabic)"></p-column>
                                            <p-column field="sequence" header="Sequence (Dept -- Section -- Unit -- Team)"></p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body>
                                                    <button class="action-btn edit"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete"><i class="pi pi-trash"></i></button>
                                                </template>
                                            </p-column>
                                        </p-datatable>
                                    </p-tabpanel>
                                </p-tabpanels>
                            </p-tabs>
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
                        
                        <!-- Cost Centers Tab -->
                        <p-tabpanel value="costcenters">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-wallet"></i>
                                        Cost Center Management
                                    </div>
                                    <div class="card-subtitle">Manage organization cost centers for budgeting</div>
                                </div>
                                <p-button label="Add Cost Center" icon="pi pi-plus" @click="openCostCenterDialog()"></p-button>
                            </div>
                            
                            <p-datatable :value="costCenters" striped-rows>
                                <p-column field="code" header="Code"></p-column>
                                <p-column field="nameEn" header="Name (English)"></p-column>
                                <p-column field="nameAr" header="Name (Arabic)"></p-column>
                                <p-column header="Status">
                                    <template #body="slotProps">
                                        <span class="status-tag" :class="slotProps.data.active ? 'active' : 'inactive'">
                                            {{ slotProps.data.active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column header="Actions" style="width: 100px">
                                    <template #body="slotProps">
                                        <button class="action-btn edit" @click="editCostCenter(slotProps.data)"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete" @click="deleteCostCenter(slotProps.data.id)"><i class="pi pi-trash"></i></button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                        
                        <!-- Documents Tab -->
                        <p-tabpanel value="documents">
                            <!-- Document Stats Cards -->
                            <div class="stats-grid" style="margin-bottom: 1rem;">
                                <div class="stat-card" style="flex: 2;">
                                    <div>
                                        <div style="font-weight: 600; margin-bottom: 0.5rem;">Document expiring in</div>
                                        <div style="font-size: 0.8rem; color: var(--text-color-secondary); margin-bottom: 0.75rem;">Tracking all employee docs with expiry</div>
                                        <div style="display: flex; gap: 0.5rem;">
                                            <div style="text-align: center;">
                                                <span style="color: #f59e0b; margin-right: 0.25rem;">●</span>Nov
                                                <div class="stat-badge">0 Docs</div>
                                            </div>
                                            <div style="text-align: center;">
                                                <span style="color: #f59e0b; margin-right: 0.25rem;">●</span>Dec
                                                <div class="stat-badge">0 Docs</div>
                                            </div>
                                            <div style="text-align: center;">
                                                <span style="color: transparent; margin-right: 0.25rem;">●</span>Jan
                                                <div class="stat-badge">0 Docs</div>
                                            </div>
                                            <div style="text-align: center;">
                                                <span style="color: transparent; margin-right: 0.25rem;">●</span>Feb
                                                <div class="stat-badge">0 Docs</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                            <span style="color: #f59e0b;">●</span>
                                            <span style="font-weight: 600;">Expired</span>
                                        </div>
                                        <div style="font-size: 0.8rem; color: var(--text-color-secondary); margin-bottom: 0.5rem;">Last 30 days</div>
                                        <div class="stat-badge">{{ expiredDocsCount }} Docs</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div>
                                        <div style="font-weight: 600; margin-bottom: 0.25rem;">Drafts</div>
                                        <div style="font-size: 0.8rem; color: var(--text-color-secondary); margin-bottom: 0.5rem;">Files uploaded</div>
                                        <div class="stat-badge">0 Docs</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                            <span style="color: #22c55e;">●</span>
                                            <span style="font-weight: 600;">Missing</span>
                                        </div>
                                        <div style="font-size: 0.8rem; color: var(--text-color-secondary); margin-bottom: 0.5rem;">Mandatory doc type</div>
                                        <div class="stat-badge">40 Employees</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Document Sub-Tabs -->
                            <p-tabs :value="docTab">
                                <p-tablist>
                                    <p-tab value="uploaded">Uploaded</p-tab>
                                    <p-tab value="missing">Missing</p-tab>
                                </p-tablist>
                                
                                <p-tabpanels>
                                    <p-tabpanel value="uploaded">
                                        <!-- Search and Filters -->
                                        <div style="display: flex; align-items: center; justify-content: space-between; margin: 1rem 0;">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <span class="p-input-icon-left">
                                                    <i class="pi pi-search"></i>
                                                    <p-inputtext v-model="docSearchQuery" placeholder="Search by owner or title of other doc" style="width: 280px;"></p-inputtext>
                                                </span>
                                                <p-button label="Filters" icon="pi pi-filter" outlined></p-button>
                                            </div>
                                            <p-button label="Employee document types" icon="pi pi-plus" text @click="showDocTypeDialog = true"></p-button>
                                        </div>
                                        
                                        <!-- Filter Chips -->
                                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                                            <span class="filter-chip">Document status: Saved <i class="pi pi-times" style="margin-left: 0.5rem; cursor: pointer;"></i></span>
                                            <span class="filter-chip">Owner: Employee <i class="pi pi-times" style="margin-left: 0.5rem; cursor: pointer;"></i></span>
                                            <span style="color: #3b82f6; cursor: pointer; font-size: 0.875rem;">Clear filters</span>
                                        </div>
                                        
                                        <!-- Documents Table -->
                                        <div style="font-weight: 600; margin-bottom: 0.5rem;">Documents</div>
                                        <p-datatable :value="documents" striped-rows>
                                            <p-column selectionMode="multiple" style="width: 3rem"></p-column>
                                            <p-column header="Owner">
                                                <template #body="slotProps">
                                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                                        <img :src="slotProps.data.ownerAvatar" :alt="slotProps.data.ownerName" style="width: 32px; height: 32px; border-radius: 50%;">
                                                        <a href="#" style="color: #3b82f6; text-decoration: none;">{{ slotProps.data.ownerName }}</a>
                                                    </div>
                                                </template>
                                            </p-column>
                                            <p-column header="Document type">
                                                <template #body="slotProps">
                                                    <div>
                                                        <div>{{ slotProps.data.documentType }}</div>
                                                        <div v-if="slotProps.data.isPrimary" style="font-size: 0.8rem; color: var(--text-color-secondary);">Primary</div>
                                                    </div>
                                                </template>
                                            </p-column>
                                            <p-column header="Expiry Date">
                                                <template #body="slotProps">
                                                    <div>
                                                        <div>{{ slotProps.data.expiryDate }}</div>
                                                        <div :style="{ fontSize: '0.8rem', color: slotProps.data.status === 'expired' ? '#ef4444' : 'var(--text-color-secondary)' }">
                                                            {{ slotProps.data.expiresIn }}
                                                        </div>
                                                    </div>
                                                </template>
                                            </p-column>
                                            <p-column field="lastUpdated" header="Last updated"></p-column>
                                            <p-column header="Actions" style="width: 80px">
                                                <template #body>
                                                    <div style="display: flex; gap: 0.5rem;">
                                                        <button class="action-btn"><i class="pi pi-eye"></i></button>
                                                        <button class="action-btn"><i class="pi pi-ellipsis-v"></i></button>
                                                    </div>
                                                </template>
                                            </p-column>
                                        </p-datatable>
                                    </p-tabpanel>
                                    
                                    <p-tabpanel value="missing">
                                        <div style="padding: 2rem; text-align: center; color: var(--text-color-secondary);">
                                            <i class="pi pi-file" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                                            <div>No missing documents to display</div>
                                        </div>
                                    </p-tabpanel>
                                </p-tabpanels>
                            </p-tabs>
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
            
            <!-- Cost Center Dialog -->
            <p-dialog v-model:visible="showCostCenterDialog" :header="isEditingCostCenter ? 'Edit Cost Center' : 'Add Cost Center'" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Code <span class="required">*</span></label>
                        <p-inputtext v-model="costCenterForm.code" placeholder="e.g. CC-001"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Name (English) <span class="required">*</span></label>
                        <p-inputtext v-model="costCenterForm.nameEn" placeholder="Enter cost center name in English"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Name (Arabic) <span class="required">*</span></label>
                        <p-inputtext v-model="costCenterForm.nameAr" placeholder="أدخل اسم مركز التكلفة بالعربية" dir="rtl"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="costCenterForm.active"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Active</label>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" icon="pi pi-times" text @click="showCostCenterDialog = false"></p-button>
                    <p-button :label="isEditingCostCenter ? 'Update' : 'Save'" icon="pi pi-check" @click="saveCostCenter"></p-button>
                </template>
            </p-dialog>
            
            <!-- New Document Type Dialog -->
            <p-dialog v-model:visible="showDocTypeDialog" header="New Document Type" :modal="true" :style="{ width: '450px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Name <span class="required">*</span></label>
                        <p-inputtext v-model="docTypeForm.nameEn" placeholder="EN"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label" style="font-family: 'Arial', sans-serif;">اسم</label>
                        <p-inputtext v-model="docTypeForm.nameAr" placeholder="AR" dir="rtl"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-checkbox v-model="docTypeForm.mandatory" :binary="true"></p-checkbox>
                            <label class="form-label" style="margin: 0;">This is a mandatory document</label>
                            <i class="pi pi-info-circle" style="color: var(--text-color-secondary);"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="docTypeForm.hasExpiry"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Document has an expiry date</label>
                        </div>
                    </div>
                    <div v-if="docTypeForm.hasExpiry" style="margin-left: 1.5rem; padding: 1rem; background: var(--surface-ground); border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <p-checkbox v-model="docTypeForm.sendReminders" :binary="true"></p-checkbox>
                            <div>
                                <div style="font-weight: 500;">Send expiry reminders</div>
                                <div style="font-size: 0.8rem; color: var(--text-color-secondary);">Email to: Super admin, people manager and employee</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <label style="font-size: 0.875rem; color: var(--text-color-secondary);">Months before expiry</label>
                            <p-inputnumber v-model="docTypeForm.reminderMonths" :min="1" :max="12" showButtons buttonLayout="vertical" style="width: 80px;">
                                <template #incrementbuttonicon>
                                    <i class="pi pi-chevron-up"></i>
                                </template>
                                <template #decrementbuttonicon>
                                    <i class="pi pi-chevron-down"></i>
                                </template>
                            </p-inputnumber>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" text @click="showDocTypeDialog = false"></p-button>
                    <p-button label="Save" @click="saveDocType"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        // Active tab state
        const activeTab = ref('countries');
        const orgTab = ref('departments');
        const docTab = ref('uploaded');

        // Dialog states
        const showCountryDialog = ref(false);
        const showHolidayDialog = ref(false);
        const showCostCenterDialog = ref(false);
        const showDocTypeDialog = ref(false);
        const isEditingCostCenter = ref(false);
        const editingCostCenterId = ref(null);

        // Document search
        const docSearchQuery = ref('');

        // Data from static data
        const countries = ref([...StaticData.countries]);
        const timezones = ref([...StaticData.timezones]);
        const holidays = ref([...StaticData.holidays]);
        const departments = ref([...StaticData.departments]);
        const sections = ref([...StaticData.sections]);
        const units = ref([...StaticData.units]);
        const teams = ref([...StaticData.teams]);
        const costCenters = ref([...StaticData.costCenters]);
        const offices = ref([...StaticData.offices]);
        const documentTypes = ref([...StaticData.documentTypes]);
        const documents = ref([...StaticData.documents]);
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

        // Cost center form
        const costCenterForm = ref({
            code: '',
            nameEn: '',
            nameAr: '',
            active: true
        });

        // Document type form
        const docTypeForm = ref({
            nameEn: '',
            nameAr: '',
            mandatory: true,
            hasExpiry: true,
            sendReminders: true,
            reminderMonths: 1
        });

        // Computed - expired documents count
        const expiredDocsCount = computed(() => documents.value.filter(d => d.status === 'expired').length);

        // Methods
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

        // Cost Center CRUD methods
        const openCostCenterDialog = (costCenter = null) => {
            if (costCenter) {
                isEditingCostCenter.value = true;
                editingCostCenterId.value = costCenter.id;
                costCenterForm.value = { ...costCenter };
            } else {
                isEditingCostCenter.value = false;
                editingCostCenterId.value = null;
                costCenterForm.value = { code: '', nameEn: '', nameAr: '', active: true };
            }
            showCostCenterDialog.value = true;
        };

        const editCostCenter = (costCenter) => {
            openCostCenterDialog(costCenter);
        };

        const saveCostCenter = () => {
            if (costCenterForm.value.code && costCenterForm.value.nameEn && costCenterForm.value.nameAr) {
                if (isEditingCostCenter.value) {
                    // Update existing
                    const index = costCenters.value.findIndex(cc => cc.id === editingCostCenterId.value);
                    if (index !== -1) {
                        costCenters.value[index] = {
                            ...costCenterForm.value,
                            id: editingCostCenterId.value
                        };
                    }
                } else {
                    // Create new
                    const maxId = costCenters.value.reduce((max, cc) => Math.max(max, cc.id), 0);
                    costCenters.value.push({
                        id: maxId + 1,
                        ...costCenterForm.value
                    });
                }
                showCostCenterDialog.value = false;
                costCenterForm.value = { code: '', nameEn: '', nameAr: '', active: true };
            }
        };

        const deleteCostCenter = (id) => {
            costCenters.value = costCenters.value.filter(cc => cc.id !== id);
        };

        // Document Type methods
        const saveDocType = () => {
            if (docTypeForm.value.nameEn && docTypeForm.value.nameAr) {
                const maxId = documentTypes.value.reduce((max, dt) => Math.max(max, dt.id), 0);
                documentTypes.value.push({
                    id: maxId + 1,
                    ...docTypeForm.value
                });
                docTypeForm.value = {
                    nameEn: '',
                    nameAr: '',
                    mandatory: true,
                    hasExpiry: true,
                    sendReminders: true,
                    reminderMonths: 1
                };
                showDocTypeDialog.value = false;
            }
        };

        return {
            activeTab,
            orgTab,
            docTab,
            showCountryDialog,
            showHolidayDialog,
            showCostCenterDialog,
            showDocTypeDialog,
            isEditingCostCenter,
            docSearchQuery,
            countries,
            timezones,
            holidays,
            departments,
            sections,
            units,
            teams,
            costCenters,
            offices,
            documentTypes,
            documents,
            biometricDevices,
            workWeekDays,
            attendanceSettings,
            countryOptions,
            newCountry,
            newHoliday,
            costCenterForm,
            docTypeForm,
            expiredDocsCount,
            addCountry,
            addHoliday,
            openCostCenterDialog,
            editCostCenter,
            saveCostCenter,
            deleteCostCenter,
            saveDocType
        };
    }
};

// Make it available globally
window.CompanySettingsComponent = CompanySettingsComponent;

