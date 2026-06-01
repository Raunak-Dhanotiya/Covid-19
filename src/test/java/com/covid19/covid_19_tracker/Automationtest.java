package com.covid19.covid_19_tracker;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;


public class Automationtest {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();
            page.navigate("http://localhost:3000/");
            page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Dashboard").setExact(true)).click();
            page.waitForTimeout(2000);

            page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Create new account →")).click();
            page.waitForTimeout(2000);

            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Username")).click();
            page.waitForTimeout(2000);

            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Username")).fill("mayank3");
            page.waitForTimeout(2000);

            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).click();
            page.waitForTimeout(2000);

            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).fill("123456");
            page.waitForTimeout(2000);

            page.getByLabel("Role AssignmentUSER (").selectOption("ADMIN");
            page.waitForTimeout(2000);

            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Register account")).click();
            page.waitForTimeout(2000);

            page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Home").setExact(true)).click();
            page.locator("section").filter(new Locator.FilterOptions().setHasText("Global Pandemic")).getByRole(AriaRole.IMG).click(new Locator.ClickOptions()
                    .setPosition(615, 12));
        }
    }
}
