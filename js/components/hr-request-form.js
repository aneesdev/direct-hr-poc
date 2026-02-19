/**
 * HR Request Form Component
 * Dynamic form for HR requests with employee selection and summary panel
 */

const HrRequestFormComponent = {
    props: {
        requestType: {
            type: Object,
            required: true
        }
    },

    template: `
        <div class="hr-request-form-page">
            <!-- Page Header -->
            <div class="hr-form-header">
                <p-button icon="pi pi-arrow-left" text @click="$emit('back')"></p-button>
                <div class="hr-form-title">
                    <div class="title-icon" :style="getIconStyle(requestType)">
                        <i :class="'pi ' + requestType.icon"></i>
                    </div>
                    <div>
                        <h2>{{ requestType.name }}</h2>
                        <p>{{ requestType.description }}</p>
                    </div>
                </div>
            </div>

            <!-- Form Content -->
            <div class="hr-form-content">
                <!-- Left Column - Form Fields -->
                <div class="hr-form-fields">
                    <!-- Employee Selection Section -->
                    <div class="form-section">
                        <div class="section-header">
                            <i class="pi pi-users"></i>
                            <span>Employee Selection</span>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Select Employee</label>
                            <p-select v-model="selectedEmployee" 
                                         :options="employees"
                                         optionLabel="name"
                                         placeholder="Search by name or ID..."
                                         filter
                                         filterPlaceholder="Search by name or ID..."
                                         style="width: 100%;">
                                <template #option="slotProps">
                                    <div class="employee-option">
                                        <img :src="slotProps.option.avatar" :alt="slotProps.option.name" class="employee-avatar">
                                        <div class="employee-info">
                                            <div class="employee-name">{{ slotProps.option.name }}</div>
                                            <div class="employee-details">{{ slotProps.option.department }} • {{ slotProps.option.id }}</div>
                                        </div>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="employee-option">
                                        <img :src="slotProps.value.avatar" :alt="slotProps.value.name" class="employee-avatar">
                                        <div class="employee-info">
                                            <div class="employee-name">{{ slotProps.value.name }}</div>
                                            <div class="employee-details">{{ slotProps.value.department }} • {{ slotProps.value.id }}</div>
                                        </div>
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                            </p-select>
                        </div>
                    </div>

                    <!-- Dynamic Fields Sections -->
                    <div v-for="(fields, groupName) in groupedFields" :key="groupName" class="form-section">
                        <div class="section-header">
                            <i :class="getSectionIcon(groupName)"></i>
                            <span>{{ groupName }}</span>
                            <span v-if="isSalaryGroup(groupName)" class="currency-badge">SAR</span>
                        </div>
                        <div :class="isSalaryGroup(groupName) ? 'salary-grid' : 'form-grid-2'">
                            <div v-for="field in fields" :key="field.id" class="form-group" :class="{ 'salary-field': isSalaryGroup(groupName) }">
                                <label class="form-label">{{ field.label }}</label>
                                
                                <!-- Text Input -->
                                <p-inputtext v-if="field.type === 'text'" 
                                            v-model="formValues[field.id]" 
                                            :placeholder="'Enter ' + field.label.toLowerCase()"
                                            style="width: 100%;">
                                </p-inputtext>

                                <!-- Number Input (for salary fields) -->
                                <div v-else-if="field.type === 'number'" class="salary-input-wrapper">
                                    <span v-if="isSalaryGroup(groupName)" class="currency-prefix">SAR</span>
                                    <p-inputnumber v-model="formValues[field.id]" 
                                                  mode="decimal" 
                                                  :minFractionDigits="0"
                                                  :placeholder="'0'"
                                                  style="width: 100%;">
                                    </p-inputnumber>
                                </div>

                                <!-- Dropdown -->
                                <p-select v-else-if="field.type === 'dropdown'" 
                                         v-model="formValues[field.id]" 
                                         :options="getFieldOptions(field)"
                                         :optionLabel="field.optionLabel || null"
                                         :optionValue="field.optionValue || null"
                                         :placeholder="'Select ' + field.label"
                                         style="width: 100%;">
                                </p-select>

                                <!-- Textarea -->
                                <p-textarea v-else-if="field.type === 'textarea'" 
                                           v-model="formValues[field.id]" 
                                           :placeholder="'Enter ' + field.label.toLowerCase()"
                                           rows="3"
                                           style="width: 100%;">
                                </p-textarea>

                                <!-- Date -->
                                <p-datepicker v-else-if="field.type === 'date'" 
                                             v-model="formValues[field.id]" 
                                             dateFormat="dd/mm/yy"
                                             :placeholder="'Select date'"
                                             style="width: 100%;">
                                </p-datepicker>

                                <!-- File Upload -->
                                <div v-else-if="field.type === 'file'" class="file-upload-area">
                                    <p-fileupload mode="basic" 
                                                 accept="application/pdf,.doc,.docx,image/*"
                                                 :maxFileSize="10000000"
                                                 chooseLabel="Upload a file"
                                                 @select="onFileSelect($event, field.id)">
                                    </p-fileupload>
                                    <span class="file-hint">or drag and drop</span>
                                    <span class="file-types">PDF, DOCX (max 10MB)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="form-actions">
                        <p-button :label="getSubmitLabel()" icon="pi pi-check" @click="submitRequest" :disabled="!selectedEmployee"></p-button>
                    </div>
                </div>

                <!-- Right Column - Summary Panel -->
                <div class="hr-summary-panel">
                    <div class="summary-header">
                        <i class="pi pi-arrow-right-arrow-left"></i>
                        <span>Summary</span>
                    </div>

                    <div v-if="!selectedEmployee" class="summary-empty">
                        <div class="empty-icon">
                            <i class="pi pi-user"></i>
                        </div>
                        <p>Please select an employee to view the {{ getSummaryContext() }}.</p>
                    </div>

                    <div v-else class="summary-content">
                        <!-- Employee Info -->
                        <div class="summary-employee">
                            <img :src="selectedEmployee.avatar" :alt="selectedEmployee.name" class="summary-avatar">
                            <div class="summary-employee-info">
                                <div class="summary-employee-name">{{ selectedEmployee.name }}</div>
                                <div class="summary-employee-dept">{{ selectedEmployee.department }}</div>
                                <div class="summary-employee-id">ID: {{ selectedEmployee.id }}</div>
                            </div>
                        </div>

                        <!-- Summary Items -->
                        <div class="summary-changes">
                            <div v-for="(fields, groupName) in groupedFields" :key="groupName">
                                <div class="summary-group-title">{{ groupName.toUpperCase() }}</div>
                                
                                <div v-for="field in fields" :key="field.id" class="summary-item">
                                    <div class="summary-item-label">{{ field.label.toUpperCase() }}</div>
                                    <div class="summary-item-values">
                                        <div class="summary-value old">
                                            {{ getEmployeeCurrentValue(field) || '-' }}
                                        </div>
                                        <div class="summary-arrow">
                                            <i class="pi pi-arrow-right"></i>
                                        </div>
                                        <div class="summary-value new" :class="{ 'has-change': hasValueChanged(field) }">
                                            {{ getFormattedNewValue(field) || '-' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer Note -->
                        <div class="summary-footer">
                            Changes will take effect upon final approval.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { ref, computed, watch, reactive } = Vue;

        const selectedEmployee = ref(null);
        const filteredEmployees = ref([]);
        const formValues = reactive({});

        // Sample employees data
        const employees = ref([
            { id: 'EMP-1001', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', department: 'Engineering Department', position: 'Software Engineer', mainGrade: 'Professional', subGrade: 'Senior Officer', jobTitle: 'Software Engineer', basicSalary: 8500, houseAllowance: 2125, transportationAllowance: 850, otherAllowance: 0, costCenter: 'CC-001', mobile: '+966 50 123 4567', personalEmail: 'sarah.personal@email.com', workEmail: 'sarah.johnson@company.com', extensionNumber: '1234' },
            { id: 'EMP-1002', name: 'Ahmed Al-Rahman', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', department: 'Finance Department', position: 'Financial Analyst', mainGrade: 'Professional', subGrade: 'Officer', jobTitle: 'Financial Analyst', basicSalary: 7500, houseAllowance: 1875, transportationAllowance: 750, otherAllowance: 0, costCenter: 'CC-002', mobile: '+966 50 234 5678', personalEmail: 'ahmed.personal@email.com', workEmail: 'ahmed.alrahman@company.com', extensionNumber: '1235' },
            { id: 'EMP-1003', name: 'Maria Garcia', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', department: 'Marketing Department', position: 'Marketing Specialist', mainGrade: 'Entry Level', subGrade: 'Junior', jobTitle: 'Marketing Specialist', basicSalary: 6000, houseAllowance: 1500, transportationAllowance: 600, otherAllowance: 0, costCenter: 'CC-003', mobile: '+966 50 345 6789', personalEmail: 'maria.personal@email.com', workEmail: 'maria.garcia@company.com', extensionNumber: '1236' },
            { id: 'EMP-1004', name: 'Mohammed Alsoliman', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', department: 'IT Department', position: 'Senior Software Engineer', mainGrade: 'Professional', subGrade: 'Senior Officer', jobTitle: 'Senior Software Engineer', basicSalary: 12000, houseAllowance: 3000, transportationAllowance: 1200, otherAllowance: 500, costCenter: 'CC-001', mobile: '+966 50 456 7890', personalEmail: 'mohammed.personal@email.com', workEmail: 'mohammed.alsoliman@company.com', extensionNumber: '1237' }
        ]);

        // Options for dropdowns
        const fieldOptions = {
            mainGrade: ['Entry Level', 'Professional', 'Supervisor', 'Management', 'Executive'],
            subGrade: ['Junior', 'Officer', 'Senior Officer', 'Lead', 'Manager'],
            jobTitle: ['Software Engineer', 'Senior Software Engineer', 'Lead Engineer', 'Engineering Manager', 'Financial Analyst', 'Marketing Specialist'],
            department: ['Engineering Department', 'Finance Department', 'Marketing Department', 'IT Department', 'HR Department'],
            section: ['Development', 'QA', 'DevOps', 'Support'],
            costCenter: ['CC-001', 'CC-002', 'CC-003', 'CC-004']
        };

        const groupedFields = computed(() => {
            const groups = {};
            if (props.requestType && props.requestType.fields) {
                props.requestType.fields.forEach(field => {
                    const group = field.group || 'General';
                    if (!groups[group]) {
                        groups[group] = [];
                    }
                    groups[group].push(field);
                });
            }
            return groups;
        });

        const searchEmployees = (event) => {
            const query = event.query.toLowerCase();
            filteredEmployees.value = employees.value.filter(emp => 
                emp.name.toLowerCase().includes(query) || 
                emp.id.toLowerCase().includes(query)
            );
        };

        const getIconStyle = (request) => {
            return {
                background: request.color + '15',
                color: request.color,
                border: '1px solid ' + request.color + '30'
            };
        };

        const getSectionIcon = (groupName) => {
            const icons = {
                'Position': 'pi pi-briefcase',
                'Position Details': 'pi pi-briefcase',
                'Grade & Position': 'pi pi-briefcase',
                'Salary Information': 'pi pi-money-bill',
                'Compensation Details': 'pi pi-money-bill',
                'Organization': 'pi pi-sitemap',
                'Contact': 'pi pi-phone',
                'Address': 'pi pi-map-marker',
                'Emergency Contact': 'pi pi-exclamation-circle',
                'Contract Details': 'pi pi-file-edit',
                'Financial': 'pi pi-dollar',
                'Action Details': 'pi pi-exclamation-triangle',
                'Document Details': 'pi pi-file',
                'Adjustment Details': 'pi pi-clock'
            };
            return icons[groupName] || 'pi pi-list';
        };

        const isSalaryGroup = (groupName) => {
            return groupName === 'Salary Information' || groupName === 'Compensation Details';
        };

        const getFieldOptions = (field) => {
            if (field.options) {
                return field.options;
            }
            return fieldOptions[field.id] || [];
        };

        const getEmployeeCurrentValue = (field) => {
            if (!selectedEmployee.value) return '-';
            const value = selectedEmployee.value[field.id];
            if (field.type === 'number' && typeof value === 'number') {
                return formatCurrency(value);
            }
            return value || '-';
        };

        const getFormattedNewValue = (field) => {
            const value = formValues[field.id];
            if (value === undefined || value === null || value === '') return '-';
            if (field.type === 'number' && typeof value === 'number') {
                return formatCurrency(value);
            }
            return value;
        };

        const hasValueChanged = (field) => {
            const newValue = formValues[field.id];
            const oldValue = selectedEmployee.value ? selectedEmployee.value[field.id] : null;
            return newValue !== undefined && newValue !== null && newValue !== '' && newValue !== oldValue;
        };

        const formatCurrency = (value) => {
            if (value === null || value === undefined) return '-';
            return new Intl.NumberFormat('en-SA', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        };

        const getSummaryContext = () => {
            const name = props.requestType?.name || '';
            if (name.includes('Promotion')) return 'promotion impact analysis';
            if (name.includes('Contract')) return 'contract summary';
            return 'request summary';
        };

        const getSubmitLabel = () => {
            const name = props.requestType?.name || '';
            if (name.includes('Promotion')) return 'Submit Promotion Request';
            if (name.includes('Contract')) return 'Update Contract';
            if (name.includes('Transfer')) return 'Submit Transfer Request';
            return 'Submit Request';
        };

        const onFileSelect = (event, fieldId) => {
            formValues[fieldId] = event.files[0];
        };

        const submitRequest = () => {
            console.log('Submitting request:', {
                employee: selectedEmployee.value,
                requestType: props.requestType,
                values: formValues
            });
            // Show success message
            alert('Request submitted successfully!');
            emit('back');
        };

        return {
            selectedEmployee,
            filteredEmployees,
            employees,
            formValues,
            groupedFields,
            searchEmployees,
            getIconStyle,
            getSectionIcon,
            isSalaryGroup,
            getFieldOptions,
            getEmployeeCurrentValue,
            getFormattedNewValue,
            hasValueChanged,
            formatCurrency,
            getSummaryContext,
            getSubmitLabel,
            onFileSelect,
            submitRequest
        };
    }
};
