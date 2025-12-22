import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, getCourseProgress, isQuizUnlocked } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Users, 
  PlayCircle,
  CheckCircle2,
  Lock,
  FileText,
  Download,
  ArrowLeft,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const course = mockCourses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-heading font-bold">Course not found</h2>
          <Link to="/courses">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isEnrolled = user?.enrolledCourses.includes(course.id);
  const progress = getCourseProgress(course);
  const quizUnlocked = isQuizUnlocked(course);
  const completedLessons = course.lessons.filter(l => l.completed).length;

  const handleEnroll = () => {
    if (user) {
      updateUser({
        enrolledCourses: [...user.enrolledCourses, course.id]
      });
      toast({
        title: 'Enrolled successfully!',
        description: `You've been enrolled in "${course.title}"`,
      });
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-destructive" />;
      case 'slide':
        return <FileText className="w-4 h-4 text-secondary" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link to="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        {/* Course Header */}
        <div className="relative rounded-2xl overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-3">
              {course.isVolunteerOnly && (
                <Badge className="bg-role-volunteer text-white border-0">
                  Volunteer Only
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">
              {course.title}
            </h1>
            <p className="text-white/80 max-w-2xl">{course.shortDescription}</p>
            <div className="flex items-center gap-4 mt-4 text-white/70 text-sm">
              <span>{course.instructor}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.lessonsCount} lessons
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.enrolledCount} enrolled
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar (if enrolled) */}
        {isEnrolled && (
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedLessons} of {course.lessons.length} lessons completed
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lessons List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.lessons.map((lesson, index) => {
                  const isLocked = !isEnrolled && index > 0;
                  const isActive = selectedLesson === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer",
                        isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
                        isLocked && "opacity-60"
                      )}
                      onClick={() => !isLocked && setSelectedLesson(lesson.id)}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        lesson.completed 
                          ? "bg-success text-success-foreground" 
                          : isLocked 
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                      )}>
                        {lesson.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <PlayCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium",
                          lesson.completed && "text-muted-foreground"
                        )}>
                          {lesson.order}. {lesson.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.duration}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Enroll/Continue Card */}
            <Card className="shadow-card sticky top-24">
              <CardContent className="p-6">
                {isEnrolled ? (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">Course Progress</p>
                      <p className="text-3xl font-heading font-bold text-primary">{progress}%</p>
                    </div>
                    <Link to={`/courses/${course.id}/lesson/${course.lessons.find(l => !l.completed)?.id || course.lessons[0].id}`}>
                      <Button variant="gradient" className="w-full" size="lg">
                        {progress > 0 ? 'Continue Learning' : 'Start Course'}
                        <PlayCircle className="w-4 h-4" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-center text-muted-foreground mb-4">
                      Ready to start learning?
                    </p>
                    <Button 
                      variant="gradient" 
                      className="w-full" 
                      size="lg"
                      onClick={handleEnroll}
                    >
                      Enroll Now
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quiz Section */}
            {course.quiz && isEnrolled && (
              <Card className={cn(
                "shadow-card",
                !quizUnlocked && "opacity-75"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      quizUnlocked ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                    )}>
                      {quizUnlocked ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">Course Quiz</h4>
                      <p className="text-sm text-muted-foreground">
                        {quizUnlocked 
                          ? 'Test your knowledge'
                          : 'Complete all lessons to unlock'}
                      </p>
                    </div>
                  </div>
                  <Link to={quizUnlocked ? `/courses/${course.id}/quiz` : '#'}>
                    <Button 
                      variant={quizUnlocked ? "secondary" : "outline"} 
                      className="w-full"
                      disabled={!quizUnlocked}
                    >
                      {quizUnlocked ? 'Take Quiz' : 'Locked'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Course Materials */}
            {course.materials.length > 0 && isEnrolled && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading text-base">Course Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.materials.map((material) => (
                    <div 
                      key={material.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      {getMaterialIcon(material.type)}
                      <span className="flex-1 text-sm truncate">{material.title}</span>
                      <Download className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetail;
