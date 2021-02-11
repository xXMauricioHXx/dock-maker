import fs from "fs";
import * as config from "./config.json";
import Converter from "openapi-to-postmanv2";

const openapiFiles = fs.readdirSync(config.openapiPath);
openapiFiles.forEach(element => {
  const openapiFileData = fs.readFileSync(`${config.openapiPath}/${element}`, {
    encoding: "utf-8",
  });

  Converter.convert(
    { type: "string", data: openapiFileData },
    {},
    (err, conversionResult) => {
      if (!conversionResult.result) {
        console.log("Could not convert", conversionResult.reason);
      } else {
        const conversionResultData = conversionResult?.output[0]?.data;

        const collectionName = conversionResultData.info.name.replace(
          /\s/g,
          ""
        );

        const collectionFilePath = `${config.collectionPath}/${collectionName}.json`;

        const collectionData = JSON.stringify(conversionResultData);
        fs.writeFileSync(collectionFilePath, collectionData);
      }
    }
  );
});
