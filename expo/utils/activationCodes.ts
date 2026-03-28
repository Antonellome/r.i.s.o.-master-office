export const generateActivationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 9; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export const isValidActivationCode = (code: string): boolean => {
  return /^[A-Z0-9]{9}$/.test(code);
};

export const formatActivationCode = (code: string): string => {
  if (code.length !== 9) return code;
  return `${code.slice(0, 3)}-${code.slice(3, 6)}-${code.slice(6, 9)}`;
};

export const unformatActivationCode = (formatted: string): string => {
  return formatted.replace(/-/g, '').toUpperCase();
};
