---
title: "How to Solve Search Suggestions System — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Search Suggestions System. Medium difficulty, 65.1% acceptance rate. Topics: Array, String, Binary Search, Trie, Sorting."
date: "2027-06-28"
category: "dsa-patterns"
tags: ["search-suggestions-system", "array", "string", "binary-search", "medium"]
---

# How to Solve Search Suggestions System

You're given a list of products and a search word. After typing each character of the search word, you need to suggest up to three products that have the current prefix. The challenge is making this efficient — you can't scan all products for every character typed, especially with large datasets. This problem is interesting because it has multiple valid approaches with different trade-offs, making it a great test of algorithmic thinking.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
products = ["mobile", "mouse", "moneypot", "monitor", "mousepad"]
searchWord = "mouse"
```

**Step-by-step suggestions:**

1. **After typing "m"**: All products starting with "m" are ["mobile", "mouse", "moneypot", "monitor", "mousepad"]. Sorted lexicographically, we take first 3: ["mobile", "moneypot", "monitor"]

2. **After typing "mo"**: Products starting with "mo" are ["mobile", "moneypot", "monitor", "mouse", "mousepad"]. First 3: ["mobile", "moneypot", "monitor"]

3. **After typing "mou"**: Products starting with "mou" are ["mouse", "mousepad"]. Both are included: ["mouse", "mousepad"]

4. **After typing "mous"**: Same as above: ["mouse", "mousepad"]

5. **After typing "mouse"**: Same as above: ["mouse", "mousepad"]

Notice how the suggestions narrow down as we type more characters, and we always return at most three suggestions in sorted order.

## Brute Force Approach

The most straightforward approach is: for each prefix of `searchWord` (from length 1 to full length), scan through all products, check which ones start with that prefix, sort them, and take the first three.

**Why this is inefficient:**

- For a search word of length `m` and `n` products, we do `O(m × n)` string comparisons
- Each comparison takes `O(k)` time where `k` is the average product length
- Sorting the filtered list each time adds `O(n log n)` per prefix
- Overall complexity: `O(m × n × k + m × n log n)`

This becomes problematic with large inputs. For example, with 10,000 products and a 10-character search word, we're doing 100,000 string operations plus sorting overhead.

## Optimized Approach

The key insight is that we can **preprocess** the products to make prefix searches efficient. Two main approaches work well:

1. **Sorting + Binary Search**: Sort the products alphabetically once. For each prefix, use binary search to find the first product that could match (the lower bound). Then check the next few products to collect up to three matches.

2. **Trie Data Structure**: Build a trie where each node stores up to 3 suggestions. This gives us `O(m)` time per search (where `m` is the search word length) after `O(n × k)` preprocessing.

The sorting + binary search approach is often preferred in interviews because:

- It's simpler to implement correctly under pressure
- Uses standard library functions (sorting, binary search)
- Has good real-world performance for typical constraints
- Demonstrates understanding of algorithmic optimization

**Step-by-step reasoning for sorting + binary search:**

1. Sort products alphabetically (one-time `O(n log n)` cost)
2. For each prefix of searchWord (from length 1 to full length):
   - Use binary search to find the first product >= current prefix
   - From that position, check up to 3 consecutive products
   - For each candidate, verify it actually starts with the prefix
   - Stop if we find a non-match or reach 3 matches

## Optimal Solution

Here's the complete solution using sorting and binary search:

<div class="code-group">

```python
# Time: O(n log n + m log n) where n = len(products), m = len(searchWord)
# Space: O(1) excluding output, O(m) for output
def suggestedProducts(products, searchWord):
    """
    Returns suggestions for each prefix of searchWord.

    Approach:
    1. Sort products once to enable binary search
    2. For each prefix, find lower bound using binary search
    3. Check up to 3 consecutive products from that position
    """
    # Step 1: Sort products alphabetically - O(n log n)
    products.sort()

    result = []
    prefix = ""

    # Step 2: Process each character of searchWord
    for char in searchWord:
        prefix += char
        suggestions = []

        # Step 3: Find first product >= prefix using binary search
        # bisect_left returns the first position where prefix could be inserted
        import bisect
        start_idx = bisect.bisect_left(products, prefix)

        # Step 4: Check up to 3 products starting from start_idx
        for i in range(start_idx, min(start_idx + 3, len(products))):
            # Verify product actually starts with prefix (not just >=)
            if products[i].startswith(prefix):
                suggestions.append(products[i])
            else:
                # Since products are sorted, if one doesn't match,
                # subsequent ones won't either
                break

        result.append(suggestions)

    return result
```

```javascript
// Time: O(n log n + m log n) where n = products.length, m = searchWord.length
// Space: O(1) excluding output, O(m) for output
function suggestedProducts(products, searchWord) {
  /**
   * Returns suggestions for each prefix of searchWord.
   *
   * Approach:
   * 1. Sort products once to enable binary search
   * 2. For each prefix, find lower bound using binary search
   * 3. Check up to 3 consecutive products from that position
   */

  // Step 1: Sort products alphabetically - O(n log n)
  products.sort();

  const result = [];
  let prefix = "";

  // Step 2: Process each character of searchWord
  for (const char of searchWord) {
    prefix += char;
    const suggestions = [];

    // Step 3: Find first product >= prefix using binary search
    let startIdx = lowerBound(products, prefix);

    // Step 4: Check up to 3 products starting from startIdx
    for (let i = startIdx; i < Math.min(startIdx + 3, products.length); i++) {
      // Verify product actually starts with prefix
      if (products[i].startsWith(prefix)) {
        suggestions.push(products[i]);
      } else {
        // Since products are sorted, if one doesn't match,
        // subsequent ones won't either
        break;
      }
    }

    result.push(suggestions);
  }

  return result;
}

