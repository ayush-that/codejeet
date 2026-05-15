def remove_duplicates(a):
    # TODO: dedupe a in place and return the new length.
    return 0


n = int(input())
a = list(map(int, input().split())) if n > 0 else []
k = remove_duplicates(a)
print(k)
print(" ".join(str(x) for x in a[:k]))
