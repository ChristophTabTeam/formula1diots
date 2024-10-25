import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Team } from "../../interfaces/Team";
import { Driver } from "../../interfaces/Driver";

interface CreateSeasonStep2Props {
  seasonName: string;
  nextStep: (
    selectedDrivers: string[],
    teams: { [teamId: string]: { driver1: string; driver2: string } }
  ) => void;
}

export function CreateSeasonStep2({
  seasonName,
  nextStep,
}: CreateSeasonStep2Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState([] as string[]);
  //   const [manualAssignment, setManualAssignment] = useState(true);
  const [teams, setTeams] = useState([] as Team[]);
  const [assignedTeams, setAssignedTeams] = useState<{
    [teamId: string]: { driver1: string; driver2: string };
  }>({});

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollection = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollection);
      setTeams(teamsSnapshot.docs.map((doc) => doc.data() as Team));
    };

    const fetchDrivers = async () => {
      const driversCollection = collection(db, "drivers");
      const driversSnapshot = await getDocs(driversCollection);
      const filteredDrivers = new Array<Driver>();
      for (const driver of driversSnapshot.docs.map(
        (doc) => doc.data() as Driver
      )) {
        if (driver.isPlayer) {
          filteredDrivers.push(driver);
        }
      }
      setDrivers(filteredDrivers);
    };

    fetchDrivers();
    fetchTeams();
  }, []);

  const assignDriversToTeams = () => {
    const updatedTeams = { ...assignedTeams }; // Kopiere die Teams in ein neues Objekt

    selectedDrivers.forEach((driverId) => {
      let teamAssigned = false;

      while (!teamAssigned) {
        const randomTeamIndex = Math.floor(Math.random() * teams.length);
        const selectedTeam = teams[randomTeamIndex];

        // Prüfe, ob der Teamplatz frei ist (driver1 oder driver2)
        if (!updatedTeams[selectedTeam.id]?.driver1) {
          updatedTeams[selectedTeam.id] = {
            ...updatedTeams[selectedTeam.id],
            driver1: driverId,
          };
          teamAssigned = true;
        } else if (!updatedTeams[selectedTeam.id]?.driver2) {
          updatedTeams[selectedTeam.id] = {
            ...updatedTeams[selectedTeam.id],
            driver2: driverId,
          };
          teamAssigned = true;
        }
      }
    });

    setAssignedTeams(updatedTeams); // Aktualisierte Teams setzen
  };

  const handleSubmit = () => {
    if (selectedDrivers.length > 0 && Object.keys(assignedTeams).length > 0) {
      nextStep(selectedDrivers, assignedTeams);
      console.log("Assigned Teams:", assignedTeams);
    } else {
      alert(
        "Bitte wählen Sie mindestens einen Spieler aus und weisen Sie die Spieler den Teams zu."
      );
    }
  };

  return (
    <div>
      <h1>Welche Spieler sollen an der Saison "{seasonName}" teilnehmen?</h1>
      <ul>
        {drivers.map((driver) => (
          <li key={driver.id}>
            <label>
              <input
                type="checkbox"
                value={driver.id}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDrivers([...selectedDrivers, driver.id]);
                  } else {
                    setSelectedDrivers(
                      selectedDrivers.filter((id) => id !== driver.id)
                    );
                  }
                }}
              />
              {!driver.name ? driver.id : driver.name}
            </label>
          </li>
        ))}
      </ul>
      {/* <div>
        <label>
          <input
            type="radio"
            checked={manualAssignment}
            onChange={() => setManualAssignment(true)}
          />
          Spieler manuell Teams/Slots zuordnen
        </label>
        <label>
          <input
            type="radio"
            checked={!manualAssignment}
            onChange={() => setManualAssignment(false)}
          />
          Zufällige Zuordnung
        </label>
      </div> */}
      <button onClick={assignDriversToTeams}>Spieler Teams zuweisen</button>

      {/* Zeige zugewiesene Teams an */}
      {Object.keys(assignedTeams).length > 0 && (
        <div>
          <h2>Zugewiesene Teams</h2>
          <ul>
            {teams.map((team) => (
              <li key={team.id}>
                <strong>{team.name}</strong>:
                <p>Driver 1: {assignedTeams[team.id]?.driver1 || "frei"}</p>
                <p>Driver 2: {assignedTeams[team.id]?.driver2 || "frei"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleSubmit}>Weiter</button>
    </div>
  );
}
