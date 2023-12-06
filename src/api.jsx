const allWinners = "https://wedev-api.sky.pro/api/v2/leaderboard";

export async function getFetchWinners() {
  try {
    const response = await fetch(allWinners);
    if (!response.ok) {
      throw new Error("Ошибка получения данных");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    throw error;
  }
}

export const addNewLeader = async ({ name, time, achievements }) => {
  const response = await fetch(allWinners, {
    method: "POST",
    body: JSON.stringify({
      name: name,
      time: time,
      achievements: achievements,
    }),
  });

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    const error = new Error("Ошибка авторизации: " + response.status + " " + response.statusText);
    error.statusCode = response.status; // Добавили statusCode в объект ошибки
    throw error;
  }
  return data;
};
