
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
  const tabOffsetTop = isMobile ? 0 : 68; // Mobile: top of screen, Desktop: below header
  const scrollingRef = useRef<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Detectar scroll para mostrar tabs con throttling para mejor rendimiento
  useEffect(() => {
    let lastScrollTime = 0;
    const scrollThrottleMs = 50; // Limitar frecuencia de actualización

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < scrollThrottleMs) return;
      
      lastScrollTime = now;
      const threshold = 500;
      const passed = window.scrollY > threshold;
      
      // Solo actualizar el estado si hay un cambio real
      if (passed !== showTabs) {
        setShowTabs(passed);
        if (passed && !hasScrolled) setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showTabs, hasScrolled]);

  // Centrar tab activo cuando cambia, con optimizaciones
  useEffect(() => {
    if (!tabsRef.current || !activeCategory || scrollingRef.current) return;

    const tabEl = tabsRef.current.querySelector(
      `.category-tab[data-category="${activeCategory}"]`
    ) as HTMLElement;

    if (tabEl) {
      // Usar requestAnimationFrame para mejorar fluidez visual
      requestAnimationFrame(() => {
        tabEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      });
    }
  }, [activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    if (!tabsRef.current || categoryId === activeCategory) return;
    
    scrollingRef.current = true;
    setActiveCategory(categoryId);
    
    // Scroll a la sección correspondiente con offset ajustado
    const sectionElement = document.getElementById(`category-${categoryId}`);
    if (sectionElement) {
      const sectionTop = sectionElement.getBoundingClientRect().top + window.scrollY;
      // El offset considera la altura de las tabs y un pequeño espacio adicional
      const offset = tabHeight + tabOffsetTop + 16;
      
      window.scrollTo({
        top: sectionTop - offset,
        behavior: 'smooth'
      });
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        scrollingRef.current = false;
      }, 800);
    } else {
      scrollingRef.current = false;
    }
  };

  const tabsTransitionClass = `transform transition-all duration-300 ${
    showTabs
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-4 pointer-events-none'
  }`;

  return (
    <>
      {/* Reservar espacio solo en escritorio */}
      {!isMobile && <div style={{ height: `${tabHeight}px` }} />}

      <div
        className={`z-30 ${
          isMobile
            ? 'fixed top-0 left-0 right-0 rounded-none shadow-md border bg-white'
            : `fixed left-0 right-0 border-b border-gray-200 shadow-sm top-[${tabOffsetTop}px]`
        } ${tabsTransitionClass} will-change-transform`}
        style={{
          height: `${tabHeight}px`,
          backfaceVisibility: 'hidden', // Reduce flickering
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
              className="flex gap-4 px-1 py-1 transition-all duration-300"
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
                    ></div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Gradientes laterales con transición suave */}
          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-300" />
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-300" />
        </div>
      </div>
    </>
  );
};

export default CategoryTabs;
