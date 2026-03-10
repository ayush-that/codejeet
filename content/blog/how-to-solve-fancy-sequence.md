---
title: "How to Solve Fancy Sequence — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Fancy Sequence. Hard difficulty, 18.6% acceptance rate. Topics: Math, Design, Segment Tree."
date: "2030-02-28"
category: "dsa-patterns"
tags: ["fancy-sequence", "math", "design", "segment-tree", "hard"]
---

# How to Solve Fancy Sequence

This problem asks us to implement a sequence that supports appending values and applying bulk addition and multiplication operations to all existing elements. The challenge comes from needing to efficiently handle up to 10⁵ operations while maintaining the ability to retrieve values at any index. Directly updating each element on every operation would be too slow, so we need a mathematical approach to defer operations.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Operations: append(2), append(3), addAll(5), multAll(2), getIndex(0)
```

**Step-by-step thinking:**

1. Start with empty sequence: `[]`
2. `append(2)` → Sequence: `[2]`
3. `append(3)` → Sequence: `[2, 3]`
4. `addAll(5)` → Instead of updating each element to `[7, 8]`, we note that all elements need `+5`
5. `multAll(2)` → Now we need to apply `(x + 5) * 2` to all elements
6. `getIndex(0)` → For the first element (2), we compute `(2 + 5) * 2 = 14`

The key insight: Instead of modifying each element, we can track the cumulative operations as a linear transformation `ax + b`, where `a` is the multiplier and `b` is the adder. Each `multAll(m)` updates `a = a * m` and `b = b * m`. Each `addAll(inc)` updates `b = b + inc`.

When we append a value `val`, we need to store it in its "original" form, not after applying current operations. But when we retrieve it later, we need to apply all operations that happened after it was appended.

## Brute Force Approach

The naive approach would store all values in an array and update every element on each `addAll` or `multAll`:

```python
class Fancy:
    def __init__(self):
        self.arr = []

    def append(self, val):
        self.arr.append(val)

    def addAll(self, inc):
        for i in range(len(self.arr)):
            self.arr[i] += inc

    def multAll(self, m):
        for i in range(len(self.arr)):
            self.arr[i] *= m

    def getIndex(self, idx):
        if idx >= len(self.arr):
            return -1
        return self.arr[idx] % (10**9 + 7)
```

**Why this fails:**

- Each `addAll` or `multAll` takes O(n) time
- With up to 10⁵ operations, worst-case time becomes O(10¹⁰) operations
- This will absolutely time out in any reasonable constraints

## Optimized Approach

The mathematical insight saves us: operations are linear transformations of the form `f(x) = ax + b`. We can compose these transformations:

1. **Initial state**: `a = 1, b = 0` (identity transformation: `f(x) = x`)
2. **multAll(m)**: New transformation is `f'(x) = m * (ax + b) = (m*a)x + (m*b)`
   - So update: `a = (a * m) % MOD`, `b = (b * m) % MOD`
3. **addAll(inc)**: New transformation is `f'(x) = (ax + b) + inc = ax + (b + inc)`
   - So update: `b = (b + inc) % MOD`

When we append a value `val`, we need to store it in a form that, when we apply the current transformation to it later, gives the correct result. But there's a catch: the transformation at append time is different from the transformation at query time.

**Solution**: Store each value as if it were transformed by the _inverse_ of the current transformation. Then, when we query, we apply the _current_ transformation to get the correct value.

Mathematically, if current transformation is `T = ax + b`, and we append value `v`, we store `v'` such that `T(v') = v`. Solving: `a*v' + b = v` ⇒ `v' = (v - b) * a⁻¹ mod MOD`.

We need modular inverse for division, which we can compute using Fermat's Little Theorem since MOD is prime.

## Optimal Solution

We maintain:

1. `values`: List of stored values (in "inverse-transformed" form)
2. `mult` and `add`: Current transformation coefficients
3. `inv_mult`: Modular inverse of current multiplier (for appending new values)

<div class="code-group">

```python
MOD = 10**9 + 7

class Fancy:
    # Time: O(1) for all operations | Space: O(n) for stored values
    def __init__(self):
        self.values = []          # Store values in "base" form
        self.mult = 1            # Current multiplier 'a'
        self.add = 0             # Current adder 'b'
        # Store modular inverses for each multiplier we've seen
        # This avoids recomputing modular inverses repeatedly
        self.inv_mult = 1        # Modular inverse of current multiplier

    def append(self, val: int) -> None:
        # Convert val to base form: val' = (val - add) * inv_mult % MOD
        # This ensures when we apply current transformation to val',
        # we get back the original val
        base_val = (val - self.add + MOD) % MOD
        base_val = (base_val * self.inv_mult) % MOD
        self.values.append(base_val)

    def addAll(self, inc: int) -> None:
        # Update transformation: f'(x) = mult*x + (add + inc)
        self.add = (self.add + inc) % MOD

    def multAll(self, m: int) -> None:
        # Update transformation: f'(x) = (mult*m)*x + (add*m)
        self.mult = (self.mult * m) % MOD
        self.add = (self.add * m) % MOD
        # Update modular inverse using Fermat's Little Theorem
        self.inv_mult = (self.inv_mult * pow(m, MOD-2, MOD)) % MOD

    def getIndex(self, idx: int) -> int:
        if idx >= len(self.values):
            return -1
        # Apply current transformation to stored base value
        # result = mult * base_val + add
        result = (self.mult * self.values[idx] + self.add) % MOD
        return result
```

