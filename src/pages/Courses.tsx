import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Search,
  Heart,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Courses = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter courses based on user role and publication status
  const availableCourses = mockCourses.filter(course => {
    if (!course.isPublished) return false;
    if (course.isVolunteerOnly && user?.role === 'user') return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const isEnrolled = (courseId: string) => user?.enrolledCourses.includes(courseId);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Courses</h1>
            <p className="text-muted-foreground mt-1">
              Explore our faith-based learning catalog
            </p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course, index) => (
            <Card 
              key={course.id}
              className={cn(
                "overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group",
                "animate-slide-up"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {course.isVolunteerOnly && (
                    <Badge className="bg-role-volunteer/90 text-white border-0">
                      <Heart className="w-3 h-3 mr-1" />
                      Volunteer
                    </Badge>
                  )}
                  {isEnrolled(course.id) && (
                    <Badge className="bg-success/90 text-white border-0">
                      Enrolled
                    </Badge>
                  )}
                </div>

                {/* Instructor */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white/90 text-sm font-medium">{course.instructor}</p>
                </div>
              </div>

              <CardContent className="p-5">
                <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {course.shortDescription}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessonsCount} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolledCount}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/courses/${course.id}`} className="block mt-5">
                  <Button 
                    variant={isEnrolled(course.id) ? "outline" : "gradient"} 
                    className="w-full"
                  >
                    {isEnrolled(course.id) ? 'Continue Learning' : 'View Course'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {availableCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Check back later for new courses'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Courses;
