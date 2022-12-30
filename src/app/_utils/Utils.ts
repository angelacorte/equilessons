export enum SnackBarActions {
  REFRESH,
  RETRY,
  RELOAD,
  LOGIN
}

export enum SnackBarMessages{
  OK = 'Azione compiuta con successo.',
  RETRY = 'È stato riscontrato un problema, riprova.',
  NOTHING = "Non è stata compiuta alcuna azione"

}

export enum LoginMessages{
  FAILED = "Username o password errati.",
  ERROR = "Internal server error."
}

export enum SignupMessages{
  LOGIN = "Registrazione avvenuta con successo, vai al login.",
  ALREADY_EXISTS = "Username o email già registrato.",
  FAILED = "La registrazione non è andata a buon fine, riprova."
}
