export enum SnackBarActions {
  REFRESH, //without reloading the page, eg. the tables
  RETRY,
  RELOAD,
  LOGIN,
  DO_NOTHING,
  ASSIGN
}

export enum SnackBarMessages{
  SUCCESS = 'Azione compiuta con successo.',
  PROBLEM = 'È stato riscontrato un problema, riprova.',
  NOTHING = "Non è stata compiuta alcuna azione",
  NOT_POSSIBLE = "Non è possibile svolgere l'azione richiesta."

}

export enum LoginMessages{
  FAILED = "Username o password errati.",
  ERROR = "Internal server error."
}

export enum SignupMessages{
  LOGIN = "Registrazione avvenuta con successo, vai al login.",
  ALREADY_EXISTS = "Username o email già registrato.",
  FAILED = "La registrazione non è andata a buon fine, riprova.",
  PRESENT = "Utente già registrato."
}

export enum Action{
  REMOVE,
  ADD
}
