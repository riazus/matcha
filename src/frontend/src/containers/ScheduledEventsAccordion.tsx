import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useGetScheduledEventsQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import dayjs from "dayjs";

interface ScheduledEventsAccordionProps {
  profileId: string;
}

function ScheduledEventsAccordion({
  profileId,
}: ScheduledEventsAccordionProps) {
  const { data, isLoading, isSuccess } = useGetScheduledEventsQuery(profileId);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Scheduled Events
      </AccordionSummary>
      <AccordionDetails>
        {isLoading ? (
          <FullScreenLoader />
        ) : isSuccess ? (
          data.map((el, i) => (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {el.eventName} | {dayjs(el.eventDate).format("LLL")}
              </AccordionSummary>
              <AccordionDetails>{el.description}</AccordionDetails>
            </Accordion>
          ))
        ) : (
          <></>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default ScheduledEventsAccordion;
