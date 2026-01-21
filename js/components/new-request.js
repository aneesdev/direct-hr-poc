/**
 * New Request Component
 * Beautiful 3-step wizard for submitting service requests
 */

const NewRequestComponent = {
    template: `
        <div class="new-request-page">
            <!-- Progress Header -->
            <div class="request-wizard-header">
                <div class="wizard-progress">
                    <div class="progress-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
                        <div class="step-circle">
                            <i v-if="currentStep > 1" class="pi pi-check"></i>
                            <span v-else>1</span>
                        </div>
                        <span class="step-text">Category</span>
                    </div>
                    <div class="progress-line" :class="{ active: currentStep > 1 }"></div>
                    <div class="progress-step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
                        <div class="step-circle">
                            <i v-if="currentStep > 2" class="pi pi-check"></i>
                            <span v-else>2</span>
                        </div>
                        <span class="step-text">Request Type</span>
                    </div>
                    <div class="progress-line" :class="{ active: currentStep > 2 }"></div>
                    <div class="progress-step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
                        <div class="step-circle">
                            <i v-if="currentStep > 3" class="pi pi-check"></i>
                            <span v-else>3</span>
                        </div>
                        <span class="step-text">Submit</span>
                    </div>
                </div>
            </div>

            <!-- Step 1: Select Category -->
            <div v-if="currentStep === 1" class="wizard-step-content">
                <div class="step-intro">
                    <h1>What would you like to request?</h1>
                    <p>Select a category to get started with your request</p>
                </div>
                
                <div class="category-selection-grid">
                    <div v-for="cat in activeCategories" :key="cat.id" 
                         class="category-select-card"
                         :class="{ selected: selectedCategory?.id === cat.id }"
                         @click="selectCategory(cat)">
                        <div class="category-select-icon" :style="{ background: cat.color + '15', color: cat.color }">
                            <i :class="'pi ' + cat.icon"></i>
                        </div>
                        <div class="category-select-name">{{ cat.name }}</div>
                        <div class="category-select-desc">{{ cat.description }}</div>
                        <div class="category-select-count">{{ getTypeCountByCategory(cat.id) }} options available</div>
                    </div>
                </div>
            </div>

            <!-- Step 2: Select Request Type -->
            <div v-if="currentStep === 2" class="wizard-step-content">
                <button class="back-button" @click="goBack">
                    <i class="pi pi-arrow-left"></i>
                    <span>Back to Categories</span>
                </button>
                
                <div class="step-intro">
                    <div class="selected-category-badge" :style="{ background: selectedCategory.color + '15', color: selectedCategory.color }">
                        <i :class="'pi ' + selectedCategory.icon"></i>
                        {{ selectedCategory.name }}
                    </div>
                    <h1>Choose your request type</h1>
                    <p>Select the specific type of {{ selectedCategory.name.toLowerCase() }} request you need</p>
                </div>
                
                <div class="request-type-list">
                    <div v-for="type in filteredTypes" :key="type.id" 
                         class="request-type-card"
                         @click="selectType(type)">
                        <div class="type-card-content">
                            <div class="type-card-main">
                                <h3>{{ type.name }}</h3>
                            </div>
                        </div>
                        <div class="type-card-arrow">
                            <i class="pi pi-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 3: Fill Form -->
            <div v-if="currentStep === 3" class="wizard-step-content">
                <button class="back-button" @click="goBack">
                    <i class="pi pi-arrow-left"></i>
                    <span>Back to {{ selectedCategory.name }}</span>
                </button>
                
                <div class="step-intro compact">
                    <div class="selected-type-header">
                        <div class="type-icon-large" :style="{ background: selectedCategory.color + '15', color: selectedCategory.color }">
                            <i :class="'pi ' + selectedCategory.icon"></i>
                        </div>
                        <div>
                            <h1>{{ selectedType.name }}</h1>
                            <p>{{ selectedType.description }}</p>
                        </div>
                    </div>
                </div>
                
                <div class="form-and-info-grid">
                    <!-- Form Section -->
                    <div class="request-form-section">
                        <div class="form-card">
                            <div class="form-card-header">
                                <i class="pi pi-file-edit"></i>
                                <span>Request Details</span>
                            </div>
                            
                            <div class="dynamic-form">
                                <div v-for="field in selectedType.formFields" :key="field.id" class="dynamic-field">
                                    <label class="dynamic-field-label">
                                        {{ field.label }}
                                        <span v-if="field.required" class="required-badge">Required</span>
                                    </label>
                                    
                                    <!-- Text Field -->
                                    <p-inputtext v-if="field.type === 'text'" 
                                                 v-model="formData[field.id]" 
                                                 :placeholder="'Enter ' + field.label.toLowerCase()"
                                                 style="width: 100%;"></p-inputtext>
                                    
                                    <!-- Textarea -->
                                    <p-textarea v-else-if="field.type === 'textarea'" 
                                                v-model="formData[field.id]" 
                                                :placeholder="'Enter ' + field.label.toLowerCase()"
                                                rows="3"
                                                style="width: 100%;"></p-textarea>
                                    
                                    <!-- Number -->
                                    <p-inputnumber v-else-if="field.type === 'number'" 
                                                   v-model="formData[field.id]"
                                                   style="width: 100%;"></p-inputnumber>
                                    
                                    <!-- Date -->
                                    <p-datepicker v-else-if="field.type === 'date'" 
                                                  v-model="formData[field.id]"
                                                  dateFormat="dd/mm/yy"
                                                  :showIcon="true"
                                                  style="width: 100%;"></p-datepicker>
                                    
                                    <!-- Date Range -->
                                    <div v-else-if="field.type === 'daterange'" class="date-range-field">
                                        <div class="date-input-group">
                                            <label class="mini-label">From</label>
                                            <p-datepicker v-model="formData[field.id + '_from']"
                                                          dateFormat="dd/mm/yy"
                                                          :showIcon="true"
                                                          @update:modelValue="calculateDays(field.id)"
                                                          style="width: 100%;"></p-datepicker>
                                        </div>
                                        <div class="date-range-separator">
                                            <i class="pi pi-arrow-right"></i>
                                        </div>
                                        <div class="date-input-group">
                                            <label class="mini-label">To</label>
                                            <p-datepicker v-model="formData[field.id + '_to']"
                                                          dateFormat="dd/mm/yy"
                                                          :showIcon="true"
                                                          @update:modelValue="calculateDays(field.id)"
                                                          style="width: 100%;"></p-datepicker>
                                        </div>
                                    </div>
                                    
                                    <!-- Days Counter for Date Range -->
                                    <div v-if="field.type === 'daterange' && formData[field.id + '_days']" class="days-counter">
                                        <i class="pi pi-info-circle"></i>
                                        <span>Duration: <strong>{{ formData[field.id + '_days'] }} {{ selectedType.balanceMethod === 'working_days' ? 'working' : 'calendar' }} days</strong></span>
                                    </div>
                                    
                                    <!-- Time -->
                                    <p-datepicker v-else-if="field.type === 'time'" 
                                                  v-model="formData[field.id]"
                                                  :timeOnly="true"
                                                  :showIcon="true"
                                                  style="width: 100%;"></p-datepicker>
                                    
                                    <!-- Dropdown -->
                                    <p-select v-else-if="field.type === 'dropdown'" 
                                              v-model="formData[field.id]"
                                              :options="field.options"
                                              placeholder="Select an option"
                                              style="width: 100%;"></p-select>
                                    
                                    <!-- File Upload -->
                                    <div v-else-if="field.type === 'file'" class="file-upload-wrapper">
                                        <p-fileupload mode="basic" 
                                                      accept="image/*,application/pdf,.doc,.docx" 
                                                      :maxFileSize="5000000" 
                                                      :chooseLabel="formData[field.id] ? 'Change File' : 'Choose File'"
                                                      @select="onFileSelect($event, field.id)"></p-fileupload>
                                        <div v-if="formData[field.id]" class="selected-file">
                                            <i class="pi pi-file"></i>
                                            <span>{{ formData[field.id].name }}</span>
                                            <button class="remove-file" @click="formData[field.id] = null">
                                                <i class="pi pi-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <!-- Checkbox -->
                                    <div v-else-if="field.type === 'checkbox'" class="checkbox-field">
                                        <p-checkbox v-model="formData[field.id]" :binary="true"></p-checkbox>
                                        <span class="checkbox-label">{{ field.label }}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-submit-section">
                                <p-button label="Submit Request" 
                                          icon="pi pi-send" 
                                          :loading="isSubmitting"
                                          @click="submitRequest"
                                          class="submit-btn"></p-button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Info Sidebar -->
                    <div class="request-info-sidebar">
                        <!-- Balance Card -->
                        <div v-if="selectedType.balanceSource" class="info-card balance-card">
                            <div class="info-card-header">
                                <i class="pi pi-wallet"></i>
                                <span>Balance Status</span>
                            </div>
                            <div class="balance-display">
                                <div class="balance-main">
                                    <div class="balance-value">{{ currentBalance }}</div>
                                    <div class="balance-label">Available Balance</div>
                                </div>
                                <div v-if="requestedDays > 0" class="balance-impact">
                                    <div class="impact-value" :class="{ warning: requestedDays > currentBalance }">
                                        -{{ requestedDays }}
                                    </div>
                                    <div class="impact-label">Requested</div>
                                </div>
                            </div>
                            <div class="balance-bar">
                                <div class="balance-bar-fill" :style="{ width: balancePercentage + '%' }"></div>
                                <div v-if="requestedDays > 0" class="balance-bar-impact" 
                                     :style="{ width: impactPercentage + '%', left: (balancePercentage - impactPercentage) + '%' }"></div>
                            </div>
                            <div class="balance-footer">
                                <span>{{ selectedType.balanceMethod === 'working_days' ? 'Working Days' : 'Calendar Days' }}</span>
                                <span>{{ getRepetitionLabel(selectedType.repetition) }}</span>
                            </div>
                        </div>
                        
                        <!-- Approval Flow Card -->
                        <div class="info-card approval-card">
                            <div class="info-card-header">
                                <i class="pi pi-sitemap"></i>
                                <span>Approval Flow</span>
                            </div>
                            <div class="approval-flow-preview">
                                <div class="flow-step">
                                    <div class="flow-icon you">
                                        <i class="pi pi-user"></i>
                                    </div>
                                    <div class="flow-info">
                                        <div class="flow-title">You</div>
                                        <div class="flow-subtitle">Requester</div>
                                    </div>
                                </div>
                                <div class="flow-connector"></div>
                                <div v-if="selectedType.approvalFlow.lineManagerLevel" class="flow-step">
                                    <div class="flow-icon manager">
                                        <i class="pi pi-users"></i>
                                    </div>
                                    <div class="flow-info">
                                        <div class="flow-title">Line Manager</div>
                                        <div class="flow-subtitle">Level {{ selectedType.approvalFlow.lineManagerLevel }}</div>
                                    </div>
                                </div>
                                <div v-if="selectedType.approvalFlow.lineManagerLevel && selectedType.approvalFlow.requireHrAdmin" class="flow-connector"></div>
                                <div v-if="selectedType.approvalFlow.requireHrAdmin" class="flow-step">
                                    <div class="flow-icon hr">
                                        <i class="pi pi-id-card"></i>
                                    </div>
                                    <div class="flow-info">
                                        <div class="flow-title">HR Administrator</div>
                                        <div class="flow-subtitle">Final Approval</div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="selectedType.approvalFlow.conditionEnabled" class="approval-condition-note">
                                <i class="pi pi-info-circle"></i>
                                <span>Requests over {{ selectedType.approvalFlow.conditionDays }} days require additional approval</span>
                            </div>
                        </div>
                        
                        <!-- Policy Note -->
                        <div class="info-card policy-card">
                            <div class="info-card-header">
                                <i class="pi pi-bookmark"></i>
                                <span>Policy Note</span>
                            </div>
                            <p class="policy-text">
                                Please ensure all required documents are attached. Requests are processed within 48 hours. 
                                For urgent requests, please contact HR directly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 4: Success -->
            <div v-if="currentStep === 4" class="wizard-step-content success-step">
                <div class="success-container">
                    <div class="success-animation">
                        <div class="success-circle">
                            <i class="pi pi-check"></i>
                        </div>
                        <div class="success-ripple"></div>
                    </div>
                    <h1>Request Submitted Successfully!</h1>
                    <p class="success-message">
                        Your <strong>{{ selectedType.name }}</strong> request has been submitted and is now pending approval.
                    </p>
                    <div class="success-details">
                        <div class="detail-item">
                            <i class="pi pi-hashtag"></i>
                            <span>Request ID: <strong>REQ-{{ submittedRequestId }}</strong></span>
                        </div>
                        <div class="detail-item">
                            <i class="pi pi-clock"></i>
                            <span>Expected response within <strong>48 hours</strong></span>
                        </div>
                        <div class="detail-item">
                            <i class="pi pi-envelope"></i>
                            <span>You'll receive updates via email</span>
                        </div>
                    </div>
                    <div class="success-actions">
                        <p-button label="Submit Another Request" 
                                  icon="pi pi-plus" 
                                  outlined
                                  @click="resetWizard"></p-button>
                        <p-button label="View My Requests" 
                                  icon="pi pi-list"
                                  @click="$emit('view-requests')"></p-button>
                    </div>
                </div>
            </div>
        </div>
    `,

    emits: ['view-requests'],

    setup(props, { emit }) {
        const { ref, computed } = Vue;

        // Wizard state
        const currentStep = ref(1);
        const selectedCategory = ref(null);
        const selectedType = ref(null);
        const formData = ref({});
        const isSubmitting = ref(false);
        const submittedRequestId = ref('');

        // Data
        const requestCategories = ref([...StaticData.requestCategories]);
        const requestTypes = ref([...StaticData.requestTypes]);
        const repetitionOptions = ref([...StaticData.repetitionOptions]);

        // Mock balance (in real app, this would come from employee data)
        const currentBalance = ref(18);
        const totalBalance = ref(21);

        // Computed
        const activeCategories = computed(() => requestCategories.value.filter(c => c.active));
        
        const filteredTypes = computed(() => {
            if (!selectedCategory.value) return [];
            return requestTypes.value.filter(t => t.categoryId === selectedCategory.value.id && t.active);
        });

        const requestedDays = computed(() => {
            // Find the first daterange field and get its calculated days
            if (!selectedType.value) return 0;
            const dateRangeField = selectedType.value.formFields.find(f => f.type === 'daterange');
            if (dateRangeField && formData.value[dateRangeField.id + '_days']) {
                return formData.value[dateRangeField.id + '_days'];
            }
            return 0;
        });

        const balancePercentage = computed(() => {
            return (currentBalance.value / totalBalance.value) * 100;
        });

        const impactPercentage = computed(() => {
            return (requestedDays.value / totalBalance.value) * 100;
        });

        // Helper functions
        const getTypeCountByCategory = (catId) => requestTypes.value.filter(t => t.categoryId === catId && t.active).length;
        const getRepetitionLabel = (id) => repetitionOptions.value.find(r => r.id === id)?.name || id;

        // Navigation
        const selectCategory = (cat) => {
            selectedCategory.value = cat;
            currentStep.value = 2;
        };

        const selectType = (type) => {
            selectedType.value = type;
            formData.value = {}; // Reset form data
            currentStep.value = 3;
        };

        const goBack = () => {
            if (currentStep.value === 2) {
                selectedCategory.value = null;
                currentStep.value = 1;
            } else if (currentStep.value === 3) {
                selectedType.value = null;
                formData.value = {};
                currentStep.value = 2;
            }
        };

        const resetWizard = () => {
            currentStep.value = 1;
            selectedCategory.value = null;
            selectedType.value = null;
            formData.value = {};
            submittedRequestId.value = '';
        };

        // Form handling
        const calculateDays = (fieldId) => {
            const fromDate = formData.value[fieldId + '_from'];
            const toDate = formData.value[fieldId + '_to'];
            
            if (fromDate && toDate) {
                const from = new Date(fromDate);
                const to = new Date(toDate);
                
                if (selectedType.value?.balanceMethod === 'working_days') {
                    // Calculate working days (excluding weekends)
                    let count = 0;
                    let current = new Date(from);
                    while (current <= to) {
                        const dayOfWeek = current.getDay();
                        if (dayOfWeek !== 5 && dayOfWeek !== 6) { // Exclude Friday and Saturday (Middle East weekend)
                            count++;
                        }
                        current.setDate(current.getDate() + 1);
                    }
                    formData.value[fieldId + '_days'] = count;
                } else {
                    // Calendar days
                    const diffTime = Math.abs(to - from);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    formData.value[fieldId + '_days'] = diffDays;
                }
            }
        };

        const onFileSelect = (event, fieldId) => {
            if (event.files && event.files.length > 0) {
                formData.value[fieldId] = event.files[0];
            }
        };

        const submitRequest = () => {
            // Validate required fields
            const missingFields = selectedType.value.formFields
                .filter(f => f.required)
                .filter(f => {
                    if (f.type === 'daterange') {
                        return !formData.value[f.id + '_from'] || !formData.value[f.id + '_to'];
                    }
                    return !formData.value[f.id];
                });

            if (missingFields.length > 0) {
                alert('Please fill in all required fields: ' + missingFields.map(f => f.label).join(', '));
                return;
            }

            isSubmitting.value = true;
            
            // Simulate API call
            setTimeout(() => {
                submittedRequestId.value = Date.now().toString().slice(-6);
                isSubmitting.value = false;
                currentStep.value = 4;
            }, 1500);
        };

        return {
            // State
            currentStep,
            selectedCategory,
            selectedType,
            formData,
            isSubmitting,
            submittedRequestId,
            // Data
            requestCategories,
            requestTypes,
            currentBalance,
            totalBalance,
            // Computed
            activeCategories,
            filteredTypes,
            requestedDays,
            balancePercentage,
            impactPercentage,
            // Helpers
            getTypeCountByCategory,
            getRepetitionLabel,
            // Navigation
            selectCategory,
            selectType,
            goBack,
            resetWizard,
            // Form
            calculateDays,
            onFileSelect,
            submitRequest
        };
    }
};

window.NewRequestComponent = NewRequestComponent;
