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
      <div className={`flex h-full ${isMobile ? 'flex-row p-4' : 'flex-col p-4'}`}>
        <div className={`${isMobile ? 'flex-1 pr-4' : 'mb-3'}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
          <p className="text-base font-bold text-orange-600 mt-2">
            {formatCurrency(item.price)}
          </p>
        </div>

        <div className="relative w-full max-w-[112px] shrink-0">
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
            size="sm"
            variant="default"
            className="bg-orange-500 hover:bg-orange-600 rounded-full w-9 h-9 p-0 absolute bottom-2 right-2 shadow-lg border-2 border-white transition-transform hover:scale-110"
            aria-label="Añadir al pedido"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {!isMobile && (
        <CardContent className="pt-3">
          {/* Aquí podrías añadir más info o CTA si es necesario */}
        </CardContent>
      )}
    </Card>
  );
};

export default MenuItem;
