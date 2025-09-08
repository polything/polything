# Markdown Formatting Rules

## Critical Formatting Requirements

### 1. Blank Lines Around Lists (MD032)

**Rule:** Lists must be surrounded by blank lines.

**Correct:**

```markdown
This is a paragraph.

- List item 1
- List item 2
- List item 3

This is another paragraph.
```

**Incorrect:**

```markdown
This is a paragraph.
- List item 1
- List item 2
This is another paragraph.
```

### 2. Blank Lines Around Headings (MD022)

**Rule:** Headings must be surrounded by blank lines.

**Correct:**

```markdown
This is a paragraph.

## Heading Level 2

This is another paragraph.

### Heading Level 3

More content here.
```

**Incorrect:**

```markdown
This is a paragraph.
## Heading Level 2
This is another paragraph.
```

### 3. No Trailing Punctuation in Headings (MD026)

**Rule:** Headings should not end with punctuation marks like colons, periods, or exclamation marks.

**Correct:**

```markdown
## Database Implementation
## User Authentication
## API Endpoints
```

**Incorrect:**

```markdown
## Database Implementation:
## User Authentication.
## API Endpoints!
```

### 4. Blank Lines Around Fenced Code Blocks (MD031)

**Rule:** Fenced code blocks must be surrounded by blank lines.

**Correct:** Always add blank lines before and after code blocks:

```bash
git checkout main
git pull origin main
```

**Incorrect:** Missing blank lines around code blocks:

```bash
git checkout main
git pull origin main
```

### 5. No Bare URLs (MD034)

**Rule:** URLs should be properly formatted as links, not bare text.

**Correct:**

```markdown
Visit [GitHub](https://github.com) for more information.
Check the [API documentation](https://api.example.com/docs).
```

**Incorrect:**

```markdown
Visit https://github.com for more information.
Check https://api.example.com/docs.
```

### 6. Single Trailing Newline (MD047)

**Rule:** Files must end with exactly one newline character.

**Correct:**

```markdown
This is the last line of the file.
```

**Incorrect:**

```markdown
This is the last line of the file.
```

or

```markdown
This is the last line of the file.


```

---

## Markdown Formatting Checklist

Before committing any `.md` file, verify:

- [ ] All lists have blank lines before and after
- [ ] All headings have blank lines before and after
- [ ] No headings end with punctuation marks
- [ ] All fenced code blocks have blank lines before and after
- [ ] All URLs are properly formatted as links
- [ ] File ends with exactly one newline character

---

## Common Fixes

### Quick Fixes for Common Issues

1. **Add missing blank lines:**
   - Before and after every list
   - Before and after every heading
   - Before and after every fenced code block

2. **Remove trailing punctuation from headings:**
   - Remove colons, periods, exclamation marks
   - Keep only the heading text

3. **Convert bare URLs to links:**
   - Wrap URLs in square brackets and parentheses
   - Use descriptive link text when possible

4. **Fix file endings:**
   - Ensure exactly one newline at the end
   - No extra blank lines at the end

---

## Tools and Validation

### Recommended Tools

- **markdownlint:** Use `markdownlint` CLI or VS Code extension
- **Prettier:** Configure to format markdown files
- **EditorConfig:** Set up consistent line endings

### VS Code Extension Settings

```json
{
  "markdownlint.config": {
    "MD032": true,
    "MD022": true,
    "MD026": true,
    "MD031": true,
    "MD034": true,
    "MD047": true
  }
}
```

---

## Summary

- **Always** add blank lines around lists, headings, and code blocks
- **Never** use trailing punctuation in headings
- **Always** format URLs as proper links
- **Always** end files with exactly one newline
- **Always** validate markdown files before committing
