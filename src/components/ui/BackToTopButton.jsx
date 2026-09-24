import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function BackToTopButton({ scrollContainerRef }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        if (!scrollContainer) {
            return;
        }

        const handleScroll = () => {
            setIsVisible(scrollContainer.scrollTop > 400);
        };

        handleScroll();

        scrollContainer.addEventListener("scroll", handleScroll);

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, [scrollContainerRef]);

    const handleScrollToTop = () => {
        scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            type="button"
            onClick={handleScrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:bottom-6 sm:right-6 ${isVisible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0"
                }`}
        >
            <ArrowUp size={18} strokeWidth={2} />
        </button>
    );
}

export default BackToTopButton;