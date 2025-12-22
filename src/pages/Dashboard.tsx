import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, mockActivities, formatTimeAgo, getCourseProgress } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { user } = useAuth();

  const enrolledCourses = mockCourses.filter(c => user?.enrolledCourses.includes(c.id));
  const completedCoursesCount = user?.completedCourses.length || 0;

  const stats = [
    { 
      label: 'Enrolled Courses', 
      value: user?.enrolledCourses.length || 0, 
      icon: BookOpen, 
      color: 'text-primary',
      bgColor: 'bg-primary-light'
    },
    { 
      label: 'Completed', 
      value: completedCoursesCount, 
      icon: GraduationCap, 
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    { 
      label: 'Quizzes Taken', 
      value: user?.quizzesTaken || 0, 
      icon: Trophy, 
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_enrolled':
        return <BookOpen className="w-4 h-4 text-primary" />;
      case 'lesson_completed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'quiz_taken':
        return <Trophy className="w-4 h-4 text-secondary" />;
      case 'course_completed':
        return <Star className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue your learning journey today
            </p>
          </div>
          <Link to="/courses">
            <Button variant="gradient">
              Browse Courses
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="shadow-card hover:shadow-elevated transition-shadow duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-heading font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Continue Learning</CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                  </div>
                  <Link to="/my-learning">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.slice(0, 3).map((course) => {
                    const progress = getCourseProgress(course);
                    const nextLesson = course.lessons.find(l => !l.completed);

                    return (
                      <Link 
                        key={course.id} 
                        to={`/courses/${course.id}`}
                        className="block"
                      >
                        <div className="flex gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-24 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {course.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {nextLesson ? `Next: ${nextLesson.title}` : 'Course completed!'}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <Progress value={progress} className="flex-1 h-2" />
                              <span className="text-xs text-muted-foreground">{progress}%</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="w-5 h-5" />
                          </Button>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No courses enrolled yet</p>
                    <Link to="/courses">
                      <Button variant="outline" className="mt-4">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading">Recent Activity</CardTitle>
              <CardDescription>Your learning history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Courses */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading">Recommended for You</CardTitle>
                <CardDescription>Courses that match your interests</CardDescription>
              </div>
              <Link to="/courses">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockCourses
                .filter(c => c.isPublished && !user?.enrolledCourses.includes(c.id) && !c.isVolunteerOnly)
                .slice(0, 3)
                .map((course) => (
                  <Link key={course.id} to={`/courses/${course.id}`}>
                    <div className="group rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-card">
                      <div className="relative">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {course.shortDescription}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                          <span className="mx-1">•</span>
                          <BookOpen className="w-3 h-3" />
                          <span>{course.lessonsCount} lessons</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
