export interface Season {
  id: string; // Eindeutige ID der Saison (z.B. "2024")
  name: string; // Name der Saison (z.B. "2024 Season")
  races: Array<{
    raceId: string; // Die Dokumenten-ID des Rennens (Referenz zu einem Race-Dokument)
    order: number; // Reihenfolge des Rennens in der Saison
    isFinished: boolean; // Status, ob das Rennen beendet ist
  }>;
  teams: {
    [teamId: string]: {
      points: number; // Punkte des Teams
      driver1: string; // Fahrer 1 ID
      driver2: string; // Fahrer 2 ID
    };
  };
  driverPoints: { [driverId: string]: number }; // Fahrer-Punkte (nur die variablen Punkte)
  isActiveSeason: boolean; // Status, ob die Saison aktiv ist
}
