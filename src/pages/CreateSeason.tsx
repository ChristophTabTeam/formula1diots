import React, { useState } from "react";
import { CreateSeasonStep1 } from "./CreateSeason/CreateSeasonStep1";
import { CreateSeasonStep5 } from "./CreateSeason/CreateSeasonStep5";
import { CreateSeasonStep2 } from "./CreateSeason/CreateSeasonStep2";
import { CreateSeasonStep3 } from "./CreateSeason/CreateSeasonStep3";
import { CreateSeasonStep4 } from "./CreateSeason/CreateSeasonStep4";
import { Driver } from "../interfaces/Driver";

const CreateSeason: React.FC = () => {
  const [step, setStep] = useState(1);
  const [seasonName, setSeasonName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
//   const [manualAssignment, setManualAssignment] = useState<boolean>(true);
  const [includeDrivers, setIncludeDrivers] = useState<boolean>(false);
  const [selectedRaces, setSelectedRaces] = useState<string[]>([]);
  const [teams, setTeams] = useState<{
    [teamId: string]: { driver1: string; driver2: string };
  }>({});
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Weiter zum nächsten Schritt
  const nextStep = (data?: any) => {
    if (step === 1) {
      setSeasonName(data);
    } else if (step === 2) {
      setSelectedPlayers(data);
    //   setManualAssignment(data.manualAssignment);
      setTeams(data.teams); // Teams mit Spielern speichern
    } else if (step === 3) {
      setIncludeDrivers(data.includeDrivers);
      setTeams(data.updatedTeams); // Aktualisierte Teams mit Fahrern speichern
    } else if (step === 4) {
      setSelectedRaces(data);
    }
    setStep(step + 1);
  };

  // Zurück zum vorherigen Schritt
  const previousStep = () => {
    setStep(step - 1);
  };

  return (
    <div>
      {step === 1 && <CreateSeasonStep1 nextStep={nextStep} />}
      {step === 2 && (
        <CreateSeasonStep2
          seasonName={seasonName}
          nextStep={(selectedPlayers, teams) => {
            setSelectedPlayers(selectedPlayers);
            // setManualAssignment(manualAssignment);
            setTeams(teams);
            nextStep();
          }}
        />
      )}
      {step === 3 && (
        <CreateSeasonStep3
          selectedPlayers={selectedPlayers}
        //   manualAssignment={manualAssignment}
          teams={teams}
          nextStep={(includeDrivers, updatedTeams) => {
            setIncludeDrivers(includeDrivers);
            setTeams(updatedTeams);
            nextStep();
          }}
        />
      )}
      {step === 4 && (
        <CreateSeasonStep4
          teams={teams}
          nextStep={(selectedRaces) => {
            setSelectedRaces(selectedRaces); // Speichere die ausgewählten Rennen
            nextStep();
          }}
        />
      )}
      {step === 5 && (
        <CreateSeasonStep5
          seasonName={seasonName}
          selectedPlayers={selectedPlayers}
          selectedRaces={selectedRaces}
          teams={teams} // Teams mit Spielern und ggf. regulären Fahrern übergeben
        //   drivers={drivers} // Reguläre Fahrer, falls ausgewählt
          includeDrivers={includeDrivers}
          onFinish={() => alert("Saison erfolgreich erstellt!")}
        />
      )}

      {step > 1 && <button onClick={previousStep}>Zurück</button>}
    </div>
  );
};

export default CreateSeason;
