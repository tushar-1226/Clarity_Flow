import csv
import os
import json
from datetime import datetime

def load_data(filename):
    """Load transactions from CSV file"""
    if not os.path.exists(filename):
        return []

    try:
        with open(filename, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            transactions = []
            for row in reader:
                row['id'] = int(row['id'])
                row['amount'] = float(row['amount'])
                transactions.append(row)
        return transactions
    except Exception as e:
        print(f"Error loading data: {e}")
        return []

def save_data(filename, transactions):
    """Save transactions to CSV file"""
    if not transactions:
        return

    try:
        with open(filename, 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=['id', 'date', 'type', 'category', 'description', 'amount'])
            writer.writeheader()
            writer.writerows(transactions)
    except Exception as e:
        print(f"Error saving data: {e}")

def load_budget_goals(filename):
    """Load budget goals from JSON file"""
    if not os.path.exists(filename):
        return {}

    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading budget goals: {e}")
        return {}

def save_budget_goals(filename, budget_goals):
    """Save budget goals to a JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(budget_goals, file, indent=2)
    except Exception as e:
        print(f"Error saving budget goals: {e}")
