export interface Player {
    id: string; // Eindeutige ID des Spielers
    firstName: string; // Vorname des Spielers
    lastName: string; // Nachname des Spielers
    email: string; // E-Mail-Adresse des Spielers
    createdAt: Date; // Datum, an dem der Spieler erstellt wurde
    profileImageUrl: string; // URL zum Profilbild des Spielers
    trophies: Array<{
      seasonId: string; // Saison, in der die Trophäe gewonnen wurde
      raceId: string; // Rennen, in dem die Trophäe gewonnen wurde (optional, falls relevant)
      title: string; // Titel der Trophäe (z.B. "Champion", "Best Rookie")
    }>; // Liste der gewonnenen Trophäen
    pointsInSeasons: {
      [seasonId: string]: number; // Punkte des Spielers pro Saison (Schlüssel ist die Season-ID)
    };
    dhlFastestLaps: Array<{
      seasonId: string; // Saison, in der der Spieler die Fastest Lap gewann
      raceId: string; // Rennen, in dem die Fastest Lap erreicht wurde
    }>; // Liste der DHL Fastest Laps
  }