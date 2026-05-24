SYSTEM CONTEXT
You are designing the UI/UX for the Visitor Scheduling and Daily Museum Operations Module of A.R.K.O: Integrated Historical Museum Portal, a multi-museum integrated web portal serving 5 fixed historical museums in Naga City, Philippines. The system is already in active development. This Figma Make prompt covers the complete interface design for this module only, validated against the ERD, DFD, Process Flow Diagram, Data Dictionary, and Software Requirements Specification of the module.
The system has three user roles relevant to this module:

General Public / Visitor — self-service booking interface, no login required for browsing and booking
Museum Staff — authenticated, handles visitor arrivals, logbook recording, and daily operations
Curator — authenticated, manages staff assignments, schedule templates, attendance reports, and operational oversight

All interfaces must be responsive for desktop and tablet. The system uses a role-based access architecture — the User entity is managed by another module and is referenced here via userId FK only.

DESIGN SYSTEM REQUIREMENTS
Before creating any screen, establish the following:
Typography:

Primary font: Clean, readable sans-serif — suggest Inter or Plus Jakarta Sans
Heading sizes: H1 48px, H2 36px, H3 24px, H4 20px, Body 16px, Caption 12px
Font weight hierarchy: Bold for headings, Medium for labels, Regular for body

Color System:

Primary: Deep heritage tone — suggest deep burgundy #7B2D42 or museum navy #1B3A6B — choose one and apply consistently
Secondary: Warm neutral — suggest warm white #FAF8F5 or cream #F5F0E8
Accent: Gold or amber — suggest #C9922A — for CTAs, active states, highlights
Status colors: Success #2E7D32, Warning #F57C00, Error #C62828, Info #1565C0
Background: #FFFFFF primary, #F7F5F2 secondary surface
Text: #1A1A1A primary, #5A5A5A secondary, #9E9E9E disabled

Component Library to Establish:

Primary button, secondary button, ghost button, destructive button
Input field, textarea, dropdown/select, date picker, time picker
Status badge — Pending, Confirmed, Cancelled, Open, Full, Closed, Holiday, Unavailable, Assigned, Sent, Failed
Data table with sort, filter, search, pagination
Card component — museum card, booking card, staff card, notification card
Modal — confirmation modal, error modal, success modal, form modal
Alert banner — info, warning, error, success
Sidebar navigation with role-based menu items
Top navigation bar with museum context indicator
Empty state component
Loading skeleton component
Toast notification component


SCREEN 1 — Museum Selection (Public — No Authentication Required)
Purpose: Entry point for General Public before accessing any booking functionality. Corresponds to SRS: "The system shall require the user to select a specific museum from a clearly presented museum card interface."
Layout:

Full-width page, centered content
A.R.K.O. portal header at top — logo, system name, navigation links: Home, About, Contact
Hero section: Heading "Plan Your Museum Visit", subheading "Choose a museum to begin"
Below hero: Grid of 5 museum cards — 3 columns on desktop, 2 on tablet, 1 on mobile

Each Museum Card contains:

Museum photograph or illustration — full card width, aspect ratio 16:9
Museum name — H3, bold
Short description — 2 lines max, body text
Location tag — small caption with pin icon
Operating hours — small caption with clock icon
Available slots indicator — badge showing: Available, Limited, Full
CTA button: View Schedule — primary button, full card width at bottom

Interaction:

Hover state: Card elevation increases, subtle border highlight in accent color
On click of View Schedule: museumId ENUM value is captured and stored in session — user is routed to Schedule Browsing screen scoped to selected museum
Selected museum persists across all subsequent booking screens until session ends or user explicitly changes

Data source: museumId ENUM — 5 fixed values, static content
Validation: No form validation — selection is mandatory before routing proceeds

SCREEN 2 — Schedule Browsing (Public — No Authentication Required)
Purpose: General Public browses available visit slots for the selected museum. Corresponds to SRS: "The system shall allow the general public to browse available visit schedules including gallery openings, time slots, and remaining capacity without requiring prior registration."
Layout:

