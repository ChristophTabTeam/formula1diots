import React, { useEffect, useState } from "react";
import { Season } from "../../interfaces/Season";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Driver } from "../../interfaces/Driver";
import Loading from "../../components/Loading";
import { Qualifying } from "../../interfaces/Qualifying";

interface RivalryProps {
  seasonId: string;
}

interface DriverWithStats extends Driver {
  points: number;
  pointsRank: number;
  avgQualifyingPosition: number | null;
  qualifyingRank: number;
}

const Rivalry: React.FC<RivalryProps> = ({ seasonId }) => {
  const [season, setSeason] = useState<Season>();
  const [loading, setLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<DriverWithStats[]>([]);

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const seasonDoc = doc(db, "seasons", seasonId);
        const seasonSnap = await getDoc(seasonDoc);
        if (seasonSnap.exists()) {
          const seasonData = seasonSnap.data() as Season;
          setSeason(seasonData);

          const driverCollection = collection(db, "drivers");
          const driverSnapshot = await getDocs(driverCollection);
          const driverData = driverSnapshot.docs.map(
            (doc) => doc.data() as Driver
          );

          const players = driverData.filter((driver) => driver.isPlayer);

          // Berechnen der Punkte und der durchschnittlichen Qualifying-Position
          const driversWithStats = await Promise.all(
            players.map(async (driver) => {
              const points = seasonData.driverPoints[driver.id] || 0;

              // Abrufen der Qualifying-Ergebnisse für den Fahrer
              const qualifyingCollection = collection(
                db,
                "drivers",
                driver.id,
                "qualifyings"
              );
              const qualifyingSnapshot = await getDocs(qualifyingCollection);

              const qualifyingData = qualifyingSnapshot.docs
                .map((doc) => doc.data() as Qualifying)
                .filter((qualifying) => qualifying.seasonId === seasonId);

              // Berechnen der durchschnittlichen Qualifying-Position
              const avgQualifyingPosition =
                qualifyingData.length > 0
                  ? qualifyingData.reduce((sum, q) => sum + q.position, 0) /
                    qualifyingData.length
                  : null;

              return {
                ...driver,
                points,
                avgQualifyingPosition,
              };
            })
          );

          // Fahrer nach Punkten und Qualifying-Position sortieren und Ränge zuweisen
          const sortedByPoints = [...driversWithStats].sort(
            (a, b) => b.points - a.points
          );
          const sortedByQualifying = [...driversWithStats].sort(
            (a, b) =>
              (a.avgQualifyingPosition || Infinity) -
              (b.avgQualifyingPosition || Infinity)
          );

          // Punkte-Rang und Qualifying-Rang setzen
          const driversWithRanks = driversWithStats.map((driver) => ({
            ...driver,
            pointsRank: sortedByPoints.findIndex((d) => d.id === driver.id) + 1,
            qualifyingRank:
              sortedByQualifying.findIndex((d) => d.id === driver.id) + 1,
          }));

          setDrivers(driversWithRanks);
        }
      } catch (error) {
        console.error(
          "Fehler beim Abrufen der Saison- oder Fahrerdaten: ",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [seasonId]);

  if (loading) return <Loading />;

  return (
    <div className="container">
      <h1 className="display-4 f1-regular">Rivalry in Season {season?.name}</h1>
      <div className="rivalry-grid">
        <div className="rivalry-column">
          <h2 className="f1-regular">Season Points</h2>
          <ul className="rivalry-list">
            {drivers
              .sort((a, b) => a.pointsRank - b.pointsRank)
              .map((driver) => (
                <li key={driver.id}>
                  <p>{driver.pointsRank}</p>
                  <div>
                    <p>{driver.name}</p>
                    <p>{driver.points} Punkte</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="rivalry-column">
          <h2 className="f1-regular">Qualifying Performance</h2>
          <ul className="rivalry-list">
            {drivers
              .sort((a, b) => a.qualifyingRank - b.qualifyingRank)
              .map((driver) => (
                <li key={driver.id}>
                  <p>{driver.qualifyingRank}</p>
                  <div>
                    <p>{driver.name}</p>
                    <p>
                      Durchschnittliche Position:{" "}
                      {driver.avgQualifyingPosition !== null
                        ? driver.avgQualifyingPosition.toFixed(0)
                        : "Keine Daten"}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rivalry;
