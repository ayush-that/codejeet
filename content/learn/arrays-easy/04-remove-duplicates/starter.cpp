#include <iostream>
#include <vector>
using namespace std;

int removeDuplicates(vector<int>& a) {
    // TODO: dedupe a in place and return the new length.
    return 0;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    int k = removeDuplicates(a);
    cout << k << "\n";
    for (int i = 0; i < k; i++) {
        if (i) cout << " ";
        cout << a[i];
    }
    cout << "\n";
    return 0;
}
