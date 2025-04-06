# Coding Conventions for Brewiz

This document outlines the coding standards and practices to follow when contributing to the Brewiz project.

## Error Handling Philosophy

### Fail Fast Approach

We follow the "Fail Fast" principle in Brewiz. This means:

1. **Don't Catch Exceptions Unnecessarily**: Let exceptions bubble up rather than catching and suppressing them.
2. **Report and Die**: When an error occurs, report it clearly and exit rather than trying to continue in a potentially corrupt state.
3. **Avoid Defensive Programming**: Don't add excessive checks and validations when the underlying Ruby exceptions will handle the error properly.

This approach is similar to the Erlang programming philosophy where processes are expected to crash and be restarted rather than limping along in a compromised state.

```ruby
# Good - Let the error propagate
def process_file(path)
  content = File.read(path)
  # Process content
end

# Avoid this pattern unless you have a specific recovery strategy
def process_file(path)
  begin
    content = File.read(path)
    # Process content
  rescue Errno::ENOENT
    # Don't silently ignore errors or return nil
    puts "Error: File not found"
    # Instead, either re-raise or exit
    raise
  end
end
```

### When to Rescue

Only rescue exceptions when you have a clear recovery strategy:

1. For user-facing command-line tools where you want to provide a friendly error message
2. When you need to clean up resources before exiting
3. When the exception is expected as part of normal operation

```ruby
# Example: Rescuing to provide better user experience
rescue OptionParser::InvalidOption => e
  puts "Error: #{e.message}"
  exit 1
```

## Code Formatting

### Indentation and Whitespace

- Use 2 spaces for indentation (not tabs)
- Use spaces around operators
- Use a space after commas
- Don't use spaces inside brackets

### Line Length

- Keep lines under 100 characters when possible
- Break long chains of method calls into multiple lines

### Method Definitions

- Use snake_case for method names
- Keep methods short and focused on a single responsibility
- Add comments for complex methods explaining their purpose

## File Organization

### Directory Structure

- Keep Ruby code in the `lib/` directory
- Store binary executables in `bin/`
- Place documentation in `docs/`
- Use `public/fixtures/` for test data and resources

## Documentation

- Document public API methods with clear descriptions
- Explain parameters and return values
- Use Markdown for documentation files

## Testing

- Write tests for new functionality
- Ensure all existing tests pass before submitting changes
- Focus on testing behavior, not implementation details

## Git Practices

- Write clear, descriptive commit messages
- Reference issue numbers in commit messages
- Keep commits focused on a single change
- Use feature branches for new functionality

## Data Handling

### JSON and YAML Files

- Format data files for readability
- Include appropriate metadata
- Use consistent naming conventions for keys
- Include tags for categorization when appropriate

## Dependencies

- Minimize external dependencies
- Document required dependencies clearly
- Consider compatibility across different platforms

Remember: See FailFast and DontCatchExceptions, maybe also ReportAndDie, but not LimpVersusDie.
This is also a coding philosophy for ErlangLanguage. The view is that you don't need to program defensively. If there are any errors, the process is automatically terminated, and this is reported to any processes that were monitoring the crashed process. In fact, defensive programming in Erlang is frowned upon.