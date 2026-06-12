// Forma dell'utente serializzato in sessione da Passport.
import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      matricola?: string;
      fullName?: string;
      email?: string;
      courseOfStudy?: string;
      // dati SAML necessari al Single Logout
      nameID?: string;
      nameIDFormat?: string;
      sessionIndex?: string;
    }
  }
}

export {};
