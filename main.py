import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import pandas as pd
from datetime import datetime, date
import csv
import os

class BudgetTracker:
    def __init__(self, root):
        """Initialize the Budget Tracker application"""
        self.root = root
        self.root.title("ClarityFlow")
        self.root.geometry("1400x900")
        self.root.configure(bg='#f0f0f0')

        # Data storage - list of dictionaries
        self.transactions = []

        # Budget goals storage - dictionary with category as key and budget limit as value
        self.budget_goals = {}

        # Category lists for dropdown menus
        self.expense_categories = [
            'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
            'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
        ]

        self.income_categories = [
            'Salary', 'Freelance', 'Business', 'Investments', 'Gifts', 'Other'
        ]

        # Load existing data if available
        self.load_data()
        self.load_budget_goals()

        # Create the GUI
        # Search/filter state
        self.search_var = tk.StringVar()
        self.filter_from_var = tk.StringVar()
        self.filter_to_var = tk.StringVar()
        self.filter_category_var = tk.StringVar(value='All')
        self.filter_type_var = tk.StringVar(value='All')
        self.min_amount_var = tk.StringVar()
        self.max_amount_var = tk.StringVar()
        self.filtered_transactions = None

        # Theme / UI colors
        self.theme = 'light'  # 'light' or 'dark'
        self.palettes = {
            'light': {
                'bg': '#f0f0f0', 'fg': '#333333', 'panel_bg': 'white', 'accent': '#2196F3',
                'success': '#4CAF50', 'danger': '#F44336', 'muted': '#999999', 'card_bg': '#f5f5f5', 'progress_bg': '#e0e0e0'
            },
            'dark': {
                'bg': '#2e2e2e', 'fg': '#f0f0f0', 'panel_bg': '#3b3b3b', 'accent': '#1E88E5',
                'success': '#66BB6A', 'danger': '#EF5350', 'muted': '#bbbbbb', 'card_bg': '#444444', 'progress_bg': '#555555'
            }
        }
        self.set_palette(self.theme)

        self.create_widgets()

        # Update summary when app starts
        self.update_summary()

    def create_widgets(self):
        """Create all the GUI widgets and layout"""

        # Main title
        self.title_label = tk.Label(
            self.root,
            text="Personal Budget Tracker",
            font=('Helvetica', 28, 'bold'),
            bg=self.bg_color,
            fg=self.fg_color
        )
        self.title_label.pack(pady=20)

        # Create main container with three columns
        self.main_frame = tk.Frame(self.root, bg=self.bg_color)
        self.main_frame.pack(fill=tk.BOTH, expand=True, padx=20)

        # Left side - Input form and summary
        self.left_frame = tk.Frame(self.main_frame, bg=self.bg_color)
        self.left_frame.pack(side=tk.LEFT, fill=tk.BOTH, padx=(0, 10))

        # Middle side - Budget Goals
        self.middle_frame = tk.Frame(self.main_frame, bg=self.bg_color)
        self.middle_frame.pack(side=tk.LEFT, fill=tk.BOTH, padx=(0, 10), expand=True)

        # Right side - Charts
        self.right_frame = tk.Frame(self.main_frame, bg=self.bg_color)
        self.right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        # Create input form
        self.create_input_form(self.left_frame)

        # Create summary section
        self.create_summary_section(self.left_frame)

        # Create budget goals section
        self.create_budget_goals_section(self.middle_frame)

        # Create budget tracking section
        self.create_budget_tracking_section(self.middle_frame)

        # Create search & filter section
        self.create_search_section(self.left_frame)

        # Create transaction list
        self.create_transaction_list(self.left_frame)

        # Create charts section
        self.create_charts_section(self.right_frame)

        # Create menu bar
        self.create_menu()

        # Apply theme to widgets created so far
        self.apply_theme()

    def set_palette(self, theme):
        """Set color variables for the given theme"""
        p = self.palettes.get(theme, self.palettes['light'])
        self.bg_color = p['bg']
        self.fg_color = p['fg']
        self.panel_bg = p['panel_bg']
        self.accent_color = p['accent']
        self.success_color = p['success']
        self.danger_color = p['danger']
        self.muted_color = p['muted']
        self.card_bg = p['card_bg']
        self.progress_bg = p['progress_bg']

    def toggle_theme(self):
        """Toggle between light and dark themes"""
        self.theme = 'dark' if self.theme == 'light' else 'light'
        self.set_palette(self.theme)
        self.apply_theme()

    def apply_theme(self):
        """Apply current palette to main widgets"""
        try:
            self.root.configure(bg=self.bg_color)
        except Exception:
            pass
        # Title
        try:
            self.title_label.config(bg=self.bg_color, fg=self.fg_color)
        except Exception:
            pass
        # Frames
        for attr in ('main_frame', 'left_frame', 'middle_frame', 'right_frame'):
            if hasattr(self, attr):
                getattr(self, attr).config(bg=self.bg_color)
        # Summary labels
        if hasattr(self, 'income_label'):
            self.income_label.config(bg=self.panel_bg, fg=self.success_color)
        if hasattr(self, 'expense_label'):
            self.expense_label.config(bg=self.panel_bg, fg=self.danger_color)
        if hasattr(self, 'balance_label'):
            self.balance_label.config(bg=self.panel_bg)
        # Transaction list frame background if stored
        if hasattr(self, 'list_frame'):
            try:
                self.list_frame.config(bg=self.panel_bg)
            except Exception:
                pass
        # Budget tracking frame background
        if hasattr(self, 'tracking_frame'):
            try:
                self.tracking_frame.config(bg=self.card_bg)
            except Exception:
                pass

    def create_input_form(self, parent):
        """Create the transaction input form"""

        # Input form frame
        form_frame = tk.LabelFrame(
            parent,
            text="Add Transaction",
            font=('Arial', 14, 'bold'),
            bg=self.panel_bg,
            padx=20,
            pady=15
        )
        form_frame.pack(fill=tk.X, pady=(0, 20))

        # Transaction type selection
        tk.Label(form_frame, text="Type:", font=('Arial', 10), bg=self.panel_bg).grid(row=0, column=0, sticky='w', pady=5)
        self.type_var = tk.StringVar(value="expense")
        type_frame = tk.Frame(form_frame, bg=self.panel_bg)
        type_frame.grid(row=0, column=1, sticky='w', pady=5)

        tk.Radiobutton(
            type_frame, text="Expense", variable=self.type_var,
            value="expense", command=self.on_type_change, bg=self.panel_bg
        ).pack(side=tk.LEFT)

        tk.Radiobutton(
            type_frame, text="Income", variable=self.type_var,
            value="income", command=self.on_type_change, bg=self.panel_bg
        ).pack(side=tk.LEFT, padx=(20, 0))

        # Amount input
        tk.Label(form_frame, text="Amount ($):", font=('Arial', 10), bg=self.panel_bg).grid(row=1, column=0, sticky='w', pady=5)
        self.amount_var = tk.StringVar()
        amount_entry = tk.Entry(form_frame, textvariable=self.amount_var, font=('Arial', 10))
        amount_entry.grid(row=1, column=1, sticky='ew', pady=5)

        # Category selection
        tk.Label(form_frame, text="Category:", font=('Arial', 10), bg=self.panel_bg).grid(row=2, column=0, sticky='w', pady=5)
        self.category_var = tk.StringVar()
        self.category_combo = ttk.Combobox(
            form_frame,
            textvariable=self.category_var,
            values=self.expense_categories,
            font=('Arial', 10),
            state="readonly"
        )
        self.category_combo.grid(row=2, column=1, sticky='ew', pady=5)

        # Description input
        tk.Label(form_frame, text="Description:", font=('Arial', 10), bg=self.panel_bg).grid(row=3, column=0, sticky='w', pady=5)
        self.description_var = tk.StringVar()
        description_entry = tk.Entry(form_frame, textvariable=self.description_var, font=('Arial', 10))
        description_entry.grid(row=3, column=1, sticky='ew', pady=5)

        # Date input
        tk.Label(form_frame, text="Date:", font=('Arial', 10), bg=self.panel_bg).grid(row=4, column=0, sticky='w', pady=5)
        self.date_var = tk.StringVar(value=date.today().strftime('%Y-%m-%d'))
        date_entry = tk.Entry(form_frame, textvariable=self.date_var, font=('Arial', 10))
        date_entry.grid(row=4, column=1, sticky='ew', pady=5)

        # Add button
        add_button = tk.Button(
            form_frame,
            text="Add Transaction",
            command=self.add_transaction,
            bg='#4CAF50',
            fg='white',
            font=('Arial', 12, 'bold'),
            pady=10
        )
        add_button.grid(row=5, column=0, columnspan=2, sticky='ew', pady=(15, 5))

        # Configure grid weights
        form_frame.grid_columnconfigure(1, weight=1)

    def create_summary_section(self, parent):
        """Create the financial summary section"""

        summary_frame = tk.LabelFrame(
            parent,
            text="Financial Summary",
            font=('Arial', 14, 'bold'),
            bg=self.panel_bg,
            padx=20,
            pady=15
        )
        summary_frame.pack(fill=tk.X, pady=(0, 20))

        # Create summary labels
        self.income_label = tk.Label(
            summary_frame,
            text="Total Income: $0.00",
            font=('Arial', 12),
            bg=self.panel_bg,
            fg=self.success_color
        )
        self.income_label.pack(anchor='w', pady=2)

        self.expense_label = tk.Label(
            summary_frame,
            text="Total Expenses: $0.00",
            font=('Arial', 12),
            bg=self.panel_bg,
            fg=self.danger_color
        )
        self.expense_label.pack(anchor='w', pady=2)

        self.balance_label = tk.Label(
            summary_frame,
            text="Balance: $0.00",
            font=('Arial', 14, 'bold'),
            bg=self.panel_bg
        )
        self.balance_label.pack(anchor='w', pady=5)

    def create_transaction_list(self, parent):
        """Create the transaction list display"""

        list_frame = tk.LabelFrame(
            parent,
            text="Recent Transactions",
            font=('Arial', 14, 'bold'),
            bg=self.panel_bg,
            padx=20,
            pady=15
        )
        list_frame.pack(fill=tk.BOTH, expand=True)
        self.list_frame = list_frame

        # Create treeview for transaction list
        columns = ('Date', 'Type', 'Category', 'Description', 'Amount')
        self.transaction_tree = ttk.Treeview(list_frame, columns=columns, show='headings', height=10)

        # Define column headings
        for col in columns:
            self.transaction_tree.heading(col, text=col)
            self.transaction_tree.column(col, width=100)

        # Add scrollbar
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.transaction_tree.yview)
        self.transaction_tree.configure(yscrollcommand=scrollbar.set)

        # Pack treeview and scrollbar
        self.transaction_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # Add delete button
        delete_button = tk.Button(
            list_frame,
            text="Delete Selected",
            command=self.delete_transaction,
            bg='#F44336',
            fg='white',
            font=('Arial', 10)
        )
        delete_button.pack(pady=10)

    def create_search_section(self, parent):
        """Create search and filter widgets"""

        search_frame = tk.LabelFrame(
            parent,
            text="Search & Filter",
            font=('Arial', 12, 'bold'),
            bg=self.panel_bg,
            padx=10,
            pady=10
        )
        search_frame.pack(fill=tk.X, pady=(0, 10))

        # Search text
        tk.Label(search_frame, text="Search:", font=('Arial', 10), bg=self.panel_bg).grid(row=0, column=0, sticky='w')
        search_entry = tk.Entry(search_frame, textvariable=self.search_var, font=('Arial', 10))
        search_entry.grid(row=0, column=1, sticky='ew', padx=5)

        # Type filter
        tk.Label(search_frame, text="Type:", font=('Arial', 10), bg=self.panel_bg).grid(row=0, column=2, sticky='w', padx=(10,0))
        type_combo = ttk.Combobox(search_frame, textvariable=self.filter_type_var, values=['All','Expense','Income'], state='readonly', width=10)
        type_combo.grid(row=0, column=3, sticky='w')

        # Category filter
        categories = ['All'] + sorted(set(self.expense_categories + self.income_categories))
        tk.Label(search_frame, text="Category:", font=('Arial', 10), bg=self.panel_bg).grid(row=1, column=0, sticky='w', pady=5)
        category_combo = ttk.Combobox(search_frame, textvariable=self.filter_category_var, values=categories, state='readonly')
        category_combo.grid(row=1, column=1, sticky='ew', padx=5, pady=5)

        # Date range
        tk.Label(search_frame, text="From (YYYY-MM-DD):", font=('Arial', 10), bg=self.panel_bg).grid(row=1, column=2, sticky='w', padx=(10,0))
        from_entry = tk.Entry(search_frame, textvariable=self.filter_from_var, font=('Arial', 10), width=12)
        from_entry.grid(row=1, column=3, sticky='w')

        tk.Label(search_frame, text="To (YYYY-MM-DD):", font=('Arial', 10), bg=self.panel_bg).grid(row=2, column=2, sticky='w', padx=(10,0), pady=5)
        to_entry = tk.Entry(search_frame, textvariable=self.filter_to_var, font=('Arial', 10), width=12)
        to_entry.grid(row=2, column=3, sticky='w', pady=5)

        # Amount range
        tk.Label(search_frame, text="Min Amount:", font=('Arial', 10), bg=self.panel_bg).grid(row=2, column=0, sticky='w')
        min_entry = tk.Entry(search_frame, textvariable=self.min_amount_var, font=('Arial', 10))
        min_entry.grid(row=2, column=1, sticky='ew', padx=5)

        tk.Label(search_frame, text="Max Amount:", font=('Arial', 10), bg=self.panel_bg).grid(row=3, column=0, sticky='w', pady=5)
        max_entry = tk.Entry(search_frame, textvariable=self.max_amount_var, font=('Arial', 10))
        max_entry.grid(row=3, column=1, sticky='ew', padx=5, pady=5)

        # Buttons
        apply_button = tk.Button(search_frame, text="Apply Filters", command=self.apply_filters, bg='#2196F3', fg='white', font=('Arial', 10, 'bold'))
        apply_button.grid(row=3, column=2, columnspan=1, sticky='ew', padx=(10,0))

        clear_button = tk.Button(search_frame, text="Clear Filters", command=self.clear_filters, bg='#9E9E9E', fg='white', font=('Arial', 10))
        clear_button.grid(row=3, column=3, sticky='ew', padx=(5,0))

        search_frame.grid_columnconfigure(1, weight=1)

    def apply_filters(self):
        """Apply search and filter criteria to transactions and refresh list"""

        filtered = list(self.transactions)

        # Text search (description or category)
        query = self.search_var.get().strip().lower()
        if query:
            filtered = [t for t in filtered if query in t.get('description','').lower() or query in t.get('category','').lower()]

        # Type filter
        ttype = self.filter_type_var.get()
        if ttype and ttype != 'All':
            key = 'income' if ttype.lower() == 'income' else 'expense'
            filtered = [t for t in filtered if t.get('type') == key]

        # Category filter
        cat = self.filter_category_var.get()
        if cat and cat != 'All':
            filtered = [t for t in filtered if t.get('category') == cat]

        # Date range filter
        from_date = self.filter_from_var.get().strip()
        to_date = self.filter_to_var.get().strip()
        try:
            if from_date:
                fd = datetime.strptime(from_date, '%Y-%m-%d').date()
                filtered = [t for t in filtered if datetime.strptime(t['date'], '%Y-%m-%d').date() >= fd]
            if to_date:
                td = datetime.strptime(to_date, '%Y-%m-%d').date()
                filtered = [t for t in filtered if datetime.strptime(t['date'], '%Y-%m-%d').date() <= td]
        except ValueError:
            messagebox.showerror('Error', 'Please enter dates in YYYY-MM-DD format')
            return

        # Amount range filter
        min_amt = self.min_amount_var.get().strip()
        max_amt = self.max_amount_var.get().strip()
        try:
            if min_amt:
                ma = float(min_amt)
                filtered = [t for t in filtered if t.get('amount', 0) >= ma]
            if max_amt:
                mb = float(max_amt)
                filtered = [t for t in filtered if t.get('amount', 0) <= mb]
        except ValueError:
            messagebox.showerror('Error', 'Please enter valid numbers for amount filters')
            return

        self.filtered_transactions = filtered
        self.update_transaction_list()

    def clear_filters(self):
        """Clear all filters and show full transaction list"""
        self.search_var.set('')
        self.filter_from_var.set('')
        self.filter_to_var.set('')
        self.filter_category_var.set('All')
        self.filter_type_var.set('All')
        self.min_amount_var.set('')
        self.max_amount_var.set('')
        self.filtered_transactions = None
        self.update_transaction_list()

    def create_charts_section(self, parent):
        """Create the charts display section"""

        charts_frame = tk.LabelFrame(
            parent,
            text="Financial Charts",
            font=('Arial', 14, 'bold'),
            bg=self.panel_bg,
            padx=20,
            pady=15
        )
        charts_frame.pack(fill=tk.BOTH, expand=True)

        # Create notebook for tabs
        self.chart_notebook = ttk.Notebook(charts_frame)
        self.chart_notebook.pack(fill=tk.BOTH, expand=True)

        # Create frames for different charts
        self.pie_frame = tk.Frame(self.chart_notebook, bg=self.panel_bg)
        self.bar_frame = tk.Frame(self.chart_notebook, bg=self.panel_bg)

        self.chart_notebook.add(self.pie_frame, text="Expense Categories")
        self.chart_notebook.add(self.bar_frame, text="Monthly Overview")

        # Initialize empty charts
        self.create_pie_chart()
        self.create_bar_chart()

    def create_menu(self):
        """Create the application menu bar"""

        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)

        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="Save Data", command=self.save_data)
        file_menu.add_command(label="Load Data", command=self.load_data_dialog)
        file_menu.add_separator()
        file_menu.add_command(label="Export CSV", command=self.export_csv)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.root.quit)

        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Help", menu=help_menu)
        help_menu.add_command(label="About", command=self.show_about)

        # View menu for theme toggle
        view_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="View", menu=view_menu)
        view_menu.add_command(label="Toggle Dark Mode", command=self.toggle_theme)

    def create_budget_goals_section(self, parent):
        """Create the budget goals section for setting category limits"""

        goals_frame = tk.LabelFrame(
            parent,
            text="Budget Goals",
            font=('Arial', 14, 'bold'),
            bg=self.panel_bg,
            padx=20,
            pady=15
        )
        goals_frame.pack(fill=tk.X, pady=(0, 20))

        # Category selection for budget goal
        tk.Label(goals_frame, text="Category:", font=('Arial', 10), bg=self.panel_bg).grid(row=0, column=0, sticky='w', pady=5)
        self.goal_category_var = tk.StringVar()
        goal_category_combo = ttk.Combobox(
            goals_frame,
            textvariable=self.goal_category_var,
            values=self.expense_categories,
            font=('Arial', 10),
            state="readonly"
        )
        goal_category_combo.grid(row=0, column=1, sticky='ew', pady=5)

        # Budget limit input
        tk.Label(goals_frame, text="Monthly Limit ($):", font=('Arial', 10), bg=self.panel_bg).grid(row=1, column=0, sticky='w', pady=5)
        self.goal_limit_var = tk.StringVar()
        limit_entry = tk.Entry(goals_frame, textvariable=self.goal_limit_var, font=('Arial', 10))
        limit_entry.grid(row=1, column=1, sticky='ew', pady=5)

        # Set goal button
        set_button = tk.Button(
            goals_frame,
            text="Set Goal",
            command=self.set_budget_goal,
            bg='#2196F3',
            fg='white',
            font=('Arial', 10, 'bold')
        )
        set_button.grid(row=2, column=0, columnspan=2, sticky='ew', pady=(10, 5))

        # Configure grid weights
        goals_frame.grid_columnconfigure(1, weight=1)

    def create_budget_tracking_section(self, parent):
        """Create section to display budget tracking with progress bars"""

        tracking_frame = tk.LabelFrame(
            parent,
            text="Budget Tracking",
            font=('Arial', 14, 'bold'),
            bg=self.panel_bg,
            padx=20,
            pady=15
        )
        tracking_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 20))

        # Create scrollable frame for budget items
        canvas = tk.Canvas(tracking_frame, bg=self.panel_bg, highlightthickness=0)
        scrollbar = ttk.Scrollbar(tracking_frame, orient=tk.VERTICAL, command=canvas.yview)
        scrollable_frame = tk.Frame(canvas, bg=self.card_bg)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        self.tracking_frame = scrollable_frame

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def set_budget_goal(self):
        """Set a budget goal for a category"""

        category = self.goal_category_var.get()

        if not category:
            messagebox.showerror("Error", "Please select a category")
            return

        try:
            limit = float(self.goal_limit_var.get())
            if limit <= 0:
                raise ValueError("Budget limit must be positive")
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid positive amount")
            return

        # Set the budget goal
        self.budget_goals[category] = limit

        # Clear inputs
        self.goal_category_var.set('')
        self.goal_limit_var.set('')

        # Update displays
        self.update_budget_tracking()
        self.save_budget_goals()

        messagebox.showinfo("Success", f"Budget goal set for {category}: ${limit:.2f}")

    def update_budget_tracking(self):
        """Update the budget tracking display with progress bars"""

        # Clear existing tracking items
        for widget in self.tracking_frame.winfo_children():
            widget.destroy()

        if not self.budget_goals:
            no_goals_label = tk.Label(
                self.tracking_frame,
                text="No budget goals set yet",
                font=('Arial', 12),
                bg=self.card_bg,
                fg=self.muted_color
            )
            no_goals_label.pack(pady=20)
            return

        # Display each budget goal with progress
        for category in sorted(self.budget_goals.keys()):
            limit = self.budget_goals[category]

            # Calculate current spending for this category
            current_spending = sum(
                t['amount'] for t in self.transactions
                if t['type'] == 'expense' and t['category'] == category
            )

            # Calculate percentage
            percentage = (current_spending / limit * 100) if limit > 0 else 0
            percentage = min(percentage, 100)

            # Determine color based on spending level
            if percentage >= 100:
                color = '#F44336'  # Red - over budget
                status = "Over Budget"
            elif percentage >= 80:
                color = '#FF9800'  # Orange - warning
                status = "Warning"
            elif percentage >= 50:
                color = '#FFC107'  # Yellow - caution
                status = "Good"
            else:
                color = '#4CAF50'  # Green - safe
                status = "Safe"

            # Create budget item container
            item_frame = tk.Frame(self.tracking_frame, bg=self.card_bg, relief=tk.FLAT, bd=1)
            item_frame.pack(fill=tk.X, pady=5)

            # Category name and spending info
            info_frame = tk.Frame(item_frame, bg=self.card_bg)
            info_frame.pack(fill=tk.X, padx=10, pady=(8, 2))

            category_label = tk.Label(
                info_frame,
                text=category,
                font=('Arial', 11, 'bold'),
                bg=self.card_bg,
                fg=self.fg_color
            )
            category_label.pack(side=tk.LEFT, anchor='w')

            spending_label = tk.Label(
                info_frame,
                text=f"${current_spending:.2f} / ${limit:.2f}",
                font=('Arial', 10),
                bg=self.card_bg,
                fg=color,
                anchor='e'
            )
            spending_label.pack(side=tk.RIGHT, anchor='e')

            # Progress bar
            progress_frame = tk.Frame(item_frame, bg=self.panel_bg, height=20)
            progress_frame.pack(fill=tk.X, padx=10, pady=2)

            # Background bar (100%)
            bg_bar = tk.Frame(progress_frame, bg=self.progress_bg, height=20)
            bg_bar.pack(fill=tk.X)

            # Foreground bar (current percentage)
            fg_bar = tk.Frame(progress_frame, bg=color, height=20)
            fg_bar.place(x=0, y=0, relwidth=percentage/100, height=20)

            # Percentage text
            percent_label = tk.Label(
                progress_frame,
                text=f"{percentage:.1f}% - {status}",
                font=('Arial', 9),
                bg=color if percentage >= 50 else self.progress_bg,
                fg='white' if percentage >= 50 else self.fg_color
            )
            percent_label.place(relx=0.5, rely=0.5, anchor='center')

            # Delete button
            delete_button = tk.Button(
                item_frame,
                text="Remove Goal",
                command=lambda cat=category: self.remove_budget_goal(cat),
                bg='#F44336',
                fg='white',
                font=('Arial', 9),
                padx=5,
                pady=2
            )
            delete_button.pack(side=tk.RIGHT, padx=10, pady=5)

    def remove_budget_goal(self, category):
        """Remove a budget goal"""

        if messagebox.askyesno("Confirm", f"Remove budget goal for {category}?"):
            del self.budget_goals[category]
            self.update_budget_tracking()
            self.save_budget_goals()

    def save_budget_goals(self):
        """Save budget goals to a JSON file"""

        import json

        try:
            with open('budget_goals.json', 'w', encoding='utf-8') as file:
                json.dump(self.budget_goals, file, indent=2)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save budget goals: {str(e)}")

    def load_budget_goals(self):
        """Load budget goals from JSON file"""

        import json

        if not os.path.exists('budget_goals.json'):
            return

        try:
            with open('budget_goals.json', 'r', encoding='utf-8') as file:
                self.budget_goals = json.load(file)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load budget goals: {str(e)}")

    def on_type_change(self):
        """Handle transaction type change - update category options"""

        if self.type_var.get() == "expense":
            self.category_combo['values'] = self.expense_categories
        else:
            self.category_combo['values'] = self.income_categories

        # Clear current selection
        self.category_var.set('')

    def add_transaction(self):
        """Add a new transaction to the list"""

        # Validate input data
        try:
            amount = float(self.amount_var.get())
            if amount <= 0:
                raise ValueError("Amount must be positive")
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid positive amount")
            return

        if not self.category_var.get():
            messagebox.showerror("Error", "Please select a category")
            return

        if not self.description_var.get().strip():
            messagebox.showerror("Error", "Please enter a description")
            return

        # Validate date format
        try:
            datetime.strptime(self.date_var.get(), '%Y-%m-%d')
        except ValueError:
            messagebox.showerror("Error", "Please enter date in YYYY-MM-DD format")
            return

        # Create transaction dictionary
        transaction = {
            'id': len(self.transactions) + 1,
            'date': self.date_var.get(),
            'type': self.type_var.get(),
            'category': self.category_var.get(),
            'description': self.description_var.get().strip(),
            'amount': amount
        }

        # Add to transactions list
        self.transactions.append(transaction)

        # Clear form inputs
        self.amount_var.set('')
        self.category_var.set('')
        self.description_var.set('')
        self.date_var.set(date.today().strftime('%Y-%m-%d'))

        # Update displays (respecting active filters)
        self.apply_filters()
        self.update_summary()
        self.update_charts()
        self.update_budget_tracking()

        # Save data automatically
        self.save_data()

        messagebox.showinfo("Success", "Transaction added successfully!")
