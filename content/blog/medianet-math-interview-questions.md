---
title: "Math Questions at Media.net: What to Expect"
description: "Prepare for Math interview questions at Media.net — patterns, difficulty breakdown, and study tips."
date: "2030-07-05"
category: "dsa-patterns"
tags: ["medianet", "math", "interview prep"]
---

## Why Math Matters at Media.net

Media.net’s coding assessment includes 5 Math-focused questions out of 33 total. That’s roughly 15% of the test, a significant chunk that can make or break your score. Unlike some companies where math problems are rare curveballs, Media.net consistently includes them as a core screening mechanism. Why? Their business revolves around ad tech, real-time bidding, and optimization algorithms—domains deeply rooted in probability, combinatorics, modular arithmetic, and number theory. If you can’t reason mathematically about efficiency and edge cases, you’ll struggle with their real-world problems. In live interviews, math questions often appear in the first technical phone screen, testing your analytical clarity before you ever touch a system design question. Don’t treat this as a secondary topic; it’s a primary filter.

## Specific Patterns Media.net Favors

Media.net’s math problems lean heavily into **computational number theory** and **combinatorial counting**. You won’t see much calculus or linear algebra—instead, expect problems that feel like algorithm puzzles with a mathematical core. Their favorite patterns include:

1. **Modular Arithmetic and Multiples**: Problems involving remainders, divisibility, or cycling through modular results. Think "find the smallest number divisible by all numbers from 1 to n" or "count numbers in a range divisible by a or b."
2. **Combinatorial Formulas with Constraints**: Counting ways to arrange, select, or partition items under specific rules, often requiring you to derive a formula rather than simulate.
3. **Prime Factorization and Divisors**: Using the uniqueness of prime factorization to solve problems about divisors, GCD, LCM, or Euler’s Totient function.
4. **Digit-Based Math**: Manipulating digits of numbers, checking palindromes in numerical form, or working in different bases.

They avoid heavy graph theory or dynamic programming in their math section—those appear elsewhere in the test. The math problems are designed to be solvable with clever reasoning, not brute force.

## How to Prepare

Your preparation should focus on deriving closed-form solutions. Brute force will often time out. Let’s look at a classic pattern: counting numbers divisible by a set of numbers using inclusion-exclusion. This is a staple at Media.net.

<div class="code-group">

```python
# Problem: Count numbers from 1 to n divisible by any of the numbers in a list 'arr'
# Example: n=100, arr=[2,3] -> numbers divisible by 2 or 3
# Time: O(2^m) where m = len(arr) | Space: O(m) for recursion depth
def count_divisible(n, arr):
    def dfs(idx, current_lcm, sign):
        if idx == len(arr):
            if current_lcm == 1:  # empty set
                return 0
            return sign * (n // current_lcm)
        # Include current element
        include = dfs(idx + 1, lcm(current_lcm, arr[idx]), -sign)
        # Exclude current element
        exclude = dfs(idx + 1, current_lcm, sign)
        return include + exclude

    # Helper for LCM
    def lcm(a, b):
        return a * b // gcd(a, b)

    def gcd(a, b):
        while b:
            a, b = b, a % b
        return a

    return dfs(0, 1, -1)  # Start with sign = -1 for inclusion-exclusion

# Example usage: count numbers up to 100 divisible by 2 or 3
print(count_divisible(100, [2, 3]))  # Output: 67
```

```javascript
// Time: O(2^m) | Space: O(m) for recursion
function countDivisible(n, arr) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);

  function dfs(idx, currentLcm, sign) {
    if (idx === arr.length) {
      if (currentLcm === 1) return 0;
      return sign * Math.floor(n / currentLcm);
    }
    const include = dfs(idx + 1, lcm(currentLcm, arr[idx]), -sign);
    const exclude = dfs(idx + 1, currentLcm, sign);
    return include + exclude;
  }

  return dfs(0, 1, -1);
}

console.log(countDivisible(100, [2, 3])); // 67
```

```java
// Time: O(2^m) | Space: O(m)
public class CountDivisible {
    public static int countDivisible(int n, int[] arr) {
        return dfs(0, 1, -1, n, arr);
    }

    private static int dfs(int idx, long currentLcm, int sign, int n, int[] arr) {
        if (idx == arr.length) {
            if (currentLcm == 1) return 0;
            return sign * (int)(n / currentLcm);
        }
        long newLcm = lcm(currentLcm, arr[idx]);
        int include = dfs(idx + 1, newLcm, -sign, n, arr);
        int exclude = dfs(idx + 1, currentLcm, sign, n, arr);
        return include + exclude;
    }

    private static long gcd(long a, long b) {
        while (b != 0) {
            long temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    private static long lcm(long a, long b) {
        return a * b / gcd(a, b);
    }

    public static void main(String[] args) {
        System.out.println(countDivisible(100, new int[]{2, 3})); // 67
    }
}
```

