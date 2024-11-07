import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Driver } from "../../interfaces/Driver";
import type { FastestLap } from "../../interfaces/FastestLap";
import Loading from "../../components/Loading";
import { logError } from "../../utils/errorLogger";
import { useAuth } from "../../context/authcontext/useAuth";

interface DriverFastestLaps {
  driverId: string;
  driverName: string;
  driverTeam: string;
  fastestLaps: FastestLap[];
}

interface FastestLapPageProps {
  seasonId: string;
}

const FastestLap: React.FC<FastestLapPageProps> = ({ seasonId }) => {
  const { user } = useAuth();

  const [fastestLapData, setFastestLapData] = useState<DriverFastestLaps[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFastestLaps = async () => {
      try {
        const driversSnapshot = await getDocs(collection(db, "drivers"));
        const driversData: DriverFastestLaps[] = [];

        for (const driverDoc of driversSnapshot.docs) {
          const driverId = driverDoc.id;
          const driverData = driverDoc.data();
          const fastestLapsRef = collection(
            db,
            "drivers",
            driverId,
            "fastestLaps"
          );
          const fastestLapsQuery = query(
            fastestLapsRef,
            where("seasonId", "==", seasonId)
          );
          const fastestLapsSnapshot = await getDocs(fastestLapsQuery);

          const fastestLaps = fastestLapsSnapshot.docs
            .map((doc) => doc.data() as FastestLap)
            .filter((lap) => lap.place <= 10); // Nur Top-10-Platzierungen

          if (fastestLaps.length > 0) {
            driversData.push({
              driverId,
              driverName: driverData.name,
              driverTeam: driverData.team,
              fastestLaps,
            });
          }
        }

        setFastestLapData(driversData);
      } catch (error) {
        console.error("Error fetching fastest laps:", error);
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "FastestLap", error: "Error fetching fastest laps" }
        );
      }
    };

    const fetchDrivers = async () => {
      try {
        const driversSnapshot = await getDocs(collection(db, "drivers"));
        const driversData = driversSnapshot.docs.map(
          (doc) => doc.data() as Driver
        );
        setDrivers(driversData);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "FastestLap", error: "Error fetching drivers" }
        );
      }
    };

    setLoading(true);
    fetchFastestLaps();
    fetchDrivers();
    setLoading(false);
  }, [seasonId, user?.email]);

  const getDriverById = (driverId: string) => {
    return drivers.find((driver) => driver.id === driverId);
  };

  const formatDate = (date: any): string => {
    // Überprüfe, ob es sich bereits um ein Date-Objekt handelt
    const validDate =
      date instanceof Date ? date : date.toDate ? date.toDate() : null;

    if (!validDate) return "Ungültiges Datum";

    return validDate.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="fastest-lap-page">
      <h1>Fastest Lap Standings - {seasonId}</h1>
      <div className="fastest-lap-grid">
        {fastestLapData.map((driverData, index) => (
          <div
            key={driverData.driverId}
            className={`fastest-lap-card position-${index + 1}`}
          >
            <h2>{index + 1}st</h2>
            <img
              src={getDriverById(driverData.driverId)?.profilePictureUrl}
              alt={driverData.driverName}
              className="driver-image"
            />
            <h3>{driverData.driverName}</h3>
            <p>{driverData.driverTeam}</p>
            <div className="points">
              <strong>{driverData.fastestLaps.length}x</strong> Championship
              Points
            </div>
            <div className="fastest-lap-details">
              {driverData.fastestLaps.map((lap, lapIndex) => (
                <div key={lapIndex} className="lap-info">
                  <p>Race: {lap.raceId}</p>
                  <p>Time: {lap.laptime}</p>
                  <p>Tyre: {lap.tyre}</p>
                  <p>Date: {formatDate(lap.date)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FastestLap;
