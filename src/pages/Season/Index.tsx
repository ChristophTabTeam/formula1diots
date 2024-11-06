import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import type { Season } from "../../interfaces/Season";
import Loading from "../../components/Loading";
import { db } from "../../firebase/firebaseConfig";

const Season: React.FC = () => {
  const [season, setSeason] = useState<Season>();
  const [, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchActiveSeason = async () => {
      try {
        const seasonsCollection = collection(db, "seasons");
        const seasonsSnapshot = await getDocs(seasonsCollection);
        const seasonsData = seasonsSnapshot.docs.map(
          (doc) => doc.data() as Season
        );
        if (seasonsData.length === 0) {
          window.location.href = "/create-season";
        }
        setSeasons(seasonsData);
        const activeSeason = seasonsData.filter(
          (season) => season.isActiveSeason === true
        );
        if (activeSeason.length > 0) {
          setSeason(activeSeason[0]);
        }
      } catch (error) {
        console.error("Error fetching active season: ", error);
      }
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
      <h3 className="display-2" style={{ marginBottom: "30px" }}>
        Season {season && season.id}
      </h3>
      <div className="settings-grid">
        <a className="settings-card settings-grid-one" href="/create-season">
          Create Season
        </a>
        {season && (
          <a
            className="settings-card settings-grid-two"
            href={`/season/${season.id}`}
          >
            Season Results
          </a>
        )}
        {season && (
          <a
            href={`/season/${season.id}/results-entry`}
            className="settings-card settings-grid-three"
          >
            <p>Result Entry</p>
          </a>
        )}
        {season && (
          <a
            href={`/season/${season.id}/driver-lineup`}
            className="settings-card settings-grid-four"
          >
            <p>Driver Lineup</p>
          </a>
        )}
        {season && (
          <a
            href={`/season/${season.id}/statistic`}
            className="settings-card settings-grid-five"
          >
            <p>Statistic</p>
          </a>
        )}
        {season && (
          <a
            // href={`/season/${season.id}/fastest-laps`}
            href={undefined}
            className="settings-card disabled settings-grid-six"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>Fastest Lap</span>
            </div>
          </a>
        )}
        {season && (
          <a
            href={`/season/${season.id}/rules`}
            className="settings-card settings-grid-seven"
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>Rules</span>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default Season;
