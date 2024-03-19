
// returns ordered list of samples that fit query
// first are the results with the beginning characters then results with any substring in it
export function sampleSearch(samples, query, currentTags, mode) {

  // !!! only add if sample already in list
  const leftovers = [...samples];
  let filteredSamples = [];

  // strip query and make lowercase for to use in search
  const theQuery = query.toLowerCase().trim();

  // filter by tag
  for (let tag of currentTags) {
    for (let sample of samples) {
      if (sample.tags.includes(tag) &&
        !(filteredSamples.includes(sample))) {
        filteredSamples.push(sample);
      }
    }
  }

  // If sample text (title, description, username) begins with query
  if (theQuery !== '') {

    // If search query string is in beginning
    for (let i of samples) {
      let qq = null;
      if (mode === "TITLE") {
        if (i.title.toLowerCase().startsWith(theQuery)) {
          qq = i;
        }
      } else if (mode === "DESCRIPTION") {
        if (i.description.toLowerCase().startsWith(theQuery)) {
          qq = i;
        }
      } else if (mode === "USER") {
        if (i.username.toLowerCase().startsWith(theQuery)) {
          qq = i;
        }
      }
      if (qq !== null && !filteredSamples.includes(qq)) {
        filteredSamples.push(i);
        leftovers.splice(samples.indexOf(i), 1);
      }
    }
    // If search query string exists inside anywhere 
    for (let i of leftovers) {
      let qq = null;
      if (mode === "TITLE") {
        if (i.title.toLowerCase().includes(theQuery)) {
          qq = i;
        }
      } else if (mode === "DESCRIPTION") {
        if (i.description.toLowerCase().includes(theQuery)) {
          qq = i;
        }
      } else if (mode === "USER") {
        if (i.username.toLowerCase().includes(theQuery)) {
          qq = i;
        }
      }
      if (qq !== null && !filteredSamples.includes(qq)) {
        filteredSamples.push(i);
      }
    }
  }

  // if no query make put the samples with the most matched tags at the top of the list
  //  if (!theQuery) {
  let samplesHi = filteredSamples;
  samplesHi.sort((sA, sB) => {
    const matchingTagsA = sA.tags.filter(tag => currentTags.includes(tag));
    const matchingTagsB = sB.tags.filter(tag => currentTags.includes(tag));

    return matchingTagsB.length - matchingTagsA.length;
  })
  filteredSamples = samplesHi;
  //}

  return filteredSamples;
}
