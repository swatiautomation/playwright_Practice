export async function getTodos(page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem('todos_v1') || '[]'),
  );
}

export async function getArchivedTodos(page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem('archived_todos_v1') || '[]'),
  );
}

export async function clearStorage(page) {
  await page.evaluate(() => localStorage.clear());
}

export const stringFormat = (str, ...args) => {
  return str.replace(
    /{(\d+)}/g,
    (match, index) => args[index].toString() || '',
  );
};
