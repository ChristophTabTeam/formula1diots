export interface SeasonRules {
    id: string;
    seasonId: string;
    lobbyOptions: LobbyOptions;
    aiSettings: AiSettings;
    weekendStructure: WeekendStructure;
    weatherAndTime: WeatherAndTime;
    rulesAndFlags: RulesAndFlags;
    simulationSettings: SimulationSettings;
    collisionSettings: CollisionSettings;
}

interface LobbyOptions {
    carCategory: string;
    carSetup: string;
}

interface AiSettings {
    aiOn: boolean;
    aiDifficulty: number;
}

interface WeekendStructure {
    practiceFormat: string;
    qualifyingFormat: string;
    sesstionLenth: string;
}

interface WeatherAndTime {
    forcastAccuracy: string;
}

interface RulesAndFlags {
    rulesAndFlags: boolean;
    cornerCutting: string;
    parcFerme: boolean;
    pitStopExperience: string;
    safetyCar: string;
    safetyCarExperience: string;
    formationLap: boolean;
    formationLapExperience: string;
    redFlags: string;
    affectsLicenceLevel: boolean;
}

interface SimulationSettings {
    equalPerformance: boolean;
    recoveryMode: string;
    surfaceType: string;
    lowFuelMode: string;
    raceStarts: string;
    tyreTemperature: string;
    pitLaneTyreSim: boolean;
    unsafeRelease: boolean;
    carDamage: string;
    carDamageRate: string;
}

interface CollisionSettings {
    collisions: string;
    offForFirstLap: boolean;
    offForGriefing: boolean;
}