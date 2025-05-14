import { useRef, useEffect, useState, memo, useCallback } from 'react';
import { Category } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = memo(({
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
  const lastScrollTime = useRef<number>(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Tiempo para evitar cambios rápidos de categoría (ms)
  const SCROLL_STABILITY_TIME = 150;
  // Tiempo de bloqueo después de clic manual (ms)
  const MANUAL_CLICK_LOCK_TIME = 1000;

  // Calcular la categoría activa basada en la posición de scroll
  const calculateActiveCategory = useCallback(() => {
    // No calcular si el usuario acaba de hacer clic
    if (scrollingRef.current) return;
    
    // Buscar la primera sección visible
    for (const category of categories) {
      const section = document.getElementById(`category-${category.id}`);
      if (!section) continue;

      const rect = section.getBoundingClientRect();
      // Añadimos un margen de error para reducir la sensibilidad
      const threshold = tabOffsetTop + 30;
      
      if (rect.top <= threshold && rect.bottom > threshold) {
        if (category.id !== activeCategory) {
          setActiveCategory(category.id);
        }
        break;
      }
    }
  }, [categories, activeCategory, setActiveCategory, tabOffsetTop]);

  // Manejo del evento de scroll con debounce
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      lastScrollTime.current = now;
      
      // Cancelar cualquier actualización pendiente
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Esperar a que el scroll se detenga antes de actualizar
      scrollTimeout.current = setTimeout(() => {
        // Solo actualizar si ha pasado suficiente tiempo desde el último scroll
        if (Date.now() - lastScrollTime.current >= SCROLL_STABILITY_TIME) {
          calculateActiveCategory();
        }
      }, SCROLL_STABILITY_TIME);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [calculateActiveCategory]);

  // Centrar el tab activo en el área visible
  useEffect(() => {
    if (!tabsRef.current || !activeTabRef.current) return;
    
    // Solo centramos si no es el resultado de un clic
    if (!scrollingRef.current) {
      requestAnimationFrame(() => {
        activeTabRef.current?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      });
    }
  }, [activeCategory]);

  // Manejar clic en una categoría
  const handleCategoryClick = useCallback((categoryId: string) => {
    if (categoryId === activeCategory) return;
    
    // Marcar que estamos en un scroll manual para evitar parpadeos
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

      // Mantener bloqueada la detección automática por más tiempo
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      setTimeout(() => {
        scrollingRef.current = false;
      }, MANUAL_CLICK_LOCK_TIME);
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