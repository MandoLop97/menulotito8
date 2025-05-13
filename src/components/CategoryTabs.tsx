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
  const clickedRef = useRef(false);
  const isMobile = useIsMobile();

  // Mostrar tabs después de cierto scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 400;
      setShowTabs(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrollspy - detecta sección visible y actualiza activeCategory
  useEffect(() => {
    const sectionElements = categories
      .map(category => document.getElementById(`category-${category.id}`))
      .filter(Boolean) as HTMLElement[];

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          const visibleId = visibleEntries[0].target.getAttribute('data-category-section');
          if (visibleId && visibleId !== activeCategory && !clickedRef.current) {
            setActiveCategory(visibleId);
          }
        }
      },
      {
        root: null,
        threshold: 0.4,
      }
    );

    sectionElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [categories, activeCategory]);

  // Scroll al tab activo SOLO cuando fue clic manual
  useEffect(() => {
    if (!tabsRef.current || !clickedRef.current) return;

    const activeTabEl = tabsRef.current.querySelector(
      `.category-tab[data-category="${activeCategory}"]`
    ) as HTMLElement;

    if (activeTabEl) {
      activeTabEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }

    // Reinicia la bandera de clic manual
    const timeout = setTimeout(() => {
      clickedRef.current = false;
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeCategory]);

  // Cuando el usuario hace clic en un botón
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === activeCategory) return;

    clickedRef.current = true;
    setActiveCategory(categoryId);
  };

  if (!showTabs) return null;

  return (
    <div className={`bg-white sticky ${isMobile ? 'top-0' : 'top-[68px]'} z-30 border-b border-gray-200 shadow-sm will-change-transform animate-fade-in`}>
      <div className="relative max-w-7xl mx-auto px-4">
        <ScrollArea className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide" orientation="horizontal">
          <div ref={tabsRef} className="flex gap-4 px-1 py-1">
            {categories.map(category => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  data-category={category.id}
                  className={`category-tab relative whitespace-nowrap px-4 py-3 font-medium text-sm transition-all duration-300 rounded-md ${
                    isActive
                      ? 'text-navy-800 font-semibold bg-gray-50'
                      : 'text-gray-600 hover:text-navy-700 hover:bg-gray-50/50'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-1 bg-navy-700 rounded-t-sm transition-opacity duration-400 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Fade Effects */}
        <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white via-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white via-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default CategoryTabs;
