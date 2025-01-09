import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  Calendar,
  LineChart,
  History,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: <Dumbbell className="w-10 h-10" />,
    title: "Track Your Workouts",
    description:
      "Record and monitor your exercises, sets, reps, and weights with ease.",
  },
  {
    icon: <Calendar className="w-10 h-10" />,
    title: "Plan Your Schedule",
    description:
      "Create and manage your workout routines with our intuitive calendar.",
  },
  {
    icon: <LineChart className="w-10 h-10" />,
    title: "Monitor Progress",
    description:
      "Visualize your fitness journey with detailed progress tracking.",
  },
  {
    icon: <History className="w-10 h-10" />,
    title: "Workout History",
    description:
      "Access your complete workout history and analyze your performance.",
  },
];

//The HomePage component is the landing page for the application.
const HomePage: FC = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  const navigateSignup = () => {
    navigate("/auth/register");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Track Your Fitness Journey
              <span className="text-primary block">Like Never Before</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The ultimate workout companion that helps you track, plan, and
              achieve your fitness goals with precision and ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={navigateSignup}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className=" px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Comprehensive tools to support your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-muted-foreground">
        <p>© 2024 Workout Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
