
import { useRef, useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
  isScrolled: boolean; // Añadimos esta propiedad para controlar la visibilidad
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  isScrolled
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [preventTabScroll, setPreventTabScroll] = useState(false);
  const isMobile = useIsMobile();

  // Scroll to active tab when active category changes, but with improved control
  useEffect(() => {
    if (tabsRef.current && activeCategory && !preventTabScroll) {
      const activeTabEl = tabsRef.current.querySelector(`.category-tab[data-category="${activeCategory}"]`);
      if (activeTabEl) {
        // Using scrollIntoView with a more controlled approach
        activeTabEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeCategory, preventTabScroll]);

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === activeCategory) return;

    // Prevent the tab from auto-scrolling due to the active category change we're making
    setPreventTabScroll(true);

    // Set the active category
    setActiveCategory(categoryId);

    // Reset prevention after scrolling should be complete
    setTimeout(() => {
      setPreventTabScroll(false);
    }, 1000);
  };

  // Si no hay scroll, no mostramos la barra de categorías
  if (!isScrolled) {
    return null;
  }

  return (
    <div className={`bg-white fixed ${isMobile ? 'top-[68px]' : 'top-[68px]'} left-0 right-0 z-30 border-b border-gray-200 shadow-sm transition-opacity duration-300`}>
      <div className="relative max-w-7xl mx-auto px-4 animate-fade-in">
        {/* Modified ScrollArea component with scrollbar-hide class */}
        <ScrollArea className="w-full overflow-hidden scrollbar-hide" orientation="horizontal">
          <div ref={tabsRef} className="flex gap-4 px-1">
            {categories.map(category => (
              <button
                key={category.id}
                data-category={category.id}
                className={`category-tab relative whitespace-nowrap px-3 py-4 font-medium text-sm transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'text-navy-800 font-semibold'
                    : 'text-gray-600 hover:text-navy-700'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
                {activeCategory === category.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-navy-700 rounded-t-sm"></div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
        
        {/* Fade effect left */}
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        
        {/* Fade effect right */}
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default CategoryTabs;
