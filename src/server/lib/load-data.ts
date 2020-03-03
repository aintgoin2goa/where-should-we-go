import * as fetch from "make-fetch-happen";

const loadData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    retry: 3
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response.json();
};

export default loadData;
