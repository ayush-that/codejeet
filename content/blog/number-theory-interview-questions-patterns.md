---
title: "Number Theory Interview Questions: Patterns and Strategies"
description: "Master Number Theory problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-22"
category: "dsa-patterns"
tags: ["number-theory", "dsa", "interview prep"]
---

# Number Theory Interview Questions: Patterns and Strategies

You're solving a seemingly straightforward problem about counting numbers divisible by certain values, maybe something like "Count numbers from 1 to n divisible by a or b." You think, "Easy — just loop and check." You write a clean O(n) solution. The interviewer nods, then asks: "Can you do it in O(1) time?" That's when you realize you're not dealing with a simple iteration problem — you're facing a number theory question.

Number theory appears in about 69 LeetCode problems, with a surprising distribution: only 14% easy, 42% medium, and a whopping 43% hard. This tells you something important: when interviewers ask number theory questions, they're usually testing deeper mathematical insight, not just coding ability. Companies like Google, Amazon, and Meta love these problems because they separate candidates who can recognize mathematical patterns from those who just brute force solutions.

## Common Patterns

### 1. Modular Arithmetic and Cycle Detection

Many number theory problems involve remainders, cycles, or patterns that repeat. The key insight is that when you're dealing with remainders modulo n, there are only n possible values (0 through n-1). Once you see a remainder you've seen before, you've found a cycle.

