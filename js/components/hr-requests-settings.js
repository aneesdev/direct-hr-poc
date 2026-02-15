/**
 * HR Requests Settings Component
 * CRUD for HR Request Types with employee field selection
 */

const HrRequestsSettingsComponent = {
    template: `
        <div class="hr-requests-settings-page">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="pi pi-ticket"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ hrRequestTypes.length }}</div>
                        <div class="stat-label">HR Request Types</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ activeTypesCount }}</div>
                        <div class="stat-label">Active Types</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="pi pi-list"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ totalFieldsCount }}</div>
                        <div class="stat-label">Total Fields Configured</div>
                    </div>
                </div>
            </div>

            <!-- Request Types Table -->
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">
                            <i class="pi pi-ticket"></i>
                            HR Request Types
                        </div>
                        <div class="card-subtitle">Configure HR request types with employee fields for changes</div>
                    </div>
                    <p-button label="Add Request Type" icon="pi pi-plus" @click="openTypeDialog()"></p-button>
                </div>

                <p-datatable :value="hrRequestTypes" striped-rows paginator :rows="10">
                    <p-column header="Request Type" sortable>
                        <template #body="slotProps">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div class="type-icon" :style="{ background: slotProps.data.color + '20', color: slotProps.data.color }">
                                    <i :class="'pi ' + slotProps.data.icon"></i>
                                </div>
                                <div>
                                    <div style="font-weight: 600;">{{ slotProps.data.name }}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-color-secondary);">{{ slotProps.data.description }}</div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Employee Fields">
                        <template #body="slotProps">
                            <span class="stat-badge">{{ slotProps.data.fields.length }} fields</span>
                        </template>
                    </p-column>
                    <p-column header="Status">
                        <template #body="slotProps">
                            <span class="status-tag" :class="slotProps.data.active ? 'active' : 'inactive'">
                                {{ slotProps.data.active ? 'Active' : 'Inactive' }}
                            </span>
                        </template>
                    </p-column>
                    <p-column header="Actions" style="width: 100px">
                        <template #body="slotProps">
                            <button class="action-btn edit" @click="editType(slotProps.data)"><i class="pi pi-pencil"></i></button>
                            <button class="action-btn delete" @click="deleteType(slotProps.data.id)"><i class="pi pi-trash"></i></button>
                        </template>
                    </p-column>
                </p-datatable>
            </div>

            <!-- HR Request Type Dialog -->
            <p-dialog v-model:visible="showTypeDialog" :header="editingType ? 'Edit HR Request Type' : 'Add HR Request Type'" :modal="true" :style="{ width: '900px' }">
                <div class="type-dialog-content">
                    <!-- Basic Info Section -->
                    <div class="form-section-title">Basic Information</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Name <span class="required">*</span></label>
                            <p-inputtext v-model="typeForm.name" placeholder="e.g. Employee Promotion" style="width: 100%;"></p-inputtext>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Icon</label>
                            <p-select v-model="typeForm.icon" :options="iconOptions" optionLabel="label" optionValue="value" placeholder="Select icon" style="width: 100%;">
                                <template #option="slotProps">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <i :class="'pi ' + slotProps.option.value"></i>
                                        <span>{{ slotProps.option.label }}</span>
                                    </div>
                                </template>
                            </p-select>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 1rem;">
                        <label class="form-label">Description</label>
                        <p-textarea v-model="typeForm.description" placeholder="Brief description of this request type" rows="2" style="width: 100%;"></p-textarea>
                    </div>
                    <div class="form-grid" style="margin-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Color</label>
                            <div class="color-picker-row">
                                <div v-for="color in colorOptions" :key="color" 
                                     class="color-option" 
                                     :class="{ selected: typeForm.color === color }"
                                     :style="{ background: color }"
                                     @click="typeForm.color = color"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
                                <p-toggleswitch v-model="typeForm.active"></p-toggleswitch>
                                <label class="form-label" style="margin: 0;">Active</label>
                            </div>
                        </div>
                    </div>

                    <!-- Employee Fields Section -->
                    <div class="form-section-title">
                        <span>Employee Fields to Change</span>
                        <p-button label="Add Field" icon="pi pi-plus" size="small" @click="showFieldSelector = true" style="margin-left: auto;"></p-button>
                    </div>
                    <p class="section-hint">Select which employee fields can be changed through this request type.</p>

                    <!-- Selected Fields List -->
                    <div class="selected-fields-list" v-if="typeForm.fields.length > 0">
                        <div v-for="(field, index) in typeForm.fields" :key="field.id" class="selected-field-item">
                            <div class="field-drag-handle">
                                <i class="pi pi-bars"></i>
                            </div>
                            <div class="field-info">
                                <span class="field-group-badge">{{ field.group }}</span>
                                <span class="field-label">{{ field.label }}</span>
                            </div>
                            <div class="field-actions">
                                <button class="action-btn" @click="moveFieldUp(index)" :disabled="index === 0">
                                    <i class="pi pi-arrow-up"></i>
                                </button>
                                <button class="action-btn" @click="moveFieldDown(index)" :disabled="index === typeForm.fields.length - 1">
                                    <i class="pi pi-arrow-down"></i>
                                </button>
                                <button class="action-btn delete" @click="removeField(index)">
                                    <i class="pi pi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-fields">
                        <i class="pi pi-inbox"></i>
                        <p>No fields added yet. Click "Add Field" to select employee fields.</p>
                    </div>
                </div>

                <template #footer>
                    <p-button label="Cancel" text @click="showTypeDialog = false"></p-button>
                    <p-button :label="editingType ? 'Update' : 'Save'" @click="saveType"></p-button>
                </template>
            </p-dialog>

            <!-- Field Selector Dialog -->
            <p-dialog v-model:visible="showFieldSelector" header="Select Employee Fields" :modal="true" :style="{ width: '700px' }">
                <div class="field-selector-content">
                    <div class="field-search">
                        <p-inputtext v-model="fieldSearchQuery" placeholder="Search fields..." style="width: 100%;">
                        </p-inputtext>
                    </div>

                    <div class="field-groups">
                        <div v-for="(fields, groupName) in filteredEmployeeFields" :key="groupName" class="field-group">
                            <div class="field-group-header">
                                <i :class="getGroupIcon(groupName)"></i>
                                <span>{{ groupName }}</span>
                            </div>
                            <div class="field-group-items">
                                <div v-for="field in fields" :key="field.id" 
                                     class="field-checkbox-item"
                                     :class="{ disabled: isFieldSelected(field.id) }">
                                    <p-checkbox v-model="selectedFieldIds" 
                                               :value="field.id" 
                                               :inputId="field.id"
                                               :disabled="isFieldSelected(field.id)">
                                    </p-checkbox>
                                    <label :for="field.id">{{ field.label }}</label>
                                    <span v-if="isFieldSelected(field.id)" class="already-added">(already added)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <template #footer>
                    <p-button label="Cancel" text @click="showFieldSelector = false"></p-button>
                    <p-button label="Add Selected Fields" @click="addSelectedFields" :disabled="selectedFieldIds.length === 0"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed, reactive } = Vue;

        // Dialog states
        const showTypeDialog = ref(false);
        const showFieldSelector = ref(false);
        const editingType = ref(null);
        const fieldSearchQuery = ref('');
        const selectedFieldIds = ref([]);

        // HR Request Types data
        const hrRequestTypes = ref([
            {
                id: 1,
                name: 'Employee Promotion',
                description: 'Submit a request to elevate an employee to a higher position or rank.',
                icon: 'pi-arrow-up-right',
                color: '#f97316',
                active: true,
                fields: [
                    { id: 'mainGrade', group: 'Grade & Position', label: 'Main Grade', type: 'dropdown' },
                    { id: 'subGrade', group: 'Grade & Position', label: 'Sub Grade', type: 'dropdown' },
                    { id: 'jobTitle', group: 'Grade & Position', label: 'Job Title', type: 'dropdown' },
                    { id: 'basicSalary', group: 'Salary Information', label: 'Basic Salary', type: 'number' },
                    { id: 'houseAllowance', group: 'Salary Information', label: 'Accommodation Allowance', type: 'number' },
                    { id: 'transportationAllowance', group: 'Salary Information', label: 'Transportation Allowance', type: 'number' },
                    { id: 'otherAllowance', group: 'Salary Information', label: 'Other Allowance', type: 'number' }
                ]
            },
            {
                id: 2,
                name: 'Change Job Title',
                description: 'Update an official job designation without a change in hierarchy.',
                icon: 'pi-user-edit',
                color: '#3b82f6',
                active: true,
                fields: [
                    { id: 'jobTitle', group: 'Grade & Position', label: 'Job Title', type: 'dropdown' }
                ]
            },
            {
                id: 3,
                name: 'Salary & Benefits Adjustment',
                description: 'Request modifications to salary, allowances, or other benefits.',
                icon: 'pi-money-bill',
                color: '#10b981',
                active: true,
                fields: [
                    { id: 'basicSalary', group: 'Salary Information', label: 'Basic Salary', type: 'number' },
                    { id: 'houseAllowance', group: 'Salary Information', label: 'Accommodation Allowance', type: 'number' },
                    { id: 'transportationAllowance', group: 'Salary Information', label: 'Transportation Allowance', type: 'number' },
                    { id: 'otherAllowance', group: 'Salary Information', label: 'Other Allowance', type: 'number' }
                ]
            },
            {
                id: 4,
                name: 'Employee Transfer',
                description: 'Initiate a transfer to a different department, branch, or location.',
                icon: 'pi-arrow-right-arrow-left',
                color: '#6366f1',
                active: true,
                fields: [
                    { id: 'department', group: 'Organization', label: 'Department', type: 'dropdown' },
                    { id: 'section', group: 'Organization', label: 'Section', type: 'dropdown' },
                    { id: 'costCenter', group: 'Organization', label: 'Cost Center', type: 'dropdown' }
                ]
            },
            {
                id: 5,
                name: 'Change Contract Type',
                description: 'Switch between fixed-term, permanent, or part-time contracts.',
                icon: 'pi-file-edit',
                color: '#f59e0b',
                active: true,
                fields: [
                    { id: 'contractClassification', group: 'Contract Details', label: 'Contract Classification', type: 'dropdown' },
                    { id: 'contractType', group: 'Contract Details', label: 'Contract Type', type: 'dropdown' },
                    { id: 'probationPeriod', group: 'Contract Details', label: 'Probation Period', type: 'dropdown' },
                    { id: 'annualLeaveDays', group: 'Contract Details', label: 'Annual Leave', type: 'dropdown' }
                ]
            }
        ]);

        // All available employee fields grouped (from add-employee.js)
        const allEmployeeFields = ref({
            'Basic Information': [
                { id: 'firstName', label: 'First Name', type: 'text' },
                { id: 'secondName', label: 'Second Name', type: 'text' },
                { id: 'familyName', label: 'Family Name', type: 'text' },
                { id: 'dutyName', label: 'Duty Name', type: 'text' },
                { id: 'mobile', label: 'Mobile Number', type: 'text' },
                { id: 'personalEmail', label: 'Personal Email', type: 'text' },
                { id: 'nationality', label: 'Nationality', type: 'dropdown' },
                { id: 'countryOfWork', label: 'Country of Work', type: 'dropdown' },
                { id: 'gender', label: 'Gender', type: 'dropdown' },
                { id: 'maritalStatus', label: 'Marital Status', type: 'dropdown' }
            ],
            'Organization': [
                { id: 'department', label: 'Department', type: 'dropdown' },
                { id: 'section', label: 'Section', type: 'dropdown' },
                { id: 'unit', label: 'Unit', type: 'dropdown' },
                { id: 'team', label: 'Team', type: 'dropdown' },
                { id: 'costCenter', label: 'Cost Center', type: 'dropdown' },
                { id: 'dateOfHiring', label: 'Date of Hiring', type: 'date' }
            ],
            'Grade & Position': [
                { id: 'mainGrade', label: 'Main Grade', type: 'dropdown' },
                { id: 'subGrade', label: 'Sub Grade', type: 'dropdown' },
                { id: 'jobTitle', label: 'Job Title', type: 'dropdown' },
                { id: 'lineManager', label: 'Line Manager', type: 'dropdown' }
            ],
            'Documents & Personal': [
                { id: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
                { id: 'academicDegree', label: 'Academic Degree', type: 'dropdown' },
                { id: 'residenceCountry', label: 'Country of Residence', type: 'dropdown' },
                { id: 'city', label: 'City', type: 'text' }
            ],
            'Bank Information': [
                { id: 'bankName', label: 'Bank Name', type: 'text' },
                { id: 'ibanAccount', label: 'IBAN Account', type: 'text' },
                { id: 'bankAccountName', label: 'Account Holder Name', type: 'text' }
            ],
            'Emergency Contact': [
                { id: 'emergencyContactName', label: 'Contact Name', type: 'text' },
                { id: 'emergencyContactRelationship', label: 'Relationship', type: 'dropdown' },
                { id: 'emergencyContactPhone', label: 'Phone Number', type: 'text' }
            ],
            'Work Access': [
                { id: 'extensionNumber', label: 'Extension Number', type: 'text' },
                { id: 'workEmail', label: 'Work Email', type: 'text' }
            ],
            'Contract Details': [
                { id: 'contractClassification', label: 'Contract Classification', type: 'dropdown' },
                { id: 'contractDuration', label: 'Contract Duration', type: 'dropdown' },
                { id: 'contractType', label: 'Contract Type', type: 'dropdown' },
                { id: 'probationPeriod', label: 'Probation Period', type: 'dropdown' },
                { id: 'annualLeaveDays', label: 'Annual Leave (Days)', type: 'dropdown' }
            ],
            'Salary Information': [
                { id: 'grossSalary', label: 'Gross Salary', type: 'number' },
                { id: 'basicSalary', label: 'Basic Salary', type: 'number' },
                { id: 'houseAllowance', label: 'Accommodation Allowance', type: 'number' },
                { id: 'transportationAllowance', label: 'Transportation Allowance', type: 'number' },
                { id: 'otherAllowance', label: 'Other Allowance', type: 'number' },
                { id: 'salaryTransferMethod', label: 'Salary Transfer Method', type: 'dropdown' }
            ]
        });

        // Form for type
        const typeForm = reactive({
            name: '',
            description: '',
            icon: 'pi-ticket',
            color: '#3b82f6',
            active: true,
            fields: []
        });

        // Icon options
        const iconOptions = ref([
            { label: 'Arrow Up', value: 'pi-arrow-up-right' },
            { label: 'User Edit', value: 'pi-user-edit' },
            { label: 'Money', value: 'pi-money-bill' },
            { label: 'Transfer', value: 'pi-arrow-right-arrow-left' },
            { label: 'Building', value: 'pi-building' },
            { label: 'Warning', value: 'pi-exclamation-triangle' },
            { label: 'ID Card', value: 'pi-id-card' },
            { label: 'Phone', value: 'pi-phone' },
            { label: 'File Edit', value: 'pi-file-edit' },
            { label: 'File', value: 'pi-file' },
            { label: 'Clock', value: 'pi-clock' },
            { label: 'Ticket', value: 'pi-ticket' },
            { label: 'Briefcase', value: 'pi-briefcase' },
            { label: 'Wallet', value: 'pi-wallet' },
            { label: 'Users', value: 'pi-users' }
        ]);

        // Color options
        const colorOptions = ref([
            '#f97316', '#3b82f6', '#10b981', '#6366f1', '#8b5cf6',
            '#eab308', '#06b6d4', '#14b8a6', '#f59e0b', '#ec4899',
            '#ef4444', '#64748b'
        ]);

        // Computed
        const activeTypesCount = computed(() => hrRequestTypes.value.filter(t => t.active).length);
        
        const totalFieldsCount = computed(() => 
            hrRequestTypes.value.reduce((sum, t) => sum + t.fields.length, 0)
        );

        const filteredEmployeeFields = computed(() => {
            const query = fieldSearchQuery.value.toLowerCase();
            if (!query) return allEmployeeFields.value;

            const filtered = {};
            Object.entries(allEmployeeFields.value).forEach(([group, fields]) => {
                const matchingFields = fields.filter(f => 
                    f.label.toLowerCase().includes(query) ||
                    group.toLowerCase().includes(query)
                );
                if (matchingFields.length > 0) {
                    filtered[group] = matchingFields;
                }
            });
            return filtered;
        });

        // Methods
        const getGroupIcon = (groupName) => {
            const icons = {
                'Basic Information': 'pi pi-user',
                'Organization': 'pi pi-sitemap',
                'Grade & Position': 'pi pi-briefcase',
                'Documents & Personal': 'pi pi-file',
                'Bank Information': 'pi pi-credit-card',
                'Emergency Contact': 'pi pi-exclamation-circle',
                'Work Access': 'pi pi-lock',
                'Contract Details': 'pi pi-file-edit',
                'Salary Information': 'pi pi-money-bill'
            };
            return icons[groupName] || 'pi pi-list';
        };

        const isFieldSelected = (fieldId) => {
            return typeForm.fields.some(f => f.id === fieldId);
        };

        const openTypeDialog = () => {
            editingType.value = null;
            typeForm.name = '';
            typeForm.description = '';
            typeForm.icon = 'pi-ticket';
            typeForm.color = '#3b82f6';
            typeForm.active = true;
            typeForm.fields = [];
            showTypeDialog.value = true;
        };

        const editType = (type) => {
            editingType.value = type;
            typeForm.name = type.name;
            typeForm.description = type.description;
            typeForm.icon = type.icon;
            typeForm.color = type.color;
            typeForm.active = type.active;
            typeForm.fields = [...type.fields];
            showTypeDialog.value = true;
        };

        const deleteType = (id) => {
            if (confirm('Are you sure you want to delete this HR request type?')) {
                hrRequestTypes.value = hrRequestTypes.value.filter(t => t.id !== id);
            }
        };

        const saveType = () => {
            if (!typeForm.name) {
                alert('Please enter a name for the request type.');
                return;
            }

            if (editingType.value) {
                const index = hrRequestTypes.value.findIndex(t => t.id === editingType.value.id);
                if (index !== -1) {
                    hrRequestTypes.value[index] = {
                        ...editingType.value,
                        name: typeForm.name,
                        description: typeForm.description,
                        icon: typeForm.icon,
                        color: typeForm.color,
                        active: typeForm.active,
                        fields: [...typeForm.fields]
                    };
                }
            } else {
                const newId = Math.max(...hrRequestTypes.value.map(t => t.id), 0) + 1;
                hrRequestTypes.value.push({
                    id: newId,
                    name: typeForm.name,
                    description: typeForm.description,
                    icon: typeForm.icon,
                    color: typeForm.color,
                    active: typeForm.active,
                    fields: [...typeForm.fields]
                });
            }

            showTypeDialog.value = false;
        };

        const addSelectedFields = () => {
            selectedFieldIds.value.forEach(fieldId => {
                // Find the field in allEmployeeFields
                for (const [group, fields] of Object.entries(allEmployeeFields.value)) {
                    const field = fields.find(f => f.id === fieldId);
                    if (field && !isFieldSelected(fieldId)) {
                        typeForm.fields.push({
                            id: field.id,
                            group: group,
                            label: field.label,
                            type: field.type
                        });
                        break;
                    }
                }
            });
            selectedFieldIds.value = [];
            showFieldSelector.value = false;
        };

        const removeField = (index) => {
            typeForm.fields.splice(index, 1);
        };

        const moveFieldUp = (index) => {
            if (index > 0) {
                const temp = typeForm.fields[index];
                typeForm.fields[index] = typeForm.fields[index - 1];
                typeForm.fields[index - 1] = temp;
            }
        };

        const moveFieldDown = (index) => {
            if (index < typeForm.fields.length - 1) {
                const temp = typeForm.fields[index];
                typeForm.fields[index] = typeForm.fields[index + 1];
                typeForm.fields[index + 1] = temp;
            }
        };

        return {
            showTypeDialog,
            showFieldSelector,
            editingType,
            fieldSearchQuery,
            selectedFieldIds,
            hrRequestTypes,
            allEmployeeFields,
            typeForm,
            iconOptions,
            colorOptions,
            activeTypesCount,
            totalFieldsCount,
            filteredEmployeeFields,
            getGroupIcon,
            isFieldSelected,
            openTypeDialog,
            editType,
            deleteType,
            saveType,
            addSelectedFields,
            removeField,
            moveFieldUp,
            moveFieldDown
        };
    }
};