Top bar shows selected museum name with a Change Museum link — clicking returns to Screen 1
Left sidebar or top filter bar: Month/Year selector, filter by slot status
Main content: Interactive availability calendar

Calendar Component:

Monthly calendar view — each date cell shows:

Date number
Slot status indicator:

Green dot = Fully Available (all slots Open)
Yellow dot = Partially Available (some slots Open, some Full)
Red dot = Fully Booked (all slots Full)
Grey with X = Closed / Holiday / Unavailable




Clicking an available date expands a time slot panel below or in a right drawer

Time Slot Panel (on date selection):

List of time slots for that date — each slot shows:

Time — e.g. 09:00, 10:00
Capacity bar — visual indicator showing remaining slots out of maxCapacity
Status badge — Open, Full, Closed, Holiday, Unavailable
Book This Slot button — active only when status = Open



Data sources:

VISIT_SCHEDULE: scheduleId, visitDate, timeSlot, maxCapacity, scheduleStatus
SCHEDULE_TEMPLATE: slotStatus per date and time slot
Capacity remaining = maxCapacity minus COUNT of confirmed VISITOR_BOOKING plus WALK_IN_VISITOR for that scheduleId — computed at query time


SCREEN 3 — Visitor Booking Form (Public — No Authentication Required)
Purpose: General Public submits a visit booking request. Corresponds to SRS: "The system shall allow the general public to submit visit booking requests by providing their name, contact information, group size, preferred date, and time slot."
Layout:

Two-column layout on desktop: Left column = form, Right column = booking summary card
Single column on tablet

Form Fields — mapped directly to VISITOR_BOOKING and VISITOR entities:
FieldTypeValidationData Dictionary ReferenceFirst NameText inputRequired, [A-Z a-z], max 50 charsVISITOR.firstNameLast NameText inputRequired, [A-Z a-z], max 50 charsVISITOR.lastNameMiddle NameText inputOptional, [A-Z a-z], max 50 charsVISITOR.middleNameContact NumberText inputRequired, [0-9], exactly 11 digitsVISITOR.contactNumberEmail AddressText inputOptional, valid email formatVISITOR.emailAddressNumber of VisitorsNumber inputRequired, min 1, max 9999VISITOR_BOOKING.numberOfVisitorsSpecial RequirementsTextareaOptional, max 300 characters, character counter shownVISITOR_BOOKING.specialRequestVisitor TypeRadio or selectRequired — Guest or RegisteredVISITOR.visitorType
Pre-filled fields (read-only, from previous screens):

Selected museum — museumId ENUM display name
Visit date — from calendar selection
Time slot — from slot selection
Schedule ID — hidden, passed to backend

Booking Summary Card (right column):

Museum name
Visit date
Time slot
Number of visitors
Remaining capacity — live updated
Terms and conditions checkbox — required before submission

Submit Button:

Label: Confirm Booking Request
Disabled until all required fields are valid and terms checkbox is checked
On submit: System validates for scheduling conflicts, capacity limits, and field completeness
On success: Route to Screen 4 — Booking Confirmation
On failure: Display inline error messages per field, show error alert banner at top of form

Validation rules (from SRS):

All required fields must be filled
numberOfVisitors must not exceed remaining capacity for selected scheduleId
contactNumber must be exactly 11 digits
If slot becomes Full between browsing and submission — display error: "This slot is no longer available. Please select another time." and return to Screen 2


SCREEN 4 — Booking Confirmation (Public)
Purpose: Displays successful booking details to visitor. Corresponds to SRS: "The system shall generate and deliver a booking confirmation including a reference number, visit date, time, and group details."
Layout:

Centered card layout
Success icon at top — checkmark in accent color
Heading: "Your Visit is Confirmed!"
Booking reference number — large, bold, prominent — bookingId value
Booking details summary:

