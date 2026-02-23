/**
 * Add Employee Component
 * 7-Step Wizard for adding new employees
 * Updated: Added Step 7 (Checklist) for onboarding completion
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
                            <p-inputtext v-model="form.employeeNumber" placeholder="e.g. EMP-001" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Entity <span class="required">*</span></label>
                            <p-select v-model="form.entity" :options="entities" optionLabel="name" optionValue="name" placeholder="Select entity" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">First Name <span class="required">*</span></label>
                            <p-inputtext v-model="form.firstName" placeholder="Enter first name" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Second Name <span class="required">*</span></label>
                            <p-inputtext v-model="form.secondName" placeholder="Enter second name" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Family Name <span class="required">*</span></label>
                            <p-inputtext v-model="form.familyName" placeholder="Enter family name" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Duty Name (Optional)</label>
                            <p-inputtext v-model="form.dutyName" placeholder="Enter duty name" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Mobile Number <span class="required">*</span></label>
                            <p-inputtext v-model="form.mobile" placeholder="+20 100 000 0000" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Personal Email <span class="required">*</span></label>
                            <p-inputtext v-model="form.personalEmail" placeholder="email@example.com" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nationality <span class="required">*</span></label>
                            <p-select v-model="form.nationality" :options="nationalities" optionLabel="name" optionValue="name" 
                                      placeholder="Select nationality" style="width: 100%;" @change="onNationalityChange">
                                <template #option="slotProps">
                                    <div class="nationality-option">
                                        <img :src="slotProps.option.flag" class="nationality-flag" :alt="slotProps.option.name">
                                        <span>{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Country of Work <span class="required">*</span></label>
                            <p-select v-model="form.countryOfWork" :options="countriesOfWork" optionLabel="name" optionValue="name" 
                                      placeholder="Select country" style="width: 100%;">
                                <template #option="slotProps">
                                    <div class="nationality-option">
                                        <img :src="slotProps.option.logo" class="nationality-flag" :alt="slotProps.option.name">
                                        <span>{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </p-select>
                        </div>
                    </div>

                    <!-- Egypt-specific fields (shown if nationality is Egyptian) -->
                    <div v-if="form.nationality === 'Egyptian'" class="form-section-title">Egypt Specific Information</div>
                    <div v-if="form.nationality === 'Egyptian'" class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Army Status</label>
                            <p-select v-model="form.armyStatus" :options="armyStatuses" placeholder="Select status" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Social Insurance Number</label>
                            <p-inputtext v-model="form.socialInsuranceNumber" placeholder="Enter social insurance number" style="width: 100%;"></p-inputtext>
                        </div>
                    </div>

                    <div class="form-section-title">Organization</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Department <span class="required">*</span></label>
                            <p-select v-model="form.department" :options="departments" optionLabel="name" optionValue="id" 
                                      placeholder="Select department" style="width: 100%;" @change="onDepartmentChange"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Section</label>
                            <p-select v-model="form.section" :options="filteredSections" optionLabel="name" optionValue="id" 
                                      placeholder="Select section (optional)" style="width: 100%;" :disabled="!form.department" 
                                      @change="onSectionChange" showClear></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Unit</label>
                            <p-select v-model="form.unit" :options="filteredUnits" optionLabel="name" optionValue="id" 
                                      placeholder="Select unit (optional)" style="width: 100%;" :disabled="!form.section" 
                                      @change="onUnitChange" showClear></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Team</label>
                            <p-select v-model="form.team" :options="filteredTeams" optionLabel="name" optionValue="id" 
                                      placeholder="Select team (optional)" style="width: 100%;" :disabled="!form.unit" showClear></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cost Center</label>
                            <p-select v-model="form.costCenter" :options="costCenters" optionLabel="name" optionValue="id" 
                                      placeholder="Select cost center" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Date of Hiring <span class="required">*</span></label>
                            <p-datepicker v-model="form.dateOfHiring" dateFormat="dd/mm/yy" placeholder="Select date" style="width: 100%;"></p-datepicker>
                        </div>
                    </div>

                    <div class="form-section-title">Grade & Position</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Main Grade <span class="required">*</span></label>
                            <p-select v-model="form.mainGrade" :options="mainGrades" optionLabel="name" optionValue="id" 
                                      placeholder="Select main grade" style="width: 100%;" @change="onMainGradeChange"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Sub Grade <span class="required">*</span></label>
                            <p-select v-model="form.subGrade" :options="filteredSubGrades" optionLabel="name" optionValue="id" 
                                      placeholder="Select sub grade" style="width: 100%;" :disabled="!form.mainGrade"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Job Title <span class="required">*</span></label>
                            <p-select v-model="form.jobTitle" :options="filteredJobTitles" optionLabel="name" optionValue="id" 
                                      placeholder="Select job title" style="width: 100%;" :disabled="!form.mainGrade"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Line Manager</label>
                            <p-select v-model="form.lineManager" :options="eligibleLineManagers" optionLabel="displayName" optionValue="id" 
                                      placeholder="Select manager" style="width: 100%;">
                                <template #option="slotProps">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <img :src="slotProps.option.avatar" style="width: 24px; height: 24px; border-radius: 50%;">
                                        <div>
                                            <div>{{ slotProps.option.displayName }}</div>
                                            <div style="font-size: 0.75rem; color: var(--text-color-secondary);">{{ slotProps.option.mainGrade }}</div>
                                        </div>
                                    </div>
                                </template>
                            </p-select>
                            <small style="color: var(--text-color-secondary);">Only Supervisor, Management, and Executives grades</small>
                        </div>
                    </div>

                    <div class="form-section-title">Personal</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Gender <span class="required">*</span></label>
                            <p-select v-model="form.gender" :options="genders" placeholder="Select gender" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Marital Status</label>
                            <p-select v-model="form.maritalStatus" :options="maritalStatuses" placeholder="Select status" style="width: 100%;"></p-select>
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
                    <div class="step-subtitle">Identity documents, bank information, and emergency contacts</div>
                    
                    <div class="form-section-title">Professional Picture</div>
                    <div class="picture-upload-container">
                        <div class="picture-preview">
                            <img v-if="form.picturePreview" :src="form.picturePreview" alt="Preview">
                            <i v-else class="pi pi-user"></i>
                        </div>
                        <div class="picture-guidelines">
                            <h4>Photo Guidelines</h4>
                            <ul>
                                <li>Size: 400 x 400 pixels (square)</li>
                                <li>Format: JPG or PNG</li>
                                <li>Max file size: 2MB</li>
                                <li>Use a plain white or light background</li>
                                <li>Face the camera directly with good lighting</li>
                                <li>Dress professionally</li>
                            </ul>
                            <p-fileupload mode="basic" accept="image/*" :maxFileSize="2000000" 
                                          chooseLabel="Upload Photo" @select="onPictureSelect" style="margin-top: 0.5rem;"></p-fileupload>
                        </div>
                    </div>

                    <div class="form-section-title">Identity Documents</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">CV <span class="required">*</span></label>
                            <p-fileupload mode="basic" accept="application/pdf,.doc,.docx" :maxFileSize="5000000" chooseLabel="Upload CV (Required)"></p-fileupload>
                        </div>
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
                    </div>

                    <div class="form-section-title">Address</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Country of Residence</label>
                            <p-select v-model="form.residenceCountry" :options="allCountries" optionLabel="name" optionValue="name" 
                                      placeholder="Select country" style="width: 100%;">
                                <template #option="slotProps">
                                    <div class="nationality-option">
                                        <img :src="slotProps.option.flag" class="nationality-flag" :alt="slotProps.option.name">
                                        <span>{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">City</label>
                            <p-inputtext v-model="form.city" placeholder="Enter city" style="width: 100%;"></p-inputtext>
                        </div>
                    </div>

                    <div class="form-section-title">Bank Information</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Bank Name</label>
                            <p-inputtext v-model="form.bankName" placeholder="Enter bank name" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">IBAN Account</label>
                            <p-inputtext v-model="form.ibanAccount" placeholder="Enter IBAN" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Account Holder Name</label>
                            <p-inputtext v-model="form.bankAccountName" placeholder="Name as in bank" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">IBAN Attachment</label>
                            <p-fileupload mode="basic" accept="image/*,application/pdf" :maxFileSize="5000000" chooseLabel="Upload IBAN"></p-fileupload>
                        </div>
                    </div>

                    <div class="form-section-title">Emergency Contact</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Contact Name <span class="required">*</span></label>
                            <p-inputtext v-model="form.emergencyContactName" placeholder="Enter name" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Relationship <span class="required">*</span></label>
                            <p-select v-model="form.emergencyContactRelationship" :options="emergencyRelationships" 
                                      placeholder="Select relationship" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number <span class="required">*</span></label>
                            <p-inputtext v-model="form.emergencyContactPhone" placeholder="+20 100 000 0000" style="width: 100%;"></p-inputtext>
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
                            <p-inputtext v-model="form.extensionNumber" placeholder="Enter extension" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Work Email <span class="required">*</span></label>
                            <p-inputtext v-model="form.workEmail" placeholder="employee@company.com" style="width: 100%;"></p-inputtext>
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

                    <!-- GOSI/NOSI Registration Toggle for Saudi Arabia -->
                    <div v-if="form.countryOfWork === 'Saudi Arabia'" class="form-section-title">GOSI Registration</div>
                    <div v-if="form.countryOfWork === 'Saudi Arabia'" class="form-group" style="margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--surface-ground); border-radius: 8px;">
                            <p-toggleswitch v-model="form.isRegisteredInGosi"></p-toggleswitch>
                            <div>
                                <div style="font-weight: 600;">Is registered in GOSI?</div>
                                <div style="font-size: 0.85rem; color: var(--text-color-secondary);">General Organization for Social Insurance (Saudi Arabia)</div>
                            </div>
                        </div>
                    </div>

                    <!-- NOSI Registration Toggle for Egypt -->
                    <div v-if="form.countryOfWork === 'Egypt'" class="form-section-title">NOSI Registration</div>
                    <div v-if="form.countryOfWork === 'Egypt'" class="form-group" style="margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--surface-ground); border-radius: 8px;">
                            <p-toggleswitch v-model="form.isRegisteredInNosi"></p-toggleswitch>
                            <div>
                                <div style="font-weight: 600;">Is registered in NOSI?</div>
                                <div style="font-size: 0.85rem; color: var(--text-color-secondary);">National Organization for Social Insurance (Egypt)</div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section-title">Salary Information</div>
                    
                    <!-- If NOT registered in GOSI/NOSI - show only Gross Salary -->
                    <div v-if="(form.countryOfWork === 'Saudi Arabia' && !form.isRegisteredInGosi) || 
                               (form.countryOfWork === 'Egypt' && !form.isRegisteredInNosi) ||
                               (form.countryOfWork !== 'Saudi Arabia' && form.countryOfWork !== 'Egypt')" 
                         class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Gross Salary <span class="required">*</span></label>
                            <p-inputnumber v-model="form.grossSalary" mode="decimal" :minFractionDigits="2" placeholder="0.00" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Salary Transfer Method <span class="required">*</span></label>
                            <p-select v-model="form.salaryTransferMethod" :options="salaryTransferMethods" placeholder="Select method" style="width: 100%;"></p-select>
                        </div>
                    </div>

                    <!-- If registered in GOSI (Saudi Arabia) - show detailed breakdown -->
                    <div v-if="form.countryOfWork === 'Saudi Arabia' && form.isRegisteredInGosi" class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Basic Salary <span class="required">*</span></label>
                            <p-inputnumber v-model="form.basicSalary" mode="decimal" :minFractionDigits="2" placeholder="0.00" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">House Allowance</label>
                            <p-inputnumber v-model="form.houseAllowance" mode="decimal" :minFractionDigits="2" placeholder="0.00" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Transportation Allowance</label>
                            <p-inputnumber v-model="form.transportationAllowance" mode="decimal" :minFractionDigits="2" placeholder="0.00" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Other Allowance</label>
                            <p-inputnumber v-model="form.otherAllowance" mode="decimal" :minFractionDigits="2" placeholder="0.00" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Salary Transfer Method <span class="required">*</span></label>
                            <p-select v-model="form.salaryTransferMethod" :options="salaryTransferMethods" placeholder="Select method" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group" style="grid-column: span 2;">
                            <div class="card" style="background: var(--surface-ground); padding: 1rem;">
                                <div style="font-weight: 600; margin-bottom: 0.5rem;">GOSI Contribution (Informational)</div>
                                <div style="display: flex; gap: 2rem;">
                                    <div>
                                        <div style="font-size: 0.85rem; color: var(--text-color-secondary);">Employee Contribution (9.75%)</div>
                                        <div style="font-weight: 600; font-size: 1.1rem;">{{ formatCurrency(gosiEmployeeAmount) }}</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 0.85rem; color: var(--text-color-secondary);">Company Contribution (11.75%)</div>
                                        <div style="font-weight: 600; font-size: 1.1rem;">{{ formatCurrency(gosiCompanyAmount) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- If registered in NOSI (Egypt) - show detailed breakdown -->
                    <div v-if="form.countryOfWork === 'Egypt' && form.isRegisteredInNosi" class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Basic Salary <span class="required">*</span></label>
                            <p-inputnumber v-model="form.basicSalary" mode="decimal" :minFractionDigits="2" placeholder="0.00" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">House Allowance</label>
                            <p-inputnumber v-model="form.houseAllowance" mode="decimal" :minFractionDigits="2" placeholder="0.00" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Transportation Allowance</label>
                            <p-inputnumber v-model="form.transportationAllowance" mode="decimal" :minFractionDigits="2" placeholder="0.00" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Other Allowance</label>
                            <p-inputnumber v-model="form.otherAllowance" mode="decimal" :minFractionDigits="2" placeholder="0.00" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Salary Transfer Method <span class="required">*</span></label>
                            <p-select v-model="form.salaryTransferMethod" :options="salaryTransferMethods" placeholder="Select method" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group" style="grid-column: span 2;">
                            <div class="card" style="background: var(--surface-ground); padding: 1rem;">
                                <div style="font-weight: 600; margin-bottom: 0.5rem;">NOSI Contribution (Informational)</div>
                                <div style="display: flex; gap: 2rem;">
                                    <div>
                                        <div style="font-size: 0.85rem; color: var(--text-color-secondary);">Employee Contribution (11%)</div>
                                        <div style="font-weight: 600; font-size: 1.1rem;">{{ formatCurrency(nosiEmployeeAmount) }}</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 0.85rem; color: var(--text-color-secondary);">Company Contribution (18.75%)</div>
                                        <div style="font-weight: 600; font-size: 1.1rem;">{{ formatCurrency(nosiCompanyAmount) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bank Information (shown when Bank Transfer is selected) -->
                    <div v-if="form.salaryTransferMethod === 'Bank Transfer'" style="margin-top: 1.5rem;">
                        <div class="form-section-title">Bank Information</div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Bank Name <span class="required">*</span></label>
                                <p-inputtext v-model="form.bankName" placeholder="Enter bank name" style="width: 100%;"></p-inputtext>
                            </div>
                            <div class="form-group">
                                <label class="form-label">IBAN Account <span class="required">*</span></label>
                                <p-inputtext v-model="form.ibanAccount" placeholder="Enter IBAN" style="width: 100%;"></p-inputtext>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Account Holder Name <span class="required">*</span></label>
                                <p-inputtext v-model="form.bankAccountName" placeholder="Name as in bank" style="width: 100%;"></p-inputtext>
                            </div>
                            <div class="form-group">
                                <label class="form-label">IBAN Attachment</label>
                                <p-fileupload mode="basic" accept="image/*,application/pdf" :maxFileSize="5000000" chooseLabel="Upload IBAN"></p-fileupload>
                            </div>
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
                        <div class="form-section-title">Office & Schedule</div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Office <span class="required">*</span></label>
                                <p-select v-model="form.office" :options="offices" optionLabel="name" optionValue="id" 
                                          placeholder="Select office" style="width: 100%;"></p-select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Schedule Type <span class="required">*</span></label>
                                <p-select v-model="form.scheduleType" :options="scheduleTypes" placeholder="Select type" style="width: 100%;"></p-select>
                            </div>
                        </div>
                        
                        <!-- Fixed Schedule Options -->
                        <div v-if="form.scheduleType === 'Fixed Schedule'" class="form-grid" style="margin-top: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Work Week Template <span class="required">*</span></label>
                                <p-select v-model="form.workWeek" :options="workWeeks" optionLabel="name" optionValue="id" 
                                          placeholder="Select work week" style="width: 100%;"></p-select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Shift</label>
                                <p-select v-model="form.shift" :options="shiftTemplates" optionLabel="name" optionValue="id" 
                                          placeholder="Select shift" style="width: 100%;"></p-select>
                            </div>
                        </div>

                        <!-- Variable Schedule: No working days or shift selection -->
                        <div v-if="form.scheduleType === 'Variable Schedule'" class="card" style="margin-top: 1rem; background: var(--surface-ground);">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <i class="pi pi-info-circle" style="color: var(--primary-color); font-size: 1.25rem;"></i>
                                <div>
                                    <div style="font-weight: 600;">Variable Schedule</div>
                                    <div style="font-size: 0.85rem; color: var(--text-color-secondary);">
                                        Employee will have flexible working hours without a fixed weekly pattern
                                    </div>
                                </div>
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
                            <div class="form-group" v-if="form.scheduleType === 'Fixed Schedule'">
                                <label class="form-label">Work Week Template</label>
                                <p-select v-model="form.workWeek" :options="workWeeks" optionLabel="name" optionValue="id" 
                                          placeholder="Select work week" style="width: 100%;"></p-select>
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
                                <label class="form-label">Iqama Number <span class="required">*</span></label>
                                <p-inputtext v-model="form.iqamaNumber" placeholder="Enter Iqama number" style="width: 100%;"></p-inputtext>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Expiry Date <span class="required">*</span></label>
                                <p-datepicker v-model="form.iqamaExpiryDate" dateFormat="dd/mm/yy" placeholder="Select date" style="width: 100%;"></p-datepicker>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Occupation in Iqama <span class="required">*</span></label>
                                <p-select v-model="form.iqamaOccupation" :options="iqamaOccupations" placeholder="Select occupation" style="width: 100%;"></p-select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Iqama Document</label>
                                <p-fileupload mode="basic" accept="image/*,application/pdf" :maxFileSize="5000000" chooseLabel="Upload Iqama"></p-fileupload>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 7: Checklist -->
                <div v-show="currentStep === 6" class="step-panel">
                    <div class="step-title">
                        <i class="pi pi-check-square"></i>
                        Onboarding Checklist
                    </div>
                    <div class="step-subtitle">Final verification before completing employee onboarding</div>
                    
                    <div class="onboarding-checklist">
                        <div class="checklist-section">
                            <h4><i class="pi pi-file"></i> Documentation</h4>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.documentsVerified" :binary="true"></p-checkbox>
                                <span>All required documents have been collected and verified</span>
                            </div>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.contractSigned" :binary="true"></p-checkbox>
                                <span>Employment contract signed by both parties</span>
                            </div>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.ndasSigned" :binary="true"></p-checkbox>
                                <span>NDA and confidentiality agreements signed</span>
                            </div>
                        </div>

                        <div class="checklist-section">
                            <h4><i class="pi pi-desktop"></i> System Access</h4>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.emailCreated" :binary="true"></p-checkbox>
                                <span>Corporate email account created</span>
                            </div>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.systemAccessGranted" :binary="true"></p-checkbox>
                                <span>Required system access and permissions granted</span>
                            </div>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.biometricEnrolled" :binary="true"></p-checkbox>
                                <span>Biometric/attendance system enrollment complete</span>
                            </div>
                        </div>

                        <div class="checklist-section">
                            <h4><i class="pi pi-briefcase"></i> Equipment & Resources</h4>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.equipmentIssued" :binary="true"></p-checkbox>
                                <span>Laptop/computer and peripherals issued</span>
                            </div>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.idCardIssued" :binary="true"></p-checkbox>
                                <span>Employee ID card issued</span>
                            </div>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.workstationAssigned" :binary="true"></p-checkbox>
                                <span>Workstation/desk assigned</span>
                            </div>
                        </div>

                        <div class="checklist-section">
                            <h4><i class="pi pi-users"></i> Orientation</h4>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.hrOrientationComplete" :binary="true"></p-checkbox>
                                <span>HR orientation session completed</span>
                            </div>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.teamIntroduction" :binary="true"></p-checkbox>
                                <span>Team introduction and manager meeting done</span>
                            </div>
                            <div class="checklist-item">
                                <p-checkbox v-model="form.checklist.policiesReviewed" :binary="true"></p-checkbox>
                                <span>Company policies and handbook reviewed</span>
                            </div>
                        </div>

                        <div class="checklist-progress">
                            <div class="checklist-progress-label">
                                <span>Checklist Progress</span>
                                <span>{{ checklistProgress }}%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" :class="checklistProgress === 100 ? 'completed' : 'pending'" 
                                     :style="{ width: checklistProgress + '%' }"></div>
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
                <p-button v-else label="Submit Employee" icon="pi pi-check" @click="submitEmployee" :disabled="checklistProgress < 100"></p-button>
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
            { label: 'Iqama' },
            { label: 'Checklist' }
        ]);

        const currentStep = ref(0);

        // Form data
        const form = ref({
            // Step 1
            employeeNumber: '',
            entity: null,
            firstName: '',
            secondName: '',
            familyName: '',
            dutyName: '',
            mobile: '',
            personalEmail: '',
            nationality: null,
            countryOfWork: null,
            armyStatus: null,
            socialInsuranceNumber: '',
            department: null,
            section: null,
            unit: null,
            team: null,
            costCenter: null,
            dateOfHiring: null,
            mainGrade: null,
            subGrade: null,
            jobTitle: null,
            lineManager: null,
            gender: null,
            maritalStatus: null,
            sendInvitation: true,
            // Step 2
            picturePreview: null,
            dateOfBirth: null,
            academicDegree: null,
            residenceCountry: null,
            city: '',
            bankName: '',
            ibanAccount: '',
            bankAccountName: '',
            emergencyContactName: '',
            emergencyContactRelationship: null,
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
            basicSalary: null,
            houseAllowance: null,
            transportationAllowance: null,
            otherAllowance: null,
            salaryTransferMethod: null,
            isRegisteredInGosi: false,
            isRegisteredInNosi: false,
            // Step 5
            office: null,
            scheduleType: null,
            workWeek: null,
            shift: null,
            systemLoginTime: null,
            systemLogoutTime: null,
            // Step 6
            hasIqama: false,
            iqamaNumber: '',
            iqamaExpiryDate: null,
            iqamaOccupation: null,
            // Step 7 - Checklist
            checklist: {
                documentsVerified: false,
                contractSigned: false,
                ndasSigned: false,
                emailCreated: false,
                systemAccessGranted: false,
                biometricEnrolled: false,
                equipmentIssued: false,
                idCardIssued: false,
                workstationAssigned: false,
                hrOrientationComplete: false,
                teamIntroduction: false,
                policiesReviewed: false
            }
        });

        // Static data references
        const entities = ref([...StaticData.entities]);
        const nationalities = ref([...StaticData.nationalities]);
        const countriesOfWork = ref([...StaticData.countriesOfWork]);
        const allCountries = ref([...StaticData.allCountries]);
        const departments = ref([...StaticData.departments]);
        const sections = ref([...StaticData.sections]);
        const units = ref([...StaticData.units]);
        const teams = ref([...StaticData.teams]);
        const costCenters = ref([...StaticData.costCenters]);
        const mainGrades = ref([...StaticData.mainGrades]);
        const subGrades = ref([...StaticData.subGrades]);
        const jobTitles = ref([...StaticData.jobTitles]);
        const offices = ref([...StaticData.offices]);
        const workWeeks = ref([...StaticData.workWeeks]);
        const shiftTemplates = ref([...StaticData.shiftTemplates]);
        const employees = ref([...StaticData.employees]);
        const iqamaOccupations = ref([...StaticData.iqamaOccupations]);
        const emergencyRelationships = ref([...StaticData.emergencyContactRelationships]);

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
        const salaryTransferMethods = ref([...StaticData.salaryTransferMethods]);
        const scheduleTypes = ref([...StaticData.scheduleTypes]);

        // Checklist progress
        const checklistProgress = computed(() => {
            const checklist = form.value.checklist;
            const totalItems = Object.keys(checklist).length;
            const completedItems = Object.values(checklist).filter(v => v === true).length;
            return Math.round((completedItems / totalItems) * 100);
        });

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

        const filteredSubGrades = computed(() => {
            if (!form.value.mainGrade) return [];
            return subGrades.value.filter(s => s.mainGradeId === form.value.mainGrade);
        });

        const filteredJobTitles = computed(() => {
            if (!form.value.mainGrade) return [];
            return jobTitles.value.filter(j => j.mainGradeId === form.value.mainGrade);
        });

        // Line managers: only Supervisor, Management, Executives grades
        const eligibleLineManagers = computed(() => {
            const eligibleGrades = ['Supervisor', 'Management', 'Executives'];
            return employees.value
                .filter(e => eligibleGrades.includes(e.mainGrade))
                .map(e => ({
                    id: e.id,
                    displayName: `${e.firstName} ${e.familyName}`,
                    avatar: e.avatar,
                    mainGrade: e.mainGrade
                }));
        });

        // GOSI calculations (Saudi Arabia) - based on basic + housing
        const gosiTotal = computed(() => (form.value.basicSalary || 0) + (form.value.houseAllowance || 0));
        const gosiEmployeeAmount = computed(() => gosiTotal.value * 0.0975);
        const gosiCompanyAmount = computed(() => gosiTotal.value * 0.1175);

        // NOSI calculations (Egypt) - based on basic salary
        const nosiEmployeeAmount = computed(() => (form.value.basicSalary || 0) * 0.11);
        const nosiCompanyAmount = computed(() => (form.value.basicSalary || 0) * 0.1875);

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0);
        };

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

        const onNationalityChange = () => {
            // Reset Egypt-specific fields if not Egyptian
            if (form.value.nationality !== 'Egyptian') {
                form.value.armyStatus = null;
                form.value.socialInsuranceNumber = '';
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

        const onMainGradeChange = () => {
            form.value.subGrade = null;
            form.value.jobTitle = null;
        };

        const onPictureSelect = (event) => {
            const file = event.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    form.value.picturePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        const saveAsDraft = () => {
            StaticData.employeeDrafts.push({ ...form.value, savedAt: new Date() });
            alert('Draft saved successfully!');
        };

        const submitEmployee = () => {
            const mainGradeName = mainGrades.value.find(g => g.id === form.value.mainGrade)?.name || '';
            const subGradeName = subGrades.value.find(g => g.id === form.value.subGrade)?.name || '';
            const jobTitleName = jobTitles.value.find(j => j.id === form.value.jobTitle)?.name || '';

            const newEmployee = {
                id: StaticData.employees.length + 1,
                employeeNumber: form.value.employeeNumber,
                firstName: form.value.firstName,
                secondName: form.value.secondName,
                familyName: form.value.familyName,
                avatar: form.value.picturePreview || 'https://i.pravatar.cc/40?img=' + (StaticData.employees.length + 20),
                email: form.value.workEmail,
                mobile: form.value.mobile,
                nationality: form.value.nationality,
                entity: form.value.entity,
                countryOfWork: form.value.countryOfWork,
                department: departments.value.find(d => d.id === form.value.department)?.name || '',
                section: sections.value.find(s => s.id === form.value.section)?.name || null,
                mainGrade: mainGradeName,
                subGrade: subGradeName,
                jobTitle: jobTitleName,
                status: 'Complete',
                dateOfHiring: form.value.dateOfHiring ? form.value.dateOfHiring.toLocaleDateString('en-GB') : '',
                contractType: form.value.contractType,
                completedSteps: 7,
                totalSteps: 7,
                progress: 100,
                slaStatus: 'completed',
                slaDays: Math.floor(Math.random() * 15) + 5,
                createdAt: new Date().toLocaleDateString('en-GB')
            };
            StaticData.employees.push(newEmployee);
            emit('submitted');
        };

        return {
            steps,
            currentStep,
            form,
            entities,
            nationalities,
            countriesOfWork,
            allCountries,
            departments,
            sections,
            units,
            teams,
            costCenters,
            mainGrades,
            subGrades,
            jobTitles,
            offices,
            workWeeks,
            shiftTemplates,
            employees,
            iqamaOccupations,
            emergencyRelationships,
            genders,
            maritalStatuses,
            academicDegrees,
            armyStatuses,
            contractClassifications,
            contractDurations,
            contractTypes,
            probationPeriods,
            annualLeaveDays,
            salaryTransferMethods,
            scheduleTypes,
            checklistProgress,
            filteredSections,
            filteredUnits,
            filteredTeams,
            filteredSubGrades,
            filteredJobTitles,
            eligibleLineManagers,
            gosiEmployeeAmount,
            gosiCompanyAmount,
            nosiEmployeeAmount,
            nosiCompanyAmount,
            formatCurrency,
            goToStep,
            nextStep,
            prevStep,
            onNationalityChange,
            onDepartmentChange,
            onSectionChange,
            onUnitChange,
            onMainGradeChange,
            onPictureSelect,
            saveAsDraft,
            submitEmployee
        };
    }
};

window.AddEmployeeComponent = AddEmployeeComponent;
