import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

const PageContainer = ({
  children,
  title,
  subtitle,
  action,
  className,
}: PageContainerProps) => {
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20 bg-background">
      <div className={cn("container mx-auto px-4 py-6", className)}>
        {(title || subtitle || action) && (
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              {title && (
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="mt-4 md:mt-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
