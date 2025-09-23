import Image from "next/image"

export function Welcome() {
  return (
    <div className="aspect-video flex items-center justify-between px-4 py-6 overflow-hidden relative box-border">           
      {/* Welcome text */}
      <div className="flex flex-col justify-center h-full flex-1 pr-2 pb-10">
        <span
          className="text-lg md:text-lg xl:text-2xl 3xl:text-4xl font-normal leading-tight"
          style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
        >
          Welcome to
        </span>
        
        <span
          className="text-3xl md:text-2xl xl:text-4xl 3xl:text-6xl font-black bg-gradient-to-r from-primary to-50% to-brand bg-clip-text text-transparent"
          style={{ fontFamily: "Formula1-Display-Black, sans-serif" }}
        >
          VisionF1
        </span>

        <p
          className="text-xs md:text-[0.600rem] xl:text-sm 3xl:text-base font-normal mt-2 max-w-md text-muted-foreground"
          style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
        >
          Your place for Formula 1 analysis, statistics and predictive models. Made by passionate students.
        </p>
        
      </div>

      {/* Logo */}
      <div className="flex-shrink-0 pb-2 px-2">
        <div className="h-24 w-24 md:h-20 md:w-20 xl:h-28 xl:w-28 3xl:h-34 3xl:w-34 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
          <Image
            src="/visionf1-logo.svg"
            alt="VisionF1"
            width={200}
            height={200}
            className="object-contain h-full w-full p-1"
            loading="eager"
          />
        </div>
      </div>

      <div className="absolute left-4 bottom-4 z-20 flex gap-2 items-center whitespace-nowrap">
        <span className="text-[0.550rem] md:text-[0.450rem] xl:text-[0.650rem] 3xl:text-sm bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap">Data Analytics</span>
        <span className="text-[0.550rem] md:text-[0.450rem] xl:text-[0.650rem] 3xl:text-sm bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap">Predictive Models</span>
        <span className="text-[0.550rem] md:text-[0.450rem] xl:text-[0.650rem] 3xl:text-sm bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap">Key Statistics</span>
      </div>
    </div>
  );
}