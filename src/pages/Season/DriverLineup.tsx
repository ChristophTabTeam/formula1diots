import React, { useEffect, useState } from "react";
import { Driver } from "../../interfaces/Driver";
import { Team } from "../../interfaces/Team";
import Season from "./Index";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Loading from "../../components/Loading";
import { logError } from "../../utils/errorLogger";
import { useAuth } from "../../context/authcontext";

interface DriverLineupProps {
  seasonId: string;
}

const DriverLineup: React.FC<DriverLineupProps> = ({ seasonId }) => {
  const { user } = useAuth();

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
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "DriverLineup", error: "Error fetching drivers data" }
        );
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
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "DriverLineup", error: "Error fetching team data" }
        );
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
        logError(
          error as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "DriverLineup", error: "Error fetching season data" }
        );
      }
    };

    setLoading(true);
    fetchDrivers();
    fetchTeams();
    fetchSeason();
    setLoading(false);
  }, [seasonId, user?.email]);

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
                        backgroundColor: "white",
                        backgroundImage: `url("${
                          getDriverById(teamData.driver1)?.profilePictureUrl ||
                          ""
                        }")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <a href={`/profile/${teamData.driver1.toLowerCase()}`}>
                        <p className="driver-name">
                          {getDriverById(teamData.driver1)?.name}
                        </p>
                      </a>
                    </div>
                  )}
                  {teamData.driver2 && (
                    <div
                      className="driver-box"
                      style={{
                        backgroundColor: "white",
                        backgroundImage: `url("${
                          getDriverById(teamData.driver2)?.profilePictureUrl ||
                          ""
                        }")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <a href={`/profile/${teamData.driver2.toLowerCase()}`}>
                        <p className="driver-name">
                          {getDriverById(teamData.driver2)?.name}
                        </p>
                      </a>
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
