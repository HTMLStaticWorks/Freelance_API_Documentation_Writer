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

    // Dashboard Sidebar Toggles
    const sidebarThemeToggle = document.getElementById('theme-toggle-sidebar');
    const sidebarRtlToggle = document.getElementById('rtl-toggle-sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const htmlElement = document.documentElement;

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

    if (sidebarThemeToggle) {
        const themeIcon = sidebarThemeToggle.querySelector('i');
        const themeText = sidebarThemeToggle.querySelector('span');
        
        // Initialize theme from storage
        const savedTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-theme', savedTheme);
        updateSidebarThemeUI(savedTheme);

        sidebarThemeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateSidebarThemeUI(newTheme);
        });

        function updateSidebarThemeUI(theme) {
            if (theme === 'dark') {
                themeIcon.classList.replace('bi-moon-stars', 'bi-sun');
                themeText.textContent = 'Light Mode';
            } else {
                themeIcon.classList.replace('bi-sun', 'bi-moon-stars');
                themeText.textContent = 'Dark Mode';
            }
        }
    }

    if (sidebarRtlToggle) {
        const rtlText = sidebarRtlToggle.querySelector('span');
        const savedDir = localStorage.getItem('dir') || 'ltr';
        htmlElement.setAttribute('dir', savedDir);
        rtlText.textContent = savedDir === 'ltr' ? 'RTL Mode' : 'LTR Mode';

        sidebarRtlToggle.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir');
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            htmlElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            rtlText.textContent = newDir === 'ltr' ? 'RTL Mode' : 'LTR Mode';
        });
    }

    // Original Header Theme Toggle (Keep for compatibility if exists elsewhere)
    const themeToggle = document.getElementById('theme-toggle');

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
});
