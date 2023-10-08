import { EMU_URL, BASE_URL, API_URL } from "../apiURL";

export default function buildQueryUrl(collectionName, conditions) {
  const apiUrl = `${BASE_URL}/api/mobile/get/fetch/docs/by/condition?collectionName=${collectionName}`;

  // Create an array to hold the condition parameters
  const conditionParams = [];

  // Iterate over the conditions and build the parameter strings
  conditions.forEach((condition, index) => {
    const encodedOperator = encodeURIComponent(condition.operator);

    // Add fieldName and operator for the first value in the condition
    conditionParams.push(
      `conditions[${index}][fieldName]=${condition.fieldName}`
    );
    conditionParams.push(`conditions[${index}][operator]=${encodedOperator}`);

    // If value is an array with multiple values, add them separately
    if (Array.isArray(condition.value)) {
      condition.value.forEach((val, valIndex) => {
        const valueParam = `conditions[${index}][value][${valIndex}]=${encodeURIComponent(
          val
        )}`;
        conditionParams.push(valueParam);
      });
    } else {
      // If value is not an array, add it as a single value
      const valueParam = `conditions[${index}][value]=${encodeURIComponent(
        condition.value
      )}`;
      conditionParams.push(valueParam);
    }
  });

  // Join the condition parameters and add them to the URL
  const conditionQueryString = conditionParams.join("&");
  return `${apiUrl}&${conditionQueryString}`;
}