#Delete transaction
    def delete_transaction(self):
        """Delete selected transaction from the list"""

        selected_item = self.transaction_tree.selection()
        if not selected_item:
            messagebox.showwarning("Warning", "Please select a transaction to delete")
            return

        # Get the selected transaction index
        item_index = self.transaction_tree.index(selected_item[0])

        # Confirm deletion
        if messagebox.askyesno("Confirm", "Are you sure you want to delete this transaction?"):
            # Remove from transactions list
            del self.transactions[item_index]

            # Update displays
            self.apply_filters()
            self.update_summary()
            self.update_charts()
            self.update_budget_tracking()

            # Save data automatically
            self.save_data()
# Update transaction list display
    def update_transaction_list(self):
        """Update the transaction list display"""

        # Clear existing items
        for item in self.transaction_tree.get_children():
            self.transaction_tree.delete(item)

        # Determine which list to show (filtered or full)
        source = self.filtered_transactions if self.filtered_transactions is not None else self.transactions

        # Add transactions (most recent first)
        for transaction in reversed(source):
            self.transaction_tree.insert('', 'end', values=(
                transaction['date'],
                transaction['type'].title(),
                transaction['category'],
                transaction['description'],
                f"${transaction['amount']:.2f}"
            ))
# Update financial summary
    def update_summary(self):
        """Update the financial summary display"""

        # Calculate totals
        total_income = sum(t['amount'] for t in self.transactions if t['type'] == 'income')
        total_expenses = sum(t['amount'] for t in self.transactions if t['type'] == 'expense')
        balance = total_income - total_expenses

        # Update labels
        self.income_label.config(text=f"Total Income: ${total_income:.2f}")
        self.expense_label.config(text=f"Total Expenses: ${total_expenses:.2f}")

        # Color balance based on positive/negative
        balance_color = '#4CAF50' if balance >= 0 else '#F44336'
        self.balance_label.config(
            text=f"Balance: ${balance:.2f}",
            fg=balance_color
        )
