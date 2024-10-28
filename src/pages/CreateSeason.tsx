import React, { useState } from "react";
import { CreateSeasonStep1 } from "./CreateSeason/CreateSeasonStep1";
import { CreateSeasonStep2 } from "./CreateSeason/CreateSeasonStep2";
import { CreateSeasonStep3 } from "./CreateSeason/CreateSeasonStep3";
import { CreateSeasonStep4 } from "./CreateSeason/CreateSeasonStep4";
import { CreateSeasonStep5 } from "./CreateSeason/CreateSeasonStep5";

const CreateSeason: React.FC = () => {
  const [step, setStep] = useState(1);
  const [seasonName, setSeasonName] = useState("");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [includeDrivers, setIncludeDrivers] = useState<boolean>(false);
  const [selectedRaces, setSelectedRaces] = useState<string[]>([]);
  const [teams, setTeams] = useState<{
    [teamId: string]: { points: number; driver1: string; driver2: string };
  }>({});

  // Funktion zum nächsten Schritt wechseln
  const nextStep = (data?: any) => {
    switch (step) {
      case 1:
        if (data) {
          setSeasonName(data);
        }
        break;
      case 2:
        if (data?.selectedDrivers && data?.teams) {
          setSelectedDrivers(data.selectedDrivers);
          setTeams(data.teams);
        }
        break;
      case 3:
        if (data?.includeDrivers !== undefined) {
          setIncludeDrivers(data.includeDrivers);
          setTeams(data.updatedTeams);
        }
        break;
      case 4:
        if (data) {
          setSelectedRaces(data);
        }
        break;
      default:
        break;
    }
    setStep(step + 1);
  };

  // Funktion zum vorherigen Schritt wechseln
  const previousStep = () => {
    setStep(step - 1);
  };

  return (
    <>
      {step === 1 && <CreateSeasonStep1 nextStep={nextStep} />}
      {step === 2 && (
        <CreateSeasonStep2
          seasonName={seasonName}
          nextStep={(selectedDrivers, teams) => nextStep({ selectedDrivers, teams })}
          previousStep={previousStep}
        />
      )}
      {step === 3 && (
        <CreateSeasonStep3
          selectedDrivers={selectedDrivers}
          teams={teams}
          nextStep={(includeDrivers, updatedTeams) => nextStep({ includeDrivers, updatedTeams })}
          previousStep={previousStep}
        />
      )}
      {step === 4 && (
        <CreateSeasonStep4
          nextStep={(selectedRaces) => nextStep(selectedRaces)}
          previousStep={previousStep}
        />
      )}
      {step === 5 && (
        <CreateSeasonStep5
          seasonName={seasonName}
          selectedDrivers={selectedDrivers}
          selectedRaces={selectedRaces}
          teams={teams}
          includeDrivers={includeDrivers}
          onFinish={() => alert("Saison erfolgreich erstellt!")}
          previousStep={previousStep}
        />
      )}
    </>
  );
};

export default CreateSeason;
