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
  const tabHeight = 56;
  const tabOffsetTop = isMobile ? 0 : 68;
  const scrollingRef = useRef(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Scroll listener optimizado
  useEffect(() => {
    let lastScrollTime = 0;
    const throttle = 50;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttle) return;
      lastScrollTime = now;

      const passed = window.scrollY > 500;
      if (passed !== showTabs) {
        setShowTabs(passed);
        if (passed && !hasScrolled) setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showTabs, hasScrolled]);

  // Scroll a tab activa
  useEffect(() => {
    if (!tabsRef.current || !activeCategory || scrollingRef.current) return;

    const tabEl = tabsRef.current.querySelector(
      `.category-tab[data-category="${activeCategory}"]`
    ) as HTMLElement;

    if (tabEl) {
      requestAnimationFrame(() => {
        tabEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    }
  }, [activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    if (!tabsRef.current || categoryId === activeCategory) return;
    scrollingRef.current = true;
    setActiveCategory(categoryId);

    const section = document.getElementById(`category-${categoryId}`);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const offset = tabHeight + tabOffsetTop + 16;

      window.scrollTo({ top: top - offset, behavior: 'smooth' });

      setTimeout(() => (scrollingRef.current = false), 800);
    } else {
      scrollingRef.current = false;
    }
  };

  const tabsVisibilityClass = showTabs
    ? 'opacity-100 visible pointer-events-auto'
    : 'opacity-0 invisible pointer-events-none';

  return (
    <>
      {!isMobile && <div style={{ height: `${tabHeight}px` }} />}

      <div
        className={`z-30 transition-opacity duration-300 ease-in-out ${
          isMobile
            ? 'fixed top-0 left-0 right-0 rounded-none shadow-md border bg-white'
            : `fixed left-0 right-0 border-b border-gray-200 shadow-sm top-[${tabOffsetTop}px]`
        } ${tabsVisibilityClass}`}
        style={{
          height: `${tabHeight}px`,
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <ScrollArea
            className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
            orientation="horizontal"
          >
            <div
              ref={tabsRef}
              className="flex gap-4 px-1 py-1"
              style={{ scrollBehavior: 'smooth' }}
            >
              {categories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    data-category={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`category-tab relative whitespace-nowrap px-4 py-3 font-medium text-sm rounded-md transition-all duration-200 ${
                      isActive
                        ? 'text-navy-800 font-semibold bg-white shadow-md'
                        : 'text-gray-600 hover:text-navy-700 hover:bg-gray-50/50'
                    }`}
                  >
                    {category.name}
                    <div
                      className={`absolute bottom-0 left-0 w-full h-1 bg-navy-700 rounded-t-sm transition-transform origin-bottom duration-200 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Gradientes laterales */}
          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-300" />
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-300" />
        </div>
      </div>
    </>
  );
};

export default CategoryTabs;
