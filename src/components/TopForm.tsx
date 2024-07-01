import * as React from 'react';
import { Form } from 'react-final-form';

import { TextField, makeRequired, makeValidate } from 'mui-rff';
import Stack from '@mui/material/Stack';

import * as Yup from 'yup';
import AutoSave from './AutoSave';

export interface TopFormData {
    water: number;
}

export interface TopFormProps {
    guidingHand: (values: TopFormData) => void;
    water: number;
}

const schema = Yup.object({
    water: Yup.number().required(),
});

const TopForm: React.FC<TopFormProps> = ({ guidingHand, water }) => {
    const validate = makeValidate(schema);
    const required = makeRequired(schema);

    return (
        <Form
            validate={validate}
            required={required}
            initialValues={{ water }}
            onSubmit={(_v) => { }}
            render={({ handleSubmit }) => {
                const handleSave = async (values: TopFormData): Promise<void> => {
                    guidingHand(values);
                    return Promise.resolve();
                };

                const saveIf = (values: TopFormData): boolean => {
                    return values.water >= 0;
                };

                return (
                    <div>
                        {/* autosave on a 250ms debounce when `saveIf` */}
                        <AutoSave onSave={handleSave} saveCv={saveIf} debouncePeriod={250} />

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={1}>
                                <TextField
                                    label="Water (mL)"
                                    id="outlined-number"
                                    name="water"
                                    type="number"
                                />
                            </Stack>
                        </form>
                    </div>
                );
            }}
        />);
}

export default TopForm;
