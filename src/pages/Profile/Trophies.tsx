import React, { useState } from "react";
import { Season } from "../../interfaces/Season";
import { Trophy } from "../../interfaces/Trophy";
import { FastestLap } from "../../interfaces/FastestLap";
import firstPlace from "../../assets/1st.webp";
import secondPlace from "../../assets/2nd.webp";
import thirdPlace from "../../assets/3rd.webp";
import { Race } from "../../interfaces/Race";

interface TrophiesProps {
  currentSeason: Season;
  seasons: Season[];
  trophies: Trophy[];
  fastestLaps: FastestLap[];
  races: Race[];
}

const Trophies: React.FC<TrophiesProps> = ({
  currentSeason,
  seasons,
    trophies,
    fastestLaps,
    races,
}) => {
  const [activeSeasonTab, setActiveSeasonTab] = useState<string | null>(
    currentSeason.id
  );
  const [activeTab, setActiveTab] = useState("trophies");

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
        <div
          className={
            activeSeasonTab === null ? "trophies-tab active" : "trophies-tab"
          }
          onClick={() => setActiveSeasonTab(null)}
        >
          <div>All Seasons</div>
        </div>
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
              {activeSeasonTab === null
                ? trophies.map((trophy) => (
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
                      ) : trophy.place === 3 ? (
                        <img
                          src={thirdPlace}
                          alt="3rd"
                          className="trophies-img"
                        />
                      ) : (
                        <></>
                      )}
                      {trophy.raceId.replace("-", " ")}<br/>
                      Season {trophy.seasonId}
                    </li>
                  ))
                : trophies
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
              {activeSeasonTab === null
                ? fastestLaps.map((fastestLap) => (
                    <li
                      key={fastestLap.raceId}
                      className="fastest-laps-list-item"
                    >
                      {getRaceById(fastestLap.raceId)?.fullName} - P
                      {fastestLap.place} - {fastestLap.tyre} -{" "}
                      {fastestLap.laptime} - {formatDate(fastestLap.date)}
                    </li>
                  ))
                : fastestLaps
                    .filter((s) => s.seasonId === activeSeasonTab)
                    .map((fastestLap) => (
                      <li
                        key={fastestLap.raceId}
                        className="fastest-laps-list-item"
                      >
                        {getRaceById(fastestLap.raceId)?.fullName} - P
                        {fastestLap.place} - {fastestLap.tyre} -{" "}
                        {fastestLap.laptime} - {formatDate(fastestLap.date)}
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
