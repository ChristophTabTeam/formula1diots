import React, { useEffect, useState } from "react";
import racingFlag from "../assets/racing-flag-svgrepo-com.svg";
import calendarAdd from "../assets/calendar_add_on_24dp_FFF_FILL0_wght400_GRAD0_opsz24.svg";
import calendarView from "../assets/date_range_24dp_FFF_FILL0_wght400_GRAD0_opsz24.svg";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import type { Season } from "../interfaces/Season";

const Season: React.FC = () => {
  const [season, setSeason] = useState<Season[]>([]);

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

    fetchActiveSeason();
  }, []);

  return (
    <div className="container">
      <div className="home-header">
        <h1 className="display-2">Settings</h1>
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
        <a href="settings/team-driver" className="settings-card">
          <img src={racingFlag} className="settings-icon" />
          View Races
        </a>
        <a href="settings/tyres/new" className="settings-card">
          <img src="/imgs/tyre-2.svg" className="settings-icon" />
          Edit Tyres
        </a>
      </div>
    </div>
  );
};

export default Season;
