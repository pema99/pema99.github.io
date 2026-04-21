var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// glue/pkg/glue.js
var wasm;
function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_export_2.set(idx, obj);
  return idx;
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}
var cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: () => {
  throw Error("TextDecoder not available");
} };
if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
var cachedUint8ClampedArrayMemory0 = null;
function getUint8ClampedArrayMemory0() {
  if (cachedUint8ClampedArrayMemory0 === null || cachedUint8ClampedArrayMemory0.byteLength === 0) {
    cachedUint8ClampedArrayMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
  }
  return cachedUint8ClampedArrayMemory0;
}
function getClampedArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ClampedArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
var WASM_VECTOR_LEN = 0;
var cachedTextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder("utf-8") : { encode: () => {
  throw Error("TextEncoder not available");
} };
var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
var cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
var cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
  if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
    cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
  }
  return cachedFloat64ArrayMemory0;
}
function getArrayF64FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}
function new_emulator(host) {
  const ret = wasm.new_emulator(host);
  return Emulator.__wrap(ret);
}
function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0;
  for (let i = 0; i < array.length; i++) {
    const add = addToExternrefTable0(array[i]);
    getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
  }
  WASM_VECTOR_LEN = array.length;
  return ptr;
}
function getArrayJsValueFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  const mem = getDataViewMemory0();
  const result = [];
  for (let i = ptr; i < ptr + 4 * len; i += 4) {
    result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
  }
  wasm.__externref_drop_slice(ptr, len);
  return result;
}
function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_2.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
var Register = Object.freeze({
  EAX: 0,
  "0": "EAX",
  ECX: 1,
  "1": "ECX",
  EDX: 2,
  "2": "EDX",
  EBX: 3,
  "3": "EBX",
  ESP: 4,
  "4": "ESP",
  EBP: 5,
  "5": "EBP",
  ESI: 6,
  "6": "ESI",
  EDI: 7,
  "7": "EDI",
  CS: 8,
  "8": "CS",
  DS: 9,
  "9": "DS",
  ES: 10,
  "10": "ES",
  FS: 11,
  "11": "FS",
  GS: 12,
  "12": "GS",
  SS: 13,
  "13": "SS"
});
var Status = Object.freeze({
  Running: 0,
  "0": "Running",
  Blocked: 1,
  "1": "Blocked",
  Error: 2,
  "2": "Error",
  DebugBreak: 3,
  "3": "DebugBreak",
  Exit: 4,
  "4": "Exit"
});
var CPUFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_cpu_free(ptr >>> 0, 1));
var CPU = class _CPU {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_CPU.prototype);
    obj.__wbg_ptr = ptr;
    CPUFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    CPUFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_cpu_free(ptr, 0);
  }
  /**
   * @returns {Float64Array}
   */
  st() {
    const ret = wasm.cpu_st(this.__wbg_ptr);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
  }
  /**
   * @returns {number}
   */
  get eip() {
    const ret = wasm.cpu_eip(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @param {Register} reg
   * @returns {number}
   */
  get(reg) {
    const ret = wasm.cpu_get(this.__wbg_ptr, reg);
    return ret >>> 0;
  }
  /**
   * @param {number} _eip
   */
  jmp(_eip) {
    wasm.cpu_jmp(this.__wbg_ptr, _eip);
  }
  /**
   * @param {Register} reg
   * @param {number} value
   */
  set(reg, value) {
    wasm.cpu_set(this.__wbg_ptr, reg, value);
  }
  /**
   * @returns {number}
   */
  flags() {
    const ret = wasm.cpu_flags(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @returns {string}
   */
  state() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.cpu_state(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @returns {string}
   */
  flags_str() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.cpu_flags_str(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
};
var EmulatorFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_emulator_free(ptr >>> 0, 1));
var Emulator = class _Emulator {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_Emulator.prototype);
    obj.__wbg_ptr = ptr;
    EmulatorFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    EmulatorFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_emulator_free(ptr, 0);
  }
  /**
   * @returns {number}
   */
  get instr_count() {
    const ret = wasm.emulator_instr_count(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @returns {string}
   */
  mappings_json() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.emulator_mappings_json(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {number} addr
   */
  breakpoint_add(addr) {
    wasm.emulator_breakpoint_add(this.__wbg_ptr, addr);
  }
  /**
   * @param {number} addr
   */
  breakpoint_clear(addr) {
    wasm.emulator_breakpoint_clear(this.__wbg_ptr, addr);
  }
  /**
   * @param {number} addr
   * @param {number} limit
   * @returns {string}
   */
  disassemble_json(addr, limit) {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.emulator_disassemble_json(this.__wbg_ptr, addr, limit);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {string[]} dlls
   */
  set_external_dlls(dlls) {
    const ptr0 = passArrayJsValueToWasm0(dlls, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.emulator_set_external_dlls(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * @param {string} scheme
   */
  set_tracing_scheme(scheme) {
    const ptr0 = passStringToWasm0(scheme, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.emulator_set_tracing_scheme(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * @returns {any[]}
   */
  direct_draw_surfaces() {
    const ret = wasm.emulator_direct_draw_surfaces(this.__wbg_ptr);
    var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  /**
   * @returns {CPU}
   */
  cpu() {
    const ret = wasm.emulator_cpu(this.__wbg_ptr);
    return CPU.__wrap(ret);
  }
  /**
   * Run code until at least count instructions have run.
   * This exists to avoid many round-trips from JS to Rust in the execution loop.
   * @param {number} count
   * @returns {Status}
   */
  run(count) {
    const ret = wasm.emulator_run(this.__wbg_ptr, count);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
  }
  /**
   * @returns {CPU[]}
   */
  cpus() {
    const ret = wasm.emulator_cpus(this.__wbg_ptr);
    var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  /**
   * @returns {string}
   */
  labels() {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.emulator_labels(this.__wbg_ptr);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @returns {DataView}
   */
  memory() {
    const ret = wasm.emulator_memory(this.__wbg_ptr);
    return ret;
  }
  unblock() {
    wasm.emulator_unblock(this.__wbg_ptr);
  }
  /**
   * @returns {number}
   */
  get exit_code() {
    const ret = wasm.emulator_exit_code(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @param {string} cmdline
   * @param {boolean} relocate
   */
  start_exe(cmdline, relocate) {
    const ptr0 = passStringToWasm0(cmdline, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.emulator_start_exe(this.__wbg_ptr, ptr0, len0, relocate);
  }
};
var FileOptionsFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_fileoptions_free(ptr >>> 0, 1));
var FileOptions = class _FileOptions {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_FileOptions.prototype);
    obj.__wbg_ptr = ptr;
    FileOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    FileOptionsFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_fileoptions_free(ptr, 0);
  }
  /**
   * Permit read access.
   * @returns {boolean}
   */
  get read() {
    const ret = wasm.__wbg_get_fileoptions_read(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * Permit read access.
   * @param {boolean} arg0
   */
  set read(arg0) {
    wasm.__wbg_set_fileoptions_read(this.__wbg_ptr, arg0);
  }
  /**
   * Permit write access.
   * @returns {boolean}
   */
  get write() {
    const ret = wasm.__wbg_get_fileoptions_write(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * Permit write access.
   * @param {boolean} arg0
   */
  set write(arg0) {
    wasm.__wbg_set_fileoptions_write(this.__wbg_ptr, arg0);
  }
  /**
   * Truncate the file to zero length.
   * @returns {boolean}
   */
  get truncate() {
    const ret = wasm.__wbg_get_fileoptions_truncate(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * Truncate the file to zero length.
   * @param {boolean} arg0
   */
  set truncate(arg0) {
    wasm.__wbg_set_fileoptions_truncate(this.__wbg_ptr, arg0);
  }
  /**
   * Create the file if it doesn't exist.
   * @returns {boolean}
   */
  get create() {
    const ret = wasm.__wbg_get_fileoptions_create(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * Create the file if it doesn't exist.
   * @param {boolean} arg0
   */
  set create(arg0) {
    wasm.__wbg_set_fileoptions_create(this.__wbg_ptr, arg0);
  }
  /**
   * Create the file if it doesn't exist, and fail if it does.
   * @returns {boolean}
   */
  get create_new() {
    const ret = wasm.__wbg_get_fileoptions_create_new(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * Create the file if it doesn't exist, and fail if it does.
   * @param {boolean} arg0
   */
  set create_new(arg0) {
    wasm.__wbg_set_fileoptions_create_new(this.__wbg_ptr, arg0);
  }
};
var SurfaceOptionsFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_surfaceoptions_free(ptr >>> 0, 1));
async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}
function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_buffer_ef9774282e5dab94 = function(arg0) {
    const ret = arg0.buffer;
    return ret;
  };
  imports.wbg.__wbg_button_cf393fc0a7773ee4 = function(arg0) {
    const ret = arg0.button;
    return ret;
  };
  imports.wbg.__wbg_byteLength_249a2b65c8315d45 = function(arg0) {
    const ret = arg0.byteLength;
    return ret;
  };
  imports.wbg.__wbg_call_0ad083564791763a = function() {
    return handleError(function(arg0, arg1) {
      const ret = arg0.call(arg1);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_cpu_new = function(arg0) {
    const ret = CPU.__wrap(arg0);
    return ret;
  };
  imports.wbg.__wbg_createElement_32c287e69e603e7e = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_createwindow_3c59f235d130d69a = function(arg0, arg1) {
    const ret = arg0.create_window(arg1 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_document_da63b92bac45c6f9 = function(arg0) {
    const ret = arg0.document;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_drawImage_56d0362a2474b155 = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      arg0.drawImage(arg1, arg2, arg3);
    }, arguments);
  };
  imports.wbg.__wbg_drawImage_e16238d34587498a = function() {
    return handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
      arg0.drawImage(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
    }, arguments);
  };
  imports.wbg.__wbg_ensuretimer_d192fc71e0069e4a = function(arg0, arg1) {
    arg0.ensure_timer(arg1 >>> 0);
  };
  imports.wbg.__wbg_fillRect_7d2354e03f9acc1b = function(arg0, arg1, arg2, arg3, arg4) {
    arg0.fillRect(arg1, arg2, arg3, arg4);
  };
  imports.wbg.__wbg_fill_749b17bf30be9bd4 = function(arg0) {
    arg0.fill();
  };
  imports.wbg.__wbg_fullscreen_734e672975253adb = function(arg0) {
    arg0.fullscreen();
  };
  imports.wbg.__wbg_getContext_38bc848653a9260d = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments);
  };
  imports.wbg.__wbg_getTime_6953b8a865af729b = function(arg0) {
    const ret = arg0.getTime();
    return ret;
  };
  imports.wbg.__wbg_getTimezoneOffset_6c191e41297e5a8e = function(arg0) {
    const ret = arg0.getTimezoneOffset();
    return ret;
  };
  imports.wbg.__wbg_get_b996a12be035ef4f = function() {
    return handleError(function(arg0, arg1) {
      const ret = Reflect.get(arg0, arg1);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_getevent_9dd132ea460aa2b8 = function(arg0) {
    const ret = arg0.get_event();
    return ret;
  };
  imports.wbg.__wbg_globalThis_6b4d52a0b6aaeaea = function() {
    return handleError(function() {
      const ret = globalThis.globalThis;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_global_49324ce12193de77 = function() {
    return handleError(function() {
      const ret = global.global;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_info_28842f42a7bfb85a = function(arg0) {
    const ret = arg0.info();
    return ret;
  };
  imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_d22916fed004e2fd = function(arg0) {
    let result;
    try {
      result = arg0 instanceof CanvasRenderingContext2D;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_instanceof_Error_0c9a394fe7dece82 = function(arg0) {
    let result;
    try {
      result = arg0 instanceof Error;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_instanceof_Window_311934805c10047c = function(arg0) {
    let result;
    try {
      result = arg0 instanceof Window;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_log_940ce50a15c940eb = function(arg0, arg1, arg2, arg3) {
    let deferred0_0;
    let deferred0_1;
    try {
      deferred0_0 = arg2;
      deferred0_1 = arg3;
      arg0.log(arg1, getStringFromWasm0(arg2, arg3));
    } finally {
      wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
  };
  imports.wbg.__wbg_new0_fe1554a5ea9b2468 = function() {
    const ret = /* @__PURE__ */ new Date();
    return ret;
  };
  imports.wbg.__wbg_new_442a01c340625e5e = function(arg0, arg1, arg2) {
    const ret = new DataView(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_new_a96f21efc59c18b1 = function(arg0) {
    const ret = new Date(arg0);
    return ret;
  };
  imports.wbg.__wbg_newnoargs_a136448eeb7d48ac = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
  };
  imports.wbg.__wbg_newwithu8clampedarray_910aa121ffd52a07 = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_now_c893509b6d04fa0d = function(arg0) {
    const ret = arg0.now();
    return ret;
  };
  imports.wbg.__wbg_offsetX_735d4365b41503ea = function(arg0) {
    const ret = arg0.offsetX;
    return ret;
  };
  imports.wbg.__wbg_offsetY_b425bca937dc0468 = function(arg0) {
    const ret = arg0.offsetY;
    return ret;
  };
  imports.wbg.__wbg_open_4dc4b1c09dba3cf1 = function(arg0, arg1, arg2, arg3) {
    const ret = arg0.open(getStringFromWasm0(arg1, arg2), FileOptions.__wrap(arg3));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_parse_bd09af51fd7dd576 = function() {
    return handleError(function(arg0, arg1) {
      const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_performance_69882c3bda965f91 = function(arg0) {
    const ret = arg0.performance;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_putImageData_2975334e27e89cd1 = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      arg0.putImageData(arg1, arg2, arg3);
    }, arguments);
  };
  imports.wbg.__wbg_read_b4e07abd16138ad5 = function(arg0, arg1, arg2) {
    const ret = arg0.read(getArrayU8FromWasm0(arg1, arg2));
    return ret;
  };
  imports.wbg.__wbg_screen_8fef59ecec61fb1a = function(arg0) {
    const ret = arg0.screen();
    return ret;
  };
  imports.wbg.__wbg_seek_d1203db79d6a79bc = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.seek(arg1 >>> 0, arg2);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_self_cca3ca60d61220f4 = function() {
    return handleError(function() {
      const ret = self.self;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_set_1b50d2de855a9d50 = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = Reflect.set(arg0, arg1, arg2);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_setfillStyle_6f04c056479ad5af = function(arg0, arg1) {
    arg0.fillStyle = arg1;
  };
  imports.wbg.__wbg_setheight_7c3abb4af2d2235c = function(arg0, arg1) {
    arg0.height = arg1 >>> 0;
  };
  imports.wbg.__wbg_setsize_69c5da9f4bea38e4 = function(arg0, arg1, arg2) {
    arg0.set_size(arg1 >>> 0, arg2 >>> 0);
  };
  imports.wbg.__wbg_settitle_4ba80651bda87b98 = function(arg0, arg1, arg2) {
    arg0.title = getStringFromWasm0(arg1, arg2);
  };
  imports.wbg.__wbg_setwidth_d0f5a718234657d4 = function(arg0, arg1) {
    arg0.width = arg1 >>> 0;
  };
  imports.wbg.__wbg_stdin_9de3b5583bc9ff4c = function(arg0, arg1, arg2) {
    const ret = arg0.stdin(getArrayU8FromWasm0(arg1, arg2));
    return ret;
  };
  imports.wbg.__wbg_stdout_2209f8bdad555948 = function(arg0, arg1, arg2) {
    arg0.stdout(getArrayU8FromWasm0(arg1, arg2));
  };
  imports.wbg.__wbg_timeStamp_22d8d02d9f717b67 = function(arg0) {
    const ret = arg0.timeStamp;
    return ret;
  };
  imports.wbg.__wbg_toString_5eb859e9871e175f = function(arg0) {
    const ret = arg0.toString();
    return ret;
  };
  imports.wbg.__wbg_type_b9c6dd303f337332 = function(arg0, arg1) {
    const ret = arg1.type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_win32trace_89addc75a0d7fc56 = function(arg0, arg1, arg2, arg3, arg4) {
    arg0.win32_trace(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
  };
  imports.wbg.__wbg_window_2aba046d3fc4ad7c = function() {
    return handleError(function() {
      const ret = window.window;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_write_2e76d74dfab19e1e = function(arg0, arg1, arg2) {
    const ret = arg0.write(getArrayU8FromWasm0(arg1, arg2));
    return ret;
  };
  imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
  };
  imports.wbg.__wbindgen_init_externref_table = function() {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, void 0);
    table.set(offset + 0, void 0);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
  };
  imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = arg0 === void 0;
    return ret;
  };
  imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return ret;
  };
  imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
    const obj = arg1;
    const ret = typeof obj === "number" ? obj : void 0;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
  };
  imports.wbg.__wbindgen_number_new = function(arg0) {
    const ret = arg0;
    return ret;
  };
  imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = arg1;
    const ret = typeof obj === "string" ? obj : void 0;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  return imports;
}
function __wbg_init_memory(imports, memory) {
}
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedDataViewMemory0 = null;
  cachedFloat64ArrayMemory0 = null;
  cachedUint8ArrayMemory0 = null;
  cachedUint8ClampedArrayMemory0 = null;
  wasm.__wbindgen_start();
  return wasm;
}
async function __wbg_init(module_or_path) {
  if (wasm !== void 0) return wasm;
  if (typeof module_or_path !== "undefined") {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    }
  }
  if (typeof module_or_path === "undefined") {
    module_or_path = new URL("glue_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  __wbg_init_memory(imports);
  const { instance, module } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance, module);
}
var glue_default = __wbg_init;

// fxc.ts
var DEFAULT_HLSL = `float4 main(float2 uv : TEXCOORD) : SV_Target {
    float3 color = float3(uv.x, uv.y, 0.5);
    return float4(color, 1.0);
}
`;
async function compressCode(code) {
  const bytes = new TextEncoder().encode(code);
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const chunks = [];
  const reader = cs.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.length;
  }
  let binary = "";
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function decompressCode(encoded) {
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (encoded.length % 4) encoded += "=";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const ds = new DecompressionStream("gzip");
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const chunks = [];
  const reader = ds.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.length;
  }
  return new TextDecoder().decode(buf);
}
var FxcFile = class {
  constructor(bytes) {
    this.bytes = bytes;
  }
  ofs = 0;
  info() {
    return this.bytes.length;
  }
  seek(from, ofs) {
    if (from === 0) this.ofs = ofs;
    else if (from === 1) this.ofs = this.bytes.length + ofs;
    else this.ofs += ofs;
    if (this.ofs < 0) this.ofs = 0;
    if (this.ofs > this.bytes.length) this.ofs = this.bytes.length;
    return this.ofs;
  }
  read(buf) {
    const n = Math.min(buf.length, this.bytes.length - this.ofs);
    buf.set(this.bytes.subarray(this.ofs, this.ofs + n));
    this.ofs += n;
    return n;
  }
  write(_buf) {
    return _buf.length;
  }
};
var FxcHost = class {
  constructor(files, hlsl) {
    this.files = files;
    this.stdinBytes = new TextEncoder().encode(hlsl);
  }
  stdinBytes;
  stdinPos = 0;
  decoder = new TextDecoder();
  output = "";
  log(level, msg) {
    if (level === 1) {
      this.output += "[error] " + msg + "\n";
      console.error(msg);
    } else {
      console.warn(msg);
    }
  }
  win32_trace(_context, _msg) {
  }
  ensure_timer(_when) {
  }
  get_event() {
    return void 0;
  }
  stdin(buf) {
    const remaining = this.stdinBytes.length - this.stdinPos;
    if (remaining <= 0) return 0;
    const n = Math.min(buf.length, remaining);
    buf.set(this.stdinBytes.subarray(this.stdinPos, this.stdinPos + n));
    this.stdinPos += n;
    return n;
  }
  stdout(buf) {
    this.output += this.decoder.decode(buf, { stream: true });
  }
  flushOutput() {
    this.output += this.decoder.decode();
  }
  open(path, options) {
    if (options.create) return new FxcFile(new Uint8Array());
    const key = path.toLowerCase().replace(/\\/g, "/");
    const basename = key.split("/").pop();
    const bytes = this.files[basename] ?? this.files[key];
    return bytes ? new FxcFile(bytes) : null;
  }
  create_window(_hwnd) {
    throw new Error("no window support");
  }
  screen() {
    throw new Error("no screen support");
  }
  audio(_buf) {
  }
};
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function highlightAsm(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  return lines.map((line) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("//") || trimmed === "") {
      return `<span class="asm-comment">${escapeHtml(line)}</span>`;
    }
    let working = line.replace(/<!--[^>]*-->/g, "");
    working = escapeHtml(working);
    working = working.replace(
      /\bl(\([^)]*\))/g,
      (_, args) => `<span class="asm-lit">l${args}</span>`
    );
    working = working.replace(
      /^(\s*)([a-z][a-z0-9_]*)/,
      (_, ws, kw) => `${ws}<span class="asm-op">${kw}</span>`
    );
    return working;
  }).join("\n");
}
function highlightDiagnosticLines(text) {
  return text.replace(/\r\n/g, "\n").split("\n").map((line) => {
    if (/\)\s*:\s*warning\s/.test(line))
      return `<span class="asm-warning">${escapeHtml(line)}</span>`;
    if (/\)\s*:\s*error\s/.test(line))
      return `<span class="asm-error">${escapeHtml(line)}</span>`;
    return highlightAsm(line);
  }).join("\n");
}
function parseDiagnostics(text) {
  const diags = [];
  const re = /\((\d+),(\d+)(?:-(\d+))?\)\s*:\s*(warning|error)\s+\w+:\s*(.+)$/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    const startCol = parseInt(m[2], 10);
    const endCol = m[3] ? parseInt(m[3], 10) : startCol + 1;
    diags.push({
      line: parseInt(m[1], 10),
      startCol,
      endCol: Math.max(endCol, startCol + 1),
      severity: m[4],
      message: m[5].trim()
    });
  }
  return diags;
}
async function compile(files, hlsl, profile, entry, optLevel) {
  const host = new FxcHost(files, hlsl);
  const emu = new_emulator(host);
  try {
    emu.set_external_dlls(["d3dcompiler_47.dll", "D3DCOMPILER_47.dll", "d3dcompiler_43.dll", "D3DCOMPILER_43.dll"]);
    emu.start_exe(`d3d_compile.exe ${profile} ${entry} ${optLevel} 1`, false);
    await new Promise((resolve, reject) => {
      const ch = new MessageChannel();
      ch.port2.onmessage = () => {
        emu.unblock();
        let status;
        try {
          status = emu.run(1e6);
        } catch (e) {
          host.flushOutput();
          const wasmMsg = e?.message ?? String(e);
          const detail = host.output ? `${host.output}
[wasm] ${wasmMsg}` : wasmMsg;
          reject(new Error(detail));
          return;
        }
        switch (status) {
          case Status.Running:
          case Status.Blocked:
            ch.port1.postMessage(null);
            break;
          case Status.Exit:
            host.flushOutput();
            resolve();
            break;
          default:
            reject(new Error(`emulator stopped unexpectedly: ${status}`));
        }
      };
      ch.port1.postMessage(null);
    });
  } finally {
    emu.free();
  }
  return host.output;
}
function registerHlslLanguage() {
  monaco.languages.register({ id: "hlsl" });
  monaco.languages.setMonarchTokensProvider("hlsl", {
    controlKeywords: [
      "if",
      "else",
      "for",
      "while",
      "do",
      "switch",
      "case",
      "default",
      "break",
      "continue",
      "return",
      "discard"
    ],
    modifierKeywords: [
      "static",
      "const",
      "uniform",
      "in",
      "out",
      "inout",
      "inline",
      "extern",
      "shared",
      "groupshared",
      "globallycoherent",
      "volatile",
      "precise",
      "nointerpolation",
      "noperspective",
      "centroid",
      "linear",
      "row_major",
      "column_major",
      "snorm",
      "unorm",
      "unsigned",
      "export",
      "indices",
      "vertices",
      "primitives",
      "payload"
    ],
    typeKeywords: [
      "void",
      "bool",
      "int",
      "uint",
      "dword",
      "half",
      "float",
      "double",
      "string",
      "vector",
      "matrix",
      "bool1",
      "bool2",
      "bool3",
      "bool4",
      "int1",
      "int2",
      "int3",
      "int4",
      "uint1",
      "uint2",
      "uint3",
      "uint4",
      "half1",
      "half2",
      "half3",
      "half4",
      "float1",
      "float2",
      "float3",
      "float4",
      "double1",
      "double2",
      "double3",
      "double4",
      "bool1x1",
      "bool1x2",
      "bool1x3",
      "bool1x4",
      "bool2x1",
      "bool2x2",
      "bool2x3",
      "bool2x4",
      "bool3x1",
      "bool3x2",
      "bool3x3",
      "bool3x4",
      "bool4x1",
      "bool4x2",
      "bool4x3",
      "bool4x4",
      "int1x1",
      "int1x2",
      "int1x3",
      "int1x4",
      "int2x1",
      "int2x2",
      "int2x3",
      "int2x4",
      "int3x1",
      "int3x2",
      "int3x3",
      "int3x4",
      "int4x1",
      "int4x2",
      "int4x3",
      "int4x4",
      "uint1x1",
      "uint1x2",
      "uint1x3",
      "uint1x4",
      "uint2x1",
      "uint2x2",
      "uint2x3",
      "uint2x4",
      "uint3x1",
      "uint3x2",
      "uint3x3",
      "uint3x4",
      "uint4x1",
      "uint4x2",
      "uint4x3",
      "uint4x4",
      "half1x1",
      "half1x2",
      "half1x3",
      "half1x4",
      "half2x1",
      "half2x2",
      "half2x3",
      "half2x4",
      "half3x1",
      "half3x2",
      "half3x3",
      "half3x4",
      "half4x1",
      "half4x2",
      "half4x3",
      "half4x4",
      "float1x1",
      "float1x2",
      "float1x3",
      "float1x4",
      "float2x1",
      "float2x2",
      "float2x3",
      "float2x4",
      "float3x1",
      "float3x2",
      "float3x3",
      "float3x4",
      "float4x1",
      "float4x2",
      "float4x3",
      "float4x4",
      "double1x1",
      "double1x2",
      "double1x3",
      "double1x4",
      "double2x1",
      "double2x2",
      "double2x3",
      "double2x4",
      "double3x1",
      "double3x2",
      "double3x3",
      "double3x4",
      "double4x1",
      "double4x2",
      "double4x3",
      "double4x4",
      "min16float",
      "min16float1",
      "min16float2",
      "min16float3",
      "min16float4",
      "min16int",
      "min16int1",
      "min16int2",
      "min16int3",
      "min16int4",
      "min16uint",
      "min16uint1",
      "min16uint2",
      "min16uint3",
      "min16uint4",
      "min12int",
      "min12int1",
      "min12int2",
      "min12int3",
      "min12int4",
      "min10float",
      "min10float1",
      "min10float2",
      "min10float3",
      "min10float4"
    ],
    objectKeywords: [
      "struct",
      "class",
      "interface",
      "typedef",
      "namespace",
      "cbuffer",
      "tbuffer",
      "technique",
      "technique10",
      "technique11",
      "pass",
      "SamplerState",
      "SamplerComparisonState",
      "sampler",
      "sampler1D",
      "sampler2D",
      "sampler3D",
      "samplerCUBE",
      "Texture",
      "Texture2DLegacy",
      "TextureCubeLegacy",
      "Texture1D",
      "Texture1DArray",
      "Texture2D",
      "Texture2DArray",
      "Texture2DMS",
      "Texture2DMSArray",
      "Texture3D",
      "TextureCube",
      "TextureCubeArray",
      "RWTexture1D",
      "RWTexture1DArray",
      "RWTexture2D",
      "RWTexture2DArray",
      "RWTexture3D",
      "Buffer",
      "ByteAddressBuffer",
      "StructuredBuffer",
      "RWBuffer",
      "RWByteAddressBuffer",
      "RWStructuredBuffer",
      "AppendStructuredBuffer",
      "ConsumeStructuredBuffer",
      "RasterizerOrderedBuffer",
      "RasterizerOrderedByteAddressBuffer",
      "RasterizerOrderedStructuredBuffer",
      "RasterizerOrderedTexture1D",
      "RasterizerOrderedTexture1DArray",
      "RasterizerOrderedTexture2D",
      "RasterizerOrderedTexture2DArray",
      "RasterizerOrderedTexture3D",
      "InputPatch",
      "OutputPatch",
      "LineStream",
      "TriangleStream",
      "PointStream",
      "BlendState",
      "DepthStencilState",
      "RasterizerState"
    ],
    literalKeywords: ["true", "false", "NULL"],
    builtins: [
      "abs",
      "acos",
      "all",
      "any",
      "asdouble",
      "asfloat",
      "asin",
      "asint",
      "asuint",
      "atan",
      "atan2",
      "ceil",
      "clamp",
      "clip",
      "cos",
      "cosh",
      "countbits",
      "cross",
      "D3DCOLORtoUBYTE4",
      "ddx",
      "ddx_coarse",
      "ddx_fine",
      "ddy",
      "ddy_coarse",
      "ddy_fine",
      "degrees",
      "determinant",
      "distance",
      "dot",
      "dst",
      "exp",
      "exp2",
      "f16tof32",
      "f32tof16",
      "faceforward",
      "firstbithigh",
      "firstbitlow",
      "floor",
      "fma",
      "fmod",
      "frac",
      "frexp",
      "fwidth",
      "isfinite",
      "isinf",
      "isnan",
      "ldexp",
      "length",
      "lerp",
      "lit",
      "log",
      "log10",
      "log2",
      "mad",
      "max",
      "min",
      "modf",
      "msad4",
      "mul",
      "noise",
      "normalize",
      "pow",
      "radians",
      "rcp",
      "reflect",
      "refract",
      "reversebits",
      "round",
      "rsqrt",
      "saturate",
      "sign",
      "sin",
      "sincos",
      "sinh",
      "smoothstep",
      "sqrt",
      "step",
      "tan",
      "tanh",
      "transpose",
      "trunc",
      "printf",
      "errorf",
      "abort",
      "AllMemoryBarrier",
      "DeviceMemoryBarrier",
      "GroupMemoryBarrier",
      "AllMemoryBarrierWithGroupSync",
      "DeviceMemoryBarrierWithGroupSync",
      "GroupMemoryBarrierWithGroupSync",
      "GetRenderTargetSampleCount",
      "GetRenderTargetSamplePosition",
      "QuadReadAcrossDiagonal",
      "QuadReadLaneAt",
      "QuadReadAcrossX",
      "QuadReadAcrossY",
      "WaveActiveAllEqual",
      "WaveActiveBitAnd",
      "WaveActiveBitOr",
      "WaveActiveBitXor",
      "WaveActiveCountBits",
      "WaveActiveMax",
      "WaveActiveMin",
      "WaveActiveProduct",
      "WaveActiveSum",
      "WaveActiveAllTrue",
      "WaveActiveAnyTrue",
      "WaveActiveBallot",
      "WaveGetLaneCount",
      "WaveGetLaneIndex",
      "WaveIsFirstLane",
      "WavePrefixCountBits",
      "WavePrefixProduct",
      "WavePrefixSum",
      "WaveReadLaneFirst",
      "WaveReadLaneAt"
    ],
    tokenizer: {
      root: [
        [/^\s*#\s*\w+/, "keyword.directive"],
        [/\[/, { token: "annotation.bracket", next: "@annotation" }],
        [/\d*\.\d+([eE][\-+]?\d+)?[fFhH]?/, "number.float"],
        [/\d+[fFhH]/, "number.float"],
        [/0[xX][0-9a-fA-F]+[uU]?/, "number.hex"],
        [/\d+[uU]?/, "number"],
        [/"([^"\\]|\\.)*"/, "string"],
        [/[a-zA-Z_]\w*/, {
          cases: {
            "@controlKeywords": "keyword.control",
            "@modifierKeywords": "keyword.modifier",
            "@typeKeywords": "keyword.type",
            "@objectKeywords": "keyword.type",
            "@literalKeywords": "keyword.literal",
            "@builtins": "support.function",
            "@default": "identifier"
          }
        }],
        { include: "@whitespace" },
        [/[{}()\[\]]/, "@brackets"],
        [/[=!<>+\-*\/%&|^~?:;,.]/, "operator"]
      ],
      annotation: [
        [/\]/, { token: "annotation.bracket", next: "@pop" }],
        [/[a-zA-Z_]\w*/, "annotation"],
        [/[(),]/, "annotation"],
        [/\d+/, "annotation"],
        [/"([^"\\]|\\.)*"/, "annotation"]
      ],
      whitespace: [
        [/[ \t\r\n]+/, ""],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"]
      ],
      comment: [
        [/[^\/*]+/, "comment"],
        [/\/\*/, "comment", "@push"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"]
      ]
    }
  });
  const noArgIntrinsics = /* @__PURE__ */ new Set([
    "AllMemoryBarrier",
    "DeviceMemoryBarrier",
    "GroupMemoryBarrier",
    "AllMemoryBarrierWithGroupSync",
    "DeviceMemoryBarrierWithGroupSync",
    "GroupMemoryBarrierWithGroupSync",
    "GetRenderTargetSampleCount",
    "WaveGetLaneCount",
    "WaveGetLaneIndex",
    "WaveIsFirstLane",
    "abort"
  ]);
  const intrinsics = [
    "abs",
    "acos",
    "all",
    "any",
    "asdouble",
    "asfloat",
    "asin",
    "asint",
    "asuint",
    "atan",
    "atan2",
    "ceil",
    "clamp",
    "clip",
    "cos",
    "cosh",
    "countbits",
    "cross",
    "D3DCOLORtoUBYTE4",
    "ddx",
    "ddx_coarse",
    "ddx_fine",
    "ddy",
    "ddy_coarse",
    "ddy_fine",
    "degrees",
    "determinant",
    "distance",
    "dot",
    "dst",
    "exp",
    "exp2",
    "f16tof32",
    "f32tof16",
    "faceforward",
    "firstbithigh",
    "firstbitlow",
    "floor",
    "fma",
    "fmod",
    "frac",
    "frexp",
    "fwidth",
    "isfinite",
    "isinf",
    "isnan",
    "ldexp",
    "length",
    "lerp",
    "lit",
    "log",
    "log10",
    "log2",
    "mad",
    "max",
    "min",
    "modf",
    "msad4",
    "mul",
    "noise",
    "normalize",
    "pow",
    "radians",
    "rcp",
    "reflect",
    "refract",
    "reversebits",
    "round",
    "rsqrt",
    "saturate",
    "sign",
    "sin",
    "sincos",
    "sinh",
    "smoothstep",
    "sqrt",
    "step",
    "tan",
    "tanh",
    "transpose",
    "trunc",
    "printf",
    "errorf",
    "abort",
    "AllMemoryBarrier",
    "DeviceMemoryBarrier",
    "GroupMemoryBarrier",
    "AllMemoryBarrierWithGroupSync",
    "DeviceMemoryBarrierWithGroupSync",
    "GroupMemoryBarrierWithGroupSync",
    "GetRenderTargetSampleCount",
    "GetRenderTargetSamplePosition",
    "QuadReadAcrossDiagonal",
    "QuadReadLaneAt",
    "QuadReadAcrossX",
    "QuadReadAcrossY",
    "WaveActiveAllEqual",
    "WaveActiveBitAnd",
    "WaveActiveBitOr",
    "WaveActiveBitXor",
    "WaveActiveCountBits",
    "WaveActiveMax",
    "WaveActiveMin",
    "WaveActiveProduct",
    "WaveActiveSum",
    "WaveActiveAllTrue",
    "WaveActiveAnyTrue",
    "WaveActiveBallot",
    "WaveGetLaneCount",
    "WaveGetLaneIndex",
    "WaveIsFirstLane",
    "WavePrefixCountBits",
    "WavePrefixProduct",
    "WavePrefixSum",
    "WaveReadLaneFirst",
    "WaveReadLaneAt"
  ];
  const controlKeywords = [
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "default",
    "break",
    "continue",
    "return",
    "discard"
  ];
  const modifierKeywords = [
    "static",
    "const",
    "uniform",
    "in",
    "out",
    "inout",
    "inline",
    "extern",
    "shared",
    "groupshared",
    "globallycoherent",
    "volatile",
    "precise",
    "nointerpolation",
    "noperspective",
    "centroid",
    "linear",
    "row_major",
    "column_major",
    "snorm",
    "unorm",
    "unsigned",
    "export",
    "indices",
    "vertices",
    "primitives",
    "payload"
  ];
  const typeKeywords = [
    "void",
    "bool",
    "int",
    "uint",
    "dword",
    "half",
    "float",
    "double",
    "string",
    "vector",
    "matrix",
    "bool1",
    "bool2",
    "bool3",
    "bool4",
    "int1",
    "int2",
    "int3",
    "int4",
    "uint1",
    "uint2",
    "uint3",
    "uint4",
    "half1",
    "half2",
    "half3",
    "half4",
    "float1",
    "float2",
    "float3",
    "float4",
    "double1",
    "double2",
    "double3",
    "double4",
    "float1x1",
    "float1x2",
    "float1x3",
    "float1x4",
    "float2x1",
    "float2x2",
    "float2x3",
    "float2x4",
    "float3x1",
    "float3x2",
    "float3x3",
    "float3x4",
    "float4x1",
    "float4x2",
    "float4x3",
    "float4x4",
    "int1x1",
    "int2x2",
    "int3x3",
    "int4x4",
    "uint1x1",
    "uint2x2",
    "uint3x3",
    "uint4x4",
    "min16float",
    "min16int",
    "min16uint",
    "min12int",
    "min10float"
  ];
  const objectKeywords = [
    "struct",
    "class",
    "interface",
    "typedef",
    "namespace",
    "cbuffer",
    "tbuffer",
    "technique",
    "technique10",
    "technique11",
    "pass",
    "SamplerState",
    "SamplerComparisonState",
    "sampler",
    "sampler1D",
    "sampler2D",
    "sampler3D",
    "samplerCUBE",
    "Texture1D",
    "Texture1DArray",
    "Texture2D",
    "Texture2DArray",
    "Texture2DMS",
    "Texture2DMSArray",
    "Texture3D",
    "TextureCube",
    "TextureCubeArray",
    "RWTexture1D",
    "RWTexture1DArray",
    "RWTexture2D",
    "RWTexture2DArray",
    "RWTexture3D",
    "Buffer",
    "ByteAddressBuffer",
    "StructuredBuffer",
    "RWBuffer",
    "RWByteAddressBuffer",
    "RWStructuredBuffer",
    "AppendStructuredBuffer",
    "ConsumeStructuredBuffer",
    "InputPatch",
    "OutputPatch",
    "LineStream",
    "TriangleStream",
    "PointStream",
    "BlendState",
    "DepthStencilState",
    "RasterizerState"
  ];
  const literalKeywords = ["true", "false", "NULL"];
  const allKeywords = [...controlKeywords, ...modifierKeywords, ...typeKeywords, ...objectKeywords, ...literalKeywords];
  const intrinsicSet = new Set(intrinsics);
  const keywordSet = new Set(allKeywords);
  monaco.languages.registerCompletionItemProvider("hlsl", {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      const content = model.getValue();
      const wordRegex = /[a-zA-Z_]\w*/g;
      const seen = /* @__PURE__ */ new Set([...intrinsicSet, ...keywordSet]);
      const wordSuggestions = [];
      let m;
      while ((m = wordRegex.exec(content)) !== null) {
        if (!seen.has(m[0])) {
          seen.add(m[0]);
          wordSuggestions.push({ label: m[0], kind: monaco.languages.CompletionItemKind.Text, insertText: m[0], range });
        }
      }
      const intrinsicSuggestions = intrinsics.map((name) => ({
        label: name,
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: noArgIntrinsics.has(name) ? name + "()" : name + "($0)",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range
      }));
      const keywordSuggestions = allKeywords.map((name) => ({
        label: name,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: name,
        range
      }));
      return { suggestions: [...keywordSuggestions, ...intrinsicSuggestions, ...wordSuggestions] };
    }
  });
  monaco.editor.defineTheme("hlsl-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword.control", foreground: "c586c0" },
      { token: "keyword.modifier", foreground: "569cd6" },
      { token: "keyword.type", foreground: "4ec9b0" },
      { token: "keyword.literal", foreground: "569cd6" },
      { token: "keyword.directive", foreground: "9b9b9b" },
      { token: "support.function", foreground: "dcdcaa" },
      { token: "annotation", foreground: "c8c8c8" },
      { token: "annotation.bracket", foreground: "c8c8c8" },
      { token: "number", foreground: "b5cea8" },
      { token: "number.float", foreground: "b5cea8" },
      { token: "number.hex", foreground: "b5cea8" },
      { token: "string", foreground: "ce9178" },
      { token: "comment", foreground: "6a9955" },
      { token: "identifier", foreground: "9cdcfe" },
      { token: "operator", foreground: "d4d4d4" }
    ],
    colors: {}
  });
}
async function fetchBytes(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status} ${resp.statusText}`);
  return new Uint8Array(await resp.arrayBuffer());
}
async function main() {
  const statusEl = document.getElementById("status");
  const permalinkBtn = document.getElementById("permalink-btn");
  const outputEl = document.getElementById("output");
  const spinnerEl = document.getElementById("compile-spinner");
  const profileSel = document.getElementById("profile");
  const entryInput = document.getElementById("entry");
  const optSel = document.getElementById("opt");
  function setStatus(msg) {
    statusEl.textContent = msg;
  }
  function setSpinner(on) {
    spinnerEl.style.display = on ? "flex" : "none";
  }
  function setOutput(text, isError = false) {
    if (isError) {
      outputEl.textContent = text;
      outputEl.className = "error";
    } else {
      const normalized = text.replace(/\r\n/g, "\n");
      const preIdx = normalized.indexOf("<pre>");
      if (preIdx !== -1) {
        const warnings = normalized.slice(0, preIdx);
        const inner = normalized.slice(preIdx).replace(/^<pre><body[^>]*>/, "").replace(/<\/pre>\s*$/, "");
        outputEl.innerHTML = (warnings.trim() ? `<span class="asm-warning">${escapeHtml(warnings.trimEnd())}</span>
` : "") + inner;
        outputEl.className = "";
      } else {
        outputEl.innerHTML = highlightDiagnosticLines(text);
        outputEl.className = "";
      }
    }
  }
  const params = new URLSearchParams(location.search);
  const exeUrl = params.get("exe") ?? "d3d_compile.exe";
  const dllUrl = params.get("dll") ?? "D3DCOMPILER_47.dll";
  const urlProfile = params.get("profile");
  const urlEntry = params.get("entry");
  const urlOpt = params.get("opt");
  if (urlProfile) profileSel.value = urlProfile;
  if (urlEntry) entryInput.value = urlEntry;
  if (urlOpt) optSel.value = urlOpt;
  let initialHlsl = DEFAULT_HLSL;
  const urlCode = params.get("c");
  if (urlCode) {
    try {
      initialHlsl = await decompressCode(urlCode);
    } catch {
    }
  }
  setStatus("Loading...");
  let files;
  try {
    const [, exeBytes, dllBytes] = await Promise.all([
      glue_default(new URL("wasm.wasm", location.href)),
      fetchBytes(exeUrl),
      fetchBytes(dllUrl)
    ]);
    const dllName = dllUrl.split("/").pop().toLowerCase();
    files = {
      "d3d_compile.exe": exeBytes,
      [dllName]: dllBytes
    };
  } catch (e) {
    setStatus("Failed to load");
    outputEl.textContent = e.message ?? String(e);
    outputEl.className = "error";
    return;
  }
  setStatus("");
  permalinkBtn.disabled = false;
  const wasmUrl = new URL("wasm.wasm", location.href);
  let wasmNeedsReinit = false;
  let compileTimer = null;
  let isCompiling = false;
  let pendingCompile = false;
  function setMarkers(diags) {
    if (!editor) return;
    monaco.editor.setModelMarkers(editor.getModel(), "fxc", diags.map((d) => ({
      startLineNumber: d.line,
      startColumn: d.startCol,
      endLineNumber: d.line,
      endColumn: d.endCol + 1,
      message: d.message,
      severity: d.severity === "error" ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning
    })));
  }
  async function doCompile() {
    isCompiling = true;
    setSpinner(true);
    if (wasmNeedsReinit) {
      try {
        await glue_default(wasmUrl);
        wasmNeedsReinit = false;
      } catch {
      }
    }
    const hlsl = editor ? editor.getValue() : initialHlsl;
    const profile = profileSel.value;
    const entry = entryInput.value.trim() || "main";
    const optLevel = parseInt(optSel.value, 10);
    try {
      const output = await compile(files, hlsl, profile, entry, optLevel);
      if (output.trim()) {
        setOutput(output);
      } else {
        outputEl.textContent = "(no output \u2014 check shader for errors)";
        outputEl.className = "error";
      }
      setMarkers(parseDiagnostics(output));
    } catch (e) {
      const msg = e.message ?? String(e);
      if (msg.includes("unreachable") || msg.includes("RuntimeError")) {
        wasmNeedsReinit = true;
      }
      outputEl.textContent = msg;
      outputEl.className = "error";
      setMarkers([]);
    } finally {
      isCompiling = false;
      setSpinner(false);
    }
    if (pendingCompile) {
      pendingCompile = false;
      await doCompile();
    }
  }
  function scheduleCompile(delay = 500) {
    if (compileTimer) clearTimeout(compileTimer);
    compileTimer = setTimeout(() => {
      compileTimer = null;
      if (isCompiling) {
        pendingCompile = true;
        return;
      }
      doCompile();
    }, delay);
  }
  let editor;
  const monacoReady = new Promise((resolve) => {
    __require(["vs/editor/editor.main"], () => {
      registerHlslLanguage();
      editor = monaco.editor.create(document.getElementById("monaco-container"), {
        value: initialHlsl,
        language: "hlsl",
        theme: "hlsl-dark",
        fontFamily: "'Cascadia Code', 'JetBrains Mono', 'Consolas', 'Courier New', monospace",
        fontSize: 18,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "off",
        renderLineHighlight: "all"
      });
      editor.onDidChangeModelContent(() => scheduleCompile(500));
      resolve();
    });
  });
  profileSel.addEventListener("change", () => scheduleCompile(0));
  entryInput.addEventListener("change", () => scheduleCompile(0));
  optSel.addEventListener("change", () => scheduleCompile(0));
  permalinkBtn.addEventListener("click", async () => {
    const hlsl = editor ? editor.getValue() : initialHlsl;
    const encoded = await compressCode(hlsl);
    const p = new URLSearchParams();
    p.set("c", encoded);
    const profile = profileSel.value;
    const entry = entryInput.value.trim() || "main";
    const opt = optSel.value;
    if (profile !== "ps_5_0") p.set("profile", profile);
    if (entry !== "main") p.set("entry", entry);
    if (opt !== "3") p.set("opt", opt);
    const url = `${location.origin}${location.pathname}?${p.toString()}`;
    await navigator.clipboard.writeText(url);
    permalinkBtn.textContent = "Copied";
    setTimeout(() => {
      permalinkBtn.textContent = "Copy permalink";
    }, 1500);
  });
  await monacoReady;
  await doCompile();
}
main().catch(console.error);
//# sourceMappingURL=bundle-fxc.js.map