Museum name
Visit date
Time slot
Number of visitors
Visitor name
Contact number
Email address
Special requirements if any
Booking status badge: Confirmed


Notice: "A confirmation has been sent to your email address" — shown only if email was provided
Two action buttons:

View My Booking — routes to Screen 5
Book Another Visit — routes back to Screen 1



Backend trigger on this screen:

NOTIFICATION_RECORD entry is created with notificationType = Booking Confirmation, referenceId = bookingId, notificationChannel = Email or SMS, recipient = visitor email or contact, notificationStatus = Sent or Pending


SCREEN 5 — Booking Lookup (Public)
Purpose: Visitor retrieves existing booking details. Corresponds to SRS: "The system shall allow visitors to retrieve and view their existing booking details by entering their booking reference number or registered email address."
Layout:

Centered single-column layout
Heading: "Find Your Booking"
Two input options — tabbed:

Tab 1: Enter Booking Reference Number — bookingId field
Tab 2: Enter Email Address — emailAddress field


Find Booking button

On successful lookup:

Displays booking details card identical to Screen 4 booking summary
Additional actions shown based on bookingStatus:

If status = Pending or Confirmed and within cancellation window:

Cancel Booking button — destructive, opens confirmation modal
Request Modification button — opens modification form modal


If status = Cancelled:

Show cancellation notice, no action buttons


If outside cancellation window:

Show notice: "The cancellation window for this booking has passed"





Cancellation modal:

Heading: "Cancel Your Booking?"
Warning message explaining cancellation is irreversible
Two buttons: Keep Booking (secondary), Confirm Cancellation (destructive)
On confirm: bookingStatus updated to Cancelled, NOTIFICATION_RECORD entry created with notificationType = Booking Update


SCREEN 6 — Museum Staff Dashboard (Authenticated — Staff Role)
Purpose: Primary operational interface for Museum Staff. Corresponds to SRS: "The system shall provide a dashboard summarizing the day's bookings, staff assignments, and visitor log entries, highlighting any anomalies or missing data."
Layout:

Left sidebar navigation:

Dashboard (active)
Visitor Logbook
Booking Management
Notifications


Top bar: Museum context indicator showing active museum, staff name, logout button
Main content area: Dashboard

Dashboard Widgets:
WidgetContentData SourceToday's BookingsCount of confirmed bookings for todayVISITOR_BOOKING where visitDate = today and bookingStatus = ConfirmedWalk-in CountCount of walk-ins registered todayWALK_IN_VISITOR where registrationDate = todayTotal On-site VisitorsSum of both aboveComputedIncomplete Logbook EntriesCount of entries flagged as incompleteATTENDANCE_LOG — missing fieldsStaff Assignments TodayList of assigned staff for today's schedulesSTAFF_ASSIGNMENT joined VISIT_SCHEDULERecent NotificationsLast 5 NOTIFICATION_RECORD entries for this museumNOTIFICATION_RECORDCapacity StatusVisual gauge per time slot — Open, Full, ClosedVISIT_SCHEDULE
Quick action buttons on dashboard:

Record Arrival — routes to Screen 7
View Full Logbook — routes to Screen 8
Search Bookings — routes to Screen 9


SCREEN 7 — Visitor Arrival Verification and Logbook Recording (Authenticated — Staff Role)
Purpose: Museum Staff verifies visitor arrival and records in logbook. Corresponds to Process 4.3 in DFD and Pool 3 in PFD.
Layout:

Two-panel layout: Left = verification, Right = logbook entry form

Left Panel — Arrival Verification:

Heading: "Verify Visitor"
Input: Booking Reference Number — bookingId field
Search Booking button
On found: Display booking details card — visitorName (from VISITOR via VISITOR_BOOKING), visitDate, timeSlot, numberOfVisitors, bookingStatus, specialRequest
Exclusive gateway outcome displayed as:

