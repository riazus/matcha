import { LoadingButton } from "@mui/lab";
import { Modal, Box, FormControl, Input, InputLabel } from "@mui/material";
import { useCreateScheduledEventMutation } from "../app/api/api";
import { ChangeEvent, useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";

interface CreateEventModalProps {
  profileId: string;
  modalOpen: boolean;
  handleClose: () => void;
}

function CreateEventModal({
  modalOpen,
  handleClose,
  profileId,
}: CreateEventModalProps) {
  const [createEvent, { isLoading, isSuccess }] =
    useCreateScheduledEventMutation();
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      toast.success("Scheduled Event created successfully");
    }
  }, [isSuccess, handleClose]);

  const handleEventNameChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.target.value.length < 20) {
      setEventName(e.target.value);
    }
  };

  const handleDescriptionChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.target.value.length < 50) {
      setDescription(e.target.value);
    }
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (eventName.length === 0 || description.length === 0 || !eventDate) {
      toast.error("You need fill all inputs");
      return;
    }

    createEvent({
      eventName,
      description,
      receiverId: profileId,
      eventDate: eventDate!.toISOString(),
    });
  };

  return (
    <Modal open={modalOpen} onClose={handleClose}>
      <Box component="form" onSubmit={onSubmitForm} sx={styles.boxModal}>
        <FormControl>
          <InputLabel htmlFor="eventName">Event Name</InputLabel>
          <Input
            id="eventName"
            type="text"
            onChange={handleEventNameChange}
            value={eventName}
          />
        </FormControl>

        <FormControl sx={{ my: 2 }}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <Input
            id="description"
            type="text"
            onChange={handleDescriptionChange}
            value={description}
          />
        </FormControl>

        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={styles.datePicker}
              value={eventDate}
              onChange={(newDate) => setEventDate(newDate)}
              minDate={dayjs()}
              defaultValue={dayjs()}
            />
          </LocalizationProvider>
        </Box>

        <LoadingButton type="submit" loading={isLoading} sx={{ my: 1 }}>
          Create Event
        </LoadingButton>
      </Box>
    </Modal>
  );
}

const styles = {
  boxModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    py: 3,
    px: 6,
  },
  datePicker: {
    width: "40%",
    minWidth: "230px",
  },
};

export default CreateEventModal;
