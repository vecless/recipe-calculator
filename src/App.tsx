import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { Box, Button, ButtonGroup, Container, IconButton, Tooltip } from '@mui/material';
import Blender from '@mui/icons-material/Blender'
import { HorizontalRule, InfoRounded, ReportProblemRounded, UploadFileRounded } from '@mui/icons-material';

import * as LocalData from './utils';
import RoundedBox from './components/RoundedBox';
import Factor, { DEFAULT_FACTOR_DATA, FactorData } from './components/Factor';
import { DataGrid } from '@mui/x-data-grid';
import { DATAGRIDCOLS, generateGridRowsProp } from './generateDataGrid';

/**
 * App Activity Region Props
 */
interface AARProps {
  initialValues?: LocalData.FormSelections;
}

/**
 * AppActivityRegion
 * 
 * This encompasses most of the meaningful elements of the screen
 * That is, it doesn't handle top-bar navigation. That's pretty much it.
 */
class AppActivityRegion extends React.Component<AARProps, {
  // The number of formula entries that are possibly-valid
  plausibleEntries: number,
  // The `Factor` (Form-type) components used for data input
  factorForms: JSX.Element[],
  // The last valid submission from each child form, for each child form
  lastSubmission: FactorData[],
}> {
  private childFormHandler = (formKey: number) => {
    return (values: FactorData) => {
      this.state.lastSubmission[formKey] = values;
      console.log(this.state.lastSubmission);

      // This handles updating other panels; it's pretty stupid but hey if it works it works.
      this.forceUpdate();
    };
  }

  private newEntryPanel = (index: number): JSX.Element => {
    return <Factor key={index} customHand={this.childFormHandler(index)} />;
  }

  constructor(props: AARProps) {
    super(props);

    // This is the most logical initial state.
    this.state = {
      plausibleEntries: 1,
      factorForms: [this.newEntryPanel(0)],
      lastSubmission: [DEFAULT_FACTOR_DATA],
    };
  }

  /**
   * Adds another formula to the entry panel.
   * This is the callback of the "Add" button in the current implementation of the interface.
   */
  incrementFormulaCt() {
    // Update relevant state
    // The max index is used as the key for the new entry panel, this makes naive logic simpler.
    this.state.factorForms.push(this.newEntryPanel(this.state.plausibleEntries));
    this.state.lastSubmission.push(DEFAULT_FACTOR_DATA);
    // Then, we can finally update plausible entry count
    this.setState({ plausibleEntries: (this.state.plausibleEntries + 1) });
  }

  /**
   * Removes the last added formula from the entry panel.
   * This is the callback of the "Subtract" button in the current implementation of the interface.
   */
  decrementFormulaCt() {
    // Sanity check -- we never want to remove our first entry.
    if (this.state.plausibleEntries <= 1) return;

    // Update relevant state
    this.state.factorForms.pop();
    this.state.lastSubmission.pop();
    this.setState({ plausibleEntries: (this.state.plausibleEntries - 1) });
  }

  private renderFormRegion() {
    let ret: JSX.Element[] = [];

    for (let n = 0; n < this.state.plausibleEntries; ++n) {
      ret.push(
        <>
          <Typography variant="h4"> Formula {n + 1}  </Typography>
          <HorizontalRule />
          {this.state.factorForms[n]}
          {(n + 1 === this.state.plausibleEntries) ? <p /> : <HorizontalRule />}
        </>
      );
    }

    return ret;
  }

  private renderSidebarRegion() {
    let ret: JSX.Element[] = [];
    ret.push(<Typography variant="h4">Summary</Typography>);
    ret.push(<HorizontalRule />);
    ret.push(
      <div style={{ height: 'fit-content', overflow: "auto" }}>
        <DataGrid rows={generateGridRowsProp(this.state.lastSubmission)} columns={DATAGRIDCOLS} autoHeight hideFooter />
      </div>
    );
    ret.push(<p />);
    ret.push(<Typography variant="h4">Written summary</Typography>);
    ret.push(<HorizontalRule />);
    ret.push(<RoundedBox> {JSON.stringify(this.state.lastSubmission)} </RoundedBox>);
    return ret;
  }

  private renderTopRegion() {
    return (<div>
    </div>);
  }

  render() {
    return (<div>
      <ButtonGroup variant="contained" color="secondary" aria-label="Basic button group">
        <Tooltip title="Add another formula">
          <Button onClick={() => { this.incrementFormulaCt() }}>Add</Button>
        </Tooltip>

        <Tooltip title="Remove a formula">
          <Button onClick={() => { this.decrementFormulaCt() }}>Subtract</Button>
        </Tooltip>
      </ButtonGroup>
      <p></p>

      <Box sx={{ display: 'grid', gridAutoFlow: 'dense', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1' }}>
        {/* lol this is so fragile */}
        <RoundedBox sx={{ gridColumn: 'span 3', gridRow: '1' }}> {this.renderTopRegion()} </RoundedBox>
        <RoundedBox sx={{ gridColumn: '1', gridRow: '2 / 3', maxWidth: '67vw' }}> {this.renderFormRegion()} </RoundedBox>
        <RoundedBox sx={{ gridColumn: '2', gridRow: '2 / 3', maxWidth: '50vw' }}> {this.renderSidebarRegion()} </RoundedBox>
      </Box>
    </div>);
  }
}

/**
 * This defines the main application component.
 * 
 * @returns application component.
 */
export default function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Blender icon" disableRipple>
            <Blender />
          </IconButton>
          <Typography variant="h3" className="title" noWrap>
            Renal Formula Calculator
          </Typography>

          <div style={{ marginLeft: 'auto', marginRight: 0 }}>
            <Tooltip title="Import/Export">
              <IconButton color="inherit" aria-label="Simple icon button"> <UploadFileRounded /> </IconButton>
            </Tooltip>
            <Tooltip title="Report a problem">
              <IconButton color="inherit" aria-label="Simple icon button"> <ReportProblemRounded /> </IconButton>
            </Tooltip>
            <Tooltip title="About this site">
              <IconButton color="inherit" aria-label="Simple icon button"> <InfoRounded /> </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false}>
        <p />
        <AppActivityRegion />

      </Container>
    </div>
  );
}
