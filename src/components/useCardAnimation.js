// useCardAnimation.js
import { useState, useEffect, useRef } from 'react';

const useCardAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Arrête d'observer une fois visible
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5, // Déclenche l'animation lorsque 50% de la carte est visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return [cardRef, isVisible];
};

export default useCardAnimation;