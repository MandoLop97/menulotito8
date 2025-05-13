
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
      sectionRef.current.style.scrollMarginTop = '120px';
    }
  }, []);

  return (
    <div 
      id={`category-${categoryId}`} 
      ref={sectionRef} 
      className={`py-6 scroll-mt-24 transition-all duration-300 ${isActive ? 'bg-gray-50' : ''}`}
      data-category-section={categoryId}
    >
      <h2 className="text-xl font-bold mb-5 text-navy-800 border-b pb-2">{categoryName}</h2>
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="opacity-0 animate-fade-in" 
            style={{
              animationDelay: `${index * 0.05}s`,
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
