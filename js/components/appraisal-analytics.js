/**
 * Appraisal Analytics Component
 * Live performance tracking and insights dashboard
 */

const AppraisalAnalyticsComponent = {
    template: `
        <div class="analytics-page">
            <!-- Header Row with Two Cards -->
            <div class="analytics-header-row">
                <!-- Left: Cycle Info Card -->
                <div class="analytics-header-section">
                    <div class="header-left-content">
                        <div class="cycle-label">ACTIVE ANALYSIS CYCLE</div>
                        <h1>APRIL 2024 - APRIL 2025</h1>
                        <div class="live-indicator">
                            <span class="live-dot"></span>
                            <span>LIVE PERFORMANCE TRACKING</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Organization Coverage Card -->
                <div class="organization-coverage-card">
                    <div class="coverage-header">
                        <span>ORGANIZATION COVERAGE</span>
                        <span class="coverage-percent">{{ organizationCoverage }}%</span>
                    </div>
                    <div class="coverage-progress">
                        <div class="coverage-progress-bar" :style="{ width: organizationCoverage + '%' }"></div>
                    </div>
                    <div class="coverage-detail">{{ completedCount }} OF {{ totalEmployees }} EMPLOYEES IN CYCLE</div>
                </div>
            </div>

            <!-- Stats Cards Row -->
            <div class="analytics-stats-row">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="pi pi-file-edit"></i>
                    </div>
                    <div class="stat-value">{{ stats.assigned }}</div>
                    <div class="stat-label">ASSIGNED</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="pi pi-user-edit"></i>
                    </div>
                    <div class="stat-value">{{ stats.selfEval }}</div>
                    <div class="stat-label">SELF EVAL</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="pi pi-users"></i>
                    </div>
                    <div class="stat-value">{{ stats.committee }}</div>
                    <div class="stat-label">COMMITTEE</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div class="stat-value">{{ stats.completed }}</div>
                    <div class="stat-label">COMPLETED</div>
                </div>
            </div>

            <!-- Main Analytics Grid -->
            <div class="analytics-main-grid">
                <!-- Left Column: Results Analysis -->
                <div class="analytics-left-column">
                    <div class="card analysis-card">
                        <h3>APPRAISAL RESULTS ANALYSIS</h3>
                        
                        <div class="analysis-content">
                            <!-- Cycle Average Score -->
                            <div class="cycle-average-section">
                                <div class="avg-label">CYCLE AVERAGE SCORE</div>
                                <div class="avg-score">{{ cycleAverageScore }}%</div>
                                <p class="avg-description">The organization is performing at "Meets Expectations" level for the current cycle.</p>
                                
                                <div class="alignment-bar">
                                    <div class="alignment-label">
                                        <span>SELF-MANAGER ALIGNMENT</span>
                                        <span>{{ alignmentPercent }}%</span>
                                    </div>
                                    <div class="alignment-track">
                                        <div class="alignment-fill" :style="{ width: alignmentPercent + '%' }"></div>
                                    </div>
                                </div>
                                <p class="alignment-note">Analysis shows high discrepancy in self-ratings compared to committee final results.</p>
                            </div>

                            <!-- Strategic Insights -->
                            <div class="strategic-insights">
                                <div class="insights-header">STRATEGIC INSIGHTS</div>
                                
                                <div class="insight-item">
                                    <div class="insight-icon gold">
                                        <i class="pi pi-trophy"></i>
                                    </div>
                                    <div class="insight-content">
                                        <div class="insight-title">Top Department</div>
                                        <div class="insight-text">IT leads with 95% completion & average 88% score.</div>
                                    </div>
                                </div>
                                
                                <div class="insight-item">
                                    <div class="insight-icon blue">
                                        <i class="pi pi-chart-line"></i>
                                    </div>
                                    <div class="insight-content">
                                        <div class="insight-title">Goal Realization</div>
                                        <div class="insight-text">Corporate KPIs are being met at a higher rate (92%) than personal ones (78%).</div>
                                    </div>
                                </div>
                                
                                <div class="insight-item">
                                    <div class="insight-icon red">
                                        <i class="pi pi-exclamation-triangle"></i>
                                    </div>
                                    <div class="insight-content">
                                        <div class="insight-title">Competency Gaps</div>
                                        <div class="insight-text">Communication skills identified as a priority development area in Finance.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Score Distribution & Verdict -->
                <div class="analytics-right-column">
                    <!-- Score Distribution Card -->
                    <div class="orange-analytics-card">
                        <h4>SCORE DISTRIBUTION</h4>
                        
                        <div class="distribution-bars">
                            <div class="distribution-row">
                                <div class="dist-label">EXCEPTIONAL (90%+)</div>
                                <div class="dist-bar-container">
                                    <div class="dist-bar green" :style="{ width: distribution.exceptional.percent + '%' }"></div>
                                </div>
                                <div class="dist-count">{{ distribution.exceptional.count }}</div>
                            </div>
                            <div class="distribution-row">
                                <div class="dist-label">MEETS EXPECTATIONS</div>
                                <div class="dist-bar-container">
                                    <div class="dist-bar blue" :style="{ width: distribution.meets.percent + '%' }"></div>
                                </div>
                                <div class="dist-count">{{ distribution.meets.count }}</div>
                            </div>
                            <div class="distribution-row">
                                <div class="dist-label">NEEDS IMPROVEMENT</div>
                                <div class="dist-bar-container">
                                    <div class="dist-bar orange" :style="{ width: distribution.needs.percent + '%' }"></div>
                                </div>
                                <div class="dist-count">{{ distribution.needs.count }}</div>
                            </div>
                            <div class="distribution-row">
                                <div class="dist-label">UNSATISFACTORY</div>
                                <div class="dist-bar-container">
                                    <div class="dist-bar red" :style="{ width: distribution.unsatisfactory.percent + '%' }"></div>
                                </div>
                                <div class="dist-count">{{ distribution.unsatisfactory.count }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Manager Verdict Card -->
                    <div class="orange-analytics-card verdict-card">
                        <h4><i class="pi pi-comment"></i> MANAGER VERDICT</h4>
                        <p class="verdict-text">"The workforce shows strong technical alignment, but cross-functional leadership indicators remain a bottleneck for high-tier grades."</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        // Get data from static data
        const appraisalResults = ref([...StaticData.appraisalResults]);
        const appraisalAssignments = ref([...(StaticData.appraisalAssignments || [])]);

        // Calculate stats
        const stats = computed(() => {
            const assignments = appraisalAssignments.value;
            return {
                assigned: assignments.filter(a => a.status === 'assigned').length,
                selfEval: assignments.filter(a => a.status === 'self-evaluation').length,
                committee: assignments.filter(a => a.status === 'committee').length,
                completed: appraisalResults.value.length
            };
        });

        const totalEmployees = computed(() => {
            return stats.value.assigned + stats.value.selfEval + stats.value.committee + stats.value.completed;
        });

        const completedCount = computed(() => stats.value.completed);

        const organizationCoverage = computed(() => {
            if (totalEmployees.value === 0) return 0;
            return Math.round((completedCount.value / totalEmployees.value) * 100);
        });

        // Calculate cycle average score
        const cycleAverageScore = computed(() => {
            if (appraisalResults.value.length === 0) return 0;
            const total = appraisalResults.value.reduce((sum, r) => sum + r.finalScore, 0);
            return Math.round(total / appraisalResults.value.length);
        });

        // Self-Manager alignment (mock calculation)
        const alignmentPercent = computed(() => {
            if (appraisalResults.value.length === 0) return 0;
            let alignmentSum = 0;
            appraisalResults.value.forEach(r => {
                const diff = Math.abs(r.selfScore - r.finalScore);
                alignmentSum += Math.max(0, 100 - diff * 5);
            });
            return Math.round(alignmentSum / appraisalResults.value.length);
        });

        // Score distribution
        const distribution = computed(() => {
            const results = appraisalResults.value;
            const exceptional = results.filter(r => r.finalScore >= 90);
            const meets = results.filter(r => r.finalScore >= 70 && r.finalScore < 90);
            const needs = results.filter(r => r.finalScore >= 50 && r.finalScore < 70);
            const unsatisfactory = results.filter(r => r.finalScore < 50);

            const maxCount = Math.max(exceptional.length, meets.length, needs.length, unsatisfactory.length, 1);

            return {
                exceptional: { count: exceptional.length, percent: (exceptional.length / maxCount) * 100 },
                meets: { count: meets.length, percent: (meets.length / maxCount) * 100 },
                needs: { count: needs.length, percent: (needs.length / maxCount) * 100 },
                unsatisfactory: { count: unsatisfactory.length, percent: (unsatisfactory.length / maxCount) * 100 }
            };
        });

        return {
            stats,
            totalEmployees,
            completedCount,
            organizationCoverage,
            cycleAverageScore,
            alignmentPercent,
            distribution
        };
    }
};

window.AppraisalAnalyticsComponent = AppraisalAnalyticsComponent;
