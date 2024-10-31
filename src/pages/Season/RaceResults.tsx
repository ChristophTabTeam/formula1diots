import React, { useEffect, useState } from "react";
import { Race } from "../../interfaces/Race";
import { Season } from "../../interfaces/Season";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import type {
  QualifyingResults,
  RaceResults,
  SeasonRace,
} from "../../interfaces/SeasonRace";
import { Driver } from "../../interfaces/Driver";
import Loading from "../../components/Loading";

interface RaceResultsProps {
  raceId: string;
  seasonId: string;
}

const RaceResults: React.FC<RaceResultsProps> = ({ raceId, seasonId }) => {
  const [season, setSeason] = useState<Season>();
  const [seasonRace, setSeasonRace] = useState<SeasonRace>();
  const [race, setRace] = useState<Race>();
  const [driverData, setDriverData] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const seasonDocRef = doc(db, "seasons", seasonId);
        const seasonDoc = await getDoc(seasonDocRef);
        if (seasonDoc.exists()) {
          setSeason(seasonDoc.data() as Season);

          // Fetch races collection within the season document
          const racesCollectionRef = doc(seasonDocRef, "races", raceId);
          const racesSnapshot = await getDoc(racesCollectionRef);
          const racesData = racesSnapshot.data() as SeasonRace;
          setSeasonRace(racesData);
        } else {
          setError("Season not found");
        }
      } catch (error) {
        console.error("Error fetching season:", error);
        setError("Error fetching season data");
      } finally {
        setLoading(false);
      }
    };

    const fetchRacesData = async () => {
      try {
        const racesCollectionRef = doc(db, "races", raceId);
        const racesDoc = await getDoc(racesCollectionRef);
        if (racesDoc.exists()) {
          setRace(racesDoc.data() as Race);
        } else {
          setError("No Races found");
        }
      } catch (error) {
        console.error("Error fetching Races", error);
        setError("Error fetching");
        setLoading(false);
      }
    };

    const fetchDriverData = async () => {
      try {
        const driverCollectionRef = collection(db, "drivers");
        const driverSnapshot = await getDocs(driverCollectionRef);
        const driverData = driverSnapshot.docs.map(
          (doc) => doc.data() as Driver
        );
        if (driverData.length > 0) {
          setDriverData(driverData);
        } else {
          setError("No Drivers found");
        }
      } catch (error) {
        console.error("Error fetching Drivers", error);
        setError("Error fetching");
      }
    };

    const fetchTeamsData = async () => {
      try {
        const teamsCollectionRef = collection(db, "teams");
        const teamsSnapshot = await getDocs(teamsCollectionRef);
        const teamsData = teamsSnapshot.docs.map((doc) => doc.data() as Driver);
        if (teamsData.length > 0) {
          setTeams(teamsData);
        } else {
          setError("No Teams found");
        }
      } catch (error) {
        console.error("Error fetching Teams", error);
        setError("Error fetching");
      }
    };

    setLoading(true);
    fetchSeasonData();
    fetchRacesData();
    fetchDriverData();
    fetchTeamsData();
    setLoading(false);
  }, [raceId, seasonId]);

  const positions = [
    "P1",
    "P2",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7",
    "P8",
    "P9",
    "P10",
    "P11",
    "P12",
    "P13",
    "P14",
    "P15",
    "P16",
    "P17",
    "P18",
    "P19",
    "P20",
  ];

  const getDriverById = (driverId: string) => {
    const driver = driverData.find((driver) => driver.id === driverId);
    return driver;
  };

  const getTeamNameById = (teamId: string) => {
    const team = teams.find((team) => team.id === teamId);
    return team?.name || "NaN";
  };

  const calculatePoints = (position: string, fastestLapId: string): number => {
    // Punktesystem für die Top 10
    const pointsDistribution: { [key: string]: number } = {
      p1: 25,
      p2: 18,
      p3: 15,
      p4: 12,
      p5: 10,
      p6: 8,
      p7: 6,
      p8: 4,
      p9: 2,
      p10: 1,
    };

    // Punkte für die Position
    const basePoints = pointsDistribution[position.toLowerCase()] || 0;

    // 1 Extrapunkt für die schnellste Runde, falls in den Top 10
    const extraPoint =
      position.toLowerCase() in pointsDistribution &&
      seasonRace?.raceResults[position as keyof RaceResults] === fastestLapId
        ? 1
        : 0;

    return basePoints + extraPoint;
  };

  if (loading) return <Loading />;

  if (error) return <div>{error}</div>;

  return (
    <div className="race-results-wrapper">
      <h1 className="display-2">{race?.fullName}</h1>
      <h2 className="display-4">Race Results</h2>
      <div className="table-wrapper" style={{marginBottom: 40}}>
        <div className="table-mask">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Driver</th>
                <th>Team</th>
                <th>Punkte</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => {
                const driverId =
                  seasonRace?.raceResults[position as keyof RaceResults] || "";
                const isFastestLap =
                  driverId === seasonRace?.raceResults.fastestLap;

                return (
                  <tr
                    key={position}
                    className={isFastestLap ? "fastest-lap" : ""}
                  >
                    <td>{position.toUpperCase()}</td>
                    <td>{getDriverById(driverId)?.name}</td>
                    <td>
                      {(() => {
                        const driver = getDriverById(driverId);
                        if (driver && driver.isPlayer) {
                          return getTeamNameById(
                            season?.playerData[driver.id]?.teamId || ""
                          );
                        } else if (driver) {
                          return getTeamNameById(driver.teamId);
                        }
                        return null;
                      })()}
                    </td>
                    <td>
                      {calculatePoints(
                        position,
                        seasonRace?.raceResults.fastestLap || ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="display-4">Qualifying Results</h2>
      <div className="table-wrapper">
        <div className="table-mask">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Driver</th>
                <th>Team</th>
                <th>Lap Time</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position}>
                  <td>{position.toUpperCase()}</td>
                  <td>
                    {
                      getDriverById(
                        seasonRace?.qualifyingResults[
                          position as keyof QualifyingResults
                        ] || ""
                      )?.name
                    }
                  </td>
                  <td>
                    {(() => {
                      const driver = getDriverById(
                        seasonRace?.qualifyingResults[
                          position as keyof QualifyingResults
                        ] || ""
                      );
                      if (driver && driver.isPlayer) {
                        return getTeamNameById(
                          season?.playerData[driver.id]?.teamId || ""
                        );
                      } else if (driver) {
                        return getTeamNameById(driver.teamId);
                      }
                      return null;
                    })()}
                  </td>
                  <td>
                    {seasonRace?.qualifyingResults[
                      `${position}LapTime` as keyof QualifyingResults
                    ] || "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RaceResults;
