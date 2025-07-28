import _Ajv from "ajv";
import _addFormats from "ajv-formats";

// ajv and ajv-formats dont have module.exports, so we need to cast them to the default export
const Ajv = _Ajv as unknown as typeof _Ajv.default;
const addFormats = _addFormats as unknown as typeof _addFormats.default;

const ajv = new Ajv();
addFormats(ajv);

export default ajv;