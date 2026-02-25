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
                    <div class="profile-header-actions">
                        <p-button label="View More Details" icon="pi pi-eye" outlined @click="showEmployeeDetailModal = true"></p-button>
                    </div>
                </div>
            </div>

            <!-- Employee Detail Modal (Read-only Add Employee View) -->
            <p-dialog v-model:visible="showEmployeeDetailModal" header="Employee Details" :style="{ width: '90vw', maxWidth: '1200px' }" modal :closable="true">
                <div class="employee-detail-wizard">
                    <div class="detail-wizard-steps">
                        <div v-for="(step, index) in detailSteps" :key="index"
                            class="detail-wizard-step"
                            :class="{ active: detailCurrentStep === index }"
                            @click="detailCurrentStep = index">
                            <div class="step-number">{{ index + 1 }}</div>
                            <div class="step-label">{{ step.label }}</div>
                        </div>
                    </div>

                    <!-- Basic Info Step -->
                    <div v-show="detailCurrentStep === 0" class="detail-step-content">
                        <div class="detail-section">
                            <h4 class="detail-section-title">Personal Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Full Name (English)</label>
                                    <span>{{ employee.name }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Full Name (Arabic)</label>
                                    <span>{{ employee.nameAr || 'N/A' }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Gender</label>
                                    <span>{{ employee.gender || 'Male' }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Marital Status</label>
                                    <span>{{ employee.maritalStatus || 'Single' }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Nationality</label>
                                    <span>{{ employee.nationality || 'Egyptian' }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>National ID</label>
                                    <span>{{ employee.nationalId || 'N/A' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4 class="detail-section-title">Contact Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Email</label>
                                    <span>{{ employee.email }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Mobile</label>
                                    <span>{{ employee.mobile || '+20 123 456 7890' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Documents Step -->
                    <div v-show="detailCurrentStep === 1" class="detail-step-content">
                        <div class="detail-section">
                            <h4 class="detail-section-title">Identity Documents</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>CV</label>
                                    <span class="doc-link"><i class="pi pi-file-pdf"></i> cv_document.pdf</span>
                                </div>
                                <div class="detail-item">
                                    <label>National ID</label>
                                    <span class="doc-link"><i class="pi pi-file-pdf"></i> national_id.pdf</span>
                                </div>
                                <div class="detail-item">
                                    <label>Date of Birth</label>
                                    <span>{{ employee.dateOfBirth || '15/03/1990' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Work Access Step -->
                    <div v-show="detailCurrentStep === 2" class="detail-step-content">
                        <div class="detail-section">
                            <h4 class="detail-section-title">Organization</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Department</label>
                                    <span>{{ employee.department }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Section</label>
                                    <span>{{ employee.section || 'Development' }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Job Title</label>
                                    <span>{{ employee.position }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Line Manager</label>
                                    <span>{{ employee.manager }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contract & Salary Step -->
                    <div v-show="detailCurrentStep === 3" class="detail-step-content">
                        <div class="detail-section">
                            <h4 class="detail-section-title">Contract Details</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Contract Type</label>
                                    <span>Full-time</span>
                                </div>
                                <div class="detail-item">
                                    <label>Contract Classification</label>
                                    <span>Undefined Period</span>
                                </div>
                                <div class="detail-item">
                                    <label>Probation Period</label>
                                    <span>90 Days</span>
                                </div>
                                <div class="detail-item">
                                    <label>Annual Leave</label>
                                    <span>21 Days</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4 class="detail-section-title">Salary Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Gross Salary</label>
                                    <span>{{ formatCurrency(employee.grossSalary || 15000) }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Basic Salary</label>
                                    <span>{{ formatCurrency(employee.basicSalary || 9000) }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Housing Allowance</label>
                                    <span>{{ formatCurrency(employee.houseAllowance || 3750) }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Transportation Allowance</label>
                                    <span>{{ formatCurrency(employee.transportAllowance || 1500) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Attendance Step -->
                    <div v-show="detailCurrentStep === 4" class="detail-step-content">
                        <div class="detail-section">
                            <h4 class="detail-section-title">Schedule Configuration</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Schedule Type</label>
                                    <span>Fixed Schedule</span>
                                </div>
                                <div class="detail-item">
                                    <label>Work Week</label>
                                    <span>Standard Week (Sun-Thu)</span>
                                </div>
                                <div class="detail-item">
                                    <label>Shift</label>
                                    <span>Morning Shift (08:00 - 16:00)</span>
                                </div>
                                <div class="detail-item">
                                    <label>Attendance Method</label>
                                    <span>Office</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Iqama Step -->
                    <div v-show="detailCurrentStep === 5" class="detail-step-content">
                        <div class="detail-section">
                            <h4 class="detail-section-title">Iqama Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Has Iqama</label>
                                    <span>Yes</span>
                                </div>
                                <div class="detail-item">
                                    <label>Iqama Number</label>
                                    <span>2123456789</span>
                                </div>
                                <div class="detail-item">
                                    <label>Expiry Date</label>
                                    <span>15/12/2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Checklist Step -->
                    <div v-show="detailCurrentStep === 6" class="detail-step-content">
                        <div class="detail-section">
                            <h4 class="detail-section-title">Onboarding Checklist</h4>
                            <div class="checklist-summary">
                                <div class="checklist-item completed">
                                    <i class="pi pi-check-circle"></i>
                                    <span>All documentation verified</span>
                                </div>
                                <div class="checklist-item completed">
                                    <i class="pi pi-check-circle"></i>
                                    <span>System access configured</span>
                                </div>
                                <div class="checklist-item completed">
                                    <i class="pi pi-check-circle"></i>
                                    <span>Equipment assigned</span>
                                </div>
                                <div class="checklist-item completed">
                                    <i class="pi pi-check-circle"></i>
                                    <span>Orientation completed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step Navigation -->
                    <div class="detail-wizard-footer">
                        <p-button v-if="detailCurrentStep > 0" label="Previous" icon="pi pi-arrow-left" outlined @click="detailCurrentStep--"></p-button>
                        <div style="flex: 1;"></div>
                        <p-button v-if="detailCurrentStep < 6" label="Next" icon="pi pi-arrow-right" iconPos="right" @click="detailCurrentStep++"></p-button>
                    </div>
                </div>
            </p-dialog>

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
                    <button class="profile-tab" :class="{ active: activeTab === 'training' }" @click="activeTab = 'training'">
                        <i class="pi pi-book"></i> Training
                    </button>
                    <button class="profile-tab" :class="{ active: activeTab === 'performance' }" @click="activeTab = 'performance'">
                        <i class="pi pi-chart-line"></i> Performance
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

                </div>

                <!-- Orders Tab -->
                <div v-if="activeTab === 'orders'" class="tab-panel">
                    <!-- Sub-tabs for Orders and HR Help Desk -->
                    <div class="orders-sub-tabs">
                        <button class="sub-tab" :class="{ active: ordersSubTab === 'orders' }" @click="ordersSubTab = 'orders'">
                            <i class="pi pi-inbox"></i> My Orders
                        </button>
                        <button class="sub-tab" :class="{ active: ordersSubTab === 'hrdesk' }" @click="ordersSubTab = 'hrdesk'">
                            <i class="pi pi-headphones"></i> HR Help Desk
                        </button>
                    </div>

                    <!-- My Orders Sub-tab -->
                    <div v-if="ordersSubTab === 'orders'">
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

                            <p-datatable :value="filteredOrders" stripedRows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]"
                                         selectionMode="single" @row-click="viewOrder($event.data)">
                                <p-column header="Request" sortable>
                                    <template #body="slotProps">
                                        <div class="request-cell clickable-row">
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
                                <p-column header="Action" style="width: 80px;">
                                    <template #body="slotProps">
                                        <p-button icon="pi pi-eye" severity="info" text rounded @click.stop="viewOrder(slotProps.data)"></p-button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </div>
                    </div>

                    <!-- HR Help Desk Sub-tab -->
                    <div v-if="ordersSubTab === 'hrdesk'">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon blue">
                                    <i class="pi pi-list"></i>
                                </div>
                                <div>
                                    <div class="stat-value">{{ hrDeskRequests.length }}</div>
                                    <div class="stat-label">Total Requests</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon orange">
                                    <i class="pi pi-clock"></i>
                                </div>
                                <div>
                                    <div class="stat-value">{{ hrDeskPending }}</div>
                                    <div class="stat-label">Pending</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon green">
                                    <i class="pi pi-check-circle"></i>
                                </div>
                                <div>
                                    <div class="stat-value">{{ hrDeskApproved }}</div>
                                    <div class="stat-label">Approved</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon red">
                                    <i class="pi pi-times-circle"></i>
                                </div>
                                <div>
                                    <div class="stat-value">{{ hrDeskRejected }}</div>
                                    <div class="stat-label">Rejected</div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-list-check"></i>
                                        HR Requests
                                    </div>
                                    <div class="card-subtitle">Track and manage all HR change requests</div>
                                </div>
                                <div class="header-actions">
                                    <p-select v-model="hrDeskStatusFilter" :options="hrDeskStatusOptions" placeholder="All Statuses" showClear style="width: 180px;"></p-select>
                                </div>
                            </div>

                            <p-datatable :value="filteredHrDeskRequests" stripedRows paginator :rows="10" 
                                         :rowsPerPageOptions="[10, 25, 50]" selectionMode="single" @row-click="viewHrDeskRequest($event.data)">
                                <p-column header="Type of Request" sortable field="type">
                                    <template #body="slotProps">
                                        <div class="request-type-cell clickable-row">
                                            <div class="request-type-icon" :style="{ background: slotProps.data.color + '15', color: slotProps.data.color }">
                                                <i :class="'pi ' + slotProps.data.icon"></i>
                                            </div>
                                            <div class="request-type-info">
                                                <div class="request-type-name">{{ slotProps.data.type }}</div>
                                                <div class="request-type-id">#{{ slotProps.data.trackingId }}</div>
                                            </div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Employee Details" sortable field="employeeName">
                                    <template #body="slotProps">
                                        <div class="employee-cell">
                                            <img :src="slotProps.data.employeeAvatar" :alt="slotProps.data.employeeName" class="employee-avatar-sm">
                                            <div class="employee-info">
                                                <div class="employee-name">{{ slotProps.data.employeeName }}</div>
                                                <div class="employee-details">{{ slotProps.data.employeeId }} • {{ slotProps.data.employeeDepartment }}</div>
                                            </div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="HR User" sortable field="hrUserName">
                                    <template #body="slotProps">
                                        <div class="hr-user-cell">
                                            <div class="hr-user-name">{{ slotProps.data.hrUserName }}</div>
                                            <div class="hr-user-role">{{ slotProps.data.hrUserRole }}</div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Date of Action" sortable field="dateOfAction">
                                    <template #body="slotProps">
                                        <div class="date-cell">
                                            <i class="pi pi-calendar"></i>
                                            <span>{{ formatHrDeskDate(slotProps.data.dateOfAction) }}</span>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Status" sortable field="status">
                                    <template #body="slotProps">
                                        <span class="status-badge" :class="getHrDeskStatusClass(slotProps.data.status)">
                                            {{ slotProps.data.status }}
                                        </span>
                                    </template>
                                </p-column>
                                <p-column header="Summary" style="width: 80px; text-align: center;">
                                    <template #body="slotProps">
                                        <button class="view-btn" @click.stop="viewHrDeskRequest(slotProps.data)" v-tooltip="'View Details'">
                                            <i class="pi pi-eye"></i>
                                        </button>
                                    </template>
                                </p-column>
                            </p-datatable>
                        </div>
                    </div>

                    <!-- Order View Modal -->
                    <p-dialog v-model:visible="showOrderModal" :header="'Order Details - ' + (selectedOrder?.id || '')" :style="{ width: '700px' }" modal>
                        <div v-if="selectedOrder" class="order-view-content">
                            <div class="order-header-info">
                                <div class="order-type-badge" :style="{ background: selectedOrder.color + '15', color: selectedOrder.color }">
                                    <i :class="'pi ' + selectedOrder.icon"></i>
                                </div>
                                <div>
                                    <h3>{{ selectedOrder.typeName }}</h3>
                                    <p>Submitted: {{ selectedOrder.submitted }}</p>
                                </div>
                                <span class="status-tag" :class="selectedOrder.status.toLowerCase().replace(' ', '-')">{{ selectedOrder.status }}</span>
                            </div>
                            <div class="order-details-grid">
                                <div class="order-detail-item">
                                    <label>Request ID</label>
                                    <span>{{ selectedOrder.id }}</span>
                                </div>
                                <div class="order-detail-item">
                                    <label>Current Step</label>
                                    <span>{{ selectedOrder.currentStep }}</span>
                                </div>
                                <div class="order-detail-item">
                                    <label>Submitted</label>
                                    <span>{{ selectedOrder.submitted }} ({{ selectedOrder.submittedAgo }})</span>
                                </div>
                            </div>
                        </div>
                        <template #footer>
                            <p-button label="Close" severity="secondary" @click="showOrderModal = false"></p-button>
                        </template>
                    </p-dialog>
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
                                        <th>MONTH</th>
                                        <th>BASIC SALARY</th>
                                        <th>ACCOMMODATION</th>
                                        <th>TRANSPORTATION</th>
                                        <th>OTHER ALLOWANCE</th>
                                        <th class="addition-col">COMMISSION</th>
                                        <th class="addition-col">OVERTIME</th>
                                        <th class="addition-col">OTHERS ADD.</th>
                                        <th class="gross-col">GROSS PAY</th>
                                        <th class="deduction-col">ATTEND. DED.</th>
                                        <th class="deduction-col">LOAN</th>
                                        <th class="deduction-col">ABSENT W/O</th>
                                        <th class="deduction-col">OTHER DED.</th>
                                        <th class="deduction-col">GOSI</th>
                                        <th class="deduction-col">NET DED.</th>
                                        <th class="total-col">NET PAY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="split in payrollSplits" :key="split.month">
                                        <td class="month-cell">
                                            <div class="month-name">{{ split.month }}</div>
                                        </td>
                                        <td>{{ formatCurrency(split.basicSalary) }}</td>
                                        <td>{{ formatCurrency(split.accommodation) }}</td>
                                        <td>{{ formatCurrency(split.transportation) }}</td>
                                        <td>{{ formatCurrency(split.otherAllowance) }}</td>
                                        <td class="addition-col">
                                            <span class="addition-value" :class="{ 'has-value': split.commission > 0 }">{{ formatCurrency(split.commission) }}</span>
                                        </td>
                                        <td class="addition-col">
                                            <span class="addition-value" :class="{ 'has-value': split.overtime > 0 }">{{ formatCurrency(split.overtime) }}</span>
                                        </td>
                                        <td class="addition-col">
                                            <span class="addition-value" :class="{ 'has-value': split.othersAddition > 0 }">{{ formatCurrency(split.othersAddition) }}</span>
                                        </td>
                                        <td class="gross-col">{{ formatCurrency(split.grossPay) }}</td>
                                        <td class="deduction-col">
                                            <span class="deduction-value">{{ formatCurrency(split.attendanceDed || 0) }}</span>
                                        </td>
                                        <td class="deduction-col">
                                            <span class="deduction-value">{{ formatCurrency(split.loanRepayment || 0) }}</span>
                                        </td>
                                        <td class="deduction-col">
                                            <span class="deduction-value">{{ formatCurrency(split.absentWithoutLeave || 0) }}</span>
                                        </td>
                                        <td class="deduction-col">
                                            <span class="deduction-value">{{ formatCurrency(split.otherDeductions || 0) }}</span>
                                        </td>
                                        <td class="deduction-col">
                                            <span class="deduction-value">{{ formatCurrency(split.gosi || 0) }}</span>
                                        </td>
                                        <td class="deduction-col">
                                            <span class="deduction-value total">{{ formatCurrency(split.netDeductions || 0) }}</span>
                                        </td>
                                        <td class="total-col">
                                            <span class="net-pay-value">{{ formatCurrency(split.netPay || split.grossPay) }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
                        <p-datatable :value="myAppraisals" stripedRows selectionMode="single" @row-click="viewAppraisal($event.data)">
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
                            <p-column header="Status" style="width: 200px;">
                                <template #body="slotProps">
                                    <span class="appraisal-status-btn" :class="slotProps.data.statusClass">
                                        {{ slotProps.data.status }}
                                    </span>
                                </template>
                            </p-column>
                            <p-column header="Action" style="width: 80px;">
                                <template #body="slotProps">
                                    <p-button icon="pi pi-eye" severity="info" text rounded @click.stop="viewAppraisal(slotProps.data)"></p-button>
                                </template>
                            </p-column>
                        </p-datatable>
                    </div>

                    <!-- Previous Years Table (Same as appraisal-results) -->
                    <div v-if="appraisalYear === 'previous'" class="card">
                        <p-datatable :value="previousAppraisals" stripedRows selectionMode="single" @row-click="viewAppraisal($event.data)">
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
                                    <p-button icon="pi pi-eye" severity="info" text rounded @click.stop="viewAppraisal(slotProps.data)"></p-button>
                                </template>
                            </p-column>
                        </p-datatable>
                    </div>

                    <!-- Appraisal View Modal -->
                    <p-dialog v-model:visible="showAppraisalModal" :header="'Appraisal Details'" :style="{ width: '700px' }" modal>
                        <div v-if="selectedAppraisal" class="appraisal-view-content">
                            <div class="appraisal-header-info">
                                <img :src="selectedAppraisal.avatar" style="width: 60px; height: 60px; border-radius: 50%;">
                                <div>
                                    <h3>{{ selectedAppraisal.name }}</h3>
                                    <p>{{ selectedAppraisal.empId }} • {{ selectedAppraisal.department || 'N/A' }}</p>
                                </div>
                                <span class="appraisal-status-btn" :class="selectedAppraisal.statusClass">{{ selectedAppraisal.status }}</span>
                            </div>
                            <div class="appraisal-details-grid">
                                <div class="appraisal-detail-item">
                                    <label>Appraisal Cycle</label>
                                    <span>{{ selectedAppraisal.cycle }}</span>
                                </div>
                                <div class="appraisal-detail-item" v-if="selectedAppraisal.grade">
                                    <label>Grade</label>
                                    <span>{{ selectedAppraisal.grade }}</span>
                                </div>
                                <div class="appraisal-detail-item" v-if="selectedAppraisal.selfScore">
                                    <label>Self Score</label>
                                    <span>{{ selectedAppraisal.selfScore }}%</span>
                                </div>
                                <div class="appraisal-detail-item" v-if="selectedAppraisal.finalScore">
                                    <label>Final Score</label>
                                    <span class="final-score-badge">{{ selectedAppraisal.finalScore }}%</span>
                                </div>
                                <div class="appraisal-detail-item" v-if="selectedAppraisal.rating">
                                    <label>Performance Rating</label>
                                    <span class="performance-tag" :class="selectedAppraisal.ratingClass">{{ selectedAppraisal.rating }}</span>
                                </div>
                                <div class="appraisal-detail-item" v-if="selectedAppraisal.evaluator">
                                    <label>Evaluator</label>
                                    <span>{{ selectedAppraisal.evaluator }}</span>
                                </div>
                            </div>
                            <div v-if="selectedAppraisal.reviewers" class="appraisal-reviewers">
                                <label>Reviewers</label>
                                <div v-for="reviewer in selectedAppraisal.reviewers" :key="reviewer" class="reviewer-item">
                                    <span class="reviewer-dot"></span>
                                    <span>{{ reviewer }}</span>
                                </div>
                            </div>
                        </div>
                        <template #footer>
                            <p-button label="Close" severity="secondary" @click="showAppraisalModal = false"></p-button>
                        </template>
                    </p-dialog>
                </div>

                <!-- Training Tab -->
                <div v-if="activeTab === 'training'" class="tab-panel">
                    <div class="card">
                        <div class="card-header">
                            <div>
                                <div class="card-title">
                                    <i class="pi pi-book"></i>
                                    My Training Paths
                                </div>
                                <div class="card-subtitle">View your assigned training courses and progress</div>
                            </div>
                        </div>

                        <p-datatable :value="myTrainings" stripedRows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]">
                            <p-column header="TRAINING PATH">
                                <template #body="slotProps">
                                    <span style="font-weight: 600;">{{ slotProps.data.path }}</span>
                                </template>
                            </p-column>
                            <p-column header="TOTAL HOURS" style="width: 120px;">
                                <template #body="slotProps">
                                    <span class="hours-badge">{{ slotProps.data.totalHours }} HRS</span>
                                </template>
                            </p-column>
                            <p-column header="BATCH DETAILS" style="width: 160px;">
                                <template #body="slotProps">
                                    <div>
                                        <div style="font-weight: 600; font-size: 0.85rem;">Cycle {{ slotProps.data.cycle }}</div>
                                        <div style="font-size: 0.75rem; color: var(--text-color-secondary);">{{ slotProps.data.period }}</div>
                                    </div>
                                </template>
                            </p-column>
                            <p-column header="STATUS" style="width: 130px;">
                                <template #body="slotProps">
                                    <p-tag :value="slotProps.data.status" :severity="getTrainingStatusSeverity(slotProps.data.status)"></p-tag>
                                </template>
                            </p-column>
                            <p-column header="PROGRESS SCORE" style="width: 140px;">
                                <template #body="slotProps">
                                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                                        <span style="font-weight: 600; font-size: 0.85rem;">{{ slotProps.data.progress }}%</span>
                                        <div style="width: 100%; height: 4px; background: var(--surface-200); border-radius: 2px; overflow: hidden;">
                                            <div :style="{ width: slotProps.data.progress + '%', height: '100%', background: getTrainingProgressColor(slotProps.data.progress), borderRadius: '2px' }"></div>
                                        </div>
                                    </div>
                                </template>
                            </p-column>
                        </p-datatable>
                    </div>
                </div>

                <!-- Performance Tab -->
                <div v-if="activeTab === 'performance'" class="tab-panel">
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

        // Employee Detail Modal
        const showEmployeeDetailModal = ref(false);
        const detailCurrentStep = ref(0);
        const detailSteps = ref([
            { label: 'Basic Info' },
            { label: 'Documents' },
            { label: 'Work Access' },
            { label: 'Contract & Salary' },
            { label: 'Attendance' },
            { label: 'Iqama' },
            { label: 'Checklist' }
        ]);

        // Orders Sub-tabs
        const ordersSubTab = ref('orders');
        const showOrderModal = ref(false);
        const selectedOrder = ref(null);

        const viewOrder = (order) => {
            selectedOrder.value = order;
            showOrderModal.value = true;
        };

        // HR Desk Requests (matching hr-requests-tracking.js structure)
        const hrDeskStatusFilter = ref(null);
        const hrDeskStatusOptions = ref(['Pending', 'Approved', 'Processing', 'Rejected']);

        const hrDeskRequests = ref([
            {
                id: 1,
                trackingId: 'TRK-2024-001',
                type: 'Employee Promotion',
                icon: 'pi-arrow-up-right',
                color: '#f97316',
                employeeName: 'Mohammed Soliman Alsoliman',
                employeeId: 'EMP-005',
                employeeDepartment: 'Engineering',
                employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'Amal Al-Sayed',
                hrUserRole: 'HR Manager',
                dateOfAction: '2024-03-15',
                status: 'Pending'
            },
            {
                id: 2,
                trackingId: 'TRK-2024-002',
                type: 'Salary Adjustment',
                icon: 'pi-money-bill',
                color: '#10b981',
                employeeName: 'Mohammed Soliman Alsoliman',
                employeeId: 'EMP-005',
                employeeDepartment: 'Engineering',
                employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'John Smith',
                hrUserRole: 'HR Coordinator',
                dateOfAction: '2024-03-14',
                status: 'Approved'
            },
            {
                id: 3,
                trackingId: 'TRK-2024-003',
                type: 'Attendance Adjustment',
                icon: 'pi-clock',
                color: '#ec4899',
                employeeName: 'Mohammed Soliman Alsoliman',
                employeeId: 'EMP-005',
                employeeDepartment: 'Engineering',
                employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'Amal Al-Sayed',
                hrUserRole: 'HR Manager',
                dateOfAction: '2024-03-12',
                status: 'Processing'
            },
            {
                id: 4,
                trackingId: 'TRK-2024-004',
                type: 'Change Contract Type',
                icon: 'pi-file-edit',
                color: '#f59e0b',
                employeeName: 'Mohammed Soliman Alsoliman',
                employeeId: 'EMP-005',
                employeeDepartment: 'Engineering',
                employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'Fahad Al-Otaibi',
                hrUserRole: 'HR Director',
                dateOfAction: '2024-03-10',
                status: 'Rejected'
            },
            {
                id: 5,
                trackingId: 'TRK-2024-005',
                type: 'Employee Transfer',
                icon: 'pi-arrow-right-arrow-left',
                color: '#6366f1',
                employeeName: 'Mohammed Soliman Alsoliman',
                employeeId: 'EMP-005',
                employeeDepartment: 'Engineering',
                employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'John Smith',
                hrUserRole: 'HR Coordinator',
                dateOfAction: '2024-03-09',
                status: 'Approved'
            },
            {
                id: 6,
                trackingId: 'TRK-2024-006',
                type: 'Disciplinary Action',
                icon: 'pi-exclamation-triangle',
                color: '#eab308',
                employeeName: 'Mohammed Soliman Alsoliman',
                employeeId: 'EMP-005',
                employeeDepartment: 'Engineering',
                employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                hrUserName: 'Amal Al-Sayed',
                hrUserRole: 'HR Manager',
                dateOfAction: '2024-03-08',
                status: 'Pending'
            }
        ]);

        const hrDeskPending = computed(() => hrDeskRequests.value.filter(r => r.status === 'Pending').length);
        const hrDeskApproved = computed(() => hrDeskRequests.value.filter(r => r.status === 'Approved').length);
        const hrDeskRejected = computed(() => hrDeskRequests.value.filter(r => r.status === 'Rejected').length);

        const filteredHrDeskRequests = computed(() => {
            if (!hrDeskStatusFilter.value) return hrDeskRequests.value;
            return hrDeskRequests.value.filter(r => r.status === hrDeskStatusFilter.value);
        });

        const getHrDeskStatusClass = (status) => {
            const classes = {
                'Pending': 'pending',
                'Approved': 'approved',
                'Processing': 'processing',
                'Rejected': 'rejected'
            };
            return classes[status] || 'pending';
        };

        const formatHrDeskDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        };

        const viewHrDeskRequest = (request) => {
            console.log('View HR Desk Request:', request);
        };

        // Appraisal Modal
        const showAppraisalModal = ref(false);
        const selectedAppraisal = ref(null);

        const viewAppraisal = (appraisal) => {
            selectedAppraisal.value = appraisal;
            showAppraisalModal.value = true;
        };

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
            { month: 'January 2024', basicSalary: 15000, accommodation: 4000, transportation: 1000, otherAllowance: 0, commission: 500, overtime: 200, othersAddition: 0, grossPay: 20700, attendanceDed: 0, loanRepayment: 500, absentWithoutLeave: 0, otherDeductions: 0, gosi: 1350, netDeductions: 1850, netPay: 18850 },
            { month: 'February 2024', basicSalary: 15000, accommodation: 4000, transportation: 1000, otherAllowance: 0, commission: 0, overtime: 0, othersAddition: 0, grossPay: 20000, attendanceDed: 150, loanRepayment: 500, absentWithoutLeave: 0, otherDeductions: 0, gosi: 1350, netDeductions: 2000, netPay: 18000 },
            { month: 'March 2024', basicSalary: 15000, accommodation: 4000, transportation: 1000, otherAllowance: 0, commission: 1200, overtime: 450, othersAddition: 100, grossPay: 21750, attendanceDed: 0, loanRepayment: 500, absentWithoutLeave: 0, otherDeductions: 200, gosi: 1350, netDeductions: 2050, netPay: 19700 }
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

        // Training Data
        const myTrainings = ref([
            { id: 1, path: 'Cybersecurity Essentials', totalHours: 10, cycle: 1, period: 'JANUARY 2024 — JUNE 2024', status: 'Completed', progress: 100 },
            { id: 2, path: 'Leadership & Management', totalHours: 40, cycle: 2, period: 'JANUARY 2024 — JUNE 2024', status: 'In Progress', progress: 65 },
            { id: 3, path: 'Python for Data Analysis', totalHours: 60, cycle: 3, period: 'FEBRUARY 2024 — AUGUST 2024', status: 'Assigned', progress: 10 },
            { id: 4, path: 'Workplace Safety & Health', totalHours: 5, cycle: 1, period: 'MARCH 2024 — APRIL 2024', status: 'Completed', progress: 100 }
        ]);

        const getTrainingStatusSeverity = (status) => {
            const map = { 'Assigned': 'warn', 'In Progress': 'info', 'Completed': 'success', 'Failed': 'danger' };
            return map[status] || 'secondary';
        };

        const getTrainingProgressColor = (progress) => {
            if (progress >= 100) return '#22c55e';
            if (progress >= 50) return '#3b82f6';
            if (progress > 0) return '#f97316';
            return '#ef4444';
        };

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
            previousAppraisals,
            myTrainings,
            getTrainingStatusSeverity,
            getTrainingProgressColor,
            showEmployeeDetailModal,
            detailCurrentStep,
            detailSteps,
            ordersSubTab,
            showOrderModal,
            selectedOrder,
            viewOrder,
            hrDeskRequests,
            hrDeskStatusFilter,
            hrDeskStatusOptions,
            hrDeskPending,
            hrDeskApproved,
            hrDeskRejected,
            filteredHrDeskRequests,
            getHrDeskStatusClass,
            formatHrDeskDate,
            viewHrDeskRequest,
            showAppraisalModal,
            selectedAppraisal,
            viewAppraisal
        };
    }
};
