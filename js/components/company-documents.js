/**
 * Company Documents Component
 * CRUD for managing company documents and policies
 */

const CompanyDocumentsComponent = {
    template: `
        <div class="company-documents-page">
            <!-- List View -->
            <div v-if="currentView === 'list'">
                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="pi pi-folder"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ documentsList.length }}</div>
                            <div class="stat-label">Total Documents</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon orange">
                            <i class="pi pi-file-pdf"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ policyCount }}</div>
                            <div class="stat-label">Policies</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="pi pi-book"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ guideCount }}</div>
                            <div class="stat-label">Guides</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green">
                            <i class="pi pi-check-circle"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ activeCount }}</div>
                            <div class="stat-label">Active</div>
                        </div>
                    </div>
                </div>

                <!-- Documents Table -->
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">
                                <i class="pi pi-folder"></i>
                                Company Documents
                            </div>
                            <div class="card-subtitle">Manage company policies, guides, and official documents</div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <p-button label="Add Document" icon="pi pi-plus" @click="openForm(null)"></p-button>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="request-filters">
                        <div class="filter-tabs">
                            <button class="filter-tab" :class="{ active: categoryFilter === null }" @click="categoryFilter = null">
                                All <span class="filter-count">{{ documentsList.length }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: categoryFilter === 'policy' }" @click="categoryFilter = 'policy'">
                                Policies <span class="filter-count">{{ policyCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: categoryFilter === 'guide' }" @click="categoryFilter = 'guide'">
                                Guides <span class="filter-count">{{ guideCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: categoryFilter === 'regulation' }" @click="categoryFilter = 'regulation'">
                                Regulations <span class="filter-count">{{ regulationCount }}</span>
                            </button>
                        </div>
                    </div>

                    <p-datatable :value="filteredDocuments" striped-rows paginator :rows="10" 
                                 :rowsPerPageOptions="[5, 10, 20]">
                        <p-column header="Document" sortable field="name">
                            <template #body="slotProps">
                                <div class="doc-cell">
                                    <div class="doc-icon" :class="slotProps.data.iconClass">
                                        <i :class="'pi ' + slotProps.data.icon"></i>
                                    </div>
                                    <div>
                                        <div class="doc-name">{{ slotProps.data.name }}</div>
                                        <div class="doc-name-ar">{{ slotProps.data.nameAr }}</div>
                                    </div>
                                </div>
                            </template>
                        </p-column>
                        <p-column header="Category" sortable field="category">
                            <template #body="slotProps">
                                <span class="doc-category-badge" :class="slotProps.data.category">
                                    {{ formatCategory(slotProps.data.category) }}
                                </span>
                            </template>
                        </p-column>
                        <p-column header="File Type" sortable field="fileType">
                            <template #body="slotProps">
                                <span class="file-type-badge" :class="slotProps.data.fileType">
                                    {{ slotProps.data.fileType.toUpperCase() }}
                                </span>
                            </template>
                        </p-column>
                        <p-column header="Last Updated" sortable field="updatedAt">
                            <template #body="slotProps">
                                <div class="date-cell">
                                    <div>{{ formatDate(slotProps.data.updatedAt) }}</div>
                                    <div class="time-ago">{{ formatTimeAgo(slotProps.data.updatedAt) }}</div>
                                </div>
                            </template>
                        </p-column>
                        <p-column header="Downloads">
                            <template #body="slotProps">
                                <span class="downloads-count">
                                    <i class="pi pi-download"></i> {{ slotProps.data.downloads }}
                                </span>
                            </template>
                        </p-column>
                        <p-column header="Status">
                            <template #body="slotProps">
                                <p-tag :value="slotProps.data.status" 
                                       :severity="slotProps.data.status === 'active' ? 'success' : 'warn'"></p-tag>
                            </template>
                        </p-column>
                        <p-column header="Actions">
                            <template #body="slotProps">
                                <div class="action-buttons">
                                    <button class="action-icon-btn" @click="openForm(slotProps.data)" v-tooltip.top="'Edit'">
                                        <i class="pi pi-pencil"></i>
                                    </button>
                                    <button class="action-icon-btn danger" @click="confirmDelete(slotProps.data)" v-tooltip.top="'Delete'">
                                        <i class="pi pi-trash"></i>
                                    </button>
                                </div>
                            </template>
                        </p-column>
                    </p-datatable>
                </div>
            </div>

            <!-- Form View (Create/Edit) -->
            <div v-else class="doc-form-view">
                <div class="form-header">
                    <button class="back-btn" @click="currentView = 'list'">
                        <i class="pi pi-arrow-left"></i>
                    </button>
                    <div>
                        <h2>{{ editingDoc ? 'Edit Document' : 'Add New Document' }}</h2>
                        <p>{{ editingDoc ? 'Update document details' : 'Upload and configure a new company document' }}</p>
                    </div>
                </div>

                <div class="form-content">
                    <div class="form-main-section">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">
                                    <i class="pi pi-file"></i>
                                    Document Details
                                </div>
                            </div>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Document Name (English) <span class="required">*</span></label>
                                    <p-inputtext v-model="docForm.name" placeholder="e.g. Vacation & Leave Policy" style="width: 100%;"></p-inputtext>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Document Name (Arabic)</label>
                                    <p-inputtext v-model="docForm.nameAr" placeholder="e.g. سياسة الإجازات" style="width: 100%;" dir="rtl"></p-inputtext>
                                </div>
                            </div>

                            <div class="form-group" style="margin-top: 1rem;">
                                <label class="form-label">Description</label>
                                <p-textarea v-model="docForm.description" rows="3" placeholder="Brief description of this document..." style="width: 100%;"></p-textarea>
                            </div>

                            <div class="form-grid" style="margin-top: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Category <span class="required">*</span></label>
                                    <p-select v-model="docForm.category" :options="categoryOptions" optionLabel="name" optionValue="id" 
                                              placeholder="Select category" style="width: 100%;"></p-select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Icon</label>
                                    <p-select v-model="docForm.icon" :options="iconOptions" optionLabel="label" optionValue="value" 
                                              placeholder="Select icon" style="width: 100%;">
                                        <template #option="slotProps">
                                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                                <i :class="'pi ' + slotProps.option.value"></i>
                                                <span>{{ slotProps.option.label }}</span>
                                            </div>
                                        </template>
                                    </p-select>
                                </div>
                            </div>

                            <div class="form-grid" style="margin-top: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Icon Color</label>
                                    <p-select v-model="docForm.iconClass" :options="colorOptions" optionLabel="name" optionValue="id" 
                                              placeholder="Select color" style="width: 100%;"></p-select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Status</label>
                                    <p-select v-model="docForm.status" :options="statusOptions" 
                                              placeholder="Select status" style="width: 100%;"></p-select>
                                </div>
                            </div>

                            <div class="form-group" style="margin-top: 1.5rem;">
                                <label class="form-label">Upload Document <span class="required">*</span></label>
                                <div class="file-upload-zone">
                                    <p-fileupload mode="basic" 
                                                 accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                 :maxFileSize="10000000"
                                                 chooseLabel="Choose File"
                                                 @select="onFileSelect">
                                    </p-fileupload>
                                    <div class="upload-info">
                                        <span>or drag and drop</span>
                                        <span class="file-types">PDF, DOC, DOCX, XLS, XLSX (max 10MB)</span>
                                    </div>
                                </div>
                                <div v-if="docForm.fileName" class="selected-file">
                                    <i class="pi pi-file"></i>
                                    <span>{{ docForm.fileName }}</span>
                                    <button @click="docForm.fileName = null"><i class="pi pi-times"></i></button>
                                </div>
                            </div>
                        </div>

                        <!-- Visibility Settings -->
                        <div class="card" style="margin-top: 1.5rem;">
                            <div class="card-header">
                                <div class="card-title">
                                    <i class="pi pi-eye"></i>
                                    Visibility Settings
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Visible To</label>
                                <p-multiselect v-model="docForm.visibleTo" :options="visibilityOptions" optionLabel="name" optionValue="id" 
                                              placeholder="Select who can view this document" style="width: 100%;" display="chip"></p-multiselect>
                            </div>

                            <div class="form-group" style="margin-top: 1rem;">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <p-checkbox v-model="docForm.requireAcknowledgment" :binary="true" inputId="ack"></p-checkbox>
                                    <label for="ack" style="cursor: pointer;">Require employee acknowledgment</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <p-button label="Cancel" severity="secondary" outlined @click="currentView = 'list'"></p-button>
                        <p-button :label="editingDoc ? 'Update Document' : 'Add Document'" icon="pi pi-check" @click="saveDocument"></p-button>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Dialog -->
            <p-dialog v-model:visible="showDeleteDialog" header="Confirm Delete" :modal="true" :style="{ width: '400px' }">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500);"></i>
                    <span>Are you sure you want to delete "{{ docToDelete?.name }}"?</span>
                </div>
                <template #footer>
                    <p-button label="Cancel" text @click="showDeleteDialog = false"></p-button>
                    <p-button label="Delete" severity="danger" @click="deleteDocument"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed, reactive } = Vue;

        const currentView = ref('list');
        const categoryFilter = ref(null);
        const editingDoc = ref(null);
        const showDeleteDialog = ref(false);
        const docToDelete = ref(null);

        // Documents data
        const documentsList = ref([
            { id: 1, name: 'Regulations of Work in Direct', nameAr: 'أنظمة العمل في دايركت', icon: 'pi-file-pdf', iconClass: 'pdf', category: 'regulation', fileType: 'pdf', status: 'active', updatedAt: '2024-02-15', downloads: 245, description: 'Official work regulations document' },
            { id: 2, name: 'Direct Strategy 2024-2026', nameAr: '2024-2026 إستراتيجية', icon: 'pi-file', iconClass: 'doc', category: 'guide', fileType: 'pdf', status: 'active', updatedAt: '2024-01-10', downloads: 189, description: 'Company strategy document' },
            { id: 3, name: 'Vacation & Leave Policy', nameAr: 'سياسة الإجازات', icon: 'pi-calendar', iconClass: 'policy', category: 'policy', fileType: 'pdf', status: 'active', updatedAt: '2024-03-01', downloads: 412, description: 'Leave and vacation policies' },
            { id: 4, name: 'Employee Code of Conduct', nameAr: 'مدونة قواعد السلوك', icon: 'pi-users', iconClass: 'conduct', category: 'policy', fileType: 'pdf', status: 'active', updatedAt: '2023-12-20', downloads: 356, description: 'Code of conduct for all employees' },
            { id: 5, name: 'Performance Review Guide', nameAr: 'دليل تقييم الأداء', icon: 'pi-chart-line', iconClass: 'guide', category: 'guide', fileType: 'pdf', status: 'active', updatedAt: '2024-02-01', downloads: 178, description: 'Guide for performance reviews' },
            { id: 6, name: 'Health & Insurance Guide', nameAr: 'دليل التأمين الصحي', icon: 'pi-heart', iconClass: 'health', category: 'guide', fileType: 'pdf', status: 'active', updatedAt: '2024-01-25', downloads: 289, description: 'Health and insurance information' },
            { id: 7, name: 'Internal Communication', nameAr: 'سياسة التواصل الداخلي', icon: 'pi-comments', iconClass: 'comm', category: 'policy', fileType: 'docx', status: 'active', updatedAt: '2024-02-28', downloads: 134, description: 'Internal communication guidelines' },
            { id: 8, name: 'Remote Work Framework', nameAr: 'إطار العمل عن بعد', icon: 'pi-home', iconClass: 'remote', category: 'policy', fileType: 'pdf', status: 'draft', updatedAt: '2024-03-05', downloads: 67, description: 'Remote work policies and guidelines' }
        ]);

        // Form
        const docForm = reactive({
            name: '',
            nameAr: '',
            description: '',
            category: null,
            icon: 'pi-file-pdf',
            iconClass: 'pdf',
            status: 'active',
            fileName: null,
            visibleTo: ['all'],
            requireAcknowledgment: false
        });

        // Options
        const categoryOptions = ref([
            { id: 'policy', name: 'Policy' },
            { id: 'guide', name: 'Guide' },
            { id: 'regulation', name: 'Regulation' }
        ]);

        const iconOptions = ref([
            { label: 'PDF File', value: 'pi-file-pdf' },
            { label: 'Document', value: 'pi-file' },
            { label: 'Calendar', value: 'pi-calendar' },
            { label: 'Users', value: 'pi-users' },
            { label: 'Chart', value: 'pi-chart-line' },
            { label: 'Heart', value: 'pi-heart' },
            { label: 'Comments', value: 'pi-comments' },
            { label: 'Home', value: 'pi-home' },
            { label: 'Book', value: 'pi-book' },
            { label: 'Briefcase', value: 'pi-briefcase' }
        ]);

        const colorOptions = ref([
            { id: 'pdf', name: 'Red' },
            { id: 'doc', name: 'Blue' },
            { id: 'policy', name: 'Orange' },
            { id: 'conduct', name: 'Purple' },
            { id: 'guide', name: 'Green' },
            { id: 'health', name: 'Pink' },
            { id: 'comm', name: 'Cyan' },
            { id: 'remote', name: 'Indigo' }
        ]);

        const statusOptions = ref(['active', 'draft', 'archived']);

        const visibilityOptions = ref([
            { id: 'all', name: 'All Employees' },
            { id: 'management', name: 'Management Only' },
            { id: 'hr', name: 'HR Department' },
            { id: 'finance', name: 'Finance Department' }
        ]);

        // Computed
        const policyCount = computed(() => documentsList.value.filter(d => d.category === 'policy').length);
        const guideCount = computed(() => documentsList.value.filter(d => d.category === 'guide').length);
        const regulationCount = computed(() => documentsList.value.filter(d => d.category === 'regulation').length);
        const activeCount = computed(() => documentsList.value.filter(d => d.status === 'active').length);

        const filteredDocuments = computed(() => {
            if (!categoryFilter.value) return documentsList.value;
            return documentsList.value.filter(d => d.category === categoryFilter.value);
        });

        // Methods
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        };

        const formatTimeAgo = (dateStr) => {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            if (diff === 0) return 'Today';
            if (diff === 1) return 'Yesterday';
            if (diff < 7) return diff + ' days ago';
            if (diff < 30) return Math.floor(diff / 7) + ' weeks ago';
            return Math.floor(diff / 30) + ' months ago';
        };

        const formatCategory = (category) => {
            return category.charAt(0).toUpperCase() + category.slice(1);
        };

        const openForm = (doc) => {
            if (doc) {
                editingDoc.value = doc;
                docForm.name = doc.name;
                docForm.nameAr = doc.nameAr;
                docForm.description = doc.description || '';
                docForm.category = doc.category;
                docForm.icon = doc.icon;
                docForm.iconClass = doc.iconClass;
                docForm.status = doc.status;
                docForm.fileName = doc.name + '.' + doc.fileType;
            } else {
                editingDoc.value = null;
                docForm.name = '';
                docForm.nameAr = '';
                docForm.description = '';
                docForm.category = null;
                docForm.icon = 'pi-file-pdf';
                docForm.iconClass = 'pdf';
                docForm.status = 'active';
                docForm.fileName = null;
                docForm.visibleTo = ['all'];
                docForm.requireAcknowledgment = false;
            }
            currentView.value = 'form';
        };

        const onFileSelect = (event) => {
            if (event.files && event.files[0]) {
                docForm.fileName = event.files[0].name;
            }
        };

        const saveDocument = () => {
            if (!docForm.name || !docForm.category) {
                alert('Please fill in all required fields.');
                return;
            }

            if (editingDoc.value) {
                const index = documentsList.value.findIndex(d => d.id === editingDoc.value.id);
                if (index !== -1) {
                    documentsList.value[index] = {
                        ...editingDoc.value,
                        name: docForm.name,
                        nameAr: docForm.nameAr,
                        description: docForm.description,
                        category: docForm.category,
                        icon: docForm.icon,
                        iconClass: docForm.iconClass,
                        status: docForm.status,
                        updatedAt: new Date().toISOString().split('T')[0]
                    };
                }
            } else {
                const newId = Math.max(...documentsList.value.map(d => d.id), 0) + 1;
                documentsList.value.push({
                    id: newId,
                    name: docForm.name,
                    nameAr: docForm.nameAr,
                    description: docForm.description,
                    category: docForm.category,
                    icon: docForm.icon,
                    iconClass: docForm.iconClass,
                    fileType: 'pdf',
                    status: docForm.status,
                    updatedAt: new Date().toISOString().split('T')[0],
                    downloads: 0
                });
            }

            currentView.value = 'list';
        };

        const confirmDelete = (doc) => {
            docToDelete.value = doc;
            showDeleteDialog.value = true;
        };

        const deleteDocument = () => {
            if (docToDelete.value) {
                documentsList.value = documentsList.value.filter(d => d.id !== docToDelete.value.id);
            }
            showDeleteDialog.value = false;
            docToDelete.value = null;
        };

        return {
            currentView,
            categoryFilter,
            editingDoc,
            showDeleteDialog,
            docToDelete,
            documentsList,
            docForm,
            categoryOptions,
            iconOptions,
            colorOptions,
            statusOptions,
            visibilityOptions,
            policyCount,
            guideCount,
            regulationCount,
            activeCount,
            filteredDocuments,
            formatDate,
            formatTimeAgo,
            formatCategory,
            openForm,
            onFileSelect,
            saveDocument,
            confirmDelete,
            deleteDocument
        };
    }
};
