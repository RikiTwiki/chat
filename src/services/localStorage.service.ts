export const setItem = (key: string, data: any): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (err) {
    console.log(err);
  }
};

export const getItem = (key: string): any => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return undefined;
    }
    let parsedData: any;
    try {
      parsedData = JSON.parse(serializedData);
    } catch {
      parsedData = serializedData;
    }

    return parsedData;
  } catch (err) {
    console.log(err);
  }
};
