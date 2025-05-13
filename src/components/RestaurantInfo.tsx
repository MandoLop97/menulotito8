
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const RestaurantInfo = () => {
  return (
    <div className="text-center mb-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-navy-800 mt-0">Menú de Ejemplo</h1>
      
      <div className="flex justify-center gap-2 mt-3 mb-4">
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 transition-colors">A domicilio</Badge>
        <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">Para recoger</Badge>
      </div>
      
      <div className="flex justify-center gap-8 text-sm text-gray-600 max-w-xs mx-auto">
        <div className="flex flex-col">
          <span className="text-xs">Tiempo envío</span>
          <span className="font-medium">25 - 45 mins</span>
        </div>
        
        <Separator orientation="vertical" className="h-10" />
        
        <div className="flex flex-col">
          <span className="text-xs">Costo envío</span>
          <span className="font-medium">Desde $20 MXN</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;
