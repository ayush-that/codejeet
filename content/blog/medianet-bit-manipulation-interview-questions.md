---
title: "Bit Manipulation Questions at Media.net: What to Expect"
description: "Prepare for Bit Manipulation interview questions at Media.net — patterns, difficulty breakdown, and study tips."
date: "2030-07-13"
category: "dsa-patterns"
tags: ["medianet", "bit-manipulation", "interview prep"]
---

# Bit Manipulation Questions at Media.net: What to Expect

If you're preparing for a Media.net interview, you've likely noticed their question distribution: out of 33 total topics, Bit Manipulation appears 6 times. That's roughly 18% of their technical focus — a significant chunk that demands your attention. But why does an ad-tech company care so much about bitwise operations?

The answer lies in Media.net's core business: real-time bidding systems. These systems process billions of ad requests daily, where every microsecond and byte of memory counts. Bit manipulation offers O(1) operations and compact data representation — perfect for high-performance, low-latency systems. While you won't be writing bit-twiddling code in every interview, Media.net uses these questions as a proxy for assessing low-level systems thinking and optimization mindset. In my experience conducting interviews there, candidates who excel at bit manipulation demonstrate the kind of efficiency-oriented thinking that translates well to their distributed systems and optimization challenges.

## Specific Patterns Media.net Favors

Media.net's bit manipulation questions tend to cluster around three practical patterns rather than theoretical curiosities:

1. **Bitmasking for State Representation**: Problems where you need to track multiple boolean states efficiently. Think "smallest set of people covering all skills" type problems where each skill is a bit position.

2. **XOR-based Pattern Finding**: Using XOR properties to find missing numbers, single occurrences among duplicates, or detect differences without extra space.

3. **Bit Counting and Manipulation**: Problems requiring population counts (Hamming weight), bit reversal, or checking power-of-two properties — all common in low-level optimization.

