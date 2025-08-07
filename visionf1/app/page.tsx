export default function Home() {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2rem",
      padding: "2rem"
    }}>
      <h1 style={{
        fontFamily: "var(--font-oswald)",
        fontSize: "3rem",
        color: "#19dae0",
        letterSpacing: "2px"
      }}>
        VisionF1
      </h1>
      <img
        src="/f1-eau-rouge.png"
        alt="Fórmula 1"
        style={{
          maxWidth: "500px",
          borderRadius: "1rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
        }}
      />
      <section style={{
        maxWidth: "600px",
        textAlign: "center",
        fontSize: "1.2rem"
      }}>
        <p>
          Welcome to <strong>VisionF1</strong>, a Formula 1 web app for statistics, analysis and predictions.
        </p>
      </section>
    </main>
  );
}