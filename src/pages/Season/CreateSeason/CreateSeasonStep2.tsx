import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Team } from "../../../interfaces/Team";
import { Driver } from "../../../interfaces/Driver";
import Loading from "../../../components/Loading";

interface CreateSeasonStep2Props {
  seasonName: string;
  nextStep: (
    selectedDrivers: string[],
    teams: { [teamId: string]: { driver1: string; driver2: string } }
  ) => void;
  previousStep: () => void;
}

export function CreateSeasonStep2({
  seasonName,
  nextStep,
  previousStep,
}: CreateSeasonStep2Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [assignedTeams, setAssignedTeams] = useState<{
    [teamId: string]: { driver1: string; driver2: string };
  }>({});
  const [includeDrivers, setIncludeDrivers] = useState(false);
  const [teamAssigned, setTeamAssigned] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [revealedTeams, setRevealedTeams] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollection = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollection);
      setTeams(teamsSnapshot.docs.map((doc) => doc.data() as Team));
    };

    const fetchDrivers = async () => {
      const driversCollection = collection(db, "drivers");
      const driversSnapshot = await getDocs(driversCollection);
      const allDrivers = driversSnapshot.docs.map(
        (doc) => doc.data() as Driver
      );
      const filteredDrivers = allDrivers.filter((driver) => driver.isPlayer);
      setAllDrivers(allDrivers);
      setDrivers(filteredDrivers);
    };

    setLoading(true);
    fetchDrivers();
    fetchTeams();
    setLoading(false);
  }, []);

  const assignDriversToTeams = () => {
    const updatedTeams: {
      [teamId: string]: { driver1: string; driver2: string };
    } = {};

    selectedDrivers.forEach((driverId) => {
      let teamAssigned = false;

      while (!teamAssigned) {
        const randomTeamIndex = Math.floor(Math.random() * teams.length);
        const randomSeatIndex = Math.floor(Math.random() * 2);
        const selectedTeam = teams[randomTeamIndex];

        if (randomSeatIndex === 0 && !updatedTeams[selectedTeam.id]?.driver1) {
          updatedTeams[selectedTeam.id] = {
            driver1: driverId,
            driver2: updatedTeams[selectedTeam.id]?.driver2 || "",
          };
          teamAssigned = true;
        } else if (
          randomSeatIndex === 1 &&
          !updatedTeams[selectedTeam.id]?.driver2
        ) {
          updatedTeams[selectedTeam.id] = {
            driver1: updatedTeams[selectedTeam.id]?.driver1 || "",
            driver2: driverId,
          };
          teamAssigned = true;
        }
      }
    });

    if (includeDrivers) {
      allDrivers.forEach((driver) => {
        if (!selectedDrivers.includes(driver.id)) {
          const team = updatedTeams[driver.teamId] || {};

          if (driver.seat === 0 && !team.driver1) {
            updatedTeams[driver.teamId] = {
              driver1: driver.id,
              driver2: team.driver2 || "",
            };
          } else if (driver.seat === 1 && !team.driver2) {
            updatedTeams[driver.teamId] = {
              driver1: team.driver1 || "",
              driver2: driver.id,
            };
          }
        }
      });
    }

    setAssignedTeams(updatedTeams);
    setTeamAssigned(true);
    console.log("Assigned Teams:", updatedTeams);
  };

  const handleRevealTeam = (teamId: string) => {
    setRevealedTeams((prev) => {
      const newRevealed = new Set(prev);
      if (newRevealed.has(teamId)) {
        newRevealed.delete(teamId);
      } else {
        newRevealed.add(teamId);
      }
      return newRevealed;
    });
  };

  const handleSubmit = () => {
    if (selectedDrivers.length > 0 && Object.keys(assignedTeams).length > 0) {
      nextStep(selectedDrivers, assignedTeams);
    } else {
      alert(
        "Bitte wählen Sie mindestens einen Spieler aus und weisen Sie die Spieler den Teams zu."
      );
    }
  };

  const getDriverById = (driverId: string) => {
    const driver = allDrivers.find((driver) => driver.id === driverId);
    return driver || null;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="create-season-wrapper justify-top">
      <h1 className="display-1">Select Players for Season "{seasonName}"</h1>
      <ul className="create-season-list">
        {drivers.map((driver) => (
          <li key={driver.id} className="create-season-list-item">
            <label
              className={selectedDrivers.includes(driver.id) ? "checked" : ""}
            >
              <div
                style={{
                  backgroundImage: `url(${driver.profilePictureUrl})`,
                  width: "150px",
                  height: "150px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="create-season-profile-pic"
              />
              <input
                type="checkbox"
                value={driver.id}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDrivers([...selectedDrivers, driver.id]);
                  } else {
                    setSelectedDrivers(
                      selectedDrivers.filter((id) => id !== driver.id)
                    );
                  }
                }}
              />
              {driver.name || driver.id}
            </label>
          </li>
        ))}
      </ul>
      <div className="create-season-list-item">
        <label className={includeDrivers ? "checked" : ""}>
          <input
            type="checkbox"
            checked={includeDrivers}
            onChange={(e) => setIncludeDrivers(e.target.checked)}
          />
          Yes, add AI-Drivers
        </label>
      </div>
      {!teamAssigned ? (
        <button onClick={assignDriversToTeams} className="btn-primary">
          Assign players to teams
        </button>
      ) : (
        <button onClick={assignDriversToTeams} className="btn-primary">
          Reassign players to teams
        </button>
      )}

      {Object.keys(assignedTeams).length > 0 && (
        <div className="team-grid" style={{ width: "100%" }}>
          {teams
            .sort((a, b) => a.listOrder - b.listOrder)
            .map((team) => (
              <div
                key={team.id}
                className="team-box"
                style={{
                  borderLeft: `8px solid ${team.teamColor}`,
                }}
              >
                <div
                  className={`driver-wrapper ${
                    revealedTeams.has(team.id) ? "revealed" : "blurred"
                  }`}
                  onClick={() => handleRevealTeam(team.id)}
                  style={{
                    filter: revealedTeams.has(team.id) ? "none" : "blur(40px)",
                    transition: "filter 0.5s",
                    cursor: "pointer",
                  }}
                >
                  <p className="team-name">{team.shortName}</p>
                  <div
                    className="driver-box"
                    style={{
                      backgroundColor: "white",
                      backgroundImage: `url("${
                        getDriverById(assignedTeams[team.id]?.driver1)
                          ?.profilePictureUrl || ""
                      }")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <a
                      href={`/profile/${assignedTeams[team.id]?.driver1}`}
                      target="_blank"
                    >
                      <p className="driver-name">
                        {getDriverById(assignedTeams[team.id]?.driver1)?.name ||
                          "free"}
                      </p>
                    </a>
                  </div>
                  <div
                    className="driver-box"
                    style={{
                      backgroundColor: "white",
                      backgroundImage: `url("${
                        getDriverById(assignedTeams[team.id]?.driver2)
                          ?.profilePictureUrl || ""
                      }")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <a
                      href={`/profile/${assignedTeams[team.id]?.driver2}`}
                      target="_blank"
                    >
                      <p className="driver-name">
                        {getDriverById(assignedTeams[team.id]?.driver2)?.name ||
                          "free"}
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="btn-wrapper">
        <button onClick={previousStep} className="btn-primary">
          Back
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  );
}
