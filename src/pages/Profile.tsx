import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, getCourseProgress } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Shield, 
  BookOpen, 
  GraduationCap,
  Trophy,
  Lock,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);

  if (!user) return null;

  const enrolledCourses = mockCourses.filter(c => user.enrolledCourses.includes(c.id));
  const completedCourses = mockCourses.filter(c => user.completedCourses.includes(c.id));

  const stats = [
    { label: 'Enrolled Courses', value: enrolledCourses.length, icon: BookOpen, color: 'text-primary' },
    { label: 'Completed', value: completedCourses.length, icon: GraduationCap, color: 'text-success' },
    { label: 'Quizzes Taken', value: user.quizzesTaken, icon: Trophy, color: 'text-secondary' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdatingPassword(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Password updated',
      description: 'Your password has been successfully changed.',
    });
    
    setPasswords({ current: '', new: '', confirm: '' });
    setShowPasswordForm(false);
    setIsUpdatingPassword(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="shadow-card lg:col-span-1">
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="font-heading font-bold text-xl">{user.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
              
              <Badge className={cn("mt-3", getRoleBadgeStyle(user.role))}>
                <Shield className="w-3 h-3 mr-1" />
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-3 gap-2">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-heading font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label.split(' ')[0]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Account Information</CardTitle>
                <CardDescription>Your personal details (read-only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input value={user.name} disabled className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email Address
                    </Label>
                    <Input value={user.email} disabled className="bg-muted/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    Role
                  </Label>
                  <Input 
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                    disabled 
                    className="bg-muted/50" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Password Update */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-heading">Security</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </div>
                  {!showPasswordForm && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPasswordForm(true)}
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </Button>
                  )}
                </div>
              </CardHeader>
              {showPasswordForm && (
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current"
                          type={showPasswords ? 'text' : 'password'}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new">New Password</Label>
                      <Input
                        id="new"
                        type={showPasswords ? 'text' : 'password'}
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm New Password</Label>
                      <Input
                        id="confirm"
                        type={showPasswords ? 'text' : 'password'}
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Button type="submit" disabled={isUpdatingPassword}>
                        {isUpdatingPassword ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswords({ current: '', new: '', confirm: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>

            {/* Learning Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Learning Statistics</CardTitle>
                <CardDescription>Your progress overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div 
                      key={stat.label}
                      className="p-4 rounded-xl bg-muted/30 text-center"
                    >
                      <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
                      <p className="text-2xl font-heading font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
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

export default Profile;
