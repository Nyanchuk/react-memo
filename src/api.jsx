const allWinners = "https://wedev-api.sky.pro/api/leaderboard";

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
