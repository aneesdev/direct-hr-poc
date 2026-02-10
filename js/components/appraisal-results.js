/**
 * Appraisal Results Component
 * Archive of all finalized and signed performance evaluations
 */

const AppraisalResultsComponent = {
    template: `
        <div class="appraisal-results-page">
            <!-- Page Header -->
            <div class="results-header">
                <div>
                    <h1>APPRAISAL RESULTS</h1>
                    <p>Archive of all finalized and signed performance evaluations.</p>
                </div>
                <p-button label="Download Annual Report" icon="pi pi-download" severity="warning"></p-button>
            </div>

            <!-- Filters Section -->
            <div class="card" style="margin-bottom: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                    <span class="p-input-icon-left" style="min-width: 200px; flex: 1;">
                        <i class="pi pi-search"></i>
                        <p-inputtext v-model="searchQuery" placeholder="Search Name or ID..." style="width: 100%;"></p-inputtext>
                    </span>
                    <p-select v-model="filters.grade" :options="gradeOptions" optionLabel="name" optionValue="value" 
                              placeholder="All Grades" showClear style="width: 140px;"></p-select>
                    <p-select v-model="filters.cycle" :options="cycleOptions" optionLabel="name" optionValue="value" 
                              placeholder="All Cycles" showClear style="width: 180px;"></p-select>
                    <p-select v-model="filters.department" :options="departmentOptions" optionLabel="name" optionValue="value" 
                              placeholder="Departments" showClear style="width: 150px;"></p-select>
                    <p-select v-model="filters.section" :options="sectionOptions" optionLabel="name" optionValue="value" 
                              placeholder="Sections" showClear style="width: 150px;"></p-select>
                    <p-select v-model="filters.unit" :options="unitOptions" optionLabel="name" optionValue="value" 
                              placeholder="Units" showClear style="width: 140px;"></p-select>
                    <p-select v-model="filters.team" :options="teamOptions" optionLabel="name" optionValue="value" 
                              placeholder="Teams" showClear style="width: 140px;"></p-select>
                    <p-button label="Clear All" icon="pi pi-times" text severity="danger" @click="clearFilters"></p-button>
                </div>
            </div>

            <!-- Results Table -->
            <div class="card">
                <p-datatable :value="filteredResults" stripedRows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
                    <p-column header="Employee" sortable>
                        <template #body="slotProps">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <img :src="slotProps.data.employeeAvatar" :alt="slotProps.data.employeeName" style="width: 40px; height: 40px; border-radius: 50%;">
                                <div>
                                    <div style="font-weight: 600;">{{ slotProps.data.employeeName }}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-color-secondary);">{{ slotProps.data.employeeNumber }}</div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Cycle" sortable>
                        <template #body="slotProps">
                            <span style="font-size: 0.85rem;">{{ slotProps.data.cycleName }}</span>
                        </template>
                    </p-column>
                    <p-column header="Self Score" sortable style="width: 100px; text-align: center;">
                        <template #body="slotProps">
                            <span style="font-size: 0.9rem; color: var(--text-color-secondary);">{{ slotProps.data.selfScore }}%</span>
                        </template>
                    </p-column>
                    <p-column header="Final Score" sortable style="width: 120px;">
                        <template #body="slotProps">
                            <span class="final-score-badge">{{ slotProps.data.finalScore }}%</span>
                        </template>
                    </p-column>
                    <p-column header="Performance Rating" sortable>
                        <template #body="slotProps">
                            <span class="performance-tag excellent">{{ slotProps.data.performanceRating }}</span>
                        </template>
                    </p-column>
                    <p-column header="Evaluator" sortable>
                        <template #body="slotProps">
                            <span style="font-size: 0.85rem;">{{ slotProps.data.evaluator }}</span>
                        </template>
                    </p-column>
                    <p-column header="Action" style="width: 80px; text-align: center;">
                        <template #body="slotProps">
                            <p-button icon="pi pi-file" severity="warning" text rounded @click="openArchiveModal(slotProps.data)"></p-button>
                        </template>
                    </p-column>
                </p-datatable>
            </div>

            <!-- Appraisal Archive Modal -->
            <p-dialog v-model:visible="showArchiveModal" header="Appraisal Archive" :modal="true" :style="{ width: '1000px' }">
                <div v-if="selectedResult" class="archive-layout">
                    <!-- Header with Employee Info and Final Score -->
                    <div class="self-eval-header">
                        <div class="header-left">
                            <img :src="selectedResult.employeeAvatar" class="detail-avatar">
                            <div>
                                <h3>{{ selectedResult.employeeName }}</h3>
                                <p>{{ selectedResult.employeeNumber }} | {{ selectedResult.cycleName }}</p>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="proposed-score-box">
                                <span class="score-label">FINAL VERIFIED SCORE</span>
                                <span class="score-value">{{ selectedResult.finalScore }}<small>%</small></span>
                            </div>
                        </div>
                    </div>

                    <!-- Two Column Layout -->
                    <div class="archive-grid">
                        <!-- Left Column: Scoring Matrix -->
                        <div class="left-column">
                            <!-- Scoring Matrix Breakdown -->
                            <div class="info-card">
                                <div class="rating-card-header">
                                    <span class="step-number">01</span>
                                    <h4>Scoring Matrix Breakdown</h4>
                                </div>

                                <!-- Score Comparison Grid -->
                                <div class="score-comparison-grid">
                                    <div class="score-column">
                                        <div class="score-col-header">
                                            <span>CORPORATE OBJECTIVES</span>
                                            <small>Max {{ selectedResult.weights.corporateObjectives }}%</small>
                                        </div>
                                        <div class="score-row self">
                                            <label>SELF</label>
                                            <span>{{ selectedResult.selfEvaluation.corporateScore }}%</span>
                                        </div>
                                        <div class="score-row manager">
                                            <label>MANAGER</label>
                                            <span>{{ selectedResult.committeeEvaluation.corporateScore }}%</span>
                                        </div>
                                    </div>
                                    <div class="score-column highlight">
                                        <div class="score-col-header">
                                            <span>PERSONAL KPIS</span>
                                            <small>Max {{ selectedResult.weights.personalKpis }}%</small>
                                        </div>
                                        <div class="score-row self">
                                            <label>SELF</label>
                                            <span>{{ selectedResult.selfEvaluation.personalScore }}%</span>
                                        </div>
                                        <div class="score-row manager">
                                            <label>MANAGER</label>
                                            <span>{{ selectedResult.committeeEvaluation.personalScore }}%</span>
                                        </div>
                                    </div>
                                    <div class="score-column">
                                        <div class="score-col-header">
                                            <span>COMPETENCY</span>
                                            <small>Max {{ selectedResult.weights.competency }}%</small>
                                        </div>
                                        <div class="score-row self">
                                            <label>SELF</label>
                                            <span>{{ selectedResult.selfEvaluation.competencyScore }}%</span>
                                        </div>
                                        <div class="score-row manager">
                                            <label>MANAGER</label>
                                            <span>{{ selectedResult.committeeEvaluation.competencyScore }}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Justification Cards -->
                            <div class="justification-row">
                                <div class="info-card compact">
                                    <div class="card-header-label">EMPLOYEE SELF-JUSTIFICATION</div>
                                    <p class="justification-text">"{{ selectedResult.selfEvaluation.justification }}"</p>
                                </div>
                                <div class="info-card compact highlight-border">
                                    <div class="card-header-label">MANAGER REVIEW COMMENTS</div>
                                    <p class="justification-text">"{{ selectedResult.committeeEvaluation.feedback }}"</p>
                                    <div class="evaluator-line">
                                        <span>EVALUATOR</span>
                                        <strong>{{ selectedResult.evaluator.toUpperCase() }}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Action Log -->
                        <div class="right-column">
                            <div class="action-log-card">
                                <div class="action-log-header">
                                    <i class="pi pi-history"></i>
                                    <span>FULL ACTION LOG</span>
                                </div>

                                <div class="action-log-timeline">
                                    <div v-for="(log, index) in selectedResult.actionLog" :key="index" class="timeline-item">
                                        <div class="timeline-dot" :class="{ 'last': index === selectedResult.actionLog.length - 1 }"></div>
                                        <div class="timeline-content">
                                            <div class="timeline-date">{{ log.date }}</div>
                                            <div class="timeline-action">{{ log.action }}</div>
                                            <div class="timeline-by">By: {{ log.by }}</div>
                                            <div v-if="log.details" class="timeline-details">{{ log.details }}</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="audit-verified">
                                    <i class="pi pi-verified"></i>
                                    <span>IMMUTABLE AUDIT TRAIL VERIFIED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Print Official Copy" icon="pi pi-print" text @click="printCopy"></p-button>
                    <p-button label="Close View" icon="pi pi-times" @click="showArchiveModal = false"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        // Data
        const appraisalResults = ref([...StaticData.appraisalResults]);
        const departments = ref([...StaticData.departments]);
        const sections = ref([...StaticData.sections]);
        const units = ref([...StaticData.units]);
        const teams = ref([...StaticData.teams]);
        const mainGrades = ref([...StaticData.mainGrades]);
        const appraisalCycles = ref([...StaticData.appraisalCycles]);

        // Search and filters
        const searchQuery = ref('');
        const filters = ref({
            grade: null,
            cycle: null,
            department: null,
            section: null,
            unit: null,
            team: null
        });

        // Modal state
        const showArchiveModal = ref(false);
        const selectedResult = ref(null);

        // Filter options
        const gradeOptions = computed(() => [
            { name: 'All Grades', value: null },
            ...mainGrades.value.map(g => ({ name: g.name, value: g.name }))
        ]);

        const cycleOptions = computed(() => [
            { name: 'All Cycles', value: null },
            ...appraisalCycles.value.map(c => ({ name: c.name, value: c.id }))
        ]);

        const departmentOptions = computed(() => [
            { name: 'All Departments', value: null },
            ...departments.value.map(d => ({ name: d.name, value: d.name }))
        ]);

        const sectionOptions = computed(() => [
            { name: 'All Sections', value: null },
            ...sections.value.map(s => ({ name: s.name, value: s.name }))
        ]);

        const unitOptions = computed(() => [
            { name: 'All Units', value: null },
            ...units.value.map(u => ({ name: u.name, value: u.name }))
        ]);

        const teamOptions = computed(() => [
            { name: 'All Teams', value: null },
            ...teams.value.map(t => ({ name: t.name, value: t.name }))
        ]);

        // Filtered results
        const filteredResults = computed(() => {
            let result = [...appraisalResults.value];

            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(a => 
                    a.employeeName.toLowerCase().includes(query) ||
                    a.employeeNumber.toLowerCase().includes(query)
                );
            }

            if (filters.value.grade) {
                result = result.filter(a => a.gradeName === filters.value.grade);
            }

            if (filters.value.department) {
                result = result.filter(a => a.department === filters.value.department);
            }

            return result;
        });

        // Modal functions
        const openArchiveModal = (result) => {
            selectedResult.value = result;
            showArchiveModal.value = true;
        };

        const printCopy = () => {
            window.print();
        };

        const clearFilters = () => {
            searchQuery.value = '';
            filters.value = {
                grade: null,
                cycle: null,
                department: null,
                section: null,
                unit: null,
                team: null
            };
        };

        return {
            appraisalResults,
            searchQuery,
            filters,
            gradeOptions,
            cycleOptions,
            departmentOptions,
            sectionOptions,
            unitOptions,
            teamOptions,
            filteredResults,
            showArchiveModal,
            selectedResult,
            openArchiveModal,
            printCopy,
            clearFilters
        };
    }
};

window.AppraisalResultsComponent = AppraisalResultsComponent;
