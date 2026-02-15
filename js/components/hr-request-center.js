/**
 * HR Request Center Component
 * Displays grid of available HR request types
 */

const HrRequestCenterComponent = {
    template: `
        <div class="hr-request-center-page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h2 class="page-title">HR Request Center</h2>
                    <p class="page-subtitle">Select a request type below to initiate a new HR process.</p>
                </div>
            </div>

            <!-- Request Types Grid -->
            <div class="hr-request-grid">
                <div v-for="request in hrRequestTypes" :key="request.id" 
                     class="hr-request-card" 
                     :class="{ selected: selectedRequest?.id === request.id }"
                     @click="openRequest(request)">
                    <div class="hr-request-icon" :style="getIconStyle(request)">
                        <i :class="'pi ' + request.icon"></i>
                    </div>
                    <div class="hr-request-name">{{ request.name }}</div>
                    <div class="hr-request-description">{{ request.description }}</div>
                </div>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { ref, computed } = Vue;

        const selectedRequest = ref(null);

        // HR Request Types - these would come from settings in production
        const hrRequestTypes = ref([
            {
                id: 1,
                name: 'Employee Promotion',
                description: 'Submit a request to elevate an employee to a higher position or rank within the organization.',
                icon: 'pi-arrow-up-right',
                color: '#f97316',
                fields: [
                    { id: 'mainGrade', group: 'Grade & Position', label: 'New Main Grade', type: 'dropdown' },
                    { id: 'subGrade', group: 'Grade & Position', label: 'New Sub Grade', type: 'dropdown' },
                    { id: 'jobTitle', group: 'Grade & Position', label: 'New Job Title', type: 'dropdown' },
                    { id: 'basicSalary', group: 'Salary Information', label: 'Basic Salary', type: 'number' },
                    { id: 'houseAllowance', group: 'Salary Information', label: 'Accommodation Allowance', type: 'number' },
                    { id: 'transportationAllowance', group: 'Salary Information', label: 'Transportation Allowance', type: 'number' },
                    { id: 'otherAllowance', group: 'Salary Information', label: 'Other Allowance', type: 'number' }
                ],
                summaryTitle: 'Promotion Summary'
            },
            {
                id: 2,
                name: 'Change Job Title',
                description: 'Update an official job designation without a change in hierarchy or salary band.',
                icon: 'pi-user-edit',
                color: '#3b82f6',
                fields: [
                    { id: 'jobTitle', group: 'Position', label: 'New Job Title', type: 'dropdown' }
                ],
                summaryTitle: 'Summary'
            },
            {
                id: 3,
                name: 'Salary & Benefits Adjustment',
                description: 'Request modifications to base salary, allowances, bonuses, or other financial benefits.',
                icon: 'pi-money-bill',
                color: '#10b981',
                fields: [
                    { id: 'basicSalary', group: 'Salary Information', label: 'Basic Salary', type: 'number' },
                    { id: 'houseAllowance', group: 'Salary Information', label: 'Accommodation Allowance', type: 'number' },
                    { id: 'transportationAllowance', group: 'Salary Information', label: 'Transportation Allowance', type: 'number' },
                    { id: 'otherAllowance', group: 'Salary Information', label: 'Other Allowance', type: 'number' }
                ],
                summaryTitle: 'Summary'
            },
            {
                id: 4,
                name: 'Employee Transfer',
                description: 'Initiate a transfer of an employee to a different department, branch, or location.',
                icon: 'pi-arrow-right-arrow-left',
                color: '#6366f1',
                fields: [
                    { id: 'department', group: 'Organization', label: 'Department', type: 'dropdown' },
                    { id: 'section', group: 'Organization', label: 'Section', type: 'dropdown' },
                    { id: 'costCenter', group: 'Organization', label: 'Cost Center', type: 'dropdown' }
                ],
                summaryTitle: 'Summary'
            },
            {
                id: 5,
                name: 'Cost Center Change',
                description: "Reallocate an employee's expenses to a different financial cost center or project code.",
                icon: 'pi-building',
                color: '#8b5cf6',
                fields: [
                    { id: 'costCenter', group: 'Financial', label: 'Cost Center', type: 'dropdown' }
                ],
                summaryTitle: 'Summary'
            },
            {
                id: 6,
                name: 'Disciplinary Action / Warnings',
                description: 'Log a formal warning or initiate disciplinary procedures for policy violations.',
                icon: 'pi-exclamation-triangle',
                color: '#eab308',
                fields: [
                    { id: 'disciplinaryType', group: 'Action Details', label: 'Action Type', type: 'dropdown', options: ['Verbal Warning', 'Written Warning', 'Final Warning', 'Suspension', 'Termination'] },
                    { id: 'reason', group: 'Action Details', label: 'Reason', type: 'textarea' }
                ],
                summaryTitle: 'Summary'
            },
            {
                id: 7,
                name: 'Update Personal Information',
                description: 'Modify generic personal details, emergency contacts, or home address.',
                icon: 'pi-id-card',
                color: '#06b6d4',
                fields: [
                    { id: 'personalEmail', group: 'Contact', label: 'Personal Email', type: 'text' },
                    { id: 'mobile', group: 'Contact', label: 'Mobile Number', type: 'text' },
                    { id: 'city', group: 'Address', label: 'City', type: 'text' },
                    { id: 'emergencyContactName', group: 'Emergency Contact', label: 'Contact Name', type: 'text' },
                    { id: 'emergencyContactPhone', group: 'Emergency Contact', label: 'Phone Number', type: 'text' }
                ],
                summaryTitle: 'Summary'
            },
            {
                id: 8,
                name: 'Change Extension / Email Details',
                description: 'Request a new internal telephone extension or update email details.',
                icon: 'pi-phone',
                color: '#14b8a6',
                fields: [
                    { id: 'extensionNumber', group: 'Contact', label: 'Extension Number', type: 'text' },
                    { id: 'workEmail', group: 'Contact', label: 'Work Email', type: 'text' }
                ],
                summaryTitle: 'Summary'
            },
            {
                id: 9,
                name: 'Change Contract Type',
                description: 'Switch between fixed-term, permanent, part-time, or consultancy contracts.',
                icon: 'pi-file-edit',
                color: '#f59e0b',
                fields: [
                    { id: 'contractClassification', group: 'Contract Details', label: 'Contract Classification', type: 'dropdown', options: ['Defined Period', 'Undefined Period'] },
                    { id: 'contractType', group: 'Contract Details', label: 'Contract Type', type: 'dropdown', options: ['Full-Time', 'Part-Time', 'Contractor', 'Consultancy'] },
                    { id: 'probationPeriod', group: 'Contract Details', label: 'Probation Period', type: 'dropdown', options: ['No Probation', '3 Months', '6 Months'] },
                    { id: 'annualLeaveDays', group: 'Contract Details', label: 'Annual Leave', type: 'dropdown', options: ['21 Days', '24 Days', '30 Days'] }
                ],
                summaryTitle: 'New Contract Summary'
            },
            {
                id: 10,
                name: 'Document & Detail Updates',
                description: 'Update official records such as Passport details, National ID, or driving license data.',
                icon: 'pi-file',
                color: '#64748b',
                fields: [
                    { id: 'documentType', group: 'Document Details', label: 'Document Type', type: 'dropdown', options: ['National ID', 'Passport', 'Driving License'] },
                    { id: 'documentNumber', group: 'Document Details', label: 'Document Number', type: 'text' },
                    { id: 'expiryDate', group: 'Document Details', label: 'Expiry Date', type: 'date' },
                    { id: 'attachment', group: 'Document Details', label: 'Attachment', type: 'file' }
                ],
                summaryTitle: 'Summary'
            },
            {
                id: 11,
                name: 'Attendance & Shift Adjustment',
                description: 'Correct punch-in/out records or modify an assigned shift schedule.',
                icon: 'pi-clock',
                color: '#ec4899',
                fields: [
                    { id: 'adjustmentType', group: 'Adjustment Details', label: 'Adjustment Type', type: 'dropdown', options: ['Punch Correction', 'Shift Change', 'Overtime Request'] },
                    { id: 'adjustmentDate', group: 'Adjustment Details', label: 'Date', type: 'date' },
                    { id: 'reason', group: 'Adjustment Details', label: 'Reason', type: 'textarea' }
                ],
                summaryTitle: 'Summary'
            }
        ]);

        const getIconStyle = (request) => {
            return {
                background: request.color + '15',
                color: request.color,
                border: '1px solid ' + request.color + '30'
            };
        };

        const openRequest = (request) => {
            selectedRequest.value = request;
            // Emit event to navigate to the request form
            emit('open-request', request);
        };

        return {
            hrRequestTypes,
            selectedRequest,
            getIconStyle,
            openRequest
        };
    }
};
