export const getSearch = (): { [key: string]: string } => {
  const search: { [key: string]: string } = {};
  let searchStr = window.location.search;
  if (searchStr) {
    const keyValueStrAry = searchStr.slice(1).split('&');
    keyValueStrAry.forEach((keyValueStr) => {
      const keyValueAry = keyValueStr.split('=');
      if (keyValueAry.length === 2) {
        search[keyValueAry[0]] = decodeURIComponent(keyValueAry[1]);
      }
    });
  }

  return search;
}