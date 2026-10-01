// src/core/capability.ts
var Capability = class _Capability {
  static disposition = {
    aim: { description: "Default" },
    reactTo: []
  };
  static mergeAim(current, incoming) {
    const description = incoming?.description ?? current?.description ?? "";
    const currentBody = current?.body ?? {};
    const incomingBody = incoming?.body ?? {};
    const hasBody = current?.body !== void 0 || incoming?.body !== void 0;
    const body = hasBody ? { ...currentBody, ...incomingBody } : void 0;
    return body !== void 0 ? { description, body } : { description };
  }
  static mergeReactTo(current, incoming) {
    if (!incoming?.length) {
      return current?.length ? [...current] : [];
    }
    if (!current?.length) {
      return [...incoming];
    }
    return [.../* @__PURE__ */ new Set([...current, ...incoming])];
  }
  static buildDisposition(current, incoming) {
    const { aim: incomingAim, reactTo: incomingReactTo, inputs, outputs } = incoming ?? {};
    const aim = _Capability.mergeAim(current?.aim, incomingAim);
    const reactTo = _Capability.mergeReactTo(current?.reactTo, incomingReactTo);
    const activeInputs = inputs ?? current?.inputs;
    const activeOutputs = outputs ?? current?.outputs;
    return { aim, reactTo, inputs: activeInputs, outputs: activeOutputs };
  }
  static extractPayload(value) {
    if (!value || typeof value !== "object") {
      return value;
    }
    const hasBody = "body" in value;
    const extracted = hasBody ? value.body : value;
    return extracted;
  }
  id;
  target;
  _disposition;
  boundPatterns;
  eventListener;
  constructor(id) {
    this.id = id;
    this._disposition = this.constructor.disposition;
    this.boundPatterns = [];
    this.eventListener = (event) => this.handleEvent(event);
  }
  innervate(target, disposition = this.constructor.disposition) {
    this.disconnectReceptors();
    if (target) {
      this.target = target;
    }
    const incoming = disposition ?? this.constructor.disposition;
    this._disposition = _Capability.buildDisposition(this._disposition, incoming);
    this.connectReceptors();
    return this;
  }
  denervate() {
    this.disconnectReceptors();
    this.target = void 0;
  }
  get disposition() {
    return this._disposition;
  }
  set disposition(value) {
    this._disposition = value;
  }
  pulse(property, value) {
    const { target, id } = this;
    if (!target) {
      return void 0;
    }
    const signal = { source: id, property, value, timestamp: Date.now() };
    target.dispatchEvent(new CustomEvent(property, { detail: signal, bubbles: true }));
    if (property !== "*") {
      target.dispatchEvent(new CustomEvent("*", { detail: signal, bubbles: true }));
    }
    return signal;
  }
  extractPayload(value) {
    const payload = _Capability.extractPayload(value);
    return payload;
  }
  connectReceptors() {
    const { reactTo = [] } = this.disposition;
    this.boundPatterns = [...reactTo];
    for (const pattern of this.boundPatterns) {
      this.target?.addEventListener(pattern, this.eventListener);
    }
  }
  disconnectReceptors() {
    if (this.target) {
      for (const pattern of this.boundPatterns) {
        this.target.removeEventListener(pattern, this.eventListener);
      }
    }
    this.boundPatterns = [];
  }
  handleEvent(event) {
    const customEvent = event;
    const { detail: signal } = customEvent;
    if (signal) {
      void this.executeReaction(signal);
    }
  }
  async executeReaction(signal) {
    try {
      await this.react(signal);
    } catch (error) {
      this.pulse("error", error);
    }
  }
};

// src/collection/capabilities/local-storage/constants.ts
var __ID__ = "local-storage";
var AIM = "Persist, retrieve, remove, and synchronize string data using Web Storage API (localStorage)";
var DEFAULT_PREFIX = "";
var DEFAULT_SIGNALS = [
  "local-storage.set" /* SET */,
  "local-storage.get" /* GET */,
  "local-storage.remove" /* REMOVE */,
  "local-storage.clear" /* CLEAR */
];

// src/collection/capabilities/local-storage/index.ts
var LocalStorage = class _LocalStorage extends Capability {
  static AIM = AIM;
  static disposition = {
    aim: { description: _LocalStorage.AIM, body: {} },
    reactTo: [...DEFAULT_SIGNALS],
    inputs: [
      { signal: "local-storage.set" /* SET */, type: "ItemPayload" /* ITEM_PAYLOAD */, description: "Store a key-value string item in localStorage" },
      { signal: "local-storage.get" /* GET */, type: "KeyPayload" /* KEY_PAYLOAD */, description: "Retrieve a string item by key from localStorage" },
      { signal: "local-storage.remove" /* REMOVE */, type: "KeyPayload" /* KEY_PAYLOAD */, description: "Remove an item by key from localStorage" },
      { signal: "local-storage.clear" /* CLEAR */, type: "void" /* VOID */, description: "Clear all entries in localStorage" }
    ],
    outputs: [
      { signal: "local-storage.saved" /* SAVED */, type: "StoredItem" /* STORED_ITEM */, description: "Emits saved key and string value confirmation" },
      { signal: "local-storage.retrieved" /* RETRIEVED */, type: "StoredItem" /* STORED_ITEM */, description: "Emits retrieved key and string value or null" },
      { signal: "local-storage.removed" /* REMOVED */, type: "KeyPayload" /* KEY_PAYLOAD */, description: "Emits removed key confirmation" },
      { signal: "local-storage.cleared" /* CLEARED */, type: "void" /* VOID */, description: "Emits storage cleared confirmation" },
      { signal: "local-storage.error" /* ERROR */, type: "unknown" /* ERROR */, description: "Emits storage access or operation error" }
    ]
  };
  constructor(id = __ID__) {
    super(id);
  }
  react(signal) {
    const { property, value } = signal;
    switch (property) {
      case "local-storage.set" /* SET */:
        this.handleSet(value);
        break;
      case "local-storage.get" /* GET */:
        this.handleGet(value);
        break;
      case "local-storage.remove" /* REMOVE */:
        this.handleRemove(value);
        break;
      case "local-storage.clear" /* CLEAR */:
        this.handleClear();
        break;
    }
  }
  handleSet(value) {
    const payload = value ?? {};
    const { key, value: itemValue } = payload;
    const storage = this.resolveStorage();
    if (!storage || !key) {
      this.pulseError("set", "Storage not available or missing key", key);
      return;
    }
    const serialized = typeof itemValue === "object" && itemValue !== null ? JSON.stringify(itemValue) : String(itemValue);
    storage.setItem(this.resolveKey(key), serialized);
    this.pulse("local-storage.saved" /* SAVED */, { key, value: serialized });
  }
  handleGet(value) {
    const payload = typeof value === "string" ? { key: value } : value ?? {};
    const { key } = payload;
    const storage = this.resolveStorage();
    if (!storage || !key) {
      this.pulseError("get", "Storage not available or missing key", key);
      return;
    }
    const retrieved = storage.getItem(this.resolveKey(key));
    this.pulse("local-storage.retrieved" /* RETRIEVED */, { key, value: retrieved });
  }
  handleRemove(value) {
    const payload = typeof value === "string" ? { key: value } : value ?? {};
    const { key } = payload;
    const storage = this.resolveStorage();
    if (!storage || !key) {
      this.pulseError("remove", "Storage not available or missing key", key);
      return;
    }
    storage.removeItem(this.resolveKey(key));
    this.pulse("local-storage.removed" /* REMOVED */, { key });
  }
  handleClear() {
    const storage = this.resolveStorage();
    if (!storage) {
      this.pulseError("clear", "Storage not available");
      return;
    }
    storage.clear();
    this.pulse("local-storage.cleared" /* CLEARED */, void 0);
  }
  resolveStorage() {
    const { aim } = this.disposition;
    const { storage } = aim.body ?? {};
    if (storage) {
      return storage;
    }
    if (typeof globalThis !== "undefined" && globalThis.localStorage) {
      return globalThis.localStorage;
    }
    return typeof localStorage !== "undefined" ? localStorage : void 0;
  }
  resolveKey(key) {
    const { aim } = this.disposition;
    const { prefix = DEFAULT_PREFIX } = aim.body ?? {};
    return `${prefix}${key}`;
  }
  pulseError(operation, error, key) {
    const payload = { operation, error, ...key !== void 0 && { key } };
    this.pulse("local-storage.error" /* ERROR */, payload);
  }
};

