// Params Type Definitions

export interface NotyphiOrganisations {
  [key: string]: NotyphiOrganisation;
}
export interface NotyphiOrganisation {
  id: string;
  name: string;
  logo_href: string;
  follow: boolean;
}

export interface NotyphiTopic {
  name: string;
}

export interface NotyphiNotifications {
  [key: string]: NotyphiNotification;
}
export interface NotyphiNotification {
  delivery_id: string;
  title: string;
  content: string;
  cta_title: string;
  cta_url: string;
  delivered_at: string;
  read_at: string;
  clicked_at: string;
  rejected_at: string;
}

export interface NotificationSetup {
  isNotificationOn: boolean;
  organisations: NotyphiOrganisations;
  topics: string[];
}
