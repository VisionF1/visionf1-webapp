"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { LapTimeDistributionRow } from "@/lib/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ViolinSwarmPlotProps {
  data: LapTimeDistributionRow[];
}

const COMPOUND_COLORS: Record<string, string> = {
  SOFT: "#FF3333", // Red
  MEDIUM: "#FFE933", // Yellow
  HARD: "#FFFFFF", // White
  INTERMEDIATE: "#39B54A", // Green
  WET: "#0072BB", // Blue
  TEST_UNKNOWN: "#CCCCCC",
};

export default function ViolinSwarmPlot({ data }: ViolinSwarmPlotProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sortedData = [...data].sort((a, b) => (a.race_pace_position || 99) - (b.race_pace_position || 99));

  // Calculate Min/Max for custom ticks
  const allTimes = sortedData.flatMap(d => d.laps.map(l => l.lap_time));
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);

  // Generate ticks
  const range = maxTime - minTime;
  const step = range > 10 ? 1 : range > 5 ? 0.5 : 0.2;

  const viewMin = minTime - step;
  const viewMax = maxTime + step;

  const tickVals: number[] = [];
  for (let t = Math.floor(viewMin); t <= Math.ceil(viewMax); t += step) {
    if (t >= viewMin && t <= viewMax) {
      tickVals.push(t);
    }
  }

  const formatLapTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const millis = Math.round((sec - minutes * 60 - seconds) * 1000);
    const secStr = seconds.toString().padStart(2, "0");
    const millisStr = millis.toString().padStart(3, "0");
    return `${minutes}:${secStr}.${millisStr}`;
  };

  const tickText = tickVals.map(formatLapTime);

  // Prepare arrays for Scatter traces + Violin traces
  const violinTraces: any[] = [];
  const scatterTraces: any[] = [];
  const scatterX: number[] = [];
  const scatterY: number[] = [];
  const scatterColors: string[] = [];
  const scatterCustomData: Array<{
    driverFullName: string;
    teamName: string;
    teamColor: string;
    lap: number;
    compound: string;
    compoundColor: string;
    tyreLife: number;
    lapTime: string;
  }> = [];

  // Map drivers to numeric indices for custom X-axis
  const driverNames = sortedData.map(d => d.driver);
  const driverIndices = driverNames.map((_, i) => i);

  sortedData.forEach((driverData, index) => {
    const driverLaps = driverData.laps.map(l => ({
      time: l.lap_time,
      compound: l.compound,
      lap: l.lap_number,
      tyreLife: l.tyre_life
    }));

    const teamColor = driverData.team_color || "#777777";
    const driverName = driverData.driver;
    const driverFullName = `${driverData.driver_first_name} ${driverData.driver_last_name}`;
    const teamName = driverData.team_name || "Unknown";

    // 1. Violin Trace (Shape only)
    violinTraces.push({
      type: 'violin',
      x: Array(driverLaps.length).fill(index), // Use numeric index
      y: driverLaps.map(l => l.time),
      legendgroup: driverName,
      name: driverName,
      line: { color: teamColor, width: 1.5 },
      fillcolor: `${teamColor}40`,
      points: false, // Disable built-in points
      box: { visible: true, width: 0.1 },
      meanline: { visible: true },
      showlegend: false,
      hoverinfo: 'y', // Show stats on hover? Or none? User focuses on points usually.
      width: 0.8, // Adjust width relative to index spacing (1.0)
      // spanmode: 'hard', // Removed to prevent clipping
    });

    // 2. Accumulate Scatter Points with custom data
    driverLaps.forEach(l => {
      const jitter = (Math.random() - 0.5) * 0.4;
      scatterX.push(index + jitter);
      scatterY.push(l.time);

      const compoundColor = COMPOUND_COLORS[l.compound?.toUpperCase() || ""] || COMPOUND_COLORS.TEST_UNKNOWN;
      scatterColors.push(compoundColor);

      scatterCustomData.push({
        driverFullName,
        teamName,
        teamColor,
        lap: l.lap,
        compound: l.compound || "Unknown",
        compoundColor,
        tyreLife: l.tyreLife || 0,
        lapTime: formatLapTime(l.time),
      });
    });

    // Create scatter trace for this driver (to have per-driver hover styling)
    if (scatterX.length > 0) {
      const startIdx = scatterX.length - driverLaps.length;
      const driverScatterX = scatterX.slice(startIdx);
      const driverScatterY = scatterY.slice(startIdx);
      const driverScatterColors = scatterColors.slice(startIdx);
      const driverCustomData = scatterCustomData.slice(startIdx);

      scatterTraces.push({
        type: 'scatter',
        mode: 'markers',
        x: driverScatterX,
        y: driverScatterY,
        customdata: driverCustomData,
        hovertemplate:
          '<b>%{customdata.driverFullName}</b><br>' +
          '%{customdata.teamName}<br><br>' +
          'Lap %{customdata.lap}<br>' +
          '%{customdata.compound} (%{customdata.tyreLife} laps)<br>' +
          'Time: %{customdata.lapTime}' +
          '<extra></extra>',
        hoverlabel: {
          bgcolor: isDark ? '#1e293b' : '#ffffff',
          bordercolor: teamColor,
          font: {
            family: 'Formula1-Display-Regular, sans-serif',
            size: 12,
            color: isDark ? '#f1f5f9' : '#1e293b',
          },
          namelength: 0,
        },
        marker: {
          color: driverScatterColors,
          size: 5,
          opacity: 0.9,
          line: { width: 1, color: '#333' }
        },
        showlegend: false
      });
    }
  });

  const traces = [...violinTraces, ...scatterTraces];

  // Calculate min-width based on number of drivers (50px per driver minimum)
  const chartMinWidth = Math.max(700, sortedData.length * 50);

  return (
    <div className="w-full h-[600px] bg-card rounded-xl border p-1 overflow-x-auto">
      <div style={{ minWidth: `${chartMinWidth}px`, height: '100%' }}>
        <Plot
          data={traces}
          layout={{
            autosize: true,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
              family: 'Formula1-Display-Regular, sans-serif',
            },
            hoverlabel: {
              font: {
                family: 'Formula1-Display-Regular, sans-serif',
              },
            },
            yaxis: {
              gridcolor: isDark ? '#333' : '#ddd',
              zerolinecolor: isDark ? '#333' : '#ddd',
              tickfont: {
                color: isDark ? '#aaa' : '#333',
                family: 'Formula1-Display-Regular, sans-serif',
              },
              tickmode: 'array',
              tickvals: tickVals,
              ticktext: tickText,
              range: [minTime - (range * 0.1), maxTime + (range * 0.1)]
            },
            xaxis: {
              tickfont: {
                color: isDark ? '#aaa' : '#333',
                family: 'Formula1-Display-Regular, sans-serif',
              },
              gridcolor: isDark ? '#333' : '#ddd',
              tickmode: 'array',
              tickvals: driverIndices,
              ticktext: driverNames,
              //tickangle: -45,
              range: [-0.5, driverIndices.length - 0.5]
            },
            hovermode: 'closest',
            margin: { t: 10, r: 10, l: 80, b: 80 }
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
          config={{ displayModeBar: false, scrollZoom: true }}
        />

        <div className="flex justify-center -mt-10">
          <span className="text-sm text-muted-foreground font-medium">Lap Times per Driver and Compound</span>
        </div>
      </div>
    </div>
  );
}
