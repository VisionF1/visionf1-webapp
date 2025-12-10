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

  // Prepare arrays
  const drivers: string[] = [];
  const times: number[] = [];
  const compounds: string[] = [];
  const texts: string[] = [];
  const pointColors: string[] = [];
  const violinColors: string[] = []; // Not used if grouping by x

  // We will make ONE trace that contains everything?
  // If we want different violin colors (by team), we strictly need one trace per group (driver) OR use `transforms`.
  // Let's use one trace per driver. It's clean for <30 drivers.

  const traces: any[] = sortedData.map((driverData) => {
    // Extract laps for this driver
    const driverLaps = driverData.laps.map(l => ({
      time: l.lap_time,
      compound: l.compound,
      lap: l.lap_number,
      tyreLife: l.tyre_life
    }));

    const driverName = driverData.driver;
    const teamColor = driverData.team_color || "#777777";

    return {
      type: 'violin',
      x: Array(driverLaps.length).fill(driverName),
      y: driverLaps.map(l => l.time),
      text: driverLaps.map(l => `Lap ${l.lap}<br>${l.compound} (${l.tyreLife} laps)`),
      legendgroup: driverName,
      scalegroup: 'race', // Standardize width across violins
      name: driverName,
      box: {
        visible: true
      },
      line: {
        color: teamColor,
      },
      meanline: {
        visible: true
      },
      points: 'all',
      jitter: 0.5,
      pointpos: 0,
      marker: {
        size: 5,
        // Map individual point colors
        color: driverLaps.map(l => COMPOUND_COLORS[l.compound?.toUpperCase() || ""] || COMPOUND_COLORS.TEST_UNKNOWN),
        opacity: 0.8,
        line: {
          width: 1,
          color: '#333'
        }
      },
      fillcolor: `${teamColor}40`, // Add transparency (hex + 40 alpha approx 25%)
      showlegend: false
    };
  });

  return (
    <div className="w-full h-[600px] bg-card rounded-xl border p-4">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          title: {
            text: 'Lap Time Distributions',
            font: { color: isDark ? '#fff' : '#000' }
          },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          yaxis: {
            title: 'Lap Time (s)',
            gridcolor: isDark ? '#333' : '#ddd',
            zerolinecolor: isDark ? '#333' : '#ddd',
            tickfont: { color: isDark ? '#aaa' : '#333' },
            titlefont: { color: isDark ? '#aaa' : '#333' }
          },
          xaxis: {
            tickfont: { color: isDark ? '#aaa' : '#333' },
            gridcolor: isDark ? '#333' : '#ddd',
          },
          hovermode: 'closest',
          margin: { t: 40, r: 20, l: 60, b: 40 }
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
