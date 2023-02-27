export async function signUp(data) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function signIn(data) {
  try {
    console.log("1111111", data);
    const response = await fetch(`api/user/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("2222222222", `${process.env.REACT_APP_API_URL}/api/user/auth`);
    const responseData = await response.json();
    console.log("33333333", responseData);
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserInfo() {
  try {
    const refreshResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/refresh`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      return refreshResponseData;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/auth`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function signOut() {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/auth`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function patchAvatar(data) {
  try {
    const refreshResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/refresh`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      return refreshResponseData;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/image`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function patchPassword(data) {
  try {
    const refreshResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/refresh`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      return refreshResponseData;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function patchUsername(data) {
  try {
    const refreshResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/refresh`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      return refreshResponseData;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/username`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function refresh() {
  try {
    const refreshResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/refresh`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const refreshResponseData = await refreshResponse.json();
    return refreshResponseData;
  } catch (error) {
    console.error(error);
  }
}

export async function postRecording(formData) {
  try {
    const refreshResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/refresh`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      return refreshResponseData;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/recording`,
      {
        method: "POST",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error(error);
  }
}
