export interface DomainsOwnedBy {
  domains: string[];
  owner: string;
}

export interface DomainData {
  domain_data: {
    address: string;
    avatar: string;
    background: string;
    description: string;
    email: string;
    github: string;
    twitter: string;
    website: string;
  };
}

export interface DomainStatus {
  domain_status: {
    Owned: { is_renewable: string; owner: string; registration_time: string };
  };
}

export interface PrimaryDomain {
  domain: string;
}

export interface DomainPrice {
  is_valid_domain: boolean;
  result: {
    Success: {
      can_register: boolean;
      normalized_domain: string;
      pricing: { denom: string; amount: string };
    };
  };
}
export interface BeneficiaryAddress {
  address: string;
}

export interface DomainsByBeneficiary {
  address: string;
  domains: string[];
}
