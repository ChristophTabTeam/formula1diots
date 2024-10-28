import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Race } from "../../interfaces/Race";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Loading from "../../components/Loading";

interface CreateSeasonStep4Props {
  nextStep: (selectedRaces: string[]) => void;
  previousStep: () => void;
}

export function CreateSeasonStep4({
  nextStep,
  previousStep,
}: CreateSeasonStep4Props) {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRaces, setSelectedRaces] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRaces = async () => {
      const racesCollection = collection(db, "races");
      const racesSnapshot = await getDocs(racesCollection);
      setRaces(
        racesSnapshot.docs
          .map((doc) => doc.data() as Race)
          .sort((a, b) => a.originalOrder - b.originalOrder)
      );
    };
    setLoading(true);
    fetchRaces();
    setLoading(false);
  }, []);

  const handleRaceSelection = (raceId: string) => {
    setSelectedRaces((prevSelectedRaces) => [...prevSelectedRaces, raceId]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedRaces = Array.from(selectedRaces);
    const [movedRace] = reorderedRaces.splice(result.source.index, 1);
    reorderedRaces.splice(result.destination.index, 0, movedRace);

    setSelectedRaces(reorderedRaces);
  };

  const handleSubmit = () => {
    if (selectedRaces.length > 0) {
      nextStep(selectedRaces);
    } else {
      alert("Bitte wählen Sie mindestens eine Rennstrecke aus.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="create-season-wrapper">
      <h1 className="display-1">Select Grand Prix</h1>
      <div className="create-season-race-select-grid">
        <div className="available-races">
          <h2>Available Races</h2>
          <ul className="create-season-races-list">
            {races.map((race) => (
              <li key={race.name.replace(/\s+/g, "-")}>
                <label>
                  <button
                    type="button"
                    onClick={() =>
                      handleRaceSelection(
                        race.name.replace("Grand Prix", "").trim()
                      )
                    }
                    className="btn-primary"
                  >
                    {race.name}
                  </button>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="selected-races">
          <h2>Added Races</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-selected-races">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="create-season-races-list"
                >
                  {selectedRaces.map((raceId, index) => (
                    <Draggable key={`${raceId}-${index}`} draggableId={`${raceId}-${index}`} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="selected-race-item btn-primary"
                        >
                          {raceId}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

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

export default CreateSeasonStep4;
