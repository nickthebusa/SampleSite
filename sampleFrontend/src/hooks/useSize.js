import { useCallback, useEffect, useState } from 'react';

// custom hook to get the width and height of the browser window
const useSize = (id) => {

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // setSizes callback function to update width and height with current window dimensions
  const setSizes = useCallback(() => {

    const theDiv = document.querySelector(`#id${id}`);
    setWidth(theDiv.clientWidth);
    setHeight(theDiv.clientHeight);

  }, [setWidth, setHeight, id]);

  // add event listener for window resize and call setSizes
  useEffect(() => {
    window.addEventListener('resize', setSizes);
    setSizes();
    return () => window.removeEventListener('resize', setSizes);
  }, [setSizes]);

  return [width, height];
};

export default useSize;