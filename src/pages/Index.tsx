
import { useState, useEffect, useRef } from 'react';
import { menuCategories, menuItems } from '@/lib/data';
import CategoryTabs from '@/components/CategoryTabs';
import MenuSection from '@/components/MenuSection';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import { CartProvider } from '@/context/CartContext';
import UnifiedBanner from '@/components/UnifiedBanner';
import MobileNavBar from '@/components/MobileNavBar';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]?.id || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [userScrolling, setUserScrolling] = useState(false);
  const [manualCategoryChange, setManualCategoryChange] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollThresholdRef = useRef(120); // Reducido para mejor respuesta
  const isMobile = useIsMobile();
  const ticking = useRef(false);

  useEffect(() => {
    // Scroll to top when component mounts to ensure banner visibility
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Mark as loaded after a small delay for smoother transitions
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Setup scroll handler to detect when user is scrolling with improved performance
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        // Use requestAnimationFrame to limit updates and improve performance
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const shouldBeScrolled = scrollY > scrollThresholdRef.current;
          
          // Only update state if value actually changed
          if (shouldBeScrolled !== isScrolled) {
            setIsScrolled(shouldBeScrolled);
          }
          
          setUserScrolling(true);

          // Clear any existing timeout
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }

          // Set a new timeout to mark scrolling as finished
          scrollTimeoutRef.current = setTimeout(() => {
            setUserScrolling(false);
          }, 150);
          
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isScrolled]);

  // Setup IntersectionObserver for scrollspy with improved performance
  useEffect(() => {
    // If the observer already exists, disconnect it
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer with optimized options
    observerRef.current = new IntersectionObserver(entries => {
      // Skip observer updates during manual category changes or user scrolling
      if (manualCategoryChange) return;

      // Find the first section that's in view (with highest intersection ratio)
      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        
      if (visibleEntries.length > 0) {
        const categoryId = visibleEntries[0].target.getAttribute('data-category-section');
        if (categoryId && categoryId !== activeCategory) {
          // Use requestAnimationFrame to batch UI updates
          requestAnimationFrame(() => {
            setActiveCategory(categoryId);
          });
        }
      }
    }, {
      threshold: [0.1, 0.2, 0.5],
      rootMargin: '-100px 0px -20% 0px'
    });

    // Observe all category sections
    const categoryElements = document.querySelectorAll('[data-category-section]');
    categoryElements.forEach(element => {
      observerRef.current?.observe(element);
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeCategory, manualCategoryChange]);

  // Handle manual category change with improved animation performance
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return;

    // Set flag to prevent scrollspy from overriding the manual selection
    setManualCategoryChange(true);
    setActiveCategory(categoryId);

    // Scroll to the selected category section
    const sectionElement = document.getElementById(`category-${categoryId}`);
    if (sectionElement) {
      // Use smooth scrolling to the target section
      requestAnimationFrame(() => {
        sectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }

    // Reset manual change flag after scrolling animation should be complete
    setTimeout(() => {
      setManualCategoryChange(false);
    }, 1000);
  };
  
  return (
    <CartProvider>
      <div className={`min-h-screen bg-gray-50 dark:bg-navy-900 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Header />
        
        <div className="">
          <UnifiedBanner />
        </div>
        
        <CategoryTabs categories={menuCategories} activeCategory={activeCategory} setActiveCategory={handleCategoryChange} />
        
        <main className={`menu-container ${isMobile ? 'px-2' : 'px-4'} ${isMobile ? 'pb-28' : 'pb-20'} prevent-scroll-reset mt-4`}>
          {menuCategories.map(category => {
            const categoryItems = menuItems.filter(item => item.category === category.id);
            return <MenuSection 
              key={category.id} 
              categoryId={category.id} 
              categoryName={category.name} 
              items={categoryItems} 
              isActive={activeCategory === category.id} 
            />;
          })}
        </main>
        
        <Cart />
        <div className="mobile-nav-blur">
          <MobileNavBar />
        </div>
      </div>
    </CartProvider>
  );
};

export default Index;
