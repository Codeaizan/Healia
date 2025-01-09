import { useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/db/database";
import { toast } from "sonner";
import { PrintBillsDialog } from "@/components/settings/PrintBillsDialog";
import { PrintPatientsDialog } from "@/components/settings/PrintPatientsDialog";

const Settings = () => {
  const [printBillsDialog, setPrintBillsDialog] = useState(false);
  const [printPatientsDialog, setPrintPatientsDialog] = useState(false);

  const clearDatabase = async () => {
    try {
      await db.delete();
      await db.open();
      toast.success("Database cleared successfully");
    } catch (error) {
      toast.error("Failed to clear database");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Settings</h1>
      </header>

      <div className="space-y-4">
        <Button 
          className="w-full"
          onClick={() => setPrintBillsDialog(true)}
        >
          Print Bills
        </Button>
        <Button 
          className="w-full"
          onClick={() => setPrintPatientsDialog(true)}
        >
          Print Patient Details
        </Button>
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={clearDatabase}
        >
          Clear Database
        </Button>
      </div>

      <PrintBillsDialog
        open={printBillsDialog}
        onOpenChange={setPrintBillsDialog}
      />

      <PrintPatientsDialog
        open={printPatientsDialog}
        onOpenChange={setPrintPatientsDialog}
      />
    </div>
  );
};

export default Settings;