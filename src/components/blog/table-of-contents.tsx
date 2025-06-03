

import { useEffect, useState, useRef } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const headingElementsRef = useRef<{ [id: string]: IntersectionObserverEntry }>({});

  // Function to scroll active item into view
  const scrollActiveItemIntoView = () => {
    if (activeItemRef.current && tocContainerRef.current) {
      const container = tocContainerRef.current;
      const activeItem = activeItemRef.current;

      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      // Check if item is outside the visible area
      const isAboveView = itemRect.top < containerRect.top;
      const isBelowView = itemRect.bottom > containerRect.bottom;

      if (isAboveView || isBelowView) {
        // Calculate the scroll position to center the active item
        const containerScrollTop = container.scrollTop;
        const itemOffsetTop = activeItem.offsetTop;
        const containerHeight = container.clientHeight;
        const itemHeight = activeItem.clientHeight;

        // Center the active item in the container
        const targetScrollTop = itemOffsetTop - containerHeight / 2 + itemHeight / 2;

        // Smooth scroll to the target position
        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth',
        });
      }
    }
  };

  // Scroll active item into view whenever activeId changes
  useEffect(() => {
    if (activeId) {
      // Small delay to ensure the DOM has updated
      setTimeout(scrollActiveItemIntoView, 100);
    }
  }, [activeId]);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Reset the headings ref
    headingElementsRef.current = {};

    // Find the article element and only observe headings within it
    const articleElement = document.querySelector('article');
    if (!articleElement) {
      console.warn('No <article> element found');
      return;
    }

    // Generate table of contents from headings within the <article> element only
    const headings = articleElement.querySelectorAll('h1, h2');

    const tocItems: TOCItem[] = Array.from(headings).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent || '',
        level: Number.parseInt(heading.tagName.charAt(1)),
        element: heading as HTMLElement,
      };
    });

    setToc(tocItems);

    // Set up intersection observer with viewport as root (not article)
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Store all intersection data
        entries.forEach((entry) => {
          headingElementsRef.current[entry.target.id] = entry;
        });

        // Get all entries we're tracking
        const allEntries = Object.values(headingElementsRef.current);

        // Find headings that are currently visible in the viewport
        const visibleHeadings = allEntries.filter((entry) => entry.isIntersecting);

        if (visibleHeadings.length > 0) {
          // Sort visible headings by their position in the document
          // This ensures we select the topmost visible heading
          const sortedVisibleHeadings = [...visibleHeadings].sort((a, b) => {
            const aIndex = tocItems.findIndex((item) => item.id === a.target.id);
            const bIndex = tocItems.findIndex((item) => item.id === b.target.id);
            return aIndex - bIndex;
          });

          // Select the first visible heading (topmost in the document)
          setActiveId(sortedVisibleHeadings[0].target.id);
        } else {
          // If no headings are visible, find the one just above the viewport
          const scrollPosition = window.scrollY;

          // Find all headings above the current scroll position
          const headingsAbove = tocItems.filter((item) => {
            const elementTop = item.element.getBoundingClientRect().top + window.scrollY;
            return elementTop <= scrollPosition + 100; // Add small offset for better detection
          });

          if (headingsAbove.length > 0) {
            // Get the last heading above the viewport (closest to current position)
            const closestHeading = headingsAbove[headingsAbove.length - 1];
            setActiveId(closestHeading.id);
          } else if (tocItems.length > 0) {
            // If somehow we're above all headings, select the first one
            setActiveId(tocItems[0].id);
          }
        }
      },
      {
        // Use viewport as root (default) for proper intersection detection
        root: null,
        // More reliable settings for viewport-based observation
        rootMargin: '-80px 0px -80% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all headings within the article
    tocItems.forEach((item) => {
      if (item.element) {
        observerRef.current?.observe(item.element);
      }
    });

    // Set initial active heading
    const setInitialActiveHeading = () => {
      const scrollPosition = window.scrollY;

      // Find all headings above the current scroll position
      const headingsAbove = tocItems.filter((item) => {
        const elementTop = item.element.getBoundingClientRect().top + window.scrollY;
        return elementTop <= scrollPosition + 100; // Add small offset for better detection
      });

      if (headingsAbove.length > 0) {
        // Get the last heading above the viewport (closest to current position)
        const closestHeading = headingsAbove[headingsAbove.length - 1];
        setActiveId(closestHeading.id);
      } else if (tocItems.length > 0) {
        // If somehow we're above all headings, select the first one
        setActiveId(tocItems[0].id);
      }
    };

    // Set initial active heading after a short delay
    setTimeout(setInitialActiveHeading, 100);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // More offset for better positioning
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Set active ID immediately for better UX
      setActiveId(id);
    }
  };

  if (toc.length === 0) return null;

  return (
    <div
      ref={tocContainerRef}
      className="max-h-[60vh] overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent toc-scrollbar"
    >
      { toc.map((item) => {
        const isActive = activeId === item.id;
        const isH2 = item.level === 2;
        const isH3 = item.level === 3;
        const isH4 = item.level >= 4;

        return (
          <button
            key={item.id}
            ref={isActive ? activeItemRef : null}
            onClick={() => scrollToHeading(item.id)}
            className={`block w-full text-left transition-all duration-300 rounded-md py-2 px-2 ${
              isActive ? 'bg-purple-50' : 'hover:bg-gray-50'
            }`}
          >
            <div
              className={`flex items-center transition-all duration-300 ${
                isActive
                  ? 'text-purple-600 font-medium border-l-3 border-purple-600 pl-3'
                  : 'text-gray-600 hover:text-gray-900 border-l-3 border-transparent'
              } ${isH2 ? 'pl-2 text-sm' : isH3 ? 'pl-6 text-xs' : isH4 ? 'pl-10 text-xs' : ''}`}
            >
              <span className="block truncate leading-relaxed">{ item.text }</span>
            </div>
          </button>
        );
      }) }
    </div>
  );
}
