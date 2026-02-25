/**
 * Company News & Achievements Component
 * CRUD for managing company news, achievements, and announcements
 */

const CompanyNewsComponent = {
    template: `
        <div class="company-news-page">
            <!-- List View -->
            <div v-if="currentView === 'list'">
                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="pi pi-megaphone"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ newsList.length }}</div>
                            <div class="stat-label">Total Posts</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon orange">
                            <i class="pi pi-trophy"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ achievementCount }}</div>
                            <div class="stat-label">Achievements</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="pi pi-calendar"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ eventCount }}</div>
                            <div class="stat-label">Events</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green">
                            <i class="pi pi-heart"></i>
                        </div>
                        <div>
                            <div class="stat-value">{{ greetingCount }}</div>
                            <div class="stat-label">Greetings</div>
                        </div>
                    </div>
                </div>

                <!-- News Table -->
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">
                                <i class="pi pi-megaphone"></i>
                                Company News & Achievements
                            </div>
                            <div class="card-subtitle">Manage and publish internal company news and achievements</div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <p-button label="New Post" icon="pi pi-plus" @click="openForm(null)"></p-button>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="request-filters">
                        <div class="filter-tabs">
                            <button class="filter-tab" :class="{ active: categoryFilter === null }" @click="categoryFilter = null">
                                All <span class="filter-count">{{ newsList.length }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: categoryFilter === 'achievement' }" @click="categoryFilter = 'achievement'">
                                Achievements <span class="filter-count">{{ achievementCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: categoryFilter === 'event' }" @click="categoryFilter = 'event'">
                                Events <span class="filter-count">{{ eventCount }}</span>
                            </button>
                            <button class="filter-tab" :class="{ active: categoryFilter === 'greeting' }" @click="categoryFilter = 'greeting'">
                                Greetings <span class="filter-count">{{ greetingCount }}</span>
                            </button>
                        </div>
                    </div>

                    <p-datatable :value="filteredNews" striped-rows paginator :rows="10" 
                                 :rowsPerPageOptions="[5, 10, 20]">
                        <p-column header="Post" sortable>
                            <template #body="slotProps">
                                <div class="news-cell">
                                    <img :src="slotProps.data.image" :alt="slotProps.data.title" class="news-thumb">
                                    <div>
                                        <div class="news-title">{{ slotProps.data.title }}</div>
                                        <div class="news-excerpt">{{ truncateText(slotProps.data.content, 60) }}</div>
                                    </div>
                                </div>
                            </template>
                        </p-column>
                        <p-column header="Category" sortable>
                            <template #body="slotProps">
                                <span class="category-badge" :class="slotProps.data.category">
                                    <i :class="getCategoryIcon(slotProps.data.category)"></i>
                                    {{ slotProps.data.category.toUpperCase() }}
                                </span>
                            </template>
                        </p-column>
                        <p-column header="Published" sortable>
                            <template #body="slotProps">
                                <div class="date-cell">
                                    <div>{{ formatDate(slotProps.data.publishedAt) }}</div>
                                    <div class="time-ago">{{ formatTimeAgo(slotProps.data.publishedAt) }}</div>
                                </div>
                            </template>
                        </p-column>
                        <p-column header="Engagement">
                            <template #body="slotProps">
                                <div class="engagement-cell">
                                    <span><i class="pi pi-heart"></i> {{ slotProps.data.likes }}</span>
                                    <span><i class="pi pi-comment"></i> {{ slotProps.data.comments }}</span>
                                </div>
                            </template>
                        </p-column>
                        <p-column header="Status">
                            <template #body="slotProps">
                                <p-tag :value="slotProps.data.status" 
                                       :severity="slotProps.data.status === 'published' ? 'success' : 'warn'"></p-tag>
                            </template>
                        </p-column>
                        <p-column header="Actions">
                            <template #body="slotProps">
                                <div class="action-buttons">
                                    <button class="action-icon-btn" @click="openForm(slotProps.data)" v-tooltip.top="'Edit'">
                                        <i class="pi pi-pencil"></i>
                                    </button>
                                    <button class="action-icon-btn danger" @click="confirmDelete(slotProps.data)" v-tooltip.top="'Delete'">
                                        <i class="pi pi-trash"></i>
                                    </button>
                                </div>
                            </template>
                        </p-column>
                    </p-datatable>
                </div>
            </div>

            <!-- Form View (Create/Edit) -->
            <div v-else class="news-form-view">
                <div class="form-header">
                    <button class="back-btn" @click="currentView = 'list'">
                        <i class="pi pi-arrow-left"></i>
                    </button>
                    <div>
                        <h2>{{ editingNews ? 'Edit Post' : 'Create New Post' }}</h2>
                        <p>Manage and publish internal company news and achievements.</p>
                    </div>
                </div>

                <div class="news-form-grid">
                    <!-- Left Column: Form -->
                    <div class="form-column">
                        <div class="card">
                            <!-- Category Selection -->
                            <div class="form-section">
                                <label class="form-label"><i class="pi pi-tag"></i> SELECT CATEGORY</label>
                                <div class="category-selector">
                                    <div class="category-option" :class="{ active: form.category === 'achievement' }" 
                                         @click="form.category = 'achievement'">
                                        <i class="pi pi-trophy"></i>
                                        <span>ACHIEVEMENT</span>
                                    </div>
                                    <div class="category-option" :class="{ active: form.category === 'event' }" 
                                         @click="form.category = 'event'">
                                        <i class="pi pi-calendar"></i>
                                        <span>EVENT</span>
                                    </div>
                                    <div class="category-option" :class="{ active: form.category === 'greeting' }" 
                                         @click="form.category = 'greeting'">
                                        <i class="pi pi-heart"></i>
                                        <span>GREETING</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Title -->
                            <div class="form-section">
                                <label class="form-label"><i class="pi pi-pencil"></i> EVENT TITLE</label>
                                <p-inputtext v-model="form.title" placeholder="e.g. Direct Wins Travel Award 2024" 
                                             style="width: 100%;"></p-inputtext>
                            </div>

                            <!-- Content -->
                            <div class="form-section">
                                <label class="form-label"><i class="pi pi-align-left"></i> CONTENT / DESCRIPTION</label>
                                <p-textarea v-model="form.content" rows="5" 
                                            placeholder="Share the full details of the achievement or news..."
                                            style="width: 100%;"></p-textarea>
                            </div>

                            <!-- Cover Image -->
                            <div class="form-section">
                                <label class="form-label"><i class="pi pi-image"></i> COVER IMAGE</label>
                                <div class="image-upload-area" @click="triggerFileInput">
                                    <div v-if="!form.image" class="upload-placeholder">
                                        <i class="pi pi-camera"></i>
                                        <span>Click to upload image</span>
                                        <small>PNG, JPG up to 10MB</small>
                                    </div>
                                    <img v-else :src="form.image" alt="Cover preview" class="image-preview">
                                </div>
                                <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" style="display: none;">
                            </div>

                            <!-- Action Buttons -->
                            <div class="form-action-buttons">
                                <p-button :label="editingNews ? 'UPDATE POST' : 'PUBLISH NEWS POST'" 
                                          icon="pi pi-send" class="publish-btn" @click="savePost"></p-button>
                                <p-button label="SCHEDULE POST" icon="pi pi-calendar" 
                                          text class="schedule-btn" 
                                          @click="showScheduleDialog = true"></p-button>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Preview & Guidelines -->
                    <div class="preview-column">
                        <!-- Live Preview -->
                        <div class="card preview-card">
                            <label class="form-label"><i class="pi pi-eye"></i> LIVE PREVIEW</label>
                            <div class="preview-content">
                                <span class="preview-badge" :class="form.category">{{ form.category?.toUpperCase() || 'CATEGORY' }}</span>
                                <h3>{{ form.title || 'Your Title Here...' }}</h3>
                                <p>{{ form.content || 'Content preview will appear here as you type...' }}</p>
                            </div>
                        </div>

                        <!-- Guidelines -->
                        <div class="guidelines-card">
                            <div class="guidelines-header">
                                <i class="pi pi-info-circle"></i>
                                <span>HR Guidelines</span>
                            </div>
                            <ul class="guidelines-list">
                                <li>Ensure all images are professional.</li>
                                <li>Check spelling before publishing.</li>
                                <li>Use clear and exciting titles.</li>
                                <li>Avoid sensitive personal info.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Dialog -->
            <p-dialog v-model:visible="showDeleteDialog" header="Confirm Delete" :modal="true" :style="{ width: '400px' }">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #ef4444;"></i>
                    <span>Are you sure you want to delete this post? This action cannot be undone.</span>
                </div>
                <template #footer>
                    <p-button label="Cancel" severity="danger" outlined @click="showDeleteDialog = false"></p-button>
                    <p-button label="Delete" severity="danger" @click="deletePost"></p-button>
                </template>
            </p-dialog>

            <!-- Schedule Post Dialog -->
            <p-dialog v-model:visible="showScheduleDialog" :modal="true" :style="{ width: '480px' }" :showHeader="false">
                <div class="schedule-dialog">
                    <div class="schedule-header">
                        <div class="schedule-icon">
                            <i class="pi pi-calendar-clock"></i>
                        </div>
                        <h3>Schedule Your Post</h3>
                        <p>Choose when you want this post to be published automatically.</p>
                    </div>
                    
                    <div class="schedule-content">
                        <div class="schedule-field">
                            <label><i class="pi pi-calendar"></i> Select Date & Time</label>
                            <p-datepicker v-model="scheduleDate" showTime hourFormat="12" 
                                          :minDate="minScheduleDate" dateFormat="dd M yy"
                                          placeholder="Pick a date and time" style="width: 100%;"></p-datepicker>
                        </div>
                        
                        <div class="schedule-preview" v-if="scheduleDate">
                            <div class="schedule-preview-icon">
                                <i class="pi pi-clock"></i>
                            </div>
                            <div class="schedule-preview-text">
                                <span class="schedule-label">Scheduled for</span>
                                <span class="schedule-datetime">{{ formatScheduleDate(scheduleDate) }}</span>
                            </div>
                        </div>

                        <div class="schedule-info">
                            <i class="pi pi-info-circle"></i>
                            <span>The post will be automatically published at the selected time. You can edit or cancel the schedule anytime.</span>
                        </div>
                    </div>
                    
                    <div class="schedule-actions">
                        <p-button label="Cancel" severity="danger" outlined @click="showScheduleDialog = false"></p-button>
                        <p-button label="Schedule Post" icon="pi pi-check" :disabled="!scheduleDate" @click="schedulePost"></p-button>
                    </div>
                </div>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed } = Vue;

        const currentView = ref('list');
        const categoryFilter = ref(null);
        const editingNews = ref(null);
        const showDeleteDialog = ref(false);
        const showScheduleDialog = ref(false);
        const newsToDelete = ref(null);
        const fileInput = ref(null);
        const scheduleDate = ref(null);
        const minScheduleDate = ref(new Date());

        const form = ref({
            category: 'achievement',
            title: '',
            content: '',
            image: ''
        });

        const newsList = ref([
            {
                id: 1,
                category: 'achievement',
                title: 'New Milestone for Direct!',
                content: 'We are incredibly proud to receive the Excellence in Travel & Tourism Award for 2026. Thank you to everyone who contributed to this success.',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=300&fit=crop',
                publishedAt: '2026-02-10',
                likes: 8,
                comments: 3,
                status: 'published'
            },
            {
                id: 2,
                category: 'greeting',
                title: 'Ramadan Kareem Greetings',
                content: 'Direct management extends its warmest congratulations to all employees on the occasion of the holy month of Ramadan. Wishing you all a blessed month.',
                image: 'https://picsum.photos/id/234/800/400',
                publishedAt: '2026-02-01',
                likes: 24,
                comments: 8,
                status: 'published'
            },
            {
                id: 3,
                category: 'event',
                title: 'Annual Company Retreat 2026',
                content: 'Join us for our annual company retreat at the Red Sea coast. Team building activities, workshops, and fun await!',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop',
                publishedAt: '2026-01-20',
                likes: 45,
                comments: 12,
                status: 'published'
            },
            {
                id: 4,
                category: 'achievement',
                title: 'Q4 Sales Target Exceeded',
                content: 'Congratulations to our Sales team for exceeding Q4 targets by 120%. Your hard work and dedication made this possible.',
                image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&h=300&fit=crop',
                publishedAt: '2026-01-15',
                likes: 32,
                comments: 7,
                status: 'published'
            },
            {
                id: 5,
                category: 'event',
                title: 'New Office Opening in Jeddah',
                content: 'We are excited to announce the opening of our new regional office in Jeddah. This expansion will help us serve our western region clients better.',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop',
                publishedAt: '2026-01-10',
                likes: 18,
                comments: 5,
                status: 'draft'
            }
        ]);

        const achievementCount = computed(() => newsList.value.filter(n => n.category === 'achievement').length);
        const eventCount = computed(() => newsList.value.filter(n => n.category === 'event').length);
        const greetingCount = computed(() => newsList.value.filter(n => n.category === 'greeting').length);

        const filteredNews = computed(() => {
            if (!categoryFilter.value) return newsList.value;
            return newsList.value.filter(n => n.category === categoryFilter.value);
        });

        const getCategoryIcon = (category) => {
            const icons = {
                'achievement': 'pi pi-trophy',
                'event': 'pi pi-calendar',
                'greeting': 'pi pi-heart'
            };
            return icons[category] || 'pi pi-tag';
        };

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        };

        const formatTimeAgo = (dateStr) => {
            const date = new Date(dateStr);
            const now = new Date();
            const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            return `${Math.floor(diffDays / 30)} months ago`;
        };

        const truncateText = (text, length) => {
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        };

        const openForm = (news) => {
            if (news) {
                editingNews.value = news;
                form.value = { ...news };
            } else {
                editingNews.value = null;
                form.value = {
                    category: 'achievement',
                    title: '',
                    content: '',
                    image: ''
                };
            }
            currentView.value = 'form';
        };

        const triggerFileInput = () => {
            fileInput.value?.click();
        };

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    form.value.image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        const savePost = () => {
            if (editingNews.value) {
                // Update existing
                const index = newsList.value.findIndex(n => n.id === editingNews.value.id);
                if (index !== -1) {
                    newsList.value[index] = {
                        ...newsList.value[index],
                        ...form.value
                    };
                }
            } else {
                // Create new
                const newPost = {
                    id: Date.now(),
                    ...form.value,
                    publishedAt: new Date().toISOString().split('T')[0],
                    likes: 0,
                    comments: 0,
                    status: 'published'
                };
                newsList.value.unshift(newPost);
            }
            currentView.value = 'list';
        };

        const confirmDelete = (news) => {
            newsToDelete.value = news;
            showDeleteDialog.value = true;
        };

        const deletePost = () => {
            if (newsToDelete.value) {
                newsList.value = newsList.value.filter(n => n.id !== newsToDelete.value.id);
                newsToDelete.value = null;
                showDeleteDialog.value = false;
            }
        };

        const formatScheduleDate = (date) => {
            if (!date) return '';
            return date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        };

        const schedulePost = () => {
            if (scheduleDate.value) {
                const newPost = {
                    id: Date.now(),
                    ...form.value,
                    publishedAt: scheduleDate.value.toISOString().split('T')[0],
                    scheduledFor: scheduleDate.value,
                    likes: 0,
                    comments: 0,
                    status: 'scheduled'
                };
                newsList.value.unshift(newPost);
                showScheduleDialog.value = false;
                scheduleDate.value = null;
                currentView.value = 'list';
            }
        };

        return {
            currentView,
            categoryFilter,
            editingNews,
            showDeleteDialog,
            showScheduleDialog,
            scheduleDate,
            minScheduleDate,
            form,
            fileInput,
            newsList,
            achievementCount,
            eventCount,
            greetingCount,
            filteredNews,
            getCategoryIcon,
            formatDate,
            formatTimeAgo,
            formatScheduleDate,
            truncateText,
            openForm,
            triggerFileInput,
            handleImageUpload,
            savePost,
            confirmDelete,
            deletePost,
            schedulePost
        };
    }
};

window.CompanyNewsComponent = CompanyNewsComponent;
