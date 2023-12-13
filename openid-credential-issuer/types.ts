// Reference: https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#section-10.2.3

export interface CredentialIssuerMetadata {
  /**
   * REQUIRED. The Credential Issuer's identifier, as defined in Section 10.2.1.
   */
  credential_issuer: string;

  /**
   * OPTIONAL. An array of strings, where each string is an identifier of the OAuth 2.0 Authorization Server (as defined in [RFC8414]) the Credential Issuer relies on for authorization. If this parameter is omitted, the entity providing the Credential Issuer is also acting as the AS, i.e., the Credential Issuer's identifier is used as the OAuth 2.0 Issuer value to obtain the Authorization Server metadata as per [RFC8414]. When there are multiple entries in the array, the Wallet may be able to determine which AS to use by querying the metadata; for example, by examining the grant_types_supported values, the Wallet can filter the server to use based on the grant type it plans to use. When the Wallet is using authorization_server parameter in the Credential Offer as a hint to determine which AS to use out of multiple, the Wallet MUST NOT proceed with the flow if the authorization_server Credential Offer parameter value does not match any of the entries in the authorization_servers array.
   */
  authorization_servers?: string[];

  /**
   * REQUIRED. URL of the Credential Issuer's Credential Endpoint. This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
   */
  credential_endpoint: string;

  /**
   * OPTIONAL. URL of the Credential Issuer's Batch Credential Endpoint. This URL MUST use the https scheme and MAY contain port, path, and query parameter components. If omitted, the Credential Issuer does not support the Batch Credential Endpoint.
   */
  batch_credential_endpoint?: string;

  /**
   * OPTIONAL. URL of the Credential Issuer's Deferred Credential Endpoint. This URL MUST use the https scheme and MAY contain port, path, and query parameter components. If omitted, the Credential Issuer does not support the Deferred Credential Endpoint.
   */
  deferred_credential_endpoint?: string;

  /**
   * OPTIONAL. An array of objects, where each object contains display properties of a Credential Issuer for a certain language.
   */
  display?: BaseDisplayObject[];

  /**
   * REQUIRED.
   * An object that describes specifics of the Credential that the Credential Issuer supports issuance of. This object contains a list of name/value pairs, where each name is a unique identifier of the supported Credential being described.
   * This identifier is used in the Credential Offer as defined in Section 4.1.1 to communicate to the Wallet which Credential is being offered. The value is an object that contains metadata about specific Credential.
   */
  credentials_supported: { [key: string]: CredentialMetadata };
}

export interface CredentialMetadata {
  /**
   * REQUIRED.
   * A JSON string identifying the format of this Credential, i.e., jwt_vc_json or ldp_vc.
   * Depending on the format value, the object contains further elements defining the type and (optionally) particular claims the Credential MAY contain and information about how to display the Credential.
   * Appendix E defines Credential Format Profiles introduced by this specification. https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#appendix-E.1
   */
  format: "jwt_vc_json" | "ldp_vc" | "jwt_vc_json-ld";

  /**
   * OPTIONAL. A JSON string identifying the scope value that this Credential Issuer supports for this particular Credential. The value can be the same accross multiple credentials_supported objects. The Authorization Server MUST be able to uniquely identify the Credential Issuer based on the scope value. The Wallet can use this value in the Authorization Request as defined in Section 5.1.2. Scope values in this Credential Issuer metadata MAY duplicate those in the scopes_supported parameter of the Authorization Server.
   */
  scope?: string;

  /**
   * OPTIONAL.
   * Array of case sensitive strings that identify how the Credential is bound to the identifier of the End-User who possesses the Credential as defined in Section 7.1.
   * Support for keys in JWK format [RFC7517] is indicated by the value jwk.
   * Support for keys expressed as a COSE Key object [RFC8152] (for example, used in [ISO.18013-5]) is indicated by the value cose_key.
   * When Cryptographic Binding Method is a DID, valid values MUST be a did: prefix followed by a method-name using a syntax as defined in Section 3.1 of [DID-Core], but without a :and method-specific-id.
   * For example, support for the DID method with a method-name "example" would be represented by did:example.
   * Support for all DID methods listed in Section 13 of [DID_Specification_Registries] is indicated by sending a DID without any method-name.
   */
  cryptographic_binding_methods_supported?: string[];

