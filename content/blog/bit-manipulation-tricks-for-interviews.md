---
title: "Bit Manipulation Tricks You Should Know for Interviews"
description: "XOR tricks, bit counting, power of two checks — practical bit manipulation techniques that come up in coding interviews."
date: "2026-08-09"
category: "tips"
tags: ["bit manipulation", "XOR", "algorithms", "interview prep"]
---

Bit manipulation is niche, but it shows up just often enough that you need the fundamentals. The good news: the set of tricks is small and learnable.

## Essential Bit Operations

- **AND (`&`):** Both bits must be 1. Masking and clearing bits.
- **OR (`|`):** At least one bit is 1. Setting bits.
- **XOR (`^`):** Bits must differ. Toggling bits, finding unique elements.
- **NOT (`~`):** Flips all bits.
- **Left shift (`<<`):** Multiply by 2.
- **Right shift (`>>`):** Divide by 2.

Let's see these operations in action with some fundamental examples.

<div class="code-group">

```python
# Python Examples
n = 5  # Binary: 0101
m = 3  # Binary: 0011

print(f"n & m = {n & m}")  # 0101 & 0011 = 0001 (1)
print(f"n | m = {n | m}")  # 0101 | 0011 = 0111 (7)
print(f"n ^ m = {n ^ m}")  # 0101 ^ 0011 = 0110 (6)
print(f"~n = {~n}")        # ~0101 = ...11111010 (-6) in two's complement
print(f"n << 1 = {n << 1}") # 0101 << 1 = 1010 (10)
print(f"n >> 1 = {n >> 1}") # 0101 >> 1 = 0010 (2)
```

```javascript
// JavaScript Examples
let n = 5; // Binary: 0101
let m = 3; // Binary: 0011

console.log(`n & m = ${n & m}`); // 0101 & 0011 = 0001 (1)
console.log(`n | m = ${n | m}`); // 0101 | 0011 = 0111 (7)
console.log(`n ^ m = ${n ^ m}`); // 0101 ^ 0011 = 0110 (6)
console.log(`~n = ${~n}`); // ~0101 = ...11111010 (-6) in two's complement
console.log(`n << 1 = ${n << 1}`); // 0101 << 1 = 1010 (10)
console.log(`n >> 1 = ${n >> 1}`); // 0101 >> 1 = 0010 (2)
```

```java
// Java Examples
public class BitOps {
    public static void main(String[] args) {
        int n = 5;  // Binary: 0101
        int m = 3;  // Binary: 0011

        System.out.println("n & m = " + (n & m));  // 0101 & 0011 = 0001 (1)
        System.out.println("n | m = " + (n | m));  // 0101 | 0011 = 0111 (7)
        System.out.println("n ^ m = " + (n ^ m));  // 0101 ^ 0011 = 0110 (6)
        System.out.println("~n = " + (~n));        // ~0101 = ...11111010 (-6) in two's complement
        System.out.println("n << 1 = " + (n << 1)); // 0101 << 1 = 1010 (10)
        System.out.println("n >> 1 = " + (n >> 1)); // 0101 >> 1 = 0010 (2)
    }
}
```

</div>

## XOR: The Interview Workhorse

Three key properties: `x ^ x = 0`, `x ^ 0 = x`, and XOR is commutative/associative.

**Single Number:** Every element appears twice except one. XOR all elements -- pairs cancel, leaving the unique one. O(n) time, O(1) space.

<div class="code-group">

```python
def singleNumber(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

# Example: [4, 1, 2, 1, 2]
# 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ 0 ^ 0 = 4
print(singleNumber([4, 1, 2, 1, 2]))  # Output: 4
```

```javascript
function singleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num;
  }
  return result;
}

// Example: [4, 1, 2, 1, 2]
// 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ 0 ^ 0 = 4
console.log(singleNumber([4, 1, 2, 1, 2])); // Output: 4
```

```java
public class SingleNumber {
    public static int singleNumber(int[] nums) {
        int result = 0;
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }

    public static void main(String[] args) {
        // Example: [4, 1, 2, 1, 2]
        // 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ 0 ^ 0 = 4
        System.out.println(singleNumber(new int[]{4, 1, 2, 1, 2}));  // Output: 4
    }
}
```

