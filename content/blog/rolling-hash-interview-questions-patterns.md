---
title: "Rolling Hash Interview Questions: Patterns and Strategies"
description: "Master Rolling Hash problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-06-01"
category: "dsa-patterns"
tags: ["rolling-hash", "dsa", "interview prep"]
---

# Rolling Hash Interview Questions: Patterns and Strategies

I remember watching a candidate completely freeze during a Google interview when I asked them to find the longest duplicate substring in a string. They immediately recognized it as a substring search problem, but when they started talking about O(n²) brute force approaches, I could see the panic set in. They knew there had to be a better way, but they couldn't connect the dots to rolling hash. This is exactly why rolling hash matters in interviews—it's a specialized technique that turns impossible problems into manageable ones, and interviewers at top companies love testing whether you can recognize when to pull it out of your toolkit.

Rolling hash is essentially a clever way to compute hash values for sliding windows in constant time. Instead of recalculating the hash from scratch for every possible substring (which would be O(n) per substring), you can update the hash in O(1) time by removing the contribution of the outgoing character and adding the contribution of the incoming character. This transforms problems that would normally be O(n²) or worse into O(n log n) or even O(n) solutions.

## Common Patterns

### Pattern 1: Rabin-Karp String Search

This is the classic application—searching for a pattern in a text. The insight is that instead of comparing strings directly (which is O(m) per position), we compare hash values first, and only verify with actual string comparison when hashes match.

<div class="code-group">

```python
def rabin_karp(text, pattern):
    """
    Rabin-Karp algorithm for pattern searching.
    Returns all starting indices where pattern is found in text.
    """
    n, m = len(text), len(pattern)
    if m == 0 or n < m:
        return []

    # Constants for rolling hash
    base = 256  # Assuming ASCII
    mod = 10**9 + 7  # Large prime to reduce collisions
    result = []

    # Precompute base^m % mod for rolling updates
    highest_power = pow(base, m - 1, mod)

    # Compute hash for pattern and first window of text
    pattern_hash = 0
    window_hash = 0

    for i in range(m):
        pattern_hash = (pattern_hash * base + ord(pattern[i])) % mod
        window_hash = (window_hash * base + ord(text[i])) % mod

    # Slide the window
    for i in range(n - m + 1):
        # Check if hash values match
        if pattern_hash == window_hash:
            # Verify to handle hash collisions
            if text[i:i+m] == pattern:
                result.append(i)

        # Compute hash for next window (if not at last position)
        if i < n - m:
            window_hash = (window_hash - ord(text[i]) * highest_power) % mod
            window_hash = (window_hash * base + ord(text[i + m])) % mod
            window_hash = (window_hash + mod) % mod  # Ensure non-negative

    return result

# Time: O(n + m) average, O(n*m) worst case (with many hash collisions)
# Space: O(1) excluding result storage
```

```javascript
function rabinKarp(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  if (m === 0 || n < m) return [];

  // Constants for rolling hash
  const base = 256; // Assuming ASCII
  const mod = 10 ** 9 + 7; // Large prime
  const result = [];

  // Precompute base^(m-1) % mod
  let highestPower = 1;
  for (let i = 0; i < m - 1; i++) {
    highestPower = (highestPower * base) % mod;
  }

  // Compute initial hashes
  let patternHash = 0;
  let windowHash = 0;

  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * base + pattern.charCodeAt(i)) % mod;
    windowHash = (windowHash * base + text.charCodeAt(i)) % mod;
  }

  // Slide the window
  for (let i = 0; i <= n - m; i++) {
    if (patternHash === windowHash) {
      // Verify to handle hash collisions
      if (text.substring(i, i + m) === pattern) {
        result.push(i);
      }
    }

    // Compute hash for next window
    if (i < n - m) {
      windowHash = (windowHash - text.charCodeAt(i) * highestPower) % mod;
      windowHash = (windowHash * base + text.charCodeAt(i + m)) % mod;
      windowHash = (windowHash + mod) % mod; // Ensure non-negative
    }
  }

  return result;
}

// Time: O(n + m) average, O(n*m) worst case
// Space: O(1) excluding result storage
```

