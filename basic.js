function iteratedSquare(n) {
  // Keep going until we reach 1 or 89
  while (n !== 1 && n !== 89) {
    // Convert to string to extract each digit, square it, and sum
    n = n.toString()
         .split('')
         .reduce((sum, digit) => sum + Math.pow(parseInt(digit), 2), 0);
  }
  return n;
}
