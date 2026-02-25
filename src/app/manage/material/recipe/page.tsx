"use client";

import { Suspense, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import SimpleRecipeBuilder from "@/components/manage/recipe/SimpleRecipeBuilder";
import RecipeTable from "@/components/manage/recipe/RecipeTable";
import BottomControlPanel from "@/components/design-mode/BottomControlPanel";
import { useRecipeTable } from "./hooks/useRecipeTable";
import { useMockup } from "@/context/MockupContext";

export default function RecipeBuilderPage() {
  const { rows, loading, refresh } = useRecipeTable();
  const { isMockupMode } = useMockup();
  const [split, setSplit] = useState(50);

  return (
    <ManagementPageLayout
      title="Recipe Builder"
      subtitle="Drag and drop materials to connect them to products."
      scaleKey="manage_table_scale"
      scrollable={true}
      headerActions={
        <Link
          href="/manage/material"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-2 rounded-xl border border-transparent px-4 py-2 text-sm font-medium transition-all"
        >
          <FaArrowLeft />
          <span>Back to Materials</span>
        </Link>
      }
    >
      <div className="flex flex-col gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-xl font-bold">Flow Builder</h2>
            <p className="text-muted-foreground text-sm italic">
              Select a product and drag materials to build your recipe
            </p>
          </div>
          <div className="bg-card border-border min-h-[600px] w-full overflow-hidden rounded-2xl border p-6 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
            <Suspense
              fallback={
                <div className="flex h-full min-h-[600px] items-center justify-center">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
              }
            >
              <SimpleRecipeBuilder
                onSaved={refresh}
                split={split}
                onSplitChange={setSplit}
              />
            </Suspense>
          </div>
        </section>

        <section className="space-y-4">
          <div className="border-border flex items-center justify-between border-b pb-2">
            <h2 className="text-foreground text-xl font-bold">Saved Recipes</h2>
            <div className="flex items-center gap-2">
              <span className="bg-primary flex h-2 w-2 animate-pulse rounded-full"></span>
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Live Preview
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
              <p className="text-muted-foreground text-sm font-medium">
                Loading your recipes...
              </p>
            </div>
          ) : (
            <div className="bg-muted/30 rounded-2xl p-6">
              <RecipeTable recipeRows={rows} />
            </div>
          )}
        </section>
      </div>

      {/* Design Mode: DualColumnTuner in the bottom bar */}
      <BottomControlPanel
        dualColumnProps={{ split, onSplitChange: setSplit }}
      />
    </ManagementPageLayout>
  );
}
