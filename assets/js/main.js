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
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const rtlToggles = document.querySelectorAll('.rtl-toggle');

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (theme === 'dark') {
                if (icon) {
                    icon.classList.remove('bi-moon-stars-fill', 'bi-moon-stars');
                    icon.classList.add('bi-sun-fill');
                }
            } else {
                if (icon) {
                    icon.classList.remove('bi-sun-fill', 'bi-sun');
                    icon.classList.add('bi-moon-stars-fill');
                }
            }
        });
    }

    function applyDirection(dir) {
        htmlElement.setAttribute('dir', dir);
        localStorage.setItem('dir', dir);
        rtlToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                // You can add logic here if you want to change an icon for RTL
            }
            // If it's a text-based toggle like 'RTL'/'LTR', keep it simple
            if (toggle.classList.contains('btn-rtl-text')) {
                toggle.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
            }
        });
    }

    // Initialize
    applyTheme(localStorage.getItem('theme') || 'light');
    applyDirection(localStorage.getItem('dir') || 'ltr');

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
            // Close sidebar on mobile after theme change if toggle is in sidebar
            if (toggle.closest('.dashboard-sidebar')) {
                closeSidebarOnMobile();
            }
        });
    });

    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const currentDir = htmlElement.getAttribute('dir') || 'ltr';
            applyDirection(currentDir === 'ltr' ? 'rtl' : 'ltr');
            // Close sidebar on mobile after RTL change if toggle is in sidebar
            if (toggle.closest('.dashboard-sidebar')) {
                closeSidebarOnMobile();
            }
        });
    });

    // Dashboard Sidebar Toggles (Mobile View)
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function closeSidebarOnMobile() {
        if (window.innerWidth < 992 && sidebar && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            if (sidebarOverlay) sidebarOverlay.classList.add('d-none');
            if (sidebarToggleBtn) {
                const icon = sidebarToggleBtn.querySelector('i');
                if (icon) icon.classList.replace('bi-x', 'bi-list');
            }
        }
    }

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
                if (icon) icon.classList.replace('bi-x', 'bi-list');
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

                // Close sidebar on mobile after selection
                closeSidebarOnMobile();
            });
        });
    }

    // Active Link Highlighting (Main Nav & Dropdowns)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // 1. Handle regular nav-links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Handle dropdown items and parent toggles
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
            // Find the parent dropdown toggle and make it active
            const parentDropdown = item.closest('.dropdown');
            if (parentDropdown) {
                const toggle = parentDropdown.querySelector('.nav-link.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        } else {
            item.classList.remove('active');
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
