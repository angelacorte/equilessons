export enum SnackBarActions {
  REFRESH,
  RETRY,
  RELOAD
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
