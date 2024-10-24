import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Driver } from '../../interfaces/Driver';

interface CreateSeasonStep3Props {
  selectedPlayers: string[];
//   manualAssignment: boolean;
  teams: { [teamId: string]: { driver1: string; driver2: string } };
  nextStep: (includeDrivers: boolean, updatedTeams: { [teamId: string]: { driver1: string; driver2: string } }) => void;
}

export function CreateSeasonStep3({ selectedPlayers, teams, nextStep }: CreateSeasonStep3Props) {
  const [includeDrivers, setIncludeDrivers] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [updatedTeams, setUpdatedTeams] = useState(teams);

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversCollection = collection(db, 'drivers');
      const driversSnapshot = await getDocs(driversCollection);
      setDrivers(driversSnapshot.docs.map(doc => doc.data() as Driver));
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (includeDrivers) {
      // Füge Fahrer hinzu, nur wenn die Slots noch frei sind
      const newTeams = { ...teams };
      drivers.forEach(driver => {
        if (!newTeams[driver.teamId]?.driver1) {
          newTeams[driver.teamId] = { ...newTeams[driver.teamId], driver1: driver.id };
        } else if (!newTeams[driver.teamId]?.driver2) {
          newTeams[driver.teamId] = { ...newTeams[driver.teamId], driver2: driver.id };
        }
      });
      setUpdatedTeams(newTeams);
    }
  }, [includeDrivers, drivers, teams]);

  const handleSubmit = () => {
    nextStep(includeDrivers, updatedTeams); // Übergebe `includeDrivers` und die aktualisierten Teams
  };

  return (
    <div>
      <h1>Sollen Fahrer aus der Fahrer-Collection berücksichtigt werden?</h1>
      <label>
        <input
          type="checkbox"
          checked={includeDrivers}
          onChange={(e) => setIncludeDrivers(e.target.checked)}
        />
        Ja, Fahrer berücksichtigen
      </label>
      <button onClick={handleSubmit}>Weiter</button>
    </div>
  );
}
