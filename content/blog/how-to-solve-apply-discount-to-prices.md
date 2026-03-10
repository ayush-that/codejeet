---
title: "How to Solve Apply Discount to Prices — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Apply Discount to Prices. Medium difficulty, 33.8% acceptance rate. Topics: String."
date: "2029-04-09"
category: "dsa-patterns"
tags: ["apply-discount-to-prices", "string", "medium"]
---

# How to Solve "Apply Discount to Prices"

This problem asks us to process a sentence containing words, identify price words (starting with `$` followed only by digits), apply a discount to those prices, and return the modified sentence while keeping all other words unchanged. The challenge lies in careful string parsing—distinguishing valid prices from words that start with `$` but contain non-digit characters, handling large numbers that might exceed integer limits, and formatting the output to exactly two decimal places without trailing zeros. It's a great exercise in attention to detail and edge case handling.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- Input sentence: `"there are $item 100 and $200 shoes here"`
- Discount: `50`

**Step-by-step processing:**

1. Split the sentence into words: `["there", "are", "$item", "100", "and", "$200", "shoes", "here"]`
2. Examine each word:
   - `"there"`: Doesn't start with `$` → keep unchanged
   - `"are"`: Doesn't start with `$` → keep unchanged
   - `"$item"`: Starts with `$`, but `"item"` contains letters → not a valid price, keep unchanged
   - `"100"`: Doesn't start with `$` → keep unchanged
   - `"and"`: Doesn't start with `$` → keep unchanged
   - `"$200"`: Starts with `$`, and `"200"` contains only digits → valid price!
     - Apply discount: `200 * (1 - 50/100) = 200 * 0.5 = 100`
     - Format to 2 decimal places: `"100.00"`
     - Add back the `$`: `"$100.00"`
   - `"shoes"`: Doesn't start with `$` → keep unchanged
   - `"here"`: Doesn't start with `$` → keep unchanged
3. Join words back: `"there are $item 100 and $100.00 shoes here"`

Notice how `"$item"` wasn't modified because it's not a valid price—only words starting with `$` followed exclusively by digits count.

## Brute Force Approach

A naive approach would be to:

1. Split the sentence by spaces into words
2. For each word, check if it starts with `$`
3. If it does, try to parse the rest as a number
4. Apply discount and format
5. Join words back

The challenge isn't algorithmic complexity (we must examine every character anyway), but rather implementation correctness. A "brute force" implementation might use simple string operations without proper validation, leading to several issues:

**Common brute force mistakes:**

- Using `float()` or `int()` directly on substring without checking if it's all digits
- Not handling large numbers that exceed floating-point precision
- Incorrect rounding or formatting
- Modifying words that look like prices but contain invalid characters

Since we must process every character regardless, the optimal solution has the same O(n) time complexity as any correct solution. The difference is in robustness and correctness.

## Optimized Approach

The key insight is that we need to validate price words carefully before applying the discount. A word is a valid price if:

1. It starts with `$`
2. The remaining characters (after `$`) are ALL digits
3. It has at least one digit after the `$`

We can't just check if the substring after `$` can be converted to a number—we must verify it contains only digits. This prevents false positives like `"$12a"` or `"$12.5"`.

For the actual discount calculation, we need to handle potentially very large numbers (up to 10^9 digits in the worst case). Using floating-point arithmetic would lose precision, so we should use integer arithmetic or a decimal library. However, since we only need two decimal places in the output, we can work with the number as a string or use arbitrary-precision integers.

**Step-by-step reasoning:**

1. Split the sentence into words
2. For each word:
   - If it doesn't start with `$`, keep it as-is
   - If it starts with `$`:
     - Check if the rest of the word (after `$`) contains only digits and has at least one digit
     - If valid, convert the digit string to an integer (or process as string to avoid overflow)
     - Calculate discounted price: `price * (100 - discount) / 100`
     - Format to exactly two decimal places
     - Add `$` prefix back
