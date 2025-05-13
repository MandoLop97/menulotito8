
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
    <Card className="overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex h-full">
        {isMobile ? (
          // Mobile layout - horizontal card like in reference image
          <div className="flex w-full p-3">
            <div className="flex-1 pr-3">
              <h3 className="font-medium text-lg text-navy-800 line-clamp-1">{item.name}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
              <p className="text-navy-800 font-bold mt-2">
                {formatCurrency(item.price)}
              </p>
            </div>
            
            <div className="relative">
              <div className="w-24 h-24 overflow-hidden rounded-lg">
                <AspectRatio ratio={1/1} className="bg-gray-50">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <Button 
                  onClick={() => addItem(item)} 
                  size="sm"
                  variant="default"
                  className="bg-orange-500 hover:bg-orange-600 rounded-full w-8 h-8 p-0 absolute bottom-2 right-2 shadow-lg border-2 border-white transition-transform hover:scale-105"
                  aria-label="Añadir al pedido"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Desktop layout - keep existing vertical layout
          <div className="flex flex-col w-full">
            <div className="p-3 pb-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-navy-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-navy-800 font-bold mt-2">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                
                <div className="ml-4 relative">
                  <div className="w-28 h-28 overflow-hidden rounded-lg">
                    <AspectRatio ratio={1/1} className="bg-gray-50">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    <Button 
                      onClick={() => addItem(item)} 
                      size="sm"
                      variant="default"
                      className="bg-orange-500 hover:bg-orange-600 rounded-full w-9 h-9 p-0 absolute bottom-2 right-2 shadow-lg border-2 border-white transition-transform hover:scale-105"
                      aria-label="Añadir al pedido"
                    >
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="pt-2 pb-3">
              {/* Button is inside the image */}
            </CardContent>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MenuItem;
