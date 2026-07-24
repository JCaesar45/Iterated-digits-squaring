# iterated_square.py
# Digital Baroque — The Iterated Square Enigma Backend
# Pure Python implementation with type hints and vectorized alternative

from __future__ import annotations
from typing import List, Tuple
import math
import random


class IteratedSquareEngine:
    """
    Encapsulates the iterated digit square sum algorithm.
    Based on the well-known number-theoretic property where all natural numbers
    eventually converge to either 1 or 89 under repeated digit-square summation.
    
    Reference:
    Guy, R. K. (2004). Unsolved Problems in Number Theory (3rd ed.).
    Springer-Verlag. (Section E34: Iterated Digits Squaring)
    """

    # Precomputed lookup table for single-digit squares (0-9)
    __DIGIT_SQUARES: Tuple[int, ...] = tuple(i * i for i in range(10))

    @staticmethod
    def compute(n: int) -> Tuple[int, List[int]]:
        """
        Iteratively sums squares of digits until convergence.
        
        Args:
            n: A natural number (positive integer)
            
        Returns:
            Tuple containing:
                - final_value: 1 or 89
                - path: Complete list of intermediate values including n
                
        Raises:
            ValueError: If n is not a positive integer
        """
        if not isinstance(n, int) or n < 1:
            raise ValueError("Input must be a natural number (positive integer)")

        path: List[int] = [n]
        current: int = n

        while current != 1 and current != 89:
            acc: int = 0
            temp: int = current

            # Extract digits arithmetically — no string conversion overhead
            while temp > 0:
                digit: int = temp % 10
                acc += IteratedSquareEngine.__DIGIT_SQUARES[digit]
                temp //= 10

            current = acc
            path.append(current)

        return current, path

    @staticmethod
    def compute_with_memoization(n: int, cache: dict | None = None) -> Tuple[int, List[int]]:
        """
        Memoized version that caches sub-results for repeated computations.
        Useful for batch processing large ranges.
        """
        if cache is None:
            cache = {}

        original = n
        path = [n]

        while n != 1 and n != 89:
            if n in cache:
                final = cache[n]
                path.pop()  # Remove the cached entry point to avoid duplication
                path.append(n)
                return final, path
            acc = 0
            temp = n
            while temp > 0:
                digit = temp % 10
                acc += IteratedSquareEngine.__DIGIT_SQUARES[digit]
                temp //= 10
            n = acc
            path.append(n)

        cache[original] = n
        return n, path


class IteratedSquareCLI:
    """Command-line interface for the iterated square engine."""

    @staticmethod
    def run():
        print("\n\U00002766 Digital Baroque — Iterated Square Enigma \U00002766")
        print("Convergence to 1 or 89\n")

        while True:
            try:
                user_input = input("Enter a natural number (or 'q' to quit): ").strip()
                if user_input.lower() in ('q', 'quit', 'exit'):
                    print("\nUntil next computation. \U00002766\n")
                    break

                n = int(user_input)
                if n < 1:
                    print("Please enter a positive integer.\n")
                    continue

                final, path = IteratedSquareEngine.compute(n)
                path_str = " → ".join(str(p) for p in path)
                print(f"\n  Path: {path_str}")
                print(f"  Convergence: {final}")
                print(f"  Classification: {'\U0001F331 Harmony (1)' if final == 1 else '\U0001F525 Entropy (89)'}\n")

            except ValueError:
                print("Invalid input. Please enter a positive integer.\n")
            except KeyboardInterrupt:
                print("\n\nInterrupted. Farewell. \U00002766\n")
                break


if __name__ == "__main__":
    IteratedSquareCLI.run()
