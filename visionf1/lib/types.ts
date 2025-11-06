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
