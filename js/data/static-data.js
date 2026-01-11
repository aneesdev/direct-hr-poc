/**
 * Static Data for Direct HR POC
 * Contains all mock data used across the application
 */

const StaticData = {
    // Countries data
    countries: [
        {
            id: 1,
            nameEn: 'Egypt',
            nameAr: 'مصر',
            timezone: 'Africa/Cairo (GMT+2)',
            logo: 'https://flagcdn.com/w40/eg.png',
            active: true
        },
        {
            id: 2,
            nameEn: 'Saudi Arabia',
            nameAr: 'المملكة العربية السعودية',
            timezone: 'Asia/Riyadh (GMT+3)',
            logo: 'https://flagcdn.com/w40/sa.png',
            active: true
        },
        {
            id: 3,
            nameEn: 'United Arab Emirates',
            nameAr: 'الإمارات العربية المتحدة',
            timezone: 'Asia/Dubai (GMT+4)',
            logo: 'https://flagcdn.com/w40/ae.png',
            active: true
        },
    ],

    // Available timezones
    timezones: [
        'Africa/Cairo (GMT+2)',
        'Asia/Riyadh (GMT+3)',
        'Asia/Dubai (GMT+4)',
        'Europe/London (GMT+0)',
        'America/New_York (GMT-5)'
    ],

    // Public holidays data
    holidays: [
        { id: 1, country: 'Egypt', name: 'Revolution Day', date: '25/01/2026', year: 2026 },
        { id: 2, country: 'Egypt', name: 'Sinai Liberation Day', date: '25/04/2026', year: 2026 },
        { id: 3, country: 'Saudi Arabia', name: 'Founding Day', date: '22/02/2026', year: 2026 },
        { id: 4, country: 'Saudi Arabia', name: 'National Day', date: '23/09/2026', year: 2026 },
        { id: 5, country: 'United Arab Emirates', name: 'National Day', date: '02/12/2026', year: 2026 },
    ],

    // Organization structure - Departments
    departments: [
        { id: 1, nameEn: 'Engineering', nameAr: 'الهندسة' },
        { id: 2, nameEn: 'Human Resources', nameAr: 'الموارد البشرية' },
        { id: 3, nameEn: 'Finance', nameAr: 'المالية' },
        { id: 4, nameEn: 'Operations', nameAr: 'العمليات' },
    ],

    // Organization structure - Sections (depends on Department)
    sections: [
        { id: 1, nameEn: 'Software Development', nameAr: 'تطوير البرمجيات', departmentId: 1, sequence: 'Engineering -- Software Development' },
        { id: 2, nameEn: 'Quality Assurance', nameAr: 'ضمان الجودة', departmentId: 1, sequence: 'Engineering -- Quality Assurance' },
        { id: 3, nameEn: 'Recruitment', nameAr: 'التوظيف', departmentId: 2, sequence: 'Human Resources -- Recruitment' },
        { id: 4, nameEn: 'Payroll', nameAr: 'الرواتب', departmentId: 3, sequence: 'Finance -- Payroll' },
    ],

    // Organization structure - Units (depends on Department -> Section)
    units: [
        { id: 1, nameEn: 'Frontend Team', nameAr: 'فريق الواجهة الأمامية', sectionId: 1, sequence: 'Engineering -- Software Development -- Frontend Team' },
        { id: 2, nameEn: 'Backend Team', nameAr: 'فريق الخلفية', sectionId: 1, sequence: 'Engineering -- Software Development -- Backend Team' },
        { id: 3, nameEn: 'Mobile Team', nameAr: 'فريق الموبايل', sectionId: 1, sequence: 'Engineering -- Software Development -- Mobile Team' },
        { id: 4, nameEn: 'Testing Unit', nameAr: 'وحدة الاختبار', sectionId: 2, sequence: 'Engineering -- Quality Assurance -- Testing Unit' },
    ],

    // Organization structure - Teams (depends on Department -> Section -> Unit)
    teams: [
        { id: 1, nameEn: 'React Developers', nameAr: 'مطورو ريأكت', unitId: 1, sequence: 'Engineering -- Software Development -- Frontend Team -- React Developers' },
        { id: 2, nameEn: 'Vue Developers', nameAr: 'مطورو فيو', unitId: 1, sequence: 'Engineering -- Software Development -- Frontend Team -- Vue Developers' },
        { id: 3, nameEn: 'Node.js Team', nameAr: 'فريق نود', unitId: 2, sequence: 'Engineering -- Software Development -- Backend Team -- Node.js Team' },
        { id: 4, nameEn: 'Python Team', nameAr: 'فريق بايثون', unitId: 2, sequence: 'Engineering -- Software Development -- Backend Team -- Python Team' },
    ],

    // Cost Centers
    costCenters: [
        { id: 1, code: 'CC-001', nameEn: 'Engineering Operations', nameAr: 'عمليات الهندسة', active: true },
        { id: 2, code: 'CC-002', nameEn: 'HR Administration', nameAr: 'إدارة الموارد البشرية', active: true },
        { id: 3, code: 'CC-003', nameEn: 'Finance & Accounting', nameAr: 'المالية والمحاسبة', active: true },
        { id: 4, code: 'CC-004', nameEn: 'Marketing & Sales', nameAr: 'التسويق والمبيعات', active: false },
        { id: 5, code: 'CC-005', nameEn: 'IT Infrastructure', nameAr: 'البنية التحتية لتقنية المعلومات', active: true },
    ],

    // Document Types
    documentTypes: [
        { id: 1, nameEn: 'National ID Card', nameAr: 'بطاقة الهوية الوطنية', mandatory: true, hasExpiry: true, sendReminders: true, reminderMonths: 1 },
        { id: 2, nameEn: 'Iqama', nameAr: 'إقامة', mandatory: true, hasExpiry: true, sendReminders: true, reminderMonths: 2 },
        { id: 3, nameEn: 'CPR', nameAr: 'البطاقة الشخصية', mandatory: false, hasExpiry: true, sendReminders: true, reminderMonths: 1 },
        { id: 4, nameEn: 'Passport', nameAr: 'جواز السفر', mandatory: true, hasExpiry: true, sendReminders: true, reminderMonths: 3 },
        { id: 5, nameEn: 'Work Permit', nameAr: 'تصريح العمل', mandatory: false, hasExpiry: true, sendReminders: false, reminderMonths: 1 },
    ],

    // Employee Documents
    documents: [
        { id: 1, ownerId: 1, ownerName: 'عبدالله المطيري', ownerAvatar: 'https://i.pravatar.cc/40?img=1', documentType: 'National ID Card', isPrimary: true, expiryDate: '05/04/2028', expiresIn: 'In 2 years', status: 'valid', lastUpdated: '12/09/2022' },
        { id: 2, ownerId: 2, ownerName: 'أحمد محمد', ownerAvatar: 'https://i.pravatar.cc/40?img=2', documentType: 'National ID Card', isPrimary: true, expiryDate: '02/11/2028', expiresIn: 'In 2 years', status: 'valid', lastUpdated: '12/09/2022' },
        { id: 3, ownerId: 3, ownerName: 'Ivy Andrade', ownerAvatar: 'https://i.pravatar.cc/40?img=3', documentType: 'CPR', isPrimary: false, expiryDate: '01/04/2029', expiresIn: 'In 3 years', status: 'valid', lastUpdated: '06/10/2025' },
        { id: 4, ownerId: 4, ownerName: 'سمية خالد', ownerAvatar: 'https://i.pravatar.cc/40?img=4', documentType: 'National ID Card', isPrimary: true, expiryDate: '05/06/2025', expiresIn: 'Expired', status: 'expired', lastUpdated: '12/09/2022' },
        { id: 5, ownerId: 5, ownerName: 'أحمد المطيري', ownerAvatar: 'https://i.pravatar.cc/40?img=5', documentType: 'National ID Card', isPrimary: true, expiryDate: '03/09/2024', expiresIn: 'Expired', status: 'expired', lastUpdated: '12/09/2022' },
        { id: 6, ownerId: 6, ownerName: 'سليمان آل مخاريق', ownerAvatar: 'https://i.pravatar.cc/40?img=6', documentType: 'Iqama', isPrimary: true, expiryDate: '03/11/2022', expiresIn: 'Expired', status: 'expired', lastUpdated: '12/09/2022' },
    ],

    // Office locations
    offices: [
        {
            id: 1,
            name: 'Cairo HQ',
            location: 'Cairo, Egypt',
            coordinates: '30.0444, 31.2357',
            radius: 200,
            active: true
        },
        {
            id: 2,
            name: 'Riyadh Office',
            location: 'Riyadh, Saudi Arabia',
            coordinates: '24.7136, 46.6753',
            radius: 150,
            active: true
        },
        {
            id: 3,
            name: 'Dubai Office',
            location: 'Dubai, UAE',
            coordinates: '25.2048, 55.2708',
            radius: 100,
            active: true
        },
    ],

    // Biometric devices
    biometricDevices: [
        {
            id: 1,
            name: 'Main Entrance',
            model: 'ZKTeco K40',
            serialNumber: 'ZK-2024-001',
            office: 'Cairo HQ',
            createdAt: '01/01/2026'
        },
        {
            id: 2,
            name: 'Floor 2 Entry',
            model: 'ZKTeco K40',
            serialNumber: 'ZK-2024-002',
            office: 'Cairo HQ',
            createdAt: '01/01/2026'
        },
        {
            id: 3,
            name: 'Reception',
            model: 'Hikvision DS-K1T',
            serialNumber: 'HK-2024-001',
            office: 'Riyadh Office',
            createdAt: '15/01/2026'
        },
    ],

    // Work week configuration
    workWeekDays: [
        { name: 'Sunday', isWorking: true },
        { name: 'Monday', isWorking: true },
        { name: 'Tuesday', isWorking: true },
        { name: 'Wednesday', isWorking: true },
        { name: 'Thursday', isWorking: true },
        { name: 'Friday', isWorking: false },
        { name: 'Saturday', isWorking: false },
    ],

    // Attendance settings
    attendanceSettings: {
        allowMultipleOffices: true,
        autoMarkAbsent: true
    },

    // Page titles mapping
    pageTitles: {
        'dashboard': 'Dashboard',
        'company-settings': 'Company Settings',
        'employee-settings': 'Employee Settings',
        'employees': 'Employees',
        'add-employee': 'Add Employee',
        'attendance': 'Shift & Attendance',
        'workflow': 'Workflows',
        'reports': 'Reports'
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
    currencies: ['EGP', 'SAR', 'AED', 'USD'],
    salaryTransferMethods: ['Cash', 'Bank Transfer'],
    scheduleTypes: ['Fixed Schedule', 'Variable Schedule'],
    weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Sample employees data
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
            nationality: 'Egypt',
            department: 'Engineering',
            section: 'Software Development',
            jobTitle: 'Senior Developer',
            status: 'Active',
            dateOfHiring: '15/01/2023',
            contractType: 'Full-time'
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
            nationality: 'Saudi Arabia',
            department: 'Human Resources',
            section: 'Recruitment',
            jobTitle: 'HR Manager',
            status: 'Active',
            dateOfHiring: '01/03/2022',
            contractType: 'Full-time'
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
            nationality: 'United Arab Emirates',
            department: 'Finance',
            section: 'Payroll',
            jobTitle: 'Financial Analyst',
            status: 'Active',
            dateOfHiring: '10/06/2023',
            contractType: 'Full-time'
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
            nationality: 'Egypt',
            department: 'Engineering',
            section: 'Quality Assurance',
            jobTitle: 'QA Engineer',
            status: 'On Leave',
            dateOfHiring: '20/09/2023',
            contractType: 'Full-time'
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
            nationality: 'Saudi Arabia',
            department: 'Operations',
            section: 'Logistics',
            jobTitle: 'Operations Intern',
            status: 'Active',
            dateOfHiring: '01/11/2025',
            contractType: 'Intern'
        },
    ],

    // Draft employees (incomplete submissions)
    employeeDrafts: []
};

// Make it available globally
window.StaticData = StaticData;

