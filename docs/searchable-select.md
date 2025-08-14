# SearchableSelect Component

A fully-featured searchable select component built with Radix UI primitives.

## Features

- 🔍 **Search functionality** - Filter options by typing
- ⌨️ **Keyboard navigation** - Arrow keys, Enter, and Escape support
- 🎨 **Customizable styling** - Matches your design system
- ♿ **Accessible** - Built with Radix UI primitives
- 🧹 **Clearable** - Optional clear button to reset selection
- ⚡ **Loading state** - Show loading indicator
- 🚫 **Disabled options** - Individual options can be disabled
- 🎯 **Highlighted navigation** - Visual feedback for keyboard navigation

## Basic Usage

```tsx
import { SearchableSelect, type SearchableSelectOption } from '@/components/ui/searchable-select';
import { useState } from 'react';

const options: SearchableSelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
];

function MyComponent() {
  const [value, setValue] = useState<string>('');

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select a fruit..."
      searchPlaceholder="Search fruits..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SearchableSelectOption[]` | - | Array of options to display |
| `value` | `string` | - | Currently selected value |
| `onValueChange` | `(value: string) => void` | - | Callback when selection changes |
| `placeholder` | `string` | "Select an option..." | Placeholder text when no option is selected |
| `searchPlaceholder` | `string` | "Search..." | Placeholder text for search input |
| `className` | `string` | - | Additional CSS classes for the trigger |
| `disabled` | `boolean` | `false` | Whether the select is disabled |
| `clearable` | `boolean` | `false` | Whether to show a clear button |
| `loading` | `boolean` | `false` | Whether to show loading state |
| `emptyMessage` | `string` | "No results found." | Message when no options match search |

## SearchableSelectOption Interface

```tsx
interface SearchableSelectOption {
  value: string;        // Unique identifier for the option
  label: string;        // Display text for the option
  disabled?: boolean;   // Whether this option is disabled
}
```

## Examples

### With Clearable Option

```tsx
<SearchableSelect
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select an option..."
  clearable
/>
```

### With Loading State

```tsx
<SearchableSelect
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select an option..."
  loading={isLoading}
/>
```

### With Disabled Options

```tsx
const options = [
  { value: '1', label: 'Available Option' },
  { value: '2', label: 'Disabled Option', disabled: true },
  { value: '3', label: 'Another Available Option' },
];
```

## Keyboard Navigation

- **Arrow Down/Up** - Navigate through options
- **Enter** - Select highlighted option
- **Escape** - Close dropdown and clear search
- **Type** - Filter options by search term

## Styling

The component uses your existing design system colors and follows the same styling patterns as other UI components in your project. The green color scheme (`#619154` and `#D6E3D4`) matches your existing select components.

## Accessibility

- Built with Radix UI primitives for excellent accessibility
- Proper ARIA attributes and keyboard navigation
- Focus management and screen reader support
- Follows WAI-ARIA best practices for combobox pattern
