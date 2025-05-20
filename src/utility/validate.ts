export function assertAndManipulateObjectSchema(object, schema, defaultValues = {}) {
    const missingProperties = Object.keys(schema).filter(property => !(property in object));
    // Manipulate the object by adding missing properties with default values
    missingProperties.forEach(property => {
      object[property] = defaultValues[property] !== undefined ? defaultValues[property] : "-";
    });
  
    return object;
  }
  