import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Patient } from "@/db/database";

interface PatientSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  searchResults: Patient[];
  onSelectPatient: (patient: Patient) => void;
  selectedPatient: Patient | null;
}

export const PatientSearch = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchResults,
  onSelectPatient,
  selectedPatient,
}: PatientSearchProps) => {
  return (
    <div className="space-y-2">
      <FormLabel>Search Patient</FormLabel>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search patient by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {searchResults.length > 0 && !selectedPatient && (
        <Card className="p-4 mt-2">
          {searchResults.map((patient) => (
            <div
              key={patient.id}
              className="p-2 hover:bg-accent cursor-pointer rounded flex justify-between items-center"
              onClick={() => onSelectPatient(patient)}
            >
              <span>{patient.name}</span>
              <span className="text-sm text-muted-foreground">{patient.contact}</span>
            </div>
          ))}
        </Card>
      )}
      {selectedPatient && (
        <Card className="p-4 mt-2">
          <p>Selected Patient: {selectedPatient.name} ({selectedPatient.contact})</p>
        </Card>
      )}
    </div>
  );
};