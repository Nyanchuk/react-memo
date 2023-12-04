const allWinnersNew = "https://wedev-api.sky.pro/api/v2/leaderboard";

export async function getFetchWinners() {
  try {
    const response = await fetch(allWinnersNew);
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

export const addNewLeader = async ({ name, time }) => {
  const response = await fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      time: time,
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

// export async function addNewLeader(newLeaderData) {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(newLeaderData),
//   };

//   try {
//     const response = await fetch("https://wedev-api.sky.pro/api/leaderboard", requestOptions);
//     if (!response.ok) {
//       throw new Error("Ошибка при добавлении нового лидера");
//     }
//     // Возвращаем результат, если необходимо
//     return await response.json();
//   } catch (error) {
//     throw new Error("Ошибка сети: " + error.message);
//   }
// }
