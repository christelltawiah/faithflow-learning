import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockLeaderboard, mockCourses } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trophy, Medal, Star, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Leaderboard = () => {
  const { user } = useAuth();
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all');

  // Get all quizzes
  const quizzes = mockCourses
    .filter(c => c.quiz)
    .map(c => ({ id: c.quiz!.id, title: c.quiz!.title, courseTitle: c.title }));

  // Filter leaderboard by selected quiz
  const filteredLeaderboard = selectedQuiz === 'all'
    ? mockLeaderboard
    : mockLeaderboard.filter(entry => entry.quizId === selectedQuiz);

  // Sort and rank
  const rankedLeaderboard = [...filteredLeaderboard]
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, displayRank: index + 1 }));

  // Find user in leaderboard
  const userEntry = rankedLeaderboard.find(entry => entry.userId === user?.id);
  const userInTop20 = userEntry && userEntry.displayRank <= 20;

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-400/5 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-600/5 border-amber-600/30";
      default:
        return "bg-muted/30 border-transparent";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground mt-1">
              See how you rank among other learners
            </p>
          </div>

          <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select a quiz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quizzes</SelectItem>
              {quizzes.map(quiz => (
                <SelectItem key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Top 3 Podium */}
        {rankedLeaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {/* Second Place */}
            <div className="order-1">
              <Card className={cn(
                "shadow-card border-2 mt-8",
                getRankStyle(2)
              )}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-400/20 flex items-center justify-center mx-auto mb-2">
                    <Medal className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="font-heading font-bold text-lg truncate">
                    {rankedLeaderboard[1].userName}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-bold">{rankedLeaderboard[1].score}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">2nd Place</p>
                </CardContent>
              </Card>
            </div>

            {/* First Place */}
            <div className="order-2">
              <Card className={cn(
                "shadow-elevated border-2",
                getRankStyle(1)
              )}>
                <CardContent className="p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
                    <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="font-heading font-bold text-xl truncate">
                    {rankedLeaderboard[0].userName}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-5 h-5 text-warning fill-warning" />
                    <span className="font-bold text-lg">{rankedLeaderboard[0].score}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">1st Place</p>
                </CardContent>
              </Card>
            </div>

            {/* Third Place */}
            <div className="order-3">
              <Card className={cn(
                "shadow-card border-2 mt-8",
                getRankStyle(3)
              )}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center mx-auto mb-2">
                    <Medal className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="font-heading font-bold text-lg truncate">
                    {rankedLeaderboard[2].userName}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-bold">{rankedLeaderboard[2].score}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">3rd Place</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rankedLeaderboard.slice(0, 20).map((entry) => (
                <div 
                  key={`${entry.quizId}-${entry.userId}`}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all",
                    entry.userId === user?.id 
                      ? "bg-primary/10 border-primary/30" 
                      : getRankStyle(entry.displayRank)
                  )}
                >
                  <div className="w-10 flex justify-center">
                    {getMedalIcon(entry.displayRank) || (
                      <span className="text-lg font-bold text-muted-foreground">
                        {entry.displayRank}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {entry.userName}
                      {entry.userId === user?.id && (
                        <span className="text-primary ml-2">(You)</span>
                      )}
                    </p>
                    {selectedQuiz === 'all' && (
                      <p className="text-xs text-muted-foreground truncate">
                        {quizzes.find(q => q.id === entry.quizId)?.courseTitle}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning fill-warning" />
                    <span className="font-bold text-lg">{entry.score}%</span>
                  </div>
                </div>
              ))}

              {/* Show user if not in top 20 */}
              {!userInTop20 && userEntry && (
                <>
                  <div className="text-center py-3 text-muted-foreground">• • •</div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-primary/10 border-primary/30">
                    <div className="w-10 flex justify-center">
                      <span className="text-lg font-bold text-muted-foreground">
                        {userEntry.displayRank}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {userEntry.userName}
                        <span className="text-primary ml-2">(You)</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-warning fill-warning" />
                      <span className="font-bold text-lg">{userEntry.score}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {rankedLeaderboard.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No quiz results yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
