import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { BillingTable } from "@/components/billing/BillingTable";
import { BillingForm } from "@/components/billing/BillingForm";

const Billing = () => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing</h1>
        <Button className="flex items-center gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Generate Bill
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generate Bill</DialogTitle>
          </DialogHeader>
          <BillingForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Card className="glass-card">
        <BillingTable />
      </Card>
    </div>
  );
};

export default Billing;