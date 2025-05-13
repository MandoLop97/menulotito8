import { useRef, useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
  isScrolled: boolean;
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

  useEffect(() => {
    if (tabsRef.current && activeCategory && !preventTabScroll) {
      const activeTabEl = tabsRef.current.querySelector(`.category-tab[data-category="${activeCategory}"]`);
      if (activeTabEl) {
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

    setPreventTabScroll(true);
    setActiveCategory(categoryId);
    setTimeout(() => {
      setPreventTabScroll(false);
    }, 1000);
  };

  // Si no hay scroll, no mostramos la barra de categorías
  if (!isScrolled) {
    return null;
  }

  return (
    <div 
      className={`bg-white fixed left-0 right-0 z-30 border-b border-gray-200 shadow-sm transition-all duration-300 ${
        isMobile ? 'top-[68px]' : 'top-[68px]'
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 animate-fade-in">
        {/* Updated ScrollArea with proper overflow handling */}
        <ScrollArea className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide" orientation="horizontal">
          <div ref={tabsRef} className="flex gap-4 px-1">
            {categories.map(category => (
              <button
                key={category.id}
                data-category={category.id}
                className={`category-tab relative whitespace-nowrap px-3 py-4 font-medium text-sm transition-colors duration-200 ${
                  activeCategory === category.id
                    ? 'text-navy-800 font-semibold'
                    : 'text-gray-600 hover:text-navy-700'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
                {activeCategory === category.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-navy-700 rounded-t-sm transform-gpu will-change-transform"></div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Fade effects */}
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default CategoryTabs;

