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
  const [showTabs, setShowTabs] = useState(false);
  const isMobile = useIsMobile();

  // Mostrar tabs después de cierto scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 500;
      setShowTabs(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Solo scroll animado horizontal al hacer clic
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === activeCategory || !tabsRef.current) return;

    setActiveCategory(categoryId);

    const tabEl = tabsRef.current.querySelector(
      `.category-tab[data-category="${categoryId}"]`
    ) as HTMLElement;

    if (tabEl) {
      tabEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  };

  if (!showTabs) return null;

  return (
    <div
      className={`bg-white sticky ${
        isMobile ? 'top-0' : 'top-[68px]'
      } z-30 border-b border-gray-200 shadow-sm will-change-transform animate-fade-in`}
    >
      <div className="relative max-w-7xl mx-auto px-4">
        <ScrollArea
          className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
          orientation="horizontal"
        >
          <div
            ref={tabsRef}
            className="flex gap-4 px-1 py-1 transition-all duration-300"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  data-category={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`category-tab relative whitespace-nowrap px-4 py-3 font-medium text-sm rounded-md transition-all duration-300 ${
                    isActive
                      ? 'text-navy-800 font-semibold bg-white shadow-md'
                      : 'text-gray-600 hover:text-navy-700 hover:bg-gray-50/50'
                  }`}
                >
                  {category.name}
                  {/* Indicador animado del tab activo */}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-1 bg-navy-700 rounded-t-sm transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  ></div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Gradientes laterales para indicar scroll horizontal */}
        <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default CategoryTabs;
