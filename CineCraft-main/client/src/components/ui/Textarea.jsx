import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            className={twMerge(clsx(
                "flex min-h-[80px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm focus:bg-surface/80 resize-y",
                className
            ))}
            ref={ref}
            {...props}
        />
    );
});

Textarea.displayName = "Textarea";

export default Textarea;
