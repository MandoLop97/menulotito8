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
  const clickedRef = useRef(false); // ✅ Usamos esta bandera para controlar el scroll
  const isMobile = useIsMobile();

  // Mostrar los tabs después de cierto scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 400;
      setShowTabs(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ScrollSpy: Detectar qué sección está en pantalla y actualizar el activeCategory
  useEffect(() => {
    const sectionElements = categories.map(category =>
      document.getElementById(`category-${category.id}`)
    ).filter(Boolean) as HTMLElement[];

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          const visibleId = visibleEntries[0].target.getAttribute('data-category-section');
          if (visibleId && visibleId !== activeCategory) {
            setActiveCategory(visibleId);
          }
        }
      },
      {
        root: null,
        threshold: 0.4
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  // ScrollIntoView solo cuando fue clic del usuario
  useEffect(() => {
    if (!tabsRef.current || !clickedRef.current) return;

    const activeTabEl = tabsRef.current.querySelector(
      `.category-tab[data-category="${activeCategory}"]`
    ) as HTMLElement;

    if (activeTabEl) {
      const container = tabsRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeTabEl.getBoundingClientRect();

      const isFullyVisible =
        activeRect.left >= containerRect.left &&
        activeRect.right <= containerRect.right;

      if (!isFullyVisible) {
        activeTabEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }

    const timeout = setTimeout(() => {
      clickedRef.current = false;
    }, 400);

    return () => clearTimeout(timeout);
  }, [activeCategory]);

  // Click manual
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
                  className={`category-tab relative whitespace-nowrap px-4 py-3 font-medium text-sm transition-all duration-300 rounded-md will-change-transform ${
                    isActive
                      ? 'text-navy-800 font-semibold bg-gray-50'
                      : 'text-gray-600 hover:text-navy-700 hover:bg-gray-50/50'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-1 bg-navy-700 rounded-t-sm transform-gpu transition-opacity duration-400 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  ></div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Fade effects */}
        <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white via-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white via-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default CategoryTabs;
