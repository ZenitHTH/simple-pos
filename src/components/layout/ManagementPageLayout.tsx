"use client";

import { FaSearch } from "react-icons/fa";
import GlobalHeader from "../ui/GlobalHeader";
import ScalableContainer from "../design-mode/ScalableContainer";
import ScrollableContainer from "../ui/ScrollableContainer";

import { AppSettings } from "@/lib";

interface ManagementPageLayoutProps {
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  scaleKey: keyof AppSettings;
  children: React.ReactNode;
  modal?: React.ReactNode;
  floatingActions?: React.ReactNode;
  scrollable?: boolean;
  layoutMaxWidth?: number;
}

export default function ManagementPageLayout({
  title,
  subtitle,
  headerActions,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  scaleKey,
  children,
  modal,
  floatingActions,
  scrollable = false,
  layoutMaxWidth,
}: ManagementPageLayoutProps) {
  // useSettings() removed for better performance (prop drilling)
  const ContentWrapper = scrollable
    ? ScrollableContainer
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <ContentWrapper>
      <div
        className={`mx-auto w-full p-8 transition-all duration-300 ${scrollable ? "pb-24" : ""}`}
        style={{ maxWidth: `${layoutMaxWidth || 1280}px` }}
      >
        <GlobalHeader title={title} subtitle={subtitle}>
          {headerActions}
        </GlobalHeader>

        <ScalableContainer settingKey={scaleKey}>
          {setSearchQuery && (
            <div className="relative mb-6 max-w-md">
              <FaSearch className="text-muted absolute top-1/2 left-3 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border bg-card focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-10 outline-none focus:ring-2"
              />
            </div>
          )}

          {error && (
            <div className="border-destructive/20 bg-destructive/10 text-destructive mb-6 rounded-lg border p-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : (
            children
          )}
        </ScalableContainer>

        {modal}
      </div>

      {floatingActions && (
        <div className="fixed right-6 bottom-6 z-50">{floatingActions}</div>
      )}
    </ContentWrapper>
  );
}
