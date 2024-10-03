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

test("Debería mostrar hoteles encontrados", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("¿A dónde te diriges?").fill("Test País");
  await page.getByRole("button", { name: "Buscar" }).click();

  await expect(
    page.getByText("Hoteles encontrados en Test País")
  ).toBeVisible();
  await expect(page.getByText("Test Hotel").first()).toBeVisible();
});

test("Debería mostrar detalles de un hotel", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("¿A dónde te diriges?").fill("Test País");
  await page.getByRole("button", { name: "Buscar" }).click();

  await page.getByText("Test Hotel").first().click();
  await expect(page).toHaveURL(/detail/);
  await expect(
    page.getByRole("button", { name: "Reserva ahora" })
  ).toBeVisible();
});

test("Debería reservar un hotel", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("¿A dónde te diriges?").fill("Test País");
  const date = new Date();
  date.setDate(date.getDate() + 3); // Fecha de salida en 3 días
  const formattedDate = date.toISOString().split("T")[0]; // Formato de fecha YYYY-MM-DD
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Buscar" }).click();

  await page.getByText("Test Hotel").first().click();
  await page.getByRole("button", { name: "Reserva ahora" }).click();

  await expect(page.getByText("Costo total: MXN 3000.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator("[placeholder='Card number']")
    .fill("4242424242424242");
  await stripeFrame.locator("[placeholder='MM / YY']").fill("12/40");
  await stripeFrame.locator("[placeholder='CVC']").fill("123");
  await stripeFrame.locator("[placeholder='ZIP']").fill("12345");

  await page.getByRole("button", { name: "Confirmar Reservación" }).click();
  await expect(page.getByText("Reservación exitosa")).toBeVisible();

  await page.getByRole("link", { name: "Mis reservaciones" }).click();
  await expect(page.getByText("Test Hotel")).toBeVisible();

  
});
