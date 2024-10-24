import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Firebase-Konfiguration
import { Season } from "../interfaces/Season";

interface ViewSeasonProps {
  seasonId: string;
}

const ViewSeason: React.FC<ViewSeasonProps> = ({ seasonId }) => {
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const seasonDocRef = doc(db, "seasons", seasonId);
        const seasonDoc = await getDoc(seasonDocRef);
        if (seasonDoc.exists()) {
          setSeasonData(seasonDoc.data() as Season);
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

    fetchSeasonData();
  }, [seasonId]);

  if (loading) {
    return <div>Laden...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!seasonData) {
    return <div>Keine Season-Daten gefunden.</div>;
  }

  return (
    <div>
      <h1>{seasonData.name}</h1>
      <h2>Jahr: {seasonData.year}</h2>
      <h3>Rennen:</h3>
      <ul>
        {seasonData.races.map((race) => (
          <li key={race.raceId}>
            Rennen-ID: {race.raceId}, Reihenfolge: {race.order}, Beendet:{" "}
            {race.isFinished ? "Ja" : "Nein"}
          </li>
        ))}
      </ul>
      <h3>Teampunkte:</h3>
      <ul>
        {Object.entries(seasonData.teams).map(([teamId, teamData]) => (
          <li key={teamId}>
            <strong>Team:</strong> {teamId} <br />
            <strong>Punkte:</strong> {teamData.points} <br />
            <strong>Fahrer 1:</strong> {teamData.driver1} <br />
            <strong>Fahrer 2:</strong> {teamData.driver2}
          </li>
        ))}
      </ul>
      <h3>Fahrerpunkte:</h3>
      <ul>
        {Object.entries(seasonData.driverPoints).map(([driverId, points]) => (
          <li key={driverId}>
            {driverId}: {points} Punkte
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewSeason;
