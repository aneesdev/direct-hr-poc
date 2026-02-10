/**
 * My Profile Component
 * Employee self-service profile with multiple tabs
 */

const MyProfileComponent = {
    template: `
        <div class="my-profile-page">
            <!-- Profile Header Card -->
            <div class="profile-header-card">
                <div class="profile-header-content">
                    <img :src="employee.avatar" :alt="employee.name" class="profile-avatar-lg">
                    <div class="profile-header-info">
                        <h1 class="profile-name">{{ employee.name }}</h1>
                        <p class="profile-position">{{ employee.position }}</p>
                        <div class="profile-meta">
                            <span class="profile-badge active">ACTIVE</span>
                            <span class="profile-meta-item"><i class="pi pi-building"></i> {{ employee.department }}</span>
                            <span class="profile-meta-item"><i class="pi pi-calendar"></i> Joined {{ employee.joinDate }}</span>
                            <span class="profile-meta-item"><i class="pi pi-user"></i> Manager: {{ employee.manager }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile Tabs -->
            <div class="profile-tabs-container">
                <div class="profile-tabs">
                    <button class="profile-tab" :class="{ active: activeTab === 'personal' }" @click="activeTab = 'personal'">
                        <i class="pi pi-user"></i> Personal Information
                    </button>
                    <button class="profile-tab" :class="{ active: activeTab === 'job' }" @click="activeTab = 'job'">
                        <i class="pi pi-briefcase"></i> Job Description
                    </button>
                    <button class="profile-tab" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
                        <i class="pi pi-file"></i> Orders
                    </button>
                    <button class="profile-tab" :class="{ active: activeTab === 'splits' }" @click="activeTab = 'splits'">
                        <i class="pi pi-wallet"></i> Splits
                    </button>
                    <button class="profile-tab" :class="{ active: activeTab === 'shift' }" @click="activeTab = 'shift'">
                        <i class="pi pi-calendar"></i> Shift Reviewer
                    </button>
                    <button class="profile-tab" :class="{ active: activeTab === 'attendance' }" @click="activeTab = 'attendance'">
                        <i class="pi pi-clock"></i> Attendance
                    </button>
                    <button class="profile-tab" :class="{ active: activeTab === 'appraisal' }" @click="activeTab = 'appraisal'">
                        <i class="pi pi-chart-bar"></i> Appraisal
                    </button>
                    <button class="profile-tab" :class="{ active: activeTab === 'kpi' }" @click="activeTab = 'kpi'">
                        <i class="pi pi-chart-line"></i> KPI
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div class="profile-tab-content">
                <!-- Personal Information Tab -->
                <div v-if="activeTab === 'personal'" class="tab-panel">
                    <!-- Identity Information -->
                    <div class="info-section">
                        <div class="section-header">
                            <i class="pi pi-user"></i>
                            <span>Identity Information</span>
                        </div>
                        <div class="info-grid">
                            <div class="info-field">
                                <label>EMPLOYEE NUMBER/ID *</label>
                                <div class="field-value">
                                    <i class="pi pi-envelope"></i>
                                    <span>{{ employee.empId }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>ENTITY *</label>
                                <div class="field-value">
                                    <i class="pi pi-building"></i>
                                    <span>{{ employee.entity }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>FIRST NAME *</label>
                                <div class="field-value">
                                    <i class="pi pi-user"></i>
                                    <span>{{ employee.firstName }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>SECOND NAME *</label>
                                <div class="field-value">
                                    <i class="pi pi-user"></i>
                                    <span>{{ employee.secondName }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>FAMILY NAME *</label>
                                <div class="field-value">
                                    <i class="pi pi-user"></i>
                                    <span>{{ employee.familyName }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>DUTY NAME</label>
                                <div class="field-value">
                                    <i class="pi pi-user"></i>
                                    <span>{{ employee.dutyName }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact & Work Details -->
                    <div class="info-section">
                        <div class="section-header">
                            <i class="pi pi-phone"></i>
                            <span>Contact & Work Details</span>
                        </div>
                        <div class="info-grid">
                            <div class="info-field">
                                <label>WORK EMAIL *</label>
                                <div class="field-value">
                                    <i class="pi pi-envelope"></i>
                                    <span>{{ employee.workEmail }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>PERSONAL EMAIL *</label>
                                <div class="field-value">
                                    <i class="pi pi-envelope"></i>
                                    <span>{{ employee.personalEmail }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>MOBILE NUMBER *</label>
                                <div class="field-value">
                                    <i class="pi pi-phone"></i>
                                    <span>{{ employee.mobile }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>COUNTRY OF WORK *</label>
                                <div class="field-value">
                                    <i class="pi pi-globe"></i>
                                    <span>{{ employee.countryOfWork }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Personal Profile -->
                    <div class="info-section">
                        <div class="section-header">
                            <i class="pi pi-heart"></i>
                            <span>Personal Profile</span>
                        </div>
                        <div class="info-grid">
                            <div class="info-field">
                                <label>NATIONALITY *</label>
                                <div class="field-value">
                                    <i class="pi pi-flag"></i>
                                    <span>{{ employee.nationality }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>GENDER *</label>
                                <div class="field-value">
                                    <i class="pi pi-user"></i>
                                    <span>{{ employee.gender }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>MARITAL STATUS</label>
                                <div class="field-value">
                                    <i class="pi pi-heart"></i>
                                    <span>{{ employee.maritalStatus }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>DATE OF BIRTH *</label>
                                <div class="field-value">
                                    <i class="pi pi-calendar"></i>
                                    <span>{{ employee.dateOfBirth }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Identity Documents -->
                    <div class="info-section">
                        <div class="section-header">
                            <i class="pi pi-folder"></i>
                            <span>Identity Documents</span>
                        </div>
                        <div class="documents-grid">
                            <div class="document-item" :class="{ uploaded: doc.uploaded }" v-for="doc in employee.documents" :key="doc.name">
                                <div class="doc-icon" :class="{ uploaded: doc.uploaded }">
                                    <i :class="doc.uploaded ? 'pi pi-file-pdf' : 'pi pi-cloud-upload'"></i>
                                </div>
                                <div class="doc-info">
                                    <label>{{ doc.label }}</label>
                                    <span class="doc-status">{{ doc.uploaded ? 'Uploaded' : 'Not Chosen' }}</span>
                                </div>
                                <button v-if="doc.uploaded" class="doc-download-btn">
                                    <i class="pi pi-download"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Emergency Contact -->
                    <div class="emergency-contact-card">
                        <div class="emergency-icon">
                            <i class="pi pi-phone"></i>
                        </div>
                        <div class="emergency-info">
                            <div class="emergency-label">EMERGENCY CONTACT</div>
                            <div class="emergency-name">{{ employee.emergencyContact.name }}</div>
                            <div class="emergency-relation">{{ employee.emergencyContact.relation }} • {{ employee.emergencyContact.phone }}</div>
                        </div>
                        <button class="manage-emergency-btn">Manage Emergency Contacts</button>
                    </div>
                </div>

                <!-- Job Description Tab -->
                <div v-if="activeTab === 'job'" class="tab-panel">
                    <!-- Organizational Hierarchy -->
                    <div class="info-section">
                        <div class="section-header orange">
                            <i class="pi pi-sitemap"></i>
                            <span>Organizational Hierarchy</span>
                        </div>
                        <div class="hierarchy-grid">
                            <div class="hierarchy-item">
                                <label>DEPARTMENT *</label>
                                <div class="hierarchy-value">
                                    <i class="pi pi-briefcase"></i>
                                    <span>{{ jobInfo.department }}</span>
                                </div>
                            </div>
                            <div class="hierarchy-item">
                                <label>SECTION</label>
                                <div class="hierarchy-value">
                                    <i class="pi pi-th-large"></i>
                                    <span>{{ jobInfo.section }}</span>
                                </div>
                            </div>
                            <div class="hierarchy-item">
                                <label>UNIT</label>
                                <div class="hierarchy-value">
                                    <i class="pi pi-users"></i>
                                    <span>{{ jobInfo.unit }}</span>
                                </div>
                            </div>
                            <div class="hierarchy-item highlighted">
                                <label>TEAM</label>
                                <div class="hierarchy-value highlighted">
                                    <i class="pi pi-users"></i>
                                    <span>{{ jobInfo.team }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Grade & Position -->
                    <div class="info-section">
                        <div class="section-header">
                            <i class="pi pi-star"></i>
                            <span>Grade & Position</span>
                        </div>
                        <div class="info-grid">
                            <div class="info-field">
                                <label>MAIN GRADE *</label>
                                <div class="field-value">
                                    <i class="pi pi-star"></i>
                                    <span>{{ jobInfo.mainGrade }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>SUB GRADE *</label>
                                <div class="field-value">
                                    <i class="pi pi-star"></i>
                                    <span>{{ jobInfo.subGrade }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>JOB TITLE *</label>
                                <div class="field-value">
                                    <i class="pi pi-briefcase"></i>
                                    <span>{{ jobInfo.jobTitle }}</span>
                                </div>
                            </div>
                            <div class="info-field">
                                <label>LINE MANAGER</label>
                                <div class="field-value">
                                    <i class="pi pi-user"></i>
                                    <span>{{ jobInfo.lineManager }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Current Primary Role -->
                    <div class="role-card">
                        <div class="role-label">CURRENT PRIMARY ROLE</div>
                        <div class="role-title">{{ jobInfo.primaryRole }}</div>
                    </div>

                    <!-- Job Description -->
                    <div class="job-description-card">
                        <div class="jd-header">JOB DESCRIPTION</div>
                        <div class="jd-content">
                            <p v-for="(para, idx) in jobInfo.jobDescription" :key="idx">{{ para }}</p>
                        </div>
                    </div>

                    <!-- Verification Note -->
                    <div class="verification-note">
                        <i class="pi pi-check-circle"></i>
                        <span>This job profile and organizational mapping was last verified on {{ jobInfo.lastVerified }}. Updates require departmental head approval.</span>
                    </div>
                </div>

                <!-- Orders Tab -->
                <div v-if="activeTab === 'orders'" class="tab-panel">
                    <!-- Stats Cards -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon blue">
                                <i class="pi pi-list"></i>
                            </div>
                            <div>
                                <div class="stat-value">{{ orders.length }}</div>
                                <div class="stat-label">Total Requests</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon orange">
                                <i class="pi pi-clock"></i>
                            </div>
                            <div>
                                <div class="stat-value">{{ ordersPending }}</div>
                                <div class="stat-label">Pending</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon green">
                                <i class="pi pi-check-circle"></i>
                            </div>
                            <div>
                                <div class="stat-value">{{ ordersApproved }}</div>
                                <div class="stat-label">Approved</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon purple">
                                <i class="pi pi-eye"></i>
                            </div>
                            <div>
                                <div class="stat-value">{{ ordersInReview }}</div>
                                <div class="stat-label">In Review</div>
                            </div>
                        </div>
                    </div>

                    <!-- Orders Table -->
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <div class="card-title">
                                    <i class="pi pi-inbox"></i>
                                    All Requests
                                </div>
                                <div class="card-subtitle">View and manage all submitted requests</div>
                            </div>
                            <p-button label="New Request" icon="pi pi-plus"></p-button>
                        </div>

                        <!-- Filters -->
                        <div class="request-filters">
                            <div class="filter-tabs">
                                <button class="filter-tab" :class="{ active: ordersFilter === null }" @click="ordersFilter = null">
                                    All <span class="filter-count">{{ orders.length }}</span>
                                </button>
                                <button class="filter-tab" :class="{ active: ordersFilter === 'pending' }" @click="ordersFilter = 'pending'">
                                    Pending <span class="filter-count">{{ ordersPending }}</span>
                                </button>
                                <button class="filter-tab" :class="{ active: ordersFilter === 'in_review' }" @click="ordersFilter = 'in_review'">
                                    In Review <span class="filter-count">{{ ordersInReview }}</span>
                                </button>
                                <button class="filter-tab" :class="{ active: ordersFilter === 'approved' }" @click="ordersFilter = 'approved'">
                                    Approved <span class="filter-count">{{ ordersApproved }}</span>
                                </button>
                                <button class="filter-tab" :class="{ active: ordersFilter === 'rejected' }" @click="ordersFilter = 'rejected'">
                                    Rejected <span class="filter-count">{{ ordersRejected }}</span>
                                </button>
                            </div>
                        </div>

                        <p-datatable :value="filteredOrders" stripedRows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]">
                            <p-column header="Request" sortable>
                                <template #body="slotProps">
                                    <div class="request-cell">
                                        <div class="request-type-badge" :style="{ background: slotProps.data.color + '15', color: slotProps.data.color }">
                                            <i :class="'pi ' + slotProps.data.icon"></i>
                                        </div>
                                        <div>
                                            <div class="request-type-name">{{ slotProps.data.typeName }}</div>
                                            <div class="request-id">{{ slotProps.data.id }}</div>
                                        </div>
                                    </div>
                                </template>
                            </p-column>
                            <p-column header="Employee" sortable>
                                <template #body="slotProps">
                                    <div class="employee-cell-small">
                                        <img :src="slotProps.data.employeeAvatar" class="emp-avatar-sm">
                                        <div>
                                            <div class="emp-name-sm">{{ slotProps.data.employeeName }}</div>
                                            <div class="emp-dept-sm">{{ slotProps.data.employeeDept }}</div>
                                        </div>
                                    </div>
                                </template>
                            </p-column>
                            <p-column field="submitted" header="Submitted" sortable>
                                <template #body="slotProps">
                                    <div>
                                        <div>{{ slotProps.data.submitted }}</div>
                                        <div class="text-muted">{{ slotProps.data.submittedAgo }}</div>
                                    </div>
                                </template>
                            </p-column>
                            <p-column header="Current Step">
                                <template #body="slotProps">
                                    <div class="step-info">
                                        <i class="pi pi-user"></i>
                                        <span>{{ slotProps.data.currentStep }}</span>
                                    </div>
                                </template>
                            </p-column>
                            <p-column header="Status" sortable>
                                <template #body="slotProps">
                                    <span class="status-tag" :class="slotProps.data.status.toLowerCase().replace(' ', '-')">
                                        {{ slotProps.data.status }}
                                    </span>
                                </template>
                            </p-column>
                        </p-datatable>
                    </div>
                </div>

                <!-- Splits Tab -->
                <div v-if="activeTab === 'splits'" class="tab-panel">
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <div class="card-title">Payroll & Splits</div>
                                <div class="card-subtitle">Overview of your monthly earnings and deductions</div>
                            </div>
                            <p-button label="Export Statement" icon="pi pi-download" severity="warning" outlined></p-button>
                        </div>

                        <div class="splits-table-container">
                            <table class="splits-table">
                                <thead>
                                    <tr>
                                        <th>MONTH & PAYMENT DATE</th>
                                        <th>BASIC SALARY</th>
                                        <th>ACCOMMODATION</th>
                                        <th>TRANSPORTATION</th>
                                        <th>OTHER ALLOWANCE</th>
                                        <th class="highlight-col">COMMISSION</th>
                                        <th class="highlight-col">OVERTIME</th>
                                        <th class="highlight-col">OTHERS ADDITION</th>
                                        <th>GROSS PAY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="split in payrollSplits" :key="split.month">
                                        <td class="month-cell">
                                            <div class="month-name">{{ split.month }}</div>
                                            <div class="payment-date">Paid: {{ split.paymentDate }}</div>
                                            <span class="paid-badge">PAID</span>
                                        </td>
                                        <td>{{ formatCurrency(split.basicSalary) }}</td>
                                        <td>{{ formatCurrency(split.accommodation) }}</td>
                                        <td>{{ formatCurrency(split.transportation) }}</td>
                                        <td>{{ formatCurrency(split.otherAllowance) }}</td>
                                        <td class="highlight-col">
                                            <span class="addition-value" :class="{ 'has-value': split.commission > 0 }">{{ formatCurrency(split.commission) }}</span>
                                        </td>
                                        <td class="highlight-col">
                                            <span class="addition-value" :class="{ 'has-value': split.overtime > 0 }">{{ formatCurrency(split.overtime) }}</span>
                                        </td>
                                        <td class="highlight-col">
                                            <span class="addition-value" :class="{ 'has-value': split.othersAddition > 0 }">{{ formatCurrency(split.othersAddition) }}</span>
                                        </td>
                                        <td class="gross-pay">{{ formatCurrency(split.grossPay) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Progress Bar -->
                        <div class="salary-progress-bar">
                            <div class="progress-fill" style="width: 75%;"></div>
                        </div>
                    </div>
                </div>

                <!-- Shift Reviewer Tab -->
                <div v-if="activeTab === 'shift'" class="tab-panel">
                    <div class="shift-reviewer-card">
                        <!-- Week Filter Header -->
                        <div class="filter-controls-bar">
                            <div class="filter-controls-right" style="margin-left: auto;">
                                <div class="week-selector-pill">
                                    <button class="week-nav-btn" @click="previousShiftWeek"><i class="pi pi-chevron-left"></i></button>
                                    <span class="week-range-label">{{ shiftWeekLabel }}</span>
                                    <button class="week-nav-btn" @click="nextShiftWeek"><i class="pi pi-chevron-right"></i></button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Reviewer Grid -->
                        <div class="reviewer-grid-container">
                            <table class="reviewer-grid">
                                <thead>
                                    <tr>
                                        <th class="employee-col-rev">EMPLOYEE</th>
                                        <th v-for="day in shiftWeekDays" :key="day.dayName" class="day-col-rev">
                                            <div class="day-header-rev">
                                                <span class="day-name-rev">{{ day.dayName }}</span>
                                                <span class="day-num-rev">{{ day.date }}</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="schedule in myShiftSchedule" :key="schedule.id">
                                        <td class="employee-col-rev">
                                            <div class="employee-info-rev">
                                                <img :src="schedule.avatar" :alt="schedule.name" class="avatar-rev">
                                                <div class="employee-details-rev">
                                                    <div class="employee-name-rev">{{ schedule.name }}</div>
                                                    <div class="employee-role-rev">{{ schedule.type }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td v-for="day in shiftWeekDays" :key="day.dayName" class="day-col-rev">
                                            <div class="shift-block" 
                                                 :style="getShiftBlockStyle(schedule, day.dayName)"
                                                 v-if="getShiftForDay(schedule, day.dayName)">
                                                <div class="shift-block-name">{{ getShiftForDay(schedule, day.dayName).name }}</div>
                                                <div class="shift-block-time">{{ getShiftForDay(schedule, day.dayName).time }}</div>
                                            </div>
                                            <span v-else class="no-shift">-</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Shift Legend -->
                        <div class="shift-legend">
                            <span class="legend-item"><span class="legend-dot mid-day"></span> Mid-day</span>
                            <span class="legend-item"><span class="legend-dot evening"></span> Evening</span>
                            <span class="legend-item"><span class="legend-dot night"></span> Night</span>
                            <span class="legend-item"><span class="legend-dot morning"></span> Morning</span>
                        </div>
                    </div>
                </div>

                <!-- Attendance Tab -->
                <div v-if="activeTab === 'attendance'" class="tab-panel">
                    <div class="attendance-logs-card">
                        <div class="logs-header">
                            <h3>ATTENDANCE LOGS</h3>
                            <div class="logs-actions">
                                <div class="week-selector-pill">
                                    <button class="week-nav-btn" @click="prevAttendanceWeek"><i class="pi pi-chevron-left"></i></button>
                                    <span class="week-range-label">{{ attendanceWeekLabel }}</span>
                                    <button class="week-nav-btn" @click="nextAttendanceWeek"><i class="pi pi-chevron-right"></i></button>
                                </div>
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
                                    <!-- Main row (first day - Monday) -->
                                    <tr class="main-row" :class="{ 'expanded': isAttendanceExpanded }" @click="isAttendanceExpanded = !isAttendanceExpanded">
                                        <td class="col-expand">
                                            <button class="expand-btn">
                                                <i :class="isAttendanceExpanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></i>
                                            </button>
                                        </td>
                                        <td class="col-employee">
                                            <div class="employee-cell">
                                                <div class="emp-avatar-initial" :style="{ background: '#22c55e' }">
                                                    S
                                                </div>
                                                <div class="emp-info">
                                                    <div class="emp-name">Saeed</div>
                                                    <div class="emp-dept">
                                                        <span class="dept-name" style="color: #22c55e;">IT</span>
                                                        <span class="emp-id">#111</span>
                                                    </div>
                                                    <div class="emp-role">FIXED DAYS</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="col-day">
                                            <span class="day-label-att">{{ myAttendance[0].dayName }}</span>
                                            <span class="day-date-small">{{ myAttendance[0].date }}</span>
                                        </td>
                                        <td class="col-context">
                                            <div class="context-cell" :class="getDayContextClass(myAttendance[0].dayContext)">
                                                <i :class="getDayContextIcon(myAttendance[0].dayContext)"></i>
                                                <span>{{ myAttendance[0].dayContext }}</span>
                                            </div>
                                        </td>
                                        <td class="col-shift">
                                            <div v-if="myAttendance[0].shift" class="shift-cell-content">
                                                <span class="shift-type-label">{{ myAttendance[0].shift }}</span>
                                                <span class="shift-time-range">{{ myAttendance[0].shiftTime }}</span>
                                            </div>
                                            <span v-else class="no-data">---</span>
                                        </td>
                                        <td class="col-in">
                                            <span v-if="myAttendance[0].checkIn" class="time-value">{{ myAttendance[0].checkIn }}</span>
                                            <span v-else class="no-data">---</span>
                                        </td>
                                        <td class="col-out">
                                            <span v-if="myAttendance[0].checkOut" class="time-value">{{ myAttendance[0].checkOut }}</span>
                                            <span v-else class="no-data">---</span>
                                        </td>
                                        <td class="col-status">
                                            <span v-if="myAttendance[0].status" class="status-badge" :class="getStatusBadgeClass(myAttendance[0].status)">{{ myAttendance[0].status }}</span>
                                            <span v-else class="no-data">---</span>
                                        </td>
                                        <td class="col-punch">
                                            <span class="punch-flag" :class="getPunchFlagClass(myAttendance[0].punchFlag)">{{ myAttendance[0].punchFlag || '---' }}</span>
                                        </td>
                                        <td class="col-duration">
                                            <span v-if="myAttendance[0].duration" class="duration-value">{{ myAttendance[0].duration }}</span>
                                            <span v-else class="no-data">---</span>
                                        </td>
                                        <td class="col-violation">
                                            <span v-if="myAttendance[0].violation" class="violation-badge" :class="getViolationClass(myAttendance[0].violation)">{{ myAttendance[0].violation }}</span>
                                            <span v-else class="no-data">---</span>
                                        </td>
                                    </tr>
                                    <!-- Expanded rows (other days) -->
                                    <template v-if="isAttendanceExpanded">
                                        <tr v-for="(day, idx) in myAttendance.slice(1)" :key="idx" class="expanded-row">
                                            <td class="col-expand"></td>
                                            <td class="col-employee"></td>
                                            <td class="col-day">
                                                <span class="day-label-att" :class="{ 'today': day.isToday }">{{ day.dayName }}</span>
                                                <span class="day-date-small">{{ day.date }}</span>
                                            </td>
                                            <td class="col-context">
                                                <div class="context-cell" :class="getDayContextClass(day.dayContext)">
                                                    <i :class="getDayContextIcon(day.dayContext)"></i>
                                                    <span>{{ day.dayContext }}</span>
                                                </div>
                                            </td>
                                            <td class="col-shift">
                                                <div v-if="day.shift" class="shift-cell-content">
                                                    <span class="shift-type-label">{{ day.shift }}</span>
                                                    <span class="shift-time-range">{{ day.shiftTime }}</span>
                                                </div>
                                                <span v-else class="no-data">---</span>
                                            </td>
                                            <td class="col-in">
                                                <span v-if="day.checkIn" class="time-value">{{ day.checkIn }}</span>
                                                <span v-else class="no-data">---</span>
                                            </td>
                                            <td class="col-out">
                                                <span v-if="day.checkOut" class="time-value">{{ day.checkOut }}</span>
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
                                </tbody>
                            </table>
                        </div>

                        <!-- Reminder Note -->
                        <div class="attendance-reminder">
                            <i class="pi pi-exclamation-triangle"></i>
                            <span>Attendance Policy Reminder: Please ensure all "Missing Clock-out" flags are resolved by submitting a manual punch request. Repeated missing punches may affect your monthly splits calculation.</span>
                        </div>
                    </div>
                </div>

                <!-- Appraisal Tab -->
                <div v-if="activeTab === 'appraisal'" class="tab-panel">
                    <div class="appraisal-year-tabs">
                        <button class="year-tab" :class="{ active: appraisalYear === 'current' }" @click="appraisalYear = 'current'">
                            <i class="pi pi-th-large"></i> This Year
                        </button>
                        <button class="year-tab" :class="{ active: appraisalYear === 'previous' }" @click="appraisalYear = 'previous'">
                            <i class="pi pi-history"></i> Previous Years
                        </button>
                    </div>

                    <!-- This Year Table (Same as appraisal-tracking) -->
                    <div v-if="appraisalYear === 'current'" class="card">
                        <p-datatable :value="myAppraisals" stripedRows>
                            <p-column header="Employee Info" sortable>
                                <template #body="slotProps">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <img :src="slotProps.data.avatar" :alt="slotProps.data.name" style="width: 40px; height: 40px; border-radius: 50%;">
                                        <div>
                                            <div style="font-weight: 600;">{{ slotProps.data.name }}</div>
                                            <div style="font-size: 0.8rem; color: var(--text-color-secondary);">{{ slotProps.data.empId }} • {{ slotProps.data.department }}</div>
                                        </div>
                                    </div>
                                </template>
                            </p-column>
                            <p-column header="Appraisal Cycle" sortable>
                                <template #body="slotProps">
                                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                                        <i class="pi pi-calendar" style="color: var(--text-color-secondary);"></i>
                                        <span>{{ slotProps.data.cycle }}</span>
                                    </div>
                                </template>
                            </p-column>
                            <p-column header="Reviewers">
                                <template #body="slotProps">
                                    <div>
                                        <div v-for="reviewer in slotProps.data.reviewers" :key="reviewer" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                            <span style="width: 6px; height: 6px; border-radius: 50%; background: #3b82f6;"></span>
                                            <span style="font-size: 0.85rem;">{{ reviewer }}</span>
                                        </div>
                                    </div>
                                </template>
                            </p-column>
                            <p-column header="Grade & Weights" sortable>
                                <template #body="slotProps">
                                    <div>
                                        <div style="font-weight: 600;">{{ slotProps.data.grade }}</div>
                                        <div style="font-size: 0.75rem; color: var(--text-color-secondary);">
                                            C: {{ slotProps.data.weights.c }}% 
                                            P: {{ slotProps.data.weights.p }}% 
                                            K: {{ slotProps.data.weights.k }}%
                                        </div>
                                    </div>
                                </template>
                            </p-column>
                            <p-column header="Status" style="width: 260px;">
                                <template #body="slotProps">
                                    <span class="appraisal-status-btn" :class="slotProps.data.statusClass">
                                        {{ slotProps.data.status }}
                                    </span>
                                </template>
                            </p-column>
                        </p-datatable>
                    </div>

                    <!-- Previous Years Table (Same as appraisal-results) -->
                    <div v-if="appraisalYear === 'previous'" class="card">
                        <p-datatable :value="previousAppraisals" stripedRows>
                            <p-column header="Employee" sortable>
                                <template #body="slotProps">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <img :src="slotProps.data.avatar" :alt="slotProps.data.name" style="width: 40px; height: 40px; border-radius: 50%;">
                                        <div>
                                            <div style="font-weight: 600;">{{ slotProps.data.name }}</div>
                                            <div style="font-size: 0.8rem; color: var(--text-color-secondary);">{{ slotProps.data.empId }}</div>
                                        </div>
                                    </div>
                                </template>
                            </p-column>
                            <p-column header="Cycle" sortable>
                                <template #body="slotProps">
                                    <span style="font-size: 0.85rem;">{{ slotProps.data.cycle }}</span>
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
                                    <span class="performance-tag" :class="slotProps.data.ratingClass">{{ slotProps.data.rating }}</span>
                                </template>
                            </p-column>
                            <p-column header="Evaluator" sortable>
                                <template #body="slotProps">
                                    <span style="font-size: 0.85rem;">{{ slotProps.data.evaluator }}</span>
                                </template>
                            </p-column>
                            <p-column header="Action" style="width: 80px; text-align: center;">
                                <template #body="slotProps">
                                    <p-button icon="pi pi-file" severity="warning" text rounded></p-button>
                                </template>
                            </p-column>
                        </p-datatable>
                    </div>
                </div>

                <!-- KPI Tab -->
                <div v-if="activeTab === 'kpi'" class="tab-panel">
                    <div class="coming-soon-container">
                        <div class="coming-soon-icon">
                            <i class="pi pi-clock"></i>
                        </div>
                        <h2>SOON</h2>
                        <p>This section is under development</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        const { ref, computed, onMounted } = Vue;

        const activeTab = ref('personal');
        const ordersFilter = ref(null);
        const appraisalYear = ref('current');
        const shiftWeekOffset = ref(0);
        const attendanceWeekOffset = ref(0);

        // Employee Data
        const employee = ref({
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            name: 'Mohammed Soliman Alsoliman',
            position: 'Senior Software Engineer',
            department: 'Product Engineering',
            joinDate: 'Jan 12, 2022',
            manager: 'Sarah Jenkins',
            empId: '005',
            entity: 'Direct',
            firstName: 'Mohammed',
            secondName: 'Soliman',
            familyName: 'Alsoliman',
            dutyName: 'Abu Mishal',
            workEmail: 'employee@company.com',
            personalEmail: 'atb@hotmail.com',
            mobile: '966555132381',
            countryOfWork: 'Saudi Arabia',
            nationality: 'Saudi',
            gender: 'Male',
            maritalStatus: 'Single',
            dateOfBirth: 'Jan 01, 1990',
            deptColor: '#f97316',
            documents: [
                { label: 'CV *', uploaded: true },
                { label: 'NATIONAL ID DOCUMENT *', uploaded: true },
                { label: 'PASSPORT', uploaded: false }
            ],
            emergencyContact: {
                name: 'Sara Al-Farsi',
                relation: 'Sister',
                phone: '+966 55 387 6543'
            }
        });

        // Job Info
        const jobInfo = ref({
            department: 'Engineering',
            section: 'Software Development',
            unit: 'Frontend Team',
            team: 'React Developers',
            mainGrade: 'Management',
            subGrade: 'Manager',
            jobTitle: 'Senior Software Engineer',
            lineManager: 'Sarah Jenkins',
            primaryRole: 'Senior Software Engineer',
            jobDescription: [
                'As a Senior Software Engineer in the Frontend Team, you are responsible for architecting and implementing sophisticated web interfaces using React and modern ecosystem tools. You serve as a technical lead, ensuring high performance, responsiveness, and accessibility across all platform modules.',
                'Key duties include translating complex business requirements into scalable technical solutions, conducting thorough code reviews to maintain quality standards, and mentoring junior developers within the Engineering department. You are expected to collaborate closely with product owners and UX designers to deliver a world-class user experience.',
                'Success in this role requires deep expertise in TypeScript, React, and state management, along with a strong commitment to clean code principles and continuous integration workflows.'
            ],
            lastVerified: 'January 15, 2024'
        });

        // Orders Data
        const orders = ref([
            { id: 'REQ-001', typeName: 'Annual Leave', icon: 'pi-calendar', color: '#3b82f6', employeeAvatar: 'https://i.pravatar.cc/40?img=10', employeeName: 'Ahmed Hassan', employeeDept: 'Engineering', submitted: '20 Jan 2026', submittedAgo: '18 days ago', currentStep: 'Line Manager', status: 'Pending' },
            { id: 'REQ-002', typeName: 'Sick Leave', icon: 'pi-heart', color: '#ef4444', employeeAvatar: 'https://i.pravatar.cc/40?img=11', employeeName: 'Sara Omar', employeeDept: 'Human Resources', submitted: '18 Jan 2026', submittedAgo: '21 days ago', currentStep: 'Completed', status: 'Approved' },
            { id: 'REQ-003', typeName: 'Annual Leave', icon: 'pi-calendar', color: '#3b82f6', employeeAvatar: 'https://i.pravatar.cc/40?img=12', employeeName: 'Mohammed Al-Rashid', employeeDept: 'Finance', submitted: '15 Jan 2026', submittedAgo: '24 days ago', currentStep: 'Completed', status: 'Rejected' },
            { id: 'REQ-004', typeName: 'Business Trip', icon: 'pi-send', color: '#8b5cf6', employeeAvatar: 'https://i.pravatar.cc/40?img=10', employeeName: 'Ahmed Hassan', employeeDept: 'Engineering', submitted: '15 Jan 2026', submittedAgo: '19 days ago', currentStep: 'HR Administrator', status: 'In Review' },
            { id: 'REQ-005', typeName: 'Work From Home', icon: 'pi-home', color: '#10b981', employeeAvatar: 'https://i.pravatar.cc/40?img=13', employeeName: 'Fatima Ibrahim', employeeDept: 'Engineering', submitted: '20 Jan 2026', submittedAgo: '18 days ago', currentStep: 'Line Manager', status: 'Pending' },
            { id: 'REQ-006', typeName: 'Experience Letter', icon: 'pi-file', color: '#f59e0b', employeeAvatar: 'https://i.pravatar.cc/40?img=14', employeeName: 'Yusuf Ahmed', employeeDept: 'Operations', submitted: '17 Jan 2026', submittedAgo: '22 days ago', currentStep: 'Completed', status: 'Approved' }
        ]);

        const ordersPending = computed(() => orders.value.filter(o => o.status === 'Pending').length);
        const ordersApproved = computed(() => orders.value.filter(o => o.status === 'Approved').length);
        const ordersInReview = computed(() => orders.value.filter(o => o.status === 'In Review').length);
        const ordersRejected = computed(() => orders.value.filter(o => o.status === 'Rejected').length);

        const filteredOrders = computed(() => {
            if (!ordersFilter.value) return orders.value;
            const statusMap = {
                'pending': 'Pending',
                'approved': 'Approved',
                'in_review': 'In Review',
                'rejected': 'Rejected'
            };
            return orders.value.filter(o => o.status === statusMap[ordersFilter.value]);
        });

        // Payroll Splits
        const payrollSplits = ref([
            { month: 'January 2024', paymentDate: '31 Jan 2024', basicSalary: 15000, accommodation: 4000, transportation: 1000, otherAllowance: 0, commission: 500, overtime: 200, othersAddition: 0, grossPay: 20700 },
            { month: 'February 2024', paymentDate: '29 Feb 2024', basicSalary: 15000, accommodation: 4000, transportation: 1000, otherAllowance: 0, commission: 0, overtime: 0, othersAddition: 0, grossPay: 20000 },
            { month: 'March 2024', paymentDate: '31 Mar 2024', basicSalary: 15000, accommodation: 4000, transportation: 1000, otherAllowance: 0, commission: 1200, overtime: 450, othersAddition: 100, grossPay: 21750 }
        ]);

        const formatCurrency = (value) => {
            return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        // Shift Schedule
        const shiftWeekDays = computed(() => {
            const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
            const baseDate = new Date();
            baseDate.setDate(baseDate.getDate() - baseDate.getDay() + 1 + (shiftWeekOffset.value * 7));
            return days.map((name, i) => {
                const d = new Date(baseDate);
                d.setDate(d.getDate() + i);
                return { dayName: name, date: d.getDate() };
            });
        });

        const shiftWeekLabel = computed(() => {
            const baseDate = new Date();
            baseDate.setDate(baseDate.getDate() - baseDate.getDay() + 1 + (shiftWeekOffset.value * 7));
            const endDate = new Date(baseDate);
            endDate.setDate(endDate.getDate() + 6);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[baseDate.getMonth()]} ${baseDate.getDate()} - ${months[endDate.getMonth()]} ${endDate.getDate()}`;
        });

        const myShiftSchedule = ref([
            {
                id: 1,
                name: 'Mohammed Alsoliman',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                type: 'Fixed',
                shifts: {
                    TUE: { name: 'MID-DAY', time: '10:00-17:00', color: '#f97316' },
                    WED: { name: 'EVENING', time: '14:00-22:00', color: '#3b82f6' },
                    FRI: { name: 'NIGHT', time: '22:00-06:00', color: '#1e293b' },
                    SAT: { name: 'MORNING', time: '08:00-17:00', color: '#22c55e' }
                }
            }
        ]);

        const getShiftForDay = (schedule, dayName) => {
            return schedule.shifts[dayName] || null;
        };

        const getShiftBlockStyle = (schedule, dayName) => {
            const shift = getShiftForDay(schedule, dayName);
            if (!shift) return {};
            return {
                background: shift.color,
                color: '#fff'
            };
        };

        const previousShiftWeek = () => shiftWeekOffset.value--;
        const nextShiftWeek = () => shiftWeekOffset.value++;

        // Attendance Data
        const isAttendanceExpanded = ref(true);
        
        const attendanceWeekLabel = computed(() => {
            const baseDate = new Date();
            baseDate.setDate(baseDate.getDate() - baseDate.getDay() + 1 + (attendanceWeekOffset.value * 7));
            const endDate = new Date(baseDate);
            endDate.setDate(endDate.getDate() + 6);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[baseDate.getMonth()]} ${baseDate.getDate()} - ${months[endDate.getMonth()]} ${endDate.getDate()}`;
        });

        const myAttendance = ref([
            { dayName: 'MON', date: '15 Jan', dayContext: 'Regular Workday', shift: 'Flexible', shiftTime: '09:00 AM - 06:00 PM', checkIn: '8:00 am', checkOut: null, status: 'PRESENT', punchFlag: 'MISSING CLOCK-OUT', duration: null, violation: 'MISSING CLOCK-OUT' },
            { dayName: 'TUE', date: '16 Jan', dayContext: 'Regular Workday', shift: 'Flexible', shiftTime: '09:00 AM - 06:00 PM', checkIn: '8:00 am', checkOut: null, status: 'PRESENT', punchFlag: 'MISSING CLOCK-OUT', duration: null, violation: 'MISSING CLOCK-OUT', isToday: true },
            { dayName: 'WED', date: '17 Jan', dayContext: 'Regular Workday', shift: 'Flexible', shiftTime: '09:00 AM - 06:00 PM', checkIn: '8:00 am', checkOut: null, status: 'PRESENT', punchFlag: 'MISSING CLOCK-OUT', duration: null, violation: 'MISSING CLOCK-OUT' },
            { dayName: 'THU', date: '18 Jan', dayContext: 'Regular Workday', shift: 'Flexible', shiftTime: '09:00 AM - 06:00 PM', checkIn: '8:00 am', checkOut: null, status: 'PRESENT', punchFlag: 'MISSING CLOCK-OUT', duration: null, violation: 'MISSING CLOCK-OUT' },
            { dayName: 'FRI', date: '19 Jan', dayContext: 'Regular Workday', shift: 'Flexible', shiftTime: '09:00 AM - 06:00 PM', checkIn: '8:00 am', checkOut: null, status: 'PRESENT', punchFlag: 'MISSING CLOCK-OUT', duration: null, violation: 'MISSING CLOCK-OUT' },
            { dayName: 'SAT', date: '20 Jan', dayContext: 'Weekend Off', shift: null, shiftTime: null, checkIn: null, checkOut: null, status: null, punchFlag: null, duration: null, violation: null, isWeekend: true },
            { dayName: 'SUN', date: '21 Jan', dayContext: 'Weekend Off', shift: null, shiftTime: null, checkIn: null, checkOut: null, status: null, punchFlag: null, duration: null, violation: null, isWeekend: true }
        ]);

        const prevAttendanceWeek = () => attendanceWeekOffset.value--;
        const nextAttendanceWeek = () => attendanceWeekOffset.value++;

        // Attendance helper functions
        const getDayContextClass = (context) => {
            if (!context) return '';
            if (context.includes('Weekend')) return 'weekend';
            return 'regular';
        };

        const getDayContextIcon = (context) => {
            if (!context) return 'pi pi-calendar';
            if (context.includes('Weekend')) return 'pi pi-moon';
            return 'pi pi-sun';
        };

        const getStatusBadgeClass = (status) => {
            if (!status) return '';
            const s = status.toUpperCase();
            if (s === 'PRESENT') return 'present';
            if (s === 'ABSENT') return 'absent';
            if (s === 'LATE') return 'late';
            return '';
        };

        const getPunchFlagClass = (flag) => {
            if (!flag) return '';
            if (flag.includes('MISSING')) return 'missing';
            return '';
        };

        const getViolationClass = (violation) => {
            if (!violation) return '';
            return 'warning';
        };

        // Appraisal Data - This Year
        const myAppraisals = ref([
            {
                id: 1,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                name: 'Mohammed Alsoliman',
                empId: 'EMP-005',
                department: 'PRODUCT ENGINEERING',
                cycle: 'April 2025 - April 2026',
                reviewers: ['HR Director', 'Talent Lead'],
                grade: 'PROFESSIONAL',
                weights: { c: 5, p: 60, k: 35 },
                status: 'APPRAISAL ASSIGNED',
                statusClass: 'assigned'
            }
        ]);

        // Previous Years Appraisal Results
        const previousAppraisals = ref([
            {
                id: 1,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                name: 'Mohammed Alsoliman',
                empId: 'EMP-005',
                cycle: 'April 2024 - April 2025',
                selfScore: 91,
                finalScore: 92,
                rating: 'EXCELLENT',
                ratingClass: 'excellent',
                evaluator: 'Director Noura'
            },
            {
                id: 2,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                name: 'Mohammed Alsoliman',
                empId: 'EMP-005',
                cycle: 'April 2023 - April 2024',
                selfScore: 88,
                finalScore: 89,
                rating: 'VERY GOOD',
                ratingClass: 'very-good',
                evaluator: 'Manager Khalid'
            }
        ]);

        return {
            activeTab,
            employee,
            jobInfo,
            orders,
            ordersFilter,
            ordersPending,
            ordersApproved,
            ordersInReview,
            ordersRejected,
            filteredOrders,
            payrollSplits,
            formatCurrency,
            shiftWeekDays,
            shiftWeekLabel,
            myShiftSchedule,
            getShiftForDay,
            getShiftBlockStyle,
            previousShiftWeek,
            nextShiftWeek,
            myAttendance,
            isAttendanceExpanded,
            attendanceWeekLabel,
            prevAttendanceWeek,
            nextAttendanceWeek,
            getDayContextClass,
            getDayContextIcon,
            getStatusBadgeClass,
            getPunchFlagClass,
            getViolationClass,
            appraisalYear,
            myAppraisals,
            previousAppraisals
        };
    }
};
