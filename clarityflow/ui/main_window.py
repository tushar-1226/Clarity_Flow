import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import customtkinter as ctk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import pandas as pd
from datetime import datetime, date
import csv
import os
from ..models.data_manager import DataManager

# Initialize CustomTkinter
ctk.set_appearance_mode("System")  # Modes: "System" (standard), "Dark", "Light"
ctk.set_default_color_theme("blue")  # Themes: "blue" (standard), "green", "dark-blue"

class BudgetTracker(ctk.CTk):
    def __init__(self):
        """Initialize the Budget Tracker application"""
        super().__init__()
        
        self.title("ClarityFlow")
        self.geometry("1400x900")
        
        # Configure grid layout (4x4)
        self.grid_columnconfigure(1, weight=1)
        self.grid_columnconfigure((2, 3), weight=0)
        self.grid_rowconfigure((0, 1, 2), weight=1)

        # Data storage
        self.data_manager = DataManager()

        # Category lists for dropdown menus
        self.expense_categories = [
            'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
            'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
        ]

        self.income_categories = [
            'Salary', 'Freelance', 'Business', 'Investments', 'Gifts', 'Other'
        ]

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
        
        self.create_widgets()

        # Update summary when app starts
        self.update_summary()

    @property
    def transactions(self):
        return self.data_manager.transactions

    @transactions.setter
    def transactions(self, value):
        self.data_manager.transactions = value

    @property
    def budget_goals(self):
        return self.data_manager.budget_goals

    @budget_goals.setter
    def budget_goals(self, value):
        self.data_manager.budget_goals = value

    def create_widgets(self):
        """Create all the GUI widgets and layout"""

        # Main title
        self.title_label = ctk.CTkLabel(
            self,
            text="Personal Budget Tracker",
            font=('Helvetica', 28, 'bold')
        )
        self.title_label.grid(row=0, column=0, columnspan=2, pady=(20, 10), sticky="ew")

        # Left side - Input form and summary (Sidebar)
        self.sidebar_frame = ctk.CTkFrame(self, width=300, corner_radius=0)
        self.sidebar_frame.grid(row=1, column=0, rowspan=4, sticky="nsew")
        self.sidebar_frame.grid_rowconfigure(6, weight=1)

        # Create input form in sidebar
        self.create_input_form(self.sidebar_frame)

        # Create summary section in sidebar
        self.create_summary_section(self.sidebar_frame)
        
        # Create budget goals section in sidebar
        self.create_budget_goals_section(self.sidebar_frame)
        
        # Create menu (appearance mode) in sidebar
        self.create_sidebar_menu(self.sidebar_frame)
        
        # Right side container
        self.right_frame = ctk.CTkScrollableFrame(self, label_text="Dashboard")
        self.right_frame.grid(row=1, column=1, padx=(20, 20), pady=(20, 20), sticky="nsew")
        self.right_frame.grid_columnconfigure(1, weight=1)

        # Create search & filter section
        self.create_search_section(self.right_frame)

        # Create charts section
        self.create_charts_section(self.right_frame)

        # Create transaction list
        self.create_transaction_list(self.right_frame)

        # Create budget tracking section
        self.create_budget_tracking_section(self.right_frame)

    def create_sidebar_menu(self, parent):
        """Create appearance mode menu in sidebar"""
        self.appearance_mode_label = ctk.CTkLabel(parent, text="Appearance Mode:", anchor="w")
        self.appearance_mode_label.pack(padx=20, pady=(20, 0), anchor="w")
        
        self.appearance_mode_optionemenu = ctk.CTkOptionMenu(
            parent, 
            values=["System", "Light", "Dark"],
            command=self.change_appearance_mode_event
        )
        self.appearance_mode_optionemenu.pack(padx=20, pady=(10, 20), anchor="w")
        
    def change_appearance_mode_event(self, new_appearance_mode: str):
        ctk.set_appearance_mode(new_appearance_mode)

    def create_input_form(self, parent):
        """Create the transaction input form"""

        # Input form frame
        form_frame = ctk.CTkFrame(parent)
        form_frame.pack(fill="x", pady=(0, 20), padx=20)
        
        # Title for the section
        ctk.CTkLabel(form_frame, text="Add Transaction", font=('Arial', 14, 'bold')).pack(pady=10)

        # Transaction type selection
        type_frame = ctk.CTkFrame(form_frame, fg_color="transparent")
        type_frame.pack(fill="x", padx=10, pady=5)
        
        self.type_var = tk.StringVar(value="expense")
        ctk.CTkRadioButton(
            type_frame, text="Expense", variable=self.type_var,
            value="expense", command=self.on_type_change
        ).pack(side="left", padx=(0, 10))

        ctk.CTkRadioButton(
            type_frame, text="Income", variable=self.type_var,
            value="income", command=self.on_type_change
        ).pack(side="left")

        # Amount input
        ctk.CTkLabel(form_frame, text="Amount ($):", anchor="w").pack(fill="x", padx=10, pady=(5, 0))
        self.amount_var = tk.StringVar()
        amount_entry = ctk.CTkEntry(form_frame, textvariable=self.amount_var, placeholder_text="0.00")
        amount_entry.pack(fill="x", padx=10, pady=(0, 5))

        # Category selection
        ctk.CTkLabel(form_frame, text="Category:", anchor="w").pack(fill="x", padx=10, pady=(5, 0))
        self.category_var = tk.StringVar()
        self.category_combo = ctk.CTkComboBox(
            form_frame,
            variable=self.category_var,
            values=self.expense_categories
        )
        self.category_combo.pack(fill="x", padx=10, pady=(0, 5))

        # Description input
        ctk.CTkLabel(form_frame, text="Description:", anchor="w").pack(fill="x", padx=10, pady=(5, 0))
        self.description_var = tk.StringVar()
        description_entry = ctk.CTkEntry(form_frame, textvariable=self.description_var, placeholder_text="Description")
        description_entry.pack(fill="x", padx=10, pady=(0, 5))

        # Date input
        ctk.CTkLabel(form_frame, text="Date (YYYY-MM-DD):", anchor="w").pack(fill="x", padx=10, pady=(5, 0))
        self.date_var = tk.StringVar(value=date.today().strftime('%Y-%m-%d'))
        date_entry = ctk.CTkEntry(form_frame, textvariable=self.date_var)
        date_entry.pack(fill="x", padx=10, pady=(0, 5))

        # Add button
        add_button = ctk.CTkButton(
            form_frame,
            text="Add Transaction",
            command=self.add_transaction,
            fg_color="#4CAF50", hover_color="#388E3C"
        )
        add_button.pack(fill="x", padx=10, pady=15)

    def create_summary_section(self, parent):
        """Create the financial summary section"""

        summary_frame = ctk.CTkFrame(parent)
        summary_frame.pack(fill="x", pady=(0, 20), padx=20)
        
        ctk.CTkLabel(summary_frame, text="Financial Summary", font=('Arial', 14, 'bold')).pack(pady=10)

        # Create summary labels
        self.income_label = ctk.CTkLabel(
            summary_frame,
            text="Total Income: $0.00",
            font=('Arial', 12),
            text_color='#4CAF50',
            anchor="w"
        )
        self.income_label.pack(fill="x", padx=10, pady=2)

        self.expense_label = ctk.CTkLabel(
            summary_frame,
            text="Total Expenses: $0.00",
            font=('Arial', 12),
            text_color='#F44336',
            anchor="w"
        )
        self.expense_label.pack(fill="x", padx=10, pady=2)

        self.balance_label = ctk.CTkLabel(
            summary_frame,
            text="Balance: $0.00",
            font=('Arial', 14, 'bold'),
            anchor="w"
        )
        self.balance_label.pack(fill="x", padx=10, pady=(5, 10))

    def create_transaction_list(self, parent):
        """Create the transaction list display"""

        list_frame = ctk.CTkFrame(parent)
        list_frame.pack(fill="both", expand=True, pady=(0, 20))
        self.list_frame = list_frame
        
        # Header
        header_frame = ctk.CTkFrame(list_frame, fg_color="transparent")
        header_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(header_frame, text="Recent Transactions", font=('Arial', 14, 'bold')).pack(side="left")
        
        # Add delete button to header
        delete_button = ctk.CTkButton(
            header_frame,
            text="Delete Selected",
            command=self.delete_transaction,
            fg_color="#F44336", hover_color="#D32F2F",
            width=100, height=24
        )
        delete_button.pack(side="right")

        # Create treeview for transaction list
        # Note: Treeview is a ttk widget, styling it to match ctk is limited but we can try basic config
        tree_frame = ctk.CTkFrame(list_frame, fg_color="transparent")
        tree_frame.pack(fill="both", expand=True, padx=10, pady=(0, 10))
        
        columns = ('Date', 'Type', 'Category', 'Description', 'Amount')
        self.transaction_tree = ttk.Treeview(tree_frame, columns=columns, show='headings', height=10)

        # Define column headings
        for col in columns:
            self.transaction_tree.heading(col, text=col)
            self.transaction_tree.column(col, width=100)

        # Add scrollbar
        scrollbar = ttk.Scrollbar(tree_frame, orient="vertical", command=self.transaction_tree.yview)
        self.transaction_tree.configure(yscrollcommand=scrollbar.set)

        # Pack treeview and scrollbar
        self.transaction_tree.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Style the treeview
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Treeview", rowheight=25)

    def create_search_section(self, parent):
        """Create search and filter widgets"""

        search_frame = ctk.CTkFrame(parent)
        search_frame.pack(fill="x", pady=(0, 20))
        
        ctk.CTkLabel(search_frame, text="Search & Filter", font=('Arial', 12, 'bold')).pack(pady=5)
        
        # Grid layout for filters
        filter_grid = ctk.CTkFrame(search_frame, fg_color="transparent")
        filter_grid.pack(fill="x", padx=10, pady=5)

        # Row 1: Search Text & Type
        ctk.CTkLabel(filter_grid, text="Search:").grid(row=0, column=0, sticky="w", padx=5)
        search_entry = ctk.CTkEntry(filter_grid, textvariable=self.search_var, placeholder_text="Search text...")
        search_entry.grid(row=0, column=1, sticky="ew", padx=5, pady=5)

        ctk.CTkLabel(filter_grid, text="Type:").grid(row=0, column=2, sticky="w", padx=5)
        type_combo = ctk.CTkComboBox(filter_grid, variable=self.filter_type_var, values=['All','Expense','Income'])
        type_combo.grid(row=0, column=3, sticky="w", padx=5, pady=5)

        # Row 2: Category & From Date
        categories = ['All'] + sorted(set(self.expense_categories + self.income_categories))
        ctk.CTkLabel(filter_grid, text="Category:").grid(row=1, column=0, sticky="w", padx=5)
        category_combo = ctk.CTkComboBox(filter_grid, variable=self.filter_category_var, values=categories)
        category_combo.grid(row=1, column=1, sticky="ew", padx=5, pady=5)

        ctk.CTkLabel(filter_grid, text="From:").grid(row=1, column=2, sticky="w", padx=5)
        from_entry = ctk.CTkEntry(filter_grid, textvariable=self.filter_from_var, placeholder_text="YYYY-MM-DD")
        from_entry.grid(row=1, column=3, sticky="w", padx=5, pady=5)

        # Row 3: To Date & Min Amount
        ctk.CTkLabel(filter_grid, text="To:").grid(row=2, column=2, sticky="w", padx=5)
        to_entry = ctk.CTkEntry(filter_grid, textvariable=self.filter_to_var, placeholder_text="YYYY-MM-DD")
        to_entry.grid(row=2, column=3, sticky="w", padx=5, pady=5)
        
        ctk.CTkLabel(filter_grid, text="Min Amt:").grid(row=2, column=0, sticky="w", padx=5)
        min_entry = ctk.CTkEntry(filter_grid, textvariable=self.min_amount_var)
        min_entry.grid(row=2, column=1, sticky="ew", padx=5, pady=5)

        # Row 4: Max Amount & Buttons
        ctk.CTkLabel(filter_grid, text="Max Amt:").grid(row=3, column=0, sticky="w", padx=5)
        max_entry = ctk.CTkEntry(filter_grid, textvariable=self.max_amount_var)
        max_entry.grid(row=3, column=1, sticky="ew", padx=5, pady=5)

        # Buttons
        button_frame = ctk.CTkFrame(filter_grid, fg_color="transparent")
        button_frame.grid(row=3, column=2, columnspan=2, sticky="ew", pady=5)
        
        apply_button = ctk.CTkButton(button_frame, text="Apply", command=self.apply_filters, width=80)
        apply_button.pack(side="left", padx=5)

        clear_button = ctk.CTkButton(button_frame, text="Clear", command=self.clear_filters, fg_color="gray", hover_color="gray40", width=80)
        clear_button.pack(side="left", padx=5)

        filter_grid.grid_columnconfigure(1, weight=1)

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

        charts_frame = ctk.CTkFrame(parent)
        charts_frame.pack(fill="both", expand=True, pady=20)
        
        ctk.CTkLabel(charts_frame, text="Financial Charts", font=('Arial', 14, 'bold')).pack(pady=5)

        # Create tabview for charts
        self.chart_tabview = ctk.CTkTabview(charts_frame)
        self.chart_tabview.pack(fill="both", expand=True, padx=10, pady=10)
        
        self.chart_tabview.add("Expense Categories")
        self.chart_tabview.add("Monthly Overview")
        
        self.pie_frame = self.chart_tabview.tab("Expense Categories")
        self.bar_frame = self.chart_tabview.tab("Monthly Overview")

        # Initialize empty charts
        self.create_pie_chart()
        self.create_bar_chart()

    def create_menu(self):
        """Create the application menu bar"""

        # CustomTkinter doesn't have a native menu bar, but we can standard tkinter menu on the root window
        # self is the root ctk.CTk window which inherits from tk.Tk
        menubar = tk.Menu(self)
        self.configure(menu=menubar)

        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="Save Data", command=self.save_data)
        file_menu.add_command(label="Load Data", command=self.load_data_dialog)
        file_menu.add_separator()
        file_menu.add_command(label="Export CSV", command=self.export_csv)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.quit)

        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Help", menu=help_menu)
        help_menu.add_command(label="About", command=self.show_about)

    def create_budget_goals_section(self, parent):
        """Create the budget goals section for setting category limits"""

        goals_frame = ctk.CTkFrame(parent)
        goals_frame.pack(fill="x", pady=(0, 20), padx=20)
        
        ctk.CTkLabel(goals_frame, text="Budget Goals", font=('Arial', 14, 'bold')).pack(pady=10)

        # Category selection for budget goal
        ctk.CTkLabel(goals_frame, text="Category:", anchor="w").pack(fill="x", padx=10, pady=(5, 0))
        self.goal_category_var = tk.StringVar()
        goal_category_combo = ctk.CTkComboBox(
            goals_frame,
            variable=self.goal_category_var,
            values=self.expense_categories
        )
        goal_category_combo.pack(fill="x", padx=10, pady=(0, 5))

        # Budget limit input
        ctk.CTkLabel(goals_frame, text="Monthly Limit ($):", anchor="w").pack(fill="x", padx=10, pady=(5, 0))
        self.goal_limit_var = tk.StringVar()
        limit_entry = ctk.CTkEntry(goals_frame, textvariable=self.goal_limit_var, placeholder_text="0.00")
        limit_entry.pack(fill="x", padx=10, pady=(0, 5))

        # Set goal button
        set_button = ctk.CTkButton(
            goals_frame,
            text="Set Goal",
            command=self.set_budget_goal,
            fg_color="#2196F3", hover_color="#1E88E5"
        )
        set_button.pack(fill="x", padx=10, pady=15)

    def create_budget_tracking_section(self, parent):
        """Create section to display budget tracking with progress bars"""
        
        # We use a scrollable frame for the list
        self.tracking_frame = ctk.CTkScrollableFrame(parent, label_text="Budget Tracking")
        self.tracking_frame.pack(fill="both", expand=True, padx=20, pady=(0, 20))

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

        self.data_manager.set_budget_goal(category, limit)

        # Clear inputs
        self.goal_category_var.set('')
        self.goal_limit_var.set('')

        # Update displays
        self.update_budget_tracking()

        messagebox.showinfo("Success", f"Budget goal set for {category}: ${limit:.2f}")

    def update_budget_tracking(self):
        """Update the budget tracking display with progress bars"""
        
        # Clear existing tracking items
        for widget in self.tracking_frame.winfo_children():
            widget.destroy()

        if not self.budget_goals:
            ctk.CTkLabel(
                self.tracking_frame,
                text="No budget goals set yet",
                font=('Arial', 12),
                text_color="gray"
            ).pack(pady=20)
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
            percentage = (current_spending / limit) if limit > 0 else 0
            
            # Determine color based on spending level
            if percentage >= 1.0:
                progress_color = '#F44336'  # Red - over budget
                status = "Over Budget"
            elif percentage >= 0.8:
                progress_color = '#FF9800'  # Orange - warning
                status = "Warning"
            elif percentage >= 0.5:
                progress_color = '#FFC107'  # Yellow - caution
                status = "Good"
            else:
                progress_color = '#4CAF50'  # Green - safe
                status = "Safe"
                
            percentage_clamped = min(percentage, 1.0)

            # Create budget item container
            item_frame = ctk.CTkFrame(self.tracking_frame, fg_color="transparent")
            item_frame.pack(fill="x", pady=5)

            # Category name and spending info
            info_frame = ctk.CTkFrame(item_frame, fg_color="transparent")
            info_frame.pack(fill="x", padx=5, pady=(5, 0))

            ctk.CTkLabel(info_frame, text=category, font=('Arial', 12, 'bold')).pack(side="left")
            
            ctk.CTkLabel(
                info_frame, 
                text=f"${current_spending:.2f} / ${limit:.2f}",
                text_color=progress_color
            ).pack(side="right")

            # Progress bar
            progress_bar = ctk.CTkProgressBar(item_frame, progress_color=progress_color)
            progress_bar.pack(fill="x", padx=5, pady=5)
            progress_bar.set(percentage_clamped)

            # Status and Delete
            bottom_frame = ctk.CTkFrame(item_frame, fg_color="transparent")
            bottom_frame.pack(fill="x", padx=5, pady=(0, 5))
            
            ctk.CTkLabel(
                bottom_frame,
                text=f"{percentage*100:.1f}% - {status}",
                font=('Arial', 10),
                text_color=progress_color
            ).pack(side="left")

            ctk.CTkButton(
                bottom_frame,
                text="Remove",
                command=lambda cat=category: self.remove_budget_goal(cat),
                fg_color="#F44336", hover_color="#D32F2F",
                width=60, height=20,
                font=('Arial', 10)
            ).pack(side="right")

    def remove_budget_goal(self, category):
        """Remove a budget goal"""

        if messagebox.askyesno("Confirm", f"Remove budget goal for {category}?"):
            self.data_manager.remove_budget_goal(category)
            self.update_budget_tracking()


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
        self.data_manager.add_transaction(transaction)

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
            self.data_manager.delete_transaction(item_index)

            # Update displays
            self.apply_filters()
            self.update_summary()
            self.update_charts()
            self.update_budget_tracking()
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
        """Update the financial summary labels"""

        # Calculate totals
        total_income = sum(t['amount'] for t in self.transactions if t['type'] == 'income')
        total_expenses = sum(t['amount'] for t in self.transactions if t['type'] == 'expense')
        balance = total_income - total_expenses

        # Update labels (Using configure for CTk)
        self.income_label.configure(text=f"Total Income: ${total_income:.2f}")
        self.expense_label.configure(text=f"Total Expenses: ${total_expenses:.2f}")

        # Balance styling
        balance_color = '#4CAF50' if balance >= 0 else '#F44336'
        self.balance_label.configure(
            text=f"Balance: ${balance:.2f}",
            text_color=balance_color
        )
