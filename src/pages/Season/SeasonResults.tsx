import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Firebase-Konfiguration
import { Season } from "../../interfaces/Season";
import { Race } from "../../interfaces/Race";
import Loading from "../../components/Loading";
import { Driver } from "../../interfaces/Driver";
import { RaceResults, SeasonRace } from "../../interfaces/SeasonRace";
import { useAuth } from "../../context/authcontext";
import { logError } from "../../utils/errorLogger";

interface SeasonResultsProps {
  seasonId: string;
}

const SeasonResults: React.FC<SeasonResultsProps> = ({
  seasonId,
}: SeasonResultsProps) => {
  const { user } = useAuth();

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
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "SeasonResults", error: "Error fetching season data" }
        );
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
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "SeasonResults", error: "Error fetching Races" }
        );
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
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "SeasonResults", error: "Error fetching Drivers" }
        );
        setError("Error fetching");
      }
    };

    setLoading(true);
    fetchSeasonData();
    fetchRacesData();
    fetchDriverData();
    setLoading(false);
  }, [seasonId, user?.email]);

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
        <div className="table-mask season-result-table-mask">
          {seasonData && (
            <table className="leaderboard-table season-results-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  {seasonRaces.map((race) => {
                    const raceData = races.find((r) => r.name === race.raceId);
                    return (
                      <th key={race.raceId}>
                        <a
                          className={`table-race-id ${
                            race.isFinished || race.hasQualifyingSaved
                              ? "is-finished"
                              : ""
                          }`}
                          href={
                            race.isFinished || race.hasQualifyingSaved
                              ? `/season/${seasonId}/race/${race.raceId}`
                              : undefined
                          }
                          onClick={(e) => {
                            if (!race.isFinished && !race.hasQualifyingSaved) {
                              e.preventDefault(); // Verhindert das Klicken, wenn das Rennen nicht beendet ist und keine Qualifikation gespeichert ist
                            }
                          }}
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
