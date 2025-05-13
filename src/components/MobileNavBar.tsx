
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
    <>
      {/* Enhanced gradient shadow overlay - smoother transition */}
      <div 
        className="fixed bottom-[44px] left-0 right-0 h-20 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(0,0,0,0.10))'
        }}
      />
      
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-navy-800 to-navy-900 text-white py-0.5 z-40 md:hidden shadow-[0_-2px_10px_-1px_rgba(0,0,0,0.2)]">
        <div className="flex justify-around items-center">
          <button
            onClick={handleHistoryClick}
            className="flex flex-col items-center p-1 transition-transform active:scale-95"
          >
            <History className="h-4 w-4" />
            <span className="text-[0.65rem] mt-0.5 font-light">Historial</span>
          </button>
          
          <button 
            onClick={() => toggleCart()}
            className="relative flex flex-col items-center p-1 transition-transform active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white border-none px-1 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-xs">
                {itemCount}
              </Badge>
            )}
            <span className="text-[0.65rem] mt-0.5 font-light">Carrito</span>
          </button>
          
          <button
            onClick={handleSettingsClick}
            className="flex flex-col items-center p-1 transition-transform active:scale-95"
          >
            <Settings className="h-4 w-4" />
            <span className="text-[0.65rem] mt-0.5 font-light">Ajustes</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNavBar;
