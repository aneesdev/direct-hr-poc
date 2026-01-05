/**
 * Placeholder Page Component
 * Used for pages that are under construction
 */

const PlaceholderPageComponent = {
    props: {
        title: {
            type: String,
            default: 'Page'
        }
    },

    template: `
        <div class="card">
            <div class="empty-state">
                <i class="pi pi-wrench"></i>
                <h3>{{ title }}</h3>
                <p>This page is under construction</p>
            </div>
        </div>
    `
};

// Make it available globally
window.PlaceholderPageComponent = PlaceholderPageComponent;

