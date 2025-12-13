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

export const WEATHER_OPTIONS = [
    { key: "dry", label: "Dry" },
    { key: "hot", label: "Hot" },
    { key: "wet", label: "Wet" },
    { key: "storm", label: "Storm" },
    { key: "cold", label: "Cold" },
];
