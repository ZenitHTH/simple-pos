import NumberSlider from "@/app/components/ui/NumberSlider";

export default function GlobalScaleControls({ value, onChange }: { value: number, onChange: (val: number) => void }) {
    return (
        <div className="flex-1 space-y-2 border-r border-border pr-8">
            <NumberSlider
                label="Display Scale"
                min={75}
                max={125}
                step={5}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
