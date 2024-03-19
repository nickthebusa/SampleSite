
export function sampleSearch(samples, query, currentTags, mode) {

  const leftovers = [...samples];

  const theQuery = query.toLowerCase().trim().replace(/\s/g, "");


  // order array from most tags to least
  function rankTagAmount(arr) {
    return arr.sort((a, b) => {
      const matchingA = a.tags.filter(tag => currentTags.includes(tag));
      const matchingB = b.tags.filter(tag => currentTags.includes(tag));
      return matchingB.length - matchingA.length;
    })
  }


  if (theQuery && currentTags.length > 0) {

    // first add tags that begin with query
    let beginQuerySamples = [];
    for (let sample of samples) {
      if (sample[mode].toLowerCase().startsWith(theQuery)) {
        for (let tag of sample.tags) {
          if (currentTags.includes(tag)) {
            beginQuerySamples.push(sample);
            leftovers.splice(samples.indexOf(sample), 1);
          }
        }
      }
    }
    beginQuerySamples = rankTagAmount(beginQuerySamples);

    // second add tags that contain the query as a substring
    let subQuerySamples = [];
    for (let sample of leftovers) {
      if (sample[mode].toLowerCase().includes(theQuery)) {
        for (let tag of sample.tags) {
          if (currentTags.includes(tag)) {
            subQuerySamples.push(sample);
          }
        }
      }
    }
    subQuerySamples = rankTagAmount(subQuerySamples);

    return beginQuerySamples.concat(subQuerySamples);
  }
  else if (theQuery) {

    const filteredSamples = [];
    for (let sample of samples) {
      if (sample[mode].toLowerCase().startsWith(theQuery)) {
        filteredSamples.push(sample);
        leftovers.splice(samples.indexOf(sample), 1);
      }
    }
    for (let sample of leftovers) {
      if (sample[mode].toLowerCase().includes(theQuery)) {
        filteredSamples.push(sample);
      }
    }

    return filteredSamples;
  }
  else if (currentTags.length > 0) {
    let filteredSamples = [];
    for (let sample of samples) {
      for (let tag of sample.tags) {
        if (currentTags.includes(tag) && !filteredSamples.includes(sample)) {
          filteredSamples.push(sample);
        }
      }
    }
    filteredSamples = rankTagAmount(filteredSamples);
    return filteredSamples;
  }

}

