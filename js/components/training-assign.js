/**
 * Training Assign Component
 * Wizard for assigning training paths to employees
 */

const TrainingAssignComponent = {
    template: `
        <div class="training-assign-page">
            <!-- Page Header -->
            <div class="page-header-centered">
                <h1>Assign Training</h1>
                <p>Deploy training curriculum in 4 easy steps.</p>
            </div>

            <!-- Step 1: Select Training Path -->
            <div class="wizard-section" :class="{ completed: selectedPath, disabled: false }">
                <div class="wizard-header">
                    <div class="step-number" :class="{ active: true, completed: selectedPath }">1</div>
                    <div class="step-info">
                        <h3>Select Training Path</h3>
                        <p>Choose the path or module for this assignment.</p>
                    </div>
                </div>
                <div class="wizard-content">
                    <div class="search-box">
                        <i class="pi pi-search"></i>
                        <input type="text" v-model="pathSearch" placeholder="Search training paths...">
                    </div>
                    <div class="paths-list">
                        <div v-for="path in filteredPaths" :key="path.id" 
                             class="path-option" :class="{ selected: selectedPath?.id === path.id }"
                             @click="selectPath(path)">
                            <p-radiobutton :modelValue="selectedPath?.id" :value="path.id" name="path"></p-radiobutton>
                            <span class="path-name">{{ path.name }}</span>
                            <span class="path-hours">{{ path.hours }} hrs</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 2: Select Participants -->
            <div class="wizard-section" :class="{ completed: selectedEmployees.length > 0, disabled: !selectedPath }">
                <div class="wizard-header" @click="!selectedPath && showStepWarning(1)">
                    <div class="step-number" :class="{ active: selectedPath, completed: selectedEmployees.length > 0 }">2</div>
                    <div class="step-info">
                        <div class="step-info-row">
                            <div>
                                <h3>Select Participants</h3>
                                <p>Search by Name, Email, or Employee ID.</p>
                            </div>
                            <div class="selected-count" v-if="selectedEmployees.length > 0">
                                {{ selectedEmployees.length }}
                                <span>SELECTED</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wizard-content" v-if="selectedPath">
                    <div class="participants-header">
                        <div class="search-box">
                            <i class="pi pi-search"></i>
                            <input type="text" v-model="employeeSearch" placeholder="Search ID, Name, Email...">
                        </div>
                        <p-button label="Select Visible" outlined size="small" @click="selectAllVisible" 
                                  :badge="filteredEmployees.length.toString()"></p-button>
                    </div>
                    <div class="employees-list">
                        <div v-for="emp in filteredEmployees" :key="emp.id" 
                             class="employee-option" :class="{ selected: isEmployeeSelected(emp.id) }">
                            <p-checkbox :modelValue="isEmployeeSelected(emp.id)" :binary="true" 
                                        @change="toggleEmployee(emp)"></p-checkbox>
                            <div class="employee-info">
                                <span class="employee-name">{{ emp.name }}</span>
                                <span class="employee-id">{{ emp.empId }}</span>
                                <span class="employee-dept">{{ emp.department }}</span>
                            </div>
                            <span class="employee-grade">{{ emp.grade }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 3: Select Cycle -->
            <div class="wizard-section compact" :class="{ completed: selectedCycle, disabled: !selectedPath || selectedEmployees.length === 0 }">
                <div class="wizard-header" @click="(!selectedPath || selectedEmployees.length === 0) && showStepWarning(2)">
                    <div class="step-number" :class="{ active: selectedPath && selectedEmployees.length > 0, completed: selectedCycle }">3</div>
                    <div class="step-info">
                        <h3>Select Cycle</h3>
                    </div>
                </div>
                <div class="wizard-content compact" v-if="selectedPath && selectedEmployees.length > 0">
                    <div class="cycles-row">
                        <div v-for="cycle in cycles" :key="cycle.id" 
                             class="cycle-option" :class="{ selected: selectedCycle === cycle.id }"
                             @click="selectedCycle = cycle.id">
                            {{ cycle.label }}
                        </div>
                        <div class="cycle-onboarding" :class="{ selected: selectedCycle === 'onboarding' }"
                             @click="selectedCycle = 'onboarding'">
                            On-boarding
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 4: Assign Period -->
            <div class="wizard-section compact" :class="{ completed: startDate && endDate, disabled: !selectedCycle }">
                <div class="wizard-header" @click="!selectedCycle && showStepWarning(3)">
                    <div class="step-number" :class="{ active: selectedCycle, completed: startDate && endDate }">4</div>
                    <div class="step-info">
                        <h3>Assign Period</h3>
                    </div>
                </div>
                <div class="wizard-content compact" v-if="selectedCycle">
                    <div class="period-row">
                        <div class="period-field">
                            <label>START</label>
                            <p-datepicker v-model="startDate" dateFormat="MM yy" view="month" 
                                          placeholder="Select start"></p-datepicker>
                        </div>
                        <span class="period-arrow">→</span>
                        <div class="period-field">
                            <label>END</label>
                            <p-datepicker v-model="endDate" dateFormat="MM yy" view="month" 
                                          placeholder="Select end"></p-datepicker>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary Card -->
            <div class="summary-card" v-if="selectedPath && selectedEmployees.length > 0">
                <div class="summary-header">
                    <span class="summary-badge">ACTIVE SELECTION</span>
                    <p-tag v-if="selectedCycle" :value="selectedCycle === 'onboarding' ? 'ON-BOARDING' : 'CYCLE ' + selectedCycle" severity="info" size="small"></p-tag>
                </div>
                <div class="summary-content">
                    <h3 class="summary-path-name">{{ selectedPath.name }}</h3>
                    <div class="summary-period" v-if="startDate && endDate">
                        <span class="period-label">ASSIGNED PERIOD</span>
                        <span class="period-dates">{{ formatPeriod() }}</span>
                    </div>
                    <div class="summary-footer">
                        <span class="participants-count">{{ selectedEmployees.length }} Participants</span>
                        <a class="view-list-link" @click="clearSelection">VIEW LIST</a>
                    </div>
                </div>
                <p-button label="Confirm & Launch" class="launch-btn" 
                          :disabled="!canLaunch" @click="launchTraining"></p-button>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        const pathSearch = ref('');
        const employeeSearch = ref('');
        const selectedPath = ref(null);
        const selectedEmployees = ref([]);
        const selectedCycle = ref(null);
        const startDate = ref(null);
        const endDate = ref(null);

        const paths = ref([
            { id: 1, name: 'Cybersecurity Essentials', hours: 10 },
            { id: 2, name: 'Leadership & Management', hours: 40 },
            { id: 3, name: 'Python for Data Analysis', hours: 60 },
            { id: 4, name: 'Workplace Safety & Health', hours: 5 },
            { id: 5, name: 'Strategic Communication', hours: 20 },
            { id: 6, name: 'Customer Success Mastery', hours: 15 },
            { id: 7, name: 'Project Management Foundations', hours: 25 },
            { id: 8, name: 'AI Ethics & Governance', hours: 30 },
            { id: 9, name: 'Advanced Excel for Finance', hours: 35 },
            { id: 10, name: 'Diversity & Inclusion', hours: 8 }
        ]);

        const employees = ref([
            { id: 1, name: 'Employee 1', empId: 'EMP-1000', department: 'Engineering', grade: 'GRADE 5' },
            { id: 2, name: 'Employee 2', empId: 'EMP-1001', department: 'Sales', grade: 'GRADE 4' },
            { id: 3, name: 'Employee 3', empId: 'EMP-1002', department: 'Marketing', grade: 'GRADE 3' },
            { id: 4, name: 'Employee 4', empId: 'EMP-1003', department: 'Human Resources', grade: 'GRADE 5' },
            { id: 5, name: 'Employee 5', empId: 'EMP-1004', department: 'Finance', grade: 'GRADE 6' },
            { id: 6, name: 'Employee 6', empId: 'EMP-1005', department: 'Operations', grade: 'GRADE 4' },
            { id: 7, name: 'Employee 7', empId: 'EMP-1006', department: 'IT Support', grade: 'GRADE 3' }
        ]);

        const cycles = ref([
            { id: 1, label: '1' }, { id: 2, label: '2' }, { id: 3, label: '3' }, { id: 4, label: '4' },
            { id: 5, label: '5' }, { id: 6, label: '6' }, { id: 7, label: '7' }, { id: 8, label: '8' },
            { id: 9, label: '9' }, { id: 10, label: '10' }
        ]);

        const filteredPaths = computed(() => {
            if (!pathSearch.value) return paths.value;
            return paths.value.filter(p => p.name.toLowerCase().includes(pathSearch.value.toLowerCase()));
        });

        const filteredEmployees = computed(() => {
            if (!employeeSearch.value) return employees.value;
            const search = employeeSearch.value.toLowerCase();
            return employees.value.filter(e => 
                e.name.toLowerCase().includes(search) || 
                e.empId.toLowerCase().includes(search) ||
                e.department.toLowerCase().includes(search)
            );
        });

        const canLaunch = computed(() => {
            return selectedPath.value && selectedEmployees.value.length > 0 && selectedCycle.value && startDate.value && endDate.value;
        });

        const selectPath = (path) => {
            selectedPath.value = path;
        };

        const isEmployeeSelected = (id) => {
            return selectedEmployees.value.some(e => e.id === id);
        };

        const toggleEmployee = (emp) => {
            const index = selectedEmployees.value.findIndex(e => e.id === emp.id);
            if (index === -1) {
                selectedEmployees.value.push(emp);
            } else {
                selectedEmployees.value.splice(index, 1);
            }
        };

        const selectAllVisible = () => {
            filteredEmployees.value.forEach(emp => {
                if (!isEmployeeSelected(emp.id)) {
                    selectedEmployees.value.push(emp);
                }
            });
        };

        const formatPeriod = () => {
            if (!startDate.value || !endDate.value) return '';
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            return `${start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
        };

        const clearSelection = () => {
            selectedPath.value = null;
            selectedEmployees.value = [];
            selectedCycle.value = null;
            startDate.value = null;
            endDate.value = null;
        };

        const launchTraining = () => {
            alert('Training assignment launched successfully!');
            clearSelection();
        };

        const showStepWarning = (step) => {
            const messages = {
                1: 'Please select a training path first.',
                2: 'Please select at least one participant first.',
                3: 'Please select a cycle first.'
            };
            alert(messages[step]);
        };

        return {
            pathSearch,
            employeeSearch,
            selectedPath,
            selectedEmployees,
            selectedCycle,
            startDate,
            endDate,
            paths,
            employees,
            cycles,
            filteredPaths,
            filteredEmployees,
            canLaunch,
            selectPath,
            isEmployeeSelected,
            toggleEmployee,
            selectAllVisible,
            formatPeriod,
            clearSelection,
            launchTraining,
            showStepWarning
        };
    }
};

window.TrainingAssignComponent = TrainingAssignComponent;
