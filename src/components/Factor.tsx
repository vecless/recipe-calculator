import * as React from 'react';
import { Form } from 'react-final-form';

import * as LocalData from '../utils';
import { Select, TextField, makeRequired, makeValidate } from 'mui-rff';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import * as Yup from 'yup';
import { ButtonGroup, Typography } from '@mui/material';

export interface FactorData {
    type?: string;
    subtype?: string;
    mL?: number;
    g?: number;
}

export const DEFAULT_FACTOR_DATA = {
    type: '',
    subtype: '',
    mL: 0,
    g: 0,
}

export interface FactorProps {
    customHand: (values: FactorData) => void;
    type?: string;
    subtype?: string;
    mL?: number;
    g?: number;
}

// Validation is not really used but this makes nice messages via `mui-rff` (i think...)
const schema = Yup.object({
    type: Yup.string().required(),
    subtype: Yup.string().required(),
    mL: Yup.number().required(),
    g: Yup.number().required(),
});

const Factor: React.FC<FactorProps> = ({ customHand, type = "", subtype = "", mL = 0, g = 0 }) => {
    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    return (
        <Form
            validate={validate}
            required={required}
            initialValues={{ type, subtype, mL, g }}
            onSubmit={(v) => { }}
            render={({ form, handleSubmit, submitting, pristine, values }) => {
                const hasType = (values.type != '');
                let idx: number = parseInt(values.type?.[1] ?? '');
                const isLiquid = hasType && (idx === 1) || (idx === 2);
                const isSolid = hasType && (idx === 3 || idx === 4);
                const isValid = hasType && (values.subtype != '') && (isLiquid ? values.mL > 0 : values.g > 0);

                return (<div>
                    <form onSubmit={handleSubmit}>
                        {/* TODO different formatting of warning text -- hint? color change? */}
                        {!pristine ? <Typography variant="body1">This formula has unsaved changes! <p /> </Typography> : <></>}

                        <Stack spacing={2}>
                            <Select
                                label="Type of Formula"
                                name="type"
                                required
                                data={LocalData.formulaTypes}
                                multiple={false}
                            />
                            <Select
                                label="Subtype"
                                name="subtype"
                                required
                                disabled={!hasType}
                                data={hasType ? LocalData.formulaSubtypes[idx] : LocalData.formulaSubtypes[0]}
                                multiple={false}
                            />
                            <TextField
                                label="Volume (mL)"
                                id="outlined-number"
                                name="mL"
                                type="number"
                                required={isLiquid}
                                disabled={!isLiquid}
                            />
                            <TextField
                                label="Mass (g)"
                                id="outlined-number"
                                name="g"
                                type="number"
                                required={isSolid}
                                disabled={!isSolid}
                            />
                        </Stack>
                    </form>

                    <Grid item style={{ marginTop: 16 }}>
                        <ButtonGroup variant="contained" color="primary" aria-label="Basic button group">
                            <Button
                                type="submit"
                                onClick={() => {
                                    form.reset(values);
                                    customHand(values);
                                }}
                                disabled={!isValid}>
                                Save
                            </Button>

                            <Button
                                onClick={form.reset}
                                disabled={submitting || pristine}>
                                Reset
                            </Button>
                        </ButtonGroup>
                    </Grid>

                </div>
                );
            }}
        />);
}

export default Factor;
