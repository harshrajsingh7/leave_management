import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useSelection } from '../hooks/use-selection'; // Adjust the path as needed

function noop() {
  // do nothing
}

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: { city: string; state: string; country: string; street: string };
  phone: string;
  createdAt: Date;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
}
const sampleCustomers = [
  {
    id: '1',
    avatar: './man.png',
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      street: '123 Broadway'
    },
    phone: '+1 (555) 123-4567',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    avatar: './women.png',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    address: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      street: '456 Hollywood Blvd'
    },
    phone: '+1 (555) 987-6543',
    createdAt: new Date('2023-03-22')
  },
  {
    id: '3',
    avatar: './gamer.png',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    address: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      street: '789 Michigan Ave'
    },
    phone: '+1 (555) 246-8135',
    createdAt: new Date('2023-05-10')
  },
  {
    id: '4',
    avatar: './amma.png',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    address: {
      city: 'Houston',
      state: 'TX',
      country: 'USA',
      street: '321 Main St'
    },
    phone: '+1 (555) 369-2580',
    createdAt: new Date('2023-07-05')
  },
  {
    id: '5',
    avatar: './pari.png',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    address: {
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      street: '654 Ocean Dr'
    },
    phone: '+1 (555) 159-7531',
    createdAt: new Date('2023-09-18')
  }
];

export function CustomersTable({
  count = 0,
  rows = sampleCustomers,
  page = 0,
  rowsPerPage = 0,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    // <Card>
    <>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell> */}
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Signed Up</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell> */}
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.address.city}, {row.address.state}, {row.address.country}
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      </>
    // </Card>
  );
}
