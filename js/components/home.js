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
                <div class="mood-selector">
                    <div class="mood-title">How are you feeling?</div>
                    <div class="mood-options">
                        <div class="mood-option" :class="{ active: selectedMood === 'great' }" @click="selectedMood = 'great'">
                            <span class="mood-icon">😊</span>
                            <span class="mood-label">Great</span>
                        </div>
                        <div class="mood-option" :class="{ active: selectedMood === 'okay' }" @click="selectedMood = 'okay'">
                            <span class="mood-icon">😐</span>
                            <span class="mood-label">Okay</span>
                        </div>
                        <div class="mood-option" :class="{ active: selectedMood === 'tired' }" @click="selectedMood = 'tired'">
                            <span class="mood-icon">😴</span>
                            <span class="mood-label">Tired</span>
                        </div>
                        <div class="mood-option" :class="{ active: selectedMood === 'struggling' }" @click="selectedMood = 'struggling'">
                            <span class="mood-icon">😟</span>
                            <span class="mood-label">Struggling</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="home-content-grid">
                <!-- Left Column: Company News -->
                <div class="home-left-column">
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
                                <button class="action-btn" :class="{ liked: news.isLiked }" @click="toggleLike(news)">
                                    <i :class="news.isLiked ? 'pi pi-heart-fill' : 'pi pi-heart'"></i> {{ news.likes }}
                                </button>
                                <button class="action-btn" @click="toggleComments(news)">
                                    <i class="pi pi-comment"></i> {{ news.commentsList ? news.commentsList.length : 0 }}
                                </button>
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
                                    <span class="stat-item"><i class="pi pi-heart"></i> {{ bday.likes }}</span>
                                    <span class="stat-item"><i class="pi pi-comment"></i> {{ bday.commentsList.length }} Wishes</span>
                                </div>
                                <div class="liked-by">Liked by <strong>Khaled</strong></div>
                                
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
                                    <span class="stat-item"><i class="pi pi-heart"></i> {{ anni.likes }}</span>
                                    <span class="stat-item"><i class="pi pi-comment"></i> {{ anni.commentsList.length }} Wishes</span>
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
                                        <button class="reaction-btn"><i class="pi pi-heart"></i> Welcome!</button>
                                        <button class="reaction-btn"><i class="pi pi-comments"></i> Hi!</button>
                                        <button class="reaction-btn"><i class="pi pi-thumbs-up"></i> Cheers!</button>
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
            <p-dialog v-model:visible="showBirthdayModal" :modal="true" :style="{ width: '450px' }" :closable="true" :showHeader="false">
                <div class="birthday-modal">
                    <div class="birthday-modal-header">
                        <h3>{{ currentMonthName }} Birthdays</h3>
                        <button class="modal-close-btn" @click="showBirthdayModal = false"><i class="pi pi-times"></i></button>
                    </div>
                    <div class="birthday-modal-list">
                        <div v-for="bday in monthBirthdays" :key="bday.id" class="birthday-modal-item">
                            <div class="birthday-day">{{ bday.day }}</div>
                            <img :src="bday.avatar" :alt="bday.name" class="birthday-modal-avatar">
                            <div class="birthday-modal-info">
                                <div class="birthday-modal-name">{{ bday.name }}</div>
                                <div class="birthday-modal-position">{{ bday.position }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </p-dialog>
            
            <!-- Wall of Fame Modal -->
            <p-dialog v-model:visible="showWallOfFameModal" :modal="true" :style="{ width: '800px' }" :closable="true" :showHeader="false">
                <div class="wall-of-fame-modal">
                    <div class="wof-header">
                        <div class="wof-header-content">
                            <i class="pi pi-trophy"></i>
                            <div>
                                <h3>Wall of Fame</h3>
                                <p>Honoring our long-standing champions and their journey at Direct</p>
                            </div>
                        </div>
                        <button class="modal-close-btn" @click="showWallOfFameModal = false"><i class="pi pi-times"></i></button>
                    </div>
                    
                    <div class="wof-content">
                        <!-- Golden Pillars Section -->
                        <div class="wof-section">
                            <div class="wof-section-title golden">
                                <i class="pi pi-star-fill"></i>
                                <span>GOLDEN PILLARS</span>
                            </div>
                            <div class="wof-cards-grid">
                                <div v-for="member in goldenPillars" :key="member.id" class="wof-card">
                                    <div class="wof-card-header">
                                        <img :src="member.avatar" :alt="member.name" class="wof-avatar">
                                        <span class="wof-years-badge golden">{{ member.years }}Y</span>
                                    </div>
                                    <div class="wof-card-body">
                                        <div class="wof-name">{{ member.name }}</div>
                                        <div class="wof-position">{{ member.department }}</div>
                                        <div class="wof-milestone">
                                            <i class="pi pi-star-fill"></i>
                                            <span>TOP MILESTONE</span>
                                        </div>
                                        <div class="wof-milestone-text">"{{ member.milestone }}"</div>
                                        <div class="wof-card-footer">
                                            <span class="wof-endorsements"><i class="pi pi-users"></i> {{ member.endorsements }} Endorsements</span>
                                            <a href="#" class="wof-profile-link">Full Profile</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Silver Stars Section -->
                        <div class="wof-section">
                            <div class="wof-section-title silver">
                                <i class="pi pi-verified"></i>
                                <span>SILVER STARS</span>
                            </div>
                            <div class="wof-cards-grid">
                                <div v-for="member in silverStars" :key="member.id" class="wof-card">
                                    <div class="wof-card-header">
                                        <img :src="member.avatar" :alt="member.name" class="wof-avatar">
                                        <span class="wof-years-badge silver">{{ member.years }}Y</span>
                                    </div>
                                    <div class="wof-card-body">
                                        <div class="wof-name">{{ member.name }}</div>
                                        <div class="wof-position">{{ member.department }}</div>
                                        <div class="wof-milestone">
                                            <i class="pi pi-star-fill"></i>
                                            <span>TOP MILESTONE</span>
                                        </div>
                                        <div class="wof-milestone-text">"{{ member.milestone }}"</div>
                                        <div class="wof-card-footer">
                                            <span class="wof-endorsements"><i class="pi pi-users"></i> {{ member.endorsements }} Endorsements</span>
                                            <a href="#" class="wof-profile-link">Full Profile</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
        const showBirthdayModal = ref(false);
        const showWallOfFameModal = ref(false);

        // Wall of Fame data
        const goldenPillars = ref([
            {
                id: 1,
                name: 'Noura Al-Subaie',
                department: 'MARKETING',
                years: 7,
                milestone: 'Led the 2023 Digital Rebrand',
                endorsements: 17,
                avatar: 'https://i.pravatar.cc/80?img=10'
            },
            {
                id: 2,
                name: 'Sarah Al-Otaibi',
                department: 'MARKETING',
                years: 5,
                milestone: 'Top Sales Performer Q3',
                endorsements: 22,
                avatar: 'https://i.pravatar.cc/80?img=5'
            }
        ]);

        const silverStars = ref([
            {
                id: 1,
                name: 'Khaled Al-Anazi',
                department: 'MARKETING',
                years: 4,
                milestone: 'Optimized Cloud Infrastructure',
                endorsements: 21,
                avatar: 'https://i.pravatar.cc/80?img=11'
            },
            {
                id: 2,
                name: 'Reem Al-Fahad',
                department: 'SALES',
                years: 4,
                milestone: 'Implemented HR Automation',
                endorsements: 46,
                avatar: 'https://i.pravatar.cc/80?img=9'
            },
            {
                id: 3,
                name: 'Mohammad Al-Dossari',
                department: 'HR',
                years: 3,
                milestone: 'Optimized Cloud Infrastructure',
                endorsements: 38,
                avatar: 'https://i.pravatar.cc/80?img=14'
            },
            {
                id: 4,
                name: 'Budi Santoso',
                department: 'HR',
                years: 3,
                milestone: 'Optimized Cloud Infrastructure',
                endorsements: 10,
                avatar: 'https://i.pravatar.cc/80?img=53'
            }
        ]);

        // Birthdays data with comments
        const birthdaysData = ref([
            {
                id: 1,
                name: 'Sarah Al-Otaibi',
                date: '03-15',
                avatar: 'https://i.pravatar.cc/60?img=5',
                likes: 6,
                newComment: '',
                commentsList: [
                    { id: 1, name: 'Ahmed Al-Qahtani', avatar: 'https://i.pravatar.cc/40?img=12', text: '"a"' }
                ]
            },
            {
                id: 2,
                name: 'Khaled Al-Anazi',
                date: '03-15',
                avatar: 'https://i.pravatar.cc/60?img=11',
                likes: 5,
                newComment: '',
                commentsList: [
                    { id: 1, name: 'Ahmed Al-Qahtani', avatar: 'https://i.pravatar.cc/40?img=12', text: '"s"' }
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
                newComment: '',
                commentsList: [
                    { id: 1, name: 'Ahmed Al-Qahtani', avatar: 'https://i.pravatar.cc/40?img=12', text: 'Congrats on 5 years!' }
                ]
            }
        ]);

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

        // Month birthdays data
        const monthBirthdays = ref([
            { id: 1, day: 15, name: 'Sarah Al-Otaibi', position: 'UI/UX DESIGNER', avatar: 'https://i.pravatar.cc/60?img=5' },
            { id: 2, day: 15, name: 'Khaled Al-Anazi', position: 'DATA ANALYST', avatar: 'https://i.pravatar.cc/60?img=11' },
            { id: 3, day: 16, name: 'Mohammad Al-Dossari', position: 'QA ENGINEER', avatar: 'https://i.pravatar.cc/60?img=14' },
            { id: 4, day: 18, name: 'Reem Al-Fahad', position: 'MARKETING LEAD', avatar: 'https://i.pravatar.cc/60?img=9' },
            { id: 5, day: 20, name: 'Noura Al-Subaie', position: 'HR SPECIALIST', avatar: 'https://i.pravatar.cc/60?img=10' }
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
            
            homeData.value.companyNews.forEach(news => {
                news.isLiked = false;
                news.showComments = true;
                news.newComment = '';
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
        });

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        };

        const toggleLike = (news) => {
            news.isLiked = !news.isLiked;
            news.likes += news.isLiked ? 1 : -1;
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
            newJoiners,
            workforceStatus,
            birthdays,
            anniversaries,
            birthdaysData,
            anniversariesData,
            goldenPillars,
            silverStars,
            selectedMood,
            showBirthdayModal,
            showWallOfFameModal,
            currentMonthName,
            monthBirthdays,
            currentTime,
            greetingText,
            greetingIcon,
            formatDate,
            toggleLike,
            toggleComments,
            addComment,
            addBirthdayComment,
            addAnniversaryComment
        };
    }
};

window.HomeComponent = HomeComponent;
