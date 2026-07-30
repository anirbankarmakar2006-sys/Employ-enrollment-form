/**
 * Nexora Technologies - Employee Enrollment & HR Management System
 * script.js - Comprehensive JavaScript Logic (Updated)
 */

/* =========================================================
   Part 1 – Global Variables, Initialization, Utility Functions
========================================================= */
const DB_EMPLOYEES = 'nexora_employees';
const DB_APPLICATIONS = 'nexora_applications';
const DB_ADMIN_SESSION = 'nexora_admin_session';
const DB_USER_SESSION = 'nexora_user_session';
const DRAFT_APP = 'nexora_draft_app';

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Utility to safely get DOM elements
const getEl = (id) => document.getElementById(id);

// Generate unique IDs
const generateId = (prefix) => prefix + Math.floor(100000 + Math.random() * 900000);

// Get data from LocalStorage
const getStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

/* =========================================================
   Part 17 – Toast Notifications, Modals & Loader 
========================================================= */
function showLoader() {
    if (getEl('loadingOverlay')) getEl('loadingOverlay').style.display = 'flex';
}

function hideLoader() {
    if (getEl('loadingOverlay')) getEl('loadingOverlay').style.display = 'none';
}

function showToast(message, type = 'success') {
    const toast = getEl('toastNotification');
    const msg = getEl('toastMessage');
    if (toast && msg) {
        toast.className = `toast-notification toast-${type} show`;
        msg.textContent = message;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    } else {
        alert(message);
    }
}

function openModal(modalId) {
    if (getEl(modalId)) getEl(modalId).classList.add('active');
}

function closeModal(modalId) {
    if (getEl(modalId)) getEl(modalId).classList.remove('active');
}

// Global modal close listeners
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-modal')) {
        e.target.closest('.modal').classList.remove('active');
    }
});

/* =========================================================
   Part 3 – CAPTCHA Generation & Validation
========================================================= */
let currentCaptcha = '';

function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    currentCaptcha = Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    ['registerCaptcha', 'loginCaptcha', 'adminCaptcha'].forEach(id => {
        if (getEl(id)) getEl(id).textContent = currentCaptcha;
    });
}

function validateCaptcha(inputId) {
    const input = getEl(inputId);
    if (!input) return true;
    return input.value.trim() === currentCaptcha;
}

// Bind CAPTCHA refresh buttons
['refreshRegisterCaptcha', 'refreshLoginCaptcha', 'refreshAdminCaptcha'].forEach(id => {
    if (getEl(id)) getEl(id).addEventListener('click', generateCaptcha);
});

/* =========================================================
   Part 4 – Dynamic OTP Generation
========================================================= */
// Generates a new random OTP on every click
function setupDynamicOtp(btnId, type) {
    const btn = getEl(btnId);
    if (btn) {
        btn.addEventListener('click', () => {
            const dynamicOtp = Math.floor(100000 + Math.random() * 900000).toString();
            showToast(`${type} OTP sent successfully! (OTP: ${dynamicOtp})`, 'info');
            
            btn.textContent = 'OTP Sent';
            btn.disabled = true;
            
            // Allow resending after 30 seconds
            setTimeout(() => { 
                btn.textContent = 'Resend OTP'; 
                btn.disabled = false; 
            }, 30000);
        });
    }
}

// Registration OTPs
setupDynamicOtp('sendEmailOtp', 'Email');
setupDynamicOtp('sendMobileOtp', 'Mobile');
// Login OTP
setupDynamicOtp('sendLoginOtp', 'Login');

/* =========================================================
   Part 2 – Registration Form Validation
========================================================= */
const registerForm = getEl('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateCaptcha('captchaInput')) {
            showToast('Invalid CAPTCHA. Please try again.', 'error');
            generateCaptcha();
            return;
        }

        const pass = getEl('password').value;
        const confirmPass = getEl('confirmPassword').value;

        if (pass !== confirmPass) {
            showToast('Passwords do not match.', 'error');
            return;
        }

        showLoader();
        setTimeout(() => {
            const users = getStorage(DB_EMPLOYEES);
            const newUser = {
                id: generateId('EMP'),
                firstName: getEl('firstName').value,
                lastName: getEl('lastName').value,
                email: getEl('email').value,
                mobile: getEl('mobile').value,
                password: pass,
                status: 'Registered',
                applied: false
            };
            
            users.push(newUser);
            setStorage(DB_EMPLOYEES, users);
            
            hideLoader();
            showToast('Registration successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'login.html', 1500);
        }, 1000);
    });
}

