export type Driver = {
  driverUrl: string
  firstName: string
  lastName: string
  driverCode: string
  driverNumber: string
  driverNationality: string
  nationalityCode2: string
  nationalityCode3: string
  team: string
  teamCode: string
  teamColor: string
}

export type Race = {
  event_id: string;
  season: number;
  round: number;
  event_name: string;
  country: string;
  country_code: string;
  location: string;
  circuit_name: string;
  circuit_id: string;
  event_date: string;
  event_status: string;
  driver_codes: string[];
  driver_names: string[];
  team_colors: string[];
};

export type DriverStanding = {
  position: number
  driver: string
  driverCode: string
  nationality: string
  nationalityCode: string
  team: string
  teamCode: string
  points: number
}

export type TeamStanding = {
  position: number
  team: string
  teamCode: string
  nationality: string
  nationalityCode: string
  points: number
}

export type Season = number;

export type EventSummary = {
  event_id: string;
  season: number;
  round: number;
  event_name: string;
  event_date: string;
  event_status: string;
};

export type RacePaceRow = {
  driver: string;
  driver_first_name: string;
  driver_last_name: string;
  driver_position: number;
  driver_color: string;
  team: string;
  team_name: string;
  team_color: string;
  race_pace_id: string;
  race_pace_position: number;
  avg_laptime: number;
  std_laptime: number;
  event: string;
  season: number;
  round: number;
};

export type RacePrediction = {
  driver: string;
  team: string;
  predicted_position: number;
  rank: number;
};

export type RacePredictionRow = {
  driverCode: string;
  driverFirstName: string;
  driverLastName: string;
  teamName: string;
  teamCode: string;
  predictedPosition: number;
  rank: number;
};

export type CleanAirRacePaceRow = {
  driver: string;
  driver_first_name: string;
  driver_last_name: string;
  driver_position: number;
  driver_color: string;
  team: string;
  team_name: string;
  team_color: string;
  clean_air_race_pace_id: string;
  clean_air_race_pace_position: number;
  avg_laptime_clean_air: number;
  std_laptime_clean_air: number;
  clean_air_laps_count: number;
  event: string;
  season: number;
  round: number;
};

export type Lap = {
  lap_number: number;
  lap_time: number;
  compound: string | null;
  tyre_life: number | null;
};

export type LapTimeDistributionRow = {
  driver: string;
  driver_first_name: string;
  driver_last_name: string;
  driver_position: number | null;
  driver_color: string;
  team: string | null;
  team_name: string | null;
  team_color: string;
  lap_time_distribution_id: string;
  race_pace_position: number | null;
  avg_laptime: number | null;
  std_laptime: number | null;
  laps: Lap[];
  event: string;
  season: number;
  round: number;
};
