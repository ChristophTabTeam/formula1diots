import { useEffect, useState } from 'react';
import { doc, setDoc, collection, writeBatch, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { Season } from '../../../interfaces/Season';
import { Driver } from '../../../interfaces/Driver';
import { SeasonRules } from '../../../interfaces/SeasonRules';
import Loading from '../../../components/Loading';
import { useAuth } from '../../../context/authcontext';
import { defaultSeasonRules } from './SeasonRulesDefault';

interface CreateSeasonStep5Props {
  seasonName: string;
  selectedDrivers: string[];
  selectedRaces: string[];
  teams: { [teamId: string]: { points: number; driver1: string | null; driver2: string | null } };
  includeDrivers: boolean;
  seasonRules: SeasonRules | null;
  onFinish: () => void;
  previousStep: () => void;
}

export function CreateSeasonStep5({
  seasonName,
  selectedDrivers,
  selectedRaces,
  teams,
  seasonRules,
  onFinish,
  previousStep,
}: CreateSeasonStep5Props) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [, setDrivers] = useState<Driver[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversCollection = collection(db, 'drivers');
      const driversSnapshot = await getDocs(driversCollection);
      setDrivers(driversSnapshot.docs.map(doc => doc.data() as Driver));
    };
    const fetchSeason = async () => {
      const seasonsCollection = collection(db, 'seasons');
      const seasonsSnapshot = await getDocs(seasonsCollection);
      setSeasons(seasonsSnapshot.docs.map(doc => doc.data() as Season));
    };
    setLoading(true);
    fetchDrivers();
    fetchSeason();
    setLoading(false);
  }, []);

  const handleCreateSeason = async () => {
    setIsSaving(true);
    try {
      const driverPoints: { [driverId: string]: number } = {};
      const playerData: { [playerId: string]: { teamId: string; slot: string } } = {};
      const updatedTeams = { ...teams };

      Object.keys(updatedTeams).forEach((teamId) => {
        if (!teamId || teamId === 'undefined') {
          console.error('Ungültige Team-ID gefunden:', teamId);
          return;
        }
      
        updatedTeams[teamId] = {
          ...updatedTeams[teamId],
          points: 0,
          driver1: updatedTeams[teamId].driver1,
          driver2: updatedTeams[teamId].driver2,
        };
        if (updatedTeams[teamId].driver1) {
          driverPoints[updatedTeams[teamId].driver1] = 0;
        }
        if (updatedTeams[teamId].driver2) {
          driverPoints[updatedTeams[teamId].driver2] = 0;
        }
        if (updatedTeams[teamId].driver1 && selectedDrivers.includes(updatedTeams[teamId].driver1)) {
          playerData[updatedTeams[teamId].driver1] = { teamId, slot: 'driver1' };
        }
        if (updatedTeams[teamId].driver2 && selectedDrivers.includes(updatedTeams[teamId].driver2)) {
          playerData[updatedTeams[teamId].driver2] = { teamId, slot: 'driver2' };
        }
      });
  
      const isActiveSeason = !seasons.some((season) => season.isActiveSeason);
      const season: Season = {
        id: seasonName,
        name: seasonName,
        teams: updatedTeams,
        driverPoints,
        isActiveSeason: isActiveSeason,
        playerData,
        addedAt: new Date(),
        addedBy: user?.email?.replace('@formula1diots.de', '') || 'Unbekannt',
      };
  
      const seasonDocRef = doc(db, 'seasons', seasonName);
      await setDoc(seasonDocRef, season);
  
      if (!seasonRules) {
        console.warn("seasonRules sind null in Step 5, Standardwerte werden verwendet");
        seasonRules = defaultSeasonRules; // Temporärer Fallback
      }
      // Hinzufügen der Rules in eine Collection innerhalb des Season Dokuments
      const rulesDocRef = doc(collection(seasonDocRef, 'rules'), 'seasonRules');
      seasonRules.seasonId = seasonName;
      await setDoc(rulesDocRef, seasonRules);

      // Rennen in separate Collection innerhalb der Season speichern
      const batch = writeBatch(db);
      selectedRaces.forEach((raceId, index) => {
        const raceDocRef = doc(collection(seasonDocRef, 'races'), raceId);
        batch.set(raceDocRef, {
          raceId,
          order: index + 1,
          isFinished: false,
          qualifyingResults: {
            P1: null, P1LapTime: null,
            P2: null, P2LapTime: null,
            P3: null, P3LapTime: null,
            P4: null, P4LapTime: null,
            P5: null, P5LapTime: null,
            P6: null, P6LapTime: null,
            P7: null, P7LapTime: null,
            P8: null, P8LapTime: null,
            P9: null, P9LapTime: null,
            P10: null, P10LapTime: null,
            P11: null, P11LapTime: null,
            P12: null, P12LapTime: null,
            P13: null, P13LapTime: null,
            P14: null, P14LapTime: null,
            P15: null, P15LapTime: null,
            P16: null, P16LapTime: null,
            P17: null, P17LapTime: null,
            P18: null, P18LapTime: null,
            P19: null, P19LapTime: null,
            P20: null, P20LapTime: null,
          },
          raceResults: {
            P1: null,
            P2: null,
            P3: null,
            P4: null,
            P5: null,
            P6: null,
            P7: null,
            P8: null,
            P9: null,
            P10: null,
            P11: null,
            P12: null,
            P13: null,
            P14: null,
            P15: null,
            P16: null,
            P17: null,
            P18: null,
            P19: null,
            P20: null,
            fastestLap: null, // Fahrer mit der schnellsten Runde
          },
          updatedAt: new Date(),
          updatedBy: user?.email?.replace('@formula1diots.de', '') || 'Unbekannt',
        });
      });
      await batch.commit();
      window.location.href = '/';
      onFinish(); 
    } catch (error) {
      console.error('Fehler beim Erstellen der Saison:', error);
      alert('Fehler beim Erstellen der Saison. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='create-season-wrapper'>
      <h1 className='display-1'>Create Season {seasonName}</h1>
      <button onClick={handleCreateSeason} disabled={isSaving} className='btn-primary'>
        {isSaving ? 'Speichern...' : 'Season erstellen'}
      </button>
      <button onClick={previousStep} className='btn-primary'>Back</button>
    </div>
  );
}

export default CreateSeasonStep5;