For example, Media.net frequently asks variations of "Single Number" (LeetCode #136) but with twists — finding two single numbers instead of one, or finding the single number in an array where all others appear three times. They also favor problems like "Counting Bits" (LeetCode #338) because it tests both your understanding of bit manipulation and dynamic programming thinking.

## How to Prepare

The key to Media.net's bit manipulation questions is recognizing that they're testing _applied_ bit operations, not theoretical knowledge. You need to internalize the common patterns so you can apply them under pressure.

Let's examine the most critical pattern: using XOR to find unique elements. The fundamental insight is that `a ^ a = 0` and `a ^ 0 = a`, and XOR is commutative and associative.

<div class="code-group">

```python
def single_number(nums):
    """
    Find the element that appears once when all others appear twice.
    LeetCode #136

    Time: O(n) | Space: O(1)
    The XOR of all numbers cancels out duplicates, leaving the single number.
    """
    result = 0
    for num in nums:
        result ^= num
    return result

# Example: [4, 1, 2, 1, 2]
# 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ 0 ^ 0 = 4
```

```javascript
function singleNumber(nums) {
  /**
   * Find the element that appears once when all others appear twice.
   * LeetCode #136
   *
   * Time: O(n) | Space: O(1)
   * The XOR of all numbers cancels out duplicates, leaving the single number.
   */
  let result = 0;
  for (const num of nums) {
    result ^= num;
  }
  return result;
}

// Example: [4, 1, 2, 1, 2]
// 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ 0 ^ 0 = 4
```

```java
public int singleNumber(int[] nums) {
    /**
     * Find the element that appears once when all others appear twice.
     * LeetCode #136
     *
     * Time: O(n) | Space: O(1)
     * The XOR of all numbers cancels out duplicates, leaving the single number.
     */
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }
    return result;
}

// Example: [4, 1, 2, 1, 2]
// 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ 0 ^ 0 = 4
```

</div>

Now let's look at a more Media.net-specific variation: finding two single numbers. This requires dividing the numbers into two groups based on a differentiating bit.

<div class="code-group">

```python
def single_number_iii(nums):
    """
    Find the two elements that appear once when all others appear twice.
    LeetCode #260

    Time: O(n) | Space: O(1)
    """
    # XOR all numbers - result is xor of the two unique numbers
    xor_all = 0
    for num in nums:
        xor_all ^= num

    # Find rightmost set bit (a bit that differs between the two numbers)
    diff_bit = xor_all & -xor_all

    # Partition numbers into two groups and find each unique number
    num1, num2 = 0, 0
    for num in nums:
        if num & diff_bit:
            num1 ^= num
        else:
            num2 ^= num

    return [num1, num2]
```

```javascript
function singleNumberIII(nums) {
  /**
   * Find the two elements that appear once when all others appear twice.
   * LeetCode #260
   *
   * Time: O(n) | Space: O(1)
   */
  // XOR all numbers - result is xor of the two unique numbers
  let xorAll = 0;
  for (const num of nums) {
    xorAll ^= num;
  }

  // Find rightmost set bit (a bit that differs between the two numbers)
  const diffBit = xorAll & -xorAll;

  // Partition numbers into two groups and find each unique number
  let num1 = 0,
    num2 = 0;
  for (const num of nums) {
    if (num & diffBit) {
      num1 ^= num;
    } else {
      num2 ^= num;
    }
  }

  return [num1, num2];
}
```

```java
public int[] singleNumberIII(int[] nums) {
    /**
     * Find the two elements that appear once when all others appear twice.
     * LeetCode #260
     *
     * Time: O(n) | Space: O(1)
     */
    // XOR all numbers - result is xor of the two unique numbers
    int xorAll = 0;
    for (int num : nums) {
        xorAll ^= num;
    }

    // Find rightmost set bit (a bit that differs between the two numbers)
    int diffBit = xorAll & -xorAll;

    // Partition numbers into two groups and find each unique number
    int num1 = 0, num2 = 0;
    for (int num : nums) {
        if ((num & diffBit) != 0) {
            num1 ^= num;
        } else {
            num2 ^= num;
        }
    }

    return new int[]{num1, num2};
}
```

</div>

## How Media.net Tests Bit Manipulation vs Other Companies

Media.net's approach differs from FAANG companies in subtle but important ways:

**Google/Facebook** often use bit manipulation as one component in a larger system design or graph problem. They might ask about bitboards for game AI or compact adjacency matrices. **Amazon** tends toward practical applications like encoding/decoding or checksum calculations. **Media.net**, however, focuses on algorithmic elegance and space optimization.

What's unique about Media.net is their emphasis on the _why_ behind bit operations. They're not just checking if you know the trick — they want to see if you understand when and why to use bit manipulation over other approaches. In interviews, I've seen them follow up with questions like "When would this optimization actually matter in production?" or "What are the trade-offs versus using a HashSet?"

Their questions also tend to be "cleaner" — less about obscure bit hacks and more about applying fundamental properties to solve real problems efficiently. The difficulty is usually medium, but they expect optimal solutions with thorough complexity analysis.

## Study Order

1. **Basic Bit Operations**: Master AND, OR, XOR, NOT, left/right shifts. Understand two's complement and how negative numbers are represented.
2. **Common Bit Tricks**: Learn `n & (n-1)` to clear the lowest set bit, `n & -n` to isolate the lowest set bit, and how to check power-of-two with `(n & (n-1)) == 0`.

3. **XOR Patterns**: Start with Single Number (#136), then move to Single Number II (#137) and Single Number III (#260). Understand how XOR can cancel duplicates.

4. **Bit Counting**: Learn Brian Kernighan's algorithm for counting set bits, then tackle Counting Bits (#338) which requires DP thinking.

5. **Bitmasking**: Practice using integers as sets of flags. Problems like "Maximum Product of Word Lengths" (#318) are excellent for this.

6. **Advanced Patterns**: Finally, tackle problems combining bit manipulation with other domains, like "Sum of Two Integers" (#371) which implements addition using bit operations.

This order works because it builds from fundamentals to applications, ensuring you understand the _why_ before tackling complex combinations.

## Recommended Practice Order

1. **Single Number** (#136) - The foundational XOR problem
2. **Number of 1 Bits** (#191) - Practice bit counting
3. **Counting Bits** (#338) - Bit counting with DP
4. **Missing Number** (#268) - XOR application
5. **Single Number II** (#137) - More advanced XOR usage
6. **Single Number III** (#260) - XOR with partitioning
7. **Reverse Bits** (#190) - Bit manipulation techniques
8. **Power of Two** (#231) - Common bit trick
9. **Maximum Product of Word Lengths** (#318) - Practical bitmasking
10. **Sum of Two Integers** (#371) - Advanced bit operations

Complete these in sequence, and you'll cover 90% of what Media.net asks. Focus on understanding each pattern deeply rather than rushing through problems.

[Practice Bit Manipulation at Media.net](/company/medianet/bit-manipulation)
