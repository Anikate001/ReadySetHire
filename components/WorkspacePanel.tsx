"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { loadPyodide, PyodideInterface } from "pyodide";
import { cn } from "@/lib/utils";

type Language = "python" | "cpp";
type TestStatus = "idle" | "running" | "success" | "error";

const STORAGE_KEY = "readysethire.workspace.v2";

const DEFAULT_SNIPPETS: Record<Language, string> = {
  python: `class Solution:
    def twoSum(self, nums, target):
        lookup = {}
        for index, value in enumerate(nums):
            diff = target - value
            if diff in lookup:
                return [lookup[diff], index]
            lookup[value] = index
        return []

solution = Solution()
print(solution.twoSum([2, 7, 11, 15], 9))
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> lookup;
        for (int i = 0; i < nums.size(); ++i) {
            int diff = target - nums[i];
            if (lookup.count(diff)) {
                return {lookup[diff], i};
            }
            lookup[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution s;
    vector<int> nums = {2, 7, 11, 15};
    auto ans = s.twoSum(nums, 9);
    cout << ans[0] << " " << ans[1] << endl;
    return 0;
}
`,
};

const DEFAULT_ASSERTION = "solution.twoSum([2, 7, 11, 15], 9)";
const DEFAULT_EXPECTED = "[0, 1]";

// Support for multiple test cases format: "test1|expected1;test2|expected2"
const parseTestCases = (assertion: string, expected: string): Array<{test: string, expected: any}> => {
  // Check if it's a multi-test format (semicolon separated)
  if (expected.includes(';')) {
    const testParts = assertion.split(';');
    const expectedParts = expected.split(';');
    return testParts.map((test, idx) => ({
      test: test.trim(),
      expected: parseExpectedValue(expectedParts[idx]?.trim() || '')
    }));
  }
  // Single test case
  return [{ test: assertion, expected: parseExpectedValue(expected) }];
};

const parseExpectedValue = (raw: string) => {
  try {
    return JSON.parse(raw);
  } catch (error) {
    return raw;
  }
};

const toJsValue = (value: any) => {
  if (value && typeof value.toJs === "function") {
    const result = value.toJs({ create_proxies: false });
    if (typeof value.destroy === "function") {
      value.destroy();
    }
    return result;
  }
  return value;
};

