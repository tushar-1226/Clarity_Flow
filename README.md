# ClarityFlow - Personal Budget Tracker

ClarityFlow is a robust desktop application designed to help you manage your personal finances with clarity and ease. Built with Python and Tkinter, it offers a seamless experience for tracking expenses, setting budgets, and visualizing your financial health.

##  Key Features

*   **Transaction Management**: Easily add income and expense transactions with detailed descriptions, dates, and amounts.
*   **Smart Categorization**: Organize your finances with built-in categories for both income (e.g., Salary, Investments) and expenses (e.g., Food, Transportation, Utilities).
*   **Budget Goals**: Set monthly budget limits for specific expense categories. The application provides visual feedback with color-coded progress bars (Safe, Caution, Warning, Over Budget).
*   **Financial Dashboard**:
    *   **Summary View**: Real-time calculation of Total Income, Total Expenses, and Current Balance.
    *   **Interactive Charts**:
        *   **Pie Chart**: Visualize your spending distribution by category.
        *   **Bar Chart**: Compare monthly income versus expenses.
*   **Search & Filter**: Powerful filtering options to find specific transactions by:
    *   Text search (Description or Category)
    *   Transaction Type (Income/Expense)
    *   Date Range
    *   Amount Range
*   **Data Persistence**:
    *   Automatically saves all transactions to `budget_data.csv`.
    *   Persists budget goals in `budget_goals.json`.
*   **Data Export**: Export your transaction history to CSV for external analysis.
*   **Customizable Theme**: Toggle between Light and Dark modes to suit your preference.

##  Installation

### Prerequisites

*   Python 3.8 or higher

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd ClarityFlow
    ```

2.  **Create a virtual environment (Recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

##  Usage

1.  **Run the application:**
    ```bash
    python main.py
    ```

2.  **Application Overview:**
    *   **Add Transaction (Left Panel):** Enter transaction details and click "Add Transaction".
    *   **Financial Summary (Left Panel):** View your current financial standing.
    *   **Search & Filter (Left Panel):** Use this section to narrow down the transaction list.
    *   **Budget Goals (Middle Panel):** Select a category and set a monthly limit.
    *   **Budget Tracking (Middle Panel):** Monitor your meaningful progress towards your budget goals.
    *   **Charts (Right Panel):** Switch tabs between "Expense Categories" and "Monthly Overview" to visualize data.

## Project Structure

*   `main.py`: The entry point and core logic of the application.
*   `budget_data.csv`: Stores all transaction records.
*   `budget_goals.json`: Stores user-defined budget limits.
*   `requirements.txt`: List of Python dependencies.
*   `test_search_filter.py`: Unit tests for the search and filtering logic.

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
