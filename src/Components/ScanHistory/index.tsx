import React, { useState } from "react";
import {
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CardUrl from "../CardUrl";
import { EnrichedValues } from "../../App";

interface ScanHistoryProps {
  showHistory: boolean;
  enrichedValues: EnrichedValues[];
  removeKey: (key: string) => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({
  showHistory,
  enrichedValues,
  removeKey,
}) => {
  const [expandedPanels, setExpandedPanels] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_: React.ChangeEvent<object>, isExpanded: boolean) => {
      setExpandedPanels(isExpanded ? panel : false);
    };

  const formattedDate = (data: EnrichedValues) => {
    const key = Object.keys(data)[0];
    console.log(key);
    const date = new Date(key);
    return date.toLocaleString();
  };

  const limitLength = (data: EnrichedValues) => {
    const maxLength = 35;
    const value = Object.values(data)[0].info;
    return value.length > maxLength
      ? `${value.substring(0, maxLength)}...`
      : value;
  };

  return (
    <Card>
      {showHistory && (
        <>
          {!enrichedValues.length ? (
            <Typography variant="h5" align="center" className="mb-4 mt-4">
              Scan a QR code!
            </Typography>
          ) : (
            <div className="mt-4">
              {enrichedValues.map((data, index) => (
                <Accordion
                  key={index}
                  expanded={expandedPanels === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Avatar
                      sx={{ flexShrink: 0 }}
                      style={{ backgroundColor: "#BDBDBD" }}
                    >
                      <LinkIcon />
                    </Avatar>

                    <Typography>
                      <Typography variant="h6">{limitLength(data)}</Typography>
                      <Typography variant="body2">
                        {formattedDate(data)}
                      </Typography>
                    </Typography>
                  </AccordionSummary>
                    <AccordionDetails>
                    <CardUrl
                      value={Object.values(data)[0].info}
                      onRemoveKey={() => removeKey(Object.keys(data)[0])}
                    />
                    </AccordionDetails>
                </Accordion>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default ScanHistory;