#Chart to show Expenses
    def create_pie_chart(self):
        """Create pie chart for expense categories"""

        # Clear previous chart
        for widget in self.pie_frame.winfo_children():
            widget.destroy()

        # Get expense data by category
        expense_data = {}
        for transaction in self.transactions:
            if transaction['type'] == 'expense':
                category = transaction['category']
                expense_data[category] = expense_data.get(category, 0) + transaction['amount']

        if not expense_data:
            # Show message if no data
            no_data_label = tk.Label(
                self.pie_frame,
                text="No expense data to display",
                font=('Arial', 14),
                bg=self.panel_bg,
                fg=self.muted_color
            )
            no_data_label.pack(expand=True)
            return

        # Create matplotlib figure
        fig, ax = plt.subplots(figsize=(8, 6))
        fig.patch.set_facecolor('white')

        # Create pie chart
        categories = list(expense_data.keys())
        amounts = list(expense_data.values())
        colors = plt.cm.Pastel1(range(len(categories)))

        result = ax.pie(
            amounts,
            labels=categories,
            autopct='%1.1f%%',
            colors=colors,
            startangle=90
        )

        # Handle different return types from pie chart
        if len(result) == 3:
            wedges, texts, autotexts = result
        else:
            wedges, texts = result
            autotexts = []

        # Improve text appearance
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')

        ax.set_title('Expenses by Category', fontsize=16, fontweight='bold', pad=20)

        # Embed chart in tkinter
        canvas = FigureCanvasTkAgg(fig, self.pie_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

    def create_bar_chart(self):
        """Create bar chart for monthly income vs expenses"""

        # Clear previous chart
        for widget in self.bar_frame.winfo_children():
            widget.destroy()

        # Group transactions by month
        monthly_data = {}
        for transaction in self.transactions:
            month = transaction['date'][:7]  # YYYY-MM format
            if month not in monthly_data:
                monthly_data[month] = {'income': 0, 'expenses': 0}

            if transaction['type'] == 'income':
                monthly_data[month]['income'] += transaction['amount']
            else:
                monthly_data[month]['expenses'] += transaction['amount']

        if not monthly_data:
            # Show message if no data
            no_data_label = tk.Label(
                self.bar_frame,
                text="No transaction data to display",
                font=('Arial', 14),
                bg=self.panel_bg,
                fg=self.muted_color
            )
            no_data_label.pack(expand=True)
            return

        # Create matplotlib figure
        fig, ax = plt.subplots(figsize=(10, 6))
        fig.patch.set_facecolor('white')

        # Prepare data for plotting
        months = sorted(monthly_data.keys())
        income_amounts = [monthly_data[month]['income'] for month in months]
        expense_amounts = [monthly_data[month]['expenses'] for month in months]

        # Create bar chart
        x = range(len(months))
        width = 0.35

        ax.bar([i - width/2 for i in x], income_amounts, width, label='Income', color='#4CAF50')
        ax.bar([i + width/2 for i in x], expense_amounts, width, label='Expenses', color='#F44336')

        # Customize chart
        ax.set_xlabel('Month', fontweight='bold')
        ax.set_ylabel('Amount ($)', fontweight='bold')
        ax.set_title('Monthly Income vs Expenses', fontsize=16, fontweight='bold', pad=20)
        ax.set_xticks(x)
        ax.set_xticklabels(months, rotation=45)
        ax.legend()
        ax.grid(True, alpha=0.3)

        # Format y-axis to show currency
        from matplotlib.ticker import FuncFormatter
        ax.yaxis.set_major_formatter(FuncFormatter(lambda x, p: f'${x:,.0f}'))

        plt.tight_layout()

        # Embed chart in tkinter
        canvas = FigureCanvasTkAgg(fig, self.bar_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

    def update_charts(self):
        """Update both charts with current data"""
        self.create_pie_chart()
        self.create_bar_chart()

    def save_data(self):
        """Save transactions to CSV file"""

        if not self.transactions:
            return

        try:
            with open('budget_data.csv', 'w', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=['id', 'date', 'type', 'category', 'description', 'amount'])
                writer.writeheader()
                writer.writerows(self.transactions)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save data: {str(e)}")

    def load_data(self):
        """Load transactions from CSV file"""

        if not os.path.exists('budget_data.csv'):
            return

        try:
            with open('budget_data.csv', 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                self.transactions = []
                for row in reader:
                    row['id'] = int(row['id'])
                    row['amount'] = float(row['amount'])
                    self.transactions.append(row)

            # Update displays if GUI is ready
            if hasattr(self, 'transaction_tree'):
                # Respect active filters
                if getattr(self, 'filtered_transactions', None) is not None:
                    self.apply_filters()
                else:
                    self.update_transaction_list()
                self.update_summary()
                self.update_charts()

        except Exception as e:
            messagebox.showerror("Error", f"Failed to load data: {str(e)}")

    def load_data_dialog(self):
        """Load data from a selected CSV file"""

        filename = filedialog.askopenfilename(
            title="Load Budget Data",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )

        if filename:
            try:
                with open(filename, 'r', encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    self.transactions = []
                    for row in reader:
                        row['id'] = int(row['id'])
                        row['amount'] = float(row['amount'])
                        self.transactions.append(row)

                self.update_transaction_list()
                self.update_summary()
                self.update_charts()

                messagebox.showinfo("Success", f"Data loaded from {filename}")

            except Exception as e:
                messagebox.showerror("Error", f"Failed to load data: {str(e)}")

    def export_csv(self):
        """Export transactions to a CSV file"""

        if not self.transactions:
            messagebox.showwarning("Warning", "No transactions to export")
            return

        filename = filedialog.asksaveasfilename(
            title="Export Budget Data",
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )

        if filename:
            try:
                with open(filename, 'w', newline='', encoding='utf-8') as file:
                    writer = csv.DictWriter(file, fieldnames=['id', 'date', 'type', 'category', 'description', 'amount'])
                    writer.writeheader()
                    writer.writerows(self.transactions)

                messagebox.showinfo("Success", f"Data exported to {filename}")

            except Exception as e:
                messagebox.showerror("Error", f"Failed to export data: {str(e)}")

    def show_about(self):
        """Show about dialog"""

        about_text = """
Personal Budget Tracker v1.0

A comprehensive desktop application for tracking personal finances.

Features:
• Add income and expense transactions
• Categorize transactions
• View financial summaries
• Interactive charts and graphs
• Save/load data from CSV files

Developed in Python using Tkinter and Matplotlib.
        """

        messagebox.showinfo("About", about_text)

def main():
    """Main function to run the Budget Tracker application"""

    root = tk.Tk()

    app = BudgetTracker(root)

    root.mainloop()

if __name__ == "__main__":
    main()
