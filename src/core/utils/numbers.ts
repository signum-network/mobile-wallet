/**
 * Replace scientific notation (if exists) to decimal and removes trailing zeros.
 * @param {number} amount
 * @param prefix AN optional prefix string
 */
export const amountToString = (
  amount: number,
  prefix: string | null = null,
): string => {
  const result = amount.toFixed(8).replace(/\.?0+$/, '');
  return prefix ? `${prefix} ${result}` : result;
};
