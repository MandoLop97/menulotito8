
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/admin/Sidebar";
import OrdersTable from "@/components/admin/OrdersTable";

const Panel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

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

        // Obtener el ID del negocio del admin
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select("id")
          .eq("owner_id", session.user.id)
          .single();

        if (businessError && businessError.code !== "PGRST116") {
          throw businessError;
        }

        setBusinessId(businessData?.id || null);
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
  }, [navigate]);

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
            <h1 className="text-xl font-semibold">Panel</h1>
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
          <div className="container mx-auto">
            <Tabs defaultValue="domicilio" className="w-full">
              <TabsList className="mb-4 grid grid-cols-2">
                <TabsTrigger value="domicilio">Domicilios y recolección</TabsTrigger>
                <TabsTrigger value="mesas">En mesas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="domicilio">
                {businessId ? (
                  <OrdersTable businessId={businessId} orderType="domicilio" />
                ) : (
                  <Card className="p-8 text-center">
                    <CardContent>
                      No hay negocio asociado a tu cuenta. Por favor, configura tu negocio primero.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="mesas">
                {businessId ? (
                  <OrdersTable businessId={businessId} orderType="mesa" />
                ) : (
                  <Card className="p-8 text-center">
                    <CardContent>
                      No hay negocio asociado a tu cuenta. Por favor, configura tu negocio primero.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Panel;
