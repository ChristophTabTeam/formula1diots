import React, { useEffect, useState } from "react";
import racingFlag from "../assets/racing-flag-svgrepo-com.svg";
import calendarAdd from "../assets/calendar_add_on_24dp_FFF_FILL0_wght400_GRAD0_opsz24.svg";
import calendarView from "../assets/date_range_24dp_FFF_FILL0_wght400_GRAD0_opsz24.svg";
import groupe from "../assets/groups_24dp_FILL0_wght400_GRAD0_opsz24.svg"
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import type { Season } from "../interfaces/Season";
import Loading from "../components/Loading";

const Season: React.FC = () => {
  const [season, setSeason] = useState<Season[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchActiveSeason = async () => {
      const db = getFirestore();
      const q = query(
        collection(db, "seasons"),
        where("isActiveSeason", "==", true)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(() => {
        setSeason(querySnapshot.docs.map((doc) => doc.data() as Season));
      });
    };
    setLoading(true);
    fetchActiveSeason();
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="home-header">
        <h1 className="display-2">Season Options</h1>
      </div>
      <div className="settings-grid">
        <a className="settings-card" href="/create-season">
          <img src={calendarAdd} className="settings-icon" />
          Create Season
        </a>
        {season.length > 0 && (
          <a className="settings-card" href={`/season/${season[0].id}`}>
            <img src={calendarView} className="settings-icon" />
            Season Results
          </a>
        )}
        {season.length > 0 && (
          <a href={`/season/${season[0].id}/results-entry`} className="settings-card">
            <img src={racingFlag} className="settings-icon" />
            Result Entry
          </a>
        )}
        {season.length > 0 && (
        <a href={`/season/${season[0].id}/driver-lineup`} className="settings-card">
          <img src={groupe} className="settings-icon" />
          Driver Lineup
        </a>
        )}
      </div>
    </div>
  );
};

export default Season;
