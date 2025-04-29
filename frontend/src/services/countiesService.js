const mockCountries = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Australia', code: 'AU' },
  { name: 'India', code: 'AU' },
];

export const getCountries = async () => {
  try {
    return mockCountries;
  } catch (error) {
    throw error;
  }
};
