/**
 * New Appraisal Cycle Component
 * 5-Step Wizard for creating appraisal batches
 * Steps: 1. Appraisal Cycle, 2. Select Employees, 3. Set Objectives (KPIs), 4. Reviewers, 5. Review & Confirm
 */

const NewAppraisalComponent = {
    template: `
        <div class="appraisal-wizard-page">
            <!-- Wizard Progress Header -->
            <div class="appraisal-wizard-progress">
                <div v-for="(step, index) in steps" :key="index" class="appraisal-progress-step" :class="{ active: currentStep === index, completed: currentStep > index }">
                    <div class="appraisal-step-circle">
                        <i v-if="currentStep > index" class="pi pi-check"></i>
                        <span v-else>{{ index + 1 }}</span>
                    </div>
                    <div class="appraisal-step-info">
                        <div class="appraisal-step-title">{{ step.title }}</div>
                        <div class="appraisal-step-subtitle">{{ step.subtitle }}</div>
                    </div>
                    <div v-if="index < steps.length - 1" class="appraisal-step-connector" :class="{ active: currentStep > index }"></div>
                </div>
            </div>

            <!-- Step Content Container -->
            <div class="appraisal-wizard-content">
                <!-- Step 1: Choose Appraisal Cycle -->
                <div v-if="currentStep === 0" class="appraisal-step-panel">
                    <div class="appraisal-step-intro">
                        <h2>Choose Appraisal Cycle</h2>
                        <p>Select the performance evaluation period for this batch</p>
                    </div>
                    
                    <div class="appraisal-cycle-grid">
                        <div v-for="cycle in appraisalCycles" :key="cycle.id" 
                             class="appraisal-cycle-card" 
                             :class="{ selected: selectedCycle && selectedCycle.id === cycle.id }"
                             @click="selectCycle(cycle)">
                            <div class="cycle-card-icon">
                                <i class="pi pi-calendar"></i>
                            </div>
                            <div class="cycle-card-check" v-if="selectedCycle && selectedCycle.id === cycle.id">
                                <i class="pi pi-check"></i>
                            </div>
                            <div class="cycle-card-title">{{ cycle.name }}</div>
                            <div class="cycle-card-type">{{ cycle.type }}</div>
                        </div>
                    </div>

                    <div v-if="selectedCycle" class="appraisal-selection-info">
                        <span>You have selected <strong>{{ selectedCycle.name }}</strong>. Click "Next Step" to proceed to employee selection.</span>
                    </div>
                </div>

                <!-- Step 2: Select Target Job Grade -->
                <div v-if="currentStep === 1" class="appraisal-step-panel">
                    <!-- Grade Selection View -->
                    <div v-if="!selectedGrade">
                        <div class="appraisal-step-intro">
                            <h2>Select Target Job Grade</h2>
                            <p>You must choose a grade level to begin building your appraisal batch.</p>
                        </div>
                        
                        <div class="grade-selection-grid">
                            <div v-for="grade in availableGrades" :key="grade.id" 
                                 class="grade-selection-card"
                                 @click="selectGrade(grade)">
                                <div class="grade-card-icon">
                                    <i class="pi pi-users"></i>
                                </div>
                                <div class="grade-card-content">
                                    <div class="grade-card-title">{{ grade.name.toUpperCase() }}</div>
                                    <div class="grade-card-count">{{ getEmployeeCountByGrade(grade.name) }} Employees available</div>
                                </div>
                                <div class="grade-card-arrow">
                                    <i class="pi pi-chevron-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Employee Selection View (after grade selected) -->
                    <div v-else class="employee-selection-view">
                        <div class="employee-selection-header">
                            <div class="grade-badge">
                                <i class="pi pi-briefcase"></i>
                                <span>ACTIVE PHASE</span>
                            </div>
                            <h3>{{ selectedGrade.name.toUpperCase() }} LEVEL</h3>
                            <button class="change-grade-btn" @click="changeGrade">
                                <i class="pi pi-refresh"></i> Change Grade
                            </button>
                        </div>

                        <div class="employee-filter-section">
                            <h4>Filter {{ selectedGrade.name }}s</h4>
                            <div class="filter-row">
                                <p-select v-model="filters.department" :options="departmentOptions" optionLabel="name" optionValue="id" 
                                          placeholder="All Departments" style="width: 200px;" showClear></p-select>
                                <p-select v-model="filters.unit" :options="unitOptions" optionLabel="name" optionValue="id" 
                                          placeholder="All Units" style="width: 200px;" showClear></p-select>
                                <p-select v-model="filters.team" :options="teamOptions" optionLabel="name" optionValue="id" 
                                          placeholder="All Teams" style="width: 200px;" showClear></p-select>
                                <div class="filter-search">
                                    <i class="pi pi-search"></i>
                                    <input type="text" v-model="searchQuery" placeholder="Search by name or ID...">
                                </div>
                            </div>
                        </div>

                        <div class="employee-list-container">
                            <div class="employee-list-header">
                                <div class="list-count">Found {{ filteredEmployees.length }} matching {{ selectedGrade.name }}s</div>
                                <button class="select-all-btn" @click="selectAllEmployees">Select All Visible</button>
                            </div>

                            <div class="employee-table">
                                <div class="employee-table-header">
                                    <div class="col-select">SELECT</div>
                                    <div class="col-name">NAME / INFORMATION</div>
                                    <div class="col-position">POSITION/ROLE</div>
                                    <div class="col-status">BATCH STATUS</div>
                                </div>
                                <div class="employee-table-body">
                                    <div v-for="emp in filteredEmployees" :key="emp.id" 
                                         class="employee-table-row"
                                         :class="{ selected: isEmployeeSelected(emp.id) }">
                                        <div class="col-select">
                                            <label class="custom-checkbox" :class="{ checked: isEmployeeSelected(emp.id) }">
                                                <input type="checkbox" :checked="isEmployeeSelected(emp.id)" @change="toggleEmployee(emp)">
                                                <span class="checkmark"></span>
                                            </label>
                                        </div>
                                        <div class="col-name">
                                            <img :src="emp.avatar" class="emp-avatar" :alt="emp.firstName">
                                            <div class="emp-info">
                                                <div class="emp-name">{{ emp.firstName }} {{ emp.familyName }}</div>
                                                <div class="emp-id">{{ emp.employeeNumber }}</div>
                                            </div>
                                        </div>
                                        <div class="col-position">
                                            <div class="emp-dept">{{ emp.department }}</div>
                                            <div class="emp-section">{{ emp.section || 'N/A' }} - {{ emp.jobTitle }}</div>
                                        </div>
                                        <div class="col-status">
                                            <span class="batch-status available">AVAILABLE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Selection Panel (Right Side) -->
                        <div class="selection-panel">
                            <div class="selection-panel-header">
                                <span>Evaluation Package</span>
                                <span class="panel-subtitle">Select for {{ selectedGrade.name }} Level</span>
                            </div>
                            <div class="selection-panel-count">
                                <span class="count-number">{{ selectedEmployees.length }}</span>
                                <span class="count-label">{{ selectedEmployees.length === 1 ? 'Selected' : 'Selected' }}</span>
                            </div>
                            <div class="selected-employees-list">
                                <div v-for="emp in selectedEmployees" :key="emp.id" class="selected-emp-item">
                                    <img :src="emp.avatar" class="selected-emp-avatar" :alt="emp.firstName">
                                    <span class="selected-emp-name">{{ emp.firstName }} {{ emp.familyName.charAt(0) }}</span>
                                    <button class="remove-emp-btn" @click="removeEmployee(emp.id)">
                                        <i class="pi pi-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="selection-panel-footer">
                                <div class="batch-id">TARGET BATCH SIZE: {{ selectedEmployees.length }}</div>
                                <button class="proceed-btn" :disabled="selectedEmployees.length === 0" @click="nextStep">
                                    Proceed with Batch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Set Performance Objectives (KPIs) -->
                <div v-if="currentStep === 2" class="appraisal-step-panel">
                    <div class="appraisal-step-intro">
                        <h2>Set Performance Objectives (KPIs)</h2>
                        <p>Upload the KPI Excel table for the <strong>{{ selectedGrade.name.toUpperCase() }}</strong> grade level.</p>
                    </div>

                    <!-- File Upload Section -->
                    <div v-if="!uploadedFile" class="kpi-upload-section">
                        <div class="upload-zone" @dragover.prevent @drop.prevent="handleFileDrop">
                            <div class="upload-icon">
                                <i class="pi pi-plus"></i>
                            </div>
                            <h3>Drag and drop your KPI file here</h3>
                            <p>Supported formats: .xlsx, .xls, .csv</p>
                            <label class="upload-btn">
                                Browse Files
                                <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileSelect" hidden>
                            </label>
                        </div>
                    </div>

                    <!-- File Uploaded State -->
                    <div v-else class="kpi-file-uploaded">
                        <div class="file-info-card">
                            <div class="file-icon success">
                                <i class="pi pi-check"></i>
                            </div>
                            <div class="file-details">
                                <div class="file-name">{{ uploadedFile.name }}</div>
                                <div class="file-status">READY FOR BATCH ASSIGNMENT</div>
                            </div>
                            <div class="file-actions">
                                <button class="file-action-btn" @click="changeFile">Change File</button>
                                <button class="file-action-btn danger" @click="removeFile">Remove</button>
                            </div>
                        </div>

                        <!-- Weight Distribution Matrix -->
                        <div class="weight-matrix-section">
                            <div class="matrix-header">
                                <h3>Weight Distribution Matrix</h3>
                                <p>Automatic weights applied for the <strong>{{ selectedGrade.name.toUpperCase() }}</strong> band</p>
                                <span class="verified-badge">VERIFIED CONFIGURATION</span>
                            </div>
                            <div class="weight-cards">
                                <div class="weight-card">
                                    <div class="weight-value">{{ gradeWeights.corporateObjectives }}%</div>
                                    <div class="weight-label">CORPORATE OBJECTIVES</div>
                                    <div class="weight-desc">Strategic goals aligned with organization mission</div>
                                </div>
                                <div class="weight-card highlight">
                                    <div class="weight-value">{{ gradeWeights.personalKpis }}%</div>
                                    <div class="weight-label">PERSONAL KPIS</div>
                                    <div class="weight-desc">Specific job-related performance indicators</div>
                                </div>
                                <div class="weight-card">
                                    <div class="weight-value">{{ gradeWeights.competency }}%</div>
                                    <div class="weight-label">COMPETENCY</div>
                                    <div class="weight-desc">Behavioral skills and soft-skill assessments</div>
                                </div>
                            </div>
                            <div class="total-weight">
                                <i class="pi pi-check-circle"></i>
                                TOTAL WEIGHT APPLIED: 100%
                            </div>
                        </div>
                    </div>

                    <!-- Info Banner -->
                    <div class="grade-config-banner">
                        <div class="banner-icon">
                            <i class="pi pi-info-circle"></i>
                        </div>
                        <div class="banner-content">
                            <h4>Grade-Specific Configuration</h4>
                            <p>The weights displayed above are strictly enforced for the <strong>{{ selectedGrade.name }}</strong> job band. The system will automatically validate the uploaded Excel file contents against these targets during the final submission.</p>
                        </div>
                    </div>
                </div>

                <!-- Step 4: Assign Evaluation Committee (Reviewers) -->
                <div v-if="currentStep === 3" class="appraisal-step-panel">
                    <div class="appraisal-step-intro">
                        <h2>Assign Evaluation Committee</h2>
                        <p>Select the specific managers who will oversee and grade the performance of this employee batch. You can select multiple individuals for a <strong>joint committee</strong>.</p>
                    </div>

                    <div class="eligible-badges">
                        <span class="eligible-badge management">+ MANAGEMENT ELIGIBLE</span>
                        <span class="eligible-badge leadership">+ LEADERSHIP ELIGIBLE</span>
                    </div>

                    <div class="reviewers-layout">
                        <div class="reviewers-list-section">
                            <div class="reviewer-search">
                                <i class="pi pi-search"></i>
                                <input type="text" v-model="reviewerSearchQuery" placeholder="Search by manager name or employee ID...">
                            </div>

                            <div class="reviewers-grid">
                                <div v-for="reviewer in filteredReviewers" :key="reviewer.id" 
                                     class="reviewer-card" 
                                     :class="{ selected: isReviewerSelected(reviewer.id) }"
                                     @click="toggleReviewer(reviewer)">
                                    <img :src="reviewer.avatar" class="reviewer-avatar" :alt="reviewer.firstName">
                                    <div class="reviewer-info">
                                        <div class="reviewer-name">{{ reviewer.firstName }} {{ reviewer.familyName }}</div>
                                        <div class="reviewer-id">{{ reviewer.employeeNumber }}</div>
                                        <span class="reviewer-grade-badge" :class="reviewer.mainGrade.toLowerCase()">{{ reviewer.mainGrade.toUpperCase() }}</span>
                                        <div class="reviewer-dept">{{ reviewer.department }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Active Committee Panel -->
                        <div class="committee-panel">
                            <div class="committee-panel-header">
                                <span>Active Committee</span>
                                <span class="panel-subtitle">REVIEWER LIST</span>
                            </div>
                            
                            <div v-if="selectedReviewers.length === 0" class="committee-empty">
                                <p>PLEASE SELECT MEMBERS FROM THE LIST</p>
                            </div>
                            
                            <div v-else class="committee-members">
                                <div v-for="reviewer in selectedReviewers" :key="reviewer.id" class="committee-member">
                                    <img :src="reviewer.avatar" class="member-avatar" :alt="reviewer.firstName">
                                    <div class="member-info">
                                        <div class="member-name">{{ reviewer.firstName }} {{ reviewer.familyName }}</div>
                                        <span class="member-grade" :class="reviewer.mainGrade.toLowerCase()">{{ reviewer.mainGrade.toUpperCase() }}</span>
                                    </div>
                                    <button class="remove-member-btn" @click.stop="removeReviewer(reviewer.id)">
                                        <i class="pi pi-times"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="committee-size">
                                <span>TOTAL COMMITTEE SIZE</span>
                                <span class="size-value">{{ selectedReviewers.length }}</span>
                            </div>

                            <div class="committee-info">
                                <p>The committee members will receive access to evaluate the entire batch of employees simultaneously.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 5: Review & Confirm -->
                <div v-if="currentStep === 4" class="appraisal-step-panel">
                    <div class="confirmation-section">
                        <div class="confirmation-header">
                            <h2>FINAL PACKAGE CONFIRMATION</h2>
                            <p>A detailed summary of your appraisal batch configuration.</p>
                        </div>

                        <div class="confirmation-grid">
                            <div class="confirmation-main">
                                <div class="package-details-card">
                                    <div class="package-label">PACKAGE DETAILS</div>
                                    <div class="package-row">
                                        <div class="package-item">
                                            <label>CYCLE SELECTED</label>
                                            <div class="item-value">
                                                <i class="pi pi-calendar"></i>
                                                {{ selectedCycle.name }}
                                            </div>
                                        </div>
                                        <div class="package-item">
                                            <label>TARGET GRADE BAND</label>
                                            <div class="item-value">
                                                <i class="pi pi-users"></i>
                                                {{ selectedGrade.name.toUpperCase() }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="package-row">
                                        <div class="package-item">
                                            <label>KPI EXCEL FILE</label>
                                            <div class="item-value file">
                                                <i class="pi pi-file-excel"></i>
                                                {{ uploadedFile ? uploadedFile.name : 'No file uploaded' }}
                                            </div>
                                        </div>
                                        <div class="package-item">
                                            <label>BATCH STRENGTH</label>
                                            <div class="item-value highlight">
                                                {{ selectedEmployees.length }} Active Employees
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Evaluation Committee Card -->
                                <div class="committee-summary-card">
                                    <div class="committee-summary-header">
                                        <span>EVALUATION COMMITTEE</span>
                                        <span class="reviewer-count">{{ selectedReviewers.length }} REVIEWERS</span>
                                    </div>
                                    <div class="committee-avatars">
                                        <div v-for="reviewer in selectedReviewers" :key="reviewer.id" class="committee-avatar-item">
                                            <img :src="reviewer.avatar" :alt="reviewer.firstName">
                                            <span class="committee-avatar-name">{{ reviewer.firstName }} {{ reviewer.familyName }}</span>
                                            <span class="committee-avatar-grade" :class="reviewer.mainGrade.toLowerCase()">{{ reviewer.mainGrade.toUpperCase() }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- KPI Weight Allocation -->
                                <div class="weight-allocation-card">
                                    <div class="weight-allocation-header">STANDARD KPI WEIGHT ALLOCATION</div>
                                    <div class="weight-allocation-row">
                                        <div class="weight-item">
                                            <div class="weight-percent">{{ gradeWeights.corporateObjectives }}%</div>
                                            <div class="weight-name">CORPORATE</div>
                                        </div>
                                        <div class="weight-item highlight">
                                            <div class="weight-percent">{{ gradeWeights.personalKpis }}%</div>
                                            <div class="weight-name">PERSONAL KPIS</div>
                                        </div>
                                        <div class="weight-item">
                                            <div class="weight-percent">{{ gradeWeights.competency }}%</div>
                                            <div class="weight-name">COMPETENCY</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Target Employees Side Panel -->
                            <div class="target-employees-card">
                                <div class="target-header">
                                    <span>TARGET EMPLOYEES</span>
                                    <span class="target-subtitle">Evaluation participants</span>
                                </div>
                                <div class="target-list">
                                    <div v-for="emp in selectedEmployees" :key="emp.id" class="target-employee">
                                        <img :src="emp.avatar" class="target-avatar" :alt="emp.firstName">
                                        <div class="target-info">
                                            <div class="target-name">{{ emp.firstName }} {{ emp.familyName }}</div>
                                            <div class="target-details">{{ emp.employeeNumber }} • {{ emp.department }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="target-total">TOTAL: {{ selectedEmployees.length }} EMPLOYEES</div>
                            </div>
                        </div>

                        <!-- Authorization Banner -->
                        <div class="authorization-banner">
                            <div class="auth-icon">
                                <i class="pi pi-exclamation-triangle"></i>
                            </div>
                            <div class="auth-content">
                                <h4>Final Submission Authorization</h4>
                                <p>You are launching the appraisal cycle for <strong>{{ selectedEmployees.length }} employees</strong>. The evaluation committee composed of <strong>{{ selectedReviewers.length }} reviewers</strong> will be notified immediately.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Success State -->
                <div v-if="currentStep === 5" class="appraisal-step-panel success-panel">
                    <div class="success-content">
                        <div class="success-icon">
                            <i class="pi pi-check"></i>
                        </div>
                        <h1>APPRAISAL INITIALIZED!</h1>
                        <p>Evaluation assignments have been sent to committee members.</p>
                        <div class="redirect-text">Redirecting to Tracking Dashboard...</div>
                    </div>
                </div>
            </div>

            <!-- Wizard Footer -->
            <div v-if="currentStep < 5" class="appraisal-wizard-footer">
                <button v-if="currentStep > 0 && !(currentStep === 1 && selectedGrade)" class="btn-secondary" @click="prevStep">
                    <i class="pi pi-chevron-left"></i> Previous
                </button>
                <button v-else-if="currentStep === 1 && selectedGrade" class="btn-secondary" @click="changeGrade">
                    <i class="pi pi-chevron-left"></i> Previous
                </button>
                <div style="flex: 1;"></div>
                <button v-if="currentStep < 4" class="btn-primary" @click="nextStep" :disabled="!canProceed">
                    Next Step <i class="pi pi-chevron-right"></i>
                </button>
                <button v-else class="btn-success" @click="launchAppraisal" :disabled="!canProceed">
                    Launch Appraisal
                </button>
            </div>
        </div>
    `,

    emits: ['back', 'launched'],

    setup(props, { emit }) {
        const { ref, computed, onMounted } = Vue;

        // Steps definition
        const steps = ref([
            { title: 'Appraisal Cycle', subtitle: 'Select evaluation period' },
            { title: 'Select Employees', subtitle: 'Define target list' },
            { title: 'Set Objectives', subtitle: 'Configure KPI indicators' },
            { title: 'Reviewers', subtitle: 'Assign evaluation committee' },
            { title: 'Review & Confirm', subtitle: 'Finalize assignment' }
        ]);

        const currentStep = ref(0);

        // Data
        const appraisalCycles = ref([...StaticData.appraisalCycles]);
        const employees = ref([...StaticData.employees]);
        const mainGrades = ref([...StaticData.mainGrades]);
        const departments = ref([...StaticData.departments]);
        const sections = ref([...StaticData.sections]);
        const units = ref([...StaticData.units]);
        const teams = ref([...StaticData.teams]);
        const kpiWeightMatrix = ref({ ...StaticData.kpiWeightMatrix });

        // Step 1: Cycle selection
        const selectedCycle = ref(null);

        // Step 2: Grade and employee selection
        const selectedGrade = ref(null);
        const selectedEmployees = ref([]);
        const searchQuery = ref('');
        const filters = ref({
            department: null,
            unit: null,
            team: null
        });

        // Step 3: File upload
        const uploadedFile = ref(null);

        // Step 4: Reviewers
        const selectedReviewers = ref([]);
        const reviewerSearchQuery = ref('');

        // Computed: Available grades (from main grades)
        const availableGrades = computed(() => {
            return mainGrades.value.map(grade => ({
                ...grade,
                // Map grade names to match weight matrix keys
                weightKey: grade.name === 'Executives' ? 'Leadership' : grade.name
            }));
        });

        // Get employee count by grade
        const getEmployeeCountByGrade = (gradeName) => {
            return employees.value.filter(e => e.mainGrade === gradeName).length;
        };

        // Filtered employees for selected grade
        const filteredEmployees = computed(() => {
            if (!selectedGrade.value) return [];
            
            let result = employees.value.filter(e => e.mainGrade === selectedGrade.value.name);
            
            if (filters.value.department) {
                const deptName = departments.value.find(d => d.id === filters.value.department)?.name;
                result = result.filter(e => e.department === deptName);
            }
            
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(e => 
                    e.firstName.toLowerCase().includes(query) ||
                    e.familyName.toLowerCase().includes(query) ||
                    e.employeeNumber.toLowerCase().includes(query)
                );
            }
            
            return result;
        });

        // Eligible reviewers (Management and Executives/Leadership)
        const eligibleReviewers = computed(() => {
            return employees.value.filter(e => 
                e.mainGrade === 'Management' || e.mainGrade === 'Executives'
            );
        });

        // Filtered reviewers
        const filteredReviewers = computed(() => {
            if (!reviewerSearchQuery.value) return eligibleReviewers.value;
            
            const query = reviewerSearchQuery.value.toLowerCase();
            return eligibleReviewers.value.filter(e =>
                e.firstName.toLowerCase().includes(query) ||
                e.familyName.toLowerCase().includes(query) ||
                e.employeeNumber.toLowerCase().includes(query)
            );
        });

        // Get grade weights
        const gradeWeights = computed(() => {
            if (!selectedGrade.value) return { corporateObjectives: 0, personalKpis: 0, competency: 0 };
            const key = selectedGrade.value.name === 'Executives' ? 'Leadership' : selectedGrade.value.name;
            return kpiWeightMatrix.value[key] || { corporateObjectives: 5, personalKpis: 60, competency: 35 };
        });

        // Filter options
        const departmentOptions = computed(() => [{ id: null, name: 'All Departments' }, ...departments.value]);
        const unitOptions = computed(() => [{ id: null, name: 'All Units' }, ...units.value]);
        const teamOptions = computed(() => [{ id: null, name: 'All Teams' }, ...teams.value]);

        // Can proceed validation
        const canProceed = computed(() => {
            switch (currentStep.value) {
                case 0: return !!selectedCycle.value;
                case 1: return selectedEmployees.value.length > 0;
                case 2: return !!uploadedFile.value;
                case 3: return selectedReviewers.value.length > 0;
                case 4: return true;
                default: return false;
            }
        });

        // Methods
        const selectCycle = (cycle) => {
            selectedCycle.value = cycle;
        };

        const selectGrade = (grade) => {
            selectedGrade.value = grade;
            selectedEmployees.value = [];
        };

        const changeGrade = () => {
            selectedGrade.value = null;
            selectedEmployees.value = [];
        };

        const isEmployeeSelected = (empId) => {
            return selectedEmployees.value.some(e => e.id === empId);
        };

        const toggleEmployee = (emp) => {
            if (isEmployeeSelected(emp.id)) {
                selectedEmployees.value = selectedEmployees.value.filter(e => e.id !== emp.id);
            } else {
                selectedEmployees.value.push(emp);
            }
        };

        const removeEmployee = (empId) => {
            selectedEmployees.value = selectedEmployees.value.filter(e => e.id !== empId);
        };

        const selectAllEmployees = () => {
            filteredEmployees.value.forEach(emp => {
                if (!isEmployeeSelected(emp.id)) {
                    selectedEmployees.value.push(emp);
                }
            });
        };

        const handleFileSelect = (event) => {
            const file = event.target.files[0];
            if (file) {
                uploadedFile.value = file;
            }
        };

        const handleFileDrop = (event) => {
            const file = event.dataTransfer.files[0];
            if (file) {
                uploadedFile.value = file;
            }
        };

        const changeFile = () => {
            uploadedFile.value = null;
        };

        const removeFile = () => {
            uploadedFile.value = null;
        };

        const isReviewerSelected = (reviewerId) => {
            return selectedReviewers.value.some(r => r.id === reviewerId);
        };

        const toggleReviewer = (reviewer) => {
            if (isReviewerSelected(reviewer.id)) {
                selectedReviewers.value = selectedReviewers.value.filter(r => r.id !== reviewer.id);
            } else {
                selectedReviewers.value.push(reviewer);
            }
        };

        const removeReviewer = (reviewerId) => {
            selectedReviewers.value = selectedReviewers.value.filter(r => r.id !== reviewerId);
        };

        const nextStep = () => {
            if (currentStep.value < steps.value.length) {
                currentStep.value++;
            }
        };

        const prevStep = () => {
            if (currentStep.value > 0) {
                currentStep.value--;
            }
        };

        const launchAppraisal = () => {
            // Create batch record
            const batch = {
                id: StaticData.appraisalBatches.length + 1,
                cycleId: selectedCycle.value.id,
                cycleName: selectedCycle.value.name,
                gradeId: selectedGrade.value.id,
                gradeName: selectedGrade.value.name,
                employees: selectedEmployees.value.map(e => e.id),
                reviewers: selectedReviewers.value.map(r => r.id),
                kpiFile: uploadedFile.value ? uploadedFile.value.name : null,
                weights: gradeWeights.value,
                status: 'active',
                createdAt: new Date().toLocaleDateString('en-GB')
            };
            StaticData.appraisalBatches.push(batch);
            
            // Show success and redirect
            currentStep.value = 5;
            
            setTimeout(() => {
                emit('launched');
            }, 3000);
        };

        return {
            steps,
            currentStep,
            appraisalCycles,
            employees,
            mainGrades,
            departments,
            units,
            teams,
            selectedCycle,
            selectedGrade,
            selectedEmployees,
            selectedReviewers,
            searchQuery,
            reviewerSearchQuery,
            filters,
            uploadedFile,
            availableGrades,
            filteredEmployees,
            eligibleReviewers,
            filteredReviewers,
            gradeWeights,
            departmentOptions,
            unitOptions,
            teamOptions,
            canProceed,
            getEmployeeCountByGrade,
            selectCycle,
            selectGrade,
            changeGrade,
            isEmployeeSelected,
            toggleEmployee,
            removeEmployee,
            selectAllEmployees,
            handleFileSelect,
            handleFileDrop,
            changeFile,
            removeFile,
            isReviewerSelected,
            toggleReviewer,
            removeReviewer,
            nextStep,
            prevStep,
            launchAppraisal
        };
    }
};

window.NewAppraisalComponent = NewAppraisalComponent;
