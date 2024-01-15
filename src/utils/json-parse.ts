function jsonParse(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Error parsing JSON: ${error}`);
    return null;
  }
}

export {jsonParse};
