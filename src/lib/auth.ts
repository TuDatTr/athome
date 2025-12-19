import { KeyCloak } from "arctic";

const keycloakBaseUrl = process.env.KEYCLOAK_URL || "http://localhost:8080";
const realm = process.env.KEYCLOAK_REALM || "athomev2";
const clientId = process.env.KEYCLOAK_CLIENT_ID || "athomev2-client";
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || "";
const redirectUri = "http://localhost:3001/admin/callback";

const realmUrl = `${keycloakBaseUrl}/realms/${realm}`;

export const keycloak = new KeyCloak(
	realmUrl,
	clientId,
	clientSecret,
	redirectUri
);
