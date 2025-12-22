export type UserRole = 'user' | 'volunteer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  quizzesTaken: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
  order: number;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'slide' | 'document';
  url: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  lessonsCount: number;
  isVolunteerOnly: boolean;
  isPublished: boolean;
  lessons: Lesson[];
  materials: CourseMaterial[];
  quiz?: Quiz;
  enrolledCount: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  rank: number;
  quizId: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@church.org',
    role: 'user',
    enrolledCourses: ['1', '2'],
    completedCourses: ['3'],
    quizzesTaken: 5,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@church.org',
    role: 'volunteer',
    enrolledCourses: ['1', '4'],
    completedCourses: ['2'],
    quizzesTaken: 8,
  },
  {
    id: '3',
    name: 'Pastor Michael',
    email: 'michael@church.org',
    role: 'admin',
    enrolledCourses: [],
    completedCourses: [],
    quizzesTaken: 0,
  },
];

// Current logged in user (for mock auth)
export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@church.org',
  role: 'admin', // Can change to 'user' or 'volunteer' to test different views
  enrolledCourses: ['1', '2'],
  completedCourses: ['3'],
  quizzesTaken: 5,
};

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Foundations of Faith',
    description: 'Explore the core beliefs and doctrines that form the foundation of the Christian faith. This comprehensive course covers essential topics from Scripture, theology, and practical application for daily living.',
    shortDescription: 'Discover the core beliefs of Christianity',
    thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=250&fit=crop',
    instructor: 'Pastor Michael',
    duration: '4 weeks',
    lessonsCount: 8,
    isVolunteerOnly: false,
    isPublished: true,
    enrolledCount: 156,
    lessons: [
      { id: 'l1', title: 'Understanding God\'s Nature', duration: '25:00', videoUrl: '#', completed: true, order: 1 },
      { id: 'l2', title: 'The Trinity Explained', duration: '30:00', videoUrl: '#', completed: true, order: 2 },
      { id: 'l3', title: 'Jesus Christ: Son of God', duration: '28:00', videoUrl: '#', completed: false, order: 3 },
      { id: 'l4', title: 'The Holy Spirit\'s Role', duration: '22:00', videoUrl: '#', completed: false, order: 4 },
      { id: 'l5', title: 'Salvation and Grace', duration: '35:00', videoUrl: '#', completed: false, order: 5 },
      { id: 'l6', title: 'The Church Community', duration: '20:00', videoUrl: '#', completed: false, order: 6 },
      { id: 'l7', title: 'Prayer and Worship', duration: '25:00', videoUrl: '#', completed: false, order: 7 },
      { id: 'l8', title: 'Living Out Your Faith', duration: '30:00', videoUrl: '#', completed: false, order: 8 },
    ],
    materials: [
      { id: 'm1', title: 'Study Guide - Week 1', type: 'pdf', url: '#' },
      { id: 'm2', title: 'Scripture References', type: 'document', url: '#' },
      { id: 'm3', title: 'Presentation Slides', type: 'slide', url: '#' },
    ],
    quiz: {
      id: 'q1',
      title: 'Foundations of Faith Quiz',
      passingScore: 70,
      questions: [
        { id: 'qq1', question: 'What is the Trinity?', options: ['Three separate Gods', 'One God in three persons', 'A council of angels', 'A metaphor'], correctAnswer: 1 },
        { id: 'qq2', question: 'What does grace mean?', options: ['Earning salvation', 'Unmerited favor from God', 'A type of prayer', 'Church membership'], correctAnswer: 1 },
        { id: 'qq3', question: 'Who is the Holy Spirit?', options: ['An angel', 'A force', 'Third person of the Trinity', 'A prophet'], correctAnswer: 2 },
        { id: 'qq4', question: 'What is salvation?', options: ['Being good enough', 'Church attendance', 'Deliverance from sin through Christ', 'Following rules'], correctAnswer: 2 },
        { id: 'qq5', question: 'Why is prayer important?', options: ['It\'s optional', 'Communication with God', 'Only for leaders', 'Just tradition'], correctAnswer: 1 },
      ],
    },
  },
  {
    id: '2',
    title: 'Bible Study Methods',
    description: 'Learn effective techniques for studying and understanding the Bible. From inductive study to word studies, this course will transform how you engage with Scripture.',
    shortDescription: 'Master the art of Bible study',
    thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=250&fit=crop',
    instructor: 'Dr. Emily Carter',
    duration: '3 weeks',
    lessonsCount: 6,
    isVolunteerOnly: false,
    isPublished: true,
    enrolledCount: 234,
    lessons: [
      { id: 'l9', title: 'Observation: What Does It Say?', duration: '30:00', videoUrl: '#', completed: false, order: 1 },
      { id: 'l10', title: 'Interpretation: What Does It Mean?', duration: '35:00', videoUrl: '#', completed: false, order: 2 },
      { id: 'l11', title: 'Application: How Does It Apply?', duration: '25:00', videoUrl: '#', completed: false, order: 3 },
      { id: 'l12', title: 'Word Studies Deep Dive', duration: '40:00', videoUrl: '#', completed: false, order: 4 },
      { id: 'l13', title: 'Context is King', duration: '28:00', videoUrl: '#', completed: false, order: 5 },
      { id: 'l14', title: 'Putting It All Together', duration: '35:00', videoUrl: '#', completed: false, order: 6 },
    ],
    materials: [
      { id: 'm4', title: 'Study Method Worksheets', type: 'pdf', url: '#' },
      { id: 'm5', title: 'Recommended Resources', type: 'document', url: '#' },
    ],
    quiz: {
      id: 'q2',
      title: 'Bible Study Methods Quiz',
      passingScore: 70,
      questions: [
        { id: 'qq6', question: 'What are the three steps of inductive Bible study?', options: ['Read, Pray, Share', 'Observation, Interpretation, Application', 'Listen, Learn, Teach', 'Study, Memorize, Recite'], correctAnswer: 1 },
        { id: 'qq7', question: 'Why is context important?', options: ['It\'s not important', 'Prevents misinterpretation', 'Only for scholars', 'Makes reading faster'], correctAnswer: 1 },
      ],
    },
  },
  {
    id: '3',
    title: 'Servant Leadership',
    description: 'Develop leadership skills rooted in biblical principles. Learn how to lead like Jesus through service, humility, and integrity.',
    shortDescription: 'Lead with a servant\'s heart',
    thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=250&fit=crop',
    instructor: 'Pastor David Lee',
    duration: '5 weeks',
    lessonsCount: 10,
    isVolunteerOnly: true,
    isPublished: true,
    enrolledCount: 89,
    lessons: [
      { id: 'l15', title: 'What is Servant Leadership?', duration: '25:00', videoUrl: '#', completed: true, order: 1 },
      { id: 'l16', title: 'Jesus as the Model Leader', duration: '30:00', videoUrl: '#', completed: true, order: 2 },
      { id: 'l17', title: 'Humility in Leadership', duration: '28:00', videoUrl: '#', completed: true, order: 3 },
      { id: 'l18', title: 'Building Team Trust', duration: '32:00', videoUrl: '#', completed: true, order: 4 },
      { id: 'l19', title: 'Effective Communication', duration: '25:00', videoUrl: '#', completed: true, order: 5 },
      { id: 'l20', title: 'Conflict Resolution', duration: '30:00', videoUrl: '#', completed: true, order: 6 },
      { id: 'l21', title: 'Empowering Others', duration: '28:00', videoUrl: '#', completed: true, order: 7 },
      { id: 'l22', title: 'Vision and Direction', duration: '35:00', videoUrl: '#', completed: true, order: 8 },
      { id: 'l23', title: 'Accountability Matters', duration: '22:00', videoUrl: '#', completed: true, order: 9 },
      { id: 'l24', title: 'Legacy of Leadership', duration: '30:00', videoUrl: '#', completed: true, order: 10 },
    ],
    materials: [
      { id: 'm6', title: 'Leadership Assessment', type: 'pdf', url: '#' },
      { id: 'm7', title: 'Action Plan Template', type: 'document', url: '#' },
      { id: 'm8', title: 'Case Studies', type: 'pdf', url: '#' },
    ],
    quiz: {
      id: 'q3',
      title: 'Servant Leadership Quiz',
      passingScore: 75,
      questions: [
        { id: 'qq8', question: 'What is the primary characteristic of servant leadership?', options: ['Authority', 'Humility and service', 'Control', 'Recognition'], correctAnswer: 1 },
        { id: 'qq9', question: 'How did Jesus demonstrate servant leadership?', options: ['By ruling with power', 'By washing disciples\' feet', 'By demanding respect', 'By avoiding conflict'], correctAnswer: 1 },
        { id: 'qq10', question: 'What builds trust in a team?', options: ['Secrecy', 'Consistency and integrity', 'Competition', 'Distance'], correctAnswer: 1 },
      ],
    },
  },
  {
    id: '4',
    title: 'Youth Ministry Essentials',
    description: 'Comprehensive training for youth ministry volunteers covering mentorship, program planning, and engaging with teenagers.',
    shortDescription: 'Equip yourself for youth ministry',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop',
    instructor: 'Rebecca Thomas',
    duration: '4 weeks',
    lessonsCount: 8,
    isVolunteerOnly: true,
    isPublished: true,
    enrolledCount: 67,
    lessons: [
      { id: 'l25', title: 'Understanding Teenagers Today', duration: '35:00', videoUrl: '#', completed: false, order: 1 },
      { id: 'l26', title: 'Building Meaningful Relationships', duration: '30:00', videoUrl: '#', completed: false, order: 2 },
      { id: 'l27', title: 'Creating Safe Environments', duration: '25:00', videoUrl: '#', completed: false, order: 3 },
      { id: 'l28', title: 'Engaging Teaching Methods', duration: '32:00', videoUrl: '#', completed: false, order: 4 },
      { id: 'l29', title: 'Small Group Leadership', duration: '28:00', videoUrl: '#', completed: false, order: 5 },
      { id: 'l30', title: 'Event Planning Basics', duration: '30:00', videoUrl: '#', completed: false, order: 6 },
      { id: 'l31', title: 'Partnering with Parents', duration: '25:00', videoUrl: '#', completed: false, order: 7 },
      { id: 'l32', title: 'Self-Care for Volunteers', duration: '20:00', videoUrl: '#', completed: false, order: 8 },
    ],
    materials: [
      { id: 'm9', title: 'Youth Ministry Handbook', type: 'pdf', url: '#' },
      { id: 'm10', title: 'Game Ideas Collection', type: 'document', url: '#' },
    ],
    quiz: {
      id: 'q4',
      title: 'Youth Ministry Quiz',
      passingScore: 70,
      questions: [
        { id: 'qq11', question: 'What is most important in youth ministry?', options: ['Cool programs', 'Building relationships', 'Having answers', 'Entertainment'], correctAnswer: 1 },
        { id: 'qq12', question: 'Why is a safe environment important?', options: ['Legal requirement only', 'Teens can be vulnerable', 'Not really important', 'For parents\' peace'], correctAnswer: 1 },
      ],
    },
  },
  {
    id: '5',
    title: 'Spiritual Disciplines',
    description: 'Deepen your faith through the practice of spiritual disciplines including prayer, fasting, meditation, and solitude.',
    shortDescription: 'Grow deeper in your faith journey',
    thumbnail: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400&h=250&fit=crop',
    instructor: 'Sister Grace',
    duration: '6 weeks',
    lessonsCount: 12,
    isVolunteerOnly: false,
    isPublished: true,
    enrolledCount: 312,
    lessons: [
      { id: 'l33', title: 'Introduction to Spiritual Disciplines', duration: '20:00', videoUrl: '#', completed: false, order: 1 },
      { id: 'l34', title: 'The Practice of Prayer', duration: '30:00', videoUrl: '#', completed: false, order: 2 },
      { id: 'l35', title: 'Fasting with Purpose', duration: '25:00', videoUrl: '#', completed: false, order: 3 },
      { id: 'l36', title: 'Meditation on Scripture', duration: '28:00', videoUrl: '#', completed: false, order: 4 },
      { id: 'l37', title: 'The Gift of Solitude', duration: '22:00', videoUrl: '#', completed: false, order: 5 },
      { id: 'l38', title: 'Journaling Your Journey', duration: '20:00', videoUrl: '#', completed: false, order: 6 },
      { id: 'l39', title: 'Sabbath Rest', duration: '25:00', videoUrl: '#', completed: false, order: 7 },
      { id: 'l40', title: 'Worship as a Lifestyle', duration: '30:00', videoUrl: '#', completed: false, order: 8 },
      { id: 'l41', title: 'Service and Generosity', duration: '28:00', videoUrl: '#', completed: false, order: 9 },
      { id: 'l42', title: 'Community and Fellowship', duration: '25:00', videoUrl: '#', completed: false, order: 10 },
      { id: 'l43', title: 'Simplicity and Contentment', duration: '22:00', videoUrl: '#', completed: false, order: 11 },
      { id: 'l44', title: 'Integrating Disciplines', duration: '30:00', videoUrl: '#', completed: false, order: 12 },
    ],
    materials: [
      { id: 'm11', title: 'Spiritual Disciplines Journal', type: 'pdf', url: '#' },
      { id: 'm12', title: 'Prayer Guide', type: 'document', url: '#' },
      { id: 'm13', title: 'Meditation Exercises', type: 'pdf', url: '#' },
    ],
    quiz: {
      id: 'q5',
      title: 'Spiritual Disciplines Quiz',
      passingScore: 70,
      questions: [
        { id: 'qq13', question: 'What is the purpose of spiritual disciplines?', options: ['Earning God\'s favor', 'Growing closer to God', 'Impressing others', 'Following rules'], correctAnswer: 1 },
        { id: 'qq14', question: 'What is biblical meditation?', options: ['Emptying the mind', 'Focusing on Scripture', 'A form of yoga', 'Just relaxation'], correctAnswer: 1 },
      ],
    },
  },
];

