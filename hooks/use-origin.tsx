import { useEffect, useState } from "react"

export const useOrigin = () => {
    const [isMounted,setIsMounted] = useState(false)
    // Since Nextjs is server side rendering, the browser object window is not be availabe at serverside
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ""

    useEffect(() => {
        setIsMounted(true)
    },[])

    if(!isMounted) return ""
    return origin
}