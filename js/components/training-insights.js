/**
 * Training Insights Component
 * Analytics and deep dive into training performance
 */

const TrainingInsightsComponent = {
    template: `
        <div class="training-insights-page">
            <!-- Page Header -->
            <div class="page-header-row">
                <div>
                    <h1>Analytics Insights</h1>
                    <p>Deep dive into training performance and engagement metrics.</p>
                </div>
            </div>

            <!-- Insight Tabs -->
            <div class="insight-tabs-container">
                <div class="insight-tabs">
                    <button class="insight-tab" :class="{ active: activeTab === 'cycle' }" @click="activeTab = 'cycle'">
                        Cycle Information
                    </button>
                    <button class="insight-tab" :class="{ active: activeTab === 'path' }" @click="activeTab = 'path'">
                        Path Information
                    </button>
                    <button class="insight-tab" :class="{ active: activeTab === 'performance' }" @click="activeTab = 'performance'">
                        Performance
                    </button>
                </div>
            </div>

            <!-- Cycle Information Tab -->
            <div v-if="activeTab === 'cycle'" class="insight-content">
                <div class="card filters-card">
                    <div class="insight-filters">
                        <div class="filter-field">
                            <label>TARGET CYCLE *</label>
                            <p-select v-model="cycleFilters.targetCycle" :options="cycleOptions" 
                                      placeholder="Select Cycle" style="width: 150px;"></p-select>
                        </div>
                        <div class="filter-field">
                            <label>DEPARTMENT</label>
                            <p-select v-model="cycleFilters.department" :options="departmentOptions" optionLabel="label" optionValue="value"
                                      placeholder="All Departments" showClear style="width: 180px;"></p-select>
                        </div>
                        <div class="filter-field">
                            <label>SECTION</label>
                            <p-select v-model="cycleFilters.section" :options="sectionOptions" optionLabel="label" optionValue="value"
                                      placeholder="All Sections" showClear style="width: 160px;" :disabled="!cycleFilters.department"></p-select>
                        </div>
                        <div class="filter-field">
                            <label>GRADE</label>
                            <p-select v-model="cycleFilters.grade" :options="gradeOptions" optionLabel="label" optionValue="value"
                                      placeholder="All Grades" showClear style="width: 140px;"></p-select>
                        </div>
                        <div class="filter-field">
                            <label>MONTH</label>
                            <p-select v-model="cycleFilters.month" :options="monthOptions" optionLabel="label" optionValue="value"
                                      placeholder="All Months" showClear style="width: 140px;"></p-select>
                        </div>
                        <div class="filter-field">
                            <label>YEAR</label>
                            <p-select v-model="cycleFilters.year" :options="yearOptions" optionLabel="label" optionValue="value"
                                      placeholder="All Years" showClear style="width: 130px;"></p-select>
                        </div>
                    </div>
                </div>

                <div class="insight-stats-grid">
                    <div class="insight-stat-card">
                        <div class="stat-value">{{ cycleStats.assigned }}</div>
                        <div class="stat-label">ASSIGNED</div>
                    </div>
                    <div class="insight-stat-card">
                        <div class="stat-value">{{ cycleStats.inProgress }}</div>
                        <div class="stat-label">IN PROGRESS</div>
                    </div>
                    <div class="insight-stat-card">
                        <div class="stat-value green">{{ cycleStats.completed }}</div>
                        <div class="stat-label">COMPLETED</div>
                    </div>
                    <div class="insight-stat-card">
                        <div class="stat-value red">{{ cycleStats.failed }}</div>
                        <div class="stat-label">FAILED</div>
                    </div>
                    <div class="insight-stat-card highlight">
                        <div class="stat-value">{{ cycleStats.hoursAchieved }}</div>
                        <div class="stat-label">HOURS ACHIEVED</div>
                    </div>
                </div>
            </div>

            <!-- Path Information Tab -->
            <div v-if="activeTab === 'path'" class="insight-content">
                <div class="card filters-card">
                    <div class="insight-filters">
                        <div class="filter-field">
                            <label>TRAINING PATH NAME *</label>
                            <p-select v-model="pathFilters.pathName" :options="pathOptions" optionLabel="label" optionValue="value"
                                      placeholder="Select Path" style="width: 250px;"></p-select>
                        </div>
                    </div>
                </div>

                <div class="insight-stats-grid">
                    <div class="insight-stat-card">
                        <div class="stat-value">{{ pathStats.assigned }}</div>
                        <div class="stat-label">ASSIGNED</div>
                    </div>
                    <div class="insight-stat-card">
                        <div class="stat-value">{{ pathStats.inProgress }}</div>
                        <div class="stat-label">IN PROGRESS</div>
                    </div>
                    <div class="insight-stat-card">
                        <div class="stat-value green">{{ pathStats.completed }}</div>
                        <div class="stat-label">COMPLETED</div>
                    </div>
                    <div class="insight-stat-card">
                        <div class="stat-value red">{{ pathStats.failed }}</div>
                        <div class="stat-label">FAILED</div>
                    </div>
                    <div class="insight-stat-card highlight">
                        <div class="stat-value">{{ pathStats.hoursAchieved }}</div>
                        <div class="stat-label">HOURS ACHIEVED</div>
                    </div>
                </div>
            </div>

            <!-- Performance Tab -->
            <div v-if="activeTab === 'performance'" class="insight-content">
                <div class="performance-stats-grid">
                    <div class="performance-stat-card">
                        <div class="stat-value">{{ performanceStats.totalPaths }}</div>
                        <div class="stat-label">TOTAL TRAINING PATHS</div>
                    </div>
                    <div class="performance-stat-card">
                        <div class="stat-value blue">{{ performanceStats.totalHoursAssigned }}</div>
                        <div class="stat-label">TOTAL HOURS ASSIGNED</div>
                    </div>
                    <div class="performance-stat-card">
                        <div class="stat-value green">{{ performanceStats.totalHoursAchieved }}</div>
                        <div class="stat-label">TOTAL HOURS ACHIEVED</div>
                    </div>
                    <div class="performance-stat-card highlight">
                        <div class="stat-value">{{ performanceStats.completionRate }}%</div>
                        <div class="stat-label">HOUR COMPLETION RATE</div>
                    </div>
                </div>

                <div class="card">
                    <div class="section-header">
                        <i class="pi pi-lock"></i>
                        <h3>Cycle Assignment Distribution</h3>
                    </div>
                    <div class="cycle-distribution-grid">
                        <div class="cycle-card" v-for="cycle in cycleDistribution" :key="cycle.id">
                            <div class="cycle-value">{{ cycle.count }}</div>
                            <div class="cycle-label">{{ cycle.label }}</div>
                            <div class="cycle-sublabel">EMPLOYEES</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { ref } = Vue;

        const activeTab = ref('cycle');

        const cycleFilters = ref({
            targetCycle: 'Cycle 1',
            department: null,
            section: null,
            grade: null,
            month: null,
            year: null
        });

        const pathFilters = ref({
            pathName: 'Cybersecurity Essentials'
        });

        const cycleOptions = ref(['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5', 'Cycle 6', 'Cycle 7', 'Cycle 8', 'Cycle 9', 'Cycle 10']);
        
        const departmentOptions = ref([
            { label: 'Engineering', value: 'Engineering' },
            { label: 'Sales', value: 'Sales' },
            { label: 'Marketing', value: 'Marketing' },
            { label: 'Human Resources', value: 'Human Resources' }
        ]);

        const sectionOptions = ref([
            { label: 'Frontend', value: 'Frontend' },
            { label: 'Backend', value: 'Backend' },
            { label: 'QA', value: 'QA' }
        ]);

        const gradeOptions = ref([
            { label: 'Grade 1', value: '1' },
            { label: 'Grade 2', value: '2' },
            { label: 'Grade 3', value: '3' },
            { label: 'Grade 4', value: '4' },
            { label: 'Grade 5', value: '5' }
        ]);

        const monthOptions = ref([
            { label: 'January', value: '1' }, { label: 'February', value: '2' },
            { label: 'March', value: '3' }, { label: 'April', value: '4' },
            { label: 'May', value: '5' }, { label: 'June', value: '6' },
            { label: 'July', value: '7' }, { label: 'August', value: '8' },
            { label: 'September', value: '9' }, { label: 'October', value: '10' },
            { label: 'November', value: '11' }, { label: 'December', value: '12' }
        ]);

        const yearOptions = ref([
            { label: '2024', value: '2024' },
            { label: '2025', value: '2025' },
            { label: '2026', value: '2026' }
        ]);

        const pathOptions = ref([
            { label: 'Cybersecurity Essentials', value: 'Cybersecurity Essentials' },
            { label: 'Leadership & Management', value: 'Leadership & Management' },
            { label: 'Python for Data Analysis', value: 'Python for Data Analysis' },
            { label: 'Workplace Safety & Health', value: 'Workplace Safety & Health' }
        ]);

        const cycleStats = ref({
            assigned: 5,
            inProgress: 2,
            completed: 1,
            failed: 2,
            hoursAchieved: 15
        });

        const pathStats = ref({
            assigned: 3,
            inProgress: 1,
            completed: 0,
            failed: 2,
            hoursAchieved: 0
        });

        const performanceStats = ref({
            totalPaths: 10,
            totalHoursAssigned: 20591,
            totalHoursAchieved: 103,
            completionRate: 1
        });

        const cycleDistribution = ref([
            { id: 1, label: 'CYCLE 1', count: 5 },
            { id: 2, label: 'CYCLE 2', count: 5 },
            { id: 3, label: 'CYCLE 3', count: 5 },
            { id: 4, label: 'CYCLE 4', count: 5 },
            { id: 5, label: 'CYCLE 5', count: 0 },
            { id: 6, label: 'CYCLE 6', count: 499 },
            { id: 7, label: 'CYCLE 7', count: 0 },
            { id: 8, label: 'CYCLE 8', count: 0 },
            { id: 9, label: 'CYCLE 9', count: 0 },
            { id: 10, label: 'CYCLE 10', count: 0 },
            { id: 11, label: 'ON BOARDING', count: 5 }
        ]);

        return {
            activeTab,
            cycleFilters,
            pathFilters,
            cycleOptions,
            departmentOptions,
            sectionOptions,
            gradeOptions,
            monthOptions,
            yearOptions,
            pathOptions,
            cycleStats,
            pathStats,
            performanceStats,
            cycleDistribution
        };
    }
};

window.TrainingInsightsComponent = TrainingInsightsComponent;
