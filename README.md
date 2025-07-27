# College Event Management System (CEMS) – Concept Map

This document outlines the key components and architecture of the College Event Management System (CEMS) based on Object, Context, and Information. It includes all major modules, user roles, data flows, and enhancements derived from both practical use and documentation.

---

## 🔐 User Panels

### 1. Admin Panel

#### Object: Admin
- **Context**: Institution-level user responsible for setup and configuration.
- **Information**:
  - Upload student/faculty data (Excel/manual)
  - Setup college details during first-time use
  - Send login credentials via email
  - Lock/unlock any user login
  - Promote students to next semester
  - Forgot password (OTP via email)
  - Manage all users and events

#### Object: Committees
- **Context**: Faculty group assigned to oversee event types.
- **Information**:
  - Create/edit/delete committees per course
  - Assign/remove faculties to/from committees
  - Limit faculty to manage events related to their course (default)
  - Potential enhancement: cross-course committee assignment

#### Object: Event Management
- **Context**: Setup and configuration of institute events.
- **Information**:
  - Create/edit/delete events (intra/inter-college)
  - Attach documents: event poster & brochure
  - Manage event types and logos
  - Course/semester-specific eligibility
  - Set `ptype` (solo/team), `hasSubEvents`, and `courseWiseResultDeclaration`
  - Track updates via `updationLog`
  - Generate reports with uploaded banner/logo headers

#### Object: Results & Reports
- **Context**: Analytics and outcome tracking.
- **Information**:
  - View/download result reports
  - Declare winners (event/subevent level)
  - Generate PDF reports with institute branding

---

### 2. Faculty Panel

#### Object: Faculty
- **Context**: Event moderator and committee participant.
- **Information**:
  - View events under assigned committees
  - Create/manage events and subevents
  - Upload event documents (posters, brochures)
  - Approve student registrations
  - Declare event/subevent results
  - Edit personal profile and change password
  - Notify students via email upon result declaration

---

### 3. Student Panel

#### Object: Student
- **Context**: Event participant.
- **Information**:
  - Login and manage own profile/password
  - View all eligible events (based on course/semester)
  - Register in events/subevents
  - View participation history
  - Receive result notifications via email
  - View/download published results

---

## 🗃️ Core Models & Schemas

### Object: Event
- **Context**: Single event managed by a committee.
- **Key Fields**:
  - `eventName`, `etype`, `ptype` (solo/team)
  - `committeeId`, `createdBy`
  - `posterPath`, `brochurePath`
  - `eligibleCourses`, `eligibleSemesters`
  - `hasSubEvents`, `courseWiseResultDeclaration`
  - `updationLog`: array of `{ user, message, timestamp }`

### Object: Subevent
- **Context**: Optional subdivision of events.
- **Information**:
  - Linked to a parent event
  - Independent result declaration
  - Supports rank and team configurations

### Object: Registration
- **Context**: Tracks student participation.
- **Key Fields**:
  - `eventId`, `subEventName`
  - `studentData[]`
  - `status`, `rank`
  - `createdAt`, `updatedAt`

---

## 📥 Authentication & OTP

### Object: User Authentication
- **Context**: Secures user identity.
- **Information**:
  - Email-based login with OTP for password reset
  - Admin can reset/lock accounts
  - Token-based login with session expiry

### Object: OTP Verification
- **Context**: Password reset flow.
- **Information**:
  - OTP stored temporarily in Redis or memory
  - Expiry configured (e.g., 5–10 minutes)
  - Verification on user input

---

## 📊 Additional Admin Features

### Object: Excel Uploads
- **Context**: Bulk data onboarding.
- **Information**:
  - Templates for students and faculties
  - Auto-detect duplicate or invalid entries
  - Email sent to each new user

### Object: College Branding
- **Context**: Institutional personalization.
- **Information**:
  - Upload banner/logo once
  - Applied to reports and dashboards

---

## 🚫 Constraints and Limitations

- External college students cannot register
- Events are internal only (inter-college in name only)
- Faculty cannot create events outside their committee (currently)
- Sub-event and team support is restricted to configured event types

---

## 🛠️ Future Enhancements

- Enable cross-course committee membership
- Allow external participation (with approval)
- Audit logs and version history of events
- SMS notification integration
- Data export as Excel/CSV
- Role-based dashboards with analytics

---

## ⚙️ Tech Stack Overview (for Dev Reference)

- **Frontend**: React.js / Tailwind / Headless UI
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Email**: Nodemailer (with OTP)
- **Storage**: Multer for file uploads
- **Optional**: Redis for OTP/session caching
- **Deployment**: Docker / NGINX / PM2

---

## ✅ Conclusion

This concept map helps contributors and stakeholders understand how the CEMS application is structured and how each module connects functionally and contextually. Use this as the base for future architectural and feature planning.

