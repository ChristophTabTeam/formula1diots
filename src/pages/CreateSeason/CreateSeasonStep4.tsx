import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Race } from '../../interfaces/Race';

interface CreateSeasonStep4Props {
    teams: { [teamId: string]: { driver1: string; driver2: string } }; // Teams und Slots mit Spielern und ggf. Fahrern
    nextStep: (selectedRaces: string[]) => void; // Weitergeben der ausgewählten Rennen
  }
  
  export function CreateSeasonStep4({ teams, nextStep }: CreateSeasonStep4Props) {
    const [races, setRaces] = useState<Race[]>([]);
    const [selectedRaces, setSelectedRaces] = useState<string[]>([]);
  
    useEffect(() => {
      const fetchRaces = async () => {
        const racesCollection = collection(db, 'races');
        const racesSnapshot = await getDocs(racesCollection);
        setRaces(racesSnapshot.docs.map(doc => doc.data() as Race));
      };
      fetchRaces();
    }, []);
  
    const handleSubmit = () => {
      if (selectedRaces.length > 0) {
        nextStep(selectedRaces); // Übergibt die ausgewählten Rennen an den nächsten Schritt
      } else {
        alert('Bitte wählen Sie mindestens eine Rennstrecke aus.');
      }
    };

  return (
    <div>
      <h1>Wählen Sie die Rennstrecken für die Saison aus:</h1>
      <ul>
        {races.map((race) => (
          <li key={race.name.replace('Grand Prix', '').trim().replace(/\s+/g, '-')}>
            <label>
              <input
                type="checkbox"
                value={race.name.replace('Grand Prix', '').trim().replace(/\s+/g, '-')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRaces([...selectedRaces, race.name.replace('Grand Prix', '').trim().replace(/\s+/g, '-')]);
                  } else {
                    setSelectedRaces(selectedRaces.filter(id => id !== race.name.replace('Grand Prix', '').trim().replace(/\s+/g, '-')));
                  }
                }}
              />
              {race.name}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Weiter</button>
    </div>
  );
}
