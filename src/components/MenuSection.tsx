
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
      className={`py-8 scroll-mt-24 transition-all duration-500 ${isActive ? 'bg-gradient-to-r from-gray-50 to-white' : ''}`}
      data-category-section={categoryId}
    >
      <h2 className="text-2xl font-display font-bold mb-6 text-gradient border-b pb-3">{categoryName}</h2>
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="opacity-0 animate-fade-in hover-lift" 
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