Confirmed Booking: Green badge — Verified — proceed to logbook entry
Not Found: Show Walk-in Registration option



Walk-in Registration Form (shown when no booking found):

Fields mapped to WALK_IN_VISITOR:

Last Name — required
First Name — required
Middle Name — optional
Contact Number — required, 11 digits
Number of Visitors — required
Schedule — dropdown showing today's available time slots from VISIT_SCHEDULE


Register Walk-in button

Right Panel — Logbook Entry Form:

Pre-filled from verification: visitorName or walk-in name, scheduleId, arrivalDate (today)
Fields:

Arrival Time — time picker, defaults to current time — ATTENDANCE_LOG.arrivalTime
Entry Type — auto-filled: Pre-booked or Walk-in — ATTENDANCE_LOG.entryType
Attendance Status — dropdown: Present, Absent, Late — ATTENDANCE_LOG.attendanceStatus


Save Logbook Entry button
On save:

ATTENDANCE_LOG record created
System validates completeness — if incomplete fields: warning alert shown, NOTIFICATION_RECORD entry created with notificationType = Incomplete Logbook
On success: Green success toast shown




SCREEN 8 — Visitor Logbook (Authenticated — Staff Role)
Purpose: Staff views, searches, and filters all logbook entries. Corresponds to SRS: "The system shall allow staff to search and filter visitor bookings and logbook entries by date, visitor name, group type, or assigned staff."
Layout:

Full-width data table

Filter bar above table:

Date range picker
Search by visitor name — text input
Filter by entry type — All, Pre-booked, Walk-in
Filter by attendance status — All, Present, Absent, Late
Export button — CSV or PDF — top right

Table columns — mapped to ATTENDANCE_LOG:

Log ID
Visitor Name — retrieved via JOIN to VISITOR_BOOKING → VISITOR or WALK_IN_VISITOR
Arrival Date
Arrival Time
Entry Type — badge
Attendance Status — badge
Schedule Time Slot
Recorded By — userId display name
Actions — View, Edit

Pagination: 20 rows per page, page navigation at bottom
Empty state: Illustration with message "No logbook entries found for the selected filters"

SCREEN 9 — Booking Management (Authenticated — Staff Role)
Purpose: Staff views, searches, modifies, and manages visitor bookings.
Layout:

Full-width data table with same filter/search pattern as Screen 8

Filter bar:

Date range picker
Search by visitor name or bookingId
Filter by bookingStatus — All, Pending, Confirmed, Cancelled
Filter by bookingType — All, Pre-booked, Walk-in
Filter by museum — museumId ENUM selector

Table columns — mapped to VISITOR_BOOKING:

Booking ID
Visitor Name
Visit Date
Time Slot
Number of Visitors
Booking Type — badge
Booking Status — badge
Special Request — truncated, expand on click
Actions — View, Edit Status, Cancel

Edit Status modal:

Dropdown: Pending, Confirmed, Cancelled
On save: NOTIFICATION_RECORD entry created with notificationType = Booking Update, recipient = visitor contact


SCREEN 10 — Curator Dashboard (Authenticated — Curator Role)
Purpose: Curator's primary operational overview. Corresponds to SRS: "The system shall provide an integrated overview dashboard showing visitor activity, staff allocation, and operational alerts."
Layout:

Left sidebar navigation:

Dashboard (active)
Staff Assignment
Schedule Template
Attendance Reports
Notifications
Staff Performance


Top bar: Museum context indicator, curator name, logout

Dashboard Widgets:
WidgetContentData SourceTotal Bookings TodayCountVISITOR_BOOKINGStaff AssignmentsCount assigned vs requiredSTAFF_ASSIGNMENTAttendance SummaryPie chart — Present, Absent, LateATTENDANCE_LOGNotification AlertsUnread alerts count + listNOTIFICATION_RECORDScheduling ConflictsCount of detected conflictsNOTIFICATION_RECORD where notificationType = Scheduling ConflictHigh Load AlertsCount of high visitor load notificationsNOTIFICATION_RECORD where notificationType = High Visitor LoadWeekly Attendance TrendLine chart — 7-day visitor countATTENDANCE_LOG grouped by arrivalDateStaff Performance SummaryTable — staff name, entries logged, schedule adherenceSTAFF_ASSIGNMENT, ATTENDANCE_LOG