3. Join words with spaces

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is total characters in sentence
# Space: O(n) for storing the result
class Solution:
    def discountPrices(self, sentence: str, discount: int) -> str:
        # Split sentence into individual words
        words = sentence.split()

        # Process each word
        for i in range(len(words)):
            word = words[i]

            # Check if word could be a price (starts with $ and has more characters)
            if word.startswith('$') and len(word) > 1:
                # Get the substring after $
                price_str = word[1:]

                # Check if all characters after $ are digits
                # This ensures we only process valid prices like "$123", not "$12a" or "$12.5"
                if price_str.isdigit():
                    # Convert to integer (safe since we verified it's all digits)
                    price = int(price_str)

                    # Apply discount: price * (100 - discount) / 100
                    # Use integer arithmetic to avoid floating-point precision issues
                    # Multiply by (100 - discount) first to maintain precision
                    discounted = price * (100 - discount)

                    # Convert to string and format to 2 decimal places
                    # We need to insert decimal point two places from the right
                    # For example: 12345 -> "123.45"
                    result_str = str(discounted)

                    # Handle case where result has fewer than 3 digits
                    # We need at least 1 digit before decimal and 2 after
                    if len(result_str) <= 2:
                        # Pad with leading zeros if needed
                        result_str = result_str.zfill(3)

                    # Insert decimal point two places from the right
                    # For "12345": insert at position 3 -> "123.45"
                    # For "123": insert at position 1 -> "1.23"
                    decimal_pos = len(result_str) - 2
                    formatted_price = result_str[:decimal_pos] + '.' + result_str[decimal_pos:]

                    # Remove leading zeros before decimal point, but keep at least one digit
                    # For example: "0.50" -> "0.50" (keep), "001.23" -> "1.23"
                    while len(formatted_price) > 1 and formatted_price[0] == '0' and formatted_price[1] != '.':
                        formatted_price = formatted_price[1:]

                    # Add $ prefix back
                    words[i] = '$' + formatted_price

        # Join words back into a sentence
        return ' '.join(words)
```

```javascript
// Time: O(n) where n is total characters in sentence
// Space: O(n) for storing the result
/**
 * @param {string} sentence
 * @param {number} discount
 * @return {string}
 */
