/// <reference types="cypress" />

const dave = {
  username: "Dave",
  email: "Dave@example.com",
  password: "d6#6%xfLTarZ9U",
};
const earl = {
  username: "Earl",
  email: "Earl@example.com",
  password: "E%e$xZHC4QKP@F",
};

describe("Feature: Unread Messages", () => {
  it("setup", () => {
    cy.signup(dave.username, dave.email, dave.password);
    cy.logout();

    cy.signup(earl.username, earl.email, earl.password);

    cy.get("input[name=search]").type("Dave");
    cy.contains("Dave").click();
    cy.get("input[name=text]").type("hey{enter}");
    cy.get("input[name=text]").type("whats{enter}");
    cy.get("input[name=text]").type("up{enter}");

    cy.logout();
  });

  it("sidebar notifications", () => {
    cy.reload();
    cy.login(dave.username, dave.password);

    // should have 3 notifs
    var notifs = cy.contains("3");
    notifs.click();

    // after clicking convo, no notifs
    notifs.should("not.be.visible");

    cy.get("input[name=text]").type("not much hbu{enter}");

  });

  it("avatar on last read message", () => {
    cy.reload();
    cy.login(earl.username, earl.password);
    cy.contains("Dave").click();

    //"up" should have Dave's avatar
    var lastReadMessage = cy.contains("up").parent().parent();
    lastReadMessage.children().should("have.class", "MuiAvatar-root");

    //"whats" should not have Dave's avatar
    var notLastReadMessage = cy.contains("whats").parent().parent();
    notLastReadMessage.children().should("not.have.class", "MuiAvatar-root");
  });
});
