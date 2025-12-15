
"use client";
import { motion, Variant } from 'framer-motion';
import { useEffect, useRef, useState, useMemo } from 'react';

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: any;
  animationTo?: any;
  easing?: any;
  onAnimationComplete?: () => void;
  stepDuration?: number;
}

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = "easeInOut",
  onAnimationComplete,
  stepDuration = 0.35
}: BlurTextProps) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) observer.unobserve(ref.current); // trigger once
        }
      },
      {
        threshold,
        rootMargin
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
  }, [threshold, rootMargin]);

  const from = useMemo(() => {
    if (animationFrom) return animationFrom;

    const base = {
      filter: 'blur(10px)',
      opacity: 0,
    };

    switch (direction) {
      case 'top': return { ...base, transform: 'translateY(-50px)' };
      case 'bottom': return { ...base, transform: 'translateY(50px)' };
      case 'left': return { ...base, transform: 'translateX(-50px)' };
      case 'right': return { ...base, transform: 'translateX(50px)' };
      default: return { ...base, transform: 'translateY(-50px)' };
    }

  }, [animationFrom, direction]);

  const to = useMemo(() => {
    return (
      animationTo || {
        filter: 'blur(0px)',
        opacity: 1,
        transform: 'translateY(0px)'
      }
    );
  }, [animationTo]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      <span className="sr-only">{text}</span>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={from}
          animate={inView ? to : from}
          transition={{
            duration: stepDuration,
            delay: (index * delay) / 1000,
            ease: easing
          }}
          onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          style={{
            display: animateBy === 'words' ? 'inline-block' : 'inline-block',
            marginRight: animateBy === 'words' ? '0.25em' : '0'
          }}
          className="inline-block"
        >
          {element === ' ' ? '\u00A0' : element}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;
