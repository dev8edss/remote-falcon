import { useState, useEffect, useCallback } from 'react';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Box, Grid, TableRow, TableCell, TableContainer, Table, TableHead, TableBody, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

import { fetchWorkItemsService } from 'services/controlPanel/tracker.service';
import { useDispatch, useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import TrackerSkeleton from 'ui-component/cards/Skeleton/TrackerSkeleton';
import { showAlert, mixpanelTrack } from 'views/pages/globalPageHelpers';

import NewWorkItem from './NewWorkItem';
import TrackerRow from './TrackerRow';

const Tracker = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { coreInfo } = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(0);
  const [workItems, setWorkItems] = useState([]);
  const [newWorkItemDrawerOpen, setNewWorkItemDrawerOpen] = useState(false);

  const fetchWorkItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const workItemsResponse = await fetchWorkItemsService();
      const workItems = workItemsResponse.data;
      setWorkItems(workItems);
    } catch (err) {
      showAlert({ dispatch, alert: 'error' });
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      mixpanelTrack('Tracker Page View', coreInfo);
      await fetchWorkItems();
      setIsLoading(false);
    };

    init();
  }, [dispatch, fetchWorkItems, coreInfo]);

  const handleNewWorkItemDrawer = () => {
    setNewWorkItemDrawerOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Work Item Tracker" content={false}>
            {isLoading ? (
              <TrackerSkeleton />
            ) : (
              <TableContainer>
                <Table size="small" aria-label="collapsible table">
                  <TableHead sx={{ '& th,& td': { whiteSpace: 'nowrap' } }}>
                    <TableRow>
                      <TableCell sx={{ pl: 3 }}>
                        <Tooltip placement="top" title="Add Work Item">
                          <IconButton
                            color="primary"
                            sx={{
                              color: theme.palette.green.dark,
                              borderColor: theme.palette.green.main
                            }}
                            size="small"
                            onClick={handleNewWorkItemDrawer}
                          >
                            <AddTwoToneIcon sx={{ fontSize: '1.5rem' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell sx={{ pl: 3 }}>Type</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell sx={{ pl: 3 }}>State</TableCell>
                      <TableCell sx={{ pl: 3 }}>Severity</TableCell>
                      <TableCell>Comments</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <>
                      {_.map(workItems, (workItem) => (
                        <TrackerRow workItem={workItem} coreInfo={coreInfo} setIsLoading={setIsLoading} fetchWorkItems={fetchWorkItems} />
                      ))}
                    </>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </MainCard>
        </Grid>
      </Grid>
      <NewWorkItem
        coreInfo={coreInfo}
        newWorkItemDrawerOpen={newWorkItemDrawerOpen}
        handleNewWorkItemDrawer={handleNewWorkItemDrawer}
        setIsLoading={setIsLoading}
        fetchWorkItems={fetchWorkItems}
      />
    </Box>
  );
};

export default Tracker;