

import { ComponentChildren, VNode, h } from "preact";
import { useRef, useEffect, useState, useCallback } from "preact/compat";
import cls from 'classnames'


type Props = {

    scrollCta: string,
    isNewSession: boolean,
    callNewSession: () => void
}

const ScrollContainer = ({ children, scrollCta, isNewSession, callNewSession }: Props & { children: ComponentChildren}): VNode  => {
  const outerDiv = useRef<HTMLDivElement | null>(null);
  const innerDiv = useRef<HTMLDivElement | null>(null);

  const prevInnerDivHeight = useRef(-1);

  const [showMessages, setShowMessages] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;
    const outerDivScrollTop = outerDiv?.current?.scrollTop;
  
    if (
      !prevInnerDivHeight.current ||
      outerDivScrollTop === (prevInnerDivHeight.current - (outerDivHeight || 0))
    ) {
      innerDiv?.current?.scrollIntoView({
        behavior: prevInnerDivHeight.current ? "smooth" : "auto"
      });
      setShowMessages(true);
    } else {
      setShowScrollButton(true);
    }
    
  
    prevInnerDivHeight.current = innerDivHeight as number
    
    
  }, [children]);
  
  const handleScrollButtonClick = useCallback(() => {
    const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;
  
    innerDiv?.current?.scrollIntoView({
      behavior: "smooth"
    });
  
    setShowScrollButton(false);
  }, []);

  return (
    <div className="relative h-[375px] w-full max-w-[550px] sm:min-w-[400px] bg-primary-content">
      <div className={cls("relative h-full overflow-scroll w-full bg-primary-content", { 'opacity-50': isNewSession })} ref={outerDiv}>
        <div
          className="relative transition-all duration-300 bg-primary-content"
          style={{ opacity: showMessages ? 1 : 0 }}
          ref={innerDiv}
        >
          {children}
        </div>
      </div>
      <button
        style={{
          transform: "translateX(-50%)",
          opacity: showScrollButton ? 1 : 0,
          pointerEvents: showScrollButton ? "auto" : "none"
        }}
        className="absolute bg-red-500 text-white bottom-1 left-1/2 w-28 rounded-lg text-sm transition-all duration-300"
        onClick={handleScrollButtonClick}
      >
        {scrollCta}
      </button>
      <button
        style={{
          transform: "translateX(-50%)",
          opacity: isNewSession ? 1 : 0,
          pointerEvents: isNewSession ? "auto" : "none"
        }}
        className="absolute bg-red-500 text-white bottom-1 left-1/2 w-28 rounded-lg text-sm transition-all duration-300"
        onClick={callNewSession}
      >
        New Session
      </button>
    </div>
  );
};

export default ScrollContainer

