export interface Season {
  id: string; // Eindeutige ID der Saison (z.B. "2024")
  name: string; // Name der Saison (z.B. "2024 Season")
  teams: {
    [teamId: string]: {
      points: number; // Punkte des Teams
      driver1: string | null; // Fahrer 1 ID
      driver2: string | null; // Fahrer 2 ID
    };
  };
  driverPoints: { [driverId: string]: number }; // Fahrer-Punkte (nur die variablen Punkte)
  isActiveSeason: boolean; // Status, ob die Saison aktiv ist
  playerData: {
    [playerId: string]: {
        teamId: string;
        slot: string;
    };
  };
}
