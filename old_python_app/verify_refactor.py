import sys
import os
sys.path.append(os.getcwd())

print("Verifying imports...")
try:
    from clarityflow.models.data_manager import DataManager
    print("SUCCESS: DataManager imported")
    
    # Check if DataManager can be instantiated
    dm = DataManager()
    print("SUCCESS: DataManager instantiated")
    
    from clarityflow.utils.data_handler import load_data
    print("SUCCESS: utils imported")

    from clarityflow.ui.main_window import BudgetTracker
    print("SUCCESS: BudgetTracker imported")
    
except ImportError as e:
    print(f"IMPORT ERROR: {e}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)

print("Verification passed!")
