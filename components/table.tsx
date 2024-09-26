"use client"; // Ensure this is at the top

import React, { useMemo, useState, useEffect } from 'react';
import { Button, IconButton, Drawer, Slider } from '@mui/material';
import { Search, FilterList, ViewColumn } from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table'; // Make sure the correct import is being used
import sampleData from '../data/sample-data.json'; // Ensure the data file path is correct

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true, 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric' 
  });
};

const Table = () => {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [grouping, setGrouping] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    // Format the createdAt date during component mount
    const newFormattedData = sampleData.map(item => ({
      ...item,
      createdAt: formatDate(item.createdAt), // Format the date
    }));
    setFormattedData(newFormattedData);
  }, []);

  // Define columns
  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'category', header: 'Category',
      enableGrouping: true,
    },
    {
      accessorKey: 'subcategory', header: 'Subcategory',
      enableGrouping: true,
    },
    {
      accessorKey: 'price', header: 'Price',
      filterFn: 'between', // Allows for range filtering
      enableColumnFilter: true,
    },
    {
      accessorKey: 'createdAt', header: 'Created At',
      Cell: ({ cell }) => cell.getValue(), // Use the formatted date directly
    },
  ], []);

  const handleSidePanel = (feature) => {
    setActiveFeature(feature);
    setSidePanelOpen(true);
  };

  // Calculate paginated data
  const startIndex = pagination.pageIndex * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedData = formattedData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: Math.min(prev.pageIndex + 1, Math.ceil(formattedData.length / pagination.pageSize) - 1),
    }));
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: Math.max(prev.pageIndex - 1, 0),
    }));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <IconButton onClick={() => handleSidePanel('search')}>
          <Search />
        </IconButton>
        <IconButton onClick={() => handleSidePanel('filter')}>
          <FilterList />
        </IconButton>
        <IconButton onClick={() => handleSidePanel('columns')}>
          <ViewColumn />
        </IconButton>
      </div>

      <MaterialReactTable
        columns={columns}
        data={paginatedData} // Use the paginated data
        initialState={{ pagination }} // Initial pagination state
        state={{
          columnFilters,
          globalFilter,
          sorting,
          pagination,
          grouping,
        }}
        onSortingChange={setSorting}
        onGlobalFilterChange={setGlobalFilter}
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onGroupingChange={setGrouping}
        enableColumnResizing
        enableFacetedFilters
        enableColumnOrdering
        enablePagination
        manualPagination
        pageCount={Math.ceil(formattedData.length / pagination.pageSize)} // Manual pagination
        enableRowSelection
        enableColumnVisibilityToggle
      />

      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Button onClick={handlePreviousPage} disabled={pagination.pageIndex === 0}>Previous</Button>
        <Button onClick={handleNextPage} disabled={pagination.pageIndex >= Math.ceil(formattedData.length / pagination.pageSize) - 1}>Next</Button>
      </div>

      <Drawer open={sidePanelOpen} onClose={() => setSidePanelOpen(false)}>
        {activeFeature === 'search' && (
          <div style={{ padding: '1rem' }}>
            <h3>Search & Fuzzy Filter</h3>
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        )}
        {activeFeature === 'filter' && (
          <div style={{ padding: '1rem' }}>
            <h3>Filter Panel</h3>
            <Slider
              value={columnFilters.find(filter => filter.id === 'price')?.value ?? [0, 1000]}
              onChange={(e, newValue) => setColumnFilters(old => [
                ...old.filter(f => f.id !== 'price'), // Remove old filter if exists
                { id: 'price', value: newValue } // Add new filter value
              ])}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
          </div>
        )}
        {activeFeature === 'columns' && (
          <div style={{ padding: '1rem' }}>
            <h3>Show/Hide Columns</h3>
            {columns.map((column) => (
              <div key={column.accessorKey}>
                <label>
                  <input
                    type="checkbox"
                    checked={columnVisibility[column.accessorKey] ?? true}
                    onChange={(e) => setColumnVisibility({
                      ...columnVisibility,
                      [column.accessorKey]: e.target.checked,
                    })}
                  />
                  {column.header}
                </label>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Table;
