function jsonParse(jsonString: string): string {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Error parsing JSON: ${error}`);
    return '';
  }
}

export {jsonParse};
