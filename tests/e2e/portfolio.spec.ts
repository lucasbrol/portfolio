import { expect, test, type Page } from "@playwright/test";

/** Simula o backend do chat para testar a interface de forma determinística. */
async function mockChat(page: Page, body: object, status = 200) {
  await page.route("**/api/chat", (route) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }),
  );
}

test.describe("Página", () => {
  test("mostra nome, foto e seções principais", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Lucas Brasil Oliveira");
    await expect(page.getByAltText("Foto de Lucas Brasil Oliveira")).toBeVisible();
    for (const id of ["sobre", "trajetoria", "projetos", "contato"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("lista repositórios com links para o GitHub", async ({ page }) => {
    await page.goto("/");
    const repos = page.getByTestId("repos").locator("a");
    await expect(repos.first()).toBeVisible();
    const hrefs = await repos.evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const h of hrefs) expect(h).toMatch(/^https:\/\/github\.com\//);
  });

  test("troca o idioma para inglês e lembra a escolha", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("lang-en").click();
    await expect(page.getByRole("heading", { name: "Ask anything about Lucas" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.reload();
    await expect(page.getByTestId("lang-en")).toHaveAttribute("aria-pressed", "true");
  });

  test("mostra as tecnologias com logo, onde foram usadas e o aviso de que usar não é dominar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#habilidades")).toContainText("não quer dizer que domino todas");
    const chip = page.getByTestId("tech").locator(".chip", { hasText: "FastAPI" });
    await expect(chip).toHaveAttribute("title", "Usado em: ParkFinder, RideFleet");
    const img = chip.locator("img");
    await img.scrollIntoViewIfNeeded();
    await expect(img).toBeVisible();
    await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).complete)).toBe(true);
    const res = await page.request.get((await img.getAttribute("src"))!);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("svg");
  });

  test("tem link para o Instagram", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#contato").getByRole("link", { name: /lucasbr_ol/ })).toHaveAttribute(
      "href",
      "https://www.instagram.com/lucasbr_ol/",
    );
  });
});

test.describe("Chat (interface)", () => {
  test("pergunta sugerida mostra resposta com link do repositório", async ({ page }) => {
    await mockChat(page, {
      answer: "O principal projeto de QA do Lucas é o **Eventhub-qa-project**.",
      found: true,
      sources: [{ title: "Repositório Eventhub-qa-project", url: "https://github.com/lucasbrol/Eventhub-qa-project" }],
    });
    await page.goto("/");
    await page.getByTestId("suggestion").first().click();
    await expect(page.getByTestId("msg-user")).toHaveCount(1);
    const answer = page.getByTestId("msg-assistant");
    await expect(answer).toContainText("Eventhub-qa-project");
    await expect(answer.locator("strong")).toHaveText("Eventhub-qa-project");
    const link = page.getByTestId("sources").getByRole("link");
    await expect(link).toHaveAttribute("href", "https://github.com/lucasbrol/Eventhub-qa-project");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(page.getByTestId("suggestion")).toHaveCount(0);
  });

  test("resposta fora da base aparece sinalizada, sem links", async ({ page }) => {
    await mockChat(page, { answer: "Não tenho essa informação sobre o Lucas.", found: false, sources: [] });
    await page.goto("/");
    await page.getByTestId("chat-input").fill("Qual é o salário pretendido?");
    await page.getByTestId("chat-send").click();
    const answer = page.getByTestId("msg-assistant");
    await expect(answer).toHaveAttribute("data-found", "false");
    await expect(answer).toContainText("Fora da base");
    await expect(page.getByTestId("sources")).toHaveCount(0);
  });

  test("envia o histórico e o idioma para a API", async ({ page }) => {
    const bodies: Record<string, unknown>[] = [];
    await page.route("**/api/chat", async (route) => {
      bodies.push(route.request().postDataJSON());
      await route.fulfill({ json: { answer: "ok", found: true, sources: [] } });
    });
    await page.goto("/");
    await page.getByTestId("chat-input").fill("primeira");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("msg-assistant")).toHaveCount(1);
    await page.getByTestId("chat-input").fill("segunda");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("msg-assistant")).toHaveCount(2);
    expect(bodies[1]).toMatchObject({
      question: "segunda",
      lang: "pt",
      history: [
        { role: "user", content: "primeira" },
        { role: "assistant", content: "ok" },
      ],
    });
  });

  test("detecta inglês pelo navegador quando não há preferência salva", async ({ browser, baseURL }) => {
    // Contextos criados à mão não herdam o `use` do playwright.config.ts: o baseURL precisa ir explícito.
    const ctx = await browser.newContext({ locale: "en-US", baseURL });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.getByTestId("lang-en")).toHaveAttribute("aria-pressed", "true");
    await ctx.close();
  });

  test("mostra erro do servidor 503 com a resposta de contato", async ({ page }) => {
    await mockChat(page, { answer: "O assistente está indisponível no momento.", found: false, sources: [] }, 503);
    await page.goto("/");
    await page.getByTestId("chat-input").fill("teste");
    await page.getByTestId("chat-send").click();
    await expect(page.getByTestId("msg-assistant")).toContainText("indisponível");
  });

  test("mostra erro amigável (sem mensagem técnica) quando a rede falha", async ({ page }) => {
    await page.route("**/api/chat", (route) => route.abort());
    await page.goto("/");
    await page.getByTestId("chat-input").fill("teste");
    await page.getByTestId("chat-send").click();
    await expect(page.locator(".msg-error")).toContainText("Não consegui responder");
    await expect(page.locator(".msg-error")).not.toContainText("fetch");
  });

  test("botão enviar fica desabilitado com campo vazio e o campo limita 500 caracteres", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("chat-send")).toBeDisabled();
    await page.getByTestId("chat-input").fill("   ");
    await expect(page.getByTestId("chat-send")).toBeDisabled();
    await expect(page.getByTestId("chat-input")).toHaveAttribute("maxlength", "500");
  });
});

test.describe("API /api/chat (servidor real, índice de teste)", () => {
  test("recusa pergunta fora da base sem chamar a IA", async ({ request }) => {
    const res = await request.post("/api/chat", { data: { question: "Qual a capital da Mongólia?", lang: "pt" } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.found).toBe(false);
    expect(body.sources).toEqual([]);
    expect(body.answer).toContain("Não tenho essa informação");
  });

  test("valida entrada: vazia e longa demais → 400; JSON inválido → 400", async ({ request }) => {
    expect((await request.post("/api/chat", { data: { question: "" } })).status()).toBe(400);
    expect((await request.post("/api/chat", { data: { question: "a".repeat(501) } })).status()).toBe(400);
    const bad = await request.post("/api/chat", { headers: { "content-type": "application/json" }, data: "{oops" });
    expect(bad.status()).toBe(400);
  });
});
