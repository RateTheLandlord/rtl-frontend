#!/bin/bash

# Get the list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.tsx$')

# Loop through each staged file and check for test files and a11y tests
for file in $STAGED_FILES; do

  if [[ "$file" != *"components/"* ]]; then
    continue
  fi
  
  if [[ "$file" != *".test.tsx" ]]; then
    test_file="${file%.tsx}.test.tsx"
    if [ ! -f "$test_file" ]; then
      echo "Test file missing for: $file"
      exit 1
    fi
  else
    # Check for a11y test in the test file
    if ! grep -q "a11y" "$file"; then
      echo "A11y test missing in: $file"
      exit 1
    fi
  fi
done