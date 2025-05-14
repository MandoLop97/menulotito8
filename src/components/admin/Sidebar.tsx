
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, LayoutDashboard, Settings, MenuIcon, Share2, BookOpen, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getItemClass = (path: string) => {
    return cn(
      "flex items-center w-full rounded-md px-3 py-2 transition-colors",
      isActive(path) 
        ? "bg-orange-500/10 text-orange-600" 
        : "hover:bg-gray-100 text-gray-700 hover:text-navy-800"
    );
  };

  return (
    <aside className={cn(
      "bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col",
      collapsed ? "w-[70px]" : "w-64"
    )}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <Link to="/admin/dashboard" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 w-9 h-9 rounded-md flex items-center justify-center text-white shadow-sm">
            <span className="font-bold text-sm">MP</span>
          </div>
          {!collapsed && <span className="font-semibold text-navy-800">MasPedidos</span>}
        </Link>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-gray-500"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <div className="flex flex-col p-2 space-y-1 flex-grow">
        <Link to="/admin/dashboard">
          <div className={getItemClass("/admin/dashboard")}>
            <HomeIcon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Inicio</span>}
          </div>
        </Link>
        <Link to="/admin/panel">
          <div className={getItemClass("/admin/panel")}>
            <LayoutDashboard className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Panel</span>}
          </div>
        </Link>
        <Link to="/admin/menu">
          <div className={getItemClass("/admin/menu")}>
            <MenuIcon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Menú</span>}
          </div>
        </Link>
        <Link to="/admin/share">
          <div className={getItemClass("/admin/share")}>
            <Share2 className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Compartir</span>}
          </div>
        </Link>
        <Link to="/admin/settings">
          <div className={getItemClass("/admin/settings")}>
            <Settings className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Ajustes</span>}
          </div>
        </Link>
      </div>

      <div className={cn("border-t border-gray-200 p-3", collapsed ? "flex justify-center" : "")}>
        <Link to="/admin/tutorials">
          <div className={cn(
            "flex items-center rounded-md px-3 py-2 hover:bg-gray-100 text-gray-700", 
            collapsed ? "justify-center" : "",
            isActive("/admin/tutorials") && "bg-gray-100 text-navy-800"
          )}>
            <BookOpen className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Tutoriales</span>}
          </div>
        </Link>
        {!collapsed && (
          <div className="mt-4 text-xs text-gray-500 mx-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span className="font-medium">Soporte activo</span>
            </div>
            <div className="mt-1">+52 (999) 452 3786</div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
