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
                                                <span class="preset-periods">{{ (shift.periods && shift.periods.length > 0) ? shift.periods.length : 1 }} Period{{ ((shift.periods?.length || 1) > 1) ? 's' : '' }}</span>
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
                                        <div v-for="(period, pIndex) in ((shift.periods && shift.periods.length > 0) ? shift.periods : [{ startTime: shift.startTime, endTime: shift.endTime, clockIn: shift.clockIn, clockOut: shift.clockOut }])" 
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
                                    <div class="dropdown-btn-wrapper">
                                        <button class="scheduler-action-btn" @click="showCopyWeekMenu = !showCopyWeekMenu; showCustomWeekPicker = false">
                                            <i class="pi pi-copy"></i>
                                            Copy Week
                                            <i class="pi pi-chevron-down dropdown-arrow"></i>
                                        </button>
                                        <div v-if="showCopyWeekMenu" class="dropdown-menu">
                                            <div class="dropdown-item" @click="copyLastWeek">
                                                <i class="pi pi-history"></i>
                                                Last Week
                                            </div>
                                            <div class="dropdown-item has-submenu" @click.stop="showCustomWeekPicker = !showCustomWeekPicker">
                                                <i class="pi pi-calendar"></i>
                                                Custom Week
                                                <i class="pi pi-chevron-right submenu-arrow"></i>
                                            </div>
                                            <!-- Custom Week Picker Submenu -->
                                            <div v-if="showCustomWeekPicker" class="week-picker-submenu">
                                                <div class="week-picker-header">Select Week</div>
                                                <div class="week-picker-list">
                                                    <div v-for="week in availableWeeks" :key="week.id" 
                                                         class="week-picker-item" 
                                                         @click="selectCustomWeek(week)">
                                                        <span class="week-range">{{ week.range }}</span>
                                                        <span class="week-label">{{ week.label }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="scheduler-action-btn" @click="showHistoryDrawer = true">
                                        <i class="pi pi-history"></i>
                                        History
                                    </button>
                                    <button class="scheduler-action-btn outlined" :disabled="Object.keys(scheduleAssignments).length === 0">
                                        <i class="pi pi-save"></i>
                                        Save as Draft
                                    </button>
                                    <button class="scheduler-action-btn primary" :disabled="Object.keys(scheduleAssignments).length === 0">
                                        <i class="pi pi-send"></i>
                                        Publish Schedule
                                    </button>
                                </div>
                                <div class="scheduler-date-nav">
                                    <button class="nav-arrow" @click="previousWeek"><i class="pi pi-chevron-left"></i></button>
                                    <span class="date-range">{{ weekLabelFormatted }}</span>
                                    <button class="nav-arrow" @click="nextWeek"><i class="pi pi-chevron-right"></i></button>
                                </div>
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
                                            <th class="staff-col">TEAM MEMBER</th>
                                            <th v-for="day in weekDays" :key="day.date" class="day-col-new">
                                                <div class="day-header-new">
                                                    <span class="day-abbr">{{ day.dayName.substring(0, 3).toUpperCase() }}</span>
                                                    <span class="day-num">{{ day.dateLabel }}</span>
                                                </div>
                                            </th>
                                            <th class="total-col">TOTAL<br>Hrs</th>
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
                                                        <div v-if="getAssignment(schedule, day.dayName).type === 'shift'" class="assigned-shift-card">
                                                            <button class="remove-assignment-btn" @click.stop="removeAssignment(schedule, day.dayName)" title="Remove">
                                                                <i class="pi pi-times"></i>
                                                            </button>
                                                            <div class="shift-card-header">
                                                                <span class="shift-indicator" :style="{ background: getAssignment(schedule, day.dayName).color || '#f59e0b' }"></span>
                                                                <span class="shift-name-assigned">{{ getAssignment(schedule, day.dayName).shiftName }}</span>
                                                            </div>
                                                            <div class="shift-time-display">{{ getAssignment(schedule, day.dayName).startTime?.replace(' AM', '').replace(' PM', '') || '08:00' }}</div>
                                                        </div>
                                                        <div v-else class="time-off-card">
                                                            <button class="remove-assignment-btn" @click.stop="removeAssignment(schedule, day.dayName)" title="Remove">
                                                                <i class="pi pi-times"></i>
                                                            </button>
                                                            <i class="pi pi-sun"></i>
                                                            <span>DAY OFF</span>
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
                                            <td class="total-col">{{ getEmployeeWeeklyHours(schedule) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Scheduler Footer Stats -->
                            <div class="scheduler-footer-stats">
                                <div class="footer-stat">
                                    <div class="footer-stat-icon orange">
                                        <i class="pi pi-clock"></i>
                                    </div>
                                    <div class="footer-stat-content">
                                        <span class="footer-stat-label">WEEKLY HOURS</span>
                                        <span class="footer-stat-value">{{ schedulerStats.weeklyHours }} <small>HRS</small></span>
                                    </div>
                                </div>
                                <div class="footer-stat">
                                    <div class="footer-stat-icon blue">
                                        <i class="pi pi-calendar"></i>
                                    </div>
                                    <div class="footer-stat-content">
                                        <span class="footer-stat-label">TOTAL SHIFTS</span>
                                        <span class="footer-stat-value">{{ schedulerStats.totalShifts }} <small>SLOTS</small></span>
                                    </div>
                                </div>
                                <div class="footer-stat">
                                    <div class="footer-stat-icon gray">
                                        <i class="pi pi-calendar-times"></i>
                                    </div>
                                    <div class="footer-stat-content">
                                        <span class="footer-stat-label">UNASSIGNED</span>
                                        <span class="footer-stat-value">{{ schedulerStats.unassigned }} <small>EMPTY</small></span>
                                    </div>
                                </div>
                            </div>

                            <!-- Popup Backdrop -->
                            <div v-if="showShiftMenu || showTemplateSelector" class="popup-backdrop" @click="closeAllMenus"></div>

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
                                                    {{ expandedShiftRules === shift.id ? 'Hide shift rules' : 'Show shift rules' }} 
                                                    <i :class="expandedShiftRules === shift.id ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></i>
                                                </span>
                                            </div>
                                            <!-- Shift Rules Tooltip -->
                                            <div v-if="expandedShiftRules === shift.id" class="shift-rules-tooltip">
                                                <div class="rules-section clock-in">
                                                    <div class="rules-section-header">
                                                        <i class="pi pi-sign-in"></i>
                                                        <span>Clock-In Rules</span>
                                                    </div>
                                                    <div class="rules-grid">
                                                        <div class="rule-item">
                                                            <span class="rule-label">Window Opens</span>
                                                            <span class="rule-value">{{ shift.clockIn?.noEarlierThan || 30 }} mins before</span>
                                                        </div>
                                                        <div class="rule-item">
                                                            <span class="rule-label">Allowed Delay</span>
                                                            <span class="rule-value">{{ shift.clockIn?.allowedDelay || 15 }} mins</span>
                                                        </div>
                                                        <div class="rule-item">
                                                            <span class="rule-label">Late Threshold</span>
                                                            <span class="rule-value">{{ shift.clockIn?.noLaterThan || 60 }} mins after</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="rules-section clock-out">
                                                    <div class="rules-section-header">
                                                        <i class="pi pi-sign-out"></i>
                                                        <span>Clock-Out Rules</span>
                                                    </div>
                                                    <div class="rules-grid">
                                                        <div class="rule-item">
                                                            <span class="rule-label">Early Exit</span>
                                                            <span class="rule-value">{{ shift.clockOut?.noEarlierThan || 30 }} mins before</span>
                                                        </div>
                                                        <div class="rule-item">
                                                            <span class="rule-label">Allowed Shortage</span>
                                                            <span class="rule-value">{{ shift.clockOut?.allowedShortage || 15 }} mins</span>
                                                        </div>
                                                        <div class="rule-item">
                                                            <span class="rule-label">Window Closes</span>
                                                            <span class="rule-value">{{ shift.clockOut?.noLaterThan || 120 }} mins after</span>
                                                        </div>
                                                    </div>
                                                </div>
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
                                </div>
                                
                                <!-- Filter Controls Bar -->
                                <div class="filter-controls-bar">
                                    <div class="filter-controls-left">
                                        <div class="filter-label">
                                            <i class="pi pi-filter"></i>
                                            <span>FILTER</span>
                                        </div>
                                        <p-select v-model="reviewerDepartment" :options="departmentOptions" optionLabel="name" optionValue="value" placeholder="Select Department" style="width: 200px;"></p-select>
                                        <span class="p-input-icon-left">
                                            <i class="pi pi-search"></i>
                                            <p-inputtext v-model="reviewerSearch" placeholder="Search staff members..." style="width: 220px;"></p-inputtext>
                                        </span>
                                    </div>
                                    <div class="filter-controls-right">
                                        <div class="week-selector-pill">
                                            <button class="week-nav-btn" @click="previousWeek"><i class="pi pi-chevron-left"></i></button>
                                            <span class="week-range-label">{{ weekLabelShort }}</span>
                                            <button class="week-nav-btn" @click="nextWeek"><i class="pi pi-chevron-right"></i></button>
                                        </div>
                                    </div>
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
                                    <div class="section-bar orange"></div>
                                    <h3>OPERATIONAL INSIGHTS</h3>
                                </div>
                                <div class="insights-grid">
                                    <!-- Stats Column -->
                                    <div class="insights-stats-card">
                                        <div class="insights-stat-row">
                                            <div class="insights-stat">
                                                <div class="insights-stat-label orange">TOTAL HOURS</div>
                                                <div class="insights-stat-value">{{ summaryStats.totalHours }}<span class="unit">HRS</span></div>
                                            </div>
                                            <div class="insights-stat">
                                                <div class="insights-stat-label">ACTIVE STAFF</div>
                                                <div class="insights-stat-value">{{ summaryStats.staffOnDuty }}<span class="unit">USERS</span></div>
                                            </div>
                                        </div>
                                        <div class="insights-stat-row">
                                            <div class="insights-stat">
                                                <div class="insights-stat-label">SHIFT COUNT</div>
                                                <div class="insights-stat-value">{{ summaryStats.scheduledShifts }}<span class="unit">SLOTS</span></div>
                                            </div>
                                            <div class="insights-stat coverage">
                                                <div class="insights-stat-label">COVERAGE</div>
                                                <div class="insights-stat-value">{{ summaryStats.completionRate }}%<i class="pi pi-arrow-up-right trend-up"></i></div>
                                            </div>
                                        </div>
                                        <div class="peak-load-card">
                                            <div class="peak-icon"><i class="pi pi-bolt"></i></div>
                                            <div class="peak-info">
                                                <div class="peak-label">PEAK LOAD DAY</div>
                                                <div class="peak-value">{{ summaryStats.peakDay }} ({{ summaryStats.peakHours }} hrs total)</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Chart Column -->
                                    <div class="insights-chart-card">
                                        <div class="chart-header">
                                            <div class="chart-title-left">
                                                <i class="pi pi-chart-bar chart-icon"></i>
                                                <div class="chart-title-text">
                                                    <span class="chart-title">Hourly Distribution</span>
                                                    <span class="chart-subtitle">AGGREGATED WORK HOURS ACROSS THE WEEK</span>
                                                </div>
                                            </div>
                                            <div class="average-load">
                                                <span class="avg-label">AVERAGE LOAD</span>
                                                <span class="avg-value">{{ summaryStats.avgLoad }}h / user</span>
                                            </div>
                                        </div>
                                        <div class="chart-content">
                                            <canvas ref="hourlyDistributionChart" style="max-height: 150px;"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Employee Density Heatmap -->
                            <div class="heatmap-section">
                                <div class="heatmap-header-new">
                                    <div class="heatmap-title-row">
                                        <div class="heatmap-title-left">
                                            <i class="pi pi-clock heatmap-icon"></i>
                                            <h3>Employee Density Heatmap (24h)</h3>
                                        </div>
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
                                    <p class="heatmap-subtitle">STAFF DISTRIBUTION ACROSS EVERY HOUR OF THE DAY</p>
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
                                        <div class="heatmap-stat-icon hotels"><i class="pi pi-building"></i></div>
                                        <div class="heatmap-stat-info">
                                            <div class="heatmap-stat-label">HOTELS LOAD</div>
                                            <div class="heatmap-stat-value">{{ heatmapStats.scheduleLoad }}</div>
                                        </div>
                                    </div>
                                    <div class="heatmap-stat">
                                        <div class="heatmap-stat-icon flights"><i class="pi pi-send"></i></div>
                                        <div class="heatmap-stat-info">
                                            <div class="heatmap-stat-label">FLIGHTS LOAD</div>
                                            <div class="heatmap-stat-value">{{ heatmapStats.flexibleLoad }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- Attendance Tab -->
                        <p-tabpanel value="attendance">
                            <!-- Week Filter Header -->
                            <div class="attendance-week-header">
                                <div class="week-filter-section">
                                    <button class="week-nav-btn" @click="prevAttendanceWeek">
                                        <i class="pi pi-chevron-left"></i>
                                    </button>
                                    <span class="week-label-display">WEEK OF {{ attendanceWeekLabel }}</span>
                                    <button class="week-nav-btn" @click="nextAttendanceWeek">
                                        <i class="pi pi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Daily Overview Stats -->
                            <div class="daily-overview-row">
                                <div v-for="day in weekDaysAttendance" :key="day.dayName" 
                                     class="daily-stat-card" :class="{ 'current-day': day.isToday }">
                                    <div class="daily-stat-header">
                                        <span class="day-name-att">{{ day.dayName }}</span>
                                        <span class="day-number-att" :class="{ 'today-badge': day.isToday }">{{ day.dayNumber }}</span>
                                    </div>
                                    <div class="daily-stat-bar" :style="{ background: day.isToday ? '#f97316' : '#22c55e' }"></div>
                                    <div class="daily-stat-duration">
                                        <span class="duration-label">DURATION</span>
                                        <span class="duration-value">{{ day.duration }}</span>
                                    </div>
                                    <div class="daily-stat-shifts">
                                        <span v-for="shift in day.shifts" :key="shift.name" 
                                              class="shift-tag" :style="{ background: shift.color }">
                                            {{ shift.name }}
                                        </span>
                                    </div>
                                </div>
                            </div>

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
                                                <th class="col-expand"></th>
                                                <th class="col-employee">EMPLOYEE</th>
                                                <th class="col-day">DAY</th>
                                                <th class="col-context">DAY CONTEXT</th>
                                                <th class="col-shift">SHIFT</th>
                                                <th class="col-in">IN</th>
                                                <th class="col-out">OUT</th>
                                                <th class="col-status">STATUS</th>
                                                <th class="col-punch">PUNCH FLAG</th>
                                                <th class="col-duration">DURATION</th>
                                                <th class="col-violation">VIOLATION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template v-for="employee in paginatedWeeklyAttendance" :key="employee.employeeId">
                                                <!-- Main row (first day - Monday) -->
                                                <tr class="main-row" :class="{ 'expanded': expandedEmployees.includes(employee.employeeId) }" @click="toggleEmployeeExpand(employee.employeeId)">
                                                    <td class="col-expand">
                                                        <button class="expand-btn">
                                                            <i :class="expandedEmployees.includes(employee.employeeId) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></i>
                                                        </button>
                                                    </td>
                                                    <td class="col-employee">
                                                        <div class="employee-cell">
                                                            <div class="emp-avatar-initial" :style="{ background: employee.deptColor || 'var(--primary-color)' }">
                                                                {{ (employee.name || 'U').charAt(0).toUpperCase() }}
                                                            </div>
                                                            <div class="emp-info">
                                                                <div class="emp-name">{{ employee.name }}</div>
                                                                <div class="emp-dept">
                                                                    <span class="dept-name" :style="{ color: employee.deptColor || 'var(--primary-color)' }">{{ employee.department }}</span>
                                                                    <span class="emp-id">{{ employee.empId }}</span>
                                                                </div>
                                                                <div class="emp-role">{{ employee.role }}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="col-day">
                                                        <span class="day-label-att" :class="{ 'today': employee.days[0].isToday }">{{ employee.days[0].dayName }}</span>
                                                    </td>
                                                    <td class="col-context">
                                                        <div class="context-cell" :class="getDayContextClass(employee.days[0].dayContext)">
                                                            <i :class="getDayContextIcon(employee.days[0].dayContext)"></i>
                                                            <span>{{ employee.days[0].dayContext || 'Regular Workday' }}</span>
                                                        </div>
                                                    </td>
                                                    <td class="col-shift">
                                                        <div v-if="employee.days[0].shiftType" class="shift-cell-content">
                                                            <span class="shift-type-label">{{ employee.days[0].shiftType }}</span>
                                                            <span v-if="employee.days[0].scheduledStart" class="shift-time-range">{{ employee.days[0].scheduledStart }} - {{ employee.days[0].scheduledEnd }}</span>
                                                        </div>
                                                        <span v-else class="no-data">---</span>
                                                    </td>
                                                    <td class="col-in">
                                                        <span v-if="employee.days[0].actualCheckIn" class="time-value">{{ employee.days[0].actualCheckIn }}</span>
                                                        <span v-else class="no-data">---</span>
                                                    </td>
                                                    <td class="col-out">
                                                        <span v-if="employee.days[0].actualCheckOut" class="time-value">{{ employee.days[0].actualCheckOut }}</span>
                                                        <span v-else class="no-data">---</span>
                                                    </td>
                                                    <td class="col-status">
                                                        <span v-if="employee.days[0].status" class="status-badge" :class="getStatusBadgeClass(employee.days[0].status)">{{ employee.days[0].status }}</span>
                                                        <span v-else class="no-data">---</span>
                                                    </td>
                                                    <td class="col-punch">
                                                        <span class="punch-flag" :class="getPunchFlagClass(employee.days[0].punchFlag)">{{ employee.days[0].punchFlag || '---' }}</span>
                                                    </td>
                                                    <td class="col-duration">
                                                        <span v-if="employee.days[0].duration" class="duration-value">{{ employee.days[0].duration }}</span>
                                                        <span v-else class="no-data">---</span>
                                                    </td>
                                                    <td class="col-violation">
                                                        <span v-if="employee.days[0].violation" class="violation-badge" :class="getViolationClass(employee.days[0].violation)">{{ employee.days[0].violation }}</span>
                                                        <span v-else class="no-data">---</span>
                                                    </td>
                                                </tr>
                                                <!-- Expanded rows (other days) -->
                                                <template v-if="expandedEmployees.includes(employee.employeeId)">
                                                    <tr v-for="(day, idx) in employee.days.slice(1)" :key="employee.employeeId + '-' + idx" class="expanded-row">
                                                        <td class="col-expand"></td>
                                                        <td class="col-employee"></td>
                                                        <td class="col-day">
                                                            <span class="day-label-att" :class="{ 'today': day.isToday }">{{ day.dayName }}</span>
                                                        </td>
                                                        <td class="col-context">
                                                            <div class="context-cell" :class="getDayContextClass(day.dayContext)">
                                                                <i :class="getDayContextIcon(day.dayContext)"></i>
                                                                <span>{{ day.dayContext || 'Regular Workday' }}</span>
                                                            </div>
                                                        </td>
                                                        <td class="col-shift">
                                                            <div v-if="day.shiftType" class="shift-cell-content">
                                                                <span class="shift-type-label">{{ day.shiftType }}</span>
                                                                <span v-if="day.scheduledStart" class="shift-time-range">{{ day.scheduledStart }} - {{ day.scheduledEnd }}</span>
                                                            </div>
                                                            <span v-else class="no-data">---</span>
                                                        </td>
                                                        <td class="col-in">
                                                            <span v-if="day.actualCheckIn" class="time-value">{{ day.actualCheckIn }}</span>
                                                            <span v-else class="no-data">---</span>
                                                        </td>
                                                        <td class="col-out">
                                                            <span v-if="day.actualCheckOut" class="time-value">{{ day.actualCheckOut }}</span>
                                                            <span v-else class="no-data">---</span>
                                                        </td>
                                                        <td class="col-status">
                                                            <span v-if="day.status" class="status-badge" :class="getStatusBadgeClass(day.status)">{{ day.status }}</span>
                                                            <span v-else class="no-data">---</span>
                                                        </td>
                                                        <td class="col-punch">
                                                            <span class="punch-flag" :class="getPunchFlagClass(day.punchFlag)">{{ day.punchFlag || '---' }}</span>
                                                        </td>
                                                        <td class="col-duration">
                                                            <span v-if="day.duration" class="duration-value">{{ day.duration }}</span>
                                                            <span v-else class="no-data">---</span>
                                                        </td>
                                                        <td class="col-violation">
                                                            <span v-if="day.violation" class="violation-badge" :class="getViolationClass(day.violation)">{{ day.violation }}</span>
                                                            <span v-else class="no-data">---</span>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </template>
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

                            <!-- Weekly Deviation Trends & Correction Queue Section -->
                            <div class="deviation-section">
                                <div class="deviation-grid">
                                    <!-- Weekly Deviation Trends Chart -->
                                    <div class="deviation-chart-card">
                                        <div class="deviation-header">
                                            <div class="deviation-title">
                                                <i class="pi pi-chart-line"></i>
                                                <div class="deviation-title-text">
                                                    <h3>WEEKLY DEVIATION TRENDS</h3>
                                                    <span class="deviation-subtitle">LATE IN VS EARLY OUT FREQUENCY</span>
                                                </div>
                                            </div>
                                            <div class="deviation-legend">
                                                <span class="legend-item"><span class="legend-dot orange"></span> LATE ARRIVALS</span>
                                                <span class="legend-item"><span class="legend-dot blue"></span> EARLY EXITS</span>
                                            </div>
                                        </div>
                                        <div class="deviation-chart-content">
                                            <canvas ref="deviationTrendsChart" style="max-height: 200px;"></canvas>
                                        </div>
                                    </div>

                                    <!-- Correction Queue & Dept Health -->
                                    <div class="correction-side-panel">
                                        <!-- Correction Queue -->
                                        <div class="correction-queue-card">
                                            <div class="correction-header">
                                                <div class="correction-icon">
                                                    <i class="pi pi-exclamation-circle"></i>
                                                </div>
                                                <h3>CORRECTION QUEUE</h3>
                                            </div>
                                            <p class="correction-desc">{{ correctionQueue.length }} entries require supervisor review for manual punch correction.</p>
                                            <div class="correction-list">
                                                <div v-for="item in correctionQueue" :key="item.id" class="correction-item">
                                                    <span class="correction-name">{{ item.name }}</span>
                                                    <span class="correction-issue" :class="item.type">{{ item.issue }} <i class="pi pi-arrow-right"></i></span>
                                                </div>
                                            </div>
                                            <button class="resolve-all-btn">RESOLVE ALL ISSUES</button>
                                        </div>

                                        <!-- Dept Attendance Health -->
                                        <div class="dept-health-card">
                                            <div class="dept-health-header">
                                                <i class="pi pi-chart-line"></i>
                                                <span>DEPT ATTENDANCE HEALTH</span>
                                            </div>
                                            <div class="dept-health-list">
                                                <div v-for="dept in deptHealthData" :key="dept.name" class="dept-health-item">
                                                    <div class="dept-health-label">
                                                        <span class="dept-name-health">{{ dept.name }}</span>
                                                        <span class="dept-percent">{{ dept.percent }}%</span>
                                                    </div>
                                                    <div class="dept-health-bar">
                                                        <div class="dept-health-fill" :style="{ width: dept.percent + '%', background: dept.color }"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                        <p-button label="Cancel" severity="danger" outlined @click="showShiftDialog = false"></p-button>
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
                    <p-button label="Cancel" severity="danger" outlined @click="showAssignDialog = false"></p-button>
                    <p-button label="Save" icon="pi pi-check" @click="saveAssignment"></p-button>
                </template>
            </p-dialog>

            <!-- History Drawer -->
            <p-drawer v-model:visible="showHistoryDrawer" position="right" :style="{ width: '420px' }" class="history-drawer">
                <template #header>
                    <div class="history-drawer-header">
                        <div class="history-icon">
                            <i class="pi pi-history"></i>
                        </div>
                        <div class="history-title-section">
                            <h3>VERSION TIMELINE</h3>
                            <span class="history-subtitle">RESTORE PREVIOUS SHIFT STATES</span>
                        </div>
                    </div>
                </template>

                <div class="history-content">
                    <!-- Latest Changes Banner -->
                    <div class="latest-changes-banner">
                        <div class="banner-icon">
                            <i class="pi pi-sync"></i>
                        </div>
                        <div class="banner-content">
                            <span class="banner-title">LATEST CHANGES</span>
                            <p class="banner-text">You have {{ Object.keys(scheduleAssignments).length }} unsaved assignments in the current view. Save them as a new draft or publish now.</p>
                        </div>
                    </div>

                    <!-- Version Timeline -->
                    <div class="version-timeline">
                        <div v-for="version in versionHistory" :key="version.id" class="version-item">
                            <div class="version-status-bar" :class="version.status"></div>
                            <div class="version-content">
                                <div class="version-header">
                                    <span class="version-badge" :class="version.status">{{ version.status.toUpperCase() }}</span>
                                    <span class="version-date">{{ version.date }}</span>
                                </div>
                                <h4 class="version-name">{{ version.name }}</h4>
                                <div class="version-meta">
                                    <span class="version-author">
                                        <i class="pi pi-user"></i>
                                        By {{ version.author }}
                                    </span>
                                </div>
                                <div class="version-changes">
                                    <i class="pi pi-file-edit"></i>
                                    <span>{{ version.changedShifts }} Changed Shifts</span>
                                </div>
                                <div class="version-footer">
                                    <span class="version-week">
                                        <i class="pi pi-calendar"></i>
                                        {{ version.weekRange }}
                                    </span>
                                    <span class="restore-link">RESTORE <i class="pi pi-arrow-right"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </p-drawer>
        </div>
    `,

    setup() {
        const { ref, computed, onMounted, watch, nextTick } = Vue;

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
            // Convert Date objects back to time strings for storage
            const startTimeStr = dateToTimeString(shiftForm.value.startTimeDate) || shiftForm.value.startTime;
            const endTimeStr = dateToTimeString(shiftForm.value.endTimeDate) || shiftForm.value.endTime;

            // Compute clock window values for display
            const clockInRules = shiftForm.value.clockIn;
            const clockOutRules = shiftForm.value.clockOut;

            const shiftData = {
                name: shiftForm.value.name,
                shiftType: shiftForm.value.shiftType,
                startTime: startTimeStr,
                endTime: endTimeStr,
                color: shiftForm.value.color,
                clockIn: {
                    noEarlierThan: clockInRules.noEarlierThan,
                    allowedDelay: clockInRules.allowedDelay,
                    noLaterThan: clockInRules.noLaterThan,
                    // Computed window values for display
                    windowStart: subtractMinutes(startTimeStr, clockInRules.noEarlierThan),
                    windowEnd: addMinutes(startTimeStr, clockInRules.noLaterThan),
                    lateThreshold: addMinutes(startTimeStr, clockInRules.allowedDelay)
                },
                clockOut: {
                    noEarlierThan: clockOutRules.noEarlierThan,
                    allowedShortage: clockOutRules.allowedShortage,
                    noLaterThan: clockOutRules.noLaterThan,
                    // Computed window values for display
                    windowStart: subtractMinutes(endTimeStr, clockOutRules.noEarlierThan),
                    windowEnd: addMinutes(endTimeStr, clockOutRules.noLaterThan),
                    earlyThreshold: subtractMinutes(endTimeStr, clockOutRules.allowedShortage || 0)
                },
                periods: shiftForm.value.periods.map(p => {
                    const pStart = dateToTimeString(p.startTimeDate) || p.startTime;
                    const pEnd = dateToTimeString(p.endTimeDate) || p.endTime;
                    const pClockIn = p.clockIn || clockInRules;
                    const pClockOut = p.clockOut || clockOutRules;
                    return {
                        startTime: pStart,
                        endTime: pEnd,
                        clockIn: {
                            ...pClockIn,
                            windowStart: subtractMinutes(pStart, pClockIn.noEarlierThan),
                            windowEnd: addMinutes(pStart, pClockIn.noLaterThan),
                            lateThreshold: addMinutes(pStart, pClockIn.allowedDelay)
                        },
                        clockOut: {
                            ...pClockOut,
                            windowStart: subtractMinutes(pEnd, pClockOut.noEarlierThan),
                            windowEnd: addMinutes(pEnd, pClockOut.noLaterThan),
                            earlyThreshold: subtractMinutes(pEnd, pClockOut.allowedShortage || 0)
                        }
                    };
                }),
                requiredHours: shiftForm.value.requiredHours,
                validFrom: dateToTimeString(shiftForm.value.validFromDate) || shiftForm.value.validFrom,
                validTo: dateToTimeString(shiftForm.value.validToDate) || shiftForm.value.validTo,
                active: shiftForm.value.active
            };

            if (editingShift.value) {
                const index = allShifts.value.findIndex(s => s.id === editingShift.value.id);
                if (index !== -1) {
                    allShifts.value[index] = { ...shiftData, id: editingShift.value.id };
                }
            } else {
                const newId = Math.max(...allShifts.value.map(s => s.id), 0) + 1;
                allShifts.value.push({ ...shiftData, id: newId });
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
        const showCopyWeekMenu = ref(false);
        const showCustomWeekPicker = ref(false);
        const showHistoryDrawer = ref(false);

        // Available weeks for custom week picker
        const availableWeeks = ref([
            { id: 1, label: 'Last Week', range: 'Jan 26 - Feb 1, 2026' },
            { id: 2, label: '2 Weeks Ago', range: 'Jan 19 - Jan 25, 2026' },
            { id: 3, label: '3 Weeks Ago', range: 'Jan 12 - Jan 18, 2026' },
            { id: 4, label: '4 Weeks Ago', range: 'Jan 5 - Jan 11, 2026' },
            { id: 5, label: '5 Weeks Ago', range: 'Dec 29 - Jan 4, 2026' },
            { id: 6, label: '6 Weeks Ago', range: 'Dec 22 - Dec 28, 2025' }
        ]);

        // Version history mock data
        const versionHistory = ref([
            {
                id: 1,
                name: 'Version v2.4',
                status: 'draft',
                author: 'Admin Sarah',
                date: 'Oct 24, 2023',
                changedShifts: 12,
                weekRange: 'Oct 21, 2023 - Oct 27, 2023'
            },
            {
                id: 2,
                name: 'Version v2.3',
                status: 'published',
                author: 'System Auto',
                date: 'Oct 22, 2023',
                changedShifts: 45,
                weekRange: 'Oct 14, 2023 - Oct 20, 2023'
            },
            {
                id: 3,
                name: 'Version v2.2',
                status: 'archived',
                author: 'Admin Mike',
                date: 'Oct 20, 2023',
                changedShifts: 8,
                weekRange: 'Oct 14, 2023 - Oct 20, 2023'
            },
            {
                id: 4,
                name: 'Version v2.1',
                status: 'archived',
                author: 'Admin Sarah',
                date: 'Oct 15, 2023',
                changedShifts: 23,
                weekRange: 'Oct 7, 2023 - Oct 13, 2023'
            }
        ]);
        const shiftMenuPosition = ref({ top: '0px', left: '0px' });
        const templateSearch = ref('');
        const selectedTemplateId = ref(null);
        const expandedShiftRules = ref(null);
        const currentScheduleTarget = ref({ schedule: null, day: null });
        const scheduleAssignments = ref({});

        // Weekly Shift Summary State
        const reviewerTab = ref('week');
        const reviewerSearch = ref('');
        const reviewerDepartment = ref(null);

        // Department options for filter
        const departmentOptions = ref([
            { name: 'All Departments', value: null },
            { name: 'IT', value: 'IT' },
            { name: 'Operations', value: 'Operations' },
            { name: 'Finance', value: 'Finance' },
            { name: 'HR', value: 'HR' },
            { name: 'Sales', value: 'Sales' }
        ]);

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
                { day: 'Tue', hours: 52, isHighest: true },
                { day: 'Wed', hours: 38, isHighest: false },
                { day: 'Thu', hours: 45, isHighest: false },
                { day: 'Fri', hours: 42, isHighest: false },
                { day: 'Sat', hours: 44, isHighest: false },
                { day: 'Sun', hours: 46, isHighest: false }
            ];
        });

        // Chart.js ref and instance
        const hourlyDistributionChart = ref(null);
        let chartInstance = null;

        // Initialize Chart.js
        const initHourlyChart = () => {
            if (!hourlyDistributionChart.value) return;
            
            // Destroy existing chart if any
            if (chartInstance) {
                chartInstance.destroy();
            }

            const ctx = hourlyDistributionChart.value.getContext('2d');
            const data = hourlyDistribution.value;
            
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(d => d.day),
                    datasets: [{
                        data: data.map(d => d.hours),
                        backgroundColor: data.map(d => d.isHighest ? '#f97316' : '#e2e8f0'),
                        borderRadius: 6,
                        borderSkipped: false,
                        barThickness: 45
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#1e293b',
                            titleFont: { size: 12 },
                            bodyFont: { size: 11 },
                            padding: 10,
                            callbacks: {
                                label: (context) => `${context.raw} hours`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 60,
                            ticks: {
                                stepSize: 15,
                                font: { size: 11 },
                                color: '#94a3b8'
                            },
                            grid: {
                                color: '#f1f5f9'
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        };

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
            // Use same colors as shift presets
            const mockShiftTypes = [
                { name: 'MORNING', time: '08:00-17:00', color: '#22c55e' },
                { name: 'MID-DAY', time: '10:00-17:00', color: '#f97316' },
                { name: 'EVENING', time: '14:00-22:00', color: '#3b82f6' },
                { name: 'FLEX', time: '09:00-17:00', color: '#a855f7' },
                { name: 'NIGHT', time: '22:00-06:00', color: '#1e293b' }
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

        // Watch for tab changes to initialize charts
        watch(activeTab, (newTab) => {
            if (newTab === 'summary') {
                nextTick(() => {
                    initHourlyChart();
                });
            }
            if (newTab === 'attendance') {
                nextTick(() => {
                    initDeviationChart();
                });
            }
        });

        // Initialize charts based on current tab
        onMounted(() => {
            if (activeTab.value === 'summary') {
                nextTick(() => {
                    initHourlyChart();
                });
            }
            if (activeTab.value === 'attendance') {
                nextTick(() => {
                    initDeviationChart();
                });
            }
        });

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
            const shift = getReviewerShift(schedule, dayName);
            if (!shift || !shift.color) return {};
            return { background: shift.color };
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
        const attendanceWeekOffset = ref(0);
        const expandedEmployees = ref([]);

        // Attendance Week Label
        const attendanceWeekLabel = computed(() => {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (attendanceWeekOffset.value * 7));
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()}`;
        });

        const prevAttendanceWeek = () => {
            attendanceWeekOffset.value -= 1;
        };

        const nextAttendanceWeek = () => {
            attendanceWeekOffset.value += 1;
        };

        // Weekly Days Attendance Overview
        const weekDaysAttendance = computed(() => {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (attendanceWeekOffset.value * 7)); // Monday

            const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

            return days.map((dayName, index) => {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + index);
                const isToday = date.toDateString() === today.toDateString();

                return {
                    dayName,
                    dayNumber: date.getDate(),
                    isToday,
                    duration: '8.5h',
                    shifts: [
                        { name: 'MORN', color: '#f97316' },
                        { name: 'CS', color: '#22c55e' }
                    ]
                };
            });
        });

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
                    scheduledStart: '08:00 AM', scheduledEnd: '05:00 PM',
                    actualCheckIn: '8:00 am', actualCheckOut: null,
                    status: 'PRESENT', punchFlag: 'MISSING CLOCK-OUT',
                    duration: null, violation: null
                },
                {
                    id: 2, employeeId: 2, name: 'Ahmed',
                    department: 'PRODUCT', deptColor: '#22c55e', empId: '#555',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Flexible', shiftName: null,
                    scheduledStart: '07:00 AM', scheduledEnd: '10:00 PM',
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
                    scheduledStart: '08:00 AM', scheduledEnd: '04:00 PM',
                    actualCheckIn: '8:00 am', actualCheckOut: '3 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '7 hours', violation: 'EARLY OUT'
                },
                {
                    id: 5, employeeId: 5, name: 'Ali',
                    department: 'TECHTIC', deptColor: '#3b82f6', empId: '#884',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: '08:00 AM', scheduledEnd: '04:00 PM',
                    actualCheckIn: '9:00 am', actualCheckOut: '3 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '6 hours', violation: 'LATE IN - EARLY OUT'
                },
                {
                    id: 6, employeeId: 6, name: 'Nurhan',
                    department: 'VISA', deptColor: '#8b5cf6', empId: '#852',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: '09:00 AM', scheduledEnd: '06:00 PM',
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
                    scheduledStart: '08:00 AM', scheduledEnd: '12:00 PM',
                    actualCheckIn: null, actualCheckOut: null,
                    status: 'NO SHIFT ASSIGNED', punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 9, employeeId: 9, name: 'Sami',
                    department: 'PACKAGE', deptColor: '#14b8a6', empId: '#648',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Flexible', shiftName: null,
                    scheduledStart: '06:00 AM', scheduledEnd: '11:00 PM',
                    actualCheckIn: null, actualCheckOut: null,
                    status: 'ABSENT', punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 10, employeeId: 10, name: 'Majeed',
                    department: 'VISAS', deptColor: '#f59e0b', empId: '#257',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: '09:00 AM', scheduledEnd: '05:00 PM',
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

        // Weekly attendance data - grouped by employee with 7 days
        const weeklyAttendance = computed(() => {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (attendanceWeekOffset.value * 7));

            const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
            const shiftTypes = ['Normal', 'Flexible', 'Template'];
            const contexts = ['Regular Workday', 'Regular Workday', 'Regular Workday', 'Regular Workday', 'Regular Workday', 'Weekend Off', 'Weekend Off'];

            // Get unique employees from attendanceLogs
            const employees = attendanceLogs.value.slice(0, 10).map(emp => ({
                employeeId: emp.employeeId,
                name: emp.name,
                department: emp.department,
                deptColor: emp.deptColor,
                empId: emp.empId,
                role: emp.role,
                days: dayNames.map((dayName, idx) => {
                    const date = new Date(startOfWeek);
                    date.setDate(startOfWeek.getDate() + idx);
                    const isToday = date.toDateString() === today.toDateString();
                    const isWeekend = idx >= 5;

                    // Generate varied data for each day
                    const hasShift = !isWeekend || Math.random() > 0.7;
                    const shiftType = hasShift ? shiftTypes[emp.employeeId % 3] : null;
                    const scheduleStart = hasShift ? ['08:00 AM', '09:00 AM', '07:00 AM'][emp.employeeId % 3] : null;
                    const scheduleEnd = hasShift ? ['05:00 PM', '06:00 PM', '10:00 PM'][emp.employeeId % 3] : null;

                    return {
                        dayName,
                        date: date.getDate(),
                        isToday,
                        dayContext: isWeekend ? 'Weekend Off' : emp.dayContext || 'Regular Workday',
                        shiftType: isWeekend ? null : shiftType,
                        scheduledStart: isWeekend ? null : scheduleStart,
                        scheduledEnd: isWeekend ? null : scheduleEnd,
                        actualCheckIn: isWeekend ? null : emp.actualCheckIn,
                        actualCheckOut: isWeekend ? null : emp.actualCheckOut,
                        status: isWeekend ? null : emp.status,
                        punchFlag: isWeekend ? null : emp.punchFlag,
                        duration: isWeekend ? null : emp.duration,
                        violation: isWeekend ? null : emp.violation
                    };
                })
            }));

            return employees;
        });

        // Paginated weekly attendance
        const paginatedWeeklyAttendance = computed(() => {
            const start = (attendancePage.value - 1) * attendancePerPage;
            return weeklyAttendance.value.slice(start, start + attendancePerPage);
        });

        // Toggle employee expand
        const toggleEmployeeExpand = (employeeId) => {
            const idx = expandedEmployees.value.indexOf(employeeId);
            if (idx === -1) {
                expandedEmployees.value.push(employeeId);
            } else {
                expandedEmployees.value.splice(idx, 1);
            }
        };

        // Correction Queue data
        const correctionQueue = ref([
            { id: 1, name: 'Saeed', issue: 'MISSING OUT', type: 'missing-out' },
            { id: 2, name: 'Nurhan', issue: 'MISSING IN', type: 'missing-in' }
        ]);

        // Department Attendance Health data
        const deptHealthData = ref([
            { name: 'HOTEL', percent: 85, color: '#f97316' },
            { name: 'FLIGHT', percent: 92, color: '#3b82f6' },
            { name: 'IT', percent: 78, color: '#22c55e' },
            { name: 'FINANCE', percent: 95, color: '#3b82f6' }
        ]);

        // Deviation Trends Chart
        const deviationTrendsChart = ref(null);
        let deviationChartInstance = null;

        const initDeviationChart = () => {
            if (!deviationTrendsChart.value) return;
            
            if (deviationChartInstance) {
                deviationChartInstance.destroy();
            }

            const ctx = deviationTrendsChart.value.getContext('2d');
            
            deviationChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'Late Arrivals',
                            data: [4, 5, 4, 7, 2, 2, 1],
                            borderColor: '#f97316',
                            backgroundColor: 'rgba(249, 115, 22, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: '#f97316',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointHoverRadius: 6,
                            borderWidth: 2
                        },
                        {
                            label: 'Early Exits',
                            data: [2, 4, 5, 1, 8, 4, 1],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: '#3b82f6',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointHoverRadius: 6,
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1e293b',
                            titleFont: { size: 13, weight: 'bold' },
                            bodyFont: { size: 12 },
                            bodyColor: '#64748b',
                            borderColor: '#e2e8f0',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            boxPadding: 4,
                            usePointStyle: true,
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label === 'Early Exits' ? 'early' : 'late';
                                    const color = context.dataset.label === 'Early Exits' ? '#3b82f6' : '#f97316';
                                    return label + ' : ' + context.raw;
                                },
                                labelTextColor: function(context) {
                                    return context.dataset.label === 'Early Exits' ? '#3b82f6' : '#f97316';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 8,
                            ticks: {
                                stepSize: 2,
                                font: { size: 11 },
                                color: '#94a3b8'
                            },
                            grid: {
                                color: '#f1f5f9'
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        };

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
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const menuHeight = 100; // Approximate menu height
            const menuWidth = 180; // Approximate menu width

            let top = rect.bottom + 5;
            let left = rect.left;

            // Adjust if menu would go below viewport
            if (top + menuHeight > viewportHeight) {
                top = rect.top - menuHeight - 5;
            }

            // Adjust if menu would go beyond right edge
            if (left + menuWidth > viewportWidth) {
                left = viewportWidth - menuWidth - 10;
            }

            shiftMenuPosition.value = {
                top: `${top}px`,
                left: `${left}px`
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

        // Get employee weekly hours
        const getEmployeeWeeklyHours = (schedule) => {
            let totalHours = 0;
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            days.forEach(dayName => {
                const key = `${schedule.id}-${dayName}`;
                const assignment = scheduleAssignments.value[key];
                if (assignment && assignment.type === 'shift') {
                    // Assume 9 hours per shift (can be calculated from actual times)
                    totalHours += 9;
                }
            });
            return totalHours;
        };

        // Scheduler footer stats
        const schedulerStats = computed(() => {
            const totalEmployees = employeeSchedules.value.length;
            const totalSlots = totalEmployees * 7;
            const assignedShifts = Object.values(scheduleAssignments.value).filter(a => a.type === 'shift').length;
            const timeOffs = Object.values(scheduleAssignments.value).filter(a => a.type === 'timeoff').length;
            const unassigned = totalSlots - assignedShifts - timeOffs;
            const weeklyHours = assignedShifts * 9; // Assume 9 hours per shift

            return {
                weeklyHours,
                totalShifts: assignedShifts,
                unassigned
            };
        });

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
            if (expandedShiftRules.value === shiftId) {
                expandedShiftRules.value = null;
            } else {
                expandedShiftRules.value = shiftId;
            }
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

        // Copy week functions
        const copyLastWeek = () => {
            showCopyWeekMenu.value = false;
            // Implementation for copying last week's schedule
            console.log('Copy last week');
        };

        const copyCustomWeek = () => {
            showCustomWeekPicker.value = !showCustomWeekPicker.value;
        };

        const selectCustomWeek = (week) => {
            showCopyWeekMenu.value = false;
            showCustomWeekPicker.value = false;
            // Implementation for copying selected week's schedule
            console.log('Copy week:', week.label, week.range);
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
            expandedShiftRules,
            draftAndReview,
            publishLater,
            publishAndLaunch,
            showCopyWeekMenu,
            showCustomWeekPicker,
            availableWeeks,
            copyLastWeek,
            copyCustomWeek,
            selectCustomWeek,
            showHistoryDrawer,
            versionHistory,
            getEmployeeWeeklyHours,
            schedulerStats,
            // Weekly Shift Summary
            reviewerTab,
            reviewerSearch,
            reviewerDepartment,
            departmentOptions,
            weekLabelShort,
            summaryStats,
            hourlyDistribution,
            hourlyDistributionChart,
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
            attendanceWeekOffset,
            attendanceWeekLabel,
            prevAttendanceWeek,
            nextAttendanceWeek,
            weekDaysAttendance,
            attendanceStats,
            attendanceLogs,
            filteredAttendanceLogs,
            totalAttendancePages,
            paginatedAttendance,
            weeklyAttendance,
            paginatedWeeklyAttendance,
            expandedEmployees,
            toggleEmployeeExpand,
            correctionQueue,
            deptHealthData,
            deviationTrendsChart,
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
