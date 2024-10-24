import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Season } from '../../interfaces/Season';

interface CreateSeasonStep5Props {
  seasonName: string;
  selectedPlayers: string[];
  selectedRaces: string[];
  teams: { [teamId: string]: { driver1: string; driver2: string } }; // Teams-Eigenschaft hinzufügen
  includeDrivers: boolean;
  onFinish: () => void;
}

export function CreateSeasonStep5({
  seasonName,
  selectedPlayers,
  selectedRaces,
  teams,
  includeDrivers,
  onFinish,
}: CreateSeasonStep5Props) {
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateSeason = async () => {
    setIsSaving(true);
    try {
      // Saison-Dokument basierend auf dem Season-Interface erstellen
      const season: Season = {
        id: seasonName,
        name: seasonName,
        races: selectedRaces.map((raceId, index) => ({
          raceId,
          order: index + 1,
          isFinished: false,
        })),
        teams,
        driverPoints: selectedPlayers.reduce((acc, playerId) => {
          acc[playerId] = 0; // Jeder Fahrer startet mit 0 Punkten
          return acc;
        }, {} as Season['driverPoints']),
        isActiveSeason: true,
      };

      // Dokument in Firestore speichern
      const seasonDocRef = doc(db, 'seasons', seasonName);
      await setDoc(seasonDocRef, season);
      alert('Saison erfolgreich erstellt!');
      onFinish(); // Weiterleitung oder Abschluss nach Erstellung der Saison
    } catch (error) {
      console.error('Fehler beim Erstellen der Saison:', error);
      alert('Fehler beim Erstellen der Saison. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>Saison erstellen: {seasonName}</h1>
      <button onClick={handleCreateSeason} disabled={isSaving}>
        {isSaving ? 'Speichern...' : 'Saison erstellen'}
      </button>
    </div>
  );
}