```java
import java.util.ArrayList;
import java.util.List;

public class RabinKarp {
    public List<Integer> rabinKarp(String text, String pattern) {
        List<Integer> result = new ArrayList<>();
        int n = text.length();
        int m = pattern.length();
        if (m == 0 || n < m) return result;

        // Constants for rolling hash
        int base = 256;  // Assuming ASCII
        int mod = 1000000007;  // Large prime
        long highestPower = 1;

        // Precompute base^(m-1) % mod
        for (int i = 0; i < m - 1; i++) {
            highestPower = (highestPower * base) % mod;
        }

        // Compute initial hashes
        long patternHash = 0;
        long windowHash = 0;

        for (int i = 0; i < m; i++) {
            patternHash = (patternHash * base + pattern.charAt(i)) % mod;
            windowHash = (windowHash * base + text.charAt(i)) % mod;
        }

        // Slide the window
        for (int i = 0; i <= n - m; i++) {
            if (patternHash == windowHash) {
                // Verify to handle hash collisions
                if (text.substring(i, i + m).equals(pattern)) {
                    result.add(i);
                }
            }

            // Compute hash for next window
            if (i < n - m) {
                windowHash = (windowHash - text.charAt(i) * highestPower) % mod;
                windowHash = (windowHash * base + text.charAt(i + m)) % mod;
                if (windowHash < 0) windowHash += mod;  // Ensure non-negative
            }
        }

        return result;
    }
}

// Time: O(n + m) average, O(n*m) worst case
// Space: O(1) excluding result storage
```

</div>

