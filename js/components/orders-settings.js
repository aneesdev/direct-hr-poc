/**
 * Orders & Requests Settings Component
 * Handles Request Categories and Request Types CRUD
 */

const OrdersSettingsComponent = {
    template: `
        <div class="orders-settings-page">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="pi pi-folder"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ requestCategories.length }}</div>
                        <div class="stat-label">Request Categories</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="pi pi-list"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ requestTypes.length }}</div>
                        <div class="stat-label">Request Types</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ activeTypesCount }}</div>
                        <div class="stat-label">Active Types</div>
                    </div>
                </div>
            </div>

            <!-- Settings Tabs -->
            <div class="settings-tabs">
                <p-tabs :value="activeTab">
                    <p-tablist>
                        <p-tab value="categories" @click="activeTab = 'categories'">Request Categories</p-tab>
                        <p-tab value="types" @click="activeTab = 'types'">Request Types</p-tab>
                    </p-tablist>

                    <p-tabpanels>
                        <!-- Request Categories Tab -->
                        <p-tabpanel value="categories">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-folder"></i>
                                        Request Categories
                                    </div>
                                    <div class="card-subtitle">Manage main categories like Leaves, Business Trips, Letters, etc.</div>
                                </div>
                                <p-button label="Add Category" icon="pi pi-plus" @click="openCategoryDialog()"></p-button>
                            </div>

                            <div class="category-cards-grid">
                                <div v-for="cat in requestCategories" :key="cat.id" class="category-card" :style="{ borderLeftColor: cat.color }">
                                    <div class="category-card-header">
                                        <div class="category-icon" :style="{ background: cat.color + '20', color: cat.color }">
                                            <i :class="'pi ' + cat.icon"></i>
                                        </div>
                                        <div class="category-info">
                                            <div class="category-name">{{ cat.name }}</div>
                                            <div class="category-desc">{{ cat.description }}</div>
                                        </div>
                                        <div class="category-actions">
                                            <button class="action-btn edit" @click="editCategory(cat)"><i class="pi pi-pencil"></i></button>
                                            <button class="action-btn delete" @click="deleteCategory(cat.id)"><i class="pi pi-trash"></i></button>
                                        </div>
                                    </div>
                                    <div class="category-card-footer">
                                        <span class="stat-badge">{{ getTypeCountByCategory(cat.id) }} types</span>
                                        <span class="status-tag" :class="cat.active ? 'active' : 'inactive'">
                                            {{ cat.active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </p-tabpanel>

                        <!-- Request Types Tab -->
                        <p-tabpanel value="types">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">
                                        <i class="pi pi-list"></i>
                                        Request Types
                                    </div>
                                    <div class="card-subtitle">Configure request types with forms and approval workflows</div>
                                </div>
                                <p-button label="Add Request Type" icon="pi pi-plus" @click="openTypeDialog()"></p-button>
                            </div>

                            <!-- Filter by Category -->
                            <div style="margin-bottom: 1rem;">
                                <p-select v-model="filterCategory" :options="categoryFilterOptions" optionLabel="name" optionValue="id" 
                                          placeholder="Filter by Category" showClear style="width: 250px;"></p-select>
                            </div>

                            <p-datatable :value="filteredRequestTypes" striped-rows paginator :rows="10">
                                <p-column header="Request Type" sortable>
                                    <template #body="slotProps">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <div class="type-icon" :style="{ background: getCategoryColor(slotProps.data.categoryId) + '20', color: getCategoryColor(slotProps.data.categoryId) }">
                                                <i :class="'pi ' + getCategoryIcon(slotProps.data.categoryId)"></i>
                                            </div>
                                            <div>
                                                <div style="font-weight: 600;">{{ slotProps.data.name }}</div>
                                                <div style="font-size: 0.8rem; color: var(--text-color-secondary);">{{ slotProps.data.description }}</div>
                                            </div>
                                        </div>
                                    </template>
                                </p-column>
                                <p-column header="Category">
                                    <template #body="slotProps">
                                        <p-tag :value="getCategoryName(slotProps.data.categoryId)" 
                                               :style="{ background: getCategoryColor(slotProps.data.categoryId) + '20', color: getCategoryColor(slotProps.data.categoryId) }"></p-tag>
                                    </template>
                                </p-column>
                                <p-column header="Repetition">
                                    <template #body="slotProps">
                                        {{ getRepetitionLabel(slotProps.data.repetition) }}
                                    </template>
                                </p-column>
                                <p-column header="Balance">
                                    <template #body="slotProps">
                                        <span v-if="slotProps.data.balanceSource === 'system'">From Settings</span>
                                        <span v-else-if="slotProps.data.balanceSource === 'fixed'">
                                            {{ slotProps.data.balanceDays || slotProps.data.balanceHours }} {{ slotProps.data.balanceHours ? 'hours' : 'days' }}
                                        </span>
                                        <span v-else>-</span>
                                    </template>
                                </p-column>
                                <p-column header="Form Fields">
                                    <template #body="slotProps">
                                        <span class="stat-badge">{{ slotProps.data.formFields.length }} fields</span>
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
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>

            <!-- Category Dialog -->
            <p-dialog v-model:visible="showCategoryDialog" :header="editingCategory ? 'Edit Category' : 'Add Category'" :modal="true" :style="{ width: '500px' }">
                <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-group">
                        <label class="form-label">Name <span class="required">*</span></label>
                        <p-inputtext v-model="categoryForm.name" placeholder="e.g. Leaves" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <p-inputtext v-model="categoryForm.description" placeholder="Brief description" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Icon</label>
                        <p-select v-model="categoryForm.icon" :options="iconOptions" optionLabel="label" optionValue="value" placeholder="Select icon" style="width: 100%;">
                            <template #option="slotProps">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <i :class="'pi ' + slotProps.option.value"></i>
                                    <span>{{ slotProps.option.label }}</span>
                                </div>
                            </template>
                        </p-select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Color</label>
                        <div class="color-picker-row">
                            <div v-for="color in colorOptions" :key="color" 
                                 class="color-option" 
                                 :class="{ selected: categoryForm.color === color }"
                                 :style="{ background: color }"
                                 @click="categoryForm.color = color"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="categoryForm.active"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Active</label>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showCategoryDialog = false"></p-button>
                    <p-button :label="editingCategory ? 'Update' : 'Save'" @click="saveCategory"></p-button>
                </template>
            </p-dialog>

            <!-- Request Type Dialog -->
            <p-dialog v-model:visible="showTypeDialog" :header="editingType ? 'Edit Request Type' : 'Add Request Type'" :modal="true" :style="{ width: '800px' }">
                <div class="type-dialog-content">
                    <!-- Basic Info Section -->
                    <div class="form-section-title">Basic Information</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Category <span class="required">*</span></label>
                            <p-select v-model="typeForm.categoryId" :options="requestCategories" optionLabel="name" optionValue="id" 
                                      placeholder="Select category" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Name <span class="required">*</span></label>
                            <p-inputtext v-model="typeForm.name" placeholder="e.g. Annual Leave" style="width: 100%;"></p-inputtext>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 1rem;">
                        <label class="form-label">Description</label>
                        <p-inputtext v-model="typeForm.description" placeholder="Brief description" style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-group" style="margin-top: 1rem;">
                        <label class="form-label">Policy Note</label>
                        <p-textarea v-model="typeForm.policyNote" placeholder="Enter policy note that will be displayed to employees..." rows="3" style="width: 100%;"></p-textarea>
                    </div>

                    <!-- Balance Settings Section -->
                    <div class="form-section-title">Balance Settings</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Repetition/Calculation</label>
                            <p-select v-model="typeForm.repetition" :options="repetitionOptions" optionLabel="name" optionValue="id" 
                                      placeholder="Select repetition" style="width: 100%;"></p-select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Balance Source</label>
                            <p-select v-model="typeForm.balanceSource" :options="balanceSourceOptions" optionLabel="name" optionValue="id" 
                                      placeholder="Select source" style="width: 100%;"></p-select>
                        </div>
                    </div>
                    <div class="form-grid" style="margin-top: 1rem;">
                        <div class="form-group" v-if="typeForm.balanceSource === 'fixed'">
                            <label class="form-label">Balance Days</label>
                            <p-inputnumber v-model="typeForm.balanceDays" placeholder="e.g. 21" style="width: 100%;"></p-inputnumber>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Calculation Method</label>
                            <p-select v-model="typeForm.balanceMethod" :options="balanceMethodOptions" optionLabel="name" optionValue="id" 
                                      placeholder="Select method" style="width: 100%;"></p-select>
                        </div>
                    </div>

                    <!-- Form Fields Section -->
                    <div class="form-section-title">
                        <span>Form Fields</span>
                        <p-button label="Add Field" icon="pi pi-plus" size="small" @click="addFormField" style="margin-left: auto;"></p-button>
                    </div>
                    <div class="form-fields-builder" v-if="typeForm.formFields.length > 0">
                        <div v-for="(field, index) in typeForm.formFields" :key="field.id" class="form-field-item">
                            <div class="field-drag-handle">
                                <i class="pi pi-bars"></i>
                            </div>
                            <div class="field-config">
                                <div class="field-row">
                                    <p-select v-model="field.type" :options="formFieldTypes" optionLabel="name" optionValue="id" 
                                              placeholder="Field Type" style="width: 180px;">
                                        <template #option="slotProps">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <i :class="'pi ' + slotProps.option.icon" style="font-size: 0.85rem;"></i>
                                                <span>{{ slotProps.option.name }}</span>
                                            </div>
                                        </template>
                                    </p-select>
                                    <p-inputtext v-model="field.label" placeholder="Field Label" style="flex: 1;"></p-inputtext>
                                    <div class="field-required">
                                        <p-checkbox v-model="field.required" :binary="true"></p-checkbox>
                                        <span>Required</span>
                                    </div>
                                </div>
                                <div v-if="field.type === 'dropdown'" class="field-options-row">
                                    <label class="form-label" style="font-size: 0.75rem;">Dropdown Options (comma separated)</label>
                                    <p-inputtext v-model="field.optionsText" placeholder="Option 1, Option 2, Option 3" style="width: 100%;"
                                                 @input="updateFieldOptions(field)"></p-inputtext>
                                </div>
                            </div>
                            <div class="field-actions">
                                <button class="action-btn" @click="moveFieldUp(index)" :disabled="index === 0">
                                    <i class="pi pi-arrow-up"></i>
                                </button>
                                <button class="action-btn" @click="moveFieldDown(index)" :disabled="index === typeForm.formFields.length - 1">
                                    <i class="pi pi-arrow-down"></i>
                                </button>
                                <button class="action-btn delete" @click="removeFormField(index)">
                                    <i class="pi pi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-fields">
                        <i class="pi pi-inbox"></i>
                        <p>No form fields added yet. Click "Add Field" to create fields.</p>
                    </div>

                    <!-- Approval Flow Section -->
                    <div class="form-section-title">Approval Flow</div>
                    <div class="approval-flow-builder">
                        <!-- Primary Approval -->
                        <div class="approval-step">
                            <div class="step-label">Primary Approval</div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Line Manager Level</label>
                                    <p-select v-model="typeForm.approvalFlow.lineManagerLevel" :options="lineManagerLevels" 
                                              optionLabel="name" optionValue="id" placeholder="Select level" showClear style="width: 100%;"></p-select>
                                </div>
                                <div class="form-group">
                                    <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.75rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <p-checkbox v-model="typeForm.approvalFlow.requireHrAdmin" :binary="true"></p-checkbox>
                                            <label class="form-label" style="margin: 0;">Requires HR Administrator</label>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <p-checkbox v-model="typeForm.approvalFlow.requireHrManager" :binary="true"></p-checkbox>
                                            <label class="form-label" style="margin: 0;">Requires HR Manager</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Conditional Approval -->
                        <div class="approval-condition">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                                <p-checkbox v-model="typeForm.approvalFlow.conditionEnabled" :binary="true"></p-checkbox>
                                <label class="form-label" style="margin: 0; font-weight: 600;">Enable Conditional Approval</label>
                            </div>
                            <div v-if="typeForm.approvalFlow.conditionEnabled" class="condition-config">
                                <div class="condition-row">
                                    <span>If request is more than</span>
                                    <p-inputnumber v-model="typeForm.approvalFlow.conditionDays" style="width: 80px;" :min="1"></p-inputnumber>
                                    <span>days, then:</span>
                                </div>
                                <div class="form-grid" style="margin-top: 1rem;">
                                    <div class="form-group">
                                        <label class="form-label">Additional Line Manager Level</label>
                                        <p-select v-model="typeForm.approvalFlow.conditionLineManagerLevel" :options="lineManagerLevels" 
                                                  optionLabel="name" optionValue="id" placeholder="Select level" showClear style="width: 100%;"></p-select>
                                    </div>
                                    <div class="form-group">
                                        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.75rem;">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <p-checkbox v-model="typeForm.approvalFlow.conditionRequireHrAdmin" :binary="true"></p-checkbox>
                                                <label class="form-label" style="margin: 0;">Requires HR Administrator</label>
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <p-checkbox v-model="typeForm.approvalFlow.conditionRequireHrManager" :binary="true"></p-checkbox>
                                                <label class="form-label" style="margin: 0;">Requires HR Manager</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Toggle -->
                    <div class="form-group" style="margin-top: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <p-toggleswitch v-model="typeForm.active"></p-toggleswitch>
                            <label class="form-label" style="margin: 0;">Active</label>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showTypeDialog = false"></p-button>
                    <p-button :label="editingType ? 'Update' : 'Save'" @click="saveType"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        // Tab state
        const activeTab = ref('categories');

        // Dialog states
        const showCategoryDialog = ref(false);
        const showTypeDialog = ref(false);
        const editingCategory = ref(null);
        const editingType = ref(null);

        // Data
        const requestCategories = ref([...StaticData.requestCategories]);
        const requestTypes = ref([...StaticData.requestTypes]);
        const formFieldTypes = ref([...StaticData.formFieldTypes]);
        const repetitionOptions = ref([...StaticData.repetitionOptions]);
        const balanceMethodOptions = ref([...StaticData.balanceMethodOptions]);
        const lineManagerLevels = ref([...StaticData.lineManagerLevels]);

        // Filter
        const filterCategory = ref(null);

        // Computed
        const activeTypesCount = computed(() => requestTypes.value.filter(t => t.active).length);

        const categoryFilterOptions = computed(() => {
            return [{ id: null, name: 'All Categories' }, ...requestCategories.value];
        });

        const filteredRequestTypes = computed(() => {
            if (!filterCategory.value) return requestTypes.value;
            return requestTypes.value.filter(t => t.categoryId === filterCategory.value);
        });

        // Options
        const iconOptions = ref([
            { label: 'Calendar', value: 'pi-calendar' },
            { label: 'Briefcase', value: 'pi-briefcase' },
            { label: 'Clock', value: 'pi-clock' },
            { label: 'File', value: 'pi-file' },
            { label: 'Inbox', value: 'pi-inbox' },
            { label: 'Home', value: 'pi-home' },
            { label: 'Car', value: 'pi-car' },
            { label: 'Heart', value: 'pi-heart' },
            { label: 'Star', value: 'pi-star' },
            { label: 'Flag', value: 'pi-flag' }
        ]);

        const colorOptions = ref(['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#64748b']);

        const balanceSourceOptions = ref([
            { id: null, name: 'No Balance' },
            { id: 'system', name: 'From Employee Settings' },
            { id: 'fixed', name: 'Fixed Days' }
        ]);

        // Forms
        const categoryForm = ref({
            name: '',
            description: '',
            icon: 'pi-calendar',
            color: '#22c55e',
            active: true
        });

        const typeForm = ref({
            categoryId: null,
            name: '',
            description: '',
            policyNote: '',
            repetition: 'yearly',
            balanceSource: null,
            balanceDays: null,
            balanceMethod: 'working_days',
            formFields: [],
            approvalFlow: {
                lineManagerLevel: 1,
                requireHrAdmin: false,
                requireHrManager: false,
                conditionEnabled: false,
                conditionDays: 5,
                conditionLineManagerLevel: null,
                conditionRequireHrAdmin: false,
                conditionRequireHrManager: false
            },
            active: true
        });

        // Helper functions
        const getCategoryName = (id) => requestCategories.value.find(c => c.id === id)?.name || '';
        const getCategoryColor = (id) => requestCategories.value.find(c => c.id === id)?.color || '#64748b';
        const getCategoryIcon = (id) => requestCategories.value.find(c => c.id === id)?.icon || 'pi-folder';
        const getTypeCountByCategory = (catId) => requestTypes.value.filter(t => t.categoryId === catId).length;
        const getRepetitionLabel = (id) => repetitionOptions.value.find(r => r.id === id)?.name || id;

        // Category methods
        const openCategoryDialog = () => {
            editingCategory.value = null;
            categoryForm.value = { name: '', description: '', icon: 'pi-calendar', color: '#22c55e', active: true };
            showCategoryDialog.value = true;
        };

        const editCategory = (cat) => {
            editingCategory.value = cat;
            categoryForm.value = { ...cat };
            showCategoryDialog.value = true;
        };

        const saveCategory = () => {
            if (!categoryForm.value.name) return;

            if (editingCategory.value) {
                const idx = requestCategories.value.findIndex(c => c.id === editingCategory.value.id);
                if (idx !== -1) {
                    requestCategories.value[idx] = { ...categoryForm.value, id: editingCategory.value.id };
                }
            } else {
                const maxId = Math.max(...requestCategories.value.map(c => c.id), 0);
                requestCategories.value.push({ ...categoryForm.value, id: maxId + 1 });
            }
            showCategoryDialog.value = false;
        };

        const deleteCategory = (id) => {
            if (getTypeCountByCategory(id) > 0) {
                alert('Cannot delete category with existing request types. Please delete or move the types first.');
                return;
            }
            requestCategories.value = requestCategories.value.filter(c => c.id !== id);
        };

        // Type methods
        const openTypeDialog = () => {
            editingType.value = null;
            typeForm.value = {
                categoryId: null,
                name: '',
                description: '',
                policyNote: '',
                repetition: 'yearly',
                balanceSource: null,
                balanceDays: null,
                balanceMethod: 'working_days',
                formFields: [],
                approvalFlow: {
                    lineManagerLevel: 1,
                    requireHrAdmin: false,
                    requireHrManager: false,
                    conditionEnabled: false,
                    conditionDays: 5,
                    conditionLineManagerLevel: null,
                    conditionRequireHrAdmin: false,
                    conditionRequireHrManager: false
                },
                active: true
            };
            showTypeDialog.value = true;
        };

        const editType = (type) => {
            editingType.value = type;
            // Deep clone the type to avoid direct mutation
            const clonedType = JSON.parse(JSON.stringify(type));
            // Add optionsText for dropdown fields
            clonedType.formFields = clonedType.formFields.map(f => ({
                ...f,
                optionsText: f.options ? f.options.join(', ') : ''
            }));
            typeForm.value = clonedType;
            showTypeDialog.value = true;
        };

        const saveType = () => {
            if (!typeForm.value.name || !typeForm.value.categoryId) return;

            // Clean up form fields - convert optionsText to options array
            const cleanedFields = typeForm.value.formFields.map((f, idx) => {
                const cleaned = { ...f, order: idx + 1 };
                if (f.type === 'dropdown' && f.optionsText) {
                    cleaned.options = f.optionsText.split(',').map(o => o.trim()).filter(o => o);
                }
                delete cleaned.optionsText;
                return cleaned;
            });

            const typeData = {
                ...typeForm.value,
                formFields: cleanedFields
            };

            if (editingType.value) {
                const idx = requestTypes.value.findIndex(t => t.id === editingType.value.id);
                if (idx !== -1) {
                    requestTypes.value[idx] = { ...typeData, id: editingType.value.id };
                }
            } else {
                const maxId = Math.max(...requestTypes.value.map(t => t.id), 0);
                requestTypes.value.push({ ...typeData, id: maxId + 1 });
            }
            showTypeDialog.value = false;
        };

        const deleteType = (id) => {
            requestTypes.value = requestTypes.value.filter(t => t.id !== id);
        };

        // Form field methods
        const addFormField = () => {
            const newId = 'f' + Date.now();
            typeForm.value.formFields.push({
                id: newId,
                type: 'text',
                label: '',
                required: false,
                order: typeForm.value.formFields.length + 1,
                optionsText: ''
            });
        };

        const removeFormField = (index) => {
            typeForm.value.formFields.splice(index, 1);
        };

        const moveFieldUp = (index) => {
            if (index === 0) return;
            const temp = typeForm.value.formFields[index];
            typeForm.value.formFields[index] = typeForm.value.formFields[index - 1];
            typeForm.value.formFields[index - 1] = temp;
        };

        const moveFieldDown = (index) => {
            if (index === typeForm.value.formFields.length - 1) return;
            const temp = typeForm.value.formFields[index];
            typeForm.value.formFields[index] = typeForm.value.formFields[index + 1];
            typeForm.value.formFields[index + 1] = temp;
        };

        const updateFieldOptions = (field) => {
            // This just keeps optionsText in sync, actual parsing happens on save
        };

        return {
            // State
            activeTab,
            showCategoryDialog,
            showTypeDialog,
            editingCategory,
            editingType,
            filterCategory,
            // Data
            requestCategories,
            requestTypes,
            formFieldTypes,
            repetitionOptions,
            balanceMethodOptions,
            lineManagerLevels,
            // Computed
            activeTypesCount,
            categoryFilterOptions,
            filteredRequestTypes,
            // Options
            iconOptions,
            colorOptions,
            balanceSourceOptions,
            // Forms
            categoryForm,
            typeForm,
            // Helpers
            getCategoryName,
            getCategoryColor,
            getCategoryIcon,
            getTypeCountByCategory,
            getRepetitionLabel,
            // Category methods
            openCategoryDialog,
            editCategory,
            saveCategory,
            deleteCategory,
            // Type methods
            openTypeDialog,
            editType,
            saveType,
            deleteType,
            // Form field methods
            addFormField,
            removeFormField,
            moveFieldUp,
            moveFieldDown,
            updateFieldOptions
        };
    }
};

window.OrdersSettingsComponent = OrdersSettingsComponent;
