import React, { useEffect, useState } from "react";
import { Driver } from "../interfaces/Driver";
import { Team } from "../interfaces/Team";
import Season from "./Season";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Loading from "../components/Loading";

interface DriverLineupProps {
  seasonId: string;
}

const DriverLineup: React.FC<DriverLineupProps> = ({ seasonId }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [season, setSeason] = useState<Season>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversRef = collection(db, "drivers");
        const driversSnapshot = await getDocs(driversRef);
        const driversData = driversSnapshot.docs.map(
          (doc) => doc.data() as Driver
        );
        setDrivers(driversData);
      } catch (error) {
        console.error("Error fetching drivers data:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        const teamsCollection = collection(db, "teams");
        const teamsSnapshot = await getDocs(teamsCollection);
        const teamsData = teamsSnapshot.docs
          .map((doc) => doc.data() as Team)
          .sort((a, b) => a.listOrder - b.listOrder); // Sortiere nach listOrder
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    const fetchSeason = async () => {
      try {
        const seasonsCollection = collection(db, "seasons");
        const seasonsSnapshot = await getDocs(seasonsCollection);
        const seasons = seasonsSnapshot.docs.map((doc) => doc.data() as Season);
        const activeSeason = seasons.find((season) => season.id === seasonId);
        if (!activeSeason) {
          window.location.href = "/create-season";
          return;
        }
        setSeason(activeSeason);
      } catch (error) {
        console.error("Error fetching season data:", error);
      }
    };

    setLoading(true);
    fetchDrivers();
    fetchTeams();
    fetchSeason();
    setLoading(false);
  }, [seasonId]);

  const getDriverById = (driverId: string) => {
    return drivers.find((driver) => driver.id === driverId);
  };

  if (loading) return <Loading />;

  return (
    <div className="">
      {season && (
        <div className="team-grid">
          {teams.map((team) => {
            const teamData = season.teams[team.id];
            if (!teamData) return null;

            return (
              <div
                className="team-box"
                style={{
                  borderLeft: `8px solid ${team.teamColor}`,
                }}
                key={team.id}
              >
                <p className="team-name">{team.shortName}</p>
                <div className="driver-wrapper">
                  {teamData.driver1 && (
                    <div
                      className="driver-box"
                      style={{
                        backgroundImage: `url("${
                          getDriverById(teamData.driver1)?.profilePictureUrl || ""
                        }")`,
                      }}
                    >
                      <p className="driver-name">
                        {getDriverById(teamData.driver1)?.name}
                      </p>
                    </div>
                  )}
                  {teamData.driver2 && (
                    <div
                      className="driver-box"
                      style={{
                        backgroundImage: `url("${
                          getDriverById(teamData.driver2)?.profilePictureUrl || ""
                        }")`,
                      }}
                    >
                      <p className="driver-name">
                        {getDriverById(teamData.driver2)?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DriverLineup;
