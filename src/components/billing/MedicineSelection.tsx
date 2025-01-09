import { Card } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Medicine } from "@/db/database";

interface MedicineSelectionProps {
  medicines: Medicine[] | undefined;
  selectedMedicines: Array<{
    medicineId: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  onAddMedicine: (medicineId: number, name: string, price: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
}

export const MedicineSelection = ({
  medicines,
  selectedMedicines,
  onAddMedicine,
  onQuantityChange,
}: MedicineSelectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <FormLabel>Add Medicines</FormLabel>
        <div className="grid grid-cols-2 gap-4">
          {medicines?.map((medicine) => (
            <Card
              key={medicine.id}
              className="p-2 cursor-pointer hover:bg-accent"
              onClick={() => onAddMedicine(medicine.id!, medicine.name, medicine.price)}
            >
              <p>{medicine.name}</p>
              <p className="text-sm text-muted-foreground">
                ₹{medicine.price}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {selectedMedicines.length > 0 && (
        <div className="space-y-2">
          <FormLabel>Selected Medicines</FormLabel>
          <Card className="p-4">
            {selectedMedicines.map((item, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <span className="flex-1">{item.name}</span>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onQuantityChange(index, Number(e.target.value))}
                  className="w-20"
                />
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="mt-4 text-right font-bold">
              Total: ₹{selectedMedicines.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};