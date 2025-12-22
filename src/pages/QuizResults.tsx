import { useParams, useLocation, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockCourses, mockLeaderboard } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  ArrowRight,
  Medal,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const QuizResults = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const { user } = useAuth();
  
  const { score = 0, totalQuestions = 0, correctAnswers = 0 } = location.state || {};
  
  const course = mockCourses.find(c => c.id === courseId);
  const quiz = course?.quiz;
  const passed = quiz ? score >= quiz.passingScore : false;

  // Get leaderboard for this quiz
  const quizLeaderboard = mockLeaderboard
    .filter(entry => entry.quizId === quiz?.id)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Find user's rank
  const userRank = mockLeaderboard.find(
    entry => entry.quizId === quiz?.id && entry.userId === user?.id
  );
  const userInTop5 = quizLeaderboard.some(entry => entry.userId === user?.id);

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  if (!course || !quiz) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-heading font-bold">Results not found</h2>
          <Link to="/courses">
            <Button variant="outline" className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Results Card */}
        <Card className={cn(
          "shadow-elevated overflow-hidden",
          passed ? "border-success/50" : "border-destructive/50"
        )}>
          <div className={cn(
            "h-2",
            passed ? "bg-success" : "bg-destructive"
          )} />
          <CardContent className="p-8 text-center">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
              passed 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            )}>
              {passed ? (
                <Trophy className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>

            <h1 className="text-3xl font-heading font-bold mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {passed 
                ? 'You have successfully passed the quiz!'
                : `You need ${quiz.passingScore}% to pass. Try again!`}
            </p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <p className={cn(
                  "text-5xl font-heading font-bold",
                  passed ? "text-success" : "text-destructive"
                )}>
                  {score}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">Your Score</p>
              </div>
              <div className="h-16 w-px bg-border" />
              <div className="text-center">
                <p className="text-5xl font-heading font-bold text-foreground">
                  {correctAnswers}/{totalQuestions}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Correct Answers</p>
              </div>
            </div>

            {passed && (
              <div className="flex items-center justify-center gap-2 text-success mb-6">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Certificate Earned!</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <Link to={`/courses/${courseId}/quiz`}>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4" />
                  Retake Quiz
                </Button>
              </Link>
              <Link to={`/courses/${courseId}`}>
                <Button variant="gradient">
                  Back to Course
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="font-heading">Quiz Leaderboard</CardTitle>
                <p className="text-sm text-muted-foreground">Top performers for this quiz</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quizLeaderboard.map((entry, index) => (
                <div 
                  key={entry.userId}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl",
                    entry.userId === user?.id 
                      ? "bg-primary/10 border border-primary/20" 
                      : "bg-muted/30"
                  )}
                >
                  <div className="w-8 flex justify-center">
                    {getMedalIcon(index + 1)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {entry.userName}
                      {entry.userId === user?.id && (
                        <span className="text-primary ml-2">(You)</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-bold">{entry.score}%</span>
                  </div>
                </div>
              ))}

              {/* Show user's rank if not in top 5 */}
              {!userInTop5 && userRank && (
                <>
                  <div className="text-center py-2 text-muted-foreground">• • •</div>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="w-8 flex justify-center">
                      <span className="text-sm font-bold text-muted-foreground">
                        {userRank.rank}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {userRank.userName}
                        <span className="text-primary ml-2">(You)</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="font-bold">{userRank.score}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm">
                  View Full Leaderboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default QuizResults;
