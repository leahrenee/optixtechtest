const baseUrl = "http://localhost:3000";

export const getData = async <T>(path: string): Promise<T> => {
  let data;

  try {
    const res = await fetch(`${baseUrl}/${path}`);

    if (res.ok) {
      data = await res.json();
    } else {
      if (res.status === 404) throw new Error("404, Not found");
      if (res.status === 500) throw new Error("500, internal server error");
      throw new Error(`Server responded with ${res.status}`);
    }
  } catch (error) {
    throw new Error(`Fetching failed: ${error}`);
  }

  return data;
};

export const postData = async <T, R>(path: string, data: T): Promise<R> => {
  let reviewResponse;

  try {
    const res = await fetch(`${baseUrl}/${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        body: JSON.stringify(data),
      },
    });

    if (res.ok) {
      reviewResponse = await res.json();
    } else {
      if (res.status === 404) throw new Error("404, Not found");
      if (res.status === 500) throw new Error("500, internal server error");
      throw new Error(`Server responded with ${res.status}`);
    }
  } catch (error) {
    console.error("Fetch", error);
  }

  return reviewResponse;
};
