import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockCourses } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Trophy,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Quiz = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const course = mockCourses.find(c => c.id === courseId);
  const quiz = course?.quiz;

  if (!course || !quiz) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-heading font-bold">Quiz not found</h2>
          <Link to="/courses">
            <Button variant="outline" className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleSelectAnswer = (answerIndex: number) => {
    if (submitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Calculate score
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    // Navigate to results
    navigate(`/courses/${courseId}/quiz/results`, { 
      state: { score, totalQuestions: quiz.questions.length, correctAnswers }
    });
  };

  if (!started) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Link 
            to={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Link>

          <Card className="shadow-elevated">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Trophy className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-heading">{quiz.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                Test your knowledge from {course.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <p className="text-2xl font-heading font-bold">{quiz.questions.length}</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <p className="text-2xl font-heading font-bold">{quiz.passingScore}%</p>
                  <p className="text-sm text-muted-foreground">Passing Score</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-accent/50 border border-accent">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-accent-foreground">
                    <p className="font-medium mb-1">Instructions</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Read each question carefully</li>
                      <li>Select the best answer for each question</li>
                      <li>You can navigate between questions</li>
                      <li>Submit when you're ready to see your score</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                variant="gradient" 
                size="xl" 
                className="w-full"
                onClick={() => setStarted(true)}
              >
                Start Quiz
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-elevated">
          <CardContent className="p-6">
            <h2 className="text-xl font-heading font-semibold mb-6">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    selectedAnswers[currentQuestion] === index
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      selectedAnswers[currentQuestion] === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    )}>
                      {selectedAnswers[currentQuestion] === index && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  disabled={selectedAnswers.length !== quiz.questions.length || selectedAnswers.includes(undefined as any)}
                >
                  Submit Quiz
                  <Trophy className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                currentQuestion === index
                  ? "bg-primary text-primary-foreground"
                  : selectedAnswers[index] !== undefined
                    ? "bg-success/20 text-success border border-success/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Quiz;
