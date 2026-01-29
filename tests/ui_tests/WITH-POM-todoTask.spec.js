import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page.js';
import {
  getTodos,
  getArchivedTodos,
  clearStorage,
} from '../../utils/common.js';

test.beforeEach(async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  await clearStorage(page);
});

test('BUG-001: Should not allow whitespace-only Todo', async ({ page }) => {
  const todoPage = new TodoPage(page);

  await todoPage.createTodo('   ', '2026-12-31');
  await todoPage.expectTodoCount(0);

  const todos = await getTodos(page);
  expect(todos.length).toBe(0);
});

test('BUG-002: Should allow up to 100 characters', async ({ page }) => {
  const todoPage = new TodoPage(page);

  const text =
    "With ideas and structure delivered straight to the page you're already on, you'll never miss a deadline again.Hello ag";

  await todoPage.todoInput.fill(text);
  const enteredValue = await todoPage.todoInput.inputValue();
  expect(enteredValue.length).toBe(100);

  await todoPage.createTodo(text, '2026-12-31');

  const todos = await getTodos(page);
  expect(todos[0].content.length).toBe(100);
});

test('BUG-003: Validation message should not appear after success', async ({
  page,
}) => {
  const todoPage = new TodoPage(page);

  await todoPage.createTodo('Buy groceries', '2026-12-22');
  await todoPage.expectTodoCount(1);

  const todos = await getTodos(page);
  expect(todos[0].content).toBe('Buy groceries');

  await expect(todoPage.validationMessage).toBeHidden();
});

test('BUG-004: Should not allow invalid past date', async ({ page }) => {
  const todoPage = new TodoPage(page);

  await todoPage.createTodo('Pay bills', '0001-01-01');
  await todoPage.expectTodoCount(0);

  const todos = await getTodos(page);
  expect(todos.length).toBe(0);
});

test('BUG-005: Due date field should be date picker', async ({ page }) => {
  const todoPage = new TodoPage(page);

  await expect(todoPage.dueDateInput).toHaveAttribute('type', 'date');
});

test('BUG-006: Create button disabled on invalid input', async ({ page }) => {
  const todoPage = new TodoPage(page);

  await todoPage.todoInput.fill(' ');
  await todoPage.dueDateInput.fill('0001-01-01');

  await expect(todoPage.createButton).toBeDisabled();
});

test('BUG-007: Archiving removes todo from active list', async ({ page }) => {
  const todoPage = new TodoPage(page);

  await todoPage.createTodo('Archive me', '2026-12-31');
  await todoPage.expectTodoCount(1);

  const todos = await getTodos(page);
  expect(todos[0].archived).toBe(false);

  await todoPage.archiveFirstTodo();
  await todoPage.expectTodoCount(0);

  const archivedTodos = await getArchivedTodos(page);
  expect(archivedTodos[0].content).toBe('Archive me');
  expect(archivedTodos[0].archived).toBe(true);
});
