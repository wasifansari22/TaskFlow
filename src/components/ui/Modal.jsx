
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, closeOnOverlayClick = true, closeOnEscape = true, }) => {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        previousFocusRef.current = document.activeElement;

        const modal = modalRef.current;
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const getFocusableElements = () => {
            if (!modal) return [];

            return Array.from(
                modal.querySelectorAll(
                    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (closeOnEscape) {
                    onClose();
                }
                return;
            }

            if (event.key !== "Tab") return;

            const focusableElements = getFocusableElements();

            if (focusableElements.length === 0) {
                event.preventDefault();
                modal?.focus();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement =
                focusableElements[focusableElements.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        const animationFrame = requestAnimationFrame(() => {
            const focusableElements = getFocusableElements();

            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            } else {
                modal?.focus();
            }
        });

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            cancelAnimationFrame(animationFrame);

            document.body.style.overflow = previousOverflow;

            if (
                previousFocusRef.current &&
                typeof previousFocusRef.current.focus === "function"
            ) {
                previousFocusRef.current.focus();
            }
        };
    }, [isOpen, onClose, closeOnEscape]);

    if (!isOpen) return null;

    const handleOverlayClick = (event) => {
        if (
            closeOnOverlayClick &&
            event.target === event.currentTarget
        ) {
            onClose();
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-2 backdrop-blur-sm sm:p-4"
            onMouseDown={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="my-auto flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 sm:max-h-[calc(100vh-2rem)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex="-1"
            >
                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
                    <h2
                        id="modal-title"
                        className="text-lg font-semibold text-slate-900 dark:text-slate-100"
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        aria-label="Close modal"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="min-h-0 overflow-y-auto overscroll-contain p-5">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;