// src/core/uca.ts
var Uca = class extends Capability {
  static purpose = "Universal Cognitive Agent";
  id;
  target;
  registry;
  constructor(id) {
    super(id);
    this.id = id;
    this.target = new EventTarget();
    this.registry = /* @__PURE__ */ new Map();
  }
  get purpose() {
    return this.constructor.purpose;
  }
  innervate(target, disposition) {
    const activeTarget = target || this.target || new EventTarget();
    const incoming = disposition ?? this.disposition;
    const { reactTo = [] } = incoming;
    const controlSignals = ["disposition.update" /* UPDATE */];
    const signals = [.../* @__PURE__ */ new Set([...reactTo, ...controlSignals])];
    super.innervate(activeTarget, { ...incoming, reactTo: signals });
    this.innervateCapabilities(activeTarget);
    return this;
  }
  denervate() {
    super.denervate();
    for (const capability of this.registry.values()) {
      capability.denervate();
    }
  }
  async executeReaction(signal) {
    const { property } = signal;
    if (property === "disposition.update" /* UPDATE */) {
      this.handleDispositionUpdate(signal);
      return;
    }
    await super.executeReaction(signal);
  }
  react(_signal) {
    return;
  }
  defaultCapabilities() {
    const defaults = [[LocalStorage, LocalStorage.disposition]];
    return defaults;
  }
  capabilities() {
    const declarations = [];
    return declarations;
  }
  buildAttributes(capabilityId) {
    const mapping = this.getAttributeMapping(capabilityId);
    const attributes = {};
    for (const [attributeName, rawValue] of Object.entries(mapping)) {
      if (rawValue !== void 0) {
        attributes[attributeName] = String(rawValue);
      }
    }
    return attributes;
  }
  getAttributeMapping(_capabilityId) {
    const mapping = {};
    return mapping;
  }
  capability(id) {
    const result = this.registry.get(id);
    return result;
  }
  hasCapability(id) {
    const exists = this.registry.has(id);
    return exists;
  }
  handleDispositionUpdate(signal) {
    const payload = signal.value;
    const { targetId, disposition } = payload ?? {};
    if (targetId !== this.id || !disposition) {
      return;
    }
    this.innervate(void 0, disposition);
    this.pulse("local-storage.set" /* SET */, { key: this.id, value: this.disposition });
    const updatedPayload = { id: this.id, disposition: this.disposition };
    this.pulse("disposition.updated" /* UPDATED */, updatedPayload);
  }
  createCapability(CapabilityClass, disposition) {
    const { aim } = disposition;
    const { id: bodyId } = aim.body ?? {};
    const Factory = CapabilityClass;
    const instance = bodyId !== void 0 ? new Factory(bodyId) : new Factory();
    this.registry.set(instance.id, instance);
    return instance;
  }
  getTargetId(CapabilityClass, disposition) {
    const { aim } = disposition;
    const { id: bodyId } = aim.body ?? {};
    const staticId = CapabilityClass.__ID__;
    return bodyId ?? staticId;
  }
  innervateCapabilities(activeTarget) {
    const declarations = [...this.defaultCapabilities(), ...this.capabilities()];
    for (const [CapabilityClass, capabilityDisposition] of declarations) {
      const targetId = this.getTargetId(CapabilityClass, capabilityDisposition);
      const capability = (targetId ? this.registry.get(targetId) : void 0) ?? this.createCapability(CapabilityClass, capabilityDisposition);
      capability.innervate(activeTarget, capabilityDisposition);
    }
  }
};

