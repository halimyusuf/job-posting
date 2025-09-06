import React from 'react';
import debounce from 'lodash/debounce';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Button,
  Paper,
} from '@mui/material';
import { useQueryParams, StringParam, NumberParam } from 'use-query-params';

const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];

export const JobFilters: React.FC = () => {
  const [query, setQuery] = useQueryParams({
    search: StringParam,
    type: StringParam,
    location: StringParam,
    minSalary: NumberParam,
    maxSalary: NumberParam,
  });

  const handleReset = () => {
    setQuery({
      search: undefined,
      type: undefined,
      location: undefined,
      minSalary: undefined,
      maxSalary: undefined,
    });
  };

  // local state for instant input responsiveness
  const [searchInput, setSearchInput] = React.useState<string>(query.search || '');
  const [locationInput, setLocationInput] = React.useState<string>(query.location || '');
  const [minSalaryInput, setMinSalaryInput] = React.useState<string>(
    query.minSalary?.toString() || ''
  );
  const [maxSalaryInput, setMaxSalaryInput] = React.useState<string>(
    query.maxSalary?.toString() || ''
  );

  // debounced setters for text inputs: apply after 1s of inactivity
  // or immediately when the user presses Enter
  const applySearch = React.useCallback(
    debounce((val: string | undefined) => setQuery({ search: val }), 1000),
    [setQuery]
  );

  const applyLocation = React.useCallback(
    debounce((val: string | undefined) => setQuery({ location: val }), 1000),
    [setQuery]
  );

  const applyMinSalary = React.useCallback(
    debounce(
      (val: string | undefined) => setQuery({ minSalary: val ? Number(val) : undefined }),
      1000
    ),
    [setQuery]
  );

  const applyMaxSalary = React.useCallback(
    debounce(
      (val: string | undefined) => setQuery({ maxSalary: val ? Number(val) : undefined }),
      1000
    ),
    [setQuery]
  );

  React.useEffect(() => {
    return () => {
      applySearch.cancel();
      applyLocation.cancel();
      applyMinSalary.cancel();
      applyMaxSalary.cancel();
    };
  }, [applySearch, applyLocation]);

  // keep local inputs in sync when query params change externally
  React.useEffect(() => {
    setSearchInput(query.search || '');
    setLocationInput(query.location || '');
    setMinSalaryInput(query.minSalary?.toString() || '');
    setMaxSalaryInput(query.maxSalary?.toString() || '');
  }, [query.search, query.location, query.minSalary, query.maxSalary]);

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2}>
        <TextField
          label="Search jobs"
          placeholder="Job title, company, or keywords"
          value={searchInput}
          onChange={(e) => {
            const v = e.target.value;
            setSearchInput(v);
            applySearch(v || undefined);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              applySearch.cancel();
              setQuery({ search: (e.target as HTMLInputElement).value || undefined });
            }
          }}
          fullWidth
          variant="outlined"
          InputProps={{
            sx: {
              borderRadius: 2,
              bgcolor: 'background.paper',
            },
          }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Job Type</InputLabel>
            <Select
              value={query.type || ''}
              label="Job Type"
              onChange={(e) => setQuery({ type: e.target.value || undefined })}
            >
              <MenuItem value="">All Types</MenuItem>
              {jobTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Location"
            placeholder="City, country, or remote"
            value={locationInput}
            onChange={(e) => {
              const v = e.target.value;
              setLocationInput(v);
              applyLocation(v || undefined);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyLocation.cancel();
                setQuery({ location: (e.target as HTMLInputElement).value || undefined });
              }
            }}
            fullWidth
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Min Salary"
            type="number"
            value={minSalaryInput}
            onChange={(e) => {
              const v = e.target.value;
              setMinSalaryInput(v);
              applyMinSalary(v || undefined);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyMinSalary.cancel();
                setQuery({
                  minSalary: (e.target as HTMLInputElement).value
                    ? Number((e.target as HTMLInputElement).value)
                    : undefined,
                });
              }
            }}
            fullWidth
          />

          <TextField
            label="Max Salary"
            type="number"
            value={maxSalaryInput}
            onChange={(e) => {
              const v = e.target.value;
              setMaxSalaryInput(v);
              applyMaxSalary(v || undefined);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyMaxSalary.cancel();
                setQuery({
                  maxSalary: (e.target as HTMLInputElement).value
                    ? Number((e.target as HTMLInputElement).value)
                    : undefined,
                });
              }
            }}
            fullWidth
          />
        </Stack>

        <Button variant="outlined" onClick={handleReset} sx={{ alignSelf: 'flex-start' }}>
          Reset Filters
        </Button>
      </Stack>
    </Paper>
  );
};
