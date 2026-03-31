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
                        <!-- Shift Scheduling Tab -->
                        <p-tabpanel value="schedule">
                            <!-- Stats Cards -->
                            <div class="stats-grid" style="grid-template-columns: repeat(5, 1fr); margin-bottom: 1.5rem;">
                                <div class="stat-card">
                                    <div class="stat-icon blue">
                                        <i class="pi pi-users"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ scheduleStats.totalEmployees }}</div>
                                        <div class="stat-label">Total Employees</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon green">
                                        <i class="pi pi-check-circle"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ scheduleStats.assignedShifts }}</div>
                                        <div class="stat-label">Assigned Shifts</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon orange">
                                        <i class="pi pi-exclamation-circle"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ scheduleStats.unassigned }}</div>
                                        <div class="stat-label">Unassigned</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon purple">
                                        <i class="pi pi-clock"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ scheduleStats.totalHours }}</div>
                                        <div class="stat-label">Total Hours</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon teal">
                                        <i class="pi pi-calendar"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ scheduleStats.pendingChanges }}</div>
                                        <div class="stat-label">Pending Changes</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Filters Section -->
                            <div class="card compact-filters-grid" style="margin-bottom: 1.5rem; padding: 1rem 1.25rem;">
                                <div class="filter-row">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search"></i>
                                        <p-inputtext v-model="scheduleSearch" placeholder="Search..." style="width: 150px;"></p-inputtext>
                                    </span>
                                    <p-select v-model="scheduleFilterDepartment" :options="departmentOptions" optionLabel="name" optionValue="id"
                                              placeholder="Department" showClear style="width: 130px;"></p-select>
                                    <div class="scheduler-layer-tabs" style="margin-left: 0.5rem;">
                                        <button class="layer-tab" :class="{ active: schedulerLayer === 'first' }" @click="schedulerLayer = 'first'">
                                            First Layer
                                        </button>
                                        <button class="layer-tab" :class="{ active: schedulerLayer === 'all' }" @click="schedulerLayer = 'all'">
                                            All Layer
                                        </button>
                                    </div>
                                </div>
                                <div class="filter-actions-row">
                                    <p-button label="Apply" icon="pi pi-check" @click="applyScheduleFilters" size="small"></p-button>
                                    <p-button label="Reset" icon="pi pi-refresh" outlined @click="resetScheduleFilters" size="small" v-if="hasScheduleActiveFilters"></p-button>
                                </div>
                            </div>

                            <!-- Schedule Card -->
                            <div class="card">
                                <div class="card-header">
                                    <div>
                                        <div class="card-title">
                                            <i class="pi pi-calendar"></i>
                                            Shift Scheduling
                                        </div>
                                        <div class="card-subtitle">Manage individual assignments for {{ weekLabelFormatted }}</div>
                                    </div>
                                    <div class="header-actions" style="display: flex; align-items: center; gap: 0.5rem;">
                                        <div class="scheduler-date-nav" style="margin-right: 1rem;">
                                            <button class="nav-arrow" @click="previousWeek"><i class="pi pi-chevron-left"></i></button>
                                            <span class="date-range" style="font-size: 0.85rem; min-width: 180px; text-align: center;">{{ weekLabelFormatted }}</span>
                                            <button class="nav-arrow" @click="nextWeek"><i class="pi pi-chevron-right"></i></button>
                                        </div>
                                        <div class="dropdown-btn-wrapper">
                                            <p-button label="Copy Week" icon="pi pi-copy" outlined size="small" @click="showCopyWeekMenu = !showCopyWeekMenu; showCustomWeekPicker = false"></p-button>
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
                                        <p-button label="History" icon="pi pi-history" outlined size="small" @click="showHistoryDrawer = true"></p-button>
                                        <p-button label="Save Draft" icon="pi pi-save" outlined size="small" :disabled="Object.keys(scheduleAssignments).length === 0"></p-button>
                                        <p-button label="Publish" icon="pi pi-send" size="small" :disabled="Object.keys(scheduleAssignments).length === 0"></p-button>
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
                                        <tr v-for="schedule in paginatedScheduleList" :key="schedule.id">
                                            <td class="staff-col">
                                                <div class="staff-info">
                                                    <img :src="getEmployeeAvatar(schedule.employeeId, schedule.employeeName)" :alt="schedule.employeeName" class="staff-avatar">
                                                    <div class="staff-details">
                                                        <div class="staff-name">{{ schedule.employeeName }}</div>
                                                        <div v-if="getEmployeeNumber(schedule.employeeId)" class="staff-id">{{ getEmployeeNumber(schedule.employeeId) }}</div>
                                                        <div v-if="getEmployeeDepartmentPath(schedule.employeeId)" class="staff-dept">{{ getEmployeeDepartmentPath(schedule.employeeId) }}</div>
                                                        <div class="staff-role">{{ schedule.scheduleType === 'Fixed' ? 'Variable' : schedule.scheduleType }}</div>
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
                                                            <template v-if="getShiftById(getAssignment(schedule, day.dayName).shiftId)">
                                                                <div class="assigned-color-bar" :style="{ background: getAssignment(schedule, day.dayName).color || '#f59e0b' }"></div>
                                                                <div class="assigned-card-content">
                                                                    <div class="assigned-card-name">{{ getShiftById(getAssignment(schedule, day.dayName).shiftId).name }}</div>
                                                                    <div class="assigned-card-time">{{ getAssignedShiftTimeRange(getShiftById(getAssignment(schedule, day.dayName).shiftId)) }}</div>
                                                                    <div class="assigned-card-meta">
                                                                        <span class="assigned-card-duration">
                                                                            <i class="pi pi-clock"></i>
                                                                            {{ getShiftDuration(getShiftById(getAssignment(schedule, day.dayName).shiftId)) }} hrs
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                            <template v-else>
                                                                <div class="assigned-color-bar" :style="{ background: getAssignment(schedule, day.dayName).color || '#f59e0b' }"></div>
                                                                <div class="assigned-card-content">
                                                                    <div class="assigned-card-name">{{ getAssignment(schedule, day.dayName).shiftName }}</div>
                                                                    <div class="assigned-card-time">{{ getAssignment(schedule, day.dayName).startTime || '08:00' }}</div>
                                                                </div>
                                                            </template>
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
                                <div class="scheduler-pagination" style="padding: 1rem;">
                                    <span class="pagination-info">Showing {{ schedulePaginationStart }}-{{ schedulePaginationEnd }} of {{ filteredEmployeeSchedules.length }}</span>
                                    <div class="pagination-controls">
                                        <button type="button" class="pagination-btn" :disabled="schedulePage <= 1" @click="schedulePage = Math.max(1, schedulePage - 1)">
                                            <i class="pi pi-chevron-left"></i>
                                        </button>
                                        <button type="button" class="pagination-btn" :disabled="schedulePage >= schedulePageCount" @click="schedulePage = Math.min(schedulePageCount, schedulePage + 1)">
                                            <i class="pi pi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Scheduler Footer Stats -->
                            <div class="scheduler-footer-stats" style="margin-top: 1.5rem;">
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
                            <!-- Stats Cards -->
                            <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 1.5rem;">
                                <div class="stat-card">
                                    <div class="stat-icon orange">
                                        <i class="pi pi-clock"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ summaryStats.totalHours }}</div>
                                        <div class="stat-label">Total Hours</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon blue">
                                        <i class="pi pi-calendar"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ summaryStats.scheduledShifts }}</div>
                                        <div class="stat-label">Scheduled Shifts</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon green">
                                        <i class="pi pi-users"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ summaryStats.staffOnDuty }}</div>
                                        <div class="stat-label">Staff On Duty</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon gray">
                                        <i class="pi pi-exclamation-circle"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ summaryStats.unassigned }}</div>
                                        <div class="stat-label">Unassigned</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Filters Section -->
                            <div class="card compact-filters-grid" style="margin-bottom: 1.5rem; padding: 1rem 1.25rem;">
                                <div class="filter-row">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search"></i>
                                        <p-inputtext v-model="reviewerSearch" placeholder="Search..." style="width: 150px;"></p-inputtext>
                                    </span>
                                    <p-select v-model="reviewerDepartment" :options="reviewerDepartmentOptions" optionLabel="name" optionValue="id" placeholder="Department" showClear style="width: 130px;" @change="onReviewerDepartmentChange"></p-select>
                                    <p-select v-model="reviewerSection" :options="reviewerFilteredSections" optionLabel="name" optionValue="id" placeholder="Section" showClear style="width: 120px;" :disabled="!reviewerDepartment" @change="onReviewerSectionChange"></p-select>
                                    <p-select v-model="reviewerUnit" :options="reviewerFilteredUnits" optionLabel="name" optionValue="id" placeholder="Unit" showClear style="width: 110px;" :disabled="!reviewerSection"></p-select>
                                </div>
                                <div class="filter-actions-row">
                                    <p-button label="Apply" icon="pi pi-check" @click="applyReviewerFilters" size="small"></p-button>
                                    <p-button label="Reset" icon="pi pi-refresh" outlined @click="resetReviewerFilters" size="small" v-if="hasReviewerActiveFilters"></p-button>
                                </div>
                            </div>

                            <!-- Shift Reviewer Card -->
                            <div class="card">
                                <div class="card-header">
                                    <div>
                                        <div class="card-title">
                                            <i class="pi pi-eye"></i>
                                            Shift Reviewer
                                        </div>
                                        <div class="card-subtitle">Review staff shift assignments for {{ weekLabelFormatted }}</div>
                                    </div>
                                    <div class="header-actions" style="display: flex; align-items: center; gap: 0.5rem;">
                                        <div class="scheduler-date-nav">
                                            <button class="nav-arrow" @click="previousWeek"><i class="pi pi-chevron-left"></i></button>
                                            <span class="date-range" style="font-size: 0.85rem; min-width: 180px; text-align: center;">{{ weekLabelFormatted }}</span>
                                            <button class="nav-arrow" @click="nextWeek"><i class="pi pi-chevron-right"></i></button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Summary Grid (same as Scheduler) -->
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
                                            <tr v-for="schedule in paginatedReviewerSchedules" :key="schedule.id">
                                                <td class="staff-col">
                                                    <div class="staff-info">
                                                        <img :src="getEmployeeAvatar(schedule.employeeId, schedule.employeeName)" :alt="schedule.employeeName" class="staff-avatar">
                                                        <div class="staff-details">
                                                            <div class="staff-name">{{ schedule.employeeName }}</div>
                                                            <div v-if="getEmployeeNumber(schedule.employeeId)" class="staff-id">{{ getEmployeeNumber(schedule.employeeId) }}</div>
                                                            <div v-if="getEmployeeDepartmentPath(schedule.employeeId)" class="staff-dept">{{ getEmployeeDepartmentPath(schedule.employeeId) }}</div>
                                                            <div class="staff-role">{{ schedule.scheduleType }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td v-for="day in weekDays" :key="day.date" class="day-col-new">
                                                    <div class="schedule-cell" :class="{ 'has-assignment': getSummaryShift(schedule, day.dayName) }">
                                                        <!-- Assigned Shift (read-only) -->
                                                        <template v-if="getSummaryShift(schedule, day.dayName)">
                                                            <template v-if="getSummaryShift(schedule, day.dayName).type === 'dayoff'">
                                                                <div class="time-off-card readonly">
                                                                    <i class="pi pi-sun"></i>
                                                                    <span>DAY OFF</span>
                                                                </div>
                                                            </template>
                                                            <template v-else>
                                                                <div class="assigned-shift-card readonly">
                                                                    <div class="assigned-color-bar" style="background: #f59e0b;"></div>
                                                                    <div class="assigned-card-content">
                                                                        <div class="assigned-card-name">{{ getSummaryShift(schedule, day.dayName).name }}</div>
                                                                        <div class="assigned-card-time">{{ getSummaryShift(schedule, day.dayName).time || '' }}</div>
                                                                        <div class="assigned-card-meta" v-if="getSummaryShift(schedule, day.dayName).duration">
                                                                            <span class="assigned-card-duration">
                                                                                <i class="pi pi-clock"></i>
                                                                                {{ getSummaryShift(schedule, day.dayName).duration }} hrs
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                        </template>
                                                        <!-- Empty Cell -->
                                                        <template v-else>
                                                            <div class="empty-cell-placeholder">
                                                                <i class="pi pi-plus" style="color: #cbd5e1; font-size: 0.75rem;"></i>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </td>
                                                <td class="total-col">
                                                    <span class="total-hours">{{ getSummaryTotalHours(schedule) }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="scheduler-pagination" style="padding: 1rem;">
                                    <span class="pagination-info">Showing {{ reviewerPaginationStart }}-{{ reviewerPaginationEnd }} of {{ filteredReviewerSchedules.length }}</span>
                                    <div class="pagination-controls">
                                        <button type="button" class="pagination-btn" :disabled="reviewerPage <= 1" @click="reviewerPage = Math.max(1, reviewerPage - 1)">
                                            <i class="pi pi-chevron-left"></i>
                                        </button>
                                        <button type="button" class="pagination-btn" :disabled="reviewerPage >= reviewerPageCount" @click="reviewerPage = Math.min(reviewerPageCount, reviewerPage + 1)">
                                            <i class="pi pi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Employee Density Heatmap Card -->
                            <div class="card" style="margin-top: 1.5rem;">
                                <div class="card-header">
                                    <div>
                                        <div class="card-title">
                                            <i class="pi pi-th-large"></i>
                                            Employee Density Heatmap
                                        </div>
                                        <div class="card-subtitle">Staff distribution across every hour of the day</div>
                                    </div>
                                    <div class="density-legend" style="display: flex; align-items: center; gap: 0.5rem;">
                                        <span style="font-size: 0.75rem; color: var(--text-secondary);">DENSITY</span>
                                        <div class="density-gradient" style="display: flex; gap: 2px;">
                                            <span class="density-min"></span>
                                            <span class="density-low"></span>
                                            <span class="density-med"></span>
                                            <span class="density-high"></span>
                                        </div>
                                    </div>
                                </div>
                            <div class="heatmap-section" style="padding: 0;">
                                <div id="employee-density-heatmap" ref="heatmapChartRef" class="heatmap-chart-container" :class="{ 'heatmap-chart-collapsed': attemptedHeatmapInit && !heatmapChartReady }"></div>
                                <div v-if="!heatmapChartReady" class="heatmap-grid-container heatmap-fallback">
                                    <table class="heatmap-grid">
                                        <thead>
                                            <tr>
                                                <th>DAY</th>
                                                <th v-for="hour in heatmapHours" :key="hour">{{ hour }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="row in heatmapData" :key="row.day">
                                                <td class="day-label" :class="row.day.toLowerCase()">{{ row.day }}</td>
                                                <td v-for="(count, hIndex) in row.hours" :key="hIndex" class="heatmap-cell" :class="getHeatmapCellClass(count)">{{ count > 0 ? count : '' }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </div>
                        </p-tabpanel>

                        <!-- Attendance Tab -->
                        <p-tabpanel value="attendance">
                            <!-- Attendance Stats Row 1 -->
                            <div class="stats-grid" style="grid-template-columns: repeat(7, 1fr); margin-bottom: 1rem;">
                                <div class="stat-card" v-for="stat in attendanceStatCardsRow1" :key="stat.key">
                                    <div class="stat-icon" :class="stat.iconClass">
                                        <i :class="stat.icon"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ attendanceStats[stat.key] }}</div>
                                        <div class="stat-label">{{ stat.label }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Attendance Stats Row 2 -->
                            <div class="stats-grid" style="grid-template-columns: repeat(7, 1fr); margin-bottom: 1rem;">
                                <div class="stat-card" v-for="stat in attendanceStatCardsRow2" :key="stat.key">
                                    <div class="stat-icon" :class="stat.iconClass">
                                        <i :class="stat.icon"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ attendanceStats[stat.key] }}</div>
                                        <div class="stat-label">{{ stat.label }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Attendance Stats Row 3 -->
                            <div class="stats-grid" style="grid-template-columns: repeat(7, 1fr); margin-bottom: 1.5rem;">
                                <div class="stat-card" v-for="stat in attendanceStatCardsRow3" :key="stat.key">
                                    <div class="stat-icon" :class="stat.iconClass">
                                        <i :class="stat.icon"></i>
                                    </div>
                                    <div>
                                        <div class="stat-value">{{ attendanceStats[stat.key] }}</div>
                                        <div class="stat-label">{{ stat.label }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Filters Section -->
                            <div class="card compact-filters-grid" style="margin-bottom: 1.5rem; padding: 1rem 1.25rem;">
                                <div class="filter-row">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search"></i>
                                        <p-inputtext v-model="attendanceSearchName" placeholder="Search..." style="width: 150px;"></p-inputtext>
                                    </span>
                                    <p-select v-model="attendanceEntity" :options="attendanceEntityOptions" optionLabel="name" optionValue="id" placeholder="Entity" showClear style="width: 120px;"></p-select>
                                    <p-select v-model="attendanceDepartment" :options="attendanceDepartmentOptions" optionLabel="name" optionValue="id" placeholder="Department" showClear @change="onAttendanceDepartmentChange"></p-select>
                                    <p-select v-model="attendanceSection" :options="attendanceFilteredSections" optionLabel="name" optionValue="id" placeholder="Section" showClear :disabled="!attendanceDepartment" @change="onAttendanceSectionChange"></p-select>
                                    <p-select v-model="attendanceUnit" :options="attendanceFilteredUnits" optionLabel="name" optionValue="id" placeholder="Unit" showClear :disabled="!attendanceSection" @change="onAttendanceUnitChange"></p-select>
                                    <p-select v-model="attendanceTeam" :options="attendanceFilteredTeams" optionLabel="name" optionValue="id" placeholder="Team" showClear :disabled="!attendanceUnit"></p-select>
                                    <div class="requests-datepicker-wrap">
                                        <p-datepicker v-model="attendanceDateRangeFilter" selectionMode="range" dateFormat="dd/mm/yy" placeholder="Date Range" @update:modelValue="onAttendanceDateRangeFilterChange"></p-datepicker>
                                    </div>
                                </div>
                                <div class="filter-actions-row">
                                    <p-button label="Apply" icon="pi pi-check" @click="applyAttendanceFilters" size="small"></p-button>
                                    <p-button label="Reset" icon="pi pi-refresh" outlined @click="resetAttendanceFilters" size="small" v-if="hasAttendanceActiveFilters"></p-button>
                                </div>
                            </div>

                            <!-- Attendance Logs Card -->
                            <div class="card">
                                <div class="card-header">
                                    <div>
                                        <div class="card-title">
                                            <i class="pi pi-clock"></i>
                                            Attendance Logs
                                        </div>
                                        <div class="card-subtitle">Track employee attendance records for {{ attendanceWeekLabel }}</div>
                                    </div>
                                    <div class="header-actions" style="display: flex; align-items: center; gap: 0.5rem;">
                                        <div class="scheduler-date-nav">
                                            <button class="nav-arrow" @click="prevAttendanceWeek"><i class="pi pi-chevron-left"></i></button>
                                            <span class="date-range" style="font-size: 0.85rem; min-width: 180px; text-align: center;">{{ attendanceWeekLabel }}</span>
                                            <button class="nav-arrow" @click="nextAttendanceWeek"><i class="pi pi-chevron-right"></i></button>
                                        </div>
                                        <p-button :label="attendanceAllExpanded ? 'Collapse All' : 'Expand All'" 
                                                  :icon="attendanceAllExpanded ? 'pi pi-chevron-double-up' : 'pi pi-chevron-double-down'" 
                                                  outlined size="small" @click="toggleExpandAllAttendance"></p-button>
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
                                                <th class="col-fingerprints">NO. OF FINGERPRINTS</th>
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
                                                                    <span class="dept-name" :style="{ color: employee.deptColor || 'var(--primary-color)' }">{{ getEmployeeDepartmentPath(employee.employeeId) || employee.department }}</span>
                                                                    <span class="emp-id">{{ employee.empId }}</span>
                                                                </div>
                                                                <div class="emp-role">{{ employee.role }}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="col-day">
                                                        <div class="day-cell-wrapper">
                                                            <span class="day-label-att" :class="{ 'today': employee.days[0].isToday }">{{ employee.days[0].dayName }}</span>
                                                            <span class="day-full-date">{{ employee.days[0].fullDateLabel }}</span>
                                                        </div>
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
                                                        <template v-if="employee.days[0].violation === 'LATE IN - EARLY OUT'">
                                                            <span class="violation-badges-inline">
                                                                <span class="violation-badge" :class="getViolationClass('LATE IN')">LATE IN</span>
                                                                <span class="violation-badge" :class="getViolationClass('EARLY OUT')">EARLY OUT</span>
                                                            </span>
                                                        </template>
                                                        <span v-else-if="employee.days[0].violation" class="violation-badge" :class="getViolationClass(employee.days[0].violation)">{{ employee.days[0].violation }}</span>
                                                        <span v-else class="no-data">---</span>
                                                    </td>
                                                    <td class="col-fingerprints">
                                                        <span v-if="getFingerprintsForDay(employee.days[0], employee.employeeId, 0).count" 
                                                              class="fingerprint-count clickable" 
                                                              @click="openFingerprintModal(employee, employee.days[0], 0)">
                                                            <i class="pi pi-id-card" style="margin-right: 0.25rem;"></i>
                                                            {{ getFingerprintsForDay(employee.days[0], employee.employeeId, 0).count }}
                                                        </span>
                                                        <span v-else class="no-data">---</span>
                                                    </td>
                                                </tr>
                                                <!-- Expanded rows (other days) -->
                                                <template v-if="expandedEmployees.includes(employee.employeeId)">
                                                    <tr v-for="(day, idx) in employee.days.slice(1)" :key="employee.employeeId + '-' + idx" class="expanded-row">
                                                        <td class="col-expand"></td>
                                                        <td class="col-employee"></td>
                                                        <td class="col-day">
                                                            <div class="day-cell-wrapper">
                                                                <span class="day-label-att" :class="{ 'today': day.isToday }">{{ day.dayName }}</span>
                                                                <span class="day-full-date">{{ day.fullDateLabel }}</span>
                                                            </div>
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
                                                            <template v-if="day.violation === 'LATE IN - EARLY OUT'">
                                                                <span class="violation-badges-inline">
                                                                    <span class="violation-badge" :class="getViolationClass('LATE IN')">LATE IN</span>
                                                                    <span class="violation-badge" :class="getViolationClass('EARLY OUT')">EARLY OUT</span>
                                                                </span>
                                                            </template>
                                                            <span v-else-if="day.violation" class="violation-badge" :class="getViolationClass(day.violation)">{{ day.violation }}</span>
                                                            <span v-else class="no-data">---</span>
                                                        </td>
                                                        <td class="col-fingerprints">
                                                            <span v-if="getFingerprintsForDay(day, employee.employeeId, idx + 1).count" 
                                                                  class="fingerprint-count clickable" 
                                                                  @click="openFingerprintModal(employee, day, idx + 1)">
                                                                <i class="pi pi-id-card" style="margin-right: 0.25rem;"></i>
                                                                {{ getFingerprintsForDay(day, employee.employeeId, idx + 1).count }}
                                                            </span>
                                                            <span v-else class="no-data">---</span>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div class="attendance-pagination" style="padding: 1rem;">
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

            <!-- Fingerprint Details Modal -->
            <p-dialog v-model:visible="showFingerprintModal" header="Fingerprint Details" :modal="true" :style="{ width: '550px' }">
                <div v-if="fingerprintModalData" class="fingerprint-modal-content">
                    <div class="fingerprint-header-info">
                        <div class="employee-summary">
                            <i class="pi pi-user" style="font-size: 1.5rem; color: var(--primary-color);"></i>
                            <div>
                                <div style="font-weight: 600;">{{ fingerprintModalData.employeeName }}</div>
                                <div style="font-size: 0.85rem; color: var(--text-color-secondary);">{{ fingerprintModalData.dayName }} - {{ fingerprintModalData.date }}</div>
                            </div>
                        </div>
                        <div class="total-punches">
                            <span class="punch-count">{{ fingerprintModalData.punches.length }}</span>
                            <span class="punch-label">Total Punches</span>
                        </div>
                    </div>
                    
                    <div class="fingerprint-list">
                        <div v-for="(punch, index) in fingerprintModalData.punches" :key="index" class="fingerprint-item" :class="punch.type.toLowerCase()">
                            <div class="punch-icon" :class="punch.type.toLowerCase()">
                                <i :class="punch.type === 'IN' ? 'pi pi-sign-in' : 'pi pi-sign-out'"></i>
                            </div>
                            <div class="punch-details">
                                <div class="punch-time">{{ punch.time }}</div>
                                <div class="punch-type-badge" :class="punch.type.toLowerCase()">{{ punch.type }}</div>
                            </div>
                            <div class="punch-location">
                                <div class="location-row">
                                    <i class="pi pi-building"></i>
                                    <span>{{ punch.office }}</span>
                                </div>
                                <div class="location-row device">
                                    <i class="pi pi-tablet"></i>
                                    <span>{{ punch.device }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Close" outlined @click="showFingerprintModal = false"></p-button>
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
        const activeTab = ref('schedule');
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

        // Week navigation (Sunday to Saturday)
        const currentWeekStart = ref(getSunday(new Date()));

        function getSunday(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day;
            return new Date(d.setDate(diff));
        }

        const weekDays = computed(() => {
            const days = [];
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
            currentWeekStart.value = getSunday(new Date());
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
        const getEmployeeAvatar = (employeeId, fallbackName = '') => {
            const emp = employees.value.find(e => e.id === employeeId);
            if (emp && emp.avatar) return emp.avatar;
            const name = (fallbackName || '').trim();
            const parts = name.split(/\s+/).filter(Boolean);
            const initials = parts.length >= 2
                ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                : (name.substring(0, 2) || '?').toUpperCase();
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=80&background=random`;
        };

        const getEmployeeName = (employeeId) => {
            const emp = employees.value.find(e => e.id === employeeId);
            return emp ? `${emp.firstName} ${emp.familyName}` : '';
        };

        const getEmployeeNumber = (employeeId) => {
            const emp = employees.value.find(e => e.id === employeeId);
            return emp ? emp.employeeNumber || '' : '';
        };

        const getEmployeeDepartmentPath = (employeeId) => {
            const emp = employees.value.find(e => e.id === employeeId);
            if (!emp) return '';
            const parts = [emp.department].filter(Boolean);
            if (emp.section) parts.push(emp.section);
            return parts.map(p => String(p).toUpperCase()).join(' > ');
        };

        const getShiftName = (shiftId) => {
            const shift = allShifts.value.find(s => s.id === shiftId);
            return shift ? shift.name : '';
        };

        const getShiftColor = (shiftId) => {
            const shift = allShifts.value.find(s => s.id === shiftId);
            return shift ? shift.color : '#e2e8f0';
        };

        const getShiftById = (shiftId) => {
            return allShifts.value.find(s => s.id === shiftId) || null;
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
            const labels = { 'normal': 'NORMAL', 'template': 'TEMPLATE', 'flexible': 'FLEXIBLE' };
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
        const schedulerLayer = ref('all');
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
        const expandedAssignedShiftRules = ref({});
        const currentScheduleTarget = ref({ schedule: null, day: null });
        const scheduleAssignments = ref({});

        // Weekly Shift Summary State
        const reviewerTab = ref('week');
        const reviewerSearch = ref('');
        const reviewerDepartment = ref(null);
        const reviewerSection = ref(null);
        const reviewerUnit = ref(null);
        const appliedReviewerFilters = ref({ departmentId: null, sectionId: null, unitId: null });
        const appliedReviewerSearch = ref('');

        // Attendance Logs filters (Entity -> Department -> Section -> Unit -> Team, applied on Search)
        const attendanceEntity = ref(null);
        const attendanceEntityOptions = ref([
            { id: 1, name: 'Direct' },
            { id: 2, name: 'Techtic' }
        ]);
        const attendanceDepartment = ref(null);
        const attendanceSection = ref(null);
        const attendanceUnit = ref(null);
        const attendanceTeam = ref(null);
        const appliedAttendanceFilters = ref({ departmentId: null, sectionId: null, unitId: null, teamId: null });
        const attendanceSearchName = ref('');
        const appliedAttendanceSearchName = ref('');
        const attendanceDateRangeFilter = ref(null);

        // Department / Section / Unit options (from StaticData, dependent)
        const reviewerDepartmentOptions = ref([...StaticData.departments]);
        const reviewerSectionOptions = ref([...StaticData.sections]);
        const reviewerUnitOptions = ref([...StaticData.units]);

        const reviewerFilteredSections = computed(() => {
            if (!reviewerDepartment.value) return [];
            return reviewerSectionOptions.value.filter(s => s.departmentId === reviewerDepartment.value);
        });

        const reviewerFilteredUnits = computed(() => {
            if (!reviewerSection.value) return [];
            return reviewerUnitOptions.value.filter(u => u.sectionId === reviewerSection.value);
        });

        const attendanceDepartmentOptions = ref([...StaticData.departments]);
        const attendanceSectionOptions = ref([...StaticData.sections]);
        const attendanceUnitOptions = ref([...StaticData.units]);
        const attendanceTeamOptions = ref([...StaticData.teams]);
        const attendanceFilteredSections = computed(() => {
            if (!attendanceDepartment.value) return [];
            return attendanceSectionOptions.value.filter(s => s.departmentId === attendanceDepartment.value);
        });
        const attendanceFilteredUnits = computed(() => {
            if (!attendanceSection.value) return [];
            return attendanceUnitOptions.value.filter(u => u.sectionId === attendanceSection.value);
        });
        const attendanceFilteredTeams = computed(() => {
            if (!attendanceUnit.value) return [];
            return attendanceTeamOptions.value.filter(t => t.unitId === attendanceUnit.value);
        });
        const onAttendanceDepartmentChange = () => {
            attendanceSection.value = null;
            attendanceUnit.value = null;
            attendanceTeam.value = null;
        };
        const onAttendanceSectionChange = () => {
            attendanceUnit.value = null;
            attendanceTeam.value = null;
        };
        const onAttendanceUnitChange = () => {
            attendanceTeam.value = null;
        };
        const applyAttendanceFilters = () => {
            appliedAttendanceFilters.value = {
                departmentId: attendanceDepartment.value,
                sectionId: attendanceSection.value,
                unitId: attendanceUnit.value,
                teamId: attendanceTeam.value
            };
            appliedAttendanceSearchName.value = (attendanceSearchName.value || '').trim();
        };

        const resetAttendanceFilters = () => {
            attendanceEntity.value = null;
            attendanceDepartment.value = null;
            attendanceSection.value = null;
            attendanceUnit.value = null;
            attendanceTeam.value = null;
            attendanceSearchName.value = '';
            attendanceDateRangeFilter.value = null;
            appliedAttendanceFilters.value = { departmentId: null, sectionId: null, unitId: null, teamId: null };
            appliedAttendanceSearchName.value = '';
        };

        const hasAttendanceActiveFilters = computed(() => {
            return attendanceEntity.value || attendanceDepartment.value || attendanceSection.value || attendanceUnit.value || attendanceTeam.value || attendanceSearchName.value || attendanceDateRangeFilter.value;
        });

        // When date range filter is used, reset the week selector
        const onAttendanceDateRangeFilterChange = (value) => {
            if (value && value.length === 2 && value[0] && value[1]) {
                attendanceWeekOffset.value = 0;
            }
        };

        const onReviewerDepartmentChange = () => {
            reviewerSection.value = null;
            reviewerUnit.value = null;
        };

        const onReviewerSectionChange = () => {
            reviewerUnit.value = null;
        };

        const applyReviewerFilters = () => {
            appliedReviewerFilters.value = {
                departmentId: reviewerDepartment.value,
                sectionId: reviewerSection.value,
                unitId: reviewerUnit.value
            };
            appliedReviewerSearch.value = (reviewerSearch.value || '').trim();
        };

        const resetReviewerFilters = () => {
            reviewerDepartment.value = null;
            reviewerSection.value = null;
            reviewerUnit.value = null;
            reviewerSearch.value = '';
            appliedReviewerFilters.value = { departmentId: null, sectionId: null, unitId: null };
            appliedReviewerSearch.value = '';
        };

        const hasReviewerActiveFilters = computed(() => {
            return reviewerDepartment.value || reviewerSection.value || reviewerUnit.value || reviewerSearch.value;
        });

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

        // Heatmap hours labels (proper AM/PM format)
        const heatmapHours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
            '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];

        // Heatmap data – filled across day with low (green), medium (yellow), high (orange) like reference
        const heatmapData = computed(() => {
            return [
                { day: 'SUN', hours: [1, 0, 0, 0, 0, 0, 1, 2, 4, 5, 6, 6, 5, 6, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1], total: 72 },
                { day: 'MON', hours: [0, 0, 0, 0, 0, 0, 2, 3, 5, 6, 6, 6, 5, 6, 6, 5, 5, 4, 4, 3, 3, 2, 1, 0], total: 82 },
                { day: 'TUE', hours: [0, 0, 0, 0, 0, 0, 2, 4, 5, 6, 6, 6, 6, 6, 5, 5, 5, 4, 4, 3, 2, 2, 1, 0], total: 88 },
                { day: 'WED', hours: [0, 0, 0, 0, 0, 0, 2, 4, 5, 6, 6, 6, 6, 6, 6, 5, 5, 4, 4, 3, 2, 2, 1, 0], total: 91 },
                { day: 'THU', hours: [0, 0, 0, 0, 0, 0, 2, 4, 5, 6, 6, 6, 6, 6, 5, 5, 5, 4, 4, 3, 3, 2, 1, 0], total: 90 },
                { day: 'FRI', hours: [0, 0, 0, 0, 0, 0, 2, 3, 5, 6, 6, 6, 5, 5, 5, 4, 4, 3, 2, 2, 2, 2, 2, 1], total: 79 },
                { day: 'SAT', hours: [1, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 5, 4, 4, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2], total: 58 }
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

        const heatmapChartRef = ref(null);
        const heatmapChartReady = ref(false);
        const attemptedHeatmapInit = ref(false);
        let heatmapChartInstance = null;
        const ApexChartsLib = typeof window !== 'undefined' ? window.ApexCharts : undefined;

        const initHeatmapChart = () => {
            attemptedHeatmapInit.value = true;
            const el = document.getElementById('employee-density-heatmap') || heatmapChartRef.value;
            if (!el || !ApexChartsLib) return;
            if (heatmapChartInstance) {
                try { heatmapChartInstance.destroy(); } catch (e) { }
                heatmapChartInstance = null;
            }
            const data = heatmapData.value;
            const hours = heatmapHours;
            const series = data.map(row => ({
                name: row.day,
                data: row.hours.map((y, i) => ({ x: hours[i], y }))
            }));
            const options = {
                chart: { type: 'heatmap', height: 320, fontFamily: 'Inter, sans-serif', toolbar: { show: false } },
                series,
                dataLabels: { enabled: true, style: { fontSize: '10px' } },
                xaxis: { categories: hours, labels: { style: { colors: '#64748b', fontSize: '9px' }, maxWidth: 36, rotate: -45 } },
                yaxis: { labels: { style: { colors: '#64748b', fontSize: '11px' } } },
                plotOptions: {
                    heatmap: {
                        colorScale: {
                            ranges: [
                                { from: 0, to: 0, name: 'No activity', color: '#f1f5f9' },
                                { from: 1, to: 2, name: 'Low', color: '#86efac' },
                                { from: 3, to: 4, name: 'Medium', color: '#fcd34d' },
                                { from: 5, to: 10, name: 'High', color: '#f97316' }
                            ]
                        }
                    }
                },
                grid: { borderColor: '#e5e7eb', strokeDashArray: 2 },
                tooltip: { theme: 'light' },
                legend: { show: false }
            };
            heatmapChartInstance = new ApexChartsLib(el, options);
            heatmapChartInstance.render();
            heatmapChartReady.value = true;
        };

        const scheduleHeatmapInit = () => {
            if (activeTab.value !== 'summary') return;
            nextTick(() => {
                setTimeout(() => {
                    if (document.getElementById('employee-density-heatmap') && activeTab.value === 'summary') initHeatmapChart();
                }, 300);
            });
        };

        watch(() => heatmapChartRef.value, (el) => {
            if (el && activeTab.value === 'summary') setTimeout(initHeatmapChart, 100);
        }, { flush: 'post' });

        // Filtered reviewer schedules (by applied department/section/unit + search text)
        const filteredReviewerSchedules = computed(() => {
            const applied = appliedReviewerFilters.value;
            const query = (appliedReviewerSearch.value || '').trim().toLowerCase();
            let list = employeeSchedules.value;

            if (applied.departmentId != null || applied.sectionId != null || applied.unitId != null) {
                const deptName = applied.departmentId != null
                    ? (StaticData.departments.find(d => d.id === applied.departmentId) || {}).name
                    : null;
                let sectionName = null;
                if (applied.sectionId != null) {
                    sectionName = (StaticData.sections.find(s => s.id === applied.sectionId) || {}).name;
                } else if (applied.unitId != null) {
                    const unit = StaticData.units.find(u => u.id === applied.unitId);
                    sectionName = unit ? (StaticData.sections.find(s => s.id === unit.sectionId) || {}).name : null;
                }
                list = list.filter(s => {
                    const emp = employees.value.find(e => e.id === s.employeeId);
                    if (!emp) return applied.departmentId == null && applied.sectionId == null && applied.unitId == null;
                    if (deptName != null && emp.department !== deptName) return false;
                    if (sectionName != null && emp.section !== sectionName) return false;
                    return true;
                });
            }

            if (query) {
                list = list.filter(s =>
                    s.employeeName.toLowerCase().includes(query) ||
                    (s.scheduleType || '').toLowerCase().includes(query)
                );
            }
            return list;
        });

        const reviewerPerPage = 10;
        const reviewerPage = ref(1);
        const paginatedReviewerSchedules = computed(() => {
            const list = filteredReviewerSchedules.value;
            const start = (reviewerPage.value - 1) * reviewerPerPage;
            return list.slice(start, start + reviewerPerPage);
        });
        const reviewerPageCount = computed(() => Math.max(1, Math.ceil(filteredReviewerSchedules.value.length / reviewerPerPage)));
        const reviewerPaginationStart = computed(() => filteredReviewerSchedules.value.length === 0 ? 0 : (reviewerPage.value - 1) * reviewerPerPage + 1);
        const reviewerPaginationEnd = computed(() => Math.min(reviewerPage.value * reviewerPerPage, filteredReviewerSchedules.value.length));

        // Pre-generated mock reviewer shifts (consistent data)
        const reviewerShiftsCache = ref({});

        // Leave/request types for summary (Compound Leaves from HR Request Center; others for realistic variety)
        const summaryLeaveTypes = [
            { name: 'Compound Leaves', color: '#0891b2' },
            { name: 'Annual Leave', color: '#0d9488' },
            { name: 'Sick Leave', color: '#dc2626' },
            { name: 'Business Trip', color: '#6366f1' },
            { name: 'Marriage Leave', color: '#a855f7' },
            { name: 'Bereavement Leave', color: '#64748b' },
            { name: 'Unpaid Leave', color: '#94a3b8' },
            { name: 'Parental Leave', color: '#ec4899' }
        ];

        // Build display time for a shift (template = all periods; flexible = valid window; normal = start–end)
        const getShiftDisplayTime = (shift) => {
            if (shift.shiftType === 'flexible' && shift.validFrom != null && shift.validTo != null) return `${formatTime12(shift.validFrom)} - ${formatTime12(shift.validTo)}`;
            if (shift.periods && shift.periods.length > 0) {
                return shift.periods.map(p => `${formatTime12(p.startTime)} - ${formatTime12(p.endTime)}`).join(', ');
            }
            return `${formatTime12(shift.startTime || '08:00')} - ${formatTime12(shift.endTime || '17:00')}`;
        };

        // Initialize mock reviewer shifts: 3 library shifts + Day Off + 8 leave types + empty; varied per employee/day
        const initReviewerShifts = () => {
            const shifts = allShifts.value.filter(s => s.active !== false);
            if (shifts.length === 0) return;
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const cache = {};
            const nLeaves = summaryLeaveTypes.length;
            // 0,1,2=shifts 3=dayoff 4..(4+nLeaves-1)=leaves (4+nLeaves)=empty
            const varietyBuckets = 4 + nLeaves + 1;

            employeeSchedules.value.forEach((schedule, sIndex) => {
                days.forEach((day, dIndex) => {
                    const key = `${schedule.id}-${day}`;
                    const bucket = (schedule.id * 17 + dIndex * 31 + sIndex * 5) % varietyBuckets;
                    if (bucket <= 2) {
                        const shift = shifts[bucket];
                        cache[key] = { type: 'shift', name: shift.name, time: getShiftDisplayTime(shift), color: shift.color };
                    } else if (bucket === 3) {
                        cache[key] = { type: 'dayoff' };
                    } else if (bucket >= 4 && bucket < 4 + nLeaves) {
                        const leave = summaryLeaveTypes[bucket - 4];
                        cache[key] = { type: 'leave', name: leave.name, color: leave.color };
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
                    scheduleHeatmapInit();
                });
            } else {
                heatmapChartReady.value = false;
                attemptedHeatmapInit.value = false;
                if (heatmapChartInstance) {
                    try { heatmapChartInstance.destroy(); } catch (e) { }
                    heatmapChartInstance = null;
                }
            }
        });

        // Initialize charts based on current tab
        onMounted(() => {
            if (activeTab.value === 'summary') {
                nextTick(() => {
                    initHourlyChart();
                    scheduleHeatmapInit();
                });
            }
        });

        // Get reviewer shift for display (shift library, day off, or leave; use shift library when real assignment)
        const getReviewerShift = (schedule, dayName) => {
            const key = `${schedule.id}-${dayName}`;

            const assignment = scheduleAssignments.value[key];
            if (assignment && assignment.type === 'shift') {
                const shift = assignment.shiftId != null ? getShiftById(assignment.shiftId) : null;
                if (shift) {
                    const time = getShiftDisplayTime(shift);
                    return { type: 'shift', name: shift.name, time, color: shift.color };
                }
                return { type: 'shift', name: assignment.shiftName, time: `${assignment.startTime} - ${assignment.endTime}`, color: assignment.color };
            }

            const cached = reviewerShiftsCache.value[key] || null;
            return cached;
        };

        // Get summary shift for Weekly Shift Summary (same structure as scheduler)
        const getSummaryShift = (schedule, dayName) => {
            const key = `${schedule.id}-${dayName}`;

            const assignment = scheduleAssignments.value[key];
            if (assignment && assignment.type === 'shift') {
                const shift = assignment.shiftId != null ? getShiftById(assignment.shiftId) : null;
                if (shift) {
                    const time = getShiftDisplayTime(shift);
                    const duration = getShiftDuration(shift);
                    return { type: 'shift', name: shift.name, time, duration };
                }
                return { type: 'shift', name: assignment.shiftName, time: `${assignment.startTime} - ${assignment.endTime}`, duration: null };
            }

            const cached = reviewerShiftsCache.value[key] || null;
            if (cached) {
                if (cached.type === 'dayoff') {
                    return { type: 'dayoff', name: 'Day Off' };
                }
                const duration = cached.time ? calculateDurationFromTime(cached.time) : null;
                return { ...cached, duration };
            }
            return null;
        };

        // Calculate duration from time string like "8:00 AM - 5:00 PM"
        const calculateDurationFromTime = (timeStr) => {
            if (!timeStr || !timeStr.includes('-')) return null;
            const parts = timeStr.split('-').map(t => t.trim());
            if (parts.length !== 2) return null;
            try {
                const parseTime = (t) => {
                    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    if (!match) return null;
                    let hours = parseInt(match[1]);
                    const mins = parseInt(match[2]);
                    const period = match[3].toUpperCase();
                    if (period === 'PM' && hours !== 12) hours += 12;
                    if (period === 'AM' && hours === 12) hours = 0;
                    return hours * 60 + mins;
                };
                const start = parseTime(parts[0]);
                const end = parseTime(parts[1]);
                if (start === null || end === null) return null;
                let diff = end - start;
                if (diff < 0) diff += 24 * 60;
                return Math.round(diff / 60);
            } catch {
                return null;
            }
        };

        // Get total hours for a schedule in summary
        const getSummaryTotalHours = (schedule) => {
            let total = 0;
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            days.forEach(day => {
                const shift = getSummaryShift(schedule, day);
                if (shift && shift.type !== 'dayoff' && shift.duration) {
                    total += shift.duration;
                }
            });
            return total;
        };

        // Get shift block class
        const getShiftBlockClass = (schedule, dayName, index) => {
            const shift = getReviewerShift(schedule, dayName);
            if (!shift) return 'empty';
            if (shift.type === 'dayoff') return 'dayoff';
            if (shift.type === 'leave') return 'leave';
            const name = (shift.name || '').toLowerCase();
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
            if (!shift) return {};
            if (shift.type === 'dayoff') return { background: 'rgba(100, 116, 139, 0.2)', color: 'var(--text-color-secondary)' };
            if (shift.color) return { background: shift.color };
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
        const attendanceWeekOffset = ref(0);
        const attendanceDateRange = ref(null);
        const expandedEmployees = ref([]);

        // True when user has selected a date range (only one of range vs week can drive the view)
        const attendanceDateRangeActive = computed(() => {
            const r = attendanceDateRange.value;
            if (!r) return false;
            if (Array.isArray(r)) return r.length >= 2 && r[0] && r[1];
            return !!(r && r.start && r.end);
        });

        // Attendance Week Label
        const attendanceWeekLabel = computed(() => {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (attendanceWeekOffset.value * 7));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()}, ${startOfWeek.getFullYear()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
        });

        const prevAttendanceWeek = () => {
            attendanceDateRange.value = null;
            attendanceDateRangeFilter.value = null;
            attendanceWeekOffset.value -= 1;
        };

        const nextAttendanceWeek = () => {
            attendanceDateRange.value = null;
            attendanceDateRangeFilter.value = null;
            attendanceWeekOffset.value += 1;
        };

        const attendanceDatePickerRef = ref(null);

        const onAttendanceDateRangeChange = () => {
            if (attendanceDateRangeActive.value) attendanceWeekOffset.value = 0;
        };

        const applyAttendanceDateRange = () => {
            if (attendanceDateRangeActive.value) attendanceWeekOffset.value = 0;
            nextTick(() => {
                const el = attendanceDatePickerRef.value?.$el;
                const input = el?.querySelector?.('input');
                if (input) input.blur();
            });
        };

        // Normalize date range to [start, end] (Date objects, start of day)
        const attendanceRangeBounds = computed(() => {
            const r = attendanceDateRange.value;
            if (!attendanceDateRangeActive.value) return null;
            let start, end;
            if (Array.isArray(r)) {
                start = r[0] ? new Date(r[0]) : null;
                end = r[1] ? new Date(r[1]) : null;
            } else if (r && r.start && r.end) {
                start = new Date(r.start);
                end = new Date(r.end);
            } else {
                return null;
            }
            if (!start || !end) return null;
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            if (start > end) [start, end] = [end, start];
            return [start, end];
        });

        // Days to display in the table: either current week (7 days) or date range (N days)
        const attendanceDisplayDays = computed(() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const bounds = attendanceRangeBounds.value;
            if (bounds) {
                const [start, end] = bounds;
                const days = [];
                const dayNamesShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const date = new Date(d);
                    days.push({
                        dayName: dayNamesShort[date.getDay()],
                        date: date.getDate(),
                        dateObj: new Date(date),
                        isToday: date.getTime() === today.getTime()
                    });
                }
                return days;
            }
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (attendanceWeekOffset.value * 7));
            const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
            return dayNames.map((dayName, index) => {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + index);
                return {
                    dayName,
                    date: date.getDate(),
                    dateObj: date,
                    isToday: date.toDateString() === today.toDateString()
                };
            });
        });

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

        // Attendance stat cards config - Row 1 (first 7 cards)
        const attendanceStatCardsRow1 = [
            { key: 'totalStaff', label: 'Total Staff', iconClass: 'blue', icon: 'pi pi-users' },
            { key: 'totalPresent', label: 'Total Present', iconClass: 'green', icon: 'pi pi-check-circle' },
            { key: 'totalAbsent', label: 'Total Absent', iconClass: 'red', icon: 'pi pi-times-circle' },
            { key: 'missingClockIn', label: 'Missing Clock In', iconClass: 'orange', icon: 'pi pi-sign-in' },
            { key: 'missingClockOut', label: 'Missing Clock Out', iconClass: 'orange', icon: 'pi pi-sign-out' },
            { key: 'lateIn', label: 'Total Late In', iconClass: 'red', icon: 'pi pi-clock' },
            { key: 'earlyOut', label: 'Total Early Out', iconClass: 'purple', icon: 'pi pi-arrow-circle-left' }
        ];

        // Attendance stat cards config - Row 2 (remaining 7 cards)
        const attendanceStatCardsRow2 = [
            { key: 'lessEffort', label: 'Total Less Effort', iconClass: 'purple', icon: 'pi pi-chart-line' },
            { key: 'noShiftAssigned', label: 'No Shift Assigned', iconClass: 'gray', icon: 'pi pi-calendar-times' },
            { key: 'outsideWindow', label: 'Outside Window', iconClass: 'orange', icon: 'pi pi-exclamation-triangle' },
            { key: 'businessTrip', label: 'Business Trip', iconClass: 'teal', icon: 'pi pi-briefcase' },
            { key: 'workFromHome', label: 'Work From Home', iconClass: 'blue', icon: 'pi pi-home' },
            { key: 'annualVacation', label: 'Annual Vacation', iconClass: 'purple', icon: 'pi pi-calendar' },
            { key: 'othersType', label: 'Others Type', iconClass: 'gray', icon: 'pi pi-tag' }
        ];

        // Attendance stat cards config - Row 3 (new cards)
        const attendanceStatCardsRow3 = [
            { key: 'totalWorkingHours', label: 'Total Working Hours', iconClass: 'blue', icon: 'pi pi-hourglass' },
            { key: 'lateInWithPermission', label: 'Late In w/ Permission', iconClass: 'teal', icon: 'pi pi-sign-in' },
            { key: 'lateOutWithPermission', label: 'Late Out w/ Permission', iconClass: 'teal', icon: 'pi pi-sign-out' },
            { key: 'offScheduleAttendance', label: 'Off-Schedule Attendance', iconClass: 'orange', icon: 'pi pi-calendar-minus' },
            { key: 'violationRate', label: 'Violation Rate', iconClass: 'red', icon: 'pi pi-percentage' },
            { key: 'missingPunch', label: 'Missing Punch', iconClass: 'orange', icon: 'pi pi-question-circle' },
            { key: 'absentRate', label: 'Absent Rate', iconClass: 'red', icon: 'pi pi-chart-pie' }
        ];

        // Attendance Stats - values aligned with stats.js customPeriod (attendanceStats, punchStats, violationStats, vacationStats)
        const attendanceStats = computed(() => ({
            totalStaff: 450,
            totalPresent: 2410,
            totalAbsent: 95,
            missingClockIn: 38,
            missingClockOut: 29,
            lateIn: 115,
            earlyOut: 32,
            lessEffort: 8,
            noShiftAssigned: 0,
            outsideWindow: 5,
            businessTrip: 18,
            workFromHome: 60,
            annualVacation: 42,
            othersType: 12,
            totalWorkingHours: '3,240h',
            lateInWithPermission: 18,
            lateOutWithPermission: 10,
            offScheduleAttendance: 15,
            violationRate: '4.2%',
            missingPunch: 67,
            absentRate: '2.1%'
        }));

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
                },
                {
                    id: 15, employeeId: 15, name: 'Omar Hassan',
                    department: 'Engineering', deptColor: '#3b82f6', empId: '#501',
                    role: 'VARIABLE DAYS', dayContext: 'Sick Leave',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 16, employeeId: 16, name: 'Layla Mahmoud',
                    department: 'Marketing', deptColor: '#ec4899', empId: '#502',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: '09:00 AM', scheduledEnd: '06:00 PM',
                    actualCheckIn: '9:45 am', actualCheckOut: '5:30 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '7h 45m', violation: 'LATE IN'
                },
                {
                    id: 17, employeeId: 17, name: 'Kareem Ali',
                    department: 'Operations', deptColor: '#f97316', empId: '#503',
                    role: 'VARIABLE DAYS', dayContext: 'Eid Holiday',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 18, employeeId: 18, name: 'Dina Farouk',
                    department: 'HR', deptColor: '#ec4899', empId: '#504',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: '08:00 AM', scheduledEnd: '05:00 PM',
                    actualCheckIn: '8:00 am', actualCheckOut: '3:45 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '7 hours 45m', violation: 'EARLY OUT'
                },
                {
                    id: 19, employeeId: 19, name: 'Youssef Nabil',
                    department: 'Sales', deptColor: '#22c55e', empId: '#505',
                    role: 'VARIABLE DAYS', dayContext: 'Public Holiday',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 20, employeeId: 20, name: 'Nadia Salem',
                    department: 'Finance', deptColor: '#22c55e', empId: '#506',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Template', shiftName: null,
                    scheduledStart: '08:00 AM', scheduledEnd: '12:00 PM',
                    actualCheckIn: '8:15 am', actualCheckOut: '12:30 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '4h 15m', violation: 'LATE IN - EARLY OUT'
                },
                {
                    id: 21, employeeId: 21, name: 'Tariq Rashid',
                    department: 'IT', deptColor: '#ef4444', empId: '#507',
                    role: 'FIXED DAYS', dayContext: 'On Leave',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 22, employeeId: 22, name: 'Hala Ibrahim',
                    department: 'Customer Success', deptColor: '#14b8a6', empId: '#508',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Flexible', shiftName: null,
                    scheduledStart: '09:00 AM', scheduledEnd: '06:00 PM',
                    actualCheckIn: null, actualCheckOut: '6:00 pm',
                    status: 'PRESENT', punchFlag: 'MISSING CLOCK-IN',
                    duration: null, violation: null
                },
                {
                    id: 23, employeeId: 23, name: 'Rami Khalil',
                    department: 'Engineering', deptColor: '#3b82f6', empId: '#509',
                    role: 'VARIABLE DAYS', dayContext: 'Maternity Leave',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 24, employeeId: 24, name: 'Sara Mohamed',
                    department: 'Marketing', deptColor: '#ec4899', empId: '#510',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: '08:00 AM', scheduledEnd: '05:00 PM',
                    actualCheckIn: '7:50 am', actualCheckOut: '4:50 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '9 hours', violation: 'OUTSIDE WINDOW'
                },
                {
                    id: 25, employeeId: 25, name: 'Karim Adel',
                    department: 'Operations', deptColor: '#f97316', empId: '#511',
                    role: 'VARIABLE DAYS', dayContext: 'Unpaid Leave',
                    shiftType: null, shiftName: null,
                    scheduledStart: null, scheduledEnd: null,
                    actualCheckIn: null, actualCheckOut: null,
                    status: null, punchFlag: null,
                    duration: null, violation: null
                },
                {
                    id: 26, employeeId: 26, name: 'Mona Tarek',
                    department: 'Finance', deptColor: '#22c55e', empId: '#512',
                    role: 'VARIABLE DAYS', dayContext: 'Regular Workday',
                    shiftType: 'Normal', shiftName: null,
                    scheduledStart: '08:00 AM', scheduledEnd: '05:00 PM',
                    actualCheckIn: '8:00 am', actualCheckOut: null,
                    status: 'PRESENT', punchFlag: 'MISSING CLOCK-OUT',
                    duration: null, violation: null
                },
                {
                    id: 27, employeeId: 27, name: 'Bassem Fathy',
                    department: 'Sales', deptColor: '#22c55e', empId: '#513',
                    role: 'VARIABLE DAYS', dayContext: 'Work From Home',
                    shiftType: 'Flexible', shiftName: null,
                    scheduledStart: '09:00 AM', scheduledEnd: '06:00 PM',
                    actualCheckIn: '9:10 am', actualCheckOut: '5:45 pm',
                    status: 'PRESENT', punchFlag: 'COMPLETE',
                    duration: '8h 35m', violation: 'LESS EFFORT'
                }
            ];
        });

        // Allowed employee IDs from applied attendance filters (department/section/unit/team)
        const attendanceAllowedEmployeeIds = computed(() => {
            const applied = appliedAttendanceFilters.value;
            if (applied.departmentId == null && applied.sectionId == null && applied.unitId == null && applied.teamId == null) {
                return null; // no filter = all allowed
            }
            const deptName = applied.departmentId != null
                ? (StaticData.departments.find(d => d.id === applied.departmentId) || {}).name
                : null;
            let sectionName = null;
            if (applied.sectionId != null) {
                sectionName = (StaticData.sections.find(s => s.id === applied.sectionId) || {}).name;
            } else if (applied.unitId != null) {
                const unit = StaticData.units.find(u => u.id === applied.unitId);
                sectionName = unit ? (StaticData.sections.find(s => s.id === unit.sectionId) || {}).name : null;
            } else if (applied.teamId != null) {
                const team = StaticData.teams.find(t => t.id === applied.teamId);
                const unit = team ? StaticData.units.find(u => u.id === team.unitId) : null;
                sectionName = unit ? (StaticData.sections.find(s => s.id === unit.sectionId) || {}).name : null;
            }
            const allowed = employees.value.filter(emp => {
                if (deptName != null && emp.department !== deptName) return false;
                if (sectionName != null && emp.section !== sectionName) return false;
                return true;
            });
            return new Set(allowed.map(e => e.id));
        });

        // Filtered attendance logs (by applied department/section/unit/team)
        const filteredAttendanceLogs = computed(() => {
            const allowedIds = attendanceAllowedEmployeeIds.value;
            if (allowedIds === null) return attendanceLogs.value;
            return attendanceLogs.value.filter(log => allowedIds.has(log.employeeId));
        });

        // Total pages (for weekly attendance table = employee rows)
        const totalAttendancePages = computed(() => {
            return Math.max(1, Math.ceil(weeklyAttendance.value.length / attendancePerPage));
        });

        // Paginated attendance
        const paginatedAttendance = computed(() => {
            const start = (attendancePage.value - 1) * attendancePerPage;
            return filteredAttendanceLogs.value.slice(start, start + attendancePerPage);
        });

        // Weekly attendance data - grouped by employee, days from attendanceDisplayDays (week or date range)
        const weeklyAttendance = computed(() => {
            const today = new Date();
            const displayDays = attendanceDisplayDays.value;
            const shiftTypes = ['Normal', 'Flexible', 'Template'];

            // Unique employees from filtered attendance logs (first log per employee for row data)
            const seen = new Set();
            let logsByEmployee = filteredAttendanceLogs.value.filter(log => {
                if (seen.has(log.employeeId)) return false;
                seen.add(log.employeeId);
                return true;
            });
            const nameQuery = (appliedAttendanceSearchName.value || '').toLowerCase();
            if (nameQuery) {
                logsByEmployee = logsByEmployee.filter(log => {
                    const name = (log.name || getEmployeeName(log.employeeId)).toLowerCase();
                    return name.includes(nameQuery);
                });
            }
            const offSchedulePairs = [[1, 6], [2, 5], [4, 6], [6, 5], [9, 6]];
            const offScheduleHolidayPairs = [[3, 4], [7, 2]];
            const offScheduleFirstRowEmployeeIds = [7, 12, 14];
            const employees = logsByEmployee.map(emp => ({
                employeeId: emp.employeeId,
                name: emp.name,
                department: emp.department,
                deptColor: emp.deptColor,
                empId: emp.empId,
                role: emp.role,
                days: displayDays.map((dayInfo, idx) => {
                    const isWeekend = dayInfo.dateObj.getDay() === 0 || dayInfo.dateObj.getDay() === 6;
                    const isFirstDay = idx === 0;
                    const singleLeaveDayIndex = (emp.employeeId % 5) + 1;
                    const isOffScheduleWeekend = offSchedulePairs.some(([eid, didx]) => eid === emp.employeeId && didx === idx);
                    const isOffScheduleHoliday = offScheduleHolidayPairs.some(([eid, didx]) => eid === emp.employeeId && didx === idx);
                    const isOffScheduleFirstRow = isFirstDay && offScheduleFirstRowEmployeeIds.includes(emp.employeeId) && emp.dayContext && emp.dayContext !== 'Regular Workday' && emp.dayContext !== 'Work From Home';
                    let dayContext;
                    if (isFirstDay) {
                        dayContext = isWeekend ? 'Weekend Off' : (emp.dayContext || 'Regular Workday');
                    } else {
                        if (isWeekend) {
                            dayContext = 'Weekend Off';
                        } else if (isOffScheduleHoliday) {
                            dayContext = offScheduleHolidayPairs.findIndex(([eid, didx]) => eid === emp.employeeId && didx === idx) === 0 ? 'Eid Holiday' : 'Public Holiday';
                        } else if (idx === singleLeaveDayIndex) {
                            const leaveTypes = ['Annual Leave', 'Sick Leave', 'Work From Home'];
                            dayContext = leaveTypes[emp.employeeId % leaveTypes.length];
                        } else {
                            dayContext = 'Regular Workday';
                        }
                    }
                    const isOffSchedule = isOffScheduleFirstRow || (isOffScheduleWeekend && isWeekend) || (isOffScheduleHoliday && (dayContext === 'Eid Holiday' || dayContext === 'Public Holiday'));
                    const canPunch = dayContext === 'Regular Workday' || dayContext === 'Work From Home' || isOffSchedule;
                    const shiftType = canPunch ? (emp.shiftType || shiftTypes[emp.employeeId % 3]) : null;
                    const scheduleStart = canPunch ? (emp.scheduledStart || ['08:00 AM', '09:00 AM', '07:00 AM'][emp.employeeId % 3]) : null;
                    const scheduleEnd = canPunch ? (emp.scheduledEnd || ['05:00 PM', '06:00 PM', '10:00 PM'][emp.employeeId % 3]) : null;

                    let actualCheckIn, actualCheckOut, status, punchFlag, duration, violation;
                    if (isOffSchedule) {
                        if (isOffScheduleFirstRow && !emp.actualCheckIn) {
                            actualCheckIn = '8:00 am';
                            actualCheckOut = '5:00 pm';
                            status = 'PRESENT';
                            punchFlag = 'OFF-SCHEDULE ATTENDANCE';
                            duration = '9 hours';
                            violation = null;
                        } else {
                            actualCheckIn = emp.actualCheckIn;
                            actualCheckOut = emp.actualCheckOut;
                            status = emp.status;
                            punchFlag = 'OFF-SCHEDULE ATTENDANCE';
                            duration = emp.duration;
                            violation = emp.violation;
                        }
                    } else if (canPunch) {
                        actualCheckIn = emp.actualCheckIn;
                        actualCheckOut = emp.actualCheckOut;
                        status = emp.status;
                        punchFlag = emp.punchFlag;
                        duration = emp.duration;
                        violation = emp.violation;
                    } else {
                        actualCheckIn = actualCheckOut = status = punchFlag = duration = violation = null;
                    }

                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const fullDateLabel = monthNames[dayInfo.dateObj.getMonth()] + ' ' + dayInfo.dateObj.getDate() + ', ' + dayInfo.dateObj.getFullYear();

                    return {
                        dayName: dayInfo.dayName,
                        date: dayInfo.date,
                        fullDateLabel,
                        isToday: dayInfo.isToday,
                        dayContext,
                        shiftType: isWeekend && !isOffSchedule ? null : shiftType,
                        scheduledStart: isWeekend && !isOffSchedule ? null : scheduleStart,
                        scheduledEnd: isWeekend && !isOffSchedule ? null : scheduleEnd,
                        actualCheckIn,
                        actualCheckOut,
                        status,
                        punchFlag,
                        duration,
                        violation
                    };
                })
            }));

            return employees;
        });

        const collapseAllAttendance = () => {
            expandedEmployees.value = [];
        };

        // Paginated weekly attendance
        const paginatedWeeklyAttendance = computed(() => {
            const start = (attendancePage.value - 1) * attendancePerPage;
            return weeklyAttendance.value.slice(start, start + attendancePerPage);
        });

        const attendanceAllExpanded = computed(() => {
            const visible = paginatedWeeklyAttendance.value;
            if (visible.length === 0) return false;
            return visible.every(e => expandedEmployees.value.includes(e.employeeId));
        });

        const toggleExpandAllAttendance = () => {
            const visibleIds = paginatedWeeklyAttendance.value.map(e => e.employeeId);
            if (attendanceAllExpanded.value) {
                expandedEmployees.value = [];
            } else {
                expandedEmployees.value = [...visibleIds];
            }
        };

        // Toggle employee expand
        const toggleEmployeeExpand = (employeeId) => {
            const idx = expandedEmployees.value.indexOf(employeeId);
            if (idx === -1) {
                expandedEmployees.value.push(employeeId);
            } else {
                expandedEmployees.value.splice(idx, 1);
            }
        };

        // Day context helpers (all scenarios: workday, weekend, leave, sick, holiday, etc.)
        const dayContextConfig = {
            'Regular Workday': { class: 'workday', icon: 'pi pi-sun' },
            'Weekend Off': { class: 'weekend', icon: 'pi pi-moon' },
            'Business Trip': { class: 'business', icon: 'pi pi-briefcase' },
            'Work From Home': { class: 'wfh', icon: 'pi pi-home' },
            'Annual Leave': { class: 'leave', icon: 'pi pi-calendar' },
            'Sick Leave': { class: 'sick', icon: 'pi pi-heart' },
            'On Leave': { class: 'leave', icon: 'pi pi-calendar-minus' },
            'Eid Holiday': { class: 'holiday', icon: 'pi pi-star' },
            'Public Holiday': { class: 'holiday', icon: 'pi pi-flag' },
            'Unpaid Leave': { class: 'leave', icon: 'pi pi-wallet' },
            'Maternity Leave': { class: 'leave', icon: 'pi pi-users' },
            'Paternity Leave': { class: 'leave', icon: 'pi pi-user' },
            'Study Leave': { class: 'leave', icon: 'pi pi-book' },
            'Bereavement Leave': { class: 'leave', icon: 'pi pi-heart' }
        };
        const dayContextOptions = Object.keys(dayContextConfig);

        const getDayContextClass = (context) => {
            if (!context) return '';
            return (dayContextConfig[context] && dayContextConfig[context].class) || 'workday';
        };

        const getDayContextIcon = (context) => {
            if (!context) return 'pi pi-sun';
            return (dayContextConfig[context] && dayContextConfig[context].icon) || 'pi pi-sun';
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
                'MISSING CLOCK-OUT': 'missing',
                'OFF-SCHEDULE ATTENDANCE': 'off-schedule'
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

        const formatTimeForFingerprint = (t) => {
            if (!t || typeof t !== 'string') return '';
            const s = t.trim();
            if (/^\d{1,2}:\d{2}\s*am$/i.test(s)) return s.replace(/\s*am$/i, ' AM');
            if (/^\d{1,2}:\d{2}\s*pm$/i.test(s)) return s.replace(/\s*pm$/i, ' PM');
            if (/^\d{1,2}\s*am$/i.test(s)) return s.replace(/\s*am$/i, ':00 AM');
            if (/^\d{1,2}\s*pm$/i.test(s)) return s.replace(/\s*pm$/i, ':00 PM');
            return s;
        };

        const getFingerprintsForDay = (day, employeeId, dayIndex) => {
            const inTime = day && day.actualCheckIn;
            const outTime = day && day.actualCheckOut;
            if (!inTime && !outTime) return { count: 0, tooltip: '' };
            const inStr = inTime ? formatTimeForFingerprint(inTime) : '';
            const outStr = outTime ? formatTimeForFingerprint(outTime) : '';
            if (inTime && !outTime) {
                return { count: 1, tooltip: `${inStr || '8:00 AM'} - IN` };
            }
            if (!inTime && outTime) {
                return { count: 1, tooltip: `${outStr || '5:00 PM'} - OUT` };
            }
            const base = (employeeId || 0) + (dayIndex || 0);
            const numPrints = 2 + (base % 5) * 2;
            let events = [{ time: inStr, type: 'IN' }];
            if (numPrints >= 4) events.push({ time: '12:00 PM', type: 'OUT' }, { time: '12:30 PM', type: 'IN' });
            if (numPrints >= 6) events.push({ time: '10:00 AM', type: 'OUT' }, { time: '10:15 AM', type: 'IN' });
            if (numPrints >= 8) events.push({ time: '3:00 PM', type: 'OUT' }, { time: '3:10 PM', type: 'IN' });
            if (numPrints >= 10) events.push({ time: '11:00 AM', type: 'OUT' }, { time: '11:10 AM', type: 'IN' });
            events.push({ time: outStr, type: 'OUT' });
            const sortKey = (e) => {
                const m = e.time.match(/(\d+):?(\d*)\s*(AM|PM)/i);
                if (!m) return 0;
                let h = parseInt(m[1], 10);
                const min = parseInt(m[2] || '0', 10);
                const pm = (m[3] || '').toUpperCase() === 'PM';
                if (pm && h < 12) h += 12;
                if (!pm && h === 12) h = 0;
                return h * 60 + min;
            };
            events = [events[0], ...events.slice(1, -1).sort((a, b) => sortKey(a) - sortKey(b)), events[events.length - 1]];
            const tooltip = events.map(e => `${e.time} - ${e.type}`).join('<br/>');
            return { count: events.length, tooltip };
        };

        // Fingerprint Modal
        const showFingerprintModal = ref(false);
        const fingerprintModalData = ref(null);
        const offices = ref([...StaticData.offices]);
        const biometricDevices = ['BIO-001 Main Entrance', 'BIO-002 Side Gate', 'BIO-003 Parking Entry', 'BIO-004 Floor 2', 'BIO-005 Floor 3'];

        const openFingerprintModal = (employee, day, dayIndex) => {
            const inTime = day && day.actualCheckIn;
            const outTime = day && day.actualCheckOut;
            if (!inTime && !outTime) return;

            const inStr = inTime ? formatTimeForFingerprint(inTime) : '';
            const outStr = outTime ? formatTimeForFingerprint(outTime) : '';
            
            const base = (employee.employeeId || 0) + (dayIndex || 0);
            const numPrints = 2 + (base % 5) * 2;
            
            let events = [];
            if (inStr) events.push({ time: inStr, type: 'IN' });
            if (numPrints >= 4) events.push({ time: '12:00 PM', type: 'OUT' }, { time: '12:30 PM', type: 'IN' });
            if (numPrints >= 6) events.push({ time: '10:00 AM', type: 'OUT' }, { time: '10:15 AM', type: 'IN' });
            if (numPrints >= 8) events.push({ time: '3:00 PM', type: 'OUT' }, { time: '3:10 PM', type: 'IN' });
            if (numPrints >= 10) events.push({ time: '11:00 AM', type: 'OUT' }, { time: '11:10 AM', type: 'IN' });
            if (outStr) events.push({ time: outStr, type: 'OUT' });

            const sortKey = (e) => {
                const m = e.time.match(/(\d+):?(\d*)\s*(AM|PM)/i);
                if (!m) return 0;
                let h = parseInt(m[1], 10);
                const min = parseInt(m[2] || '0', 10);
                const pm = (m[3] || '').toUpperCase() === 'PM';
                if (pm && h < 12) h += 12;
                if (!pm && h === 12) h = 0;
                return h * 60 + min;
            };
            events = events.sort((a, b) => sortKey(a) - sortKey(b));

            // Add office and device info to each punch
            const activeOffices = offices.value.filter(o => o.active);
            const punches = events.map((e, idx) => ({
                ...e,
                office: activeOffices[(base + idx) % activeOffices.length]?.name || 'Main Office',
                device: biometricDevices[(base + idx) % biometricDevices.length]
            }));

            fingerprintModalData.value = {
                employeeName: employee.name,
                dayName: day.dayName,
                date: day.dateLabel || '',
                punches
            };
            showFingerprintModal.value = true;
        };

        // Formatted week label
        const weekLabelFormatted = computed(() => {
            const start = new Date(currentWeekStart.value);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            return `${months[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()} - ${months[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
        });

        // First-layer employee IDs (direct reports of the shift scheduler / line manager). When backend exists, derive from reportTo/managerId.
        const firstLayerEmployeeIds = ref([1, 2, 3]);

        // Variable-only schedules (fixed schedule employees are not shown in shift scheduling)
        const variableSchedules = computed(() =>
            employeeSchedules.value.filter(s => s.scheduleType === 'Variable')
        );

        // Filtered employee schedules by layer and search (variable only)
        const filteredEmployeeSchedules = computed(() => {
            let list = variableSchedules.value;
            if (schedulerLayer.value === 'first') {
                list = list.filter(s => firstLayerEmployeeIds.value.includes(s.employeeId));
            }
            if (scheduleSearch.value) {
                const query = scheduleSearch.value.toLowerCase();
                list = list.filter(s =>
                    s.employeeName.toLowerCase().includes(query) ||
                    s.scheduleType.toLowerCase().includes(query)
                );
            }
            return list;
        });

        const schedulePerPage = 10;
        const schedulePage = ref(1);
        const paginatedScheduleList = computed(() => {
            const list = filteredEmployeeSchedules.value;
            const start = (schedulePage.value - 1) * schedulePerPage;
            return list.slice(start, start + schedulePerPage);
        });
        const schedulePageCount = computed(() => Math.max(1, Math.ceil(filteredEmployeeSchedules.value.length / schedulePerPage)));
        const schedulePaginationStart = computed(() => filteredEmployeeSchedules.value.length === 0 ? 0 : (schedulePage.value - 1) * schedulePerPage + 1);
        const schedulePaginationEnd = computed(() => Math.min(schedulePage.value * schedulePerPage, filteredEmployeeSchedules.value.length));

        watch(() => filteredEmployeeSchedules.value.length, () => { schedulePage.value = 1; });
        watch(() => filteredReviewerSchedules.value.length, () => { reviewerPage.value = 1; });
        watch(appliedAttendanceFilters, () => { attendancePage.value = 1; }, { deep: true });
        watch(appliedAttendanceSearchName, () => { attendancePage.value = 1; });
        watch([attendanceDateRange, () => attendanceDisplayDays.value.length], () => { attendancePage.value = 1; });

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
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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

        // Schedule filter dropdowns
        const scheduleFilterDepartment = ref(null);
        const departmentOptions = ref([...StaticData.departments]);
        const applyScheduleFilters = () => {
            console.log('Applying schedule filters');
        };

        const resetScheduleFilters = () => {
            scheduleFilterDepartment.value = null;
            scheduleSearch.value = '';
        };

        const hasScheduleActiveFilters = computed(() => {
            return scheduleFilterDepartment.value || scheduleSearch.value;
        });

        // Schedule stats for top stat cards
        const scheduleStats = computed(() => {
            const totalEmployees = variableSchedules.value.length;
            const totalSlots = totalEmployees * 7;
            let assignedShifts = 0;
            Object.entries(scheduleAssignments.value).forEach(([key, a]) => {
                if (a.type === 'shift') assignedShifts++;
            });
            const totalHours = assignedShifts * 9;
            return {
                totalEmployees,
                assignedShifts,
                unassigned: totalSlots - assignedShifts,
                totalHours: totalHours + 'h',
                pendingChanges: pendingChanges.value.length
            };
        });

        // Scheduler footer stats (variable schedule employees only)
        const schedulerStats = computed(() => {
            const variableIds = new Set(variableSchedules.value.map(s => s.id));
            const totalEmployees = variableSchedules.value.length;
            const totalSlots = totalEmployees * 7;
            let assignedShifts = 0;
            let timeOffs = 0;
            Object.entries(scheduleAssignments.value).forEach(([key, a]) => {
                const scheduleId = parseInt(key.split('-')[0], 10);
                if (!variableIds.has(scheduleId)) return;
                if (a.type === 'shift') assignedShifts++;
                else if (a.type === 'timeoff') timeOffs++;
            });
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
            if (!shift) return 0;
            if (shift.shiftType === 'flexible') return shift.requiredHours;
            if (shift.periods && shift.periods.length > 0) {
                return calculateDuration(shift.periods[0].startTime, shift.periods[0].endTime);
            }
            return calculateDuration(shift.startTime, shift.endTime);
        };

        const getAssignedShiftPeriod = (shift) => {
            if (!shift || shift.shiftType === 'flexible') return null;
            if (shift.periods && shift.periods.length > 0) return shift.periods[0];
            return { startTime: shift.startTime, endTime: shift.endTime, clockIn: shift.clockIn, clockOut: shift.clockOut };
        };

        const getAssignedClockInSummary = (shift) => {
            const period = getAssignedShiftPeriod(shift);
            if (!period || !period.clockIn) return '';
            const wStart = period.clockIn.windowStart || subtractMinutes(period.startTime, 60);
            const wEnd = period.clockIn.windowEnd || addMinutes(period.startTime, 60);
            const late = period.clockIn.lateThreshold || addMinutes(period.startTime, 15);
            return `In: ${formatTime12(wStart)}–${formatTime12(wEnd)} · Late ${formatTime12(late)}`;
        };

        const getAssignedClockOutSummary = (shift) => {
            const period = getAssignedShiftPeriod(shift);
            if (!period || !period.clockOut) return '';
            const wStart = period.clockOut.windowStart || subtractMinutes(period.endTime, 30);
            const wEnd = period.clockOut.windowEnd || addMinutes(period.endTime, 60);
            const early = period.clockOut.earlyThreshold != null ? period.clockOut.earlyThreshold : period.endTime;
            const earlyStr = typeof early === 'string' ? formatTime12(early) : formatTime12(period.endTime);
            return `Out: ${formatTime12(wStart)}–${formatTime12(wEnd)} · Early ${earlyStr}`;
        };

        const getAssignedShiftTimeRange = (shift) => {
            if (!shift) return '';
            if (shift.shiftType === 'flexible') return `${formatTime12(shift.validFrom)} – ${formatTime12(shift.validTo)}`;
            const period = getAssignedShiftPeriod(shift);
            if (!period) return '';
            return `${formatTime12(period.startTime)} – ${formatTime12(period.endTime)}`;
        };

        const getAssignedShiftTooltipContent = (shift) => {
            if (!shift) return '';
            const periodsCount = (shift.periods && shift.periods.length) || 1;
            const periodLabel = periodsCount === 1 ? '1 Period' : `${periodsCount} Periods`;
            const parts = [periodLabel];
            if (shift.shiftType === 'flexible') {
                const validStr = `Valid: ${getAssignedShiftTimeRange(shift)} · ${shift.requiredHours || 0} hrs`;
                parts.push(validStr);
            } else {
                const inStr = getAssignedClockInSummary(shift);
                const outStr = getAssignedClockOutSummary(shift);
                if (inStr) parts.push(inStr);
                if (outStr) parts.push(outStr);
            }
            return parts.join('<br/>');
        };

        // Toggle shift rules display
        const toggleShiftRules = (shiftId) => {
            if (expandedShiftRules.value === shiftId) {
                expandedShiftRules.value = null;
            } else {
                expandedShiftRules.value = shiftId;
            }
        };

        // Toggle assigned shift rules display
        const toggleAssignedShiftRules = (scheduleId, dayName) => {
            const key = `${scheduleId}-${dayName}`;
            const current = { ...expandedAssignedShiftRules.value };
            if (current[key]) {
                delete current[key];
            } else {
                current[key] = true;
            }
            expandedAssignedShiftRules.value = current;
        };

        const isAssignedShiftRulesExpanded = (scheduleId, dayName) => {
            const key = `${scheduleId}-${dayName}`;
            return !!expandedAssignedShiftRules.value[key];
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
            getEmployeeNumber,
            getEmployeeDepartmentPath,
            getShiftName,
            getShiftColor,
            getShiftById,
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
            schedulerLayer,
            pendingChanges,
            showShiftMenu,
            showTemplateSelector,
            shiftMenuPosition,
            templateSearch,
            selectedTemplateId,
            currentScheduleTarget,
            scheduleAssignments,
            filteredEmployeeSchedules,
            paginatedScheduleList,
            schedulePage,
            schedulePageCount,
            schedulePaginationStart,
            schedulePaginationEnd,
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
            getAssignedClockInSummary,
            getAssignedClockOutSummary,
            getAssignedShiftTimeRange,
            getAssignedShiftTooltipContent,
            toggleShiftRules,
            expandedShiftRules,
            toggleAssignedShiftRules,
            isAssignedShiftRulesExpanded,
            expandedAssignedShiftRules,
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
            scheduleStats,
            scheduleFilterDepartment,
            departmentOptions,
            applyScheduleFilters,
            resetScheduleFilters,
            hasScheduleActiveFilters,
            // Weekly Shift Summary
            reviewerTab,
            reviewerSearch,
            reviewerDepartment,
            reviewerSection,
            reviewerUnit,
            reviewerDepartmentOptions,
            reviewerFilteredSections,
            reviewerFilteredUnits,
            onReviewerDepartmentChange,
            onReviewerSectionChange,
            applyReviewerFilters,
            resetReviewerFilters,
            hasReviewerActiveFilters,
            weekLabelShort,
            summaryStats,
            hourlyDistribution,
            hourlyDistributionChart,
            heatmapHours,
            heatmapData,
            heatmapChartReady,
            attemptedHeatmapInit,
            heatmapStats,
            filteredReviewerSchedules,
            paginatedReviewerSchedules,
            reviewerPage,
            reviewerPageCount,
            reviewerPaginationStart,
            reviewerPaginationEnd,
            getReviewerShift,
            getSummaryShift,
            getSummaryTotalHours,
            getShiftBlockClass,
            getShiftBlockStyle,
            getEmployeeCoverage,
            getHeatmapCellClass,
            // Attendance Tab (Revamped)
            attendancePage,
            attendanceWeekOffset,
            attendanceWeekLabel,
            attendanceDateRange,
            attendanceDateRangeActive,
            attendanceDisplayDays,
            onAttendanceDateRangeChange,
            applyAttendanceDateRange,
            attendanceDatePickerRef,
            prevAttendanceWeek,
            nextAttendanceWeek,
            weekDaysAttendance,
            attendanceStatCardsRow1,
            attendanceStatCardsRow2,
            attendanceStatCardsRow3,
            attendanceStats,
            attendanceLogs,
            filteredAttendanceLogs,
            attendanceEntity,
            attendanceEntityOptions,
            attendanceDepartment,
            attendanceSection,
            attendanceUnit,
            attendanceTeam,
            attendanceSearchName,
            attendanceDateRangeFilter,
            onAttendanceDateRangeFilterChange,
            attendanceDepartmentOptions,
            attendanceFilteredSections,
            attendanceFilteredUnits,
            attendanceFilteredTeams,
            onAttendanceDepartmentChange,
            onAttendanceSectionChange,
            onAttendanceUnitChange,
            applyAttendanceFilters,
            resetAttendanceFilters,
            hasAttendanceActiveFilters,
            collapseAllAttendance,
            attendanceAllExpanded,
            toggleExpandAllAttendance,
            totalAttendancePages,
            paginatedAttendance,
            weeklyAttendance,
            paginatedWeeklyAttendance,
            expandedEmployees,
            toggleEmployeeExpand,
            getDayContextClass,
            getDayContextIcon,
            getStatusBadgeClass,
            getPunchFlagClass,
            getViolationClass,
            getFingerprintsForDay,
            showFingerprintModal,
            fingerprintModalData,
            openFingerprintModal,
            // Legacy
            showAssignDialog,
            assignForm,
            openAssignDialog,
            saveAssignment
        };
    }
};

window.ShiftAttendanceComponent = ShiftAttendanceComponent;
