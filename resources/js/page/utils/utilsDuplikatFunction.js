function replaceTrailingNumber(str, newNum) {
    return str.replace(/\d+$/, String(newNum));
}

const deepClone = (o) => {
    if (typeof structuredClone === 'function') return structuredClone(o);
    return JSON.parse(JSON.stringify(o));
};

export { replaceTrailingNumber,deepClone }