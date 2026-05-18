'use strict';

export const parseJsonFields = (fields = []) => (req, _res, next) => {
  if (!req.body) {
    return next();
  }

  fields.forEach((field) => {
    const value = req.body[field];
    if (typeof value !== 'string') {
      return;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    if (trimmed === 'null') {
      req.body[field] = null;
      return;
    }

    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        req.body[field] = JSON.parse(trimmed);
      } catch (_error) {
        // Keep original string so validators can report a clear error.
      }
    }
  });

  return next();
};
