const checkUsernameAvailable = async (username) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getUser/${username}`
    );

    if (!res.ok) {
      if (res.status === 404) {
        // Username not found = available
        return true;
      }
      throw new Error("Error checking username");
    }
    const data = await res.json();

    return false;
  } catch (error) {
    console.error("Username check failed:", error.message);
    return false;
  }
};
