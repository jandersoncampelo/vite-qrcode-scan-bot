import React, { useState } from 'react';
import {
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Grid,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardUrl from '../CardUrl';

interface ScanHistoryProps {
  showHistory: boolean;
  cloudStorageKeys: string[];
  enrichedValues: { [key: string]: { type: string; value: string } };
  removeKey: (key: string) => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({
  showHistory,
  cloudStorageKeys,
  enrichedValues,
  removeKey,
}) => {
  const [expandedPanels, setExpandedPanels] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.ChangeEvent<object>, isExpanded: boolean) => {
    setExpandedPanels(isExpanded ? panel : false);
  };

  const formattedDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString();
  }

  return (
    <Card>
      {showHistory && (
        <>
          {!cloudStorageKeys.length ? (
            <Typography variant="h5" align="center" className="mb-4 mt-4">
              Scan a QR code!
            </Typography>
          ) : (
            <div className="mt-4">
              {cloudStorageKeys.map((akey, index) => (
                <Accordion
                  key={index}
                  expanded={expandedPanels === akey}
                  onChange={handleChange(akey)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid container spacing={2}>
                      <Grid item xs={2} className="d-flex justify-start">
                        <Avatar style={{ backgroundColor: '#BDBDBD' }}>
                          <LinkIcon />
                        </Avatar>
                      </Grid>
                      <Grid item xs={10}>
                        <Typography variant="subtitle2" color="textSecondary">
                          {formattedDate(akey)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    {enrichedValues[akey] && 'type' in enrichedValues[akey] && (
                      <>
                        {enrichedValues[akey]['type'] === 'url' && (
                          <CardUrl data={enrichedValues[akey]} onRemoveKey={() => removeKey(akey)} />
                        )}
                      </>
                    )}
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