var discountPrices = function (sentence, discount) {
  // Split sentence into individual words
  const words = sentence.split(" ");

  // Process each word
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Check if word could be a price (starts with $ and has more characters)
    if (word.startsWith("$") && word.length > 1) {
      // Get the substring after $
      const priceStr = word.substring(1);

      // Check if all characters after $ are digits
      // This ensures we only process valid prices like "$123", not "$12a" or "$12.5"
      if (/^\d+$/.test(priceStr)) {
        // Convert to BigInt to handle arbitrarily large numbers
        const price = BigInt(priceStr);

        // Apply discount: price * (100 - discount) / 100
        // Use integer arithmetic to avoid floating-point precision issues
        // Multiply by (100 - discount) first
        const discounted = price * BigInt(100 - discount);

        // Convert to string for formatting
        let resultStr = discounted.toString();

        // Handle case where result has fewer than 3 digits
        // We need at least 1 digit before decimal and 2 after
        if (resultStr.length <= 2) {
          // Pad with leading zeros if needed
          resultStr = resultStr.padStart(3, "0");
        }

        // Insert decimal point two places from the right
        // For "12345": insert at position 3 -> "123.45"
        // For "123": insert at position 1 -> "1.23"
        const decimalPos = resultStr.length - 2;
        let formattedPrice =
          resultStr.substring(0, decimalPos) + "." + resultStr.substring(decimalPos);

        // Remove leading zeros before decimal point, but keep at least one digit
        // For example: "0.50" -> "0.50" (keep), "001.23" -> "1.23"
        while (
          formattedPrice.length > 1 &&
          formattedPrice[0] === "0" &&
          formattedPrice[1] !== "."
        ) {
          formattedPrice = formattedPrice.substring(1);
        }

        // Add $ prefix back
        words[i] = "$" + formattedPrice;
      }
    }
  }

  // Join words back into a sentence
  return words.join(" ");
};
```

```java
// Time: O(n) where n is total characters in sentence
// Space: O(n) for storing the result
class Solution {
    public String discountPrices(String sentence, int discount) {
        // Split sentence into individual words
        String[] words = sentence.split(" ");

        // Process each word
        for (int i = 0; i < words.length; i++) {
            String word = words[i];

            // Check if word could be a price (starts with $ and has more characters)
            if (word.startsWith("$") && word.length() > 1) {
                // Get the substring after $
                String priceStr = word.substring(1);

                // Check if all characters after $ are digits
                // This ensures we only process valid prices like "$123", not "$12a" or "$12.5"
                boolean isValidPrice = true;
                for (int j = 0; j < priceStr.length(); j++) {
                    if (!Character.isDigit(priceStr.charAt(j))) {
                        isValidPrice = false;
                        break;
                    }
                }

                if (isValidPrice && !priceStr.isEmpty()) {
                    // Use BigInteger to handle arbitrarily large numbers
                    java.math.BigInteger price = new java.math.BigInteger(priceStr);

                    // Apply discount: price * (100 - discount) / 100
                    // Multiply by (100 - discount) first
                    java.math.BigInteger multiplier = java.math.BigInteger.valueOf(100 - discount);
                    java.math.BigInteger discounted = price.multiply(multiplier);

                    // Convert to string for formatting
                    String resultStr = discounted.toString();

                    // Handle case where result has fewer than 3 digits
                    // We need at least 1 digit before decimal and 2 after
                    if (resultStr.length() <= 2) {
                        // Pad with leading zeros if needed
                        StringBuilder sb = new StringBuilder(resultStr);
                        while (sb.length() < 3) {
                            sb.insert(0, '0');
                        }
                        resultStr = sb.toString();
                    }

                    // Insert decimal point two places from the right
                    // For "12345": insert at position 3 -> "123.45"
                    // For "123": insert at position 1 -> "1.23"
                    int decimalPos = resultStr.length() - 2;
                    StringBuilder formattedPrice = new StringBuilder();
                    formattedPrice.append(resultStr.substring(0, decimalPos));
                    formattedPrice.append('.');
                    formattedPrice.append(resultStr.substring(decimalPos));

                    // Remove leading zeros before decimal point, but keep at least one digit
                    // For example: "0.50" -> "0.50" (keep), "001.23" -> "1.23"
                    while (formattedPrice.length() > 1 && formattedPrice.charAt(0) == '0' && formattedPrice.charAt(1) != '.') {
                        formattedPrice.deleteCharAt(0);
                    }

                    // Add $ prefix back
                    words[i] = "$" + formattedPrice.toString();
                }
            }
        }

        // Join words back into a sentence
        return String.join(" ", words);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the total number of characters in the input sentence. We need to:

- Split the sentence (O(n))
- Examine each word once (O(n))
- For price words, validate and process them (O(k) for each price word of length k, total O(n))
- Join words back (O(n))

**Space Complexity:** O(n) for storing:

- The array of words (O(n))
- The result string (O(n))
- Temporary strings during processing (O(n) in total)

The space is dominated by the output and intermediate string storage.

## Common Mistakes

1. **Not validating price words properly**: The most common mistake is assuming any word starting with `$` is a price. Words like `"$12a"`, `"$12.5"`, or even `"$"` alone should not be modified. Always check that ALL characters after `$` are digits.

2. **Floating-point precision errors**: Using `float` or `double` for monetary calculations can lead to rounding errors. For example, `$100` with 50% discount should be `$50.00`, not `$50.0000000001`. Use integer arithmetic or arbitrary-precision decimals.

3. **Incorrect formatting**: Forgetting to format to exactly two decimal places, or not handling edge cases like `"$0"` (should become `"$0.00"`) or `"$1"` with 50% discount (should become `"$0.50"`).

4. **Overflow with large numbers**: The problem constraints allow prices with many digits. Using standard integer types (32-bit or 64-bit) can overflow. Use arbitrary-precision integers (Python's `int`, Java's `BigInteger`, JavaScript's `BigInt`).

## When You'll See This Pattern

This problem combines string parsing with careful validation—a common pattern in real-world text processing tasks. You'll see similar patterns in:

1. **Multiply Strings (Medium)**: Both require handling large numbers as strings and performing arithmetic operations without built-in types that might overflow.

2. **Apply Discount Every n Orders (Medium)**: Similar discount application logic, though with different data structures.

3. **Valid Number (Hard)**: Both require validating whether a string represents a valid number according to specific rules.

4. **String to Integer (atoi) (Medium)**: Similar careful parsing of numeric strings with validation rules.

The core technique is: parse carefully, validate according to rules, handle edge cases, and use appropriate data types for precision.

## Key Takeaways

1. **Always validate input according to problem specifications**: Don't assume format—check it explicitly. For price words, verify they start with `$` and the remainder contains only digits.

2. **Use appropriate data types for precision-sensitive calculations**: For financial calculations or large numbers, avoid floating-point types. Use integer arithmetic or arbitrary-precision types.

3. **Pay attention to formatting requirements**: Problems often specify exact output format (like two decimal places). Test edge cases: zero, small numbers, large numbers, and boundary conditions.

Related problems: [Multiply Strings](/problem/multiply-strings), [Apply Discount Every n Orders](/problem/apply-discount-every-n-orders)