</div>

**Single Number II (three times):** For each bit position, count how many numbers have it set. If the count is not divisible by 3, the single number has that bit.

<div class="code-group">

```python
def singleNumberII(nums):
    result = 0
    for i in range(32):  # For 32-bit integers
        count = 0
        for num in nums:
            # Check if the i-th bit is set
            if (num >> i) & 1:
                count += 1
        # If count % 3 != 0, set the i-th bit in result
        if count % 3:
            result |= (1 << i)
    # Handle negative numbers in Python (two's complement)
    if result >= (1 << 31):
        result -= (1 << 32)
    return result

print(singleNumberII([2, 2, 3, 2]))  # Output: 3
```

```javascript
function singleNumberII(nums) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    // For 32-bit integers
    let count = 0;
    for (let num of nums) {
      // Check if the i-th bit is set
      if ((num >> i) & 1) {
        count++;
      }
    }
    // If count % 3 !== 0, set the i-th bit in result
    if (count % 3) {
      result |= 1 << i;
    }
  }
  return result;
}

console.log(singleNumberII([2, 2, 3, 2])); // Output: 3
```

```java
public class SingleNumberII {
    public static int singleNumber(int[] nums) {
        int result = 0;
        for (int i = 0; i < 32; i++) {  // For 32-bit integers
            int count = 0;
            for (int num : nums) {
                // Check if the i-th bit is set
                if (((num >> i) & 1) == 1) {
                    count++;
                }
            }
            // If count % 3 != 0, set the i-th bit in result
            if (count % 3 != 0) {
                result |= (1 << i);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(singleNumber(new int[]{2, 2, 3, 2}));  // Output: 3
    }
}
```

</div>

**Single Number III (two unique elements):** XOR all to get `x ^ y`. Find any set bit (rightmost: `diff & (-diff)`). Partition numbers by that bit into two groups. XOR each group to get x and y.

<div class="code-group">

```python
def singleNumberIII(nums):
    # Step 1: XOR all numbers to get x ^ y
    xor_all = 0
    for num in nums:
        xor_all ^= num

    # Step 2: Find the rightmost set bit
    diff = xor_all & -xor_all

    # Step 3: Partition and XOR
    x = 0
    for num in nums:
        if num & diff:  # Numbers with the bit set
            x ^= num

    y = xor_all ^ x
    return [x, y]

print(singleNumberIII([1, 2, 1, 3, 2, 5]))  # Output: [3, 5]
```

```javascript
function singleNumberIII(nums) {
  // Step 1: XOR all numbers to get x ^ y
  let xor_all = 0;
  for (let num of nums) {
    xor_all ^= num;
  }

  // Step 2: Find the rightmost set bit
  let diff = xor_all & -xor_all;

  // Step 3: Partition and XOR
  let x = 0;
  for (let num of nums) {
    if (num & diff) {
      // Numbers with the bit set
      x ^= num;
    }
  }

  let y = xor_all ^ x;
  return [x, y];
}

console.log(singleNumberIII([1, 2, 1, 3, 2, 5])); // Output: [3, 5]
```

```java
public class SingleNumberIII {
    public static int[] singleNumber(int[] nums) {
        // Step 1: XOR all numbers to get x ^ y
        int xor_all = 0;
        for (int num : nums) {
            xor_all ^= num;
        }

        // Step 2: Find the rightmost set bit
        int diff = xor_all & -xor_all;

        // Step 3: Partition and XOR
        int x = 0;
        for (int num : nums) {
            if ((num & diff) != 0) {  // Numbers with the bit set
                x ^= num;
            }
        }

        int y = xor_all ^ x;
        return new int[]{x, y};
    }

    public static void main(String[] args) {
        int[] result = singleNumber(new int[]{1, 2, 1, 3, 2, 5});
        System.out.println("[" + result[0] + ", " + result[1] + "]");  // Output: [3, 5]
    }
}
```

</div>

**Missing Number:** XOR all array elements with 0 through n. Everything pairs except the missing number.

<div class="code-group">

```python
def missingNumber(nums):
    result = 0
    # XOR all numbers from 0 to n
    for i in range(len(nums) + 1):
        result ^= i
    # XOR all numbers in the array
    for num in nums:
        result ^= num
    return result

print(missingNumber([3, 0, 1]))  # Output: 2
```

