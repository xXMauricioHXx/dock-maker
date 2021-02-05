export interface SwaggerMap {
  rootPath?: string;
  methods?: any[];
}

export interface Method {
  method: string;
  responseStatus: number;
  path: string;
  schema?: string;
  properties?: any[];
}
