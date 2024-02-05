import { Box } from "@mui/material";
import Globe from "react-globe.gl";

function Map() {
  return (
    <Box>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        width={1100}
        height={700}
      />
    </Box>
  );
}

export default Map;