// node_modules/@typesafe-ai/sdk/dist/index.mjs
var requestIdFrom = (headers) => headers.get("x-typesafe-request-id") ?? void 0;
var APIPromise = class APIPromise2 extends Promise {
  #responsePromise;
  #parseResponse;
  #parsed;
  constructor(responsePromise, parseResponse) {
    super((resolve) => resolve(void 0));
    this.#responsePromise = responsePromise;
    this.#parseResponse = parseResponse;
  }
  /**
  * Resolves to the raw `Response` without parsing the body. SDK requests buffer the full
  * body under the request timeout before handoff; reading it afterwards is caller-owned.
  * The caller owns the body; don't also `await` the parsed result on the same promise.
  */
  asResponse() {
    return this.#responsePromise;
  }
  /** Return the parsed result, HTTP response, and request ID. */
  async withResponse() {
    const [data, response] = await Promise.all([this.#parse(), this.#responsePromise]);
    return {
      data,
      response,
      requestId: requestIdFrom(response.headers)
    };
  }
  /** Transform the parsed result, sharing the HTTP response and a single body parse. */
  map(fn) {
    return new APIPromise2(this.#responsePromise, () => this.#parse().then(fn));
  }
  #parse() {
    this.#parsed ??= this.#responsePromise.then(this.#parseResponse);
    return this.#parsed;
  }
  then(onfulfilled, onrejected) {
    return this.#parse().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.#parse().catch(onrejected);
  }
  finally(onfinally) {
    return this.#parse().finally(onfinally);
  }
};
var ENV = {
  /** Required API key; used when `apiKey` is omitted. */
  apiKey: "TYPESAFE_API_KEY",
  /** API root; defaults to `https://api.typesafe.ai`. */
  baseURL: "TYPESAFE_BASE_URL",
  /** Default model name; defaults to `jev-latest`. */
  defaultModel: "TYPESAFE_DEFAULT_MODEL",
  /** Log level; defaults to `warn`. */
  logLevel: "TYPESAFE_LOG_LEVEL"
};
var readEnv = (name) => {
  if (typeof process === "undefined" || !process.env) return void 0;
  return process.env[name]?.trim() || void 0;
};
var fromCodeOrEnv = (fromCode, envVar) => fromCode ?? readEnv(envVar);
var range = (from, to) => Array.from({ length: to - from }, (_, i) => from + i);
var DEFAULT_RETRY_POLICY = {
  maxRetries: 2,
  backoffInitialMs: 500,
  backoffMaxMs: 5e3,
  backoffJitter: 0.25,
  /** HTTP 408, 429, and 5xx responses. */
  httpStatuses: /* @__PURE__ */ new Set([
    408,
    429,
    ...range(500, 600)
  ]),
  respectRetryAfter: true,
  /** Maximum server retry delay before falling back to backoff. */
  maxRetryAfterMs: 6e4,
  apiConnectionError: true,
  apiTimeoutError: true
};
DEFAULT_RETRY_POLICY.maxRetries;
var isRetryableStatus = (status, policy = DEFAULT_RETRY_POLICY) => policy.httpStatuses.has(status);
var parseRetryAfter = (headers, now = Date.now()) => {
  const ms = Number(headers.get("retry-after-ms"));
  if (headers.has("retry-after-ms") && Number.isFinite(ms) && ms >= 0) return ms;
  const raw = headers.get("retry-after");
  if (raw === null) return void 0;
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return seconds >= 0 ? seconds * 1e3 : void 0;
  const date = Date.parse(raw);
  if (!Number.isNaN(date)) return Math.max(0, date - now);
};
var retryDelayMs = (attempt, headers, policy = DEFAULT_RETRY_POLICY, random = Math.random) => {
  if (policy.respectRetryAfter && headers !== void 0) {
    const retryAfter = parseRetryAfter(headers);
    if (retryAfter !== void 0 && retryAfter <= policy.maxRetryAfterMs) return retryAfter;
  }
  const exponential = Math.min(policy.backoffInitialMs * 2 ** attempt, policy.backoffMaxMs);
  return Math.round(exponential * (1 - random() * policy.backoffJitter));
};
var sleep = (ms, signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) return reject(signal.reason);
  const onAbort = () => {
    clearTimeout(timer);
    reject(signal?.reason);
  };
  const timer = setTimeout(() => {
    signal?.removeEventListener("abort", onAbort);
    resolve();
  }, ms);
  signal?.addEventListener("abort", onAbort, { once: true });
});
var TypeSafeError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = new.target.name;
  }
};
var isRecord = (value) => typeof value === "object" && value !== null;
var extractMessage = (body) => {
  if (typeof body === "string") return body || void 0;
  if (!isRecord(body)) return void 0;
  const { error, message, detail } = body;
  if (typeof error === "string") return error;
  if (isRecord(error) && typeof error.message === "string") return error.message;
  if (typeof message === "string") return message;
  if (typeof detail === "string") return detail;
  if (isRecord(detail) && typeof detail.message === "string") return detail.message;
  if (Array.isArray(detail)) return describeValidationErrors(detail);
};
var describeValidationErrors = (errors) => {
  const parts = errors.flatMap((e) => {
    if (!isRecord(e) || typeof e.msg !== "string") return [];
    const loc = Array.isArray(e.loc) ? e.loc.filter((x) => x !== "body").join(".") : "";
    return [loc ? `${loc}: ${e.msg}` : e.msg];
  });
  return parts.length > 0 ? parts.join("; ") : void 0;
};
var MAX_RAW_BODY_IN_MESSAGE = 200;
var APIError = class APIError2 extends TypeSafeError {
  /** HTTP response status code. */
  status;
  /** HTTP response headers. */
  headers;
  /** Parsed JSON, response text, or `undefined` for an empty body. */
  body;
  /** Request ID from `x-typesafe-request-id`, or `undefined` when absent. */
  requestId;
  constructor(status, body, headers, message) {
    super(message ?? APIError2.describe(status, body));
    this.status = status;
    this.body = body;
    this.headers = headers;
    this.requestId = requestIdFrom(headers);
  }
  static describe(status, body) {
    const detail = extractMessage(body);
    if (detail) return `${status} ${detail}`;
    if (body === void 0) return `${status} status code (no body)`;
    const raw = typeof body === "string" ? body : JSON.stringify(body);
    return `${status} ${raw.length > MAX_RAW_BODY_IN_MESSAGE ? `${raw.slice(0, MAX_RAW_BODY_IN_MESSAGE)}\u2026` : raw}`;
  }
  /** Create the error subclass for an HTTP status code. */
  static fromResponse(status, body, headers) {
    if (status === 400) return new BadRequestError(status, body, headers);
    if (status === 401) return new AuthenticationError(status, body, headers);
    if (status === 403) return new PermissionDeniedError(status, body, headers);
    if (status === 404) return new NotFoundError(status, body, headers);
    if (status === 422) return new UnprocessableEntityError(status, body, headers);
    if (status === 429) return new RateLimitError(status, body, headers);
    if (status >= 500) return new InternalServerError(status, body, headers);
    return new APIError2(status, body, headers);
  }
};
var BadRequestError = class extends APIError {
};
var AuthenticationError = class extends APIError {
};
var PermissionDeniedError = class extends APIError {
};
var NotFoundError = class extends APIError {
};
var UnprocessableEntityError = class extends APIError {
};
var RateLimitError = class extends APIError {
  /** Server retry delay in milliseconds, or `undefined` when absent or invalid. */
  retryAfterMs = parseRetryAfter(this.headers);
};
var InternalServerError = class extends APIError {
};
var APIConnectionError = class extends TypeSafeError {
  constructor(message = "Connection error.", options) {
    super(message, options);
  }
};
var APITimeoutError = class extends APIConnectionError {
  /** Configured timeout in milliseconds. */
  timeoutMs;
  constructor(timeoutMs, options) {
    super(`Request timed out after ${timeoutMs}ms.`, options);
    this.timeoutMs = timeoutMs;
  }
};
var APIUserAbortError = class extends TypeSafeError {
  constructor(message = "Request was aborted.", options) {
    super(message, options);
  }
};
var LOG_LEVELS = [
  "debug",
  "info",
  "warn",
  "error",
  "off"
];
var DEFAULT_LOG_LEVEL = "warn";
var isLogLevel = (value) => LOG_LEVELS.includes(value);
var parseLogLevel = (value, source) => {
  if (isLogLevel(value)) return value;
  throw new TypeSafeError(`Invalid log level "${value}" from ${source}. Expected one of: ${LOG_LEVELS.join(", ")}.`);
};
var PREFIX = "[typesafe-sdk]";
var consoleLogger = {
  debug: (message, ...args) => console.debug(`${PREFIX} ${message}`, ...args),
  info: (message, ...args) => console.info(`${PREFIX} ${message}`, ...args),
  warn: (message, ...args) => console.warn(`${PREFIX} ${message}`, ...args),
  error: (message, ...args) => console.error(`${PREFIX} ${message}`, ...args)
};
var RANK = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  off: 4
};
var drop = () => {
};
var withLevel = (sink, level) => {
  const enabled = (at) => RANK[at] >= RANK[level];
  return {
    debug: enabled("debug") ? (message, ...args) => sink.debug(message, ...args) : drop,
    info: enabled("info") ? (message, ...args) => sink.info(message, ...args) : drop,
    warn: enabled("warn") ? (message, ...args) => sink.warn(message, ...args) : drop,
    error: enabled("error") ? (message, ...args) => sink.error(message, ...args) : drop
  };
};
var KEY_HEADERS = /* @__PURE__ */ new Set([
  "authorization",
  "proxy-authorization",
  "x-api-key"
]);
var OPAQUE_HEADERS = /* @__PURE__ */ new Set(["cookie", "set-cookie"]);
var redactKey = (value) => {
  const [scheme, secret] = value.includes(" ") ? value.split(/\s+/, 2) : [void 0, value];
  const tail = secret && secret.length > 8 ? secret.slice(-4) : "";
  return `${scheme ? `${scheme} ` : ""}***${tail}`;
};
var redact = (name, value) => {
  const lower = name.toLowerCase();
  if (KEY_HEADERS.has(lower)) return redactKey(value);
  if (OPAQUE_HEADERS.has(lower)) return "***";
  return value;
};
var redactHeaders = (headers) => Object.fromEntries(Object.entries(headers).map(([name, value]) => [name, redact(name, value)]));
var noul = (instructions = null, criteria) => ({
  type: "noul",
  instructions,
  criteria
});
var validateQuestions = (questions) => {
  if (Object.keys(questions).length === 0) throw new TypeSafeError("At least one question is required.");
  for (const [name, question] of Object.entries(questions)) {
    if (question.type !== "score") continue;
    if (!Array.isArray(question.criteria)) throw new TypeSafeError(`Score question "${name}" has criteria that are not a list; score criteria must be a list of descriptions indexed by score from zero.`);
    if (question.criteria.length < 2) throw new TypeSafeError(`Score question "${name}" has ${question.criteria.length} criteria; at least two scores are required.`);
  }
};
var Models = class {
  #transport;
  constructor(transport) {
    this.#transport = transport;
  }
  /** List the models available to the account. */
  list(options = {}) {
    return this.#transport.request("GET", "/v1/models", options).map(unwrapModels);
  }
};
var unwrapModels = (wire) => {
  if (Array.isArray(wire?.models)) return wire.models;
  throw new TypeSafeError("Unexpected response shape from GET /v1/models; expected { models: [...] }.");
};
var g = globalThis;
var isBrowser = () => typeof g.window !== "undefined" && typeof g.window.document !== "undefined" && typeof g.navigator !== "undefined";
var describeRuntime = () => {
  const platform = g.process?.platform && g.process?.arch ? ` (${g.process.platform}; ${g.process.arch})` : "";
  if (g.Bun?.version) return `bun/${g.Bun.version}${platform}`;
  if (g.Deno?.version?.deno) return `deno/${g.Deno.version.deno}${platform}`;
  if (g.EdgeRuntime !== void 0) return "vercel-edge";
  if (g.navigator?.userAgent === "Cloudflare-Workers") return "cloudflare-workers";
  if (g.process?.versions?.node) return `node/${g.process.versions.node}${platform}`;
  if (isBrowser()) return "browser";
  return "unknown";
};
var VERSION = "0.6.0";
var missingApiKey = () => {
  throw new TypeSafeError(`No API key was provided. Pass \`apiKey\` to the TypeSafeClient constructor or set the ${ENV.apiKey} environment variable.`);
};
var missingFetch = () => {
  throw new TypeSafeError("No global `fetch` is available in this runtime. Pass a `fetch` implementation to the TypeSafeClient constructor.");
};
var refuseBrowser = () => {
  throw new TypeSafeError("TypeSafeClient is running in a browser, which would expose your API key to anyone using the page. Call the API from a server instead, or pass `dangerouslyAllowBrowser: true` if you understand the risk.");
};
var defaultFetch = (input, init) => globalThis.fetch(input, init);
var assertNonNegativeInteger = (name, value) => {
  if (!Number.isInteger(value) || value < 0) throw new TypeSafeError(`\`${name}\` must be a non-negative integer, got ${String(value)}.`);
  return value;
};
var assertPositiveMs = (name, value) => {
  if (!Number.isFinite(value) || value <= 0) throw new TypeSafeError(`\`${name}\` must be a positive number of milliseconds, got ${String(value)}.`);
  return value;
};
var assertNonNegativeMs = (name, value) => {
  if (!Number.isFinite(value) || value < 0) throw new TypeSafeError(`\`${name}\` must be a non-negative number of milliseconds, got ${String(value)}.`);
  return value;
};
var assertFraction = (name, value) => {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new TypeSafeError(`\`${name}\` must be between 0 and 1, got ${String(value)}.`);
  return value;
};
var assertStatusSet = (name, statuses) => {
  for (const status of statuses) if (!Number.isInteger(status) || status < 100 || status > 999) throw new TypeSafeError(`\`${name}\` must contain HTTP status codes, got ${String(status)}.`);
  return statuses;
};
var resolveRetryPolicy = (base, overrides) => {
  const o = overrides ?? {};
  return {
    maxRetries: o.maxRetries === void 0 ? base.maxRetries : assertNonNegativeInteger("retry.maxRetries", o.maxRetries),
    backoffInitialMs: o.backoffInitialMs === void 0 ? base.backoffInitialMs : assertNonNegativeMs("retry.backoffInitialMs", o.backoffInitialMs),
    backoffMaxMs: o.backoffMaxMs === void 0 ? base.backoffMaxMs : assertNonNegativeMs("retry.backoffMaxMs", o.backoffMaxMs),
    backoffJitter: o.backoffJitter === void 0 ? base.backoffJitter : assertFraction("retry.backoffJitter", o.backoffJitter),
    httpStatuses: new Set(o.httpStatuses === void 0 ? base.httpStatuses : assertStatusSet("retry.httpStatuses", o.httpStatuses)),
    respectRetryAfter: o.respectRetryAfter ?? base.respectRetryAfter,
    maxRetryAfterMs: o.maxRetryAfterMs === void 0 ? base.maxRetryAfterMs : assertNonNegativeMs("retry.maxRetryAfterMs", o.maxRetryAfterMs),
    apiConnectionError: o.apiConnectionError ?? base.apiConnectionError,
    apiTimeoutError: o.apiTimeoutError ?? base.apiTimeoutError
  };
};
var isRetryableError = (err, policy) => {
  if (err instanceof APITimeoutError) return policy.apiTimeoutError;
  if (err instanceof APIConnectionError) return policy.apiConnectionError;
  return false;
};
var resolveLogLevel = (fromCode) => {
  if (fromCode !== void 0) return parseLogLevel(fromCode, "the `logLevel` option");
  const fromEnv = readEnv(ENV.logLevel);
  if (fromEnv !== void 0) return parseLogLevel(fromEnv, ENV.logLevel);
  return DEFAULT_LOG_LEVEL;
};
var stripTrailingSlashes = (url) => url.replace(/\/+$/, "");
var mergeHeaders = (...sources) => {
  const entries = /* @__PURE__ */ new Map();
  for (const source of sources) for (const [name, value] of Object.entries(source)) if (value === void 0) entries.delete(name.toLowerCase());
  else entries.set(name.toLowerCase(), [name, value]);
  return Object.fromEntries(entries.values());
};
var bufferResponse = async (response, signal) => {
  const reader = response.clone().body?.getReader();
  if (!reader) return;
  const cancel = () => {
    reader.cancel(signal.reason).catch(() => {
    });
    response.body?.cancel(signal.reason).catch(() => {
    });
  };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    if (signal.aborted) cancel();
    signal.throwIfAborted();
    while (!(await reader.read()).done) signal.throwIfAborted();
    signal.throwIfAborted();
  } finally {
    signal.removeEventListener("abort", cancel);
    reader.releaseLock();
  }
};
var RUNTIME = describeRuntime();
var TypeSafeClient = class {
  /** API key excluded from serialization and public properties. */
  #apiKey;
  /** API root with trailing slashes removed. */
  baseURL;
  /** Model used when a request omits `model`. */
  defaultModel;
  /** Configured log verbosity. */
  logLevel;
  /** The configured logger, filtered to `logLevel`. */
  logger;
  /** Retry settings with constructor overrides applied. */
  retry;
  /** Timeout per attempt in milliseconds. */
  timeout;
  /** Additional headers sent with each request. */
  defaultHeaders;
  /** HTTP fetch implementation. */
  fetch;
  /** The models available to the account. */
  models;
  #requestCount = 0;
  /**
  * Create a client for the TypeSafe AI API.
  *
  * Explicit options take precedence over environment variables, then SDK defaults.
  * Empty or whitespace-only environment values are ignored.
  *
  * @throws {TypeSafeError} The API key is missing, configuration is invalid, or the runtime is unsupported.
  */
  constructor(config = {}) {
    if (isBrowser() && !config.dangerouslyAllowBrowser) refuseBrowser();
    this.#apiKey = fromCodeOrEnv(config.apiKey, ENV.apiKey) ?? missingApiKey();
    this.baseURL = stripTrailingSlashes(fromCodeOrEnv(config.baseURL, ENV.baseURL) ?? "https://api.typesafe.ai");
    this.defaultModel = fromCodeOrEnv(config.defaultModel, ENV.defaultModel) ?? "jev-latest";
    this.logLevel = resolveLogLevel(config.logLevel);
    this.logger = withLevel(config.logger ?? consoleLogger, this.logLevel);
    this.retry = resolveRetryPolicy(DEFAULT_RETRY_POLICY, config.retry);
    this.timeout = assertPositiveMs("timeout", config.timeout ?? 1e4);
    this.defaultHeaders = { ...config.defaultHeaders };
    if (config.fetch === void 0 && typeof globalThis.fetch !== "function") missingFetch();
    this.fetch = config.fetch ?? defaultFetch;
    const transport = {
      request: (method, path, options) => this.#request(method, path, options),
      defaultModel: this.defaultModel
    };
    this.models = new Models(transport);
  }
  /**
  * Answer named questions about text or structured state.
  *
  * @param request - State, questions, and an optional model override.
  * @param options - Per-call timeout, retry, headers, and cancellation settings.
  * @returns Answers typed by question name and criteria, with model and token usage.
  * @throws {TypeSafeError} Questions are empty, or score criteria are not a list of at least two entries.
  * @throws {APIError} The server returns a non-2xx response after retries.
  * @throws {APIConnectionError} The request cannot connect or times out after retries.
  * @throws {APIUserAbortError} The caller aborts the request.
  *
  * @example
  * ```ts
  * const { answers } = await client.systemOne({
  *   state: "I was charged twice. Please help.",
  *   questions: { billing: noul("Is this about billing?") },
  * });
  * console.log(answers.billing.noul);
  * ```
  */
  systemOne(request, options = {}) {
    validateQuestions(request.questions);
    const body = {
      ...request,
      model: request.model ?? this.defaultModel
    };
    return this.#request("POST", "/v1/systemone", {
      ...options,
      body
    });
  }
  /** Send a request and parse its response body. */
  #request(method, path, options = {}) {
    const resolved = {
      method,
      path,
      body: options.body,
      headers: mergeHeaders(this.defaultHeaders, options.headers ?? {}),
      signal: options.signal,
      timeout: options.timeout === void 0 ? this.timeout : assertPositiveMs("timeout", options.timeout),
      retry: resolveRetryPolicy(this.retry, options.retry)
    };
    const tag = `#${++this.#requestCount} ${method} ${path}`;
    return new APIPromise(this.fetchWithRetries(tag, resolved), async (res) => {
      const parsed = await parseBody(res);
      this.logger.debug(`${tag} <- body`, parsed);
      return parsed;
    });
  }
  /** Retry eligible failures, logging attempt summaries at `info` and headers and bodies at `debug`. */
  async fetchWithRetries(tag, req) {
    const url = `${this.baseURL}${req.path}`;
    const headers = mergeHeaders(req.headers, {
      Authorization: `Bearer ${this.#apiKey}`,
      Accept: "application/json",
      "User-Agent": `typesafe-sdk/${VERSION}`,
      "X-TypeSafe-SDK": `typesafe-sdk/${VERSION}`,
      "X-TypeSafe-Runtime": RUNTIME,
      "Content-Type": req.body === void 0 ? void 0 : "application/json",
      "X-TypeSafe-Retry-Count": void 0
    });
    const body = req.body === void 0 ? void 0 : JSON.stringify(req.body);
    for (let attempt = 0; ; attempt++) {
      const retriesLeft = req.retry.maxRetries - attempt;
      const attemptHeaders = attempt === 0 ? headers : {
        ...headers,
        "X-TypeSafe-Retry-Count": String(attempt)
      };
      this.logger.debug(`${tag} -> ${url}`, {
        headers: redactHeaders(attemptHeaders),
        body: req.body
      });
      const started = Date.now();
      let res;
      try {
        res = await this.attempt(tag, url, {
          method: req.method,
          headers: attemptHeaders,
          body
        }, req);
      } catch (err) {
        if (err instanceof APIUserAbortError || retriesLeft <= 0) throw err;
        if (!isRetryableError(err, req.retry)) throw err;
        await this.backOff(tag, attempt, retriesLeft, err.message, void 0, req);
        continue;
      }
      const requestId = requestIdFrom(res.headers);
      this.logger.info(`${tag} <- ${res.status} in ${Date.now() - started}ms${requestId ? ` (request ${requestId})` : ""}`);
      if (res.ok) return res;
      const errorBody = await parseBody(res);
      this.logger.debug(`${tag} <- error body`, errorBody);
      const error = APIError.fromResponse(res.status, errorBody, res.headers);
      if (retriesLeft <= 0 || !isRetryableStatus(res.status, req.retry)) throw error;
      await this.backOff(tag, attempt, retriesLeft, `${res.status}`, res.headers, req);
    }
  }
  /**
  * One HTTP round trip, including body delivery, with a timeout. The caller's signal and our
  * timer both abort the same controller; we check which fired to choose the error class.
  */
  async attempt(tag, url, init, { signal, timeout }) {
    const controller = new AbortController();
    const abortFromCaller = () => controller.abort(signal?.reason);
    if (signal?.aborted) abortFromCaller();
    signal?.addEventListener("abort", abortFromCaller, { once: true });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);
    const started = Date.now();
    const elapsed = () => `${Date.now() - started}ms`;
    try {
      const response = await this.fetch(url, {
        ...init,
        signal: controller.signal
      });
      await bufferResponse(response, controller.signal);
      return response;
    } catch (err) {
      if (signal?.aborted) {
        this.logger.info(`${tag} aborted by caller after ${elapsed()}`);
        throw new APIUserAbortError(void 0, { cause: err });
      }
      if (timedOut) {
        this.logger.info(`${tag} timed out after ${elapsed()}`);
        throw new APITimeoutError(timeout, { cause: err });
      }
      this.logger.info(`${tag} connection error after ${elapsed()}`, err);
      throw new APIConnectionError(err instanceof Error ? `Connection error: ${err.message}` : void 0, { cause: err });
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abortFromCaller);
    }
  }
  /** Wait before retrying; caller cancellation throws `APIUserAbortError`. */
  async backOff(tag, attempt, retriesLeft, reason, headers, { retry, signal }) {
    const delay = retryDelayMs(attempt, headers, retry);
    const nth = attempt + 1;
    const total = attempt + retriesLeft;
    this.logger.info(`${tag} retrying in ${delay}ms (retry ${nth}/${total}) after ${reason}`);
    try {
      await sleep(delay, signal);
    } catch (err) {
      this.logger.info(`${tag} aborted by caller while waiting to retry`);
      throw new APIUserAbortError(void 0, { cause: err });
    }
  }
};
var parseBody = async (res) => {
  const text = await res.text();
  if (text.length === 0) return void 0;
  if ((res.headers.get("content-type") ?? "").includes("application/json")) try {
    return JSON.parse(text);
  } catch {
    return text;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// src/collection/capabilities/jev/constants.ts
var __ID__2 = "jev";
var __DEFAULT_SIGNALS__ = [
  "jev.connect",
  "jev.infer"
];

// src/collection/capabilities/jev/index.ts
var Jev = class _Jev extends Capability {
  static AIM = "Perform system-one probabilistic reasoning and state evaluation using Jev SDK";
  static disposition = {
    aim: { description: _Jev.AIM, body: {} },
    reactTo: [...__DEFAULT_SIGNALS__],
    inputs: [
      { signal: "jev.connect" /* CONNECT */, type: "ConnectionConfig" /* CONNECTION_CONFIG */, description: "Configure Jev engine parameters" },
      { signal: "jev.infer" /* INFER */, type: "InferPayload" /* INFER_PAYLOAD */, description: "Run system-one inference over state and questions" }
    ],
    outputs: [
      { signal: "jev.connected" /* CONNECTED */, type: "ConnectionStatus" /* CONNECTION_STATUS */, description: "Jev engine connection confirmed" },
      { signal: "jev.inferred" /* INFERRED */, type: "InferResult" /* INFER_RESULT */, description: "Inference results and answers" },
      { signal: "jev.error" /* ERROR */, type: "unknown" /* UNKNOWN */, description: "Error notification" }
    ]
  };
  constructor(id = __ID__2) {
    super(id);
  }
  async react(signal) {
    const { property, value } = signal;
    switch (property) {
      case "jev.connect" /* CONNECT */:
        this.handleConnect(value);
        break;
      case "jev.infer" /* INFER */:
        await this.handleInfer(value);
        break;
      default:
        break;
    }
  }
  handleConnect(value) {
    const payload = this.extractPayload(value);
    const { aim } = this.disposition;
    const current = aim.body ?? {};
    const connection = payload ?? current.connection;
    this.disposition = { ...this.disposition, aim: { ...aim, body: { ...current, connection } } };
    this.pulse("jev.connected" /* CONNECTED */, { status: "ready", connection });
  }
  async handleInfer(value) {
    const payload = this.extractPayload(value);
    if (!payload) {
      return;
    }
    try {
      const client = this.resolveClient();
      const result = await this.executeInference(client, payload);
      this.pulse("jev.inferred" /* INFERRED */, result);
    } catch (error) {
      this.pulse("jev.error" /* ERROR */, error);
    }
  }
  async executeInference(client, payload) {
    const { state, questions, model, limit, maxTokens } = payload;
    const { aim } = this.disposition;
    const bodyLimit = aim.body?.limit ?? aim.body?.maxTokens;
    const effectiveLimit = limit ?? maxTokens ?? bodyLimit;
    const options = effectiveLimit !== void 0 ? { limit: effectiveLimit, max_tokens: effectiveLimit } : {};
    const formattedQuestions = this.formatQuestions(questions ?? {});
    const response = await client.systemOne({ state, questions: formattedQuestions, model, ...options });
    const answers = response;
    return { state, answers, model };
  }
  formatQuestions(questions) {
    const result = {};
    for (const [key, value] of Object.entries(questions)) {
      const isNoul = typeof value === "object" && value !== null && "type" in value && value.type === "noul";
      result[key] = isNoul ? value : noul(typeof value === "string" ? value : key);
    }
    return Object.keys(result).length ? result : { answer: noul("Procesar consulta") };
  }
  resolveClient() {
    const { aim } = this.disposition;
    const { client, connection } = aim.body ?? {};
    if (client) {
      return client;
    }
    return this.createClient(connection);
  }
  createClient(config) {
    const { apiKey, baseURL } = config ?? {};
    const envKey = typeof process !== "undefined" ? process.env?.JEV_API_KEY ?? process.env?.TYPESAFE_API_KEY : void 0;
    const resolvedApiKey = apiKey ?? envKey;
    return new TypeSafeClient({ apiKey: resolvedApiKey, baseURL, dangerouslyAllowBrowser: true });
  }
};

// src/collection/ucas/llm/constants.ts
var __ID__3 = "llm";
var DEFAULT_SIGNALS2 = [
  "llm.infer",
  "llm.connect",
  "jev.connected",
  "jev.inferred",
  "jev.error"
];

// src/collection/ucas/llm/index.ts
var Llm = class _Llm extends Uca {
  static purpose = "Orchestrate cognitive reasoning and language model inferences over system state";
  static disposition = {
    aim: { description: _Llm.purpose, body: {} },
    reactTo: [...DEFAULT_SIGNALS2],
    inputs: [
      { signal: "llm.infer" /* INFER */, type: "InferPayload" /* INFER_PAYLOAD */, description: "Request reasoning inference or text generation" },
      { signal: "llm.connect" /* CONNECT */, type: "ConnectionConfig" /* CONNECTION_CONFIG */, description: "Connect AI provider" }
    ],
    outputs: [
      { signal: "llm.inferred" /* INFERRED */, type: "InferResult" /* INFER_RESULT */, description: "Emits structured inference answers and results" },
      { signal: "llm.connected" /* CONNECTED */, type: "string" /* STRING */, description: "Emits confirmation of AI provider connection" },
      { signal: "llm.error" /* ERROR */, type: "unknown" /* UNKNOWN */, description: "Emits cognitive inference or provider error" }
    ]
  };
  constructor(id = __ID__3) {
    super(id);
  }
  react(signal) {
    const { property, value } = signal;
    switch (property) {
      case "llm.infer" /* INFER */:
        this.handleInfer(value);
        break;
      case "llm.connect" /* CONNECT */:
        this.handleConnect(value);
        break;
      default:
        this.handleCapabilitySignal(property, value);
        break;
    }
  }
  capabilities() {
    const { aim } = this.disposition;
    const { connection } = aim.body ?? {};
    const disposition = {
      aim: { description: Jev.AIM, body: { connection } },
      reactTo: ["jev.connect" /* CONNECT */, "jev.infer" /* INFER */]
    };
    const cooky = [[Jev, disposition]];
    return cooky;
  }
  handleInfer(value) {
    const { aim } = this.disposition;
    const { model: fallbackModel, limit: fallbackLimit } = aim.body ?? {};
    const payload = value ?? {};
    const { request, model, limit, context, expectations, format = "string" } = payload;
    const targetModel = model ?? fallbackModel;
    const effectiveLimit = limit ?? fallbackLimit;
    const state = { request, ...context ? { context } : {}, ...this.extractMeta(payload) };
    const questions = expectations ?? { response: { type: format } };
    this.pulse("jev.infer" /* INFER */, { state, questions, model: targetModel, limit: effectiveLimit });
  }
  extractMeta(payload) {
    const { role, imagination, depth } = payload;
    return { ...role && { role }, ...imagination !== void 0 && { imagination }, ...depth !== void 0 && { depth } };
  }
  handleConnect(value) {
    this.pulse("jev.connect" /* CONNECT */, value);
  }
  handleCapabilitySignal(property, value) {
    switch (property) {
      case "jev.inferred" /* INFERRED */:
        this.handleInferred(value);
        break;
      case "jev.connected" /* CONNECTED */:
        this.pulse("llm.connected" /* CONNECTED */, "connected");
        break;
      case "jev.error" /* ERROR */:
        this.pulse("llm.error" /* ERROR */, value);
        break;
      default:
        break;
    }
  }
  handleInferred(value) {
    const { answers = {}, state, model } = value ?? {};
    const { response } = answers;
    const result = { response, data: answers, context: state, model };
    this.pulse("llm.inferred" /* INFERRED */, result);
  }
};

// src/collection/ucas/view-composer/constants.ts
var __ID__4 = "view-composer";
var PURPOSE = "Compose cognitive view graphs and propagate reactive dispositions via LLM";
var DEFAULT_SIGNALS3 = ["view-composer.compose" /* COMPOSE */];
var DEFAULT_VIEW_SCHEMA = {
  type: "object",
  properties: {
    ucas: {
      type: "object",
      description: "Map of UCA IDs to their respective dispositions",
      additionalProperties: {
        type: "object",
        properties: {
          aim: { type: "object", properties: { description: { type: "string" }, body: { type: "object" } } },
          reactTo: { type: "array", items: { type: "string" } }
        }
      }
    }
  },
  required: ["ucas"]
};

// src/collection/ucas/view-composer/index.ts
var ViewComposer = class _ViewComposer extends Uca {
  static purpose = PURPOSE;
  static disposition = {
    aim: { description: _ViewComposer.purpose, body: { schema: { ...DEFAULT_VIEW_SCHEMA } } },
    reactTo: [...DEFAULT_SIGNALS3],
    inputs: [
      { signal: "view-composer.compose" /* COMPOSE */, type: "ComposePayload" /* COMPOSE_PAYLOAD */, description: "Request cognitive view graph composition" }
    ],
    outputs: [
      { signal: "view-composer.composed" /* COMPOSED */, type: "ComposedResult" /* COMPOSED_RESULT */, description: "Emits composed view graph and dispositions" },
      { signal: "view-composer.error" /* ERROR */, type: "unknown" /* UNKNOWN */, description: "Emits cognitive composition error" }
    ]
  };
  constructor(id = __ID__4) {
    super(id);
  }
  innervate(target, disposition) {
    const base = disposition ?? _ViewComposer.disposition;
    const { reactTo = [] } = base;
    const internalSignals = ["llm.inferred" /* INFERRED */, "llm.error" /* ERROR */];
    const signals = [.../* @__PURE__ */ new Set([...reactTo, ...internalSignals])];
    return super.innervate(target, { ...base, reactTo: signals });
  }
  capabilities() {
    const { aim } = this.disposition;
    const { model, connection } = aim.body ?? {};
    const disposition = {
      aim: { description: Llm.purpose, body: { model, connection } },
      reactTo: ["llm.infer" /* INFER */, "llm.connect" /* CONNECT */]
    };
    const cooky = [[Llm, disposition]];
    return cooky;
  }
  react(signal) {
    const { property, value } = signal;
    switch (property) {
      case "view-composer.compose" /* COMPOSE */:
        this.handleCompose(value);
        break;
      case "llm.inferred" /* INFERRED */:
        this.handleLlmInferred(value);
        break;
      case "llm.error" /* ERROR */:
        this.pulse("view-composer.error" /* ERROR */, value);
        break;
    }
  }
  handleCompose(value) {
    const payload = value ?? {};
    const { ucas, request, context, model, schema: payloadSchema } = payload;
    if (ucas) {
      this.applyComposedUcas(ucas);
      return;
    }
    if (!request) {
      return;
    }
    const { aim } = this.disposition;
    const { schema: fallbackSchema } = aim.body ?? {};
    const expectations = payloadSchema ?? fallbackSchema ?? DEFAULT_VIEW_SCHEMA;
    this.pulse("llm.infer" /* INFER */, { request, context, model, expectations });
  }
  handleLlmInferred(value) {
    const result = value ?? {};
    const { data, response } = result;
    const rawPayload = data ?? response ?? {};
    const ucas = rawPayload.ucas ?? rawPayload;
    this.applyComposedUcas(ucas);
  }
  applyComposedUcas(ucas) {
    this.propagateDispositions(ucas);
    const graph = this.buildGraph(ucas);
    const composed = { ucas, graph };
    this.pulse("view-composer.composed" /* COMPOSED */, composed);
  }
  propagateDispositions(ucas) {
    for (const [ucaId, disposition] of Object.entries(ucas)) {
      const updatePayload = { targetId: ucaId, disposition };
      this.pulse("disposition.update" /* UPDATE */, updatePayload);
    }
  }
  buildGraph(ucas) {
    const nodes = this.buildNodes(ucas);
    const edges = this.buildEdges(ucas);
    return { nodes, edges };
  }
  buildNodes(ucas) {
    return Object.entries(ucas).map(([id, disposition]) => {
      const { aim, inputs = [], outputs = [] } = disposition;
      const { description = "" } = aim ?? {};
      return { id, aimDescription: description, inputsCount: inputs.length, outputsCount: outputs.length };
    });
  }
  buildEdges(ucas) {
    const edges = [];
    for (const [consumerId, consumerDisp] of Object.entries(ucas)) {
      const { reactTo = [] } = consumerDisp;
      this.matchEdgesForConsumer(consumerId, reactTo, ucas, edges);
    }
    return edges;
  }
  matchEdgesForConsumer(toNode, reactTo, ucas, edges) {
    for (const [producerId, producerDisp] of Object.entries(ucas)) {
      const { outputs = [] } = producerDisp;
      for (const output of outputs) {
        if (reactTo.includes(output.signal) && producerId !== toNode) {
          edges.push({ fromNode: producerId, toNode, signal: output.signal, type: output.type });
        }
      }
    }
  }
};

// src/collection/ucas/app/constants.ts
var __ID__5 = "app";
var DEFAULT_SIGNALS4 = [
  "app.init",
  "app.start",
  "app.stop"
];
var INITIAL_VIEW_NEED = "Crear una vista con un \xFAnico input y un bot\xF3n centrados en el medio de la p\xE1gina y que ponga en placeholder: que quieres conocer de la Uca";
var VIEW_DISPOSITION_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "ViewDisposition",
  type: "object",
  properties: {
    ucas: {
      type: "object",
      description: "Map of UCA IDs to their respective dispositions",
      additionalProperties: {
        type: "object",
        properties: {
          aim: {
            type: "object",
            properties: {
              description: { type: "string" },
              body: { type: "object" }
            },
            required: ["description"]
          },
          reactTo: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["aim"]
      }
    }
  },
  required: ["ucas"]
};
var INITIAL_VIEW_DISPOSITION = {
  "center-container": {
    aim: {
      description: "Container layout centered in the middle of the page",
      body: { className: "center-layout", role: "main" }
    },
    reactTo: ["box.create", "box.update", "box.remove"]
  },
  "query-input": {
    aim: {
      description: "Inquiry input for UCA exploration",
      body: { placeholder: "que quieres conocer de la Uca", value: "" }
    },
    reactTo: ["input.create", "input.update", "input.change"]
  },
  "query-button": {
    aim: {
      description: "Button action to submit the query",
      body: { label: "Consultar", role: "button" }
    },
    reactTo: ["action.create", "action.update", "action.trigger"]
  }
};

// src/collection/ucas/app/types.ts
var SignalType5 = /* @__PURE__ */ ((SignalType11) => {
  SignalType11["INIT"] = "app.init";
  SignalType11["START"] = "app.start";
  SignalType11["STOP"] = "app.stop";
  SignalType11["READY"] = "app.ready";
  SignalType11["STARTED"] = "app.started";
  SignalType11["STOPPED"] = "app.stopped";
  SignalType11["ERROR"] = "app.error";
  SignalType11["VIEW_COMPOSED"] = "app.view.composed";
  return SignalType11;
})(SignalType5 || {});

// src/collection/ucas/app/index.ts
var App = class _App extends Uca {
  static purpose = "Coordinate application lifecycle and scaffolding orchestration";
  static VIEW_SCHEMA = VIEW_DISPOSITION_SCHEMA;
  static INITIAL_VIEW = INITIAL_VIEW_DISPOSITION;
  static INITIAL_NEED = INITIAL_VIEW_NEED;
  static disposition = {
    aim: { description: _App.purpose, body: { initialView: INITIAL_VIEW_DISPOSITION } },
    reactTo: [...DEFAULT_SIGNALS4],
    inputs: [
      { signal: "app.init" /* INIT */, type: "void" /* VOID */, description: "Initialize application scaffolding" },
      { signal: "app.start" /* START */, type: "void" /* VOID */, description: "Start application execution" },
      { signal: "app.stop" /* STOP */, type: "void" /* VOID */, description: "Stop application execution" }
    ],
    outputs: [
      { signal: "app.ready" /* READY */, type: "string" /* STRING */, description: "Application initialized and ready" },
      { signal: "app.started" /* STARTED */, type: "boolean" /* BOOLEAN */, description: "Application started" },
      { signal: "app.stopped" /* STOPPED */, type: "boolean" /* BOOLEAN */, description: "Application stopped" },
      { signal: "app.view.composed" /* VIEW_COMPOSED */, type: "ComposedResult" /* COMPOSED_RESULT */, description: "View graph composed" },
      { signal: "app.error" /* ERROR */, type: "string" /* STRING */, description: "Application error occurred" }
    ]
  };
  constructor(id = __ID__5) {
    super(id);
  }
  innervate(target, disposition) {
    const base = disposition ?? _App.disposition;
    const { reactTo = [] } = base;
    const internalSignals = ["view-composer.composed" /* COMPOSED */];
    const signals = [.../* @__PURE__ */ new Set([...reactTo, ...internalSignals])];
    return super.innervate(target, { ...base, reactTo: signals });
  }
  capabilities() {
    const disposition = {
      aim: { description: ViewComposer.purpose, body: { schema: VIEW_DISPOSITION_SCHEMA } },
      reactTo: [...ViewComposer.disposition.reactTo ?? []]
    };
    const cooky = [[ViewComposer, disposition]];
    return cooky;
  }
  react(signal) {
    const { property, value } = signal;
    switch (property) {
      case "app.init" /* INIT */:
        this.handleInit(value);
        break;
      case "app.start" /* START */:
        this.handleStart();
        break;
      case "app.stop" /* STOP */:
        this.handleStop();
        break;
      case "view-composer.composed" /* COMPOSED */:
        this.pulse("app.view.composed" /* VIEW_COMPOSED */, value);
        break;
    }
  }
  createInitialView() {
    const { aim } = this.disposition;
    const { initialView } = aim.body ?? {};
    return initialView ?? INITIAL_VIEW_DISPOSITION;
  }
  handleInit(value) {
    const payload = value ?? {};
    const { title = "ready", request, initialView } = payload;
    const viewNeed = request ?? INITIAL_VIEW_NEED;
    const ucas = initialView ?? this.createInitialView();
    const viewPayload = { request: viewNeed, schema: VIEW_DISPOSITION_SCHEMA, ucas };
    this.pulse("view-composer.compose" /* COMPOSE */, viewPayload);
    this.pulse("app.ready" /* READY */, title);
  }
  handleStart() {
    this.pulse("app.started" /* STARTED */, true);
  }
  handleStop() {
    this.pulse("app.stopped" /* STOPPED */, false);
  }
};

// src/collection/capabilities/web-component/constants.ts
var __ID__6 = "web-component";
var __DEFAULT_OBSERVED_ATTRIBUTES__ = [
  "class",
  "style",
  "hidden",
  "title",
  "tag",
  "data-role",
  "data-status",
  "data-observed"
];
var __DEFAULT_TAG__ = "ext-component";
var __DEFAULT_DOM_EVENTS__ = [
  "click",
  "input",
  "change"
];

// src/collection/capabilities/web-component/helpers.ts
function setupElementSlot(element) {
  if (!element.shadowRoot) {
    const shadowRoot = element.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    slot.addEventListener("slotchange", () => {
      const detail = { content: element.textContent ?? "" };
      element.dispatchEvent(new CustomEvent("lifecycle.contentChanged" /* CONTENT_CHANGED */, { detail, bubbles: false }));
    });
    shadowRoot.appendChild(slot);
  }
}
function notifyAttributeChange(element, name, oldValue, newValue) {
  const detail = { name, oldValue, newValue };
  element.dispatchEvent(new CustomEvent("lifecycle.attributeChanged" /* ATTRIBUTE_CHANGED */, { detail, bubbles: false }));
  if (name === "tag" && oldValue && newValue) {
    const tagDetail = { oldTag: oldValue, newTag: newValue };
    element.dispatchEvent(new CustomEvent("lifecycle.tagChanged" /* TAG_CHANGED */, { detail: tagDetail, bubbles: false }));
  }
}
function createReactiveElementClass(observedAttributes) {
  return class extends HTMLElement {
    static get observedAttributes() {
      return [...observedAttributes];
    }
    connectedCallback() {
      setupElementSlot(this);
      this.dispatchEvent(new CustomEvent("lifecycle.connected" /* CONNECTED */, { bubbles: false }));
    }
    disconnectedCallback() {
      this.dispatchEvent(new CustomEvent("lifecycle.disconnected" /* DISCONNECTED */, { bubbles: false }));
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        notifyAttributeChange(this, name, oldValue, newValue);
      }
    }
  };
}
function synchronizeElementAttributes(element, attributes) {
  if (attributes) {
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
  }
}
function synchronizeElementText(element, text) {
  const { textContent } = element;
  if (text !== void 0 && textContent !== text) {
    element.textContent = text;
  }
}
function mountElementToContainer(element, container) {
  if (container && !container.contains(element)) {
    container.appendChild(element);
  }
}

// src/collection/capabilities/web-component/index.ts
var WebComponent = class _WebComponent extends Capability {
  static AIM = "Manage Web Component";
  static disposition = {
    aim: { description: _WebComponent.AIM, body: {} },
    reactTo: [
      "element.rendered" /* RENDERED */,
      "element.updated" /* UPDATED */,
      "element.removed" /* REMOVED */
    ],
    inputs: [
      { signal: "element.rendered" /* RENDERED */, type: "HTMLElement" /* HTML_ELEMENT */, description: "Mount and render Web Component" },
      { signal: "element.updated" /* UPDATED */, type: "Record<string, unknown>" /* RECORD */, description: "Update component attributes and properties" },
      { signal: "element.removed" /* REMOVED */, type: "void" /* VOID */, description: "Unmount and destroy Web Component" }
    ],
    outputs: [
      { signal: "component.event" /* EVENT */, type: "EventContext" /* EVENT_CONTEXT */, description: "DOM and custom component events" },
      { signal: "element.connected" /* CONNECTED */, type: "LifecycleContext" /* LIFECYCLE_CONTEXT */, description: "Web Component connected to DOM lifecycle" },
      { signal: "element.disconnected" /* DISCONNECTED */, type: "LifecycleContext" /* LIFECYCLE_CONTEXT */, description: "Web Component disconnected from DOM lifecycle" },
      { signal: "element.attributeChanged" /* ATTRIBUTE_CHANGED */, type: "LifecycleContext" /* LIFECYCLE_CONTEXT */, description: "Observed attribute changed lifecycle" }
    ]
  };
  elements;
  elementControllers;
  constructor(id = __ID__6) {
    super(id);
    this.elements = /* @__PURE__ */ new Map();
    this.elementControllers = /* @__PURE__ */ new WeakMap();
  }
  innervate(target, disposition) {
    super.innervate(target, disposition);
    this.defineComponentTag();
    return this;
  }
  denervate() {
    super.denervate();
  }
  react(signal) {
    const { property, value } = signal;
    const payload = this.extractPayload(value);
    if (!this.matchesTargetId(payload?.id)) {
      return;
    }
    const targetId = payload?.id ?? this.id;
    switch (property) {
      case "element.removed" /* REMOVED */:
        this.removeComponent(targetId);
        break;
      case "element.rendered" /* RENDERED */:
        this.createComponent(targetId, payload);
        break;
      case "element.updated" /* UPDATED */:
        this.updateComponent(targetId, payload);
        break;
      default:
        break;
    }
  }
  matchesTargetId(targetId) {
    if (!targetId) {
      return true;
    }
    const { aim } = this.disposition;
    const { id: configuredId } = aim.body ?? {};
    if (!configuredId) {
      return true;
    }
    const matches = targetId === configuredId || targetId.startsWith(`${configuredId}-`);
    return matches;
  }
  defineComponentTag() {
    const tag = this.getTag();
    if (!this.isCustomElementDefined(tag)) {
      this.defineCustomElement(tag);
    }
  }
  createComponent(id, payload) {
    const existing = this.getElement(id);
    if (existing) {
      this.updateComponent(id, payload);
      return existing;
    }
    return this.instantiateComponent(id, payload);
  }
  instantiateComponent(id, payload) {
    const tag = this.getTag(payload?.tag);
    const element = this.instance(id, tag);
    this.mountElement(element, payload?.container);
    this.paintComponent(element, payload);
    return element;
  }
  updateComponent(id, payload) {
    const element = this.getElement(id);
    if (!element) {
      return;
    }
    this.mountElement(element, payload?.container);
    this.paintComponent(element, payload);
  }
  paintComponent(element, payload) {
    const { aim } = this.disposition;
    const { attributes: dispositionAttributes, text: dispositionText } = aim.body ?? {};
    const combinedAttributes = { ...dispositionAttributes, ...payload?.attributes };
    const text = payload?.text ?? dispositionText;
    synchronizeElementAttributes(element, combinedAttributes);
    synchronizeElementText(element, text);
  }
  getTag(payloadTag) {
    const { aim } = this.disposition;
    const { tag: dispositionTag } = aim.body ?? {};
    const fallbackTag = this.deriveTagFromId();
    const result = payloadTag ?? dispositionTag ?? fallbackTag;
    return result;
  }
  deriveTagFromId() {
    const { aim } = this.disposition;
    const { id: bodyId } = aim.body ?? {};
    const sourceId = bodyId ?? this.id;
    const [prefix] = sourceId.split(":");
    const [baseName] = prefix.trim().toLowerCase().split("-");
    const result = baseName ? `ext-${baseName}` : __DEFAULT_TAG__;
    return result;
  }
  isCustomElementDefined(tag) {
    if (typeof customElements === "undefined") {
      return true;
    }
    const isDefined = customElements.get(tag) !== void 0;
    return isDefined;
  }
  defineCustomElement(tag) {
    if (typeof customElements === "undefined") {
      return;
    }
    const observedAttributes = this.getObservedAttributes();
    const elementClass = createReactiveElementClass(observedAttributes);
    customElements.define(tag, elementClass);
  }
  getObservedAttributes() {
    const { aim } = this.disposition;
    const { observedAttributes } = aim.body ?? {};
    const result = observedAttributes?.length ? observedAttributes : __DEFAULT_OBSERVED_ATTRIBUTES__;
    return result;
  }
  getElement(id) {
    const element = this.elements.get(id);
    return element;
  }
  setElement(id, element) {
    this.elements.set(id, element);
  }
  instance(id, tag) {
    const element = document.createElement(tag);
    element.id = id;
    this.bindLifecycleListeners(element, id);
    this.setElement(id, element);
    return element;
  }
  removeComponent(id) {
    const element = this.elements.get(id);
    if (element) {
      this.unbindElementListeners(element);
      element.remove();
      this.elements.delete(id);
    }
  }
  bindLifecycleListeners(element, id) {
    const controller = new AbortController();
    this.elementControllers.set(element, controller);
    const { signal } = controller;
    this.attachConnectedListener(element, id, signal);
    this.attachDisconnectedListener(element, id, signal);
    this.attachAttributeListener(element, id, signal);
    this.attachContentListener(element, id, signal);
    this.attachTagListener(element, id, signal);
    this.attachUserEventListeners(element, id, signal);
  }
  attachUserEventListeners(element, id, signal) {
    for (const eventType of __DEFAULT_DOM_EVENTS__) {
      const handleUserEvent = (event) => {
        const context = this.buildEventContext(id, event);
        this.pulse("component.event" /* EVENT */, context);
      };
      this.attachListener(element, eventType, handleUserEvent, signal);
    }
  }
  buildEventContext(id, event) {
    const { type, target } = event;
    const { detail } = event;
    const { value: rawValue, checked, textContent } = target ?? {};
    const value = rawValue !== void 0 ? rawValue : textContent ?? void 0;
    const context = { id, event: type, value, checked, detail };
    return context;
  }
  attachConnectedListener(element, id, signal) {
    const handleConnected = () => {
      this.pulse("element.connected" /* CONNECTED */, { id, tag: element.tagName.toLowerCase() });
    };
    this.attachListener(element, "lifecycle.connected" /* CONNECTED */, handleConnected, signal);
  }
  attachDisconnectedListener(element, id, signal) {
    const handleDisconnected = () => {
      this.pulse("element.disconnected" /* DISCONNECTED */, { id, tag: element.tagName.toLowerCase() });
    };
    this.attachListener(element, "lifecycle.disconnected" /* DISCONNECTED */, handleDisconnected, signal);
  }
  attachAttributeListener(element, id, signal) {
    const handleAttribute = (event) => {
      const { name, oldValue, newValue } = event.detail;
      this.pulse("element.attributeChanged" /* ATTRIBUTE_CHANGED */, { id, tag: element.tagName.toLowerCase(), attribute: name, oldValue, newValue });
    };
    this.attachListener(element, "lifecycle.attributeChanged" /* ATTRIBUTE_CHANGED */, handleAttribute, signal);
  }
  attachContentListener(element, id, signal) {
    const handleContent = (event) => {
      const { content } = event.detail;
      this.pulse("element.contentChanged" /* CONTENT_CHANGED */, { id, tag: element.tagName.toLowerCase(), content });
    };
    this.attachListener(element, "lifecycle.contentChanged" /* CONTENT_CHANGED */, handleContent, signal);
  }
  attachTagListener(element, id, signal) {
    const handleTag = (event) => {
      const { oldTag, newTag } = event.detail;
      this.pulse("element.tagChanged" /* TAG_CHANGED */, { id, oldTag, newTag });
    };
    this.attachListener(element, "lifecycle.tagChanged" /* TAG_CHANGED */, handleTag, signal);
  }
  attachListener(element, type, action, signal) {
    element.addEventListener(type, action, { signal });
  }
  mountElement(element, container) {
    const { aim } = this.disposition;
    const { container: fallbackContainer } = aim.body ?? {};
    const activeContainer = container ?? fallbackContainer;
    mountElementToContainer(element, activeContainer);
  }
  unbindElementListeners(element) {
    const controller = this.elementControllers.get(element);
    if (controller) {
      controller.abort();
    }
  }
};

// src/collection/ucas/box/index.ts
var Box = class _Box extends Uca {
  static purpose = "Represent layout structural box and boundary container";
  static disposition = {
    aim: { description: _Box.purpose, body: {} },
    reactTo: [
      "box.create" /* CREATE */,
      "box.update" /* UPDATE */,
      "box.remove" /* REMOVE */,
      "element.rendered" /* RENDERED */,
      "element.updated" /* UPDATED */,
      "element.removed" /* REMOVED */
    ]
  };
  constructor(id = "box") {
    super(id);
  }
  react(signal) {
    const { property, value } = signal;
    switch (property) {
      case "box.create" /* CREATE */:
        this.handleCreate(value);
        break;
      case "box.update" /* UPDATE */:
        this.handleUpdate(value);
        break;
      case "box.remove" /* REMOVE */:
        this.handleRemove(value);
        break;
      default:
        this.handleCapabilitySignal(property);
        break;
    }
  }
  handleCreate(value) {
    const payload = value ?? {};
    const attributes = this.buildAttributes(__ID__6);
    this.pulse("element.rendered" /* RENDERED */, { id: this.id, container: payload.container, attributes });
  }
  handleUpdate(value) {
    const payload = value ?? {};
    const attributes = this.buildAttributes(__ID__6);
    this.pulse("element.updated" /* UPDATED */, { id: this.id, container: payload.container, attributes });
  }
  handleRemove(value) {
    const payload = value ?? {};
    const id = payload.id ?? this.id;
    this.pulse("element.removed" /* REMOVED */, { id });
  }
  handleCapabilitySignal(property) {
    const properties = this.getDomainProperties();
    switch (property) {
      case "element.rendered" /* RENDERED */:
        this.pulse("box.created" /* CREATED */, properties);
        break;
      case "element.updated" /* UPDATED */:
        this.pulse("box.updated" /* UPDATED */, properties);
        break;
      case "element.removed" /* REMOVED */:
        this.pulse("box.removed" /* REMOVED */, properties);
        break;
      default:
        break;
    }
  }
  getDomainProperties() {
    const { aim } = this.disposition;
    const properties = aim.body ?? {};
    return properties;
  }
  capabilities() {
    const attributes = this.buildAttributes(__ID__6);
    const body = { id: this.id, attributes };
    const purpose = "Render structural box container in target presentation tree";
    const disposition = { aim: { description: purpose, body }, reactTo: [...this.getReactToSignals()] };
    const cooky = [[WebComponent, disposition]];
    return cooky;
  }
  getReactToSignals() {
    const reactTo = [
      "element.rendered" /* RENDERED */,
      "element.updated" /* UPDATED */,
      "element.removed" /* REMOVED */
    ];
    return reactTo;
  }
  getAttributeMapping(capabilityId) {
    switch (capabilityId) {
      case __ID__6:
      default:
        return this.getWebComponentAttributes();
    }
  }
  getWebComponentAttributes() {
    const { aim } = this.disposition;
    const { text, role, hidden, className } = aim.body ?? {};
    const mapping = {
      "text": text,
      "role": role,
      "class": className,
      "hidden": hidden ? "" : void 0
    };
    return mapping;
  }
};

// src/collection/ucas/input/index.ts
var Input = class _Input extends Uca {
  static purpose = "Capture entered textual data, its typography, appearance and make it available to the system";
  static disposition = {
    aim: { description: _Input.purpose, body: {} },
    reactTo: [
      "input.create" /* CREATE */,
      "input.update" /* UPDATE */,
      "input.remove" /* REMOVE */,
      "input.change" /* CHANGE */,
      "element.rendered" /* RENDERED */,
      "element.updated" /* UPDATED */,
      "element.removed" /* REMOVED */,
      "component.event" /* EVENT */
    ]
  };
  constructor(id = "input") {
    super(id);
  }
  react(signal) {
    const { property, value } = signal;
    switch (property) {
      case "input.create" /* CREATE */:
        this.handleCreate(value);
        break;
      case "input.update" /* UPDATE */:
        this.handleUpdate(value);
        break;
      case "input.remove" /* REMOVE */:
        this.handleRemove(value);
        break;
      case "input.change" /* CHANGE */:
        this.handleChange(value);
        break;
      default:
        this.handleCapabilitySignal(property, value);
        break;
    }
  }
  handleCreate(value) {
    const payload = value ?? {};
    const targetId = payload.id ?? this.id;
    const baseAttributes = this.buildAttributes(__ID__6);
    const attributes = payload.placeholder ? { ...baseAttributes, placeholder: payload.placeholder } : baseAttributes;
    this.pulse("element.rendered" /* RENDERED */, { id: targetId, container: payload.container, attributes });
  }
  handleUpdate(value) {
    const payload = value ?? {};
    const targetId = payload.id ?? this.id;
    const baseAttributes = this.buildAttributes(__ID__6);
    const attributes = payload.placeholder ? { ...baseAttributes, placeholder: payload.placeholder } : baseAttributes;
    this.pulse("element.updated" /* UPDATED */, { id: targetId, container: payload.container, attributes });
  }
  handleRemove(value) {
    const payload = value ?? {};
    const id = payload.id ?? this.id;
    this.pulse("element.removed" /* REMOVED */, { id });
  }
  handleChange(value) {
    const { value: nextValue } = value ?? {};
    const properties = this.getDomainProperties();
    this.pulse("input.changed" /* CHANGED */, { ...properties, value: nextValue });
  }
  handleCapabilitySignal(property, value) {
    const properties = this.getDomainProperties();
    switch (property) {
      case "element.rendered" /* RENDERED */:
        this.pulse("input.created" /* CREATED */, properties);
        break;
      case "element.updated" /* UPDATED */:
        this.pulse("input.updated" /* UPDATED */, properties);
        break;
      case "element.removed" /* REMOVED */:
        this.pulse("input.removed" /* REMOVED */, properties);
        break;
      case "component.event" /* EVENT */:
        this.handleUserEvent(value);
        break;
      default:
        break;
    }
  }
  handleUserEvent(value) {
    const { event, value: eventValue } = value ?? {};
    if (event === "input" || event === "change") {
      const nextValue = eventValue !== void 0 ? String(eventValue) : void 0;
      this.handleChange({ value: nextValue });
    }
  }
  getDomainProperties() {
    const { aim } = this.disposition;
    const properties = aim.body ?? {};
    return properties;
  }
  capabilities() {
    const attributes = this.buildAttributes(__ID__6);
    const body = { id: this.id, attributes };
    const purpose = "Render interactive input in target presentation tree";
    const disposition = { aim: { description: purpose, body }, reactTo: [...this.getReactToSignals()] };
    const cooky = [[WebComponent, disposition]];
    return cooky;
  }
  getReactToSignals() {
    const reactTo = [
      "element.rendered" /* RENDERED */,
      "element.updated" /* UPDATED */,
      "element.removed" /* REMOVED */
    ];
    return reactTo;
  }
  getAttributeMapping(capabilityId) {
    switch (capabilityId) {
      case __ID__6:
      default:
        return this.getWebComponentAttributes();
    }
  }
  getWebComponentAttributes() {
    const { aim } = this.disposition;
    const { value, placeholder, disabled, readOnly } = aim.body ?? {};
    const isEditable = disabled || readOnly ? "false" : "true";
    return {
      "value": value,
      "placeholder": placeholder,
      "disabled": disabled ? "" : void 0,
      "readonly": readOnly ? "" : void 0,
      "contenteditable": isEditable,
      ...this.getStyleAttributes()
    };
  }
  getStyleAttributes() {
    const { aim } = this.disposition;
    const { fontSize, color, backgroundColor, fontFamily } = aim.body ?? {};
    return {
      "data-font-size": fontSize,
      "data-color": color,
      "data-background-color": backgroundColor,
      "data-font-family": fontFamily
    };
  }
};

// src/collection/ucas/action/index.ts
var Action = class _Action extends Uca {
  static purpose = "Represent an invokable action triggered by a user interaction";
  static disposition = {
    aim: { description: _Action.purpose, body: {} },
    reactTo: [
      "action.create" /* CREATE */,
      "action.update" /* UPDATE */,
      "action.remove" /* REMOVE */,
      "action.trigger" /* TRIGGER */,
      "element.rendered" /* RENDERED */,
      "element.updated" /* UPDATED */,
      "element.removed" /* REMOVED */,
      "component.event" /* EVENT */
    ]
  };
  constructor(id = "action") {
    super(id);
  }
  react(signal) {
    const { property, value } = signal;
    switch (property) {
      case "action.create" /* CREATE */:
        this.handleCreate(value);
        break;
      case "action.update" /* UPDATE */:
        this.handleUpdate(value);
        break;
      case "action.remove" /* REMOVE */:
        this.handleRemove(value);
        break;
      case "action.trigger" /* TRIGGER */:
        this.handleTrigger();
        break;
      default:
        this.handleCapabilitySignal(property, value);
        break;
    }
  }
  handleCreate(value) {
    const payload = value ?? {};
    const targetId = payload.id ?? this.id;
    const attributes = this.buildAttributes(__ID__6);
    const text = payload.label ?? this.disposition.aim.body?.label;
    this.pulse("element.rendered" /* RENDERED */, { id: targetId, container: payload.container, text, attributes });
  }
  handleUpdate(value) {
    const payload = value ?? {};
    const targetId = payload.id ?? this.id;
    const attributes = this.buildAttributes(__ID__6);
    const text = payload.label ?? this.disposition.aim.body?.label;
    this.pulse("element.updated" /* UPDATED */, { id: targetId, container: payload.container, text, attributes });
  }
  handleRemove(value) {
    const payload = value ?? {};
    const id = payload.id ?? this.id;
    this.pulse("element.removed" /* REMOVED */, { id });
  }
  handleTrigger(detail) {
    const properties = this.getDomainProperties();
    const payload = detail !== void 0 ? { ...properties, detail } : properties;
    this.pulse("action.triggered" /* TRIGGERED */, payload);
  }
  handleCapabilitySignal(property, value) {
    const properties = this.getDomainProperties();
    switch (property) {
      case "element.rendered" /* RENDERED */:
        this.pulse("action.created" /* CREATED */, properties);
        break;
      case "element.updated" /* UPDATED */:
        this.pulse("action.updated" /* UPDATED */, properties);
        break;
      case "element.removed" /* REMOVED */:
        this.pulse("action.removed" /* REMOVED */, properties);
        break;
      case "component.event" /* EVENT */:
        this.handleUserEvent(value);
        break;
      default:
        break;
    }
  }
  handleUserEvent(value) {
    const { event, detail } = value ?? {};
    if (event === "click") {
      this.handleTrigger(detail);
    }
  }
  getDomainProperties() {
    const { aim } = this.disposition;
    const properties = aim.body ?? {};
    return properties;
  }
  capabilities() {
    const attributes = this.buildAttributes(__ID__6);
    const { aim } = this.disposition;
    const { label } = aim.body ?? {};
    const body = { id: this.id, text: label, attributes };
    const purpose = "Render action invoker element in target presentation tree";
    const disposition = { aim: { description: purpose, body }, reactTo: [...this.getReactToSignals()] };
    const cooky = [[WebComponent, disposition]];
    return cooky;
  }
  getReactToSignals() {
    const reactTo = [
      "element.rendered" /* RENDERED */,
      "element.updated" /* UPDATED */,
      "element.removed" /* REMOVED */
    ];
    return reactTo;
  }
  getAttributeMapping(capabilityId) {
    switch (capabilityId) {
      case __ID__6:
      default:
        return this.getWebComponentAttributes();
    }
  }
  getWebComponentAttributes() {
    const { aim } = this.disposition;
    const { title, disabled } = aim.body ?? {};
    const mapping = {
      "title": title,
      "disabled": disabled ? "" : void 0
    };
    return mapping;
  }
};

// src/demo/entry.ts
var SignalType10 = {
  ...SignalType5,
  BOX_CREATE: "box.create" /* CREATE */,
  BOX_UPDATE: "box.update" /* UPDATE */,
  INPUT_CREATE: "input.create" /* CREATE */,
  INPUT_UPDATE: "input.update" /* UPDATE */,
  INPUT_CHANGE: "input.change" /* CHANGE */,
  ACTION_CREATE: "action.create" /* CREATE */,
  ACTION_TRIGGER: "action.trigger" /* TRIGGER */,
  VIEW_COMPOSE: "view-composer.compose" /* COMPOSE */,
  VIEW_COMPOSED: "view-composer.composed" /* COMPOSED */,
  JEV_CONNECT: "jev.connect" /* CONNECT */,
  JEV_INFER: "jev.infer" /* INFER */
};
export {
  Action,
  App,
  Box,
  Input,
  SignalType10 as SignalType,
  ViewComposer
};
