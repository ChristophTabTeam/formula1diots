import React, { useEffect, useState } from "react";
import { Race } from "../../interfaces/Race";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const Races: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    const fetchRaces = async () => {
      const racesCollection = collection(db, "races");
      const racesSnapshot = await getDocs(racesCollection);
      const racesData = racesSnapshot.docs.map((doc) => doc.data() as Race);
      setRaces(racesData);
    };
    fetchRaces();
  }, []);

  return (
    <div className="container">
      <h1 className="display-2 f1-regular">Formula 1 Race Tracks</h1>
      <div className="races-grid">
        {races &&
          races
            .sort((a, b) => a.originalOrder - b.originalOrder)
            .map((race) => (
              <a
                className="races-card"
                key={race.name}
                href={`/races/${race.name}`}
              >
                {race.pathToCountryFlag && (
                  <div style={{backgroundImage: `url(${race.pathToCountryFlag})`}} />
                )}
                <h2 className="races-card-title f1-regular">{race.name}</h2>
              </a>
            ))}
      </div>
    </div>
  );
};

export default Races;
