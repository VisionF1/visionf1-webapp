import Image from "next/image"

export function Welcome() {
  return (
    <div className="@container aspect-video flex items-center justify-between px-4 py-6 overflow-hidden relative box-border">           
      {/* Welcome text */}
      <div className="flex flex-col justify-center h-full flex-1 pr-2 pb-10">
        <span
          className="text-lg @2xs:text-lg @xs:text-2xl @sm:text-3xl @md:text-[2rem] @lg:text-4xl @xl:text-[2.75rem] font-normal leading-tight"
          style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
        >
          Welcome to
        </span>
        
        <span
          className="text-xl @2xs:text-2xl @xs:text-4xl @sm:text-[2.75rem] @md:text-[3.3rem] @lg:text-6xl @xl:text-[4.2rem] font-black bg-gradient-to-r from-primary to-50% to-brand bg-clip-text text-transparent"
          style={{ fontFamily: "Formula1-Display-Black, sans-serif" }}
        >
          VisionF1
        </span>

        <p
          className="text-[0.600rem] @2xs:text-[0.600rem] @xs:text-xs @sm:text-sm @md:text-base @lg:text-lg @xl:text-xl font-normal mt-2 @lg:mt-4 @xl:mt-6 max-w-md text-muted-foreground"
          style={{ fontFamily: "Formula1-Display-Regular, sans-serif" }}
        >
          Your place for Formula 1 analysis, statistics and predictive models. Made by passionate students.
        </p>
        
      </div>

      {/* Logo */}
      <div className="flex-shrink-0 pb-2 px-2">
        <div className="h-20 w-20 @2xs:h-24 @2xs:w-24 @xs:h-28 @xs:w-28 @sm:h-36 @sm:w-36 @md:h-42 @md:w-42 @lg:h-46 @lg:w-46 @xl:h-56 @xl:w-56 bg-sidebar-primary border-2 border-brand flex items-center justify-center rounded-full overflow-hidden shadow-lg">
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
        <span className="text-[0.550rem] @2xs:text-[0.450rem] @xs:text-[0.600rem] @sm:text-[0.675rem] @md:text-sm @lg:text-base @xl:text-lg bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap">Data Analytics</span>
        <span className="text-[0.550rem] @2xs:text-[0.450rem] @xs:text-[0.600rem] @sm:text-[0.675rem] @md:text-sm @lg:text-base @xl:text-lg bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap">Predictive Models</span>
        <span className="text-[0.550rem] @2xs:text-[0.450rem] @xs:text-[0.600rem] @sm:text-[0.675rem] @md:text-sm @lg:text-base @xl:text-lg bg-primary/20 px-2 py-1 rounded-full whitespace-nowrap">Key Statistics</span>
      </div>
    </div>
  );
}