  /**
   * OPTIONAL.
   * Array of case sensitive strings that identify the cryptographic suites that are supported for the cryptographic_binding_methods_supported.
   * Cryptographic algorithms for Credentials in jwt_vc format should use algorithm names defined in IANA JOSE Algorithms Registry.
   * Cryptographic algorithms for Credentials in ldp_vc format should use signature suites names defined in Linked Data Cryptographic Suite Registry.
   */
  cryptographic_suites_supported?: string[];

  /**
   * OPTIONAL.
   * A JSON array of case sensitive strings, each representing proof_type that the Credential Issuer supports.
   * Supported values include those defined in Section 7.2.1 or other values defined in a profile of this specification or elsewhere.
   * If omitted, the default value is jwt. proof_type claim is defined in Section 7.2.
   */
  proof_types_supported?: string[];

  /**
   * OPTIONAL. An array of objects, where each object contains the display properties of the supported Credential for a certain language.
   */
  display?: CredentialMetadataDisplay[];

  /**
   * REQUIRED. Object containing the detailed description of the Credential type.
   */
  credential_definition: CredentialDefinition;
}

export interface CredentialDefinition {
  /**
   * REQUIRED. Array designating the types a certain Credential type supports according to [VC_DATA], Section 4.3.
   */
  type: string[];

  /**
   * OPTIONAL.
   * An object containing a list of name/value pairs, where each name identifies a claim offered in the Credential.
   * The value can be another such object (nested data structures), or an array of such objects.
   * To express the specifics about the claim, the most deeply nested value MAY be an object of type
   */
  credentialSubject?: CredentialSubject;
}

/**
 * An object containing a list of name/value pairs, where each name identifies a claim offered in the Credential.
 * The value can be another such object (nested data structures), or an array of such objects.
 * To express the specifics about the claim, the most deeply nested value MAY be an object of type `CredentialSubjectItem`
 */
export interface CredentialSubject {
  [key: string]:
    | CredentialDefinition
    | CredentialDefinition[]
    | CredentialSubjectItem; // https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#appendix-E.1.1.2-2.1.2.2.1
}

export interface CredentialSubjectItem {
  /**
   * OPTIONAL. Boolean which when set to true indicates the claim MUST be present in the issued Credential. If the mandatory property is omitted its default should be assumed to be false.
   */
  mandatory?: boolean;

  /**
   * OPTIONAL. String value determining the type of value of the claim. A non-exhaustive list of valid values defined by this specification are string, number, and image media types such as image/jpeg as defined in IANA media type registry for images (https://www.iana.org/assignments/media-types/media-types.xhtml#image).
   */
  value_type?: string; // TODO - find the exaustive list

  /**
   * OPTIONAL. An array of objects, where each object contains display properties of a certain claim in the Credential for a certain language.
   */
  display?: BaseDisplayObject[];
}

/**
 * An array of objects, where each object contains display properties of a Credential Issuer for a certain language.
 */
export interface BaseDisplayObject {
  /**
   * OPTIONAL. String value of a display name for the Credential Issuer.
   */
  name?: string;

  /**
   * OPTIONAL. String value that identifies the language of this object represented as a language tag taken from values defined in BCP47 [RFC5646]. There MUST be only one object for each language identifier.
   */
  locale?: string;
}

export interface CredentialMetadataDisplay extends BaseDisplayObject {
  /**
   * OPTIONAL. String value of a description of the Credential.
   */
  description?: string;

  /**
   * OPTIONAL. A JSON object with information about the logo of the Credential
   */
  logo?: {
    /**
     * OPTIONAL. URL where the Wallet can obtain a logo of the Credential from the Credential Issuer.
     */
    url?: string;

    /**
     * OPTIONAL. String value of an alternative text of a logo image.
     */
    alt_text?: string;
  };

  /**
   * OPTIONAL. String value of a background color of the Credential represented as numerical color values defined in CSS Color Module Level 37 [CSS-Color].
   */
  background_color?: string;

  /**
   * OPTIONAL. String value of a text color of the Credential represented as numerical color values defined in CSS Color Module Level 37 [CSS-Color].
   */
  text_color?: string;
}
