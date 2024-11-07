import React, { useState } from "react";
import { CreateSeasonStep1 } from "./CreateSeasonStep1";
import { CreateSeasonStep2 } from "./CreateSeasonStep2";
import { CreateSeasonStep3 } from "./CreateSeasonStep3";
import { CreateSeasonStep4 } from "./CreateSeasonStep4";
import { CreateSeasonStep5 } from "./CreateSeasonStep5";
import { SeasonRules } from "../../../interfaces/SeasonRules";

const CreateSeason: React.FC = () => {
  const [step, setStep] = useState(1);
  const [seasonName, setSeasonName] = useState("");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [includeDrivers, setIncludeDrivers] = useState<boolean>(false);
  const [selectedRaces, setSelectedRaces] = useState<string[]>([]);
  const [teams, setTeams] = useState<{
    [teamId: string]: { points: number; driver1: string; driver2: string };
  }>({});
  const [seasonRules, setSeasonRules] = useState<SeasonRules | null>(null); // seasonRules state

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
        if (data?.includeDrivers !== undefined && data?.rules) {
          setIncludeDrivers(data.includeDrivers);
          setSeasonRules(data.rules); // seasonRules aus Schritt 3 speichern
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
          nextStep={(selectedDrivers, teams) =>
            nextStep({ selectedDrivers, teams })
          }
          previousStep={previousStep}
        />
      )}
      {step === 3 && (
        <CreateSeasonStep3
          nextStep={(
            includeDrivers: boolean,
            updatedTeams: {
              [teamId: string]: { driver1: string; driver2: string };
            },
            rules: SeasonRules
          ) => nextStep({ includeDrivers, updatedTeams, rules })} // rules übergeben
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
          seasonRules={seasonRules}
          previousStep={previousStep}
        />
      )}
    </>
  );
};

export default CreateSeason;
