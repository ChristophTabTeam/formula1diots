export interface SeasonRace {
  raceId: string;
  isFinished: boolean;
  order: number;
  qualifyingResults: QualifyingResults;
  raceResults: RaceResults;
  hasQualifyingSaved?: boolean;
}

export interface QualifyingResults {
  P1: string;
  P1LapTime: string;
  P2: string;
  P2LapTime: string;
  P3: string;
  P3LapTime: string;
  P4: string;
  P4LapTime: string;
  P5: string;
  P5LapTime: string;
  P6: string;
  P6LapTime: string;
  P7: string;
  P7LapTime: string;
  P8: string;
  P8LapTime: string;
  P9: string;
  P9LapTime: string;
  P10: string;
  P10LapTime: string;
  P11: string;
  P11LapTime: string;
  P12: string;
  P12LapTime: string;
  P13: string;
  P13LapTime: string;
  P14: string;
  P14LapTime: string;
  P15: string;
  P15LapTime: string;
  P16: string;
  P16LapTime: string;
  P17: string;
  P17LapTime: string;
  P18: string;
  P18LapTime: string;
  P19: string;
  P19LapTime: string;
  P20: string;
  P20LapTime: string;
}

export interface RaceResults {
  P1: string;
  P2: string;
  P3: string;
  P4: string;
  P5: string;
  P6: string;
  P7: string;
  P8: string;
  P9: string;
  P10: string;
  P11: string;
  P12: string;
  P13: string;
  P14: string;
  P15: string;
  P16: string;
  P17: string;
  P18: string;
  P19: string;
  P20: string;
  fastestLap: string;
}
