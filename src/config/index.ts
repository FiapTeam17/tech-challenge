import {readFileSync} from "fs";
import {envs} from "./envs";
import loggerConfig from "./logger/index";
const pkg = JSON.parse(readFileSync("./package.json", {encoding: "utf8"}));

export const index: Partial<TsED.Configuration> = {
  version: pkg.version,
  envs,
  logger: loggerConfig,
  // additional shared configuration
};
