import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockCourses } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle,
  List,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const LessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const course = mockCourses.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);
  const lessonIndex = course?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  const prevLesson = lessonIndex > 0 ? course?.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < (course?.lessons.length ?? 0) - 1 ? course?.lessons[lessonIndex + 1] : null;

  if (!course || !lesson) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-heading font-bold">Lesson not found</h2>
          <Link to="/courses">
            <Button variant="outline" className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const completedCount = course.lessons.filter(l => l.completed || l.id === lessonId).length;
  const progress = Math.round((completedCount / course.lessons.length) * 100);

  const handleComplete = () => {
    setIsCompleted(true);
    toast({
      title: 'Lesson completed!',
      description: nextLesson 
        ? 'Continue to the next lesson' 
        : 'You\'ve completed all lessons!',
    });
  };

  const handleNext = () => {
    if (nextLesson) {
      navigate(`/courses/${courseId}/lesson/${nextLesson.id}`);
      setIsCompleted(false);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link 
            to={`/courses/${courseId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {course.title}
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{course.title}</span>
              <span className="text-sm text-muted-foreground">
                {completedCount} of {course.lessons.length} lessons
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Container */}
            <Card className="shadow-card overflow-hidden">
              <div className="relative aspect-video bg-foreground/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <PlayCircle className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <p className="text-muted-foreground">Video Player Placeholder</p>
                  <p className="text-sm text-muted-foreground mt-1">Duration: {lesson.duration}</p>
                </div>
              </div>
            </Card>

            {/* Lesson Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-foreground">
                    {lesson.order}. {lesson.title}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Duration: {lesson.duration}
                  </p>
                </div>
                {!lesson.completed && !isCompleted && (
                  <Button onClick={handleComplete} variant="success">
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Complete
                  </Button>
                )}
                {(lesson.completed || isCompleted) && (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  disabled={!prevLesson}
                  onClick={() => prevLesson && navigate(`/courses/${courseId}/lesson/${prevLesson.id}`)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleNext}
                >
                  {nextLesson ? 'Next Lesson' : 'Finish Course'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className={cn(
            "lg:block",
            showSidebar 
              ? "fixed inset-0 z-50 bg-background p-4 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:p-0" 
              : "hidden"
          )}>
            {showSidebar && (
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-4 right-4 lg:hidden"
                onClick={() => setShowSidebar(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <h3 className="font-heading font-semibold mb-4">Lessons</h3>
                <div className="space-y-2">
                  {course.lessons.map((l) => (
                    <Link
                      key={l.id}
                      to={`/courses/${courseId}/lesson/${l.id}`}
                      onClick={() => setShowSidebar(false)}
                    >
                      <div className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors",
                        l.id === lessonId 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted/50"
                      )}>
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs",
                          l.completed || (l.id === lessonId && isCompleted)
                            ? "bg-success text-success-foreground"
                            : l.id === lessonId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        )}>
                          {l.completed || (l.id === lessonId && isCompleted) ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            l.order
                          )}
                        </div>
                        <span className="text-sm truncate">{l.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LessonView;
