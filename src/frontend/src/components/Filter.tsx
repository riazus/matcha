import { Box, Modal, Typography, Button, Slider } from "@mui/material";
import { Filter as IFilter, applyFilter } from "../app/slices/filter";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { styled } from "@mui/material/styles";

const StyledSlider = styled(Slider)(() => ({
  marginTop: 25,
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: -6,
    backgroundColor: "yellow",
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
  const filter = useAppSelector((root) => root.filter);
  const { user } = useAppSelector((root) => root.user);
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newFilter, setNewFilter] = useState<IFilter>(filter);

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

  const distanceValueLabelFormat = (value: number) => `${value} km`;

  const handleModalClose = () => {
    if (true) {
      dispatch(applyFilter(newFilter));
    }

    setIsOpenModal(false);
  };

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
                value={[newFilter.minDistance, newFilter.maxDistance]}
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
    backgroundColor: "rgb(55, 78, 168)",
    ":hover": {
      backgroundColor: "rgb(60, 64, 113)",
    },
  },
};

export default Filter;
