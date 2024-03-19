export interface Record {
  agent_address: {
    records: [
      {
        address: string;
        weight: number;
      }
    ];
  };
}

export interface DomainRecord {
  record: {
    records: [Record];
  };
  is_public: boolean;
  is_available: boolean;
  domain_type: string;
}

export interface Permissions {
  permissions: any;
}

export interface ContractState {
  state: {
    almanac_address: string;
  };
}

export interface PublicDomains {
  public_domains: string[];
}
export interface ValidateAddress {
  is_valid: boolean;
}
