// import { msalInstance, scopes } from "./msal";
// import { InteractionRequiredAuthError } from "@azure/msal-browser";
//
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
//
// async function getTokens() {
//     const accounts = msalInstance.getAllAccounts();
//     const account = accounts[0];
//     if (!account) {
//         throw new Error("No active account");
//     }
//     const tokenResponse = await msalInstance
//         .acquireTokenSilent({
//             scopes: scopes,
//             account: account,
//         })
//         .catch((error) => {
//             if (error instanceof InteractionRequiredAuthError) {
//                 return msalInstance.acquireTokenRedirect({
//                     scopes: scopes,
//                     account: account,
//                 });
//             }
//         });
//
//     if (!tokenResponse) {
//         throw new Error("No tokenResponse");
//     }
//     return tokenResponse;
// }

// backend fetcher that appends the Bearer token to the request
// async function fetchFromBackend(path: Path, options: RequestInit) {
//     const tokens = await getTokens();
//     const response = await fetch(`${BACKEND_URL}${path}`, {
//         ...options,
//         headers: {
//             ...options.headers,
//             Authorization: `Bearer ${tokens.accessToken}`,
//         },
//     });
//     if (!response.ok) {
//         throw new Error(`Backend error: ${response.status} ${response.statusText}`);
//     }
//     return response;
// }

// type Path = `/${string}`;
