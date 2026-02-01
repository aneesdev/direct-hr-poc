/**
 * Shift & Attendance Component
 * Revamped shift library with Normal, Template Day, and Flexible shifts
 */

const ShiftAttendanceComponent = {
    template: `
        <div class="shift-attendance-page">
            <!-- Main Tabs -->
            <div class="settings-tabs">
                <p-tabs :value="activeTab">
                    <p-tablist>
                        <p-tab value="shifts" @click="activeTab = 'shifts'">
                            <i class="pi pi-list" style="margin-right: 0.5rem;"></i>
                            Shift Library
                        </p-tab>
                        <p-tab value="schedule" @click="activeTab = 'schedule'">
                            <i class="pi pi-calendar" style="margin-right: 0.5rem;"></i>
                            Shift Scheduling
                        </p-tab>
                        <p-tab value="summary" @click="activeTab = 'summary'">
                            <i class="pi pi-chart-bar" style="margin-right: 0.5rem;"></i>
                            Weekly Shift Summary
                        </p-tab>
                        <p-tab value="attendance" @click="activeTab = 'attendance'">
                            <i class="pi pi-clock" style="margin-right: 0.5rem;"></i>
                            Attendance
                        </p-tab>
                    </p-tablist>

                    <p-tabpanels>
                        <!-- Shift Library Tab -->
                        <p-tabpanel value="shifts">
                            <!-- Shift Library Header -->
                            <div class="shift-library-header">
                                <div class="shift-library-info">
                                    <h2>SHIFT LIBRARY</h2>
                                    <p>Standardize operational hours across all departments.</p>
                                </div>
                                <div class="shift-library-stats">
                                    <div class="preset-count">
                                        <span class="count-value">{{ allShifts.length }}</span>
                                        <span class="count-label">PRESETS</span>
                                    </div>
                                    <button class="new-preset-btn" @click="openShiftDialog()">
                                        <i class="pi pi-plus"></i>
                                        <span>NEW PRESET</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Shift Type Tabs -->
                            <div class="shift-type-tabs">
                                <button class="shift-type-tab" :class="{ active: shiftTypeFilter === 'normal' }" 
                                        @click="shiftTypeFilter = 'normal'">NORMAL SHIFT</button>
                                <button class="shift-type-tab" :class="{ active: shiftTypeFilter === 'template' }" 
                                        @click="shiftTypeFilter = 'template'">TEMPLATE DAY SHIFT</button>
                                <button class="shift-type-tab" :class="{ active: shiftTypeFilter === 'flexible' }" 
                                        @click="shiftTypeFilter = 'flexible'">FLEXIBLE SHIFT</button>
                            </div>

                            <!-- Shift Cards Grid -->
                            <div class="shift-library-grid">
                                <!-- Existing Shift Cards -->
                                <div v-for="shift in filteredShifts" :key="shift.id" class="shift-preset-card">
                                    <div class="preset-card-header">
                                        <div class="preset-icon" :style="{ background: shift.color + '20', color: shift.color }">
                                            <i class="pi pi-calendar"></i>
                                        </div>
                                        <div class="preset-info">
                                            <h3>{{ shift.name }}</h3>
                                            <div class="preset-meta">
                                                <span class="preset-type">{{ getShiftTypeLabel(shift.shiftType) }}</span>
                                                <span class="preset-periods">{{ shift.periods ? shift.periods.length : 1 }} Period{{ (shift.periods?.length || 1) > 1 ? 's' : '' }}</span>
                                            </div>
                                        </div>
                                        <div class="preset-actions">
                                            <button class="action-btn edit" @click="editShift(shift)" title="Edit">
                                                <i class="pi pi-pencil"></i>
                                            </button>
                                            <button class="action-btn delete" @click="deleteShift(shift)" title="Delete">
                                                <i class="pi pi-trash"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Period Details (show first period or flexible info) -->
                                    <template v-if="shift.shiftType === 'flexible'">
                                        <div class="flexible-shift-details">
                                            <!-- Required Hours Display -->
                                            <div class="flexible-hours-display">
                                                <div class="hours-value">{{ shift.requiredHours }}</div>
                                                <div class="hours-label">Hours Required Daily</div>
                                            </div>

                                            <!-- Duration Progress Bar -->
                                            <div class="duration-bar">
                                                <div class="duration-bar-fill" :style="{ width: (shift.requiredHours / 12 * 100) + '%', background: shift.color }"></div>
                                            </div>

                                            <!-- Valid Time Window -->
                                            <div class="clock-rules-section flexible-window">
                                                <div class="rules-header">
                                                    <i class="pi pi-clock"></i>
                                                    <span>VALID WORK WINDOW:</span>
                                                </div>
                                                <div class="rules-content">
                                                    <div class="rule-line">
                                                        Punch-in allowed from <strong>{{ formatTime12(shift.validFrom) }}</strong> 
                                                        to <strong>{{ formatTime12(shift.validTo) }}</strong>
                                                    </div>
                                                    <div class="rule-line info-text">
                                                        <i class="pi pi-info-circle"></i>
                                                        Total work time calculated based on first and last punch
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-else>
                                        <div v-for="(period, pIndex) in (shift.periods || [{ startTime: shift.startTime, endTime: shift.endTime, clockIn: shift.clockIn, clockOut: shift.clockOut }])" 
                                             :key="pIndex" class="preset-period">
                                            <div class="preset-time-info">
                                                <div class="time-display">
                                                    <i class="pi pi-clock"></i>
                                                    <span>{{ formatTime12(period.startTime) }} - {{ formatTime12(period.endTime) }}</span>
                                                </div>
                                                <div class="duration-display">
                                                    <i class="pi pi-stopwatch"></i>
                                                    <span>{{ calculateDuration(period.startTime, period.endTime) }} hrs Duration</span>
                                                </div>
                                            </div>

                                            <!-- Duration Progress Bar -->
                                            <div class="duration-bar">
                                                <div class="duration-bar-fill" :style="{ width: getDurationPercent(period.startTime, period.endTime) + '%', background: shift.color }"></div>
                                            </div>

                                            <!-- Clock-In Rules -->
                                            <div class="clock-rules-section">
                                                <div class="rules-header">
                                                    <i class="pi pi-sign-in"></i>
                                                    <span>CLOCK-IN RULES:</span>
                                                </div>
                                                <div class="rules-content">
                                                    <div class="rule-line">
                                                        Window: <strong>{{ formatTime12(period.clockIn?.windowStart || subtractMinutes(period.startTime, 60)) }}</strong> 
                                                        to <strong>{{ formatTime12(period.clockIn?.windowEnd || addMinutes(period.startTime, 60)) }}</strong>.
                                                    </div>
                                                    <div class="rule-line threshold">
                                                        Late threshold: <span class="threshold-value">{{ formatTime12(period.clockIn?.lateThreshold || addMinutes(period.startTime, 15)) }}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Clock-Out Rules -->
                                            <div class="clock-rules-section">
                                                <div class="rules-header out">
                                                    <i class="pi pi-sign-out"></i>
                                                    <span>CLOCK-OUT RULES:</span>
                                                </div>
                                                <div class="rules-content">
                                                    <div class="rule-line">
                                                        Window: <strong>{{ formatTime12(period.clockOut?.windowStart || subtractMinutes(period.endTime, 30)) }}</strong> 
                                                        to <strong>{{ formatTime12(period.clockOut?.windowEnd || addMinutes(period.endTime, 60)) }}</strong>.
                                                    </div>
                                                    <div class="rule-line threshold">
                                                        Early exit threshold: <span class="threshold-value">{{ formatTime12(period.clockOut?.earlyThreshold || period.endTime) }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>

                                <!-- Create New Shift Card -->
                                <div class="shift-preset-card create-new" @click="openShiftDialog()">
                                    <div class="create-new-content">
                                        <i class="pi pi-plus"></i>
                                        <h4>Create New Shift</h4>
                                        <p>Add a custom shift preset</p>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- Shift Scheduling Tab -->
                        <p-tabpanel value="schedule">
                            <!-- Scheduler Header -->
                            <div class="scheduler-header">
                                <div class="scheduler-title-section">
                                    <div class="scheduler-icon">
                                        <i class="pi pi-users"></i>
                                    </div>
                                    <div class="scheduler-title-info">
                                        <h2>SHIFT SCHEDULING</h2>
                                        <p>Manage individual assignments</p>
                                    </div>
                                    <div v-if="pendingChanges.length > 0" class="pending-badge">
                                        {{ pendingChanges.length }} PENDING CHANGES
                                    </div>
                                </div>
                                <div class="scheduler-actions">
                                    <button class="scheduler-action-btn" @click="draftAndReview">
                                        <i class="pi pi-file-edit"></i>
                                        Draft & Review
                                    </button>
                                    <button class="scheduler-action-btn" @click="publishLater">
                                        <i class="pi pi-clock"></i>
                                        Publish Later
                                    </button>
                                    <button class="scheduler-action-btn primary" :class="{ highlighted: pendingChanges.length > 0 }" @click="publishAndLaunch">
                                        <i class="pi pi-send"></i>
                                        Publish & Launch
                                    </button>
                                </div>
                                <div class="scheduler-date-nav">
                                    <button class="nav-arrow" @click="previousWeek"><i class="pi pi-chevron-left"></i></button>
                                    <span class="date-range">{{ weekLabelFormatted }}</span>
                                    <button class="nav-arrow" @click="nextWeek"><i class="pi pi-chevron-right"></i></button>
                                </div>
                                <button class="add-staff-btn">
                                    <i class="pi pi-users"></i>
                                    Add Staff
                                </button>
                            </div>

                            <!-- Search and Filter Bar -->
                            <div class="scheduler-toolbar">
                                <div class="search-filter-group">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search"></i>
                                        <p-inputtext v-model="scheduleSearch" placeholder="Search by name or role..." style="width: 250px;"></p-inputtext>
                                    </span>
                                    <button class="filter-btn">
                                        <i class="pi pi-filter"></i>
                                    </button>
                                </div>
                                <div class="scheduler-legend">
                                    <div class="legend-item-new">
                                        <span class="legend-dot active"></span>
                                        <span>ACTIVE SHIFTS</span>
                                    </div>
                                    <div class="legend-item-new">
                                        <span class="legend-dot unassigned"></span>
                                        <span>UNASSIGNED</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Schedule Grid -->
                            <div class="scheduler-grid-container">
                                <table class="scheduler-grid">
                                    <thead>
                                        <tr>
                                            <th class="staff-col">STAFF MEMBERS</th>
                                            <th v-for="day in weekDays" :key="day.date" class="day-col-new">
                                                <div class="day-header-new">
                                                    <span class="day-abbr">{{ day.dayName.substring(0, 3).toUpperCase() }}</span>
                                                    <span class="day-num">{{ day.dateLabel }}</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="schedule in filteredEmployeeSchedules" :key="schedule.id">
                                            <td class="staff-col">
                                                <div class="staff-info">
                                                    <img :src="getEmployeeAvatar(schedule.employeeId)" :alt="schedule.employeeName" class="staff-avatar">
                                                    <div class="staff-details">
                                                        <div class="staff-name">{{ schedule.employeeName }}</div>
                                                        <div class="staff-role">{{ schedule.scheduleType }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td v-for="day in weekDays" :key="day.date" class="day-col-new">
                                                <div class="schedule-cell" :class="{ 'has-assignment': hasAssignment(schedule, day.dayName) }">
                                                    <!-- Assigned Shift -->
                                                    <template v-if="getAssignment(schedule, day.dayName)">
                                                        <div v-if="getAssignment(schedule, day.dayName).type === 'shift'" 
                                                             class="assigned-shift-card"
                                                             @click="removeAssignment(schedule, day.dayName)">
                                                            <div class="shift-indicator"></div>
                                                            <div class="shift-name-assigned">{{ getAssignment(schedule, day.dayName).shiftName }}</div>
                                                            <div class="shift-start-time">{{ getAssignment(schedule, day.dayName).startTime }}</div>
                                                            <div class="shift-end-time">Ends {{ getAssignment(schedule, day.dayName).endTime }}</div>
                                                        </div>
                                                        <div v-else class="time-off-card" @click="removeAssignment(schedule, day.dayName)">
                                                            <i class="pi pi-sun"></i>
                                                            <span>TIME OFF</span>
                                                        </div>
                                                    </template>
                                                    <!-- Add Shift Button -->
                                                    <template v-else>
                                                        <div class="add-shift-wrapper">
                                                            <button class="add-shift-btn" 
                                                                    @click="openShiftMenu($event, schedule, day)"
                                                                    title="Add Shift">
                                                                <i class="pi pi-plus"></i>
                                                            </button>
                                                        </div>
                                                    </template>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Shift Menu Popup -->
                            <div v-if="showShiftMenu" class="shift-menu-popup" :style="shiftMenuPosition">
                                <div class="menu-item" @click="openTemplateSelector">
                                    <i class="pi pi-file-edit"></i>
                                    <span>Add from templates</span>
                                    <i class="pi pi-chevron-right"></i>
                                </div>
                                <div class="menu-item" @click="addTimeOff">
                                    <i class="pi pi-sun"></i>
                                    <span>Add time off</span>
                                </div>
                            </div>

                            <!-- Template Selector Popup -->
                            <div v-if="showTemplateSelector" class="template-selector-popup" :style="shiftMenuPosition">
                                <div class="template-header">
                                    <button class="back-btn" @click="showTemplateSelector = false; showShiftMenu = true;">
                                        <i class="pi pi-chevron-left"></i>
                                    </button>
                                    <span>SELECT TEMPLATE</span>
                                    <button class="close-btn" @click="closeAllMenus">
                                        <i class="pi pi-times"></i>
                                    </button>
                                </div>
                                <div class="template-search">
                                    <i class="pi pi-search"></i>
                                    <input type="text" v-model="templateSearch" placeholder="Search templates">
                                </div>
                                <div class="template-list">
                                    <div v-for="shift in filteredTemplates" :key="shift.id" 
                                         class="template-card" 
                                         :class="{ selected: selectedTemplateId === shift.id }"
                                         @click="selectTemplate(shift)">
                                        <div class="template-color-bar" :style="{ background: shift.color }"></div>
                                        <div class="template-info">
                                            <div class="template-name">{{ shift.name }}</div>
                                            <div class="template-time">{{ getShiftTimeRange(shift) }}</div>
                                            <div class="template-meta">
                                                <span class="template-duration">
                                                    <i class="pi pi-clock"></i>
                                                    {{ getShiftDuration(shift) }} hrs
                                                </span>
                                                <span class="show-rules" @click.stop="toggleShiftRules(shift.id)">
                                                    Show shift rules <i class="pi pi-chevron-right"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- Weekly Shift Summary Tab -->
                        <p-tabpanel value="summary">
                            <!-- Weekly Summary Header -->
                            <div class="summary-header-card">
                                <div class="summary-title-section">
                                    <div class="summary-icon">
                                        <span>{{ weekDays[0]?.dateLabel?.split('/')[0] || '26' }}</span>
                                    </div>
                                    <div class="summary-title-info">
                                        <h2>WEEKLY SUMMARY</h2>
                                        <p>REAL-TIME STATS FOR {{ weekLabelFormatted }}</p>
                                    </div>
                                </div>
                                <div class="summary-stats-row">
                                    <div class="summary-stat">
                                        <div class="stat-icon-circle orange">
                                            <i class="pi pi-clock"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-value-lg">{{ summaryStats.totalHours }}</div>
                                            <div class="stat-label-sm">TOTAL HOURS</div>
                                        </div>
                                    </div>
                                    <div class="summary-stat">
                                        <div class="stat-icon-circle blue">
                                            <i class="pi pi-calendar"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-value-lg">{{ summaryStats.scheduledShifts }}</div>
                                            <div class="stat-label-sm">SCHEDULED SHIFTS</div>
                                        </div>
                                    </div>
                                    <div class="summary-stat">
                                        <div class="stat-icon-circle green">
                                            <i class="pi pi-users"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-value-lg">{{ summaryStats.staffOnDuty }}</div>
                                            <div class="stat-label-sm">STAFF ON DUTY</div>
                                        </div>
                                    </div>
                                    <div class="summary-stat">
                                        <div class="stat-icon-circle gray">
                                            <i class="pi pi-exclamation-circle"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-value-lg">{{ summaryStats.unassigned }}</div>
                                            <div class="stat-label-sm">UNASSIGNED</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="completion-rate-section">
                                    <div class="completion-label">SHIFT COMPLETION RATE</div>
                                    <div class="completion-bar-container">
                                        <div class="completion-bar">
                                            <div class="completion-bar-fill" :style="{ width: summaryStats.completionRate + '%' }"></div>
                                        </div>
                                        <span class="completion-percent">{{ summaryStats.completionRate }}% COMPLETE</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Shift Reviewer Section -->
                            <div class="shift-reviewer-card">
                                <div class="reviewer-header">
                                    <div class="reviewer-title">
                                        <div class="reviewer-icon">
                                            <i class="pi pi-eye"></i>
                                        </div>
                                        <span>SHIFT REVIEWER</span>
                                    </div>
                                    <div class="reviewer-tabs">
                                        <button class="reviewer-tab" :class="{ active: reviewerTab === 'today' }" @click="reviewerTab = 'today'">Today</button>
                                        <button class="reviewer-tab" :class="{ active: reviewerTab === 'week' }" @click="reviewerTab = 'week'">Current Week</button>
                                        <button class="reviewer-tab" :class="{ active: reviewerTab === 'next' }" @click="reviewerTab = 'next'">Next Week</button>
                                    </div>
                                    <div class="reviewer-filter">
                                        <span class="p-input-icon-left">
                                            <i class="pi pi-search"></i>
                                            <p-inputtext v-model="reviewerSearch" placeholder="Filter staff..." style="width: 180px;"></p-inputtext>
                                        </span>
                                    </div>
                                    <div class="reviewer-date-nav">
                                        <button class="nav-arrow" @click="previousWeek"><i class="pi pi-chevron-left"></i></button>
                                        <span class="date-range-sm">{{ weekLabelShort }}</span>
                                        <button class="nav-arrow" @click="nextWeek"><i class="pi pi-chevron-right"></i></button>
                                    </div>
                                    <button class="filter-btn"><i class="pi pi-filter"></i></button>
                                </div>
                                
                                <!-- Reviewer Grid -->
                                <div class="reviewer-grid-container">
                                    <table class="reviewer-grid">
                                        <thead>
                                            <tr>
                                                <th class="employee-col-rev">EMPLOYEE</th>
                                                <th v-for="day in weekDays" :key="day.date" class="day-col-rev">
                                                    <div class="day-header-rev">
                                                        <span class="day-name-rev">{{ day.dayName.substring(0, 3) }}</span>
                                                        <span class="day-num-rev">{{ day.dateLabel?.split('/')[0] }}</span>
                                                    </div>
                                                </th>
                                                <th class="percent-col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="schedule in filteredReviewerSchedules" :key="schedule.id">
                                                <td class="employee-col-rev">
                                                    <div class="employee-info-rev">
                                                        <img :src="getEmployeeAvatar(schedule.employeeId)" :alt="schedule.employeeName" class="avatar-rev">
                                                        <div class="employee-details-rev">
                                                            <div class="employee-name-rev">{{ schedule.employeeName }}</div>
                                                            <div class="employee-role-rev">{{ schedule.scheduleType }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td v-for="(day, dIndex) in weekDays" :key="day.date" class="day-col-rev">
                                                    <div class="shift-block" 
                                                         :class="getShiftBlockClass(schedule, day.dayName, dIndex)"
                                                         :style="getShiftBlockStyle(schedule, day.dayName)">
                                                        <template v-if="getReviewerShift(schedule, day.dayName)">
                                                            <div class="shift-block-name">{{ getReviewerShift(schedule, day.dayName).name }}</div>
                                                            <div class="shift-block-time">{{ getReviewerShift(schedule, day.dayName).time }}</div>
                                                        </template>
                                                        <template v-else>
                                                            <span class="no-shift">-</span>
                                                        </template>
                                                    </div>
                                                </td>
                                                <td class="percent-col">
                                                    <span class="coverage-percent">{{ getEmployeeCoverage(schedule) }}%</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Operational Insights Section -->
                            <div class="insights-section">
                                <div class="section-title-row">
                                    <div class="section-dot"></div>
                                    <h3>OPERATIONAL INSIGHTS</h3>
                                </div>
                                <div class="insights-grid">
                                    <!-- Stats Column -->
                                    <div class="insights-stats-card">
                                        <div class="insights-stat-row">
                                            <div class="insights-stat">
                                                <div class="insights-stat-label">TOTAL HOURS</div>
                                                <div class="insights-stat-value">{{ summaryStats.totalHours }}<span class="unit">hrs</span></div>
                                            </div>
                                            <div class="insights-stat">
                                                <div class="insights-stat-label">ACTIVE STAFF</div>
                                                <div class="insights-stat-value">{{ summaryStats.staffOnDuty }}<span class="unit">users</span></div>
                                            </div>
                                        </div>
                                        <div class="insights-stat-row">
                                            <div class="insights-stat">
                                                <div class="insights-stat-label">SHIFT COUNT</div>
                                                <div class="insights-stat-value">{{ summaryStats.scheduledShifts }}<span class="unit">slots</span></div>
                                            </div>
                                            <div class="insights-stat">
                                                <div class="insights-stat-label">COVERAGE</div>
                                                <div class="insights-stat-value">{{ summaryStats.completionRate }}<span class="unit">%</span></div>
                                            </div>
                                        </div>
                                        <div class="peak-load-card">
                                            <div class="peak-icon"><i class="pi pi-chart-line"></i></div>
                                            <div class="peak-info">
                                                <div class="peak-label">PEAK LOAD DAY</div>
                                                <div class="peak-value">{{ summaryStats.peakDay }} ({{ summaryStats.peakHours }} hrs total)</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Chart Column -->
                                    <div class="insights-chart-card">
                                        <div class="chart-header">
                                            <div class="chart-title">
                                                <i class="pi pi-chart-bar"></i>
                                                <span>Hourly Distribution</span>
                                            </div>
                                            <div class="chart-subtitle">Aggregated work hours across the week</div>
                                        </div>
                                        <div class="chart-content">
                                            <div class="bar-chart">
                                                <div v-for="(day, index) in hourlyDistribution" :key="index" class="bar-item">
                                                    <div class="bar" :style="{ height: (day.hours / 60 * 100) + '%' }" :class="{ highlighted: day.isHighest }"></div>
                                                    <span class="bar-label">{{ day.day }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="chart-footer">
                                            <div class="average-load">
                                                <span class="avg-label">AVERAGE LOAD</span>
                                                <span class="avg-value">{{ summaryStats.avgLoad }}h / user</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Employee Density Heatmap -->
                            <div class="heatmap-section">
                                <div class="heatmap-header">
                                    <div class="heatmap-title">
                                        <div class="section-dot orange"></div>
                                        <h3>Employee Density Heatmap (24h)</h3>
                                    </div>
                                    <p>STAFF DISTRIBUTION ACROSS EVERY HOUR OF THE DAY</p>
                                    <div class="density-legend">
                                        <span>DENSITY</span>
                                        <div class="density-gradient">
                                            <span class="density-min"></span>
                                            <span class="density-low"></span>
                                            <span class="density-med"></span>
                                            <span class="density-high"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="heatmap-grid-container">
                                    <table class="heatmap-grid">
                                        <thead>
                                            <tr>
                                                <th>DAY</th>
                                                <th v-for="hour in heatmapHours" :key="hour">{{ hour }}</th>
                                                <th>HRS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="row in heatmapData" :key="row.day">
                                                <td class="day-label" :class="row.day.toLowerCase()">{{ row.day }}</td>
                                                <td v-for="(count, hIndex) in row.hours" :key="hIndex" 
                                                    class="heatmap-cell"
                                                    :class="getHeatmapCellClass(count)">
                                                    {{ count > 0 ? count : '' }}
                                                </td>
                                                <td class="total-hours">{{ row.total }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="heatmap-footer">
                                    <div class="heatmap-stat">
                                        <div class="heatmap-stat-icon"><i class="pi pi-clock"></i></div>
                                        <div class="heatmap-stat-info">
                                            <div class="heatmap-stat-label">BUSIEST HOUR</div>
                                            <div class="heatmap-stat-value">{{ heatmapStats.busiestHour }}</div>
                                        </div>
                                    </div>
                                    <div class="heatmap-stat">
                                        <div class="heatmap-stat-icon quiet"><i class="pi pi-moon"></i></div>
                                        <div class="heatmap-stat-info">
                                            <div class="heatmap-stat-label">QUIETEST HOUR</div>
                                            <div class="heatmap-stat-value">{{ heatmapStats.quietestHour }}</div>
                                        </div>
                                    </div>
                                    <div class="heatmap-stat">
                                        <div class="heatmap-stat-icon schedule"><i class="pi pi-calendar"></i></div>
                                        <div class="heatmap-stat-info">
                                            <div class="heatmap-stat-label">SCHEDULE LOAD</div>
                                            <div class="heatmap-stat-value">{{ heatmapStats.scheduleLoad }}</div>
                                        </div>
                                    </div>
                                    <div class="heatmap-stat">
                                        <div class="heatmap-stat-icon flexible"><i class="pi pi-sliders-h"></i></div>
                                        <div class="heatmap-stat-info">
                                            <div class="heatmap-stat-label">FLEXIBLE LOAD</div>
                                            <div class="heatmap-stat-value">{{ heatmapStats.flexibleLoad }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- Attendance Tab -->
                        <p-tabpanel value="attendance">
                            <!-- Attendance Stats Row -->
                            <div class="attendance-stats-row">
                                <div class="att-stat-card">
                                    <div class="att-stat-icon">
                                        <i class="pi pi-users"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">TOTAL STAFF</div>
                                        <div class="att-stat-value">{{ attendanceStats.totalStaff }}</div>
                                    </div>
                                </div>
                                <div class="att-stat-card">
                                    <div class="att-stat-icon green">
                                        <i class="pi pi-check"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">PRESENT NOW</div>
                                        <div class="att-stat-value">{{ attendanceStats.presentNow }}</div>
                                    </div>
                                </div>
                                <div class="att-stat-card">
                                    <div class="att-stat-icon orange">
                                        <i class="pi pi-clock"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">LATE IN</div>
                                        <div class="att-stat-value">{{ attendanceStats.lateIn }}</div>
                                    </div>
                                </div>
                                <div class="att-stat-card">
                                    <div class="att-stat-icon yellow">
                                        <i class="pi pi-sign-out"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">EARLY OUT</div>
                                        <div class="att-stat-value">{{ attendanceStats.earlyOut }}</div>
                                    </div>
                                </div>
                                <div class="att-stat-card">
                                    <div class="att-stat-icon red">
                                        <i class="pi pi-exclamation-circle"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">MISSING LOGS</div>
                                        <div class="att-stat-value">{{ attendanceStats.missingLogs }}</div>
                                    </div>
                                </div>
                                <div class="att-stat-card">
                                    <div class="att-stat-icon purple">
                                        <i class="pi pi-calendar"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">ANNUAL LEAVE</div>
                                        <div class="att-stat-value">{{ attendanceStats.annualLeave }}</div>
                                    </div>
                                </div>
                                <div class="att-stat-card">
                                    <div class="att-stat-icon blue">
                                        <i class="pi pi-home"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">WORK FROM HOME</div>
                                        <div class="att-stat-value">{{ attendanceStats.workFromHome }}</div>
                                    </div>
                                </div>
                                <div class="att-stat-card">
                                    <div class="att-stat-icon teal">
                                        <i class="pi pi-briefcase"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">BUSINESS TRIP</div>
                                        <div class="att-stat-value">{{ attendanceStats.businessTrip }}</div>
                                    </div>
                                </div>
                                <div class="att-stat-card">
                                    <div class="att-stat-icon pink">
                                        <i class="pi pi-times"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">ABSENT</div>
                                        <div class="att-stat-value">{{ attendanceStats.absent }}</div>
                                    </div>
                                </div>
                                <div class="att-stat-card">
                                    <div class="att-stat-icon warning">
                                        <i class="pi pi-exclamation-triangle"></i>
                                    </div>
                                    <div class="att-stat-content">
                                        <div class="att-stat-label">OUTSIDE WRL</div>
                                        <div class="att-stat-value">{{ attendanceStats.outsideWindow }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Attendance Logs Section -->
                            <div class="attendance-logs-card">
                                <div class="logs-header">
                                    <h3>ATTENDANCE LOGS</h3>
                                    <div class="logs-actions">
                                        <span class="p-input-icon-left">
                                            <i class="pi pi-search"></i>
                                            <p-inputtext v-model="searchAttendance" placeholder="Filter..." style="width: 180px;"></p-inputtext>
                                        </span>
                                        <button class="export-btn">
                                            <i class="pi pi-download"></i>
                                            EXPORT
                                        </button>
                                    </div>
                                </div>

                                <!-- Attendance Table -->
                                <div class="attendance-table-container">
                                    <table class="attendance-table">
                                        <thead>
                                            <tr>
                                                <th class="col-employee">EMPLOYEE</th>
                                                <th class="col-context">DAY CONTEXT</th>
                                                <th class="col-shift">SHIFT</th>
                                                <th class="col-time">TIME RANGE</th>
                                                <th class="col-in">IN</th>
                                                <th class="col-out">OUT</th>
                                                <th class="col-status">STATUS</th>
                                                <th class="col-punch">PUNCH FLAG</th>
                                                <th class="col-duration">DURATION</th>
                                                <th class="col-violation">VIOLATION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="record in paginatedAttendance" :key="record.id">
                                                <td class="col-employee">
                                                    <div class="employee-cell">
                                                        <div class="emp-avatar-initial" :style="{ background: record.deptColor || 'var(--primary-color)' }">
                                                            {{ (record.name || 'U').charAt(0).toUpperCase() }}
                                                        </div>
                                                        <div class="emp-info">
                                                            <div class="emp-name">{{ record.name || getEmployeeName(record.employeeId) }}</div>
                                                            <div class="emp-dept">
                                                                <span class="dept-name" :style="{ color: record.deptColor || 'var(--primary-color)' }">{{ record.department }}</span>
                                                                <span class="emp-id">{{ record.empId || '#' + record.employeeId }}</span>
                                                            </div>
                                                            <div class="emp-role">{{ record.role }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="col-context">
                                                    <div class="context-cell" :class="getDayContextClass(record.dayContext)">
                                                        <i :class="getDayContextIcon(record.dayContext)"></i>
                                                        <span>{{ record.dayContext || 'Regular Workday' }}</span>
                                                    </div>
                                                </td>
                                                <td class="col-shift">
                                                    <span v-if="record.shiftType" class="shift-type-label">
                                                        <span class="shift-prefix">{{ record.shiftType }}</span>
                                                        <span v-if="record.shiftName"> - {{ record.shiftName }}</span>
                                                    </span>
                                                    <span v-else class="no-data">---</span>
                                                </td>
                                                <td class="col-time">
                                                    <span v-if="record.scheduledStart">{{ record.scheduledStart }} - {{ record.scheduledEnd }}</span>
                                                    <span v-else class="no-data">---</span>
                                                </td>
                                                <td class="col-in">
                                                    <span v-if="record.actualCheckIn" class="time-value">{{ record.actualCheckIn }}</span>
                                                    <span v-else class="no-data">---</span>
                                                </td>
                                                <td class="col-out">
                                                    <span v-if="record.actualCheckOut" class="time-value">{{ record.actualCheckOut }}</span>
                                                    <span v-else class="no-data">---</span>
                                                </td>
                                                <td class="col-status">
                                                    <span class="status-badge" :class="getStatusBadgeClass(record.status)">{{ record.status }}</span>
                                                </td>
                                                <td class="col-punch">
                                                    <span class="punch-flag" :class="getPunchFlagClass(record.punchFlag)">{{ record.punchFlag || '---' }}</span>
                                                </td>
                                                <td class="col-duration">
                                                    <span v-if="record.duration" class="duration-value">{{ record.duration }}</span>
                                                    <span v-else class="no-data">---</span>
                                                </td>
                                                <td class="col-violation">
                                                    <span v-if="record.violation" class="violation-badge" :class="getViolationClass(record.violation)">{{ record.violation }}</span>
                                                    <span v-else class="no-data">---</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div class="attendance-pagination">
                                    <div class="pagination-info">{{ filteredAttendanceLogs.length }} ACTIVE LOGS</div>
                                    <div class="pagination-controls">
                                        <button class="page-btn" :disabled="attendancePage === 1" @click="attendancePage--">PREV</button>
                                        <span class="page-indicator">PAGE {{ attendancePage }}</span>
                                        <button class="page-btn" :disabled="attendancePage >= totalAttendancePages" @click="attendancePage++">NEXT</button>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>

            <!-- Define New Shift Dialog -->
            <p-dialog v-model:visible="showShiftDialog" header="" :modal="true" :style="{ width: '1100px', maxWidth: '95vw' }" class="shift-dialog">
                <template #header>
                    <div class="shift-dialog-header">
                        <h2>Define New Shift</h2>
                        <div class="shift-type-toggle">
                            <button class="type-btn" :class="{ active: shiftForm.shiftType === 'normal' }" @click="shiftForm.shiftType = 'normal'">Normal</button>
                            <button class="type-btn" :class="{ active: shiftForm.shiftType === 'template' }" @click="shiftForm.shiftType = 'template'">Template</button>
                            <button class="type-btn" :class="{ active: shiftForm.shiftType === 'flexible' }" @click="shiftForm.shiftType = 'flexible'">Flexible</button>
                        </div>
                    </div>
                </template>

                <div class="shift-dialog-content">
                    <!-- Shift Name -->
                    <div class="form-group">
                        <label class="form-label">Shift Name (English)</label>
                        <p-inputtext v-model="shiftForm.name" placeholder="e.g., Morning Shift" style="width: 100%;"></p-inputtext>
                    </div>

                    <!-- NORMAL SHIFT -->
                    <template v-if="shiftForm.shiftType === 'normal'">
                        <div class="shift-details-section">
                            <h3>Shift Details</h3>
                            <div class="shift-time-row-compact">
                                <div class="time-input-group-compact">
                                    <label class="mini-label">START TIME</label>
                                    <p-datepicker v-model="shiftForm.startTimeDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="time-input-group-compact">
                                    <label class="mini-label">END TIME</label>
                                    <p-datepicker v-model="shiftForm.endTimeDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="time-input-group-compact color-section">
                                    <label class="mini-label">SHIFT COLOR</label>
                                    <div class="color-duration-display">
                                        <div class="color-box" :style="{ background: shiftForm.color }" @click="showColorPicker = !showColorPicker"></div>
                                        <span class="duration-badge">{{ computedDuration }} hrs</span>
                                    </div>
                                    <div v-if="showColorPicker" class="color-picker-dropdown">
                                        <div v-for="color in shiftColors" :key="color" 
                                             class="color-option" 
                                             :class="{ selected: shiftForm.color === color }"
                                             :style="{ background: color }"
                                             @click="shiftForm.color = color; showColorPicker = false"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Clock Rules -->
                            <div class="clock-rules-grid">
                                <!-- Clock-In Rules -->
                                <div class="clock-rules-card">
                                    <div class="rules-title">
                                        <span class="rules-dot in"></span>
                                        <span>Clock-In Rules</span>
                                        <span class="base-time">Base: {{ formatTimeFromDate(shiftForm.startTimeDate) }}</span>
                                    </div>
                                    <div class="rules-inputs-compact">
                                        <div class="rule-input-group-compact">
                                            <label>No earlier than (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockIn.noEarlierThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>Allowed delay (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockIn.allowedDelay" :min="0" :max="120" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>No later than (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockIn.noLaterThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                    </div>
                                    <div class="rules-summary">
                                        <i class="pi pi-info-circle"></i>
                                        <span>Window: <strong>{{ computedClockInWindow }}</strong>. Late threshold: <strong>{{ computedClockInLate }}</strong></span>
                                    </div>
                                </div>

                                <!-- Clock-Out Rules -->
                                <div class="clock-rules-card">
                                    <div class="rules-title">
                                        <span class="rules-dot out"></span>
                                        <span>Clock-Out Rules</span>
                                        <span class="base-time">Base: {{ formatTimeFromDate(shiftForm.endTimeDate) }}</span>
                                    </div>
                                    <div class="rules-inputs-compact">
                                        <div class="rule-input-group-compact">
                                            <label>No earlier than (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockOut.noEarlierThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>Allowed shortage (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockOut.allowedShortage" :min="0" :max="120" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>No later than (Mins)</label>
                                            <p-inputnumber v-model="shiftForm.clockOut.noLaterThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                    </div>
                                    <div class="rules-summary out">
                                        <i class="pi pi-info-circle"></i>
                                        <span>Window: <strong>{{ computedClockOutWindow }}</strong>. Early exit threshold: <strong>{{ computedClockOutEarly }}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- TEMPLATE DAY SHIFT -->
                    <template v-if="shiftForm.shiftType === 'template'">
                        <div v-for="(period, index) in shiftForm.periods" :key="index" class="shift-details-section period-section">
                            <div class="period-header">
                                <h3>Shift Period {{ index + 1 }}</h3>
                                <button v-if="shiftForm.periods.length > 1" class="remove-period-btn" @click="removePeriod(index)">
                                    <i class="pi pi-times"></i>
                                </button>
                            </div>
                            <div class="shift-time-row-compact">
                                <div class="time-input-group-compact">
                                    <label class="mini-label">START TIME</label>
                                    <p-datepicker v-model="period.startTimeDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="time-input-group-compact">
                                    <label class="mini-label">END TIME</label>
                                    <p-datepicker v-model="period.endTimeDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="time-input-group-compact color-section">
                                    <label class="mini-label">SHIFT COLOR</label>
                                    <div class="color-duration-display">
                                        <div class="color-box" :style="{ background: shiftForm.color }" @click="showColorPicker = !showColorPicker"></div>
                                        <span class="duration-badge">{{ calculateDurationFromDates(period.startTimeDate, period.endTimeDate) }} hrs</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Clock Rules for this period -->
                            <div class="clock-rules-grid">
                                <div class="clock-rules-card">
                                    <div class="rules-title">
                                        <span class="rules-dot in"></span>
                                        <span>Clock-In Rules</span>
                                        <span class="base-time">Base: {{ formatTimeFromDate(period.startTimeDate) }}</span>
                                    </div>
                                    <div class="rules-inputs-compact">
                                        <div class="rule-input-group-compact">
                                            <label>No earlier than (Mins)</label>
                                            <p-inputnumber v-model="period.clockIn.noEarlierThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>Allowed delay (Mins)</label>
                                            <p-inputnumber v-model="period.clockIn.allowedDelay" :min="0" :max="120" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>No later than (Mins)</label>
                                            <p-inputnumber v-model="period.clockIn.noLaterThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                    </div>
                                    <div class="rules-summary">
                                        <i class="pi pi-info-circle"></i>
                                        <span>Window: <strong>{{ computePeriodClockInWindowDate(period) }}</strong>. Late threshold: <strong>{{ computePeriodClockInLateDate(period) }}</strong></span>
                                    </div>
                                </div>
                                <div class="clock-rules-card">
                                    <div class="rules-title">
                                        <span class="rules-dot out"></span>
                                        <span>Clock-Out Rules</span>
                                        <span class="base-time">Base: {{ formatTimeFromDate(period.endTimeDate) }}</span>
                                    </div>
                                    <div class="rules-inputs-compact">
                                        <div class="rule-input-group-compact">
                                            <label>No earlier than (Mins)</label>
                                            <p-inputnumber v-model="period.clockOut.noEarlierThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>Allowed shortage (Mins)</label>
                                            <p-inputnumber v-model="period.clockOut.allowedShortage" :min="0" :max="120" showButtons></p-inputnumber>
                                        </div>
                                        <div class="rule-input-group-compact">
                                            <label>No later than (Mins)</label>
                                            <p-inputnumber v-model="period.clockOut.noLaterThan" :min="0" :max="180" showButtons></p-inputnumber>
                                        </div>
                                    </div>
                                    <div class="rules-summary out">
                                        <i class="pi pi-info-circle"></i>
                                        <span>Window: <strong>{{ computePeriodClockOutWindowDate(period) }}</strong>. Early exit threshold: <strong>{{ computePeriodClockOutEarlyDate(period) }}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Add Period Button -->
                        <div class="add-period-btn" @click="addPeriod">
                            <i class="pi pi-plus"></i>
                            <span>Add Shift Period</span>
                        </div>
                    </template>

                    <!-- FLEXIBLE SHIFT -->
                    <template v-if="shiftForm.shiftType === 'flexible'">
                        <div class="flexible-shift-form">
                            <div class="flexible-row-compact">
                                <div class="form-group">
                                    <label class="form-label">Required Daily Hours</label>
                                    <p-inputnumber v-model="shiftForm.requiredHours" :min="1" :max="24" showButtons suffix=" hrs"></p-inputnumber>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Valid From</label>
                                    <p-datepicker v-model="shiftForm.validFromDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Valid To</label>
                                    <p-datepicker v-model="shiftForm.validToDate" timeOnly showIcon iconDisplay="input" hourFormat="12"></p-datepicker>
                                </div>
                            </div>
                            <div class="flexible-info-box">
                                <i class="pi pi-info-circle"></i>
                                <span>Employees can punch in any time within the window. Total work time is calculated based on first and last punch.</span>
                            </div>
                        </div>
                    </template>
                </div>

                <template #footer>
                    <div class="shift-dialog-footer">
                        <p-button label="Cancel" text @click="showShiftDialog = false"></p-button>
                        <p-button label="Save Shift Preset" icon="pi pi-check" @click="saveShift"></p-button>
                    </div>
                </template>
            </p-dialog>

            <!-- Assign Shift Dialog -->
            <p-dialog v-model:visible="showAssignDialog" header="Assign Shift" :modal="true" :style="{ width: '400px' }">
                <div v-if="assignForm.employee" style="margin-bottom: 1rem;">
                    <strong>{{ assignForm.employee.employeeName }}</strong> - {{ assignForm.dayName }}
                </div>
                <div class="form-group">
                    <label class="form-label">Shift</label>
                    <p-select v-model="assignForm.shiftId" :options="shiftSelectOptions" optionLabel="name" optionValue="id"
                              placeholder="Select shift" style="width: 100%;"></p-select>
                </div>
                <div class="form-group" style="margin-top: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <p-toggleswitch v-model="assignForm.isWorking"></p-toggleswitch>
                        <label class="form-label" style="margin: 0;">Working Day</label>
                    </div>
                </div>
                <template v-if="!assignForm.isWorking">
                    <div class="form-group" style="margin-top: 1rem;">
                        <label class="form-label">Day Type</label>
                        <p-select v-model="assignForm.dayType" :options="['weekend', 'day_off', 'leave', 'public_holiday']"
                                  placeholder="Select type" style="width: 100%;"></p-select>
                    </div>
                </template>
                <template #footer>
                    <p-button label="Cancel" text @click="showAssignDialog = false"></p-button>
                    <p-button label="Save" icon="pi pi-check" @click="saveAssignment"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed, onMounted } = Vue;

        // Tab state
        const activeTab = ref('shifts');
        const shiftTypeFilter = ref('normal');

        // Data
        const allShifts = ref([
            {
                id: 1,
                name: 'Standard Morning',
                shiftType: 'normal',
                startTime: '08:00',
                endTime: '17:00',
                color: '#f59e0b',
                clockIn: { noEarlierThan: 60, allowedDelay: 15, noLaterThan: 120 },
                clockOut: { noEarlierThan: 30, allowedShortage: 0, noLaterThan: 60 },
                active: true
            },
            {
                id: 2,
                name: 'CS Double Shift',
                shiftType: 'template',
                color: '#3b82f6',
                periods: [
                    {
                        startTime: '09:00',
                        endTime: '13:00',
                        clockIn: { noEarlierThan: 30, allowedDelay: 0, noLaterThan: 60 },
                        clockOut: { noEarlierThan: 15, allowedShortage: 0, noLaterThan: 30 }
                    },
                    {
                        startTime: '14:00',
                        endTime: '18:00',
                        clockIn: { noEarlierThan: 30, allowedDelay: 0, noLaterThan: 60 },
                        clockOut: { noEarlierThan: 15, allowedShortage: 0, noLaterThan: 30 }
                    }
                ],
                active: true
            },
            {
                id: 3,
                name: 'Flex Work Schedule',
                shiftType: 'flexible',
                color: '#8b5cf6',
                requiredHours: 8,
                validFrom: '07:00',
                validTo: '22:00',
                active: true
            }
        ]);

        const employeeSchedules = ref([...StaticData.employeeSchedules]);
        const attendanceRecords = ref([...StaticData.attendanceRecords]);
        const employees = ref([...StaticData.employees]);

        // Filtered shifts
        const filteredShifts = computed(() => {
            return allShifts.value.filter(s => s.shiftType === shiftTypeFilter.value);
        });

        // Week navigation
        const currentWeekStart = ref(getMonday(new Date()));

        function getMonday(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        }

        const weekDays = computed(() => {
            const days = [];
            const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (let i = 0; i < 7; i++) {
                const date = new Date(currentWeekStart.value);
                date.setDate(date.getDate() + i);
                days.push({
                    dayName: dayNames[i],
                    date: date.toISOString().split('T')[0],
                    dateLabel: date.getDate() + '/' + (date.getMonth() + 1)
                });
            }
            return days;
        });

        const weekLabel = computed(() => {
            const start = new Date(currentWeekStart.value);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
        });

        const previousWeek = () => {
            const d = new Date(currentWeekStart.value);
            d.setDate(d.getDate() - 7);
            currentWeekStart.value = d;
        };

        const nextWeek = () => {
            const d = new Date(currentWeekStart.value);
            d.setDate(d.getDate() + 7);
            currentWeekStart.value = d;
        };

        const goToToday = () => {
            currentWeekStart.value = getMonday(new Date());
        };

        const isToday = (dateStr) => {
            const today = new Date().toISOString().split('T')[0];
            return dateStr === today;
        };

        const isWeekend = (dayName) => {
            return dayName === 'Friday' || dayName === 'Saturday';
        };

        // Attendance stats
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecords = computed(() => attendanceRecords.value.filter(r => r.date === todayStr));
        const presentToday = computed(() => todayRecords.value.filter(r => r.status === 'Present' || r.status === 'Checked In').length);
        const lateToday = computed(() => todayRecords.value.filter(r => r.status === 'Late').length);
        const absentToday = computed(() => todayRecords.value.filter(r => r.status === 'Absent').length);

        // Attendance filters
        const selectedDate = ref(new Date('2026-01-13'));
        const searchAttendance = ref('');
        const filterAttendanceStatus = ref(null);
        const filterShift = ref(null);
        const attendanceStatuses = ref([...StaticData.attendanceStatuses]);

        const shiftSelectOptions = computed(() => allShifts.value.filter(s => s.active));

        const filteredAttendance = computed(() => {
            let result = attendanceRecords.value;
            const dateStr = selectedDate.value.toISOString().split('T')[0];
            result = result.filter(r => r.date === dateStr);

            if (searchAttendance.value) {
                const query = searchAttendance.value.toLowerCase();
                result = result.filter(r => {
                    const emp = employees.value.find(e => e.id === r.employeeId);
                    return emp && (emp.firstName.toLowerCase().includes(query) || emp.familyName.toLowerCase().includes(query));
                });
            }

            if (filterAttendanceStatus.value) {
                result = result.filter(r => r.status === filterAttendanceStatus.value);
            }

            if (filterShift.value) {
                result = result.filter(r => r.shiftId === filterShift.value);
            }

            return result;
        });

        // Helper functions
        const getEmployeeAvatar = (employeeId) => {
            const emp = employees.value.find(e => e.id === employeeId);
            return emp ? emp.avatar : '';
        };

        const getEmployeeName = (employeeId) => {
            const emp = employees.value.find(e => e.id === employeeId);
            return emp ? `${emp.firstName} ${emp.familyName}` : '';
        };

        const getShiftName = (shiftId) => {
            const shift = allShifts.value.find(s => s.id === shiftId);
            return shift ? shift.name : '';
        };

        const getShiftColor = (shiftId) => {
            const shift = allShifts.value.find(s => s.id === shiftId);
            return shift ? shift.color : '#e2e8f0';
        };

        const getShiftTime = (shiftId) => {
            const shift = allShifts.value.find(s => s.id === shiftId);
            if (!shift) return '';
            if (shift.shiftType === 'flexible') return 'Flex';
            if (shift.periods) return `${formatTime12(shift.periods[0].startTime)} - ${formatTime12(shift.periods[0].endTime)}`;
            return `${formatTime12(shift.startTime)} - ${formatTime12(shift.endTime)}`;
        };

        const getShiftCellClass = (schedule, dayName) => {
            const daySchedule = schedule.weekSchedule[dayName];
            if (!daySchedule || !daySchedule.isWorking) return 'day-off';
            return '';
        };

        const getCheckInClass = (record) => {
            if (!record.actualCheckIn) return '';
            if (record.status === 'Late') return 'late-checkin';
            return 'on-time-checkin';
        };

        const getAttendanceStatusClass = (status) => {
            const classes = {
                'Present': 'active',
                'Checked In': 'active',
                'Late': 'warning',
                'Absent': 'inactive',
                'Early Leave': 'warning',
                'Day Off': '',
                'Public Holiday': '',
                'Work From Home': 'active',
                'Business Trip': 'active'
            };
            return classes[status] || '';
        };

        const getShiftTypeLabel = (type) => {
            const labels = { 'normal': 'NORMAL', 'template': 'TEMPLATE DAY', 'flexible': 'FLEXIBLE' };
            return labels[type] || type.toUpperCase();
        };

        // Time helpers
        const formatTime12 = (time24) => {
            if (!time24) return '';
            const [hours, minutes] = time24.split(':').map(Number);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;
            return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        };

        const calculateDuration = (start, end) => {
            if (!start || !end) return 0;
            const [sh, sm] = start.split(':').map(Number);
            const [eh, em] = end.split(':').map(Number);
            let mins = (eh * 60 + em) - (sh * 60 + sm);
            if (mins < 0) mins += 24 * 60;
            return Math.round(mins / 60);
        };

        const getDurationPercent = (start, end) => {
            const hours = calculateDuration(start, end);
            return Math.min(100, (hours / 12) * 100);
        };

        const addMinutes = (time, mins) => {
            if (!time) return '';
            const [h, m] = time.split(':').map(Number);
            const totalMins = h * 60 + m + mins;
            const newH = Math.floor(totalMins / 60) % 24;
            const newM = totalMins % 60;
            return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
        };

        const subtractMinutes = (time, mins) => {
            return addMinutes(time, -mins);
        };

        // Shift Dialog
        const showShiftDialog = ref(false);
        const editingShift = ref(null);
        const showColorPicker = ref(false);

        const defaultClockIn = () => ({ noEarlierThan: 60, allowedDelay: 15, noLaterThan: 120 });
        const defaultClockOut = () => ({ noEarlierThan: 30, allowedShortage: 0, noLaterThan: 60 });

        // Helper to create Date from time string
        const timeStringToDate = (timeStr) => {
            if (!timeStr) return new Date();
            const [h, m] = timeStr.split(':').map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        };

        // Helper to get time string from Date
        const dateToTimeString = (date) => {
            if (!date) return '00:00';
            const h = date.getHours().toString().padStart(2, '0');
            const m = date.getMinutes().toString().padStart(2, '0');
            return `${h}:${m}`;
        };

        // Format Date to 12h format
        const formatTimeFromDate = (date) => {
            if (!date) return '';
            const h = date.getHours();
            const m = date.getMinutes();
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
        };

        // Calculate duration from Date objects
        const calculateDurationFromDates = (start, end) => {
            if (!start || !end) return 0;
            let mins = (end.getHours() * 60 + end.getMinutes()) - (start.getHours() * 60 + start.getMinutes());
            if (mins < 0) mins += 24 * 60;
            return Math.round(mins / 60);
        };

        // Add minutes to Date
        const addMinutesToDate = (date, mins) => {
            if (!date) return new Date();
            const d = new Date(date);
            d.setMinutes(d.getMinutes() + mins);
            return d;
        };

        const shiftForm = ref({
            name: '',
            shiftType: 'normal',
            startTimeDate: timeStringToDate('08:00'),
            endTimeDate: timeStringToDate('17:00'),
            startTime: '08:00',
            endTime: '17:00',
            color: '#f59e0b',
            clockIn: defaultClockIn(),
            clockOut: defaultClockOut(),
            periods: [],
            requiredHours: 8,
            validFromDate: timeStringToDate('07:00'),
            validToDate: timeStringToDate('22:00'),
            validFrom: '07:00',
            validTo: '22:00',
            active: true
        });

        const shiftColors = ['#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#ef4444', '#84cc16'];

        // Computed duration
        const computedDuration = computed(() => {
            return calculateDurationFromDates(shiftForm.value.startTimeDate, shiftForm.value.endTimeDate);
        });

        // Computed window strings for Normal shift (using Date objects)
        const computedClockInWindow = computed(() => {
            const baseTime = shiftForm.value.startTimeDate;
            if (!baseTime) return '';
            const start = addMinutesToDate(baseTime, -shiftForm.value.clockIn.noEarlierThan);
            const end = addMinutesToDate(baseTime, shiftForm.value.clockIn.noLaterThan);
            return `${formatTimeFromDate(start)} to ${formatTimeFromDate(end)}`;
        });

        const computedClockInLate = computed(() => {
            const baseTime = shiftForm.value.startTimeDate;
            if (!baseTime) return '';
            const late = addMinutesToDate(baseTime, shiftForm.value.clockIn.allowedDelay);
            return formatTimeFromDate(late);
        });

        const computedClockOutWindow = computed(() => {
            const baseTime = shiftForm.value.endTimeDate;
            if (!baseTime) return '';
            const start = addMinutesToDate(baseTime, -shiftForm.value.clockOut.noEarlierThan);
            const end = addMinutesToDate(baseTime, shiftForm.value.clockOut.noLaterThan);
            return `${formatTimeFromDate(start)} to ${formatTimeFromDate(end)}`;
        });

        const computedClockOutEarly = computed(() => {
            const baseTime = shiftForm.value.endTimeDate;
            if (!baseTime) return '';
            const early = addMinutesToDate(baseTime, -shiftForm.value.clockOut.allowedShortage);
            return formatTimeFromDate(early);
        });

        // Period computed helpers for Date objects
        const computePeriodClockInWindowDate = (period) => {
            if (!period.startTimeDate) return '';
            const start = addMinutesToDate(period.startTimeDate, -period.clockIn.noEarlierThan);
            const end = addMinutesToDate(period.startTimeDate, period.clockIn.noLaterThan);
            return `${formatTimeFromDate(start)} to ${formatTimeFromDate(end)}`;
        };

        const computePeriodClockInLateDate = (period) => {
            if (!period.startTimeDate) return '';
            return formatTimeFromDate(addMinutesToDate(period.startTimeDate, period.clockIn.allowedDelay));
        };

        const computePeriodClockOutWindowDate = (period) => {
            if (!period.endTimeDate) return '';
            const start = addMinutesToDate(period.endTimeDate, -period.clockOut.noEarlierThan);
            const end = addMinutesToDate(period.endTimeDate, period.clockOut.noLaterThan);
            return `${formatTimeFromDate(start)} to ${formatTimeFromDate(end)}`;
        };

        const computePeriodClockOutEarlyDate = (period) => {
            if (!period.endTimeDate) return '';
            return formatTimeFromDate(addMinutesToDate(period.endTimeDate, -period.clockOut.allowedShortage));
        };

        // Period computed helpers (legacy for string times)
        const computePeriodClockInWindow = (period) => {
            const start = subtractMinutes(period.startTime, period.clockIn.noEarlierThan);
            const end = addMinutes(period.startTime, period.clockIn.noLaterThan);
            return `${formatTime12(start)} to ${formatTime12(end)}`;
        };

        const computePeriodClockInLate = (period) => {
            return formatTime12(addMinutes(period.startTime, period.clockIn.allowedDelay));
        };

        const computePeriodClockOutWindow = (period) => {
            const start = subtractMinutes(period.endTime, period.clockOut.noEarlierThan);
            const end = addMinutes(period.endTime, period.clockOut.noLaterThan);
            return `${formatTime12(start)} to ${formatTime12(end)}`;
        };

        const computePeriodClockOutEarly = (period) => {
            return formatTime12(subtractMinutes(period.endTime, period.clockOut.allowedShortage));
        };

        const openShiftDialog = (shift = null) => {
            if (shift) {
                editingShift.value = shift;
                const parsed = JSON.parse(JSON.stringify(shift));
                // Convert time strings to Date objects
                parsed.startTimeDate = timeStringToDate(parsed.startTime || '08:00');
                parsed.endTimeDate = timeStringToDate(parsed.endTime || '17:00');
                parsed.validFromDate = timeStringToDate(parsed.validFrom || '07:00');
                parsed.validToDate = timeStringToDate(parsed.validTo || '22:00');
                if (parsed.periods) {
                    parsed.periods = parsed.periods.map(p => ({
                        ...p,
                        startTimeDate: timeStringToDate(p.startTime || '08:00'),
                        endTimeDate: timeStringToDate(p.endTime || '17:00'),
                        clockIn: p.clockIn || defaultClockIn(),
                        clockOut: p.clockOut || defaultClockOut()
                    }));
                }
                if (!parsed.clockIn) parsed.clockIn = defaultClockIn();
                if (!parsed.clockOut) parsed.clockOut = defaultClockOut();
                shiftForm.value = parsed;
            } else {
                editingShift.value = null;
                shiftForm.value = {
                    name: '',
                    shiftType: shiftTypeFilter.value,
                    startTimeDate: timeStringToDate('08:00'),
                    endTimeDate: timeStringToDate('17:00'),
                    startTime: '08:00',
                    endTime: '17:00',
                    color: '#f59e0b',
                    clockIn: defaultClockIn(),
                    clockOut: defaultClockOut(),
                    periods: shiftTypeFilter.value === 'template' ? [
                        {
                            startTimeDate: timeStringToDate('08:00'),
                            endTimeDate: timeStringToDate('12:00'),
                            startTime: '08:00',
                            endTime: '12:00',
                            clockIn: defaultClockIn(),
                            clockOut: defaultClockOut()
                        }
                    ] : [],
                    requiredHours: 8,
                    validFromDate: timeStringToDate('07:00'),
                    validToDate: timeStringToDate('22:00'),
                    validFrom: '07:00',
                    validTo: '22:00',
                    active: true
                };
            }
            showShiftDialog.value = true;
        };

        const editShift = (shift) => {
            openShiftDialog(shift);
        };

        const addPeriod = () => {
            shiftForm.value.periods.push({
                startTimeDate: timeStringToDate('14:00'),
                endTimeDate: timeStringToDate('18:00'),
                startTime: '14:00',
                endTime: '18:00',
                clockIn: defaultClockIn(),
                clockOut: defaultClockOut()
            });
        };

        const removePeriod = (index) => {
            shiftForm.value.periods.splice(index, 1);
        };

        const saveShift = () => {
            if (editingShift.value) {
                const index = allShifts.value.findIndex(s => s.id === editingShift.value.id);
                if (index !== -1) {
                    allShifts.value[index] = { ...shiftForm.value, id: editingShift.value.id };
                }
            } else {
                const newId = Math.max(...allShifts.value.map(s => s.id), 0) + 1;
                allShifts.value.push({ ...shiftForm.value, id: newId });
            }
            showShiftDialog.value = false;
        };

        const deleteShift = (shift) => {
            const index = allShifts.value.findIndex(s => s.id === shift.id);
            if (index !== -1) {
                allShifts.value.splice(index, 1);
            }
        };

        // Shift Scheduling State
        const scheduleSearch = ref('');
        const pendingChanges = ref([]);
        const showShiftMenu = ref(false);
        const showTemplateSelector = ref(false);
        const shiftMenuPosition = ref({ top: '0px', left: '0px' });
        const templateSearch = ref('');
        const selectedTemplateId = ref(null);
        const currentScheduleTarget = ref({ schedule: null, day: null });
        const scheduleAssignments = ref({});

        // Weekly Shift Summary State
        const reviewerTab = ref('week');
        const reviewerSearch = ref('');

        // Week label short format
        const weekLabelShort = computed(() => {
            const start = new Date(currentWeekStart.value);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}`;
        });

        // Summary Stats
        const summaryStats = computed(() => {
            const totalEmployees = employeeSchedules.value.length;
            const totalDays = 7;
            const totalSlots = totalEmployees * totalDays;
            const assignedSlots = Object.keys(scheduleAssignments.value).length + 34; // Mock base assignments
            const unassigned = Math.max(0, totalSlots - assignedSlots);
            const completionRate = Math.round((assignedSlots / totalSlots) * 100);

            return {
                totalHours: 336,
                scheduledShifts: 42,
                staffOnDuty: totalEmployees,
                unassigned: 8,
                completionRate: 84,
                peakDay: 'Mon',
                peakHours: 56,
                avgLoad: '42.0'
            };
        });

        // Hourly Distribution for chart
        const hourlyDistribution = computed(() => {
            return [
                { day: 'Mon', hours: 56, isHighest: true },
                { day: 'Tue', hours: 42, isHighest: false },
                { day: 'Wed', hours: 38, isHighest: false },
                { day: 'Thu', hours: 45, isHighest: false },
                { day: 'Fri', hours: 48, isHighest: false },
                { day: 'Sat', hours: 28, isHighest: false },
                { day: 'Sun', hours: 20, isHighest: false }
            ];
        });

        // Heatmap hours labels
        const heatmapHours = ['12A', '1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A',
            '12P', '1P', '2P', '3P', '4P', '5P', '6P', '7P', '8P', '9P', '10P', '11P'];

        // Heatmap data
        const heatmapData = computed(() => {
            return [
                { day: 'MON', hours: [0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 6, 6, 4, 6, 6, 5, 5, 4, 3, 2, 0, 0, 0, 0], total: 56 },
                { day: 'TUE', hours: [0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 5, 3, 5, 5, 4, 4, 3, 0, 0, 0, 0, 0, 0], total: 42 },
                { day: 'WED', hours: [0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 5, 5, 3, 5, 5, 4, 4, 1, 0, 0, 0, 0, 0, 0], total: 38 },
                { day: 'THU', hours: [0, 0, 0, 0, 0, 0, 0, 1, 3, 5, 6, 5, 4, 5, 5, 4, 4, 2, 1, 0, 0, 0, 0, 0], total: 45 },
                { day: 'FRI', hours: [0, 0, 0, 0, 0, 0, 0, 1, 4, 5, 6, 6, 4, 5, 5, 5, 4, 2, 1, 0, 0, 0, 0, 0], total: 48 },
                { day: 'SAT', hours: [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 4, 3, 4, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0], total: 28 },
                { day: 'SUN', hours: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0], total: 20 }
            ];
        });

        // Heatmap stats
        const heatmapStats = computed(() => {
            return {
                busiestHour: '10A',
                quietestHour: '12A',
                scheduleLoad: '184 hrs',
                flexibleLoad: '62 hrs'
            };
        });

        // Filtered reviewer schedules
        const filteredReviewerSchedules = computed(() => {
            if (!reviewerSearch.value) return employeeSchedules.value;
            const query = reviewerSearch.value.toLowerCase();
            return employeeSchedules.value.filter(s =>
                s.employeeName.toLowerCase().includes(query) ||
                s.scheduleType.toLowerCase().includes(query)
            );
        });

        // Pre-generated mock reviewer shifts (consistent data)
        const reviewerShiftsCache = ref({});

        // Initialize mock reviewer shifts
        const initReviewerShifts = () => {
            const mockShiftTypes = [
                { name: 'MORNING', time: '08:00-17:00' },
                { name: 'MID-DAY', time: '10:00-17:00' },
                { name: 'EVENING', time: '14:00-22:00' },
                { name: 'FLEX', time: '09:00-17:00' },
                { name: 'NIGHT', time: '22:00-06:00' }
            ];
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const cache = {};

            employeeSchedules.value.forEach((schedule, sIndex) => {
                days.forEach((day, dIndex) => {
                    const key = `${schedule.id}-${day}`;
                    // Deterministic "random" based on indices
                    const hasShift = (sIndex + dIndex) % 3 !== 0; // ~67% have shifts
                    if (hasShift) {
                        const shiftIndex = (sIndex + dIndex) % mockShiftTypes.length;
                        cache[key] = mockShiftTypes[shiftIndex];
                    } else {
                        cache[key] = null;
                    }
                });
            });

            reviewerShiftsCache.value = cache;
        };

        // Initialize on component mount
        initReviewerShifts();

        // Get reviewer shift for display
        const getReviewerShift = (schedule, dayName) => {
            const key = `${schedule.id}-${dayName}`;

            // Check real assignments first
            const assignment = scheduleAssignments.value[key];
            if (assignment && assignment.type === 'shift') {
                return {
                    name: assignment.shiftName,
                    time: `${assignment.startTime} - ${assignment.endTime}`
                };
            }

            // Return cached mock data
            return reviewerShiftsCache.value[key] || null;
        };

        // Get shift block class
        const getShiftBlockClass = (schedule, dayName, index) => {
            const shift = getReviewerShift(schedule, dayName);
            if (!shift) return 'empty';
            // Map shift name to class
            const name = shift.name.toLowerCase();
            if (name.includes('morning')) return 'morning';
            if (name.includes('mid')) return 'midday';
            if (name.includes('evening')) return 'evening';
            if (name.includes('flex')) return 'flex';
            if (name.includes('night')) return 'night';
            return 'morning';
        };

        // Get shift block style
        const getShiftBlockStyle = (schedule, dayName) => {
            return {};
        };

        // Get employee coverage percentage
        const getEmployeeCoverage = (schedule) => {
            // Deterministic coverage based on schedule id
            const coverages = [84, 71, 94, 66, 100, 78, 89, 92];
            const index = (schedule.id || 0) % coverages.length;
            return coverages[index];
        };

        // Get heatmap cell class
        const getHeatmapCellClass = (count) => {
            if (count === 0) return 'density-0';
            if (count <= 2) return 'density-1';
            if (count <= 4) return 'density-2';
            if (count <= 5) return 'density-3';
            return 'density-4';
        };

        // =============================================
        // ATTENDANCE TAB - NEW REVAMPED
        // =============================================

        const attendancePage = ref(1);
        const attendancePerPage = 10;

        // Attendance Stats - computed from logs
        const attendanceStats = computed(() => {
            const logs = attendanceLogs.value;
            const totalStaff = logs.length;
            const presentNow = logs.filter(l => l.status === 'PRESENT').length;
            const lateIn = logs.filter(l => l.violation === 'LATE IN' || l.violation === 'LATE IN - EARLY OUT').length;
            const earlyOut = logs.filter(l => l.violation === 'EARLY OUT' || l.violation === 'LATE IN - EARLY OUT').length;
            const missingLogs = logs.filter(l => l.punchFlag === 'MISSING CLOCK-IN' || l.punchFlag === 'MISSING CLOCK-OUT').length;
            const annualLeave = logs.filter(l => l.dayContext === 'Annual Leave').length;
            const workFromHome = logs.filter(l => l.dayContext === 'Work From Home').length;
            const businessTrip = logs.filter(l => l.dayContext === 'Business Trip').length;
            const absent = logs.filter(l => l.status === 'ABSENT').length;
            const outsideWindow = logs.filter(l => l.violation === 'OUTSIDE WINDOW').length;

            return {
                totalStaff: String(totalStaff).padStart(2, '0'),
                presentNow: String(presentNow).padStart(2, '0'),
                lateIn: String(lateIn).padStart(2, '0'),
                earlyOut: String(earlyOut).padStart(2, '0'),
                missingLogs: String(missingLogs).padStart(2, '0'),
                annualLeave: String(annualLeave).padStart(2, '0'),
                workFromHome: String(workFromHome).padStart(2, '0'),
                businessTrip: String(businessTrip).padStart(2, '0'),
                absent: String(absent).padStart(2, '0'),
                outsideWindow: String(outsideWindow).padStart(2, '0')
            };
        });

        // Enhanced attendance logs with specific examples
        const attendanceLogs = computed(() => {
            // Specific examples from screenshot
            return [
                {
                    id: 1, employeeId: 1, name: 'Saeed',
                    department: 'IT', deptColor: '#ef4444', empId: '#111',
                    role: 'FIXED DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: '8:00 am', actualCheckOut: null,
                    status: 'PRESENT', punchFlag: 'MISSING CLOCK-OUT',
                    duration: null, violation: null
                },
                {
                    id: 2, employeeId: 2, name: 'Ahmed',
                    department: 'PRODUCT', deptColor: '#22c55e', empId: '#555',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Fixable', shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: '7:55 pm', actualCheckOut: '9:55 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '2 hours', violation: 'LESS EFFORT'
                },
                {
                    id: 3, employeeId: 3, name: 'Majed',
                    department: 'OPERATION', deptColor: '#f97316', empId: '#472',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: '08:00 AM', scheduledEnd: '05:00 PM',
                    actualCheckIn: '8:30 am', actualCheckOut: '5:00 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '7h 30m', violation: 'LATE IN'
                },
                {
                    id: 4, employeeId: 4, name: 'Faisal',
                    department: 'TECHTIC', deptColor: '#3b82f6', empId: '#888',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: '8:00 am', actualCheckOut: '3 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '7 hours', violation: 'EARLY OUT'
                },
                {
                    id: 5, employeeId: 5, name: 'Ali',
                    department: 'TECHTIC', deptColor: '#3b82f6', empId: '#884',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: '9:00 am', actualCheckOut: '3 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '6 hours', violation: 'LATE IN - EARLY OUT'
                },
                {
                    id: 6, employeeId: 6, name: 'Nurhan',
                    department: 'VISA', deptColor: '#8b5cf6', empId: '#852',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: '4 pm',
                    status: 'PRESENT', punchFlag: 'MISSING CLOCK-IN',
                    duration: null, violation: null
                },
                {
                    id: 7, employeeId: 7, name: 'Ahmed',
                    department: 'STUDYABROAD', deptColor: '#06b6d4', empId: '#412',
                    role: 'VARIABLE DAYS', dayContext: 'Annual Leave',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 8, employeeId: 8, name: 'Akmal',
                    department: 'FINANCE', deptColor: '#22c55e', empId: '#321',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Template', shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: 'NO SHIFT ASSIGNED', punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 9, employeeId: 9, name: 'Sami',
                    department: 'PACKAGE', deptColor: '#14b8a6', empId: '#648',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Fixable', shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: 'ABSENT', punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 10, employeeId: 10, name: 'Majeed',
                    department: 'VISAS', deptColor: '#f59e0b', empId: '#257',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: 'OUTSIDE WINDOW'
                },
                {
                    id: 11, employeeId: 11, name: 'Mohammed Aldais',
                    department: 'HOTEL', deptColor: '#3b82f6', empId: '#101',
                    role: 'MANAGER CLIENTS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: 'Normal',
                    scheduledStart: '08:00 AM', scheduledEnd: '05:00 PM',
                    actualCheckIn: '8:00 am', actualCheckOut: '4:59 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '7 hours 59 min', violation: 'NORMAL'
                },
                {
                    id: 12, employeeId: 12, name: 'Saleh Alrbi',
                    department: 'FLIGHT', deptColor: '#8b5cf6', empId: '#101',
                    role: 'SUPERVISOR', dayContext: 'Weekend Off',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 13, employeeId: 13, name: 'Sarah Parker',
                    department: 'HR', deptColor: '#ec4899', empId: '#203',
                    role: 'COORDINATOR', dayContext: 'Work From Home',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 14, employeeId: 14, name: 'Fahad',
                    department: 'FINANCE', deptColor: '#22c55e', empId: '#405',
                    role: 'EXECUTIVE', dayContext: 'Business Trip',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                }
            ];
        });

        // Filtered attendance logs
        const filteredAttendanceLogs = computed(() => {
            if (!searchAttendance.value) return attendanceLogs.value;
            const query = searchAttendance.value.toLowerCase();
            return attendanceLogs.value.filter(log => {
                const empName = getEmployeeName(log.employeeId).toLowerCase();
                return empName.includes(query) ||
                    (log.department && log.department.toLowerCase().includes(query)) ||
                    (log.dayContext && log.dayContext.toLowerCase().includes(query));
            });
        });

        // Total pages
        const totalAttendancePages = computed(() => {
            return Math.ceil(filteredAttendanceLogs.value.length / attendancePerPage);
        });

        // Paginated attendance
        const paginatedAttendance = computed(() => {
            const start = (attendancePage.value - 1) * attendancePerPage;
            return filteredAttendanceLogs.value.slice(start, start + attendancePerPage);
        });

        // Day context helpers
        const getDayContextClass = (context) => {
            if (!context) return '';
            const map = {
                'Regular Workday': 'workday',
                'Weekend Off': 'weekend',
                'Business Trip': 'business',
                'Work From Home': 'wfh',
                'Annual Leave': 'leave'
            };
            return map[context] || '';
        };

        const getDayContextIcon = (context) => {
            if (!context) return 'pi pi-sun';
            const map = {
                'Regular Workday': 'pi pi-sun',
                'Weekend Off': 'pi pi-moon',
                'Business Trip': 'pi pi-briefcase',
                'Work From Home': 'pi pi-home',
                'Annual Leave': 'pi pi-calendar'
            };
            return map[context] || 'pi pi-sun';
        };

        // Status badge class
        const getStatusBadgeClass = (status) => {
            if (!status) return '';
            const map = {
                'PRESENT': 'present',
                'ABSENT': 'absent',
                'NO SHIFT ASSIGNED': 'no-shift'
            };
            return map[status] || '';
        };

        // Punch flag class
        const getPunchFlagClass = (flag) => {
            if (!flag) return '';
            const map = {
                'COMPLETE': 'complete',
                'MISSING CLOCK-IN': 'missing',
                'MISSING CLOCK-OUT': 'missing'
            };
            return map[flag] || '';
        };

        // Violation class
        const getViolationClass = (violation) => {
            if (!violation) return '';
            const map = {
                'NORMAL': 'normal',
                'LESS EFFORT': 'less-effort',
                'LATE IN': 'late',
                'EARLY OUT': 'early',
                'LATE IN - EARLY OUT': 'late-early',
                'OUTSIDE WINDOW': 'outside'
            };
            return map[violation] || '';
        };

        // Formatted week label
        const weekLabelFormatted = computed(() => {
            const start = new Date(currentWeekStart.value);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            return `${months[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()} - ${months[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
        });

        // Filtered employee schedules by search
        const filteredEmployeeSchedules = computed(() => {
            if (!scheduleSearch.value) return employeeSchedules.value;
            const query = scheduleSearch.value.toLowerCase();
            return employeeSchedules.value.filter(s =>
                s.employeeName.toLowerCase().includes(query) ||
                s.scheduleType.toLowerCase().includes(query)
            );
        });

        // Filtered templates for template selector
        const filteredTemplates = computed(() => {
            if (!templateSearch.value) return allShifts.value.filter(s => s.active);
            const query = templateSearch.value.toLowerCase();
            return allShifts.value.filter(s => s.active && s.name.toLowerCase().includes(query));
        });

        // Get assignment for a specific cell
        const getAssignment = (schedule, dayName) => {
            const key = `${schedule.id}-${dayName}`;
            return scheduleAssignments.value[key] || null;
        };

        // Check if cell has assignment
        const hasAssignment = (schedule, dayName) => {
            return !!getAssignment(schedule, dayName);
        };

        // Open shift menu
        const openShiftMenu = (event, schedule, day) => {
            const rect = event.target.getBoundingClientRect();
            shiftMenuPosition.value = {
                top: `${rect.bottom + 5}px`,
                left: `${rect.left}px`
            };
            currentScheduleTarget.value = { schedule, day };
            showShiftMenu.value = true;
            showTemplateSelector.value = false;
        };

        // Open template selector
        const openTemplateSelector = () => {
            showShiftMenu.value = false;
            showTemplateSelector.value = true;
            templateSearch.value = '';
        };

        // Add time off
        const addTimeOff = () => {
            const { schedule, day } = currentScheduleTarget.value;
            const key = `${schedule.id}-${day.dayName}`;
            scheduleAssignments.value[key] = { type: 'timeoff' };
            pendingChanges.value.push({ type: 'timeoff', schedule, day });
            closeAllMenus();
        };

        // Select template and assign
        const selectTemplate = (shift) => {
            const { schedule, day } = currentScheduleTarget.value;
            const key = `${schedule.id}-${day.dayName}`;
            scheduleAssignments.value[key] = {
                type: 'shift',
                shiftId: shift.id,
                shiftName: shift.name.toUpperCase(),
                startTime: formatTime12(shift.startTime || (shift.periods && shift.periods[0]?.startTime) || '08:00'),
                endTime: formatTime12(shift.endTime || (shift.periods && shift.periods[0]?.endTime) || '17:00'),
                color: shift.color
            };
            pendingChanges.value.push({ type: 'shift', schedule, day, shift });
            closeAllMenus();
        };

        // Remove assignment
        const removeAssignment = (schedule, dayName) => {
            const key = `${schedule.id}-${dayName}`;
            delete scheduleAssignments.value[key];
            // Remove from pending changes
            pendingChanges.value = pendingChanges.value.filter(
                c => !(c.schedule.id === schedule.id && c.day.dayName === dayName)
            );
        };

        // Close all menus
        const closeAllMenus = () => {
            showShiftMenu.value = false;
            showTemplateSelector.value = false;
            selectedTemplateId.value = null;
        };

        // Get shift time range
        const getShiftTimeRange = (shift) => {
            if (shift.shiftType === 'flexible') {
                return `${formatTime12(shift.validFrom)} - ${formatTime12(shift.validTo)}`;
            }
            if (shift.periods && shift.periods.length > 0) {
                return `${formatTime12(shift.periods[0].startTime)} - ${formatTime12(shift.periods[0].endTime)}`;
            }
            return `${formatTime12(shift.startTime)} - ${formatTime12(shift.endTime)}`;
        };

        // Get shift duration
        const getShiftDuration = (shift) => {
            if (shift.shiftType === 'flexible') return shift.requiredHours;
            if (shift.periods && shift.periods.length > 0) {
                return calculateDuration(shift.periods[0].startTime, shift.periods[0].endTime);
            }
            return calculateDuration(shift.startTime, shift.endTime);
        };

        // Toggle shift rules display
        const toggleShiftRules = (shiftId) => {
            // Can be implemented to show rules in a tooltip or expanded view
        };

        // Scheduler actions
        const draftAndReview = () => {
            console.log('Draft & Review');
        };

        const publishLater = () => {
            console.log('Publish Later');
        };

        const publishAndLaunch = () => {
            if (pendingChanges.value.length > 0) {
                // Apply all pending changes
                pendingChanges.value = [];
                alert('Changes published successfully!');
            }
        };

        // Close menus when clicking outside
        if (typeof document !== 'undefined') {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.add-shift-btn') &&
                    !e.target.closest('.shift-menu-popup') &&
                    !e.target.closest('.template-selector-popup')) {
                    closeAllMenus();
                }
            });
        }

        // Assignment Dialog (legacy)
        const showAssignDialog = ref(false);
        const assignForm = ref({
            employee: null,
            dayName: '',
            shiftId: null,
            isWorking: true,
            dayType: 'weekend'
        });

        const openAssignDialog = (schedule, day) => {
            const daySchedule = schedule.weekSchedule[day.dayName];
            assignForm.value = {
                employee: schedule,
                dayName: day.dayName,
                shiftId: daySchedule?.shiftId || null,
                isWorking: daySchedule?.isWorking || false,
                dayType: daySchedule?.dayType || 'weekend'
            };
            showAssignDialog.value = true;
        };

        const saveAssignment = () => {
            const schedule = employeeSchedules.value.find(s => s.id === assignForm.value.employee.id);
            if (schedule) {
                schedule.weekSchedule[assignForm.value.dayName] = {
                    shiftId: assignForm.value.isWorking ? assignForm.value.shiftId : null,
                    isWorking: assignForm.value.isWorking,
                    dayType: assignForm.value.isWorking ? null : assignForm.value.dayType
                };
            }
            showAssignDialog.value = false;
        };

        return {
            activeTab,
            shiftTypeFilter,
            allShifts,
            filteredShifts,
            employeeSchedules,
            attendanceRecords,
            employees,
            weekDays,
            weekLabel,
            weekLabelFormatted,
            previousWeek,
            nextWeek,
            goToToday,
            isToday,
            isWeekend,
            presentToday,
            lateToday,
            absentToday,
            selectedDate,
            searchAttendance,
            filterAttendanceStatus,
            filterShift,
            attendanceStatuses,
            shiftSelectOptions,
            filteredAttendance,
            getEmployeeAvatar,
            getEmployeeName,
            getShiftName,
            getShiftColor,
            getShiftTime,
            getShiftCellClass,
            getCheckInClass,
            getAttendanceStatusClass,
            getShiftTypeLabel,
            formatTime12,
            formatTimeFromDate,
            calculateDuration,
            calculateDurationFromDates,
            getDurationPercent,
            addMinutes,
            subtractMinutes,
            showShiftDialog,
            editingShift,
            showColorPicker,
            shiftForm,
            shiftColors,
            computedDuration,
            computedClockInWindow,
            computedClockInLate,
            computedClockOutWindow,
            computedClockOutEarly,
            computePeriodClockInWindow,
            computePeriodClockInLate,
            computePeriodClockOutWindow,
            computePeriodClockOutEarly,
            computePeriodClockInWindowDate,
            computePeriodClockInLateDate,
            computePeriodClockOutWindowDate,
            computePeriodClockOutEarlyDate,
            openShiftDialog,
            editShift,
            addPeriod,
            removePeriod,
            saveShift,
            deleteShift,
            // Shift Scheduling
            scheduleSearch,
            pendingChanges,
            showShiftMenu,
            showTemplateSelector,
            shiftMenuPosition,
            templateSearch,
            selectedTemplateId,
            currentScheduleTarget,
            scheduleAssignments,
            filteredEmployeeSchedules,
            filteredTemplates,
            getAssignment,
            hasAssignment,
            openShiftMenu,
            openTemplateSelector,
            addTimeOff,
            selectTemplate,
            removeAssignment,
            closeAllMenus,
            getShiftTimeRange,
            getShiftDuration,
            toggleShiftRules,
            draftAndReview,
            publishLater,
            publishAndLaunch,
            // Weekly Shift Summary
            reviewerTab,
            reviewerSearch,
            weekLabelShort,
            summaryStats,
            hourlyDistribution,
            heatmapHours,
            heatmapData,
            heatmapStats,
            filteredReviewerSchedules,
            getReviewerShift,
            getShiftBlockClass,
            getShiftBlockStyle,
            getEmployeeCoverage,
            getHeatmapCellClass,
            // Attendance Tab (Revamped)
            attendancePage,
            attendanceStats,
            attendanceLogs,
            filteredAttendanceLogs,
            totalAttendancePages,
            paginatedAttendance,
            getDayContextClass,
            getDayContextIcon,
            getStatusBadgeClass,
            getPunchFlagClass,
            getViolationClass,
            // Legacy
            showAssignDialog,
            assignForm,
            openAssignDialog,
            saveAssignment
        };
    }
};

window.ShiftAttendanceComponent = ShiftAttendanceComponent;
