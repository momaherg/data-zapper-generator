
import React from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

interface PageTransitionProps {
  children: React.ReactNode;
  location: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, location }) => {
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location}
        classNames="page-transition"
        timeout={300}
        unmountOnExit
      >
        {children}
      </CSSTransition>
    </SwitchTransition>
  );
};

export const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideUpAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

export const staggeredAnimation = (delayIncrement = 0.05) => ({
  container: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: delayIncrement }
    }
  },
  item: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 }
  }
});