// Helper function: binary search to find first element >= target
function lowerBound(arr, target) {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}
```

```java
// Time: O(n log n + m log n) where n = products.length, m = searchWord.length()
// Space: O(1) excluding output, O(m) for output
import java.util.*;

class Solution {
    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        /**
         * Returns suggestions for each prefix of searchWord.
         *
         * Approach:
         * 1. Sort products once to enable binary search
         * 2. For each prefix, find lower bound using binary search
         * 3. Check up to 3 consecutive products from that position
         */

        // Step 1: Sort products alphabetically - O(n log n)
        Arrays.sort(products);

        List<List<String>> result = new ArrayList<>();
        StringBuilder prefix = new StringBuilder();

        // Step 2: Process each character of searchWord
        for (char c : searchWord.toCharArray()) {
            prefix.append(c);
            List<String> suggestions = new ArrayList<>();

            // Step 3: Find first product >= prefix using binary search
            int startIdx = lowerBound(products, prefix.toString());

            // Step 4: Check up to 3 products starting from startIdx
            for (int i = startIdx; i < Math.min(startIdx + 3, products.length); i++) {
                // Verify product actually starts with prefix
                if (products[i].startsWith(prefix.toString())) {
                    suggestions.add(products[i]);
                } else {
                    // Since products are sorted, if one doesn't match,
                    // subsequent ones won't either
                    break;
                }
            }

            result.add(suggestions);
        }

        return result;
    }

    // Helper method: binary search to find first element >= target
    private int lowerBound(String[] arr, String target) {
        int left = 0;
        int right = arr.length;

        while (left < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid].compareTo(target) < 0) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting: `O(n log n)` where `n` is the number of products
- For each of `m` prefixes (where `m` is search word length):
  - Binary search: `O(log n)`
  - Checking up to 3 products: `O(1)`
- Total: `O(n log n + m log n)`

**Space Complexity:**

- Output storage: `O(m)` for the result list (each prefix has up to 3 suggestions)
- Auxiliary space: `O(1)` excluding output (sorting is in-place, we use only a few variables)
- If we consider the input modification, sorting might require `O(n)` space in some languages, but typically it's `O(log n)` for the sort algorithm itself

This is optimal because:

1. We must at least look at all products once (to sort them)
2. We need to process each character of the search word
3. Binary search gives us the optimal `O(log n)` lookup per prefix

## Common Mistakes

1. **Forgetting to sort products first**: Without sorting, binary search won't work, and you won't get lexicographically ordered results. Always sort at the beginning.

2. **Not verifying the prefix match after binary search**: Binary search finds the first product >= prefix, but ">=" doesn't guarantee "starts with". For example, prefix "mou" might find "mousepad" (good) but also "mount" (bad - doesn't start with "mou"). Always check with `startswith()`.

3. **Not breaking early when a product doesn't match**: Since products are sorted, if `products[i]` doesn't start with the prefix, neither will `products[i+1]`, `products[i+2]`, etc. Breaking early saves unnecessary comparisons.

4. **Off-by-one errors in binary search implementation**: When implementing custom binary search (like in JavaScript version), common mistakes include:
   - Using `<=` instead of `<` in the while condition
   - Not updating bounds correctly
   - Forgetting the `mid + 1` or `mid - 1` adjustments
   - Test with edge cases: empty array, single element, target at beginning/end

## When You'll See This Pattern

This "prefix search with sorting + binary search" pattern appears in several problems:

1. **Auto-complete systems**: Any system that suggests completions as users type (search engines, IDEs, contact lists).

2. **LeetCode 792: Number of Matching Subsequences**: Uses similar prefix-matching logic with binary search on sorted indices.

3. **LeetCode 1065: Index Pairs of a String**: Finding all occurrences of words in text can use similar prefix techniques.

4. **LeetCode 1166: Design File System**: While not exactly the same, it involves prefix matching in hierarchical structures.

The core pattern is: when you need efficient prefix searches on a static dictionary, sort + binary search is often simpler than a trie and has comparable performance for many real-world scenarios.

## Key Takeaways

1. **Preprocessing is key for repeated queries**: When you need to answer many similar queries (like prefix searches for each character typed), invest in preprocessing (sorting) to make individual queries fast.

2. **Binary search works on strings too**: You can use binary search to find the lower bound of a prefix in a sorted string array. The comparison works lexicographically.

3. **Always verify matches after binary search**: Binary search gives you a candidate position, but you need to confirm it's an actual match, especially with prefix searches where ">=" isn't the same as "starts with".

[Practice this problem on CodeJeet](/problem/search-suggestions-system)
