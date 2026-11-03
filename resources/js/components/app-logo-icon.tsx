import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className = 'size-8',
    alt = 'DMart',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/dmart_icon.png"
            alt={alt}
            className={`object-contain ${className}`}
            {...props}
        />
    );
}

