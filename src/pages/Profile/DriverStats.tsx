import React from "react";
import { Trophy } from "../../interfaces/Trophy";
import { FastestLap } from "../../interfaces/FastestLap";
import { DriverPoints } from "../../interfaces/DriverPoints";

interface DriverStatsProps {
  trophies: Trophy[];
  fastestLaps: FastestLap[];
  driverPoints: DriverPoints[];
}

const DriverStats: React.FC<DriverStatsProps> = ({ trophies, fastestLaps, driverPoints }) => {
  return (
    <div className="stats-wrapper">
      <h2 className="display-4">Alltime Driver Stats</h2>
      <div className="stats-grid">
        <div className="stats-card">
          <h3 className="display-6">Wins</h3>
          <p>{trophies.filter((trophy) => trophy.place === 1).length}</p>
        </div>
        <div className="stats-card">
          <h3 className="display-6">Podiums</h3>
          <p>{trophies.filter((trophy) => trophy.place <= 3).length}</p>
        </div>
        <div className="stats-card">
          <h3 className="display-6">Fastest Laps</h3>
          <p>{fastestLaps.length}</p>
        </div>
        <div className="stats-card">
          <h3 className="display-6">Points</h3>
          <p>{driverPoints.reduce((acc, curr) => acc + curr.points, 0)}</p>
        </div>
      </div>
    </div>
  );
};

export default DriverStats;
