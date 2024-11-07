import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Loading from "../components/Loading";
import { RaceResults, SeasonRace } from "../interfaces/SeasonRace";
import { logError } from "../utils/errorLogger";
import { useAuth } from "../context/authcontext/useAuth";

interface Driver {
  id: string;
  name: string;
  teamId: string;
  points: number;
}

interface Team {
  id: string;
  name: string;
  shortName: string;
  points: number;
}

const Home: React.FC = () => {
  const { user } = useAuth();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasonName, setSeasonName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRaceResults, setLastRaceResults] = useState<RaceResults>();
  const [lastRaceId, setLastRaceId] = useState<string>("");
  const [lastRace, setLastRace] = useState<boolean>(false);

  useEffect(() => {
    // Daten aus Firestore abrufen
    setLoading(true);
    const fetchSeasonData = async () => {
      try {
        // Abrufen der aktuellen Saison
        const seasonSnapshot = await getDocs(collection(db, "seasons"));
        if (seasonSnapshot.docs.length === 0) {
          window.location.href = "/create-season";
          return;
        }
        const seasonData = seasonSnapshot.docs[0].data(); // Annahme: Nur eine aktive Saison
        setSeasonName(seasonData.name);

        const lastRaceResultsData = collection(
          db,
          "seasons",
          seasonData.id,
          "races"
        );
        const lastRaceResultsSnapshot = await getDocs(lastRaceResultsData);
        const lastRaceResultsRef = lastRaceResultsSnapshot.docs.map(
          (doc) => doc.data() as SeasonRace
        );
        const lastRaceResultsFiltered = lastRaceResultsRef.filter(
          (i) => i.isFinished
        );
        if (lastRaceResultsFiltered.length === 0) {
          setLastRace(false);
        } else {
          setLastRace(true);
          const lastRaceResultsSorted = lastRaceResultsFiltered.sort(
            (a, b) => a.order - b.order
          );
          setLastRaceId(
            lastRaceResultsSorted[lastRaceResultsSorted.length - 1].raceId
          );
          setLastRaceResults(
            lastRaceResultsSorted[lastRaceResultsSorted.length - 1].raceResults
          );
        }

        // Abrufen der Fahrer-, Team- und Spieler-Daten
        const driversCollection = collection(db, "drivers");
        const teamsCollection = collection(db, "teams");

        const driversSnapshot = await getDocs(driversCollection);
        const teamsSnapshot = await getDocs(teamsCollection);

        const driversData = driversSnapshot.docs.map(
          (doc) => doc.data() as Driver
        );
        const teamsData = teamsSnapshot.docs.map((doc) => doc.data() as Team);

        // Fahrer-Punkte aus der aktuellen Saison abrufen
        const driverPoints = seasonData.driverPoints || {};

        // Spieler-Daten aus der aktuellen Saison abrufen
        const playerData = seasonData.playerData || {};

        // Filtere die Fahrer basierend auf den Fahrer-IDs in der Saison
        const filteredDriversData = driversData.filter((driver) =>
          Object.prototype.hasOwnProperty.call(driverPoints, driver.id)
        );

        // Aktualisieren der Fahrer-Punkte und Hinzufügen der Team-ID aus der Saison
        const updatedDriversData = filteredDriversData.map((driver) => ({
          ...driver,
          points: driverPoints[driver.id] || 0, // Setze den Punktestand auf 0, falls keine Daten vorhanden sind
          teamId: playerData[driver.id]?.teamId || driver.teamId || "Unbekannt", // Verwende die Team-ID aus playerData, falls vorhanden
        }));

        // Team-Punkte aktualisieren
        const updatedTeamsData = teamsData.map((team) => ({
          ...team,
          points: seasonData.teams?.[team.id]?.points || 0, // Setze den Punktestand auf 0, falls keine Daten vorhanden sind
        }));

        setDrivers(updatedDriversData);
        setTeams(updatedTeamsData);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        logError(error as Error, user?.email?.replace("@formulaidiots.de", "") || "unknown", { context: "fetchSeasonData" });
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [user?.email]);

  // Fahrer-Ranking sortieren (absteigend nach Punkten)
  const driverRankings = [...drivers].sort((a, b) => b.points - a.points);

  // Team-Ranking sortieren (absteigend nach Punkten)
  const teamRankings = [...teams].sort((a, b) => b.points - a.points);

  const getDriverNameById = (driverId: string) => {
    if (!driverId) return "NaN"; // Return "NaN" if driverId is not defined
    const driver = drivers.find((d) => d.id === driverId);
    return driver ? driver.name : "NaN";
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container">
        <div className="home-header">
          <div className="home-headline-wraper">
            <h1 className="display-4 f1-regular uppercase">Season {seasonName}</h1>
            <div className="btn-wrapper">
              {lastRaceId && (
                <a
                  className="btn-primary"
                  href={`/season/${seasonName}/race/${lastRaceId}`}
                >
                  ← Last Race
                </a>
              )}
              <a
                className="btn-primary"
                href={`/season/${seasonName}/results-entry`}
              >
                Next Race →
              </a>
            </div>
          </div>
        </div>
        <div className="home-wrapper">
          <div className="home-column">
            <h3 className="display-6">Driver Standings</h3>
            <div className="table-wrapper" style={{ height: 593 }}>
              <div className="table-mask">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Pos.</th>
                      <th>Driver</th>
                      <th>Team</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverRankings.map((driver, index) => (
                      <tr key={driver.id}>
                        <td>{index + 1}</td>
                        <td>{driver.name}</td>
                        <td>
                          {teams.find((team) => team.id === driver.teamId)
                            ?.shortName || "Unbekannt"}
                        </td>
                        <td>{driver.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="home-column">
            <h3 className="display-6">Team Standings</h3>
            <div className="table-wrapper" style={{ height: 593 }}>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Pos.</th>
                    <th>Team</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {teamRankings.map((team, index) => (
                    <tr key={team.id}>
                      <td>{index + 1}</td>
                      <td>{team.name}</td>
                      <td>{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {lastRace && lastRaceResults && (
        <div className="carousel-container">
          <div className="carousel">
            <div className="carousel-item grand-prix">
              {lastRaceId.replace("-", " ")} Grand Prix
            </div>
            {[...Array(20)].map((_, index) => {
              const positionKey = `P${index + 1}` as keyof RaceResults;
              const driverId = lastRaceResults[positionKey] || "";
              return (
                <div className="carousel-item" key={positionKey}>
                  <div className="driver-position">P{index + 1}</div>
                  <div className="carousel-driver-name">
                    {getDriverNameById(driverId)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