Consider **Happy Number (#202)**. The naive approach would be to keep calculating sums of squares of digits until you either reach 1 or get stuck in a loop. But how do you detect the loop efficiently? That's where Floyd's cycle detection (tortoise and hare) meets modular arithmetic.

<div class="code-group">

```python
def isHappy(n: int) -> bool:
    def get_next(num):
        total = 0
        while num > 0:
            num, digit = divmod(num, 10)
            total += digit ** 2
        return total

    slow = n
    fast = get_next(n)

    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))

    return fast == 1

# Time: O(log n) | Space: O(1)
# The time complexity is tricky: each step reduces n significantly,
# and cycle detection ensures we don't loop indefinitely.
```

```javascript
function isHappy(n) {
  const getNext = (num) => {
    let total = 0;
    while (num > 0) {
      const digit = num % 10;
      num = Math.floor(num / 10);
      total += digit * digit;
    }
    return total;
  };

  let slow = n;
  let fast = getNext(n);

  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  }

  return fast === 1;
}

// Time: O(log n) | Space: O(1)
// Using Floyd's algorithm avoids the O(n) space of a hash set.
```

```java
public boolean isHappy(int n) {
    int slow = n;
    int fast = getNext(n);

    while (fast != 1 && slow != fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }

    return fast == 1;
}

private int getNext(int n) {
    int total = 0;
    while (n > 0) {
        int digit = n % 10;
        n = n / 10;
        total += digit * digit;
    }
    return total;
}

// Time: O(log n) | Space: O(1)
// The mathematical insight: all numbers either reach 1 or enter cycle {4,16,37,58,89,145,42,20,4}
```

</div>

Other problems using this pattern: **Add Digits (#258)** (digital root), **Bulb Switcher (#319)** (perfect squares).

### 2. Prime Factorization and Divisors

When a problem involves divisibility, greatest common divisors (GCD), or least common multiples (LCM), prime factorization is often the key. The fundamental theorem of arithmetic states that every integer greater than 1 can be uniquely represented as a product of prime numbers.

For **Ugly Number (#263)**, you need to check if a number's prime factors are limited to 2, 3, and 5. Instead of finding all prime factors, you can repeatedly divide by 2, 3, and 5 until you can't anymore, then check if what remains is 1.

<div class="code-group">

```python
def isUgly(n: int) -> bool:
    if n <= 0:
        return False

    for prime in [2, 3, 5]:
        while n % prime == 0:
            n //= prime

    return n == 1

# Time: O(log n) | Space: O(1)
# Each division reduces n significantly, making this much faster
# than checking all possible divisors.
```

```javascript
function isUgly(n) {
  if (n <= 0) return false;

  [2, 3, 5].forEach((prime) => {
    while (n % prime === 0) {
      n = Math.floor(n / prime);
    }
  });

  return n === 1;
}

// Time: O(log n) | Space: O(1)
// The key insight: keep dividing by allowed primes until you can't.
```

```java
public boolean isUgly(int n) {
    if (n <= 0) return false;

    int[] primes = {2, 3, 5};
    for (int prime : primes) {
        while (n % prime == 0) {
            n /= prime;
        }
    }

    return n == 1;
}

// Time: O(log n) | Space: O(1)
// Compare with O(√n) approach of checking all divisors up to sqrt(n).
```

</div>

Related problems: **Count Primes (#204)** (Sieve of Eratosthenes), **Perfect Squares (#279)** (Lagrange's four-square theorem).

### 3. Euclidean Algorithm for GCD

The Euclidean algorithm is one of the oldest algorithms still in common use. It's based on the principle that gcd(a, b) = gcd(b, a mod b). This recursive relationship allows us to compute GCD in O(log min(a, b)) time.

For **Water and Jug Problem (#365)**, you need to determine if you can measure exactly z liters using two jugs of capacities x and y. The mathematical insight (Bézout's identity): this is possible if and only if z is a multiple of gcd(x, y).

<div class="code-group">

```python
def canMeasureWater(jug1Capacity: int, jug2Capacity: int, targetCapacity: int) -> bool:
    if targetCapacity > jug1Capacity + jug2Capacity:
        return False

    def gcd(a, b):
        while b:
            a, b = b, a % b
        return a

    return targetCapacity % gcd(jug1Capacity, jug2Capacity) == 0

# Time: O(log(min(x, y))) | Space: O(1)
# The Euclidean algorithm beats the O(x+y) BFS approach dramatically.
```

```javascript
function canMeasureWater(jug1Capacity, jug2Capacity, targetCapacity) {
  if (targetCapacity > jug1Capacity + jug2Capacity) return false;

  const gcd = (a, b) => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  return targetCapacity % gcd(jug1Capacity, jug2Capacity) === 0;
}

// Time: O(log(min(x, y))) | Space: O(1)
// Mathematical insight beats simulation for large capacities.
```

```java
public boolean canMeasureWater(int jug1Capacity, int jug2Capacity, int targetCapacity) {
    if (targetCapacity > jug1Capacity + jug2Capacity) return false;

    return targetCapacity % gcd(jug1Capacity, jug2Capacity) == 0;
}

private int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Time: O(log(min(x, y))) | Space: O(1)
// The BFS approach would be O(x*y) — impossible for large capacities.
```

</div>

Other applications: **Fraction Addition and Subtraction (#592)**, **Simplify Path (#71)** (indirectly).

## When to Use Number Theory vs Alternatives

Recognizing when a problem requires number theory is half the battle. Here are decision criteria:

1. **Look for divisibility language**: Words like "divisible by," "multiple of," "remainder," "factor," or "prime" are dead giveaways.

2. **Check for mathematical constraints**: If the input range is huge (up to 10^9 or more), you probably can't iterate through all numbers. You need a mathematical formula.

3. **Watch for pattern questions**: Problems asking about sequences, cycles, or repeating patterns often have number theory solutions.

4. **Consider the alternative costs**:
   - If a brute force solution would be O(n) but n can be up to 10^9, you need number theory.
   - If a graph/BFS approach would have O(n²) states, look for a mathematical reduction.
   - If dynamic programming would use O(n) space with large n, there's probably a formula.

Example: For **Count Primes (#204)**, the naive O(n√n) approach fails for n=10^7. The Sieve of Eratosthenes (O(n log log n)) works, but even that uses O(n) space. For interview purposes, the sieve is usually acceptable.

## Edge Cases and Gotchas

1. **Zero and negative numbers**: Many number theory algorithms assume positive integers. Always check:
   - Division by zero
   - Negative inputs to gcd (take absolute values)
   - Zero as a multiple (0 is divisible by any number except 0)

2. **Integer overflow**: When dealing with large numbers or multiplication:

   ```python
   # Python handles big integers, but Java/JavaScript don't
   # In Java, use long or BigInteger for intermediate results
   ```

3. **Off-by-one in ranges**: Problems like "numbers from 1 to n" vs "0 to n-1" matter. Example: In **Bulb Switcher (#319)**, bulbs are numbered from 1 to n, not 0 to n-1.

4. **Special cases for 1 and 2**: 1 is neither prime nor composite. 2 is the only even prime. These often need separate handling.

5. **Floating point precision**: Never use floating point for divisibility checks. Use integer modulo operations instead.

## Difficulty Breakdown

The 69 number theory questions break down as:

- **Easy (10 problems)**: Focus on basic concepts like prime checking, simple divisibility, or digital root. These test if you know the fundamentals.
- **Medium (29 problems)**: Combine number theory with other patterns (like cycle detection in Happy Number) or require implementing algorithms like Sieve of Eratosthenes.
- **Hard (30 problems)**: Require deep mathematical insights, often reducing seemingly complex problems to simple formulas.

**Study prioritization**: Start with easy problems to build intuition. Then tackle medium problems — these are most likely in interviews. Save hard problems for last, focusing on patterns rather than memorizing solutions.

## Which Companies Ask Number Theory

- **Google** (/company/google): Loves mathematical puzzles and efficient algorithms. Expect problems like **Ugly Number** series or **Perfect Squares**.
- **Amazon** (/company/amazon): Often asks practical number theory, like **Fraction to Recurring Decimal (#166)** in financial contexts.
- **Microsoft** (/company/microsoft): Favors problems combining number theory with other concepts, like **Happy Number** or **Excel Sheet Column Title (#168)**.
- **Bloomberg** (/company/bloomberg): Asks number theory in financial mathematics contexts — divisibility, remainders, and modulo arithmetic.
- **Meta** (/company/meta): Leans toward cycle detection problems and mathematical optimizations for large datasets.

Each company has a style: Google tests mathematical insight, Amazon tests practical application, Microsoft tests pattern recognition, Bloomberg tests precision with edge cases, and Meta tests optimization.

## Study Tips

1. **Learn the theorems, not just the code**: Understand why the Euclidean algorithm works, why the sieve is efficient, and what Bézout's identity means. Interviewers often ask for explanations.

2. **Practice mental calculation**: Get comfortable with modular arithmetic, especially modulo 10 (for digits) and modulo small primes.

3. **Recommended problem order**:
   - Start with **Count Primes (#204)** to learn Sieve of Eratosthenes
   - Then **Happy Number (#202)** for cycle detection
   - Move to **Ugly Number II (#264)** for dynamic programming with number theory
   - Finish with **Water and Jug Problem (#365)** for the Euclidean algorithm application

4. **Create a cheat sheet**: Write down key formulas:
   - gcd(a, b) = gcd(b, a mod b)
   - lcm(a, b) = a × b / gcd(a, b)
   - Digital root: dr(n) = 0 if n=0, else 1 + ((n-1) mod 9)
   - Sum of 1 to n: n(n+1)/2

Number theory questions test your ability to see through the computational complexity to the underlying mathematical structure. When you encounter a problem with huge constraints or divisibility conditions, pause and ask: "What's the mathematical insight here?" That shift in perspective is what separates adequate solutions from elegant ones.

[Practice all Number Theory questions on CodeJeet](/topic/number-theory)
