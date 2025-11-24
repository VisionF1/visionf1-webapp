export const CIRCUIT_TYPE_MAP: Record<string, string> = {
    // Street/urban circuits
    "Monaco Grand Prix": "street",
    "Azerbaijan Grand Prix": "street",
    "Singapore Grand Prix": "street",
    "Las Vegas Grand Prix": "street",
    "Miami Grand Prix": "street",
    "Saudi Arabian Grand Prix": "street",
    "Australian Grand Prix": "street",

    // Power tracks
    "Italian Grand Prix": "power",
    "Belgian Grand Prix": "power",
    "British Grand Prix": "power",
    "Canadian Grand Prix": "power",

    // Hybrids (default)
    "Bahrain Grand Prix": "hybrid",
    "Spanish Grand Prix": "hybrid",
    "Hungarian Grand Prix": "hybrid",
    "Austrian Grand Prix": "hybrid",
    "Emilia Romagna Grand Prix": "hybrid",
    "French Grand Prix": "hybrid",
    "Portuguese Grand Prix": "hybrid",
    "Turkish Grand Prix": "hybrid",
    "United States Grand Prix": "hybrid",
    "Mexico City Grand Prix": "hybrid",
    "São Paulo Grand Prix": "hybrid",
    "Japanese Grand Prix": "hybrid",
    "Qatar Grand Prix": "hybrid",
    "Abu Dhabi Grand Prix": "hybrid",
    "Dutch Grand Prix": "hybrid",
};

export const WEATHER_SCENARIOS = {
    "dry": {
        label: "Dry (Ideal)",
        session_air_temp: 26.0,
        session_track_temp: 35.0,
        session_humidity: 45.0,
        session_rainfall: 0,
        description: "Dry and ideal conditions"
    },
    "hot": {
        label: "Hot (Thermal Stress)",
        session_air_temp: 35.0,
        session_track_temp: 50.0,
        session_humidity: 70.0,
        session_rainfall: 0,
        description: "Very hot conditions (thermal stress)"
    },
    "wet": {
        label: "Wet (Light Rain)",
        session_air_temp: 18.0,
        session_track_temp: 22.0,
        session_humidity: 85.0,
        session_rainfall: 1,
        description: "Wet conditions (light rain)"
    },
    "storm": {
        label: "Storm (Extreme)",
        session_air_temp: 15.0,
        session_track_temp: 18.0,
        session_humidity: 95.0,
        session_rainfall: 1,
        description: "Extreme conditions (storm)"
    },
    "cold": {
        label: "Cold (Winter)",
        session_air_temp: 12.0,
        session_track_temp: 15.0,
        session_humidity: 60.0,
        session_rainfall: 0,
        description: "Cold conditions (winter)"
    }
};
