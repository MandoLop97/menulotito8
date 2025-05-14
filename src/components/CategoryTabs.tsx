import { useRef, useEffect, useState, memo, useCallback } from 'react';
import { Category } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = memo(({ // envuelto completamente con memo
  categories,
  activeCategory,
  setActiveCategory
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLElement | null>(null);
  const [showTabs, setShowTabs] = useState(true);
  const isMobile = useIsMobile();
  const tabHeight = 56;
  const tabOffsetTop = isMobile ? 0 : 68;
  const scrollingRef = useRef<boolean>(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollingRef.current) return;

      if (debounceRef.current !== null) {
        cancelIdleCallback(debounceRef.current);
      }

      debounceRef.current = requestIdleCallback(() => {
        for (const category of categories) {
          const section = document.getElementById(`category-${category.id}`);
          if (!section) continue;

          const rect = section.getBoundingClientRect();
          if (rect.top <= tabOffsetTop + 20 && rect.bottom > tabOffsetTop + 20) {
            if (category.id !== activeCategory) {
              setActiveCategory(category.id);
            }
            break;
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (debounceRef.current !== null) {
        cancelIdleCallback(debounceRef.current);
      }
    };
  }, [categories, activeCategory, setActiveCategory, tabOffsetTop]);

  useEffect(() => {
    if (!tabsRef.current || !activeTabRef.current || scrollingRef.current) return;

    const rect = activeTabRef.current.getBoundingClientRect();
    const parentRect = tabsRef.current.getBoundingClientRect();

    if (rect.left < parentRect.left || rect.right > parentRect.right) {
      requestAnimationFrame(() => {
        activeTabRef.current?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      });
    }
  }, [activeCategory]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    if (!tabsRef.current || categoryId === activeCategory) return;

    scrollingRef.current = true;
    setActiveCategory(categoryId);

    const sectionElement = document.getElementById(`category-${categoryId}`);
    if (sectionElement) {
      const sectionTop = sectionElement.getBoundingClientRect().top + window.scrollY;
      const offset = tabHeight + tabOffsetTop + 16;

      window.scrollTo({
        top: sectionTop - offset,
        behavior: 'smooth'
      });

      // Bloquea temporalmente el scroll automático
      const timeout = setTimeout(() => {
        scrollingRef.current = false;
      }, 800);

      return () => clearTimeout(timeout);
    } else {
      scrollingRef.current = false;
    }
  }, [activeCategory, setActiveCategory, tabHeight, tabOffsetTop]);

  return (
    <>
      {!isMobile && <div style={{ height: `${tabHeight}px` }} />}

      <div
        className="z-30 fixed left-0 right-0 shadow-md bg-white transition-all duration-300 opacity-100 translate-y-0"
        style={{
          height: `${tabHeight}px`,
          top: `${tabOffsetTop}px`,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform, opacity'
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
                    ref={isActive ? activeTabRef : null}
                    data-category={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`category-tab relative whitespace-nowrap px-4 py-3 font-medium text-sm rounded-md transition-all duration-200 ${
                      isActive
                        ? 'text-navy-800 font-bold bg-white shadow-md'
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

          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </>
  );
});

export default CategoryTabs;
