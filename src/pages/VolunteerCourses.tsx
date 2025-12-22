import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, getCourseProgress } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Clock, 
  BookOpen, 
  Users,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const VolunteerCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not volunteer or admin
  if (user?.role === 'user') {
    navigate('/dashboard');
    return null;
  }

  const volunteerCourses = mockCourses.filter(c => c.isVolunteerOnly && c.isPublished);
  const enrolledVolunteerCourses = volunteerCourses.filter(c => user?.enrolledCourses.includes(c.id));
  const availableVolunteerCourses = volunteerCourses.filter(c => !user?.enrolledCourses.includes(c.id));

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative rounded-2xl overflow-hidden gradient-primary p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-0">
                Volunteer Training
              </Badge>
            </div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">
              Volunteer Courses
            </h1>
            <p className="text-white/80 max-w-xl">
              Exclusive training materials designed to equip our volunteers with the skills 
              and knowledge needed to serve effectively in ministry.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <GraduationCap className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* Enrolled Volunteer Courses */}
        {enrolledVolunteerCourses.length > 0 && (
          <section>
            <h2 className="text-xl font-heading font-semibold mb-4">Your Training</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledVolunteerCourses.map((course) => {
                const progress = getCourseProgress(course);
                const nextLesson = course.lessons.find(l => !l.completed);

                return (
                  <Card key={course.id} className="shadow-card overflow-hidden group">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-48 flex-shrink-0">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-32 sm:h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r" />
                      </div>
                      <CardContent className="flex-1 p-5">
                        <Badge className="bg-role-volunteer/10 text-role-volunteer border-role-volunteer/20 mb-2">
                          <Heart className="w-3 h-3 mr-1" />
                          Volunteer
                        </Badge>
                        <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {nextLesson ? `Next: ${nextLesson.title}` : 'All lessons complete!'}
                        </p>
                        
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <Link to={`/courses/${course.id}`} className="block mt-4">
                          <Button variant="gradient" size="sm" className="w-full">
                            {progress > 0 ? 'Continue' : 'Start Training'}
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Available Volunteer Courses */}
        <section>
          <h2 className="text-xl font-heading font-semibold mb-4">
            {enrolledVolunteerCourses.length > 0 ? 'More Training Available' : 'Available Training'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableVolunteerCourses.map((course, index) => (
              <Card 
                key={course.id}
                className="shadow-card overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-role-volunteer text-white border-0">
                    <Heart className="w-3 h-3 mr-1" />
                    Volunteer
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {course.shortDescription}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.lessonsCount} lessons</span>
                    </div>
                  </div>

                  <Link to={`/courses/${course.id}`} className="block mt-4">
                    <Button variant="outline" className="w-full">
                      View Course
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {volunteerCourses.length === 0 && (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-lg mb-1">No volunteer courses available</h3>
              <p className="text-muted-foreground">Check back later for new training materials.</p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default VolunteerCourses;
