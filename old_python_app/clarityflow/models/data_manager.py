from ..utils.data_handler import load_data, save_data, load_budget_goals, save_budget_goals

class DataManager:
    def __init__(self):
        self.transactions = []
        self.budget_goals = {}
        # Automatically load data on initialization
        self.load()

    def load(self):
        """Load all data from files"""
        self.transactions = load_data('budget_data.csv')
        self.budget_goals = load_budget_goals('budget_goals.json')

    def save_transactions(self):
        """Save transactions to file"""
        save_data('budget_data.csv', self.transactions)

    def save_goals(self):
        """Save budget goals to file"""
        save_budget_goals('budget_goals.json', self.budget_goals)

    def add_transaction(self, transaction):
        """Add a transaction and save"""
        self.transactions.append(transaction)
        self.save_transactions()

    def delete_transaction(self, index):
        """Delete a transaction by index and save"""
        if 0 <= index < len(self.transactions):
            del self.transactions[index]
            self.save_transactions()

    def set_budget_goal(self, category, limit):
        """Set a budget goal and save"""
        self.budget_goals[category] = limit
        self.save_goals()
    
    def remove_budget_goal(self, category):
        """Remove a budget goal and save"""
        if category in self.budget_goals:
            del self.budget_goals[category]
            self.save_goals()

    def get_transactions(self):
        return self.transactions

    def get_budget_goals(self):
        return self.budget_goals
