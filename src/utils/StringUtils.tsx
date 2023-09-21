function convertUrlToLocalEmulator(url: string): string {
  return url.includes('localhost')
    ? url.replace('localhost', 'http://10.0.2.2')
    : `http://${url}`;
}

const StringUtils = {
  convertUrlToLocalEmulator,
};

export default StringUtils;
