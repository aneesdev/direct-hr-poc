/**
 * Company Settings Component
 * Handles all company configuration settings
 * Updated: Removed Arabic fields, added counts, new workweeks CRUD, grades/job titles
 */

const CompanySettingsComponent = {
    template: `
        <div class="company-settings-page">
            <!-- Quick Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="pi pi-globe"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ countriesOfWork.length }}</div>
                        <div class="stat-label">Countries of Work</div>
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
                        <p-tab value="countries" @click="activeTab = 'countries'">Countries of Work</p-tab>
                        <p-tab value="holidays" @click="activeTab = 'holidays'">Public Holidays</p-tab>
                        <p-tab value="organization" @click="activeTab = 'organization'">Organization</p-tab>
                        <p-tab value="grades" @click="activeTab = 'grades'">Grades & Job Titles</p-tab>
                        <p-tab value="offices" @click="activeTab = 'offices'">Offices</p-tab>
                        <p-tab value="biometricdevices" @click="activeTab = 'biometricdevices'">Biometric Devices</p-tab>
                        <p-tab value="costcenters" @click="activeTab = 'costcenters'">Cost Centers</p-tab>
                        <p-tab value="workweeks" @click="activeTab = 'workweeks'">Work Weeks</p-tab>
                        <p-tab value="shiftlibrary" @click="activeTab = 'shiftlibrary'">Shift Library</p-tab>
                    </p-tablist>
                    
                    <p-tabpanels>
                        <!-- Countries of Work Tab -->
                        <p-tabpanel value="countries">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-globe"></i>
                                        Countries of Work
                                    </div>
                                    <div class="card-subtitle">Countries where the company operates</div>
                                </div>
                                <p-button label="Add Country" icon="pi pi-plus" @click="showCountryDialog = true"></p-button>
                            </div>
                            
                            <p-datatable :value="countriesOfWork" striped-rows>
                                <p-column header="Country">
                                    <template #body="slotProps">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <img :src="slotProps.data.logo" :alt="slotProps.data.name"
                                                style="width: 32px; height: 20px; object-fit: cover; border-radius: 4px;">
                                            <span style="font-weight: 600;">{{ slotProps.data.name }}</span>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column field="timezone" header="Timezone"></p-column>
                                <p-column header="Status">
                                    <template #body="slotProps">
                                        <span class="status-tag" :class="slotProps.data.active ? 'active' : 'inactive'">
                                            {{ slotProps.data.active ? 'Active' : 'Inactive' }}
                                        </span>
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
                                    <div class="card-subtitle">Manage country-specific public holidays with date ranges</div>
                                </div>
                                <p-button label="Add Holiday" icon="pi pi-plus" @click="showHolidayDialog = true"></p-button>
                            </div>
                            
                            <p-datatable :value="holidays" striped-rows>
                                <p-column field="country" header="Country"></p-column>
                                <p-column field="name" header="Holiday Name"></p-column>
                                <p-column header="Date Range">
                                    <template #body="slotProps">
                                        <span v-if="slotProps.data.startDate === slotProps.data.endDate">
                                            {{ slotProps.data.startDate }}
                                        </span>
                                        <span v-else>
                                            {{ slotProps.data.startDate }} - {{ slotProps.data.endDate }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column field="year" header="Year"></p-column>
                                <p-column header="Actions" style="width: 100px">
                                    <template #body="slotProps">
                                        <button class="action-btn edit" @click="editHoliday(slotProps.data)"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete" @click="deleteHoliday(slotProps.data.id)"><i class="pi pi-trash"></i></button>
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
                                    <div class="card-subtitle">Department → Sections → Units → Teams (with employee counts)</div>
                                </div>
                            </div>
                            
                            <!-- Nested Organization Tabs -->
                            <p-tabs :value="orgTab">
                                <p-tablist>
                                    <p-tab value="departments" @click="orgTab = 'departments'">Departments ({{ departments.length }})</p-tab>
                                    <p-tab value="sections" @click="orgTab = 'sections'">Sections ({{ sections.length }})</p-tab>
                                    <p-tab value="units" @click="orgTab = 'units'">Units ({{ units.length }})</p-tab>
                                    <p-tab value="teams" @click="orgTab = 'teams'">Teams ({{ teams.length }})</p-tab>
                                </p-tablist>
                                
                                <p-tabpanels>
                                    <!-- Departments Sub-Tab -->
                                    <p-tabpanel value="departments">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div>
                                                <div class="card-subtitle">Manage organization departments</div>
                                            </div>
                                            <p-button label="Add Department" icon="pi pi-plus" size="small" @click="openOrgDialog('department')"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="departments" striped-rows>
                                            <p-column field="name" header="Name"></p-column>
                                            <p-column header="Employees">
                                                <template #body="slotProps">
                                                    <p-tag :value="slotProps.data.employeeCount + ' employees'" severity="info"></p-tag>
                                                </template>
                                            </p-column>
                                            <p-column header="Sections">
                                                <template #body="slotProps">
                                                    <span class="stat-badge">{{ getSectionCount(slotProps.data.id) }} sections</span>
                                                </template>
                                            </p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body="slotProps">
                                                    <button class="action-btn edit" @click="editOrg('department', slotProps.data)"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete" @click="deleteOrg('department', slotProps.data.id)"><i class="pi pi-trash"></i></button>
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
                                            <p-button label="Add Section" icon="pi pi-plus" size="small" @click="openOrgDialog('section')"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="sections" striped-rows>
                                            <p-column field="name" header="Name"></p-column>
                                            <p-column header="Department">
                                                <template #body="slotProps">
                                                    {{ getDepartmentName(slotProps.data.departmentId) }}
                                                </template>
                                            </p-column>
                                            <p-column header="Employees">
                                                <template #body="slotProps">
                                                    <p-tag :value="slotProps.data.employeeCount + ' employees'" severity="info"></p-tag>
                                                </template>
                                            </p-column>
                                            <p-column header="Units">
                                                <template #body="slotProps">
                                                    <span class="stat-badge">{{ getUnitCount(slotProps.data.id) }} units</span>
                                                </template>
                                            </p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body="slotProps">
                                                    <button class="action-btn edit" @click="editOrg('section', slotProps.data)"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete" @click="deleteOrg('section', slotProps.data.id)"><i class="pi pi-trash"></i></button>
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
                                            <p-button label="Add Unit" icon="pi pi-plus" size="small" @click="openOrgDialog('unit')"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="units" striped-rows>
                                            <p-column field="name" header="Name"></p-column>
                                            <p-column header="Section">
                                                <template #body="slotProps">
                                                    {{ getSectionName(slotProps.data.sectionId) }}
                                                </template>
                                            </p-column>
                                            <p-column header="Employees">
                                                <template #body="slotProps">
                                                    <p-tag :value="slotProps.data.employeeCount + ' employees'" severity="info"></p-tag>
                                                </template>
                                            </p-column>
                                            <p-column header="Teams">
                                                <template #body="slotProps">
                                                    <span class="stat-badge">{{ getTeamCount(slotProps.data.id) }} teams</span>
                                                </template>
                                            </p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body="slotProps">
                                                    <button class="action-btn edit" @click="editOrg('unit', slotProps.data)"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete" @click="deleteOrg('unit', slotProps.data.id)"><i class="pi pi-trash"></i></button>
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
                                            <p-button label="Add Team" icon="pi pi-plus" size="small" @click="openOrgDialog('team')"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="teams" striped-rows>
                                            <p-column field="name" header="Name"></p-column>
                                            <p-column header="Unit">
                                                <template #body="slotProps">
                                                    {{ getUnitName(slotProps.data.unitId) }}
                                                </template>
                                            </p-column>
                                            <p-column header="Employees">
                                                <template #body="slotProps">
                                                    <p-tag :value="slotProps.data.employeeCount + ' employees'" severity="info"></p-tag>
                                                </template>
                                            </p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body="slotProps">
                                                    <button class="action-btn edit" @click="editOrg('team', slotProps.data)"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete" @click="deleteOrg('team', slotProps.data.id)"><i class="pi pi-trash"></i></button>
                                                </template>
                                            </p-column>
                                        </p-datatable>
                                    </p-tabpanel>
                                </p-tabpanels>
                            </p-tabs>
                        </p-tabpanel>
                        
                        <!-- Grades & Job Titles Tab -->
                        <p-tabpanel value="grades">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-star"></i>
                                        Grades & Job Titles
                                    </div>
                                    <div class="card-subtitle">Main Grade → Sub Grade → Job Titles hierarchy</div>
                                </div>
                            </div>
                            
                            <p-tabs :value="gradeTab">
                                <p-tablist>
                                    <p-tab value="mainGrades" @click="gradeTab = 'mainGrades'">Main Grades</p-tab>
                                    <p-tab value="subGrades" @click="gradeTab = 'subGrades'">Sub Grades</p-tab>
                                    <p-tab value="jobTitles" @click="gradeTab = 'jobTitles'">Job Titles</p-tab>
                                </p-tablist>
                                
                                <p-tabpanels>
                                    <!-- Main Grades -->
                                    <p-tabpanel value="mainGrades">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div class="card-subtitle">Professional, Supervisor, Management, Executives</div>
                                            <p-button label="Add Main Grade" icon="pi pi-plus" size="small" @click="openGradeDialog('main')"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="mainGrades" striped-rows>
                                            <p-column field="name" header="Name"></p-column>
                                            <p-column field="description" header="Description"></p-column>
                                            <p-column header="Sub Grades">
                                                <template #body="slotProps">
                                                    <span class="stat-badge">{{ getSubGradeCount(slotProps.data.id) }} sub grades</span>
                                                </template>
                                            </p-column>
                                            <p-column header="Job Titles">
                                                <template #body="slotProps">
                                                    <span class="stat-badge">{{ getJobTitleCount(slotProps.data.id) }} titles</span>
                                                </template>
                                            </p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body="slotProps">
                                                    <button class="action-btn edit" @click="editGrade('main', slotProps.data)"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete" @click="deleteGrade('main', slotProps.data.id)"><i class="pi pi-trash"></i></button>
                                                </template>
                                            </p-column>
                                        </p-datatable>
                                    </p-tabpanel>
                                    
                                    <!-- Sub Grades -->
                                    <p-tabpanel value="subGrades">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div class="card-subtitle">Sub grades within main grades</div>
                                            <p-button label="Add Sub Grade" icon="pi pi-plus" size="small" @click="openGradeDialog('sub')"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="subGrades" striped-rows>
                                            <p-column field="name" header="Name"></p-column>
                                            <p-column header="Main Grade">
                                                <template #body="slotProps">
                                                    {{ getMainGradeName(slotProps.data.mainGradeId) }}
                                                </template>
                                            </p-column>
                                            <p-column header="Employees">
                                                <template #body>
                                                    <span class="stat-badge">0 employees</span>
                                                </template>
                                            </p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body="slotProps">
                                                    <button class="action-btn edit" @click="editGrade('sub', slotProps.data)"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete" @click="deleteGrade('sub', slotProps.data.id)"><i class="pi pi-trash"></i></button>
                                                </template>
                                            </p-column>
                                        </p-datatable>
                                    </p-tabpanel>
                                    
                                    <!-- Job Titles -->
                                    <p-tabpanel value="jobTitles">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div class="card-subtitle">Job titles within main grades (sibling of sub grades)</div>
                                            <p-button label="Add Job Title" icon="pi pi-plus" size="small" @click="openGradeDialog('jobTitle')"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="jobTitles" striped-rows>
                                            <p-column field="name" header="Name"></p-column>
                                            <p-column header="Main Grade">
                                                <template #body="slotProps">
                                                    {{ getMainGradeName(slotProps.data.mainGradeId) }}
                                                </template>
                                            </p-column>
                                            <p-column field="description" header="Description"></p-column>
                                            <p-column header="Actions" style="width: 100px">
                                                <template #body="slotProps">
                                                    <button class="action-btn edit" @click="editGrade('jobTitle', slotProps.data)"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete" @click="deleteGrade('jobTitle', slotProps.data.id)"><i class="pi pi-trash"></i></button>
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
                                    <div class="card-subtitle">Manage office locations with Google Maps links</div>
                                </div>
                                <p-button label="Add Office" icon="pi pi-plus" @click="openOfficeDialog()"></p-button>
                            </div>
                            
                            <p-datatable :value="offices" striped-rows>
                                <p-column field="name" header="Name"></p-column>
                                <p-column field="country" header="Country"></p-column>
                                <p-column header="Google Maps">
                                    <template #body="slotProps">
                                        <a :href="slotProps.data.googleMapsLink" target="_blank" style="color: #3b82f6; display: flex; align-items: center; gap: 0.5rem;">
                                            <i class="pi pi-external-link"></i> View on Map
                                        </a>
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
                                    <template #body="slotProps">
                                        <button class="action-btn edit" @click="editOffice(slotProps.data)"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete" @click="deleteOffice(slotProps.data.id)"><i class="pi pi-trash"></i></button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                        
                        <!-- Biometric Devices Tab -->
                        <p-tabpanel value="biometricdevices">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-id-card"></i>
                                        Biometric Devices
                                    </div>
                                    <div class="card-subtitle">Manage biometric devices linked to office locations</div>
                                </div>
                                <p-button label="Add Device" icon="pi pi-plus" @click="openBiometricDeviceDialog()"></p-button>
                            </div>
                            
                            <p-datatable :value="biometricDevices" striped-rows>
                                <p-column field="name" header="Name"></p-column>
                                <p-column field="description" header="Description"></p-column>
                                <p-column header="Office">
                                    <template #body="slotProps">
                                        {{ getOfficeName(slotProps.data.officeId) }}
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
                                    <template #body="slotProps">
                                        <button class="action-btn edit" @click="editBiometricDevice(slotProps.data)"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete" @click="deleteBiometricDevice(slotProps.data.id)"><i class="pi pi-trash"></i></button>
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
                                        Cost Center Structure
                                    </div>
                                    <div class="card-subtitle">Main Cost Centers → Sub Cost Centers (with head counts)</div>
                                </div>
                            </div>
                            
                            <!-- Nested Cost Center Tabs -->
                            <p-tabs :value="costCenterSubTab">
                                <p-tablist>
                                    <p-tab value="main" @click="costCenterSubTab = 'main'">Main Cost Centers ({{ costCenters.length }})</p-tab>
                                    <p-tab value="sub" @click="costCenterSubTab = 'sub'">Sub Cost Centers ({{ subCostCenters.length }})</p-tab>
                                </p-tablist>
                                
                                <p-tabpanels>
                                    <!-- Main Cost Centers Sub-Tab -->
                                    <p-tabpanel value="main">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div>
                                                <div class="card-subtitle">Manage organization main cost centers</div>
                                            </div>
                                            <p-button label="Add Cost Center" icon="pi pi-plus" size="small" @click="openCostCenterDialog()"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="costCenters" striped-rows>
                                            <p-column field="name" header="Name"></p-column>
                                            <p-column header="Sub Centers">
                                                <template #body="slotProps">
                                                    <span class="stat-badge">{{ getSubCostCenterCount(slotProps.data.id) }} sub centers</span>
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
                                    
                                    <!-- Sub Cost Centers Sub-Tab -->
                                    <p-tabpanel value="sub">
                                        <div class="card-header" style="padding-top: 1rem;">
                                            <div>
                                                <div class="card-subtitle">Sub cost centers belong to main cost centers</div>
                                            </div>
                                            <p-button label="Add Sub Cost Center" icon="pi pi-plus" size="small" @click="openSubCostCenterDialog()"></p-button>
                                        </div>
                                        
                                        <p-datatable :value="subCostCenters" striped-rows>
                                            <p-column field="code" header="Code"></p-column>
                                            <p-column header="Main Cost Center">
                                                <template #body="slotProps">
                                                    {{ getParentCostCenterName(slotProps.data.parentCostCenterId) }}
                                                </template>
                                            </p-column>
                                            <p-column field="country" header="Country"></p-column>
                                            <p-column header="Tag">
                                                <template #body="slotProps">
                                                    <span v-if="slotProps.data.tag" class="cost-center-type-tag" :class="slotProps.data.tag">
                                                        {{ getCostCenterTagLabel(slotProps.data.tag) }}
                                                    </span>
                                                    <span v-else class="text-muted">—</span>
                                                </template>
                                            </p-column>
                                            <p-column header="Head Count">
                                                <template #body="slotProps">
                                                    <p-tag :value="slotProps.data.headCount + ' employees'" severity="info"></p-tag>
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
                                                <template #body="slotProps">
                                                    <button class="action-btn edit" @click="editSubCostCenter(slotProps.data)"><i class="pi pi-pencil"></i></button>
                                                    <button class="action-btn delete" @click="deleteSubCostCenter(slotProps.data.id)"><i class="pi pi-trash"></i></button>
                                                </template>
                                            </p-column>
                                        </p-datatable>
                                    </p-tabpanel>
                                </p-tabpanels>
                            </p-tabs>
                        </p-tabpanel>
                        
                        <!-- Work Weeks Tab (CRUD like Bayzat) -->
                        <p-tabpanel value="workweeks">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-calendar-plus"></i>
                                        Work Week Templates
                                    </div>
                                    <div class="card-subtitle">Create reusable work week patterns for employees</div>
                                </div>
                                <p-button label="Add Work Week" icon="pi pi-plus" @click="openWorkWeekDialog()"></p-button>
                            </div>
                            
                            <div class="workweek-cards">
                                <div v-for="ww in workWeeks" :key="ww.id" class="workweek-card">
                                    <div class="workweek-header">
                                        <div class="workweek-name">{{ ww.name }}</div>
                                        <div class="workweek-actions">
                                            <button class="action-btn edit" @click="editWorkWeek(ww)"><i class="pi pi-pencil"></i></button>
                                            <button class="action-btn delete" @click="deleteWorkWeek(ww.id)"><i class="pi pi-trash"></i></button>
                                        </div>
                                    </div>
                                    <div class="workweek-days">
                                        <div v-for="(isWorking, day) in ww.days" :key="day" 
                                             class="workweek-day" :class="{ working: isWorking, off: !isWorking }">
                                            {{ day.substring(0, 3) }}
                                        </div>
                                    </div>
                                    <div class="workweek-footer">
                                        <span class="stat-badge">{{ ww.totalDays }} working days</span>
                                        <span class="status-tag" :class="ww.active ? 'active' : 'inactive'">
                                            {{ ww.active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>
                        
                        <!-- Shift Library Tab -->
                        <p-tabpanel value="shiftlibrary">
                            <!-- Shift Library Header -->
                            <div class="shift-library-header">
                                <div class="shift-library-info">
                                    <h2>SHIFT LIBRARY</h2>
                                    <p>Standardize operational hours across all departments.</p>
                                </div>
                                <div class="shift-library-stats">
                                    <div class="preset-count">
                                        <span class="count-value">{{ allShifts.length }}</span>
                                        <span class="count-label">PRESETS</span>
                                    </div>
                                    <button class="new-preset-btn" @click="openShiftDialog()">
                                        <i class="pi pi-plus"></i>
                                        <span>NEW PRESET</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Shift Type Tabs -->
                            <div class="shift-type-tabs">
                                <button class="shift-type-tab" :class="{ active: shiftTypeFilter === 'normal' }" 
                                        @click="shiftTypeFilter = 'normal'">NORMAL SHIFT</button>
                                <button class="shift-type-tab" :class="{ active: shiftTypeFilter === 'template' }" 
                                        @click="shiftTypeFilter = 'template'">TEMPLATE DAY SHIFT</button>
                                <button class="shift-type-tab" :class="{ active: shiftTypeFilter === 'flexible' }" 
                                        @click="shiftTypeFilter = 'flexible'">FLEXIBLE SHIFT</button>
                            </div>

                            <!-- Shift Cards Grid -->
                            <div class="shift-library-grid">
                                <!-- Existing Shift Cards -->
                                <div v-for="shift in filteredShifts" :key="shift.id" class="shift-preset-card">
                                    <div class="preset-card-header">
                                        <div class="preset-icon" :style="{ background: shift.color + '20', color: shift.color }">
                                            <i class="pi pi-calendar"></i>
                                        </div>
                                        <div class="preset-info">
                                            <h3>{{ shift.name }}</h3>
                                            <div class="preset-meta">
                                                <span class="preset-type">{{ getShiftTypeLabel(shift.shiftType) }}</span>
                                                <span class="preset-periods">{{ (shift.periods && shift.periods.length > 0) ? shift.periods.length : 1 }} Period{{ ((shift.periods?.length || 1) > 1) ? 's' : '' }}</span>
                                            </div>
                                        </div>
                                        <div class="preset-actions">
                                            <button class="action-btn edit" @click="editShift(shift)" title="Edit">
                                                <i class="pi pi-pencil"></i>
                                            </button>
                                            <button class="action-btn delete" @click="deleteShift(shift)" title="Delete">
                                                <i class="pi pi-trash"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Period Details (show first period or flexible info) -->
                                    <template v-if="shift.shiftType === 'flexible'">
                                        <div class="flexible-shift-details">
                                            <!-- Required Hours Display -->
                                            <div class="flexible-hours-display">
                                                <div class="hours-value">{{ shift.requiredHours }}</div>
                                                <div class="hours-label">Hours Required Daily</div>
                                            </div>

                                            <!-- Duration Progress Bar -->
                                            <div class="duration-bar">
                                                <div class="duration-bar-fill" :style="{ width: (shift.requiredHours / 12 * 100) + '%', background: shift.color }"></div>
                                            </div>

                                            <!-- Valid Time Window -->
                                            <div class="clock-rules-section flexible-window">
                                                <div class="rules-header">
                                                    <i class="pi pi-clock"></i>
                                                    <span>VALID WORK WINDOW:</span>
                                                </div>
                                                <div class="rules-content">
                                                    <div class="rule-line">
                                                        Punch-in allowed from <strong>{{ formatTime12(shift.validFrom) }}</strong> 
                                                        to <strong>{{ formatTime12(shift.validTo) }}</strong>
                                                    </div>
                                                    <div class="rule-line info-text">
                                                        <i class="pi pi-info-circle"></i>
                                                        Total work time calculated based on first and last punch
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-else>
                                        <div v-for="(period, pIndex) in ((shift.periods && shift.periods.length > 0) ? shift.periods : [{ startTime: shift.startTime, endTime: shift.endTime, clockIn: shift.clockIn, clockOut: shift.clockOut }])" 
                                             :key="pIndex" class="preset-period">
                                            <div class="preset-time-info">
                                                <div class="time-display">
                                                    <i class="pi pi-clock"></i>
                                                    <span>{{ formatTime12(period.startTime) }} - {{ formatTime12(period.endTime) }}</span>
                                                </div>
                                                <div class="duration-display">
                                                    <i class="pi pi-stopwatch"></i>
                                                    <span>{{ calculateDuration(period.startTime, period.endTime) }} hrs Duration</span>
                                                </div>
                                            </div>

                                            <!-- Duration Progress Bar -->
                                            <div class="duration-bar">
                                                <div class="duration-bar-fill" :style="{ width: getDurationPercent(period.startTime, period.endTime) + '%', background: shift.color }"></div>
                                            </div>

                                            <!-- Clock-In Rules -->
                                            <div class="clock-rules-section">
                                                <div class="rules-header">
                                                    <i class="pi pi-sign-in"></i>
                                                    <span>CLOCK-IN RULES:</span>
                                                </div>
                                                <div class="rules-content">
                                                    <div class="rule-line">
                                                        Window: <strong>{{ formatTime12(period.clockIn?.windowStart || subtractMinutes(period.startTime, 60)) }}</strong> 
                                                        to <strong>{{ formatTime12(period.clockIn?.windowEnd || addMinutes(period.startTime, 60)) }}</strong>.
                                                    </div>
                                                    <div class="rule-line threshold">
                                                        Late threshold: <span class="threshold-value">{{ formatTime12(period.clockIn?.lateThreshold || addMinutes(period.startTime, 15)) }}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Clock-Out Rules -->
                                            <div class="clock-rules-section">
                                                <div class="rules-header out">
                                                    <i class="pi pi-sign-out"></i>
                                                    <span>CLOCK-OUT RULES:</span>
                                                </div>
                                                <div class="rules-content">
                                                    <div class="rule-line">
                                                        Window: <strong>{{ formatTime12(period.clockOut?.windowStart || subtractMinutes(period.endTime, 30)) }}</strong> 
                                                        to <strong>{{ formatTime12(period.clockOut?.windowEnd || addMinutes(period.endTime, 60)) }}</strong>.
                                                    </div>
                                                    <div class="rule-line threshold">
                                                        Early exit threshold: <span class="threshold-value">{{ formatTime12(period.clockOut?.earlyThreshold || period.endTime) }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>

                                <!-- Create New Shift Card -->
                                <div class="shift-preset-card create-new" @click="openShiftDialog()">
                                    <div class="create-new-content">
                                        <i class="pi pi-plus"></i>
                                        <h4>Create New Shift</h4>
                                        <p>Add a custom shift preset</p>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>
            
            <!-- Add Country Dialog -->
            <p-dialog v-model:visible="showCountryDialog" header="Add Country of Work" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Select Country <span class="required">*</span></label>
                        <p-select v-model="newCountry.selected" :options="availableCountries" optionLabel="name" 
                                  placeholder="Choose a country" style="width: 100%;">
                            <template #option="slotProps">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <img :src="slotProps.option.flag" style="width: 24px; height: 16px; object-fit: cover; border-radius: 2px;">
                                    <span>{{ slotProps.option.name }}</span>
                                </div>
                            </template>
                        </p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Timezone <span class="required">*</span></label>
                        <p-select v-model="newCountry.timezone" :options="timezones" placeholder="Select timezone" style="width: 100%;"></p-select>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" icon="pi pi-times" severity="danger" outlined @click="showCountryDialog = false"></p-button>
                    <p-button label="Add" icon="pi pi-check" @click="addCountry"></p-button>
                </template>
            </p-dialog>
            
            <!-- Add Holiday Dialog -->
            <p-dialog v-model:visible="showHolidayDialog" :header="editingHoliday ? 'Edit Holiday' : 'Add Public Holiday'" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Country <span class="required">*</span></label>
                        <p-multiselect v-if="!editingHoliday" v-model="holidayForm.countries" :options="countryOptions" placeholder="Select countries" style="width: 100%;" display="chip"></p-multiselect>
                        <p-select v-else v-model="holidayForm.country" :options="countryOptions" placeholder="Select country" style="width: 100%;"></p-select>
                        <small v-if="!editingHoliday" class="form-hint">Select multiple countries for shared holidays (e.g., Eid)</small>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Holiday Name <span class="required">*</span></label>
                        <p-inputtext v-model="holidayForm.name" placeholder="Enter holiday name" style="width: 100%;"></p-inputtext>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Start Date <span class="required">*</span></label>
                            <p-datepicker v-model="holidayForm.startDate" dateFormat="dd/mm/yy" style="width: 100%;"></p-datepicker>
                        </div>
                        <div class="form-group">
                            <label class="form-label">End Date <span class="required">*</span></label>
                            <p-datepicker v-model="holidayForm.endDate" dateFormat="dd/mm/yy" style="width: 100%;"></p-datepicker>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" icon="pi pi-times" severity="danger" outlined @click="showHolidayDialog = false"></p-button>
                    <p-button :label="editingHoliday ? 'Update' : 'Save'" icon="pi pi-check" @click="saveHoliday"></p-button>
                </template>
            </p-dialog>
            
            <!-- Organization Dialog -->
            <p-dialog v-model:visible="showOrgDialog" :header="orgDialogTitle" :modal="true" :style="{ width: '450px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group" v-if="orgType === 'section'">
                        <label class="form-label">Department <span class="required">*</span></label>
                        <p-select v-model="orgForm.parentId" :options="departments" optionLabel="name" optionValue="id" placeholder="Select department" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group" v-if="orgType === 'unit'">
                        <label class="form-label">Section <span class="required">*</span></label>
                        <p-select v-model="orgForm.parentId" :options="sections" optionLabel="name" optionValue="id" placeholder="Select section" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group" v-if="orgType === 'team'">
                        <label class="form-label">Unit <span class="required">*</span></label>
                        <p-select v-model="orgForm.parentId" :options="units" optionLabel="name" optionValue="id" placeholder="Select unit" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Name <span class="required">*</span></label>
                        <p-inputtext v-model="orgForm.name" placeholder="Enter name" style="width: 100%;"></p-inputtext>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showOrgDialog = false"></p-button>
                    <p-button :label="editingOrg ? 'Update' : 'Save'" @click="saveOrg"></p-button>
                </template>
            </p-dialog>
            
            <!-- Grade/Job Title Dialog -->
            <p-dialog v-model:visible="showGradeDialog" :header="gradeDialogTitle" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group" v-if="gradeType === 'sub' || gradeType === 'jobTitle'">
                        <label class="form-label">Main Grade <span class="required">*</span></label>
                        <p-select v-model="gradeForm.parentId" :options="mainGrades" optionLabel="name" optionValue="id" placeholder="Select main grade" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Name <span class="required">*</span></label>
                        <p-inputtext v-model="gradeForm.name" placeholder="Enter name" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <p-textarea v-model="gradeForm.description" rows="3" placeholder="Enter description" style="width: 100%;"></p-textarea>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showGradeDialog = false"></p-button>
                    <p-button :label="editingGrade ? 'Update' : 'Save'" @click="saveGrade"></p-button>
                </template>
            </p-dialog>
            
            <!-- Office Dialog -->
            <p-dialog v-model:visible="showOfficeDialog" :header="editingOffice ? 'Edit Office' : 'Add Office'" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Office Name <span class="required">*</span></label>
                        <p-inputtext v-model="officeForm.name" placeholder="e.g. Cairo HQ" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Country <span class="required">*</span></label>
                        <p-select v-model="officeForm.country" :options="countryOptions" placeholder="Select country" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Google Maps Link <span class="required">*</span></label>
                        <p-inputtext v-model="officeForm.googleMapsLink" placeholder="https://maps.google.com/..." style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="officeForm.active"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Active</label>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showOfficeDialog = false"></p-button>
                    <p-button :label="editingOffice ? 'Update' : 'Save'" @click="saveOffice"></p-button>
                </template>
            </p-dialog>
            
            <!-- Biometric Device Dialog -->
            <p-dialog v-model:visible="showBiometricDeviceDialog" :header="editingBiometricDevice ? 'Edit Device' : 'Add Device'" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Device Name <span class="required">*</span></label>
                        <p-inputtext v-model="biometricDeviceForm.name" placeholder="e.g. Main Entrance Scanner" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <p-textarea v-model="biometricDeviceForm.description" rows="3" placeholder="Enter device description" style="width: 100%;"></p-textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Office <span class="required">*</span></label>
                        <p-select v-model="biometricDeviceForm.officeId" :options="offices" optionLabel="name" optionValue="id" placeholder="Select office" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="biometricDeviceForm.active"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Active</label>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showBiometricDeviceDialog = false"></p-button>
                    <p-button :label="editingBiometricDevice ? 'Update' : 'Save'" @click="saveBiometricDevice"></p-button>
                </template>
            </p-dialog>
            
            <!-- Cost Center Dialog -->
            <p-dialog v-model:visible="showCostCenterDialog" :header="editingCostCenter ? 'Edit Cost Center' : 'Add Cost Center'" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Name <span class="required">*</span></label>
                        <p-inputtext v-model="costCenterForm.name" placeholder="Enter cost center name" style="width: 100%;"></p-inputtext>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showCostCenterDialog = false"></p-button>
                    <p-button :label="editingCostCenter ? 'Update' : 'Save'" @click="saveCostCenter"></p-button>
                </template>
            </p-dialog>

            <!-- Sub Cost Center Dialog -->
            <p-dialog v-model:visible="showSubCostCenterDialog" :header="editingSubCostCenter ? 'Edit Sub Cost Center' : 'Add Sub Cost Center'" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Main Cost Center <span class="required">*</span></label>
                        <p-select v-model="subCostCenterForm.parentCostCenterId" :options="costCenters" optionLabel="name" optionValue="id" placeholder="Select main cost center" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Code <span class="required">*</span></label>
                        <p-inputtext v-model="subCostCenterForm.code" placeholder="e.g. SCC-001" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Country <span class="required">*</span></label>
                        <p-select v-model="subCostCenterForm.country" :options="countryOptions" placeholder="Select country" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tag</label>
                        <p-select v-model="subCostCenterForm.tag" :options="costCenterTagOptions" optionLabel="label" optionValue="value" placeholder="Select tag" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="subCostCenterForm.active"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Active</label>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showSubCostCenterDialog = false"></p-button>
                    <p-button :label="editingSubCostCenter ? 'Update' : 'Save'" @click="saveSubCostCenter"></p-button>
                </template>
            </p-dialog>
            
            <!-- Work Week Dialog -->
            <p-dialog v-model:visible="showWorkWeekDialog" :header="editingWorkWeek ? 'Edit Work Week' : 'Add Work Week'" :modal="true" :style="{ width: '550px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Name <span class="required">*</span></label>
                        <p-inputtext v-model="workWeekForm.name" placeholder="e.g. Standard Week (Sun-Thu)" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Working Days <span class="required">*</span></label>
                        <div class="workweek-selector">
                            <div v-for="day in weekDaysList" :key="day" 
                                 class="workweek-day-btn" 
                                 :class="{ selected: workWeekForm.days[day] }"
                                 @click="workWeekForm.days[day] = !workWeekForm.days[day]">
                                {{ day }}
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="workWeekForm.active"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Active</label>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showWorkWeekDialog = false"></p-button>
                    <p-button :label="editingWorkWeek ? 'Update' : 'Save'" @click="saveWorkWeek"></p-button>
                </template>
            </p-dialog>
            
            <!-- Define New Shift Dialog -->
            <p-dialog v-model:visible="showShiftDialog" header="" :modal="true" :style="{ width: '1100px', maxWidth: '95vw' }" class="shift-dialog">
                <template #header>
                    <div class="shift-dialog-header">
                        <h2>{{ editingShift ? 'Edit Shift' : 'Define New Shift' }}</h2>
                        <div class="shift-type-toggle">
                            <button class="type-btn" :class="{ active: shiftForm.shiftType === 'normal' }" @click="shiftForm.shiftType = 'normal'">Normal</button>
                            <button class="type-btn" :class="{ active: shiftForm.shiftType === 'template' }" @click="shiftForm.shiftType = 'template'">Template</button>
                            <button class="type-btn" :class="{ active: shiftForm.shiftType === 'flexible' }" @click="shiftForm.shiftType = 'flexible'">Flexible</button>
                        </div>
                    </div>
                </template>

                <div class="shift-dialog-content">
                    <!-- Shift Name -->
                    <div class="form-group">
                        <label class="form-label">Shift Name (English)</label>
                        <p-inputtext v-model="shiftForm.name" placeholder="e.g., Morning Shift" style="width: 100%;"></p-inputtext>
                    </div>

                    <!-- NORMAL SHIFT -->
                    <template v-if="shiftForm.shiftType === 'normal'">
                        <div class="shift-details-section">
                            <h3>Shift Details</h3>
                            <div class="shift-time-row-compact">
                                <div class="time-input-group-compact">
                                    <label class="mini-label">START TIME</label>
                                    <p-datepicker v-model="shiftForm.startTimeDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="time-input-group-compact">
                                    <label class="mini-label">END TIME</label>
                                    <p-datepicker v-model="shiftForm.endTimeDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="time-input-group-compact color-section">
                                    <label class="mini-label">SHIFT COLOR</label>
                                    <div class="color-duration-display">
                                        <div class="color-box" :style="{ background: shiftForm.color }" @click="showColorPicker = !showColorPicker"></div>
                                        <span class="duration-badge">{{ computedDuration }} hrs</span>
                                    </div>
                                    <div v-if="showColorPicker" class="color-picker-dropdown">
                                        <div v-for="color in shiftColors" :key="color" 
                                             class="color-option" 
                                             :class="{ selected: shiftForm.color === color }"
                                             :style="{ background: color }"
                                             @click="shiftForm.color = color; showColorPicker = false"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Clock Rules -->
                            <div class="clock-rules-grid">
                                <!-- Clock-In Rules -->
                                <div class="clock-rules-card">
                                    <div class="rules-title">
                                        <span class="rules-dot in"></span>
                                        <span>Clock-In Rules</span>
                                        <span class="base-time">Base: {{ formatTimeFromDate(shiftForm.startTimeDate) }}</span>
                                    </div>
                                    <div class="rules-inputs-compact">
                                        <div class="rule-input-group-compact">
                                            <label>No earlier than (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockIn.noEarlierThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>Allowed delay (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockIn.allowedDelay" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>No later than (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockIn.noLaterThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                    </div>
                                    <div class="rules-summary">
                                        <i class="pi pi-info-circle"></i>
                                        <span>Window: <strong>{{ computedClockInWindow }}</strong>. Late threshold: <strong>{{ computedClockInLate }}</strong></span>
                                    </div>
                                </div>

                                <!-- Clock-Out Rules -->
                                <div class="clock-rules-card">
                                    <div class="rules-title">
                                        <span class="rules-dot out"></span>
                                        <span>Clock-Out Rules</span>
                                        <span class="base-time">Base: {{ formatTimeFromDate(shiftForm.endTimeDate) }}</span>
                                    </div>
                                    <div class="rules-inputs-compact">
                                        <div class="rule-input-group-compact">
                                            <label>No earlier than (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockOut.noEarlierThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>Allowed shortage (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockOut.allowedShortage" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>No later than (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockOut.noLaterThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                    </div>
                                    <div class="rules-summary out">
                                        <i class="pi pi-info-circle"></i>
                                        <span>Window: <strong>{{ computedClockOutWindow }}</strong>. Early exit threshold: <strong>{{ computedClockOutEarly }}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- TEMPLATE DAY SHIFT -->
                    <template v-if="shiftForm.shiftType === 'template'">
                        <div v-for="(period, index) in shiftForm.periods" :key="index" class="shift-details-section period-section">
                            <div class="period-header">
                                <h3>Shift Period {{ index + 1 }}</h3>
                                <button v-if="shiftForm.periods.length > 1" class="remove-period-btn" @click="removePeriod(index)">
                                    <i class="pi pi-times"></i>
                                </button>
                            </div>
                            <div class="shift-time-row-compact">
                                <div class="time-input-group-compact">
                                    <label class="mini-label">START TIME</label>
                                    <p-datepicker v-model="period.startTimeDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="time-input-group-compact">
                                    <label class="mini-label">END TIME</label>
                                    <p-datepicker v-model="period.endTimeDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="time-input-group-compact color-section">
                                    <label class="mini-label">SHIFT COLOR</label>
                                    <div class="color-duration-display">
                                        <div class="color-box" :style="{ background: shiftForm.color }" @click="showColorPicker = !showColorPicker"></div>
                                        <span class="duration-badge">{{ calculateDurationFromDates(period.startTimeDate, period.endTimeDate) }} hrs</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Clock Rules for this period -->
                            <div class="clock-rules-grid">
                                <div class="clock-rules-card">
                                    <div class="rules-title">
                                        <span class="rules-dot in"></span>
                                        <span>Clock-In Rules</span>
                                        <span class="base-time">Base: {{ formatTimeFromDate(period.startTimeDate) }}</span>
                                    </div>
                                    <div class="rules-inputs-compact">
                                        <div class="rule-input-group-compact">
                                            <label>No earlier than (Mins)</label>
                                            <p-inputnumber v-model="period.clockIn.noEarlierThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>Allowed delay (Mins)</label>
                                            <p-inputnumber v-model="period.clockIn.allowedDelay" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>No later than (Mins)</label>
                                            <p-inputnumber v-model="period.clockIn.noLaterThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                    </div>
                                    <div class="rules-summary">
                                        <i class="pi pi-info-circle"></i>
                                        <span>Window: <strong>{{ computePeriodClockInWindowDate(period) }}</strong>. Late threshold: <strong>{{ computePeriodClockInLateDate(period) }}</strong></span>
                                    </div>
                                </div>
                                <div class="clock-rules-card">
                                    <div class="rules-title">
                                        <span class="rules-dot out"></span>
                                        <span>Clock-Out Rules</span>
                                        <span class="base-time">Base: {{ formatTimeFromDate(period.endTimeDate) }}</span>
                                    </div>
                                    <div class="rules-inputs-compact">
                                        <div class="rule-input-group-compact">
                                            <label>No earlier than (Mins)</label>
                                            <p-inputnumber v-model="period.clockOut.noEarlierThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>Allowed shortage (Mins)</label>
                                            <p-inputnumber v-model="period.clockOut.allowedShortage" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>No later than (Mins)</label>
                                            <p-inputnumber v-model="period.clockOut.noLaterThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                    </div>
                                    <div class="rules-summary out">
                                        <i class="pi pi-info-circle"></i>
                                        <span>Window: <strong>{{ computePeriodClockOutWindowDate(period) }}</strong>. Early exit threshold: <strong>{{ computePeriodClockOutEarlyDate(period) }}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Add Period Button (max 2 periods) -->
                        <div class="add-period-btn" :class="{ disabled: shiftForm.periods.length >= 2 }"
                             @click="shiftForm.periods.length < 2 && addPeriod()">
                            <i class="pi pi-plus"></i>
                            <span>{{ shiftForm.periods.length >= 2 ? 'Maximum 2 periods' : 'Add Shift Period' }}</span>
                        </div>
                    </template>

                    <!-- FLEXIBLE SHIFT -->
                    <template v-if="shiftForm.shiftType === 'flexible'">
                        <div class="flexible-shift-form">
                            <div class="flexible-row-compact">
                                <div class="form-group">
                                    <label class="form-label">Required Daily Hours</label>
                                    <p-inputnumber v-model="shiftForm.requiredHours" :min="1" :max="24" showButtons suffix=" hrs"></p-inputnumber>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Valid From</label>
                                    <p-datepicker v-model="shiftForm.validFromDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Valid To</label>
                                    <p-datepicker v-model="shiftForm.validToDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="form-group flexible-checkbox-field">
                                    <div class="checkbox-label-row" v-tooltip.top="'(system calculates clock out after required daily hours)'">
                                        <p-checkbox v-model="shiftForm.activateAutoClockOut" :binary="true" inputId="activateAutoClockOut" class="checkbox-first"></p-checkbox>
                                        <label for="activateAutoClockOut" style="cursor: help; margin: 0 0 0 0.5rem; white-space: nowrap;">Activate Auto Clock Out</label>
                                    </div>
                                </div>
                            </div>
                            <div class="flexible-info-box">
                                <i class="pi pi-info-circle"></i>
                                <span>Employees can punch in any time within the window. Total work time is calculated based on first and last punch.</span>
                            </div>
                            <div class="flexible-info-box warning" style="margin-top: 0.75rem;">
                                <i class="pi pi-exclamation-triangle"></i>
                                <span>If an employee works less than 1 hour of required hours, it will not be labeled as "Less Effort" (e.g., 7 hours of 8 hours is allowed).</span>
                            </div>
                        </div>
                    </template>
                </div>

                <template #footer>
                    <div class="shift-dialog-footer">
                        <p-button label="Cancel" severity="danger" outlined @click="showShiftDialog = false"></p-button>
                        <p-button label="Save Shift Preset" icon="pi pi-check" @click="saveShift"></p-button>
                    </div>
                </template>
            </p-dialog>
            
            </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        // Tab states
        const activeTab = ref('countries');
        const orgTab = ref('departments');
        const gradeTab = ref('mainGrades');
        const costCenterSubTab = ref('main');

        // Dialog states
        const showCountryDialog = ref(false);
        const showHolidayDialog = ref(false);
        const showOrgDialog = ref(false);
        const showGradeDialog = ref(false);
        const showOfficeDialog = ref(false);
        const showBiometricDeviceDialog = ref(false);
        const showCostCenterDialog = ref(false);
        const showSubCostCenterDialog = ref(false);
        const showWorkWeekDialog = ref(false);

        // Edit states
        const editingHoliday = ref(null);
        const editingOrg = ref(null);
        const orgType = ref('department');
        const editingGrade = ref(null);
        const gradeType = ref('main');
        const editingOffice = ref(null);
        const editingBiometricDevice = ref(null);
        const editingCostCenter = ref(null);
        const editingSubCostCenter = ref(null);
        const editingWorkWeek = ref(null);

        // Data
        const countriesOfWork = ref([...StaticData.countriesOfWork]);
        const timezones = ref([...StaticData.timezones]);
        const holidays = ref([...StaticData.holidays]);
        const departments = ref([...StaticData.departments]);
        const sections = ref([...StaticData.sections]);
        const units = ref([...StaticData.units]);
        const teams = ref([...StaticData.teams]);
        const mainGrades = ref([...StaticData.mainGrades]);
        const subGrades = ref([...StaticData.subGrades]);
        const jobTitles = ref([...StaticData.jobTitles]);
        const offices = ref([...StaticData.offices]);
        const biometricDevices = ref([
            { id: 1, name: 'Main Entrance Scanner', description: 'Fingerprint scanner at main entrance', officeId: 1, active: true },
            { id: 2, name: 'Back Door Scanner', description: 'Fingerprint scanner at back entrance', officeId: 1, active: true },
            { id: 3, name: 'Riyadh Reception', description: 'Face recognition device at reception', officeId: 2, active: true },
            { id: 4, name: 'Dubai Main Gate', description: 'Biometric terminal at main gate', officeId: 3, active: false }
        ]);
        const costCenters = ref([...StaticData.costCenters]);
        const subCostCenters = ref([...StaticData.subCostCenters]);
        const workWeeks = ref([...StaticData.workWeeks]);
        const employees = ref([...StaticData.employees]);

        // ========== SHIFT LIBRARY STATE & DATA ==========
        const showShiftDialog = ref(false);
        const editingShift = ref(null);
        const showColorPicker = ref(false);
        const shiftTypeFilter = ref('normal');

        // Shift data
        const allShifts = ref([
            {
                id: 1,
                name: 'Standard Morning',
                shiftType: 'normal',
                startTime: '08:00',
                endTime: '17:00',
                color: '#f59e0b',
                clockIn: { noEarlierThan: 60, allowedDelay: 15, noLaterThan: 120 },
                clockOut: { noEarlierThan: 30, allowedShortage: 0, noLaterThan: 60 },
                active: true
            },
            {
                id: 2,
                name: 'CS Double Shift',
                shiftType: 'template',
                color: '#3b82f6',
                periods: [
                    {
                        startTime: '09:00',
                        endTime: '13:00',
                        clockIn: { noEarlierThan: 30, allowedDelay: 0, noLaterThan: 60 },
                        clockOut: { noEarlierThan: 15, allowedShortage: 0, noLaterThan: 30 }
                    },
                    {
                        startTime: '14:00',
                        endTime: '18:00',
                        clockIn: { noEarlierThan: 30, allowedDelay: 0, noLaterThan: 60 },
                        clockOut: { noEarlierThan: 15, allowedShortage: 0, noLaterThan: 30 }
                    }
                ],
                active: true
            },
            {
                id: 3,
                name: 'Flex Work Schedule',
                shiftType: 'flexible',
                color: '#8b5cf6',
                requiredHours: 8,
                validFrom: '07:00',
                validTo: '22:00',
                active: true
            }
        ]);

        const shiftColors = ['#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#ef4444', '#84cc16'];

        const filteredShifts = computed(() => {
            return allShifts.value.filter(s => s.shiftType === shiftTypeFilter.value);
        });

        // Shift helper functions
        const defaultClockIn = () => ({ noEarlierThan: 60, allowedDelay: 15, noLaterThan: 120 });
        const defaultClockOut = () => ({ noEarlierThan: 30, allowedShortage: 0, noLaterThan: 60 });

        const timeStringToDate = (timeStr) => {
            if (!timeStr) return new Date();
            const [h, m] = timeStr.split(':').map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        };

        const dateToTimeString = (date) => {
            if (!date) return '00:00';
            const h = date.getHours().toString().padStart(2, '0');
            const m = date.getMinutes().toString().padStart(2, '0');
            return `${h}:${m}`;
        };

        const formatTimeFromDate = (date) => {
            if (!date) return '';
            const h = date.getHours();
            const m = date.getMinutes();
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
        };

        const formatTime12 = (timeStr) => {
            if (!timeStr || typeof timeStr !== 'string') return '';
            const parts = timeStr.trim().split(':');
            const h = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) || 0;
            if (isNaN(h) || isNaN(m)) return '';
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
        };

        const calculateDuration = (start, end) => {
            if (!start || !end) return 0;
            const [sh, sm] = start.split(':').map(Number);
            const [eh, em] = end.split(':').map(Number);
            let mins = (eh * 60 + em) - (sh * 60 + sm);
            if (mins < 0) mins += 24 * 60;
            return Math.round(mins / 60);
        };

        const calculateDurationFromDates = (start, end) => {
            if (!start || !end) return 0;
            let mins = (end.getHours() * 60 + end.getMinutes()) - (start.getHours() * 60 + start.getMinutes());
            if (mins < 0) mins += 24 * 60;
            return Math.round(mins / 60);
        };

        const getDurationPercent = (start, end) => {
            const hours = calculateDuration(start, end);
            return Math.min((hours / 12) * 100, 100);
        };

        const addMinutes = (timeStr, mins) => {
            if (!timeStr) return '';
            const parts = timeStr.trim().split(':');
            const h = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) || 0;
            if (isNaN(h)) return '';
            const totalMins = h * 60 + m + mins;
            const normalized = ((totalMins % (24 * 60)) + (24 * 60)) % (24 * 60);
            const newH = Math.floor(normalized / 60);
            const newM = normalized % 60;
            return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
        };

        const subtractMinutes = (timeStr, mins) => {
            return addMinutes(timeStr, -mins);
        };

        const addMinutesToDate = (date, mins) => {
            if (!date) return new Date();
            const d = new Date(date);
            d.setMinutes(d.getMinutes() + mins);
            return d;
        };

        const getShiftTypeLabel = (type) => {
            const labels = { normal: 'NORMAL', template: 'TEMPLATE', flexible: 'FLEXIBLE' };
            return labels[type] || type.toUpperCase();
        };

        // Shift form
        const shiftForm = ref({
            name: '',
            shiftType: 'normal',
            startTimeDate: timeStringToDate('08:00'),
            endTimeDate: timeStringToDate('17:00'),
            startTime: '08:00',
            endTime: '17:00',
            color: '#f59e0b',
            clockIn: defaultClockIn(),
            clockOut: defaultClockOut(),
            periods: [],
            requiredHours: 8,
            validFromDate: timeStringToDate('07:00'),
            validToDate: timeStringToDate('22:00'),
            validFrom: '07:00',
            validTo: '22:00',
            active: true,
            activateAutoClockOut: false
        });

        // Computed shift values
        const computedDuration = computed(() => {
            return calculateDurationFromDates(shiftForm.value.startTimeDate, shiftForm.value.endTimeDate);
        });

        const computedClockInWindow = computed(() => {
            const baseTime = shiftForm.value.startTimeDate;
            if (!baseTime) return '';
            const start = addMinutesToDate(baseTime, -shiftForm.value.clockIn.noEarlierThan);
            const end = addMinutesToDate(baseTime, shiftForm.value.clockIn.noLaterThan);
            return `${formatTimeFromDate(start)} to ${formatTimeFromDate(end)}`;
        });

        const computedClockInLate = computed(() => {
            const baseTime = shiftForm.value.startTimeDate;
            if (!baseTime) return '';
            return formatTimeFromDate(addMinutesToDate(baseTime, shiftForm.value.clockIn.allowedDelay));
        });

        const computedClockOutWindow = computed(() => {
            const baseTime = shiftForm.value.endTimeDate;
            if (!baseTime) return '';
            const start = addMinutesToDate(baseTime, -shiftForm.value.clockOut.noEarlierThan);
            const end = addMinutesToDate(baseTime, shiftForm.value.clockOut.noLaterThan);
            return `${formatTimeFromDate(start)} to ${formatTimeFromDate(end)}`;
        });

        const computedClockOutEarly = computed(() => {
            const baseTime = shiftForm.value.endTimeDate;
            if (!baseTime) return '';
            return formatTimeFromDate(addMinutesToDate(baseTime, -shiftForm.value.clockOut.allowedShortage));
        });

        // Period computed helpers
        const computePeriodClockInWindowDate = (period) => {
            if (!period.startTimeDate) return '';
            const start = addMinutesToDate(period.startTimeDate, -period.clockIn.noEarlierThan);
            const end = addMinutesToDate(period.startTimeDate, period.clockIn.noLaterThan);
            return `${formatTimeFromDate(start)} to ${formatTimeFromDate(end)}`;
        };

        const computePeriodClockInLateDate = (period) => {
            if (!period.startTimeDate) return '';
            return formatTimeFromDate(addMinutesToDate(period.startTimeDate, period.clockIn.allowedDelay));
        };

        const computePeriodClockOutWindowDate = (period) => {
            if (!period.endTimeDate) return '';
            const start = addMinutesToDate(period.endTimeDate, -period.clockOut.noEarlierThan);
            const end = addMinutesToDate(period.endTimeDate, period.clockOut.noLaterThan);
            return `${formatTimeFromDate(start)} to ${formatTimeFromDate(end)}`;
        };

        const computePeriodClockOutEarlyDate = (period) => {
            if (!period.endTimeDate) return '';
            return formatTimeFromDate(addMinutesToDate(period.endTimeDate, -period.clockOut.allowedShortage));
        };

        // Shift dialog methods
        const openShiftDialog = (shift = null) => {
            if (shift) {
                editingShift.value = shift;
                const parsed = JSON.parse(JSON.stringify(shift));
                parsed.startTimeDate = timeStringToDate(parsed.startTime || '08:00');
                parsed.endTimeDate = timeStringToDate(parsed.endTime || '17:00');
                parsed.validFromDate = timeStringToDate(parsed.validFrom || '07:00');
                parsed.validToDate = timeStringToDate(parsed.validTo || '22:00');
                if (parsed.periods) {
                    parsed.periods = parsed.periods.map(p => ({
                        ...p,
                        startTimeDate: timeStringToDate(p.startTime || '08:00'),
                        endTimeDate: timeStringToDate(p.endTime || '17:00'),
                        clockIn: p.clockIn || defaultClockIn(),
                        clockOut: p.clockOut || defaultClockOut()
                    }));
                }
                if (!parsed.clockIn) parsed.clockIn = defaultClockIn();
                if (!parsed.clockOut) parsed.clockOut = defaultClockOut();
                shiftForm.value = parsed;
            } else {
                editingShift.value = null;
                shiftForm.value = {
                    name: '',
                    shiftType: shiftTypeFilter.value,
                    startTimeDate: timeStringToDate('08:00'),
                    endTimeDate: timeStringToDate('17:00'),
                    startTime: '08:00',
                    endTime: '17:00',
                    color: '#f59e0b',
                    clockIn: defaultClockIn(),
                    clockOut: defaultClockOut(),
                    periods: shiftTypeFilter.value === 'template' ? [
                        {
                            startTimeDate: timeStringToDate('08:00'),
                            endTimeDate: timeStringToDate('12:00'),
                            startTime: '08:00',
                            endTime: '12:00',
                            clockIn: defaultClockIn(),
                            clockOut: defaultClockOut()
                        }
                    ] : [],
                    requiredHours: 8,
                    validFromDate: timeStringToDate('07:00'),
                    validToDate: timeStringToDate('22:00'),
                    validFrom: '07:00',
                    validTo: '22:00',
                    active: true,
                    activateAutoClockOut: false
                };
            }
            showShiftDialog.value = true;
        };

        const editShift = (shift) => {
            openShiftDialog(shift);
        };

        const addPeriod = () => {
            if (shiftForm.value.periods.length >= 2) return;
            shiftForm.value.periods.push({
                startTimeDate: timeStringToDate('14:00'),
                endTimeDate: timeStringToDate('18:00'),
                startTime: '14:00',
                endTime: '18:00',
                clockIn: defaultClockIn(),
                clockOut: defaultClockOut()
            });
        };

        const removePeriod = (index) => {
            shiftForm.value.periods.splice(index, 1);
        };

        const saveShift = () => {
            const startTimeStr = dateToTimeString(shiftForm.value.startTimeDate) || shiftForm.value.startTime;
            const endTimeStr = dateToTimeString(shiftForm.value.endTimeDate) || shiftForm.value.endTime;
            const clockInRules = shiftForm.value.clockIn;
            const clockOutRules = shiftForm.value.clockOut;

            const shiftData = {
                name: shiftForm.value.name,
                shiftType: shiftForm.value.shiftType,
                startTime: startTimeStr,
                endTime: endTimeStr,
                color: shiftForm.value.color,
                clockIn: {
                    noEarlierThan: clockInRules.noEarlierThan,
                    allowedDelay: clockInRules.allowedDelay,
                    noLaterThan: clockInRules.noLaterThan,
                    windowStart: subtractMinutes(startTimeStr, clockInRules.noEarlierThan),
                    windowEnd: addMinutes(startTimeStr, clockInRules.noLaterThan),
                    lateThreshold: addMinutes(startTimeStr, clockInRules.allowedDelay)
                },
                clockOut: {
                    noEarlierThan: clockOutRules.noEarlierThan,
                    allowedShortage: clockOutRules.allowedShortage,
                    noLaterThan: clockOutRules.noLaterThan,
                    windowStart: subtractMinutes(endTimeStr, clockOutRules.noEarlierThan),
                    windowEnd: addMinutes(endTimeStr, clockOutRules.noLaterThan),
                    earlyThreshold: subtractMinutes(endTimeStr, clockOutRules.allowedShortage || 0)
                },
                periods: shiftForm.value.periods.map(p => {
                    const pStart = dateToTimeString(p.startTimeDate) || p.startTime;
                    const pEnd = dateToTimeString(p.endTimeDate) || p.endTime;
                    const pClockIn = p.clockIn || clockInRules;
                    const pClockOut = p.clockOut || clockOutRules;
                    return {
                        startTime: pStart,
                        endTime: pEnd,
                        clockIn: {
                            ...pClockIn,
                            windowStart: subtractMinutes(pStart, pClockIn.noEarlierThan),
                            windowEnd: addMinutes(pStart, pClockIn.noLaterThan),
                            lateThreshold: addMinutes(pStart, pClockIn.allowedDelay)
                        },
                        clockOut: {
                            ...pClockOut,
                            windowStart: subtractMinutes(pEnd, pClockOut.noEarlierThan),
                            windowEnd: addMinutes(pEnd, pClockOut.noLaterThan),
                            earlyThreshold: subtractMinutes(pEnd, pClockOut.allowedShortage || 0)
                        }
                    };
                }),
                requiredHours: shiftForm.value.requiredHours,
                validFrom: dateToTimeString(shiftForm.value.validFromDate) || shiftForm.value.validFrom,
                validTo: dateToTimeString(shiftForm.value.validToDate) || shiftForm.value.validTo,
                active: shiftForm.value.active,
                activateAutoClockOut: !!shiftForm.value.activateAutoClockOut
            };

            if (editingShift.value) {
                const index = allShifts.value.findIndex(s => s.id === editingShift.value.id);
                if (index !== -1) {
                    allShifts.value[index] = { ...shiftData, id: editingShift.value.id };
                }
            } else {
                const newId = Math.max(...allShifts.value.map(s => s.id), 0) + 1;
                allShifts.value.push({ ...shiftData, id: newId });
            }
            showShiftDialog.value = false;
        };

        const deleteShift = (shift) => {
            const index = allShifts.value.findIndex(s => s.id === shift.id);
            if (index !== -1) {
                allShifts.value.splice(index, 1);
            }
        };
        // ========== END SHIFT LIBRARY ==========

        const weekDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Available countries for dropdown (not already added)
        const availableCountries = computed(() => {
            const addedCodes = countriesOfWork.value.map(c => c.code);
            return StaticData.allCountries.filter(c => !addedCodes.includes(c.code));
        });

        const countryOptions = computed(() => countriesOfWork.value.map(c => c.name));


        // Forms
        const newCountry = ref({ selected: null, timezone: null });
        const holidayForm = ref({ country: null, countries: [], name: '', startDate: null, endDate: null });
        const orgForm = ref({ name: '', parentId: null });
        const gradeForm = ref({ name: '', description: '', parentId: null });
        const officeForm = ref({ name: '', country: null, googleMapsLink: '', active: true });
        const biometricDeviceForm = ref({ name: '', description: '', officeId: null, active: true });
        const costCenterForm = ref({ name: '' });
        const subCostCenterForm = ref({ code: '', parentCostCenterId: null, country: null, tag: null, active: true });
        const costCenterTagOptions = ref([
            { label: 'COGS', value: 'cogs' },
            { label: 'G&A', value: 'ga' },
            { label: 'Intangible Assets', value: 'intangible' }
        ]);
        const workWeekForm = ref({ 
            name: '', 
            days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false },
            active: true 
        });

        // Helper functions
        const getDepartmentName = (id) => departments.value.find(d => d.id === id)?.name || '';
        const getSectionName = (id) => sections.value.find(s => s.id === id)?.name || '';
        const getUnitName = (id) => units.value.find(u => u.id === id)?.name || '';
        const getMainGradeName = (id) => mainGrades.value.find(g => g.id === id)?.name || '';
        const getSubGradeName = (id) => subGrades.value.find(g => g.id === id)?.name || '';

        const getSectionCount = (deptId) => sections.value.filter(s => s.departmentId === deptId).length;
        const getUnitCount = (sectionId) => units.value.filter(u => u.sectionId === sectionId).length;
        const getTeamCount = (unitId) => teams.value.filter(t => t.unitId === unitId).length;
        const getSubGradeCount = (mainGradeId) => subGrades.value.filter(s => s.mainGradeId === mainGradeId).length;
        const getJobTitleCount = (mainGradeId) => jobTitles.value.filter(j => j.mainGradeId === mainGradeId).length;

        // Dialog titles
        const orgDialogTitle = computed(() => {
            const prefix = editingOrg.value ? 'Edit' : 'Add';
            const types = { department: 'Department', section: 'Section', unit: 'Unit', team: 'Team' };
            return `${prefix} ${types[orgType.value]}`;
        });

        const gradeDialogTitle = computed(() => {
            const prefix = editingGrade.value ? 'Edit' : 'Add';
            const types = { main: 'Main Grade', sub: 'Sub Grade', jobTitle: 'Job Title' };
            return `${prefix} ${types[gradeType.value]}`;
        });

        // Country methods
        const addCountry = () => {
            if (newCountry.value.selected && newCountry.value.timezone) {
                const maxId = Math.max(...countriesOfWork.value.map(c => c.id), 0);
                countriesOfWork.value.push({
                    id: maxId + 1,
                    name: newCountry.value.selected.name,
                    code: newCountry.value.selected.code,
                    timezone: newCountry.value.timezone,
                    logo: newCountry.value.selected.flag,
                    active: true
                });
                newCountry.value = { selected: null, timezone: null };
                showCountryDialog.value = false;
            }
        };

        // Holiday methods
        const formatDate = (date) => {
            if (!date) return '';
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        };

        const saveHoliday = () => {
            if (holidayForm.value.name && holidayForm.value.startDate) {
                const baseData = {
                    name: holidayForm.value.name,
                    startDate: formatDate(holidayForm.value.startDate),
                    endDate: formatDate(holidayForm.value.endDate || holidayForm.value.startDate),
                    year: holidayForm.value.startDate.getFullYear()
                };
                
                if (editingHoliday.value) {
                    if (!holidayForm.value.country) return;
                    const idx = holidays.value.findIndex(h => h.id === editingHoliday.value.id);
                    if (idx !== -1) holidays.value[idx] = { ...baseData, country: holidayForm.value.country, id: editingHoliday.value.id };
                } else {
                    if (!holidayForm.value.countries || holidayForm.value.countries.length === 0) return;
                    let maxId = Math.max(...holidays.value.map(h => h.id), 0);
                    holidayForm.value.countries.forEach(country => {
                        maxId++;
                        holidays.value.push({ ...baseData, country: country, id: maxId });
                    });
                }
                showHolidayDialog.value = false;
                editingHoliday.value = null;
                holidayForm.value = { country: null, countries: [], name: '', startDate: null, endDate: null };
            }
        };

        const editHoliday = (holiday) => {
            editingHoliday.value = holiday;
            holidayForm.value = { 
                country: holiday.country,
                countries: [],
                name: holiday.name, 
                startDate: null, 
                endDate: null 
            };
            showHolidayDialog.value = true;
        };

        const deleteHoliday = (id) => {
            holidays.value = holidays.value.filter(h => h.id !== id);
        };

        // Organization methods
        const openOrgDialog = (type) => {
            orgType.value = type;
            editingOrg.value = null;
            orgForm.value = { name: '', parentId: null };
            showOrgDialog.value = true;
        };

        const editOrg = (type, item) => {
            orgType.value = type;
            editingOrg.value = item;
            orgForm.value = { 
                name: item.name, 
                parentId: item.departmentId || item.sectionId || item.unitId || null 
            };
            showOrgDialog.value = true;
        };

        const saveOrg = () => {
            const data = { name: orgForm.value.name, employeeCount: 0 };
            const lists = { department: departments, section: sections, unit: units, team: teams };
            const parentKeys = { section: 'departmentId', unit: 'sectionId', team: 'unitId' };
            
            if (orgType.value !== 'department') data[parentKeys[orgType.value]] = orgForm.value.parentId;
            
            if (editingOrg.value) {
                const idx = lists[orgType.value].value.findIndex(i => i.id === editingOrg.value.id);
                if (idx !== -1) lists[orgType.value].value[idx] = { ...lists[orgType.value].value[idx], ...data };
            } else {
                const maxId = Math.max(...lists[orgType.value].value.map(i => i.id), 0);
                lists[orgType.value].value.push({ ...data, id: maxId + 1 });
            }
            showOrgDialog.value = false;
        };

        const deleteOrg = (type, id) => {
            const lists = { department: departments, section: sections, unit: units, team: teams };
            lists[type].value = lists[type].value.filter(i => i.id !== id);
        };

        // Grade methods
        const openGradeDialog = (type) => {
            gradeType.value = type;
            editingGrade.value = null;
            gradeForm.value = { name: '', description: '', parentId: null };
            showGradeDialog.value = true;
        };

        const editGrade = (type, item) => {
            gradeType.value = type;
            editingGrade.value = item;
            gradeForm.value = { 
                name: item.name, 
                description: item.description || '',
                parentId: item.mainGradeId || null 
            };
            showGradeDialog.value = true;
        };

        const saveGrade = () => {
            const data = { name: gradeForm.value.name, description: gradeForm.value.description };
            const lists = { main: mainGrades, sub: subGrades, jobTitle: jobTitles };
            
            // Both sub grades and job titles are children of main grade
            if (gradeType.value !== 'main') data.mainGradeId = gradeForm.value.parentId;
            
            if (editingGrade.value) {
                const idx = lists[gradeType.value].value.findIndex(i => i.id === editingGrade.value.id);
                if (idx !== -1) lists[gradeType.value].value[idx] = { ...lists[gradeType.value].value[idx], ...data };
            } else {
                const maxId = Math.max(...lists[gradeType.value].value.map(i => i.id), 0);
                lists[gradeType.value].value.push({ ...data, id: maxId + 1 });
            }
            showGradeDialog.value = false;
        };

        const deleteGrade = (type, id) => {
            const lists = { main: mainGrades, sub: subGrades, jobTitle: jobTitles };
            lists[type].value = lists[type].value.filter(i => i.id !== id);
        };

        // Office methods
        const openOfficeDialog = () => {
            editingOffice.value = null;
            officeForm.value = { name: '', country: null, googleMapsLink: '', active: true };
            showOfficeDialog.value = true;
        };

        const editOffice = (office) => {
            editingOffice.value = office;
            officeForm.value = { ...office };
            showOfficeDialog.value = true;
        };

        const saveOffice = () => {
            if (editingOffice.value) {
                const idx = offices.value.findIndex(o => o.id === editingOffice.value.id);
                if (idx !== -1) offices.value[idx] = { ...officeForm.value, id: editingOffice.value.id };
            } else {
                const maxId = Math.max(...offices.value.map(o => o.id), 0);
                offices.value.push({ ...officeForm.value, id: maxId + 1 });
            }
            showOfficeDialog.value = false;
        };

        const deleteOffice = (id) => {
            offices.value = offices.value.filter(o => o.id !== id);
        };

        // Biometric Device methods
        const getOfficeName = (officeId) => {
            const office = offices.value.find(o => o.id === officeId);
            return office ? office.name : '—';
        };

        const openBiometricDeviceDialog = () => {
            editingBiometricDevice.value = null;
            biometricDeviceForm.value = { name: '', description: '', officeId: null, active: true };
            showBiometricDeviceDialog.value = true;
        };

        const editBiometricDevice = (device) => {
            editingBiometricDevice.value = device;
            biometricDeviceForm.value = { ...device };
            showBiometricDeviceDialog.value = true;
        };

        const saveBiometricDevice = () => {
            if (editingBiometricDevice.value) {
                const idx = biometricDevices.value.findIndex(d => d.id === editingBiometricDevice.value.id);
                if (idx !== -1) biometricDevices.value[idx] = { ...biometricDeviceForm.value, id: editingBiometricDevice.value.id };
            } else {
                const maxId = Math.max(...biometricDevices.value.map(d => d.id), 0);
                biometricDevices.value.push({ ...biometricDeviceForm.value, id: maxId + 1 });
            }
            showBiometricDeviceDialog.value = false;
        };

        const deleteBiometricDevice = (id) => {
            biometricDevices.value = biometricDevices.value.filter(d => d.id !== id);
        };

        // Cost Center methods
        const openCostCenterDialog = () => {
            editingCostCenter.value = null;
            costCenterForm.value = { name: '' };
            showCostCenterDialog.value = true;
        };

        const editCostCenter = (cc) => {
            editingCostCenter.value = cc;
            costCenterForm.value = { name: cc.name };
            showCostCenterDialog.value = true;
        };

        const saveCostCenter = () => {
            if (editingCostCenter.value) {
                const idx = costCenters.value.findIndex(c => c.id === editingCostCenter.value.id);
                if (idx !== -1) costCenters.value[idx] = { ...costCenters.value[idx], ...costCenterForm.value };
            } else {
                const maxId = Math.max(...costCenters.value.map(c => c.id), 0);
                costCenters.value.push({ ...costCenterForm.value, id: maxId + 1, headCount: 0 });
            }
            showCostCenterDialog.value = false;
        };

        const deleteCostCenter = (id) => {
            costCenters.value = costCenters.value.filter(c => c.id !== id);
        };

        const getCostCenterTagLabel = (tag) => {
            const tagMap = { cogs: 'COGS', ga: 'G&A', intangible: 'Intangible Assets' };
            return tagMap[tag] || tag;
        };

        // Sub Cost Center methods
        const openSubCostCenterDialog = () => {
            editingSubCostCenter.value = null;
            subCostCenterForm.value = { code: '', parentCostCenterId: null, country: null, tag: null, active: true };
            showSubCostCenterDialog.value = true;
        };

        const editSubCostCenter = (scc) => {
            editingSubCostCenter.value = scc;
            subCostCenterForm.value = { 
                code: scc.code, 
                parentCostCenterId: scc.parentCostCenterId, 
                country: scc.country || null,
                tag: scc.tag || null, 
                active: scc.active 
            };
            showSubCostCenterDialog.value = true;
        };

        const saveSubCostCenter = () => {
            if (editingSubCostCenter.value) {
                const idx = subCostCenters.value.findIndex(c => c.id === editingSubCostCenter.value.id);
                if (idx !== -1) subCostCenters.value[idx] = { ...subCostCenters.value[idx], ...subCostCenterForm.value };
            } else {
                const maxId = Math.max(...subCostCenters.value.map(c => c.id), 0);
                subCostCenters.value.push({ ...subCostCenterForm.value, id: maxId + 1, headCount: 0 });
            }
            showSubCostCenterDialog.value = false;
        };

        const deleteSubCostCenter = (id) => {
            subCostCenters.value = subCostCenters.value.filter(c => c.id !== id);
        };

        const getSubCostCenterCount = (parentId) => {
            return subCostCenters.value.filter(scc => scc.parentCostCenterId === parentId).length;
        };

        const getParentCostCenterName = (parentId) => {
            const parent = costCenters.value.find(cc => cc.id === parentId);
            return parent ? parent.name : 'Unknown';
        };

        // Work Week methods
        const openWorkWeekDialog = () => {
            editingWorkWeek.value = null;
            workWeekForm.value = { 
                name: '', 
                days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false },
                active: true 
            };
            showWorkWeekDialog.value = true;
        };

        const editWorkWeek = (ww) => {
            editingWorkWeek.value = ww;
            workWeekForm.value = { name: ww.name, days: { ...ww.days }, active: ww.active };
            showWorkWeekDialog.value = true;
        };

        const saveWorkWeek = () => {
            const totalDays = Object.values(workWeekForm.value.days).filter(v => v).length;
            if (editingWorkWeek.value) {
                const idx = workWeeks.value.findIndex(w => w.id === editingWorkWeek.value.id);
                if (idx !== -1) workWeeks.value[idx] = { ...workWeekForm.value, id: editingWorkWeek.value.id, totalDays };
            } else {
                const maxId = Math.max(...workWeeks.value.map(w => w.id), 0);
                workWeeks.value.push({ ...workWeekForm.value, id: maxId + 1, totalDays });
            }
            showWorkWeekDialog.value = false;
        };

        const deleteWorkWeek = (id) => {
            workWeeks.value = workWeeks.value.filter(w => w.id !== id);
        };

        return {
            // Tabs
            activeTab, orgTab, gradeTab, costCenterSubTab,
            // Dialogs
            showCountryDialog, showHolidayDialog, showOrgDialog, showGradeDialog,
            showOfficeDialog, showBiometricDeviceDialog, showCostCenterDialog, showSubCostCenterDialog, showWorkWeekDialog, showShiftDialog,
            // Edit states
            editingHoliday, editingOrg, orgType, editingGrade, gradeType,
            editingOffice, editingBiometricDevice, editingCostCenter, editingSubCostCenter, editingWorkWeek, editingShift,
            // Data
            countriesOfWork, timezones, holidays, departments, sections, units, teams,
            mainGrades, subGrades, jobTitles, offices, biometricDevices, costCenters, subCostCenters,
            workWeeks, employees,
            weekDaysList, availableCountries, countryOptions,
            // Shift Library data
            allShifts, filteredShifts, shiftTypeFilter, shiftForm, shiftColors, showColorPicker,
            // Forms
            newCountry, holidayForm, orgForm, gradeForm, officeForm, biometricDeviceForm, costCenterForm, subCostCenterForm, costCenterTagOptions,
            workWeekForm,
            // Helpers
            getCostCenterTagLabel, getSubCostCenterCount, getParentCostCenterName,
            getDepartmentName, getSectionName, getUnitName, getMainGradeName, getSubGradeName,
            getSectionCount, getUnitCount, getTeamCount, getSubGradeCount, getJobTitleCount,
            // Shift helpers
            formatTime12, formatTimeFromDate, calculateDuration, calculateDurationFromDates,
            getDurationPercent, addMinutes, subtractMinutes, getShiftTypeLabel,
            // Shift computed
            computedDuration, computedClockInWindow, computedClockInLate,
            computedClockOutWindow, computedClockOutEarly,
            computePeriodClockInWindowDate, computePeriodClockInLateDate,
            computePeriodClockOutWindowDate, computePeriodClockOutEarlyDate,
            // Dialog titles
            orgDialogTitle, gradeDialogTitle,
            // Methods
            addCountry, saveHoliday, editHoliday, deleteHoliday,
            openOrgDialog, editOrg, saveOrg, deleteOrg,
            openGradeDialog, editGrade, saveGrade, deleteGrade,
            openOfficeDialog, editOffice, saveOffice, deleteOffice,
            openBiometricDeviceDialog, editBiometricDevice, saveBiometricDevice, deleteBiometricDevice, getOfficeName,
            openCostCenterDialog, editCostCenter, saveCostCenter, deleteCostCenter,
            openSubCostCenterDialog, editSubCostCenter, saveSubCostCenter, deleteSubCostCenter,
            openWorkWeekDialog, editWorkWeek, saveWorkWeek, deleteWorkWeek,
            // Shift methods
            openShiftDialog, editShift, saveShift, deleteShift, addPeriod, removePeriod,
        };
    }
};

window.CompanySettingsComponent = CompanySettingsComponent;
