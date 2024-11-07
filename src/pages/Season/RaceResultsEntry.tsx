import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Loading from "../../components/Loading";
import { DriverPoints } from "../../interfaces/DriverPoints";
import { useAuth } from "../../context/authcontext";
import { logError } from "../../utils/errorLogger";

interface RaceResultsEntryProps {
  seasonId: string;
}

interface RaceFetchData {
  id: string;
  isFinished: boolean;
  order: number;
  qualifyingResults: { [key: string]: string };
}

const RaceResultsEntry: React.FC<RaceResultsEntryProps> = ({ seasonId }) => {
  const { user } = useAuth();

  const [qualifyingResults, setQualifyingResults] = useState<{
    [key: string]: string;
  }>({});
  const [raceResults, setRaceResults] = useState<{ [key: string]: string }>({});
  const [fastestLap, setFastestLap] = useState<string>("");
  const [fastestLapTime, setFastestLapTime] = useState<string>("");
  const [fastestLapTyre, setFastestLapTyre] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [raceId, setRaceId] = useState<string>("");
  const [drivers, setDrivers] = useState<{ id: string; name: string }[]>([]);
  const [dnfStatus, setDnfStatus] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
            const selectedRace = racesDataSorted[0];
            setRaceId(selectedRace.id);

            // Wenn Qualifying-Ergebnisse bereits gespeichert sind, diese in den State laden
            if (selectedRace.qualifyingResults) {
              setQualifyingResults(selectedRace.qualifyingResults);
            }
          } else {
            console.warn("Keine offenen Rennen gefunden.");
          }
        } else {
          console.warn("Saison-Dokument nicht gefunden!");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Saison-Daten:", error);
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "RaceResultsEntry", error: "Error fetching season data" }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [seasonId, user?.email]);

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
    setRaceResults((prevResults) => {
      const updatedResults = {
        ...prevResults,
        [position]: driverId, // Sicherstellen, dass `position` den korrekten Schlüssel darstellt
      };
      return updatedResults;
    });
  };

  const handleDnfChange = (driverId: string, isDnf: boolean) => {
    setDnfStatus((prevStatus) => ({
      ...prevStatus,
      [driverId]: isDnf,
    }));
  };

  const handleSaveQualifyingResults = async () => {
    if (!raceId) {
      console.error("Kein gültiges Rennen gefunden, raceId ist leer.");
      logError(
        new Error("No valid Race found, raceId is empty."),
        user?.email?.replace("@formulaidiots.de", "") || "unknown",
        {
          context: "RaceResultsEntry",
          error: "No valid Race found, raceId is empty.",
        }
      );
      setError("Es wurde kein Rennen gefunden, das bearbeitet werden kann.");
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
          hasQualifyingSaved: true,
          qualifyingDate: new Date(),
        },
        { merge: true }
      );

      setSuccess("Qualifying-Ergebnisse erfolgreich gespeichert!");
    } catch (error) {
      console.error("Fehler beim Speichern der Qualifying-Ergebnisse:", error);
      logError(
        error as Error,
        user?.email?.replace("@formulaidiots.de", "") || "unknown",
        {
          context: "RaceResultsEntry",
          error: "Error saving Qualifying Results",
        }
      );
      setError(
        "Fehler beim Speichern der Qualifying-Ergebnisse. Bitte versuchen Sie es erneut."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveResults = async () => {
    if (!raceId) {
      console.error("Kein gültiges Rennen gefunden, raceId ist leer.");
      logError(
        new Error("No valid Race found, raceId is empty."),
        user?.email?.replace("@formulaidiots.de", "") || "unknown",
        {
          context: "RaceResultsEntry",
          error: "No valid Race found, raceId is empty.",
        }
      );
      setError("Es wurde kein Rennen gefunden, das bearbeitet werden kann.");
      return;
    }

    setIsSaving(true);
    try {
      const currentDate = new Date();
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
          raceDate: currentDate,
          dnfs: dnfStatus,
          setBy: user?.email?.replace("@formulaidiots.de", "") || "unknown",
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
            const points = pointsDistribution[i - 1];
            driverPoints[driverId] = (driverPoints[driverId] || 0) + points;

            // Team-Punkte ebenfalls aktualisieren
            const teamId = Object.keys(teamPoints).find(
              (team) =>
                teamPoints[team].driver1 === driverId ||
                teamPoints[team].driver2 === driverId
            );
            if (teamId) {
              teamPoints[teamId].points =
                (teamPoints[teamId].points || 0) + points;
            }

            // All-time Punkte für den Fahrer aktualisieren
            const allTimePointsRef = doc(
              collection(db, "drivers", driverId, "points")
            );
            await setDoc(
              allTimePointsRef,
              {
                raceId,
                points,
                seasonId,
                date: currentDate,
              },
              { merge: true }
            );
          }
        }

        // Qualifying-Position für den Fahrer aktualisieren
        for (let i = 1; i <= 20; i++) {
          const qualyDriverId = qualifyingResults[`P${i}`];
          if (qualyDriverId) {
            const qualifyingPositionRef = doc(
              collection(db, "drivers", qualyDriverId, "qualifyings")
            );
            await setDoc(
              qualifyingPositionRef,
              {
                raceId,
                position: i,
                lapTime: qualifyingResults[`P${i}LapTime`] || "",
                seasonId,
                date: currentDate,
              },
              { merge: true }
            );
          }
          const raceDriverId = raceResults[`P${i}`];
          if (raceDriverId) {
            const trophyDocRef = doc(
              collection(db, "drivers", raceDriverId, "trophies")
            );
            await setDoc(trophyDocRef, {
              raceId,
              place: i,
              date: currentDate,
              seasonId,
            });
          }
        }

        // Punkt für die schnellste Runde vergeben
        if (fastestLap) {
          const fastestLapPoints = 1;

          // Überprüfen, ob der Fahrer innerhalb der Top 10 ist
          const fastestLapPosition =
            Object.values(raceResults).indexOf(fastestLap) + 1;
          if (fastestLapPosition > 0 && fastestLapPosition <= 10) {
            // Fahrer-Punkte aktualisieren
            driverPoints[fastestLap] =
              (driverPoints[fastestLap] || 0) + fastestLapPoints;

            // Team-ID herausfinden
            const teamId = Object.keys(teamPoints).find(
              (team) =>
                teamPoints[team].driver1 === fastestLap ||
                teamPoints[team].driver2 === fastestLap
            );

            // Team-Punkte aktualisieren
            if (teamId) {
              teamPoints[teamId].points =
                (teamPoints[teamId].points || 0) + fastestLapPoints;
            }

            // Firestore aktualisieren - All-Time Punkte für die schnellste Runde im `points` Collection des Fahrers
            const pointsCollection = collection(
              db,
              "drivers",
              fastestLap,
              "points"
            );
            const pointsSnapshot = await getDocs(pointsCollection);
            const pointsData = pointsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as (DriverPoints & { id: string })[];

            // Bestehendes Dokument für die `raceId` suchen
            const pointsDoc = pointsData.find((doc) => doc.raceId === raceId);

            if (pointsDoc) {
              // Dokument mit bestehender `raceId` aktualisieren
              const pointsRef = doc(
                db,
                "drivers",
                fastestLap,
                "points",
                pointsDoc.id
              );
              await updateDoc(pointsRef, {
                points: pointsDoc.points + fastestLapPoints,
                date: currentDate,
              });
            } else {
              // Neues Dokument hinzufügen, falls kein Dokument mit der `raceId` gefunden wurde
              await addDoc(pointsCollection, {
                raceId,
                points: fastestLapPoints,
                seasonId,
                date: currentDate,
              });
            }

            // Eintrag in die `fastestLaps`-Collection des Fahrers erstellen
            const fastestLapCollection = collection(
              db,
              "drivers",
              fastestLap,
              "fastestLaps"
            );
            await addDoc(fastestLapCollection, {
              raceId,
              laptime: fastestLapTime,
              tyre: fastestLapTyre,
              date: currentDate,
              place: fastestLapPosition,
              seasonId,
            });
          }
        }

        for (const [driverId] of Object.entries(raceResults)) {
          if (dnfStatus[driverId]) {
            // Prüfen, ob der Fahrer ein DNF hat
            const dnfCollectionRef = collection(db, "drivers", driverId, "dnf");
            await addDoc(dnfCollectionRef, {
              raceId,
              seasonId,
              date: currentDate,
              dnf: true,
            });
          }
        }

        // Season-Dokument aktualisieren
        await updateDoc(seasonDocRef, {
          driverPoints,
          teams: teamPoints,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Ergebnisse:", error);
      logError(
        error as Error,
        user?.email?.replace("@formulaidiots.de", "") || "unknown",
        {
          context: "RaceResultsEntry",
          error: "Error saving Results",
        }
      );
      setError(
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
                            {drivers
                              .slice()
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((driver) => (
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
                    <th>DNF</th>
                    <th>Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(20)].map((_, index) => {
                    const position = `P${index + 1}`; // Position als Schlüssel für die `raceResults` und `dnfStatus` verwenden
                    const driverId = raceResults[position]; // Fahrer-ID für die jeweilige Position

                    return (
                      <tr key={`race-${position}`}>
                        <td>{position}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                handleDnfChange(position, e.target.checked)
                              }
                              checked={!!dnfStatus[position]}
                            />
                            <span className="switch-span"></span>
                          </label>
                        </td>
                        <td>
                          <label>
                            <select
                              onChange={(e) =>
                                handleRaceChange(position, e.target.value)
                              }
                              value={driverId || ""}
                              className="results-input select"
                            >
                              <option value="">select Driver</option>
                              {drivers
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((driver) => (
                                  <option
                                    key={driver.id}
                                    value={driver.id}
                                    disabled={usedRaceDrivers.includes(
                                      driver.id
                                    )}
                                  >
                                    {driver.name}
                                  </option>
                                ))}
                            </select>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          className="table-wrapper"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            justifyContent: "space-between",
            gridColumn: "span 2",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}
          >
            <h2 className="display-6">Fastest Lap</h2>
            <label style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <select
                value={fastestLap}
                onChange={(e) => setFastestLap(e.target.value)}
                className="results-input select"
              >
                <option value="">select Driver</option>
                {drivers
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
              </select>
            </label>
            <input
              className="results-input"
              type="text"
              placeholder="Laptime"
              value={fastestLapTime}
              onChange={(e) => setFastestLapTime(e.target.value)}
              style={{
                height: "min-content",
              }}
            ></input>
            <label style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <select
                value={fastestLapTyre}
                onChange={(e) => setFastestLapTyre(e.target.value)}
                className="results-input select"
              >
                <option value="">select Tyre</option>
                <option value="Soft">Soft</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Int">Intermediate</option>
                <option value="Wet">Wet</option>
              </select>
            </label>
          </div>
          <div
            className="btn-wrapper"
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <button
              onClick={handleSaveQualifyingResults}
              disabled={isSaving}
              className="custom-file-upload btn-primary"
            >
              {isSaving ? "Saving..." : "Save Qualifying Results"}
            </button>
            <button
              onClick={handleSaveResults}
              disabled={isSaving}
              className="custom-file-upload btn-primary delete"
            >
              {isSaving ? "Saving..." : "Save Results"}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default RaceResultsEntry;
