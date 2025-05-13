
import { useRef, useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  setActiveCategory
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

  return (
    <div className={`bg-white sticky ${isMobile ? 'top-0' : 'top-[68px]'} z-30 border-b border-gray-200 shadow-sm will-change-transform`}>
      <div className="relative max-w-7xl mx-auto px-4 animate-fade-in">
        {/* Updated ScrollArea with proper overflow handling */}
        <ScrollArea className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide" orientation="horizontal">
          <div ref={tabsRef} className="flex gap-4 px-1 py-1">
            {categories.map(category => (
              <button
                key={category.id}
                data-category={category.id}
                className={`category-tab relative whitespace-nowrap px-4 py-3 font-medium text-sm transition-all duration-300 rounded-md will-change-transform ${
                  activeCategory === category.id
                    ? 'text-navy-800 font-semibold bg-gray-50'
                    : 'text-gray-600 hover:text-navy-700 hover:bg-gray-50/50'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
                {activeCategory === category.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-navy-700 rounded-t-sm transform-gpu"></div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Fade effects with improved gradient for elegance */}
        <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white via-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white via-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default CategoryTabs;
