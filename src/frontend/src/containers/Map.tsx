import { Box, Typography } from "@mui/material";
import Globe from "react-globe.gl";
import { useGetAccountsCoordQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";

function Map() {
  const { data, isLoading, isError } = useGetAccountsCoordQuery();

  if (isLoading) {
    return <FullScreenLoader />;
  } else if (isError) {
    return <Typography>Error occured while fetching data</Typography>;
  }

  return (
    <Box>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        width={1100}
        height={700}
        hexBinPointsData={data}
        hexBinMerge={true}
      />
    </Box>
  );
}

export default Map;
