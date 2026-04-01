import { ReactNode } from "react";
import loginBg from "@/assets/login-bg.jpg";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

const PageLayout = ({ children, title, subtitle, action }: PageLayoutProps) => {
  return (
    <div
      className="min-h-screen p-8 text-primary-foreground"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        {(title || subtitle || action) && (
          <div className="flex justify-between items-center bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-primary-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-white/60 mt-1">{subtitle}</p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
