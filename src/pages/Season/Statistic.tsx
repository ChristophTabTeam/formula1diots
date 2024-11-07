import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loading from "../../components/Loading";
import { Driver } from "../../interfaces/Driver";
import { Race } from "../../interfaces/Race";
import { SeasonRace } from "../../interfaces/SeasonRace";
import { useAuth } from "../../context/authcontext";
import { logError } from "../../utils/errorLogger";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RaceResult {
  [position: string]: string | null;
}

interface StatisticProps {
  seasonId: string;
}

const Statistic: React.FC<StatisticProps> = ({ seasonId }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [pointsData, setPointsData] = useState<Record<string, number[]>>({});
  const [driversData, setDriversData] = useState<Driver[]>([]);
  const [seasonRaces, setSeasonRaces] = useState<SeasonRace[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const chartRef = useRef<ChartJS<"line">>(null);
  const [toggledDrivers, setToggledDrivers] = useState<boolean>(true);

  useEffect(() => {
    const fetchRaceResults = async () => {
      try {
        const racesCollectionRef = collection(db, "seasons", seasonId, "races");
        const racesSnapshot = await getDocs(racesCollectionRef);

        const raceResults = racesSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              order: data.order,
              raceResults: data.raceResults as RaceResult,
              fastestLap: data.raceResults.fastestLap || null,
            };
          })
          .sort((a, b) => a.order - b.order);

        setSeasonRaces(
          racesSnapshot.docs.map((doc) => doc.data() as SeasonRace)
        );

        const driverPoints: { [driverId: string]: number[] } = {};
        const pointsPerPosition: { [position: string]: number } = {
          P1: 25,
          P2: 18,
          P3: 15,
          P4: 12,
          P5: 10,
          P6: 8,
          P7: 6,
          P8: 4,
          P9: 2,
          P10: 1,
        };

        raceResults.forEach((result, raceIndex) => {
          const top10Drivers: Set<string> = new Set();
          for (const [position, driverId] of Object.entries(
            result.raceResults
          )) {
            if (
              driverId &&
              pointsPerPosition[position as keyof typeof pointsPerPosition] !==
                undefined
            ) {
              top10Drivers.add(driverId);
              if (!driverPoints[driverId]) {
                driverPoints[driverId] = new Array(raceIndex + 1).fill(0);
              }
              const lastPoints = driverPoints[driverId][raceIndex] || 0;
              const pointsForPosition =
                pointsPerPosition[position as keyof typeof pointsPerPosition];
              driverPoints[driverId][raceIndex + 1] =
                lastPoints + pointsForPosition;
            }
          }

          const fastestLapDriverId = result.fastestLap;
          if (fastestLapDriverId && top10Drivers.has(fastestLapDriverId)) {
            if (!driverPoints[fastestLapDriverId]) {
              driverPoints[fastestLapDriverId] = new Array(raceIndex + 1).fill(
                0
              );
            }
            const lastPoints =
              driverPoints[fastestLapDriverId][raceIndex + 1] || 0;
            driverPoints[fastestLapDriverId][raceIndex + 1] = lastPoints + 1;
          }

          Object.keys(driverPoints).forEach((driverId) => {
            if (driverPoints[driverId].length <= raceIndex + 1) {
              driverPoints[driverId][raceIndex + 1] =
                driverPoints[driverId][raceIndex] || 0;
            }
          });
        });

        const allDrivers = await getDocs(collection(db, "drivers"));
        allDrivers.docs.forEach((doc) => {
          const driverId = doc.id;
          if (!driverPoints[driverId]) {
            driverPoints[driverId] = new Array(raceResults.length + 1).fill(0);
          }
        });

        setPointsData(driverPoints);
      } catch (error) {
        console.error("Error fetching race results:", error);
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "Statistic", error: "Error fetching race results" }
        );
      }
    };

    const fetchDrivers = async () => {
      try {
        const driversCollectionRef = collection(db, "drivers");
        const driversSnapshot = await getDocs(driversCollectionRef);
        const driversData = driversSnapshot.docs.map(
          (doc) => doc.data() as Driver
        );
        setDriversData(driversData);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "Statistic", error: "Error fetching drivers" }
        );
      }
    };

    const fetchRaces = async () => {
      try {
        const racesCollection = collection(db, "races");
        const racesSnapshot = await getDocs(racesCollection);
        const racesData = racesSnapshot.docs.map((doc) => doc.data() as Race);
        setRaces(racesData);
      } catch (error) {
        console.error("Error fetching Races", error);
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "Statistic", error: "Error fetching Races" }
        );
      }
    };

    setLoading(true);
    fetchRaceResults();
    fetchDrivers();
    fetchRaces();
    setLoading(false);
  }, [seasonId, user?.email]);

  const getDriverById = (driverId: string) => {
    return driversData.find((driver) => driver.id === driverId);
  };

  const getRaceNameByOrder = (order: number) => {
    const seasonRace = seasonRaces.find((i) => i.order === order);
    const race = races.find((i) => i.name === seasonRace?.raceId);
    return race?.threeLetterCode || null;
  };

  const toggleAllDrivers = (visibility: boolean) => {
    if (chartRef.current) {
      chartRef.current.data.datasets.forEach((dataset) => {
        dataset.hidden = !visibility;
        setToggledDrivers(visibility);
      });
      chartRef.current.update();
    }
  };

  if (loading) return <Loading />;

  const chartData = {
    labels: [
      "Start",
      ...Array.from(
        { length: Object.values(pointsData)[0]?.length - 1 || 0 },
        (_, i) => `${getRaceNameByOrder(i + 1)}`
      ),
    ],
    datasets: Object.entries(pointsData)
      .filter(([driverId]) => !driverId.startsWith("P"))
      .map(([driverId, points]) => ({
        label: getDriverById(driverId)?.name || driverId,
        data: points,
        fill: false,
        borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        tension: 0.2,
      })),
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 className="display-4">Season Statistic</h1>
        {toggledDrivers ? (
          <button
            className="btn-primary"
            onClick={() => toggleAllDrivers(false)}
          >
            Hide All Drivers
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => toggleAllDrivers(true)}
          >
            Show All Drivers
          </button>
        )}
      </div>
      <Line
        ref={chartRef}
        data={chartData}
        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
      />
    </div>
  );
};

export default Statistic;
