/**
 * Stats Module Component
 * Comprehensive analytics dashboard with Static & Dynamic insights
 */

// ATTENDANCE STATIC INSIGHTS
const AttendanceStaticInsights = {
    props: ['dateRange', 'customRangeApplied', 'customRangeDates'],
    emits: ['open-date-picker'],
    template: `
        <div class="static-insights-content">
            <div class="period-cards-grid">
                <!-- Regular period cards -->
                <div v-for="period in regularPeriods" :key="period.id" class="period-card">
                    <div class="period-header">
                        <span class="period-title">{{ period.title }}</span>
                        <span class="period-date">{{ period.date }}</span>
                    </div>
                    <div class="main-stat">
                        <i class="pi pi-users"></i>
                        <span class="stat-label">Total Staff</span>
                        <span class="stat-value">{{ period.totalStaff }}</span>
                    </div>
                    <div class="stats-section">
                        <div class="section-label"><i class="pi pi-users"></i> ATTENDANCE STATUS</div>
                        <div class="stats-list">
                            <div class="stat-row" v-for="stat in period.attendanceStats" :key="stat.label">
                                <span class="stat-dot" :class="stat.color"></span>
                                <span>{{ stat.label }}</span>
                                <span class="stat-num">{{ stat.value }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-section">
                        <div class="section-label"><i class="pi pi-calendar"></i> VACATION STATUS</div>
                        <div class="stats-list">
                            <div class="stat-row" v-for="stat in period.vacationStats" :key="stat.label">
                                <span class="stat-dot" :class="stat.color"></span>
                                <span>{{ stat.label }}</span>
                                <span class="stat-num">{{ stat.value }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-section">
                        <div class="section-label"><i class="pi pi-flag"></i> PUNCH FLAG</div>
                        <div class="stats-list">
                            <div class="stat-row" v-for="stat in period.punchStats" :key="stat.label">
                                <span class="stat-dot" :class="stat.color"></span>
                                <span>{{ stat.label }}</span>
                                <span class="stat-num">{{ stat.value }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-section">
                        <div class="section-label"><i class="pi pi-exclamation-triangle"></i> VIOLATIONS</div>
                        <div class="stats-list">
                            <div class="stat-row" v-for="stat in period.violationStats" :key="stat.label">
                                <span class="stat-dot" :class="stat.color"></span>
                                <span>{{ stat.label }}</span>
                                <span class="stat-num">{{ stat.value }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-section performance">
                        <div class="section-label"><i class="pi pi-chart-bar"></i> PERFORMANCE</div>
                        <div class="stats-list">
                            <div class="stat-row" v-for="stat in period.performanceStats" :key="stat.label">
                                <span class="stat-label-with-tooltip">
                                    {{ stat.label }}
                                    <i class="pi pi-info-circle tooltip-icon" v-tooltip.top="performanceTooltips[stat.label]"></i>
                                </span>
                                <span class="stat-percent" :class="stat.color">{{ stat.value }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Custom Range Card - Always shown at last -->
                <div class="period-card custom-range-card" :class="{ highlighted: customRangeApplied, 'not-applied': !customRangeApplied }" @click="!customRangeApplied && $emit('open-date-picker')">
                    <div class="period-header">
                        <span class="period-title">CUSTOM RANGE</span>
                        <span class="period-date" v-if="customRangeApplied">{{ formattedDateRange }}</span>
                        <span class="period-date" v-else>Not Applied</span>
                    </div>
                    
                    <!-- Placeholder when not applied -->
                    <div v-if="!customRangeApplied" class="custom-range-placeholder">
                        <i class="pi pi-calendar-plus"></i>
                        <span class="placeholder-text">Apply Custom Range</span>
                        <p class="placeholder-hint">Click to select a date range</p>
                    </div>
                    
                    <!-- Data content when applied -->
                    <template v-else>
                        <div class="main-stat">
                            <i class="pi pi-users"></i>
                            <span class="stat-label">Total Staff</span>
                            <span class="stat-value">{{ customPeriod.totalStaff }}</span>
                        </div>
                        <div class="stats-section">
                            <div class="section-label"><i class="pi pi-users"></i> ATTENDANCE STATUS</div>
                            <div class="stats-list">
                                <div class="stat-row" v-for="stat in customPeriod.attendanceStats" :key="stat.label">
                                    <span class="stat-dot" :class="stat.color"></span>
                                    <span>{{ stat.label }}</span>
                                    <span class="stat-num">{{ stat.value }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="stats-section">
                            <div class="section-label"><i class="pi pi-calendar"></i> VACATION STATUS</div>
                            <div class="stats-list">
                                <div class="stat-row" v-for="stat in customPeriod.vacationStats" :key="stat.label">
                                    <span class="stat-dot" :class="stat.color"></span>
                                    <span>{{ stat.label }}</span>
                                    <span class="stat-num">{{ stat.value }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="stats-section">
                            <div class="section-label"><i class="pi pi-flag"></i> PUNCH FLAG</div>
                            <div class="stats-list">
                                <div class="stat-row" v-for="stat in customPeriod.punchStats" :key="stat.label">
                                    <span class="stat-dot" :class="stat.color"></span>
                                    <span>{{ stat.label }}</span>
                                    <span class="stat-num">{{ stat.value }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="stats-section">
                            <div class="section-label"><i class="pi pi-exclamation-triangle"></i> VIOLATIONS</div>
                            <div class="stats-list">
                                <div class="stat-row" v-for="stat in customPeriod.violationStats" :key="stat.label">
                                    <span class="stat-dot" :class="stat.color"></span>
                                    <span>{{ stat.label }}</span>
                                    <span class="stat-num">{{ stat.value }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="stats-section performance">
                            <div class="section-label"><i class="pi pi-chart-bar"></i> PERFORMANCE</div>
                            <div class="stats-list">
                                <div class="stat-row" v-for="stat in customPeriod.performanceStats" :key="stat.label">
                                    <span class="stat-label-with-tooltip">
                                        {{ stat.label }}
                                        <i class="pi pi-info-circle tooltip-icon" v-tooltip.top="performanceTooltips[stat.label]"></i>
                                    </span>
                                    <span class="stat-percent" :class="stat.color">{{ stat.value }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    `,
    setup(props) {
        const { ref, computed } = Vue;
        const periods = ref([
            {
                id: 'yesterday', title: 'YESTERDAY', date: 'Feb 09', highlighted: false, totalStaff: 450,
                attendanceStats: [{ label: 'Total Present', value: 412, color: 'green' }, { label: 'Total Absent', value: 5, color: 'red' }, { label: 'Total Business Trip', value: 5, color: 'blue' }, { label: 'Total Work From Home', value: 0, color: 'purple' }, { label: 'Total Working Hours', value: '3,456h', color: 'orange' }],
                vacationStats: [{ label: 'Total in Annual Vacation', value: 8, color: 'blue' }, { label: 'Total in Others Type', value: 3, color: 'purple' }, { label: 'Total Working on Public Holiday', value: 0, color: 'green' }, { label: 'Total Day Off', value: 5, color: 'gray' }],
                punchStats: [{ label: 'Total Missing Clock In', value: 2, color: 'red' }, { label: 'Total Missing Clock Out', value: 3, color: 'orange' }],
                violationStats: [{ label: 'Total LATE In', value: 45, color: 'orange' }, { label: 'Total EARLY Out', value: 12, color: 'red' }, { label: 'Total Less Effort', value: 5, color: 'purple' }, { label: 'Total NO SHIFT ASSIGNED', value: 0, color: 'gray' }, { label: 'Total OUTSIDE WINDOW', value: 2, color: 'blue' }],
                performanceStats: [{ label: 'Attendance Rate', value: '91.6%', color: 'green' }, { label: 'Absent Rate', value: '1.1%', color: 'red' }, { label: 'Day Off Rate', value: '1.1%', color: 'gray' }, { label: 'Leave Utilization', value: '2.4%', color: 'blue' }, { label: 'Missing Punch Rate', value: '3.6%', color: 'orange' }, { label: 'Violation Rate', value: '10%', color: 'red' }]
            },
            {
                id: 'this_month', title: 'THIS MONTH', date: 'February', highlighted: false, totalStaff: 450,
                attendanceStats: [{ label: 'Total Present', value: 8540, color: 'green' }, { label: 'Total Absent', value: 102, color: 'red' }, { label: 'Total Business Trip', value: 45, color: 'blue' }, { label: 'Total Work From Home', value: 210, color: 'purple' }, { label: 'Total Working Hours', value: '89,320h', color: 'orange' }],
                vacationStats: [{ label: 'Total in Annual Vacation', value: 560, color: 'blue' }, { label: 'Total in Others Type', value: 45, color: 'purple' }, { label: 'Total Working on Public Holiday', value: 12, color: 'green' }, { label: 'Total Day Off', value: 120, color: 'gray' }],
                punchStats: [{ label: 'Total Missing Clock In', value: 160, color: 'red' }, { label: 'Total Missing Clock Out', value: 185, color: 'orange' }],
                violationStats: [{ label: 'Total LATE In', value: 650, color: 'orange' }, { label: 'Total EARLY Out', value: 320, color: 'red' }, { label: 'Total Less Effort', value: 85, color: 'purple' }, { label: 'Total NO SHIFT ASSIGNED', value: 0, color: 'gray' }, { label: 'Total OUTSIDE WINDOW', value: 25, color: 'blue' }],
                performanceStats: [{ label: 'Attendance Rate', value: '86.0%', color: 'green' }, { label: 'Absent Rate', value: '2.3%', color: 'red' }, { label: 'Day Off Rate', value: '26.7%', color: 'gray' }, { label: 'Leave Utilization', value: '1.8%', color: 'blue' }, { label: 'Missing Punch Rate', value: '2.9%', color: 'orange' }, { label: 'Violation Rate', value: '8%', color: 'red' }]
            },
            {
                id: 'last_month', title: 'LAST MONTH', date: 'Rajab/Shaban', highlighted: false, totalStaff: 448,
                attendanceStats: [{ label: 'Total Present', value: 8120, color: 'green' }, { label: 'Total Absent', value: 260, color: 'red' }, { label: 'Total Business Trip', value: 45, color: 'blue' }, { label: 'Total Work From Home', value: 0, color: 'purple' }, { label: 'Total Working Hours', value: '72,450h', color: 'orange' }],
                vacationStats: [{ label: 'Total in Annual Vacation', value: 160, color: 'blue' }, { label: 'Total in Others Type', value: 0, color: 'purple' }, { label: 'Total Working on Public Holiday', value: 0, color: 'green' }, { label: 'Total Day Off', value: 115, color: 'gray' }],
                punchStats: [{ label: 'Total Missing Clock In', value: 28, color: 'red' }, { label: 'Total Missing Clock Out', value: 105, color: 'orange' }],
                violationStats: [{ label: 'Total LATE In', value: 680, color: 'orange' }, { label: 'Total EARLY Out', value: 245, color: 'red' }, { label: 'Total Less Effort', value: 140, color: 'purple' }, { label: 'Total NO SHIFT ASSIGNED', value: 1, color: 'gray' }, { label: 'Total OUTSIDE WINDOW', value: 29, color: 'blue' }],
                performanceStats: [{ label: 'Attendance Rate', value: '90.5%', color: 'green' }, { label: 'Absent Rate', value: '3.2%', color: 'red' }, { label: 'Day Off Rate', value: '2.5%', color: 'gray' }, { label: 'Leave Utilization', value: '2.5%', color: 'blue' }, { label: 'Missing Punch Rate', value: '0.7%', color: 'orange' }, { label: 'Violation Rate', value: '6.4%', color: 'red' }]
            }
        ]);
        
        const customPeriod = ref({
            id: 'custom', title: 'CUSTOM RANGE', date: 'Selected', highlighted: false, totalStaff: 450,
            attendanceStats: [{ label: 'Total Present', value: 2410, color: 'green' }, { label: 'Total Absent', value: 95, color: 'red' }, { label: 'Total Business Trip', value: 18, color: 'blue' }, { label: 'Total Work From Home', value: 60, color: 'purple' }, { label: 'Total Working Hours', value: '19,280h', color: 'orange' }],
            vacationStats: [{ label: 'Total in Annual Vacation', value: 42, color: 'blue' }, { label: 'Total in Others Type Vacation', value: 12, color: 'purple' }, { label: 'Total Working on Public Holiday', value: 0, color: 'green' }, { label: 'Total Day Off', value: 35, color: 'gray' }],
            punchStats: [{ label: 'Total Missing Clock In', value: 38, color: 'red' }, { label: 'Total Missing Clock Out', value: 29, color: 'orange' }],
            violationStats: [{ label: 'Total LATE IN', value: 115, color: 'orange' }, { label: 'Total EARLY OUT', value: 32, color: 'red' }, { label: 'Total Less Effort', value: 8, color: 'purple' }, { label: 'Total NO SHIFT ASSIGNED', value: 0, color: 'gray' }, { label: 'Total OUTSIDE WINDOW', value: 5, color: 'blue' }],
            performanceStats: [{ label: 'Attendance Rate', value: '88.4%', color: 'green' }, { label: 'Absent Rate', value: '3.5%', color: 'red' }, { label: 'Day Off Rate', value: '1.3%', color: 'gray' }, { label: 'Leave Utilization', value: '2.0%', color: 'blue' }, { label: 'Missing Punch Rate', value: '2.5%', color: 'orange' }, { label: 'Violation Rate', value: '5.8%', color: 'red' }]
        });
        
        const regularPeriods = computed(() => periods.value);
        
        const formattedDateRange = computed(() => {
            if (props.customRangeDates?.from && props.customRangeDates?.to) {
                const from = new Date(props.customRangeDates.from);
                const to = new Date(props.customRangeDates.to);
                return `${from.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${to.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`;
            }
            return 'Selected';
        });
        
        const performanceTooltips = {
            'Attendance Rate': '(Total Present / Total Staff) * 100',
            'Absent Rate': '(Total Absent / Total Staff) * 100',
            'Day Off Rate': '(Total Day Off / Total Staff) * 100',
            'Leave Utilization': '(Annual Vac + Other Vac) / Total Staff * 100',
            'Missing Punch Rate': '(Missing In + Missing Out) / Total Present * 100',
            'Violation Rate': '((Total LATE IN + Total EARLY OUT + Total Less Effort + Total OUTSIDE WINDOW + Total NO SHIFT ASSIGNED) / Total Present) * 100'
        };
        
        return { periods, regularPeriods, customPeriod, formattedDateRange, performanceTooltips };
    }
};

