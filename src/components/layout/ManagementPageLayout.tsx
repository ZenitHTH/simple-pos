"use client";

import GlobalHeader from "@/components/ui/GlobalHeader";
import ScalableContainer from "@/components/design-mode/ScalableContainer";
import ScrollableContainer from "@/components/ui/ScrollableContainer";
import SelectableOverlay from "@/components/design-mode/SelectableOverlay";
import { SearchInput } from "@/components/ui/SearchInput";

import { AppSettings } from "@/lib";

interface ManagementPageLayoutProps {
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  scaleKey: string;
  children: React.ReactNode;
  modal?: React.ReactNode;
  floatingActions?: React.ReactNode;
  scrollable?: boolean;
}

/**
 * ManagementPageLayout Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
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
}: ManagementPageLayoutProps) {
  // useSettings() removed for better performance (prop drilling)
  const ContentWrapper = scrollable
    ? ScrollableContainer
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <ContentWrapper>
      <div
        className={`relative mx-auto w-full p-8 ${scrollable ? "pb-24" : ""}`}
      >
        <GlobalHeader title={title} subtitle={subtitle}>
          {headerActions}
        </GlobalHeader>

        <ScalableContainer settingKey={scaleKey}>
          {setSearchQuery && (
            <div className="mb-6">
              <SearchInput
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
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
