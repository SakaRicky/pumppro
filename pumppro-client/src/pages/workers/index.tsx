/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Grid, Modal, useTheme } from "@mui/material";
import { useNotify } from "hooks/useNotify";
import React, { useState } from "react";
import { deleteUser } from "services/users";
import { User } from "types";
import WorkerCard from "features/workers/components/WorkerCard";
import AddIcon from "@mui/icons-material/Add";
import withAuth from "hoc/withAuth";
import WorkerForm from "features/workers/components/WorkerForm";
import WorkerInfoPage from "features/workers/components/WorkerInfoPage";
import { useUsers } from "features/workers/hooks/useUser";
import WorkerSalary from "features/workers/components/WorkerSalary";

const Workers = () => {
  const theme = useTheme();

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useUsers();
  // const [workerToEdit, setWorkerToEdit] = useState<User>();
  // const [workerToView, setWorkerToView] = useState<User>();

  const [selectedUser, setSelectedUser] = useState<User>();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const [salaryModal, setSalaryModal] = React.useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(undefined);
    setInfoModalOpen(false);
    setSalaryModal(false);
    refetchUsers();
  };

  const handleEditWorker = (worker: User) => {
    setSelectedUser(worker);
    setModalOpen(true);
  };

  const handleViewWorkerSalary = (worker: User) => {
    setSalaryModal(true);
    setSelectedUser(worker);
  };

  const handleViewWorkerInfo = (worker: User) => {
    setSelectedUser(worker);
    setInfoModalOpen(true);
  };

  const handleDeleteWorker = async (workerId: string) => {
    try {
      await deleteUser(workerId);
      notify("Delete Success", "User deleted successfully", "success");
      refetchUsers();
    } catch (error: any) {
      notify("Login Error", error.message, "error");
    }
  };

  const notify = useNotify();

  return (
    <Box p="2rem">
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="Worker Form"
        aria-describedby="Form used to add or edit worker"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <>
          <WorkerForm
            worker={selectedUser}
            handleCloseModal={handleCloseModal}
          />
        </>
      </Modal>
      <Modal
        open={infoModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="Worker Info Page"
        aria-describedby="Page to view worker Info"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <>
          <WorkerInfoPage worker={selectedUser} />
        </>
      </Modal>
      <Modal
        open={salaryModal}
        onClose={handleCloseModal}
        aria-labelledby="Worker Form"
        aria-describedby="Form used to add or edit worker"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <>
          <WorkerSalary worker={selectedUser} />
        </>
      </Modal>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          endIcon={<AddIcon />}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.grey[50],

            "&:hover": {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
          onClick={() => setModalOpen(true)}
        >
          Add Worker
        </Button>
      </Box>
      <Box mt="2rem">
        <Grid
          container
          spacing={{ xs: 0, sm: 2, md: 3 }}
          rowSpacing={4}
          columns={12}
        >
          {users?.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <WorkerCard
                worker={user}
                handleEditWorker={handleEditWorker}
                handleDeleteWorker={handleDeleteWorker}
                handleViewWorkerInfo={handleViewWorkerInfo}
                handleViewWorkerSalary={handleViewWorkerSalary}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default withAuth(Workers);
