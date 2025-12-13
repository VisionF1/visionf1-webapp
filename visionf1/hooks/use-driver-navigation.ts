"use client";

import { useRouter } from "next/navigation";

export function useDriverNavigation() {
  const router = useRouter();

  const getDriverSlug = (driverName: string) => {
    const [firstName, ...lastNameParts] = driverName.split(" ");
    const lastName = lastNameParts.join(" ");
    return `${firstName.toLowerCase().replace(/ü/g, "u")}-${lastName.toLowerCase().replace(/ü/g, "u")}`;
  };

  const navigateToDriver = async (driverName: string) => {
    const slug = getDriverSlug(driverName);
    const driverPageUrl = `/drivers/${slug}`;

    try {
      // Attempt to fetch the driver page endpoint
      const response = await fetch(driverPageUrl, { method: "HEAD" });

      if (response.status === 404) {
        // If driver doesn't exist, redirect to general drivers list
        router.push("/drivers/");
      } else {
        // If page exists, navigate to driver page
        router.push(driverPageUrl);
      }
    } catch (error) {
      // If there's an error, try to navigate anyway
      router.push(driverPageUrl);
    }
  };

  return { getDriverSlug, navigateToDriver };
}
