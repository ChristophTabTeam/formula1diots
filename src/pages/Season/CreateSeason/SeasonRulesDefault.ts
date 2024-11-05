import { SeasonRules } from "../../../interfaces/SeasonRules";

export const defaultSeasonRules: SeasonRules = {
    id: "",
    seasonId: "",
    lobbyOptions: {
      carCategory: "Official",
      carSetup: "Full",
    },
    aiSettings: {
      aiOn: true,
      aiDifficulty: 85,
    },
    weekendStructure: {
      practiceFormat: "Single Session",
      qualifyingFormat: "Short",
      sesstionLenth: "Medium (35%)",
    },
    weatherAndTime: {
      forcastAccuracy: "Perfect",
    },
    rulesAndFlags: {
      rulesAndFlags: true,
      cornerCutting: "Strict",
      parcFerme: false,
      pitStopExperience: "Immersive",
      safetyCar: "Standard",
      safetyCarExperience: "Immersive",
      formationLap: true,
      formationLapExperience: "Immersive",
      redFlags: "Standard",
      affectsLicenceLevel: false,
    },
    simulationSettings: {
      equalPerformance: false,
      recoveryMode: "None",
      surfaceType: "Realistic",
      lowFuelMode: "Easy",
      raceStarts: "Manual",
      tyreTemperature: "Surface & Carcass",
      pitLaneTyreSim: true,
      unsafeRelease: true,
      carDamage: "Simulation",
      carDamageRate: "Simulation",
    },
    collisionSettings: {
      collisions: "On",
      offForFirstLap: false,
      offForGriefing: false,
    },
  };