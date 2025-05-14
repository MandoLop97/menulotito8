
import React, { useRef, useEffect } from 'react';
import { MenuItem as MenuItemType } from '@/lib/types';
import MenuItem from './MenuItem';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuSectionProps {
  categoryId: string;
  categoryName: string;
  items: MenuItemType[];
  isActive: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  categoryId,
  categoryName,
  items,
  isActive
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const hasScrolledRef = useRef<boolean>(false);

  useEffect(() => {
    // Set a better scroll-margin-top to account for the sticky header and category tabs
    if (sectionRef.current) {
      sectionRef.current.style.scrollMarginTop = '140px';
    }
  }, []);

  return (
    <div 
      id={`category-${categoryId}`} 
      ref={sectionRef} 
      data-category-section={categoryId} 
      className="mb-16 pt-4 px-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-navy-800/90 dark:to-navy-900 shadow-lg border border-gray-100 dark:border-navy-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-navy-800 dark:text-white border-b pb-3 border-orange-200 dark:border-navy-600 flex items-center">
        <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">{categoryName}</span>
        <div className="ml-3 h-1 bg-gradient-to-r from-orange-600 to-orange-300 flex-grow rounded-full"></div>
      </h2>
      
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'} gap-5`}>
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="opacity-0 animate-fade-in" 
            style={{
              animationDelay: `${index * 0.08}s`,
              animationFillMode: 'forwards'
            }}
          >
            <MenuItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
