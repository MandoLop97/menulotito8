
import React from 'react';
import { Button } from './ui/button';
import { MenuItem as MenuItemType } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Card } from './ui/card';
import { AspectRatio } from './ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();
  const isMobile = useIsMobile();

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out bg-white dark:bg-navy-800/90 backdrop-blur-sm hover:translate-y-[-3px] group">
      <div className="flex flex-row items-start p-4 gap-4">
        {/* Texto del producto */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{item.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{item.description}</p>
          <div className="mt-3 flex items-center">
            <p className="text-base font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              {formatCurrency(item.price)}
            </p>
            <div className="ml-2 h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <p className="ml-2 text-xs text-gray-500 dark:text-gray-400">Agregar al carrito</p>
          </div>
        </div>

        {/* Imagen del producto con botón */}
        <div className="relative w-28 shrink-0">
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all">
            <AspectRatio ratio={1 / 1} className="bg-gray-50 dark:bg-navy-700">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </AspectRatio>
          </div>

          {/* Botón "+" con animación mejorada */}
          <Button
            onClick={() => addItem(item)}
            size="icon"
            className="absolute bottom-1 right-1 w-9 h-9 p-0 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-md hover:shadow-orange-300/50 dark:hover:shadow-orange-900/30 hover:scale-105 active:scale-95 transition-transform duration-200"
            aria-label="Añadir al carrito"
          >
            <span className="text-lg font-bold leading-none">+</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MenuItem;
