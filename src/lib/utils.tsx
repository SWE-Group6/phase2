import { type ClassValue, clsx } from "clsx";
import { ForwardRefRenderFunction, forwardRef, PropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fr<T = HTMLElement, P = {}>(
  component: ForwardRefRenderFunction<T, P>
) {
  return forwardRef<T, PropsWithoutRef<P>>((props, ref) => 
    component(props as P, ref)
  );
}

export function se<
  T = HTMLElement,
  P extends React.HTMLAttributes<T> = React.HTMLAttributes<T>
>(Tag: keyof React.ReactHTML, ...classNames: ClassValue[]) {
  const component = fr<T, P>(({ className, ...props }, ref) => (
    // @ts-expect-error Too complicated for TypeScript
    <Tag ref={ref} className={cn(...classNames, className)} {...props} />
  ));
  component.displayName = Tag[0].toUpperCase() + Tag.slice(1);
  return component;
}
