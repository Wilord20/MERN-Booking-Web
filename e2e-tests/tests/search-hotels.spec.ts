import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // Hacer clic en el botón de inicio de sesión.
  await page.getByRole("link", { name: "Iniciar sesión" }).click();

  // Revisar que tenga el titulo de "Iniciar sesión"
  await expect(
    page.getByRole("heading", { name: "Iniciar sesión" })
  ).toBeVisible();

  // Ingresar el correo electrónico y la contraseña.
  await page.locator("[name=email]").fill("test@test.com");
  await page.locator("[name=password]").fill("contra");

  // Hacer clic en el botón de inicio de sesión.
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  // Revisar que haya iniciado sesión esperando el ShowToast con el mensaje "Inicio de sesión exitoso".
  await expect(page.getByText("Inicio de sesión exitoso")).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("¿A dónde te diriges?").fill("Test País");
  await page.getByRole("button", { name: "Buscar" }).click();

  await expect(page.getByText("Hoteles encontrados en Test País")).toBeVisible();
  await expect(page.getByText("Test Hotel").first()).toBeVisible();
});

test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Getaways").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});