**Related LeetCode problems:** Implement strStr() (#28), Repeated DNA Sequences (#187)

### Pattern 2: Binary Search with Rolling Hash

This pattern combines rolling hash with binary search to find optimal substring lengths. The key insight is that if a substring of length k exists with a certain property (like being repeated), then substrings of length < k also exist with that property, allowing binary search.

**Related LeetCode problems:** Longest Duplicate Substring (#1044), Longest Happy Prefix (#1392)

### Pattern 3: Rolling Hash for Palindrome Checking

You can use two rolling hashes—one forward and one backward—to check palindromes in O(1) time after preprocessing. This is particularly useful when you need to check many substrings for palindrome properties.

<div class="code-group">

```python
class RollingHashPalindromeChecker:
    def __init__(self, s):
        self.s = s
        self.n = len(s)
        self.base = 256
        self.mod = 10**9 + 7

        # Forward and backward hash arrays
        self.forward_hash = [0] * (self.n + 1)
        self.backward_hash = [0] * (self.n + 1)
        self.powers = [1] * (self.n + 1)

        # Precompute hashes and powers
        for i in range(self.n):
            self.forward_hash[i + 1] = (self.forward_hash[i] * self.base + ord(s[i])) % self.mod
            self.backward_hash[i + 1] = (self.backward_hash[i] * self.base + ord(s[self.n - 1 - i])) % self.mod
            self.powers[i + 1] = (self.powers[i] * self.base) % self.mod

    def is_palindrome(self, l, r):
        """Check if substring s[l:r] is a palindrome in O(1) time."""
        # Get forward hash of substring
        forward = (self.forward_hash[r] - self.forward_hash[l] * self.powers[r - l]) % self.mod

        # Get backward hash of substring (need to map indices)
        # l' = n - r, r' = n - l in backward string
        backward_l = self.n - r
        backward_r = self.n - l
        backward = (self.backward_hash[backward_r] - self.backward_hash[backward_l] * self.powers[backward_r - backward_l]) % self.mod

        return forward == backward

# Time: O(n) preprocessing, O(1) per query
# Space: O(n) for precomputed arrays
```

```javascript
class RollingHashPalindromeChecker {
  constructor(s) {
    this.s = s;
    this.n = s.length;
    this.base = 256;
    this.mod = 10 ** 9 + 7;

    // Forward and backward hash arrays
    this.forwardHash = new Array(this.n + 1).fill(0);
    this.backwardHash = new Array(this.n + 1).fill(0);
    this.powers = new Array(this.n + 1).fill(1);

    // Precompute hashes and powers
    for (let i = 0; i < this.n; i++) {
      this.forwardHash[i + 1] = (this.forwardHash[i] * this.base + s.charCodeAt(i)) % this.mod;
      this.backwardHash[i + 1] =
        (this.backwardHash[i] * this.base + s.charCodeAt(this.n - 1 - i)) % this.mod;
      this.powers[i + 1] = (this.powers[i] * this.base) % this.mod;
    }
  }

  isPalindrome(l, r) {
    // Get forward hash of substring
    let forward = (this.forwardHash[r] - this.forwardHash[l] * this.powers[r - l]) % this.mod;
    forward = (forward + this.mod) % this.mod;

    // Get backward hash of substring
    const backwardL = this.n - r;
    const backwardR = this.n - l;
    let backward =
      (this.backwardHash[backwardR] -
        this.backwardHash[backwardL] * this.powers[backwardR - backwardL]) %
      this.mod;
    backward = (backward + this.mod) % this.mod;

    return forward === backward;
  }
}

// Time: O(n) preprocessing, O(1) per query
// Space: O(n) for precomputed arrays
```

```java
public class RollingHashPalindromeChecker {
    private String s;
    private int n;
    private int base = 256;
    private int mod = 1000000007;
    private long[] forwardHash;
    private long[] backwardHash;
    private long[] powers;

    public RollingHashPalindromeChecker(String s) {
        this.s = s;
        this.n = s.length();
        this.forwardHash = new long[n + 1];
        this.backwardHash = new long[n + 1];
        this.powers = new long[n + 1];
        this.powers[0] = 1;

        // Precompute hashes and powers
        for (int i = 0; i < n; i++) {
            this.forwardHash[i + 1] = (this.forwardHash[i] * base + s.charAt(i)) % mod;
            this.backwardHash[i + 1] = (this.backwardHash[i] * base + s.charAt(n - 1 - i)) % mod;
            this.powers[i + 1] = (this.powers[i] * base) % mod;
        }
    }

    public boolean isPalindrome(int l, int r) {
        // Get forward hash of substring
        long forward = (forwardHash[r] - forwardHash[l] * powers[r - l]) % mod;
        if (forward < 0) forward += mod;

        // Get backward hash of substring
        int backwardL = n - r;
        int backwardR = n - l;
        long backward = (backwardHash[backwardR] - backwardHash[backwardL] * powers[backwardR - backwardL]) % mod;
        if (backward < 0) backward += mod;

        return forward == backward;
    }
}

// Time: O(n) preprocessing, O(1) per query
// Space: O(n) for precomputed arrays
```

</div>

**Related LeetCode problems:** Longest Palindromic Substring (#5), Palindrome Pairs (#336)

### Pattern 4: Multiple Rolling Hashes for Collision Resistance

Using two or more different hash functions with different bases/moduli significantly reduces the probability of collisions. This is crucial when you can't afford to verify every hash match with string comparison.

**Related LeetCode problems:** Distinct Echo Substrings (#1316), Find Substring With Given Hash Value (#2156)

## When to Use Rolling Hash vs Alternatives

Recognizing when to use rolling hash is half the battle. Here's my decision framework:

**Use rolling hash when:**

1. You need to compare many substrings efficiently (especially with binary search on substring length)
2. The problem involves finding repeated patterns or longest matching substrings
3. You need O(1) substring comparisons after preprocessing
4. Memory is not extremely constrained (rolling hash needs O(n) preprocessing space)

**Consider alternatives when:**

- **Trie/Suffix structures:** When you need to handle many pattern queries on the same text, a suffix array/tree might be better (though harder to implement in interviews)
- **KMP:** When you only need to find one pattern in text and want guaranteed O(n+m) time
- **Sliding window with hash map:** When dealing with character frequency problems (like longest substring with at most K distinct characters)
- **DP:** When substring problems have overlapping subproblems with clear recurrence relations

**Key decision criteria:**

1. Are you comparing substrings of the same string repeatedly?
2. Do you need to binary search on substring length?
3. Is O(n²) too slow but O(n log n) acceptable?
4. Can you tolerate occasional hash collisions (or use double hashing)?

If you answer yes to most of these, rolling hash is likely your solution.

## Edge Cases and Gotchas

### 1. Hash Collisions

This is the most subtle trap. Even with large primes, collisions can happen. Always verify hash matches with actual string comparison when possible, or use double/triple hashing.

<div class="code-group">

```python
# Bad: Assuming hash equality means string equality
if pattern_hash == window_hash:
    result.append(i)  # Could be false positive!

# Good: Always verify
if pattern_hash == window_hash:
    if text[i:i+m] == pattern:
        result.append(i)
```

```javascript
// Bad
if (patternHash === windowHash) {
  result.push(i);
}

// Good
if (patternHash === windowHash) {
  if (text.substring(i, i + m) === pattern) {
    result.push(i);
  }
}
```

```java
// Bad
if (patternHash == windowHash) {
    result.add(i);
}

// Good
if (patternHash == windowHash) {
    if (text.substring(i, i + m).equals(pattern)) {
        result.add(i);
    }
}
```

</div>

### 2. Integer Overflow

Even with modulo operations, intermediate calculations can overflow. Use 64-bit integers (long in Java, no issue in Python, BigInt in JavaScript for very large strings).

### 3. Negative Hash Values

When subtracting during the rolling update, hash values can become negative. Always add the modulus back and take modulo again.

### 4. Empty Strings and Edge Lengths

Always check for:

- Empty pattern string
- Pattern longer than text
- Single character strings
- Identical start and end positions

## Difficulty Breakdown

The distribution (1 Easy, 9 Medium, 13 Hard) tells a clear story: rolling hash is an advanced technique. Companies use it to separate senior candidates from mid-level ones.

**What this means for your preparation:**

1. **Don't start with rolling hash** if you're new to coding interviews
2. **Master the Medium problems first**—they teach the core patterns
3. **Hard problems often combine** rolling hash with other techniques (binary search, DP, etc.)
4. **Expect rolling hash in system design rounds** too—it's relevant for distributed systems like content deduplication

## Which Companies Ask Rolling Hash

- **Google** (/company/google): Loves combining rolling hash with binary search. Expect problems like "find the longest repeated substring in a massive string."
- **Amazon** (/company/amazon): Often uses rolling hash in string manipulation problems, sometimes in system design contexts (duplicate detection).
- **Bloomberg** (/company/bloomberg): Favors practical applications like plagiarism detection or DNA sequence matching.
- **Meta** (/company/meta): Asks rolling hash in string problems, often related to content matching or search optimization.
- **Microsoft** (/company/microsoft): Tends to ask classic rolling hash implementations with twists.

Each company has its style: Google goes for algorithmic elegance, Amazon for practical scale, Bloomberg for finance-adjacent applications, Meta for social media relevance, and Microsoft for clean implementations.

## Study Tips

1. **Learn in this order:**
   - Start with Rabin-Karp (#28) to understand the basic rolling mechanism
   - Move to Repeated DNA Sequences (#187) to see the hash map combination
   - Tackle Longest Duplicate Substring (#1044) for the binary search pattern
   - Finish with Distinct Echo Substrings (#1316) for advanced applications

2. **Implement from scratch 3 times**—once you can code Rabin-Karp without looking, you've internalized it.

3. **Practice the hash update formula** on paper: `new_hash = (old_hash - outgoing_char * base^(m-1)) * base + incoming_char`

4. **Time yourself**—rolling hash problems often appear in the last third of interviews when time is tight.

Remember: rolling hash is a power tool. It won't solve every string problem, but when it fits, it transforms impossible problems into elegant solutions. The key is recognizing the pattern—substring comparisons with a sliding window where direct comparison would be too expensive.

[Practice all Rolling Hash questions on CodeJeet](/topic/rolling-hash)
