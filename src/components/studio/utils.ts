
// Add the missing getServerUrl function
export const getServerUrl = (): string => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8000';
};

export function setLocalStorage(
  name: string,
  value: any,
  stringify: boolean = true
) {
  if (stringify) {
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    localStorage.setItem(name, value);
  }
}

export function getLocalStorage(name: string, stringify: boolean = true): any {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(name);
    try {
      if (stringify) {
        return JSON.parse(value!);
      } else {
        return value;
      }
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
}


export function eraseCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