```javascript
function missingNumber(nums) {
  let result = 0;
  // XOR all numbers from 0 to n
  for (let i = 0; i <= nums.length; i++) {
    result ^= i;
  }
  // XOR all numbers in the array
  for (let num of nums) {
    result ^= num;
  }
  return result;
}

console.log(missingNumber([3, 0, 1])); // Output: 2
```

```java
public class MissingNumber {
    public static int missingNumber(int[] nums) {
        int result = 0;
        // XOR all numbers from 0 to n
        for (int i = 0; i <= nums.length; i++) {
            result ^= i;
        }
        // XOR all numbers in the array
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(missingNumber(new int[]{3, 0, 1}));  // Output: 2
    }
}
```

</div>

## Power of Two Check

`n & (n - 1) == 0` for positive n. Subtracting 1 flips the single set bit and sets all lower bits. AND produces zero. Example: 8 = `1000`, 7 = `0111`, `1000 & 0111 = 0000`.

<div class="code-group">

```python
def isPowerOfTwo(n):
    if n <= 0:
        return False
    return (n & (n - 1)) == 0

print(isPowerOfTwo(8))   # True
print(isPowerOfTwo(6))   # False
print(isPowerOfTwo(0))   # False
print(isPowerOfTwo(1))   # True (2^0)
```

```javascript
function isPowerOfTwo(n) {
  if (n <= 0) {
    return false;
  }
  return (n & (n - 1)) === 0;
}

console.log(isPowerOfTwo(8)); // true
console.log(isPowerOfTwo(6)); // false
console.log(isPowerOfTwo(0)); // false
console.log(isPowerOfTwo(1)); // true (2^0)
```

```java
public class PowerOfTwo {
    public static boolean isPowerOfTwo(int n) {
        if (n <= 0) {
            return false;
        }
        return (n & (n - 1)) == 0;
    }

    public static void main(String[] args) {
        System.out.println(isPowerOfTwo(8));   // true
        System.out.println(isPowerOfTwo(6));   // false
        System.out.println(isPowerOfTwo(0));   // false
        System.out.println(isPowerOfTwo(1));   // true (2^0)
    }
}
```

</div>

## Counting Set Bits (Brian Kernighan's)

Clear the lowest set bit with `n = n & (n - 1)` and count iterations. Each iteration removes exactly one set bit.

**Number of 1 Bits:** Direct application.

<div class="code-group">

```python
def hammingWeight(n):
    count = 0
    while n:
        n &= (n - 1)  # Clear the lowest set bit
        count += 1
    return count

print(hammingWeight(11))  # 11 = 1011 in binary, output: 3
print(hammingWeight(128)) # 128 = 10000000, output: 1
```

```javascript
function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n &= n - 1; // Clear the lowest set bit
    count++;
  }
  return count;
}

console.log(hammingWeight(11)); // 11 = 1011 in binary, output: 3
console.log(hammingWeight(128)); // 128 = 10000000, output: 1
```

```java
public class HammingWeight {
    public static int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1);  // Clear the lowest set bit
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(hammingWeight(11));   // 11 = 1011 in binary, output: 3
        System.out.println(hammingWeight(128));  // 128 = 10000000, output: 1
    }
}
```

</div>

**Counting Bits (0 to n):** DP approach: `result[i] = result[i & (i - 1)] + 1` since `i & (i-1)` has one fewer set bit.

<div class="code-group">

```python
def countBits(n):
    result = [0] * (n + 1)
    for i in range(1, n + 1):
        # i & (i-1) removes the lowest set bit
        result[i] = result[i & (i - 1)] + 1
    return result

print(countBits(5))  # Output: [0, 1, 1, 2, 1, 2]
# Explanation:
# 0: 0 -> 0 bits
# 1: 1 -> 1 bit
# 2: 10 -> 1 bit
# 3: 11 -> 2 bits
# 4: 100 -> 1 bit
# 5: 101 -> 2 bits
```

```javascript
function countBits(n) {
  const result = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    // i & (i-1) removes the lowest set bit
    result[i] = result[i & (i - 1)] + 1;
  }
  return result;
}

console.log(countBits(5)); // Output: [0, 1, 1, 2, 1, 2]
```

