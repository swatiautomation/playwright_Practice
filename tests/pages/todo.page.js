import { expect } from '@playwright/test';

class TodoPage {
  constructor(page) {
    this.page = page;

    this.todoInput = page.getByRole('textbox', { name: /todo/i });
    this.dueDateInput = page.getByLabel(/due date/i);
    this.createButton = page.getByRole('button', { name: /create todo/i });

    this.todoRows = page.locator('tbody tr');
    this.threeDotMenu = page.locator('tbody tr').first().getByRole('button');
    this.archiveOption = page.getByRole('menuitem', { name: /archive/i });

    this.validationMessage = page.getByText('Content is required');
  }

  async goto() {
    await this.page.goto('https://todo.testing.groupgti.com/');
  }

  async createTodo(content, date) {
    await this.todoInput.fill(content);
    await this.dueDateInput.fill(date);
    await this.createButton.click();
  }

  async expectTodoCount(count) {
    await expect(this.todoRows).toHaveCount(count);
  }

  async archiveFirstTodo() {
    await this.threeDotMenu.click();
    await this.archiveOption.click();
  }
}

export { TodoPage };
