// Admin authentication and session management
class AdminAuth {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.checkSession();
        this.setupEventListeners();
    }

    // Check if user is already logged in
    checkSession() {
        const session = localStorage.getItem('adminSession');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = Date.now();

                // Check if session is still valid
                if (now - sessionData.timestamp < this.sessionTimeout) {
                    this.isLoggedIn = true;
                    this.currentUser = sessionData.user;
                    this.updateUI();
                    return;
                } else {
                    // Session expired
                    this.logout();
                }
            } catch (error) {
                console.error('Error parsing session data:', error);
                this.logout();
            }
        }
    }

    // Setup event listeners for login form
    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Auto-logout on page unload (optional)
        window.addEventListener('beforeunload', () => {
            // Could implement auto-logout logic here if needed
        });
    }

    // Handle login form submission
    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Show loading state
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Connexion en cours...';
        submitBtn.disabled = true;

        try {
            // For demo purposes, using hardcoded credentials
            // In production, this should be an API call
            const validCredentials = await this.validateCredentials(email, password);

            if (validCredentials) {
                this.login({
                    email: email,
                    name: 'Admin MBAAL',
                    role: 'administrator'
                }, rememberMe);

                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                this.showError('Email ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Erreur de connexion. Veuillez réessayer.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Validate credentials (demo implementation)
    async validateCredentials(email, password) {
        // Demo credentials - replace with actual API call
        const demoCredentials = {
            email: 'admin@mbaal.com',
            password: 'admin123'
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return email === demoCredentials.email && password === demoCredentials.password;
    }

    // Login user and create session
    login(userData, rememberMe = false) {
        this.isLoggedIn = true;
        this.currentUser = userData;

        const sessionData = {
            user: userData,
            timestamp: Date.now(),
            rememberMe: rememberMe
        };

        localStorage.setItem('adminSession', JSON.stringify(sessionData));

        // Set session timeout if not remembering
        if (!rememberMe) {
            setTimeout(() => {
                this.logout();
            }, this.sessionTimeout);
        }

        this.updateUI();
    }

    // Logout user
    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('adminSession');

        // Redirect to login if on admin pages
        if (window.location.pathname.includes('/admin/')) {
            window.location.href = 'login.html';
        }

        this.updateUI();
    }

    // Update UI based on authentication state
    updateUI() {
        const loginElements = document.querySelectorAll('.login-only');
        const adminElements = document.querySelectorAll('.admin-only');

        if (this.isLoggedIn) {
            loginElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = 'block');

            // Update user info if available
            const userNameElement = document.getElementById('userName');
            if (userNameElement && this.currentUser) {
                userNameElement.textContent = this.currentUser.name;
            }
        } else {
            loginElements.forEach(el => el.style.display = 'block');
            adminElements.forEach(el => el.style.display = 'none');
        }
    }

    // Show error message
    showError(message) {
        const errorElement = document.getElementById('loginError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';

            // Hide error after 5 seconds
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }

    // Check if user has required role
    hasRole(role) {
        return this.isLoggedIn && this.currentUser && this.currentUser.role === role;
    }

    // Get current user data
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if session is active
    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Initialize admin authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuth();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminAuth;
}