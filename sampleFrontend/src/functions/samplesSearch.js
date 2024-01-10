
// returns ordered list of samples that fit query
  // first are the results with the beginning characters then results with any substring in it
export function sampleSearch(samples, query, currentTags, mode) {
 
  // !!! only add if sample already in list
  const leftovers = [...samples];
  const filteredSamples = [];

  // If sample text (title, description, username) begins with query
  if (query.trim() !== '') {
    for (let i of samples) { 
      let qq = null;
      if (mode === "TITLE") {
        if (i.title.toLowerCase().startsWith(query.toLowerCase())) {
          qq = i;
        }
      } else if (mode === "DESCRIPTION") {
        if (i.description.toLowerCase().startsWith(query.toLowerCase())) {
          qq= i;
        } 
      } else if (mode === "USER") {
        if (i.username.toLowerCase().startsWith(query.toLowerCase())) {
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
        if (i.title.toLowerCase().includes(query.toLowerCase())) {
          qq = i;
        }
      } else if (mode === "DESCRIPTION") {
        if (i.description.toLowerCase().includes(query.toLowerCase())) {
          qq = i;
        }
      } else if (mode === "USER") {
        if (i.username.toLowerCase().includes(query.toLowerCase())) {
          qq = i;
        }
      }
      if (qq !== null && !filteredSamples.includes(qq)) {
        filteredSamples.push(i);
      }
    }
  }
  // then filter by tags
  for (let tag of currentTags) {
    for (let sample of samples) {
      if (sample.tags.includes(tag) &&
        !(filteredSamples.includes(sample))) {
        filteredSamples.push(sample);
      }
    }
  }

  return filteredSamples;
}