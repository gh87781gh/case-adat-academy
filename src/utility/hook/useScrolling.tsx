/**
 * useScroll React custom hook
 * Usage:
 *    const { scrollX, scrollY, scrollDirection } = useScroll();
 */

import { useState, useEffect } from 'react'

export default function useScrolling() {
  const [lastScrollTop, setLastScrollTop] = useState<any>(0)
  const [bodyOffset, setBodyOffset] = useState<any>(
    document.body.getBoundingClientRect()
  )
  const [scrollY, setScrollY] = useState<any>(bodyOffset.top)
  const [scrollX, setScrollX] = useState<any>(bodyOffset.left)
  const [scrollDirection, setScrollDirection] = useState<any>()

  const listener = (e: any) => {
    setBodyOffset(document.body.getBoundingClientRect())
    setScrollY(-bodyOffset.top)
    setScrollX(bodyOffset.left)
    setScrollDirection(lastScrollTop > -bodyOffset.top ? 'down' : 'up')
    setLastScrollTop(-bodyOffset.top)
  }

  useEffect(() => {
    window.addEventListener('scroll', listener)
    return () => {
      window.removeEventListener('scroll', listener)
    }
  })

  return {
    scrollY,
    scrollX,
    scrollDirection
  }
}