// Mock Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  { userId: '10', userName: 'David Kim', score: 100, rank: 1, quizId: 'q1' },
  { userId: '11', userName: 'Maria Garcia', score: 95, rank: 2, quizId: 'q1' },
  { userId: '12', userName: 'James Wilson', score: 90, rank: 3, quizId: 'q1' },
  { userId: '13', userName: 'Emma Davis', score: 85, rank: 4, quizId: 'q1' },
  { userId: '14', userName: 'Michael Brown', score: 80, rank: 5, quizId: 'q1' },
  { userId: '1', userName: 'John Doe', score: 75, rank: 6, quizId: 'q1' },
  { userId: '15', userName: 'Sarah Lee', score: 98, rank: 1, quizId: 'q2' },
  { userId: '16', userName: 'Tom Harris', score: 92, rank: 2, quizId: 'q2' },
  { userId: '17', userName: 'Lisa Chen', score: 88, rank: 3, quizId: 'q2' },
  { userId: '18', userName: 'Robert Taylor', score: 85, rank: 4, quizId: 'q2' },
  { userId: '19', userName: 'Jennifer White', score: 82, rank: 5, quizId: 'q2' },
];

// Recent Activity
export interface Activity {
  id: string;
  type: 'course_enrolled' | 'lesson_completed' | 'quiz_taken' | 'course_completed';
  title: string;
  timestamp: Date;
  courseId?: string;
}

export const mockActivities: Activity[] = [
  { id: 'a1', type: 'lesson_completed', title: 'Completed "The Trinity Explained"', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), courseId: '1' },
  { id: 'a2', type: 'course_enrolled', title: 'Enrolled in "Bible Study Methods"', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), courseId: '2' },
  { id: 'a3', type: 'quiz_taken', title: 'Took "Servant Leadership Quiz"', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), courseId: '3' },
  { id: 'a4', type: 'course_completed', title: 'Completed "Servant Leadership"', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), courseId: '3' },
];

// Helper functions
export const getCourseProgress = (course: Course): number => {
  if (course.lessons.length === 0) return 0;
  const completedLessons = course.lessons.filter(l => l.completed).length;
  return Math.round((completedLessons / course.lessons.length) * 100);
};

export const isQuizUnlocked = (course: Course): boolean => {
  return course.lessons.every(lesson => lesson.completed);
};

export const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
};
