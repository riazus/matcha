import {
  Box,
  Modal,
  Typography,
  Button,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { styled } from "@mui/material/styles";
import { Filter as IFilter } from "../types/slices/currentUser";
import { applyFilter } from "../app/slices/currentUserSlice";
import { matchaColors } from "../styles/colors";

const StyledSlider = styled(Slider)(() => ({
  marginTop: 25,
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: -6,
    backgroundColor: matchaColors.yellow,
    color: "black",
    "&::before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: "black",
    },
  },
}));

function Filter() {
  const { filter } = useAppSelector((root) => root.user);
  const { user } = useAppSelector((root) => root.user);
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newFilter, setNewFilter] = useState<IFilter>(filter!);

  const handleAgeFilterChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number" || newValue[0] > newValue[1]) return;

    setNewFilter((prev) => ({
      ...prev,
      minAge: newValue[0],
      maxAge: newValue[1],
    }));
  };

  const handleDistanceFilterChange = (
    _: Event,
    newValue: number | number[]
  ) => {
    if (typeof newValue === "number" || newValue[0] > newValue[1]) return;

    setNewFilter((prev) => ({
      ...prev,
      minDistance: newValue[0],
      maxDistance: newValue[1],
    }));
  };

  const handleTagsChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number" || newValue[0] > newValue[1]) return;

    setNewFilter((prev) => ({
      ...prev,
      minTagMatch: newValue[0],
      maxTagMatch: newValue[1],
    }));
  };

  const handleOrderByChange = (event: SelectChangeEvent) => {
    setNewFilter((prev) => ({
      ...prev,
      orderByField: event.target.value as string,
    }));
  };

  const handleOrderByAscClick = () =>
    setNewFilter((prev) => ({
      ...prev,
      orderByAsc: !prev.orderByAsc,
    }));

  const distanceValueLabelFormat = (value: number) => `${value} km`;

  const handleModalClose = () => {
    if (true) {
      dispatch(applyFilter(newFilter));
    }

    setIsOpenModal(false);
  };

  if (!filter) {
    return <Typography>Error while rendering filter</Typography>;
  }

  return (
    <Box>
      <Button
        onClick={() => setIsOpenModal(!isOpenModal)}
        sx={styles.openFilterButton}
      >
        Filters
      </Button>
      <Modal open={isOpenModal} onClose={handleModalClose}>
        <Box sx={styles.boxModal}>
          <Typography>Filter age:</Typography>
          <StyledSlider
            getAriaLabel={() => "Age filter range"}
            value={[newFilter.minAge, newFilter.maxAge]}
            onChange={handleAgeFilterChange}
            valueLabelDisplay="on"
            min={18}
          ></StyledSlider>
          {user?.longitude && user?.latitude && (
            <>
              <Typography>Distance filter:</Typography>
              <StyledSlider
                getAriaLabel={() => "Distance filter range"}
                value={[newFilter.minDistance!, newFilter.maxDistance!]}
                onChange={handleDistanceFilterChange}
                valueLabelDisplay="on"
                valueLabelFormat={distanceValueLabelFormat}
                max={13588}
              ></StyledSlider>
            </>
          )}
          <Typography>How much common interests:</Typography>
          <StyledSlider
            getAriaLabel={() => "Matched tags range"}
            value={[newFilter.minTagMatch, newFilter.maxTagMatch]}
            onChange={handleTagsChange}
            max={user?.tags.length}
            valueLabelDisplay="on"
          ></StyledSlider>
          <Box
            sx={{
              minWidth: 120,
              paddingBottom: "10px",
            }}
          >
            <InputLabel>Order by</InputLabel>
            <Select
              label="Order by"
              value={newFilter.orderByField}
              onChange={handleOrderByChange}
            >
              <MenuItem value={"Age"}>Age</MenuItem>
              {user?.latitude && user?.longitude && (
                <MenuItem value={"Distance"}>Distance</MenuItem>
              )}
              <MenuItem value={"Tags"}>Common tags</MenuItem>
            </Select>
            <IconButton onClick={handleOrderByAscClick}>
              {newFilter.orderByAsc ? <NorthIcon /> : <SouthIcon />}
            </IconButton>
          </Box>
          <Button onClick={handleModalClose} sx={styles.applyButton}>
            Apply
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

// TODO
const styles = {
  openFilterButton: {
    color: "black",
    backgroundColor: "rgb(55, 78, 168)",
    ":hover": {
      backgroundColor: "rgb(60, 64, 113)",
    },
  },
  boxModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
  applyButton: {
    color: "black",
    backgroundColor: matchaColors.yellow,
    ":hover": {
      backgroundColor: matchaColors.yellowlight,
    },
  },
};

export default Filter;
