
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, LayoutDashboard, Settings, MenuIcon, Share2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "bg-accent" : "";
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="bg-gray-100 w-8 h-8 rounded-md flex items-center justify-center">
            <span className="font-medium text-sm">MP</span>
          </div>
          <span className="font-semibold">MasPedidos</span>
        </Link>
      </div>

      <div className="flex flex-col p-2 space-y-1 flex-grow">
        <Link to="/admin/dashboard">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive("/admin/dashboard")}`}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Inicio
          </Button>
        </Link>
        <Link to="/admin/panel">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive("/admin/panel")}`}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Panel
          </Button>
        </Link>
        <Link to="/admin/menu">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive("/admin/menu")}`}
          >
            <MenuIcon className="mr-2 h-4 w-4" />
            Menú
          </Button>
        </Link>
        <Link to="/admin/share">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive("/admin/share")}`}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </Link>
        <Link to="/admin/settings">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive("/admin/settings")}`}
          >
            <Settings className="mr-2 h-4 w-4" />
            Ajustes
          </Button>
        </Link>
      </div>

      <div className="border-t border-gray-200 p-4">
        <Link to="/admin/tutorials">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${isActive("/admin/tutorials")}`}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Tutoriales
          </Button>
        </Link>
        <div className="mt-4 text-xs text-gray-500">
          <div>+52 (999) 452 3786</div>
          <div>Atención rápida</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
