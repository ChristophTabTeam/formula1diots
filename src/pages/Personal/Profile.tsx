import React, { useEffect, useState } from "react";
import { Driver } from "../../interfaces/Driver";
import { useAuth } from "../../context/authcontext";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loading from "../../components/Loading";
import { Team } from "../../interfaces/Team";
import { Season } from "../../interfaces/Season";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [, setDrivers] = useState<Driver[]>([]);
  const [driverProfile, setDriverProfile] = useState<Driver>();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [season, setSeason] = useState<Season>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(""); // newName initial leer

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const driversRef = collection(db, "drivers");
        const driverSnapshot = await getDocs(driversRef);
        const driverData = driverSnapshot.docs.map((doc) => doc.data() as Driver);
        setDrivers(driverData);

        const activeDriver = driverData.find(
          (driver) => driver.id === user?.email?.replace("@formula1diots.de", "")
        );
        if (activeDriver) {
          setDriverProfile(activeDriver);
          setProfileImageUrl(activeDriver.profilePictureUrl || null);
          
          // Setze `newName` nur, wenn es leer ist
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

    setLoading(true);
    fetchUser();
    fetchSeason();
    fetchTeams();
    setLoading(false);
  }, [user?.email]); // Entferne drivers als Abhängigkeit

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (profileImage && driverProfile) {
      const imageRef = ref(storage, `profileImages/${driverProfile.id}`);
      try {
        setLoading(true);
        await uploadBytes(imageRef, profileImage);
        const url = await getDownloadURL(imageRef);

        const driverDocRef = doc(db, "drivers", driverProfile.id);
        await updateDoc(driverDocRef, { profilePictureUrl: url });

        setProfileImageUrl(url);
        alert("Profile image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getTeamNameById = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.name || "unknown";
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
    <>
      {driverProfile && season && (
        <div className="profile-card">
          <h1 className="display-2">Profile Page</h1>
          <div className="profile-pic-wrapper">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                width="200"
                height="200"
              />
            ) : (
              <div className="profile-placeholder">
                No profile image available
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!profileImage}>
              Upload Profile Image
            </button>
          </div>

          <h2 className="display-6">
            Name:{" "}
            {isEditingName ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)} // newName wird direkt aktualisiert
              />
            ) : (
              driverProfile.name || driverProfile.id
            )}
            {isEditingName ? (
              <button onClick={handleSaveName}>Save</button>
            ) : (
              <button onClick={handleEditName}>Edit</button>
            )}
          </h2>

          <p>
            Current Team:{" "}
            {getTeamNameById(season.playerData[driverProfile.id]?.teamId)}
          </p>
          <p>Current Points: {season.driverPoints[driverProfile.id]}</p>
          <p>
            Current Position:{" "}
            {Object.keys(season.driverPoints).findIndex(
              (driverId) => driverId === driverProfile.id
            ) + 1}.
          </p>
        </div>
      )}
    </>
  );
};

export default Profile;
