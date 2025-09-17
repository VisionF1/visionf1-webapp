import Image from "next/image"

export function Welcome() {
  return (
    <div className="aspect-video flex items-center justify-between px-4 py-6 overflow-hidden relative box-border">           
      {/* Welcome text */}
      <div className="flex flex-col justify-center h-full flex-1 pr-2 z-10 pb-14">
        <span
          className="text-2xl md:text-3xl font-normal leading-tight py-2"
          style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
        >
          Welcome to
        </span>
        
        <span
          className="text-4xl md:text-5xl font-black py-2 bg-gradient-to-r from-primary to-50% to-brand bg-clip-text text-transparent"
          style={{ fontFamily: "Formula1-Display-Black, sans-serif" }}
        >
          VisionF1
        </span>

        <p
          className="text-base md:text-lg font-normal mt-3 max-w-md text-muted-foreground"
          style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
        >
          Your place for Formula 1 analysis, statistics and predictive models. Made by passionate students.
        </p>
        
      </div>

      {/* Logo */}
      <div className="mt-4 md:mt-0 flex-shrink-0 z-10">
        <div className="h-24 w-24 md:h-32 md:w-32 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
          <Image
            src="/visionf1-logo.svg"
            alt="VisionF1"
            width={200}
            height={200}
            className="object-contain h-full w-full p-2"
            loading="eager"
          />
        </div>
      </div>

      <div className="absolute left-4 bottom-6 z-20 flex gap-2 items-center whitespace-nowrap">
        <span className="text-xs bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap">Data Analytics</span>
        <span className="text-xs bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap">Predictive Models</span>
        <span className="text-xs bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap">Key Statistics</span>
      </div>
    </div>
  );
}