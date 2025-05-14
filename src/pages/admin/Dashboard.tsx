
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import Sidebar from "@/components/admin/Sidebar";
import StatsCard from "@/components/admin/StatsCard";

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-semibold">Inicio</h1>
            <div className="flex items-center gap-4">
              <span>{user?.email}</span>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          <div className="container mx-auto space-y-6">
            <div className="flex justify-end">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
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
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Domicilio y recolección</CardTitle>
                  <Select defaultValue="ventas">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Filtro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="pedidos">Pedidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="text-2xl font-bold">${deliveryStats.ventas}</p>
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
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">En mesas</CardTitle>
                  <Select defaultValue="ventas">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Filtro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="pedidos">Pedidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="text-2xl font-bold">${tableStats.ventas}</p>
                  </div>
                  <div></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
