import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const MOBILE_QUERY = '(max-width: 640px)';

const ResponsiveToaster = () => {
    const [isMobile, setIsMobile] = useState(
        () => window.matchMedia(MOBILE_QUERY).matches
    );

    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        const handler = (e) => setIsMobile(e.matches);

        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <Toaster
            position={isMobile ? 'bottom-center' : 'bottom-right'}
            containerStyle={{
                bottom: 20,
                left: isMobile ? 16 : 24,
                right: isMobile ? 16 : 24,
            }}
            toastOptions={{
                duration: 3000,
                style: {
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    maxWidth: isMobile ? '100%' : '420px',
                },
                success: {
                    duration: 3000,
                },
                error: {
                    duration: 4000,
                },
            }}
        />
    );
}

export default ResponsiveToaster;