import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, mockUsers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Settings, 
  Plus,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Shield,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState(mockCourses);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  const stats = [
    { label: 'Total Users', value: mockUsers.length, icon: Users, color: 'text-primary' },
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-secondary' },
    { label: 'Published', value: courses.filter(c => c.isPublished).length, icon: Eye, color: 'text-success' },
    { label: 'Drafts', value: courses.filter(c => !c.isPublished).length, icon: EyeOff, color: 'text-warning' },
  ];

  const togglePublish = (courseId: string) => {
    setCourses(courses.map(c => 
      c.id === courseId ? { ...c, isPublished: !c.isPublished } : c
    ));
    const course = courses.find(c => c.id === courseId);
    toast({
      title: course?.isPublished ? 'Course unpublished' : 'Course published',
      description: `"${course?.title}" has been ${course?.isPublished ? 'unpublished' : 'published'}.`,
    });
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-role-admin/10 text-role-admin border-role-admin/20';
      case 'volunteer':
        return 'bg-role-volunteer/10 text-role-volunteer border-role-volunteer/20';
      default:
        return 'bg-role-user/10 text-role-user border-role-user/20';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage courses, users, and platform settings
            </p>
          </div>
          <Button variant="gradient">
            <Plus className="w-4 h-4" />
            Create Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  stat.color === 'text-primary' && "bg-primary/10",
                  stat.color === 'text-secondary' && "bg-secondary/10",
                  stat.color === 'text-success' && "bg-success/10",
                  stat.color === 'text-warning' && "bg-warning/10"
                )}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Course Management</CardTitle>
                <CardDescription>Create, edit, and manage your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div 
                      key={course.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                    >
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-20 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{course.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={course.isPublished ? "default" : "secondary"}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          {course.isVolunteerOnly && (
                            <Badge variant="outline">Volunteer Only</Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {course.enrolledCount} enrolled
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => togglePublish(course.id)}
                        >
                          {course.isPublished ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">User Management</CardTitle>
                <CardDescription>View and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((u) => (
                    <div 
                      key={u.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{u.name}</h4>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                      <Badge className={getRoleBadgeStyle(u.role)}>
                        <Shield className="w-3 h-3 mr-1" />
                        {u.role}
                      </Badge>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{u.enrolledCourses.length} courses</p>
                        <p>{u.quizzesTaken} quizzes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Platform Analytics</CardTitle>
                <CardDescription>View platform usage and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed analytics and reporting features will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Admin;
