import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface GradeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function GradeSelector({ value, onChange }: GradeSelectorProps) {
  return (
    <RadioGroup
      defaultValue={value}
      onValueChange={onChange}
      className="flex space-x-4 p-4 bg-gray-800 rounded-lg border border-blue-800"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="S355" id="S355" />
        <Label htmlFor="S355" className="text-blue-300">S355</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="S690" id="S690" />
        <Label htmlFor="S690" className="text-blue-300">S690</Label>
      </div>
    </RadioGroup>
  )
}