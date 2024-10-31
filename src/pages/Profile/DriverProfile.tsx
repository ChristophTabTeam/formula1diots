import React, { useEffect, useState } from "react";
import { Driver } from "../../interfaces/Driver";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Loading from "../../components/Loading";
import { Team } from "../../interfaces/Team";
import { Season } from "../../interfaces/Season";
import { useAuth } from "../../context/authcontext";
import Trophies from "./Trophies";
import DriverStats from "./DriverStats";
import { Trophy } from "../../interfaces/Trophy";
import { FastestLap } from "../../interfaces/FastestLap";
import { Race } from "../../interfaces/Race";
import { DriverPoints } from "../../interfaces/DriverPoints";

interface DriverProfileProps {
  id: string;
}

const DriverProfile: React.FC<DriverProfileProps> = ({ id }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [driverProfile, setDriverProfile] = useState<Driver>();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [season, setSeason] = useState<Season>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [fastestLaps, setFastestLaps] = useState<FastestLap[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [driverPoints, setDriverPoints] = useState<DriverPoints[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isEditingBirthdate, setIsEditingBirthdate] = useState(false);
  const [newBirthdate, setNewBirthdate] = useState("");
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [newTeam, setNewTeam] = useState("");
  const [isEditingDriver, setIsEditingDriver] = useState(false);
  const [newDriver, setNewDriver] = useState("");
  const [isEditingTrack, setIsEditingTrack] = useState(false);
  const [newTrack, setNewTrack] = useState("");
  const [, setIsOwner] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const driversRef = collection(db, "drivers");
        const driverSnapshot = await getDocs(driversRef);
        const driverData = driverSnapshot.docs.map(
          (doc) => doc.data() as Driver
        );

        const activeDriver = driverData.find(
          (driver) => driver.id.toLowerCase() === id
        );
        if (activeDriver) {
          setDriverProfile(activeDriver);
          setProfileImageUrl(activeDriver.profilePictureUrl || null);
          setNewName((prevName) => prevName || activeDriver.name || "");
          setNewBirthdate(activeDriver.dateOfBirth || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchSeason = async () => {
      try {
        const seasonsCollection = collection(db, "seasons");
        const seasonsSnapshot = await getDocs(seasonsCollection);
        const seasons = seasonsSnapshot.docs.map((doc) => doc.data() as Season);
        const activeSeason = seasons.find((season) => season.isActiveSeason);
        if (!activeSeason) {
          window.location.href = "/create-season";
          return;
        }
        setSeasons(seasons);
        setSeason(activeSeason);
      } catch (error) {
        console.error("Error fetching season data:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        const teamsCollection = collection(db, "teams");
        const teamsSnapshot = await getDocs(teamsCollection);
        setTeams(teamsSnapshot.docs.map((doc) => doc.data() as Team));
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const driversCollection = collection(db, "drivers");
        const driversSnapshot = await getDocs(driversCollection);
        const drivers = driversSnapshot.docs.map((doc) => doc.data() as Driver);
        setDrivers(drivers);
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    const fetchTrophies = async () => {
      try {
        if (driverProfile?.id) {
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
        }
      } catch (error) {
        console.error("Error fetching trophies:", error);
      }
    };

    const fetchFastestLaps = async () => {
      try {
        if (driverProfile?.id) {
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
        }
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

    const fetchDriverPoints = async () => {
      try {
        if (driverProfile?.id) {
          const driverPointsCollection = collection(
            db,
            "drivers",
            driverProfile.id,
            "points"
          );
          const driverPointsSnapshot = await getDocs(driverPointsCollection);
          const driverPoints = driverPointsSnapshot.docs.map(
            (doc) => doc.data() as DriverPoints
          );
          setDriverPoints(driverPoints);
          console.log(driverPoints);
        }
      } catch (error) {
        console.error("Error fetching driver points:", error);
      }
    };

    const checkIfOwner = () => {
      if (user?.email?.replace("@formula1diots.de", "") === id) {
        setIsOwner(true);
        setCanEdit(true);
      } else if (driverProfile?.isPlayer) {
        setIsOwner(false);
        setCanEdit(false);
      } else {
        setIsOwner(false);
        setCanEdit(true);
      }
    };

    setLoading(true);
    fetchUser();
    fetchSeason();
    fetchTeams();
    fetchDrivers();
    fetchTrophies();
    fetchFastestLaps();
    fetchRaces();
    fetchDriverPoints();
    checkIfOwner();
    setLoading(false);
  }, [driverProfile?.id, driverProfile?.isPlayer, id, user?.email]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && driverProfile) {
      const file = e.target.files[0];
      const imageRef = ref(storage, `profileImages/${driverProfile.id}`);
      try {
        setLoading(true);
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);

        const driverDocRef = doc(db, "drivers", driverProfile.id);
        await updateDoc(driverDocRef, { profilePictureUrl: url });

        setProfileImageUrl(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteImage = async () => {
    if (profileImageUrl && driverProfile) {
      const imageRef = ref(storage, `profileImages/${driverProfile.id}`);
      try {
        await deleteObject(imageRef);

        const driverDocRef = doc(db, "drivers", driverProfile.id);
        await updateDoc(driverDocRef, {
          profilePictureUrl:
            "/drivers/" +
            driverProfile.name.split(" ")[1].toLowerCase() +
            ".png",
        });
        setProfileImageUrl(
          "/drivers/" + driverProfile.name.split(" ")[1].toLowerCase() + ".png"
        );
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const getTeamNameById = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.shortName || "unknown";
  };

  const getDriverNameById = (driverId: string) => { 
    const driver = drivers.find((d) => d.id === driverId);
    return driver ? driver.name : "Unknown";
  }

  const handleEditName = () => setIsEditingName(true);
  const handleSaveName = async () => {
    if (driverProfile) {
      try {
        setLoading(true);
        const driverDocRef = doc(db, "drivers", driverProfile.id);
        await updateDoc(driverDocRef, { name: newName });
        setDriverProfile((prevProfile) =>
          prevProfile ? { ...prevProfile, name: newName } : prevProfile
        );
        setIsEditingName(false);
      } catch (error) {
        console.error("Error updating name:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditBirthdate = () => setIsEditingBirthdate(true);
  const handleSaveBirthdate = async () => {
    if (driverProfile) {
      try {
        setLoading(true);
        const driverDocRef = doc(db, "drivers", driverProfile.id);
        await updateDoc(driverDocRef, { dateOfBirth: newBirthdate });
        setDriverProfile((prevProfile) =>
          prevProfile
            ? { ...prevProfile, dateOfBirth: newBirthdate }
            : prevProfile
        );
        setIsEditingBirthdate(false);
      } catch (error) {
        console.error("Error updating birthdate:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditTeam = () => setIsEditingTeam(true);
  const handleSaveTeam = async () => {
    if (driverProfile) {
      try {
        setLoading(true);
        const driverDocRef = doc(db, "drivers", driverProfile.id);
        await updateDoc(driverDocRef, { favoriteTeam: newTeam });
        setDriverProfile((prevProfile) =>
          prevProfile ? { ...prevProfile, favoriteTeam: newTeam } : prevProfile
        );
        setIsEditingTeam(false);
      } catch (error) {
        console.error("Error updating team:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditDriver = () => setIsEditingDriver(true);
  const handleSaveDriver = async () => {
    if (driverProfile) {
      try {
        setLoading(true);
        const driverDocRef = doc(db, "drivers", driverProfile.id);
        await updateDoc(driverDocRef, { favoriteDriver: newDriver });
        setDriverProfile((prevProfile) =>
          prevProfile
            ? { ...prevProfile, favoriteDriver: newDriver }
            : prevProfile
        );
        setIsEditingDriver(false);
      } catch (error) {
        console.error("Error updating driver slot:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditTrack = () => setIsEditingTrack(true);
  const handleSaveTrack = async () => {
    if (driverProfile) {
      try {
        setLoading(true);
        const driverDocRef = doc(db, "drivers", driverProfile.id);
        await updateDoc(driverDocRef, { favoriteTrack: newTrack });
        setDriverProfile((prevProfile) =>
          prevProfile
            ? { ...prevProfile, favoriteTrack: newTrack }
            : prevProfile
        );
        setIsEditingTrack(false);
      } catch (error) {
        console.error("Error updating track:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="profile-grid">
      {driverProfile && season && (
        <div className="profile-card">
          <h1 className="display-4">Profile</h1>
          <div className="profile-pic-wrapper">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                width="200"
                height="200"
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                No profile image available
              </div>
            )}
            {canEdit && (
              <div className="pic-button-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="file-upload"
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="file-upload"
                  className="custom-file-upload btn-primary"
                >
                  Change Picture
                </label>
                {profileImageUrl && (
                  <button
                    onClick={handleDeleteImage}
                    className="custom-file-upload btn-primary delete"
                  >
                    Delete Picture
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="">
            <h2 className="display-6">Personal Info</h2>
            <div className="info-wrapper">
              Name:{" "}
              {canEdit ? (
                isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <button onClick={handleSaveName} className="edit-button">
                      <span className="icon-16pt">save</span>
                    </button>
                  </>
                ) : (
                  <>
                    {driverProfile.name || driverProfile.id}
                    <button onClick={handleEditName} className="edit-button">
                      <span className="icon-16pt">edit</span>
                    </button>
                  </>
                )
              ) : (
                driverProfile.name || driverProfile.id
              )}
            </div>
            <div className="info-wrapper">
              Birthdate:{" "}
              {canEdit ? (
                isEditingBirthdate ? (
                  <>
                    <input
                      type="date"
                      value={newBirthdate}
                      onChange={(e) => setNewBirthdate(e.target.value)}
                    />
                    <button
                      onClick={handleSaveBirthdate}
                      className="edit-button"
                    >
                      <span className="icon-16pt">save</span>
                    </button>
                  </>
                ) : (
                  <>
                    {driverProfile.dateOfBirth
                      ? driverProfile.dateOfBirth.split("-").reverse().join(".")
                      : "Unknown"}
                    <button
                      onClick={handleEditBirthdate}
                      className="edit-button"
                    >
                      <span className="icon-16pt">edit</span>
                    </button>
                  </>
                )
              ) : driverProfile.dateOfBirth ? (
                driverProfile.dateOfBirth.split("-").reverse().join(".")
              ) : (
                "Unknown"
              )}
            </div>
            <div className="info-wrapper">
              Fav Team:{" "}
              {canEdit ? (
                isEditingTeam ? (
                  <>
                    <select
                      value={newTeam}
                      onChange={(e) => setNewTeam(e.target.value)}
                    >
                      <option value="">select team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.shortName}
                        </option>
                      ))}
                    </select>
                    <button onClick={handleSaveTeam} className="edit-button">
                      <span className="icon-16pt">save</span>
                    </button>
                  </>
                ) : (
                  <>
                    {getTeamNameById(driverProfile.favoriteTeam || "")}
                    <button onClick={handleEditTeam} className="edit-button">
                      <span className="icon-16pt">edit</span>
                    </button>
                  </>
                )
              ) : (
                getTeamNameById(driverProfile.favoriteTeam || "")
              )}
            </div>
            <div className="info-wrapper">
              Fav Driver:{" "}
              {canEdit ? (
                isEditingDriver ? (
                  <>
                    <select
                      value={newDriver}
                      onChange={(e) => setNewDriver(e.target.value)}
                    >
                      <option value="">select Driver</option>
                      {drivers
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                    </select>
                    <button onClick={handleSaveDriver} className="edit-button">
                      <span className="icon-16pt">save</span>
                    </button>
                  </>
                ) : (
                  <>
                    {getDriverNameById(driverProfile.favoriteDriver || "") || "Unknown"}
                    <button onClick={handleEditDriver} className="edit-button">
                      <span className="icon-16pt">edit</span>
                    </button>
                  </>
                )
              ) : (
                driverProfile.favoriteDriver || "Unknown"
              )}
            </div>
            <div className="info-wrapper">
              Fav Track:{" "}
              {canEdit ? (
                isEditingTrack ? (
                  <>
                    <select
                      value={newTrack}
                      onChange={(e) => setNewTrack(e.target.value)}
                    >
                      <option value="">select track</option>
                      {races.map((race) => (
                        <option key={race.name} value={race.name}>
                          {race.name}
                        </option>
                      ))}
                    </select>
                    <button onClick={handleSaveTrack} className="edit-button">
                      <span className="icon-16pt">save</span>
                    </button>
                  </>
                ) : (
                  <>
                    {driverProfile.favoriteTrack || "Unknown"}
                    <button onClick={handleEditTrack} className="edit-button">
                      <span className="icon-16pt">edit</span>
                    </button>
                  </>
                )
              ) : (
                driverProfile.favoriteTrack || "Unknown"
              )}
            </div>
          </div>
          <div className="">
            <h2 className="display-6">Current Season Stats</h2>
            <div className="info-wrapper">
              {driverProfile.isPlayer ? (
                <span>
                  Team:{" "}
                  {getTeamNameById(season.playerData[driverProfile.id]?.teamId)}
                </span>
              ) : (
                <span>Team: {getTeamNameById(driverProfile.teamId)}</span>
              )}
            </div>
            <div className="info-wrapper">
              Points: {season.driverPoints[driverProfile.id]}
            </div>
            <div className="info-wrapper">
              Position:{" "}
              {Object.keys(season.driverPoints).findIndex(
                (driverId) => driverId === driverProfile.id
              ) + 1}
            </div>
          </div>
        </div>
      )}
      <div className="profile-column">
        <div className="profile-card">
          {season && seasons && driverProfile && (
            <Trophies
              currentSeason={season}
              seasons={seasons}
              trophies={trophies}
              fastestLaps={fastestLaps}
              races={races}
            />
          )}
        </div>
        <div className="profile-card">
          <DriverStats
            trophies={trophies}
            fastestLaps={fastestLaps}
            driverPoints={driverPoints}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
