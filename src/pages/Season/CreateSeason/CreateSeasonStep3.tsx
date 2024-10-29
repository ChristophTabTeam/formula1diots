import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Driver } from "../../../interfaces/Driver";
import Loading from "../../../components/Loading";

interface CreateSeasonStep3Props {
  selectedDrivers: string[];
  //   manualAssignment: boolean;
  teams: { [teamId: string]: { driver1: string; driver2: string } };
  nextStep: (
    includeDrivers: boolean,
    updatedTeams: { [teamId: string]: { driver1: string; driver2: string } }
  ) => void;
  previousStep: () => void;
}

export function CreateSeasonStep3({
  teams,
  nextStep,
  previousStep,
}: CreateSeasonStep3Props) {
  const [includeDrivers, setIncludeDrivers] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [updatedTeams, setUpdatedTeams] = useState(teams);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversCollection = collection(db, "drivers");
      const driversSnapshot = await getDocs(driversCollection);
      setDrivers(driversSnapshot.docs.map((doc) => doc.data() as Driver));
    };
    
    setLoading(true);
    if (includeDrivers) {
      // Füge Fahrer hinzu, nur wenn die Slots noch frei sind
      const newTeams = { ...teams };
      drivers.forEach((driver) => {
        if (!newTeams[driver.teamId]?.driver1) {
          newTeams[driver.teamId] = {
            ...newTeams[driver.teamId],
            driver1: driver.id,
          };
        } else if (!newTeams[driver.teamId]?.driver2) {
          newTeams[driver.teamId] = {
            ...newTeams[driver.teamId],
            driver2: driver.id,
          };
        }
        setUpdatedTeams(newTeams);
      });
    }
    fetchDrivers();
    setLoading(false);
  }, [includeDrivers, drivers, teams]);

  const handleSubmit = () => {
    nextStep(includeDrivers, updatedTeams); // Übergebe `includeDrivers` und die aktualisierten Teams
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="create-season-wrapper">
      <h1 className="display-1">Add AI-Drivers?</h1>
      {includeDrivers}
      <div className="create-season-list-item">
        <label className={includeDrivers ? "checked" : ""}>
          <input
            type="checkbox"
            checked={includeDrivers}
            onChange={(e) => setIncludeDrivers(e.target.checked)}
          />
          Yes, add AI-Drivers
        </label>
      </div>
      <div className="btn-wrapper">

      <button onClick={previousStep} className="btn-primary">Back</button>
      <button onClick={handleSubmit} className="btn-primary">Next</button>
      </div>
    </div>
  );
}
