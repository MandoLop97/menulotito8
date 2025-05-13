import React from 'react';
import { PlusCircle } from 'lucide-react';
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
        {/* Lado izquierdo: texto */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
          <p className="text-base font-bold text-orange-600 mt-2">
            {formatCurrency(item.price)}
          </p>
        </div>

        {/* Lado derecho: imagen + botón */}
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

          <Button
  onClick={() => addItem(item)}
  size="icon"
  variant="default"
  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 p-0 absolute bottom-2 right-2 shadow-lg border-2 border-white 
             transition-transform duration-200 hover:scale-110 active:scale-95 focus:ring-2 focus:ring-orange-300"
  aria-label="Añadir al pedido"
>
  <PlusCircle className="h-5 w-5" strokeWidth={2.2} />
</Button>

        </div>
      </div>
    </Card>
  );
};

export default MenuItem;
