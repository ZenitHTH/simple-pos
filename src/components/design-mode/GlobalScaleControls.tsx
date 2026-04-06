import NumberStepper from "@/components/ui/NumberStepper";

export default function GlobalScaleControls({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="border-border flex-1 space-y-2 border-r pr-8">
      <div className="flex flex-col gap-1">
        <span className="text-muted text-xs font-medium tracking-wider uppercase">
          Display Scale
        </span>
        <NumberStepper
          min={75}
          max={125}
          step={5}
          value={value}
          onChange={onChange}
          formatValue={(v) => `${v}%`}
        />
      </div>
    </div>
  );
}
