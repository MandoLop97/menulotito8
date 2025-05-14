
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import Sidebar from "@/components/admin/Sidebar";
import StatsCard from "@/components/admin/StatsCard";
import { CalendarClock } from "lucide-react";

type Business = Tables<"businesses">;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [user, setUser] = useState<any>(null);
  const [period, setPeriod] = useState("today");
  
  const [deliveryStats, setDeliveryStats] = useState({
    ventas: 0,
    pedidos: 0,
    envios: 0,
    ticketPromedio: 0
  });
  
  const [tableStats, setTableStats] = useState({
    ventas: 0,
    pedidos: 0,
    ticketPromedio: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
          return;
        }

        setUser(session.user);

        // Verificar rol de admin
        const { data: userData, error: roleError } = await supabase
          .from("usuarios_auth")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (roleError || userData?.role !== "admin") {
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        // Cargar datos del negocio
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", session.user.id)
          .single();

        if (businessError && businessError.code !== "PGRST116") {
          throw businessError;
        }

        setBusiness(businessData || null);
        
        // Este es un mockup de datos para la demostración
        // En una implementación real, aquí cargarías datos desde la base de datos
        setDeliveryStats({
          ventas: 2500,
          pedidos: 15,
          envios: 120,
          ticketPromedio: 167
        });
        
        setTableStats({
          ventas: 1850,
          pedidos: 10,
          ticketPromedio: 185
        });
        
      } catch (error: any) {
        toast({
          title: "Error al cargar datos",
          description: error.message || "Por favor, inicia sesión nuevamente",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, period]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-orange-500 border-b-orange-500 border-l-gray-200 border-r-gray-200 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">Cargando panel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-navy-800">Panel de Control</h1>
              <span className="bg-orange-500/10 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                {business?.name || "Mi Negocio"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <CalendarClock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.email}</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="container mx-auto space-y-6 max-w-6xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Resumen de actividad</h2>
              <Select value={period} onValueChange={setPeriod} className="w-[180px]">
                <SelectTrigger className="h-9 text-sm bg-white border-gray-200 shadow-sm">
                  <SelectValue placeholder="Seleccionar periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sección de Domicilio y recolección */}
            <Card className="border-none shadow-md bg-white overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-white border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-navy-800">Domicilio y recolección</CardTitle>
                  <Select defaultValue="ventas">
                    <SelectTrigger className="w-[100px] h-8 text-sm bg-white/80 border-gray-200">
                      <SelectValue placeholder="Filtro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="pedidos">Pedidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-50/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-navy-800">${deliveryStats.ventas}</p>
                    <p className="text-xs text-green-600 mt-1">+12% comparado con ayer</p>
                  </div>
                  <div></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsCard title="Ventas" value={deliveryStats.ventas} />
                  <StatsCard title="Pedidos" value={deliveryStats.pedidos} type="number" />
                  <StatsCard title="Envíos" value={deliveryStats.envios} />
                  <StatsCard title="Ticket promedio" value={deliveryStats.ticketPromedio} />
                </div>
              </CardContent>
            </Card>
            
            {/* Sección de En mesas */}
            <Card className="border-none shadow-md bg-white overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-navy-800">En mesas</CardTitle>
                  <Select defaultValue="ventas">
                    <SelectTrigger className="w-[100px] h-8 text-sm bg-white/80 border-gray-200">
                      <SelectValue placeholder="Filtro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="pedidos">Pedidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-navy-800">${tableStats.ventas}</p>
                    <p className="text-xs text-green-600 mt-1">+8% comparado con ayer</p>
                  </div>
                  <div></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="Ventas" value={tableStats.ventas} />
                  <StatsCard title="Pedidos" value={tableStats.pedidos} type="number" />
                  <StatsCard title="Ticket promedio" value={tableStats.ticketPromedio} />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
