import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173';

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);

  // Hacer clic en el botón de inicio de sesión.
  await page.getByRole("link", { name: "Iniciar sesión" }).click();

  // Revisar que tenga el titulo de "Iniciar sesión"
  await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible();

  // Ingresar el correo electrónico y la contraseña.
  await page.locator("[name=email]").fill("test@test.com");
  await page.locator("[name=password]").fill("contra");

  // Hacer clic en el botón de inicio de sesión.
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  // Revisar que haya iniciado sesión esperando el ShowToast con el mensaje "Inicio de sesión exitoso".
  await expect(page.getByText("Inicio de sesión exitoso")).toBeVisible();

  await expect(page.getByRole("link", {name: "Mis reservaciones"})).toBeVisible();
  await expect(page.getByRole("link", {name: "Mis hoteles"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Cerrar sesión"})).toBeVisible();
});
