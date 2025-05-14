
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/admin/Sidebar";
import DeliveryPickup from "@/components/admin/share/DeliveryPickup";
import TableQR from "@/components/admin/share/TableQR";
import MultiBranch from "@/components/admin/share/MultiBranch";

const Share = () => {
  const [activeTab, setActiveTab] = useState("delivery");
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-semibold">Compartir</h1>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid grid-cols-3 gap-2 w-full">
                <TabsTrigger value="delivery">Domicilio/Recolección</TabsTrigger>
                <TabsTrigger value="tables">En mesas</TabsTrigger>
                <TabsTrigger value="multi">Link multi sucursal</TabsTrigger>
              </TabsList>
              
              <Card>
                <CardContent className="pt-6">
                  <TabsContent value="delivery">
                    <DeliveryPickup />
                  </TabsContent>
                  
                  <TabsContent value="tables">
                    <TableQR />
                  </TabsContent>
                  
                  <TabsContent value="multi">
                    <MultiBranch />
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Share;
