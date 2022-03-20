/// <reference types="cypress" />

const alice = {
  username: "Alice",
  email: "alice@example.com",
  password: "Z6#6%xfLTarZ9U",
};
const bob = {
  username: "Bob",
  email: "bob@example.com",
  password: "L%e$xZHC4QKP@F",
};
const carl = {
  username: "Carl",
  email: "Carl@example.com",
  password: "S^D%$*FGsa295",
};

describe("Bug Fix: Sending Messages Extra Case", () => {
  it("setup", () => {
    cy.signup(alice.username, alice.email, alice.password);
    cy.logout();
    cy.signup(bob.username, bob.email, bob.password);
    cy.logout();
    cy.signup(carl.username, carl.email, carl.password);
    cy.logout();
  });

  it("sends multiple messages from multi users to single user", () => {
    cy.login(alice.username, alice.password);

    cy.get("input[name=search]").type("Bob");
    cy.contains("Bob").click();

    cy.get("input[name=text]").type("First message{enter}");
    cy.logout();

    cy.login(carl.username, carl.password);

    cy.get("input[name=search]").type("Bob");
    cy.contains("Bob").click();

    cy.get("input[name=text]").type("Second message{enter}");
    cy.logout();

    cy.login(bob.username, bob.password);
    // Carl should be first since he sent the last message
    cy.contains("Carl").then(() => {
      const $firstMessage = Cypress.$(':contains("Carl")');
      const $secondMessage = Cypress.$(':contains("Alice")');
      const $list = $firstMessage.parents().has($secondMessage).first();
      cy.wrap($list).children().eq(-2).should("contain", "Carl");
      cy.wrap($list).children().eq(-1).should("contain", "Alice");

    });
    cy.logout();

    // New message from alice
    cy.login(alice.username, alice.password);
    cy.contains("Bob").click();

    cy.get("input[name=text]").type("Third message{enter}");
    cy.logout();

    cy.login(bob.username, bob.password);
    // Alice should be first since she sent the last message
    cy.contains("Alice").then(() => {
      const $firstMessage = Cypress.$(':contains("Alice")');
      const $secondMessage = Cypress.$(':contains("Carl")');
      const $list = $firstMessage.parents().has($secondMessage).first();
      cy.wrap($list).children().eq(-2).should("contain", "Alice");
      cy.wrap($list).children().eq(-1).should("contain", "Carl");
    });
    cy.logout();
    cy.reload();
  });

  it("sidebar displays messages in correct order", () => {
    cy.reload();
    cy.login(alice.username, alice.password);
    cy.contains("Bob").click();

    cy.get("input[name=text]").type("Fourth message{enter}");
    cy.logout();

    cy.login(bob.username, bob.password);

    cy.contains("Fourth message");
  });
});