```java
public class CountBits {
    public static int[] countBits(int n) {
        int[] result = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            // i & (i-1) removes the lowest set bit
            result[i] = result[i & (i - 1)] + 1;
        }
        return result;
    }

    public static void main(String[] args) {
        int[] result = countBits(5);
        System.out.println(Arrays.toString(result));  // Output: [0, 1, 1, 2, 1, 2]
    }
}
```

</div>

## Bit Masking

Use an integer as a set where each bit represents an element. For n elements, iterate from 0 to `2^n - 1`, checking each bit.

**Subsets enumeration:** Each integer in [0, 2^n) is a subset. Check bit j: `mask & (1 << j)`.

<div class="code-group">

```python
def subsets(nums):
    n = len(nums)
    result = []
    total_subsets = 1 << n  # 2^n

    for mask in range(total_subsets):
        subset = []
        for i in range(n):
            if mask & (1 << i):  # Check if i-th bit is set
                subset.append(nums[i])
        result.append(subset)

    return result

print(subsets([1, 2, 3]))
# Output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```

```javascript
function subsets(nums) {
  const n = nums.length;
  const result = [];
  const totalSubsets = 1 << n; // 2^n

  for (let mask = 0; mask < totalSubsets; mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        // Check if i-th bit is set
        subset.push(nums[i]);
      }
    }
    result.push(subset);
  }

  return result;
}

console.log(subsets([1, 2, 3]));
// Output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```

```java
public class Subsets {
    public static List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();
        int totalSubsets = 1 << n;  // 2^n

        for (int mask = 0; mask < totalSubsets; mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {  // Check if i-th bit is set
                    subset.add(nums[i]);
                }
            }
            result.add(subset);
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(subsets(new int[]{1, 2, 3}));
        // Output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
    }
}
```

</div>

**Bitmask DP:** Traveling Salesman, Partition to K Equal Sum Subsets -- state is a bitmask of used elements.

## Common Recipes

- Get ith bit: `(n >> i) & 1`
- Set ith bit: `n | (1 << i)`
- Clear ith bit: `n & ~(1 << i)`
- Toggle ith bit: `n ^ (1 << i)`
- Lowest set bit: `n & (-n)`
- Clear lowest set bit: `n & (n - 1)`
- Check even/odd: `n & 1`

Let's implement these common operations:

<div class="code-group">

```python
def bit_operations_demo(n, i):
    print(f"Original number: {n} (binary: {bin(n)})")
    print(f"Get bit {i}: {(n >> i) & 1}")

    set_bit = n | (1 << i)
    print(f"Set bit {i}: {set_bit} (binary: {bin(set_bit)})")

    clear_bit = n & ~(1 << i)
    print(f"Clear bit {i}: {clear_bit} (binary: {bin(clear_bit)})")

    toggle_bit = n ^ (1 << i)
    print(f"Toggle bit {i}: {toggle_bit} (binary: {bin(toggle_bit)})")

    lowest_set = n & -n
    print(f"Lowest set bit: {lowest_set} (binary: {bin(lowest_set)})")

    clear_lowest = n & (n - 1)
    print(f"Clear lowest set bit: {clear_lowest} (binary: {bin(clear_lowest)})")

    is_even = (n & 1) == 0
    print(f"Is even: {is_even}")

bit_operations_demo(13, 1)  # 13 = 1101 in binary
```

```javascript
function bitOperationsDemo(n, i) {
  console.log(`Original number: ${n} (binary: ${n.toString(2)})`);
  console.log(`Get bit ${i}: ${(n >> i) & 1}`);

  const setBit = n | (1 << i);
  console.log(`Set bit ${i}: ${setBit} (binary: ${setBit.toString(2)})`);

  const clearBit = n & ~(1 << i);
  console.log(`Clear bit ${i}: ${clearBit} (binary: ${clearBit.toString(2)})`);

  const toggleBit = n ^ (1 << i);
  console.log(`Toggle bit ${i}: ${toggleBit} (binary: ${toggleBit.toString(2)})`);

  const lowestSet = n & -n;
  console.log(`Lowest set bit: ${lowestSet} (binary: ${lowestSet.toString(2)})`);

  const clearLowest = n & (n - 1);
  console.log(`Clear lowest set bit: ${clearLowest} (binary: ${clearLowest.toString(2)})`);

  const isEven = (n & 1) === 0;
  console.log(`Is even: ${isEven}`);
}

bitOperationsDemo(13, 1); // 13 = 1101 in binary
```