// ATTENDANCE DYNAMIC INSIGHTS with real Chart.js
const AttendanceDynamicInsights = {
    template: `
        <div class="dynamic-insights-content">
            <div class="chart-card full-width">
                <div class="chart-header"><h3>1. Attendance Status</h3></div>
                <div class="chart-container"><canvas ref="attendanceStatusChart"></canvas></div>
            </div>
            <div class="chart-card full-width">
                <div class="chart-header"><h3><i class="pi pi-clock"></i> Total Working Hours Trend</h3></div>
                <div class="chart-container"><canvas ref="workingHoursChart"></canvas></div>
            </div>
            <div class="charts-row">
                <div class="chart-card">
                    <div class="chart-header"><h3>2. Vacation Status</h3></div>
                    <div class="chart-container small"><canvas ref="vacationChart"></canvas></div>
                </div>
                <div class="chart-card">
                    <div class="chart-header"><h3>3. Punch Flag</h3></div>
                    <div class="chart-container small"><canvas ref="punchFlagChart"></canvas></div>
                </div>
            </div>
            <div class="charts-row">
                <div class="chart-card">
                    <div class="chart-header"><h3>4. Violation Analysis</h3></div>
                    <div class="chart-container small"><canvas ref="violationChart"></canvas></div>
                </div>
                <div class="chart-card">
                    <div class="chart-header"><h3>5. Performance Rates (%)</h3></div>
                    <div class="chart-container small"><canvas ref="performanceChart"></canvas></div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const { ref, onMounted, onUnmounted } = Vue;
        const attendanceStatusChart = ref(null);
        const workingHoursChart = ref(null);
        const vacationChart = ref(null);
        const punchFlagChart = ref(null);
        const violationChart = ref(null);
        const performanceChart = ref(null);
        let charts = [];

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const initCharts = () => {
            if (attendanceStatusChart.value) {
                charts.push(new Chart(attendanceStatusChart.value.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            { label: 'Present', data: [380, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', fill: true, tension: 0.4 },
                            { label: 'Absent', data: [20, 18, 15, 12, 10, 8, 6, 5, 4, 3, 2, 2], borderColor: '#ef4444', backgroundColor: 'transparent', tension: 0.4 },
                            { label: 'Business Trip', data: [5, 8, 10, 12, 15, 18, 20, 22, 18, 15, 12, 10], borderColor: '#3b82f6', backgroundColor: 'transparent', tension: 0.4 },
                            { label: 'WFH', data: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65], borderColor: '#8b5cf6', backgroundColor: 'transparent', tension: 0.4 }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
                }));
            }
            if (workingHoursChart.value) {
                charts.push(new Chart(workingHoursChart.value.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [{ label: 'Working Hours', data: [72000, 75000, 78000, 80000, 82000, 85000, 88000, 90000, 87000, 85000, 83000, 80000], backgroundColor: 'rgba(249,115,22,0.7)', borderRadius: 6 }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                }));
            }
            if (vacationChart.value) {
                charts.push(new Chart(vacationChart.value.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            { label: 'Annual Vacation', data: [45, 50, 55, 60, 80, 120, 150, 100, 70, 55, 50, 45], borderColor: '#f97316', tension: 0.4 },
                            { label: 'Others', data: [5, 8, 10, 12, 15, 20, 25, 18, 12, 8, 6, 5], borderColor: '#8b5cf6', tension: 0.4 },
                            { label: 'Day Off', data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100], borderColor: '#9ca3af', tension: 0.4 }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
                }));
            }
            if (punchFlagChart.value) {
                charts.push(new Chart(punchFlagChart.value.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            { label: 'Missing Clock In', data: [25, 22, 20, 18, 15, 12, 10, 8, 6, 5, 4, 3], borderColor: '#ef4444', tension: 0.4 },
                            { label: 'Missing Clock Out', data: [30, 28, 25, 22, 20, 18, 15, 12, 10, 8, 6, 5], borderColor: '#f97316', tension: 0.4 }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
                }));
            }
            if (violationChart.value) {
                charts.push(new Chart(violationChart.value.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [
                            { label: 'Late In', data: [80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25], backgroundColor: '#f97316' },
                            { label: 'Early Out', data: [40, 38, 35, 32, 30, 28, 25, 22, 20, 18, 15, 12], backgroundColor: '#ef4444' },
                            { label: 'Less Effort', data: [20, 18, 16, 14, 12, 10, 8, 6, 5, 4, 3, 2], backgroundColor: '#8b5cf6' }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } }
                }));
            }
            if (performanceChart.value) {
                charts.push(new Chart(performanceChart.value.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            { label: 'Attendance Rate', data: [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96], borderColor: '#16a34a', tension: 0.4 },
                            { label: 'Absent Rate', data: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.8, 1.5, 1.2, 1, 0.8], borderColor: '#ef4444', tension: 0.4 },
                            { label: 'Violation Rate', data: [12, 11, 10, 9, 8, 7, 6, 5.5, 5, 4.5, 4, 3.5], borderColor: '#f97316', tension: 0.4 }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { max: 100 } } }
                }));
            }
        };

        onMounted(() => { setTimeout(initCharts, 100); });
        onUnmounted(() => { charts.forEach(c => c.destroy()); });

        return { attendanceStatusChart, workingHoursChart, vacationChart, punchFlagChart, violationChart, performanceChart };
    }
};

// PAYROLL STATIC INSIGHTS
const PayrollStaticInsights = {
    props: ['dateRange'],
    template: `
        <div class="static-insights-content">
            <div class="period-cards-grid payroll">
                <div v-for="period in periods" :key="period.id" class="period-card payroll-card" :class="{ highlighted: period.highlighted }">
                    <div class="period-header">
                        <span class="period-title">{{ period.title }}</span>
                        <span class="period-badge" :class="period.status">{{ period.status }}</span>
                    </div>
                    <div class="payroll-stats">
                        <div class="payroll-stat-row"><span class="stat-icon blue"><i class="pi pi-users"></i></span><span class="stat-label">HEADCOUNT</span><span class="stat-value">{{ period.headcount }}</span></div>
                        <div class="payroll-stat-row"><span class="stat-icon green"><i class="pi pi-sync"></i></span><span class="stat-label">RUN CYCLES</span><span class="stat-value">{{ period.runCycles }}</span></div>
                    </div>
                    <div class="payroll-amounts">
                        <div class="amount-row"><span class="amount-dot green"></span><span>Total Net Pay</span><span class="amount">{{ period.netPay }} <small>SAR</small></span></div>
                        <div class="amount-row"><span class="amount-dot blue"></span><span>Total Gross</span><span class="amount">{{ period.gross }} <small>SAR</small></span></div>
                        <div class="amount-row"><span class="amount-dot orange"></span><span>Total Commissions</span><span class="amount">{{ period.commissions }} <small>SAR</small></span></div>
                        <div class="amount-row"><span class="amount-dot purple"></span><span>Total Arrears Add</span><span class="amount">{{ period.arrearsAdd }} <small>SAR</small></span></div>
                        <div class="amount-row"><span class="amount-dot red"></span><span>Total EOS Ded.</span><span class="amount">{{ period.eosDed }} <small>SAR</small></span></div>
                        <div class="amount-row"><span class="amount-dot gray"></span><span>Total Arrears Ded.</span><span class="amount">{{ period.arrearsDed }} <small>SAR</small></span></div>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const { ref } = Vue;
        const periods = ref([
            { id: 1, title: 'OCTOBER 2025', status: 'confirmed', highlighted: false, headcount: 380, runCycles: 4, netPay: '2,180,500.00', gross: '2,455,000.00', commissions: '58,200.00', arrearsAdd: '8,150.00', eosDed: '7,980.00', arrearsDed: '52,800.00' },
            { id: 2, title: 'NOVEMBER 2025', status: 'confirmed', highlighted: true, headcount: 365, runCycles: 4, netPay: '2,230,000.00', gross: '2,490,000.00', commissions: '42,000.00', arrearsAdd: '15,000.00', eosDed: '7,500.00', arrearsDed: '18,500.00' },
            { id: 3, title: 'DECEMBER 2025', status: 'confirmed', highlighted: false, headcount: 372, runCycles: 5, netPay: '2,215,750.00', gross: '2,562,300.00', commissions: '71,650.00', arrearsAdd: '8,500.00', eosDed: '8,320.00', arrearsDed: '52,450.00' }
        ]);
        return { periods };
    }
};

