
// returns ordered list of samples that fit query
  // first are the results with the beginning characters then results with any substring in it
export function sampleSearch(samples, query, currentTags) {



  // !!! only add if sample already in list
  const leftovers = [...samples];
  const filteredSamples = [];
  // filter results based off query first
  if (query.trim() !== '') {
    for (let i of samples) {
      if (i.title.toLowerCase().startsWith(query.toLowerCase())) {
        console.log('startsWith')
        filteredSamples.push(i);
        leftovers.splice(samples.indexOf(i), 1);
      }
    }
    for (let i of leftovers) {
      if (i.title.toLowerCase().includes(query.toLowerCase())) {
        console.log('includes')
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