```javascript
const MOD = 10 ** 9 + 7;

class Fancy {
  // Time: O(1) for all operations | Space: O(n) for stored values
  constructor() {
    this.values = []; // Store values in "base" form
    this.mult = 1; // Current multiplier 'a'
    this.add = 0; // Current adder 'b'
    this.invMult = 1; // Modular inverse of current multiplier
  }

  append(val) {
    // Convert val to base form: val' = (val - add) * invMult % MOD
    let baseVal = (val - this.add + MOD) % MOD;
    baseVal = (baseVal * this.invMult) % MOD;
    this.values.push(baseVal);
  }

  addAll(inc) {
    // Update transformation: f'(x) = mult*x + (add + inc)
    this.add = (this.add + inc) % MOD;
  }

  multAll(m) {
    // Update transformation: f'(x) = (mult*m)*x + (add*m)
    this.mult = (this.mult * m) % MOD;
    this.add = (this.add * m) % MOD;
    // Update modular inverse using Fermat's Little Theorem
    this.invMult = (this.invMult * this.modPow(m, MOD - 2)) % MOD;
  }

  getIndex(idx) {
    if (idx >= this.values.length) return -1;
    // Apply current transformation to stored base value
    const result = (this.mult * this.values[idx] + this.add) % MOD;
    return result;
  }

  // Helper function for modular exponentiation
  modPow(base, exp) {
    let result = 1;
    base %= MOD;
    while (exp > 0) {
      if (exp & 1) result = (result * base) % MOD;
      base = (base * base) % MOD;
      exp >>= 1;
    }
    return result;
  }
}
```

```java
class Fancy {
    // Time: O(1) for all operations | Space: O(n) for stored values
    private static final int MOD = 1_000_000_007;
    private List<Long> values;  // Store values in "base" form
    private long mult;          // Current multiplier 'a'
    private long add;           // Current adder 'b'
    private long invMult;       // Modular inverse of current multiplier

    public Fancy() {
        values = new ArrayList<>();
        mult = 1;
        add = 0;
        invMult = 1;
    }

    public void append(int val) {
        // Convert val to base form: val' = (val - add) * invMult % MOD
        long baseVal = (val - add + MOD) % MOD;
        baseVal = (baseVal * invMult) % MOD;
        values.add(baseVal);
    }

    public void addAll(int inc) {
        // Update transformation: f'(x) = mult*x + (add + inc)
        add = (add + inc) % MOD;
    }

    public void multAll(int m) {
        // Update transformation: f'(x) = (mult*m)*x + (add*m)
        mult = (mult * m) % MOD;
        add = (add * m) % MOD;
        // Update modular inverse using Fermat's Little Theorem
        invMult = (invMult * modInverse(m)) % MOD;
    }

    public int getIndex(int idx) {
        if (idx >= values.size()) return -1;
        // Apply current transformation to stored base value
        long result = (mult * values.get(idx) + add) % MOD;
        return (int) result;
    }

    // Modular exponentiation for inverse calculation
    private long modPow(long base, long exp) {
        long result = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1) == 1) result = (result * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return result;
    }

    // Modular inverse using Fermat's Little Theorem
    private long modInverse(long x) {
        return modPow(x, MOD - 2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `append()`, `addAll()`, `multAll()`, `getIndex()`: All O(1) operations
- The modular exponentiation in `multAll()` is O(log MOD), but since MOD is constant (10⁹+7), this is effectively O(1)
- Total for n operations: O(n)

**Space Complexity:**

- O(n) where n is the number of appended values
- We store each value in the `values` list
- Constant extra space for transformation coefficients

## Common Mistakes

1. **Forgetting modular arithmetic**: Not applying `% MOD` after each operation can cause integer overflow. Remember to mod after every addition and multiplication.

2. **Incorrect inverse calculation**: When computing `(val - add) * inv_mult`, candidates often forget to handle negative values properly. Use `(val - add + MOD) % MOD` to ensure non-negative results.

3. **Not updating inverse on multAll**: When multiplying the transformation, we must also update the modular inverse. The inverse of `(a*m)` is `inv(a) * inv(m)`, not `inv(a) / m`.

4. **Applying transformations in wrong order**: Remember that operations compose from left to right. If we do `addAll(5)` then `multAll(2)`, the transformation is `2*(x + 5) = 2x + 10`, not `(2x) + 5`.

## When You'll See This Pattern

This "deferred operation" pattern appears in problems where you need to apply bulk operations efficiently:

1. **Range Update Problems** (like LeetCode 370, 1094): Instead of updating each element, track the net effect at boundaries.
2. **Lazy Propagation in Segment Trees**: Similar concept of deferring updates until needed.
3. **Mathematical Sequence Problems**: Where operations have mathematical properties (associativity, distributivity) that allow composition.

Specifically related problems:

- **LeetCode 1622: Fancy Sequence** (this problem)
- **LeetCode 370: Range Addition** (uses difference array for bulk adds)
- **LeetCode 699: Falling Squares** (segment tree with lazy propagation)

## Key Takeaways

1. **Look for mathematical structure**: When operations are linear (addition, multiplication), they can be composed into a single transformation, avoiding per-element updates.

2. **Defer computation when possible**: Store values in a "canonical" form and apply transformations only when needed. This is especially useful when queries are interleaved with updates.

3. **Modular arithmetic requires care**: With prime modulus, use modular inverses for division. Always handle negative values by adding MOD before taking remainder.

[Practice this problem on CodeJeet](/problem/fancy-sequence)
