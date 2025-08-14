# DataTable Component Usage Guide

The DataTable component is a powerful, reusable table component built with TanStack React Table that provides sorting, filtering, pagination, and column visibility features.

## Features

- 🔍 **Search/Filter** - Filter data by any column
- 🔄 **Sorting** - Click column headers to sort
- 👁️ **Column Visibility** - Show/hide columns
- 📄 **Pagination** - Navigate through large datasets
- 🎨 **Customizable** - Fully styled with your design system

## Basic Usage

```tsx
import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';

// Define your data type
type User = {
  id: string
  name: string
  email: string
  status: string
}

// Define your columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <Badge variant={status === "active" ? "default" : "secondary"}>{status}</Badge>
    },
  },
]

// Sample data
const data: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active"
  },
  // ... more data
]

// Use the component
function MyPage() {
  return (
    <DataTable 
      columns={columns} 
      data={data}
      searchKey="name"
      searchPlaceholder="Search users..."
    />
  )
}
```

## Column Definition Examples

### Basic Column
```tsx
{
  accessorKey: "name",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Name" />
  ),
}
```

### Custom Cell Rendering
```tsx
{
  accessorKey: "status",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Status" />
  ),
  cell: ({ row }) => {
    const status = row.getValue("status") as string
    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status}
      </Badge>
    )
  },
}
```

### Actions Column
```tsx
{
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => {
    const item = row.original

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(item.id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(item.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
```

### Complex Cell with Multiple Values
```tsx
{
  accessorKey: "name",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="User" />
  ),
  cell: ({ row }) => {
    return (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue("name")}</span>
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    )
  },
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | Required | Column definitions |
| `data` | `TData[]` | Required | Array of data to display |
| `searchKey` | `string` | Optional | Key to enable search functionality |
| `searchPlaceholder` | `string` | "Search..." | Placeholder text for search input |
| `className` | `string` | Optional | Additional CSS classes |
| `initialPageSize` | `number` | 10 | Initial number of rows per page |
| `pageSizeOptions` | `number[]` | [10, 20, 30, 40, 50] | Available page size options |
| `enablePagination` | `boolean` | true | Enable/disable pagination |

## Features in Detail

### Search/Filtering
- Enable by passing a `searchKey` prop
- Searches the specified column
- Real-time filtering as you type

### Sorting
- Click any column header to sort
- Three states: unsorted → ascending → descending → unsorted
- Visual indicators show current sort state

### Column Visibility
- "Columns" dropdown in top-right
- Toggle visibility of any column
- State persists during the session

### Pagination
- Automatic pagination for large datasets
- "Previous" and "Next" buttons
- Shows selected and total row counts
- **Page size selector** - Choose how many rows to display per page
- **First/Last page navigation** - Jump to first or last page
- **Page counter** - Shows current page and total pages
- **Customizable page sizes** - Configure available page size options
- **Enable/disable** - Can be turned off completely

## Enhanced Pagination Features

The DataTable now includes comprehensive pagination with the following features:

### Page Size Selection
Users can choose how many rows to display per page from a dropdown menu. You can customize the available options:

```tsx
<DataTable
  // ... other props
  initialPageSize={5}
  pageSizeOptions={[5, 10, 20, 50, 100]}
/>
```

### Navigation Controls
- **First Page** - Jump to the beginning (hidden on mobile)
- **Previous Page** - Go back one page
- **Next Page** - Go forward one page
- **Last Page** - Jump to the end (hidden on mobile)

### Page Information
- Current page number and total pages
- Selected rows count and total filtered rows

### Disable Pagination
For small datasets, you can disable pagination entirely:

```tsx
<DataTable
  // ... other props
  enablePagination={false}
/>
```

## Styling

The component uses your existing design system:
- Tailwind CSS classes
- Your color scheme (`#619154` for primary actions)
- Consistent with other UI components

## Integration with Laravel/Inertia

To integrate with your Laravel backend:

1. **Pass data from controller:**
```php
return Inertia::render('Management/Farmer/Index', [
    'farmers' => $farmers->toArray(),
]);
```

2. **Receive in React component:**
```tsx
interface Props {
  farmers: Farmer[]
}

export default function Farmer({ farmers }: Props) {
  return (
    <DataTable 
      columns={columns} 
      data={farmers}
      searchKey="name"
    />
  )
}
```

## Tips

1. **Type Safety**: Always define your data types for better TypeScript support
2. **Performance**: For large datasets, consider server-side pagination
3. **Accessibility**: The table is built with accessibility in mind using proper ARIA attributes
4. **Customization**: All components can be styled by passing custom `className` props
5. **Actions**: Use the actions column pattern for row-specific operations

## Example Implementation

Check the farmer management page (`resources/js/pages/management/farmer/index.tsx`) for a complete working example with sample data, custom cells, and actions.
