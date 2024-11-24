import threading
from typing import List, Dict, Any, Optional, Union
import json
import ast
import sys
from io import StringIO
from contextlib import redirect_stdout, redirect_stderr
from executor.utils.tree_utils import TreeNode, build_tree


class TimeoutException(Exception):
    pass


class CodeExecutor:
    def __init__(self, timeout_seconds: int = 5):
        self.timeout_seconds = timeout_seconds

    def prepare_test_input(self, input_str: str) -> Union[Dict, List]:
        """Convert input string to appropriate Python objects."""
        try:
            # Handle direct array input
            if input_str.strip().startswith('['):
                return json.loads(input_str)

            input_data = json.loads(input_str)

            if isinstance(input_data, dict):
                # Handle tree problems
                if "tree" in input_data:
                    input_data["tree"] = build_tree(input_data["tree"])

            return input_data
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid input format: {str(e)}")

    def compare_outputs(self, expected: str, actual: Any) -> bool:
        """Compare expected output with actual output."""
        try:
            expected_value = json.loads(expected)
            return expected_value == actual
        except json.JSONDecodeError:
            return str(expected).strip() == str(actual).strip()

    def execute_function_with_timeout(self, func, *args, **kwargs) -> Any:
        """Execute a function with a timeout."""
        result = {}

        def target():
            try:
                result["value"] = func(*args, **kwargs)
            except Exception as e:
                result["error"] = str(e)

        thread = threading.Thread(target=target)
        thread.start()
        thread.join(self.timeout_seconds)

        if thread.is_alive():
            raise TimeoutException("Code execution timed out")

        if "error" in result:
            raise RuntimeError(result["error"])

        return result.get("value")

    def execute_code(self, user_code: str, test_cases: List[Dict]) -> Dict[str, Any]:
        """Execute user code against test cases."""
        results = {
            "passed": 0,
            "total": len(test_cases),
            "errors": [],
            "test_results": []
        }

        # Prepare the execution environment
        global_dict = {
            'TreeNode': TreeNode,
            'print': print,
            '__builtins__': __builtins__,
        }

        try:
            # Validate the code syntax
            ast.parse(user_code)

            # Execute the user's code to define their function
            exec(user_code, global_dict)

            # Find the main function in the user's code
            main_function = None
            for name, obj in global_dict.items():
                if callable(obj) and name not in ['TreeNode', 'print']:
                    main_function = obj
                    break

            if main_function is None:
                raise ValueError("No function found in the code")

            # Run each test case
            for test_case in test_cases:
                test_result = {
                    "test_id": test_case["testId"],
                    "passed": False,
                    "error": None
                }

                try:
                    # Prepare input
                    input_data = self.prepare_test_input(test_case["input"])

                    # Capture stdout and stderr
                    stdout = StringIO()
                    stderr = StringIO()

                    try:
                        with redirect_stdout(stdout), redirect_stderr(stderr):
                            if isinstance(input_data, dict):
                                result = self.execute_function_with_timeout(main_function, **input_data)
                            else:
                                result = self.execute_function_with_timeout(main_function, input_data)

                        # Check if the result matches expected output
                        if self.compare_outputs(test_case["output"], result):
                            test_result["passed"] = True
                            results["passed"] += 1

                    except TimeoutException:
                        test_result["error"] = "Execution timed out"
                    except Exception as e:
                        test_result["error"] = f"Runtime error: {str(e)}\n{stderr.getvalue()}"

                except Exception as e:
                    test_result["error"] = f"Test case error: {str(e)}"

                results["test_results"].append(test_result)
                if test_result["error"]:
                    results["errors"].append(test_result["error"])

        except SyntaxError as e:
            results["errors"].append(f"Syntax error: {str(e)}")
        except Exception as e:
            results["errors"].append(f"Execution error: {str(e)}")

        return results



# Example usage
if __name__ == "__main__":
    # Example test cases for different problem types
    test_cases = {
        "array": [
            {
                "testId": "1",
                "input": "[1, 2, 4, 5, 6]",
                "output": "3"
            },
            {
                "testId": "2",
                "input": "[3, 7, 1, 2, 8, 4, 5]",
                "output": "3"
            }
        ],
        "graph": [
            {
                "testId": "1",
                "input": '{ "graph": {"A": ["B", "C"], "B": ["D"], "C": [], "D": []}, "startNode": "A" }',
                "output": '["A", "B", "C", "D"]'
            }
        ],
        "tree": [
            {
                "testId": "1",
                "input": '{ "tree": [3, 9, 20, null, null, 15, 7] }',
                "output": "[[3], [9, 20], [15, 7]]"
            }
        ]
    }
    
    executor = CodeExecutor()
    
    # Example array solution
    array_code = """
def findMissingNumber(nums):
    n = len(nums) + 1
    expected_sum = (n * (n + 1)) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum
"""
    
    # Example graph solution
    graph_code = """
def bfs(graph, startNode):
    visited = []
    queue = [startNode]
    while queue:
        node = queue.pop(0)
        if node not in visited:
            visited.append(node)
            queue.extend(n for n in graph[node] if n not in visited)
    return visited
"""
    
    # Example tree solution
    tree_code = """
def levelOrder(tree):
    if not tree:
        return []
    result = []
    queue = [(tree, 0)]
    while queue:
        node, level = queue.pop(0)
        if len(result) <= level:
            result.append([])
        result[level].append(node.val)
        if node.left:
            queue.append((node.left, level + 1))
        if node.right:
            queue.append((node.right, level + 1))
    return result
"""
    
    # Test each type
    for problem_type, cases in test_cases.items():
        print(f"\nTesting {problem_type} problem:")
        if problem_type == "array":
            results = executor.execute_code(array_code, cases)
        elif problem_type == "graph":
            results = executor.execute_code(graph_code, cases)
        elif problem_type == "tree":
            results = executor.execute_code(tree_code, cases)
        print(json.dumps(results, indent=2))