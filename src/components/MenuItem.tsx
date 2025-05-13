import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { MenuItem as MenuItemType } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { AspectRatio } from './ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();
  const isMobile = useIsMobile();

  return (
    <Card className="overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 rounded-xl">
      <div className="flex flex-row items-start p-4 gap-4">
        {/* Texto del producto */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
          <p className="text-base font-bold text-orange-600 mt-2">
            {formatCurrency(item.price)}
          </p>
        </div>

        {/* Imagen del producto con botón dentro */}
        <div className="relative w-28 shrink-0">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <AspectRatio ratio={1 / 1} className="bg-gray-50">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </AspectRatio>
          </div>

          {/* Botón dentro de la imagen */}
          <Button
            onClick={() => addItem(item)}
            size="icon"
            className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md border-2 border-white hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Añadir al carrito"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-blue-600">
                +
              </span>
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MenuItem;
