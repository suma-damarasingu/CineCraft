import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={twMerge(clsx(
                "flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm focus:bg-surface/80",
                className
            ))}
            ref={ref}
            {...props}
        />
    );
});

Input.displayName = "Input";

export default Input;
