/**
 * Component Loader System for TechXpert
 * Handles dynamic loading of shared components
 */
class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.loadedComponents = new Set();
    }

    /**
     * Load a component into a target element
     * @param {string} componentName - Name of the component file
     * @param {string} targetSelector - CSS selector for target element
     * @param {Object} options - Additional options
     */
    async load(componentName, targetSelector, options = {}) {
        try {
            const targetElement = document.querySelector(targetSelector);
            if (!targetElement) {
                console.error(`Target element not found: ${targetSelector}`);
                return;
            }

            // Check if component is already loaded
            if (this.loadedComponents.has(componentName)) {
                console.log(`Component ${componentName} already loaded`);
                return;
            }

            // Load component HTML
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.statusText}`);
            }

            const html = await response.text();
            
            // Insert component HTML
            targetElement.innerHTML = html;
            
            // Mark as loaded
            this.loadedComponents.add(componentName);
            
            // Initialize component-specific functionality
            this.initializeComponent(componentName, targetElement, options);
            
            console.log(`Component ${componentName} loaded successfully`);
            
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    }

    /**
     * Initialize component-specific functionality
     * @param {string} componentName - Name of the component
     * @param {HTMLElement} element - The component element
     * @param {Object} options - Component options
     */
    initializeComponent(componentName, element, options) {
        switch (componentName) {
            case 'header':
                this.initializeHeader(element, options);
                break;
            case 'footer':
                this.initializeFooter(element, options);
                break;
            case 'navigation':
                this.initializeNavigation(element, options);
                break;
            default:
                console.log(`No specific initialization for component: ${componentName}`);
        }
    }

    /**
     * Initialize header component functionality
     * @param {HTMLElement} element - Header element
     * @param {Object} options - Header options
     */
    initializeHeader(element, options) {
        // Initialize mobile sidebar functionality
        const hamburger = element.querySelector('#hamburger-menu');
        const sidebar = element.querySelector('#mobile-sidebar');
        const closeSidebar = element.querySelector('#close-sidebar');
        const sidebarBackdrop = element.querySelector('#sidebar-backdrop');

        if (hamburger && sidebar && closeSidebar && sidebarBackdrop) {
            // Open sidebar
            hamburger.addEventListener('click', () => {
                sidebar.classList.add('open');
                sidebarBackdrop.classList.add('open');
                hamburger.setAttribute('aria-expanded', 'true');
                sidebar.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });

            // Close sidebar
            const closeSidebarFn = () => {
                sidebar.classList.remove('open');
                sidebarBackdrop.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                sidebar.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            };

            closeSidebar.addEventListener('click', closeSidebarFn);
            sidebarBackdrop.addEventListener('click', closeSidebarFn);

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                    closeSidebarFn();
                }
            });

            // Close when links are clicked
            sidebar.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeSidebarFn);
            });
        }

        // Initialize dropdown functionality
        const dropdowns = element.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const content = dropdown.querySelector('.dropdown-content');
            
            if (trigger && content) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove('open');
                    }
                });
            }
        });

        // Initialize search functionality
        const searchInput = element.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                // Implement search functionality here
                console.log('Searching for:', searchTerm);
            });
        }
    }

    /**
     * Initialize footer component functionality
     * @param {HTMLElement} element - Footer element
     * @param {Object} options - Footer options
     */
    initializeFooter(element, options) {
        // Add current year to copyright
        const yearElement = element.querySelector('.current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Initialize navigation component functionality
     * @param {HTMLElement} element - Navigation element
     * @param {Object} options - Navigation options
     */
    initializeNavigation(element, options) {
        // Set active navigation item based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        const navLinks = element.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Load multiple components
     * @param {Array} components - Array of component configurations
     */
    async loadMultiple(components) {
        const promises = components.map(comp => 
            this.load(comp.name, comp.target, comp.options)
        );
        
        await Promise.all(promises);
    }

    /**
     * Reload a component
     * @param {string} componentName - Name of the component
     * @param {string} targetSelector - CSS selector for target element
     */
    async reload(componentName, targetSelector) {
        this.loadedComponents.delete(componentName);
        await this.load(componentName, targetSelector);
    }
}

// Create global instance
window.ComponentLoader = new ComponentLoader();

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Auto-load header if header-container exists
    const headerContainer = document.querySelector('#header-container');
    if (headerContainer) {
        ComponentLoader.load('header', '#header-container');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentLoader;
}
