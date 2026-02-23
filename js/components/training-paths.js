/**
 * Training Paths Component
 * CRUD for managing training paths/curriculum
 */

const TrainingPathsComponent = {
    template: `
        <div class="training-paths-page">
            <!-- Page Header -->
            <div class="page-header-row">
                <div>
                    <h1>Training Paths</h1>
                    <p>Manage and organize your training curriculum.</p>
                </div>
                <p-button label="Add New Path" icon="pi pi-plus" @click="openDialog(null)"></p-button>
            </div>

            <!-- Paths Table -->
            <div class="card">
                <p-datatable :value="paths" stripedRows paginator :rows="10" 
                             :rowsPerPageOptions="[5, 10, 20]"
                             tableStyle="min-width: 50rem">
                    <p-column field="name" header="PATH NAME" sortable>
                        <template #body="slotProps">
                            <span class="path-name">{{ slotProps.data.name }}</span>
                        </template>
                    </p-column>
                    <p-column field="description" header="DESCRIPTION">
                        <template #body="slotProps">
                            <span class="path-description">{{ truncateText(slotProps.data.description, 80) }}</span>
                        </template>
                    </p-column>
                    <p-column field="hours" header="HOURS" sortable style="width: 120px;">
                        <template #body="slotProps">
                            <span class="hours-badge">{{ slotProps.data.hours }} hrs</span>
                        </template>
                    </p-column>
                    <p-column field="dateAdded" header="DATE ADDED" sortable style="width: 140px;">
                        <template #body="slotProps">
                            <span>{{ formatDate(slotProps.data.dateAdded) }}</span>
                        </template>
                    </p-column>
                    <p-column header="ACTIONS" style="width: 120px;">
                        <template #body="slotProps">
                            <div class="action-buttons">
                                <button class="action-icon-btn" @click="openDialog(slotProps.data)" v-tooltip.top="'Edit'">
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

            <!-- Create/Edit Dialog -->
            <p-dialog v-model:visible="showDialog" :header="editingPath ? 'Edit Training Path' : 'Create New Training Path'" 
                      :modal="true" :style="{ width: '500px' }" :closable="true">
                <div class="training-form">
                    <div class="form-field">
                        <label>Path Name</label>
                        <p-inputtext v-model="form.name" placeholder="e.g. Onboarding 2024" 
                                     style="width: 100%;"></p-inputtext>
                    </div>
                    <div class="form-field">
                        <label>Description</label>
                        <p-textarea v-model="form.description" rows="4" 
                                    placeholder="Describe the goals and stages of this training..."
                                    style="width: 100%;"></p-textarea>
                    </div>
                    <div class="form-field">
                        <label>Calculated Training Hours</label>
                        <p-select v-model="form.hours" :options="hoursOptions" optionLabel="label" optionValue="value"
                                  placeholder="Select hours" style="width: 100%;"></p-select>
                    </div>
                </div>
                <template #footer>
                    <p-button label="Cancel" text @click="showDialog = false"></p-button>
                    <p-button :label="editingPath ? 'Update Path' : 'Create Path'" 
                              @click="savePath" :disabled="!form.name"></p-button>
                </template>
            </p-dialog>

            <!-- Delete Confirmation Dialog -->
            <p-dialog v-model:visible="showDeleteDialog" header="Confirm Delete" :modal="true" :style="{ width: '400px' }">
                <div class="delete-confirm-content">
                    <i class="pi pi-exclamation-triangle"></i>
                    <span>Are you sure you want to delete <strong>{{ pathToDelete?.name }}</strong>? This action cannot be undone.</span>
                </div>
                <template #footer>
                    <p-button label="Cancel" text @click="showDeleteDialog = false"></p-button>
                    <p-button label="Delete" severity="danger" @click="deletePath"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        const showDialog = ref(false);
        const showDeleteDialog = ref(false);
        const editingPath = ref(null);
        const pathToDelete = ref(null);

        const form = ref({
            name: '',
            description: '',
            hours: null
        });

        // Generate 150 hours options (1 to 150)
        const hoursOptions = computed(() => {
            return Array.from({ length: 150 }, (_, i) => ({
                label: `${i + 1} hour${i + 1 > 1 ? 's' : ''}`,
                value: i + 1
            }));
        });

        const paths = ref([
            { id: 1, name: 'Cybersecurity Essentials', description: 'Master the basics of digital safety, threat detection, and response protocols.', hours: 10, dateAdded: '2026-02-22' },
            { id: 2, name: 'Leadership & Management', description: 'Developing core managerial skills, conflict resolution, and team building for leaders.', hours: 40, dateAdded: '2026-02-22' },
            { id: 3, name: 'Python for Data Analysis', description: 'A comprehensive guide to data manipulation using Pandas, NumPy, and visualization tools.', hours: 60, dateAdded: '2026-02-22' },
            { id: 4, name: 'Workplace Safety & Health', description: 'Mandatory certification for operational safety, hazard identification, and emergency response.', hours: 5, dateAdded: '2026-02-22' },
            { id: 5, name: 'Strategic Communication', description: 'Improving internal collaboration and external stakeholder management through effective communication.', hours: 20, dateAdded: '2026-02-22' },
            { id: 6, name: 'Customer Success Mastery', description: 'Advanced techniques for building long-term client relationships and reducing churn.', hours: 15, dateAdded: '2026-02-22' },
            { id: 7, name: 'Project Management Foundations', description: 'Introduction to Agile, Waterfall, and hybrid project management methodologies.', hours: 25, dateAdded: '2026-02-22' },
            { id: 8, name: 'AI Ethics & Governance', description: 'Understanding the legal, moral, and technical implications of implementing AI in business.', hours: 30, dateAdded: '2026-02-22' },
            { id: 9, name: 'Advanced Excel for Finance', description: 'Complex financial modeling, automation using Power Query, and advanced pivot tables.', hours: 35, dateAdded: '2026-02-22' },
            { id: 10, name: 'Diversity & Inclusion', description: 'Strategies for building an equitable, supportive, and inclusive corporate environment.', hours: 8, dateAdded: '2026-02-22' }
        ]);

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
        };

        const truncateText = (text, length) => {
            if (!text) return '';
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        };

        const openDialog = (path) => {
            if (path) {
                editingPath.value = path;
                form.value = { ...path };
            } else {
                editingPath.value = null;
                form.value = { name: '', description: '', hours: null };
            }
            showDialog.value = true;
        };

        const savePath = () => {
            if (editingPath.value) {
                const index = paths.value.findIndex(p => p.id === editingPath.value.id);
                if (index !== -1) {
                    paths.value[index] = { ...paths.value[index], ...form.value };
                }
            } else {
                const newPath = {
                    id: Date.now(),
                    ...form.value,
                    dateAdded: new Date().toISOString().split('T')[0]
                };
                paths.value.unshift(newPath);
            }
            showDialog.value = false;
        };

        const confirmDelete = (path) => {
            pathToDelete.value = path;
            showDeleteDialog.value = true;
        };

        const deletePath = () => {
            if (pathToDelete.value) {
                paths.value = paths.value.filter(p => p.id !== pathToDelete.value.id);
                pathToDelete.value = null;
                showDeleteDialog.value = false;
            }
        };

        return {
            showDialog,
            showDeleteDialog,
            editingPath,
            pathToDelete,
            form,
            hoursOptions,
            paths,
            formatDate,
            truncateText,
            openDialog,
            savePath,
            confirmDelete,
            deletePath
        };
    }
};

window.TrainingPathsComponent = TrainingPathsComponent;
