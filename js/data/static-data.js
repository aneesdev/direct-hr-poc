/**
 * Static Data for Direct HR POC
 * Contains all mock data used across the application
 */

const StaticData = {
    // Countries of Work (company operates in these countries)
    countriesOfWork: [
        { id: 1, name: 'Egypt', code: 'eg', timezone: 'Africa/Cairo (GMT+2)', logo: 'https://flagcdn.com/w40/eg.png', active: true },
        { id: 2, name: 'Saudi Arabia', code: 'sa', timezone: 'Asia/Riyadh (GMT+3)', logo: 'https://flagcdn.com/w40/sa.png', active: true },
        { id: 3, name: 'United Arab Emirates', code: 'ae', timezone: 'Asia/Dubai (GMT+4)', logo: 'https://flagcdn.com/w40/ae.png', active: true },
    ],

    // All nationalities (for employee nationality dropdown)
    nationalities: [
        { code: 'eg', name: 'Egyptian', flag: 'https://flagcdn.com/w40/eg.png' },
        { code: 'sa', name: 'Saudi', flag: 'https://flagcdn.com/w40/sa.png' },
        { code: 'ae', name: 'Emirati', flag: 'https://flagcdn.com/w40/ae.png' },
        { code: 'jo', name: 'Jordanian', flag: 'https://flagcdn.com/w40/jo.png' },
        { code: 'lb', name: 'Lebanese', flag: 'https://flagcdn.com/w40/lb.png' },
        { code: 'sy', name: 'Syrian', flag: 'https://flagcdn.com/w40/sy.png' },
        { code: 'iq', name: 'Iraqi', flag: 'https://flagcdn.com/w40/iq.png' },
        { code: 'kw', name: 'Kuwaiti', flag: 'https://flagcdn.com/w40/kw.png' },
        { code: 'bh', name: 'Bahraini', flag: 'https://flagcdn.com/w40/bh.png' },
        { code: 'qa', name: 'Qatari', flag: 'https://flagcdn.com/w40/qa.png' },
        { code: 'om', name: 'Omani', flag: 'https://flagcdn.com/w40/om.png' },
        { code: 'ye', name: 'Yemeni', flag: 'https://flagcdn.com/w40/ye.png' },
        { code: 'ps', name: 'Palestinian', flag: 'https://flagcdn.com/w40/ps.png' },
        { code: 'ma', name: 'Moroccan', flag: 'https://flagcdn.com/w40/ma.png' },
        { code: 'tn', name: 'Tunisian', flag: 'https://flagcdn.com/w40/tn.png' },
        { code: 'dz', name: 'Algerian', flag: 'https://flagcdn.com/w40/dz.png' },
        { code: 'sd', name: 'Sudanese', flag: 'https://flagcdn.com/w40/sd.png' },
        { code: 'in', name: 'Indian', flag: 'https://flagcdn.com/w40/in.png' },
        { code: 'pk', name: 'Pakistani', flag: 'https://flagcdn.com/w40/pk.png' },
        { code: 'bd', name: 'Bangladeshi', flag: 'https://flagcdn.com/w40/bd.png' },
        { code: 'ph', name: 'Filipino', flag: 'https://flagcdn.com/w40/ph.png' },
        { code: 'id', name: 'Indonesian', flag: 'https://flagcdn.com/w40/id.png' },
        { code: 'gb', name: 'British', flag: 'https://flagcdn.com/w40/gb.png' },
        { code: 'us', name: 'American', flag: 'https://flagcdn.com/w40/us.png' },
        { code: 'ca', name: 'Canadian', flag: 'https://flagcdn.com/w40/ca.png' },
        { code: 'de', name: 'German', flag: 'https://flagcdn.com/w40/de.png' },
        { code: 'fr', name: 'French', flag: 'https://flagcdn.com/w40/fr.png' },
    ],

    // Entities (company entities)
    entities: [
        { id: 1, name: 'Direct', active: true },
        { id: 2, name: 'Techtic', active: true },
    ],

    // All countries for dropdowns (residence, etc.)
    allCountries: [
        { code: 'eg', name: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png' },
        { code: 'sa', name: 'Saudi Arabia', flag: 'https://flagcdn.com/w40/sa.png' },
        { code: 'ae', name: 'United Arab Emirates', flag: 'https://flagcdn.com/w40/ae.png' },
        { code: 'jo', name: 'Jordan', flag: 'https://flagcdn.com/w40/jo.png' },
        { code: 'lb', name: 'Lebanon', flag: 'https://flagcdn.com/w40/lb.png' },
        { code: 'kw', name: 'Kuwait', flag: 'https://flagcdn.com/w40/kw.png' },
        { code: 'bh', name: 'Bahrain', flag: 'https://flagcdn.com/w40/bh.png' },
        { code: 'qa', name: 'Qatar', flag: 'https://flagcdn.com/w40/qa.png' },
        { code: 'om', name: 'Oman', flag: 'https://flagcdn.com/w40/om.png' },
    ],

    // Available timezones
    timezones: [
        'Africa/Cairo (GMT+2)',
        'Asia/Riyadh (GMT+3)',
        'Asia/Dubai (GMT+4)',
        'Europe/London (GMT+0)',
        'America/New_York (GMT-5)'
    ],

    // Public holidays data (with date range support)
    holidays: [
        { id: 1, country: 'Egypt', name: 'Revolution Day', startDate: '25/01/2026', endDate: '25/01/2026', year: 2026 },
        { id: 2, country: 'Egypt', name: 'Sinai Liberation Day', startDate: '25/04/2026', endDate: '25/04/2026', year: 2026 },
        { id: 3, country: 'Saudi Arabia', name: 'Founding Day', startDate: '22/02/2026', endDate: '22/02/2026', year: 2026 },
        { id: 4, country: 'Saudi Arabia', name: 'National Day', startDate: '23/09/2026', endDate: '24/09/2026', year: 2026 },
        { id: 5, country: 'United Arab Emirates', name: 'National Day', startDate: '02/12/2026', endDate: '03/12/2026', year: 2026 },
        { id: 6, country: 'Egypt', name: 'Eid Al-Fitr', startDate: '30/03/2026', endDate: '02/04/2026', year: 2026 },
        { id: 7, country: 'Saudi Arabia', name: 'Eid Al-Fitr', startDate: '30/03/2026', endDate: '03/04/2026', year: 2026 },
    ],

    // Organization structure - Departments (with employee count)
    departments: [
        { id: 1, name: 'Engineering', employeeCount: 3 },
        { id: 2, name: 'Human Resources', employeeCount: 1 },
        { id: 3, name: 'Finance', employeeCount: 1 },
        { id: 4, name: 'Operations', employeeCount: 0 },
    ],

    // Organization structure - Sections (with employee count)
    sections: [
        { id: 1, name: 'Software Development', departmentId: 1, employeeCount: 2 },
        { id: 2, name: 'Quality Assurance', departmentId: 1, employeeCount: 1 },
        { id: 3, name: 'Recruitment', departmentId: 2, employeeCount: 1 },
        { id: 4, name: 'Payroll', departmentId: 3, employeeCount: 1 },
    ],

    // Organization structure - Units (with employee count)
    units: [
        { id: 1, name: 'Frontend Team', sectionId: 1, employeeCount: 1 },
        { id: 2, name: 'Backend Team', sectionId: 1, employeeCount: 1 },
        { id: 3, name: 'Mobile Team', sectionId: 1, employeeCount: 0 },
        { id: 4, name: 'Testing Unit', sectionId: 2, employeeCount: 1 },
    ],

    // Organization structure - Teams (with employee count)
    teams: [
        { id: 1, name: 'React Developers', unitId: 1, employeeCount: 1 },
        { id: 2, name: 'Vue Developers', unitId: 1, employeeCount: 0 },
        { id: 3, name: 'Node.js Team', unitId: 2, employeeCount: 1 },
        { id: 4, name: 'Python Team', unitId: 2, employeeCount: 0 },
    ],

    // Main Grades
    mainGrades: [
        { id: 1, name: 'Professional', description: 'Individual contributors and specialists' },
        { id: 2, name: 'Supervisor', description: 'Team leads and supervisors' },
        { id: 3, name: 'Management', description: 'Department and division managers' },
        { id: 4, name: 'Executives', description: 'C-level and senior leadership' },
    ],

    // Sub Grades (depends on Main Grade)
    subGrades: [
        { id: 1, name: 'Junior', mainGradeId: 1 },
        { id: 2, name: 'Mid-Level', mainGradeId: 1 },
        { id: 3, name: 'Senior', mainGradeId: 1 },
        { id: 4, name: 'Lead', mainGradeId: 1 },
        { id: 5, name: 'Team Lead', mainGradeId: 2 },
        { id: 6, name: 'Senior Team Lead', mainGradeId: 2 },
        { id: 7, name: 'Manager', mainGradeId: 3 },
        { id: 8, name: 'Senior Manager', mainGradeId: 3 },
        { id: 9, name: 'Director', mainGradeId: 3 },
        { id: 10, name: 'VP', mainGradeId: 4 },
        { id: 11, name: 'SVP', mainGradeId: 4 },
        { id: 12, name: 'C-Level', mainGradeId: 4 },
    ],

    // Job Titles (child of Main Grade, sibling of Sub Grade)
    jobTitles: [
        { id: 1, name: 'Software Engineer', mainGradeId: 1, description: 'Software developer role' },
        { id: 2, name: 'QA Engineer', mainGradeId: 1, description: 'Quality assurance engineer' },
        { id: 3, name: 'Data Analyst', mainGradeId: 1, description: 'Data analysis specialist' },
        { id: 4, name: 'HR Specialist', mainGradeId: 1, description: 'Human resources specialist' },
        { id: 5, name: 'Accountant', mainGradeId: 1, description: 'Finance and accounting role' },
        { id: 6, name: 'Marketing Specialist', mainGradeId: 1, description: 'Marketing professional' },
        { id: 7, name: 'Team Lead', mainGradeId: 2, description: 'Team leadership role' },
        { id: 8, name: 'Technical Lead', mainGradeId: 2, description: 'Technical team supervisor' },
        { id: 9, name: 'Project Supervisor', mainGradeId: 2, description: 'Project oversight role' },
        { id: 10, name: 'Department Manager', mainGradeId: 3, description: 'Department head role' },
        { id: 11, name: 'Operations Manager', mainGradeId: 3, description: 'Operations management' },
        { id: 12, name: 'HR Manager', mainGradeId: 3, description: 'HR department manager' },
        { id: 13, name: 'Finance Manager', mainGradeId: 3, description: 'Finance department manager' },
        { id: 14, name: 'Director', mainGradeId: 4, description: 'Senior director role' },
        { id: 15, name: 'Vice President', mainGradeId: 4, description: 'VP level executive' },
        { id: 16, name: 'CTO', mainGradeId: 4, description: 'Chief Technology Officer' },
        { id: 17, name: 'CFO', mainGradeId: 4, description: 'Chief Financial Officer' },
        { id: 18, name: 'CEO', mainGradeId: 4, description: 'Chief Executive Officer' },
    ],

    // Cost Centers (with head count)
    costCenters: [
        { id: 1, code: 'CC-001', name: 'Engineering Operations', headCount: 3, active: true },
        { id: 2, code: 'CC-002', name: 'HR Administration', headCount: 1, active: true },
        { id: 3, code: 'CC-003', name: 'Finance & Accounting', headCount: 1, active: true },
        { id: 4, code: 'CC-004', name: 'Marketing & Sales', headCount: 0, active: false },
        { id: 5, code: 'CC-005', name: 'IT Infrastructure', headCount: 0, active: true },
    ],

    // Document Types
    documentTypes: [
        { id: 1, name: 'National ID Card', mandatory: true, hasExpiry: true, sendReminders: true, reminderMonths: 1 },
        { id: 2, name: 'Iqama', mandatory: true, hasExpiry: true, sendReminders: true, reminderMonths: 2 },
        { id: 3, name: 'CPR', mandatory: false, hasExpiry: true, sendReminders: true, reminderMonths: 1 },
        { id: 4, name: 'Passport', mandatory: true, hasExpiry: true, sendReminders: true, reminderMonths: 3 },
        { id: 5, name: 'Work Permit', mandatory: false, hasExpiry: true, sendReminders: false, reminderMonths: 1 },
        { id: 6, name: 'CV', mandatory: true, hasExpiry: false, sendReminders: false, reminderMonths: 0 },
        { id: 7, name: 'Graduation Certificate', mandatory: false, hasExpiry: false, sendReminders: false, reminderMonths: 0 },
        { id: 8, name: 'IBAN Document', mandatory: false, hasExpiry: false, sendReminders: false, reminderMonths: 0 },
    ],

    // Employee Documents
    documents: [
        { id: 1, employeeId: 1, employeeName: 'Ahmed Hassan', employeeAvatar: 'https://i.pravatar.cc/40?img=11', documentType: 'National ID Card', isPrimary: true, expiryDate: '05/04/2028', expiresIn: 'In 2 years', status: 'valid', lastUpdated: '12/09/2022' },
        { id: 2, employeeId: 2, employeeName: 'Sara Omar', employeeAvatar: 'https://i.pravatar.cc/40?img=5', documentType: 'National ID Card', isPrimary: true, expiryDate: '02/11/2028', expiresIn: 'In 2 years', status: 'valid', lastUpdated: '12/09/2022' },
        { id: 3, employeeId: 3, employeeName: 'Mohammed Al-Rashid', employeeAvatar: 'https://i.pravatar.cc/40?img=12', documentType: 'CPR', isPrimary: false, expiryDate: '01/04/2029', expiresIn: 'In 3 years', status: 'valid', lastUpdated: '06/10/2025' },
        { id: 4, employeeId: 4, employeeName: 'Fatima Ibrahim', employeeAvatar: 'https://i.pravatar.cc/40?img=9', documentType: 'National ID Card', isPrimary: true, expiryDate: '05/06/2025', expiresIn: 'Expired', status: 'expired', lastUpdated: '12/09/2022' },
        { id: 5, employeeId: 5, employeeName: 'Yusuf Ahmed', employeeAvatar: 'https://i.pravatar.cc/40?img=15', documentType: 'National ID Card', isPrimary: true, expiryDate: '03/09/2024', expiresIn: 'Expired', status: 'expired', lastUpdated: '12/09/2022' },
    ],

    // Office locations (simplified - removed coordinates/radius, added Google Maps link)
    offices: [
        { id: 1, name: 'Cairo HQ', country: 'Egypt', googleMapsLink: 'https://maps.google.com/?q=Cairo,Egypt', active: true },
        { id: 2, name: 'Riyadh Office', country: 'Saudi Arabia', googleMapsLink: 'https://maps.google.com/?q=Riyadh,SaudiArabia', active: true },
        { id: 3, name: 'Dubai Office', country: 'United Arab Emirates', googleMapsLink: 'https://maps.google.com/?q=Dubai,UAE', active: true },
    ],

    // Work Weeks (CRUD like Bayzat)
    workWeeks: [
        {
            id: 1,
            name: 'Standard Week (Sun-Thu)', 
            days: { Sunday: true, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: false, Saturday: false },
            totalDays: 5,
            active: true
        },
        {
            id: 2,
            name: 'Standard Week (Mon-Fri)', 
            days: { Sunday: false, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: false },
            totalDays: 5,
            active: true
        },
        {
            id: 3,
            name: '6-Day Week (Sun-Fri)', 
            days: { Sunday: true, Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: false },
            totalDays: 6,
            active: true
        },
        { 
            id: 4, 
            name: '4-Day Week', 
            days: { Sunday: true, Monday: true, Tuesday: true, Wednesday: true, Thursday: false, Friday: false, Saturday: false },
            totalDays: 4,
            active: true
        },
    ],

    // Emergency contact relationship options
    emergencyContactRelationships: ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other Relative'],

    // Iqama occupation options
    iqamaOccupations: [
        'Software Engineer',
        'Project Manager',
        'Business Analyst',
        'Quality Assurance Engineer',
        'HR Specialist',
        'Accountant',
        'Financial Analyst',
        'Marketing Specialist',
        'Sales Representative',
        'Administrative Assistant',
        'Operations Manager',
        'IT Support Specialist',
        'Data Analyst',
        'Graphic Designer',
        'Content Writer',
    ],

    // Biometric devices
    biometricDevices: [
        { id: 1, name: 'Main Entrance', model: 'ZKTeco K40', serialNumber: 'ZK-2024-001', office: 'Cairo HQ', createdAt: '01/01/2026' },
        { id: 2, name: 'Floor 2 Entry', model: 'ZKTeco K40', serialNumber: 'ZK-2024-002', office: 'Cairo HQ', createdAt: '01/01/2026' },
        { id: 3, name: 'Reception', model: 'Hikvision DS-K1T', serialNumber: 'HK-2024-001', office: 'Riyadh Office', createdAt: '15/01/2026' },
    ],

    // Attendance settings (removed autoMarkAbsent)
    attendanceSettings: {
        allowMultipleOffices: true
    },

    // Professional picture guidelines
    pictureGuidelines: {
        width: 400,
        height: 400,
        maxSize: '2MB',
        formats: ['JPG', 'PNG'],
        tips: [
            'Use a plain white or light background',
            'Face the camera directly',
            'Ensure good lighting on your face',
            'Dress professionally',
            'Image should be recent (within 6 months)'
        ]
    },

    // Page titles mapping
    pageTitles: {
        'home': 'Home',
        'employee-directory': 'Employee Directory',
        'company-news': 'Company News & Achievements',
        'company-settings': 'Company Settings',
        'employee-settings': 'Employee Settings',
        'employees': 'Employees',
        'add-employee': 'Add Employee',
        'attendance': 'Shift & Attendance',
        'payroll': 'Payroll',
        'payroll-cycle': 'Payroll Cycle',
        'workflow': 'Workflows',
        'reports': 'Reports',
        'orders-settings': 'Orders & Requests Settings',
        'new-request': 'New Request',
        'my-requests': 'Requests',
        'new-appraisal': 'New Appraisal Cycle',
        'appraisal-tracking': 'Appraisal Tracker',
        'appraisal-results': 'Appraisal Results',
        'appraisal-analytics': 'Appraisal Analytics'
    },

    // Employee dropdown options
    genders: ['Male', 'Female'],
    maritalStatuses: ['Single', 'Married', 'Divorced', 'Widowed'],
    academicDegrees: ['High School', 'Diploma', 'Bachelor (BA/BS)', 'Master (MA/MS)', 'Doctorate (PhD)', 'Other'],
    armyStatuses: ['Completed', 'Exempted', 'Postponed', 'Not Applicable'],
    contractClassifications: ['Defined Period', 'Undefined Period'],
    contractDurations: ['1 Year', '2 Years', '3 Years'],
    contractTypes: ['Full-time', 'Part-time', 'Full-time Remote', 'Part-time Remote', 'Intern'],
    probationPeriods: ['90 Days', '180 Days'],
    annualLeaveDays: ['21 Days', '25 Days', '30 Days'],
    salaryTransferMethods: ['Cash', 'Bank Transfer'],
    scheduleTypes: ['Fixed Schedule', 'Variable Schedule'],
    weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Sample employees data (with progress tracking and SLA)
    employees: [
        {
            id: 1,
            employeeNumber: 'EMP-001',
            firstName: 'Ahmed',
            secondName: 'Mohamed',
            familyName: 'Hassan',
            avatar: 'https://i.pravatar.cc/40?img=11',
            email: 'ahmed.hassan@company.com',
            mobile: '+20 100 123 4567',
            nationality: 'Egyptian',
            nationalityCode: 'eg',
            entity: 'Direct',
            countryOfWork: 'Egypt',
            department: 'Engineering',
            section: 'Software Development',
            mainGrade: 'Professional',
            subGrade: 'Senior',
            jobTitle: 'Senior Software Engineer',
            status: 'Active',
            dateOfHiring: '15/01/2023',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '10/01/2023'
        },
        {
            id: 2,
            employeeNumber: 'EMP-002',
            firstName: 'Sara',
            secondName: 'Ali',
            familyName: 'Omar',
            avatar: 'https://i.pravatar.cc/40?img=5',
            email: 'sara.omar@company.com',
            mobile: '+966 50 987 6543',
            nationality: 'Saudi',
            nationalityCode: 'sa',
            entity: 'Direct',
            countryOfWork: 'Saudi Arabia',
            department: 'Human Resources',
            section: 'Recruitment',
            mainGrade: 'Management',
            subGrade: 'Manager',
            jobTitle: 'HR Manager',
            status: 'Active',
            dateOfHiring: '01/03/2022',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '25/02/2022'
        },
        {
            id: 3,
            employeeNumber: 'EMP-003',
            firstName: 'Mohammed',
            secondName: 'Abdullah',
            familyName: 'Al-Rashid',
            avatar: 'https://i.pravatar.cc/40?img=12',
            email: 'mohammed.rashid@company.com',
            mobile: '+971 50 111 2222',
            nationality: 'Emirati',
            nationalityCode: 'ae',
            entity: 'Techtic',
            countryOfWork: 'United Arab Emirates',
            department: 'Finance',
            section: 'Payroll',
            mainGrade: 'Professional',
            subGrade: 'Mid-Level',
            jobTitle: 'Financial Analyst',
            status: 'Active',
            dateOfHiring: '10/06/2023',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '01/06/2023'
        },
        {
            id: 4,
            employeeNumber: 'EMP-004',
            firstName: 'Fatima',
            secondName: 'Khalid',
            familyName: 'Ibrahim',
            avatar: 'https://i.pravatar.cc/40?img=9',
            email: 'fatima.ibrahim@company.com',
            mobile: '+20 101 555 7890',
            nationality: 'Egyptian',
            nationalityCode: 'eg',
            entity: 'Direct',
            countryOfWork: 'Egypt',
            department: 'Engineering',
            section: 'Quality Assurance',
            mainGrade: 'Professional',
            subGrade: 'Mid-Level',
            jobTitle: 'QA Engineer',
            status: 'On Leave',
            dateOfHiring: '20/09/2023',
            contractType: 'Full-time',
            completedSteps: 5,
            totalSteps: 6,
            progress: 83,
            slaStatus: 'pending',
            createdAt: '15/09/2023'
        },
        {
            id: 5,
            employeeNumber: 'EMP-005',
            firstName: 'Yusuf',
            secondName: 'Hassan',
            familyName: 'Ahmed',
            avatar: 'https://i.pravatar.cc/40?img=15',
            email: 'yusuf.ahmed@company.com',
            mobile: '+966 55 333 4444',
            nationality: 'Saudi',
            nationalityCode: 'sa',
            entity: 'Techtic',
            countryOfWork: 'Saudi Arabia',
            department: 'Operations',
            section: null,
            mainGrade: 'Professional',
            subGrade: 'Junior',
            jobTitle: 'Operations Intern',
            status: 'Active',
            dateOfHiring: '01/11/2025',
            contractType: 'Intern',
            completedSteps: 4,
            totalSteps: 6,
            progress: 67,
            slaStatus: 'overdue',
            createdAt: '25/10/2025'
        },
        {
            id: 6,
            employeeNumber: 'EMP-006',
            firstName: 'Khalid',
            secondName: 'Omar',
            familyName: 'Al-Faisal',
            avatar: 'https://i.pravatar.cc/40?img=33',
            email: 'khalid.faisal@company.com',
            mobile: '+966 55 444 5555',
            nationality: 'Saudi',
            nationalityCode: 'sa',
            entity: 'Direct',
            countryOfWork: 'Saudi Arabia',
            department: 'Engineering',
            section: 'Software Development',
            mainGrade: 'Management',
            subGrade: 'Senior Manager',
            jobTitle: 'Engineering Manager',
            status: 'Active',
            dateOfHiring: '15/06/2021',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '10/06/2021'
        },
        {
            id: 7,
            employeeNumber: 'EMP-007',
            firstName: 'Layla',
            secondName: 'Ahmed',
            familyName: 'Mansour',
            avatar: 'https://i.pravatar.cc/40?img=44',
            email: 'layla.mansour@company.com',
            mobile: '+971 50 666 7777',
            nationality: 'Emirati',
            nationalityCode: 'ae',
            entity: 'Techtic',
            countryOfWork: 'United Arab Emirates',
            department: 'Finance',
            section: 'Payroll',
            mainGrade: 'Management',
            subGrade: 'Manager',
            jobTitle: 'Finance Manager',
            status: 'Active',
            dateOfHiring: '01/09/2020',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '25/08/2020'
        },
        {
            id: 8,
            employeeNumber: 'EMP-008',
            firstName: 'Omar',
            secondName: 'Saeed',
            familyName: 'Al-Harbi',
            avatar: 'https://i.pravatar.cc/40?img=52',
            email: 'omar.harbi@company.com',
            mobile: '+966 50 888 9999',
            nationality: 'Saudi',
            nationalityCode: 'sa',
            entity: 'Direct',
            countryOfWork: 'Saudi Arabia',
            department: 'Operations',
            section: null,
            mainGrade: 'Executives',
            subGrade: 'VP',
            jobTitle: 'VP of Operations',
            status: 'Active',
            dateOfHiring: '01/01/2019',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '20/12/2018'
        },
        {
            id: 9,
            employeeNumber: 'EMP-009',
            firstName: 'Noura',
            secondName: 'Khalid',
            familyName: 'Al-Dosari',
            avatar: 'https://i.pravatar.cc/40?img=47',
            email: 'noura.dosari@company.com',
            mobile: '+966 55 111 2222',
            nationality: 'Saudi',
            nationalityCode: 'sa',
            entity: 'Direct',
            countryOfWork: 'Saudi Arabia',
            department: 'Human Resources',
            section: 'Recruitment',
            mainGrade: 'Executives',
            subGrade: 'Director',
            jobTitle: 'HR Director',
            status: 'Active',
            dateOfHiring: '15/03/2018',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '01/03/2018'
        },
        {
            id: 10,
            employeeNumber: 'EMP-010',
            firstName: 'Tariq',
            secondName: 'Abdullah',
            familyName: 'Al-Mutairi',
            avatar: 'https://i.pravatar.cc/40?img=60',
            email: 'tariq.mutairi@company.com',
            mobile: '+966 50 333 4444',
            nationality: 'Saudi',
            nationalityCode: 'sa',
            entity: 'Direct',
            countryOfWork: 'Saudi Arabia',
            department: 'Engineering',
            section: 'Software Development',
            mainGrade: 'Executives',
            subGrade: 'C-Level',
            jobTitle: 'CTO',
            status: 'Active',
            dateOfHiring: '01/06/2017',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '15/05/2017'
        },
        {
            id: 11,
            employeeNumber: 'EMP-011',
            firstName: 'Rania',
            secondName: 'Faisal',
            familyName: 'Al-Qahtani',
            avatar: 'https://i.pravatar.cc/40?img=23',
            email: 'rania.qahtani@company.com',
            mobile: '+966 55 555 6666',
            nationality: 'Saudi',
            nationalityCode: 'sa',
            entity: 'Direct',
            countryOfWork: 'Saudi Arabia',
            department: 'Finance',
            section: 'Payroll',
            mainGrade: 'Management',
            subGrade: 'Director',
            jobTitle: 'Finance Director',
            status: 'Active',
            dateOfHiring: '01/02/2019',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '15/01/2019'
        },
        {
            id: 12,
            employeeNumber: 'EMP-012',
            firstName: 'Hassan',
            secondName: 'Mohammed',
            familyName: 'Al-Shammari',
            avatar: 'https://i.pravatar.cc/40?img=68',
            email: 'hassan.shammari@company.com',
            mobile: '+966 50 777 8888',
            nationality: 'Saudi',
            nationalityCode: 'sa',
            entity: 'Techtic',
            countryOfWork: 'Saudi Arabia',
            department: 'Operations',
            section: null,
            mainGrade: 'Management',
            subGrade: 'Senior Manager',
            jobTitle: 'Operations Manager',
            status: 'Active',
            dateOfHiring: '10/08/2020',
            contractType: 'Full-time',
            completedSteps: 6,
            totalSteps: 6,
            progress: 100,
            slaStatus: 'completed',
            createdAt: '01/08/2020'
        },
    ],

    // Draft employees (incomplete submissions)
    employeeDrafts: [],

    // ========== SHIFT & ATTENDANCE DATA ==========

    // Shift Templates
    shiftTemplates: [
        {
            id: 1,
            name: 'Morning Shift',
            nameAr: 'الوردية الصباحية',
            type: 'Fixed',
            startTime: '08:00',
            endTime: '16:00',
            breakDuration: 60, // minutes
            color: '#22c55e',
            workingHours: 8,
            active: true
        },
        {
            id: 2,
            name: 'Evening Shift',
            nameAr: 'الوردية المسائية',
            type: 'Fixed',
            startTime: '16:00',
            endTime: '00:00',
            breakDuration: 60,
            color: '#3b82f6',
            workingHours: 8,
            active: true
        },
        {
            id: 3,
            name: 'Night Shift',
            nameAr: 'الوردية الليلية',
            type: 'Fixed',
            startTime: '00:00',
            endTime: '08:00',
            breakDuration: 60,
            color: '#8b5cf6',
            workingHours: 8,
            active: true
        },
        {
            id: 4,
            name: '12-Hour Day Shift',
            nameAr: 'وردية 12 ساعة نهارية',
            type: 'Fixed',
            startTime: '06:00',
            endTime: '18:00',
            breakDuration: 60,
            color: '#f59e0b',
            workingHours: 12,
            active: true
        },
        {
            id: 5,
            name: '12-Hour Night Shift',
            nameAr: 'وردية 12 ساعة ليلية',
            type: 'Fixed',
            startTime: '18:00',
            endTime: '06:00',
            breakDuration: 60,
            color: '#ec4899',
            workingHours: 12,
            active: true
        },
        {
            id: 6,
            name: 'Flexible Hours',
            nameAr: 'ساعات مرنة',
            type: 'Variable',
            startTime: null,
            endTime: null,
            breakDuration: 60,
            color: '#06b6d4',
            workingHours: 8,
            active: true
        }
    ],

    // Employee Schedule Assignments (weekly pattern)
    employeeSchedules: [
        {
            id: 1,
            employeeId: 1,
            employeeName: 'Ahmed Hassan',
            scheduleType: 'Fixed',
            defaultShiftId: 1,
            weekSchedule: {
                Sunday: { shiftId: 1, isWorking: true },
                Monday: { shiftId: 1, isWorking: true },
                Tuesday: { shiftId: 1, isWorking: true },
                Wednesday: { shiftId: 1, isWorking: true },
                Thursday: { shiftId: 1, isWorking: true },
                Friday: { shiftId: null, isWorking: false, dayType: 'weekend' },
                Saturday: { shiftId: null, isWorking: false, dayType: 'weekend' }
            }
        },
        {
            id: 2,
            employeeId: 2,
            employeeName: 'Sara Omar',
            scheduleType: 'Fixed',
            defaultShiftId: 1,
            weekSchedule: {
                Sunday: { shiftId: 1, isWorking: true },
                Monday: { shiftId: 1, isWorking: true },
                Tuesday: { shiftId: 1, isWorking: true },
                Wednesday: { shiftId: 1, isWorking: true },
                Thursday: { shiftId: 1, isWorking: true },
                Friday: { shiftId: null, isWorking: false, dayType: 'weekend' },
                Saturday: { shiftId: null, isWorking: false, dayType: 'weekend' }
            }
        },
        {
            id: 3,
            employeeId: 3,
            employeeName: 'Mohammed Al-Rashid',
            scheduleType: 'Variable',
            defaultShiftId: 6,
            weekSchedule: {
                Sunday: { shiftId: 6, isWorking: true },
                Monday: { shiftId: 6, isWorking: true },
                Tuesday: { shiftId: 6, isWorking: true },
                Wednesday: { shiftId: 6, isWorking: true },
                Thursday: { shiftId: 6, isWorking: true },
                Friday: { shiftId: null, isWorking: false, dayType: 'weekend' },
                Saturday: { shiftId: null, isWorking: false, dayType: 'weekend' }
            }
        },
        {
            id: 4,
            employeeId: 4,
            employeeName: 'Fatima Ibrahim',
            scheduleType: 'Fixed',
            defaultShiftId: 4,
            weekSchedule: {
                Sunday: { shiftId: 4, isWorking: true },
                Monday: { shiftId: null, isWorking: false, dayType: 'weekend' },
                Tuesday: { shiftId: 4, isWorking: true },
                Wednesday: { shiftId: null, isWorking: false, dayType: 'weekend' },
                Thursday: { shiftId: 4, isWorking: true },
                Friday: { shiftId: null, isWorking: false, dayType: 'weekend' },
                Saturday: { shiftId: 4, isWorking: true }
            }
        },
        {
            id: 5,
            employeeId: 5,
            employeeName: 'Yusuf Ahmed',
            scheduleType: 'Fixed',
            defaultShiftId: 2,
            weekSchedule: {
                Sunday: { shiftId: 2, isWorking: true },
                Monday: { shiftId: 2, isWorking: true },
                Tuesday: { shiftId: 2, isWorking: true },
                Wednesday: { shiftId: 2, isWorking: true },
                Thursday: { shiftId: 2, isWorking: true },
                Friday: { shiftId: null, isWorking: false, dayType: 'weekend' },
                Saturday: { shiftId: null, isWorking: false, dayType: 'weekend' }
            }
        }
    ],

    // Attendance Records (sample data for current week)
    attendanceRecords: [
        {
            id: 1,
            employeeId: 1,
            date: '2026-01-11',
            shiftId: 1,
            scheduledStart: '08:00',
            scheduledEnd: '16:00',
            actualCheckIn: '07:55',
            actualCheckOut: '16:05',
            status: 'Present',
            workingHours: 8.17,
            overtime: 0,
            notes: ''
        },
        {
            id: 2,
            employeeId: 1,
            date: '2026-01-12',
            shiftId: 1,
            scheduledStart: '08:00',
            scheduledEnd: '16:00',
            actualCheckIn: '08:15',
            actualCheckOut: '16:00',
            status: 'Late',
            workingHours: 7.75,
            overtime: 0,
            notes: 'Traffic delay'
        },
        {
            id: 3,
            employeeId: 2,
            date: '2026-01-11',
            shiftId: 1,
            scheduledStart: '08:00',
            scheduledEnd: '16:00',
            actualCheckIn: '08:00',
            actualCheckOut: '16:30',
            status: 'Present',
            workingHours: 8.5,
            overtime: 0.5,
            notes: ''
        },
        {
            id: 4,
            employeeId: 3,
            date: '2026-01-11',
            shiftId: 6,
            scheduledStart: null,
            scheduledEnd: null,
            actualCheckIn: '09:30',
            actualCheckOut: '18:00',
            status: 'Present',
            workingHours: 8.5,
            overtime: 0,
            notes: 'Flexible schedule'
        },
        {
            id: 5,
            employeeId: 4,
            date: '2026-01-11',
            shiftId: 4,
            scheduledStart: '06:00',
            scheduledEnd: '18:00',
            actualCheckIn: null,
            actualCheckOut: null,
            status: 'Absent',
            workingHours: 0,
            overtime: 0,
            notes: 'On Leave'
        },
        {
            id: 6,
            employeeId: 5,
            date: '2026-01-11',
            shiftId: 2,
            scheduledStart: '16:00',
            scheduledEnd: '00:00',
            actualCheckIn: '16:00',
            actualCheckOut: '00:00',
            status: 'Present',
            workingHours: 8,
            overtime: 0,
            notes: ''
        },
        {
            id: 7,
            employeeId: 1,
            date: '2026-01-13',
            shiftId: 1,
            scheduledStart: '08:00',
            scheduledEnd: '16:00',
            actualCheckIn: '07:58',
            actualCheckOut: null,
            status: 'Checked In',
            workingHours: 0,
            overtime: 0,
            notes: 'Currently working'
        }
    ],

    // Attendance Status Options
    attendanceStatuses: ['Present', 'Absent', 'Late', 'Early Leave', 'Checked In', 'Day Off', 'Public Holiday', 'Work From Home', 'Business Trip'],

    // Day Types
    dayTypes: ['Working', 'Weekend', 'Public Holiday', 'Day Off', 'Leave'],

    // ========== PAYROLL DATA ==========

    // Payroll Regions/Entities
    payrollRegions: [
        { id: 1, name: 'Saudi Arabia', code: 'sa', currency: 'SAR', flag: 'https://flagcdn.com/w40/sa.png' },
        { id: 2, name: 'Pakistan', code: 'pk', currency: 'SAR', flag: 'https://flagcdn.com/w40/pk.png' },
        { id: 3, name: 'Indonesia', code: 'id', currency: 'SAR', flag: 'https://flagcdn.com/w40/id.png' },
        { id: 4, name: 'Egypt', code: 'eg', currency: 'SAR', flag: 'https://flagcdn.com/w40/eg.png' }
    ],

    // Payroll Cost Centers (for grouping)
    payrollCostCenters: [
        { id: 1, name: 'Engineering', color: '#8b5cf6' },
        { id: 2, name: 'Sales', color: '#3b82f6' },
        { id: 3, name: 'Operations', color: '#22c55e' },
        { id: 4, name: 'Marketing', color: '#ec4899' },
        { id: 5, name: 'Finance', color: '#f59e0b' },
        { id: 6, name: 'HR', color: '#06b6d4' }
    ],

    // Payroll Cycles
    payrollCycles: [
        {
            id: 1,
            month: 'January',
            year: 2026,
            status: 'in_progress',
            currentStep: 2,
            entities: 4,
            headcount: 870,
            subCycles: 4,
            totalNetValue: 2880000.00,
            totalGross: 3200000.00,
            totalCommissions: 85000.00,
            totalArrearsAdd: 12000.00,
            totalArrearsDed: 5000.00,
            totalGosi: 45000.00,
            createdAt: '2026-01-01',
            createdBy: 'John Doe'
        },
        {
            id: 2,
            month: 'February',
            year: 2026,
            status: 'new',
            currentStep: 1,
            entities: 4,
            headcount: 265,
            subCycles: 0,
            totalNetValue: 0,
            totalGross: 0,
            totalCommissions: 0,
            totalArrearsAdd: 0,
            totalArrearsDed: 0,
            totalGosi: 0,
            createdAt: '2026-02-01',
            createdBy: 'System'
        },
        {
            id: 3,
            month: 'May',
            year: 2025,
            status: 'closed',
            currentStep: 7,
            entities: 4,
            headcount: 390,
            subCycles: 4,
            totalNetValue: 2230000.00,
            totalGross: 2490000.00,
            totalCommissions: 63000.00,
            totalArrearsAdd: 5000.00,
            totalArrearsDed: 15500.00,
            totalGosi: 7500.00,
            totalArrearsAddAmount: 15500.00,
            closedAt: '2025-05-31',
            closedBy: 'Sarah Finance',
            createdAt: '2025-05-01',
            createdBy: 'John Doe'
        },
        {
            id: 4,
            month: 'January',
            year: 2025,
            status: 'closed',
            currentStep: 7,
            entities: 4,
            headcount: 365,
            subCycles: 4,
            totalNetValue: 2915000.00,
            totalGross: 3225000.00,
            totalCommissions: 90000.00,
            totalArrearsAdd: 20000.00,
            totalArrearsDed: 8500.00,
            totalGosi: 27500.00,
            closedAt: '2025-01-31',
            closedBy: 'John Doe',
            createdAt: '2025-01-01',
            createdBy: 'System'
        }
    ],

    // Payroll Sub-Cycles (Regional breakdown)
    payrollSubCycles: [
        // January 2026 - In Progress
        { id: 1, cycleId: 1, regionId: 1, costCenterId: 1, requestId: 'ARQ-001', headcount: 330, netSalary: 1500000.00, currentStage: 'variables' },
        { id: 2, cycleId: 1, regionId: 2, costCenterId: 2, requestId: 'ARQ-002', headcount: 150, netSalary: 280000.00, currentStage: 'variables' },
        { id: 3, cycleId: 1, regionId: 3, costCenterId: 3, requestId: 'ARQ-003', headcount: 200, netSalary: 650000.00, currentStage: 'variables' },
        { id: 4, cycleId: 1, regionId: 4, costCenterId: 1, requestId: 'ARQ-004', headcount: 200, netSalary: 450000.00, currentStage: 'variables' },
        
        // February 2026 - New
        { id: 5, cycleId: 2, regionId: 1, costCenterId: 2, requestId: 'ARQ-005', headcount: 120, netSalary: 0, currentStage: 'initialization' },
        { id: 6, cycleId: 2, regionId: 2, costCenterId: 1, requestId: 'ARQ-006', headcount: 95, netSalary: 0, currentStage: 'initialization' },
        { id: 7, cycleId: 2, regionId: 3, costCenterId: 4, requestId: 'ARQ-007', headcount: 45, netSalary: 0, currentStage: 'initialization' },
        { id: 8, cycleId: 2, regionId: 4, costCenterId: 5, requestId: 'ARQ-008', headcount: 5, netSalary: 0, currentStage: 'initialization' },
        
        // May 2025 - Closed
        { id: 9, cycleId: 3, regionId: 1, costCenterId: 1, requestId: 'ARQ-009', headcount: 290, netSalary: 1795000.00, grossSalary: 1985000.00, commissions: 45000.00, arrearsAdd: 2500.00, arrearsDed: 7500.00, gosi: 3750.00, currentStage: 'archived' },
        { id: 10, cycleId: 3, regionId: 2, costCenterId: 2, requestId: 'ARQ-010', headcount: 60, netSalary: 269000.00, grossSalary: 305000.00, commissions: 12000.00, arrearsAdd: 1500.00, arrearsDed: 4000.00, gosi: 1850.00, currentStage: 'archived' },
        { id: 11, cycleId: 3, regionId: 3, costCenterId: 4, requestId: 'ARQ-011', headcount: 20, netSalary: 86000.00, grossSalary: 98000.00, commissions: 3500.00, arrearsAdd: 500.00, arrearsDed: 2000.00, gosi: 980.00, currentStage: 'archived' },
        { id: 12, cycleId: 3, regionId: 4, costCenterId: 2, requestId: 'ARQ-012', headcount: 20, netSalary: 80000.00, grossSalary: 102000.00, commissions: 2500.00, arrearsAdd: 500.00, arrearsDed: 2000.00, gosi: 920.00, currentStage: 'archived' },
        
        // January 2025 - Closed
        { id: 13, cycleId: 4, regionId: 1, costCenterId: 3, requestId: 'ARQ-013', headcount: 210, netSalary: 1775000.00, grossSalary: 1920000.00, commissions: 52000.00, arrearsAdd: 9000.00, arrearsDed: 5500.00, gosi: 18000.00, currentStage: 'archived' },
        { id: 14, cycleId: 4, regionId: 2, costCenterId: 2, requestId: 'ARQ-014', headcount: 90, netSalary: 615000.00, grossSalary: 698000.00, commissions: 18000.00, arrearsAdd: 5000.00, arrearsDed: 1000.00, gosi: 5200.00, currentStage: 'archived' },
        { id: 15, cycleId: 4, regionId: 3, costCenterId: 1, requestId: 'ARQ-015', headcount: 65, netSalary: 345000.00, grossSalary: 395000.00, commissions: 15000.00, arrearsAdd: 4000.00, arrearsDed: 1500.00, gosi: 2800.00, currentStage: 'archived' },
        { id: 16, cycleId: 4, regionId: 4, costCenterId: 2, requestId: 'ARQ-016', headcount: 0, netSalary: 180000.00, grossSalary: 212000.00, commissions: 5000.00, arrearsAdd: 2000.00, arrearsDed: 500.00, gosi: 1500.00, currentStage: 'archived' }
    ],

    // Payroll Employees (for variable pay management)
    payrollEmployees: [
        {
            id: 1,
            employeeId: 'E001',
            name: 'Ahmed Al-Saud',
            department: 'Engineering',
            costCenterId: 1,
            status: 'Active',
            basicSalary: 15000.00,
            accommodationAllowance: 4000.00,
            transportationAllowance: 1000.00,
            commission: 0,
            grossPay: 20000.00,
            arrearsAddition: 0,
            arrearsDeduction: 0,
            gosiEmployee: 1950.00,
            gosiCompany: 2350.00,
            netAdditions: 0,
            netDeductions: 0,
            netPay: 18100.00,
            previousNetPay: 20000.00,
            isExempt: false,
            isHeld: false,
            isStopped: false
        },
        {
            id: 2,
            employeeId: 'E002',
            name: 'Sara Mohamed',
            department: 'Sales',
            costCenterId: 2,
            status: 'On Leave',
            basicSalary: 12000.00,
            accommodationAllowance: 3000.00,
            transportationAllowance: 800.00,
            commission: 0,
            grossPay: 15800.00,
            arrearsAddition: 0,
            arrearsDeduction: 0,
            gosiEmployee: 1540.00,
            gosiCompany: 1857.00,
            netAdditions: 0,
            netDeductions: 0,
            netPay: 14300.00,
            previousNetPay: 15000.00,
            isExempt: false,
            isHeld: false,
            isStopped: false
        },
        {
            id: 3,
            employeeId: 'E003',
            name: 'John Doe',
            department: 'Sales',
            costCenterId: 2,
            status: 'Probation',
            basicSalary: 11000.00,
            accommodationAllowance: 0,
            transportationAllowance: 0,
            commission: 0,
            grossPay: 11000.00,
            arrearsAddition: 0,
            arrearsDeduction: 0,
            gosiEmployee: 0,
            gosiCompany: 0,
            netAdditions: 0,
            netDeductions: 0,
            netPay: 11000.00,
            previousNetPay: 11000.00,
            isExempt: true,
            isHeld: false,
            isStopped: false
        },
        {
            id: 4,
            employeeId: 'E401',
            name: 'Khalid Ibrahim',
            department: 'Operations',
            costCenterId: 3,
            status: 'Active',
            basicSalary: 13000.00,
            accommodationAllowance: 3500.00,
            transportationAllowance: 900.00,
            commission: 0,
            grossPay: 17400.00,
            arrearsAddition: 0,
            arrearsDeduction: 0,
            gosiEmployee: 1696.50,
            gosiCompany: 2044.50,
            netAdditions: 0,
            netDeductions: 0,
            netPay: 15750.00,
            previousNetPay: 15000.00,
            isExempt: false,
            isHeld: false,
            isStopped: false
        },
        {
            id: 5,
            employeeId: 'E402',
            name: 'Mona Zein',
            department: 'Finance',
            costCenterId: 5,
            status: 'Active',
            basicSalary: 14000.00,
            accommodationAllowance: 3800.00,
            transportationAllowance: 950.00,
            commission: 0,
            grossPay: 18750.00,
            arrearsAddition: 0,
            arrearsDeduction: 0,
            gosiEmployee: 1827.00,
            gosiCompany: 2202.00,
            netAdditions: 0,
            netDeductions: 0,
            netPay: 16970.00,
            previousNetPay: 15000.00,
            isExempt: false,
            isHeld: false,
            isStopped: false
        }
    ],

    // Payroll Action Log
    payrollActionLog: [
        { id: 1, cycleId: 3, action: 'Payroll Cycle Initialized', user: 'John Doe', timestamp: '2025-02-24 08:15' },
        { id: 2, cycleId: 3, action: 'Variable Pay Overrides Uploaded', user: 'John Doe', timestamp: '2025-02-24 11:30' },
        { id: 3, cycleId: 3, action: 'Payroll Batch Approved', user: 'Sarah Finance', timestamp: '2025-02-25 14:20' },
        { id: 4, cycleId: 3, action: 'Bank WPS File Generated', user: 'System', timestamp: '2025-02-25 16:00' },
        { id: 5, cycleId: 3, action: 'Cycle Locked & Archived', user: 'John Doe', timestamp: '2025-02-25 16:45' }
    ],

    // Payroll Wizard Steps
    payrollWizardSteps: [
        { id: 1, name: 'Initialization', icon: 'pi-bolt' },
        { id: 2, name: 'Variables', icon: 'pi-clock' },
        { id: 3, name: 'Review', icon: 'pi-file' },
        { id: 4, name: 'Approve', icon: 'pi-check-circle' },
        { id: 5, name: 'Pay', icon: 'pi-dollar' },
        { id: 6, name: 'Closing', icon: 'pi-folder' },
        { id: 7, name: 'Archived', icon: 'pi-lock' }
    ],

    // Strategic Comparison Stats (for dashboard)
    payrollStats: {
        jan2025: {
            totalNetDisbursement: 2915000.00,
            totalGrossLiability: 3230000.00,
            globalHeadcount: 595,
            totalCommissions: 90000.00
        },
        may2025: {
            totalNetDisbursement: 2230000.00,
            totalGrossLiability: 2450000.00,
            globalHeadcount: 390,
            totalCommissions: 63000.00
        }
    },

    // Department allocation data for chart
    departmentAllocation: [
        { name: 'Engineering', value: 45 },
        { name: 'Marketing', value: 20 },
        { name: 'Sales', value: 15 },
        { name: 'Finance', value: 8 },
        { name: 'Operations', value: 7 },
        { name: 'HR', value: 5 }
    ],

    // Regional split data
    regionalSplit: [
        { name: 'Saudi Arabia', value: 55, color: '#06b6d4' },
        { name: 'Egypt', value: 20, color: '#ef4444' },
        { name: 'Indonesia', value: 15, color: '#3b82f6' },
        { name: 'Pakistan', value: 10, color: '#22c55e' }
    ],

    // ========== ORDERS/REQUESTS MODULE DATA ==========

    // Request Categories
    requestCategories: [
        { id: 1, name: 'Leaves', description: 'All leave-related requests', icon: 'pi-calendar', color: '#22c55e', active: true },
        { id: 2, name: 'Business Trip', description: 'Business travel requests', icon: 'pi-briefcase', color: '#3b82f6', active: true },
        { id: 3, name: 'Attendance & Time Adjustment', description: 'WFH, permissions, punch corrections', icon: 'pi-clock', color: '#8b5cf6', active: true },
        { id: 4, name: 'Letters', description: 'Experience letters, salary letters', icon: 'pi-file', color: '#f59e0b', active: true },
        { id: 5, name: 'Others', description: 'General requests, resignation, feedback', icon: 'pi-inbox', color: '#64748b', active: true }
    ],

    // Form Field Types (for dynamic form builder)
    formFieldTypes: [
        { id: 'text', name: 'Text Field', icon: 'pi-pencil' },
        { id: 'textarea', name: 'Text Area', icon: 'pi-align-left' },
        { id: 'number', name: 'Number', icon: 'pi-sort-numeric-up' },
        { id: 'date', name: 'Date Picker', icon: 'pi-calendar' },
        { id: 'daterange', name: 'Date Range (From - To)', icon: 'pi-calendar-plus' },
        { id: 'time', name: 'Time Picker', icon: 'pi-clock' },
        { id: 'dropdown', name: 'Dropdown Select', icon: 'pi-chevron-down' },
        { id: 'file', name: 'File Upload', icon: 'pi-upload' },
        { id: 'checkbox', name: 'Checkbox', icon: 'pi-check-square' }
    ],

    // Repetition/Calculation Options
    repetitionOptions: [
        { id: 'yearly', name: 'Yearly' },
        { id: 'monthly', name: 'Monthly' },
        { id: 'one_time', name: 'One Time' },
        { id: 'unlimited', name: 'Unlimited' }
    ],

    // Balance Calculation Methods
    balanceMethodOptions: [
        { id: 'calendar_days', name: 'Calendar Days' },
        { id: 'working_days', name: 'Working Days' }
    ],

    // Line Manager Levels
    lineManagerLevels: [
        { id: 1, name: 'Level 1' },
        { id: 2, name: 'Level 2' },
        { id: 3, name: 'Level 3' },
        { id: 4, name: 'All Line Managers' }
    ],

    // Request Types
    requestTypes: [
        {
            id: 1,
            categoryId: 1,
            name: 'Annual Leave',
            description: 'Standard annual leave request',
            policyNote: 'Annual leave must be requested at least 7 days in advance. Requests are subject to manager approval based on team availability. Unused leave days may be carried forward according to company policy.',
            repetition: 'yearly',
            balanceSource: 'system', // 'system' = from employee settings, 'fixed' = fixed days
            balanceDays: null,
            balanceMethod: 'working_days',
            formFields: [
                { id: 'f1', type: 'daterange', label: 'Leave Period', required: true, order: 1 }
            ],
            approvalFlow: {
                lineManagerLevel: 1,
                requireHrAdmin: true,
                requireHrManager: false,
                conditionEnabled: true,
                conditionDays: 5,
                conditionLineManagerLevel: 2,
                conditionRequireHrAdmin: true,
                conditionRequireHrManager: false
            },
            active: true
        },
        {
            id: 2,
            categoryId: 1,
            name: 'Sick Leave',
            description: 'Medical sick leave with attachment',
            policyNote: 'A medical certificate is required for sick leave exceeding 2 consecutive days. Please submit the medical report within 48 hours of returning to work.',
            repetition: 'yearly',
            balanceSource: 'fixed',
            balanceDays: 120,
            balanceMethod: 'calendar_days',
            formFields: [
                { id: 'f1', type: 'daterange', label: 'Leave Period', required: true, order: 1 },
                { id: 'f2', type: 'file', label: 'Medical Report', required: true, order: 2 }
            ],
            approvalFlow: {
                lineManagerLevel: 2,
                requireHrAdmin: false,
                requireHrManager: false,
                conditionEnabled: false,
                conditionDays: null,
                conditionLineManagerLevel: null,
                conditionRequireHrAdmin: false,
                conditionRequireHrManager: false
            },
            active: true
        },
        {
            id: 3,
            categoryId: 1,
            name: 'Marriage Leave',
            description: 'One-time marriage leave',
            policyNote: 'Marriage leave is a one-time benefit. Please submit the marriage certificate within 30 days of the marriage date.',
            repetition: 'one_time',
            balanceSource: 'fixed',
            balanceDays: 5,
            balanceMethod: 'working_days',
            formFields: [
                { id: 'f1', type: 'daterange', label: 'Leave Period', required: true, order: 1 },
                { id: 'f2', type: 'file', label: 'Marriage Certificate', required: true, order: 2 }
            ],
            approvalFlow: {
                lineManagerLevel: 2,
                requireHrAdmin: false,
                requireHrManager: false,
                conditionEnabled: false,
                conditionDays: null,
                conditionLineManagerLevel: null,
                conditionRequireHrAdmin: false,
                conditionRequireHrManager: false
            },
            active: true
        },
        {
            id: 4,
            categoryId: 2,
            name: 'Business Trip',
            description: 'Business travel request',
            policyNote: 'Business trip requests must be submitted at least 5 working days in advance. All expenses must be documented and submitted within 7 days of return.',
            repetition: 'yearly',
            balanceSource: 'fixed',
            balanceDays: 30,
            balanceMethod: 'working_days',
            formFields: [
                { id: 'f1', type: 'daterange', label: 'Trip Period', required: true, order: 1 },
                { id: 'f2', type: 'text', label: 'Destination', required: true, order: 2 },
                { id: 'f3', type: 'textarea', label: 'Purpose', required: true, order: 3 }
            ],
            approvalFlow: {
                lineManagerLevel: 2,
                requireHrAdmin: false,
                requireHrManager: false,
                conditionEnabled: false,
                conditionDays: null,
                conditionLineManagerLevel: null,
                conditionRequireHrAdmin: false,
                conditionRequireHrManager: false
            },
            active: true
        },
        {
            id: 5,
            categoryId: 3,
            name: 'Work From Home',
            description: 'Remote work request',
            policyNote: 'Work from home requests require manager approval. Ensure you have a stable internet connection and are available during core working hours.',
            repetition: 'yearly',
            balanceSource: 'system',
            balanceDays: null,
            balanceMethod: 'working_days',
            formFields: [
                { id: 'f1', type: 'daterange', label: 'WFH Period', required: true, order: 1 },
                { id: 'f2', type: 'textarea', label: 'Reason', required: false, order: 2 }
            ],
            approvalFlow: {
                lineManagerLevel: 2,
                requireHrAdmin: false,
                requireHrManager: false,
                conditionEnabled: false,
                conditionDays: null,
                conditionLineManagerLevel: null,
                conditionRequireHrAdmin: false,
                conditionRequireHrManager: false
            },
            active: true
        },
        {
            id: 6,
            categoryId: 3,
            name: 'Permission Request',
            description: 'Early out, late check-in, or during work permission',
            policyNote: 'Permission requests are limited to 8 hours per month. Exceeding this limit may require HR approval.',
            repetition: 'monthly',
            balanceSource: 'fixed',
            balanceDays: null,
            balanceHours: 8,
            balanceMethod: 'working_days',
            formFields: [
                { id: 'f1', type: 'date', label: 'Date', required: true, order: 1 },
                { id: 'f2', type: 'dropdown', label: 'Permission Type', required: true, order: 2, options: ['Early Out', 'Late Check-in', 'During Work'] },
                { id: 'f3', type: 'dropdown', label: 'Hours', required: true, order: 3, options: ['1', '2', '3', '4'] }
            ],
            approvalFlow: {
                lineManagerLevel: 2,
                requireHrAdmin: false,
                requireHrManager: false,
                conditionEnabled: false,
                conditionDays: null,
                conditionLineManagerLevel: null,
                conditionRequireHrAdmin: false,
                conditionRequireHrManager: false
            },
            active: true
        },
        {
            id: 7,
            categoryId: 4,
            name: 'Experience Letter',
            description: 'Request for experience certificate',
            policyNote: 'Experience letters are typically processed within 3-5 working days. Please collect from HR department.',
            repetition: 'unlimited',
            balanceSource: null,
            balanceDays: null,
            balanceMethod: null,
            formFields: [
                { id: 'f1', type: 'text', label: 'Addressed To', required: true, order: 1 }
            ],
            approvalFlow: {
                lineManagerLevel: null,
                requireHrAdmin: true,
                requireHrManager: false,
                conditionEnabled: false,
                conditionDays: null,
                conditionLineManagerLevel: null,
                conditionRequireHrAdmin: false,
                conditionRequireHrManager: false
            },
            active: true
        },
        {
            id: 8,
            categoryId: 5,
            name: 'Resignation',
            description: 'Resignation submission',
            policyNote: 'A 30-day notice period is required as per company policy. Please ensure proper handover of responsibilities.',
            repetition: 'unlimited',
            balanceSource: null,
            balanceDays: null,
            balanceMethod: null,
            formFields: [
                { id: 'f1', type: 'textarea', label: 'Reason', required: true, order: 1 },
                { id: 'f2', type: 'date', label: 'Last Working Day', required: true, order: 2 }
            ],
            approvalFlow: {
                lineManagerLevel: 2,
                requireHrAdmin: true,
                requireHrManager: true,
                conditionEnabled: false,
                conditionDays: null,
                conditionLineManagerLevel: null,
                conditionRequireHrAdmin: false,
                conditionRequireHrManager: false
            },
            active: true
        }
    ],

    // Page title for orders
    ordersPageTitle: 'Orders & Requests Settings',

    // ========== APPRAISAL MODULE DATA ==========

    // Appraisal Cycles (evaluation periods)
    appraisalCycles: [
        { id: 1, name: 'April 2024 - April 2025', startDate: '01/04/2024', endDate: '31/03/2025', type: 'ANNUAL REVIEW', active: true },
        { id: 2, name: 'April 2025 - April 2026', startDate: '01/04/2025', endDate: '31/03/2026', type: 'ANNUAL REVIEW', active: true },
        { id: 3, name: 'April 2026 - April 2027', startDate: '01/04/2026', endDate: '31/03/2027', type: 'ANNUAL REVIEW', active: true },
        { id: 4, name: 'April 2027 - April 2028', startDate: '01/04/2027', endDate: '31/03/2028', type: 'ANNUAL REVIEW', active: true },
        { id: 5, name: 'April 2028 - April 2029', startDate: '01/04/2028', endDate: '31/03/2029', type: 'ANNUAL REVIEW', active: true }
    ],

    // KPI Weight Distribution Matrix per Grade Band
    kpiWeightMatrix: {
        'Professional': { corporateObjectives: 5, personalKpis: 60, competency: 35 },
        'Supervisor': { corporateObjectives: 10, personalKpis: 70, competency: 20 },
        'Management': { corporateObjectives: 15, personalKpis: 70, competency: 15 },
        'Leadership': { corporateObjectives: 40, personalKpis: 50, competency: 10 }
    },

    // Appraisal Batches (submitted appraisal packages)
    appraisalBatches: [],

    // Appraisal Assignments (individual employee appraisals)
    appraisalAssignments: [
        {
            id: 1,
            employeeId: 1,
            employeeName: 'Ahmed Hassan',
            employeeNumber: 'EMP-001',
            employeeAvatar: 'https://i.pravatar.cc/40?img=11',
            department: 'Engineering',
            section: 'Software Development',
            cycleName: 'April 2025 - April 2026',
            cycleId: 2,
            gradeName: 'Professional',
            weights: { corporateObjectives: 5, personalKpis: 60, competency: 35 },
            reviewers: [
                { id: 6, name: 'Khalid Al-Faisal', role: 'Engineering Manager' },
                { id: 10, name: 'Tariq Al-Mutairi', role: 'CTO' }
            ],
            kpiFile: 'HR_Core_Appraisal_FY25.xlsx',
            status: 'assigned', // assigned, self_evaluation, committee_evaluation, completed
            selfEvaluation: null,
            committeeEvaluation: null,
            createdAt: '01/04/2025',
            notificationSentAt: '01/04/2025'
        },
        {
            id: 2,
            employeeId: 3,
            employeeName: 'Mohammed Al-Rashid',
            employeeNumber: 'EMP-003',
            employeeAvatar: 'https://i.pravatar.cc/40?img=12',
            department: 'Finance',
            section: 'Payroll',
            cycleName: 'April 2025 - April 2026',
            cycleId: 2,
            gradeName: 'Professional',
            weights: { corporateObjectives: 5, personalKpis: 60, competency: 35 },
            reviewers: [
                { id: 7, name: 'Layla Mansour', role: 'Finance Manager' },
                { id: 11, name: 'Rania Al-Qahtani', role: 'Finance Director' }
            ],
            kpiFile: 'Finance_KPIs_FY25.xlsx',
            status: 'self_evaluation',
            selfEvaluation: {
                corporateScore: 4,
                corporateMax: 5,
                personalScore: 45,
                personalMax: 60,
                competencyScore: 25,
                competencyMax: 35,
                totalScore: 74,
                evidence: '2025-11-13_13-11.PNG',
                justification: 'Completed all quarterly targets ahead of schedule. Led the payroll automation project.',
                submittedAt: null
            },
            committeeEvaluation: null,
            createdAt: '01/04/2025',
            notificationSentAt: '01/04/2025'
        },
        {
            id: 3,
            employeeId: 4,
            employeeName: 'Fatima Ibrahim',
            employeeNumber: 'EMP-004',
            employeeAvatar: 'https://i.pravatar.cc/40?img=9',
            department: 'Engineering',
            section: 'Quality Assurance',
            cycleName: 'April 2025 - April 2026',
            cycleId: 2,
            gradeName: 'Professional',
            weights: { corporateObjectives: 5, personalKpis: 60, competency: 35 },
            reviewers: [
                { id: 6, name: 'Khalid Al-Faisal', role: 'Engineering Manager' }
            ],
            kpiFile: 'QA_KPIs_FY25.xlsx',
            status: 'committee_evaluation',
            selfEvaluation: {
                corporateScore: 4,
                corporateMax: 5,
                personalScore: 52,
                personalMax: 60,
                competencyScore: 28,
                competencyMax: 35,
                totalScore: 84,
                evidence: 'QA_evidence_2025.pdf',
                justification: 'Upgraded HQ server infrastructure. 60% complete.',
                submittedAt: '15/05/2025'
            },
            committeeEvaluation: {
                corporateScore: 4,
                corporateMax: 5,
                personalScore: 48,
                personalMax: 60,
                competencyScore: 28,
                competencyMax: 35,
                totalScore: 80,
                feedback: '',
                submittedAt: null
            },
            createdAt: '01/04/2025',
            notificationSentAt: '01/04/2025'
        },
        {
            id: 4,
            employeeId: 5,
            employeeName: 'Yusuf Ahmed',
            employeeNumber: 'EMP-005',
            employeeAvatar: 'https://i.pravatar.cc/40?img=15',
            department: 'Operations',
            section: null,
            cycleName: 'April 2025 - April 2026',
            cycleId: 2,
            gradeName: 'Professional',
            weights: { corporateObjectives: 5, personalKpis: 60, competency: 35 },
            reviewers: [
                { id: 12, name: 'Hassan Al-Shammari', role: 'Operations Manager' },
                { id: 8, name: 'Omar Al-Harbi', role: 'VP of Operations' }
            ],
            kpiFile: 'Ops_KPIs_FY25.xlsx',
            status: 'assigned',
            selfEvaluation: null,
            committeeEvaluation: null,
            createdAt: '01/04/2025',
            notificationSentAt: '01/04/2025'
        }
    ],

    // ========== SUBMITTED REQUESTS DATA ==========

    // Request Statuses
    requestStatuses: [
        { id: 'pending', name: 'Pending', color: '#f59e0b', icon: 'pi-clock' },
        { id: 'in_review', name: 'In Review', color: '#3b82f6', icon: 'pi-eye' },
        { id: 'approved', name: 'Approved', color: '#22c55e', icon: 'pi-check-circle' },
        { id: 'rejected', name: 'Rejected', color: '#ef4444', icon: 'pi-times-circle' },
        { id: 'cancelled', name: 'Cancelled', color: '#64748b', icon: 'pi-ban' }
    ],

    // Sample Submitted Requests
    submittedRequests: [
        {
            id: 'REQ-001',
            categoryId: 1,
            typeId: 1,
            typeName: 'Annual Leave',
            employeeId: 1,
            employeeName: 'Ahmed Hassan',
            employeeAvatar: 'https://i.pravatar.cc/40?img=11',
            department: 'Engineering',
            status: 'pending',
            submittedAt: '2026-01-20T09:00:00',
            formData: {
                'Leave Period': { from: '2026-02-01', to: '2026-02-05' },
                'Duration': '5 working days'
            },
            currentApprover: 'Line Manager',
            approvalFlow: [
                { role: 'Line Manager', level: 1, status: 'pending', assignee: 'Fahad Al-Rashid' },
                { role: 'HR Administrator', level: 2, status: 'waiting', assignee: 'Sara Omar' }
            ],
            actionLog: [
                { action: 'Submitted', user: 'Ahmed Hassan', timestamp: '2026-01-20T09:00:00', comment: null }
            ]
        },
        {
            id: 'REQ-002',
            categoryId: 1,
            typeId: 2,
            typeName: 'Sick Leave',
            employeeId: 2,
            employeeName: 'Sara Omar',
            employeeAvatar: 'https://i.pravatar.cc/40?img=5',
            department: 'Human Resources',
            status: 'approved',
            submittedAt: '2026-01-18T10:30:00',
            formData: {
                'Leave Period': { from: '2026-01-19', to: '2026-01-20' },
                'Duration': '2 calendar days',
                'Medical Report': 'medical_report.pdf'
            },
            currentApprover: null,
            approvalFlow: [
                { role: 'Line Manager', level: 1, status: 'approved', assignee: 'Mohammed Al-Rashid', actionAt: '2026-01-18T11:00:00' },
                { role: 'HR Administrator', level: 2, status: 'approved', assignee: 'Admin User', actionAt: '2026-01-18T14:00:00' }
            ],
            actionLog: [
                { action: 'Submitted', user: 'Sara Omar', timestamp: '2026-01-18T10:30:00', comment: null },
                { action: 'Approved', user: 'Mohammed Al-Rashid', timestamp: '2026-01-18T11:00:00', comment: 'Approved. Get well soon!' },
                { action: 'Approved', user: 'Admin User', timestamp: '2026-01-18T14:00:00', comment: 'Final approval granted.' }
            ]
        },
        {
            id: 'REQ-003',
            categoryId: 1,
            typeId: 1,
            typeName: 'Annual Leave',
            employeeId: 3,
            employeeName: 'Mohammed Al-Rashid',
            employeeAvatar: 'https://i.pravatar.cc/40?img=12',
            department: 'Finance',
            status: 'rejected',
            submittedAt: '2026-01-15T08:00:00',
            formData: {
                'Leave Period': { from: '2026-01-25', to: '2026-02-10' },
                'Duration': '12 working days'
            },
            currentApprover: null,
            approvalFlow: [
                { role: 'Line Manager', level: 1, status: 'approved', assignee: 'Khalid Ibrahim', actionAt: '2026-01-15T10:00:00' },
                { role: 'HR Administrator', level: 2, status: 'rejected', assignee: 'Sara Omar', actionAt: '2026-01-15T15:00:00' }
            ],
            actionLog: [
                { action: 'Submitted', user: 'Mohammed Al-Rashid', timestamp: '2026-01-15T08:00:00', comment: null },
                { action: 'Approved', user: 'Khalid Ibrahim', timestamp: '2026-01-15T10:00:00', comment: 'Approved from my side.' },
                { action: 'Rejected', user: 'Sara Omar', timestamp: '2026-01-15T15:00:00', comment: 'Request exceeds available balance. Please adjust dates.' }
            ]
        },
        {
            id: 'REQ-004',
            categoryId: 2,
            typeId: 4,
            typeName: 'Business Trip',
            employeeId: 1,
            employeeName: 'Ahmed Hassan',
            employeeAvatar: 'https://i.pravatar.cc/40?img=11',
            department: 'Engineering',
            status: 'in_review',
            submittedAt: '2026-01-19T14:00:00',
            formData: {
                'Trip Period': { from: '2026-02-10', to: '2026-02-12' },
                'Duration': '3 working days',
                'Destination': 'Dubai, UAE',
                'Purpose': 'Client meeting and project kickoff'
            },
            currentApprover: 'HR Administrator',
            approvalFlow: [
                { role: 'Line Manager', level: 1, status: 'approved', assignee: 'Fahad Al-Rashid', actionAt: '2026-01-19T16:00:00' },
                { role: 'HR Administrator', level: 2, status: 'pending', assignee: 'Sara Omar' }
            ],
            actionLog: [
                { action: 'Submitted', user: 'Ahmed Hassan', timestamp: '2026-01-19T14:00:00', comment: null },
                { action: 'Approved', user: 'Fahad Al-Rashid', timestamp: '2026-01-19T16:00:00', comment: 'Business need confirmed. Please proceed.' }
            ]
        },
        {
            id: 'REQ-005',
            categoryId: 3,
            typeId: 5,
            typeName: 'Work From Home',
            employeeId: 4,
            employeeName: 'Fatima Ibrahim',
            employeeAvatar: 'https://i.pravatar.cc/40?img=9',
            department: 'Engineering',
            status: 'pending',
            submittedAt: '2026-01-20T11:00:00',
            formData: {
                'WFH Period': { from: '2026-01-22', to: '2026-01-24' },
                'Duration': '3 working days',
                'Reason': 'Home renovation requires supervision'
            },
            currentApprover: 'Line Manager',
            approvalFlow: [
                { role: 'Line Manager', level: 1, status: 'pending', assignee: 'Ahmed Hassan' }
            ],
            actionLog: [
                { action: 'Submitted', user: 'Fatima Ibrahim', timestamp: '2026-01-20T11:00:00', comment: null }
            ]
        },
        {
            id: 'REQ-006',
            categoryId: 4,
            typeId: 7,
            typeName: 'Experience Letter',
            employeeId: 5,
            employeeName: 'Yusuf Ahmed',
            employeeAvatar: 'https://i.pravatar.cc/40?img=15',
            department: 'Operations',
            status: 'approved',
            submittedAt: '2026-01-17T09:00:00',
            formData: {
                'Addressed To': 'To Whom It May Concern'
            },
            currentApprover: null,
            approvalFlow: [
                { role: 'HR Administrator', level: 1, status: 'approved', assignee: 'Sara Omar', actionAt: '2026-01-17T11:00:00' }
            ],
            actionLog: [
                { action: 'Submitted', user: 'Yusuf Ahmed', timestamp: '2026-01-17T09:00:00', comment: null },
                { action: 'Approved', user: 'Sara Omar', timestamp: '2026-01-17T11:00:00', comment: 'Letter will be ready for pickup tomorrow.' }
            ]
        }
    ],

    // Completed Appraisal Results (archived/finalized appraisals)
    appraisalResults: [
        {
            id: 1,
            employeeId: 1,
            employeeName: 'Sarah Ahmed',
            employeeNumber: 'EMP-1024',
            employeeAvatar: 'https://i.pravatar.cc/40?img=5',
            department: 'Engineering',
            cycleName: 'April 2024 - April 2025',
            selfScore: 91,
            finalScore: 92,
            performanceRating: 'EXCELLENT',
            evaluator: 'Director Noura',
            evaluatorRole: 'HR Director',
            gradeName: 'Professional',
            weights: { corporateObjectives: 15, personalKpis: 70, competency: 15 },
            selfEvaluation: { corporateScore: 12, personalScore: 65, competencyScore: 14, justification: 'Exceeded development targets and led the cloud migration.' },
            committeeEvaluation: { corporateScore: 14, personalScore: 63, competencyScore: 15, feedback: 'Outstanding performance and leadership.' },
            actionLog: [
                { date: '01/04/2024', action: 'Appraisal Cycle Started', by: 'System Admin', details: null },
                { date: '15/11/2024', action: 'Self-Appraisal Submitted', by: 'Sarah Ahmed', details: 'Employee completed self-assessment.' },
                { date: '10/12/2024', action: 'Review Meeting Conducted', by: 'Line Manager', details: 'One-on-one performance discussion.' },
                { date: '15/01/2025', action: 'Final Approval Signed', by: 'HR Director', details: 'Score finalized and archived.' }
            ],
            completedAt: '15/01/2025'
        },
        {
            id: 2,
            employeeId: 2,
            employeeName: 'Omar Farooq',
            employeeNumber: 'EMP-1078',
            employeeAvatar: 'https://i.pravatar.cc/40?img=12',
            department: 'Operations',
            cycleName: 'April 2024 - April 2025',
            selfScore: 78,
            finalScore: 74,
            performanceRating: 'EXCELLENT',
            evaluator: 'Ops Manager',
            evaluatorRole: 'Operations Manager',
            gradeName: 'Professional',
            weights: { corporateObjectives: 5, personalKpis: 60, competency: 35 },
            selfEvaluation: { corporateScore: 4, personalScore: 48, competencyScore: 26, justification: 'Consistently met operational targets.' },
            committeeEvaluation: { corporateScore: 4, personalScore: 45, competencyScore: 25, feedback: 'Good performance with room for improvement.' },
            actionLog: [
                { date: '01/04/2024', action: 'Appraisal Cycle Started', by: 'System Admin', details: null },
                { date: '20/11/2024', action: 'Self-Appraisal Submitted', by: 'Omar Farooq', details: 'Employee completed self-assessment.' },
                { date: '05/12/2024', action: 'Review Meeting Conducted', by: 'Line Manager', details: 'Performance review discussion.' },
                { date: '10/01/2025', action: 'Final Approval Signed', by: 'Ops Manager', details: 'Score finalized and archived.' }
            ],
            completedAt: '10/01/2025'
        },
        {
            id: 3,
            employeeId: 3,
            employeeName: 'Mohammed Ali',
            employeeNumber: 'EMP-0098',
            employeeAvatar: 'https://i.pravatar.cc/40?img=8',
            department: 'Finance',
            cycleName: 'April 2024 - April 2025',
            selfScore: 88,
            finalScore: 88,
            performanceRating: 'EXCELLENT',
            evaluator: 'VP Finance',
            evaluatorRole: 'Vice President Finance',
            gradeName: 'Management',
            weights: { corporateObjectives: 15, personalKpis: 70, competency: 15 },
            selfEvaluation: { corporateScore: 13, personalScore: 62, competencyScore: 13, justification: 'Led budget optimization initiatives.' },
            committeeEvaluation: { corporateScore: 13, personalScore: 62, competencyScore: 13, feedback: 'Strong financial leadership.' },
            actionLog: [
                { date: '01/04/2024', action: 'Appraisal Cycle Started', by: 'System Admin', details: null },
                { date: '18/11/2024', action: 'Self-Appraisal Submitted', by: 'Mohammed Ali', details: 'Employee completed self-assessment.' },
                { date: '08/12/2024', action: 'Review Meeting Conducted', by: 'Finance Director', details: 'Annual review meeting.' },
                { date: '12/01/2025', action: 'Final Approval Signed', by: 'VP Finance', details: 'Score finalized and archived.' }
            ],
            completedAt: '12/01/2025'
        },
        {
            id: 4,
            employeeId: 4,
            employeeName: 'Fatima Al-Harbi',
            employeeNumber: 'EMP-0044',
            employeeAvatar: 'https://i.pravatar.cc/40?img=9',
            department: 'Marketing',
            cycleName: 'April 2024 - April 2025',
            selfScore: 79,
            finalScore: 81,
            performanceRating: 'EXCELLENT',
            evaluator: 'Marketing Lead',
            evaluatorRole: 'Marketing Director',
            gradeName: 'Professional',
            weights: { corporateObjectives: 5, personalKpis: 60, competency: 35 },
            selfEvaluation: { corporateScore: 4, personalScore: 50, competencyScore: 25, justification: 'Successfully launched 3 major campaigns.' },
            committeeEvaluation: { corporateScore: 4, personalScore: 50, competencyScore: 27, feedback: 'Excellent campaign execution.' },
            actionLog: [
                { date: '01/04/2024', action: 'Appraisal Cycle Started', by: 'System Admin', details: null },
                { date: '22/11/2024', action: 'Self-Appraisal Submitted', by: 'Fatima Al-Harbi', details: 'Employee completed self-assessment.' },
                { date: '12/12/2024', action: 'Review Meeting Conducted', by: 'Marketing Lead', details: 'Performance discussion.' },
                { date: '18/01/2025', action: 'Final Approval Signed', by: 'Marketing Lead', details: 'Score finalized and archived.' }
            ],
            completedAt: '18/01/2025'
        },
        {
            id: 5,
            employeeId: 5,
            employeeName: 'Yousef Hassan',
            employeeNumber: 'EMP-1542',
            employeeAvatar: 'https://i.pravatar.cc/40?img=11',
            department: 'Engineering',
            cycleName: 'April 2024 - April 2025',
            selfScore: 68,
            finalScore: 68,
            performanceRating: 'EXCELLENT',
            evaluator: 'HR Director',
            evaluatorRole: 'Human Resources Director',
            gradeName: 'Professional',
            weights: { corporateObjectives: 5, personalKpis: 60, competency: 35 },
            selfEvaluation: { corporateScore: 3, personalScore: 42, competencyScore: 23, justification: 'Completed core responsibilities.' },
            committeeEvaluation: { corporateScore: 3, personalScore: 42, competencyScore: 23, feedback: 'Met expectations with potential for growth.' },
            actionLog: [
                { date: '01/04/2024', action: 'Appraisal Cycle Started', by: 'System Admin', details: null },
                { date: '25/11/2024', action: 'Self-Appraisal Submitted', by: 'Yousef Hassan', details: 'Employee completed self-assessment.' },
                { date: '15/12/2024', action: 'Review Meeting Conducted', by: 'Engineering Lead', details: 'Performance review.' },
                { date: '20/01/2025', action: 'Final Approval Signed', by: 'HR Director', details: 'Score finalized and archived.' }
            ],
            completedAt: '20/01/2025'
        },
        {
            id: 6,
            employeeId: 6,
            employeeName: 'Noor Jaber',
            employeeNumber: 'EMP-0876',
            employeeAvatar: 'https://i.pravatar.cc/40?img=20',
            department: 'IT',
            cycleName: 'April 2024 - April 2025',
            selfScore: 96,
            finalScore: 95,
            performanceRating: 'EXCELLENT',
            evaluator: 'IT Manager',
            evaluatorRole: 'IT Department Manager',
            gradeName: 'Supervisor',
            weights: { corporateObjectives: 10, personalKpis: 70, competency: 20 },
            selfEvaluation: { corporateScore: 10, personalScore: 68, competencyScore: 18, justification: 'Implemented critical security upgrades.' },
            committeeEvaluation: { corporateScore: 9, personalScore: 68, competencyScore: 18, feedback: 'Exceptional technical leadership.' },
            actionLog: [
                { date: '01/04/2024', action: 'Appraisal Cycle Started', by: 'System Admin', details: null },
                { date: '10/11/2024', action: 'Self-Appraisal Submitted', by: 'Noor Jaber', details: 'Employee completed self-assessment.' },
                { date: '01/12/2024', action: 'Review Meeting Conducted', by: 'IT Manager', details: 'Technical performance review.' },
                { date: '08/01/2025', action: 'Final Approval Signed', by: 'IT Manager', details: 'Score finalized and archived.' }
            ],
            completedAt: '08/01/2025'
        },
        {
            id: 7,
            employeeId: 7,
            employeeName: 'Sultan Mansour',
            employeeNumber: 'EMP-1153',
            employeeAvatar: 'https://i.pravatar.cc/40?img=14',
            department: 'Finance',
            cycleName: 'April 2024 - April 2025',
            selfScore: 84,
            finalScore: 84,
            performanceRating: 'EXCELLENT',
            evaluator: 'Finance Head',
            evaluatorRole: 'Head of Finance',
            gradeName: 'Professional',
            weights: { corporateObjectives: 5, personalKpis: 60, competency: 35 },
            selfEvaluation: { corporateScore: 4, personalScore: 52, competencyScore: 28, justification: 'Streamlined financial reporting processes.' },
            committeeEvaluation: { corporateScore: 4, personalScore: 52, competencyScore: 28, feedback: 'Solid performance in financial operations.' },
            actionLog: [
                { date: '01/04/2024', action: 'Appraisal Cycle Started', by: 'System Admin', details: null },
                { date: '28/11/2024', action: 'Self-Appraisal Submitted', by: 'Sultan Mansour', details: 'Employee completed self-assessment.' },
                { date: '18/12/2024', action: 'Review Meeting Conducted', by: 'Finance Head', details: 'Performance discussion.' },
                { date: '22/01/2025', action: 'Final Approval Signed', by: 'Finance Head', details: 'Score finalized and archived.' }
            ],
            completedAt: '22/01/2025'
        },
        {
            id: 8,
            employeeId: 8,
            employeeName: 'Hind Fawaz',
            employeeNumber: 'EMP-1209',
            employeeAvatar: 'https://i.pravatar.cc/40?img=23',
            department: 'Customer Service',
            cycleName: 'April 2024 - April 2025',
            selfScore: 80,
            finalScore: 89,
            performanceRating: 'EXCELLENT',
            evaluator: 'Customer Lead',
            evaluatorRole: 'Customer Service Lead',
            gradeName: 'Professional',
            weights: { corporateObjectives: 5, personalKpis: 60, competency: 35 },
            selfEvaluation: { corporateScore: 4, personalScore: 48, competencyScore: 28, justification: 'Improved customer satisfaction scores.' },
            committeeEvaluation: { corporateScore: 5, personalScore: 54, competencyScore: 30, feedback: 'Outstanding customer focus.' },
            actionLog: [
                { date: '01/04/2024', action: 'Appraisal Cycle Started', by: 'System Admin', details: null },
                { date: '12/11/2024', action: 'Self-Appraisal Submitted', by: 'Hind Fawaz', details: 'Employee completed self-assessment.' },
                { date: '05/12/2024', action: 'Review Meeting Conducted', by: 'Customer Lead', details: 'Customer service review.' },
                { date: '15/01/2025', action: 'Final Approval Signed', by: 'Customer Lead', details: 'Score finalized and archived.' }
            ],
            completedAt: '15/01/2025'
        },
        {
            id: 9,
            employeeId: 9,
            employeeName: 'Ahmad Al-Sudais',
            employeeNumber: 'EMP-0001',
            employeeAvatar: 'https://i.pravatar.cc/40?img=33',
            department: 'Executive',
            cycleName: 'April 2024 - April 2025',
            selfScore: 91,
            finalScore: 91,
            performanceRating: 'EXCELLENT',
            evaluator: 'CEO',
            evaluatorRole: 'Chief Executive Officer',
            gradeName: 'Executives',
            weights: { corporateObjectives: 40, personalKpis: 50, competency: 10 },
            selfEvaluation: { corporateScore: 38, personalScore: 45, competencyScore: 8, justification: 'Drove company growth initiatives.' },
            committeeEvaluation: { corporateScore: 38, personalScore: 45, competencyScore: 8, feedback: 'Exceptional strategic leadership.' },
            actionLog: [
                { date: '01/04/2024', action: 'Appraisal Cycle Started', by: 'System Admin', details: null },
                { date: '05/11/2024', action: 'Self-Appraisal Submitted', by: 'Ahmad Al-Sudais', details: 'Employee completed self-assessment.' },
                { date: '25/11/2024', action: 'Review Meeting Conducted', by: 'Board', details: 'Executive performance review.' },
                { date: '05/01/2025', action: 'Final Approval Signed', by: 'CEO', details: 'Score finalized and archived.' }
            ],
            completedAt: '05/01/2025'
        }
    ],

    // Page title for appraisal results
    appraisalResultsPageTitle: 'Appraisal Results',

    // Home Page Data
    homeData: {
        currentUser: {
            name: 'Ahmed',
            avatar: 'https://i.pravatar.cc/80?img=12'
        },
        companyNews: [
            {
                id: 1,
                type: 'achievement',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=300&fit=crop',
                date: '2026-02-10',
                title: 'New Milestone for Direct!',
                content: 'We are incredibly proud to receive the Excellence in Travel & Tourism Award for 2026. Thank you to everyone who contributed to this success.',
                likes: 8,
                comments: 3
            },
            {
                id: 2,
                type: 'greeting',
                image: 'https://picsum.photos/id/234/800/400',
                date: '2026-02-01',
                title: 'Ramadan Kareem Greetings',
                content: 'Direct management extends its warmest congratulations to all employees on the occasion of the holy month of Ramadan. Wishing you all a blessed month.',
                likes: 24,
                comments: 8
            }
        ],
        newJoiners: [
            { id: 1, name: 'Laila Al-Zaidi', position: 'Business Analyst', avatar: 'https://i.pravatar.cc/40?img=25', joinedDaysAgo: 14 },
            { id: 2, name: 'Omar Al-Harbi', position: 'Senior Developer', avatar: 'https://i.pravatar.cc/40?img=53', joinedDaysAgo: 14 }
        ],
        workforceStatus: {
            activeDaily: { count: 142, change: 4.8 },
            probation: { count: 12, change: 4.8 },
            onLeave: { count: 5, change: -1.8 },
            performance: { percent: 94, change: 4.4 }
        },
        birthdays: [
            { id: 1, name: 'Sarah Al-Otaibi', date: 'Born 02-10', avatar: 'https://i.pravatar.cc/50?img=5', wishes: 12 },
            { id: 2, name: 'Khaled Al-Anazi', date: 'Born 02-10', avatar: 'https://i.pravatar.cc/50?img=68', wishes: 5 }
        ],
        anniversaries: [
            { id: 1, name: 'Rania Al-Otaibi', position: 'Sr. Coordinator', avatar: 'https://i.pravatar.cc/50?img=32', years: 5, joinedDate: 'Joined 02-10' }
        ]
    }
};

// Make it available globally
window.StaticData = StaticData;

