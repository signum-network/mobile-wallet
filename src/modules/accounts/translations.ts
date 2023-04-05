export const auth = {
  passcode: {
    passcode: 'accounts.passcode.passcode',
  },
  setPasscodeModal: {
    enterAgain: 'accounts.modals.setPasscode.enterAgain',
    passcodeHint: 'accounts.modals.setPasscode.passcodeHint',
  },
  enterPasscodeModal: {
    passcodeHint: 'accounts.modals.enterPasscode.passcodeHint',
    forgotPin: 'accounts.modals.enterPasscode.forgotPin',
    confirmReset: 'accounts.modals.enterPasscode.confirmReset',
  },
  accounts: {
    title: 'accounts.screens.accounts.title',
    noAccounts: {
      hint: 'accounts.screens.accounts.noAccounts.hint',
      title: 'accounts.screens.accounts.noAccounts.title',
    },
    addAccount: 'accounts.screens.accounts.addAccount',
    createAccount: 'accounts.screens.accounts.createAccount',
  },
  accountDetails: {
    noTransactions: {
      title: 'accounts.screens.accountDetails.noTransactions.title',
    },
    copiedSuccessfully: 'accounts.screens.accountDetails.copiedSuccessfully',
    copy: 'accounts.screens.accountDetails.copy',
  },
  transactionDetails: {
    copiedSuccessfully:
      'accounts.screens.transactionDetails.copiedSuccessfully',
    copy: 'accounts.screens.transactionDetails.copy',
    headerTitle: 'accounts.screens.transactionDetails.headerTitle',
  },
  createAccount: {
    step: 'accounts.screens.createAccount.step',
    title: 'accounts.screens.createAccount.title',
    notePassphrase: 'accounts.screens.createAccount.notePassphrase',
    notePassphraseHint: 'accounts.screens.createAccount.notePassphraseHint',
    notePassphraseHint2: 'accounts.screens.createAccount.notePassphraseHint2',
    howToGenerate: 'accounts.screens.createAccount.howToGenerate',
    generateSeed: 'accounts.screens.createAccount.generateSeed',
    generatedPercent: 'accounts.screens.createAccount.generatedPercent',
    createAccount: 'accounts.screens.createAccount.createAccount',
    enterPin: 'accounts.screens.createAccount.enterPin',
    enterPinHint: 'accounts.screens.createAccount.enterPinHint',
    next: 'core.actions.next',
    notedIt: 'accounts.screens.createAccount.notedIt',
    finalize: 'accounts.screens.createAccount.finalize',
    verifyPhrase: 'accounts.screens.createAccount.verifyPhrase',
    enterWord: 'accounts.screens.createAccount.enterWord',
  },
  addAccount: {
    title: 'accounts.screens.addAccount.title',
    createAccount: 'accounts.screens.addAccount.createAccount',
    hint: 'accounts.screens.addAccount.hint',
    importAccount: 'accounts.screens.addAccount.importAccount',
    limitReached: 'accounts.screens.addAccount.limitReached',
    limitReachedHint: 'accounts.screens.addAccount.limitReachedHint',
  },
  importAccount: {
    import: 'accounts.screens.importAccount.import',
    activeAccount: 'accounts.screens.importAccount.activeAccount',
    activeAccountHint: 'accounts.screens.importAccount.activeAccountHint',
    passiveAccountHint: 'accounts.screens.importAccount.passiveAccountHint',
    title: 'accounts.screens.importAccount.title',
    showPassphrase: 'accounts.screens.importAccount.showPassphrase',
    accountPreviewLabel: 'accounts.screens.importAccount.accountPreviewLabel',
  },
  scanAccount: {
    scanAddress: 'accounts.screens.scanAccount.scanAddress',
    scanRecoveryPhrase: 'accounts.screens.scanAccount.scanRecoveryPhrase',
  },
  errors: {
    accountExist: 'accounts.errors.accountExist',
    incorrectAddress: 'accounts.errors.incorrectAddress',
    incorrectPassphrase: 'accounts.errors.incorrectPassphrase',
    insecurePin: 'accounts.errors.insecurePin',
    incorrectPasscode: 'accounts.errors.incorrectPasscode',
  },
  models: {
    account: {
      id: 'models.account.id',
      address: 'models.account.address',
      pin: 'models.account.pin',
      passphrase: 'models.account.passphrase',
    },
    passcode: {
      passcode: 'accounts.models.passcode.passcode',
    },
  },
};
