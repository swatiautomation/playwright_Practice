import { test, expect } from '@playwright/test';

const todoAppUrl = 'https://todo.testing.groupgti.com/';
const selectors = {
  todoInput: '#mat-input-0',
  calanderInput: '#mat-input-1',
  validationMsg: '#mat-mdc-error-3',
  todoRows: '//tbody/tr',
  threeDotMenu: '//tbody/tr/td[4]/button',
  archiveOption: '//span[contains(text(),"Archive")]',
};

async function getToDoFromLocalStorage(page) {
  return await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('todos_v1'));
  });
}

async function getArchivedToDoFromLocalStorage(page) {
  return await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('archived_todos_v1'));
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto(todoAppUrl);
});

test('Blank Todo content can be created using spaces', async ({ page }) => {
  await setViewportSize(page, 1920, 512);
  await page.fill(selectors.todoInput, '   ');
  await page.fill(selectors.calanderInput, '2026-12-31');
  await page.getByRole('button', { name: ' Create todo ' }).click();
  expect(page.textContent('//tbody/tr[1]/td[2]')).not.toBe('   ');

  const todos = await getToDoFromLocalStorage(page);
  console.log('Todos from Local Storage:', todos);

  expect(todos.length).toBe(0);
});

test('BUG-002: Should allow up to 100 characters in Todo content', async ({
  page,
}) => {
  const text =
    "With ideas and structure delivered straight to the page you're already on, you'll never miss a deadline again.Hello ag";

  await page.fill(selectors.todoInput, text);
  const enteredValue = await page.inputValue(selectors.todoInput);
  expect.soft(enteredValue.length).toBe(100);
  await page.fill(selectors.calanderInput, '2026-12-31');
  await page.getByRole('button', { name: ' Create todo ' }).click();

  const todos = await getToDoFromLocalStorage(page);
  console.log('Todos from Local Storage:', todos);
  expect(todos[0].content.length).toBe(100);
});

test('BUG-003: Validation error should not appear after successful creation', async ({
  page,
}) => {
  await page.fill(selectors.todoInput, 'Buy groceries');

  await page.fill(selectors.calanderInput, '2026-12-22');
  await page.getByRole('button', { name: ' Create todo ' }).click();
  await expect(page.locator(selectors.todoRows)).toHaveCount(1);
  const todos = await getToDoFromLocalStorage(page);
  console.log('Todos from Local Storage:', todos);

  expect(todos.length).toBe(1);
  expect(todos[0].content).toBe('Buy groceries');
  await page.waitForTimeout(3000);
  await expect(page.getByText('Content is required ')).toBeHidden();
});

test('BUG-004: Should not allow invalid past date entry', async ({ page }) => {
  await page.fill(selectors.todoInput, 'Pay bills');
  await page.fill(selectors.calanderInput, '0001-01-01');
  await page.getByRole('button', { name: ' Create todo ' }).click();
  await expect.soft(page.locator(selectors.todoRows)).toHaveCount(0);
  const todos = await getToDoFromLocalStorage(page);
  console.log('Todos from Local Storage:', todos);
  expect(todos.length).toBe(0);
});

test('BUG-005: Due date field should show date picker', async ({ page }) => {
  const inputType = await page.getAttribute(selectors.calanderInput, 'type');

  expect(inputType).toBe('date');
});

test('BUG-006: Create Todo button should be disabled with invalid input', async ({
  page,
}) => {
  await page.fill(selectors.todoInput, ' ');
  await page.fill(selectors.calanderInput, '0001-01-01');

  await expect(
    page.getByRole('button', { name: ' Create todo ' }),
  ).toBeDisabled();
  const todos = await getToDoFromLocalStorage(page);
  expect(todos.length).toBe(0);
});

test('BUG-007: Archiving a Todo should remove it from active list', async ({
  page,
}) => {
  await page.fill(selectors.todoInput, 'Archive me');
  await page.fill(selectors.calanderInput, '2026-12-31');
  await page.getByRole('button', { name: ' Create todo ' }).click();

  await expect(page.locator(selectors.todoRows)).toHaveCount(1);
  const todoText = await getToDoFromLocalStorage(page);
  expect(todoText[0].content).toBe('Archive me');
  expect(todoText[0].archived).toBe(false);
  console.log('Todo from Local Storage:', todoText);

  // Archive it
  await page.click(selectors.threeDotMenu);
  await page.click(selectors.archiveOption);

  await expect.soft(page.locator(selectors.todoRows)).toHaveCount(0);
  const archiveToDo = await getArchivedToDoFromLocalStorage(page);
  expect(archiveToDo.length).toBe(1);
  expect(archiveToDo[0].content).toBe('Archive me');
  expect(archiveToDo[0].archived).toBe(true);
  console.log('Archived Todo from Local Storage:', archiveToDo);
});
