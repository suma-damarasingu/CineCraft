import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer font-sans tracking-wide";

    const variants = {
        primary: "bg-primary text-background hover:bg-primary/90 shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:shadow-[0_0_25px_rgba(197,160,89,0.5)]",
        secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-md",
        outline: "border border-primary text-primary hover:bg-primary/10",
        ghost: "text-text hover:text-primary hover:bg-white/5",
        link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6 py-2 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9",
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