</div>

Another common pattern is using prime factorization to count divisors efficiently. Here’s how you compute the number of divisors for a given number.

<div class="code-group">

```python
# Problem: Count the number of divisors of n
# Example: n=12 -> divisors: 1,2,3,4,6,12 -> output 6
# Time: O(sqrt(n)) | Space: O(1)
def count_divisors(n):
    count = 0
    i = 1
    while i * i <= n:
        if n % i == 0:
            count += 1
            if i != n // i:  # avoid double-count for perfect squares
                count += 1
        i += 1
    return count

print(count_divisors(12))  # Output: 6
```

```javascript
// Time: O(sqrt(n)) | Space: O(1)
function countDivisors(n) {
  let count = 0;
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      count++;
      if (i !== n / i) count++;
    }
  }
  return count;
}

console.log(countDivisors(12)); // 6
```

```java
// Time: O(sqrt(n)) | Space: O(1)
public class CountDivisors {
    public static int countDivisors(int n) {
        int count = 0;
        for (int i = 1; i * i <= n; i++) {
            if (n % i == 0) {
                count++;
                if (i != n / i) count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countDivisors(12)); // 6
    }
}
```

</div>

## How Media.net Tests Math vs Other Companies

At companies like Google or Meta, math questions are often embedded within algorithmic problems (e.g., probability in a randomized algorithm, or combinatorics in a backtracking problem). At Media.net, math stands alone—it’s tested directly and purely. The difficulty is intermediate: harder than typical online assessment trivia but easier than Math Olympiad problems. What’s unique is their emphasis on **computational efficiency within mathematical reasoning**. They’ll give constraints where an O(n) solution fails, pushing you to find the O(log n) or O(1) formula. For example, while another company might ask you to simulate a process, Media.net will ask you to derive the closed-form result of that simulation. This tests your ability to move from concrete examples to general principles—a key skill for optimizing ad delivery systems.

## Study Order

1. **Basic Number Properties**: Divisibility rules, prime numbers, GCD/LCM. This is foundational for almost all their problems.
2. **Modular Arithmetic**: Understand modulo operations, cyclic patterns, and solving equations like `(a * b) % mod`. Many problems reduce to finding remainders efficiently.
3. **Prime Factorization**: Learn to factor numbers and use the factorization to compute divisors, GCD, LCM, or Euler’s Totient function.
4. **Combinatorial Counting**: Master inclusion-exclusion, permutations, combinations, and the “stars and bars” method. Practice deriving formulas instead of simulating.
5. **Digit Manipulation**: Work with digits in different bases, palindrome numbers, and digit sum problems. This often involves modular arithmetic as well.
6. **Optimization and Closed Forms**: Practice turning iterative processes into direct formulas. This is the culmination of all the above topics.

This order works because each topic builds on the previous. You can’t do inclusion-exclusion without understanding LCM, and you can’t optimize divisor counts without prime factorization.

## Recommended Practice Order

1. **LeetCode 204. Count Primes** – introduces the Sieve of Eratosthenes, a key prime-finding technique.
2. **LeetCode 365. Water and Jug Problem** – a classic GCD application disguised as a puzzle.
3. **LeetCode 223. Rectangle Area** – involves mathematical area calculation with overlap, testing clean formula derivation.
4. **LeetCode 357. Count Numbers with Unique Digits** – combinatorial counting with constraints.
5. **LeetCode 400. Nth Digit** – digit-based math requiring you to find patterns without iterating through all numbers.
6. **LeetCode 172. Factorial Trailing Zeroes** – a clever problem about counting factors of 5, teaching you to think in terms of prime factors.
7. **LeetCode 1015. Smallest Integer Divisible by K** – pure modular arithmetic with cycle detection.
8. **LeetCode 780. Reaching Points** – a harder problem that uses GCD and modulo to reverse-engineer a process.

Solve these in sequence—they gradually increase in complexity and cover the exact patterns Media.net uses.

[Practice Math at Media.net](/company/medianet/math)
