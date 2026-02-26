/**
 * Home Component
 * Main dashboard/landing page with news, widgets and employee info
 */

const HomeComponent = {
    template: `
        <div class="home-page">
            <!-- Welcome Header -->
            <div class="welcome-header">
                <div class="welcome-left">
                    <div class="greeting-badge">
                        <i class="pi" :class="greetingIcon"></i>
                        <span>{{ greetingText }} • {{ currentTime }}</span>
                    </div>
                    <h1>Marhaba, {{ currentUser.name }}! <span class="wave-emoji">👋</span></h1>
                    <p>We're glad to see you today. Your dedication is what makes Direct travel forward!</p>
                </div>
                <div class="mood-selector" :class="{ 'mood-submitted': moodSubmitted }">
                    <div class="mood-title" v-if="!moodSubmitted">How are you feeling?</div>
                    <div class="mood-title mood-thanks" v-else>
                        <i class="pi pi-check-circle"></i> Thanks for sharing!
                    </div>
                    <div class="mood-options" v-if="!moodSubmitted">
                        <div class="mood-option" :class="{ active: selectedMood === 'great', 'mood-animating': animatingMood === 'great' }" @click="selectMood('great')">
                            <span class="mood-icon">😊</span>
                            <span class="mood-label">Great</span>
                        </div>
                        <div class="mood-option" :class="{ active: selectedMood === 'okay', 'mood-animating': animatingMood === 'okay' }" @click="selectMood('okay')">
                            <span class="mood-icon">😐</span>
                            <span class="mood-label">Okay</span>
                        </div>
                        <div class="mood-option" :class="{ active: selectedMood === 'tired', 'mood-animating': animatingMood === 'tired' }" @click="selectMood('tired')">
                            <span class="mood-icon">😴</span>
                            <span class="mood-label">Tired</span>
                        </div>
                        <div class="mood-option" :class="{ active: selectedMood === 'struggling', 'mood-animating': animatingMood === 'struggling' }" @click="selectMood('struggling')">
                            <span class="mood-icon">😟</span>
                            <span class="mood-label">Struggling</span>
                        </div>
                    </div>
                    <div class="mood-selected-display" v-else>
                        <span class="mood-icon selected-mood-icon">{{ getMoodEmoji(selectedMood) }}</span>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="home-content-grid">
                <!-- Left Column: Company Documents -->
                <div class="home-docs-column">
                    <div class="documents-widget">
                        <div class="documents-header">
                            <h4><i class="pi pi-folder"></i> Company Documents</h4>
                            <span class="docs-count">{{ activeCompanyDocuments.length }} FILES</span>
                        </div>
                        <div class="documents-list">
                            <div v-for="doc in activeCompanyDocuments" :key="doc.id" class="document-item" @click="openDocument(doc)">
                                <div class="document-icon" :class="doc.iconClass">
                                    <i :class="'pi ' + doc.icon"></i>
                                </div>
                                <div class="document-info">
                                    <div class="document-name">{{ doc.name }}</div>
                                    <div class="document-name-ar">{{ doc.nameAr }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Middle Column: Company News -->
                <div class="home-center-column">
                    <div class="section-header">
                        <h2>Company News & Achievements</h2>
                    </div>

                    <!-- News Cards -->
                    <div v-for="news in companyNews" :key="news.id" class="news-card">
                        <div v-if="news.type === 'achievement'" class="news-badge achievement">ACHIEVEMENT</div>
                        <div v-else-if="news.type === 'greeting'" class="news-badge greeting">GREETING</div>
                        <img :src="news.image" :alt="news.title" class="news-image">
                        <div class="news-content">
                            <div class="news-date"><i class="pi pi-calendar"></i> {{ formatDate(news.date) }}</div>
                            <h3>{{ news.title }}</h3>
                            <p>{{ news.content }}</p>
                            <div class="news-actions">
                                <div class="action-btn-wrapper">
                                    <button class="action-btn" :class="{ liked: news.isLiked, 'like-animating': news.likeAnimating }" @click="toggleLike(news)">
                                        <i :class="news.isLiked ? 'pi pi-heart-fill' : 'pi pi-heart'"></i> {{ news.likes }}
                                    </button>
                                    <div class="social-tooltip" v-if="news.likedBy && news.likedBy.length > 0">
                                        <div class="tooltip-content">
                                            <span v-for="(name, idx) in news.likedBy.slice(0, 5)" :key="idx">{{ name }}</span>
                                            <span v-if="news.likedBy.length > 5" class="tooltip-more">+{{ news.likedBy.length - 5 }} more</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="action-btn-wrapper">
                                    <button class="action-btn" @click="toggleComments(news)">
                                        <i class="pi pi-comment"></i> {{ news.commentsList ? news.commentsList.length : 0 }}
                                    </button>
                                    <div class="social-tooltip" v-if="news.commentsList && news.commentsList.length > 0">
                                        <div class="tooltip-content">
                                            <span v-for="(comment, idx) in getUniqueCommenters(news.commentsList).slice(0, 5)" :key="idx">{{ comment }}</span>
                                            <span v-if="getUniqueCommenters(news.commentsList).length > 5" class="tooltip-more">+{{ getUniqueCommenters(news.commentsList).length - 5 }} more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Comments Section -->
                            <div v-if="news.showComments" class="comments-section">
                                <div v-for="comment in news.commentsList" :key="comment.id" class="comment-item">
                                    <img :src="comment.avatar" :alt="comment.name" class="comment-avatar">
                                    <div class="comment-content">
                                        <div class="comment-header">
                                            <span class="comment-name">{{ comment.name }}</span>
                                            <span class="comment-time">{{ comment.time }}</span>
                                        </div>
                                        <div class="comment-text">{{ comment.text }}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="comment-input">
                                <input type="text" v-model="news.newComment" placeholder="Write a comment..." @keyup.enter="addComment(news)">
                                <button class="send-btn-filled" @click="addComment(news)"><i class="pi pi-send"></i></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Widgets -->
                <div class="home-right-column">
                    <!-- Birthdays Widget -->
                    <div class="widget-card">
                        <div class="widget-header">
                            <h4><i class="pi pi-gift"></i> Birthdays</h4>
                            <p-button label="FULL CALENDAR" text size="small" severity="warning" @click="showBirthdayModal = true"></p-button>
                        </div>
                        <div class="widget-subtitle">CELEBRATING TODAY</div>
                        <div class="birthday-list">
                            <div v-for="bday in birthdaysData" :key="bday.id" class="birthday-card">
                                <div class="birthday-card-header">
                                    <img :src="bday.avatar" :alt="bday.name" class="birthday-avatar">
                                    <div class="birthday-info">
                                        <div class="birthday-name">{{ bday.name }}</div>
                                        <div class="birthday-date"><i class="pi pi-calendar"></i> Born {{ bday.date }}</div>
                                    </div>
                                </div>
                                <div class="birthday-stats">
                                    <div class="stat-item-wrapper">
                                        <span class="stat-item clickable" :class="{ 'like-animating': bday.likeAnimating }" @click="toggleBirthdayLike(bday)">
                                            <i :class="bday.isLiked ? 'pi pi-heart-fill liked' : 'pi pi-heart'"></i> {{ bday.likes }}
                                        </span>
                                        <div class="social-tooltip" v-if="bday.likedBy && bday.likedBy.length > 0">
                                            <div class="tooltip-content">
                                                <span v-for="(name, idx) in bday.likedBy.slice(0, 5)" :key="idx">{{ name }}</span>
                                                <span v-if="bday.likedBy.length > 5" class="tooltip-more">+{{ bday.likedBy.length - 5 }} more</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="stat-item-wrapper">
                                        <span class="stat-item"><i class="pi pi-comment"></i> {{ bday.commentsList.length }} Wishes</span>
                                        <div class="social-tooltip" v-if="bday.commentsList && bday.commentsList.length > 0">
                                            <div class="tooltip-content">
                                                <span v-for="(comment, idx) in getUniqueCommenters(bday.commentsList).slice(0, 5)" :key="idx">{{ comment }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="liked-by" v-if="bday.likedBy && bday.likedBy.length > 0">Liked by <strong>{{ bday.likedBy[0] }}</strong><span v-if="bday.likedBy.length > 1"> and {{ bday.likedBy.length - 1 }} others</span></div>
                                
                                <!-- Comments Section -->
                                <div class="widget-comments">
                                    <div v-for="comment in bday.commentsList" :key="comment.id" class="widget-comment">
                                        <img :src="comment.avatar" :alt="comment.name" class="widget-comment-avatar">
                                        <div class="widget-comment-content">
                                            <span class="widget-comment-name">{{ comment.name }}</span>
                                            <span class="widget-comment-text">{{ comment.text }}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="widget-comment-input">
                                    <input type="text" v-model="bday.newComment" placeholder="Write something nice..." @keyup.enter="addBirthdayComment(bday)">
                                    <button class="send-btn-filled" @click="addBirthdayComment(bday)"><i class="pi pi-send"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Anniversaries Widget -->
                    <div class="widget-card">
                        <div class="widget-header">
                            <h4><i class="pi pi-star"></i> Anniversaries</h4>
                            <p-button label="Wall of Fame" severity="warning" size="small" @click="showWallOfFameModal = true"></p-button>
                        </div>
                        <div class="widget-subtitle"><i class="pi pi-calendar"></i> PAST HIGHLIGHTS</div>
                        <div class="anniversary-list">
                            <div v-for="anni in anniversariesData" :key="anni.id" class="anniversary-card">
                                <div class="anniversary-card-header">
                                    <img :src="anni.avatar" :alt="anni.name" class="anniversary-avatar">
                                    <div class="anniversary-info">
                                        <div class="anniversary-name">{{ anni.name }}</div>
                                        <div class="anniversary-position">{{ anni.position }} - {{ anni.joinedDate }}</div>
                                        <div class="anniversary-badge">{{ anni.years }} YR ANNIVERSARY</div>
                                    </div>
                                </div>
                                <div class="anniversary-stats">
                                    <div class="stat-item-wrapper">
                                        <span class="stat-item clickable" :class="{ 'like-animating': anni.likeAnimating }" @click="toggleAnniversaryLike(anni)">
                                            <i :class="anni.isLiked ? 'pi pi-heart-fill liked' : 'pi pi-heart'"></i> {{ anni.likes }}
                                        </span>
                                        <div class="social-tooltip" v-if="anni.likedBy && anni.likedBy.length > 0">
                                            <div class="tooltip-content">
                                                <span v-for="(name, idx) in anni.likedBy.slice(0, 5)" :key="idx">{{ name }}</span>
                                                <span v-if="anni.likedBy.length > 5" class="tooltip-more">+{{ anni.likedBy.length - 5 }} more</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="stat-item-wrapper">
                                        <span class="stat-item"><i class="pi pi-comment"></i> {{ anni.commentsList.length }} Wishes</span>
                                        <div class="social-tooltip" v-if="anni.commentsList && anni.commentsList.length > 0">
                                            <div class="tooltip-content">
                                                <span v-for="(comment, idx) in getUniqueCommenters(anni.commentsList).slice(0, 5)" :key="idx">{{ comment }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Comments Section -->
                                <div class="widget-comments">
                                    <div v-for="comment in anni.commentsList" :key="comment.id" class="widget-comment">
                                        <img :src="comment.avatar" :alt="comment.name" class="widget-comment-avatar">
                                        <div class="widget-comment-content">
                                            <span class="widget-comment-name">{{ comment.name }}</span>
                                            <span class="widget-comment-text">{{ comment.text }}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="widget-comment-input">
                                    <input type="text" v-model="anni.newComment" placeholder="Write something nice..." @keyup.enter="addAnniversaryComment(anni)">
                                    <button class="send-btn-filled" @click="addAnniversaryComment(anni)"><i class="pi pi-send"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- New Joiners Widget -->
                    <div class="widget-card">
                        <div class="widget-header">
                            <h4><i class="pi pi-users"></i> Welcome Our New Joiners</h4>
                            <span class="widget-badge">THIS WEEK</span>
                        </div>
                        <div class="joiners-list">
                            <div v-for="joiner in newJoiners" :key="joiner.id" class="joiner-item">
                                <img :src="joiner.avatar" :alt="joiner.name" class="joiner-avatar">
                                <div class="joiner-info">
                                    <div class="joiner-name">{{ joiner.name }}</div>
                                    <div class="joiner-position">{{ joiner.position }}</div>
                                    <div class="joiner-joined"><span class="green-dot"></span> Joined 2024-03-14</div>
                                    <div class="joiner-reactions">
                                        <button class="reaction-btn" :class="{ active: joiner.reactions?.welcome, 'reaction-animating': joiner.animating === 'welcome' }" @click="toggleJoinerReaction(joiner, 'welcome')">
                                            <i class="pi pi-heart"></i> Welcome!
                                        </button>
                                        <button class="reaction-btn" :class="{ active: joiner.reactions?.hi, 'reaction-animating': joiner.animating === 'hi' }" @click="toggleJoinerReaction(joiner, 'hi')">
                                            <i class="pi pi-comments"></i> Hi!
                                        </button>
                                        <button class="reaction-btn" :class="{ active: joiner.reactions?.cheers, 'reaction-animating': joiner.animating === 'cheers' }" @click="toggleJoinerReaction(joiner, 'cheers')">
                                            <i class="pi pi-thumbs-up"></i> Cheers!
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="widget-footer-note">
                            <i class="pi pi-info-circle"></i>
                            "Teamwork makes the dream work at Direct!"
                        </div>
                    </div>

                    <!-- Workforce Status Widget -->
                    <div class="widget-card">
                        <div class="widget-header">
                            <h4><i class="pi pi-chart-bar"></i> Workforce Status</h4>
                        </div>
                        <div class="workforce-stats">
                            <div class="workforce-stat">
                                <div class="stat-icon-small blue"><i class="pi pi-users"></i></div>
                                <div class="stat-info">
                                    <span class="stat-label-sm">ACTIVE DUTY</span>
                                    <span class="stat-value-lg">{{ workforceStatus.activeDaily.count }}</span>
                                </div>
                                <span class="stat-change positive">+{{ workforceStatus.activeDaily.change }}%</span>
                            </div>
                            <div class="workforce-stat">
                                <div class="stat-icon-small purple"><i class="pi pi-clock"></i></div>
                                <div class="stat-info">
                                    <span class="stat-label-sm">PROBATION</span>
                                    <span class="stat-value-lg">{{ workforceStatus.probation.count }}</span>
                                </div>
                                <span class="stat-change positive">+{{ workforceStatus.probation.change }}%</span>
                            </div>
                            <div class="workforce-stat">
                                <div class="stat-icon-small orange"><i class="pi pi-calendar-times"></i></div>
                                <div class="stat-info">
                                    <span class="stat-label-sm">ON LEAVE</span>
                                    <span class="stat-value-lg">{{ workforceStatus.onLeave.count }}</span>
                                </div>
                                <span class="stat-change negative">{{ workforceStatus.onLeave.change }}%</span>
                            </div>
                            <div class="workforce-stat">
                                <div class="stat-icon-small green"><i class="pi pi-chart-line"></i></div>
                                <div class="stat-info">
                                    <span class="stat-label-sm">PERFORMANCE</span>
                                    <span class="stat-value-lg">{{ workforceStatus.performance.percent }}%</span>
                                </div>
                                <span class="stat-change positive">+{{ workforceStatus.performance.change }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Birthdays Modal -->
            <p-dialog v-model:visible="showBirthdayModal" :modal="true" :style="{ width: '480px' }" :closable="true" :showHeader="false">
                <div class="birthday-modal">
                    <div class="birthday-modal-header">
                        <h3>Birthday Calendar</h3>
                        <button class="modal-close-btn" @click="showBirthdayModal = false"><i class="pi pi-times"></i></button>
                    </div>
                    <div class="birthday-modal-list">
                        <div v-for="bday in birthdayCalendar" :key="bday.id" class="birthday-modal-item" :class="{ 'past-item': bday.isPast }">
                            <div class="birthday-day">{{ bday.day }}</div>
                            <img :src="bday.avatar" :alt="bday.name" class="birthday-modal-avatar">
                            <div class="birthday-modal-info">
                                <div class="birthday-modal-name">{{ bday.name }}</div>
                                <div class="birthday-modal-position">{{ bday.position }}</div>
                                <div class="birthday-modal-stats" v-if="bday.isPast">
                                    <span class="stat-badge"><i class="pi pi-heart-fill"></i> {{ bday.likes }}</span>
                                    <span class="stat-badge"><i class="pi pi-comment"></i> {{ bday.wishes }}</span>
                                </div>
                            </div>
                            <span class="upcoming-badge" v-if="!bday.isPast">Upcoming</span>
                        </div>
                    </div>
                </div>
            </p-dialog>
            
            <!-- Wall of Fame Modal -->
            <p-dialog v-model:visible="showWallOfFameModal" :modal="true" :style="{ width: '480px' }" :closable="true" :showHeader="false">
                <div class="birthday-modal">
                    <div class="birthday-modal-header anniversary-header">
                        <h3>Work Anniversaries</h3>
                        <button class="modal-close-btn" @click="showWallOfFameModal = false"><i class="pi pi-times"></i></button>
                    </div>
                    <div class="birthday-modal-list">
                        <div v-for="member in anniversaryCalendar" :key="member.id" class="birthday-modal-item" :class="{ 'past-item': member.isPast }">
                            <div class="birthday-day anniversary-years">{{ member.years }}Y</div>
                            <img :src="member.avatar" :alt="member.name" class="birthday-modal-avatar">
                            <div class="birthday-modal-info">
                                <div class="birthday-modal-name">{{ member.name }}</div>
                                <div class="birthday-modal-position">{{ member.department }} · {{ member.date }}</div>
                                <div class="birthday-modal-stats" v-if="member.isPast">
                                    <span class="stat-badge"><i class="pi pi-heart-fill"></i> {{ member.likes }}</span>
                                    <span class="stat-badge"><i class="pi pi-comment"></i> {{ member.wishes }}</span>
                                </div>
                            </div>
                            <span class="upcoming-badge" v-if="!member.isPast">Upcoming</span>
                        </div>
                    </div>
                </div>
            </p-dialog>
        </div>
    `,

    setup() {
        const { ref, computed, onMounted } = Vue;

        // Get home data from static data
        const homeData = ref(JSON.parse(JSON.stringify(StaticData.homeData)));

        const currentUser = computed(() => homeData.value.currentUser);
        const companyNews = computed(() => homeData.value.companyNews);
        const newJoiners = computed(() => homeData.value.newJoiners);
        const workforceStatus = computed(() => homeData.value.workforceStatus);
        const birthdays = computed(() => homeData.value.birthdays);
        const anniversaries = computed(() => homeData.value.anniversaries);

        const selectedMood = ref(null);
        const moodSubmitted = ref(false);
        const animatingMood = ref(null);
        const showBirthdayModal = ref(false);
        const showWallOfFameModal = ref(false);
        
        // Check if mood was already submitted today
        const checkMoodSubmission = () => {
            const lastMoodDate = localStorage.getItem('lastMoodDate');
            const savedMood = localStorage.getItem('selectedMood');
            const today = new Date().toDateString();
            
            if (lastMoodDate === today && savedMood) {
                selectedMood.value = savedMood;
                moodSubmitted.value = true;
            }
        };
        
        // Select mood with animation (one time per day)
        const selectMood = (mood) => {
            if (moodSubmitted.value) return;
            
            animatingMood.value = mood;
            selectedMood.value = mood;
            
            setTimeout(() => {
                moodSubmitted.value = true;
                animatingMood.value = null;
                
                // Save to localStorage
                localStorage.setItem('lastMoodDate', new Date().toDateString());
                localStorage.setItem('selectedMood', mood);
            }, 600);
        };
        
        // Get mood emoji
        const getMoodEmoji = (mood) => {
            const emojis = { great: '😊', okay: '😐', tired: '😴', struggling: '😟' };
            return emojis[mood] || '😊';
        };

        // Company Documents data (only active documents show on home page)
        const companyDocuments = ref([
            { id: 1, name: 'Regulations of Work in Direct', nameAr: 'أنظمة العمل في دايركت', icon: 'pi-file-pdf', iconClass: 'pdf', status: 'active' },
            { id: 2, name: 'Direct Strategy 2024-2026', nameAr: '2024-2026 إستراتيجية', icon: 'pi-file', iconClass: 'doc', status: 'active' },
            { id: 3, name: 'Vacation & Leave Policy', nameAr: 'سياسة الإجازات', icon: 'pi-calendar', iconClass: 'policy', status: 'active' },
            { id: 4, name: 'Employee Code of Conduct', nameAr: 'مدونة قواعد السلوك', icon: 'pi-users', iconClass: 'conduct', status: 'active' },
            { id: 5, name: 'Performance Review Guide', nameAr: 'دليل تقييم الأداء', icon: 'pi-chart-line', iconClass: 'guide', status: 'active' },
            { id: 6, name: 'Health & Insurance Guide', nameAr: 'دليل التأمين الصحي', icon: 'pi-heart', iconClass: 'health', status: 'active' },
            { id: 7, name: 'Internal Communication', nameAr: 'سياسة التواصل الداخلي', icon: 'pi-comments', iconClass: 'comm', status: 'active' },
            { id: 8, name: 'Remote Work Framework', nameAr: 'إطار العمل عن بعد', icon: 'pi-home', iconClass: 'remote', status: 'active' }
        ]);
        
        // Filter to only show active documents
        const activeCompanyDocuments = computed(() => companyDocuments.value.filter(doc => doc.status === 'active'));

        const openDocument = (doc) => {
            console.log('Opening document:', doc.name);
            // In real implementation, this would open/download the document
            alert('Opening: ' + doc.name);
        };

        // Wall of Fame / Anniversary data - previous 15 and upcoming 15
        const anniversaryCalendar = ref([
            // Previous anniversaries (with engagement stats)
            { id: 1, date: 'Jan 05', name: 'Fahad Al-Mutairi', department: 'FINANCE', years: 8, avatar: 'https://i.pravatar.cc/60?img=33', isPast: true, likes: 42, wishes: 28 },
            { id: 2, date: 'Jan 10', name: 'Lina Al-Rashid', department: 'HR', years: 6, avatar: 'https://i.pravatar.cc/60?img=32', isPast: true, likes: 35, wishes: 22 },
            { id: 3, date: 'Jan 12', name: 'Omar Al-Salem', department: 'IT', years: 5, avatar: 'https://i.pravatar.cc/60?img=57', isPast: true, likes: 28, wishes: 18 },
            { id: 4, date: 'Jan 15', name: 'Maha Al-Ghamdi', department: 'SALES', years: 4, avatar: 'https://i.pravatar.cc/60?img=44', isPast: true, likes: 31, wishes: 20 },
            { id: 5, date: 'Jan 18', name: 'Hassan Al-Zahrani', department: 'ENGINEERING', years: 7, avatar: 'https://i.pravatar.cc/60?img=60', isPast: true, likes: 45, wishes: 32 },
            { id: 6, date: 'Jan 20', name: 'Nadia Al-Harbi', department: 'MARKETING', years: 3, avatar: 'https://i.pravatar.cc/60?img=45', isPast: true, likes: 22, wishes: 14 },
            { id: 7, date: 'Jan 22', name: 'Yusuf Al-Otaibi', department: 'PROJECT MGMT', years: 5, avatar: 'https://i.pravatar.cc/60?img=51', isPast: true, likes: 38, wishes: 25 },
            { id: 8, date: 'Jan 25', name: 'Salma Al-Dossary', department: 'FINANCE', years: 4, avatar: 'https://i.pravatar.cc/60?img=47', isPast: true, likes: 26, wishes: 17 },
            { id: 9, date: 'Jan 28', name: 'Tariq Al-Anazi', department: 'OPERATIONS', years: 6, avatar: 'https://i.pravatar.cc/60?img=52', isPast: true, likes: 33, wishes: 21 },
            { id: 10, date: 'Feb 01', name: 'Amal Al-Fahad', department: 'ADMIN', years: 3, avatar: 'https://i.pravatar.cc/60?img=48', isPast: true, likes: 19, wishes: 12 },
            { id: 11, date: 'Feb 03', name: 'Khalid Al-Subaie', department: 'ENGINEERING', years: 9, avatar: 'https://i.pravatar.cc/60?img=53', isPast: true, likes: 52, wishes: 38 },
            { id: 12, date: 'Feb 05', name: 'Rania Al-Qahtani', department: 'UX', years: 4, avatar: 'https://i.pravatar.cc/60?img=49', isPast: true, likes: 29, wishes: 19 },
            { id: 13, date: 'Feb 07', name: 'Saud Al-Malki', department: 'DATA', years: 5, avatar: 'https://i.pravatar.cc/60?img=54', isPast: true, likes: 34, wishes: 23 },
            { id: 14, date: 'Feb 09', name: 'Huda Al-Shammari', department: 'QA', years: 6, avatar: 'https://i.pravatar.cc/60?img=43', isPast: true, likes: 40, wishes: 27 },
            { id: 15, date: 'Feb 10', name: 'Ali Al-Jaber', department: 'ENGINEERING', years: 7, avatar: 'https://i.pravatar.cc/60?img=55', isPast: true, likes: 44, wishes: 30 },
            // Upcoming anniversaries
            { id: 16, date: 'Feb 12', name: 'Noura Al-Subaie', department: 'MARKETING', years: 7, avatar: 'https://i.pravatar.cc/60?img=10', isPast: false },
            { id: 17, date: 'Feb 14', name: 'Sarah Al-Otaibi', department: 'MARKETING', years: 5, avatar: 'https://i.pravatar.cc/60?img=5', isPast: false },
            { id: 18, date: 'Feb 15', name: 'Khaled Al-Anazi', department: 'MARKETING', years: 4, avatar: 'https://i.pravatar.cc/60?img=11', isPast: false },
            { id: 19, date: 'Feb 17', name: 'Reem Al-Fahad', department: 'SALES', years: 4, avatar: 'https://i.pravatar.cc/60?img=9', isPast: false },
            { id: 20, date: 'Feb 19', name: 'Mohammad Al-Dossari', department: 'HR', years: 3, avatar: 'https://i.pravatar.cc/60?img=14', isPast: false },
            { id: 21, date: 'Feb 21', name: 'Budi Santoso', department: 'HR', years: 3, avatar: 'https://i.pravatar.cc/60?img=53', isPast: false },
            { id: 22, date: 'Feb 24', name: 'Layla Al-Harbi', department: 'CONTENT', years: 2, avatar: 'https://i.pravatar.cc/60?img=42', isPast: false },
            { id: 23, date: 'Feb 26', name: 'Mansour Al-Rashid', department: 'IT', years: 4, avatar: 'https://i.pravatar.cc/60?img=58', isPast: false },
            { id: 24, date: 'Feb 28', name: 'Fatima Al-Salem', department: 'DESIGN', years: 3, avatar: 'https://i.pravatar.cc/60?img=41', isPast: false },
            { id: 25, date: 'Mar 02', name: 'Waleed Al-Ghamdi', department: 'SECURITY', years: 5, avatar: 'https://i.pravatar.cc/60?img=59', isPast: false },
            { id: 26, date: 'Mar 05', name: 'Dina Al-Zahrani', department: 'PRODUCT', years: 4, avatar: 'https://i.pravatar.cc/60?img=46', isPast: false },
            { id: 27, date: 'Mar 08', name: 'Faisal Al-Mutairi', department: 'DEVOPS', years: 3, avatar: 'https://i.pravatar.cc/60?img=61', isPast: false },
            { id: 28, date: 'Mar 10', name: 'Ghada Al-Anazi', department: 'BUSINESS', years: 2, avatar: 'https://i.pravatar.cc/60?img=50', isPast: false },
            { id: 29, date: 'Mar 12', name: 'Ibrahim Al-Fahad', department: 'TECH', years: 6, avatar: 'https://i.pravatar.cc/60?img=62', isPast: false },
            { id: 30, date: 'Mar 15', name: 'Jasmine Al-Qahtani', department: 'AGILE', years: 4, avatar: 'https://i.pravatar.cc/60?img=40', isPast: false }
        ]);
        
        // Keep original for widget display
        const goldenPillars = ref([
            { id: 1, name: 'Noura Al-Subaie', department: 'MARKETING', years: 7, endorsements: 17, avatar: 'https://i.pravatar.cc/80?img=10' },
            { id: 2, name: 'Sarah Al-Otaibi', department: 'MARKETING', years: 5, endorsements: 22, avatar: 'https://i.pravatar.cc/80?img=5' }
        ]);

        const silverStars = ref([
            { id: 1, name: 'Khaled Al-Anazi', department: 'MARKETING', years: 4, endorsements: 21, avatar: 'https://i.pravatar.cc/80?img=11' },
            { id: 2, name: 'Reem Al-Fahad', department: 'SALES', years: 4, endorsements: 46, avatar: 'https://i.pravatar.cc/80?img=9' },
            { id: 3, name: 'Mohammad Al-Dossari', department: 'HR', years: 3, endorsements: 38, avatar: 'https://i.pravatar.cc/80?img=14' },
            { id: 4, name: 'Budi Santoso', department: 'HR', years: 3, endorsements: 10, avatar: 'https://i.pravatar.cc/80?img=53' }
        ]);
        

        // Birthdays data with comments
        const birthdaysData = ref([
            {
                id: 1,
                name: 'Sarah Al-Otaibi',
                date: '03-15',
                avatar: 'https://i.pravatar.cc/60?img=5',
                likes: 6,
                isLiked: false,
                likeAnimating: false,
                likedBy: ['Khaled Al-Anazi', 'Mohammad Al-Dossari', 'Reem Al-Fahad', 'Noura Al-Subaie', 'Ahmed Al-Qahtani', 'Sami Al-Harbi'],
                newComment: '',
                commentsList: [
                    { id: 1, name: 'Ahmed Al-Qahtani', avatar: 'https://i.pravatar.cc/40?img=12', text: 'Happy Birthday! 🎂' }
                ]
            },
            {
                id: 2,
                name: 'Khaled Al-Anazi',
                date: '03-15',
                avatar: 'https://i.pravatar.cc/60?img=11',
                likes: 5,
                isLiked: false,
                likeAnimating: false,
                likedBy: ['Sarah Al-Otaibi', 'Mohammad Al-Dossari', 'Reem Al-Fahad', 'Noura Al-Subaie', 'Ahmed Al-Qahtani'],
                newComment: '',
                commentsList: [
                    { id: 1, name: 'Ahmed Al-Qahtani', avatar: 'https://i.pravatar.cc/40?img=12', text: 'Many happy returns!' }
                ]
            }
        ]);

        // Anniversaries data with comments
        const anniversariesData = ref([
            {
                id: 1,
                name: 'Mohammad Al-Dossari',
                position: 'QA Engineer',
                joinedDate: '2021-02-10',
                years: 5,
                avatar: 'https://i.pravatar.cc/60?img=14',
                likes: 12,
                isLiked: false,
                likeAnimating: false,
                likedBy: ['Sarah Al-Otaibi', 'Khaled Al-Anazi', 'Reem Al-Fahad', 'Noura Al-Subaie', 'Ahmed Al-Qahtani', 'Sami Al-Harbi', 'Ali Al-Rashid', 'Fatima Al-Zahrani', 'Omar Al-Salem', 'Lina Al-Mutairi', 'Hassan Al-Ghamdi', 'Maha Al-Otaibi'],
                newComment: '',
                commentsList: [
                    { id: 1, name: 'Ahmed Al-Qahtani', avatar: 'https://i.pravatar.cc/40?img=12', text: 'Congrats on 5 years!' }
                ]
            }
        ]);

        // Toggle birthday like with animation
        const toggleBirthdayLike = (bday) => {
            bday.likeAnimating = true;
            bday.isLiked = !bday.isLiked;
            bday.likes += bday.isLiked ? 1 : -1;
            
            if (bday.isLiked) {
                if (!bday.likedBy.includes(currentUser.value.name)) {
                    bday.likedBy.unshift(currentUser.value.name);
                }
            } else {
                bday.likedBy = bday.likedBy.filter(n => n !== currentUser.value.name);
            }
            
            setTimeout(() => { bday.likeAnimating = false; }, 400);
        };
        
        // Toggle anniversary like with animation
        const toggleAnniversaryLike = (anni) => {
            anni.likeAnimating = true;
            anni.isLiked = !anni.isLiked;
            anni.likes += anni.isLiked ? 1 : -1;
            
            if (anni.isLiked) {
                if (!anni.likedBy.includes(currentUser.value.name)) {
                    anni.likedBy.unshift(currentUser.value.name);
                }
            } else {
                anni.likedBy = anni.likedBy.filter(n => n !== currentUser.value.name);
            }
            
            setTimeout(() => { anni.likeAnimating = false; }, 400);
        };
        
        // Toggle joiner reaction with animation
        const toggleJoinerReaction = (joiner, type) => {
            if (!joiner.reactions) joiner.reactions = {};
            joiner.animating = type;
            joiner.reactions[type] = !joiner.reactions[type];
            
            setTimeout(() => { joiner.animating = null; }, 400);
        };
        
        // Get unique commenters from comments list
        const getUniqueCommenters = (commentsList) => {
            if (!commentsList) return [];
            const names = commentsList.map(c => c.name);
            return [...new Set(names)];
        };
        
        // Add birthday comment
        const addBirthdayComment = (bday) => {
            if (bday.newComment && bday.newComment.trim()) {
                bday.commentsList.push({
                    id: Date.now(),
                    name: currentUser.value.name,
                    avatar: 'https://i.pravatar.cc/40?img=12',
                    text: bday.newComment.trim()
                });
                bday.newComment = '';
            }
        };

        // Add anniversary comment
        const addAnniversaryComment = (anni) => {
            if (anni.newComment && anni.newComment.trim()) {
                anni.commentsList.push({
                    id: Date.now(),
                    name: currentUser.value.name,
                    avatar: 'https://i.pravatar.cc/40?img=12',
                    text: anni.newComment.trim()
                });
                anni.newComment = '';
            }
        };

        // Current month name
        const currentMonthName = computed(() => {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
            return months[new Date().getMonth()];
        });

        // Birthday calendar data - previous 15 and next 15
        const birthdayCalendar = ref([
            // Previous birthdays (with engagement stats)
            { id: 1, day: 'Jan 25', name: 'Fahad Al-Mutairi', position: 'ACCOUNTANT', avatar: 'https://i.pravatar.cc/60?img=33', isPast: true, likes: 18, wishes: 12 },
            { id: 2, day: 'Jan 28', name: 'Lina Al-Rashid', position: 'HR COORDINATOR', avatar: 'https://i.pravatar.cc/60?img=32', isPast: true, likes: 22, wishes: 15 },
            { id: 3, day: 'Jan 30', name: 'Omar Al-Salem', position: 'IT SUPPORT', avatar: 'https://i.pravatar.cc/60?img=57', isPast: true, likes: 14, wishes: 8 },
            { id: 4, day: 'Feb 02', name: 'Maha Al-Ghamdi', position: 'SALES EXECUTIVE', avatar: 'https://i.pravatar.cc/60?img=44', isPast: true, likes: 25, wishes: 18 },
            { id: 5, day: 'Feb 03', name: 'Hassan Al-Zahrani', position: 'DEVELOPER', avatar: 'https://i.pravatar.cc/60?img=60', isPast: true, likes: 31, wishes: 22 },
            { id: 6, day: 'Feb 05', name: 'Nadia Al-Harbi', position: 'MARKETING SPECIALIST', avatar: 'https://i.pravatar.cc/60?img=45', isPast: true, likes: 19, wishes: 11 },
            { id: 7, day: 'Feb 06', name: 'Yusuf Al-Otaibi', position: 'PROJECT MANAGER', avatar: 'https://i.pravatar.cc/60?img=51', isPast: true, likes: 28, wishes: 20 },
            { id: 8, day: 'Feb 07', name: 'Salma Al-Dossary', position: 'FINANCE ANALYST', avatar: 'https://i.pravatar.cc/60?img=47', isPast: true, likes: 16, wishes: 9 },
            { id: 9, day: 'Feb 08', name: 'Tariq Al-Anazi', position: 'OPERATIONS LEAD', avatar: 'https://i.pravatar.cc/60?img=52', isPast: true, likes: 21, wishes: 14 },
            { id: 10, day: 'Feb 09', name: 'Amal Al-Fahad', position: 'ADMIN ASSISTANT', avatar: 'https://i.pravatar.cc/60?img=48', isPast: true, likes: 17, wishes: 10 },
            { id: 11, day: 'Feb 10', name: 'Khalid Al-Subaie', position: 'SENIOR ENGINEER', avatar: 'https://i.pravatar.cc/60?img=53', isPast: true, likes: 35, wishes: 25 },
            { id: 12, day: 'Feb 10', name: 'Rania Al-Qahtani', position: 'UX RESEARCHER', avatar: 'https://i.pravatar.cc/60?img=49', isPast: true, likes: 24, wishes: 16 },
            { id: 13, day: 'Feb 11', name: 'Saud Al-Malki', position: 'DATA ENGINEER', avatar: 'https://i.pravatar.cc/60?img=54', isPast: true, likes: 20, wishes: 13 },
            { id: 14, day: 'Feb 12', name: 'Huda Al-Shammari', position: 'QA LEAD', avatar: 'https://i.pravatar.cc/60?img=43', isPast: true, likes: 27, wishes: 19 },
            { id: 15, day: 'Feb 14', name: 'Ali Al-Jaber', position: 'BACKEND DEVELOPER', avatar: 'https://i.pravatar.cc/60?img=55', isPast: true, likes: 23, wishes: 17 },
            // Upcoming birthdays
            { id: 16, day: 'Feb 15', name: 'Sarah Al-Otaibi', position: 'UI/UX DESIGNER', avatar: 'https://i.pravatar.cc/60?img=5', isPast: false },
            { id: 17, day: 'Feb 15', name: 'Khaled Al-Anazi', position: 'DATA ANALYST', avatar: 'https://i.pravatar.cc/60?img=11', isPast: false },
            { id: 18, day: 'Feb 16', name: 'Mohammad Al-Dossari', position: 'QA ENGINEER', avatar: 'https://i.pravatar.cc/60?img=14', isPast: false },
            { id: 19, day: 'Feb 18', name: 'Reem Al-Fahad', position: 'MARKETING LEAD', avatar: 'https://i.pravatar.cc/60?img=9', isPast: false },
            { id: 20, day: 'Feb 20', name: 'Noura Al-Subaie', position: 'HR SPECIALIST', avatar: 'https://i.pravatar.cc/60?img=10', isPast: false },
            { id: 21, day: 'Feb 22', name: 'Badr Al-Otaibi', position: 'SALES MANAGER', avatar: 'https://i.pravatar.cc/60?img=56', isPast: false },
            { id: 22, day: 'Feb 24', name: 'Layla Al-Harbi', position: 'CONTENT WRITER', avatar: 'https://i.pravatar.cc/60?img=42', isPast: false },
            { id: 23, day: 'Feb 25', name: 'Mansour Al-Rashid', position: 'NETWORK ADMIN', avatar: 'https://i.pravatar.cc/60?img=58', isPast: false },
            { id: 24, day: 'Feb 27', name: 'Fatima Al-Salem', position: 'GRAPHIC DESIGNER', avatar: 'https://i.pravatar.cc/60?img=41', isPast: false },
            { id: 25, day: 'Feb 28', name: 'Waleed Al-Ghamdi', position: 'SECURITY ANALYST', avatar: 'https://i.pravatar.cc/60?img=59', isPast: false },
            { id: 26, day: 'Mar 01', name: 'Dina Al-Zahrani', position: 'PRODUCT MANAGER', avatar: 'https://i.pravatar.cc/60?img=46', isPast: false },
            { id: 27, day: 'Mar 03', name: 'Faisal Al-Mutairi', position: 'DEVOPS ENGINEER', avatar: 'https://i.pravatar.cc/60?img=61', isPast: false },
            { id: 28, day: 'Mar 05', name: 'Ghada Al-Anazi', position: 'BUSINESS ANALYST', avatar: 'https://i.pravatar.cc/60?img=50', isPast: false },
            { id: 29, day: 'Mar 07', name: 'Ibrahim Al-Fahad', position: 'TECH LEAD', avatar: 'https://i.pravatar.cc/60?img=62', isPast: false },
            { id: 30, day: 'Mar 10', name: 'Jasmine Al-Qahtani', position: 'SCRUM MASTER', avatar: 'https://i.pravatar.cc/60?img=40', isPast: false }
        ]);

        // Dynamic greeting based on time of day
        const currentTime = ref('');
        const greetingText = ref('');
        const greetingIcon = ref('');

        const updateGreeting = () => {
            const now = new Date();
            const hours = now.getHours();
            
            // Format time as HH:MM AM/PM
            currentTime.value = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            
            if (hours >= 5 && hours < 12) {
                greetingText.value = 'GOOD MORNING';
                greetingIcon.value = 'pi-sun';
            } else if (hours >= 12 && hours < 17) {
                greetingText.value = 'GOOD AFTERNOON';
                greetingIcon.value = 'pi-sun';
            } else if (hours >= 17 && hours < 21) {
                greetingText.value = 'GOOD EVENING';
                greetingIcon.value = 'pi-moon';
            } else {
                greetingText.value = 'GOOD NIGHT';
                greetingIcon.value = 'pi-moon';
            }
        };

        // Initialize comments for news items
        onMounted(() => {
            // Set initial greeting
            updateGreeting();
            
            // Update time every minute
            setInterval(updateGreeting, 60000);
            
            // Check if mood was already submitted today
            checkMoodSubmission();
            
            homeData.value.companyNews.forEach(news => {
                news.isLiked = false;
                news.likeAnimating = false;
                news.showComments = true;
                news.newComment = '';
                news.likedBy = ['Khaled Al-Anazi', 'Sarah Al-Otaibi', 'Mohammad Al-Dossari'];
                if (!news.commentsList) {
                    news.commentsList = [
                        {
                            id: 1,
                            name: 'Sami Al-Harbi',
                            avatar: 'https://i.pravatar.cc/40?img=15',
                            text: 'This is great news! 🎉',
                            time: '2h ago'
                        },
                        {
                            id: 2,
                            name: 'Ahmed Al-Qahtani',
                            avatar: 'https://i.pravatar.cc/40?img=12',
                            text: 'Congratulations to the team!',
                            time: 'Just now'
                        }
                    ];
                }
            });
            
            // Initialize joiners with reactions
            newJoiners.value.forEach(joiner => {
                joiner.reactions = {};
                joiner.animating = null;
            });
        });

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        };

        const toggleLike = (news) => {
            news.likeAnimating = true;
            news.isLiked = !news.isLiked;
            news.likes += news.isLiked ? 1 : -1;
            
            if (!news.likedBy) news.likedBy = [];
            if (news.isLiked) {
                if (!news.likedBy.includes(currentUser.value.name)) {
                    news.likedBy.unshift(currentUser.value.name);
                }
            } else {
                news.likedBy = news.likedBy.filter(n => n !== currentUser.value.name);
            }
            
            setTimeout(() => { news.likeAnimating = false; }, 400);
        };

        const toggleComments = (news) => {
            news.showComments = !news.showComments;
        };

        const addComment = (news) => {
            if (news.newComment && news.newComment.trim()) {
                news.commentsList.push({
                    id: Date.now(),
                    name: currentUser.value.name,
                    avatar: 'https://i.pravatar.cc/40?img=12',
                    text: news.newComment.trim(),
                    time: 'Just now'
                });
                news.newComment = '';
            }
        };

        return {
            currentUser,
            companyNews,
            companyDocuments,
            activeCompanyDocuments,
            newJoiners,
            workforceStatus,
            birthdays,
            anniversaries,
            birthdaysData,
            anniversariesData,
            goldenPillars,
            silverStars,
            selectedMood,
            moodSubmitted,
            animatingMood,
            showBirthdayModal,
            showWallOfFameModal,
            currentMonthName,
            birthdayCalendar,
            anniversaryCalendar,
            currentTime,
            greetingText,
            greetingIcon,
            formatDate,
            toggleLike,
            toggleComments,
            addComment,
            addBirthdayComment,
            addAnniversaryComment,
            toggleBirthdayLike,
            toggleAnniversaryLike,
            toggleJoinerReaction,
            getUniqueCommenters,
            selectMood,
            getMoodEmoji,
            openDocument
        };
    }
};

window.HomeComponent = HomeComponent;
