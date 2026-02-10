/**
 * Appraisal Tracking Component
 * Live status monitoring of active evaluation batches
 * Modal types: Assigned, Self-Evaluation, Committee Evaluation
 */

const AppraisalTrackingComponent = {
    template: `
        <div class="appraisal-tracking-page">
            <!-- Page Header -->
            <div class="tracking-header">
                <div>
                    <h1>APPRAISAL TRACKER</h1>
                    <p>Live status monitoring of active evaluation batches.</p>
                </div>
            </div>

            <!-- Filters Section -->
            <div class="card" style="margin-bottom: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                    <span class="p-input-icon-left" style="min-width: 200px; flex: 1;">
                        <i class="pi pi-search"></i>
                        <p-inputtext v-model="searchQuery" placeholder="Search Name or ID..." style="width: 100%;"></p-inputtext>
                    </span>
                    <p-select v-model="filters.grade" :options="gradeOptions" optionLabel="name" optionValue="value" 
                              placeholder="Grades" showClear style="width: 140px;"></p-select>
                    <p-select v-model="filters.cycle" :options="cycleOptions" optionLabel="name" optionValue="value" 
                              placeholder="Cycles" showClear style="width: 180px;"></p-select>
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

            <!-- Tracking Table -->
            <div class="card">
                <p-datatable :value="filteredAppraisals" stripedRows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
                    <p-column header="Employee Info" sortable>
                        <template #body="slotProps">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <img :src="slotProps.data.employeeAvatar" :alt="slotProps.data.employeeName" style="width: 40px; height: 40px; border-radius: 50%;">
                                <div>
                                    <div style="font-weight: 600;">{{ slotProps.data.employeeName }}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-color-secondary);">{{ slotProps.data.employeeNumber }} • {{ slotProps.data.department }}</div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Appraisal Cycle" sortable>
                        <template #body="slotProps">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="pi pi-calendar" style="color: var(--text-color-secondary);"></i>
                                <span>{{ slotProps.data.cycleName }}</span>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Reviewers">
                        <template #body="slotProps">
                            <div>
                                <div v-for="reviewer in slotProps.data.reviewers" :key="reviewer.id" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #3b82f6;"></span>
                                    <span style="font-size: 0.85rem;">{{ reviewer.name }}</span>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Grade & Weights" sortable>
                        <template #body="slotProps">
                            <div>
                                <div style="font-weight: 600;">{{ slotProps.data.gradeName.toUpperCase() }}</div>
                                <div style="font-size: 0.75rem; color: var(--text-color-secondary);">
                                    C: {{ slotProps.data.weights.corporateObjectives }}% 
                                    P: {{ slotProps.data.weights.personalKpis }}% 
                                    K: {{ slotProps.data.weights.competency }}%
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Status" style="width: 260px;">
                        <template #body="slotProps">
                            <button class="appraisal-status-btn" 
                                    :class="getStatusClass(slotProps.data.status)"
                                    @click="openModal(slotProps.data)">
                                {{ getStatusLabel(slotProps.data.status) }}
                            </button>
                        </template>
                    </p-column>
                </p-datatable>
            </div>

            <!-- Modal: Appraisal Assigned (View Details) -->
            <p-dialog v-model:visible="showAssignedModal" header="Batch Assignment" :modal="true" :style="{ width: '850px' }">
                <div v-if="selectedAppraisal" class="assigned-layout">
                    <!-- Header with Employee Info and Status -->
                    <div class="self-eval-header">
                        <div class="header-left">
                            <img :src="selectedAppraisal.employeeAvatar" class="detail-avatar">
                            <div>
                                <h3>{{ selectedAppraisal.employeeName }}</h3>
                                <p>{{ selectedAppraisal.employeeNumber }} | {{ selectedAppraisal.department }}</p>
                            </div>
                        </div>
                        <div class="header-right">
                            <p-tag value="CURRENT STATUS: ASSIGNED" severity="success"></p-tag>
                        </div>
                    </div>

                    <!-- Two Column Layout -->
                    <div class="assigned-grid">
                        <!-- Left Column: Package Configuration & Weight Allocation -->
                        <div class="left-column">
                            <!-- Package Configuration Card -->
                            <div class="info-card">
                                <div class="card-header-label">PACKAGE CONFIGURATION</div>
                                
                                <div class="config-row">
                                    <label>EVALUATION CYCLE</label>
                                    <div class="config-value"><i class="pi pi-calendar"></i> {{ selectedAppraisal.cycleName }}</div>
                                </div>
                                
                                <div class="config-row">
                                    <label>GRADE FOCUS</label>
                                    <div class="config-value"><i class="pi pi-users"></i> {{ selectedAppraisal.gradeName }} Level</div>
                                </div>
                                
                                <div class="config-row">
                                    <label>BASELINE OBJECTIVES (KPIS)</label>
                                    <div class="config-value file"><i class="pi pi-file-excel"></i> {{ selectedAppraisal.kpiFile }}</div>
                                </div>
                            </div>

                            <!-- Weight Allocation Matrix Card -->
                            <div class="info-card">
                                <div class="card-header-label">WEIGHT ALLOCATION MATRIX</div>
                                <div class="weight-boxes-row">
                                    <div class="weight-box-mini">
                                        <span class="val">{{ selectedAppraisal.weights.corporateObjectives }}%</span>
                                        <span class="lbl">CORP.</span>
                                    </div>
                                    <div class="weight-box-mini primary">
                                        <span class="val">{{ selectedAppraisal.weights.personalKpis }}%</span>
                                        <span class="lbl">PERSONAL</span>
                                    </div>
                                    <div class="weight-box-mini">
                                        <span class="val">{{ selectedAppraisal.weights.competency }}%</span>
                                        <span class="lbl">COMP.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Committee Assignment -->
                        <div class="right-column">
                            <div class="committee-card">
                                <div class="committee-card-header">
                                    <i class="pi pi-users"></i>
                                    <span>COMMITTEE ASSIGNMENT</span>
                                </div>

                                <div class="committee-members">
                                    <div v-for="reviewer in selectedAppraisal.reviewers" :key="reviewer.id" class="committee-member-row">
                                        <img :src="'https://i.pravatar.cc/40?img=' + (reviewer.id + 30)" class="member-avatar">
                                        <div>
                                            <div class="member-name">{{ reviewer.name }}</div>
                                            <div class="member-role">COMMITTEE MEMBER</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Authorization Note -->
                                <div class="authorization-note">
                                    <div class="note-header">AUTHORIZATION NOTE</div>
                                    <p>"This committee is authorized to conduct the performance review for the {{ selectedAppraisal.cycleName }} period. Notification sent on {{ selectedAppraisal.notificationSentAt }}."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Close Details" icon="pi pi-times" @click="showAssignedModal = false"></p-button>
                </template>
            </p-dialog>

            <!-- Modal: Self-Evaluation -->
            <p-dialog v-model:visible="showSelfEvalModal" header="Self-Appraisal" :modal="true" :style="{ width: '1000px' }">
                <div v-if="selectedAppraisal" class="self-eval-layout">
                    <!-- Header with Employee Info and Score -->
                    <div class="self-eval-header">
                        <div class="header-left">
                            <img :src="selectedAppraisal.employeeAvatar" class="detail-avatar">
                            <div>
                                <h3>{{ selectedAppraisal.employeeName }}</h3>
                                <p>{{ selectedAppraisal.employeeNumber }} | {{ selectedAppraisal.gradeName }}</p>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="proposed-score-box">
                                <span class="score-label">PROPOSED SCORE</span>
                                <span class="score-value">{{ getSelfTotalScore() }}<small>%</small></span>
                            </div>
                            <p-tag value="EMPLOYEE PHASE" severity="warning"></p-tag>
                        </div>
                    </div>

                    <!-- Two Column Layout -->
                    <div class="self-eval-grid">
                        <!-- Left Column: Baseline & Evidence -->
                        <div class="left-column">
                            <!-- Baseline Data Card -->
                            <div class="info-card">
                                <div class="card-header">
                                    <i class="pi pi-download"></i>
                                    <span>Baseline Data</span>
                                </div>
                                <p class="card-desc">Review the target KPIs assigned to your grade level for this evaluation cycle.</p>
                                <p-button label="View KPI Matrix" icon="pi pi-external-link" outlined style="width: 100%;"></p-button>
                            </div>

                            <!-- Self-Evidence Card -->
                            <div class="info-card">
                                <div class="card-header">
                                    <i class="pi pi-cloud-upload"></i>
                                    <span>Self-Evidence</span>
                                </div>
                                <div class="upload-zone">
                                    <i class="pi pi-plus"></i>
                                    <span>UPLOAD COMPLETED REPORT</span>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Quantitative Rating -->
                        <div class="right-column">
                            <div class="rating-card">
                                <div class="rating-card-header">
                                    <span class="step-number">03</span>
                                    <h4>Quantitative Rating</h4>
                                </div>

                                <!-- Rating Inputs Grid -->
                                <div class="rating-inputs-grid">
                                    <div class="rating-input-box">
                                        <label>CORPORATE OBJ.</label>
                                        <span class="max-hint">Max: {{ selectedAppraisal.weights.corporateObjectives }}%</span>
                                        <div class="input-with-max">
                                            <p-inputnumber v-model="selfEvalForm.corporateScore" :min="0" :max="selectedAppraisal.weights.corporateObjectives" inputStyle="width: 60px; text-align: center; font-size: 1.5rem; font-weight: 600;"></p-inputnumber>
                                            <span class="divider">/</span>
                                            <span class="max-val">{{ selectedAppraisal.weights.corporateObjectives }}</span>
                                        </div>
                                    </div>
                                    <div class="rating-input-box highlight">
                                        <label>PERSONAL KPIS</label>
                                        <span class="max-hint highlight">Max: {{ selectedAppraisal.weights.personalKpis }}%</span>
                                        <div class="input-with-max">
                                            <p-inputnumber v-model="selfEvalForm.personalScore" :min="0" :max="selectedAppraisal.weights.personalKpis" inputStyle="width: 60px; text-align: center; font-size: 1.5rem; font-weight: 600; color: var(--primary-color);"></p-inputnumber>
                                            <span class="divider highlight">/</span>
                                            <span class="max-val highlight">{{ selectedAppraisal.weights.personalKpis }}</span>
                                        </div>
                                    </div>
                                    <div class="rating-input-box">
                                        <label>COMPETENCY</label>
                                        <span class="max-hint">Max: {{ selectedAppraisal.weights.competency }}%</span>
                                        <div class="input-with-max">
                                            <p-inputnumber v-model="selfEvalForm.competencyScore" :min="0" :max="selectedAppraisal.weights.competency" inputStyle="width: 60px; text-align: center; font-size: 1.5rem; font-weight: 600;"></p-inputnumber>
                                            <span class="divider">/</span>
                                            <span class="max-val">{{ selectedAppraisal.weights.competency }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Final Manager Rating Bar -->
                                <div class="final-rating-bar">
                                    <div class="bar-left">
                                        <i class="pi pi-chart-bar"></i>
                                        <div>
                                            <strong>FINAL MANAGER RATING</strong>
                                            <span>Calculated Score out of 100%</span>
                                        </div>
                                    </div>
                                    <div class="bar-score">{{ getSelfTotalScore() }}%</div>
                                </div>

                                <!-- Justification -->
                                <div class="justification-section">
                                    <label>SELF-JUSTIFICATION & COMMENTS</label>
                                    <p-textarea v-model="selfEvalForm.justification" rows="3" placeholder="Provide context for your ratings..." style="width: 100%;"></p-textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Info Note -->
                    <div class="info-note">
                        <i class="pi pi-info-circle"></i>
                        <div>
                            <strong>Next Action: Supervisor Review</strong>
                            <p>Your ratings will be submitted for committee verification.</p>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" icon="pi pi-times" text @click="showSelfEvalModal = false"></p-button>
                    <p-button label="Submit Evaluation" icon="pi pi-check" @click="submitSelfEvaluation"></p-button>
                </template>
            </p-dialog>

            <!-- Modal: Committee Evaluation -->
            <p-dialog v-model:visible="showCommitteeModal" header="Managerial Review" :modal="true" :style="{ width: '1050px' }">
                <div v-if="selectedAppraisal" class="committee-eval-layout">
                    <!-- Header with Employee Info and Score -->
                    <div class="self-eval-header">
                        <div class="header-left">
                            <img :src="selectedAppraisal.employeeAvatar" class="detail-avatar">
                            <div>
                                <h3>{{ selectedAppraisal.employeeName }}</h3>
                                <p>{{ selectedAppraisal.employeeNumber }} | {{ selectedAppraisal.gradeName }}</p>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="proposed-score-box">
                                <span class="score-label">COMMITTEE RESULT</span>
                                <span class="score-value">{{ getCommitteeTotalScore() }}<small>%</small></span>
                            </div>
                            <p-tag value="COMMITTEE PHASE" severity="info"></p-tag>
                        </div>
                    </div>

                    <!-- Two Column Layout -->
                    <div class="committee-grid">
                        <!-- Left Column: Employee Submission -->
                        <div class="left-column">
                            <!-- Employee Submission Card -->
                            <div class="info-card">
                                <div class="card-header-row">
                                    <span>Employee Submission</span>
                                    <p-tag :value="(selectedAppraisal.selfEvaluation?.totalScore || 0) + '%'" severity="warning" style="font-size: 0.75rem;"></p-tag>
                                </div>

                                <!-- Score Bars -->
                                <div class="score-bar-item">
                                    <div class="score-bar-header">
                                        <span>CORPORATE OBJ.</span>
                                        <span>{{ selectedAppraisal.selfEvaluation?.corporateScore || 0 }}% <small>/ {{ selectedAppraisal.weights.corporateObjectives }}%</small></span>
                                    </div>
                                    <div class="score-bar-track">
                                        <div class="score-bar-fill" :style="{ width: ((selectedAppraisal.selfEvaluation?.corporateScore || 0) / selectedAppraisal.weights.corporateObjectives * 100) + '%' }"></div>
                                    </div>
                                </div>

                                <div class="score-bar-item">
                                    <div class="score-bar-header">
                                        <span>PERSONAL KPIS</span>
                                        <span>{{ selectedAppraisal.selfEvaluation?.personalScore || 0 }}% <small>/ {{ selectedAppraisal.weights.personalKpis }}%</small></span>
                                    </div>
                                    <div class="score-bar-track">
                                        <div class="score-bar-fill" :style="{ width: ((selectedAppraisal.selfEvaluation?.personalScore || 0) / selectedAppraisal.weights.personalKpis * 100) + '%' }"></div>
                                    </div>
                                </div>

                                <div class="score-bar-item">
                                    <div class="score-bar-header">
                                        <span>COMPETENCY</span>
                                        <span>{{ selectedAppraisal.selfEvaluation?.competencyScore || 0 }}% <small>/ {{ selectedAppraisal.weights.competency }}%</small></span>
                                    </div>
                                    <div class="score-bar-track">
                                        <div class="score-bar-fill" :style="{ width: ((selectedAppraisal.selfEvaluation?.competencyScore || 0) / selectedAppraisal.weights.competency * 100) + '%' }"></div>
                                    </div>
                                </div>

                                <!-- Self Justification -->
                                <div class="self-justification-box">
                                    <label>SELF JUSTIFICATION</label>
                                    <p>"{{ selectedAppraisal.selfEvaluation?.justification || 'No justification provided.' }}"</p>
                                </div>
                            </div>

                            <!-- Manager Assessment Doc -->
                            <div class="info-card">
                                <div class="card-header">
                                    <i class="pi pi-cloud-upload"></i>
                                    <span>Manager Assessment Doc</span>
                                </div>
                                <div class="upload-zone">
                                    <span>UPLOAD APPRAISAL SUMMARY</span>
                                    <small>PDF / XLSX only</small>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Managerial Assessment -->
                        <div class="right-column">
                            <div class="rating-card">
                                <div class="rating-card-header">
                                    <span class="step-number">02</span>
                                    <h4>Managerial Assessment</h4>
                                </div>

                                <!-- Rating Inputs Grid -->
                                <div class="rating-inputs-grid">
                                    <div class="rating-input-box">
                                        <label>CORPORATE OBJ.</label>
                                        <span class="max-hint">Max: {{ selectedAppraisal.weights.corporateObjectives }}%</span>
                                        <div class="input-with-max">
                                            <p-inputnumber v-model="committeeForm.corporateScore" :min="0" :max="selectedAppraisal.weights.corporateObjectives" inputStyle="width: 60px; text-align: center; font-size: 1.5rem; font-weight: 600;"></p-inputnumber>
                                            <span class="divider">/</span>
                                            <span class="max-val">{{ selectedAppraisal.weights.corporateObjectives }}</span>
                                        </div>
                                    </div>
                                    <div class="rating-input-box highlight">
                                        <label>PERSONAL KPIS</label>
                                        <span class="max-hint highlight">Max: {{ selectedAppraisal.weights.personalKpis }}%</span>
                                        <div class="input-with-max">
                                            <p-inputnumber v-model="committeeForm.personalScore" :min="0" :max="selectedAppraisal.weights.personalKpis" inputStyle="width: 60px; text-align: center; font-size: 1.5rem; font-weight: 600; color: var(--primary-color);"></p-inputnumber>
                                            <span class="divider highlight">/</span>
                                            <span class="max-val highlight">{{ selectedAppraisal.weights.personalKpis }}</span>
                                        </div>
                                    </div>
                                    <div class="rating-input-box">
                                        <label>COMPETENCY</label>
                                        <span class="max-hint">Max: {{ selectedAppraisal.weights.competency }}%</span>
                                        <div class="input-with-max">
                                            <p-inputnumber v-model="committeeForm.competencyScore" :min="0" :max="selectedAppraisal.weights.competency" inputStyle="width: 60px; text-align: center; font-size: 1.5rem; font-weight: 600;"></p-inputnumber>
                                            <span class="divider">/</span>
                                            <span class="max-val">{{ selectedAppraisal.weights.competency }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Final Manager Rating Bar -->
                                <div class="final-rating-bar">
                                    <div class="bar-left">
                                        <i class="pi pi-chart-bar"></i>
                                        <div>
                                            <strong>FINAL MANAGER RATING</strong>
                                            <span>Calculated Score out of 100%</span>
                                        </div>
                                    </div>
                                    <div class="bar-score">{{ getCommitteeTotalScore() }}%</div>
                                </div>

                                <!-- Feedback -->
                                <div class="justification-section">
                                    <label>MANAGERIAL FEEDBACK & DEVELOPMENTAL GOALS</label>
                                    <p-textarea v-model="committeeForm.feedback" rows="3" placeholder="Provide constructive feedback based on the scores above..." style="width: 100%;"></p-textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Info Note -->
                    <div class="info-note warning">
                        <i class="pi pi-exclamation-triangle"></i>
                        <div>
                            <strong>Final Authorization</strong>
                            <p>Submit these scores to finalize the annual evaluation for this employee.</p>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" icon="pi pi-times" text @click="showCommitteeModal = false"></p-button>
                    <p-button label="Final Approval" icon="pi pi-check" severity="success" @click="submitCommitteeEvaluation"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        // Data
        const appraisalAssignments = ref([...StaticData.appraisalAssignments]);
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

        // Modal states
        const showAssignedModal = ref(false);
        const showSelfEvalModal = ref(false);
        const showCommitteeModal = ref(false);
        const selectedAppraisal = ref(null);

        // Form data
        const selfEvalForm = ref({
            corporateScore: 0,
            personalScore: 0,
            competencyScore: 0,
            justification: ''
        });

        const committeeForm = ref({
            corporateScore: 0,
            personalScore: 0,
            competencyScore: 0,
            feedback: ''
        });

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

        // Filtered appraisals
        const filteredAppraisals = computed(() => {
            let result = [...appraisalAssignments.value];

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

            if (filters.value.cycle) {
                result = result.filter(a => a.cycleId === filters.value.cycle);
            }

            if (filters.value.department) {
                result = result.filter(a => a.department === filters.value.department);
            }

            return result;
        });

        // Status helpers
        const getStatusClass = (status) => {
            switch (status) {
                case 'assigned': return 'assigned';
                case 'self_evaluation': return 'self-eval';
                case 'committee_evaluation': return 'committee';
                case 'completed': return 'completed';
                default: return '';
            }
        };

        const getStatusLabel = (status) => {
            switch (status) {
                case 'assigned': return 'APPRAISAL ASSIGNED';
                case 'self_evaluation': return 'START SELF EVALUATION';
                case 'committee_evaluation': return 'UNDER COMMITTEE EVALUATION';
                case 'completed': return 'COMPLETED';
                default: return status.toUpperCase();
            }
        };

        const getStatusSeverity = (status) => {
            switch (status) {
                case 'assigned': return 'info';
                case 'self_evaluation': return 'warning';
                case 'committee_evaluation': return 'success';
                case 'completed': return 'success';
                default: return 'secondary';
            }
        };

        // Modal functions
        const openModal = (appraisal) => {
            selectedAppraisal.value = appraisal;

            if (appraisal.status === 'assigned') {
                showAssignedModal.value = true;
            } else if (appraisal.status === 'self_evaluation') {
                if (appraisal.selfEvaluation) {
                    selfEvalForm.value = {
                        corporateScore: appraisal.selfEvaluation.corporateScore || 0,
                        personalScore: appraisal.selfEvaluation.personalScore || 0,
                        competencyScore: appraisal.selfEvaluation.competencyScore || 0,
                        justification: appraisal.selfEvaluation.justification || ''
                    };
                } else {
                    selfEvalForm.value = { corporateScore: 0, personalScore: 0, competencyScore: 0, justification: '' };
                }
                showSelfEvalModal.value = true;
            } else if (appraisal.status === 'committee_evaluation') {
                if (appraisal.committeeEvaluation) {
                    committeeForm.value = {
                        corporateScore: appraisal.committeeEvaluation.corporateScore || 0,
                        personalScore: appraisal.committeeEvaluation.personalScore || 0,
                        competencyScore: appraisal.committeeEvaluation.competencyScore || 0,
                        feedback: appraisal.committeeEvaluation.feedback || ''
                    };
                } else {
                    committeeForm.value = { corporateScore: 0, personalScore: 0, competencyScore: 0, feedback: '' };
                }
                showCommitteeModal.value = true;
            }
        };

        const getSelfTotalScore = () => {
            return (selfEvalForm.value.corporateScore || 0) + 
                   (selfEvalForm.value.personalScore || 0) + 
                   (selfEvalForm.value.competencyScore || 0);
        };

        const getCommitteeTotalScore = () => {
            return (committeeForm.value.corporateScore || 0) + 
                   (committeeForm.value.personalScore || 0) + 
                   (committeeForm.value.competencyScore || 0);
        };

        const submitSelfEvaluation = () => {
            if (selectedAppraisal.value) {
                const idx = appraisalAssignments.value.findIndex(a => a.id === selectedAppraisal.value.id);
                if (idx !== -1) {
                    appraisalAssignments.value[idx].selfEvaluation = {
                        ...selfEvalForm.value,
                        totalScore: getSelfTotalScore(),
                        submittedAt: new Date().toLocaleDateString('en-GB')
                    };
                    appraisalAssignments.value[idx].status = 'committee_evaluation';
                }
            }
            showSelfEvalModal.value = false;
        };

        const submitCommitteeEvaluation = () => {
            if (selectedAppraisal.value) {
                const idx = appraisalAssignments.value.findIndex(a => a.id === selectedAppraisal.value.id);
                if (idx !== -1) {
                    appraisalAssignments.value[idx].committeeEvaluation = {
                        ...committeeForm.value,
                        totalScore: getCommitteeTotalScore(),
                        submittedAt: new Date().toLocaleDateString('en-GB')
                    };
                    appraisalAssignments.value[idx].status = 'completed';
                }
            }
            showCommitteeModal.value = false;
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
            appraisalAssignments,
            searchQuery,
            filters,
            gradeOptions,
            cycleOptions,
            departmentOptions,
            sectionOptions,
            unitOptions,
            teamOptions,
            filteredAppraisals,
            showAssignedModal,
            showSelfEvalModal,
            showCommitteeModal,
            selectedAppraisal,
            selfEvalForm,
            committeeForm,
            getStatusClass,
            getStatusLabel,
            getStatusSeverity,
            openModal,
            getSelfTotalScore,
            getCommitteeTotalScore,
            submitSelfEvaluation,
            submitCommitteeEvaluation,
            clearFilters
        };
    }
};

window.AppraisalTrackingComponent = AppraisalTrackingComponent;
