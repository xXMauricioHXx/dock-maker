import { Method } from "./types";
var Joi = require("joi");
var convert = require("joi-to-json");

export const getRootPath = (content: string): string => {
  const [path] = content.match(/@Controller\('\/[a-z].*[a-z]/gm) as string[];
  return path.replace("@Controller('", "");
};

export const getPath = (content: string): string => {
  const [path] = content.match(/'.*'(?=,|\))/gm) as string[];
  return path.replace(/'/g, "");
};

export const getResponseStatus = (content: string): number => {
  const [resStatus] = content.match(
    /res\.(status|sendStatus).*?\)/gm
  ) as string[];

  if (!resStatus) {
    return 200;
  }

  const [status] = resStatus.match(/\d+/gm) as string[];

  return parseInt(status, 10);
};

export const getMethodSchema = (content: string): string | undefined => {
  const searchedSchema = content.match(/(?<=validatorMiddleware\()(\w*)/gm);

  if (!searchedSchema?.length) {
    return;
  }

  return searchedSchema[0];
};

export const getPostMethod = (content: string): Method | undefined => {
  let method = content.match(/@Post(.*\s*)*?(\})$/gm) as string[];

  if (!method?.length) {
    return;
  }
  const [postMethod] = method;
  return {
    method: "post",
    responseStatus: getResponseStatus(postMethod),
    path: getPath(postMethod),
    schema: getMethodSchema(postMethod),
  };
};

export const getGetMethod = (content: string): Method | undefined => {
  const method = content.match(/@Get(.*\s*)*?(\})$/gm) as string[];
  if (!method?.length) {
    return;
  }

  const [getMethod] = method;
  return {
    method: "get",
    responseStatus: getResponseStatus(getMethod),
    path: getPath(getMethod),
    schema: getMethodSchema(getMethod),
  };
};

export const getPutMethod = (content: string): Method | undefined => {
  const method = content.match(/@Put(.*\s*)*?(\})$/gm) as string[];
  if (!method?.length) {
    return;
  }

  const [putMethod] = method;
  return {
    method: "put",
    responseStatus: getResponseStatus(putMethod),
    path: getPath(putMethod),
    schema: getMethodSchema(putMethod),
  };
};

export const getDeleteMethod = (content: string): Method | undefined => {
  const method = content.match(/@Delete(.*\s*)*?(\})$/gm) as string[];
  if (!method?.length) {
    return;
  }

  const [deleteMethod] = method;
  return {
    method: "delete",
    responseStatus: getResponseStatus(deleteMethod),
    path: getPath(deleteMethod),
    schema: getMethodSchema(deleteMethod),
  };
};

export const getSchemaByMethod = (method: Method, schema: string) => {
  if (!method.schema) {
    return;
  }

  const regexp = new RegExp(
    `(?<=${method.schema} = )(.*\\s*)*?\\}\\)\\;`,
    "gm"
  );

  const [methodSchema] = schema.match(regexp) as string[];

  var joiSchema = eval(`${methodSchema.replace(/\\n/g, "")}`);
  return convert(joiSchema).properties;
};

export const getMethods = (content: string): Method[] => {
  const methods = [
    getPostMethod(content),
    getGetMethod(content),
    getPutMethod(content),
    getDeleteMethod(content),
  ].filter(Boolean) as Method[];

  if (!methods.length) {
    return [];
  }
  return methods;
};
