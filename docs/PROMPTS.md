# AI Prompts

This document contains a collection of prompts to maintain an d improve the BreWiZ project. The prompts are organized into categories for easy navigation. 

The prompts are designed to be used with the Microsoft Copilot Chat, but they can also be adapted for use with other AI tools.

## Packages.yaml

### Package Information

- Review the package information in the `packages.yaml` file. Ensure that all packages have a clear and concise description, and that the information is up to date.

### Package Categories

#### Constraints
- **File Types**: No Jupyter notebooks or Python scripts should be created
- **Category ID Format**: 
  - Maximum 8 lowercase characters
  - Must be unique
  - Cannot contain spaces, special characters, underscores, or hyphens
- **Category Names**: Should be descriptive and human-readable
- **Category Management**:
  - Preserve existing categories unless removal is clearly justified
  - Add new categories only when essential
  - Maintain alphabetical sorting of all categories

#### Initial Assessment
- Review the package categories in the `packages.yaml` file. Create a summary of:
  - Total number of categories
  - Number of packages per category
  - Any categories that seem redundant or could be merged
  - Any packages that appear to be miscategorized

#### Category Structure Guidelines
- Each category should ideally contain 4-16 packages
- Split categories with >16 packages into more specific subcategories
- Consider merging categories with <4 packages if there's a logical relationship
- Balance is important, but clarity and logical organization take priority

#### Category Naming and Content
- Ensure category names are:
  - Clear and concise
  - Descriptive of their contents
  - Consistent in style (e.g., "Tools for X" or "X Management")
- Verify category descriptions are:
  - Informative about what the category contains
  - Concise (1-2 sentences)
  - Consistent in tone and structure

#### Implementation Process
1. Present your initial assessment
2. Propose specific changes to category structure (splits, merges, renames)
3. Ask for approval before implementing changes
4. After implementation, review your changes and suggest any further improvements

#### Specific Actions
- Rename categories that aren't clearly descriptive
- Rewrite vague category descriptions
- Reorganize miscategorized packages
- Create new logical categories if needed
- Remove or merge redundant categories