SCREEN 11 — Staff Assignment Management (Authenticated — Curator Role)
Purpose: Curator assigns staff to visit schedules. Corresponds to Process 4.2 in DFD and Pool 2 in PFD.
Layout:

Left: Schedule list for selected date
Right: Assignment panel for selected schedule

Left Panel:

Date picker at top
List of VISIT_SCHEDULE records for selected date and museum:

Time slot
Max capacity
Schedule status badge
Number of confirmed bookings
Number of assigned staff
Click to select and load in right panel



Right Panel — Assignment Form:

Selected schedule details at top — read-only
Current assignments table:

Staff name — from USER entity via userId
Role
Assignment status badge
Remove button


Add Staff section:

Dropdown: Active staff members — userId, displayName, role from USER entity filtered by staffType = Museum Staff and status = Active
Assign Staff button
On assign:

System checks for conflict — same userId assigned to overlapping scheduleId
Exclusive gateway:

Conflict detected: Error alert shown — "This staff member is already assigned to an overlapping schedule" — NOTIFICATION_RECORD entry created with notificationType = Scheduling Conflict
No conflict: STAFF_ASSIGNMENT record created, NOTIFICATION_RECORD entry created with notificationType = Staff Assignment, success toast shown







Conflict indicators:

Red warning icon on schedule card if conflict exists
Yellow warning icon if staff count is below recommended minimum


SCREEN 12 — Schedule Template Management (Authenticated — Curator Role)
Purpose: Curator uploads and manages slot availability templates. Corresponds to Process 4.5 in DFD and Pool 5 in PFD.
Layout:

Top: Month/Year selector and museum selector
Main: Calendar grid with editable slot status per day

Calendar Grid:

Each date cell shows:

Date number
List of time slots for that date
Each slot has a status dropdown: Open, Closed, Holiday, Unavailable


Bulk action toolbar:

Select date range
Apply status to all slots in range — dropdown + Apply button
Useful for blocking holidays or opening entire weeks



Template Upload Option:

Upload Template button — opens file upload modal
Accepts CSV format
CSV columns: visitDate, timeSlot, slotStatus
On upload: System validates all rows, shows preview table, confirms or shows validation errors

Save Actions:

Save Template button — primary, saves SCHEDULE_TEMPLATE records
Preview Public View button — shows how the calendar will appear to General Public
On save:

SCHEDULE_TEMPLATE records written
VISIT_SCHEDULE.scheduleStatus updated accordingly
NOTIFICATION_RECORD entry created with notificationType = Template Update
Success toast shown



Validation:

visitDate must be a future date
timeSlot must match existing VISIT_SCHEDULE time slots
slotStatus must be one of: Open, Closed, Holiday, Unavailable
Inline error indicators on invalid rows


SCREEN 13 — Attendance Reports (Authenticated — Curator Role)
Purpose: Curator views historical attendance trends and generates reports. Corresponds to SRS: "The system shall allow curators to view historical attendance trends and staff activity reports."
Layout:

Filter bar at top: Date range, museum selector, entry type, group by (Day, Week, Month)
Four summary cards:

Total Visitors in range
Pre-booked vs Walk-in ratio
Peak attendance date
Average daily attendance


Below cards: Line chart — daily visitor count over selected range
Below chart: Detailed data table

Table columns — from ATTENDANCE_LOG:

Date
Time Slot
Pre-booked Count
Walk-in Count
Total Visitors
Attendance Level — Normal or High badge
Incomplete Entries — count with warning icon if > 0

