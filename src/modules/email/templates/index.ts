// src/modules/email/templates/index.ts
export interface EmailTemplateData {
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

export interface EmailConfig {
  subject: string;
  template: string;
}
