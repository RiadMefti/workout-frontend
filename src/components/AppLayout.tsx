import { FC, ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  LayoutDashboard,
  ListPlus,
  List,
  Play,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AppLayoutProps {
  children: ReactNode;
}

//Navigation items for the sidebar
const navItems = [
  {
    title: "Next Workout",
    icon: <Play className="h-5 w-5" />,
    href: "/next-workout",
  },
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    title: "Create workout split",
    icon: <ListPlus className="h-5 w-5" />,
    href: "/create-workout",
  },
  {
    title: "My workout splits",
    icon: <List className="h-5 w-5" />,
    href: "/workouts",
  },
  {
    title: "Profile",
    icon: <User className="h-5 w-5" />,
    href: "/profile",
  },
  {
    title: "Stats",
    icon: <List className="h-5 w-5" />,
    href: "/stats",
  },
];

//The AppLayout component is the layout for the entire application.
//It contains the sidebar navigation and the main content area.
//The sidebar navigation is hidden on mobile and displayed on desktop.
//The navigation items are defined in the navItems array.
//The AppLayout component uses the useAuth hook to handle user authentication.
//It provides a logout button that calls the logout method from the useAuth hook.
const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const NavigationContent = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(
            "w-full justify-start",
            location.pathname === item.href &&
              "bg-primary/10 text-primary hover:text-primary"
          )}
          onClick={() => handleNavigation(item.href)}
        >
          {item.icon}
          <span className="ml-3">{item.title}</span>
        </Button>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-card border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Workout Tracker</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavigationContent />
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader className="border-b pb-4 mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Dumbbell className="h-6 w-6 text-primary" />
                  Workout Tracker
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                <NavigationContent />
                <div className="mt-auto pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-semibold">
            {navItems.find((item) => item.href === location.pathname)?.title}
          </span>
          <div className="w-10" /> {/* Spacer for centering title */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="md:p-8 p-4 mt-16 md:mt-0">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
