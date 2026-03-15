/**
 * Employee Directory Component
 * Directory page with Grid, List, and Regional views
 */

const EmployeeDirectoryComponent = {
    template: `
        <div class="employee-directory-page">
            <!-- Header -->
            <div class="directory-header">
                <div class="directory-header-left">
                    <i class="pi pi-sitemap header-icon"></i>
                    <div>
                        <h1>Employee Directory</h1>
                        <p>Find and connect with your colleagues instantly.</p>
                    </div>
                </div>
                <div class="directory-view-toggle">
                    <button class="view-btn" :class="{ active: currentView === 'grid' }" @click="currentView = 'grid'">
                        <i class="pi pi-table"></i> Grid
                    </button>
                    <button class="view-btn" :class="{ active: currentView === 'list' }" @click="currentView = 'list'">
                        <i class="pi pi-bars"></i> List
                    </button>
                    <button class="view-btn" :class="{ active: currentView === 'regional' }" @click="currentView = 'regional'">
                        <i class="pi pi-sitemap"></i> Regional
                    </button>
                </div>
            </div>

            <!-- Search & Filters -->
            <div class="card" style="margin-bottom: 1.5rem; padding: 1rem 1.25rem;">
                <div class="directory-filters-grid">
                    <div class="filter-row">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"></i>
                            <p-inputtext v-model="searchQuery" placeholder="Search..." style="width: 150px;"></p-inputtext>
                        </span>
                        <p-select v-model="selectedEntity" :options="entityOptions" optionLabel="name" optionValue="value"
                                  placeholder="Entity" showClear style="width: 120px;"></p-select>
                        <p-select v-model="selectedGrade" :options="gradeOptions" optionLabel="name" optionValue="value"
                                  placeholder="Grade" showClear style="width: 120px;"></p-select>
                        <p-select v-model="selectedLocation" :options="locationOptions" optionLabel="name" optionValue="value"
                                  placeholder="Location" showClear style="width: 130px;"></p-select>
                        <p-select v-model="selectedDepartment" :options="departmentOptions" optionLabel="name" optionValue="value"
                                  placeholder="Department" showClear style="width: 140px;" @change="onDepartmentChange"></p-select>
                        <p-select v-model="selectedSection" :options="filteredSections" optionLabel="name" optionValue="id"
                                  placeholder="Section" showClear style="width: 130px;" :disabled="!selectedDepartment" @change="onSectionChange"></p-select>
                        <p-select v-model="selectedUnit" :options="filteredUnits" optionLabel="name" optionValue="id"
                                  placeholder="Unit" showClear style="width: 120px;" :disabled="!selectedSection" @change="onUnitChange"></p-select>
                        <p-select v-model="selectedTeam" :options="filteredTeams" optionLabel="name" optionValue="id"
                                  placeholder="Team" showClear style="width: 120px;" :disabled="!selectedUnit"></p-select>
                    </div>
                    <div class="filter-actions-row">
                        <p-button label="Apply" icon="pi pi-check" @click="applyFilters" size="small"></p-button>
                        <p-button label="Reset" icon="pi pi-refresh" outlined @click="clearFilters" size="small" v-if="hasActiveFilters"></p-button>
                    </div>
                </div>
            </div>

            <!-- Grid View -->
            <div v-if="currentView === 'grid'" class="directory-grid">
                <div v-for="emp in filteredEmployees" :key="emp.id" class="employee-card">
                    <div class="emp-card-header">
                        <div class="emp-avatar-wrapper">
                            <img :src="emp.avatar" :alt="emp.name" class="emp-avatar">
                            <span class="emp-status-dot" :class="emp.status"></span>
                        </div>
                        <div class="emp-badges">
                            <span class="emp-grade-badge" :class="emp.gradeClass">{{ emp.grade }}</span>
                            <span class="emp-id">ID: {{ emp.id }}</span>
                        </div>
                    </div>
                    <div class="emp-card-body">
                        <h3 class="emp-name">{{ emp.name }}</h3>
                        <p class="emp-position">{{ emp.position }}</p>
                        <div class="emp-details">
                            <div class="emp-detail-row">
                                <i class="pi pi-building"></i>
                                <span>{{ emp.department }}</span>
                            </div>
                            <div class="emp-detail-row">
                                <i class="pi pi-map-marker"></i>
                                <span>{{ emp.branch }}</span>
                            </div>
                            <div class="emp-detail-row">
                                <i class="pi pi-envelope"></i>
                                <span>{{ emp.email }}</span>
                            </div>
                            <div class="emp-detail-row">
                                <i class="pi pi-phone"></i>
                                <span>{{ emp.extension }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="emp-card-actions">
                        <button class="action-btn-primary disabled" disabled v-tooltip.top="'Coming Soon'"><i class="pi pi-comments"></i> CHAT</button>
                        <button class="action-btn-secondary disabled" disabled v-tooltip.top="'Coming Soon'"><i class="pi pi-video"></i> VIDEO</button>
                    </div>
                </div>
            </div>

            <!-- List View -->
            <div v-if="currentView === 'list'" class="directory-list card">
                <table class="directory-table">
                    <thead>
                        <tr>
                            <th>ID / EMPLOYEE</th>
                            <th>GRADE/DEPT</th>
                            <th>BRANCH</th>
                            <th>CONTACT INFO</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="emp in filteredEmployees" :key="emp.id">
                            <td>
                                <div class="list-employee">
                                    <span class="list-emp-id">#{{ emp.id }}</span>
                                    <img :src="emp.avatar" :alt="emp.name" class="list-emp-avatar">
                                    <div class="list-emp-info">
                                        <span class="list-emp-name">{{ emp.name }}</span>
                                        <span class="list-emp-position">{{ emp.position }}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="list-grade-dept">
                                    <span class="list-grade" :class="emp.gradeClass">{{ emp.grade }}</span>
                                    <span class="list-dept">{{ emp.department }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="list-branch">
                                    <div><i class="pi pi-map-marker"></i> {{ emp.branch }}</div>
                                </div>
                            </td>
                            <td>
                                <div class="list-contact">
                                    <div><i class="pi pi-envelope"></i> {{ emp.email }}</div>
                                    <div><i class="pi pi-phone"></i> {{ emp.extension }}</div>
                                </div>
                            </td>
                            <td>
                                <div class="list-actions">
                                    <button class="action-icon-btn disabled" disabled v-tooltip.top="'Coming Soon'"><i class="pi pi-comments"></i></button>
                                    <button class="action-icon-btn disabled" disabled v-tooltip.top="'Coming Soon'"><i class="pi pi-video"></i></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Regional View -->
            <div v-if="currentView === 'regional'" class="directory-regional">
                <div v-for="region in regions" :key="region.name" class="region-section">
                    <div class="region-header">
                        <i class="pi pi-map-marker region-icon"></i>
                        <div>
                            <h3>{{ region.name }}</h3>
                            <span class="region-count">{{ region.employees.length }} ACTIVE TEAM MEMBERS</span>
                        </div>
                    </div>
                    <div class="region-employees">
                        <div v-for="emp in region.employees" :key="emp.id" class="region-emp-card">
                            <img :src="emp.avatar" :alt="emp.name" class="region-emp-avatar">
                            <div class="region-emp-info">
                                <div class="region-emp-header">
                                    <span class="region-emp-name">{{ emp.name }}</span>
                                    <span class="region-emp-id">#{{ emp.id }}</span>
                                </div>
                                <div class="region-emp-details">
                                    {{ emp.grade }} • {{ emp.branch }}
                                </div>
                            </div>
                            <span class="region-emp-status" :class="emp.status"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        const currentView = ref('grid');
        const searchQuery = ref('');
        const selectedEntity = ref(null);
        const selectedGrade = ref(null);
        const selectedLocation = ref(null);
        const selectedDepartment = ref(null);
        const selectedSection = ref(null);
        const selectedUnit = ref(null);
        const selectedTeam = ref(null);

        // Entity options
        const entityOptions = ref([
            { name: 'Direct', value: 'direct' },
            { name: 'Techtic', value: 'techtic' }
        ]);

        const gradeOptions = ref([
            { name: 'Default', value: 'all' },
            { name: 'Professional', value: 'professional' },
            { name: 'Supervisor', value: 'supervisor' },
            { name: 'Management', value: 'management' },
            { name: 'Executives', value: 'executives' }
        ]);

        const locationOptions = ref([
            { name: 'All Locations', value: 'all' },
            { name: 'Saudi Arabia', value: 'saudi' },
            { name: 'Egypt', value: 'egypt' },
            { name: 'Pakistan', value: 'pakistan' }
        ]);

        // Organization structure from StaticData
        const departments = ref([...StaticData.departments]);
        const sections = ref([...StaticData.sections]);
        const units = ref([...StaticData.units]);
        const teams = ref([...StaticData.teams]);

        // Department options for dropdown
        const departmentOptions = computed(() => {
            return departments.value.map(d => ({ name: d.name, value: d.id }));
        });

        // Filtered sections based on selected department
        const filteredSections = computed(() => {
            if (!selectedDepartment.value) return [];
            return sections.value.filter(s => s.departmentId === selectedDepartment.value);
        });

        // Filtered units based on selected section
        const filteredUnits = computed(() => {
            if (!selectedSection.value) return [];
            return units.value.filter(u => u.sectionId === selectedSection.value);
        });

        // Filtered teams based on selected unit
        const filteredTeams = computed(() => {
            if (!selectedUnit.value) return [];
            return teams.value.filter(t => t.unitId === selectedUnit.value);
        });

        // Cascade handlers
        const onDepartmentChange = () => {
            selectedSection.value = null;
            selectedUnit.value = null;
            selectedTeam.value = null;
        };

        const onSectionChange = () => {
            selectedUnit.value = null;
            selectedTeam.value = null;
        };

        const onUnitChange = () => {
            selectedTeam.value = null;
        };

        // Check if any filters are active
        const hasActiveFilters = computed(() => {
            return searchQuery.value || 
                   selectedEntity.value || 
                   selectedGrade.value || 
                   selectedLocation.value || 
                   selectedDepartment.value || 
                   selectedSection.value || 
                   selectedUnit.value || 
                   selectedTeam.value;
        });

        // Applied filter values (only update when Apply is clicked)
        const appliedFilters = ref({
            searchQuery: '',
            entity: null,
            grade: null,
            location: null,
            department: null,
            section: null,
            unit: null,
            team: null
        });

        const applyFilters = () => {
            appliedFilters.value = {
                searchQuery: searchQuery.value,
                entity: selectedEntity.value,
                grade: selectedGrade.value,
                location: selectedLocation.value,
                department: selectedDepartment.value,
                section: selectedSection.value,
                unit: selectedUnit.value,
                team: selectedTeam.value
            };
        };

        const clearFilters = () => {
            searchQuery.value = '';
            selectedEntity.value = null;
            selectedGrade.value = null;
            selectedLocation.value = null;
            selectedDepartment.value = null;
            selectedSection.value = null;
            selectedUnit.value = null;
            selectedTeam.value = null;
            appliedFilters.value = {
                searchQuery: '',
                entity: null,
                grade: null,
                location: null,
                department: null,
                section: null,
                unit: null,
                team: null
            };
        };

        const employees = ref([
            {
                id: '102',
                name: 'Sarah Al-Otaibi',
                position: 'UI/UX DESIGNER',
                department: 'Technology',
                grade: 'Supervisor',
                gradeClass: 'supervisor',
                branch: 'Buraidah Branch',
                nationality: 'Saudi',
                email: 's.otaibi@direct.sa',
                extension: '4005',
                avatar: 'https://i.pravatar.cc/80?img=5',
                status: 'online',
                region: 'Saudi Arabia'
            },
            {
                id: '205',
                name: 'Mohammad Al-Dossari',
                position: 'QA ENGINEER',
                department: 'Technology',
                grade: 'Professional',
                gradeClass: 'professional',
                branch: 'Islamabad Branch',
                nationality: 'Pakistani',
                email: 'm.dossari@direct.sa',
                extension: '4088',
                avatar: 'https://i.pravatar.cc/80?img=14',
                status: 'online',
                region: 'Pakistan'
            },
            {
                id: '044',
                name: 'Noura Al-Subaie',
                position: 'HR SPECIALIST',
                department: 'HR',
                grade: 'Professional',
                gradeClass: 'professional',
                branch: 'Riyadh Branch',
                nationality: 'Saudi',
                email: 'n.subaie@direct.sa',
                extension: '2001',
                avatar: 'https://i.pravatar.cc/80?img=10',
                status: 'in-office',
                region: 'Saudi Arabia'
            },
            {
                id: '312',
                name: 'Khaled Al-Anazi',
                position: 'DATA ANALYST',
                department: 'BI',
                grade: 'Professional',
                gradeClass: 'professional',
                branch: 'Cairo Branch',
                nationality: 'Egyptian',
                email: 'k.anazi@direct.sa',
                extension: '3005',
                avatar: 'https://i.pravatar.cc/80?img=11',
                status: 'online',
                region: 'Egypt'
            },
            {
                id: '015',
                name: 'Reem Al-Fahad',
                position: 'MARKETING LEAD',
                department: 'Marketing',
                grade: 'Executives',
                gradeClass: 'executives',
                branch: 'Riyadh Branch',
                nationality: 'Saudi',
                email: 'r.fahad@direct.sa',
                extension: '1002',
                avatar: 'https://i.pravatar.cc/80?img=9',
                status: 'in-office',
                region: 'Saudi Arabia'
            },
            {
                id: '442',
                name: 'Budi Santoso',
                position: 'BACKEND DEVELOPER',
                department: 'Technology',
                grade: 'Professional',
                gradeClass: 'professional',
                branch: 'Riyadh Branch',
                nationality: 'Indonesian',
                email: 'b.santoso@direct.sa',
                extension: '4099',
                avatar: 'https://i.pravatar.cc/80?img=53',
                status: 'online',
                region: 'Saudi Arabia'
            }
        ]);

        const filteredEmployees = computed(() => {
            const filters = appliedFilters.value;
            return employees.value.filter(emp => {
                const matchesSearch = !filters.searchQuery || 
                    emp.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                    emp.id.includes(filters.searchQuery) ||
                    emp.position.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                    emp.department.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                    emp.nationality.toLowerCase().includes(filters.searchQuery.toLowerCase());
                
                const matchesGrade = !filters.grade || filters.grade === 'all' || 
                    emp.gradeClass === filters.grade;
                
                const matchesDepartment = !filters.department ||
                    departments.value.find(d => d.id === filters.department)?.name === emp.department;
                
                const matchesEntity = !filters.entity ||
                    emp.entity === filters.entity;
                
                const matchesLocation = !filters.location || filters.location === 'all' ||
                    (filters.location === 'saudi' && emp.region === 'Saudi Arabia') ||
                    (filters.location === 'egypt' && emp.region === 'Egypt') ||
                    (filters.location === 'pakistan' && emp.region === 'Pakistan');
                
                return matchesSearch && matchesGrade && matchesLocation && matchesDepartment && matchesEntity;
            });
        });

        const regions = computed(() => {
            const regionMap = {};
            filteredEmployees.value.forEach(emp => {
                const regionName = emp.region + ' Office';
                if (!regionMap[regionName]) {
                    regionMap[regionName] = [];
                }
                regionMap[regionName].push(emp);
            });
            return Object.keys(regionMap).map(name => ({
                name,
                employees: regionMap[name]
            }));
        });

        return {
            currentView,
            searchQuery,
            selectedEntity,
            selectedGrade,
            selectedLocation,
            selectedDepartment,
            selectedSection,
            selectedUnit,
            selectedTeam,
            entityOptions,
            gradeOptions,
            locationOptions,
            departmentOptions,
            filteredSections,
            filteredUnits,
            filteredTeams,
            hasActiveFilters,
            onDepartmentChange,
            onSectionChange,
            onUnitChange,
            applyFilters,
            clearFilters,
            employees,
            filteredEmployees,
            regions
        };
    }
};

window.EmployeeDirectoryComponent = EmployeeDirectoryComponent;
