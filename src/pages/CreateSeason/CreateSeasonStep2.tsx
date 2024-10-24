import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Player } from '../../interfaces/Player';
import { Team } from '../../interfaces/Team';

interface CreateSeasonStep2Props {
  seasonName: string;
  nextStep: (selectedPlayers: string[], teams: { [teamId: string]: { driver1: string, driver2: string } }) => void;
}

export function CreateSeasonStep2({ seasonName, nextStep }: CreateSeasonStep2Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState([] as string[]);
//   const [manualAssignment, setManualAssignment] = useState(true);
  const [teams, setTeams] = useState([] as Team[]);
  const [assignedTeams, setAssignedTeams] = useState<{ [teamId: string]: { driver1: string, driver2: string } }>({});

  useEffect(() => {
    const fetchPlayers = async () => {
      const playersCollection = collection(db, 'players');
      const playersSnapshot = await getDocs(playersCollection);
      setPlayers(playersSnapshot.docs.map(doc => doc.data() as Player));
    };

    const fetchTeams = async () => {
      const teamsCollection = collection(db, 'teams');
      const teamsSnapshot = await getDocs(teamsCollection);
      setTeams(teamsSnapshot.docs.map(doc => doc.data() as Team));
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  const assignPlayersToTeams = () => {
    const updatedTeams = { ...assignedTeams };  // Kopiere die Teams in ein neues Objekt

    selectedPlayers.forEach((playerId) => {
      let teamAssigned = false;

      while (!teamAssigned) {
        const randomTeamIndex = Math.floor(Math.random() * teams.length);
        const selectedTeam = teams[randomTeamIndex];

        // Prüfe, ob der Teamplatz frei ist (driver1 oder driver2)
        if (!updatedTeams[selectedTeam.id]?.driver1) {
          updatedTeams[selectedTeam.id] = { ...updatedTeams[selectedTeam.id], driver1: playerId };
          teamAssigned = true;
        } else if (!updatedTeams[selectedTeam.id]?.driver2) {
          updatedTeams[selectedTeam.id] = { ...updatedTeams[selectedTeam.id], driver2: playerId };
          teamAssigned = true;
        }
      }
    });

    setAssignedTeams(updatedTeams);  // Aktualisierte Teams setzen
  };

  const handleSubmit = () => {
    if (selectedPlayers.length > 0) {
      nextStep(selectedPlayers, assignedTeams);  // Übertrage Teams mit Zuordnungen
    } else {
      alert('Bitte wählen Sie mindestens einen Spieler aus.');
    }
  };

  return (
    <div>
      <h1>Welche Spieler sollen an der Saison "{seasonName}" teilnehmen?</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <label>
              <input
                type="checkbox"
                value={player.id}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPlayers([...selectedPlayers, player.id]);
                  } else {
                    setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
                  }
                }}
              />
              {!player.firstName && !player.lastName ? player.id : `${player.firstName} ${player.lastName}`}
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
      <button onClick={assignPlayersToTeams}>Spieler Teams zuweisen</button>

      {/* Zeige zugewiesene Teams an */}
      {Object.keys(assignedTeams).length > 0 && (
        <div>
          <h2>Zugewiesene Teams</h2>
          <ul>
            {teams.map((team) => (
              <li key={team.id}>
                <strong>{team.name}</strong>: 
                <p>Driver 1: {assignedTeams[team.id]?.driver1 || 'frei'}</p>
                <p>Driver 2: {assignedTeams[team.id]?.driver2 || 'frei'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleSubmit}>Weiter</button>
    </div>
  );
}
