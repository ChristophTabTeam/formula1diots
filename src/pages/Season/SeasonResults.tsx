import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Firebase-Konfiguration
import { Season } from "../../interfaces/Season";
import { Race } from "../../interfaces/Race";
import Loading from "../../components/Loading";
import { Driver } from "../../interfaces/Driver";

interface SeasonResultsProps {
  seasonId: string;
}

interface SeasonRace {
  raceId: string;
  isFinished: boolean;
  order: number;
  qualifyingResults: QualifyingResults;
  raceResults: RaceResults;
}

interface QualifyingResults {
  p1: string;
  p1LapTime: string;
  p2: string;
  p2LapTime: string;
  p3: string;
  p3LapTime: string;
  p4: string;
  p4LapTime: string;
  p5: string;
  p5LapTime: string;
  p6: string;
  p6LapTime: string;
  p7: string;
  p7LapTime: string;
  p8: string;
  p8LapTime: string;
  p9: string;
  p9LapTime: string;
  p10: string;
  p10LapTime: string;
  p11: string;
  p11LapTime: string;
  p12: string;
  p12LapTime: string;
  p13: string;
  p13LapTime: string;
  p14: string;
  p14LapTime: string;
  p15: string;
  p15LapTime: string;
  p16: string;
  p16LapTime: string;
  p17: string;
  p17LapTime: string;
  p18: string;
  p18LapTime: string;
  p19: string;
  p19LapTime: string;
  p20: string;
  p20LapTime: string;
}

interface RaceResults {
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
  p7: string;
  p8: string;
  p9: string;
  p10: string;
  p11: string;
  p12: string;
  p13: string;
  p14: string;
  p15: string;
  p16: string;
  p17: string;
  p18: string;
  p19: string;
  p20: string;
  fastestLap: string;
}

const SeasonResults: React.FC<SeasonResultsProps> = ({
  seasonId,
}: SeasonResultsProps) => {
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [seasonRaces, setSeasonRaces] = useState<SeasonRace[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [driverData, setDriverData] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const seasonDocRef = doc(db, "seasons", seasonId);
        const seasonDoc = await getDoc(seasonDocRef);
        if (seasonDoc.exists()) {
          setSeasonData(seasonDoc.data() as Season);

          // Fetch races collection within the season document
          const racesCollectionRef = collection(seasonDocRef, "races");
          const racesSnapshot = await getDocs(racesCollectionRef);
          const racesData = racesSnapshot.docs.map(
            (doc) => doc.data() as SeasonRace
          );
          setSeasonRaces(racesData.sort((a, b) => a.order - b.order));
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
        const racesCollectionRef = collection(db, "races");
        const racesSnapshot = await getDocs(racesCollectionRef);
        const racesData = racesSnapshot.docs.map((doc) => doc.data() as Race);
        if (racesData.length > 0) {
          setRaces(racesData);
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

    setLoading(true);
    fetchSeasonData();
    fetchRacesData();
    fetchDriverData();
    setLoading(false);
  }, [seasonId]);

  const getDriverNameById = (driverId: string) => {
    const driver = driverData.find((d) => d.id === driverId);
    return driver?.name || "NaN";
  };

  const getDriverPosition = (
    raceResults: RaceResults,
    driverId: string
  ): string => {
    for (const [position, id] of Object.entries(raceResults)) {
      if (position.toLowerCase() !== "fastestlap" && id === driverId) {
        return position.toUpperCase().replace("P", ""); // Gibt die Position als Zahl zurück
      }
    }
    return "--"; // Wenn die `driverId` nicht gefunden wird
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-large">
      <div className="table-wrapper">
        <div className="table-mark season-result-table-mask">
          {seasonData && (
            <table className="leaderboard-table season-results-table">
              <thead>
                <tr>
                  <th>Season {seasonData.name}</th>
                  {seasonRaces.map((race) => {
                    const raceData = races.find((r) => r.name === race.raceId);
                    return (
                      <th key={race.raceId}>
                        <a
                          className={
                            race.isFinished
                              ? "table-race-id is-finished"
                              : "table-race-id"
                          }
                          href={`/season/${seasonId}/race/${race.raceId}`}
                        >
                          <img
                            className="country-flag-small"
                            src={raceData?.pathToCountryFlag}
                          />
                          <p className="country-three-letter">
                            {raceData?.threeLetterCode || "NaN"}
                          </p>
                        </a>
                      </th>
                    );
                  })}
                  <th>TOT</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(seasonData.driverPoints)
                  .sort(([, pointsA], [, pointsB]) => pointsB - pointsA) // Sortiert nach Punkten in absteigender Reihenfolge
                  .map(([driverId]) => {
                    return (
                      <tr key={driverId}>
                        <td>
                          <p className="season-results-driver-name">
                            {getDriverNameById(driverId)}
                          </p>
                        </td>
                        {seasonRaces.map((race) => {
                          const isFastestLap =
                            race.raceResults.fastestLap === driverId;
                          return (
                            <td key={race.raceId}>
                              <div
                                className={
                                  isFastestLap
                                    ? "season-results-pos-wrapper fastest-lap"
                                    : "season-results-pos-wrapper"
                                }
                              >
                                {getDriverPosition(race.raceResults, driverId)}
                              </div>
                            </td>
                          );
                        })}
                        <td>
                          <div className="season-results-pos-wrapper">
                            {seasonData.driverPoints[driverId] || "--"}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonResults;
