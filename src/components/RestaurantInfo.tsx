
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const RestaurantInfo = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-gradient mb-2">Menú de Ejemplo</h1>
      
      <div className="flex justify-center gap-2 mt-3 mb-4">
        <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:bg-green-100 transition-all px-3 py-1 font-medium">A domicilio</Badge>
        <Badge variant="outline" className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gray-100 transition-all px-3 py-1 font-medium">Para recoger</Badge>
      </div>
      
      <div className="flex justify-center gap-10 text-sm text-gray-600 max-w-xs mx-auto">
        <div className="flex flex-col hover-lift transition-all duration-300">
          <span className="text-xs font-medium text-gray-500">Tiempo envío</span>
          <span className="font-semibold text-navy-800">25 - 45 mins</span>
        </div>
        
        <Separator orientation="vertical" className="h-10" />
        
        <div className="flex flex-col hover-lift transition-all duration-300">
          <span className="text-xs font-medium text-gray-500">Costo envío</span>
          <span className="font-semibold text-navy-800">Desde $20 MXN</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;
