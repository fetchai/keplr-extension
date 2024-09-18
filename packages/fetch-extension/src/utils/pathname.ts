export const getPathname = (): string => {
  // Get the hash part of the URL (the fragment identifier)
  const fragment = window.location.hash.substring(1); // Remove the leading '#'
  let lastSegment = "";
  if (fragment) {
    // Split the fragment by slashes and get the last segment
    const fragmentSegments = fragment.split("/");
    if (fragmentSegments && fragmentSegments.length) {
      lastSegment =
        fragmentSegments[fragmentSegments.length - 1].split("?")?.[0];
    }
    return lastSegment;
  }

  return lastSegment;
};
