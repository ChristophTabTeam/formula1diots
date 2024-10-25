export interface Race {
  name: string; // Der Name des Rennens (z.B. "Bahrain Grand Prix")
  fullName: string; // Vollständiger Name des Rennens
  pathToTrackMap: string; // Pfad zur Streckenkarte
  pathToCountryFlag: string; // Pfad zur Landesflagge
  threeLetterCode: string; // Ländercode (z.B. "BHR" für Bahrain)
  trackDistance: string; // Distanz der Strecke in km
  raceLaps: number; // Anzahl der Runden
  lapRecord: string; // Rundenrekordzeit
  recordDriverName: string; // Fahrer, der den Rekord hält
  recordYear: number; // Jahr des Rundenrekords
  topSpeed: number; // Höchstgeschwindigkeit auf der Strecke (in km/h)
  turns: number; // Anzahl der Kurven
  elevationInMeter: number; // Höhenunterschied in Metern
  tyreTypes: string[]; // Array mit den verwendeten Reifenmischungen (C1-C5)
}
