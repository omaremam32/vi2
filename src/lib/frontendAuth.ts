"use client";

export type FrontendAccount = {
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
};

const ACCOUNT_KEY =
  "vi2-frontend-account";

const SESSION_KEY =
  "vi2-frontend-session";

function announceAuthChange() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.dispatchEvent(
    new Event(
      "vi2-auth-change",
    ),
  );
}

export function saveFrontendAccount(
  account: FrontendAccount,
) {
  window.localStorage.setItem(
    ACCOUNT_KEY,
    JSON.stringify(
      account,
    ),
  );

  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email:
        account.email,

      signedInAt:
        new Date().toISOString(),
    }),
  );

  announceAuthChange();
}

export function getFrontendAccount():
  | FrontendAccount
  | null {
  try {
    const raw =
      window.localStorage.getItem(
        ACCOUNT_KEY,
      );

    if (!raw) {
      return null;
    }

    return JSON.parse(
      raw,
    ) as FrontendAccount;
  } catch {
    return null;
  }
}

export function isFrontendSignedIn() {
  try {
    return Boolean(
      window.localStorage.getItem(
        SESSION_KEY,
      ),
    );
  } catch {
    return false;
  }
}

export function signInFrontend(
  email: string,
) {
  const account =
    getFrontendAccount();

  if (
    !account ||
    account.email.toLowerCase() !==
      email
        .trim()
        .toLowerCase()
  ) {
    return {
      ok: false,
      message:
        "No account with this email exists on this browser yet.",
    };
  }

  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email:
        account.email,

      signedInAt:
        new Date().toISOString(),
    }),
  );

  announceAuthChange();

  return {
    ok: true,
    account,
  };
}

export function signOutFrontend() {
  window.localStorage.removeItem(
    SESSION_KEY,
  );

  announceAuthChange();
}
