import { useState } from "react";

interface CreateSeasonStep1Props {
  nextStep: (seasonName: string) => void;
}

export function CreateSeasonStep1({ nextStep }: CreateSeasonStep1Props) {
  const [seasonName, setSeasonName] = useState("");

  const handleSubmit = () => {
    if (seasonName) {
      nextStep(seasonName); // Sende den Namen an den nächsten Schritt
    } else {
      alert("Bitte geben Sie einen Namen für die Saison ein.");
    }
  };

  return (
    <div className="create-season-wrapper">
      <div className="create-season-inner-wrapper">
        <h1 className="display-1">Name the Season</h1>
        <input
          type="text"
          value={seasonName}
          onChange={(e) => setSeasonName(e.target.value)}
          placeholder="Season Name"
          className="create-season-input season-name-input"
        />
        <button onClick={handleSubmit} className="btn-primary">Next</button>
      </div>
    </div>
  );
}
