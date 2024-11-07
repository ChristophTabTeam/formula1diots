import React, { useEffect, useState } from "react";
import { Race } from "../../interfaces/Race";
import { db } from "../../firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Loading from "../../components/Loading";
import { Tyre } from "../../interfaces/Tyre";
import { logError } from "../../utils/errorLogger";
import { useAuth } from "../../context/authcontext/useAuth";

interface RaceViewProps {
  id: string;
}

const RaceView: React.FC<RaceViewProps> = ({ id }) => {
  const { user } = useAuth();
  const [race, setRace] = useState<Race>();
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRace = async () => {
      try {
        const raceDoc = doc(db, "races", id);
        const raceDocSnap = await getDoc(raceDoc);
        if (raceDocSnap.exists()) {
          const raceData = raceDocSnap.data() as Race;
          setRace(raceData);
        } else {
          logError(
            new Error("No such document!"),
            user?.email?.replace("@formulaidiots.de", "") || "unknown",
            { context: "RaceView" }
          );
        }
      } catch (e) {
        logError(
          e as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "RaceView" }
        );
        console.error("Error fetching document: ", e);
        setError("Error fetching document " + e);
      } finally {
        setLoading(false);
      }
    };

    const fetchTyres = async () => {
      try {
        const tyresDoc = collection(db, "tyres");
        const tyresDocSnap = await getDocs(tyresDoc);
        const tyresData = tyresDocSnap.docs.map((doc) => doc.data() as Tyre);
        setTyres(tyresData);
      } catch (e) {
        console.error("Error fetching document: ", e);
        logError(
          e as Error,
          user?.email?.replace("@formulaidiots.de", "") || "unknown",
          { context: "RaceView", error: "Error fetching document" }
        );
        setError("Error fetching document " + e);
      }
    };

    fetchRace();
    fetchTyres();
  }, [id, user?.email]);

  const formatTrackDistance = (distance: string, laps: number) => {
    const totalDistance = parseFloat(distance.replace(" km", "")) * laps;
    return totalDistance.toFixed(2);
  };

  const convertKmtomiles = (km: number) => {
    return (km * 0.621371).toFixed(2);
  };

  const getTyreById = (tyreId: string) => {
    const tyre = tyres.find((t) => t.name === tyreId);
    return tyre;
  };

  if (loading) return <Loading />;

  if (race === undefined) {
    return <p>Error Loading Data, {error}</p>;
  }

  return (
    <div className="container">
      <h1 className="display-2 f1-regular">{race.name.replace("-", " ")} Grand Prix</h1>
      <h2 className="display-4 f1-regular">{race.fullName}</h2>
      <div className="race-grid-2-columns">
        <div className="race-info-grid">
          <div className="race-info-grid-column">
            <div className="race-info-wrapper">
              <h3 className="race-info-headline">Distance</h3>
              <p className="race-info-text">
                {formatTrackDistance(race.trackDistance, race.raceLaps).replace(
                  ".",
                  ","
                )}
                <span className="race-info-text-unit">KM</span>
              </p>
              <p className="race-info-text small-text">
                {convertKmtomiles(
                  parseFloat(
                    formatTrackDistance(race.trackDistance, race.raceLaps)
                  )
                ).replace(".", ",")}
                <span className="race-info-text-unit">MILES</span>
              </p>
            </div>
            <div className="race-info-wrapper">
              <h3 className="race-info-headline">Race Laps</h3>
              <p className="race-info-text">{race.raceLaps}</p>
            </div>
            <div className="race-info-wrapper">
              <h3 className="race-info-headline">Lap Record</h3>
              <p className="race-info-text">{race.lapRecord}</p>
              <p
                className="race-info-text small-text"
                style={{ fontStyle: "initial" }}
              >
                {race.recordDriverName}
              </p>
              <p className="race-info-text small-text">{race.recordYear}</p>
            </div>
          </div>
          <div className="race-info-grid-column">
            <div className="race-info-wrapper">
              <h3 className="race-info-headline">Top Speed</h3>
              <p className="race-info-text">
                {race.topSpeed}
                <span className="race-info-text-unit">KM/H</span>
              </p>
              <p className="race-info-text small-text">
                {Number(convertKmtomiles(race.topSpeed)).toFixed(2)}
                <span className="race-info-text-unit">MILES</span>
              </p>
            </div>
            <div className="race-info-wrapper">
              <h3 className="race-info-headline">Turns</h3>
              <p className="race-info-text">{race.turns}</p>
            </div>
            <div className="race-info-wrapper">
              <h3 className="race-info-headline">Elevation</h3>
              <p className="race-info-text">
                {race.elevationInMeter}
                <span className="race-info-text-unit">Meters</span>
              </p>
            </div>
          </div>
        </div>
        {/* <div className="race-info-track-map">
          <img src={race.pathToTrackMap} />
        </div> */}
        <div className="race-setup-wrapper">
          <h3 className="race-info-headline">Available Tyres</h3>
          <div className="race-setup-inner-wrapper">
            <div className="race-tyre-list-grid">
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/F1_tire_Pirelli_PZero_Red_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">
                    {getTyreById(race.tyreTypes[0])?.name}
                  </div>
                  Optimal Temp:{" "}
                  {getTyreById(race.tyreTypes[0])?.MinOperationTemp}°C -{" "}
                  {getTyreById(race.tyreTypes[0])?.MaxOperationTemp}°C
                </div>
              </div>
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c6/F1_tire_Pirelli_PZero_Yellow_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">
                    {getTyreById(race.tyreTypes[1])?.name}
                  </div>
                  Optimal Temp:{" "}
                  {getTyreById(race.tyreTypes[1])?.MinOperationTemp}°C -{" "}
                  {getTyreById(race.tyreTypes[1])?.MaxOperationTemp}°C
                </div>
              </div>
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/F1_tire_Pirelli_PZero_White_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">
                    {getTyreById(race.tyreTypes[2])?.name}
                  </div>
                  Optimal Temp:{" "}
                  {getTyreById(race.tyreTypes[2])?.MinOperationTemp}°C -{" "}
                  {getTyreById(race.tyreTypes[2])?.MaxOperationTemp}°C
                </div>
              </div>
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/70/F1_tire_Pirelli_Cinturato_Green_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">Intermediate</div>
                  Optimal Temp: {getTyreById("INT")?.MinOperationTemp}°C -{" "}
                  {getTyreById("INT")?.MaxOperationTemp}°C
                </div>
              </div>
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/F1_tire_Pirelli_Cinturato_Blue_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">Wet</div>
                  Optimal Temp: {getTyreById("WET")?.MinOperationTemp}°C -{" "}
                  {getTyreById("WET")?.MaxOperationTemp}°C
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="race-info-bottom-grid">
        <div className="race-setup-wrapper">
          <h2 className="display-6">Available Tyres</h2>
          <div className="race-setup-inner-wrapper">
            <div className="race-tyre-list-grid">
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/F1_tire_Pirelli_PZero_Red_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">
                    {getTyreById(race.tyreTypes[0])?.name}
                  </div>
                  Optimal Temp:{" "}
                  {getTyreById(race.tyreTypes[0])?.MinOperationTemp}°C - {getTyreById(race.tyreTypes[0])?.MaxOperationTemp}°C
                </div>
              </div>
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c6/F1_tire_Pirelli_PZero_Yellow_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">
                    {getTyreById(race.tyreTypes[1])?.name}
                  </div>
                  Optimal Temp:{" "}
                  {getTyreById(race.tyreTypes[1])?.MinOperationTemp}°C - {getTyreById(race.tyreTypes[1])?.MaxOperationTemp}°C
                </div>
              </div>
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/F1_tire_Pirelli_PZero_White_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">
                    {getTyreById(race.tyreTypes[2])?.name}
                  </div>
                  Optimal Temp:{" "}
                  {getTyreById(race.tyreTypes[2])?.MinOperationTemp}°C - {getTyreById(race.tyreTypes[2])?.MaxOperationTemp}°C
                </div>
              </div>
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/70/F1_tire_Pirelli_Cinturato_Green_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">Intermediate</div>
                  Optimal Temp: {getTyreById("INT")?.MinOperationTemp}°C - {getTyreById("INT")?.MaxOperationTemp}°C
                </div>
              </div>
              <div className="race-tyre-list-item">
                <div className="tyre-image-wrapper">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/F1_tire_Pirelli_Cinturato_Blue_18.svg" />
                </div>
                <div className="tyre-info">
                  <div className="tyre-name">Wet</div>
                  Optimal Temp: {getTyreById("WET")?.MinOperationTemp}°C - {getTyreById("WET")?.MaxOperationTemp}°C
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RaceView;