#Chart to show Expenses
    def create_pie_chart(self):
        """Create pie chart for expenses by category"""

        # Clear previous chart
        for widget in self.pie_frame.winfo_children():
            widget.destroy()

        # Calculate expenses by category
        category_expenses = {}
        for transaction in self.transactions:
            if transaction['type'] == 'expense':
                cat = transaction['category']
                category_expenses[cat] = category_expenses.get(cat, 0) + transaction['amount']

        if not category_expenses:
            # Show message if no data
            ctk.CTkLabel(
                self.pie_frame,
                text="No expense data to display",
                font=('Arial', 14),
                text_color="gray"
            ).pack(expand=True)
            return

        # Prepare data for plotting
        labels = list(category_expenses.keys())
        sizes = list(category_expenses.values())

        # Create matplotlib figure with transparent background
        fig, ax = plt.subplots(figsize=(6, 5))
        fig.patch.set_alpha(0)  # Transparent figure background
        ax.set_facecolor('none') # Transparent axes background

        # Colors for pie slices
        colors = ['#2196F3', '#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#00BCD4', '#FF5722', '#795548', '#607D8B']

        # Determine text color based on theme
        text_color = "white" if ctk.get_appearance_mode() == "Dark" else "black" # Simple check, or just default to something visible

        # Plot
        wedges, texts, autotexts = ax.pie(
            sizes, labels=labels, autopct='%1.1f%%',
            startangle=90, colors=colors[:len(labels)],
            textprops=dict(color=text_color)
        )
        
        ax.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle

        # Embed chart in tkinter
        canvas = FigureCanvasTkAgg(fig, self.pie_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill="both", expand=True)

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
            ctk.CTkLabel(
                self.bar_frame,
                text="No transaction data to display",
                font=('Arial', 14),
                text_color="gray"
            ).pack(expand=True)
            return

        # Prepare data for plotting
        months = sorted(monthly_data.keys())
        income_amounts = [monthly_data[month]['income'] for month in months]
        expense_amounts = [monthly_data[month]['expenses'] for month in months]
        
        # Determine text color based on theme
        text_color = "white" if ctk.get_appearance_mode() == "Dark" else "black"

        # Create matplotlib figure
        fig, ax = plt.subplots(figsize=(10, 6))
        fig.patch.set_alpha(0)
        ax.set_facecolor('none')
        
        # Set axis colors
        ax.tick_params(colors=text_color)
        ax.xaxis.label.set_color(text_color)
        ax.yaxis.label.set_color(text_color)
        ax.title.set_color(text_color)
        for spine in ax.spines.values():
            spine.set_color(text_color)

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
        
        legend = ax.legend(frameon=True, facecolor='white' if text_color=='black' else '#333')
        for text in legend.get_texts():
            text.set_color(text_color)
            
        ax.grid(True, alpha=0.3)

        # Format y-axis to show currency
        from matplotlib.ticker import FuncFormatter
        ax.yaxis.set_major_formatter(FuncFormatter(lambda x, p: f'${x:,.0f}'))

        plt.tight_layout()

        # Embed chart in tkinter
        canvas = FigureCanvasTkAgg(fig, self.bar_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill="both", expand=True)

    def update_charts(self):
        """Update both charts with current data"""
        self.create_pie_chart()
        self.create_bar_chart()

    def save_data(self):
        """Save transactions to CSV file"""
        self.data_manager.save_transactions()


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

