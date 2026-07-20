function parseStyleObj(styleStr) {
  try {
   let clean = styleStr
    return JSON.parse(clean);
  } catch (e) {
    // console.log("Gagal parse styleObj:", styleStr, e);
    return {};
  }
}

function stringifyStyleObj(styleObj) {
  return JSON.stringify(styleObj, null, 2); 
}

export { parseStyleObj, stringifyStyleObj }