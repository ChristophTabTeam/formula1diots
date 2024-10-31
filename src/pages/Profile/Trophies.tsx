import React, { useEffect, useState } from "react";
import { Season } from "../../interfaces/Season";
import { Driver } from "../../interfaces/Driver";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Trophy } from "../../interfaces/Trophy";
import { FastestLap } from "../../interfaces/FastestLap";
import firstPlace from "../../assets/1st.webp";
import secondPlace from "../../assets/2nd.webp";
import thirdPlace from "../../assets/3rd.webp";
import { Team } from "../../interfaces/Team";
import { Race } from "../../interfaces/Race";

interface TrophiesProps {
  currentSeason: Season;
  seasons: Season[];
  driverProfile: Driver;
  teams: Team[];
}

const Trophies: React.FC<TrophiesProps> = ({
  currentSeason,
  seasons,
  driverProfile,
}) => {
  const [activeSeasonTab, setActiveSeasonTab] = useState<string>(
    currentSeason.id
  );
  const [activeTab, setActiveTab] = useState("trophies");
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [fastestLaps, setFastestLaps] = useState<FastestLap[]>([]);
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const trophiesCollection = collection(
          db,
          "drivers",
          driverProfile.id,
          "trophies"
        );
        const trophiesSnapshot = await getDocs(trophiesCollection);
        const trophies = trophiesSnapshot.docs.map(
          (doc) => doc.data() as Trophy
        );
        setTrophies(trophies);
      } catch (error) {
        console.error("Error fetching trophies:", error);
      }
    };

    const fetchFastestLaps = async () => {
      try {
        const fastestLapsCollection = collection(
          db,
          "drivers",
          driverProfile.id,
          "fastestLaps"
        );
        const fastestLapsSnapshot = await getDocs(fastestLapsCollection);
        const fastestLaps = fastestLapsSnapshot.docs.map(
          (doc) => doc.data() as FastestLap
        );
        setFastestLaps(fastestLaps);
      } catch (error) {
        console.error("Error fetching fastest laps:", error);
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
      }
    };

    fetchTrophies();
    fetchFastestLaps();
    fetchRaces();
  }, [driverProfile]);

  const getRaceById = (raceId: string) => {
    const race = races.find((r) => r.name === raceId);
    return race;
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

  return (
    <div className="trophies-wrapper">
      <h1 className="display-4">Trophies & Achievements</h1>
      <div className="trophies-tabs">
        {seasons.map((season) => (
          <div
            key={season.id}
            className={
              activeSeasonTab === season.id
                ? "trophies-tab active"
                : "trophies-tab"
            }
            onClick={() => setActiveSeasonTab(season.id)}
          >
            {season.isActiveSeason ? (
              <div>Current Season</div>
            ) : (
              <div>Season {season.name}</div>
            )}
          </div>
        ))}
      </div>
      <div className="trophies-tabs">
        <div
          className={
            activeTab === "trophies" ? "trophies-tab active" : "trophies-tab"
          }
          onClick={() => setActiveTab("trophies")}
        >
          Trophies
        </div>
        <div
          className={
            activeTab === "fastestLaps" ? "trophies-tab active" : "trophies-tab"
          }
          onClick={() => setActiveTab("fastestLaps")}
        >
          DHL Fastest Laps
        </div>
      </div>
      <div className="trophies-content">
        {activeTab === "trophies" && (
          <div className="trophies">
            <ul className="trophies-list">
              {trophies
                .filter((s) => s.seasonId === activeSeasonTab)
                .map((trophy) => (
                  <li key={trophy.raceId} className="trophies-list-item">
                    {trophy.place === 1 ? (
                      <img
                        src={firstPlace}
                        alt="1st"
                        className="trophies-img"
                      />
                    ) : trophy.place === 2 ? (
                      <img
                        src={secondPlace}
                        alt="2nd"
                        className="trophies-img"
                      />
                    ) : (
                      <img
                        src={thirdPlace}
                        alt="3rd"
                        className="trophies-img"
                      />
                    )}
                    {trophy.raceId.replace("-", " ")}
                  </li>
                ))}
            </ul>
          </div>
        )}
        {activeTab === "fastestLaps" && (
          <div className="fastest-laps">
            <ul className="fastest-laps-list">
              {fastestLaps.map((fastestLap) => (
                <li key={fastestLap.raceId} className="fastest-laps-list-item">
                  {getRaceById(fastestLap.raceId)?.fullName} - P
                  {fastestLap.place} - {fastestLap.tyre} - {fastestLap.laptime}{" "}
                  - {formatDate(fastestLap.date)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trophies;
