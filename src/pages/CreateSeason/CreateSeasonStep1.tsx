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
    <div>
      <h1>Wie soll die Saison heißen?</h1>
      <input
        type="text"
        value={seasonName}
        onChange={(e) => setSeasonName(e.target.value)}
        placeholder="Saison Name"
      />
      <button onClick={handleSubmit}>Weiter</button>
    </div>
  );
}