/* =========================================================
   Part 5 – Employee Login System
========================================================= */
const loginForm = getEl('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateCaptcha('loginCaptchaInput')) {
            showToast('Invalid CAPTCHA.', 'error');
            generateCaptcha();
            return;
        }

        const loginId = getEl('loginId').value;
        const pass = getEl('loginPassword').value;
        
        showLoader();
        setTimeout(() => {
            const users = getStorage(DB_EMPLOYEES);
            const user = users.find(u => (u.email === loginId || u.mobile === loginId) && u.password === pass);
            
            hideLoader();
            if (user) {
                sessionStorage.setItem(DB_USER_SESSION, JSON.stringify(user));
                showToast('Login successful!', 'success');
                setTimeout(() => window.location.href = 'application.html', 1000);
            } else {
                showToast('Invalid credentials.', 'error');
            }
        }, 1000);
    });
}

/* =========================================================
   Part 6 – Application Form Logic
========================================================= */
const appForm = getEl('applicationForm');
const sameAddressChk = getEl('sameAddress');

if (sameAddressChk) {
    sameAddressChk.addEventListener('change', (e) => {
        if (e.target.checked) {
            getEl('permanentAddress').value = getEl('currentAddress').value;
            getEl('permanentCity').value = getEl('currentCity').value;
            getEl('permanentState').value = getEl('currentState').value;
            getEl('permanentPincode').value = getEl('currentPincode').value;
        } else {
            getEl('permanentAddress').value = '';
            getEl('permanentCity').value = '';
            getEl('permanentState').value = '';
            getEl('permanentPincode').value = '';
        }
    });
}

/* =========================================================
   Part 7 – Auto Save & LocalStorage
========================================================= */
const saveDraftBtn = getEl('saveDraftBtn');
if (saveDraftBtn && appForm) {
    saveDraftBtn.addEventListener('click', () => {
        const formData = new FormData(appForm);
        const dataObj = Object.fromEntries(formData.entries());
        localStorage.setItem(DRAFT_APP, JSON.stringify(dataObj));
        showToast('Draft saved successfully.', 'info');
    });

    window.addEventListener('DOMContentLoaded', () => {
        const draft = JSON.parse(localStorage.getItem(DRAFT_APP));
        if (draft) {
            Object.keys(draft).forEach(key => {
                const input = appForm.elements[key];
                if (input && input.type !== 'file') input.value = draft[key];
            });
        }
    });
}

/* =========================================================
   Part 8 – File Upload Preview
========================================================= */
const fileInputs = ['profilePhoto', 'resumeFile'];
fileInputs.forEach(id => {
    const input = getEl(id);
    if (input) {
        input.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const size = (this.files[0].size / 1024 / 1024).toFixed(2);
                showToast(`Selected file: ${this.files[0].name} (${size} MB)`, 'info');
            }
        });
    }
});

/* =========================================================
   Part 9 – Application Submission
========================================================= */
if (appForm) {
    appForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showLoader();

        const currentUser = JSON.parse(sessionStorage.getItem(DB_USER_SESSION));
        
        setTimeout(() => {
            const apps = getStorage(DB_APPLICATIONS);
            const formData = new FormData(appForm);
            const dataObj = Object.fromEntries(formData.entries());
            
            dataObj.applicationId = generateId('APP');
            dataObj.employeeId = currentUser ? currentUser.id : generateId('EMP');
            dataObj.status = 'Pending';
            dataObj.date = new Date().toLocaleDateString();
            
            apps.push(dataObj);
            setStorage(DB_APPLICATIONS, apps);
            
            if (currentUser) {
                const users = getStorage(DB_EMPLOYEES);
                const uIndex = users.findIndex(u => u.id === currentUser.id);
                if (uIndex > -1) {
                    users[uIndex].applied = true;
                    setStorage(DB_EMPLOYEES, users);
                }
            }

            localStorage.removeItem(DRAFT_APP);
            sessionStorage.setItem('lastAppId', dataObj.applicationId);
            sessionStorage.setItem('lastEmpId', dataObj.employeeId);

            hideLoader();
            window.location.href = 'success.html';
        }, 1500);
    });
}

