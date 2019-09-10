export interface SpecificAuthorizationOption {
  forAuthenticated: boolean;
  forPublic: boolean;
}

export interface AuthorizationOptions {
  commands: {
    removeFile: SpecificAuthorizationOption;
    transferOwnership: SpecificAuthorizationOption;
    authorize: SpecificAuthorizationOption;
  };
  queries: {
    getFile: SpecificAuthorizationOption;
  };
}

export interface OwnedAuthorizationOptions extends AuthorizationOptions {
  owner: string;
}
