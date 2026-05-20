const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" };
const noBorder   = { style: BorderStyle.NONE,   size: 0, color: "FFFFFF" };
const C = AlignmentType.CENTER;

function body(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Arial", ...opts })],
    spacing: { before: 70, after: 70 },
    alignment: AlignmentType.JUSTIFIED
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun({ text, size: 22, font: "Arial" })],
    spacing: { before: 50, after: 50 }
  });
}
function subBullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 1 },
    children: [new TextRun({ text, size: 21, font: "Arial", color: "333333" })],
    spacing: { before: 30, after: 30 }
  });
}
function gap(n = 1) {
  return new Paragraph({ children: [new TextRun({ text: "", size: 22 })], spacing: { before: 0, after: 80 * n } });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}
function sectionNum(num, title) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${num}. `, bold: true, size: 27, color: "1F3864", font: "Arial" }),
      new TextRun({ text: title,       bold: true, size: 27, color: "1F3864", font: "Arial" })
    ],
    spacing: { before: 320, after: 130 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 4 } }
  });
}
function subHead(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, color: "2E4096", font: "Arial" })],
    spacing: { before: 180, after: 70 }
  });
}
function subSubHead(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, italic: true, size: 22, color: "2E75B6", font: "Arial" })],
    spacing: { before: 120, after: 50 }
  });
}
function screenshotBox(label) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [
      new TableRow({ children: [
        new TableCell({
          borders: {
            top: { style: BorderStyle.DASHED, size: 6, color: "2E75B6" },
            bottom: { style: BorderStyle.DASHED, size: 6, color: "2E75B6" },
            left: { style: BorderStyle.DASHED, size: 6, color: "2E75B6" },
            right: { style: BorderStyle.DASHED, size: 6, color: "2E75B6" },
          },
          shading: { fill: "F0F6FB", type: ShadingType.CLEAR },
          margins: { top: 400, bottom: 400, left: 300, right: 300 },
          width: { size: 9026, type: WidthType.DXA },
          children: [
            new Paragraph({ alignment: C, children: [new TextRun({ text: `[ Screenshot / Photo Placeholder ]`, bold: true, size: 22, font: "Arial", color: "2E75B6" })] }),
            new Paragraph({ alignment: C, children: [new TextRun({ text: label, size: 21, font: "Arial", color: "666666", italics: true })] })
          ]
        })
      ]})
    ]
  });
}

function frontPage() {
  return [
    gap(2),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "LOKNETE SHAMRAO PEJE GOVERNMENT COLLEGE OF", bold: true, size: 28, font: "Arial", color: "1F3864" })] }),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "ENGINEERING, RATNAGIRI", bold: true, size: 28, font: "Arial", color: "1F3864" })] }),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "(Affiliated to Dr. Babasaheb Ambedkar Technological University, Lonere)", size: 22, font: "Arial", color: "444444" })] }),
    gap(),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "ACADEMIC YEAR 2025-2026", bold: true, size: 24, font: "Arial" })] }),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "SEMESTER I", bold: true, size: 24, font: "Arial" })] }),
    gap(2),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "Synopsis Submission", size: 26, font: "Arial", color: "2E75B6" })] }),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "For", size: 22, font: "Arial" })] }),
    gap(),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "24AF1000VS211 Design Thinking (VSEC)", bold: true, size: 24, font: "Arial" })] }),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "B.Tech First Year Engineering", size: 24, font: "Arial" })] }),
    gap(3),
    new Table({
      width: { size: 7200, type: WidthType.DXA }, alignment: C, columnWidths: [4200, 3000],
      rows: [
        new TableRow({ children: [
          new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 4200, type: WidthType.DXA },
            children: [new Paragraph({ alignment: C, children: [new TextRun({ text: "Name of The Student", bold: true, size: 22, font: "Arial" })] })] }),
          new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 3000, type: WidthType.DXA },
            children: [new Paragraph({ alignment: C, children: [new TextRun({ text: "PRN", bold: true, size: 22, font: "Arial" })] })] })
        ]}),
        ...[ ["Pooja Shirke","25030421504017"],["Pratiksha Jadhav","25030421504018"],
             ["Siddhi Munde","25030421504023"],["Srushti Bandbe","25030421504024"] ]
          .map(([name,prn]) => new TableRow({ children: [
            new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 4200, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun({ text: name, size: 22, font: "Arial" })] })] }),
            new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 3000, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun({ text: prn, size: 22, font: "Arial" })] })] })
          ]}))
      ]
    }),
    gap(3),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "He/She has successfully completed the synopsis as per the syllabus for the year 2025-2026 in the institute laid by the University.", size: 22, font: "Arial" })] }),
    gap(3),
    new Table({
      width: { size: 9026, type: WidthType.DXA }, columnWidths: [4513, 4513],
      rows: [ new TableRow({ children: [
        new TableCell({ borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 4513, type: WidthType.DXA },
          children: [
            new Paragraph({ alignment: C, children: [new TextRun({ text: "Subject Teacher", bold: true, size: 22, font: "Arial" })] }),
            new Paragraph({ alignment: C, children: [new TextRun({ text: "Prof.Nikhil Bhosale Sir", size: 22, font: "Arial" })] }),
            new Paragraph({ alignment: C, children: [new TextRun({ text: "Mechatronics Dept.", size: 22, font: "Arial" })] })
          ]
        }),
        new TableCell({ borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 4513, type: WidthType.DXA },
          children: [
            new Paragraph({ alignment: C, children: [new TextRun({ text: "H.O.D", bold: true, size: 22, font: "Arial" })] }),
            new Paragraph({ alignment: C, children: [new TextRun({ text: "Dr. U.S.Kakade", size: 22, font: "Arial" })] }),
            new Paragraph({ alignment: C, children: [new TextRun({ text: "Science & Humanities Dept.", size: 22, font: "Arial" })] })
          ]
        })
      ]})]
    }),
    pageBreak()
  ];
}

function mainContent() {
  return [
    sectionNum("1", "Title"),
    new Paragraph({ alignment: C, children: [new TextRun({ text: "GeoTracker – Geolocation Based Attendance System", bold: true, size: 30, font: "Arial", color: "1F3864" })], spacing: { before: 100, after: 100 } }),
    gap(),

    sectionNum("2", "Introduction"),
    body("Attendance management is one of the oldest administrative challenges in educational institutions and workplaces. Despite the enormous technological advancements of the past two decades, the majority of colleges and offices in India still rely on paper registers, proximity cards, or simple biometric machines to record who is present. These approaches share a fundamental weakness: they verify that an artefact — a signature, a card, a fingerprint — is present at a terminal, not that the actual person is genuinely at the right location and engaged with the day."),
    body("The rapid proliferation of GPS-enabled smartphones has made it technically feasible to solve this problem in an entirely different way. As of 2024, over 750 million Indians own a smartphone, and virtually every modern device ships with a GPS receiver capable of positioning accuracy between 3 and 10 metres in open environments. The HTML5 Geolocation API — natively available in every major browser since 2013 — exposes this hardware to web applications without requiring any native app installation. This means that any student or employee already carrying a phone is also carrying a precision attendance device that has not yet been put to proper use."),
    body("GeoTracker is a web-based attendance system built around this insight. Rather than asking users to tap a card or press a finger on a scanner, it asks the browser to fetch the device's current GPS coordinates and validates them against a pre-configured geofence — a virtual circular boundary drawn around the institution or office. If the user is inside the boundary, the attendance is accepted. If not, the request is denied. The entire check-in takes three seconds and requires nothing more than a browser and a phone."),
    body("The system is designed with two distinct roles in mind. Administrators configure geofences, manage employees, approve leave requests, and monitor attendance data across the organisation. Employees interact with a minimal dashboard — one button to check in, one button to check out, a calendar to review their own history, and a form to apply for leave. The design philosophy is that the less time both parties spend interacting with the attendance system, the better."),
    body("This synopsis describes the problem in detail, surveys the landscape of existing solutions and their shortcomings, explains the architecture and methodology of GeoTracker, and outlines the roadmap for evolving the current demonstration prototype into a production-grade system. The project is an application of the Design Thinking process — empathise with the users, define the real problem, ideate solutions, prototype the most promising one, and test it."),
    gap(),

    sectionNum("3", "Problem Statement"),
    body("The central problem that GeoTracker addresses can be stated clearly: current attendance systems in most educational and professional settings do not reliably verify that a person is physically present at the required location. They verify tokens — a signature, a card, a fingerprint — rather than presence itself. This creates three categories of failure."),
    subHead("3.1 Proxy Attendance"),
    body("Proxy attendance is the practice of having someone else sign in or tap a card on your behalf. It is pervasive in colleges, where a student may ask a friend to sign their name in the register before the friend also leaves early. In offices, buddy punching — clocking in on someone else's behalf — costs businesses an estimated 2.2 percent of gross payroll according to the American Payroll Association, and the problem is no less prevalent in India. Paper registers are completely defenceless against this. Even biometric systems can be circumvented through mould-based fingerprint spoofing, and RFID cards can simply be handed to another person."),
    subHead("3.2 Administrative Overhead"),
    body("Manual attendance systems generate a significant amount of downstream work. Someone must collect the registers, count the entries, cross-check against the class roll, enter the data into a spreadsheet or ERP system, generate shortage reports, and inform affected students. This process happens every month and is error-prone at every step. Illegible handwriting, torn pages, missing registers, and data-entry mistakes are routine. The time faculty and administrative staff spend on attendance management could be spent more productively elsewhere."),
    subHead("3.3 Lack of Audit Trail"),
    body("When a dispute arises — a student claiming they were present when the register says otherwise, or an employee denying an absence — most systems offer no reliable audit trail. A paper register can be altered. A biometric log tells you a finger was scanned but not where the person was two minutes later. What is needed is a record that is timestamped, location-stamped, and impossible to retroactively alter without detection. GeoTracker addresses all three categories by tying attendance to a verified physical location, recording exact GPS coordinates at the moment of check-in, and maintaining an immutable log of every transaction."),
    gap(),

    sectionNum("4", "Objectives"),
    body("The objectives of the GeoTracker project are defined across three levels: functional goals that describe what the system must do, quality goals that describe how well it must do it, and learning goals that reflect the Design Thinking process underlying the project."),
    subHead("4.1 Functional Objectives"),
    bullet("Design and implement a browser-based check-in system that uses device GPS to verify physical presence before recording attendance."),
    bullet("Build a configurable geofencing module that allows an administrator to define one or more circular boundaries using a centre coordinate and radius in metres."),
    bullet("Develop a dual-role interface — Admin and Employee — with appropriate dashboards, permissions, and workflows for each role."),
    bullet("Record every check-in and check-out event with a precise timestamp and the device's reported GPS coordinates."),
    bullet("Implement a leave management workflow covering request submission, admin review, and status notifications."),
    bullet("Generate monthly attendance summaries and working hours reports for both individual employees and admin oversight."),
    subHead("4.2 Quality Objectives"),
    bullet("The check-in flow should be completable in under five seconds on a modern smartphone browser."),
    bullet("The user interface should be accessible and operable without any training or documentation."),
    bullet("The geofence validation logic should be correct to within the accuracy limits of the device GPS (typically ±5 metres)."),
    bullet("The codebase should be modular so that a persistent backend can be integrated without redesigning the frontend."),
    subHead("4.3 Design Thinking Objectives"),
    bullet("Demonstrate empathy with both student/employee users who want a frictionless check-in, and administrators who need reliable, actionable data."),
    bullet("Apply iterative prototyping — build a working demo, test it, identify gaps, and define the next iteration clearly."),
    bullet("Document assumptions, constraints, and future directions transparently so that the project can be handed over or extended by another team."),
    gap(),

    sectionNum("5", "Scope"),
    subHead("5.1 What Is Included"),
    body("The current version of GeoTracker is a fully functional front-end demonstration implemented as a React 18 + TypeScript single-page application. It covers the following features:"),
    bullet("User authentication with role-based access control (Admin and Employee roles)."),
    bullet("Geofence configuration by the Admin — centre latitude/longitude and radius in metres."),
    bullet("Real-time GPS-based check-in and check-out with Haversine distance validation."),
    bullet("Per-employee attendance records showing timestamps, GPS coordinates, and session durations."),
    bullet("Monthly attendance calendar with colour-coded present/absent indicators."),
    bullet("Working hours summary: total minutes worked and average hours per day for each employee."),
    bullet("Leave request submission by employees and approval/rejection by admin with status tracking."),
    bullet("Admin ability to add and remove employee accounts and assign geofences."),
    subHead("5.2 What Is Excluded"),
    body("The following items are consciously outside the scope of the current demo and will be addressed in future iterations:"),
    bullet("A persistent backend server and relational database — all data currently lives in browser memory and is cleared on page refresh."),
    bullet("Server-side geofence validation — the geofence check currently happens on the client, which means a user with GPS spoofing software could theoretically bypass it."),
    bullet("Email, SMS, or push notification delivery for leave approvals or attendance anomalies."),
    bullet("Multi-site geofencing — each employee is currently assigned to a single location boundary."),
    bullet("Biometric or face recognition as a secondary verification layer."),
    bullet("Mobile app packaging (Android APK or iOS IPA) — though the PWA upgrade path is available."),
    gap(),
    sectionNum("6", "Literature Review / Existing System"),
    body("Understanding the limitations of existing approaches was the first step in designing GeoTracker. We surveyed five categories of attendance management systems that are commonly deployed in Indian colleges and offices, and identified the specific failure mode of each."),
    subHead("6.1 Paper-Based Registers"),
    body("The paper register is the oldest and still most widely used method in Indian colleges. A student physically signs their name next to their roll number in a column corresponding to the current date. The method requires no technology investment, is universally understood, and works without electricity or internet connectivity. However, it has critical weaknesses that make it unsuitable as a reliable attendance record. First, proxy signing is trivially easy — a student can sign on behalf of an absent classmate, and there is no way to verify the handwriting without cross-referencing a signature database. Second, aggregation is entirely manual: faculty must count present marks, compute percentages, identify shortage cases, and transcribe data into a digital system — a process that typically takes several hours per term per subject. Third, registers are physically fragile. They can be lost, damaged, or deliberately altered. There is no backup."),
    subHead("6.2 Biometric Systems"),
    body("Fingerprint and iris-based biometric systems solve the identity verification problem reliably — it is considerably more difficult to spoof a fingerprint scanner than to forge a signature. They are widely deployed in corporate offices and are increasingly appearing in government institutions. However, they introduce a different set of problems. The hardware cost of a networked fingerprint scanner ranges from ₹5,000 to ₹30,000 per unit, and a college with multiple entry points and departments needs several units. Maintenance contracts, sensor degradation over time, and the hygiene concern of thousands of users touching the same surface add to the total cost of ownership. Most critically, a biometric scan only records presence at the scanner terminal — it says nothing about where the person was five minutes after scanning."),
    subHead("6.3 RFID and Smart Card Systems"),
    body("RFID-based access control systems issue each employee or student a proximity card. Tapping the card at a reader records attendance. These systems are fast, require minimal user effort, and integrate well with access control infrastructure. The fundamental problem is that a card can be separated from its owner. It can be handed to a friend who taps it on your behalf. The system records that the card was present, not the person. Tailgating — entering a building immediately behind a valid cardholder without using your own card — is also a common bypass. RFID systems verify artefacts, not people."),
    subHead("6.4 QR Code Attendance"),
    body("QR code-based attendance became popular during and after the COVID-19 pandemic as a contact-free alternative. The typical workflow is that a teacher generates a time-limited QR code and displays it on a projector. Students scan the code with their phones, and the scan is registered as attendance. This approach is low-cost and platform-independent. However, the QR image can be photographed and shared over WhatsApp or Telegram instantaneously. A student sitting at home can receive the image from a classmate and scan it on their own device, falsely recording their presence."),
    subHead("6.5 Commercial GPS and Mobile App-Based Solutions"),
    body("Enterprise HR platforms such as greytHR, Darwinbox, Keka, and Zoho People include GPS-based attendance tracking as a feature. Their limitations in the context of small institutions are significant. First, they require the installation of a dedicated mobile application. Second, they are subscription-based and priced for enterprise scale, making them cost-prohibitive for a single college department or small startup. Third, they are closed systems — customisation and integration require vendor engagement and additional cost."),
    subHead("6.6 Summary of Gaps"),
    body("Across all five categories, the recurring gaps are: susceptibility to proxy attendance, requirement for dedicated hardware or a paid subscription, inability to verify ongoing physical presence rather than just point-of-entry, and limited audit trails. GeoTracker directly addresses each of these by using the browser's native Geolocation API to perform real-time spatial validation at the moment of check-in — no hardware, no app, no subscription, and a full coordinate-stamped audit log for every transaction."),
    gap(),

    sectionNum("7", "Proposed System / Methodology"),
    body("GeoTracker is structured as a modular single-page application (SPA) with clearly separated concerns. Each functional area is implemented as an independent service and UI component, making the system easy to test in isolation and straightforward to connect to a backend in a future iteration."),
    subHead("7.1 System Architecture Overview"),
    body("The application follows a layered architecture. At the top is the React component layer, which handles all rendering and user interaction. Below it is a service layer containing pure TypeScript functions for business logic — geofence validation, distance calculation, attendance recording, leave processing, and report generation. Data is currently held in a React context store that acts as an in-memory database. In a production deployment, the service layer functions would make HTTP calls to a REST API."),
    gap(0), screenshotBox("Fig. 7.1 – System Architecture Diagram (add block diagram here)"), gap(),

    subHead("7.2 Authentication Module"),
    body("Users access the system through a login screen that accepts a username and password. Upon successful authentication, a session object is stored in the browser's localStorage with the user's role (Admin or Employee), their unique ID, display name, and a session token. The application reads this token on load and routes the user directly to their dashboard without requiring a re-login."),
    body("Two test accounts exist in the demo: an admin account and an employee account. In a production version, credentials would be validated against a backend database, and the session token would be a cryptographically signed JWT with a configurable expiry window."),
    gap(0), screenshotBox("Fig. 7.2 – Login Screen (add screenshot here)"), gap(),

    subHead("7.3 Geofence Module"),
    body("The geofence module is the technical core of the system. Each employee is assigned a geofence record consisting of a centre point (latitude and longitude in decimal degrees) and a radius in metres. When a check-in is attempted, the module computes the great-circle distance between the device's current GPS coordinates and the geofence centre using the Haversine formula."),
    body("The Haversine formula calculates the shortest distance over the earth's surface between two points given their latitudes and longitudes, accounting for the curvature of the earth. For the distances involved in attendance validation (typically 10 to 500 metres), the formula gives accuracy well within the error margin of consumer GPS hardware. The formula is:"),
    body("d = 2R × arcsin(√(sin²(Δφ/2) + cos(φ₁) × cos(φ₂) × sin²(Δλ/2)))", { italics: true, color: "333333" }),
    body("Where φ is latitude in radians, λ is longitude in radians, R is the Earth's mean radius (6,371 km), and d is the calculated distance. If d is less than or equal to the configured radius, the check-in is approved."),

    subHead("7.4 Attendance Module"),
    body("The attendance module manages the check-in and check-out lifecycle. When an employee opens their dashboard and is not currently checked in, they see a green 'Check In' button. Tapping it triggers the following sequence: the browser calls navigator.geolocation.getCurrentPosition(), which prompts the user to grant location permission if not already granted, and then returns the device's current latitude, longitude, and accuracy estimate. The application passes these coordinates to the geofence module. If the check passes, an attendance record is created with the employee ID, check-in timestamp, and GPS coordinates."),
    body("Every attendance record is immutable once written. Neither the employee nor the admin can alter the timestamp or coordinates of an existing record. Records can only be added or, in the admin's case, annotated with a note."),
    gap(0), screenshotBox("Fig. 7.4 – Employee Dashboard with Check-In Button (add screenshot here)"), gap(),

    subHead("7.5 Admin Dashboard Module"),
    body("The admin dashboard provides a comprehensive view of the entire organisation's attendance state. The main panel lists every registered employee with their current check-in status (Present / Absent), today's check-in and check-out times if applicable, and a link to their full attendance history. A secondary panel shows pending leave requests that require action. A configuration panel allows the admin to add new employees, edit existing geofences, and deactivate accounts."),
    gap(0), screenshotBox("Fig. 7.5 – Admin Dashboard Overview (add screenshot here)"), gap(),

    subHead("7.6 Leave Management Module"),
    body("The leave management module provides a structured workflow for absence management. An employee submits a leave request by selecting the leave type (Casual Leave, Medical Leave, or Other), choosing a start date and end date, and providing a reason in a free-text field. The submitted request appears in the admin's dashboard as Pending. The admin reviews it and either approves or rejects it, optionally adding a comment."),
    body("The module also maintains a leave balance summary for each employee, showing how many days of each leave type have been consumed in the current month and year."),

    subHead("7.7 Reporting Module"),
    body("The reporting module aggregates attendance records into two types of output. The first is a monthly attendance calendar — a grid showing each day of the selected month, colour-coded green for days the employee was present, red for absent days, and grey for weekends or holidays. The second is a working hours report showing the total number of minutes worked in the selected period, the number of days present, the attendance percentage, and the average daily hours."),
    gap(0), screenshotBox("Fig. 7.7 – Monthly Attendance Calendar View (add screenshot here)"), gap(),
    sectionNum("8", "Requirements"),
    subHead("8.1 Hardware Requirements"),
    body("One of the deliberate design goals of GeoTracker is to avoid any hardware dependency beyond what users already carry. The only hardware requirement is a device with a GPS receiver and a modern browser."),
    bullet("Any Android smartphone running Android 8.0 or later with Chrome 80+."),
    bullet("Any iPhone or iPad running iOS 13.0 or later with Safari 13+ or Chrome for iOS."),
    bullet("Any laptop or desktop with a browser that supports the HTML5 Geolocation API."),
    bullet("Minimum 2 GB RAM and a stable internet connection for the initial page load."),
    subHead("8.2 Software Requirements"),
    new Table({
      width: { size: 9026, type: WidthType.DXA }, columnWidths: [2500, 2500, 4026],
      rows: [
        new TableRow({ children: [
          new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 2500, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: "Component", bold: true, size: 22, font: "Arial", color: "FFFFFF" })] })] }),
          new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 2500, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: "Technology / Version", bold: true, size: 22, font: "Arial", color: "FFFFFF" })] })] }),
          new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 4026, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: "Purpose", bold: true, size: 22, font: "Arial", color: "FFFFFF" })] })] })
        ]}),
        ...[
          ["Frontend Framework","React 18 (TSX)","Component-based UI; hooks for state management"],
          ["Language","TypeScript 5","Static typing for all entities and service functions"],
          ["Build Tool","Vite 5","Fast HMR in development; optimised production bundle"],
          ["Styling","Tailwind CSS","Utility-first CSS; responsive design without custom stylesheets"],
          ["Geolocation","HTML5 Geolocation API","Browser-native GPS access; no third-party SDK needed"],
          ["Containerisation","Docker","One-command deployment to any cloud or server"],
          ["Runtime (Dev)","Node.js 18+","Local development server and package management"],
          ["Version Control","Git / GitHub","Source code management and collaboration"],
        ].map(([comp, tech, purpose], i) => new TableRow({ children: [
          new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, shading: { fill: i%2===0?"EBF3FB":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 2500, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: comp, size: 22, font: "Arial" })] })] }),
          new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, shading: { fill: i%2===0?"EBF3FB":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 2500, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: tech, size: 22, font: "Arial" })] })] }),
          new TableCell({ borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }, shading: { fill: i%2===0?"EBF3FB":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 4026, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: purpose, size: 22, font: "Arial" })] })] })
        ]}))
      ]
    }),
    gap(),

    sectionNum("9", "Expected Output / Results"),
    body("The expected outcomes of the GeoTracker project span the user experience, system behaviour, and data quality dimensions."),
    subHead("9.1 Employee Experience"),
    body("An employee arrives at the office or college campus, opens GeoTracker in their browser, and is immediately recognised by the saved session. Their dashboard shows their name, today's attendance status, and the large Check In button. They tap it. Within two to three seconds, the browser has fetched their GPS coordinates, validated their position against the geofence, created an attendance record, and updated the dashboard to show 'Checked In at 09:14 AM'."),
    body("If the employee is at home and taps Check In, they see a message: 'You are 4.2 km from your assigned location. Attendance can only be marked within 200 metres.' This unambiguous feedback removes any uncertainty about why the check-in failed."),
    subHead("9.2 Admin Experience"),
    body("The admin logs in and sees the team overview: eight employees, six checked in, two absent, one leave request pending. They click on the pending request, review the dates and reason, and approve it with a note. The employee's leave balance updates automatically. They pull up last month's attendance report for the department — a single screen showing each employee's attendance percentage, total working hours, and days present."),
    subHead("9.3 System Outputs"),
    bullet("A continuously updated attendance log with employee ID, date, check-in time, check-out time, session duration, and GPS coordinates."),
    bullet("Monthly attendance calendars for each employee with present/absent/leave day classification."),
    bullet("Working hours statistics: total hours, average daily hours, and attendance percentage."),
    bullet("Leave management records: all requests with their type, date range, reason, status, and approver details."),
    bullet("Real-time dashboard tiles showing current check-in status across the organisation for admin oversight."),
    gap(0), screenshotBox("Fig. 9.3 – Attendance Log View with Timestamps and Coordinates (add screenshot here)"), gap(),

    sectionNum("10", "Applications"),
    body("GeoTracker's approach — location-anchored attendance without hardware dependency — makes it applicable across a wide range of sectors."),
    subHead("10.1 Educational Institutions"),
    body("Colleges and schools represent the most immediate application. Student attendance is a regulatory requirement under university and UGC guidelines, and manual management consumes significant faculty time every semester. GeoTracker can be deployed campus-wide with individual class geofences, allowing faculty to verify that students are in the correct building before a lecture is marked."),
    subHead("10.2 Corporate Offices"),
    body("Fixed-office organisations can use GeoTracker to ensure employees check in only from the office premises. Unlike biometric systems, there is no hardware to install at the door — employees use their own phones. Hybrid work policies can be accommodated by configuring multiple geofences per employee."),
    subHead("10.3 Field Operations and Sales Teams"),
    body("Field engineers, sales representatives, and delivery personnel frequently work across multiple client sites. GeoTracker can be configured with site-specific geofences assigned to an employee's schedule for that day. When the employee checks in from the client site, the system records not just that they are present but exactly where they are."),
    subHead("10.4 Healthcare and Shift-Based Work"),
    body("Hospitals, nursing homes, and care facilities operate in shifts around the clock. Accurate shift attendance is critical for patient safety and regulatory compliance. GeoTracker's real-time check-in and working-hours tracking is well-suited to shift management."),
    subHead("10.5 Government and Public Sector"),
    body("Government offices at the district and block level frequently lack the infrastructure for biometric or RFID systems but have decent smartphone penetration. GeoTracker's browser-based approach means it can be deployed over a basic internet connection with no hardware procurement."),
    gap(),

    sectionNum("11", "Advantages"),
    bullet("Hardware-free deployment: No scanners, readers, or terminals to purchase, install, or maintain. The smartphone in every user's pocket is the only device required."),
    bullet("Platform independence: Works identically on Android, iOS, Windows, and macOS through any modern browser. There is no platform-specific code or app-store dependency."),
    bullet("Structural proxy resistance: Attendance is tied to a GPS coordinate at the moment of check-in. To fake a check-in, a user would need to physically be in the geofenced area."),
    bullet("Minimal user effort: The entire check-in workflow is a single button tap that completes in under five seconds."),
    bullet("Full audit trail: Every check-in records the exact timestamp and GPS coordinates. There is always a verifiable record for dispute resolution."),
    bullet("Cost-effective: The system can be self-hosted on a ₹500/month VPS. There are no licensing fees or per-user subscription costs."),
    bullet("Open and extensible architecture: The frontend codebase is modular and well-typed. Adding a persistent backend, new reporting features, or additional leave types is straightforward."),
    bullet("Privacy-conscious: GPS coordinates are used only at the moment of check-in to validate geofence proximity. The system does not track continuous movement or location history."),
    gap(),
    sectionNum("12", "Limitations"),
    body("Being transparent about limitations is as important as highlighting strengths. The following constraints exist in the current version and inform the roadmap for the next iteration."),
    bullet("No persistent storage: All data is held in browser memory and is erased when the page is refreshed. This makes the current version suitable only as a demonstration prototype."),
    bullet("Client-side geofence validation: Because the geofence check runs in the browser, a technically sophisticated user with GPS spoofing software could report false coordinates."),
    bullet("Indoor GPS accuracy: Consumer GPS hardware performs poorly inside large buildings. Accuracy can degrade from ±5 metres outdoors to ±50 metres or more indoors."),
    bullet("Single geofence per employee: The current data model supports one geofence per user. Multi-site scenarios are not accommodated."),
    bullet("No notification system: The admin has to proactively check the dashboard for pending leave requests. There is no email, SMS, or push notification triggered by system events."),
    bullet("Browser location permission dependency: If a user denies location permission in their browser, the check-in fails entirely."),
    bullet("No offline support: The application requires an internet connection to load."),
    gap(),

    sectionNum("13", "Future Scope"),
    body("The current demo establishes the core concept and user experience. The following roadmap describes how the system will evolve into a production-grade platform."),
    subHead("13.1 Backend and Database Integration"),
    body("The most immediate next step is adding a RESTful backend API using Node.js and Express, connected to a PostgreSQL relational database. All data — users, geofences, attendance records, leave requests — will be persisted server-side. The frontend service layer is already structured to make HTTP calls; swapping these out for API calls is the primary migration task."),
    subHead("13.2 Secure Authentication with JWT"),
    body("The current localStorage-based session will be replaced with JSON Web Token authentication. The server will issue a short-lived access token and a longer-lived refresh token on login. Password hashing using bcrypt will be implemented at the database layer."),
    subHead("13.3 Server-Side Geofence Validation"),
    body("To prevent GPS spoofing, geofence validation will be moved from the browser to the backend. The client will send GPS coordinates to the server, which performs the Haversine calculation against the database-stored geofence and returns a validated attendance record."),
    subHead("13.4 Multi-Geofence and Scheduling Support"),
    body("The data model will be extended to support multiple geofences per employee and time-scheduled geofence assignments. A faculty member could be assigned to Building A on Monday and Wednesday and Building B on Tuesday and Thursday."),
    subHead("13.5 Notification System"),
    body("An event-driven notification layer will be integrated using NodeMailer for email and a third-party SMS gateway. Notifications will be triggered for leave request status changes, attendance shortage warnings, and weekly/monthly attendance report delivery."),
    subHead("13.6 Progressive Web App (PWA)"),
    body("The application will be packaged as a Progressive Web App, enabling home-screen installation on mobile devices, background sync for check-in records created while offline, and push notification support on Android devices without requiring a native app."),
    subHead("13.7 Analytics and AI-Assisted Insights"),
    body("A data analytics layer will be added to visualise attendance trends at the individual, department, and organisation level. This will include weekly and monthly trend charts, heatmaps of check-in times, and anomaly detection for unusual patterns."),
    subHead("13.8 Face Recognition as Secondary Verification"),
    body("As a future security enhancement, a secondary verification step using face recognition via the browser's Camera API and a lightweight on-device machine learning model (e.g., face-api.js) could be added for high-security environments."),
    gap(),

    sectionNum("14", "Conclusion"),
    body("Attendance management is a deceptively simple problem — it feels administrative and unglamorous, but its consequences are significant. An inaccurate attendance record affects a student's eligibility to appear for exams, an employee's salary, and an organisation's compliance obligations. Solving it properly requires more than digitising the paper register; it requires rethinking what verification actually means."),
    body("GeoTracker takes the position that presence verification must be tied to physical location, not to a token that can be borrowed or shared. By using the GPS receiver that every smartphone user already carries, and validating it against a configurable geofence through the Haversine formula, the system makes proxy attendance structurally difficult without adding any hardware burden, subscription cost, or app installation requirement."),
    body("The current demonstration prototype proves that the core concept works — the geofence validation is accurate, the dual-role interface is intuitive, and the leave management workflow handles the most common HR scenarios cleanly. The limitations are known, documented, and mapped to a clear development roadmap. The frontend codebase is designed to accept a backend without architectural changes, meaning the path from demo to production is a matter of engineering execution rather than conceptual redesign."),
    body("More broadly, this project demonstrates how design thinking — starting with genuine empathy for both students who want a frictionless experience and administrators who need reliable data — leads to a solution that serves both sets of needs without compromise."),
    gap(),

    sectionNum("15", "References"),
    bullet("[1] MDN Web Docs – Geolocation API. https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API"),
    bullet("[2] React Documentation – React 18. https://react.dev/"),
    bullet("[3] Vite Build Tool Documentation. https://vitejs.dev/"),
    bullet("[4] TypeScript Handbook. https://www.typescriptlang.org/docs/"),
    bullet("[5] Tailwind CSS Documentation. https://tailwindcss.com/docs/"),
    bullet("[6] GeoTracker Demo – Source Code. https://github.com/Vishwajit-29/GeoTracker-Demo"),
    bullet("[7] R.S. Pressman – Software Engineering: A Practitioner's Approach, 8th ed., McGraw-Hill, 2014."),
    bullet("[8] W.G. van Steen, A.S. Tanenbaum – Distributed Systems: Principles and Paradigms, 3rd ed., Pearson, 2017."),
    bullet("[9] C.H.D. Villanueva, J.B. Tano – GPS-based Attendance Monitoring System for College Students, IJACSA, Vol. 10, No. 3, 2019."),
    bullet("[10] American Payroll Association – Buddy Punching Survey, APA Annual Congress Proceedings, 2021."),
    bullet("[11] W3C Geolocation API Specification. https://www.w3.org/TR/geolocation/"),
    bullet("[12] Sinnott, R.W. – Virtues of the Haversine, Sky and Telescope, Vol. 68, No. 2, p. 159, 1984."),
  ];
}

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }
      ]
    }]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    children: [
      ...frontPage(),
      ...mainContent()
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/home/thor/testGeo/GeoTracker-Demo/GeoTracker_Synopsis.docx', buf);
  console.log('Done! Written to GeoTracker_Synopsis.docx');
});
