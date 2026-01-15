# Direct HR Project Requirements

## Project Overvieww

Direct HR is a an HR management system that allows us at Direct to manage our HR processes and workflows.

## Project Requirements

### 1. Company Setting Module

#### 1.1 Country
| Field | Description |
|-------|-------------|
| Name (Arabic + English) | Bilingual country name |
| Logo | PNG format |

**Notes:**
- Option to add multiple countries
- Logo must be PNG format
- Displayed as dropdown list

#### 1.2 Public Holiday Calendar
| Field | Description |
|-------|-------------|
| Country | Select country first |
| Name + Date | Holiday name and date |

**Notes:**
- Supports multiple years (attachment 1)

#### 1.3 Organization Structure

| Submodule | Fields | Sequence/Description |
|-----------|--------|----------------------|
| Department | name (Arabic + English) | Top level |
| Sections | name (Arabic + English) | department → sections |
| Units | name (Arabic + English) | department → sections → units |
| Team | name (Arabic + English) | department → sections → units → team |

#### 1.4 Cost Center
| Field | Description |
|-------|-------------|
| Name (Arabic + English) | Cost center name |

**Notes:**
- Just for reporting (internal, not shown to employees)

#### 1.5 Assets
- TBD (attachment 10)

#### 1.6 Document Tracing
| Field | Description |
|-------|-------------|
| Name | Document name |
| Expiry Date | Mandatory field |

**Notes:** (attachment 11)

#### 1.7 Attendance Settings

##### General Criteria
| Setting | Description |
|---------|-------------|
| Allow check-in/out from multiple offices | Applicable to non-shift employees only. They can check-in/out from offices mapped to their work profiles |
| Auto-mark employees as absent on missed check-in | System auto-marks employees as absent for the past day if they don't check-in during scheduled hours |

##### Office
| Field | Description |
|-------|-------------|
| Name | Office name |
| Location | Office location |
| Coordinates | GPS coordinates |
| Radius | Geofence radius |

**Notes:** (attachment 4)

##### Biometric Device
| Field | Description |
|-------|-------------|
| Name | Device name |
| Model | Device model |
| Serial Number | Device serial number |
| Office | Assigned office |
| Data Structure | Data format |
| Created At | Creation timestamp |

**Notes:** (attachment 5)

##### Work Weeks
| Field | Description |
|-------|-------------|
| Week Days | Define working days |

**Notes:** (attachment 2)

### 2. Employee Setting Creation

*Module for employee profile and settings configuration*

### 3. Shift & Attendance Module

| Feature | Description |
|---------|-------------|
| دوام ايام العطل الرسمية | Official holiday attendance tracking |
| Over Time | Overtime management and calculation |
| الرواتب | Salary management |

### 4. Work Flow Module

| Workflow | Description |
|----------|-------------|
| HBD | Happy Birthday workflow automation |
| Employee Creation | Employee onboarding workflow |