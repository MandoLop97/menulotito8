
import React from 'react';
import { ShoppingCart, History, Settings } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const MobileNavBar: React.FC = () => {
  const { state, toggleCart } = useCart();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  
  const handleHistoryClick = () => {
    toast({
      title: "Historial de pedidos",
      description: "Funcionalidad en desarrollo",
    });
    // Aquí podríamos navegar a la página de historial cuando esté implementada
    // navigate('/history');
  };
  
  const handleSettingsClick = () => {
    toast({
      title: "Ajustes",
      description: "Funcionalidad en desarrollo",
    });
    // Aquí podríamos navegar a la página de ajustes cuando esté implementada
    // navigate('/settings');
  };

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy-800 text-white py-2 px-4 z-40 md:hidden">
      <div className="flex justify-around items-center">
        <button
          onClick={handleHistoryClick}
          className="flex flex-col items-center p-2"
        >
          <History className="h-6 w-6" />
          <span className="text-xs mt-1">Historial</span>
        </button>
        
        <button 
          onClick={() => toggleCart()}
          className="relative flex flex-col items-center p-2"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white border-none px-1.5 min-w-[1.5rem] flex items-center justify-center">
              {itemCount}
            </Badge>
          )}
          <span className="text-xs mt-1">Carrito</span>
        </button>
        
        <button
          onClick={handleSettingsClick}
          className="flex flex-col items-center p-2"
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Ajustes</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavBar;
