# AI Agent Workflow Log

## Agents Used

- **Cursor Agent / LLM Assistant**: Used for generating code for specific components, functions, and files based on detailed prompts.
- **GitHub Copilot**: Used for real-time, inline code completion within the editor, especially for boilerplate and repetitive patterns.

## Prompts & Outputs

My workflow involved breaking down the project into smaller, manageable tasks and delegating the implementation details to an AI agent. I remained in control of the overall architecture and validation.

### Example 1: Generating a Generic, Reusable Component

Instead of writing the `Table` component from scratch, I prompted the AI to generate a flexible, type-safe foundation.

- **Prompt**:
  "Create a reusable React Table component using TypeScript and TailwindCSS. It should be fully generic, accepting a type parameter `T`. The component must accept `columns` and `data` props. The `columns` prop should be an array of objects, where each object has a `header` (string) and an `accessor` function that takes an item of type `T` and returns a `React.ReactNode`. Also, include a loading state."

- **Generated Snippet (Core structure of `Table.tsx`)**:
  The agent produced the initial `Table.tsx` file, including the generic interfaces `Column<T>` and `TableProps<T>`, and the basic JSX structure for mapping over the columns and data.

### Example 2: Implementing Complex Backend Logic Simulation

Writing the mock logic for the pooling feature would have been time-consuming. I offloaded this to the agent with very specific rules.

- **Prompt**:
  "In `mockApi.ts`, write an async function `createPool` that simulates the pooling logic. It takes an array of `PoolMember` objects. It must first validate that the sum of `cb_before` for all members is non-negative. Then, perform a greedy allocation where surplus from positive-CB members is transferred to cover deficits of negative-CB members. Finally, validate that no deficit ship ends with a worse CB and no surplus ship ends with a negative CB. Return an object indicating success, a message, and the final pool state."

- **Generated Snippet**:
  The agent generated the `createPool` function in `mockApi.ts`, including the initial sum validation, the greedy allocation loops, and the final validation checks.

## Validation / Corrections

The AI's output served as a high-quality first draft, which I then reviewed and refined.

- **Logic Refinement**: The first version of the `createPool` function correctly performed the greedy allocation but missed an edge case in the final validation loop. I had to manually add a check to ensure a surplus ship that gives away its entire surplus doesn't end up with a negative balance.
- **Type Safety**: I reviewed all generated TypeScript types to ensure they accurately modeled the domain. In `Tabs.tsx`, I adjusted the `setActiveTab` prop's type to `React.Dispatch<React.SetStateAction<T>>` to align perfectly with React's `useState` hook dispatcher for better type inference.
- **Styling and UX**: AI-generated TailwindCSS is functional but often lacks nuance. I manually adjusted padding, colors, and responsive breakpoints across all components to improve the visual hierarchy and overall user experience. For example, I added hover effects and transition classes to interactive elements like buttons and table rows.

## Observations

- **Where agent saved time**:

  - **Component Boilerplate**: The agent was invaluable for creating the foundational structure of reusable components like `Table`, `Card`, and `Select`. This saved hours of repetitive coding.
  - **Mock API Logic**: Implementing the stateful logic for the `mockApi.ts` service, especially the banking and pooling calculations, was significantly faster.
  - **Data Structures**: Generating the initial TypeScript interfaces in `types.ts` from the assignment's data tables was instantaneous.

- **Where it failed or needed guidance**:

  - **Complex State Interaction**: The agent sometimes struggled to understand how different states should interact without explicit instruction (e.g., resetting the pool result when the selected members change). This required manual intervention in the `PoolingView.tsx` component.
  - **Library-Specific Knowledge**: The `recharts` bar chart required manual correction. The AI initially passed incorrect props and struggled with the data format, which I fixed by consulting the library's official documentation.

- **How tools were combined effectively**:
  I used the main LLM assistant for large-scale generation (e.g., "create this component"). While editing the generated files, I used GitHub Copilot for small inline tasks, like completing `className` strings, generating `console.log` statements for debugging, or finishing mapping functions.

## Best Practices Followed

- **Atomic Task Delegation**: I focused on giving the AI small, well-defined tasks. This "one component at a time" or "one function at a time" approach yielded much better and more accurate results than asking for the entire application at once.
- **Developer as Architect**: I made all high-level architectural decisions, such as adhering to the hexagonal pattern and defining the component boundaries. The AI was a tool for implementation, not for design.
- **Review, Refine, Repeat**: I treated all generated code as a code review submission. I would read it carefully, test its functionality, and refine it to meet quality standards before moving on.
