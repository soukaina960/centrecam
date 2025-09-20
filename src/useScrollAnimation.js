// useScrollAnimation.js
import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

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
        threshold: 0.5, // Déclenche l'animation lorsque 50% de l'élément est visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible]; // Retourne un tableau [ref, isVisible]
};

export default useScrollAnimation;