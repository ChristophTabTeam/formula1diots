import { useState } from "react";
import { SeasonRules } from "../../../interfaces/SeasonRules";
import { defaultSeasonRules } from "./SeasonRulesDefault";

export function CreateSeasonStep3({ nextStep, previousStep }: any) {
  const [seasonRules, setSeasonRules] =
    useState<SeasonRules>(defaultSeasonRules);
  const [activeMenu, setActiveMenu] = useState("lobbyOptions");

  const handleInputChange = (
    section: keyof SeasonRules,
    key: string,
    value: any
  ) => {
    setSeasonRules((prevRules) => ({
      ...prevRules,
      [section]: {
        ...((prevRules[section] as Record<string, any>) || {}),
        [key]: value,
      },
    }));
  };

  const handleSubmit = () => {
    nextStep(true, {}, seasonRules); // Übergibt includeDrivers, updatedTeams und seasonRules
  };

  return (
    <div className="create-season-wrapper justify-top">
      <h1 className="display-2">Season Rules Setup</h1>
      <div className="season-rules-wrapper container">
        <div className="season-rules-menu">
          <button
            onClick={() => setActiveMenu("lobbyOptions")}
            className="season-rules-menu-item"
          >
            <p>Lobby Options</p>
            <span className="icon-16pt">chevron_right</span>
          </button>
          <button
            onClick={() => setActiveMenu("aiSettings")}
            className="season-rules-menu-item"
          >
            <p>AI Settings</p>
            <span className="icon-16pt">chevron_right</span>
          </button>
          <button
            onClick={() => setActiveMenu("weekendStructure")}
            className="season-rules-menu-item"
          >
            <p>Weekend Structure</p>
            <span className="icon-16pt">chevron_right</span>
          </button>
          <button
            onClick={() => setActiveMenu("weatherAndTime")}
            className="season-rules-menu-item"
          >
            <p>Weather and Time</p>
            <span className="icon-16pt">chevron_right</span>
          </button>
          <button
            onClick={() => setActiveMenu("rulesAndFlags")}
            className="season-rules-menu-item"
          >
            <p>Rules and Flags</p>
            <span className="icon-16pt">chevron_right</span>
          </button>
          <button
            onClick={() => setActiveMenu("simulationSettings")}
            className="season-rules-menu-item"
          >
            <p>Simulation Settings</p>
            <span className="icon-16pt">chevron_right</span>
          </button>
          <button
            onClick={() => setActiveMenu("collisionSettings")}
            className="season-rules-menu-item"
          >
            <p>Collision Settings</p>
            <span className="icon-16pt">chevron_right</span>
          </button>
        </div>
        <div className="season-rules-content">
          {activeMenu === "lobbyOptions" && (
            <div className="season-rules-section">
              <h2>Lobby Options</h2>
              <div className="season-rules-section-content">
                <label>
                  Car Category
                  <select
                    value={seasonRules.lobbyOptions.carCategory}
                    onChange={(e) =>
                      handleInputChange(
                        "lobbyOptions",
                        "carCategory",
                        e.target.value
                      )
                    }
                  >
                    <option value="Official">Official</option>
                    <option value="Custom">Custom</option>
                  </select>
                </label>
                <label>
                  Car Setup
                  <select
                    value={seasonRules.lobbyOptions.carSetup}
                    onChange={(e) =>
                      handleInputChange(
                        "lobbyOptions",
                        "carSetup",
                        e.target.value
                      )
                    }
                  >
                    <option value="Full">Full</option>
                    <option value="None">None</option>
                  </select>
                </label>
              </div>
            </div>
          )}
          {activeMenu === "aiSettings" && (
            <div className="season-rules-section">
              <h2>AI Settings</h2>
              <div className="season-rules-section-content">
                <label className="switch-label">
                  AI On
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.aiSettings.aiOn}
                      onChange={(e) =>
                        handleInputChange(
                          "aiSettings",
                          "aiOn",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>

                <label className="slider-label">
                  AI Difficulty
                  <div className="slider-value-wrapper">
                    <input
                      type="range"
                      min="30"
                      max="110"
                      value={seasonRules.aiSettings.aiDifficulty}
                      onChange={(e) =>
                        handleInputChange(
                          "aiSettings",
                          "aiDifficulty",
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="slider"
                    />
                    <span className="slider-value">
                      {seasonRules.aiSettings.aiDifficulty}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
          {activeMenu === "weekendStructure" && (
            <div className="season-rules-section">
              <h2>Weekend Structure</h2>
              <div className="season-rules-section-content">
                <label>
                  Practice Format
                  <select
                    value={seasonRules.weekendStructure.practiceFormat}
                    onChange={(e) =>
                      handleInputChange(
                        "weekendStructure",
                        "practiceFormat",
                        e.target.value
                      )
                    }
                  >
                    <option value="Off">Off</option>
                    <option value="Single Session">Single Session</option>
                  </select>
                </label>
                <label>
                  Qualifying Format
                  <select
                    value={seasonRules.weekendStructure.qualifyingFormat}
                    onChange={(e) =>
                      handleInputChange(
                        "weekendStructure",
                        "qualifyingFormat",
                        e.target.value
                      )
                    }
                  >
                    <option value="None">None</option>
                    <option value="One Shot">One Shot</option>
                    <option value="Short">Short</option>
                    <option value="Full">Full</option>
                  </select>
                </label>
                <label>
                  Session Length
                  <select
                    value={seasonRules.weekendStructure.sesstionLenth}
                    onChange={(e) =>
                      handleInputChange(
                        "weekendStructure",
                        "sesstionLenth",
                        e.target.value
                      )
                    }
                  >
                    <option value="Quickfire (3 Laps)">
                      Quickfire (3 Laps)
                    </option>
                    <option value="Very Short (5 Laps)">
                      Very Short (5 Laps)
                    </option>
                    <option value="Short (25%)">Short (25%)</option>
                    <option value="Medium (35%)">Medium (35%)</option>
                    <option value="Long (50%)">Long (50%)</option>
                    <option value="Full (100%)">Full (100%)</option>
                  </select>
                </label>
              </div>
            </div>
          )}
          {activeMenu === "weatherAndTime" && (
            <div className="season-rules-section">
              <h2>Weather and Time</h2>
              <div className="season-rules-section-content">
                <label>
                  Forcast Accuracy
                  <select
                    value={seasonRules.weatherAndTime.forcastAccuracy}
                    onChange={(e) =>
                      handleInputChange(
                        "weatherAndTime",
                        "forcastAccuracy",
                        e.target.value
                      )
                    }
                  >
                    <option value="Perfect">Perfect</option>
                    <option value="Approximate">Approximate</option>
                  </select>
                </label>
              </div>
            </div>
          )}
          {activeMenu === "rulesAndFlags" && (
            <div className="season-rules-section">
              <h2>Rules and Flags</h2>
              <div className="season-rules-section-content">
                <label className="switch-label">
                  Rules and Flags
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.rulesAndFlags.rulesAndFlags}
                      onChange={(e) =>
                        handleInputChange(
                          "rulesAndFlags",
                          "rulesAndFlags",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>
                <label>
                  Corner Cutting
                  <select
                    value={seasonRules.rulesAndFlags.cornerCutting}
                    onChange={(e) =>
                      handleInputChange(
                        "rulesAndFlags",
                        "cornerCutting",
                        e.target.value
                      )
                    }
                  >
                    <option value="Regular">Regular</option>
                    <option value="Strict">Strict</option>
                  </select>
                </label>
                <label className="switch-label">
                  Parc Ferme
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.rulesAndFlags.parcFerme}
                      onChange={(e) =>
                        handleInputChange(
                          "rulesAndFlags",
                          "parcFerme",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>
                <label>
                  Pit Stop Experience
                  <select
                    value={seasonRules.rulesAndFlags.pitStopExperience}
                    onChange={(e) =>
                      handleInputChange(
                        "rulesAndFlags",
                        "pitStopExperience",
                        e.target.value
                      )
                    }
                  >
                    <option value="Broadcast">Broadcast</option>
                    <option value="Immersive">Immersive</option>
                  </select>
                </label>
                <label>
                  Safety Car
                  <select
                    value={seasonRules.rulesAndFlags.safetyCar}
                    onChange={(e) =>
                      handleInputChange(
                        "rulesAndFlags",
                        "safetyCar",
                        e.target.value
                      )
                    }
                  >
                    <option value="Off">Off</option>
                    <option value="Reduced">Reduced</option>
                    <option value="Standard">Standard</option>
                    <option value="Increased">Increased</option>
                  </select>
                </label>
                <label>
                  Safety Car Experience
                  <select
                    value={seasonRules.rulesAndFlags.safetyCarExperience}
                    onChange={(e) =>
                      handleInputChange(
                        "rulesAndFlags",
                        "safetyCarExperience",
                        e.target.value
                      )
                    }
                  >
                    <option value="Broadcast">Broadcast</option>
                    <option value="Immersive">Immersive</option>
                  </select>
                </label>
                <label className="switch-label">
                  Formation Lap
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.rulesAndFlags.formationLap}
                      onChange={(e) =>
                        handleInputChange(
                          "rulesAndFlags",
                          "formationLap",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>
                <label>
                  Formation Lap Experience
                  <select
                    value={seasonRules.rulesAndFlags.formationLapExperience}
                    onChange={(e) =>
                      handleInputChange(
                        "rulesAndFlags",
                        "formationLapExperience",
                        e.target.value
                      )
                    }
                  >
                    <option value="Broadcast">Broadcast</option>
                    <option value="Immersive">Immersive</option>
                  </select>
                </label>
                <label>
                  Red Flags
                  <select
                    value={seasonRules.rulesAndFlags.redFlags}
                    onChange={(e) =>
                      handleInputChange(
                        "rulesAndFlags",
                        "redFlags",
                        e.target.value
                      )
                    }
                  >
                    <option value="Off">Off</option>
                    <option value="Reduced">Reduced</option>
                    <option value="Standard">Standard</option>
                    <option value="Increased">Increased</option>
                  </select>
                </label>
                <label className="switch-label">
                  Affects Licence Level
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.rulesAndFlags.affectsLicenceLevel}
                      onChange={(e) =>
                        handleInputChange(
                          "rulesAndFlags",
                          "affectsLicenceLevel",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>
              </div>
            </div>
          )}
          {activeMenu === "simulationSettings" && (
            <div className="season-rules-section">
              <h2>Simulation Settings</h2>
              <div className="season-rules-section-content">
                <label className="switch-label">
                  Equal Performance
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.simulationSettings.equalPerformance}
                      onChange={(e) =>
                        handleInputChange(
                          "simulationSettings",
                          "equalPerformance",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>
                <label>
                  Recovery Mode
                  <select
                    value={seasonRules.simulationSettings.recoveryMode}
                    onChange={(e) =>
                      handleInputChange(
                        "simulationSettings",
                        "recoveryMode",
                        e.target.value
                      )
                    }
                  >
                    <option value="None">None</option>
                    <option value="Auto-Recovery">Auto-Recovery</option>
                  </select>
                </label>
                <label>
                  Surface Type
                  <select
                    value={seasonRules.simulationSettings.surfaceType}
                    onChange={(e) =>
                      handleInputChange(
                        "simulationSettings",
                        "surfaceType",
                        e.target.value
                      )
                    }
                  >
                    <option value="Simplified">Simplified</option>
                    <option value="Realistic">Realistic</option>
                  </select>
                </label>
                <label>
                  Low Fuel Mode
                  <select
                    value={seasonRules.simulationSettings.lowFuelMode}
                    onChange={(e) =>
                      handleInputChange(
                        "simulationSettings",
                        "lowFuelMode",
                        e.target.value
                      )
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Hard">Hard</option>
                  </select>
                </label>
                <label>
                  Race Starts
                  <select
                    value={seasonRules.simulationSettings.raceStarts}
                    onChange={(e) =>
                      handleInputChange(
                        "simulationSettings",
                        "raceStarts",
                        e.target.value
                      )
                    }
                  >
                    <option value="Manual">Manual</option>
                    <option value="Assisted">Assisted</option>
                  </select>
                </label>
                <label>
                  Tyre Temperature
                  <select
                    value={seasonRules.simulationSettings.tyreTemperature}
                    onChange={(e) =>
                      handleInputChange(
                        "simulationSettings",
                        "tyreTemperature",
                        e.target.value
                      )
                    }
                  >
                    <option value="Surface Only">Surface Only</option>
                    <option value="Surface & Carcass">Surface & Carcass</option>
                  </select>
                </label>
                <label className="switch-label">
                  Pit Lane Tyre Simulation
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.simulationSettings.pitLaneTyreSim}
                      onChange={(e) =>
                        handleInputChange(
                          "simulationSettings",
                          "pitLaneTyreSim",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>
                <label className="switch-label">
                  Unsafe Release
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.simulationSettings.unsafeRelease}
                      onChange={(e) =>
                        handleInputChange(
                          "simulationSettings",
                          "unsafeRelease",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>
                <label>
                  Car Damage
                  <select
                    value={seasonRules.simulationSettings.carDamage}
                    onChange={(e) =>
                      handleInputChange(
                        "simulationSettings",
                        "carDamage",
                        e.target.value
                      )
                    }
                  >
                    <option value="Off">Off</option>
                    <option value="Reduced">Reduced</option>
                    <option value="Standard">Standard</option>
                    <option value="Simulation">Simulation</option>
                  </select>
                </label>
                <label>
                  Car Damage Rate
                  <select
                    value={seasonRules.simulationSettings.carDamageRate}
                    onChange={(e) =>
                      handleInputChange(
                        "simulationSettings",
                        "carDamageRate",
                        e.target.value
                      )
                    }
                  >
                    <option value="Reduced">Reduced</option>
                    <option value="Standard">Standard</option>
                    <option value="Simulation">Simulation</option>
                  </select>
                </label>
              </div>
            </div>
          )}
          {activeMenu === "collisionSettings" && (
            <div className="season-rules-section">
              <h2>Collision Settings</h2>
              <div className="season-rules-section-content">
                <label>
                  Collisions
                  <select
                    value={seasonRules.collisionSettings.collisions}
                    onChange={(e) =>
                      handleInputChange(
                        "collisionSettings",
                        "collisions",
                        e.target.value
                      )
                    }
                  >
                    <option value="Off">Off</option>
                    <option value="On">On</option>
                    <option value="Player-to-Player Off">
                      Player-to-Player Off
                    </option>
                  </select>
                </label>
                <label className="switch-label">
                  Off For First Lap
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.collisionSettings.offForFirstLap}
                      onChange={(e) =>
                        handleInputChange(
                          "collisionSettings",
                          "offForFirstLap",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>
                <label className="switch-label">
                  Off For Griefing
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={seasonRules.collisionSettings.offForGriefing}
                      onChange={(e) =>
                        handleInputChange(
                          "collisionSettings",
                          "offForGriefing",
                          e.target.checked
                        )
                      }
                    />
                    <span className="switch-span"></span>
                  </label>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="btn-wrapper">
        <button onClick={previousStep} className="btn-primary">
          Back
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  );
}
