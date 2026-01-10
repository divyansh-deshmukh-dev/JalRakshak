"use client";

import { cn } from "@/lib/utils";
import React from "react";

const Timeline = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn("space-y-4", className)} {...props} />
));
Timeline.displayName = "Timeline";

const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("relative flex gap-4", className)} {...props} />
));
TimelineItem.displayName = "TimelineItem";

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isLast?: boolean }
>(({ className, isLast, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute left-3 top-5 -translate-x-1/2",
      isLast ? "h-0" : "h-full",
      "w-px bg-gray-200",
      className
    )}
    {...props}
  />
));
TimelineConnector.displayName = "TimelineConnector";


const TimelineIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-6 w-6 items-center justify-center rounded-full bg-background border mt-1", className)}
    {...props}
  />
));
TimelineIcon.displayName = "TimelineIcon";

const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 flex justify-between items-start", className)} {...props} />
));
TimelineHeader.displayName = "TimelineHeader";

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold text-gray-800", className)} {...props} />
));
TimelineTitle.displayName = "TimelineTitle";

const TimelineDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm text-gray-500 mt-0.5", className)} {...props} />
));
TimelineDescription.displayName = "TimelineDescription";

const TimelineTime = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm font-medium text-gray-500", className)} {...props} />
));
TimelineTime.displayName = "TimelineTime";


export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
};
