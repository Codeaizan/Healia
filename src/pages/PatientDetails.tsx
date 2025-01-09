import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { PatientDetailsView } from "@/components/patients/PatientDetailsView";
import { Patient } from "@/db/database";

const PatientDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { searchPatients } = usePatients();
  const [searchResults, setSearchResults] = useState<Patient[]>([]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchPatients(searchQuery);
      setSearchResults(results);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Details</h1>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search patients by name or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {searchResults.length > 0 && !selectedPatient && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-4">
            {searchResults.map((patient) => (
              <div
                key={patient.id}
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => setSelectedPatient(patient)}
              >
                <h3 className="font-medium">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Age: {patient.age} | Contact: {patient.contact}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {selectedPatient && (
        <PatientDetailsView 
          patient={selectedPatient} 
          onBack={() => setSelectedPatient(null)} 
        />
      )}
    </div>
  );
};

export default PatientDetails;