import { For } from "solid-js";
import { CategorySection } from "./CategorySection";

export function PackageList(props) {
  return (
    <div class="max-w-[1800px] mx-auto px-4 py-8 pb-64 mt-32">
      <div class="space-y-6">
        <For each={props.packages}>
          {(category) => (
            <CategorySection
              category={category}
              selectedPackages={props.selectedPackages}
              onPackageToggle={props.onPackageToggle}
            />
          )}
        </For>
      </div>
    </div>
  );
}