```java
public class BitOperationsDemo {
    public static void main(String[] args) {
        int n = 13;  // 1101 in binary
        int i = 1;

        System.out.println("Original number: " + n + " (binary: " + Integer.toBinaryString(n) + ")");
        System.out.println("Get bit " + i + ": " + ((n >> i) & 1));

        int setBit = n | (1 << i);
        System.out.println("Set bit " + i + ": " + setBit + " (binary: " + Integer.toBinaryString(setBit) + ")");

        int clearBit = n & ~(1 << i);
        System.out.println("Clear bit " + i + ": " + clearBit + " (binary: " + Integer.toBinaryString(clearBit) + ")");

        int toggleBit = n ^ (1 << i);
        System.out.println("Toggle bit " + i + ": " + toggleBit + " (binary: " + Integer.toBinaryString(toggleBit) + ")");

        int lowestSet = n & -n;
        System.out.println("Lowest set bit: " + lowestSet + " (binary: " + Integer.toBinaryString(lowestSet) + ")");

        int clearLowest = n & (n - 1);
        System.out.println("Clear lowest set bit: " + clearLowest + " (binary: " + Integer.toBinaryString(clearLowest) + ")");

        boolean isEven = (n & 1) == 0;
        System.out.println("Is even: " + isEven);
    }
}
```

</div>

## When to Use Bit Manipulation

Use it when the problem explicitly involves binary representations, you need O(1) space for a problem that seems to require O(n) (Single Number), or you need to represent small sets as bitmasks. Otherwise, hash maps or sorting are usually simpler.

Bit manipulation is particularly useful in:

1. **Space optimization**: When you need to track presence/absence of elements and the number of elements is small (≤ 32 or ≤ 64).
2. **Performance-critical code**: Bit operations are among the fastest operations a CPU can perform.
3. **Low-level programming**: Device drivers, graphics programming, and compression algorithms often use bit manipulation.
4. **Competitive programming**: Problems with constraints that suggest bitmask solutions.

## Practice Problems

**XOR tricks:**

1. Single Number
2. Single Number III
3. Missing Number

**Bit counting:** 4. Number of 1 Bits 5. Counting Bits 6. Hamming Distance

**Basic operations:** 7. Power of Two 8. Reverse Bits

**Bitmask:** 9. Subsets (bitmask approach) 10. Letter Case Permutation

Let's implement the Hamming Distance problem as an example:

<div class="code-group">

```python
def hammingDistance(x, y):
    # XOR gives 1 where bits differ
    xor_result = x ^ y
    # Count the number of 1 bits
    distance = 0
    while xor_result:
        xor_result &= (xor_result - 1)
        distance += 1
    return distance

print(hammingDistance(1, 4))  # 1 = 0001, 4 = 0100, output: 2
```

```javascript
function hammingDistance(x, y) {
  // XOR gives 1 where bits differ
  let xorResult = x ^ y;
  // Count the number of 1 bits
  let distance = 0;
  while (xorResult) {
    xorResult &= xorResult - 1;
    distance++;
  }
  return distance;
}

console.log(hammingDistance(1, 4)); // 1 = 0001, 4 = 0100, output: 2
```

```java
public class HammingDistance {
    public static int hammingDistance(int x, int y) {
        // XOR gives 1 where bits differ
        int xorResult = x ^ y;
        // Count the number of 1 bits
        int distance = 0;
        while (xorResult != 0) {
            xorResult &= (xorResult - 1);
            distance++;
        }
        return distance;
    }

    public static void main(String[] args) {
        System.out.println(hammingDistance(1, 4));  // 1 = 0001, 4 = 0100, output: 2
    }
}
```

</div>

Check the [CodeJeet dashboard](/dashboard) for bit manipulation problems by company. They appear at [Apple](/company/apple), [Amazon](/company/amazon), and [Google](/company/google).
