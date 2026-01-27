/**
 * Payroll Component
 * Complete payroll module with strategic comparison, cycle tracking, and 7-step wizard
 */

const PayrollComponent = {
    template: `
        <div class="payroll-module">
            <!-- Main View Toggle -->
            <div class="payroll-view-toggle" v-if="!selectedCycle">
                <div class="toggle-tabs">
                    <button class="toggle-tab" :class="{ active: activeView === 'tracking' }" @click="activeView = 'tracking'">
                        <i class="pi pi-list"></i> Payroll Tracking
                    </button>
                    <button class="toggle-tab" :class="{ active: activeView === 'stats' }" @click="activeView = 'stats'">
                        <i class="pi pi-chart-bar"></i> Strategic Comparison
                    </button>
                </div>
            </div>

            <!-- Strategic Comparison Dashboard -->
            <div v-if="activeView === 'stats' && !selectedCycle" class="strategic-dashboard">
                <div class="dashboard-header">
                    <div>
                        <h2 class="dashboard-title">STRATEGIC COMPARISON</h2>
                        <p class="dashboard-subtitle">Analyzing performance: <span class="highlight-primary">JANUARY 2025</span> vs <span class="highlight-secondary">MAY 2025</span></p>
                    </div>
                    <div class="dashboard-actions">
                        <div class="period-toggle">
                            <span class="period-label active">JAN</span>
                            <span class="period-label">MAY</span>
                        </div>
                        <span class="audit-badge"><i class="pi pi-verified"></i> AUDIT VERIFIED</span>
                    </div>
                </div>

                <!-- Comparison Stats Cards -->
                <div class="comparison-stats-grid">
                    <div class="comparison-stat-card">
                        <div class="stat-header">
                            <span class="stat-title">TOTAL NET DISBURSEMENT</span>
                        </div>
                        <div class="stat-comparison">
                            <div class="stat-period">
                                <span class="period-tag jan">JAN 25</span>
                                <span class="period-value small">{{ formatCurrency(stats.jan2025.totalNetDisbursement) }}</span>
                            </div>
                            <div class="stat-period main">
                                <span class="period-tag may">MAY 25</span>
                                <span class="period-value large">{{ formatCurrency(stats.may2025.totalNetDisbursement) }} <span class="currency">SAR</span></span>
                            </div>
                        </div>
                        <div class="stat-change negative">
                            <i class="pi pi-arrow-down"></i> 23.5%
                            <span class="change-label">FINAL EMPLOYEE PAYOUTS</span>
                        </div>
                    </div>

                    <div class="comparison-stat-card">
                        <div class="stat-header">
                            <span class="stat-title">TOTAL GROSS LIABILITY</span>
                        </div>
                        <div class="stat-comparison">
                            <div class="stat-period">
                                <span class="period-tag jan">JAN 25</span>
                                <span class="period-value small">{{ formatCurrency(stats.jan2025.totalGrossLiability) }}</span>
                            </div>
                            <div class="stat-period main">
                                <span class="period-tag may">MAY 25</span>
                                <span class="period-value large">{{ formatCurrency(stats.may2025.totalGrossLiability) }} <span class="currency">SAR</span></span>
                            </div>
                        </div>
                        <div class="stat-change negative">
                            <i class="pi pi-arrow-down"></i> 24.1%
                            <span class="change-label">TOTAL COMPANY COST</span>
                        </div>
                    </div>

                    <div class="comparison-stat-card">
                        <div class="stat-header">
                            <span class="stat-title">GLOBAL HEADCOUNT</span>
                        </div>
                        <div class="stat-comparison">
                            <div class="stat-period">
                                <span class="period-tag jan">JAN 25</span>
                                <span class="period-value small">{{ stats.jan2025.globalHeadcount }}</span>
                            </div>
                            <div class="stat-period main">
                                <span class="period-tag may">MAY 25</span>
                                <span class="period-value large">{{ stats.may2025.globalHeadcount }} <span class="currency">EMP</span></span>
                            </div>
                        </div>
                        <div class="stat-change negative">
                            <i class="pi pi-arrow-down"></i> 34.5%
                            <span class="change-label">ACTIVE STAFF IN CYCLE</span>
                        </div>
                    </div>

                    <div class="comparison-stat-card">
                        <div class="stat-header">
                            <span class="stat-title">TOTAL COMMISSIONS</span>
                        </div>
                        <div class="stat-comparison">
                            <div class="stat-period">
                                <span class="period-tag jan">JAN 25</span>
                                <span class="period-value small">{{ formatCurrency(stats.jan2025.totalCommissions) }}</span>
                            </div>
                            <div class="stat-period main">
                                <span class="period-tag may">MAY 25</span>
                                <span class="period-value large">{{ formatCurrency(stats.may2025.totalCommissions) }} <span class="currency">SAR</span></span>
                            </div>
                        </div>
                        <div class="stat-change negative">
                            <i class="pi pi-arrow-down"></i> 30.0%
                            <span class="change-label">VARIABLE PERFORMANCE PAY</span>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-grid">
                    <!-- Allocation Audit Chart -->
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3>ALLOCATION AUDIT (MAY 2025)</h3>
                            <p>Regional snapshot for May closed cycle</p>
                        </div>
                        <div class="chart-body">
                            <div class="bar-chart">
                                <div class="bar-item" v-for="dept in departmentAllocation" :key="dept.name">
                                    <div class="bar-label">{{ dept.name }}</div>
                                    <div class="bar-container">
                                        <div class="bar-fill" :style="{ width: dept.value + '%', background: 'var(--primary-color)' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Regional Split Chart -->
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3>REGIONAL SPLIT (MAY)</h3>
                            <p>Staffing focus for closed period</p>
                        </div>
                        <div class="chart-body">
                            <div class="donut-chart-container">
                                <div class="donut-chart">
                                    <svg viewBox="0 0 100 100" class="donut-svg">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#06b6d4" stroke-width="20" stroke-dasharray="138 251" stroke-dashoffset="0"/>
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" stroke-width="20" stroke-dasharray="50 251" stroke-dashoffset="-138"/>
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" stroke-width="20" stroke-dasharray="38 251" stroke-dashoffset="-188"/>
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" stroke-width="20" stroke-dasharray="25 251" stroke-dashoffset="-226"/>
                                    </svg>
                                </div>
                                <div class="donut-legend">
                                    <div class="legend-item" v-for="region in regionalSplit" :key="region.name">
                                        <span class="legend-dot" :style="{ background: region.color }"></span>
                                        {{ region.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timeline Variance Chart -->
                <div class="chart-card full-width">
                    <div class="chart-header">
                        <h3>TIMELINE VARIANCE</h3>
                        <p>Growth path including verified milestones</p>
                    </div>
                    <div class="chart-body">
                        <div class="timeline-chart">
                            <svg viewBox="0 0 800 200" class="timeline-svg">
                                <!-- Grid lines -->
                                <line x1="50" y1="180" x2="750" y2="180" stroke="#e2e8f0" stroke-width="1"/>
                                <line x1="50" y1="140" x2="750" y2="140" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="5"/>
                                <line x1="50" y1="100" x2="750" y2="100" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="5"/>
                                <line x1="50" y1="60" x2="750" y2="60" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="5"/>
                                
                                <!-- Area fill -->
                                <path d="M50 150 L150 140 L280 130 L400 100 L520 90 L650 70 L750 50 L750 180 L50 180 Z" fill="rgba(255, 110, 5, 0.1)"/>
                                
                                <!-- Line -->
                                <path d="M50 150 L150 140 L280 130 L400 100 L520 90 L650 70 L750 50" fill="none" stroke="#ff6e05" stroke-width="3"/>
                                
                                <!-- Secondary line -->
                                <path d="M50 170 L150 165 L280 160 L400 155 L520 150 L650 145 L750 140" fill="none" stroke="#06b6d4" stroke-width="2"/>
                                
                                <!-- Data points -->
                                <circle cx="50" cy="150" r="4" fill="#ff6e05"/>
                                <circle cx="150" cy="140" r="4" fill="#ff6e05"/>
                                <circle cx="280" cy="130" r="4" fill="#ff6e05"/>
                                <circle cx="400" cy="100" r="4" fill="#ff6e05"/>
                                <circle cx="520" cy="90" r="4" fill="#ff6e05"/>
                                <circle cx="650" cy="70" r="4" fill="#ff6e05"/>
                                <circle cx="750" cy="50" r="4" fill="#ff6e05"/>
                                
                                <!-- X-axis labels -->
                                <text x="150" y="198" text-anchor="middle" class="chart-label">Nov 24</text>
                                <text x="280" y="198" text-anchor="middle" class="chart-label">Dec 24</text>
                                <text x="400" y="198" text-anchor="middle" class="chart-label">Jan 25</text>
                                <text x="520" y="198" text-anchor="middle" class="chart-label">Feb 25</text>
                                <text x="650" y="198" text-anchor="middle" class="chart-label">Mar 25</text>
                                <text x="750" y="198" text-anchor="middle" class="chart-label">May 25</text>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Global Payroll Tracking (Index Page) -->
            <div v-if="activeView === 'tracking' && !selectedCycle" class="payroll-tracking">
                <div class="tracking-header">
                    <div>
                        <h2>Global Payroll Tracking</h2>
                        <p>Consolidated view of all regions and cost centers grouped by month</p>
                    </div>
                    <div class="tracking-actions">
                        <p-inputtext v-model="searchQuery" placeholder="Search cycles..." style="width: 200px;"></p-inputtext>
                    </div>
                </div>

                <!-- Payroll Cycles List -->
                <div class="cycles-list">
                    <div v-for="cycle in filteredCycles" :key="cycle.id" class="cycle-card" :class="cycle.status">
                        <div class="cycle-header" @click="toggleCycleExpand(cycle.id)">
                            <div class="cycle-info">
                                <div class="cycle-icon" :class="cycle.status">
                                    <i :class="getCycleIcon(cycle.status)"></i>
                                </div>
                                <div class="cycle-title-section">
                                    <h3>{{ cycle.month }} {{ cycle.year }} Payroll Cycle</h3>
                                    <div class="cycle-status-row">
                                        <span class="status-label">MASTER STATUS:</span>
                                        <span class="status-badge" :class="cycle.status">{{ getStatusLabel(cycle.status) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="cycle-summary">
                                <div class="summary-item">
                                    <span class="summary-label">ENTITIES</span>
                                    <span class="summary-value">{{ cycle.entities }}</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">HEADCOUNT</span>
                                    <span class="summary-value">{{ cycle.headcount }}</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">SUB-CYCLES</span>
                                    <span class="summary-value">{{ cycle.subCycles }}</span>
                                </div>
                                <div class="summary-item total">
                                    <span class="summary-label">TOTAL NET VALUE</span>
                                    <span class="summary-value">{{ formatCurrency(cycle.totalNetValue) }}</span>
                                </div>
                            </div>
                            <i class="pi" :class="expandedCycles.includes(cycle.id) ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                        </div>

                        <!-- Expanded Sub-Cycles Table -->
                        <div v-if="expandedCycles.includes(cycle.id)" class="cycle-details">
                            <!-- Summary Row for Closed Cycles -->
                            <div v-if="cycle.status === 'closed'" class="cycle-financial-summary">
                                <div class="financial-item">
                                    <span class="fin-label">TOTAL NET PAY</span>
                                    <span class="fin-value primary">{{ formatCurrency(cycle.totalNetValue) }}</span>
                                </div>
                                <div class="financial-item">
                                    <span class="fin-label">TOTAL GROSS</span>
                                    <span class="fin-value">{{ formatCurrency(cycle.totalGross) }}</span>
                                </div>
                                <div class="financial-item">
                                    <span class="fin-label">TOTAL COMMISSIONS</span>
                                    <span class="fin-value">{{ formatCurrency(cycle.totalCommissions) }}</span>
                                </div>
                                <div class="financial-item">
                                    <span class="fin-label">TOTAL ARREARS ADD</span>
                                    <span class="fin-value">{{ formatCurrency(cycle.totalArrearsAdd) }}</span>
                                </div>
                                <div class="financial-item negative">
                                    <span class="fin-label">TOTAL GOSI DED.</span>
                                    <span class="fin-value">{{ formatCurrency(cycle.totalGosi) }}</span>
                                </div>
                                <div class="financial-item negative">
                                    <span class="fin-label">TOTAL ARREARS DED.</span>
                                    <span class="fin-value">{{ formatCurrency(cycle.totalArrearsDed) }}</span>
                                </div>
                            </div>

                            <div class="sub-cycles-table-wrapper">
                                <table class="sub-cycles-table">
                                    <thead>
                                        <tr>
                                            <th>REGION / ENTITY</th>
                                            <th>COST CENTER</th>
                                            <th>REQUEST ID</th>
                                            <th>HEADCOUNT</th>
                                            <th v-if="cycle.status === 'closed'">NET PAY</th>
                                            <th v-if="cycle.status === 'closed'">TOTAL GROSS</th>
                                            <th v-if="cycle.status === 'closed'">COMMISSIONS</th>
                                            <th v-if="cycle.status !== 'closed'">NET SALARY</th>
                                            <th>CURRENT STAGE</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="sub in getSubCycles(cycle.id)" :key="sub.id">
                                            <td>
                                                <div class="region-cell">
                                                    <img :src="getRegion(sub.regionId)?.flag" class="region-flag" />
                                                    {{ getRegion(sub.regionId)?.name }}
                                                </div>
                                            </td>
                                            <td>
                                                <span class="cost-center-tag" :style="{ background: getCostCenter(sub.costCenterId)?.color }">
                                                    {{ getCostCenter(sub.costCenterId)?.name }}
                                                </span>
                                            </td>
                                            <td class="request-id">{{ sub.requestId }}</td>
                                            <td>{{ sub.headcount }}</td>
                                            <td v-if="cycle.status === 'closed'">{{ formatCurrency(sub.netSalary) }}</td>
                                            <td v-if="cycle.status === 'closed'">{{ formatCurrency(sub.grossSalary || 0) }}</td>
                                            <td v-if="cycle.status === 'closed'">{{ formatCurrency(sub.commissions || 0) }}</td>
                                            <td v-if="cycle.status !== 'closed'">{{ sub.netSalary ? formatCurrency(sub.netSalary) : '—' }}</td>
                                            <td>
                                                <span class="stage-tag" :class="sub.currentStage">{{ sub.currentStage.toUpperCase() }}</span>
                                            </td>
                                            <td>
                                                <div class="action-buttons-row">
                                                    <button class="action-btn" @click="viewSubCycleActivityLog(sub)" title="View Activity Log">
                                                        <i class="pi pi-eye"></i>
                                                    </button>
                                                    <button class="action-btn primary" @click="openCycle(cycle)" title="Open Cycle">
                                                        <i class="pi pi-arrow-right"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activity Log Dialog -->
            <p-dialog v-model:visible="showActivityLogDialog" header="" modal :style="{ width: '700px', maxWidth: '95vw' }">
                <template #header>
                    <div class="audit-dialog-header">
                        <h2>PAYROLL ACTIVITY LOG</h2>
                        <p>RECENT ACTIONS ACROSS ALL CYCLES</p>
                    </div>
                </template>
                <div class="activity-log-dialog-content">
                    <div class="log-timeline">
                        <div class="log-item" v-for="log in actionLog" :key="log.id">
                            <div class="log-dot"></div>
                            <div class="log-content">
                                <div class="log-time">{{ log.timestamp }}</div>
                                <div class="log-action">{{ log.action }}</div>
                                <div class="log-user">User: {{ log.user }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </p-dialog>

            <!-- Payroll Cycle Wizard -->
            <div v-if="selectedCycle" class="payroll-wizard">
                <!-- Wizard Steps Header -->
                <div class="wizard-stepper">
                    <div v-for="(step, index) in wizardSteps" :key="step.id" 
                         class="stepper-item" 
                         :class="{ active: currentWizardStep === step.id, completed: currentWizardStep > step.id }">
                        <div class="stepper-icon">
                            <i v-if="currentWizardStep > step.id" class="pi pi-check"></i>
                            <i v-else :class="'pi ' + step.icon"></i>
                        </div>
                        <span class="stepper-label">{{ step.name.toUpperCase() }}</span>
                        <div v-if="index < wizardSteps.length - 1" class="stepper-connector" :class="{ completed: currentWizardStep > step.id }"></div>
                    </div>
                </div>

                <!-- Step 1: Initialization -->
                <div v-if="currentWizardStep === 1" class="wizard-step-content">
                    <div class="step-card">
                        <div class="step-header">
                            <div class="step-icon init"><i class="pi pi-bolt"></i></div>
                            <div>
                                <h2>Cycle Initialization</h2>
                                <p>Set up payroll cycle parameters and verify employee data</p>
                            </div>
                        </div>
                        
                        <div class="init-summary">
                            <div class="init-stat">
                                <span class="init-label">Cycle Period</span>
                                <span class="init-value">{{ selectedCycle.month }} {{ selectedCycle.year }}</span>
                            </div>
                            <div class="init-stat">
                                <span class="init-label">Total Entities</span>
                                <span class="init-value">{{ selectedCycle.entities }}</span>
                            </div>
                            <div class="init-stat">
                                <span class="init-label">Total Headcount</span>
                                <span class="init-value">{{ selectedCycle.headcount }}</span>
                            </div>
                            <div class="init-stat">
                                <span class="init-label">Created By</span>
                                <span class="init-value">{{ selectedCycle.createdBy }}</span>
                            </div>
                        </div>

                        <div class="init-checklist">
                            <h4>Pre-Flight Checklist</h4>
                            <div class="checklist-item" v-for="(item, idx) in initChecklist" :key="idx">
                                <p-checkbox v-model="item.checked" :binary="true"></p-checkbox>
                                <span>{{ item.label }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="wizard-footer">
                        <p-button label="Back to Cycles" icon="pi pi-arrow-left" text @click="closeCycle"></p-button>
                        <p-button label="Proceed to Variables" icon="pi pi-arrow-right" iconPos="right" @click="nextStep" :disabled="!allInitChecked"></p-button>
                    </div>
                </div>

                <!-- Step 2: Variables -->
                <div v-if="currentWizardStep === 2" class="wizard-step-content">
                    <div class="step-card">
                        <div class="step-header">
                            <div class="step-icon variables"><i class="pi pi-clock"></i></div>
                            <div>
                                <h2>Variable Pay Management</h2>
                                <p>Edit variable components and review full payroll structure</p>
                            </div>
                            <div class="step-actions">
                                <p-inputtext v-model="employeeSearch" placeholder="Search employee..." style="width: 200px;"></p-inputtext>
                            </div>
                        </div>

                        <div class="variables-table-wrapper">
                            <table class="variables-table sticky-first-col">
                                <thead>
                                    <tr>
                                        <th class="sticky-col">EMPLOYEE DETAILS</th>
                                        <th>BASIC SALARY</th>
                                        <th>ACCOMMODATION</th>
                                        <th>TRANSPORTATION</th>
                                        <th>OTHER ALLOWANCE</th>
                                        <th class="addition-col">COMMISSION</th>
                                        <th class="addition-col">OVERTIME</th>
                                        <th class="addition-col">OTHERS ADDITION</th>
                                        <th class="gross-col">GROSS PAY</th>
                                        <th class="deduction-col">ATTENDANCE & PUNCH DED.</th>
                                        <th class="deduction-col">LOAN REPAYMENT</th>
                                        <th class="deduction-col">ABSENT W/O LEAVE</th>
                                        <th class="deduction-col">OTHERS DEDUCTION</th>
                                        <th class="deduction-col">GOSI AMOUNT</th>
                                        <th class="deduction-col">NET DEDUCTIONS</th>
                                        <th class="total-col">TOTAL NET PAY</th>
                                        <th>COMPANY GOSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="emp in filteredPayrollEmployees" :key="emp.id" :class="{ 'stopped-row': emp.isStopped }">
                                        <td class="sticky-col">
                                            <div class="employee-cell">
                                                <div class="emp-dropdown-wrapper">
                                                    <button class="emp-menu-btn" :ref="'menuBtn' + emp.id" @click="toggleEmployeeMenu(emp.id, $event)">
                                                        <i class="pi pi-ellipsis-v"></i>
                                                    </button>
                                                </div>
                                                <div class="emp-info">
                                                    <div class="emp-name" :class="{ 'stopped-name': emp.isStopped }">
                                                        {{ emp.name }}
                                                        <span v-if="emp.isExempt" class="exempt-badge">EXEMPT</span>
                                                        <span v-if="emp.isStopped" class="stopped-badge">STOPPED</span>
                                                    </div>
                                                    <div class="emp-meta">{{ emp.employeeId }} • {{ emp.department }}</div>
                                                    <span class="emp-status" :class="emp.status.toLowerCase().replace(' ', '-')">{{ emp.status }}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{{ formatNumber(emp.basicSalary) }}</td>
                                        <td>{{ formatNumber(emp.accommodationAllowance) }}</td>
                                        <td>{{ formatNumber(emp.transportationAllowance) }}</td>
                                        <td>{{ formatNumber(emp.otherAllowance || 0) }}</td>
                                        <td class="addition-cell">
                                            <input type="text" v-model.number="emp.commission" class="inline-input addition-input" :disabled="emp.isStopped" @input="sanitizeNumber($event, emp, 'commission')" />
                                        </td>
                                        <td class="addition-cell">
                                            <input type="text" v-model.number="emp.overtime" class="inline-input addition-input" :disabled="emp.isStopped" @input="sanitizeNumber($event, emp, 'overtime')" />
                                        </td>
                                        <td class="addition-cell">
                                            <input type="text" v-model.number="emp.othersAddition" class="inline-input addition-input" :disabled="emp.isStopped" @input="sanitizeNumber($event, emp, 'othersAddition')" />
                                        </td>
                                        <td class="gross-cell">{{ formatNumber(calculateGross(emp)) }}</td>
                                        <td class="deduction-cell">
                                            <input type="text" v-model.number="emp.attendancePunchDed" class="inline-input deduction-input" :disabled="emp.isStopped" @input="sanitizeNumber($event, emp, 'attendancePunchDed')" />
                                        </td>
                                        <td class="deduction-cell">
                                            <input type="text" v-model.number="emp.loanRepayment" class="inline-input deduction-input" :disabled="emp.isStopped" @input="sanitizeNumber($event, emp, 'loanRepayment')" />
                                        </td>
                                        <td class="deduction-cell">
                                            <input type="text" v-model.number="emp.absentWithoutLeave" class="inline-input deduction-input" :disabled="emp.isStopped" @input="sanitizeNumber($event, emp, 'absentWithoutLeave')" />
                                        </td>
                                        <td class="deduction-cell">
                                            <input type="text" v-model.number="emp.othersDeduction" class="inline-input deduction-input" :disabled="emp.isStopped" @input="sanitizeNumber($event, emp, 'othersDeduction')" />
                                        </td>
                                        <td class="gosi-cell" :class="{ muted: emp.isExempt || emp.isStopped }">
                                            {{ emp.isExempt ? '0.00' : formatNumber(emp.gosiEmployee) }}
                                        </td>
                                        <td class="net-deductions-cell">
                                            {{ formatNumber(calculateNetDeductions(emp)) }}
                                        </td>
                                        <td class="total-net-cell" :class="{ 'zero-pay': emp.isStopped }">
                                            {{ emp.isStopped ? '0.00' : formatNumber(calculateNetPay(emp)) }}
                                        </td>
                                        <td class="company-gosi" :class="{ muted: emp.isExempt || emp.isStopped }">
                                            {{ emp.isExempt ? '0.00' : formatNumber(emp.gosiCompany) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="table-footer">
                            <span class="record-count">SHOWING {{ filteredPayrollEmployees.length }} EMPLOYEES (SAR)</span>
                        </div>

                        <!-- Fixed Dropdown Menu (rendered outside table) -->
                        <div v-if="activeEmployeeMenu !== null" 
                             class="emp-dropdown-menu-fixed" 
                             :style="dropdownMenuStyle">
                            <div class="dropdown-item" :class="getActiveEmployee?.isStopped ? 'resume' : 'stop'" @click="toggleEmployeeSalary(getActiveEmployee)">
                                <i :class="getActiveEmployee?.isStopped ? 'pi pi-play' : 'pi pi-stop-circle'"></i>
                                {{ getActiveEmployee?.isStopped ? 'Resume Salary Payment' : 'Stop Employee Salary' }}
                            </div>
                            <div class="dropdown-item" @click="viewAttendanceRecord(getActiveEmployee)">
                                <i class="pi pi-calendar"></i>
                                View Attendance Record
                            </div>
                        </div>
                    </div>

                    <div class="wizard-footer">
                        <p-button label="Back" icon="pi pi-arrow-left" text @click="prevStep"></p-button>
                        <p-button label="Calculate Draft & Review Delta" icon="pi pi-arrow-right" iconPos="right" @click="nextStep"></p-button>
                    </div>
                </div>

                <!-- Step 3: Review (Variance Analysis) -->
                <div v-if="currentWizardStep === 3" class="wizard-step-content">
                    <div class="step-card">
                        <div class="step-header">
                            <div class="step-icon review"><i class="pi pi-file"></i></div>
                            <div>
                                <h2>VARIANCE ANALYSIS</h2>
                                <p>COMPARING CURRENT CYCLE VS. PREVIOUS PERIOD</p>
                            </div>
                            <div class="step-actions">
                                <p-button label="EXPORT EXCEL (CSV)" icon="pi pi-download" outlined></p-button>
                                <span class="variance-warning"><i class="pi pi-exclamation-circle"></i> {{ majorVariances }} MAJOR VARIANCES</span>
                            </div>
                        </div>

                        <div class="variance-table-wrapper">
                            <table class="variance-table">
                                <thead>
                                    <tr>
                                        <th>EMPLOYEE IDENTIFICATION</th>
                                        <th>CURRENT NET (SAR)</th>
                                        <th>PREVIOUS MONTH</th>
                                        <th>DELTA CHANGE</th>
                                        <th>VARIANCE %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="emp in payrollEmployees" :key="emp.id">
                                        <td>
                                            <div class="emp-id-cell">
                                                <div class="emp-name">{{ emp.name }}</div>
                                                <div class="emp-meta">{{ emp.employeeId }} • {{ emp.department }}</div>
                                            </div>
                                        </td>
                                        <td class="current-net">{{ formatNumber(calculateNetPay(emp)) }}</td>
                                        <td>{{ formatNumber(emp.previousNetPay) }}</td>
                                        <td :class="getDeltaClass(emp)">
                                            {{ getDeltaValue(emp) }}
                                        </td>
                                        <td>
                                            <span class="variance-badge" :class="getVarianceClass(emp)">
                                                <i :class="calculateNetPay(emp) >= emp.previousNetPay ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                                                {{ getVariancePercent(emp) }}%
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="wizard-footer">
                        <p-button label="BACK TO VARIABLES" icon="pi pi-arrow-left" text @click="prevStep"></p-button>
                        <div class="footer-right">
                            <span class="batch-total">TOTAL BATCH VALUE: <strong>{{ formatNumber(totalBatchValue) }}</strong></span>
                            <p-button label="SUBMIT FOR APPROVAL" icon="pi pi-check" @click="nextStep"></p-button>
                        </div>
                    </div>
                </div>

                <!-- Step 4: Approve -->
                <div v-if="currentWizardStep === 4" class="wizard-step-content">
                    <div class="step-card approve-dashboard">
                        <div class="step-header">
                            <div class="step-icon approve"><i class="pi pi-check-circle"></i></div>
                            <div>
                                <h2>Financial Approval Dashboard</h2>
                                <p>REPORTING CURRENCY: <span class="currency-badge">SAUDI RIYAL (SAR)</span></p>
                            </div>
                            <div class="cycle-period">
                                <span class="period-label">CYCLE PERIOD</span>
                                <span class="period-value">{{ selectedCycle.month }} {{ selectedCycle.year }}</span>
                            </div>
                        </div>

                        <div class="approval-grid">
                            <!-- Main Financial Cards -->
                            <div class="main-cards">
                                <div class="financial-card net-pay">
                                    <div class="card-badge">SAR</div>
                                    <div class="card-label">TOTAL NET PAY</div>
                                    <div class="card-value">{{ formatCurrency(totalNetPay) }}</div>
                                    <div class="card-sublabel">FINAL DISBURSEMENT TO EMPLOYEES</div>
                                </div>
                                <div class="financial-card gross-pay">
                                    <div class="card-badge">SAR</div>
                                    <div class="card-label">TOTAL GROSS PAY</div>
                                    <div class="card-value">{{ formatCurrency(totalGrossPay) }}</div>
                                    <div class="card-sublabel">TOTAL COST BEFORE DEDUCTIONS</div>
                                </div>
                            </div>

                            <!-- Addition Cards -->
                            <div class="addition-breakdown-cards">
                                <div class="section-title additions">
                                    <i class="pi pi-plus-circle"></i> ADDITIONS
                                </div>
                                <div class="breakdown-cards">
                                    <div class="breakdown-card addition">
                                        <div class="breakdown-value">{{ formatCurrency(totalBasicPay) }}</div>
                                        <div class="breakdown-label">TOTAL BASIC PAY</div>
                                    </div>
                                    <div class="breakdown-card addition">
                                        <div class="breakdown-value">{{ formatCurrency(totalAllowances) }}</div>
                                        <div class="breakdown-label">FIXED ALLOWANCES</div>
                                    </div>
                                    <div class="breakdown-card addition">
                                        <div class="breakdown-value">{{ formatCurrency(totalOtherAllowance) }}</div>
                                        <div class="breakdown-label">OTHER ALLOWANCE</div>
                                    </div>
                                    <div class="breakdown-card addition">
                                        <div class="breakdown-value">{{ formatCurrency(totalCommissions) }}</div>
                                        <div class="breakdown-label">COMMISSIONS</div>
                                    </div>
                                    <div class="breakdown-card addition">
                                        <div class="breakdown-value">{{ formatCurrency(totalOvertime) }}</div>
                                        <div class="breakdown-label">OVERTIME</div>
                                    </div>
                                    <div class="breakdown-card addition">
                                        <div class="breakdown-value">{{ formatCurrency(totalOthersAddition) }}</div>
                                        <div class="breakdown-label">OTHERS ADDITION</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Deduction Cards -->
                            <div class="deduction-breakdown-cards">
                                <div class="section-title deductions">
                                    <i class="pi pi-minus-circle"></i> DEDUCTIONS
                                </div>
                                <div class="deduction-cards">
                                    <div class="deduction-card">
                                        <div class="deduction-value negative">{{ formatCurrency(totalAttendancePunchDed) }}</div>
                                        <div class="deduction-label">ATTENDANCE & PUNCH</div>
                                    </div>
                                    <div class="deduction-card">
                                        <div class="deduction-value negative">{{ formatCurrency(totalLoanRepayment) }}</div>
                                        <div class="deduction-label">LOAN REPAYMENT</div>
                                    </div>
                                    <div class="deduction-card">
                                        <div class="deduction-value negative">{{ formatCurrency(totalAbsentWithoutLeave) }}</div>
                                        <div class="deduction-label">ABSENT W/O LEAVE</div>
                                    </div>
                                    <div class="deduction-card">
                                        <div class="deduction-value negative">{{ formatCurrency(totalOthersDeduction) }}</div>
                                        <div class="deduction-label">OTHERS DEDUCTION</div>
                                    </div>
                                    <div class="deduction-card">
                                        <div class="deduction-value negative">{{ formatCurrency(totalGosiEmployee) }}</div>
                                        <div class="deduction-label">GOSI (EMPLOYEE)</div>
                                    </div>
                                    <div class="deduction-card muted">
                                        <div class="deduction-value">{{ formatCurrency(totalGosiCompany) }}</div>
                                        <div class="deduction-label">COMPANY GOSI</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Batch Review Panel -->
                            <div class="batch-review-panel">
                                <div class="panel-header">
                                    <h4>BATCH REVIEW & HOLD</h4>
                                    <p>Exclude specific employees from this pay run</p>
                                </div>
                                <div class="employee-hold-list">
                                    <div v-for="emp in payrollEmployees" :key="emp.id" class="hold-item">
                                        <div class="hold-info">
                                            <div class="hold-name">{{ emp.name }}</div>
                                            <div class="hold-meta">{{ emp.employeeId }} <span class="hold-amount">{{ formatNumber(emp.netPay) }}</span></div>
                                        </div>
                                        <p-button :label="emp.isHeld ? 'RELEASE' : 'HOLD'" :outlined="!emp.isHeld" size="small" @click="emp.isHeld = !emp.isHeld"></p-button>
                                    </div>
                                </div>
                                <div class="panel-footer">
                                    REVIEWING {{ payrollEmployees.length }} RECORDS
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="wizard-footer">
                        <p-button label="BACK TO ADJUSTMENTS" icon="pi pi-arrow-left" text @click="prevStep"></p-button>
                        <div class="footer-right">
                            <p-button label="REJECT BATCH" severity="danger" outlined></p-button>
                            <p-button label="FINAL APPROVE & EXECUTE" icon="pi pi-check" @click="nextStep"></p-button>
                        </div>
                    </div>
                </div>

                <!-- Step 5: Pay -->
                <div v-if="currentWizardStep === 5" class="wizard-step-content">
                    <div class="step-card pay-dashboard">
                        <!-- Top Summary Cards -->
                        <div class="pay-summary-cards">
                            <div class="pay-card primary">
                                <div class="pay-badge">SAR</div>
                                <div class="pay-label">DISBURSEMENT TOTAL</div>
                                <div class="pay-value">{{ formatCurrency(totalNetPay) }}</div>
                                <div class="pay-sublabel">TOTAL FOR {{ activeEmployeeCount }} ACTIVE EMPLOYEES</div>
                            </div>
                            <div class="pay-card dark">
                                <div class="pay-badge">SAR</div>
                                <div class="pay-label">TOTAL GROSS</div>
                                <div class="pay-value">{{ formatCurrency(totalGrossPay) }}</div>
                                <div class="pay-sublabel">GROSS LIABILITY BEFORE DEDUCTIONS</div>
                            </div>
                            <div class="pay-card-group">
                                <div class="mini-pay-card">
                                    <div class="mini-label">TOTAL GOSI EMP.</div>
                                    <div class="mini-value negative">{{ formatCurrency(totalGosiEmployee) }}</div>
                                </div>
                                <div class="mini-pay-card">
                                    <div class="mini-label">TOTAL ARREARS DED.</div>
                                    <div class="mini-value negative">{{ formatCurrency(totalArrearsDed) }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Execution Files Section -->
                        <div class="pay-section">
                            <h4>EXECUTION & COMPLIANCE FILES</h4>
                            <div class="file-cards">
                                <div class="file-card">
                                    <i class="pi pi-file"></i>
                                    <div class="file-name">Download Bank File</div>
                                    <div class="file-desc">SIF-WPS</div>
                                </div>
                                <div class="file-card active">
                                    <i class="pi pi-table"></i>
                                    <div class="file-name">Variable Table</div>
                                    <div class="file-desc">FINAL CSV EXPORT</div>
                                </div>
                            </div>
                        </div>

                        <!-- Historical Context -->
                        <div class="pay-section">
                            <h4>HISTORICAL CONTEXT & AUDIT</h4>
                            <div class="audit-cards">
                                <div class="audit-card clickable" @click="showVariableAuditDialog = true">
                                    <i class="pi pi-clock"></i>
                                    <div class="audit-name">Variable Page</div>
                                    <div class="audit-desc">MANUAL OVERRIDES AUDIT</div>
                                </div>
                                <div class="audit-card clickable" @click="showReviewAuditDialog = true">
                                    <i class="pi pi-chart-line"></i>
                                    <div class="audit-name">Review Page</div>
                                    <div class="audit-desc">VARIANCE & DELTA REPORT</div>
                                </div>
                            </div>
                        </div>

                        <!-- Payment Authorization -->
                        <div class="pay-grid">
                            <div class="pay-section">
                                <h4>PAYMENT PROOFS & RECEIPTS</h4>
                                <div class="upload-area">
                                    <p-button label="+ UPLOAD NEW" text @click="triggerProofUpload"></p-button>
                                    <input type="file" ref="proofFileInput" style="display: none" @change="handleProofUpload" accept=".pdf,.jpg,.jpeg,.png" multiple>
                                    <div v-if="verificationProofsUploaded.length === 0" class="upload-placeholder">
                                        <i class="pi pi-cloud-upload"></i>
                                        <p>NO RECEIPTS UPLOADED YET</p>
                                        <span>Please attach bank confirmation slips</span>
                                    </div>
                                    <div v-else class="uploaded-proofs-list">
                                        <div v-for="proof in verificationProofsUploaded" :key="proof.id" class="uploaded-proof-item">
                                            <i class="pi pi-file-pdf"></i>
                                            <span class="proof-name">{{ proof.name }}</span>
                                            <span class="proof-size">{{ proof.size }}</span>
                                            <i class="pi pi-times remove-proof" @click="removeProof(proof.id)"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="pay-section authorization">
                                <h4>PAYMENT AUTHORIZATION</h4>
                                <div class="auth-steps">
                                    <div class="auth-step" :class="{ completed: paymentAuthorized }">
                                        <div class="auth-number">1</div>
                                        <div class="auth-info">
                                            <div class="auth-title">CONFIRM DISBURSEMENT</div>
                                            <div class="auth-desc">Funds marked for processing</div>
                                        </div>
                                        <p-button v-if="!paymentAuthorized" label="AUTHORIZE PAYMENT" size="small" @click="paymentAuthorized = true"></p-button>
                                        <i v-else class="pi pi-check-circle auth-done"></i>
                                    </div>
                                    <div class="auth-step" :class="{ completed: verificationProofsUploaded.length > 0 }">
                                        <div class="auth-number">2</div>
                                        <div class="auth-info">
                                            <div class="auth-title">VERIFICATION PROOFS</div>
                                            <div class="auth-desc">Attach bank confirmation slips</div>
                                        </div>
                                        <i v-if="verificationProofsUploaded.length > 0" class="pi pi-check-circle auth-done"></i>
                                        <span v-else class="auth-required">(Required)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="wizard-footer">
                        <p-button label="RETURN TO PREVIOUS STAGE" icon="pi pi-arrow-left" severity="danger" text @click="prevStep"></p-button>
                        <p-button label="PROCEED TO CLOSING" icon="pi pi-arrow-right" iconPos="right" @click="nextStep" :disabled="!paymentAuthorized || verificationProofsUploaded.length === 0"></p-button>
                    </div>
                </div>

                <!-- Variable Pay Audit Dialog -->
                <p-dialog v-model:visible="showVariableAuditDialog" header="" modal :style="{ width: '900px', maxWidth: '95vw' }">
                    <template #header>
                        <div class="audit-dialog-header">
                            <h2>VARIABLE PAY AUDIT</h2>
                            <p>READ-ONLY VIEW • CURRENT CYCLE</p>
                        </div>
                    </template>
                    <div class="audit-table-wrapper">
                        <table class="audit-table">
                            <thead>
                                <tr>
                                    <th>EMPLOYEE</th>
                                    <th>COST CENTER</th>
                                    <th class="text-primary">COMMISSION</th>
                                    <th class="text-primary">ARR. ADD</th>
                                    <th class="text-danger">ARR. DED</th>
                                    <th class="text-danger">GOSI</th>
                                    <th>NET PAYABLE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="emp in payrollEmployees" :key="emp.id">
                                    <td>
                                        <div class="emp-name">{{ emp.name }}<span v-if="emp.isExempt"> (Exempt)</span></div>
                                        <div class="emp-id">{{ emp.empId }}</div>
                                    </td>
                                    <td>{{ emp.costCenter }}</td>
                                    <td class="text-primary">{{ formatNumber(emp.commission || 0) }}</td>
                                    <td class="text-primary">{{ formatNumber(emp.arrearsAddition || 0) }}</td>
                                    <td class="text-danger">{{ formatNumber(emp.arrearsDeduction || 0) }}</td>
                                    <td class="text-danger">{{ formatNumber(emp.isExempt ? 0 : emp.gosiEmployee || 0) }}</td>
                                    <td class="text-bold">{{ formatNumber(emp.isStopped ? 0 : emp.netPay) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </p-dialog>

                <!-- Review/Variance Audit Dialog -->
                <p-dialog v-model:visible="showReviewAuditDialog" header="" modal :style="{ width: '800px', maxWidth: '95vw' }">
                    <template #header>
                        <div class="audit-dialog-header">
                            <h2>VARIANCE AUDIT</h2>
                            <p>READ-ONLY VIEW • DELTA COMPARISON</p>
                        </div>
                    </template>
                    <div class="audit-table-wrapper">
                        <table class="audit-table variance-table">
                            <thead>
                                <tr>
                                    <th>EMPLOYEE</th>
                                    <th>CURRENT NET</th>
                                    <th>PREVIOUS MONTH</th>
                                    <th>VARIANCE (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="emp in payrollEmployees" :key="emp.id">
                                    <td>
                                        <div class="emp-name">{{ emp.name }}<span v-if="emp.isExempt"> (Exempt)</span></div>
                                    </td>
                                    <td>{{ formatNumber(emp.isStopped ? 0 : emp.netPay) }}</td>
                                    <td>{{ formatNumber(emp.previousNetPay || 0) }}</td>
                                    <td>
                                        <span class="variance-badge" :class="getVarianceClass(emp)">
                                            {{ getVariancePercent(emp) >= 0 ? '↑' : '↓' }} {{ Math.abs(getVariancePercent(emp)).toFixed(1) }}%
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </p-dialog>

                <!-- Step 6: Closing -->
                <div v-if="currentWizardStep === 6" class="wizard-step-content">
                    <div class="closing-grid">
                        <div class="step-card closing-audit">
                            <div class="closing-header">
                                <div>
                                    <h2>Cycle History Audit</h2>
                                    <p>REVIEW ALL WIZARD STAGES BEFORE LOCKING</p>
                                </div>
                                <div class="total-liability">
                                    <span class="liability-label">TOTAL NET PAY</span>
                                    <span class="liability-value">{{ formatCurrency(totalNetPay) }}</span>
                                </div>
                            </div>

                            <div class="history-cards">
                                <div class="history-card" @click="showInitializationAudit = true">
                                    <i class="pi pi-bolt"></i>
                                    <span>INITIALIZATION</span>
                                </div>
                                <div class="history-card" @click="showVariablesAudit = true">
                                    <i class="pi pi-clock"></i>
                                    <span>VARIABLES</span>
                                </div>
                                <div class="history-card" @click="showVarianceReportAudit = true">
                                    <i class="pi pi-file"></i>
                                    <span>VARIANCE REPORT</span>
                                </div>
                                <div class="history-card" @click="showApprovalLogAudit = true">
                                    <i class="pi pi-check-circle"></i>
                                    <span>APPROVAL LOG</span>
                                </div>
                                <div class="history-card" @click="showPaymentSummaryAudit = true">
                                    <i class="pi pi-dollar"></i>
                                    <span>PAYMENT SUMMARY</span>
                                </div>
                            </div>

                            <div class="execution-proofs">
                                <h4>EXECUTION PROOFS (STAGE 5)</h4>
                                <div class="proof-item" v-if="uploadedProofs.length > 0" v-for="proof in uploadedProofs" :key="proof.id">
                                    <i class="pi pi-file"></i>
                                    <div class="proof-info">
                                        <div class="proof-name">{{ proof.name }}</div>
                                        <div class="proof-size">{{ proof.size }}</div>
                                    </div>
                                </div>
                                <div v-else class="no-proofs">
                                    <i class="pi pi-info-circle"></i>
                                    <span>No proofs uploaded yet</span>
                                </div>
                            </div>
                        </div>

                        <div class="step-card closing-checks">
                            <h3>Final Closing Checks</h3>
                            <div class="checks-list">
                                <div class="check-item" v-for="check in closingChecks" :key="check.id">
                                    <div class="check-info">
                                        <div class="check-label">{{ check.label }}</div>
                                    </div>
                                    <p-toggleswitch v-model="check.checked"></p-toggleswitch>
                                </div>
                            </div>
                            <div class="close-action">
                                <p-button label="CLOSE PAYROLL CYCLE" icon="pi pi-send" iconPos="right" 
                                          :disabled="!allClosingChecked" @click="nextStep"></p-button>
                                <span class="close-hint" v-if="!allClosingChecked">COMPLETE CHECKLIST TO LOCK</span>
                            </div>
                        </div>
                    </div>

                    <div class="wizard-footer">
                        <p-button label="BACK" icon="pi pi-arrow-left" text @click="prevStep"></p-button>
                    </div>
                </div>

                <!-- Step 6 Audit Modals -->
                <!-- Initialization Audit Modal -->
                <p-dialog v-model:visible="showInitializationAudit" header="" modal :style="{ width: '700px', maxWidth: '95vw' }">
                    <template #header>
                        <div class="audit-dialog-header">
                            <h2>AUDIT: INITIALIZATION</h2>
                            <p>SNAPSHOT OF COMPLETED CYCLE STAGE</p>
                        </div>
                    </template>
                    <div class="initialization-audit-content">
                        <div class="init-info-cards">
                            <div class="init-info-card">
                                <div class="init-label">REGION</div>
                                <div class="init-value">Saudi Arabia</div>
                            </div>
                            <div class="init-info-card">
                                <div class="init-label">PERIOD</div>
                                <div class="init-value">{{ selectedCycle?.month }} {{ selectedCycle?.year }}</div>
                            </div>
                        </div>
                        <div class="init-status-card">
                            <div class="init-label">SYNC STATUS</div>
                            <div class="init-status-value">VERIFIED & COMPLETE</div>
                        </div>
                    </div>
                </p-dialog>

                <!-- Variables Audit Modal -->
                <p-dialog v-model:visible="showVariablesAudit" header="" modal :style="{ width: '900px', maxWidth: '95vw' }">
                    <template #header>
                        <div class="audit-dialog-header">
                            <h2>AUDIT: VARIABLE_PAY</h2>
                            <p>SNAPSHOT OF COMPLETED CYCLE STAGE</p>
                        </div>
                    </template>
                    <div class="audit-table-wrapper">
                        <table class="audit-table">
                            <thead>
                                <tr>
                                    <th>EMPLOYEE</th>
                                    <th class="text-primary">COMMISSION</th>
                                    <th class="text-primary">ARR. ADD</th>
                                    <th class="text-danger">ARR. DED</th>
                                    <th>NET PAYABLE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="emp in payrollEmployees" :key="emp.id">
                                    <td>
                                        <div class="emp-name">{{ emp.name }}<span v-if="emp.isExempt"> (Exempt)</span></div>
                                    </td>
                                    <td class="text-primary">{{ formatNumber(emp.commission || 0) }}</td>
                                    <td class="text-primary">{{ formatNumber(emp.arrearsAddition || 0) }}</td>
                                    <td class="text-danger">{{ formatNumber(emp.arrearsDeduction || 0) }}</td>
                                    <td class="text-bold">{{ formatNumber(emp.isStopped ? 0 : emp.netPay) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </p-dialog>

                <!-- Variance Report Audit Modal -->
                <p-dialog v-model:visible="showVarianceReportAudit" header="" modal :style="{ width: '800px', maxWidth: '95vw' }">
                    <template #header>
                        <div class="audit-dialog-header">
                            <h2>AUDIT: REVIEW_VARIANCE</h2>
                            <p>SNAPSHOT OF COMPLETED CYCLE STAGE</p>
                        </div>
                    </template>
                    <div class="audit-table-wrapper">
                        <table class="audit-table variance-table">
                            <thead>
                                <tr>
                                    <th>EMPLOYEE</th>
                                    <th>CURRENT NET</th>
                                    <th>PREVIOUS MONTH</th>
                                    <th>VARIANCE (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="emp in payrollEmployees" :key="emp.id">
                                    <td>
                                        <div class="emp-name">{{ emp.name }}<span v-if="emp.isExempt"> (Exempt)</span></div>
                                    </td>
                                    <td>{{ formatNumber(emp.isStopped ? 0 : emp.netPay) }}</td>
                                    <td>{{ formatNumber(emp.previousNetPay || 0) }}</td>
                                    <td>
                                        <span class="variance-badge" :class="getVarianceClass(emp)">
                                            {{ getVariancePercent(emp) >= 0 ? '↑' : '↓' }} {{ Math.abs(getVariancePercent(emp)).toFixed(1) }}%
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </p-dialog>

                <!-- Approval Log Audit Modal -->
                <p-dialog v-model:visible="showApprovalLogAudit" header="" modal :style="{ width: '600px', maxWidth: '95vw' }">
                    <template #header>
                        <div class="audit-dialog-header">
                            <h2>AUDIT: APPROVAL</h2>
                            <p>SNAPSHOT OF COMPLETED CYCLE STAGE</p>
                        </div>
                    </template>
                    <div class="approval-audit-content">
                        <div class="approval-success-icon">
                            <i class="pi pi-check"></i>
                        </div>
                        <h3 class="approval-title">Batch Fully Authorized</h3>
                        <p class="approval-subtitle">AUTHORIZED BY: FINANCE DIRECTOR (JOHN DOE)</p>
                        <p class="approval-hash">AUTH HASH: Q1LDLTE3NJG4MJE4MDIZMTG=</p>
                    </div>
                </p-dialog>

                <!-- Payment Summary Audit Modal -->
                <p-dialog v-model:visible="showPaymentSummaryAudit" header="" modal :style="{ width: '900px', maxWidth: '95vw' }">
                    <template #header>
                        <div class="audit-dialog-header">
                            <h2>AUDIT: FINALIZATION</h2>
                            <p>SNAPSHOT OF COMPLETED CYCLE STAGE</p>
                        </div>
                    </template>
                    <div class="audit-table-wrapper">
                        <table class="audit-table">
                            <thead>
                                <tr>
                                    <th>EMPLOYEE</th>
                                    <th class="text-primary">COMMISSION</th>
                                    <th class="text-primary">ARR. ADD</th>
                                    <th class="text-danger">ARR. DED</th>
                                    <th>NET PAYABLE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="emp in payrollEmployees" :key="emp.id">
                                    <td>
                                        <div class="emp-name">{{ emp.name }}<span v-if="emp.isExempt"> (Exempt)</span></div>
                                    </td>
                                    <td class="text-primary">{{ formatNumber(emp.commission || 0) }}</td>
                                    <td class="text-primary">{{ formatNumber(emp.arrearsAddition || 0) }}</td>
                                    <td class="text-danger">{{ formatNumber(emp.arrearsDeduction || 0) }}</td>
                                    <td class="text-bold">{{ formatNumber(emp.isStopped ? 0 : emp.netPay) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </p-dialog>

                <!-- Step 7: Archived -->
                <div v-if="currentWizardStep === 7" class="wizard-step-content">
                    <div class="step-card archived-view">
                        <div class="archived-header">
                            <div class="archived-icon"><i class="pi pi-shield"></i></div>
                            <div class="archived-info">
                                <h2>Cycle Closed & Archived</h2>
                                <div class="archived-meta">
                                    <span class="locked-badge"><i class="pi pi-lock"></i> LOCKED BY EVP</span>
                                    <span class="location">{{ getRegion(1)?.name }} • {{ selectedCycle.month }} {{ selectedCycle.year }}</span>
                                </div>
                            </div>
                            <p-button label="EXPORT FULL AUDIT PDF" icon="pi pi-download" outlined></p-button>
                        </div>

                        <div class="archived-grid">
                            <div class="archived-stats">
                                <h4>RUN STATS SUMMARY</h4>
                                <div class="stat-row">
                                    <div class="stat-value">{{ formatCurrency(totalNetPay) }}</div>
                                    <div class="stat-label">TOTAL NET DISBURSED</div>
                                </div>
                                <div class="stat-mini-row">
                                    <div class="mini-stat">
                                        <span class="mini-value">{{ activeEmployeeCount }}</span>
                                        <span class="mini-label">HEADCOUNT</span>
                                    </div>
                                    <div class="mini-stat">
                                        <span class="mini-value held">{{ heldEmployeeCount }}</span>
                                        <span class="mini-label">HELD</span>
                                    </div>
                                </div>
                            </div>

                            <div class="archived-content">
                                <div class="view-tabs">
                                    <button class="view-tab" :class="{ active: archivedView === 'summary' }" @click="archivedView = 'summary'">SUMMARY VIEW</button>
                                    <button class="view-tab" :class="{ active: archivedView === 'variable' }" @click="archivedView = 'variable'">VARIABLE VIEW</button>
                                    <button class="view-tab" :class="{ active: archivedView === 'dashboard' }" @click="archivedView = 'dashboard'">DASHBOARD VIEW</button>
                                </div>

                                <div class="proofs-section">
                                    <h4>ENTITY PAYMENT PROOFS</h4>
                                    <div class="proof-item verified" v-for="proof in uploadedProofs" :key="proof.id">
                                        <i class="pi pi-check-circle"></i>
                                        <div class="proof-info">
                                            <div class="proof-name">{{ proof.name }}</div>
                                            <div class="proof-size">{{ proof.size }} • VERIFIED</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="frozen-notice">
                                    <i class="pi pi-lock"></i>
                                    <div>
                                        <strong>CYCLE STATE: FINALIZED & FROZEN</strong>
                                        <p>Any future modifications to these records must be authorized through a formal supplemental run.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="action-log">
                                <h4>CYCLE ACTION LOG</h4>
                                <div class="log-timeline">
                                    <div class="log-item" v-for="log in actionLog" :key="log.id">
                                        <div class="log-dot"></div>
                                        <div class="log-content">
                                            <div class="log-time">{{ log.timestamp }}</div>
                                            <div class="log-action">{{ log.action }}</div>
                                            <div class="log-user">User: {{ log.user }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="wizard-footer">
                        <p-button label="Back to Cycles" icon="pi pi-arrow-left" text @click="closeCycle"></p-button>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed, reactive } = Vue;

        // View state
        const activeView = ref('tracking');
        const selectedCycle = ref(null);
        const currentWizardStep = ref(1);
        const expandedCycles = ref([]);
        const searchQuery = ref('');
        const employeeSearch = ref('');
        const selectedCostCenter = ref(null);
        const archivedView = ref('summary');
        const paymentAuthorized = ref(false);
        const activeEmployeeMenu = ref(null);
        const dropdownMenuPosition = ref({ top: 0, left: 0 });
        const showVariableAuditDialog = ref(false);
        const showReviewAuditDialog = ref(false);
        const verificationProofsUploaded = ref([]);

        // Step 6 Closing - Audit Modals
        const showInitializationAudit = ref(false);
        const showVariablesAudit = ref(false);
        const showVarianceReportAudit = ref(false);
        const showApprovalLogAudit = ref(false);
        const showPaymentSummaryAudit = ref(false);
        const showActivityLogDialog = ref(false);

        // Data
        const cycles = ref(StaticData.payrollCycles);
        const subCycles = ref(StaticData.payrollSubCycles);
        const regions = ref(StaticData.payrollRegions);
        const costCenters = ref(StaticData.payrollCostCenters);
        const payrollEmployees = ref(JSON.parse(JSON.stringify(StaticData.payrollEmployees)));
        const wizardSteps = ref(StaticData.payrollWizardSteps);
        const stats = ref(StaticData.payrollStats);
        const departmentAllocation = ref(StaticData.departmentAllocation);
        const regionalSplit = ref(StaticData.regionalSplit);
        const actionLog = ref(StaticData.payrollActionLog);

        // Initialization checklist
        const initChecklist = ref([
            { label: 'Attendance data imported', checked: false },
            { label: 'Previous cycle closed and archived', checked: false }
        ]);

        // Closing checks
        const closingChecks = ref([
            { id: 1, label: 'SALARIES TRANSFERRED', checked: false },
            { id: 2, label: 'SALARIES REVIEWED', checked: false },
            { id: 3, label: 'BANK CONFIRMATION RECEIVED', checked: false },
            { id: 4, label: 'APPROVED FOR CYCLE CLOSURE', checked: false }
        ]);

        // Uploaded proofs
        const uploadedProofs = ref([
            { id: 1, name: 'Bank_Transfer_Confirmation.pdf', size: '245 KB' }
        ]);

        // Computed
        const filteredCycles = computed(() => {
            if (!searchQuery.value) return cycles.value;
            const query = searchQuery.value.toLowerCase();
            return cycles.value.filter(c =>
                c.month.toLowerCase().includes(query) ||
                c.year.toString().includes(query)
            );
        });

        const filteredPayrollEmployees = computed(() => {
            let result = payrollEmployees.value;
            if (employeeSearch.value) {
                const query = employeeSearch.value.toLowerCase();
                result = result.filter(e => e.name.toLowerCase().includes(query) || e.employeeId.toLowerCase().includes(query));
            }
            return result;
        });

        const allInitChecked = computed(() => initChecklist.value.every(i => i.checked));
        const allClosingChecked = computed(() => closingChecks.value.every(c => c.checked));

        const totalBatchValue = computed(() => payrollEmployees.value.reduce((sum, e) => sum + calculateNetPay(e), 0));
        const totalNetPay = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + calculateNetPay(e), 0));
        const totalGrossPay = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + calculateGross(e), 0));
        const totalBasicPay = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + e.basicSalary, 0));
        const totalCommissions = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + (e.commission || 0), 0));
        const totalOvertime = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + (e.overtime || 0), 0));
        const totalOthersAddition = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + (e.othersAddition || 0), 0));
        const totalOtherAllowance = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + (e.otherAllowance || 0), 0));
        const totalAllowances = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + e.accommodationAllowance + e.transportationAllowance, 0));
        const totalAttendancePunchDed = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + (e.attendancePunchDed || 0), 0));
        const totalLoanRepayment = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + (e.loanRepayment || 0), 0));
        const totalAbsentWithoutLeave = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + (e.absentWithoutLeave || 0), 0));
        const totalOthersDeduction = computed(() => payrollEmployees.value.filter(e => !e.isHeld).reduce((sum, e) => sum + (e.othersDeduction || 0), 0));
        const totalGosiEmployee = computed(() => payrollEmployees.value.filter(e => !e.isHeld && !e.isExempt).reduce((sum, e) => sum + e.gosiEmployee, 0));
        const totalGosiCompany = computed(() => payrollEmployees.value.filter(e => !e.isHeld && !e.isExempt).reduce((sum, e) => sum + e.gosiCompany, 0));
        const activeEmployeeCount = computed(() => payrollEmployees.value.filter(e => !e.isHeld).length);
        const heldEmployeeCount = computed(() => payrollEmployees.value.filter(e => e.isHeld).length);
        const majorVariances = computed(() => payrollEmployees.value.filter(e => Math.abs(getVariancePercent(e)) > 10).length);

        const getActiveEmployee = computed(() => {
            if (activeEmployeeMenu.value === null) return null;
            return payrollEmployees.value.find(e => e.id === activeEmployeeMenu.value);
        });

        const dropdownMenuStyle = computed(() => {
            return {
                position: 'fixed',
                top: dropdownMenuPosition.value.top + 'px',
                left: dropdownMenuPosition.value.left + 'px'
            };
        });

        // Methods
        const formatCurrency = (value) => {
            if (value === undefined || value === null) return '0.00';
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        };

        const formatNumber = (value) => {
            if (value === undefined || value === null) return '0.00';
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        };

        const calculateGross = (emp) => {
            return emp.basicSalary + emp.accommodationAllowance + emp.transportationAllowance + 
                   (emp.otherAllowance || 0) + (emp.commission || 0) + (emp.overtime || 0) + (emp.othersAddition || 0);
        };

        const calculateNetAdditions = (emp) => {
            // Net additions = Commission + Overtime + Others Addition
            return (emp.commission || 0) + (emp.overtime || 0) + (emp.othersAddition || 0);
        };

        const calculateNetDeductions = (emp) => {
            // Net deductions = All deductions + GOSI
            const gosiAmount = emp.isExempt ? 0 : (emp.gosiEmployee || 0);
            return (emp.attendancePunchDed || 0) + (emp.loanRepayment || 0) + 
                   (emp.absentWithoutLeave || 0) + (emp.othersDeduction || 0) + gosiAmount;
        };

        const calculateNetPay = (emp) => {
            return calculateGross(emp) - calculateNetDeductions(emp);
        };

        const sanitizeNumber = (event, emp, field) => {
            // Only allow positive numbers
            let value = event.target.value.replace(/[^0-9.]/g, '');
            emp[field] = parseFloat(value) || 0;
        };

        const getCycleIcon = (status) => {
            switch (status) {
                case 'in_progress': return 'pi pi-spin pi-spinner';
                case 'new': return 'pi pi-plus';
                case 'closed': return 'pi pi-check';
                default: return 'pi pi-circle';
            }
        };

        const getStatusLabel = (status) => {
            switch (status) {
                case 'in_progress': return 'IN PROGRESS';
                case 'new': return 'NEW';
                case 'closed': return 'CLOSED';
                default: return status.toUpperCase();
            }
        };

        const getSubCycles = (cycleId) => subCycles.value.filter(s => s.cycleId === cycleId);
        const getRegion = (regionId) => regions.value.find(r => r.id === regionId);
        const getCostCenter = (costCenterId) => costCenters.value.find(c => c.id === costCenterId);

        const toggleCycleExpand = (cycleId) => {
            const idx = expandedCycles.value.indexOf(cycleId);
            if (idx > -1) {
                expandedCycles.value.splice(idx, 1);
            } else {
                expandedCycles.value.push(cycleId);
            }
        };

        const openCycle = (cycle) => {
            selectedCycle.value = cycle;
            currentWizardStep.value = cycle.currentStep || 1;
            if (cycle.status === 'closed') {
                currentWizardStep.value = 7;
            }
        };

        const closeCycle = () => {
            selectedCycle.value = null;
            currentWizardStep.value = 1;
        };

        const nextStep = () => {
            if (currentWizardStep.value < 7) {
                currentWizardStep.value++;
            }
        };

        const prevStep = () => {
            if (currentWizardStep.value > 1) {
                currentWizardStep.value--;
            }
        };

        const getDeltaValue = (emp) => {
            const delta = emp.netPay - emp.previousNetPay;
            const sign = delta >= 0 ? '+' : '';
            return sign + formatNumber(delta);
        };

        const getDeltaClass = (emp) => {
            const delta = emp.netPay - emp.previousNetPay;
            return delta >= 0 ? 'delta-positive' : 'delta-negative';
        };

        const getVariancePercent = (emp) => {
            if (emp.previousNetPay === 0) return 0;
            return Math.abs(((emp.netPay - emp.previousNetPay) / emp.previousNetPay) * 100).toFixed(1);
        };

        const getVarianceClass = (emp) => {
            const percent = parseFloat(getVariancePercent(emp));
            if (percent > 10) return 'major';
            if (emp.netPay >= emp.previousNetPay) return 'positive';
            return 'negative';
        };

        const toggleEmployeeMenu = (empId, event) => {
            if (activeEmployeeMenu.value === empId) {
                activeEmployeeMenu.value = null;
            } else {
                // Get the button position
                const btn = event.currentTarget;
                const rect = btn.getBoundingClientRect();
                dropdownMenuPosition.value = {
                    top: rect.bottom + 5,
                    left: rect.left
                };
                activeEmployeeMenu.value = empId;
            }
        };

        const toggleEmployeeSalary = (emp) => {
            emp.isStopped = !emp.isStopped;
            activeEmployeeMenu.value = null;
        };

        const viewAttendanceRecord = (emp) => {
            activeEmployeeMenu.value = null;
            // Navigate to attendance or show modal
            alert('Viewing attendance record for ' + emp.name);
        };

        const viewSubCycleActivityLog = (subCycle) => {
            showActivityLogDialog.value = true;
        };

        // Proof file input reference
        const proofFileInput = ref(null);

        const triggerProofUpload = () => {
            if (proofFileInput.value) {
                proofFileInput.value.click();
            }
        };

        const handleProofUpload = (event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const sizeKB = Math.round(file.size / 1024);
                    verificationProofsUploaded.value.push({
                        id: Date.now() + i,
                        name: file.name,
                        size: sizeKB + ' KB'
                    });
                }
                // Reset file input
                event.target.value = '';
            }
        };

        const removeProof = (proofId) => {
            verificationProofsUploaded.value = verificationProofsUploaded.value.filter(p => p.id !== proofId);
        };

        // Close dropdown when clicking outside
        const closeMenuOnClickOutside = (event) => {
            if (!event.target.closest('.emp-dropdown-wrapper')) {
                activeEmployeeMenu.value = null;
            }
        };

        // Add click listener
        if (typeof document !== 'undefined') {
            document.addEventListener('click', closeMenuOnClickOutside);
        }

        return {
            activeView,
            selectedCycle,
            currentWizardStep,
            expandedCycles,
            searchQuery,
            employeeSearch,
            archivedView,
            paymentAuthorized,
            showVariableAuditDialog,
            showReviewAuditDialog,
            verificationProofsUploaded,
            proofFileInput,
            showInitializationAudit,
            showVariablesAudit,
            showVarianceReportAudit,
            showApprovalLogAudit,
            showPaymentSummaryAudit,
            showActivityLogDialog,
            cycles,
            subCycles,
            regions,
            costCenters,
            payrollEmployees,
            wizardSteps,
            stats,
            departmentAllocation,
            regionalSplit,
            actionLog,
            initChecklist,
            closingChecks,
            uploadedProofs,
            filteredCycles,
            filteredPayrollEmployees,
            allInitChecked,
            allClosingChecked,
            totalBatchValue,
            totalNetPay,
            totalGrossPay,
            totalBasicPay,
            totalCommissions,
            totalOvertime,
            totalOthersAddition,
            totalOtherAllowance,
            totalAllowances,
            totalAttendancePunchDed,
            totalLoanRepayment,
            totalAbsentWithoutLeave,
            totalOthersDeduction,
            totalGosiEmployee,
            totalGosiCompany,
            activeEmployeeCount,
            heldEmployeeCount,
            majorVariances,
            formatCurrency,
            formatNumber,
            calculateGross,
            calculateNetAdditions,
            calculateNetDeductions,
            calculateNetPay,
            sanitizeNumber,
            getCycleIcon,
            getStatusLabel,
            getSubCycles,
            getRegion,
            getCostCenter,
            toggleCycleExpand,
            openCycle,
            closeCycle,
            nextStep,
            prevStep,
            getDeltaValue,
            getDeltaClass,
            getVariancePercent,
            getVarianceClass,
            activeEmployeeMenu,
            toggleEmployeeMenu,
            toggleEmployeeSalary,
            viewAttendanceRecord,
            viewSubCycleActivityLog,
            getActiveEmployee,
            dropdownMenuStyle,
            triggerProofUpload,
            handleProofUpload,
            removeProof
        };
    }
};

// Make component available globally
window.PayrollComponent = PayrollComponent;
