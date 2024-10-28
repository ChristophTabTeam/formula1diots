import React, { useEffect, useState } from "react";
import f1Logo from "../assets/F1.svg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Loading from "../components/Loading";

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

// interface SeasonRace {
//   raceId: string;
//   isFinished: boolean;
//   order: number;
//   raceResults: RaceResults;
// }

// interface RaceResults {
//   p1: string;
//   p2: string;
//   p3: string;
//   p4: string;
//   p5: string;
//   p6: string;
//   p7: string;
//   p8: string;
//   p9: string;
//   p10: string;
//   p11: string;
//   p12: string;
//   p13: string;
//   p14: string;
//   p15: string;
//   p16: string;
//   p17: string;
//   p18: string;
//   p19: string;
//   p20: string;
// }

const Home: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasonName, setSeasonName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  // const [lastRaceResults, setLastRaceResults] = useState<RaceResults>();

  useEffect(() => {
    // Daten aus Firestore abrufen
    setLoading(true);
    const fetchSeasonData = async () => {
      try {
        // Abrufen der aktuellen Saison
        const seasonSnapshot = await getDocs(collection(db, "seasons"));
        const seasonData = seasonSnapshot.docs[0].data(); // Annahme: Nur eine aktive Saison
        setSeasonName(seasonData.name);

        // const lastRaceResultsData = collection(
        //   db,
        //   "seasons",
        //   seasonData.id,
        //   "races"
        // );
        // const lastRaceResultsSnapshot = await getDocs(lastRaceResultsData);
        // const lastRaceResultsRef = lastRaceResultsSnapshot.docs.map(
        //   (doc) => doc.data() as SeasonRace
        // );
        // const lastRaceResultsFiltered = lastRaceResultsRef.filter(
        //   (i) => i.isFinished
        // );
        // const lastRaceResultsSorted = lastRaceResultsFiltered.sort(
        //   (a, b) => a.order - b.order
        // );
        // setLastRaceResults(
        //   lastRaceResultsSorted[lastRaceResultsSorted.length - 1].raceResults
        // );

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
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, []);

  // Fahrer-Ranking sortieren (absteigend nach Punkten)
  const driverRankings = [...drivers].sort((a, b) => b.points - a.points);

  // Team-Ranking sortieren (absteigend nach Punkten)
  const teamRankings = [...teams].sort((a, b) => b.points - a.points);

  // const getDriverNameById = (driverId: string) => {
  //   if (!driverId) return "NaN"; // Return "NaN" if driverId is not defined
  //   const driver = drivers.find((d) => d.id === driverId);
  //   return driver ? driver.name : "NaN";
  // };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container">
        <div className="home-header">
          <div className="home-headline-wraper">
            <h1 className="display-1 home-head">
              <img src={f1Logo} className="f1-logo-home" alt="F1 Logo" />
              Formula 1diots
            </h1>
            <h2 className="display-4">Season {seasonName}</h2>
          </div>
        </div>
        <div className="home-wrapper">
          <div>
            <h3 className="display-6">Driver Standings</h3>
            <div className="table-wrapper">
              <div className="table-mask">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Pos.</th>
                      <th>Fahrer</th>
                      <th>Team</th>
                      <th>Punkte</th>
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
          <div>
            <h3 className="display-6">Team Standings</h3>
            <div className="table-wrapper">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Pos.</th>
                    <th>Team</th>
                    <th>Punkte</th>
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
      {/* {lastRaceResults && (
        <div className="carousel-container">
          <div className="carousel">
            <div className="carousel-container">
              <div className="carousel">
                {[...Array(20)].map((_, index) => {
                  const positionKey = `p${index + 1}`;
                  const driverId = lastRaceResults
                    ? lastRaceResults[positionKey]
                    : "";
                  return (
                    <div className="carousel-item" key={positionKey}>
                      <div className="driver-position">{index + 1}</div>
                      <div className="carousel-driver-name">
                        {getDriverNameById(driverId)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Home;