Export button: CSV or PDF — full report for selected range
Notification history section:

Collapsible panel at bottom
Shows NOTIFICATION_RECORD entries for the date range
Filter by notificationType
Columns: Date, Type, Recipient, Channel, Status badge


SCREEN 14 — Notification Center (Authenticated — Staff and Curator Roles)
Purpose: Central view of all system notifications. Corresponds to NOTIFICATION_RECORD entity.
Layout:

Filter tabs: All, Unread, Booking, Assignment, Conflict, Attendance, Template
Notification list — each item shows:

Notification type badge
Message — auto-generated from notificationType and referenceId
Recipient
Channel badge — Email, SMS, System Alert
Date
Status badge — Sent, Failed, Pending
For Failed: Retry button — re-triggers notification



Detail panel (on click):

Full notification details
Reference record link — clicking referenceId navigates to the related booking, assignment, schedule, or log entry


DATA VALIDATION RULES (Apply Globally Across All Forms)
These are derived directly from the Data Dictionary and must be enforced at both frontend (inline) and backend (API) levels:
FieldRuleAll ID fieldsVARCHAR, alphanumeric, max 15 characters, auto-generated by system — never user-editablelastName, firstName[A-Z a-z] only, max 50 characters, requiredmiddleName[A-Z a-z] only, max 50 characters, optionalcontactNumber[0-9] only, exactly 11 digitsemailAddressValid email format — [A-Z a-z 0-9 . @ _ -], max 100 characters, optionalvisitDate, bookingDate, arrivalDateYYYY-MM-DD format, must be present or future date for bookingtimeSlot, arrivalTimeHH:MM format, 24-hournumberOfVisitorsInteger, min 1, max 9999specialRequestMax 300 characters, character counter shown, optionalbookingStatusEnum: Pending, Confirmed, Cancelled — system-assigned, not user-editable directlyscheduleStatusEnum: Open, Full, Closed, Holiday, Unavailable — system or curator-managednotificationStatusEnum: Sent, Failed, Pending — system-assignedmuseumIdEnum: 5 fixed museum values — selected via card UI, passed as session valueAll FK fieldsMust reference existing records — show validation error if reference not found

NOTIFICATION BEHAVIOR (Apply Globally)
Every form submission that creates or modifies a record in the following entities must trigger a NOTIFICATION_RECORD write:
TriggernotificationTyperecipientchannelVISITOR_BOOKING created with status ConfirmedBooking Confirmationvisitor email or contactEmail or SMSVISITOR_BOOKING.bookingStatus changedBooking Updatevisitor email or contactEmail or SMSSTAFF_ASSIGNMENT createdStaff Assignmentassigned staff userId contactSystem Alert or SMSScheduling conflict detectedScheduling Conflictcurator userId contactSystem AlertATTENDANCE_LOG entry flagged incompleteIncomplete Logbookmuseum staff userId contactSystem AlertAttendance count exceeds thresholdHigh Visitor Loadcurator userId contactSystem AlertSCHEDULE_TEMPLATE savedTemplate Updatecurator userId contactSystem AlertUpcoming visit within 24 hoursUpcoming Visitvisitor email or contactEmail or SMS

INTERACTION AND UX NOTES

All destructive actions (Cancel Booking, Remove Staff Assignment) must be preceded by a confirmation modal — never immediate
All form submissions must show a loading state on the submit button while processing
All successful writes must show a success toast — bottom right, auto-dismiss after 4 seconds
All failed writes must show an error alert banner at the top of the form — persistent until dismissed
All data tables must support export to CSV and PDF
All date pickers must default to today's date
All time pickers must use 24-hour format consistent with HH:MM in the Data Dictionary
Museum context must be visible at all times in the top bar for authenticated users — staff and curator cannot access records outside their assigned museum context
Empty states must always show an illustration and a helpful action button — never a blank page
Skeleton loaders must be shown during all data fetch operations — never a blank loading state