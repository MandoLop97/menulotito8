
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Percent, SlidersHorizontal } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import ProductsTab from "@/components/admin/ProductsTab";
import { Tables } from "@/integrations/supabase/types";

type Business = Tables<"businesses">;

const Menu = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("productos");
  const [business, setBusiness] = useState<Business | null>(null);
  const [user, setUser] = useState<any>(null);
  
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
            <h1 className="text-xl font-semibold">Menú</h1>
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
            <Tabs defaultValue="productos" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full mb-4 grid grid-cols-4">
                <TabsTrigger value="productos">Productos</TabsTrigger>
                <TabsTrigger value="personalizaciones">Personalizaciones</TabsTrigger>
                <TabsTrigger value="promociones">Promociones</TabsTrigger>
                <TabsTrigger value="disponibilidad">Disponibilidad</TabsTrigger>
              </TabsList>
              
              <TabsContent value="productos">
                <ProductsTab businessId={business?.id} />
              </TabsContent>
              
              <TabsContent value="personalizaciones">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalizaciones</CardTitle>
                    <CardDescription>
                      Permite a tus clientes agregar extras, quitar ingredientes o escoger formas de preparación.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <Tag className="h-12 w-12 text-gray-500 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Crea personalizaciones para tus productos</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Permite a tus clientes agregar extras, quitar ingredientes o escoger formas de preparación.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="mr-2 h-4 w-4" /> Nueva personalización
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="promociones">
                <Card>
                  <CardHeader>
                    <CardTitle>Promociones</CardTitle>
                    <CardDescription>
                      Llama la atención de tus clientes con promociones y aumenta tus ventas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <Percent className="h-12 w-12 text-gray-500 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Crea promociones atractivas para tus clientes</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Llama la atención de tus clientes con promociones y aumenta tus ventas.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="mr-2 h-4 w-4" /> Nueva promoción
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="disponibilidad">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Productos</CardTitle>
                      <CardDescription>0 agotados</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2 mb-4">
                        <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">Todos</Button>
                        <Button variant="ghost">Agotados</Button>
                      </div>
                      
                      {business?.id && (
                        <div className="space-y-4">
                          {/* Lista de productos con toggle de disponibilidad */}
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                                <img src="/placeholder.svg" alt="Producto" className="w-full h-full object-cover" />
                              </div>
                              <span>Ejemplo de producto</span>
                            </div>
                            <div className="flex items-center">
                              <Button variant="ghost" size="sm" className="text-green-600">
                                Disponibilidad
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Personalizaciones</CardTitle>
                      <CardDescription>0 agotados</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                          <SlidersHorizontal className="h-12 w-12 text-gray-500 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Administra la disponibilidad de personalizaciones</h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                          Mantén tu menú actualizado ocultando las opciones no disponibles
                        </p>
                        <Button variant="outline" className="text-green-600">
                          Ir a personalizaciones
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Menu;
