const originalConsoleError = console.error;

console.error = (...args) => {
  if (
    args.length > 0 &&
    typeof args[0] === "string" &&
    args[0].includes(
      "will be removed from React Native, along with all other PropTypes."
    )
  ) {
    console.log("Filtered warning:", args[0]);
  } else {
    originalConsoleError.apply(console, args);
  }
};
