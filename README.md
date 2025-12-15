# VisionF1 Webapp

VisionF1 is a comprehensive Formula 1 analytics and prediction platform designed to provide fans and analysts with deep insights into race strategies, performance metrics, and outcome predictions. By leveraging advanced data visualization and AI-driven models, VisionF1 offers a unique perspective on the sport.

## Project Overview

This web application serves as the interactive frontend for the VisionF1 ecosystem. It consumes data from the VisionF1 API to display real-time standings, detailed race analytics, and predictive models. The platform is built for performance and responsiveness, ensuring a seamless experience across devices.

## Features

### Dashboard
- **Real-Time Standings**: Up-to-date driver and team championship standings.
- **Upcoming Grand Prix**: Countdown and detailed information about the next race weekend.
- **Interactive Visuals**: Engaging animations and visual elements to highlight key data points.

### Advanced Analytics
- **Race Pace Analysis**: Deep dive into driver performance with lap-by-lap pace comparisons.
- **Clean Air Performance**: Metric analysis filtering out traffic to reveal true car potential.
- **Lap Time Distributions**: Statistical breakdown of lap times to assess consistency and variability.

### AI & Machine Learning Models
- **Race Predictions**: AI-powered forecasts for race results based on historical data and current conditions.
- **Qualifying Predictions**: Estimates for qualifying performance, including gap-to-pole calculations.
- **Strategy Optimization**: Simulation of optimal pit stop strategies using Monte Carlo methods and tyre degradation models.

### User Interface
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile viewing.
- **Dynamic Charts**: Interactive graphs and charts powered by Recharts for clear data interpretation.
- **Dark Mode**: Sleek, eye-friendly dark theme for comfortable viewing during night races.

## Technology Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Library**: React
- **Styling**: Tailwind CSS, Shadcn UI
- **Icons**: Lucide React

### Data Visualization
- **Charts**: Recharts & Plotly

### State & Data Management
- **Fetching**: React Server Components, Native Fetch API

## Getting Started

Follow these instructions to set up the project locally for development and testing purposes.

### Prerequisites
- **Node.js**: Version 18.17 or higher
- **npm**: Version 9 or higher

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/visionf1/visionf1-webapp.git
    cd visionf1-webapp
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory and configure the following environment variables:
    ```env
    NEXT_PUBLIC_VISIONF1_API_URL=https://api.visionf1.com
    NEXT_PUBLIC_VISIONF1_PREDICTIONS_API_URL=https://predictions.visionf1.com
    ```
    *Note: Replace the URLs with your local or staging API endpoints if applicable.*

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Access the application**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

A brief overview of the key directories in `visionf1/app`:

- `analytics/`: Pages and components for race pace and performance analysis.
- `models/`: Interfaces for AI prediction models (Race, Quali, Strategy).
- `drivers/`: Driver profiles using dedicated components.
- `components/`: Reusable UI components including charts, tables, and cards.
- `lib/`: Utility functions and API request handlers.

## License

This project is licensed under the MIT License.
