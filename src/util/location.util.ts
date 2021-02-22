export const getSearch = (): { [key: string]: string } => {
  const result: { [key: string]: string } = {};
  if (window.location.search) {
    const eachSearchStr = window.location.search.slice(1).split('&');
    eachSearchStr.forEach((searchStr) => {
      const index = searchStr.indexOf('=');
      if (index > 0) {
        result[searchStr.slice(0, index)] = decodeURIComponent(searchStr.slice(index + 1));
      }
    });
  }

  return result;
};
