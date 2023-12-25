function generateRandomID() {
  return Math.floor(Math.random() * 1000000); // Generates a random ID
}

// function assignUniqueID(array) {
//   array.forEach((item) => {
//     let uniqueID;
//     do {
//       uniqueID = generateRandomID();
//     } while (array.some((otherItem) => otherItem.id === uniqueID));
//     item.id = uniqueID;
//   });
// }

function checkForRedundancy(array, key) {
  const seen = new Set();
  for (const item of array) {
    if (seen.has(item[key])) {
      return true; // Redundancy found
    }
    seen.add(item[key]);
  }
  return false; // No redundancy
}

function isIDUnique(id, array) {
  return !array.some((item) => item.id === id);
}

export { generateRandomID, checkForRedundancy, isIDUnique };
