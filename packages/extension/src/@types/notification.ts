// Params Type Definitions

export interface NotyphiOrganisation {
  id: string;
  name: string;
  logo_href: string;
}

export interface NotyphiNotification {
  delivery_id: string;
  title: string;
  content: string;
  cta_title: string;
  cta_url: string;
  delivered_at: Date;
  read_at: Date;
  clicked_at: Date;
  rejected_at: Date;
}
