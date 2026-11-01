import * as React from "react"
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CarouselApi {
  currentIndex: number
  count: number
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  isPlaying: boolean
  togglePlay: () => void
}

interface CarouselContextProps {
  currentIndex: number
  count: number
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  orientation: "horizontal" | "vertical"
  registerSlide: () => number
  unregisterSlide: () => void
  isPlaying: boolean
  togglePlay: () => void
  autoplayProgress: number
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

export function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

export interface CarouselProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical"
  loop?: boolean
  autoplay?: boolean
  autoplayInterval?: number
  pauseOnHover?: boolean
  setApi?: (api: CarouselApi) => void
}

export function Carousel({
  orientation = "horizontal",
  loop = true,
  autoplay = false,
  autoplayInterval = 5000,
  pauseOnHover = true,
  setApi,
  className,
  children,
  onKeyDown,
  ...props
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [slideCount, setSlideCount] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(autoplay)
  const [progress, setProgress] = React.useState(0)

  const slideCounterRef = React.useRef(0)

  const registerSlide = React.useCallback(() => {
    const id = slideCounterRef.current
    slideCounterRef.current += 1
    setSlideCount(slideCounterRef.current)
    return id
  }, [])

  const unregisterSlide = React.useCallback(() => {
    slideCounterRef.current = Math.max(0, slideCounterRef.current - 1)
    setSlideCount(slideCounterRef.current)
  }, [])

  const canScrollPrev = loop || currentIndex > 0
  const canScrollNext = loop || currentIndex < slideCount - 1

  const scrollPrev = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (slideCount === 0) return 0
      if (prev <= 0) return loop ? slideCount - 1 : 0
      return prev - 1
    })
    setProgress(0)
  }, [loop, slideCount])

  const scrollNext = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (slideCount === 0) return 0
      if (prev >= slideCount - 1) return loop ? 0 : prev
      return prev + 1
    })
    setProgress(0)
  }, [loop, slideCount])

  const scrollTo = React.useCallback((index: number) => {
    setCurrentIndex(index)
    setProgress(0)
  }, [])

  const togglePlay = React.useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // Autoplay loop with smooth progress tracking
  React.useEffect(() => {
    if (!isPlaying || slideCount <= 1 || (pauseOnHover && isHovered)) {
      return
    }

    const stepMs = 50
    const increment = (stepMs / autoplayInterval) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          scrollNext()
          return 0
        }
        return prev + increment
      })
    }, stepMs)

    return () => clearInterval(timer)
  }, [isPlaying, slideCount, pauseOnHover, isHovered, autoplayInterval, scrollNext])

  // Expose API if requested
  React.useEffect(() => {
    if (setApi) {
      setApi({
        currentIndex,
        count: slideCount,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        scrollTo,
        isPlaying,
        togglePlay,
      })
    }
  }, [
    setApi,
    currentIndex,
    slideCount,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
    isPlaying,
    togglePlay,
  ])

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (orientation === "horizontal") {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      } else {
        if (event.key === "ArrowUp") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowDown") {
          event.preventDefault()
          scrollNext()
        }
      }

      onKeyDown?.(event)
    },
    [orientation, scrollPrev, scrollNext, onKeyDown]
  )

  return (
    <CarouselContext.Provider
      value={{
        currentIndex,
        count: slideCount,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        scrollTo,
        orientation,
        registerSlide,
        unregisterSlide,
        isPlaying,
        togglePlay,
        autoplayProgress: progress,
      }}
    >
      <div
        data-slot="carousel"
        role="region"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn("relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-3xl", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { currentIndex, orientation } = useCarousel()

  return (
    <div data-slot="carousel-viewport" className="overflow-hidden rounded-3xl">
      <div
        data-slot="carousel-content"
        className={cn(
          "flex transition-transform duration-500 ease-out will-change-transform",
          orientation === "vertical" ? "flex-col" : "flex-row",
          className
        )}
        style={{
          transform:
            orientation === "vertical"
              ? `translateY(-${currentIndex * 100}%)`
              : `translateX(-${currentIndex * 100}%)`,
        }}
        {...props}
      />
    </div>
  )
}

export function CarouselItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { registerSlide, unregisterSlide } = useCarousel()

  React.useEffect(() => {
    registerSlide()
    return () => unregisterSlide()
  }, [registerSlide, unregisterSlide])

  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  )
}

export function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      type="button"
      variant={variant}
      size={size}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      className={cn(
        "absolute z-20 rounded-full transition-all backdrop-blur-md shadow-md",
        orientation === "horizontal"
          ? "left-4 top-1/2 -translate-y-1/2"
          : "-top-4 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

export function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      type="button"
      variant={variant}
      size={size}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      className={cn(
        "absolute z-20 rounded-full transition-all backdrop-blur-md shadow-md",
        orientation === "horizontal"
          ? "right-4 top-1/2 -translate-y-1/2"
          : "-bottom-4 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export function CarouselDots({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { count, currentIndex, scrollTo } = useCarousel()

  if (count <= 1) return null

  return (
    <div
      data-slot="carousel-dots"
      role="tablist"
      aria-label="Slides"
      className={cn("flex items-center gap-2 z-20", className)}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={currentIndex === i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => scrollTo(i)}
          className={cn(
            "transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            currentIndex === i
              ? "w-8 h-2.5 bg-primary shadow-xs"
              : "w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
          )}
        />
      ))}
    </div>
  )
}

export function CarouselProgressBar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { autoplayProgress, isPlaying } = useCarousel()

  if (!isPlaying) return null

  return (
    <div
      data-slot="carousel-progress"
      className={cn("h-1 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden", className)}
      {...props}
    >
      <div
        className="h-full bg-primary/80 transition-all duration-75 ease-linear rounded-full"
        style={{ width: `${autoplayProgress}%` }}
      />
    </div>
  )
}

export function CarouselAutoplayToggle({
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { isPlaying, togglePlay } = useCarousel()

  return (
    <Button
      data-slot="carousel-autoplay-toggle"
      type="button"
      variant={variant}
      size={size}
      onClick={togglePlay}
      aria-label={isPlaying ? "Pause automatic slideshow" : "Play automatic slideshow"}
      title={isPlaying ? "Pause slideshow" : "Play slideshow"}
      className={cn("h-8 w-8 rounded-full", className)}
      {...props}
    >
      {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      <span className="sr-only">
        {isPlaying ? "Pause slideshow" : "Play slideshow"}
      </span>
    </Button>
  )
}
