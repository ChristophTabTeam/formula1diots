import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Loading from "../components/Loading";

interface RaceResultsEntryProps {
  seasonId: string;
}

interface RaceFetchData {
  id: string;
  isFinished: boolean;
  order: number;
}

const RaceResultsEntry: React.FC<RaceResultsEntryProps> = ({ seasonId }) => {
  const [qualifyingResults, setQualifyingResults] = useState<{
    [key: string]: string;
  }>({});
  const [raceResults, setRaceResults] = useState<{ [key: string]: string }>({});
  const [fastestLap, setFastestLap] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [raceId, setRaceId] = useState<string>("");
  const [drivers, setDrivers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchSeasonData = async () => {
      try {
        const seasonDocRef = doc(db, "seasons", seasonId);
        const seasonDoc = await getDoc(seasonDocRef);
        if (seasonDoc.exists()) {
          const seasonData = seasonDoc.data();
          if (seasonData && seasonData.driverPoints) {
            const driverIds = Object.keys(seasonData.driverPoints);

            const driversCollection = collection(db, "drivers");
            const driversSnapshot = await getDocs(driversCollection);
            const driversData = driversSnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              ...doc.data(),
            }));

            const finalDriverOptions = driverIds.map((id) => {
              const driver = driversData.find((data) => data.id === id);
              return {
                id,
                name: driver ? driver.name : `${id}`,
              };
            });

            setDrivers(finalDriverOptions);
          }

          const racesCollectionRef = collection(
            db,
            "seasons",
            seasonId,
            "races"
          );
          const racesSnapshot = await getDocs(racesCollectionRef);
          const racesData = racesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as RaceFetchData[];

          const racesDataFiltered = racesData.filter(
            (race) => !race.isFinished
          );

          if (racesDataFiltered.length > 0) {
            const racesDataSorted = racesDataFiltered.sort(
              (a, b) => a.order - b.order
            );
            setRaceId(racesDataSorted[0].id);
          } else {
            console.warn("Keine offenen Rennen gefunden.");
          }
        } else {
          console.warn("Saison-Dokument nicht gefunden!");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Saison-Daten:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [seasonId]);

  const handleQualifyingChange = (
    position: string,
    driverId: string,
    lapTime: string
  ) => {
    setQualifyingResults((prevResults) => ({
      ...prevResults,
      [`P${position}`]: driverId,
      [`P${position}LapTime`]: lapTime,
    }));
  };

  const handleRaceChange = (position: string, driverId: string) => {
    setRaceResults((prevResults) => ({
      ...prevResults,
      [`P${position}`]: driverId,
    }));
  };

  const handleSaveResults = async () => {
    if (!raceId) {
      console.error("Kein gültiges Rennen gefunden, raceId ist leer.");
      alert("Es wurde kein Rennen gefunden, das bearbeitet werden kann.");
      return;
    }

    setIsSaving(true);
    try {
      const raceDocRef = doc(
        collection(db, "seasons", seasonId, "races"),
        raceId
      );
      await setDoc(
        raceDocRef,
        {
          qualifyingResults: {
            ...qualifyingResults,
          },
          raceResults: {
            ...raceResults,
            fastestLap,
          },
          isFinished: true,
        },
        { merge: true }
      );

      // Punkte berechnen und im Season-Dokument speichern
      const seasonDocRef = doc(db, "seasons", seasonId);
      const seasonDoc = await getDoc(seasonDocRef);
      if (seasonDoc.exists()) {
        const seasonData = seasonDoc.data();

        const driverPoints = { ...seasonData.driverPoints };
        const teamPoints = { ...seasonData.teams };

        // Punktevergabe für die Fahrer
        const pointsDistribution = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]; // Beispiel für Punktesystem
        for (let i = 1; i <= 10; i++) {
          const driverId = raceResults[`P${i}`];
          if (driverId) {
            driverPoints[driverId] =
              (driverPoints[driverId] || 0) + pointsDistribution[i - 1];

            // Team-Punkte ebenfalls aktualisieren
            const teamId = Object.keys(teamPoints).find(
              (team) =>
                teamPoints[team].driver1 === driverId ||
                teamPoints[team].driver2 === driverId
            );
            if (teamId) {
              teamPoints[teamId].points =
                (teamPoints[teamId].points || 0) + pointsDistribution[i - 1];
            }
          }
        }

        // Punkt für die schnellste Runde vergeben
        if (fastestLap) {
          driverPoints[fastestLap] = (driverPoints[fastestLap] || 0) + 1;

          const teamId = Object.keys(teamPoints).find(
            (team) =>
              teamPoints[team].driver1 === fastestLap ||
              teamPoints[team].driver2 === fastestLap
          );
          if (teamId) {
            teamPoints[teamId].points = (teamPoints[teamId].points || 0) + 1;
          }
        }

        // Season-Dokument aktualisieren
        await updateDoc(seasonDocRef, {
          driverPoints,
          teams: teamPoints,
        });
      }

      alert("Ergebnisse erfolgreich gespeichert!");
    } catch (error) {
      console.error("Fehler beim Speichern der Ergebnisse:", error);
      alert(
        "Fehler beim Speichern der Ergebnisse. Bitte versuchen Sie es erneut."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const usedQualifyingDrivers = Object.values(qualifyingResults).filter(
    (_, index) => index % 2 === 0
  ); // filter out lap times
  const usedRaceDrivers = Object.values(raceResults);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="display-2">Enter results for {raceId}</h1>
      <div className="home-wrapper" style={{ paddingBottom: 0, gap: 20 }}>
        <div className="">
          <h2 className="display-6">Qualifying Results</h2>
          <div className="table-wrapper">
            <div className="table-mask">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Pos.</th>
                    <th>Driver</th>
                    <th>Laptime</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(20)].map((_, index) => (
                    <tr key={`qualifying-${index + 1}`}>
                      <td>P{index + 1}:</td>
                      <td>
                        <label>
                          <select
                            onChange={(e) =>
                              handleQualifyingChange(
                                `${index + 1}`,
                                e.target.value,
                                qualifyingResults[`P${index + 1}LapTime`] || ""
                              )
                            }
                            value={qualifyingResults[`P${index + 1}`] || ""}
                            className="results-input select"
                          >
                            <option value="">select Driver</option>
                            {drivers.map((driver) => (
                              <option
                                key={driver.id}
                                value={driver.id}
                                disabled={usedQualifyingDrivers.includes(
                                  driver.id
                                )}
                              >
                                {driver.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          <input
                            type="text"
                            placeholder="Laptime"
                            value={
                              qualifyingResults[`P${index + 1}LapTime`] || ""
                            }
                            onChange={(e) =>
                              handleQualifyingChange(
                                `${index + 1}`,
                                qualifyingResults[`P${index + 1}`] || "",
                                e.target.value
                              )
                            }
                            className="results-input"
                          />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="">
          <h2 className="display-6">Race Results</h2>
          <div className="table-wrapper">
            <div className="table-mask">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Pos.</th>
                    <th>Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(20)].map((_, index) => (
                    <tr key={`race-${index + 1}`}>
                      <td>P{index + 1}:</td>
                      <td>
                        <label>
                          <select
                            onChange={(e) =>
                              handleRaceChange(`${index + 1}`, e.target.value)
                            }
                            value={raceResults[`P${index + 1}`] || ""}
                            className="results-input select"
                          >
                            <option value="">select Driver</option>
                            {drivers.map((driver) => (
                              <option
                                key={driver.id}
                                value={driver.id}
                                disabled={usedRaceDrivers.includes(driver.id)}
                              >
                                {driver.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div
            className="table-wrapper"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 className="display-6">Fastest Lap</h2>
            <label style={{ display: "flex", gap: 20, alignItems: "center" }}>
              Fastest Lap:
              <select
                value={fastestLap}
                onChange={(e) => setFastestLap(e.target.value)}
                className="results-input select"
              >
                <option value="">select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="btn-wrapper" style={{alignItems: "center", justifyContent: "center"}}>
          <button
            onClick={handleSaveResults}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? "Speichern..." : "Ergebnisse speichern"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceResultsEntry;
