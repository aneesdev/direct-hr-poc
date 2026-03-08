/**
 * Employee Documents Component
 * Employee Iqama Documents Management
 * Shows only Iqama type documents with expiry tracking
 */

const EmployeeDocumentsComponent = {
    template: `
        <div class="employee-documents-page">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="pi pi-id-card"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ documents.length }}</div>
                        <div class="stat-label">Total Iqamas</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="pi pi-check-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ validCount }}</div>
                        <div class="stat-label">Valid</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="pi pi-exclamation-triangle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ nearExpireCount }}</div>
                        <div class="stat-label">Near Expiry</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">
                        <i class="pi pi-times-circle"></i>
                    </div>
                    <div>
                        <div class="stat-value">{{ expiredCount }}</div>
                        <div class="stat-label">Expired</div>
                    </div>
                </div>
            </div>

            <!-- Documents Table -->
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">
                            <i class="pi pi-id-card"></i>
                            Employee Iqama Documents
                        </div>
                        <div class="card-subtitle">Track and manage employee Iqama expiry dates</div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="request-filters">
                    <div class="filter-tabs">
                        <button class="filter-tab" :class="{ active: statusFilter === null }" @click="statusFilter = null">
                            All <span class="filter-count">{{ documents.length }}</span>
                        </button>
                        <button class="filter-tab" :class="{ active: statusFilter === 'valid' }" @click="statusFilter = 'valid'">
                            Valid <span class="filter-count">{{ validCount }}</span>
                        </button>
                        <button class="filter-tab" :class="{ active: statusFilter === 'near_expire' }" @click="statusFilter = 'near_expire'">
                            Near Expiry <span class="filter-count">{{ nearExpireCount }}</span>
                        </button>
                        <button class="filter-tab" :class="{ active: statusFilter === 'expired' }" @click="statusFilter = 'expired'">
                            Expired <span class="filter-count">{{ expiredCount }}</span>
                        </button>
                    </div>
                </div>

                <p-datatable :value="filteredDocuments" striped-rows paginator :rows="10" 
                             :rowsPerPageOptions="[5, 10, 20]">
                    <p-column header="Employee">
                        <template #body="slotProps">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <img :src="slotProps.data.employeeAvatar" :alt="slotProps.data.employeeName" 
                                     style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">
                                <div>
                                    <div style="font-weight: 600;">{{ slotProps.data.employeeName }}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-color-secondary);">{{ slotProps.data.employeeId }}</div>
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column field="iqamaNumber" header="Iqama Number"></p-column>
                    <p-column header="Expiry Date">
                        <template #body="slotProps">
                            <div>
                                <div>{{ slotProps.data.expiryDate }}</div>
                                <div :style="{ fontSize: '0.8rem', color: getExpiryColor(slotProps.data.status) }">
                                    {{ slotProps.data.expiresIn }}
                                </div>
                            </div>
                        </template>
                    </p-column>
                    <p-column header="Status">
                        <template #body="slotProps">
                            <span class="doc-status-tag" :class="slotProps.data.status">
                                {{ getStatusLabel(slotProps.data.status) }}
                            </span>
                        </template>
                    </p-column>
                    <p-column header="Actions" style="width: 80px">
                        <template #body="slotProps">
                            <button class="action-icon-btn" @click="openUpdateDialog(slotProps.data)" v-tooltip.top="'Update Expiry'">
                                <i class="pi pi-calendar"></i>
                            </button>
                        </template>
                    </p-column>
                </p-datatable>
            </div>

            <!-- Update Expiry Dialog -->
            <p-dialog v-model:visible="showUpdateDialog" header="Update Iqama Expiry" :modal="true" :style="{ width: '400px' }">
                <div v-if="selectedDoc" style="margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--surface-50); border-radius: 8px;">
                        <img :src="selectedDoc.employeeAvatar" style="width: 40px; height: 40px; border-radius: 50%;">
                        <div>
                            <div style="font-weight: 600;">{{ selectedDoc.employeeName }}</div>
                            <div style="font-size: 0.85rem; color: var(--text-color-secondary);">Iqama: {{ selectedDoc.iqamaNumber }}</div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">New Expiry Date <span class="required">*</span></label>
                    <p-datepicker v-model="newExpiryDate" dateFormat="dd/mm/yy" style="width: 100%;"></p-datepicker>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="secondary" outlined @click="showUpdateDialog = false"></p-button>
                    <p-button label="Update" icon="pi pi-check" @click="updateExpiry"></p-button>
                </template>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        const statusFilter = ref(null);
        const showUpdateDialog = ref(false);
        const selectedDoc = ref(null);
        const newExpiryDate = ref(null);

        const documents = ref([
            { id: 1, employeeId: 'EMP-1001', employeeName: 'Ahmed Al-Rashid', employeeAvatar: 'https://randomuser.me/api/portraits/men/1.jpg', iqamaNumber: '2456789012', expiryDate: '15/08/2026', expiresIn: '6 months', status: 'valid' },
            { id: 2, employeeId: 'EMP-1002', employeeName: 'Mohammed Hassan', employeeAvatar: 'https://randomuser.me/api/portraits/men/2.jpg', iqamaNumber: '2456789013', expiryDate: '10/04/2026', expiresIn: '2 months', status: 'near_expire' },
            { id: 3, employeeId: 'EMP-1003', employeeName: 'Fatima Al-Zahra', employeeAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', iqamaNumber: '2456789014', expiryDate: '25/03/2026', expiresIn: '1 month', status: 'near_expire' },
            { id: 4, employeeId: 'EMP-1004', employeeName: 'Khalid Ibrahim', employeeAvatar: 'https://randomuser.me/api/portraits/men/3.jpg', iqamaNumber: '2456789015', expiryDate: '01/01/2026', expiresIn: 'Expired', status: 'expired' },
            { id: 5, employeeId: 'EMP-1005', employeeName: 'Sara Abdullah', employeeAvatar: 'https://randomuser.me/api/portraits/women/2.jpg', iqamaNumber: '2456789016', expiryDate: '20/12/2026', expiresIn: '10 months', status: 'valid' },
            { id: 6, employeeId: 'EMP-1006', employeeName: 'Omar Al-Farsi', employeeAvatar: 'https://randomuser.me/api/portraits/men/4.jpg', iqamaNumber: '2456789017', expiryDate: '05/05/2026', expiresIn: '3 months', status: 'near_expire' },
            { id: 7, employeeId: 'EMP-1007', employeeName: 'Layla Mohammed', employeeAvatar: 'https://randomuser.me/api/portraits/women/3.jpg', iqamaNumber: '2456789018', expiryDate: '30/11/2025', expiresIn: 'Expired', status: 'expired' },
            { id: 8, employeeId: 'EMP-1008', employeeName: 'Yusuf Al-Ahmad', employeeAvatar: 'https://randomuser.me/api/portraits/men/5.jpg', iqamaNumber: '2456789019', expiryDate: '15/09/2026', expiresIn: '7 months', status: 'valid' }
        ]);

        const validCount = computed(() => documents.value.filter(d => d.status === 'valid').length);
        const nearExpireCount = computed(() => documents.value.filter(d => d.status === 'near_expire').length);
        const expiredCount = computed(() => documents.value.filter(d => d.status === 'expired').length);

        const filteredDocuments = computed(() => {
            if (!statusFilter.value) return documents.value;
            return documents.value.filter(d => d.status === statusFilter.value);
        });

        const getStatusLabel = (status) => {
            const labels = {
                'valid': 'Valid',
                'near_expire': 'Near Expiry',
                'expired': 'Expired'
            };
            return labels[status] || status;
        };

        const getExpiryColor = (status) => {
            const colors = {
                'valid': '#22c55e',
                'near_expire': '#f97316',
                'expired': '#ef4444'
            };
            return colors[status] || 'var(--text-color-secondary)';
        };

        const openUpdateDialog = (doc) => {
            selectedDoc.value = doc;
            newExpiryDate.value = null;
            showUpdateDialog.value = true;
        };

        const updateExpiry = () => {
            if (selectedDoc.value && newExpiryDate.value) {
                const idx = documents.value.findIndex(d => d.id === selectedDoc.value.id);
                if (idx !== -1) {
                    const date = newExpiryDate.value;
                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    
                    const now = new Date();
                    const diffMonths = (date.getFullYear() - now.getFullYear()) * 12 + (date.getMonth() - now.getMonth());
                    
                    let status = 'valid';
                    let expiresIn = '';
                    
                    if (date < now) {
                        status = 'expired';
                        expiresIn = 'Expired';
                    } else if (diffMonths <= 3) {
                        status = 'near_expire';
                        expiresIn = diffMonths <= 1 ? '1 month' : diffMonths + ' months';
                    } else {
                        status = 'valid';
                        expiresIn = diffMonths + ' months';
                    }
                    
                    documents.value[idx] = {
                        ...documents.value[idx],
                        expiryDate: formattedDate,
                        expiresIn: expiresIn,
                        status: status
                    };
                }
                showUpdateDialog.value = false;
            }
        };

        return {
            statusFilter,
            showUpdateDialog,
            selectedDoc,
            newExpiryDate,
            documents,
            validCount,
            nearExpireCount,
            expiredCount,
            filteredDocuments,
            getStatusLabel,
            getExpiryColor,
            openUpdateDialog,
            updateExpiry
        };
    }
};

window.EmployeeDocumentsComponent = EmployeeDocumentsComponent;
