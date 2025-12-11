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

  // Flatten data for Plotly
  // We need arrays for x (driver), y (time), and color/text (compound)
  // But Plotly Violin with 'transforms' or simply multiple traces is better for specific coloring per point? 
  // Plotly Violin 'points' attribute doesn't easily support *different* colors for points vs violin body if using single trace.
  // HOWEVER, standard way: One Violin trace per driver? No, that's too many traces.
  // One trace with x=driver_array, y=time_array is best.

  // Actually, to get multiple colors for points (compounds) inside a single driver's violin... that's tricky in single trace.
  // Strategy:
  // 1. Create one Violin trace PER DRIVER to control the violin color (usually team color).
  // 2. BUT the points need to be colored by COMPOUND.
  // 3. AND we want the violin itself to be the driver/team color? Or just generic?
  // User wants "estéticamente lo más parecido a los gráficos de race pace" (which are typically team colored violins).
  // AND "swarm plots" (points) typically colored by compound.

  // This is hard to do in a single trace per driver because `marker.color` applies to all points.
  // Workaround: Use Violin trace for the shape (points=false) and a separate Scatter(mode='markers') trace for the swarm points.
  // We need to construct the X-coordinates for the scatter points manually to simulate "swarm/jitter" or just use strip plot.
  // Plotly Box/Violin handles jitter automatically.

  // Let's try: 
  // Traces for Violins (one per driver, team color, points=false).
  // Traces for Points? No, we can have ONE Scatter trace for ALL points if we map x=driver, y=time. 
  // But standard Scatter doesn't jitter in X. We need jitter.

  // Simpler approach that usually looks good:
  // One Violin trace per driver. 
  // set `points='all'`, `pointpos=0`, `jitter=0.4`.
  // formatting the marker colors array? 
  // Plotly allows an array for `marker.color`.

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

  // Prepare arrays for single Scatter trace + Violin traces
  const violinTraces: any[] = [];
  const scatterX: number[] = [];
  const scatterY: number[] = [];
  const scatterColors: string[] = [];
  const scatterText: string[] = [];

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

    // 2. Accumulate Scatter Points
    driverLaps.forEach(l => {
      // Jitter x: random between -0.3 and 0.3 relative to index
      const jitter = (Math.random() - 0.5) * 0.4;
      scatterX.push(index + jitter);
      scatterY.push(l.time);

      const color = COMPOUND_COLORS[l.compound?.toUpperCase() || ""] || COMPOUND_COLORS.TEST_UNKNOWN;
      scatterColors.push(color);

      const txt = `Lap ${l.lap}<br>${l.compound} (${l.tyreLife} laps)<br>Time: ${formatLapTime(l.time)}`;
      scatterText.push(txt);
    });
  });

  // Combined Scatter Trace
  const scatterTrace = {
    type: 'scatter',
    mode: 'markers',
    x: scatterX,
    y: scatterY,
    text: scatterText,
    hoverinfo: 'text',
    marker: {
      color: scatterColors,
      size: 5,
      opacity: 0.9,
      line: { width: 1, color: '#333' }
    },
    showlegend: false
  };

  const traces = [...violinTraces, scatterTrace];

  return (
    <div className="w-full h-[600px] bg-card rounded-xl border p-1">
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
  );
}