// PAYROLL DYNAMIC INSIGHTS with Chart.js
const PayrollDynamicInsights = {
    template: `
        <div class="dynamic-insights-content">
            <div class="chart-card full-width">
                <div class="chart-header"><h3><i class="pi pi-dollar"></i> 1. Total Net Pay vs Commissions</h3></div>
                <div class="chart-container"><canvas ref="netPayChart"></canvas></div>
            </div>
            <div class="charts-row">
                <div class="chart-card">
                    <div class="chart-header"><h3><i class="pi pi-chart-bar"></i> 2. Deduction Analysis</h3></div>
                    <div class="chart-container small"><canvas ref="deductionChart"></canvas></div>
                </div>
                <div class="chart-card">
                    <div class="chart-header"><h3><i class="pi pi-money-bill"></i> 3. Total Arrears Ded.</h3></div>
                    <div class="chart-container small"><canvas ref="arrearsChart"></canvas></div>
                </div>
            </div>
            <div class="charts-row">
                <div class="chart-card">
                    <div class="chart-header"><h3><i class="pi pi-users"></i> 4. Headcount Growth</h3></div>
                    <div class="chart-container small"><canvas ref="headcountChart"></canvas></div>
                </div>
                <div class="chart-card">
                    <div class="chart-header"><h3><i class="pi pi-building"></i> 5. Company GOSI Contribution</h3></div>
                    <div class="chart-container small"><canvas ref="gosiChart"></canvas></div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const { ref, onMounted, onUnmounted } = Vue;
        const netPayChart = ref(null);
        const deductionChart = ref(null);
        const arrearsChart = ref(null);
        const headcountChart = ref(null);
        const gosiChart = ref(null);
        let charts = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const initCharts = () => {
            if (netPayChart.value) {
                charts.push(new Chart(netPayChart.value.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            { label: 'Total Net Pay', data: [2100000, 2150000, 2180000, 2200000, 2220000, 2250000, 2280000, 2300000, 2320000, 2350000, 2380000, 2400000], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', fill: true, tension: 0.4 },
                            { label: 'Total Commissions', data: [45000, 48000, 52000, 55000, 58000, 62000, 65000, 68000, 70000, 72000, 75000, 78000], borderColor: '#f97316', tension: 0.4 }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
                }));
            }
            if (deductionChart.value) {
                charts.push(new Chart(deductionChart.value.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [
                            { label: 'Absent Adj.', data: [5000, 4800, 4500, 4200, 4000, 3800, 3500, 3200, 3000, 2800, 2500, 2200], backgroundColor: '#3b82f6' },
                            { label: 'Attendance & Punch', data: [8000, 7500, 7000, 6500, 6000, 5500, 5000, 4500, 4000, 3500, 3000, 2500], backgroundColor: '#f97316' },
                            { label: 'Others', data: [3000, 2800, 2600, 2400, 2200, 2000, 1800, 1600, 1400, 1200, 1000, 800], backgroundColor: '#9ca3af' }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } }
                }));
            }
            if (arrearsChart.value) {
                charts.push(new Chart(arrearsChart.value.getContext('2d'), {
                    type: 'line',
                    data: { labels: months, datasets: [{ label: 'Arrears Ded.', data: [52000, 48000, 45000, 42000, 40000, 38000, 35000, 32000, 30000, 28000, 25000, 22000], borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)', fill: true, tension: 0.4 }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
                }));
            }
            if (headcountChart.value) {
                charts.push(new Chart(headcountChart.value.getContext('2d'), {
                    type: 'bar',
                    data: { labels: months, datasets: [{ label: 'Headcount', data: [350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405], backgroundColor: '#3b82f6', borderRadius: 6 }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
                }));
            }
            if (gosiChart.value) {
                charts.push(new Chart(gosiChart.value.getContext('2d'), {
                    type: 'line',
                    data: { labels: months, datasets: [{ label: 'GOSI', data: [120000, 122000, 125000, 128000, 130000, 132000, 135000, 138000, 140000, 142000, 145000, 148000], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', fill: true, tension: 0.4 }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
                }));
            }
        };

        onMounted(() => { setTimeout(initCharts, 100); });
        onUnmounted(() => { charts.forEach(c => c.destroy()); });

        return { netPayChart, deductionChart, arrearsChart, headcountChart, gosiChart };
    }
};

// REQUESTS STATIC INSIGHTS
const RequestsStaticInsights = {
    props: ['dateRange'],
    template: `
        <div class="static-insights-content">
            <div class="section-title"><i class="pi pi-history"></i> HISTORICAL SNAPSHOTS</div>
            <div class="period-cards-grid requests">
                <div v-for="period in periods" :key="period.id" class="period-card requests-card" :class="{ highlighted: period.highlighted }">
                    <div class="period-header"><span class="period-title">{{ period.title }}</span><span class="period-date">{{ period.date }}</span></div>
                    <div class="stats-section"><div class="section-label"><i class="pi pi-chart-pie"></i> ORDER STATUS</div>
                        <div class="stats-list"><div class="stat-row" v-for="stat in period.orderStats" :key="stat.label"><span class="stat-dot" :class="stat.color"></span><span>{{ stat.label }}</span><span class="stat-num">{{ stat.value }}</span></div></div>
                    </div>
                    <div class="stats-section"><div class="section-label"><i class="pi pi-list"></i> TYPE OF REQUESTS</div>
                        <div class="stats-list"><div class="stat-row" v-for="stat in period.typeStats" :key="stat.label"><span class="stat-dot" :class="stat.color"></span><span>{{ stat.label }}</span><span class="stat-num">{{ stat.value }}</span></div></div>
                    </div>
                    <a class="view-details-link">VIEW DETAILS <i class="pi pi-chevron-down"></i></a>
                </div>
            </div>
        </div>
    `,
    setup() {
        const { ref } = Vue;
        const periods = ref([
            { id: 'today', title: 'TODAY', date: 'REAL-TIME', highlighted: false, orderStats: [{ label: 'Total Request', value: 12, color: 'blue' }, { label: 'Pending', value: 4, color: 'orange' }, { label: 'In Review', value: 2, color: 'purple' }, { label: 'Approved', value: 5, color: 'green' }, { label: 'Rejected', value: 1, color: 'red' }], typeStats: [{ label: 'Leaves', value: 5, color: 'blue' }, { label: 'Business Trip', value: 1, color: 'orange' }, { label: 'Attendance Adj.', value: 3, color: 'purple' }, { label: 'Letters', value: 2, color: 'green' }, { label: 'Others', value: 1, color: 'gray' }] },
            { id: 'yesterday', title: 'YESTERDAY', date: 'FULL DAY', highlighted: false, orderStats: [{ label: 'Total Request', value: 28, color: 'blue' }, { label: 'Pending', value: 0, color: 'orange' }, { label: 'In Review', value: 3, color: 'purple' }, { label: 'Approved', value: 22, color: 'green' }, { label: 'Rejected', value: 3, color: 'red' }], typeStats: [{ label: 'Leaves', value: 10, color: 'blue' }, { label: 'Business Trip', value: 2, color: 'orange' }, { label: 'Attendance Adj.', value: 8, color: 'purple' }, { label: 'Letters', value: 4, color: 'green' }, { label: 'Others', value: 4, color: 'gray' }] },
            { id: 'week', title: 'CURRENT WEEK', date: 'OCT 20-26', highlighted: true, orderStats: [{ label: 'Total Request', value: 145, color: 'blue' }, { label: 'Pending', value: 20, color: 'orange' }, { label: 'In Review', value: 15, color: 'purple' }, { label: 'Approved', value: 98, color: 'green' }, { label: 'Rejected', value: 12, color: 'red' }], typeStats: [{ label: 'Leaves', value: 55, color: 'blue' }, { label: 'Business Trip', value: 12, color: 'orange' }, { label: 'Attendance Adj.', value: 40, color: 'purple' }, { label: 'Letters', value: 22, color: 'green' }, { label: 'Others', value: 16, color: 'gray' }] },
            { id: 'last_week', title: 'LAST WEEK', date: 'OCT 13-19', highlighted: false, orderStats: [{ label: 'Total Request', value: 188, color: 'blue' }, { label: 'Pending', value: 0, color: 'orange' }, { label: 'In Review', value: 8, color: 'purple' }, { label: 'Approved', value: 165, color: 'green' }, { label: 'Rejected', value: 15, color: 'red' }], typeStats: [{ label: 'Leaves', value: 82, color: 'blue' }, { label: 'Business Trip', value: 18, color: 'orange' }, { label: 'Attendance Adj.', value: 45, color: 'purple' }, { label: 'Letters', value: 28, color: 'green' }, { label: 'Others', value: 15, color: 'gray' }] }
        ]);
        return { periods };
    }
};

// REQUESTS DYNAMIC INSIGHTS with Chart.js
const RequestsDynamicInsights = {
    template: `
        <div class="dynamic-insights-content">
            <div class="charts-row">
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-chart-bar"></i> 1. Total Requests Volume</h3></div><div class="chart-container small"><canvas ref="volumeChart"></canvas></div></div>
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-calendar"></i> 2. Total Leaves Trend</h3></div><div class="chart-container small"><canvas ref="leavesChart"></canvas></div></div>
            </div>
            <div class="charts-row">
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-check-circle"></i> 3. Approved vs Rejected</h3></div><div class="chart-container small"><canvas ref="approvalChart"></canvas></div></div>
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-clock"></i> 4. SLA in Days</h3></div><div class="chart-container small"><canvas ref="slaChart"></canvas></div></div>
            </div>
            <div class="chart-card full-width"><div class="chart-header"><h3><i class="pi pi-chart-bar"></i> 5. Monthly Request Type Breakdown</h3></div><div class="chart-container"><canvas ref="breakdownChart"></canvas></div></div>
            <div class="chart-card full-width"><div class="chart-header"><h3><i class="pi pi-history"></i> 6. Monthly Request Status Lifecycle</h3></div><div class="chart-container"><canvas ref="lifecycleChart"></canvas></div></div>
        </div>
    `,
    setup() {
        const { ref, onMounted, onUnmounted } = Vue;
        const volumeChart = ref(null); const leavesChart = ref(null); const approvalChart = ref(null);
        const slaChart = ref(null); const breakdownChart = ref(null); const lifecycleChart = ref(null);
        let charts = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const initCharts = () => {
            if (volumeChart.value) { charts.push(new Chart(volumeChart.value.getContext('2d'), { type: 'bar', data: { labels: months, datasets: [{ label: 'Requests', data: [320, 350, 380, 420, 450, 480, 520, 550, 500, 480, 450, 420], backgroundColor: '#f97316', borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
            if (leavesChart.value) { charts.push(new Chart(leavesChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'Leaves', data: [120, 140, 160, 180, 220, 280, 320, 250, 200, 180, 160, 140], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
            if (approvalChart.value) { charts.push(new Chart(approvalChart.value.getContext('2d'), { type: 'bar', data: { labels: months, datasets: [{ label: 'Approved', data: [280, 310, 340, 380, 410, 440, 480, 510, 460, 440, 410, 380], backgroundColor: '#16a34a' }, { label: 'Rejected', data: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40], backgroundColor: '#ef4444' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } })); }
            if (slaChart.value) { charts.push(new Chart(slaChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'SLA Days', data: [2.5, 2.3, 2.1, 1.9, 1.7, 1.5, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8], borderColor: '#3b82f6', tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
            if (breakdownChart.value) { charts.push(new Chart(breakdownChart.value.getContext('2d'), { type: 'bar', data: { labels: months, datasets: [{ label: 'Attendance Adj.', data: [80, 90, 100, 110, 120, 130, 140, 150, 140, 130, 120, 110], backgroundColor: '#8b5cf6' }, { label: 'Business Trip', data: [30, 35, 40, 45, 50, 55, 60, 65, 60, 55, 50, 45], backgroundColor: '#f97316' }, { label: 'Leaves', data: [120, 140, 160, 180, 220, 280, 320, 250, 200, 180, 160, 140], backgroundColor: '#ef4444' }, { label: 'Letters', data: [50, 55, 60, 65, 70, 75, 80, 85, 80, 75, 70, 65], backgroundColor: '#16a34a' }, { label: 'Others', data: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40], backgroundColor: '#3b82f6' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } } })); }
            if (lifecycleChart.value) { charts.push(new Chart(lifecycleChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'Approved', data: [280, 310, 340, 380, 410, 440, 480, 510, 460, 440, 410, 380], borderColor: '#16a34a', tension: 0.4 }, { label: 'In Review', data: [20, 25, 30, 35, 40, 45, 50, 55, 50, 45, 40, 35], borderColor: '#8b5cf6', tension: 0.4 }, { label: 'Pending', data: [20, 15, 20, 25, 30, 35, 40, 35, 30, 25, 20, 15], borderColor: '#f97316', tension: 0.4 }, { label: 'Rejected', data: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40], borderColor: '#ef4444', tension: 0.4 }, { label: 'Total', data: [320, 350, 380, 420, 450, 480, 520, 550, 500, 480, 450, 420], borderColor: '#3b82f6', tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } })); }
        };

        onMounted(() => { setTimeout(initCharts, 100); });
        onUnmounted(() => { charts.forEach(c => c.destroy()); });

        return { volumeChart, leavesChart, approvalChart, slaChart, breakdownChart, lifecycleChart };
    }
};

// DEMOGRAPHY STATIC INSIGHTS
const DemographyStaticInsights = {
    template: `
        <div class="static-insights-content">
            <div class="section-title"><i class="pi pi-users"></i> EMPLOYEE DISTRIBUTION SNAPSHOTS</div>
            <div class="demography-grid">
                <div v-for="category in categories" :key="category.id" class="demography-card">
                    <div class="demography-header"><span class="category-icon" :class="category.color"><i :class="'pi ' + category.icon"></i></span><span class="category-title">{{ category.title }}</span></div>
                    <div class="demography-items"><div v-for="(item, index) in getVisibleItems(category)" :key="item.name" class="demography-item"><span class="item-dot" :class="getItemColor(index)"></span><span class="item-name">{{ item.name }}</span><span class="item-count">{{ item.count }}</span></div></div>
                    <button v-if="category.items.length > 5" class="view-more-btn" @click="toggleExpand(category.id)">{{ expandedCategories.includes(category.id) ? 'VIEW LESS' : 'VIEW MORE' }} <i :class="expandedCategories.includes(category.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i></button>
                </div>
            </div>
        </div>
    `,
    setup() {
        const { ref } = Vue;
        const expandedCategories = ref([]);
        const categories = ref([
            { id: 'entity', title: 'ENTITY BREAKDOWN', icon: 'pi-building', color: 'blue', items: [{ name: 'Direct', count: 320 }, { name: 'Tawfiq', count: 130 }] },
            { id: 'country', title: 'COUNTRY OF WORK', icon: 'pi-globe', color: 'orange', items: [{ name: 'Saudi Arabia', count: 280 }, { name: 'Egypt', count: 45 }, { name: 'UAE', count: 65 }, { name: 'Jordan', count: 10 }] },
            { id: 'nationality', title: 'NATIONALITY', icon: 'pi-flag', color: 'purple', items: [{ name: 'Saudi', count: 230 }, { name: 'Egyptian', count: 85 }, { name: 'Indian', count: 65 }, { name: 'Pakistani', count: 40 }, { name: 'Others', count: 40 }] },
            { id: 'costcenter', title: 'COST CENTER', icon: 'pi-dollar', color: 'green', items: [{ name: 'Operations', count: 150 }, { name: 'Sales & Marketing', count: 100 }, { name: 'IT & Digital', count: 95 }, { name: 'Corporate Services', count: 55 }] },
            { id: 'office', title: 'WORK OFFICE', icon: 'pi-home', color: 'blue', items: [{ name: 'Riyadh HQ', count: 240 }, { name: 'Jeddah Branch', count: 110 }, { name: 'Dammam Branch', count: 65 }, { name: 'Remote', count: 25 }] },
            { id: 'department', title: 'DEPARTMENTS', icon: 'pi-sitemap', color: 'orange', items: [{ name: 'Software Engineering', count: 45 }, { name: 'Customer Success', count: 80 }, { name: 'Finance & Accounting', count: 25 }, { name: 'Human Resources', count: 20 }, { name: 'Supply Chain', count: 280 }] },
            { id: 'maingrade', title: 'MAIN GRADE', icon: 'pi-chart-line', color: 'purple', items: [{ name: 'Executive (Level 1-2)', count: 12 }, { name: 'Management (Level 3-5)', count: 48 }, { name: 'Professional (Level 6-8)', count: 180 }, { name: 'Entry (Level 9-10)', count: 210 }] },
            { id: 'subgrade', title: 'SUB GRADE', icon: 'pi-list', color: 'green', items: [{ name: 'Grade A1 - A3', count: 25 }, { name: 'Grade B1 - B3', count: 100 }, { name: 'Grade C1 - C3', count: 240 }, { name: 'Grade D1 - D2', count: 55 }] },
            { id: 'jobtitle', title: 'JOB TITLE', icon: 'pi-id-card', color: 'blue', items: [{ name: 'Technician', count: 165 }, { name: 'Sales Specialist', count: 95 }, { name: 'Accountant', count: 55 }, { name: 'Software Developer', count: 25 }, { name: 'Manager', count: 40 }, { name: 'Others', count: 80 }] },
            { id: 'gender', title: 'GENDER', icon: 'pi-users', color: 'purple', items: [{ name: 'Male', count: 310 }, { name: 'Female', count: 140 }] },
            { id: 'marital', title: 'MARITAL STATUS', icon: 'pi-heart', color: 'red', items: [{ name: 'Married', count: 285 }, { name: 'Single', count: 150 }, { name: 'Divorced', count: 12 }, { name: 'Widowed', count: 3 }] },
            { id: 'seniority', title: 'SENIORITY', icon: 'pi-clock', color: 'orange', items: [{ name: 'Junior (0-3 Years)', count: 140 }, { name: 'Mid-Level (3-6 Years)', count: 160 }, { name: 'Senior (10+ Years)', count: 150 }] },
            { id: 'worktype', title: 'TYPE OF WORK', icon: 'pi-briefcase', color: 'green', items: [{ name: 'Full Time', count: 350 }, { name: 'Part Time', count: 45 }, { name: 'Full Time Remotely', count: 25 }, { name: 'Part Time Remotely', count: 12 }, { name: 'Intern', count: 8 }] },
            { id: 'shiftmodule', title: 'SHIFT MODULE', icon: 'pi-calendar', color: 'blue', items: [{ name: 'Variable', count: 120 }, { name: 'Fixed', count: 220 }] }
        ]);
        const toggleExpand = (id) => { const i = expandedCategories.value.indexOf(id); if (i > -1) expandedCategories.value.splice(i, 1); else expandedCategories.value.push(id); };
        const getVisibleItems = (cat) => expandedCategories.value.includes(cat.id) ? cat.items : cat.items.slice(0, 5);
        const getItemColor = (i) => ['orange', 'blue', 'green', 'purple', 'red', 'gray'][i % 6];
        return { categories, expandedCategories, toggleExpand, getVisibleItems, getItemColor };
    }
};

// DEMOGRAPHY DYNAMIC INSIGHTS with Chart.js
const DemographyDynamicInsights = {
    template: `
        <div class="dynamic-insights-content">
            <div class="chart-card full-width"><div class="chart-header"><h3><i class="pi pi-chart-line"></i> Headcount Growth Trend</h3></div><div class="chart-container"><canvas ref="headcountChart"></canvas></div></div>
            <div class="charts-row">
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-users"></i> New Hires vs Terminations</h3></div><div class="chart-container small"><canvas ref="hiresChart"></canvas></div></div>
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-percentage"></i> Retention Rate Analysis</h3></div><div class="retention-chart"><div class="retention-value">94.2%</div><div class="retention-label">AVERAGE ANNUAL RETENTION</div></div></div>
            </div>
        </div>
    `,
    setup() {
        const { ref, onMounted, onUnmounted } = Vue;
        const headcountChart = ref(null); const hiresChart = ref(null);
        let charts = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

        const initCharts = () => {
            if (headcountChart.value) { charts.push(new Chart(headcountChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'Headcount', data: [420, 425, 430, 435, 440, 445, 450], borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
            if (hiresChart.value) { charts.push(new Chart(hiresChart.value.getContext('2d'), { type: 'bar', data: { labels: months, datasets: [{ label: 'Hires', data: [12, 15, 10, 8, 14, 18, 12], backgroundColor: '#16a34a' }, { label: 'Terminations', data: [5, 3, 4, 2, 6, 4, 3], backgroundColor: '#ef4444' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } })); }
        };

        onMounted(() => { setTimeout(initCharts, 100); });
        onUnmounted(() => { charts.forEach(c => c.destroy()); });

        return { headcountChart, hiresChart };
    }
};

// HR DESK STATIC INSIGHTS
const HrdeskStaticInsights = {
    props: ['dateRange'],
    template: `
        <div class="static-insights-content">
            <div class="section-title"><i class="pi pi-ticket"></i> SERVICE REQUEST SNAPSHOTS</div>
            <div class="period-cards-grid hrdesk">
                <div v-for="period in periods" :key="period.id" class="period-card hrdesk-card" :class="{ highlighted: period.highlighted }">
                    <div class="period-header"><span class="period-title">{{ period.title }}</span><span class="period-date">{{ period.date }}</span></div>
                    <div class="stats-section"><div class="section-label"><i class="pi pi-list"></i> TYPE OF REQUESTS</div>
                        <div class="stats-list"><div class="stat-row" v-for="stat in period.typeStats" :key="stat.label"><span class="stat-dot" :class="stat.color"></span><span>{{ stat.label }}</span><span class="stat-num">{{ stat.value }}</span></div></div>
                    </div>
                    <a class="view-details-link">VIEW MORE <i class="pi pi-chevron-down"></i></a>
                </div>
            </div>
        </div>
    `,
    setup() {
        const { ref } = Vue;
        const periods = ref([
            { id: 'this_month', title: 'THIS MONTH', date: 'OCTOBER 2025', highlighted: false, typeStats: [{ label: 'Employee Promotion', value: 9, color: 'orange' }, { label: 'Change Job Title', value: 12, color: 'blue' }, { label: 'Salary & Benefits Adjustment', value: 25, color: 'green' }, { label: 'Employee Transfer', value: 5, color: 'purple' }, { label: 'Change Contract Type', value: 2, color: 'red' }, { label: 'Document & Detail Updates', value: 45, color: 'gray' }, { label: 'Attendance & Shift Adjustment', value: 66, color: 'orange' }, { label: 'Change Extension / email', value: 18, color: 'blue' }, { label: 'Disciplinary Action', value: 3, color: 'red' }] },
            { id: 'last_month', title: 'LAST MONTH', date: 'SEPTEMBER 2025', highlighted: true, typeStats: [{ label: 'Employee Promotion', value: 15, color: 'orange' }, { label: 'Change Job Title', value: 18, color: 'blue' }, { label: 'Salary & Benefits Adjustment', value: 22, color: 'green' }, { label: 'Employee Transfer', value: 8, color: 'purple' }, { label: 'Change Contract Type', value: 5, color: 'red' }, { label: 'Document & Detail Updates', value: 32, color: 'gray' }, { label: 'Attendance & Shift Adjustment', value: 85, color: 'orange' }, { label: 'Change Extension / email', value: 22, color: 'blue' }, { label: 'Disciplinary Action', value: 4, color: 'red' }] },
            { id: 'last_quarter', title: 'LAST QUARTER', date: 'Q3 2025', highlighted: false, typeStats: [{ label: 'Employee Promotion', value: 42, color: 'orange' }, { label: 'Change Job Title', value: 55, color: 'blue' }, { label: 'Salary & Benefits Adjustment', value: 110, color: 'green' }, { label: 'Employee Transfer', value: 24, color: 'purple' }, { label: 'Change Contract Type', value: 8, color: 'red' }, { label: 'Document & Detail Updates', value: 160, color: 'gray' }, { label: 'Attendance & Shift Adjustment', value: 245, color: 'orange' }, { label: 'Change Extension / email', value: 65, color: 'blue' }, { label: 'Disciplinary Action', value: 8, color: 'red' }] }
        ]);
        return { periods };
    }
};

// HR DESK DYNAMIC INSIGHTS with Chart.js
const HrdeskDynamicInsights = {
    template: `
        <div class="dynamic-insights-content">
            <div class="charts-row">
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-chart-bar"></i> Monthly Lifecycle Trends</h3></div><div class="chart-container small"><canvas ref="lifecycleChart"></canvas></div></div>
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-sync"></i> Admin & Attendance Volume</h3></div><div class="chart-container small"><canvas ref="adminChart"></canvas></div></div>
            </div>
            <div class="charts-row">
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-dollar"></i> Salary & Benefits Trend</h3></div><div class="chart-container small"><canvas ref="salaryChart"></canvas></div></div>
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-exclamation-triangle"></i> Disciplinary Warnings</h3></div><div class="chart-container small"><canvas ref="disciplinaryChart"></canvas></div></div>
            </div>
        </div>
    `,
    setup() {
        const { ref, onMounted, onUnmounted } = Vue;
        const lifecycleChart = ref(null); const adminChart = ref(null); const salaryChart = ref(null); const disciplinaryChart = ref(null);
        let charts = [];
        const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

        const initCharts = () => {
            if (lifecycleChart.value) { charts.push(new Chart(lifecycleChart.value.getContext('2d'), { type: 'bar', data: { labels: months, datasets: [{ label: 'Job Titles', data: [12, 15, 18, 22, 18, 14], backgroundColor: '#16a34a' }, { label: 'Promotions', data: [8, 10, 12, 15, 12, 9], backgroundColor: '#f97316' }, { label: 'Transfers', data: [3, 5, 6, 8, 6, 4], backgroundColor: '#ef4444' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } } })); }
            if (adminChart.value) { charts.push(new Chart(adminChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'Attendance Adj.', data: [55, 62, 70, 85, 78, 66], borderColor: '#3b82f6', tension: 0.4 }, { label: 'Document Updates', data: [30, 35, 40, 45, 38, 32], borderColor: '#f97316', tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } })); }
            if (salaryChart.value) { charts.push(new Chart(salaryChart.value.getContext('2d'), { type: 'bar', data: { labels: months, datasets: [{ label: 'Salary Changes', data: [18, 22, 28, 32, 25, 20], backgroundColor: '#f97316', borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
            if (disciplinaryChart.value) { charts.push(new Chart(disciplinaryChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'Warnings', data: [2, 3, 4, 5, 4, 3], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
        };

        onMounted(() => { setTimeout(initCharts, 100); });
        onUnmounted(() => { charts.forEach(c => c.destroy()); });

        return { lifecycleChart, adminChart, salaryChart, disciplinaryChart };
    }
};

// DIRECTORY STATIC INSIGHTS
const DirectoryStaticInsights = {
    template: `
        <div class="static-insights-content">
            <div class="section-title"><i class="pi pi-id-card"></i> DIRECTORY SNAPSHOT</div>
            <div class="directory-stats-grid">
                <div class="directory-stat-card"><div class="stat-header">MAIN STATUS</div><div class="stat-items"><div class="stat-item"><span class="item-dot green"></span><span>active</span><span class="item-count">452</span></div><div class="stat-item"><span class="item-dot red"></span><span>non-active</span><span class="item-count">28</span></div></div></div>
                <div class="directory-stat-card"><div class="stat-header">ONBOARDING STATUS</div><div class="stat-items"><div class="stat-item"><span class="item-dot orange"></span><span>Ready to hire step</span><span class="item-count">15</span></div><div class="stat-item"><span class="item-dot blue"></span><span>Documents step</span><span class="item-count">5</span></div><div class="stat-item"><span class="item-dot purple"></span><span>Work Access step</span><span class="item-count">12</span></div><div class="stat-item"><span class="item-dot green"></span><span>Contract & Salary step</span><span class="item-count">8</span></div><div class="stat-item"><span class="item-dot red"></span><span>Attendance step</span><span class="item-count">7</span></div><div class="stat-item"><span class="item-dot gray"></span><span>System step</span><span class="item-count">3</span></div><div class="stat-item"><span class="item-dot blue"></span><span>checklistverif step</span><span class="item-count">10</span></div><div class="stat-item"><span class="item-dot green"></span><span>done</span><span class="item-count">45</span></div></div></div>
                <div class="directory-stat-card"><div class="stat-header">SOCIAL ENGAGEMENT</div><div class="stat-items"><div class="stat-item"><span class="item-dot orange"></span><span>Total HR Post Items</span><span class="item-count">2,450</span></div><div class="stat-item"><span class="item-dot blue"></span><span>Total HR Post Comments</span><span class="item-count">840</span></div><div class="stat-item"><span class="item-dot green"></span><span>Total HR Post Likes</span><span class="item-count">1,120</span></div><div class="stat-item"><span class="item-dot purple"></span><span>Total BD Post Comments</span><span class="item-count">495</span></div><div class="stat-item"><span class="item-dot red"></span><span>Total Anniv. Post Likes</span><span class="item-count">5,600</span></div><div class="stat-item"><span class="item-dot gray"></span><span>Total Anniv. Comments</span><span class="item-count">1,205</span></div></div></div>
            </div>
        </div>
    `
};

// DIRECTORY DYNAMIC INSIGHTS with Chart.js
const DirectoryDynamicInsights = {
    template: `
        <div class="dynamic-insights-content">
            <div class="charts-row">
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-clock"></i> SLA Onboarding in days</h3></div><div class="chart-container small"><canvas ref="slaChart"></canvas></div></div>
                <div class="chart-card feeling-card"><div class="chart-header"><h3>How are you feeling?</h3></div><div class="feeling-stats"><div class="feeling-item"><span class="emoji">😊</span><span class="feeling-label">Great</span><span class="feeling-count">245 ENTRIES</span></div><div class="feeling-item"><span class="emoji">😐</span><span class="feeling-label">Okay</span><span class="feeling-count">158 ENTRIES</span></div><div class="feeling-item"><span class="emoji">😴</span><span class="feeling-label">Tired</span><span class="feeling-count">86 ENTRIES</span></div><div class="feeling-item"><span class="emoji">😟</span><span class="feeling-label">Struggling</span><span class="feeling-count">32 ENTRIES</span></div></div></div>
            </div>
            <div class="chart-card full-width"><div class="chart-header"><h3><i class="pi pi-chart-bar"></i> Feeling Insights</h3></div><div class="chart-container"><canvas ref="feelingChart"></canvas></div></div>
            <div class="section-title" style="margin-top: 2rem;"><i class="pi pi-heart"></i> SOCIAL ENGAGEMENT INSIGHTS (MONTHLY)</div>
            <div class="charts-row">
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-heart"></i> Avg. Likes per HR Post</h3></div><div class="chart-container small"><canvas ref="hrLikesChart"></canvas></div></div>
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-comment"></i> Avg. Comments per HR Post</h3></div><div class="chart-container small"><canvas ref="hrCommentsChart"></canvas></div></div>
            </div>
            <div class="charts-row">
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-heart"></i> Avg. Likes per BD Post</h3></div><div class="chart-container small"><canvas ref="bdLikesChart"></canvas></div></div>
                <div class="chart-card"><div class="chart-header"><h3><i class="pi pi-comment"></i> Avg. Comments per BD Post</h3></div><div class="chart-container small"><canvas ref="bdCommentsChart"></canvas></div></div>
            </div>
        </div>
    `,
    setup() {
        const { ref, onMounted, onUnmounted } = Vue;
        const slaChart = ref(null); const feelingChart = ref(null);
        const hrLikesChart = ref(null); const hrCommentsChart = ref(null);
        const bdLikesChart = ref(null); const bdCommentsChart = ref(null);
        let charts = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

        const initCharts = () => {
            if (slaChart.value) { charts.push(new Chart(slaChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'SLA Days', data: [5, 4.5, 4, 3.5, 3, 2.8, 2.5], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
            if (feelingChart.value) { charts.push(new Chart(feelingChart.value.getContext('2d'), { type: 'bar', data: { labels: months, datasets: [{ label: 'Great', data: [180, 190, 200, 220, 230, 240, 245], backgroundColor: '#16a34a' }, { label: 'Okay', data: [140, 145, 150, 155, 156, 158, 158], backgroundColor: '#3b82f6' }, { label: 'Tired', data: [70, 75, 80, 82, 84, 85, 86], backgroundColor: '#f97316' }, { label: 'Struggling', data: [25, 28, 30, 30, 31, 31, 32], backgroundColor: '#8b5cf6' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } } })); }
            if (hrLikesChart.value) { charts.push(new Chart(hrLikesChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'Likes', data: [45, 52, 58, 65, 72, 78, 85], borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
            if (hrCommentsChart.value) { charts.push(new Chart(hrCommentsChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'Comments', data: [12, 15, 18, 22, 25, 28, 32], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
            if (bdLikesChart.value) { charts.push(new Chart(bdLikesChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'Likes', data: [30, 35, 40, 42, 45, 48, 50], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
            if (bdCommentsChart.value) { charts.push(new Chart(bdCommentsChart.value.getContext('2d'), { type: 'line', data: { labels: months, datasets: [{ label: 'Comments', data: [8, 10, 12, 14, 16, 18, 20], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } })); }
        };

        onMounted(() => { setTimeout(initCharts, 100); });
        onUnmounted(() => { charts.forEach(c => c.destroy()); });

        return { slaChart, feelingChart, hrLikesChart, hrCommentsChart, bdLikesChart, bdCommentsChart };
    }
};

// SETTINGS STATIC INSIGHTS
const SettingsStaticInsights = {
    template: `
        <div class="static-insights-content">
            <div class="section-title"><i class="pi pi-cog"></i> GLOBAL CONFIGURATION SNAPSHOTS</div>
            <div class="settings-stats-grid">
                <div class="settings-stat-card"><div class="stat-header"><i class="pi pi-building"></i> ORGANIZATIONAL FOOTPRINT</div><div class="stat-items"><div class="stat-item"><span class="item-dot orange"></span><span>Countries of Work</span><span class="item-count">2</span></div><div class="stat-item"><span class="item-dot blue"></span><span>Offices</span><span class="item-count">5</span></div><div class="stat-item"><span class="item-dot green"></span><span>Total Departments</span><span class="item-count">12</span></div><div class="stat-item"><span class="item-dot purple"></span><span>Total Sections</span><span class="item-count">28</span></div><div class="stat-item"><span class="item-dot red"></span><span>Total Units</span><span class="item-count">45</span></div><div class="stat-item"><span class="item-dot gray"></span><span>Total Teams</span><span class="item-count">62</span></div></div><a class="view-more-link">VIEW MORE <i class="pi pi-chevron-down"></i></a></div>
                <div class="settings-stat-card"><div class="stat-header"><i class="pi pi-briefcase"></i> WORKFORCE & OPERATIONS</div><div class="stat-items"><div class="stat-item"><span class="item-dot orange"></span><span>Total Job Titles</span><span class="item-count">165</span></div><div class="stat-item"><span class="item-dot blue"></span><span>Total Cost Centers</span><span class="item-count">8</span></div><div class="stat-item"><span class="item-dot green"></span><span>Total NOMAD SHIFT</span><span class="item-count">4</span></div><div class="stat-item"><span class="item-dot purple"></span><span>Total FLEXIBLE</span><span class="item-count">2</span></div></div><a class="view-more-link">VIEW MORE <i class="pi pi-chevron-down"></i></a></div>
                <div class="settings-stat-card"><div class="stat-header"><i class="pi pi-calendar"></i> COMPLIANCES & HOLIDAYS</div><div class="stat-items"><div class="stat-item"><span class="item-dot orange"></span><span>Holidays</span><span class="item-count">22</span></div><div class="stat-item"><span class="item-dot blue"></span><span>Total Admin</span><span class="item-count">8</span></div><div class="stat-item"><span class="item-dot green"></span><span>Total Public Holiday</span><span class="item-count">12</span></div><div class="stat-item"><span class="item-dot purple"></span><span>Total Valid Documents</span><span class="item-count">1,430</span></div><div class="stat-item"><span class="item-dot red"></span><span>Total Expired Documents</span><span class="item-count">12</span></div></div><a class="view-more-link">VIEW MORE <i class="pi pi-chevron-down"></i></a></div>
                <div class="settings-stat-card"><div class="stat-header"><i class="pi pi-users"></i> KEY SYSTEM ROLES</div><div class="stat-items"><div class="stat-item"><span class="item-dot orange"></span><span>Total Admin</span><span class="item-count">3</span></div><div class="stat-item"><span class="item-dot blue"></span><span>Total HR Manager</span><span class="item-count">2</span></div><div class="stat-item"><span class="item-dot green"></span><span>Total HR Team</span><span class="item-count">8</span></div><div class="stat-item"><span class="item-dot purple"></span><span>Total SVS Accountants</span><span class="item-count">4</span></div><div class="stat-item"><span class="item-dot red"></span><span>Total Payroll Team</span><span class="item-count">3</span></div></div><a class="view-more-link">VIEW MORE <i class="pi pi-chevron-down"></i></a></div>
            </div>
        </div>
    `
};

// APPRAISALS INSIGHTS
const AppraisalsInsights = {
    props: ['cycle'],
    template: `
        <div class="appraisals-insights-content">
            <div class="appraisal-cycle-header"><div class="cycle-info"><span class="cycle-badge">ACTIVE ANALYSIS CYCLE</span><h2>APRIL 2024 - APRIL 2025</h2><span class="live-tracking"><i class="pi pi-circle-fill"></i> LIVE PERFORMANCE TRACKING</span></div><div class="coverage-card"><span class="coverage-label">ORGANISATION COVERAGE</span><span class="coverage-value">82%</span><span class="coverage-detail">9 OF 11 EMPLOYEES IN CYCLE</span></div></div>
            <div class="appraisal-stats-grid"><div class="appraisal-stat-card"><i class="pi pi-users"></i><span class="stat-value">2</span><span class="stat-label">ASSIGNED</span></div><div class="appraisal-stat-card"><i class="pi pi-user-edit"></i><span class="stat-value">0</span><span class="stat-label">SELF EVAL</span></div><div class="appraisal-stat-card"><i class="pi pi-file-edit"></i><span class="stat-value">0</span><span class="stat-label">COMMITTED</span></div><div class="appraisal-stat-card completed"><i class="pi pi-check-circle"></i><span class="stat-value">9</span><span class="stat-label">COMPLETED</span></div></div>
            <div class="score-distribution-card">
                <div class="score-header">SCORE DISTRIBUTION</div>
                <div class="score-bars">
                    <div class="score-bar-row">
                        <div class="score-bar-content">
                            <span class="score-label">EXCEPTIONAL (90%+)</span>
                            <div class="score-bar-track"><div class="score-bar-fill" style="width: 33%"></div></div>
                        </div>
                        <span class="score-count">3</span>
                    </div>
                    <div class="score-bar-row">
                        <div class="score-bar-content">
                            <span class="score-label">MEETS EXPECTATIONS</span>
                            <div class="score-bar-track"><div class="score-bar-fill" style="width: 56%"></div></div>
                        </div>
                        <span class="score-count">5</span>
                    </div>
                    <div class="score-bar-row">
                        <div class="score-bar-content">
                            <span class="score-label">NEEDS IMPROVEMENT</span>
                            <div class="score-bar-track"><div class="score-bar-fill" style="width: 11%"></div></div>
                        </div>
                        <span class="score-count">1</span>
                    </div>
                    <div class="score-bar-row">
                        <div class="score-bar-content">
                            <span class="score-label">UNSATISFACTORY</span>
                            <div class="score-bar-track"><div class="score-bar-fill" style="width: 0%"></div></div>
                        </div>
                        <span class="score-count">0</span>
                    </div>
                </div>
            </div>
            <div class="appraisal-note"><i class="pi pi-info-circle"></i><span>Data is aggregated from individual performance reviews and objective tracking modules for this selected cycle. Values update in real-time as managers submit their final assessments.</span></div>
        </div>
    `
};

// Register all sub-components to window first
window.AttendanceStaticInsights = AttendanceStaticInsights;
window.AttendanceDynamicInsights = AttendanceDynamicInsights;
window.PayrollStaticInsights = PayrollStaticInsights;
window.PayrollDynamicInsights = PayrollDynamicInsights;
window.RequestsStaticInsights = RequestsStaticInsights;
window.RequestsDynamicInsights = RequestsDynamicInsights;
window.DemographyStaticInsights = DemographyStaticInsights;
window.DemographyDynamicInsights = DemographyDynamicInsights;
window.HrdeskStaticInsights = HrdeskStaticInsights;
window.HrdeskDynamicInsights = HrdeskDynamicInsights;
window.DirectoryStaticInsights = DirectoryStaticInsights;
window.DirectoryDynamicInsights = DirectoryDynamicInsights;
window.SettingsStaticInsights = SettingsStaticInsights;
window.AppraisalsInsights = AppraisalsInsights;

// MAIN STATS COMPONENT - defined AFTER all sub-components
const StatsComponent = {
    components: {
        'attendance-static-insights': AttendanceStaticInsights,
        'attendance-dynamic-insights': AttendanceDynamicInsights,
        'payroll-static-insights': PayrollStaticInsights,
        'payroll-dynamic-insights': PayrollDynamicInsights,
        'requests-static-insights': RequestsStaticInsights,
        'requests-dynamic-insights': RequestsDynamicInsights,
        'demography-static-insights': DemographyStaticInsights,
        'demography-dynamic-insights': DemographyDynamicInsights,
        'hrdesk-static-insights': HrdeskStaticInsights,
        'hrdesk-dynamic-insights': HrdeskDynamicInsights,
        'directory-static-insights': DirectoryStaticInsights,
        'directory-dynamic-insights': DirectoryDynamicInsights,
        'settings-static-insights': SettingsStaticInsights,
        'appraisals-insights': AppraisalsInsights
    },
    template: `
        <div class="stats-page">
            <!-- Module Tabs -->
            <div class="stats-module-tabs">
                <button v-for="mod in modules" :key="mod.id" 
                        class="module-tab" 
                        :class="{ active: activeModule === mod.id }"
                        @click="activeModule = mod.id">
                    <i :class="'pi ' + mod.icon"></i>
                    <span>{{ mod.name }}</span>
                </button>
            </div>

            <!-- Page Header -->
            <div class="stats-header">
                <div class="stats-title">
                    <h1>{{ currentModuleTitle }}</h1>
                    <p>Real-time data updates</p>
                </div>
            </div>

            <!-- Insights Tabs (not for Settings, Appraisals, and Training) -->
            <div class="insights-tabs" v-if="activeModule !== 'settings' && activeModule !== 'appraisals' && activeModule !== 'training'">
                <button class="insight-tab" :class="{ active: insightTab === 'static' }" @click="insightTab = 'static'">
                    <i class="pi pi-table"></i> Static Insights
                </button>
                <button class="insight-tab" :class="{ active: insightTab === 'dynamic' }" @click="insightTab = 'dynamic'">
                    <i class="pi pi-chart-line"></i> Dynamic Insights
                </button>
            </div>

            <!-- Filters Section -->
            <div class="stats-filters" v-if="activeModule !== 'appraisals' && activeModule !== 'training'">
                <div class="module-filters">
                    <!-- Type/Month/Year Date Filters (for Payroll, Demography, Directory, Settings) -->
                    <template v-if="usesTypeDateFilter">
                        <div class="filter-group">
                            <label>Type</label>
                            <p-select v-model="dynamicFilters.type" :options="['Monthly', 'Quarterly', 'Yearly']" 
                                      placeholder="Monthly"></p-select>
                        </div>
                        <div class="filter-group" v-if="dynamicFilters.type === 'Monthly'">
                            <label>Month</label>
                            <p-select v-model="dynamicFilters.month" :options="months" 
                                      placeholder="Select month" showClear></p-select>
                        </div>
                        <div class="filter-group" v-if="dynamicFilters.type === 'Quarterly'">
                            <label>Quarter</label>
                            <p-select v-model="dynamicFilters.quarter" :options="quarters" 
                                      placeholder="Select quarter" showClear></p-select>
                        </div>
                        <div class="filter-group">
                            <label>Year</label>
                            <p-select v-model="dynamicFilters.year" :options="years" 
                                      placeholder="Select year" showClear></p-select>
                        </div>
                    </template>

                    <!-- Custom Date Range Filter (for Attendance, Requests, HR Desk only) -->
                    <div class="filter-group date-range-trigger" v-if="usesCustomDateRange">
                        <label>Date Range</label>
                        <button class="date-range-button" :class="{ active: showDateRangePicker, 'has-dates': customRange.from || customRange.to }" @click="toggleDateRangePicker">
                            <i class="pi pi-calendar"></i>
                            <span v-if="customRange.from && customRange.to">{{ formatDateRange }}</span>
                            <span v-else>Select dates</span>
                            <i class="pi pi-chevron-down"></i>
                        </button>
                        <!-- Date Range Dropdown -->
                        <div class="date-range-dropdown" v-if="showDateRangePicker">
                            <div class="date-range-dropdown-content">
                                <div class="date-field">
                                    <label>From Date</label>
                                    <p-datepicker v-model="customRange.from" dateFormat="dd/mm/yy" placeholder="Start date" :inline="false"></p-datepicker>
                                </div>
                                <div class="date-field">
                                    <label>To Date</label>
                                    <p-datepicker v-model="customRange.to" dateFormat="dd/mm/yy" placeholder="End date" :inline="false"></p-datepicker>
                                </div>
                            </div>
                            <div class="date-range-dropdown-actions">
                                <p-button label="Clear" text size="small" @click="clearDateRange"></p-button>
                                <p-button label="Apply" size="small" @click="applyDateRange"></p-button>
                            </div>
                        </div>
                    </div>

                    <!-- Common Filters -->
                    <div class="filter-group" v-if="showDepartmentFilter">
                        <label>Department</label>
                        <p-select v-model="filters.department" :options="departments" optionLabel="name" optionValue="id"
                                  placeholder="All Departments" showClear style="width: 150px;" @change="onDepartmentChange"></p-select>
                    </div>
                    <div class="filter-group" v-if="showSectionFilter">
                        <label>Section</label>
                        <p-select v-model="filters.section" :options="filteredSections" optionLabel="name" optionValue="id"
                                  placeholder="All Sections" showClear style="width: 140px;" @change="onSectionChange" 
                                  :disabled="!filters.department"></p-select>
                    </div>
                    <div class="filter-group" v-if="showUnitFilter">
                        <label>Unit</label>
                        <p-select v-model="filters.unit" :options="filteredUnits" optionLabel="name" optionValue="id"
                                  placeholder="All Units" showClear style="width: 120px;" @change="onUnitChange"
                                  :disabled="!filters.section"></p-select>
                    </div>
                    <div class="filter-group" v-if="showTeamFilter">
                        <label>Team</label>
                        <p-select v-model="filters.team" :options="filteredTeams" optionLabel="name" optionValue="id"
                                  placeholder="All Teams" showClear style="width: 120px;"
                                  :disabled="!filters.unit"></p-select>
                    </div>
                    <div class="filter-group" v-if="showEntityFilter">
                        <label>Entity</label>
                        <p-select v-model="filters.entity" :options="entities" optionLabel="name" optionValue="id"
                                  placeholder="All Entities" showClear style="width: 130px;"></p-select>
                    </div>
                    <div class="filter-group" v-if="showCostCenterFilter">
                        <label>Cost Center</label>
                        <p-select v-model="filters.costCenter" :options="costCenters" optionLabel="name" optionValue="id"
                                  placeholder="All Cost Centers" showClear style="width: 150px;"></p-select>
                    </div>
                    <div class="filter-group" v-if="showCountryFilter">
                        <label>Country Work</label>
                        <p-select v-model="filters.country" :options="countries" optionLabel="name" optionValue="id"
                                  placeholder="All Countries" showClear style="width: 140px;"></p-select>
                    </div>
                    <div class="filter-group" v-if="showOfficeFilter">
                        <label>Office Work</label>
                        <p-select v-model="filters.office" :options="offices" optionLabel="name" optionValue="id"
                                  placeholder="All Offices" showClear style="width: 130px;"></p-select>
                    </div>

                    <!-- Search and Reset Buttons -->
                    <div class="filter-group filter-action">
                        <label>&nbsp;</label>
                        <div class="filter-buttons">
                            <p-button label="Search" icon="pi pi-search" class="search-btn" @click="applyFilters"></p-button>
                            <p-button label="Reset" icon="pi pi-refresh" class="reset-btn" outlined @click="resetFilters"></p-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Appraisal Cycle Selector -->
            <div class="appraisal-cycle-selector" v-if="activeModule === 'appraisals'">
                <div class="cycle-label"><i class="pi pi-calendar"></i> SELECT APPRAISAL CYCLE:</div>
                <p-select v-model="selectedAppraisalCycle" :options="appraisalCycles" optionLabel="label" optionValue="id"
                          placeholder="Select cycle" style="width: 250px;"></p-select>
                <p-button label="Apply" icon="pi pi-check" @click="applyAppraisalCycle" :disabled="!selectedAppraisalCycle"></p-button>
            </div>

            <!-- Export Actions -->
            <div class="stats-actions" v-if="insightTab === 'static'">
                <p-button v-if="activeModule === 'directory'" label="Export Directory Data" icon="pi pi-download" outlined size="small"></p-button>
                <p-button v-else-if="activeModule === 'requests'" label="Download PDF Report" icon="pi pi-file-pdf" outlined size="small"></p-button>
                <p-button v-else label="Export Report" icon="pi pi-download" outlined size="small"></p-button>
            </div>

            <!-- Content Area -->
            <div class="stats-content">
                <template v-if="activeModule === 'attendance'">
                    <attendance-static-insights v-if="insightTab === 'static'" :date-range="selectedDateRange" :custom-range-applied="customRangeApplied" :custom-range-dates="customRange" @open-date-picker="toggleDateRangePicker"></attendance-static-insights>
                    <attendance-dynamic-insights v-else></attendance-dynamic-insights>
                </template>
                <template v-else-if="activeModule === 'payroll'">
                    <payroll-static-insights v-if="insightTab === 'static'" :date-range="selectedDateRange"></payroll-static-insights>
                    <payroll-dynamic-insights v-else></payroll-dynamic-insights>
                </template>
                <template v-else-if="activeModule === 'requests'">
                    <requests-static-insights v-if="insightTab === 'static'" :date-range="selectedDateRange"></requests-static-insights>
                    <requests-dynamic-insights v-else></requests-dynamic-insights>
                </template>
                <template v-else-if="activeModule === 'demography'">
                    <demography-static-insights v-if="insightTab === 'static'"></demography-static-insights>
                    <demography-dynamic-insights v-else></demography-dynamic-insights>
                </template>
                <template v-else-if="activeModule === 'hrdesk'">
                    <hrdesk-static-insights v-if="insightTab === 'static'" :date-range="selectedDateRange"></hrdesk-static-insights>
                    <hrdesk-dynamic-insights v-else></hrdesk-dynamic-insights>
                </template>
                <template v-else-if="activeModule === 'directory'">
                    <directory-static-insights v-if="insightTab === 'static'"></directory-static-insights>
                    <directory-dynamic-insights v-else></directory-dynamic-insights>
                </template>
                <template v-else-if="activeModule === 'settings'">
                    <settings-static-insights v-if="insightTab === 'static'"></settings-static-insights>
                </template>
                <template v-else-if="activeModule === 'appraisals'">
                    <appraisals-insights v-if="appraisalCycleApplied" :cycle="selectedAppraisalCycle"></appraisals-insights>
                    <div v-else class="appraisal-placeholder">
                        <i class="pi pi-calendar-plus"></i>
                        <p>Please select an appraisal cycle and click Apply to view insights</p>
                    </div>
                </template>
                <template v-else-if="activeModule === 'training'">
                    <training-insights></training-insights>
                </template>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed, reactive } = Vue;

        const modules = ref([
            { id: 'attendance', name: 'Attendance', icon: 'pi-clock' },
            { id: 'payroll', name: 'Payroll', icon: 'pi-dollar' },
            { id: 'requests', name: 'Requests', icon: 'pi-send' },
            { id: 'demography', name: 'Demography', icon: 'pi-users' },
            { id: 'hrdesk', name: 'HR Desk', icon: 'pi-ticket' },
            { id: 'directory', name: 'Directory and Onboarding', icon: 'pi-id-card' },
            { id: 'settings', name: 'Settings', icon: 'pi-cog' },
            { id: 'appraisals', name: 'Appraisal', icon: 'pi-star' },
            { id: 'training', name: 'Training', icon: 'pi-book' }
        ]);

        const activeModule = ref('attendance');

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const quarters = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];
        const years = [2024, 2025, 2026];

        // Per-module state storage
        const createModuleState = () => ({
            insightTab: 'static',
            selectedDateRange: 'yesterday',
            customRange: { from: null, to: null },
            customRangeApplied: false,
            showDateRangePicker: false,
            dynamicFilters: { type: 'Monthly', month: 'February', quarter: null, year: 2026 },
            filters: { department: null, section: null, unit: null, team: null, entity: null, costCenter: null, country: null, office: null }
        });

        const moduleStates = reactive({
            attendance: createModuleState(),
            payroll: createModuleState(),
            requests: createModuleState(),
            demography: createModuleState(),
            hrdesk: createModuleState(),
            directory: createModuleState(),
            settings: createModuleState(),
            appraisals: { ...createModuleState(), selectedCycle: null, cycleApplied: false }
        });

        // Computed properties that reference current module's state
        const currentState = computed(() => moduleStates[activeModule.value]);
        const insightTab = computed({
            get: () => currentState.value.insightTab,
            set: (val) => { moduleStates[activeModule.value].insightTab = val; }
        });
        const selectedDateRange = computed({
            get: () => currentState.value.selectedDateRange,
            set: (val) => { moduleStates[activeModule.value].selectedDateRange = val; }
        });
        const customRange = computed(() => currentState.value.customRange);
        const customRangeApplied = computed({
            get: () => currentState.value.customRangeApplied,
            set: (val) => { moduleStates[activeModule.value].customRangeApplied = val; }
        });
        const showDateRangePicker = computed({
            get: () => currentState.value.showDateRangePicker,
            set: (val) => { moduleStates[activeModule.value].showDateRangePicker = val; }
        });
        const dynamicFilters = computed(() => currentState.value.dynamicFilters);
        const filters = computed(() => currentState.value.filters);
        
        // Format date range for display
        const formatDateRange = computed(() => {
            const range = customRange.value;
            if (range.from && range.to) {
                const from = new Date(range.from);
                const to = new Date(range.to);
                return `${from.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${to.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
            }
            return 'Select dates';
        });

        // Dropdown options (shared across modules)
        const departments = ref([
            { id: 1, name: 'Software Engineering' }, { id: 2, name: 'Customer Success' }, { id: 3, name: 'Finance & Accounting' }, { id: 4, name: 'Human Resources' }, { id: 5, name: 'Supply Chain' }
        ]);
        const sections = ref([
            { id: 1, name: 'Frontend Development', departmentId: 1 }, { id: 2, name: 'Backend Development', departmentId: 1 }, { id: 3, name: 'Support Team', departmentId: 2 }, { id: 4, name: 'Payroll', departmentId: 3 }, { id: 5, name: 'Recruitment', departmentId: 4 }
        ]);
        const units = ref([
            { id: 1, name: 'React Team', sectionId: 1 }, { id: 2, name: 'Vue Team', sectionId: 1 }, { id: 3, name: 'API Team', sectionId: 2 }, { id: 4, name: 'Tier 1 Support', sectionId: 3 }
        ]);
        const teams = ref([
            { id: 1, name: 'Alpha Squad', unitId: 1 }, { id: 2, name: 'Beta Squad', unitId: 1 }, { id: 3, name: 'Core API', unitId: 3 }
        ]);
        const entities = ref([{ id: 1, name: 'Direct' }, { id: 2, name: 'Tawfiq' }]);
        const costCenters = ref([{ id: 1, name: 'Operations' }, { id: 2, name: 'Sales & Marketing' }, { id: 3, name: 'IT & Digital' }, { id: 4, name: 'Corporate Services' }]);
        const countries = ref([{ id: 1, name: 'Saudi Arabia' }, { id: 2, name: 'Egypt' }, { id: 3, name: 'UAE' }]);
        const offices = ref([{ id: 1, name: 'Riyadh HQ' }, { id: 2, name: 'Jeddah Branch' }, { id: 3, name: 'Dammam Branch' }]);

        const appraisalCycles = ref([{ id: 1, label: 'APRIL 2024 - APRIL 2025' }, { id: 2, label: 'APRIL 2023 - APRIL 2024' }, { id: 3, label: 'APRIL 2022 - APRIL 2023' }]);
        const selectedAppraisalCycle = computed({
            get: () => moduleStates.appraisals.selectedCycle,
            set: (val) => { moduleStates.appraisals.selectedCycle = val; }
        });
        const appraisalCycleApplied = computed({
            get: () => moduleStates.appraisals.cycleApplied,
            set: (val) => { moduleStates.appraisals.cycleApplied = val; }
        });

        const currentModuleTitle = computed(() => modules.value.find(m => m.id === activeModule.value)?.name || 'Stats');
        const filteredSections = computed(() => {
            const f = filters.value;
            return f.department ? sections.value.filter(s => s.departmentId === f.department) : [];
        });
        const filteredUnits = computed(() => {
            const f = filters.value;
            return f.section ? units.value.filter(u => u.sectionId === f.section) : [];
        });
        const filteredTeams = computed(() => {
            const f = filters.value;
            return f.unit ? teams.value.filter(t => t.unitId === f.unit) : [];
        });
        const hasModuleFilters = computed(() => ['attendance', 'requests', 'hrdesk'].includes(activeModule.value));
        const usesCustomDateRange = computed(() => ['attendance', 'requests', 'hrdesk'].includes(activeModule.value));
        const usesTypeDateFilter = computed(() => ['payroll', 'demography', 'directory', 'settings'].includes(activeModule.value));
        const showDepartmentFilter = computed(() => hasModuleFilters.value);
        const showSectionFilter = computed(() => hasModuleFilters.value);
        const showUnitFilter = computed(() => hasModuleFilters.value);
        const showTeamFilter = computed(() => hasModuleFilters.value);
        const showEntityFilter = computed(() => activeModule.value === 'attendance');
        const showCostCenterFilter = computed(() => ['attendance', 'payroll'].includes(activeModule.value));
        const showCountryFilter = computed(() => activeModule.value === 'attendance');
        const showOfficeFilter = computed(() => activeModule.value === 'attendance');

        const onDepartmentChange = () => { 
            const f = moduleStates[activeModule.value].filters;
            f.section = null; f.unit = null; f.team = null; 
        };
        const onSectionChange = () => { 
            const f = moduleStates[activeModule.value].filters;
            f.unit = null; f.team = null; 
        };
        const onUnitChange = () => { 
            const f = moduleStates[activeModule.value].filters;
            f.team = null; 
        };
        const applyAppraisalCycle = () => { 
            if (moduleStates.appraisals.selectedCycle) {
                moduleStates.appraisals.cycleApplied = true;
            }
        };
        
        // Date range picker methods
        const toggleDateRangePicker = () => {
            showDateRangePicker.value = !showDateRangePicker.value;
        };
        
        const clearDateRange = () => {
            const range = moduleStates[activeModule.value].customRange;
            range.from = null;
            range.to = null;
            moduleStates[activeModule.value].customRangeApplied = false;
            moduleStates[activeModule.value].showDateRangePicker = false;
        };
        
        const applyDateRange = () => {
            if (customRange.value.from && customRange.value.to) {
                moduleStates[activeModule.value].customRangeApplied = true;
            }
            moduleStates[activeModule.value].showDateRangePicker = false;
        };
        
        const applyFilters = () => {
            console.log('Applying filters for module:', activeModule.value, filters.value);
        };
        
        const resetFilters = () => {
            const state = moduleStates[activeModule.value];
            // Reset filters
            state.filters = { department: null, section: null, unit: null, team: null, entity: null, costCenter: null, country: null, office: null };
            // Reset dynamic filters
            state.dynamicFilters = { type: 'Monthly', month: null, quarter: null, year: 2026 };
            // Reset custom range
            state.customRange = { from: null, to: null };
            state.customRangeApplied = false;
            state.showDateRangePicker = false;
            console.log('Filters reset for module:', activeModule.value);
        };

        return {
            modules, activeModule, insightTab, selectedDateRange, customRange, dynamicFilters, months, quarters, years,
            filters, departments, sections, units, teams, entities, costCenters, countries, offices,
            appraisalCycles, selectedAppraisalCycle, appraisalCycleApplied, customRangeApplied, currentModuleTitle,
            filteredSections, filteredUnits, filteredTeams, hasModuleFilters, showDateRangePicker, formatDateRange,
            usesCustomDateRange, usesTypeDateFilter,
            showDepartmentFilter, showSectionFilter, showUnitFilter, showTeamFilter, showEntityFilter, showCostCenterFilter, showCountryFilter, showOfficeFilter,
            onDepartmentChange, onSectionChange, onUnitChange, applyAppraisalCycle, toggleDateRangePicker, clearDateRange, applyDateRange, applyFilters, resetFilters
        };
    }
};

// Register main component to window
window.StatsComponent = StatsComponent;
