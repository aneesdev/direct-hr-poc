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
                        <p-tab value="costcenters" @click="activeTab = 'costcenters'">Cost Centers</p-tab>
                        <p-tab value="documents" @click="activeTab = 'documents'">Documents</p-tab>
                        <p-tab value="workweeks" @click="activeTab = 'workweeks'">Work Weeks</p-tab>
                        <p-tab value="attendance" @click="activeTab = 'attendance'">Attendance Settings</p-tab>
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
                        
                        <!-- Cost Centers Tab -->
                        <p-tabpanel value="costcenters">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-wallet"></i>
                                        Cost Center Management
                                    </div>
                                    <div class="card-subtitle">Manage organization cost centers with head counts</div>
                                </div>
                                <p-button label="Add Cost Center" icon="pi pi-plus" @click="openCostCenterDialog()"></p-button>
                            </div>
                            
                            <p-datatable :value="costCenters" striped-rows>
                                <p-column field="code" header="Code"></p-column>
                                <p-column field="name" header="Name"></p-column>
                                <p-column header="Head Count">
                                    <template #body="slotProps">
                                        <p-tag :value="slotProps.data.headCount + ' employees'" :severity="slotProps.data.headCount > 0 ? 'info' : 'secondary'"></p-tag>
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
                                        <button class="action-btn edit" @click="editCostCenter(slotProps.data)"><i class="pi pi-pencil"></i></button>
                                        <button class="action-btn delete" @click="deleteCostCenter(slotProps.data.id)"><i class="pi pi-trash"></i></button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                        
                        <!-- Documents Tab -->
                        <p-tabpanel value="documents">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-file"></i>
                                        Employee Documents
                                    </div>
                                    <div class="card-subtitle">Manage document types and employee documents</div>
                                </div>
                                <div style="display: flex; gap: 0.5rem;">
                                    <p-button label="Add Document" icon="pi pi-plus" @click="showAddDocDialog = true"></p-button>
                                    <p-button label="Document Types" icon="pi pi-cog" outlined @click="showDocTypeDialog = true"></p-button>
                                </div>
                            </div>
                            
                            <!-- Document Stats -->
                            <div class="stats-grid" style="margin-bottom: 1rem;">
                                <div class="stat-card">
                                    <div class="stat-icon green">
                                        <i class="pi pi-check-circle"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ validDocsCount }}</div>
                                        <div class="stat-label">Valid Documents</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon orange">
                                        <i class="pi pi-exclamation-triangle"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ expiredDocsCount }}</div>
                                        <div class="stat-label">Expired</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Documents Table -->
                            <p-datatable :value="documents" striped-rows>
                                <p-column header="Employee">
                                    <template #body="slotProps">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <img :src="slotProps.data.employeeAvatar" :alt="slotProps.data.employeeName" style="width: 32px; height: 32px; border-radius: 50%;">
                                            <span>{{ slotProps.data.employeeName }}</span>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column field="documentType" header="Document Type"></p-column>
                                <p-column header="Expiry Date">
                                    <template #body="slotProps">
                                        <div>
                                            <div>{{ slotProps.data.expiryDate || 'N/A' }}</div>
                                            <div v-if="slotProps.data.expiryDate" :style="{ fontSize: '0.8rem', color: slotProps.data.status === 'expired' ? '#ef4444' : 'var(--text-color-secondary)' }">
                                                {{ slotProps.data.expiresIn }}
                                            </div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Status">
                                    <template #body="slotProps">
                                        <span class="status-tag" :class="slotProps.data.status === 'valid' ? 'active' : 'inactive'">
                                            {{ slotProps.data.status === 'valid' ? 'Valid' : 'Expired' }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column header="Actions" style="width: 120px">
                                    <template #body="slotProps">
                                        <button class="action-btn" title="View"><i class="pi pi-eye"></i></button>
                                        <button class="action-btn edit" title="Update Expiry" @click="updateDocExpiry(slotProps.data)"><i class="pi pi-calendar"></i></button>
                                    </template>
                                </p-column>
                            </p-datatable>
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
                        <p-select v-model="holidayForm.country" :options="countryOptions" placeholder="Select country" style="width: 100%;"></p-select>
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
            
            <!-- Cost Center Dialog -->
            <p-dialog v-model:visible="showCostCenterDialog" :header="editingCostCenter ? 'Edit Cost Center' : 'Add Cost Center'" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Code <span class="required">*</span></label>
                        <p-inputtext v-model="costCenterForm.code" placeholder="e.g. CC-001" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Name <span class="required">*</span></label>
                        <p-inputtext v-model="costCenterForm.name" placeholder="Enter cost center name" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="costCenterForm.active"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Active</label>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showCostCenterDialog = false"></p-button>
                    <p-button :label="editingCostCenter ? 'Update' : 'Save'" @click="saveCostCenter"></p-button>
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
            
            <!-- Add Document Dialog -->
            <p-dialog v-model:visible="showAddDocDialog" header="Add Employee Document" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Employee <span class="required">*</span></label>
                        <p-select v-model="addDocForm.employeeId" :options="employees" optionLabel="firstName" optionValue="id" placeholder="Select employee" style="width: 100%;">
                            <template #option="slotProps">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <img :src="slotProps.option.avatar" style="width: 24px; height: 24px; border-radius: 50%;">
                                    <span>{{ slotProps.option.firstName }} {{ slotProps.option.familyName }}</span>
                                </div>
                            </template>
                        </p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Document Type <span class="required">*</span></label>
                        <p-select v-model="addDocForm.documentType" :options="documentTypes" optionLabel="name" optionValue="name" placeholder="Select type" style="width: 100%;"></p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Expiry Date</label>
                        <p-datepicker v-model="addDocForm.expiryDate" dateFormat="dd/mm/yy" style="width: 100%;"></p-datepicker>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Upload Document</label>
                        <p-fileupload mode="basic" accept="image/*,application/pdf" :maxFileSize="5000000" chooseLabel="Choose File"></p-fileupload>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showAddDocDialog = false"></p-button>
                    <p-button label="Save" @click="saveDocument"></p-button>
                </template>
            </p-dialog>
            
            <!-- Update Document Expiry Dialog -->
            <p-dialog v-model:visible="showUpdateExpiryDialog" header="Update Expiry Date" :modal="true" :style="{ width: '400px' }">
                <div class="form-group">
                    <label class="form-label">New Expiry Date <span class="required">*</span></label>
                    <p-datepicker v-model="updateExpiryForm.expiryDate" dateFormat="dd/mm/yy" style="width: 100%;"></p-datepicker>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showUpdateExpiryDialog = false"></p-button>
                    <p-button label="Update" @click="saveExpiryUpdate"></p-button>
                </template>
            </p-dialog>
            
            <!-- Document Type Dialog -->
            <p-dialog v-model:visible="showDocTypeDialog" header="Document Types" :modal="true" :style="{ width: '600px' }">
                <p-datatable :value="documentTypes" striped-rows>
                    <p-column field="name" header="Name"></p-column>
                    <p-column header="Mandatory">
                        <template #body="slotProps">
                            <i :class="slotProps.data.mandatory ? 'pi pi-check-circle' : 'pi pi-times-circle'" 
                               :style="{ color: slotProps.data.mandatory ? '#22c55e' : '#94a3b8' }"></i>
                        </template>
                    </p-column>
                    <p-column header="Has Expiry">
                        <template #body="slotProps">
                            <i :class="slotProps.data.hasExpiry ? 'pi pi-check-circle' : 'pi pi-times-circle'" 
                               :style="{ color: slotProps.data.hasExpiry ? '#22c55e' : '#94a3b8' }"></i>
                        </template>
                    </p-column>
                </p-datatable>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        // Tab states
        const activeTab = ref('countries');
        const orgTab = ref('departments');
        const gradeTab = ref('mainGrades');

        // Dialog states
        const showCountryDialog = ref(false);
        const showHolidayDialog = ref(false);
        const showOrgDialog = ref(false);
        const showGradeDialog = ref(false);
        const showOfficeDialog = ref(false);
        const showCostCenterDialog = ref(false);
        const showWorkWeekDialog = ref(false);
        const showAddDocDialog = ref(false);
        const showUpdateExpiryDialog = ref(false);
        const showDocTypeDialog = ref(false);

        // Edit states
        const editingHoliday = ref(null);
        const editingOrg = ref(null);
        const orgType = ref('department');
        const editingGrade = ref(null);
        const gradeType = ref('main');
        const editingOffice = ref(null);
        const editingCostCenter = ref(null);
        const editingWorkWeek = ref(null);
        const editingDoc = ref(null);

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
        const costCenters = ref([...StaticData.costCenters]);
        const documentTypes = ref([...StaticData.documentTypes]);
        const documents = ref([...StaticData.documents]);
        const workWeeks = ref([...StaticData.workWeeks]);
        const employees = ref([...StaticData.employees]);
        const attendanceSettings = ref({ ...StaticData.attendanceSettings });

        const weekDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Available countries for dropdown (not already added)
        const availableCountries = computed(() => {
            const addedCodes = countriesOfWork.value.map(c => c.code);
            return StaticData.allCountries.filter(c => !addedCodes.includes(c.code));
        });

        const countryOptions = computed(() => countriesOfWork.value.map(c => c.name));

        // Document counts
        const validDocsCount = computed(() => documents.value.filter(d => d.status === 'valid').length);
        const expiredDocsCount = computed(() => documents.value.filter(d => d.status === 'expired').length);

        // Forms
        const newCountry = ref({ selected: null, timezone: null });
        const holidayForm = ref({ country: null, name: '', startDate: null, endDate: null });
        const orgForm = ref({ name: '', parentId: null });
        const gradeForm = ref({ name: '', description: '', parentId: null });
        const officeForm = ref({ name: '', country: null, googleMapsLink: '', active: true });
        const costCenterForm = ref({ code: '', name: '', active: true });
        const workWeekForm = ref({ 
            name: '', 
            days: { Sunday: false, Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false },
            active: true 
        });
        const addDocForm = ref({ employeeId: null, documentType: null, expiryDate: null });
        const updateExpiryForm = ref({ docId: null, expiryDate: null });

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
            if (holidayForm.value.country && holidayForm.value.name && holidayForm.value.startDate) {
                const data = {
                    country: holidayForm.value.country,
                    name: holidayForm.value.name,
                    startDate: formatDate(holidayForm.value.startDate),
                    endDate: formatDate(holidayForm.value.endDate || holidayForm.value.startDate),
                    year: holidayForm.value.startDate.getFullYear()
                };
                if (editingHoliday.value) {
                    const idx = holidays.value.findIndex(h => h.id === editingHoliday.value.id);
                    if (idx !== -1) holidays.value[idx] = { ...data, id: editingHoliday.value.id };
                } else {
                    const maxId = Math.max(...holidays.value.map(h => h.id), 0);
                    holidays.value.push({ ...data, id: maxId + 1 });
                }
                showHolidayDialog.value = false;
                editingHoliday.value = null;
                holidayForm.value = { country: null, name: '', startDate: null, endDate: null };
            }
        };

        const editHoliday = (holiday) => {
            editingHoliday.value = holiday;
            holidayForm.value = { 
                country: holiday.country, 
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

        // Cost Center methods
        const openCostCenterDialog = () => {
            editingCostCenter.value = null;
            costCenterForm.value = { code: '', name: '', active: true };
            showCostCenterDialog.value = true;
        };

        const editCostCenter = (cc) => {
            editingCostCenter.value = cc;
            costCenterForm.value = { code: cc.code, name: cc.name, active: cc.active };
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

        // Document methods
        const saveDocument = () => {
            const emp = employees.value.find(e => e.id === addDocForm.value.employeeId);
            if (emp && addDocForm.value.documentType) {
                const maxId = Math.max(...documents.value.map(d => d.id), 0);
                documents.value.push({
                    id: maxId + 1,
                    employeeId: emp.id,
                    employeeName: `${emp.firstName} ${emp.familyName}`,
                    employeeAvatar: emp.avatar,
                    documentType: addDocForm.value.documentType,
                    isPrimary: false,
                    expiryDate: addDocForm.value.expiryDate ? formatDate(addDocForm.value.expiryDate) : null,
                    expiresIn: 'N/A',
                    status: 'valid',
                    lastUpdated: formatDate(new Date())
                });
                showAddDocDialog.value = false;
                addDocForm.value = { employeeId: null, documentType: null, expiryDate: null };
            }
        };

        const updateDocExpiry = (doc) => {
            editingDoc.value = doc;
            updateExpiryForm.value = { docId: doc.id, expiryDate: null };
            showUpdateExpiryDialog.value = true;
        };

        const saveExpiryUpdate = () => {
            const idx = documents.value.findIndex(d => d.id === updateExpiryForm.value.docId);
            if (idx !== -1 && updateExpiryForm.value.expiryDate) {
                documents.value[idx].expiryDate = formatDate(updateExpiryForm.value.expiryDate);
                documents.value[idx].status = 'valid';
                documents.value[idx].lastUpdated = formatDate(new Date());
            }
            showUpdateExpiryDialog.value = false;
        };

        return {
            // Tabs
            activeTab, orgTab, gradeTab,
            // Dialogs
            showCountryDialog, showHolidayDialog, showOrgDialog, showGradeDialog,
            showOfficeDialog, showCostCenterDialog, showWorkWeekDialog,
            showAddDocDialog, showUpdateExpiryDialog, showDocTypeDialog,
            // Edit states
            editingHoliday, editingOrg, orgType, editingGrade, gradeType,
            editingOffice, editingCostCenter, editingWorkWeek,
            // Data
            countriesOfWork, timezones, holidays, departments, sections, units, teams,
            mainGrades, subGrades, jobTitles, offices, costCenters, documentTypes, documents,
            workWeeks, employees, attendanceSettings,
            weekDaysList, availableCountries, countryOptions,
            // Counts
            validDocsCount, expiredDocsCount,
            // Forms
            newCountry, holidayForm, orgForm, gradeForm, officeForm, costCenterForm,
            workWeekForm, addDocForm, updateExpiryForm,
            // Helpers
            getDepartmentName, getSectionName, getUnitName, getMainGradeName, getSubGradeName,
            getSectionCount, getUnitCount, getTeamCount, getSubGradeCount, getJobTitleCount,
            // Dialog titles
            orgDialogTitle, gradeDialogTitle,
            // Methods
            addCountry, saveHoliday, editHoliday, deleteHoliday,
            openOrgDialog, editOrg, saveOrg, deleteOrg,
            openGradeDialog, editGrade, saveGrade, deleteGrade,
            openOfficeDialog, editOffice, saveOffice, deleteOffice,
            openCostCenterDialog, editCostCenter, saveCostCenter, deleteCostCenter,
            openWorkWeekDialog, editWorkWeek, saveWorkWeek, deleteWorkWeek,
            saveDocument, updateDocExpiry, saveExpiryUpdate
        };
    }
};

window.CompanySettingsComponent = CompanySettingsComponent;
