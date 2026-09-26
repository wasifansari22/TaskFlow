import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        previousFocusRef.current = document.activeElement;

        const modal = modalRef.current;

        const getFocusableElements = () => {
            if (!modal) return [];

            return Array.from(
                modal.querySelectorAll(
                    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
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

            if (event.shiftKey && document.activeElement === firstElement) {
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

        requestAnimationFrame(() => {
            const focusableElements = getFocusableElements();

            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            } else {
                modal?.focus();
            }
        });

        return () => {
            document.removeEventListener("keydown", handleKeyDown);

            if (
                previousFocusRef.current &&
                typeof previousFocusRef.current.focus === "function"
            ) {
                previousFocusRef.current.focus();
            }
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onMouseDown={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex="-1"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
                    <h2
                        id="modal-title"
                        className="text-lg font-semibold text-slate-900"
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close modal"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;