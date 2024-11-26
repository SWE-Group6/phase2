/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_qualifyPackage from "../actions/qualifyPackage.js";
import type * as handlers_packageByRegexHandlers from "../handlers/packageByRegexHandlers.js";
import type * as handlers_packageHandlers from "../handlers/packageHandlers.js";
import type * as handlers_packageIdHandlers from "../handlers/packageIdHandlers.js";
import type * as handlers_trackHandlers from "../handlers/trackHandlers.js";
import type * as handlers_trial from "../handlers/trial.js";
import type * as http from "../http.js";
import type * as mutations_uploadPackage from "../mutations/uploadPackage.js";
import type * as package_rate_Models_AllMetrics from "../package_rate/Models/AllMetrics.js";
import type * as package_rate_Models_BusFactor from "../package_rate/Models/BusFactor.js";
import type * as package_rate_Models_Correctness from "../package_rate/Models/Correctness.js";
import type * as package_rate_Models_DependencyPinning from "../package_rate/Models/DependencyPinning.js";
import type * as package_rate_Models_License from "../package_rate/Models/License.js";
import type * as package_rate_Models_Metric from "../package_rate/Models/Metric.js";
import type * as package_rate_Models_Package from "../package_rate/Models/Package.js";
import type * as package_rate_Models_PulledCode from "../package_rate/Models/PulledCode.js";
import type * as package_rate_Models_RampUp from "../package_rate/Models/RampUp.js";
import type * as package_rate_Models_ResponsiveMaintainer from "../package_rate/Models/ResponsiveMaintainer.js";
import type * as queries_packageTable from "../queries/packageTable.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/qualifyPackage": typeof actions_qualifyPackage;
  "handlers/packageByRegexHandlers": typeof handlers_packageByRegexHandlers;
  "handlers/packageHandlers": typeof handlers_packageHandlers;
  "handlers/packageIdHandlers": typeof handlers_packageIdHandlers;
  "handlers/trackHandlers": typeof handlers_trackHandlers;
  "handlers/trial": typeof handlers_trial;
  http: typeof http;
  "mutations/uploadPackage": typeof mutations_uploadPackage;
  "package_rate/Models/AllMetrics": typeof package_rate_Models_AllMetrics;
  "package_rate/Models/BusFactor": typeof package_rate_Models_BusFactor;
  "package_rate/Models/Correctness": typeof package_rate_Models_Correctness;
  "package_rate/Models/DependencyPinning": typeof package_rate_Models_DependencyPinning;
  "package_rate/Models/License": typeof package_rate_Models_License;
  "package_rate/Models/Metric": typeof package_rate_Models_Metric;
  "package_rate/Models/Package": typeof package_rate_Models_Package;
  "package_rate/Models/PulledCode": typeof package_rate_Models_PulledCode;
  "package_rate/Models/RampUp": typeof package_rate_Models_RampUp;
  "package_rate/Models/ResponsiveMaintainer": typeof package_rate_Models_ResponsiveMaintainer;
  "queries/packageTable": typeof queries_packageTable;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
