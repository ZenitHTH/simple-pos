"use client";

import { Suspense } from "react";
import POSClient from "@/components/pos/POSClient";
import { useDataCache } from "@/context/DataContext";

function POSLoader() {
  const { mappedProducts, loading } = useDataCache();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return <POSClient initialProducts={mappedProducts} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      }
    >
      <POSLoader />
    </Suspense>
  );
}
