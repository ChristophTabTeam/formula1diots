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
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
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
    checkIfOwner();
    setLoading(false);
  }, [driverProfile?.isPlayer, id, user?.email]);

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

  if (loading) return <Loading />;

  return (
    <div className="profile-grid">
      {driverProfile && season && (
        <div className="profile-card">
          <h1 className="display-4">Profile Page</h1>
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
                  style={{ display: "none" }} // Versteckt den Input
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
          {isOwner && (
            <div className="">
              <h2 className="display-6">Settings</h2>
              <div className="info-wrapper">
                <button
                  className="custom-file-upload btn-primary delete"
                  onClick={() => (window.location.href = "/change-password")}
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="profile-card">
        {season && seasons && driverProfile && (
          <Trophies
            teams={teams}
            currentSeason={season}
            seasons={seasons}
            driverProfile={driverProfile}
          />
        )}
      </div>
    </div>
  );
};

export default DriverProfile;
