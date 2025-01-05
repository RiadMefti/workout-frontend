import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, ExternalLink } from "lucide-react";
import { useUser } from "@/hooks/user/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfilePage: FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20"
              >
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Your account details and next workout information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next Workout</p>
              <p className="font-medium">
                {user.next_workout ?? "No workout scheduled"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {user.next_workout && (
          <Button 
            className="w-full" 
            onClick={() => navigate("/next-workout")}
          >
            Go to Next Workout
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfilePage;