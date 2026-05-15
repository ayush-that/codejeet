#include <iostream>
#include <vector>
using namespace std;

int largest(const vector<int>& a) {
    // TODO: scan a and return the maximum element.
    // Assume a is non-empty.
    return 0;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << largest(a) << "\n";
    return 0;
}