/* =========================================================
   Part 10 – Success Page Data
========================================================= */
if (window.location.pathname.includes('success.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const appId = sessionStorage.getItem('lastAppId');
        const empId = sessionStorage.getItem('lastEmpId');
        
        if (appId) getEl('successApplicationId').textContent = appId;
        if (empId) getEl('successEmployeeId').textContent = empId;
        if (getEl('successSubmissionDate')) getEl('successSubmissionDate').textContent = new Date().toLocaleDateString();
    });
}

/* =========================================================
   Part 11 – Admin Login (OTP Removed)
========================================================= */
const adminLoginForm = getEl('adminLoginForm');
if (adminLoginForm) {
    // Hide OTP box visually if it exists in the HTML
    const adminOtpInput = getEl('adminOtp');
    if (adminOtpInput) {
        const otpBox = adminOtpInput.closest('.admin-otp-box');
        if (otpBox) otpBox.style.display = 'none';
        
        // Also hide the title right above the OTP box if possible
        const sectionTitles = document.querySelectorAll('.form-section-title');
        sectionTitles.forEach(title => {
            if (title.textContent.includes('OTP')) title.style.display = 'none';
        });
    }

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateCaptcha('adminCaptchaInput')) {
            showToast('Invalid CAPTCHA.', 'error');
            generateCaptcha();
            return;
        }

        const user = getEl('adminUsername').value;
        const pass = getEl('adminPassword').value;

        showLoader();
        setTimeout(() => {
            hideLoader();
            if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
                sessionStorage.setItem(DB_ADMIN_SESSION, 'true');
                showToast('Welcome Administrator!', 'success');
                setTimeout(() => window.location.href = 'admin-dashboard.html', 1000);
            } else {
                showToast('Invalid Administrator Credentials!', 'error');
            }
        }, 1000);
    });
}

