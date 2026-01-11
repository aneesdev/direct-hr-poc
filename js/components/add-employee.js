/**
 * Add Employee Component
 * 6-Step Wizard for adding new employees
 */

const AddEmployeeComponent = {
    template: `
        <div class="add-employee-page">
            <!-- Wizard Header -->
            <div class="wizard-header">
                <div class="wizard-title">
                    <p-button icon="pi pi-arrow-left" text @click="$emit('back')"></p-button>
                    <div>
                        <h2>Add New Employee</h2>
                        <p>Complete all steps to add a new employee</p>
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <p-button label="Save as Draft" icon="pi pi-save" outlined @click="saveAsDraft"></p-button>
                    <p-button label="Cancel" icon="pi pi-times" severity="secondary" text @click="$emit('back')"></p-button>
                </div>
            </div>

            <!-- Step Indicator -->
            <div class="wizard-steps">
                <div v-for="(step, index) in steps" :key="index" 
                    class="wizard-step" 
                    :class="{ active: currentStep === index, completed: currentStep > index }"
                    @click="goToStep(index)">
                    <div class="step-number">
                        <i v-if="currentStep > index" class="pi pi-check"></i>
                        <span v-else>{{ index + 1 }}</span>
                    </div>
                    <div class="step-label">{{ step.label }}</div>
                </div>
            </div>

            <!-- Step Content -->
            <div class="wizard-content">
                <!-- Step 1: Basic Information -->
                <div v-show="currentStep === 0" class="step-panel">
                    <div class="step-title">
                        <i class="pi pi-user"></i>
                        Basic Information
                    </div>
                    <div class="step-subtitle">Personal and organizational details</div>
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Employee Number ID <span class="required">*</span></label>
                            <p-inputtext v-model="form.employeeNumber" placeholder="e.g. EMP-001"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">First Name <span class="required">*</span></label>
                            <p-inputtext v-model="form.firstName" placeholder="Enter first name"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Second Name <span class="required">*</span></label>
                            <p-inputtext v-model="form.secondName" placeholder="Enter second name"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Family Name <span class="required">*</span></label>
                            <p-inputtext v-model="form.familyName" placeholder="Enter family name"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Duty Name (Optional)</label>
                            <p-inputtext v-model="form.dutyName" placeholder="Enter duty name"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Mobile Number <span class="required">*</span></label>
                            <p-inputtext v-model="form.mobile" placeholder="+20 100 000 0000"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Personal Email <span class="required">*</span></label>
                            <p-inputtext v-model="form.personalEmail" placeholder="email@example.com"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nationality <span class="required">*</span></label>
                            <p-select v-model="form.nationality" :options="countries" optionLabel="nameEn" optionValue="nameEn" placeholder="Select nationality" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Entity ID</label>
                            <p-inputtext v-model="form.entityId" placeholder="Enter entity ID"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Country of Work <span class="required">*</span></label>
                            <p-select v-model="form.countryOfWork" :options="countries" optionLabel="nameEn" optionValue="nameEn" placeholder="Select country" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Currency <span class="required">*</span></label>
                            <p-select v-model="form.currency" :options="currencies" placeholder="Select currency" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Department <span class="required">*</span></label>
                            <p-select v-model="form.department" :options="departments" optionLabel="nameEn" optionValue="id" placeholder="Select department" style="width: 100%;" @change="onDepartmentChange"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Section</label>
                            <p-select v-model="form.section" :options="filteredSections" optionLabel="nameEn" optionValue="id" placeholder="Select section" style="width: 100%;" :disabled="!form.department" @change="onSectionChange"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Unit</label>
                            <p-select v-model="form.unit" :options="filteredUnits" optionLabel="nameEn" optionValue="id" placeholder="Select unit" style="width: 100%;" :disabled="!form.section" @change="onUnitChange"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Team</label>
                            <p-select v-model="form.team" :options="filteredTeams" optionLabel="nameEn" optionValue="id" placeholder="Select team" style="width: 100%;" :disabled="!form.unit"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Gender <span class="required">*</span></label>
                            <p-select v-model="form.gender" :options="genders" placeholder="Select gender" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Marital Status</label>
                            <p-select v-model="form.maritalStatus" :options="maritalStatuses" placeholder="Select status" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cost Center</label>
                            <p-select v-model="form.costCenter" :options="costCenters" optionLabel="nameEn" optionValue="id" placeholder="Select cost center" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Sub Cost Center</label>
                            <p-select v-model="form.subCostCenter" :options="costCenters" optionLabel="nameEn" optionValue="id" placeholder="Select sub cost center" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Date of Hiring <span class="required">*</span></label>
                            <p-datepicker v-model="form.dateOfHiring" dateFormat="dd/mm/yy" placeholder="Select date" style="width: 100%;"></p-datepicker>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Job Title <span class="required">*</span></label>
                            <p-inputtext v-model="form.jobTitle" placeholder="Enter job title"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Grade</label>
                            <p-inputtext v-model="form.grade" placeholder="Enter grade"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Line Manager</label>
                            <p-select v-model="form.lineManager" :options="employees" optionLabel="firstName" optionValue="id" placeholder="Select manager" style="width: 100%;"></p-select>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--surface-ground); border-radius: 8px;">
                            <p-checkbox v-model="form.sendInvitation" :binary="true"></p-checkbox>
                            <div>
                                <div style="font-weight: 600;">Send Invitation Link</div>
                                <div style="font-size: 0.85rem; color: var(--text-color-secondary);">Send an email invitation to the employee to complete their profile</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Documents & Personal Details -->
                <div v-show="currentStep === 1" class="step-panel">
                    <div class="step-title">
                        <i class="pi pi-file"></i>
                        Documents & Personal Details
                    </div>
                    <div class="step-subtitle">Identity documents and emergency contacts</div>
                    
                    <div class="form-section-title">Identity Documents</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">National ID Document <span class="required">*</span></label>
                            <p-fileupload mode="basic" accept="image/*,application/pdf" :maxFileSize="5000000" chooseLabel="Upload National ID"></p-fileupload>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Passport (Optional)</label>
                            <p-fileupload mode="basic" accept="image/*,application/pdf" :maxFileSize="5000000" chooseLabel="Upload Passport"></p-fileupload>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Date of Birth <span class="required">*</span></label>
                            <p-datepicker v-model="form.dateOfBirth" dateFormat="dd/mm/yy" placeholder="Select date" style="width: 100%;"></p-datepicker>
                        </div>
                        <div class="form-group">
                            <label class="form-label">CV</label>
                            <p-fileupload mode="basic" accept="application/pdf,.doc,.docx" :maxFileSize="5000000" chooseLabel="Upload CV"></p-fileupload>
                        </div>
                    </div>

                    <div class="form-section-title">Education</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Academic Degree</label>
                            <p-select v-model="form.academicDegree" :options="academicDegrees" placeholder="Select degree" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Graduation Certificate</label>
                            <p-fileupload mode="basic" accept="image/*,application/pdf" :maxFileSize="5000000" chooseLabel="Upload Certificate"></p-fileupload>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Additional Certificate (Optional)</label>
                            <p-fileupload mode="basic" accept="image/*,application/pdf" :maxFileSize="5000000" chooseLabel="Upload Certificate"></p-fileupload>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Professional Picture</label>
                            <p-fileupload mode="basic" accept="image/*" :maxFileSize="2000000" chooseLabel="Upload Photo"></p-fileupload>
                        </div>
                    </div>

                    <div v-if="form.nationality === 'Egypt'" class="form-section-title">Egypt Specific</div>
                    <div v-if="form.nationality === 'Egypt'" class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Army Status</label>
                            <p-select v-model="form.armyStatus" :options="armyStatuses" placeholder="Select status" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Social Insurance Number</label>
                            <p-inputtext v-model="form.socialInsuranceNumber" placeholder="Enter social insurance number"></p-inputtext>
                        </div>
                    </div>

                    <div class="form-section-title">Address</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Location of Residence</label>
                            <p-inputtext v-model="form.locationOfResidence" placeholder="Enter city/area"></p-inputtext>
                        </div>
                        <div class="form-group" style="grid-column: span 2;">
                            <label class="form-label">Home Address</label>
                            <p-textarea v-model="form.homeAddress" rows="2" placeholder="Enter full address"></p-textarea>
                        </div>
                    </div>

                    <div class="form-section-title">Emergency Contact</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Contact Name <span class="required">*</span></label>
                            <p-inputtext v-model="form.emergencyContactName" placeholder="Enter name"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Relationship <span class="required">*</span></label>
                            <p-inputtext v-model="form.emergencyContactRelationship" placeholder="e.g. Spouse, Parent"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number <span class="required">*</span></label>
                            <p-inputtext v-model="form.emergencyContactPhone" placeholder="+20 100 000 0000"></p-inputtext>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Work Access -->
                <div v-show="currentStep === 2" class="step-panel">
                    <div class="step-title">
                        <i class="pi pi-lock"></i>
                        Work Access
                    </div>
                    <div class="step-subtitle">System and communication setup</div>
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Extension Number</label>
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <p-radiobutton v-model="form.hasExtension" :value="true" inputId="extYes"></p-radiobutton>
                                <label for="extYes">Available</label>
                                <p-radiobutton v-model="form.hasExtension" :value="false" inputId="extNo"></p-radiobutton>
                                <label for="extNo">No Extension</label>
                            </div>
                        </div>
                        <div class="form-group" v-if="form.hasExtension">
                            <label class="form-label">Extension Number</label>
                            <p-inputtext v-model="form.extensionNumber" placeholder="Enter extension"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Work Email <span class="required">*</span></label>
                            <p-inputtext v-model="form.workEmail" placeholder="employee@company.com"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Auth Setting Done</label>
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <p-radiobutton v-model="form.authSettingDone" :value="true" inputId="authYes"></p-radiobutton>
                                <label for="authYes">Yes</label>
                                <p-radiobutton v-model="form.authSettingDone" :value="false" inputId="authNo"></p-radiobutton>
                                <label for="authNo">No</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 4: Contract & Salary -->
                <div v-show="currentStep === 3" class="step-panel">
                    <div class="step-title">
                        <i class="pi pi-file-edit"></i>
                        Contract & Salary
                    </div>
                    <div class="step-subtitle">Employment terms and compensation</div>
                    
                    <div class="form-section-title">Contract Details</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Offer Contract Attachment</label>
                            <p-fileupload mode="basic" accept="application/pdf,.doc,.docx" :maxFileSize="5000000" chooseLabel="Upload Contract"></p-fileupload>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Contract Classification <span class="required">*</span></label>
                            <p-select v-model="form.contractClassification" :options="contractClassifications" placeholder="Select classification" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group" v-if="form.contractClassification === 'Defined Period'">
                            <label class="form-label">Contract Duration</label>
                            <p-select v-model="form.contractDuration" :options="contractDurations" placeholder="Select duration" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Contract Type <span class="required">*</span></label>
                            <p-select v-model="form.contractType" :options="contractTypes" placeholder="Select type" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Probation Period</label>
                            <p-select v-model="form.probationPeriod" :options="probationPeriods" placeholder="Select period" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Annual Leave (Days)</label>
                            <p-select v-model="form.annualLeaveDays" :options="annualLeaveDays" placeholder="Select days" style="width: 100%;"></p-select>
                        </div>
                    </div>

                    <div class="form-section-title">Salary Information</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Gross Salary <span class="required">*</span></label>
                            <p-inputnumber v-model="form.grossSalary" mode="currency" :currency="form.currency || 'USD'" locale="en-US" placeholder="0.00"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Net Salary</label>
                            <p-inputnumber v-model="form.netSalary" mode="currency" :currency="form.currency || 'USD'" locale="en-US" placeholder="0.00"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Basic Salary</label>
                            <p-inputnumber v-model="form.basicSalary" mode="currency" :currency="form.currency || 'USD'" locale="en-US" placeholder="0.00"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">House Allowance</label>
                            <p-inputnumber v-model="form.houseAllowance" mode="currency" :currency="form.currency || 'USD'" locale="en-US" placeholder="0.00"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Transportation Allowance</label>
                            <p-inputnumber v-model="form.transportationAllowance" mode="currency" :currency="form.currency || 'USD'" locale="en-US" placeholder="0.00"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Other Allowance</label>
                            <p-inputnumber v-model="form.otherAllowance" mode="currency" :currency="form.currency || 'USD'" locale="en-US" placeholder="0.00"></p-inputnumber>
                        </div>
                    </div>

                    <div v-if="form.countryOfWork === 'Saudi Arabia'" class="form-section-title">GOSI Information</div>
                    <div v-if="form.countryOfWork === 'Saudi Arabia'" class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Total Salary Deserved by GOSI</label>
                            <p-inputnumber v-model="form.gosiSalary" mode="currency" currency="SAR" locale="en-US" placeholder="0.00"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">GOSI Amount (Employee)</label>
                            <p-inputnumber v-model="form.gosiEmployee" mode="currency" currency="SAR" locale="en-US" placeholder="0.00"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">GOSI Amount (Company)</label>
                            <p-inputnumber v-model="form.gosiCompany" mode="currency" currency="SAR" locale="en-US" placeholder="0.00"></p-inputnumber>
                        </div>
                    </div>

                    <div class="form-section-title">Payment Method</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Salary Transfer Method <span class="required">*</span></label>
                            <p-select v-model="form.salaryTransferMethod" :options="salaryTransferMethods" placeholder="Select method" style="width: 100%;"></p-select>
                        </div>
                    </div>
                    
                    <div v-if="form.salaryTransferMethod === 'Bank Transfer'" class="form-grid" style="margin-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Bank Name <span class="required">*</span></label>
                            <p-inputtext v-model="form.bankName" placeholder="Enter bank name"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">IBAN Account <span class="required">*</span></label>
                            <p-inputtext v-model="form.ibanAccount" placeholder="Enter IBAN"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Account Holder Name</label>
                            <p-inputtext v-model="form.bankAccountName" placeholder="Name as in bank"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">IBAN Attachment</label>
                            <p-fileupload mode="basic" accept="image/*,application/pdf" :maxFileSize="5000000" chooseLabel="Upload IBAN"></p-fileupload>
                        </div>
                    </div>
                </div>

                <!-- Step 5: Attendance & Schedule -->
                <div v-show="currentStep === 4" class="step-panel">
                    <div class="step-title">
                        <i class="pi pi-calendar"></i>
                        Attendance & Schedule
                    </div>
                    <div class="step-subtitle">Work schedule configuration based on contract type</div>
                    
                    <div v-if="form.contractType === 'Intern'" class="empty-state" style="padding: 3rem;">
                        <i class="pi pi-info-circle" style="font-size: 3rem; color: var(--primary-color);"></i>
                        <h3>No Attendance Required</h3>
                        <p>Interns are not required to track attendance</p>
                    </div>

                    <div v-else-if="form.contractType === 'Full-time' || form.contractType === 'Part-time'">
                        <div class="form-section-title">Biometric & Schedule</div>
                        <div class="form-grid">
                            <div class="form-group" style="grid-column: span 2;">
                                <label class="form-label">Biometric Devices</label>
                                <p-multiselect v-model="form.biometricDevices" :options="biometricDevices" optionLabel="name" optionValue="id" placeholder="Select devices" style="width: 100%;"></p-multiselect>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Schedule Type <span class="required">*</span></label>
                                <p-select v-model="form.scheduleType" :options="scheduleTypes" placeholder="Select type" style="width: 100%;"></p-select>
                            </div>
                        </div>
                        
                        <div v-if="form.scheduleType" class="form-grid" style="margin-top: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Working Days</label>
                                <p-multiselect v-model="form.workingDays" :options="weekDays" placeholder="Select days" style="width: 100%;"></p-multiselect>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Shift</label>
                                <p-select v-model="form.shift" :options="['Morning Shift', 'Evening Shift', 'Night Shift', 'Flexible']" placeholder="Select shift" style="width: 100%;"></p-select>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="form.contractType === 'Full-time Remote' || form.contractType === 'Part-time Remote'">
                        <div class="form-section-title">Remote Work Settings</div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">System Login Time</label>
                                <p-datepicker v-model="form.systemLoginTime" timeOnly placeholder="Select time" style="width: 100%;"></p-datepicker>
                            </div>
                            <div class="form-group">
                                <label class="form-label">System Logout Time</label>
                                <p-datepicker v-model="form.systemLogoutTime" timeOnly placeholder="Select time" style="width: 100%;"></p-datepicker>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Schedule Type <span class="required">*</span></label>
                                <p-select v-model="form.scheduleType" :options="scheduleTypes" placeholder="Select type" style="width: 100%;"></p-select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Working Days</label>
                                <p-multiselect v-model="form.workingDays" :options="weekDays" placeholder="Select days" style="width: 100%;"></p-multiselect>
                            </div>
                        </div>
                    </div>

                    <div v-else class="empty-state" style="padding: 3rem;">
                        <i class="pi pi-exclamation-triangle" style="font-size: 3rem; color: #f59e0b;"></i>
                        <h3>Select Contract Type First</h3>
                        <p>Please select a contract type in Step 4 to configure attendance settings</p>
                    </div>
                </div>

                <!-- Step 6: Iqama Details (Saudi Arabia) -->
                <div v-show="currentStep === 5" class="step-panel">
                    <div class="step-title">
                        <i class="pi pi-id-card"></i>
                        Iqama Details
                    </div>
                    <div class="step-subtitle">Residency permit information (Saudi Arabia)</div>
                    
                    <div v-if="form.countryOfWork !== 'Saudi Arabia'" class="empty-state" style="padding: 3rem;">
                        <i class="pi pi-info-circle" style="font-size: 3rem; color: var(--primary-color);"></i>
                        <h3>Not Applicable</h3>
                        <p>Iqama details are only required for employees working in Saudi Arabia</p>
                    </div>

                    <div v-else>
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label class="form-label">Does the employee have an Iqama?</label>
                            <div style="display: flex; gap: 1rem; align-items: center; margin-top: 0.5rem;">
                                <p-radiobutton v-model="form.hasIqama" :value="true" inputId="iqamaYes"></p-radiobutton>
                                <label for="iqamaYes">Yes</label>
                                <p-radiobutton v-model="form.hasIqama" :value="false" inputId="iqamaNo"></p-radiobutton>
                                <label for="iqamaNo">No</label>
                            </div>
                        </div>

                        <div v-if="form.hasIqama" class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Office <span class="required">*</span></label>
                                <p-select v-model="form.iqamaOffice" :options="offices" optionLabel="name" optionValue="id" placeholder="Select office" style="width: 100%;"></p-select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Expiry Date <span class="required">*</span></label>
                                <p-datepicker v-model="form.iqamaExpiryDate" dateFormat="dd/mm/yy" placeholder="Select date" style="width: 100%;"></p-datepicker>
                            </div>
                            <div class="form-group" style="grid-column: span 2;">
                                <label class="form-label">Occupation in Iqama</label>
                                <p-inputtext v-model="form.iqamaOccupation" placeholder="Enter occupation as stated in Iqama"></p-inputtext>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wizard Footer -->
            <div class="wizard-footer">
                <p-button v-if="currentStep > 0" label="Previous" icon="pi pi-arrow-left" outlined @click="prevStep"></p-button>
                <div style="flex: 1;"></div>
                <p-button v-if="currentStep < steps.length - 1" label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextStep"></p-button>
                <p-button v-else label="Submit Employee" icon="pi pi-check" @click="submitEmployee"></p-button>
            </div>
        </div>
    `,

    emits: ['back', 'submitted'],

    setup(props, { emit }) {
        const { ref, computed } = Vue;

        // Steps definition
        const steps = ref([
            { label: 'Basic Info' },
            { label: 'Documents' },
            { label: 'Work Access' },
            { label: 'Contract & Salary' },
            { label: 'Attendance' },
            { label: 'Iqama' }
        ]);

        const currentStep = ref(0);

        // Form data
        const form = ref({
            // Step 1
            employeeNumber: '',
            firstName: '',
            secondName: '',
            familyName: '',
            dutyName: '',
            mobile: '',
            personalEmail: '',
            nationality: null,
            entityId: '',
            countryOfWork: null,
            currency: null,
            department: null,
            section: null,
            unit: null,
            team: null,
            gender: null,
            maritalStatus: null,
            costCenter: null,
            subCostCenter: null,
            dateOfHiring: null,
            jobTitle: '',
            grade: '',
            lineManager: null,
            sendInvitation: true,
            // Step 2
            dateOfBirth: null,
            academicDegree: null,
            armyStatus: null,
            socialInsuranceNumber: '',
            locationOfResidence: '',
            homeAddress: '',
            emergencyContactName: '',
            emergencyContactRelationship: '',
            emergencyContactPhone: '',
            // Step 3
            hasExtension: false,
            extensionNumber: '',
            workEmail: '',
            authSettingDone: false,
            // Step 4
            contractClassification: null,
            contractDuration: null,
            contractType: null,
            probationPeriod: null,
            annualLeaveDays: null,
            grossSalary: null,
            netSalary: null,
            basicSalary: null,
            houseAllowance: null,
            transportationAllowance: null,
            otherAllowance: null,
            gosiSalary: null,
            gosiEmployee: null,
            gosiCompany: null,
            salaryTransferMethod: null,
            bankName: '',
            ibanAccount: '',
            bankAccountName: '',
            // Step 5
            biometricDevices: [],
            scheduleType: null,
            workingDays: [],
            shift: null,
            systemLoginTime: null,
            systemLogoutTime: null,
            // Step 6
            hasIqama: false,
            iqamaOffice: null,
            iqamaExpiryDate: null,
            iqamaOccupation: ''
        });

        // Static data references
        const countries = ref([...StaticData.countries]);
        const departments = ref([...StaticData.departments]);
        const sections = ref([...StaticData.sections]);
        const units = ref([...StaticData.units]);
        const teams = ref([...StaticData.teams]);
        const costCenters = ref([...StaticData.costCenters]);
        const offices = ref([...StaticData.offices]);
        const biometricDevices = ref([...StaticData.biometricDevices]);
        const employees = ref([...StaticData.employees]);

        // Dropdown options
        const genders = ref([...StaticData.genders]);
        const maritalStatuses = ref([...StaticData.maritalStatuses]);
        const academicDegrees = ref([...StaticData.academicDegrees]);
        const armyStatuses = ref([...StaticData.armyStatuses]);
        const contractClassifications = ref([...StaticData.contractClassifications]);
        const contractDurations = ref([...StaticData.contractDurations]);
        const contractTypes = ref([...StaticData.contractTypes]);
        const probationPeriods = ref([...StaticData.probationPeriods]);
        const annualLeaveDays = ref([...StaticData.annualLeaveDays]);
        const currencies = ref([...StaticData.currencies]);
        const salaryTransferMethods = ref([...StaticData.salaryTransferMethods]);
        const scheduleTypes = ref([...StaticData.scheduleTypes]);
        const weekDays = ref([...StaticData.weekDays]);

        // Computed filtered options
        const filteredSections = computed(() => {
            if (!form.value.department) return [];
            return sections.value.filter(s => s.departmentId === form.value.department);
        });

        const filteredUnits = computed(() => {
            if (!form.value.section) return [];
            return units.value.filter(u => u.sectionId === form.value.section);
        });

        const filteredTeams = computed(() => {
            if (!form.value.unit) return [];
            return teams.value.filter(t => t.unitId === form.value.unit);
        });

        // Methods
        const goToStep = (index) => {
            if (index <= currentStep.value) {
                currentStep.value = index;
            }
        };

        const nextStep = () => {
            if (currentStep.value < steps.value.length - 1) {
                currentStep.value++;
            }
        };

        const prevStep = () => {
            if (currentStep.value > 0) {
                currentStep.value--;
            }
        };

        const onDepartmentChange = () => {
            form.value.section = null;
            form.value.unit = null;
            form.value.team = null;
        };

        const onSectionChange = () => {
            form.value.unit = null;
            form.value.team = null;
        };

        const onUnitChange = () => {
            form.value.team = null;
        };

        const saveAsDraft = () => {
            StaticData.employeeDrafts.push({ ...form.value, savedAt: new Date() });
            alert('Draft saved successfully!');
        };

        const submitEmployee = () => {
            // Add to employees list
            const newEmployee = {
                id: StaticData.employees.length + 1,
                employeeNumber: form.value.employeeNumber,
                firstName: form.value.firstName,
                secondName: form.value.secondName,
                familyName: form.value.familyName,
                avatar: 'https://i.pravatar.cc/40?img=' + (StaticData.employees.length + 20),
                email: form.value.workEmail,
                mobile: form.value.mobile,
                nationality: form.value.nationality,
                department: departments.value.find(d => d.id === form.value.department)?.nameEn || '',
                section: sections.value.find(s => s.id === form.value.section)?.nameEn || '',
                jobTitle: form.value.jobTitle,
                status: 'Active',
                dateOfHiring: form.value.dateOfHiring ? form.value.dateOfHiring.toLocaleDateString('en-GB') : '',
                contractType: form.value.contractType
            };
            StaticData.employees.push(newEmployee);
            emit('submitted');
        };

        return {
            steps,
            currentStep,
            form,
            countries,
            departments,
            sections,
            units,
            teams,
            costCenters,
            offices,
            biometricDevices,
            employees,
            genders,
            maritalStatuses,
            academicDegrees,
            armyStatuses,
            contractClassifications,
            contractDurations,
            contractTypes,
            probationPeriods,
            annualLeaveDays,
            currencies,
            salaryTransferMethods,
            scheduleTypes,
            weekDays,
            filteredSections,
            filteredUnits,
            filteredTeams,
            goToStep,
            nextStep,
            prevStep,
            onDepartmentChange,
            onSectionChange,
            onUnitChange,
            saveAsDraft,
            submitEmployee
        };
    }
};

// Make it available globally
window.AddEmployeeComponent = AddEmployeeComponent;

