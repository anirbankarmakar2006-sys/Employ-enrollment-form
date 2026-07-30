The output link provided in the below : 

https://anirbankarmakar2006-sys.github.io/Employ-enrollment-form/

# Nexora Technologies - Employee Enrollment & HR Management System

A comprehensive, fully responsive front-end web application designed for employee registration, application tracking, and HR administration. This project operates entirely on the client side, utilizing `localStorage` for data persistence, making it easy to deploy and test without a backend server.

## 🚀 Features

### 👨‍💼 Employee Portal
* **Landing Page:** Professional corporate landing page with navigation and quick links.
* **Secure Registration & Login:** User authentication simulation with CAPTCHA and OTP verification.
* **Application Form:** Multi-step, comprehensive form capturing:
  * Personal & Family Information
  * Address Details
  * Educational Qualifications
  * Work Experience & Technical Skills
  * Document Uploads (Simulated)
* **Auto-Save Drafts:** Automatically saves form progress using local storage so users don't lose their data.
* **Application Tracking:** Generates unique Application and Employee IDs upon successful submission.

### 🛡️ Administrator Dashboard
* **Admin Authentication:** Secure admin login portal with CAPTCHA validation.
* **HR Dashboard:** Overview of total employees, new applications, pending reviews, and approved candidates.
* **Employee Management:** View, approve, reject, or delete employee applications. 
* **Data Filtering:** Search employees by ID, Name, or Email, and filter by Department or Status.
* **Privacy Controls:** Restricted views for sensitive data (e.g., masked mobile numbers and addresses in the admin view).

### 🎨 UI/UX Highlights
* **Responsive Design:** Mobile-first approach ensuring seamless experience across desktops, tablets, and smartphones.
* **Interactive Elements:** Modal popups, toast notifications, loading overlays, and dynamic OTP generation.
* **Print-Friendly:** Custom CSS print media queries for generating clean PDF receipts and application profiles.

## 🛠️ Tech Stack
* **HTML5:** Semantic markup and structuring.
* **CSS3:** Custom properties (variables), CSS Grid & Flexbox, animations, and responsive media queries.
* **JavaScript (ES6):** DOM manipulation, form validation, event handling, and state management using `localStorage`.
* **Icons & Fonts:** FontAwesome 6 (Icons) and Google Fonts (Poppins).

## 📂 File Structure

* `index.html` - Corporate landing page and navigation hub.
* `register.html` - Employee account creation portal.
* `login.html` - Employee authentication page.
* `application.html` - Main enrollment and data collection form.
* `success.html` - Post-submission confirmation and receipt page.
* `admin-login.html` - HR Administrator login portal.
* `admin-dashboard.html` - Centralized management dashboard for HR.
* `style.css` - Global stylesheet containing all UI designs, resets, and responsive layouts.
* `script.js` - Core JavaScript logic for form handling, validation, and local database simulation.

## ⚙️ Setup & Installation

Since this project relies entirely on front-end technologies and `localStorage`, no local server or backend configuration is required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/nexora-employee-enrollment.git
   ```
2. **Navigate to the project folder:**
   ```bash
   cd nexora-employee-enrollment
   ```
3. **Run the application:**
   Simply double-click `index.html` to open it in your default web browser.

## 🔐 Demo Credentials

To test the Administrator Dashboard, use the following hardcoded credentials on the `admin-login.html` page:

* **Username:** `admin`
* **Password:** `admin123`
*(Note: CAPTCHA must also be entered correctly to log in).*

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
