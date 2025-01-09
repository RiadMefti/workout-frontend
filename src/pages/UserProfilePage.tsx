import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail } from "lucide-react";
import { useUser } from "@/hooks/user/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

//The UserProfilePage component displays the user's profile information.
const UserProfilePage: FC = () => {
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
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfilePage;
