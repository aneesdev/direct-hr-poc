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

    // Organization structure (departments, sections, units, teams)
    departments: [
        { 
            id: 1, 
            nameEn: 'Engineering', 
            nameAr: 'الهندسة', 
            type: 'Department', 
            parent: '-', 
            head: 'Ahmed Hassan' 
        },
        { 
            id: 2, 
            nameEn: 'Frontend Team', 
            nameAr: 'فريق الواجهة الأمامية', 
            type: 'Section', 
            parent: 'Engineering', 
            head: 'Sara Ahmed' 
        },
        { 
            id: 3, 
            nameEn: 'Backend Team', 
            nameAr: 'فريق الخلفية', 
            type: 'Section', 
            parent: 'Engineering', 
            head: 'Mohamed Ali' 
        },
        { 
            id: 4, 
            nameEn: 'Human Resources', 
            nameAr: 'الموارد البشرية', 
            type: 'Department', 
            parent: '-', 
            head: 'Fatima Omar' 
        },
        { 
            id: 5, 
            nameEn: 'Recruitment', 
            nameAr: 'التوظيف', 
            type: 'Unit', 
            parent: 'Human Resources', 
            head: 'Layla Ibrahim' 
        },
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
        'attendance': 'Shift & Attendance',
        'workflow': 'Workflows',
        'reports': 'Reports'
    }
};

// Make it available globally
window.StaticData = StaticData;

