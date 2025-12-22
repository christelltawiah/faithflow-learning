import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, getCourseProgress } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  PlayCircle, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MyLearning = () => {
  const { user } = useAuth();

  const enrolledCourses = mockCourses.filter(c => user?.enrolledCourses.includes(c.id));
  const completedCourses = mockCourses.filter(c => user?.completedCourses.includes(c.id));
  const inProgressCourses = enrolledCourses.filter(c => {
    const progress = getCourseProgress(c);
    return progress > 0 && progress < 100;
  });
  const notStartedCourses = enrolledCourses.filter(c => getCourseProgress(c) === 0);

  const CourseCard = ({ course, showProgress = true }: { course: typeof mockCourses[0], showProgress?: boolean }) => {
    const progress = getCourseProgress(course);
    const isCompleted = progress === 100;
    const nextLesson = course.lessons.find(l => !l.completed);

    return (
      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden group">
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-48 flex-shrink-0">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-32 sm:h-full object-cover"
            />
            {isCompleted && (
              <div className="absolute inset-0 bg-success/90 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-success-foreground" />
              </div>
            )}
          </div>
          <CardContent className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.instructor}
                </p>
                
                {showProgress && !isCompleted && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {nextLesson && !isCompleted && (
                  <p className="text-sm text-muted-foreground mt-3">
                    <span className="text-foreground">Next:</span> {nextLesson.title}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessonsCount} lessons</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {isCompleted ? (
                  <Badge className="bg-success/10 text-success border-success/20">
                    Completed
                  </Badge>
                ) : progress > 0 ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    In Progress
                  </Badge>
                ) : (
                  <Badge variant="outline">Not Started</Badge>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-end gap-2">
              <Link to={`/courses/${course.id}`}>
                <Button variant="outline" size="sm">
                  View Course
                </Button>
              </Link>
              {!isCompleted && (
                <Link to={`/courses/${course.id}/lesson/${nextLesson?.id || course.lessons[0].id}`}>
                  <Button variant="gradient" size="sm">
                    {progress > 0 ? 'Continue' : 'Start'}
                    <PlayCircle className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="text-center py-12">
      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-heading font-semibold text-lg mb-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <Link to="/courses">
        <Button variant="outline" className="mt-4">
          Browse Courses
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">My Learning</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and continue learning
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{enrolledCourses.length}</p>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{inProgressCourses.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{completedCourses.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({enrolledCourses.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgressCourses.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <EmptyState 
                title="No courses yet" 
                description="Start your learning journey by enrolling in a course"
              />
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgressCourses.length > 0 ? (
              inProgressCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <EmptyState 
                title="No courses in progress" 
                description="Start a course to see it here"
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedCourses.length > 0 ? (
              completedCourses.map(course => (
                <CourseCard key={course.id} course={course} showProgress={false} />
              ))
            ) : (
              <EmptyState 
                title="No completed courses" 
                description="Complete a course to see it here"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MyLearning;
