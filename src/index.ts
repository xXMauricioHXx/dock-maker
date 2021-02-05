import fs from "fs";
import path from "path";
import * as config from "./config.json";
import { SwaggerMap } from "./types";
import { getRootPath, getMethods, getSchemaByMethod } from "./helper";

let swaggerConfigs = new Set();

let actualPath = path.join(config.folderPath, config.requestPath);
const files = fs.readdirSync(actualPath);

let mapping: SwaggerMap = {};

files.forEach((file: string) => {
  if (config.excludeFiles.includes(file)) {
    return;
  }

  const content = fs.readFileSync(path.join(actualPath, file), {
    encoding: "utf-8",
  });

  mapping.rootPath = getRootPath(content);

  const loadedSchema = fs.readFileSync(
    path.join(config.folderPath, config.schemaPath, file),
    {
      encoding: "utf-8",
    }
  );

  mapping.methods = getMethods(content).map((method) => {
    return {
      ...method,
      properties: getSchemaByMethod(method, loadedSchema),
    };
  });

  swaggerConfigs.add(mapping);
});

swaggerConfigs.forEach((item) => console.log(JSON.stringify(item, null, 2)));
