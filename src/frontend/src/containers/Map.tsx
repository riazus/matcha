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
        hexBinPointsData={data}
        hexBinMerge={true}
        width={700}
        height={700}
      />
    </Box>
  );
}

export default Map;
