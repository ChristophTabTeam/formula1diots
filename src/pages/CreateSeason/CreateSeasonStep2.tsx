import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Team } from "../../interfaces/Team";
import { Driver } from "../../interfaces/Driver";
import Loading from "../../components/Loading";

interface CreateSeasonStep2Props {
  seasonName: string;
  nextStep: (
    selectedDrivers: string[],
    teams: { [teamId: string]: { driver1: string; driver2: string } }
  ) => void;
  previousStep: () => void;
}

export function CreateSeasonStep2({
  seasonName,
  nextStep,
  previousStep,
}: CreateSeasonStep2Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState([] as string[]);
  //   const [manualAssignment, setManualAssignment] = useState(true);
  const [teams, setTeams] = useState([] as Team[]);
  const [assignedTeams, setAssignedTeams] = useState<{
    [teamId: string]: { driver1: string; driver2: string };
  }>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollection = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollection);
      setTeams(teamsSnapshot.docs.map((doc) => doc.data() as Team));
    };

    const fetchDrivers = async () => {
      const driversCollection = collection(db, "drivers");
      const driversSnapshot = await getDocs(driversCollection);
      const allDrivers = driversSnapshot.docs.map(
        (doc) => doc.data() as Driver
      );
      const filteredDrivers = new Array<Driver>();
      for (const driver of driversSnapshot.docs.map(
        (doc) => doc.data() as Driver
      )) {
        if (driver.isPlayer) {
          filteredDrivers.push(driver);
        }
      }
      setAllDrivers(allDrivers);
      setDrivers(filteredDrivers);
    };
    setLoading(true);
    fetchDrivers();
    fetchTeams();
    setLoading(false);
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

  const driverName = (driverId: string) => {
    const driver = allDrivers.find((driver) => driver.id === driverId);
    return driver?.name || driverId;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="create-season-wrapper">
      <h1 className="display-1">Spieler für Season "{seasonName}" wählen</h1>
      <ul className="create-season-list">
        {drivers.map((driver) => (
          <li key={driver.id} className="create-season-list-item">
            <label
              className={
                selectedDrivers.includes(driver.id)
                  ? "checked"
                  : ""
              }
            >
              <img
                src={driver.profilePictureUrl}
                alt={driver.name}
                className="create-season-profile-pic"
              />
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
      <button onClick={assignDriversToTeams} className="btn-primary">Spieler Teams zuweisen</button>

      {/* Zeige zugewiesene Teams an */}
      {Object.keys(assignedTeams).length > 0 && (
        <div className="create-season-wrapper">
          <h2>Zugewiesene Teams</h2>
          <ul className="create-season-teams-list">
            {teams.map((team) => (
              <li key={team.id}>
                <div className="table-wrapper">
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th colSpan={2}>
                          <strong>{team.name}</strong>:
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Driver 1:</td>
                        <td>
                          {driverName(assignedTeams[team.id]?.driver1) ||
                            "frei"}
                        </td>
                      </tr>
                      <tr>
                        <td>Driver 2:</td>
                        <td>
                          {driverName(assignedTeams[team.id]?.driver2) ||
                            "frei"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="btn-wrapper">
        <button onClick={previousStep} className="btn-primary">Zurück</button>
        <button onClick={handleSubmit} className="btn-primary">Weiter</button>
      </div>
    </div>
  );
}
