

import { ComponentChildren, VNode, h } from "preact";
import { useRef, useEffect, useState, useCallback } from "preact/compat";
import cls from 'classnames'
import { registerNonClient } from "../libs/client/api-helper";


type Props = {
    // email?: string,
    // name?: string,
    // clientVerified: boolean,
    // baseUrl: string,
    scrollCta: string,
    isNewSession: boolean,
    callNewSession: () => void
}

const ScrollContainer = ({ children, scrollCta, isNewSession, callNewSession, ...props }: Props & { children: ComponentChildren}): VNode  => {
  const outerDiv = useRef<HTMLDivElement | null>(null);
  const innerDiv = useRef<HTMLDivElement | null>(null);

  const prevInnerDivHeight = useRef(-1);


  // const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null)


  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [children])

  // // if not registered then register
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       if (!props?.clientVerified) {

  //         const res = await registerNonClient(props?.baseUrl, props?.email, props?.name)

  //         if (res) {

  //         }
  //       }
  //     } catch (e) {
  //       console.log(e,  ' unable to register non client')
  //     }
  //   })()
  // }, [])

  return (
    <div className="relative h-[375px] w-full max-w-[550px] sm:min-w-[400px] bg-primary-content">
      <div className={cls("relative h-full overflow-scroll w-full bg-primary-content", { 'opacity-50': isNewSession })} ref={outerDiv}>
        <div
          className="relative transition-all duration-300 bg-primary-content"
          ref={innerDiv}
        >
          {children}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ScrollContainer

