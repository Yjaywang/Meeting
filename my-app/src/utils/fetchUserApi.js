export async function signUp(data) {
  try {
    const response = await fetch("api/user", {
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
    const response = await fetch("api/user/auth", {
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

export async function getUserInfo() {
  try {
    const refreshResponse = await fetch("api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      window.location.href = "/signIn";
      return;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch("api/user/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function signOut() {
  try {
    const response = await fetch("api/user/auth", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function patchAvatarUrl(data) {
  try {
    const refreshResponse = await fetch("api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      window.location.href = "/signIn";
      return;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch("api/user/auth", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function patchPassword(data) {
  try {
    const refreshResponse = await fetch("api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      window.location.href = "/signIn";
      return;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch("api/user/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function patchUsername(data) {
  try {
    const refreshResponse = await fetch("api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      window.location.href = "/signIn";
      return;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch("api/user/username", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function refresh() {
  try {
    const refreshResponse = await fetch("api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const refreshResponseData = await refreshResponse.json();
    return refreshResponseData;
  } catch (error) {
    console.error(error);
  }
}
