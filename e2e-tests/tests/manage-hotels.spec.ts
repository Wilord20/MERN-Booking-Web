import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173";

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

test("Debería permitir al usuario crear un nuevo hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`);

  // Registar un nuevo hotel.
  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test Ciudad");
  await page.locator('[name="country"]').fill("Test País");
  await page
    .locator('[name="description"]')
    .fill("Descripción de prueba para el hotel");
  await page.locator('[name="pricePerNight"]').fill("1000");
  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("4");

  // Subir imágenes.
  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files/hotel1.jpg"),
    path.join(__dirname, "files/hotel2.jpg"),
    path.join(__dirname, "files/hotel3.jpg"),
  ]);

  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("Hotel agregado exitosamente")).toBeVisible();
});

test("Debería permitir al usuario ver sus hoteles", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  // Revisar que haya hoteles en la lista.
  await expect(page.getByText("Mis hoteles")).toBeVisible();
  await expect(page.getByText("Test Hotel")).toBeVisible();
  await expect(page.getByText('Descripción de prueba para el hotel')).toBeVisible();

  await expect(page.getByText("Test Ciudad, Test País")).toBeVisible();
  await expect(page.getByText("Budget")).toBeVisible();
  await expect(page.getByText("$1000 por noche")).toBeVisible();
  await expect(page.getByText("2 adultos, 4 niños")).toBeVisible();
  await expect(page.getByText("3 Star Rating")).toBeVisible();

  await expect(page.getByRole("link", { name: "Ver detalles" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Agregar hotel" })).toBeVisible();

});