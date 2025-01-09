import { Home, Users, Pill, Receipt, Settings, User, LogOut, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Patients", path: "/patients" },
  { icon: FileText, label: "Patient Details", path: "/patient-details" },
  { icon: Pill, label: "Medicine", path: "/medicine" },
  { icon: Receipt, label: "Billing", path: "/billing" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-card border-r border-white/10">
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center gap-2">
          <img src="/assets/images.jpg" alt="Clinic Logo" className="w-8 h-8" />
          <h2 className="text-2xl font-bold text-primary">Healia</h2>
        </div>
        
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-white/10",
                      isActive ? "bg-white/10" : "text-secondary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 rounded-full bg-accent p-1" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Dr.XYZ</span>
                <span className="text-xs text-secondary">{user?.role}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;