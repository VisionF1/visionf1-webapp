import Image from "next/image"

export function PlaceholderBrand() {
  return (
    <div className="@container aspect-video flex flex-col items-center justify-between overflow-hidden">           
      
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="h-24 w-24 @xs:h-32 @xs:w-32 @sm:h-38 @sm:w-38 @md:h-44 @md:w-44 flex items-center justify-center overflow-hidden">
          <Image
            src="/visionf1-logo.svg"
            alt="VisionF1"
            width={200}
            height={200}
            className="object-contain h-full w-full p-1 filter brightness-25 opacity-8 dark:opacity-44 grayscale"
            loading="eager"
          />
        </div>
      
      <div className="">
        <span
          className="text-3xl @xs:text-4xl @sm:text-5xl @md:text-6xl text-brand brightness-25 opacity-8 dark:opacity-44 grayscale"
          style={{ fontFamily: "Formula1-Display-Black, sans-serif" }}
        >
          VisionF1
        </span>
      </div>

      </div>

    </div>
  );
}