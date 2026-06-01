package com.covid19.covid_19_tracker;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class SeleniumTest {

    public static void main(String[] args) throws InterruptedException {

        // Launch Chrome Browser
        WebDriver driver = new ChromeDriver();

        // Maximize Window
        driver.manage().window().maximize();

        System.out.println("Opening Application...");

        // Open App
        driver.get("http://localhost:3000/");

        Thread.sleep(3000);

        // Open Dashboard
        System.out.println("Opening Dashboard...");

        driver.findElement(By.linkText("Dashboard"))
                .click();

        Thread.sleep(3000);

        // Open Register Page
        System.out.println("Opening Register Page...");

        driver.findElement(By.linkText("Create new account →"))
                .click();

        Thread.sleep(3000);

        // Fill Username
        System.out.println("Entering Username...");

        driver.findElement(
                By.xpath("//input[@placeholder='new_user']")
        ).sendKeys("mayank sir");

        Thread.sleep(2000);

        // Fill Password
        System.out.println("Entering Password...");

        driver.findElement(
                By.xpath("//input[@type='password']")
        ).sendKeys("123456");

        Thread.sleep(2000);

        // Select Role
        System.out.println("Selecting Role...");

        WebElement roleDropdown = driver.findElement(
                By.tagName("select")
        );

        roleDropdown.sendKeys("ADMIN");

        Thread.sleep(2000);

        // Click Register Button
        System.out.println("Clicking Register Button...");

        driver.findElement(
                By.xpath("//button[contains(text(),'Register account')]")
        ).click();

        Thread.sleep(5000);

        // Go Home
        System.out.println("Opening Home Page...");

        driver.findElement(By.linkText("Home"))
                .click();

        Thread.sleep(4000);

        // Scroll Down
        System.out.println("Scrolling Page...");

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        js.executeScript("window.scrollBy(0,2000)");

        Thread.sleep(3000);

        // Select Region
        System.out.println("Selecting Africa Region...");

        WebElement regionDropdown = driver.findElement(
                By.tagName("select")
        );

        regionDropdown.sendKeys("Africa");

        Thread.sleep(3000);

        // Click Buttons
        System.out.println("Clicking Deaths Button...");

        driver.findElement(
                By.xpath("//button[contains(text(),'Deaths')]")
        ).click();

        Thread.sleep(2000);

        System.out.println("Clicking Recovered Button...");

        driver.findElement(
                By.xpath("//button[contains(text(),'Recovered')]")
        ).click();

        Thread.sleep(2000);

        System.out.println("Clicking Active Button...");

        driver.findElement(
                By.xpath("//button[contains(text(),'Active')]")
        ).click();

        Thread.sleep(2000);

        System.out.println("Clicking 1W Growth % Button...");

        driver.findElement(
                By.xpath("//button[contains(text(),'1W Growth %')]")
        ).click();

        Thread.sleep(3000);

        // Reset Region
        System.out.println("Resetting Region...");

        regionDropdown.sendKeys("All Regions");

        Thread.sleep(3000);

        // Assertion
        System.out.println("Checking Test Result...");

        String currentUrl = driver.getCurrentUrl();

        if (currentUrl.contains("localhost")) {

            System.out.println("✅ Test Passed");

        } else {

            System.out.println("❌ Test Failed");
        }

        Thread.sleep(5000);

        // Close Browser
        driver.quit();

        System.out.println("Browser Closed");
    }
}
