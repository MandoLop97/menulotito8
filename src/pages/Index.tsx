
import { useState, useEffect, useRef } from 'react';
import { menuCategories, menuItems } from '@/lib/data';
import CategoryTabs from '@/components/CategoryTabs';
import MenuSection from '@/components/MenuSection';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import { CartProvider } from '@/context/CartContext';
import RestaurantBanner from '@/components/RestaurantBanner';
import RestaurantInfo from '@/components/RestaurantInfo';
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
  const scrollThresholdRef = useRef(150); // Reducimos el umbral para que aparezca antes
  const isMobile = useIsMobile();
  
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

  // Setup scroll handler to detect when user is scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Usamos la función de setState con callback para evitar actualizaciones innecesarias
      setIsScrolled(prevScrolled => {
        const shouldBeScrolled = scrollY > scrollThresholdRef.current;
        return prevScrolled !== shouldBeScrolled ? shouldBeScrolled : prevScrolled;
      });
      
      setUserScrolling(true);
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set a new timeout to mark scrolling as finished
      scrollTimeoutRef.current = setTimeout(() => {
        setUserScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Setup IntersectionObserver for scrollspy
  useEffect(() => {
    // If the observer already exists, disconnect it
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create new observer with options
    observerRef.current = new IntersectionObserver((entries) => {
      // Skip observer updates during manual category changes or user scrolling
      if (manualCategoryChange) return;
      
      // Find the first section that's in view (with highest intersection ratio)
      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      
      if (visibleEntries.length > 0) {
        const categoryId = visibleEntries[0].target.getAttribute('data-category-section');
        
        if (categoryId && categoryId !== activeCategory) {
          setActiveCategory(categoryId);
        }
      }
    }, {
      // Change threshold to be more sensitive
      threshold: [0.1, 0.2, 0.5],
      rootMargin: '-100px 0px -20% 0px' // Top margin helps with early category switching
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

  // Handle manual category change
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return;
    
    // Set flag to prevent scrollspy from overriding the manual selection
    setManualCategoryChange(true);
    setActiveCategory(categoryId);

    // Scroll to the selected category section
    const sectionElement = document.getElementById(`category-${categoryId}`);
    if (sectionElement) {
      // Use smooth scrolling to the target section
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Reset manual change flag after scrolling animation should be complete
    setTimeout(() => {
      setManualCategoryChange(false);
    }, 1000);
  };

  return (
    <CartProvider>
      <div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Header />
        
        <div className={`container mx-auto ${isMobile ? 'px-2' : 'px-4'}`}>
          <RestaurantBanner />
          <RestaurantInfo />
        </div>
        
        <CategoryTabs 
          categories={menuCategories} 
          activeCategory={activeCategory} 
          setActiveCategory={handleCategoryChange}
          isScrolled={isScrolled}
        />
        
        <main className={`menu-container ${isMobile ? 'px-2' : 'px-4'} ${isMobile ? 'pb-28' : 'pb-20'} prevent-scroll-reset`}>
          {menuCategories.map((category) => {
            const categoryItems = menuItems.filter(
              (item) => item.category === category.id
            );
            
            return (
              <MenuSection
                key={category.id}
                categoryId={category.id}
                categoryName={category.name}
                items={categoryItems}
                isActive={activeCategory === category.id}
              />
            );
          })}
        </main>
        
        <Cart />
        <MobileNavBar />
      </div>
    </CartProvider>
  );
};

export default Index;
