import React from "react";
import f1Logo from "../assets/F1.svg";
// import { collection, setDoc, doc } from 'firebase/firestore';
// import { db } from "../firebase/firebaseConfig";
// import drivers from '../data/drivers.json';  // Der Pfad zu deiner JSON-Datei mit Fahrerdaten
// import teams from '../data/teams.json';

const Home: React.FC = () => {

  return (
    <div className="container">
      <div className="home-header">
        <div className="home-headline-wraper">
          <h1 className="display-1">
            <img src={f1Logo} className="f1-logo-home" />
            Formula 1diots
          </h1>
          <h2 className="display-4">
            Season 1
          </h2>
        </div>
        <div className="home-race-overview-wrapper">
            <div className="last-next-race-wrapper">
              <h3 className="display-6">
                Last Race: @GetRaceRame(GetLastSeasonRace().RaceId)
              </h3>
              <a href="/" className="button-primary">
                Results
              </a>
            </div>
            <div className="last-next-race-wrapper">
              <h3 className="display-6">
                Next Race: @GetRaceRame(GetNextSeasonRace().RaceId)
              </h3>
              <a href="/racing" className="button-primary">
                To Race
              </a>
            </div>
        </div>
      </div>
      <div className="home-wrapper">
        <div>
          <h3 className="display-6">Driver Standings</h3>
          <div className="table-wrapper">
            <div className="table-mask">
              <table className="leaderboard-table">
                <tr>
                  <th>Pos.</th>
                  <th>Fahrer</th>
                  <th>Team</th>
                  <th>Punkte</th>
                </tr>
                <tr>
                  <td>@(DriverRankings.IndexOf(d) + 1)</td>
                  <td>@GetDriverNameById(d.DriverId)</td>
                  <td>@GetTeamNameById(d.TeamId)</td>
                  <td>@d.Points</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div>
          <h3 className="display-6">Team Standings</h3>
          <div className="table-wrapper">
            <table className="leaderboard-table">
              <tr>
                <th>Pos.</th>
                <th>Team</th>
                <th>Punkte</th>
              </tr>
              <tr>
                <td>@(TeamRankings.IndexOf(t) + 1)</td>
                <td>@GetTeamNameById(t.TeamId)</td>
                <td>@t.Points</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