const WorkspacePanel = ({ className }: { className?: string }) => {
  const [language, setLanguage] = useState<Language>("python");
  const [snippets, setSnippets] = useState<Record<Language, string>>(
    DEFAULT_SNIPPETS
  );
  const [pythonAssertion, setPythonAssertion] =
    useState<string>(DEFAULT_ASSERTION);
  const [pythonExpected, setPythonExpected] =
    useState<string>(DEFAULT_EXPECTED);
  const [status, setStatus] = useState<TestStatus>("idle");
  const [output, setOutput] = useState("Awaiting quick check...");
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [pyodideError, setPyodideError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (parsed.language) setLanguage(parsed.language as Language);
      if (parsed.snippets) setSnippets(parsed.snippets);
      if (parsed.pythonAssertion) setPythonAssertion(parsed.pythonAssertion);
      if (parsed.pythonExpected) setPythonExpected(parsed.pythonExpected);
    } catch (error) {
      console.warn("Failed to parse stored workspace payload", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({
      language,
      snippets,
      pythonAssertion,
      pythonExpected,
    });
    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [language, snippets, pythonAssertion, pythonExpected]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let mounted = true;

    loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
    })
      .then((instance) => {
        if (mounted) {
          setPyodide(instance);
        }
      })
      .catch((error) => {
        if (mounted) {
          setPyodideError(
            error instanceof Error ? error.message : "Failed to load Pyodide."
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const editorExtensions = useMemo(
    () => [language === "python" ? python() : cpp()],
    [language]
  );

  const handleSnippetChange = (next: string) => {
    setSnippets((prev) => ({
      ...prev,
      [language]: next,
    }));
  };

  const clearWorkspace = useCallback(() => {
    setSnippets(DEFAULT_SNIPPETS);
    setPythonAssertion(DEFAULT_ASSERTION);
    setPythonExpected(DEFAULT_EXPECTED);
    setOutput("Workspace reset. Start fresh!");
    setStatus("idle");
  }, []);

  const runQuickCheck = useCallback(async () => {
    if (language !== "python") {
      setStatus("error");
      setOutput(
        "Quick Check currently executes Python only. Switch to Python or validate your C++ snippet with an external judge."
      );
      return;
    }

    if (!pyodide) {
      setStatus("running");
      setOutput(
        pyodideError
          ? `Pyodide failed to load: ${pyodideError}`
          : "Initializing Python runtime..."
      );
      return;
    }

    // Validate inputs
    if (!snippets.python || !snippets.python.trim()) {
      setStatus("error");
      setOutput("Error: Code input is empty. Please write some Python code first.");
      return;
    }

    if (!pythonAssertion || !pythonAssertion.trim()) {
      setStatus("error");
      setOutput("Error: Assertion expression is empty. Please provide an expression to evaluate.");
      return;
    }

    if (!pythonExpected || !pythonExpected.trim()) {
      setStatus("error");
      setOutput("Error: Expected value is empty. Please provide an expected value to compare against.");
      return;
    }

    setStatus("running");
    setOutput("Executing code...");

    try {
      // Set up stdout/stderr capture
      await pyodide.runPythonAsync([
        "import sys, io, traceback",
        "sys_stdout_original = sys.stdout",
        "sys_stderr_original = sys.stderr",
        "sys.stdout = io.StringIO()",
        "sys.stderr = io.StringIO()",
      ].join("\n"));

      // Store user code in Python and execute it
      // Use repr() to safely encode the code string
      const codeLines = snippets.python.split('\n');
      const codeString = JSON.stringify(snippets.python); // This properly escapes everything
      
      const executionScript = [
        "__code_error = None",
        "try:",
        `    __user_code = ${codeString}`,
        "    exec(compile(__user_code, '<user_code>', 'exec'))",
        "except Exception as e:",
        "    import traceback",
        "    __code_error = traceback.format_exc()",
      ].join("\n");

      await pyodide.runPythonAsync(executionScript);

      // Get stdout/stderr and restore
      await pyodide.runPythonAsync([
        "__workspace_stdout = sys.stdout.getvalue()",
        "__workspace_stderr = sys.stderr.getvalue()",
        "sys.stdout = sys_stdout_original",
        "sys.stderr = sys_stderr_original",
      ].join("\n"));

      // Check if there was an error in the user's code
      const codeError = pyodide.globals.get("__code_error");
      if (codeError) {
        const errorMsg = toJsValue(codeError);
        setStatus("error");
        setOutput(
          [
            "Code execution error:",
            String(errorMsg),
            pyodide.globals.get("__workspace_stdout") 
              ? `\nStdout:\n${toJsValue(pyodide.globals.get("__workspace_stdout"))}`
              : "",
          ].join("\n")
        );
        return;
      }

      // Now evaluate the assertion
      const assertionScript = [
        "import sys, io, traceback, json",
        "sys_stdout_original = sys.stdout",
        "sys.stderr = sys_stdout_original",
        "try:",
        `    __workspace_output = ${pythonAssertion}`,
        "    __assertion_error = None",
        "except Exception as e:",
        "    __assertion_error = traceback.format_exc()",
        "    __workspace_output = None",
        "sys.stdout = sys_stdout_original",
      ].join("\n");

      await pyodide.runPythonAsync(assertionScript);

      // Parse test cases (support single or multiple)
      const testCases = parseTestCases(pythonAssertion, pythonExpected);
      const rawConsole = pyodide.globals.get("__workspace_stdout");
      const rawStderr = pyodide.globals.get("__workspace_stderr");
      const consoleLogs = toJsValue(rawConsole) ?? "";
      const errorLogs = toJsValue(rawStderr) ?? "";

      // Run all test cases
      const results: Array<{test: string, expected: any, actual: any, passed: boolean, error?: string}> = [];
      let allPassed = true;

      for (const testCase of testCases) {
        try {
          // Evaluate the assertion for this test case
          const assertionScript = [
            "import sys, io, traceback",
            "sys_stdout_original = sys.stdout",
            "sys.stderr = sys_stdout_original",
            "try:",
            `    __workspace_output = ${testCase.test}`,
            "    __assertion_error = None",
            "except Exception as e:",
            "    __assertion_error = traceback.format_exc()",
            "    __workspace_output = None",
            "sys.stdout = sys_stdout_original",
          ].join("\n");

          await pyodide.runPythonAsync(assertionScript);

          const assertionError = pyodide.globals.get("__assertion_error");
          if (assertionError) {
            const errorMsg = toJsValue(assertionError);
            results.push({
              test: testCase.test,
              expected: testCase.expected,
              actual: null,
              passed: false,
              error: String(errorMsg)
            });
            allPassed = false;
            continue;
          }

          const rawResult = pyodide.globals.get("__workspace_output");
          const actualValue = toJsValue(rawResult);
          const actualSerialized = JSON.stringify(actualValue);
          const expectedSerialized = JSON.stringify(testCase.expected);
          const didMatch = actualSerialized === expectedSerialized;

          results.push({
            test: testCase.test,
            expected: testCase.expected,
            actual: actualValue,
            passed: didMatch
          });

          if (!didMatch) {
            allPassed = false;
          }
        } catch (error) {
          results.push({
            test: testCase.test,
            expected: testCase.expected,
            actual: null,
            passed: false,
            error: error instanceof Error ? error.message : String(error)
          });
          allPassed = false;
        }
      }

      // Format output
      setStatus(allPassed ? "success" : "error");
      
      if (results.length === 1) {
        // Single test case - detailed output
        const result = results[0];
        if (result.error) {
          setOutput(
            [
              "❌ Test Case Failed",
              `\nTest: ${result.test}`,
              `Expected: ${JSON.stringify(result.expected)}`,
              `\nError: ${result.error}`,
              "\nMake sure your code defines all variables/objects used in the assertion.",
              consoleLogs ? `\n\nStdout:\n${consoleLogs}` : "",
              errorLogs ? `\n\nStderr:\n${errorLogs}` : "",
            ].filter(Boolean).join("\n")
          );
        } else {
          setOutput(
            [
              result.passed ? "✅ Test Passed!" : "❌ Test Failed",
              `\nTest: ${result.test}`,
              `Expected: ${JSON.stringify(result.expected)}`,
              `Received: ${JSON.stringify(result.actual)}`,
              result.passed ? "\n✓ Your code is correct!" : "\n✗ Values do not match",
              consoleLogs ? `\n\nStdout:\n${consoleLogs}` : "",
              errorLogs ? `\n\nStderr:\n${errorLogs}` : "",
            ].filter(Boolean).join("\n")
          );
        }
      } else {
        // Multiple test cases - summary
        const passedCount = results.filter(r => r.passed).length;
        const outputLines = [
          `Test Results: ${passedCount}/${results.length} passed`,
          allPassed ? "\n✅ All tests passed! Your code is correct!" : "\n❌ Some tests failed",
          ""
        ];

        results.forEach((result, idx) => {
          outputLines.push(`\nTest Case ${idx + 1}: ${result.passed ? "✅ PASSED" : "❌ FAILED"}`);
          outputLines.push(`  Expression: ${result.test}`);
          if (result.error) {
            outputLines.push(`  Error: ${result.error}`);
          } else {
            outputLines.push(`  Expected: ${JSON.stringify(result.expected)}`);
            outputLines.push(`  Received: ${JSON.stringify(result.actual)}`);
          }
        });

        if (consoleLogs) {
          outputLines.push(`\n\nStdout:\n${consoleLogs}`);
        }
        if (errorLogs) {
          outputLines.push(`\n\nStderr:\n${errorLogs}`);
        }

        setOutput(outputLines.join("\n"));
      }
    } catch (error) {
      setStatus("error");
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error && error.stack ? error.stack : "";
      setOutput(
        [
          "Execution error:",
          errorMessage,
          errorStack ? `\nStack trace:\n${errorStack}` : "",
        ].filter(Boolean).join("\n")
      );
    }
  }, [language, pyodide, pyodideError, snippets.python, pythonAssertion, pythonExpected]);

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl bg-gray-900/80 p-4 text-white",
        className
      )}
    >
      <header className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Workspace</p>
          <p className="text-xs text-gray-400">
            CodeMirror 6 · Python &amp; C++ presets · Auto-saved locally
          </p>
        </div>
        <div className="flex gap-2">
          {(["python", "cpp"] as Language[]).map((value) => (
            <button
              key={value}
              onClick={() => setLanguage(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                language === value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              )}
            >
              {value === "python" ? "Python" : "C++"}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <CodeMirror
            value={snippets[language]}
            height="100%"
            theme={oneDark}
            extensions={editorExtensions}
            onChange={handleSnippetChange}
            basicSetup={{
              autocompletion: true,
              bracketMatching: true,
              foldGutter: true,
              highlightActiveLine: true,
              highlightActiveLineGutter: true,
              lineNumbers: true,
            }}
            className="h-full"
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-gray-950/70 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {language === "python"
                ? "Quick Check (Pyodide)"
                : "Quick Check"}
            </p>
            <button
              onClick={clearWorkspace}
              className="text-xs text-gray-400 underline decoration-dotted underline-offset-4 hover:text-gray-200"
            >
              Reset
            </button>
          </div>

          {language === "python" ? (
            <>
              <label className="text-xs uppercase tracking-wide text-gray-400">
                Assertion Expression (Python)
                <input
                  value={pythonAssertion}
                  onChange={(event) => setPythonAssertion(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-gray-900/70 p-2 text-sm text-white outline-none focus:border-blue-500"
                  placeholder="solution.twoSum([2, 7, 11, 15], 9)"
                />
                <p className="mt-1 text-[10px] text-gray-500">
                  For multiple tests, separate with semicolon: test1;test2;test3
                </p>
              </label>

              <label className="text-xs uppercase tracking-wide text-gray-400">
                Expected Value (JSON or plain text)
                <input
                  value={pythonExpected}
                  onChange={(event) => setPythonExpected(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-gray-900/70 p-2 text-sm text-white outline-none focus:border-blue-500"
                  placeholder="[0, 1]"
                />
                <p className="mt-1 text-[10px] text-gray-500">
                  For multiple tests, separate with semicolon: [0,1];[1,2];[0,2]
                </p>
              </label>
            </>
          ) : (
            <p className="text-xs text-gray-400">
              C++ execution is not available in-browser yet. Use this panel for
              drafting and copy the snippet into your preferred compiler when
              you need to validate it.
            </p>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              runQuickCheck();
            }}
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:opacity-50"
            disabled={
              status === "running" ||
              language !== "python" ||
              (!!pyodideError && !pyodide) ||
              !pyodide
            }
          >
            {status === "running"
              ? "Running..."
              : language === "python"
              ? "Run Quick Check"
              : "Python Only"}
          </button>

          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-xs leading-relaxed flex flex-col",
              status === "success"
                ? "border-green-400 bg-green-400/10 text-green-100"
                : status === "error"
                ? "border-red-400 bg-red-400/10 text-red-100"
                : "border-gray-600 bg-gray-800 text-gray-200"
            )}
          >
            <p className="font-semibold uppercase tracking-wide mb-2">
              {status === "success"
                ? "✓ Test Passed!"
                : status === "error"
                ? "✗ Test Failed / Error"
                : status === "running"
                ? "⏳ Running..."
                : "Idle"}
            </p>
            <div className="flex-1 min-h-[100px] max-h-[200px] overflow-y-auto overflow-x-hidden">
              <pre className="whitespace-pre-wrap text-[11px] break-words">
                {output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePanel;

