/**
 * Shift & Attendance Component
 * Handles shift scheduling and attendance tracking
 * Inspired by Connecteam's shift scheduling features
 */

const ShiftAttendanceComponent = {
    template: `
        <div class="shift-attendance-page">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="pi pi-calendar"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ shiftTemplates.length }}</div>
                        <div class="stat-label">Shift Templates</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ presentToday }}</div>
                        <div class="stat-label">Present Today</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="pi pi-clock"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ lateToday }}</div>
                        <div class="stat-label">Late Today</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="pi pi-times-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ absentToday }}</div>
                        <div class="stat-label">Absent Today</div>
                    </div>
                </div>
            </div>

            <!-- Main Tabs -->
            <div class="settings-tabs">
                <p-tabs :value="activeTab">
                    <p-tablist>
                        <p-tab value="shifts" @click="activeTab = 'shifts'">
                            <i class="pi pi-list" style="margin-right: 0.5rem;"></i>
                            Shift Templates
                        </p-tab>
                        <p-tab value="schedule" @click="activeTab = 'schedule'">
                            <i class="pi pi-calendar" style="margin-right: 0.5rem;"></i>
                            Weekly Schedule
                        </p-tab>
                        <p-tab value="attendance" @click="activeTab = 'attendance'">
                            <i class="pi pi-clock" style="margin-right: 0.5rem;"></i>
                            Attendance
                        </p-tab>
                    </p-tablist>

                    <p-tabpanels>
                        <!-- Shift Templates Tab -->
                        <p-tabpanel value="shifts">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-list"></i>
                                        Shift Templates
                                    </div>
                                    <div class="card-subtitle">Define fixed and variable shift patterns</div>
                                </div>
                                <p-button label="Add Shift" icon="pi pi-plus" @click="openShiftDialog()"></p-button>
                            </div>

                            <!-- Shift Cards Grid -->
                            <div class="shift-cards-grid">
                                <div v-for="shift in shiftTemplates" :key="shift.id" 
                                     class="shift-card" :style="{ borderLeftColor: shift.color }">
                                    <div class="shift-card-header">
                                        <div class="shift-name">{{ shift.name }}</div>
                                        <div class="shift-type-badge" :class="shift.type.toLowerCase()">
                                            {{ shift.type }}
                                        </div>
                                    </div>
                                    <div class="shift-card-body">
                                        <div class="shift-time" v-if="shift.type === 'Fixed'">
                                            <i class="pi pi-clock"></i>
                                            {{ shift.startTime }} - {{ shift.endTime }}
                                        </div>
                                        <div class="shift-time" v-else>
                                            <i class="pi pi-clock"></i>
                                            Flexible Hours
                                        </div>
                                        <div class="shift-duration">
                                            <i class="pi pi-hourglass"></i>
                                            {{ shift.workingHours }}h working / {{ shift.breakDuration }}m break
                                        </div>
                                    </div>
                                    <div class="shift-card-footer">
                                        <span class="status-tag" :class="shift.active ? 'active' : 'inactive'">
                                            {{ shift.active ? 'Active' : 'Inactive' }}
                                        </span>
                                        <div class="shift-actions">
                                            <button class="action-btn edit" @click="editShift(shift)" title="Edit">
                                                <i class="pi pi-pencil"></i>
                                            </button>
                                            <button class="action-btn delete" @click="deleteShift(shift)" title="Delete">
                                                <i class="pi pi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- Weekly Schedule Tab -->
                        <p-tabpanel value="schedule">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-calendar"></i>
                                        Weekly Schedule
                                    </div>
                                    <div class="card-subtitle">Assign shifts to employees for the week</div>
                                </div>
                                <div style="display: flex; gap: 0.5rem; align-items: center;">
                                    <p-button icon="pi pi-chevron-left" text @click="previousWeek"></p-button>
                                    <span class="week-label">{{ weekLabel }}</span>
                                    <p-button icon="pi pi-chevron-right" text @click="nextWeek"></p-button>
                                    <p-button label="Today" outlined @click="goToToday" style="margin-left: 1rem;"></p-button>
                                </div>
                            </div>

                            <!-- Schedule Grid -->
                            <div class="schedule-container">
                                <table class="schedule-grid">
                                    <thead>
                                        <tr>
                                            <th class="employee-col">Employee</th>
                                            <th v-for="day in weekDays" :key="day.date" 
                                                class="day-col"
                                                :class="{ 'today': isToday(day.date), 'weekend': isWeekend(day.dayName) }">
                                                <div class="day-header">
                                                    <span class="day-name">{{ day.dayName }}</span>
                                                    <span class="day-date">{{ day.dateLabel }}</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="schedule in employeeSchedules" :key="schedule.id">
                                            <td class="employee-col">
                                                <div class="employee-info-cell">
                                                    <img :src="getEmployeeAvatar(schedule.employeeId)" 
                                                         :alt="schedule.employeeName" 
                                                         class="employee-avatar-sm">
                                                    <div>
                                                        <div class="employee-name-sm">{{ schedule.employeeName }}</div>
                                                        <div class="schedule-type-sm">{{ schedule.scheduleType }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td v-for="day in weekDays" :key="day.date"
                                                class="day-col"
                                                :class="{ 'today': isToday(day.date), 'weekend': isWeekend(day.dayName) }">
                                                <div class="shift-cell" 
                                                     @click="openAssignDialog(schedule, day)"
                                                     :class="getShiftCellClass(schedule, day.dayName)">
                                                    <template v-if="schedule.weekSchedule[day.dayName]?.isWorking">
                                                        <div class="shift-pill" 
                                                             :style="{ background: getShiftColor(schedule.weekSchedule[day.dayName].shiftId) }">
                                                            {{ getShiftName(schedule.weekSchedule[day.dayName].shiftId) }}
                                                        </div>
                                                        <div class="shift-time-sm">
                                                            {{ getShiftTime(schedule.weekSchedule[day.dayName].shiftId) }}
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="day-off-pill">
                                                            {{ schedule.weekSchedule[day.dayName]?.dayType === 'weekend' ? 'Weekend' : 'Day Off' }}
                                                        </div>
                                                    </template>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Legend -->
                            <div class="schedule-legend">
                                <div class="legend-title">Shift Legend:</div>
                                <div class="legend-items">
                                    <div v-for="shift in shiftTemplates" :key="shift.id" class="legend-item">
                                        <span class="legend-color" :style="{ background: shift.color }"></span>
                                        <span>{{ shift.name }}</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-color" style="background: #e2e8f0;"></span>
                                        <span>Weekend / Day Off</span>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- Attendance Tab -->
                        <p-tabpanel value="attendance">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-clock"></i>
                                        Attendance Records
                                    </div>
                                    <div class="card-subtitle">Track employee check-ins and attendance status</div>
                                </div>
                                <div style="display: flex; gap: 0.5rem; align-items: center;">
                                    <p-datepicker v-model="selectedDate" dateFormat="dd/mm/yy" showIcon></p-datepicker>
                                    <p-button label="Export" icon="pi pi-download" outlined></p-button>
                                </div>
                            </div>

                            <!-- Filters -->
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                <span class="p-input-icon-left" style="flex: 1;">
                                    <i class="pi pi-search"></i>
                                    <p-inputtext v-model="searchAttendance" placeholder="Search employees..." style="width: 100%;"></p-inputtext>
                                </span>
                                <p-select v-model="filterAttendanceStatus" :options="attendanceStatuses" 
                                          placeholder="All Status" showClear style="width: 180px;"></p-select>
                                <p-select v-model="filterShift" :options="shiftOptions" optionLabel="name" optionValue="id"
                                          placeholder="All Shifts" showClear style="width: 180px;"></p-select>
                            </div>

                            <!-- Attendance Table -->
                            <p-datatable :value="filteredAttendance" striped-rows paginator :rows="10">
                                <p-column header="Employee" sortable>
                                    <template #body="slotProps">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <img :src="getEmployeeAvatar(slotProps.data.employeeId)" 
                                                 :alt="getEmployeeName(slotProps.data.employeeId)" 
                                                 style="width: 36px; height: 36px; border-radius: 50%;">
                                            <div>
                                                <div style="font-weight: 600;">{{ getEmployeeName(slotProps.data.employeeId) }}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-color-secondary);">
                                                    {{ getShiftName(slotProps.data.shiftId) }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Scheduled" sortable>
                                    <template #body="slotProps">
                                        <span v-if="slotProps.data.scheduledStart">
                                            {{ slotProps.data.scheduledStart }} - {{ slotProps.data.scheduledEnd }}
                                        </span>
                                        <span v-else style="color: var(--text-color-secondary);">Flexible</span>
                                    </template>
                                </p-column>
                                <p-column header="Check In" sortable>
                                    <template #body="slotProps">
                                        <span :class="getCheckInClass(slotProps.data)">
                                            {{ slotProps.data.actualCheckIn || '--:--' }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column header="Check Out" sortable>
                                    <template #body="slotProps">
                                        <span>{{ slotProps.data.actualCheckOut || '--:--' }}</span>
                                    </template>
                                </p-column>
                                <p-column field="workingHours" header="Hours" sortable>
                                    <template #body="slotProps">
                                        {{ slotProps.data.workingHours.toFixed(2) }}h
                                    </template>
                                </p-column>
                                <p-column field="overtime" header="OT" sortable>
                                    <template #body="slotProps">
                                        <span v-if="slotProps.data.overtime > 0" style="color: #22c55e;">
                                            +{{ slotProps.data.overtime.toFixed(2) }}h
                                        </span>
                                        <span v-else>-</span>
                                    </template>
                                </p-column>
                                <p-column header="Status" sortable>
                                    <template #body="slotProps">
                                        <span class="status-tag" :class="getAttendanceStatusClass(slotProps.data.status)">
                                            {{ slotProps.data.status }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column header="Actions" style="width: 100px;">
                                    <template #body="slotProps">
                                        <div style="display: flex; gap: 0.25rem;">
                                            <button class="action-btn edit" title="Edit">
                                                <i class="pi pi-pencil"></i>
                                            </button>
                                            <button class="action-btn" title="Notes">
                                                <i class="pi pi-comment"></i>
                                            </button>
                                        </div>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>

            <!-- Add/Edit Shift Dialog -->
            <p-dialog v-model:visible="showShiftDialog" :header="editingShift ? 'Edit Shift' : 'Add Shift'" 
                      :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Shift Name <span class="required">*</span></label>
                        <p-inputtext v-model="shiftForm.name" placeholder="e.g. Morning Shift" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Arabic Name</label>
                        <p-inputtext v-model="shiftForm.nameAr" placeholder="e.g. الوردية الصباحية" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Schedule Type <span class="required">*</span></label>
                        <p-select v-model="shiftForm.type" :options="['Fixed', 'Variable']" 
                                  placeholder="Select type" style="width: 100%;"></p-select>
                    </div>
                    <template v-if="shiftForm.type === 'Fixed'">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Start Time <span class="required">*</span></label>
                                <p-inputtext v-model="shiftForm.startTime" type="time" style="width: 100%;"></p-inputtext>
                            </div>
                            <div class="form-group">
                                <label class="form-label">End Time <span class="required">*</span></label>
                                <p-inputtext v-model="shiftForm.endTime" type="time" style="width: 100%;"></p-inputtext>
                            </div>
                        </div>
                    </template>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Working Hours</label>
                            <p-inputnumber v-model="shiftForm.workingHours" :min="1" :max="24" suffix="h" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Break Duration</label>
                            <p-inputnumber v-model="shiftForm.breakDuration" :min="0" :max="120" suffix=" min" style="width: 100%;"></p-inputnumber>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Color</label>
                        <div class="color-picker-row">
                            <div v-for="color in shiftColors" :key="color" 
                                 class="color-option" 
                                 :class="{ selected: shiftForm.color === color }"
                                 :style="{ background: color }"
                                 @click="shiftForm.color = color">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <p-toggleswitch v-model="shiftForm.active"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Active</label>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" text @click="showShiftDialog = false"></p-button>
                    <p-button :label="editingShift ? 'Update' : 'Create'" icon="pi pi-check" @click="saveShift"></p-button>
                </template>
            </p-dialog>

            <!-- Assign Shift Dialog -->
            <p-dialog v-model:visible="showAssignDialog" header="Assign Shift" :modal="true" :style="{ width: '400px' }">
                <div v-if="assignForm.employee" style="margin-bottom: 1rem;">
                    <strong>{{ assignForm.employee.employeeName }}</strong> - {{ assignForm.dayName }}
                </div>
                <div class="form-group">
                    <label class="form-label">Shift</label>
                    <p-select v-model="assignForm.shiftId" :options="shiftOptions" optionLabel="name" optionValue="id"
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

        // Data
        const shiftTemplates = ref([...StaticData.shiftTemplates]);
        const employeeSchedules = ref([...StaticData.employeeSchedules]);
        const attendanceRecords = ref([...StaticData.attendanceRecords]);
        const employees = ref([...StaticData.employees]);

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

        const shiftOptions = computed(() => shiftTemplates.value.filter(s => s.active));

        const filteredAttendance = computed(() => {
            let result = attendanceRecords.value;

            // Filter by date
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
            const shift = shiftTemplates.value.find(s => s.id === shiftId);
            return shift ? shift.name : '';
        };

        const getShiftColor = (shiftId) => {
            const shift = shiftTemplates.value.find(s => s.id === shiftId);
            return shift ? shift.color : '#e2e8f0';
        };

        const getShiftTime = (shiftId) => {
            const shift = shiftTemplates.value.find(s => s.id === shiftId);
            if (!shift) return '';
            if (shift.type === 'Variable') return 'Flex';
            return `${shift.startTime} - ${shift.endTime}`;
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

        // Shift Dialog
        const showShiftDialog = ref(false);
        const editingShift = ref(null);
        const shiftForm = ref({
            name: '',
            nameAr: '',
            type: 'Fixed',
            startTime: '09:00',
            endTime: '17:00',
            breakDuration: 60,
            workingHours: 8,
            color: '#22c55e',
            active: true
        });

        const shiftColors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444', '#84cc16'];

        const openShiftDialog = (shift = null) => {
            if (shift) {
                editingShift.value = shift;
                shiftForm.value = { ...shift };
            } else {
                editingShift.value = null;
                shiftForm.value = {
                    name: '',
                    nameAr: '',
                    type: 'Fixed',
                    startTime: '09:00',
                    endTime: '17:00',
                    breakDuration: 60,
                    workingHours: 8,
                    color: '#22c55e',
                    active: true
                };
            }
            showShiftDialog.value = true;
        };

        const editShift = (shift) => {
            openShiftDialog(shift);
        };

        const saveShift = () => {
            if (editingShift.value) {
                const index = shiftTemplates.value.findIndex(s => s.id === editingShift.value.id);
                if (index !== -1) {
                    shiftTemplates.value[index] = { ...shiftForm.value, id: editingShift.value.id };
                }
            } else {
                const newId = Math.max(...shiftTemplates.value.map(s => s.id)) + 1;
                shiftTemplates.value.push({ ...shiftForm.value, id: newId });
            }
            showShiftDialog.value = false;
        };

        const deleteShift = (shift) => {
            const index = shiftTemplates.value.findIndex(s => s.id === shift.id);
            if (index !== -1) {
                shiftTemplates.value.splice(index, 1);
            }
        };

        // Assignment Dialog
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
            // Tab
            activeTab,
            // Data
            shiftTemplates,
            employeeSchedules,
            attendanceRecords,
            employees,
            // Week navigation
            weekDays,
            weekLabel,
            previousWeek,
            nextWeek,
            goToToday,
            isToday,
            isWeekend,
            // Stats
            presentToday,
            lateToday,
            absentToday,
            // Attendance
            selectedDate,
            searchAttendance,
            filterAttendanceStatus,
            filterShift,
            attendanceStatuses,
            shiftOptions,
            filteredAttendance,
            // Helpers
            getEmployeeAvatar,
            getEmployeeName,
            getShiftName,
            getShiftColor,
            getShiftTime,
            getShiftCellClass,
            getCheckInClass,
            getAttendanceStatusClass,
            // Shift Dialog
            showShiftDialog,
            editingShift,
            shiftForm,
            shiftColors,
            openShiftDialog,
            editShift,
            saveShift,
            deleteShift,
            // Assignment Dialog
            showAssignDialog,
            assignForm,
            openAssignDialog,
            saveAssignment
        };
    }
};

// Make it available globally
window.ShiftAttendanceComponent = ShiftAttendanceComponent;
