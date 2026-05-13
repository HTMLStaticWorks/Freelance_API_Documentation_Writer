document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // --- Theme & RTL Logic ---
    const htmlElement = document.documentElement;
    const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-sidebar');
    const rtlToggles = document.querySelectorAll('#rtl-toggle, #rtl-toggle-sidebar');

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            const span = toggle.querySelector('span');
            if (theme === 'dark') {
                if (icon) icon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill') || icon.classList.replace('bi-moon-stars', 'bi-sun');
                if (span) span.textContent = 'Light Mode';
            } else {
                if (icon) icon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill') || icon.classList.replace('bi-sun', 'bi-moon-stars');
                if (span) span.textContent = 'Dark Mode';
            }
        });
    }

    function applyDirection(dir) {
        htmlElement.setAttribute('dir', dir);
        localStorage.setItem('dir', dir);
        rtlToggles.forEach(toggle => {
            const span = toggle.querySelector('span');
            if (span) {
                span.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
            } else if (!toggle.querySelector('i')) {
                toggle.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
            }
        });
    }

    // Initialize
    applyTheme(localStorage.getItem('theme') || 'light');
    applyDirection(localStorage.getItem('dir') || 'ltr');

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    });

    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir') || 'ltr';
            applyDirection(currentDir === 'ltr' ? 'rtl' : 'ltr');
        });
    });

    // Dashboard Sidebar Toggles (Mobile View)
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('d-none');
            const icon = sidebarToggleBtn.querySelector('i');
            if (sidebar.classList.contains('show')) {
                icon.classList.replace('bi-list', 'bi-x');
            } else {
                icon.classList.replace('bi-x', 'bi-list');
            }
        });

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.add('d-none');
                const icon = sidebarToggleBtn.querySelector('i');
                icon.classList.replace('bi-x', 'bi-list');
            });
        }
    }

    // Dashboard Navigation Logic
    const dashboardNav = document.getElementById('dashboard-nav');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('current-page-title');

    if (dashboardNav) {
        const links = dashboardNav.querySelectorAll('.sidebar-link');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                
                // Update active link
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Update content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                        // Optional: Re-initialize AOS for the new section
                        if (typeof AOS !== 'undefined') {
                            AOS.refresh();
                        }
                    }
                });

                // Update page title
                if (pageTitle) {
                    const sectionName = link.textContent.trim();
                    if (targetId === 'overview') {
                        pageTitle.textContent = 'Project: Payment Engine v2';
                    } else {
                        pageTitle.textContent = sectionName;
                    }
                }
            });
        });
    }

    // Active Link Highlighting (Original for Main Nav)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // File Upload UI Interaction
    const uploadZones = document.querySelectorAll('.border.rounded.p-4.text-center.bg-light-subtle');
    uploadZones.forEach(zone => {
        const fileInput = zone.querySelector('input[type="file"]');
        if (fileInput) {
            zone.addEventListener('click', () => fileInput.click());
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('border-primary');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('border-primary');
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('border-primary');
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    updateUploadStatus(zone, e.dataTransfer.files[0].name);
                }
            });
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length) {
                    updateUploadStatus(zone, fileInput.files[0].name);
                }
            });
        }
    });

    function updateUploadStatus(zone, fileName) {
        const statusText = zone.querySelector('span');
        const icon = zone.querySelector('i');
        if (statusText) statusText.textContent = `Selected: ${fileName}`;
        if (icon) {
            icon.classList.replace('bi-cloud-arrow-up', 'bi-check-circle');
            icon.classList.add('text-success');
        }
    }

    // Password Visibility Toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const container = this.closest('.password-field-container');
            const input = container.querySelector('input');
            
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                this.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });
});
