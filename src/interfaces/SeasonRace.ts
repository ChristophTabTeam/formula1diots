export interface SeasonRace {
  raceId: string;
  isFinished: boolean;
  order: number;
  qualifyingResults: QualifyingResults;
  raceResults: RaceResults;
}

export interface QualifyingResults {
  p1: string;
  p1LapTime: string;
  p2: string;
  p2LapTime: string;
  p3: string;
  p3LapTime: string;
  p4: string;
  p4LapTime: string;
  p5: string;
  p5LapTime: string;
  p6: string;
  p6LapTime: string;
  p7: string;
  p7LapTime: string;
  p8: string;
  p8LapTime: string;
  p9: string;
  p9LapTime: string;
  p10: string;
  p10LapTime: string;
  p11: string;
  p11LapTime: string;
  p12: string;
  p12LapTime: string;
  p13: string;
  p13LapTime: string;
  p14: string;
  p14LapTime: string;
  p15: string;
  p15LapTime: string;
  p16: string;
  p16LapTime: string;
  p17: string;
  p17LapTime: string;
  p18: string;
  p18LapTime: string;
  p19: string;
  p19LapTime: string;
  p20: string;
  p20LapTime: string;
}

export interface RaceResults {
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
  p7: string;
  p8: string;
  p9: string;
  p10: string;
  p11: string;
  p12: string;
  p13: string;
  p14: string;
  p15: string;
  p16: string;
  p17: string;
  p18: string;
  p19: string;
  p20: string;
  fastestLap: string;
}