/* =========================================================
   Part 12 – Admin Dashboard (Load Employees)
========================================================= */
function loadDashboardData() {
    const tableBody = getEl('employeeTableBody');
    if (!tableBody) return;

    const apps = getStorage(DB_APPLICATIONS);
    tableBody.innerHTML = '';

    apps.forEach((app, index) => {
        const statusClass = app.status ? app.status.toLowerCase() : 'pending';
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${app.employeeId}</td>
                <td>${app.firstName || 'Applicant'} ${app.lastName || ''}</td>
                <td>${app.email || 'N/A'}</td>
                <td>${app.department || 'N/A'}</td>
                <td>*** Restricted ***</td> <!-- Masked Mobile -->
                <td><span class="status ${statusClass}">${app.status || 'Pending'}</span></td>
                <td>
                    <button class="table-btn view-btn" onclick="viewApplication('${app.applicationId}')"><i class="fa-solid fa-eye"></i></button>
                    ${app.status === 'Pending' ? `
                        <button class="table-btn approve-btn" onclick="updateStatus('${app.applicationId}', 'Approved')"><i class="fa-solid fa-check"></i></button>
                        <button class="table-btn reject-btn" onclick="updateStatus('${app.applicationId}', 'Rejected')"><i class="fa-solid fa-xmark"></i></button>
                    ` : ''}
                    <button class="table-btn delete-btn" onclick="deleteApplication('${app.applicationId}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    updateDashboardStats(apps);
}

/* =========================================================
   Part 13 – CRUD Operations & Restricted Admin View
========================================================= */
window.updateStatus = function(appId, newStatus) {
    const apps = getStorage(DB_APPLICATIONS);
    const index = apps.findIndex(a => a.applicationId === appId);
    if (index > -1) {
        apps[index].status = newStatus;
        setStorage(DB_APPLICATIONS, apps);
        showToast(`Application ${newStatus}!`, newStatus === 'Approved' ? 'success' : 'warning');
        loadDashboardData();
    }
};

window.deleteApplication = function(appId) {
    if(confirm('Are you sure you want to delete this record?')) {
        let apps = getStorage(DB_APPLICATIONS);
        apps = apps.filter(a => a.applicationId !== appId);
        setStorage(DB_APPLICATIONS, apps);
        showToast('Record deleted.', 'info');
        loadDashboardData();
    }
};

window.viewApplication = function(appId) {
    const apps = getStorage(DB_APPLICATIONS);
    const app = apps.find(a => a.applicationId === appId);
    
    if (app) {
        // Safe standard details
        if(getEl('modalEmployeeName')) getEl('modalEmployeeName').textContent = `${app.firstName || 'N/A'} ${app.lastName || ''}`;
        if(getEl('modalEmployeeId')) getEl('modalEmployeeId').textContent = app.employeeId;
        if(getEl('modalDepartment')) getEl('modalDepartment').textContent = app.department || 'N/A';
        if(getEl('modalEmail')) getEl('modalEmail').textContent = app.email || 'N/A';
        
        if(getEl('modalStatus')) {
            getEl('modalStatus').textContent = app.status;
            getEl('modalStatus').className = `status ${app.status.toLowerCase()}`;
        }
        
        // Restricted / Hidden Details (Privacy enforcement)
        if(getEl('modalMobile')) getEl('modalMobile').innerHTML = '<span style="color:red; font-weight:bold;">*** Restricted View ***</span>';
        if(getEl('modalDob')) getEl('modalDob').innerHTML = '<span style="color:red; font-weight:bold;">*** Restricted View ***</span>';
        if(getEl('modalAddress')) getEl('modalAddress').innerHTML = '<span style="color:red; font-weight:bold;">*** Address Hidden for Privacy ***</span>';

        openModal('employeeModal');
    }
};

/* =========================================================
   Part 14 – Search, Filter & Pagination
========================================================= */
const employeeSearch = getEl('employeeSearch');
const departmentFilter = getEl('departmentFilter');
const statusFilter = getEl('statusFilter');

function applyFilters() {
    const term = employeeSearch ? employeeSearch.value.toLowerCase() : '';
    const dept = departmentFilter ? departmentFilter.value : '';
    const stat = statusFilter ? statusFilter.value : '';

    const rows = document.querySelectorAll('#employeeTableBody tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const matchesSearch = text.includes(term);
        const matchesDept = dept === '' || row.cells[4].innerText === dept;
        const matchesStat = stat === '' || row.cells[6].innerText.trim() === stat;

        row.style.display = (matchesSearch && matchesDept && matchesStat) ? '' : 'none';
    });
}

if (employeeSearch) employeeSearch.addEventListener('keyup', applyFilters);
if (departmentFilter) departmentFilter.addEventListener('change', applyFilters);
if (statusFilter) statusFilter.addEventListener('change', applyFilters);

/* =========================================================
   Part 15 – Dashboard Statistics
========================================================= */
function updateDashboardStats(apps) {
    if (!getEl('totalEmployees')) return;
    
    let approved = 0, pending = 0, rejected = 0;
    
    apps.forEach(app => {
        if (app.status === 'Approved') approved++;
        if (app.status === 'Pending') pending++;
        if (app.status === 'Rejected') rejected++;
    });

    getEl('totalEmployees').textContent = apps.length;
    getEl('newApplications').textContent = apps.length;
    getEl('pendingReview').textContent = pending;
    getEl('approvedApplications').textContent = approved;
}

/* =========================================================
   Part 16 – Charts & Reports
========================================================= */
const downloadReportsBtn = getEl('downloadReports');
if (downloadReportsBtn) {
    downloadReportsBtn.addEventListener('click', () => {
        showLoader();
        setTimeout(() => {
            hideLoader();
            showToast('Report downloaded successfully!', 'success');
        }, 1500);
    });
}

/* =========================================================
   Part 18 – Session Management & Final Initialization
========================================================= */
function initApp() {
    generateCaptcha();

    // Check Admin Session Authorization
    if (window.location.pathname.includes('admin-dashboard.html')) {
        if (!sessionStorage.getItem(DB_ADMIN_SESSION)) {
            window.location.href = 'admin-login.html';
        } else {
            loadDashboardData();
        }
    }

    // Check Employee Session Authorization pre-fills
    if (window.location.pathname.includes('application.html')) {
        const user = sessionStorage.getItem(DB_USER_SESSION);
        if (user) {
            const uData = JSON.parse(user);
            if (getEl('firstName')) getEl('firstName').value = uData.firstName || '';
            if (getEl('lastName')) getEl('lastName').value = uData.lastName || '';
            if (getEl('email')) getEl('email').value = uData.email || '';
            if (getEl('mobile')) getEl('mobile').value = uData.mobile || '';
            if (getEl('employeeId')) getEl('employeeId').value = uData.id || '';
        }
    }
}

// Password visibility toggle functionality
document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

window.addEventListener('DOMContentLoaded', initApp);
