from datetime import datetime

# Sample transactions to test filter logic
transactions = [
    {'id': 1, 'date': '2025-11-01', 'type': 'expense', 'category': 'Food & Dining', 'description': 'Lunch', 'amount': 12.5},
    {'id': 2, 'date': '2025-11-02', 'type': 'expense', 'category': 'Transportation', 'description': 'Taxi', 'amount': 25.0},
    {'id': 3, 'date': '2025-11-03', 'type': 'income', 'category': 'Salary', 'description': 'October Salary', 'amount': 3000.0},
    {'id': 4, 'date': '2025-10-28', 'type': 'expense', 'category': 'Shopping', 'description': 'Clothes', 'amount': 120.0},
    {'id': 5, 'date': '2025-09-15', 'type': 'expense', 'category': 'Food & Dining', 'description': 'Groceries', 'amount': 80.0},
    {'id': 6, 'date': '2025-11-10', 'type': 'expense', 'category': 'Entertainment', 'description': 'Movie night', 'amount': 15.0},
    {'id': 7, 'date': '2025-11-11', 'type': 'expense', 'category': 'Food & Dining', 'description': 'Dinner with friends', 'amount': 60.0},
]


def filter_transactions(transactions, query='', ttype='All', category='All', from_date='', to_date='', min_amt='', max_amt=''):
    filtered = list(transactions)

    q = (query or '').strip().lower()
    if q:
        filtered = [t for t in filtered if q in t.get('description','').lower() or q in t.get('category','').lower()]

    if ttype and ttype != 'All':
        key = 'income' if ttype.lower() == 'income' else 'expense'
        filtered = [t for t in filtered if t.get('type') == key]

    if category and category != 'All':
        filtered = [t for t in filtered if t.get('category') == category]

    try:
        if from_date:
            fd = datetime.strptime(from_date, '%Y-%m-%d').date()
            filtered = [t for t in filtered if datetime.strptime(t['date'], '%Y-%m-%d').date() >= fd]
        if to_date:
            td = datetime.strptime(to_date, '%Y-%m-%d').date()
            filtered = [t for t in filtered if datetime.strptime(t['date'], '%Y-%m-%d').date() <= td]
    except ValueError:
        raise

    try:
        if min_amt:
            ma = float(min_amt)
            filtered = [t for t in filtered if t.get('amount', 0) >= ma]
        if max_amt:
            mb = float(max_amt)
            filtered = [t for t in filtered if t.get('amount', 0) <= mb]
    except ValueError:
        raise

    return filtered


# Test cases
cases = [
    (dict(query='food'), 3, 'text search category/description'),
    (dict(ttype='Income'), 1, 'type filter income'),
    (dict(ttype='Expense'), 6, 'type filter expense'),
    (dict(category='Food & Dining'), 3, 'category filter'),
    (dict(from_date='2025-11-01', to_date='2025-11-30'), 5, 'date range filter for Nov 2025'),
    (dict(min_amt='20', max_amt='100'), 3, 'amount range 20-100'),
    (dict(query='dinner', category='Food & Dining'), 1, 'combined text+category'),
]

for params, expected_count, desc in cases:
    res = filter_transactions(transactions, **params)
    print(f"Test: {desc} -> found {len(res)} items (expected {expected_count})")
    if len(res) != expected_count:
        print("MISMATCH: \n", res)
        raise SystemExit(1)

print('All filter tests passed successfully')
