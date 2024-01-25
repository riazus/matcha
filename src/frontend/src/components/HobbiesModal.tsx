import { Box, Grid, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import React, { forwardRef, ForwardedRef } from "react";
import { matchaColors } from "../styles/colors";

const tagsData = [
  "food",
  "science",
  "intello",
  "coding",
  "dodo",
  "bio",
  "geek",
  "vegan",
  "artiste",
  "meditation",
  "paresse",
  "fitness",
  "aventure",
  "timide",
  "marketing",
  "fastfood",
  "intelligence",
  "humour",
  "cool",
  "highTech",
  "globetrotting",
  "histoire",
  "shopping",
  "nature",
  "sport",
  "football",
  "literature",
  "math",
  "action",
  "faitsDivers",
  "decouverte",
  "cinema",
  "musique",
  "actualite",
  "politique",
  "social",
  "etudes",
  "cuisine",
  "humanitaire",
  "animaux",
  "environnement",
  "jeuxVideo",
  "peinture",
  "dessin",
  "ecriture",
  "lecture",
  "photographie",
  "chasse",
  "randonnee",
  "marche",
  "plage",
  "detente",
  "automobile",
  "couture",
  "innovation",
  "terroir",
  "informatique",
  "marathon",
  "blogging",
];

interface HobbiesModalProps {
  tags: string[] | null;
  setTags: React.Dispatch<React.SetStateAction<string[] | null>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const HobbiesModal = forwardRef(
  (
    { tags, setTags, setOpenModal }: HobbiesModalProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const handleTag = (tag: string) => {
      if (tags?.find((x: string) => x === tag) !== undefined) {
        const nTags = tags?.filter((oneTag: string) => oneTag !== tag);
        setTags(nTags);
      } else {
        if (tags && tags.length === 8) {
          toast.error("You have too many hobbies, you can only choose 8");
          return;
        }
        setTags((prevTags: string[] | null | undefined) =>
          prevTags ? [...prevTags, tag] : [tag]
        );
      }
    };

    return (
      <Box ref={ref} sx={styles.boxModal}>
        <Typography variant="h1" sx={styles.interrestsText}>
          Interrests :
        </Typography>
        <Grid container spacing={2}>
          {tagsData.map((tag) => (
            <Grid key={tag} item xs={10} sm={4}>
              <Button
                onClick={() => handleTag(tag)}
                color="secondary"
                variant={
                  tags && tags.includes(tag) === true ? "contained" : "outlined"
                }
              >
                {tag}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Button
          onClick={() => setTags([])}
          sx={styles.interrestsFinishedButton}
        >
          Clear all
        </Button>
        <Button
          onClick={() => setOpenModal(false)}
          sx={styles.interrestsFinishedButton}
        >
          Finished
        </Button>
      </Box>
    );
  }
);

const styles = {
  boxModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "60%",
    height: "70vh",
    minWidth: "320px",
    bgcolor: "rgb(255, 255, 255, 0.9)",
    boxShadow: 24,
    p: 4,
    overflowY: "scroll",
    borderRadius: "10px",
    "@media (max-width: 600px)": {
      width: "90vw",
    },
    "@media (min-width: 601px) and (max-width: 960px)": {
      width: "80vw",
    },
  },
  interrestsText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "2%",
  },
  interrestsFinishedButton: {
    marginTop: "3%",
  },
  interrestsBox: {
    backgroundColor: "rgb(253, 255, 252)",
    display: "flex",
    alignItems: "baseline",
    flexDirection: "column",
    padding: "1%",
  },
  interrestsButton: {
    margin: "1%",
    borderRadius: "20px",
    backgroundColor: matchaColors.yellow,
    color: "white",
    borderColor: "black",
    cursor: "default",
    ":hover": {
      backgroundColor: matchaColors.yellowlight,
      borderColor: "black",
    },
  },
};

export default HobbiesModal;
