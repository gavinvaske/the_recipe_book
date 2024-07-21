function getDistribution(elementsPerDistribution, numberOfLanes) {
    const group = Array(elementsPerDistribution).fill(1);
    let startIndex = 0;
    let endIndex = elementsPerDistribution - 1;
  
    const startingValue = numberOfLanes - elementsPerDistribution + 1;
    group[startIndex] = startingValue;
    const groups = [];

    groups.push([...group]);
  
    while (startIndex !== (elementsPerDistribution - 1)) {
        const startValue = group[startIndex];
      
        if (startValue === 1) {
            startIndex = startIndex + 1;

            if (startIndex === endIndex) {
                endIndex = elementsPerDistribution - 1;
            }
        } else {
            group[startIndex] = group[startIndex] - 1;
            group[endIndex] = group[endIndex] + 1;
            let nextEndIndex = endIndex - 1;
            if (nextEndIndex === startIndex) {
                nextEndIndex = elementsPerDistribution - 1;
            }
            endIndex = nextEndIndex;

            groups.push([...group]);
        }
    }
  
    return groups;
}

function removeDuplicatesFromDistributions(distributions) {
  const seen = {};

  distributions.forEach((distribution) => distribution.sort());

  return distributions.filter((distribution) => { // credit: https://stackoverflow.com/a/9229821
    return seen.hasOwnProperty(distribution) ? false : (seen[distribution] = true)
  })
}

export function getDistributions(numberOfLanes) {
    const groupSizeToDistributions = {};

    for (let groupSize = 1; groupSize <= numberOfLanes; groupSize++) {
        const distributionsWithDuplicates = getDistribution(groupSize, numberOfLanes);
        const distributions = removeDuplicatesFromDistributions(distributionsWithDuplicates);

        groupSizeToDistributions[groupSize] = distributions;
    }

    return groupSizeToDistributions;
}